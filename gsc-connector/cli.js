#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const {
  getAuthorizedSearchConsoleClient,
  fetchSearchConsoleSnapshot,
  getPerformanceDateRange,
  TOKEN_PATH,
  GSC_SITE_URL,
  getDefaultSitemapUrl,
  inspectUrl,
  submitSitemap,
} = require("./lib/gsc");

const PROJECT_ROOT = path.join(__dirname, "..");
const DEFAULTS = {
  ctrThreshold: 0.02,
  minImpressions: 100,
  minPosition: 3,
  maxPosition: 15,
  rowLimit: 250,
  queryLimit: 5,
};

function pct(value) {
  return `${(value * 100).toFixed(2)}%`;
}

function num(value) {
  return new Intl.NumberFormat("en-US").format(value);
}

function fixed(value) {
  return Number(value).toFixed(1);
}

function shortenUrl(url) {
  return url.replace(/^https?:\/\/[^/]+/, "") || "/";
}

function pageTypeFromPathname(pathname) {
  if (pathname === "/") {
    return "hub";
  }

  if (pathname.startsWith("/blog/")) {
    return "blog";
  }

  if (pathname.startsWith("/tours/")) {
    return "tour";
  }

  return "page";
}

function actionType(page) {
  if (page.position <= 8 && page.ctr < DEFAULTS.ctrThreshold) {
    return "ctr_rewrite";
  }

  if (page.type === "hub") {
    return "internal_link_support";
  }

  if (page.type === "tour") {
    return "ctr_rewrite+intent_rewrite";
  }

  return "intent_rewrite+internal_link_support";
}

function priorityLabel(index) {
  if (index === 0) {
    return "highest";
  }

  if (index < 3) {
    return "high";
  }

  if (index < 6) {
    return "medium";
  }

  return "watch";
}

function parseArgs(argv) {
  const options = {
    command: "report",
    format: "text",
    value: null,
    lookbackDays: 28,
  };

  const args = [...argv];

  if (args[0] === "inspect") {
    options.command = "inspect";
    options.value = args[1] || null;
    args.splice(0, 2);
  } else if (args[0] === "submit-sitemap") {
    options.command = "submit-sitemap";
    options.value = args[1] || null;
    args.splice(0, 2);
  }

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];

    if (arg === "--format" && args[i + 1]) {
      options.format = args[i + 1];
      i += 1;
    } else if (arg === "--days" && args[i + 1]) {
      const n = Number.parseInt(args[i + 1], 10);
      if (Number.isFinite(n) && n > 0 && n <= 16 * 30) {
        options.lookbackDays = n;
      }
      i += 1;
    }
  }

  return options;
}

function getLocalPathFromUrl(url) {
  const pathname = new URL(url).pathname;
  const localPath = pathname === "/" ? "index.html" : pathname.replace(/^\//, "");
  return path.join(PROJECT_ROOT, localPath);
}

function extractTag(html, pattern) {
  const match = html.match(pattern);
  return match ? match[1].trim() : "";
}

function extractMetaDescription(html) {
  const patterns = [
    /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i,
  ];

  for (const pattern of patterns) {
    const value = extractTag(html, pattern);

    if (value) {
      return value;
    }
  }

  return "";
}

function getPageMetadata(url) {
  const pathname = new URL(url).pathname;
  const filePath = getLocalPathFromUrl(url);

  if (!fs.existsSync(filePath)) {
    return {
      pathname,
      filePath,
      title: "",
      description: "",
      type: pageTypeFromPathname(pathname),
    };
  }

  const html = fs.readFileSync(filePath, "utf8");

  return {
    pathname,
    filePath,
    title: extractTag(html, /<title>([^<]+)<\/title>/i),
    description: extractMetaDescription(html),
    type: pageTypeFromPathname(pathname),
  };
}

async function fetchOpportunityPages(searchconsole, dateRange) {
  const response = await searchconsole.searchanalytics.query({
    siteUrl: GSC_SITE_URL,
    requestBody: {
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      dimensions: ["page"],
      rowLimit: DEFAULTS.rowLimit,
      startRow: 0,
    },
  });

  return (response.data.rows || [])
    .map((row) => ({
      page: row.keys?.[0] || "",
      clicks: row.clicks || 0,
      impressions: row.impressions || 0,
      ctr: row.ctr || 0,
      position: row.position || 0,
    }))
    .filter((row) => row.impressions >= DEFAULTS.minImpressions)
    .filter((row) => row.position >= DEFAULTS.minPosition && row.position <= DEFAULTS.maxPosition)
    .filter((row) => row.ctr < DEFAULTS.ctrThreshold)
    .sort((a, b) => {
      if (b.impressions !== a.impressions) {
        return b.impressions - a.impressions;
      }

      return a.position - b.position;
    });
}

async function fetchTopQueriesForPage(searchconsole, pageUrl, dateRange) {
  const response = await searchconsole.searchanalytics.query({
    siteUrl: GSC_SITE_URL,
    requestBody: {
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      dimensions: ["query"],
      rowLimit: DEFAULTS.queryLimit,
      dimensionFilterGroups: [
        {
          filters: [
            {
              dimension: "page",
              operator: "equals",
              expression: pageUrl,
            },
          ],
        },
      ],
    },
  });

  return (response.data.rows || []).map((row) => ({
    query: row.keys?.[0] || "",
    clicks: row.clicks || 0,
    impressions: row.impressions || 0,
    ctr: row.ctr || 0,
    position: row.position || 0,
  }));
}

async function buildOptimizationQueue(searchconsole, dateRange) {
  const pages = await fetchOpportunityPages(searchconsole, dateRange);

  return Promise.all(
    pages.map(async (page, index) => {
      const metadata = getPageMetadata(page.page);
      const topQueries = await fetchTopQueriesForPage(searchconsole, page.page, dateRange);

      return {
        ...page,
        ...metadata,
        priority: priorityLabel(index),
        action: actionType({ ...page, type: metadata.type }),
        topQueries,
      };
    })
  );
}

function printSection(title, rows, formatter) {
  console.log(`\n${title}`);

  if (!rows.length) {
    console.log("  none");
    return;
  }

  rows.forEach((row, index) => {
    console.log(`  ${index + 1}. ${formatter(row)}`);
  });
}

function printQueueText(queue) {
  console.log("\nPriority queue");

  if (!queue.length) {
    console.log("  none");
    return;
  }

  queue.forEach((item, index) => {
    const queries = item.topQueries.map((query) => query.query).join(", ") || "none";
    console.log(
      `  ${index + 1}. ${item.pathname} | ${item.type} | ${item.priority} | ${num(item.impressions)} impressions | ${pct(item.ctr)} CTR | pos ${fixed(item.position)} | ${item.action}`
    );
    console.log(`     title: ${item.title || "n/a"}`);
    console.log(`     meta: ${item.description || "n/a"}`);
    console.log(`     queries: ${queries}`);
  });
}

function printQueueMarkdown(queue, body) {
  console.log(`# GSC Opportunity Queue`);
  console.log("");
  console.log(`- Property: ${body.property}`);
  console.log(`- Access: ${body.access.permissionLevel}`);
  console.log(`- Date range: ${body.dateRange.startDate} to ${body.dateRange.endDate}`);
  console.log(`- Filters: impressions >= ${DEFAULTS.minImpressions}, position ${DEFAULTS.minPosition}-${DEFAULTS.maxPosition}, CTR < ${pct(DEFAULTS.ctrThreshold)}`);
  console.log("");
  console.log("| Priority | Page | Type | Clicks | Impr. | CTR | Pos | Action | Top queries |");
  console.log("| --- | --- | --- | ---: | ---: | ---: | ---: | --- | --- |");

  queue.forEach((item) => {
    const queries = item.topQueries.map((query) => query.query).join(", ");
    console.log(`| ${item.priority} | ${item.pathname} | ${item.type} | ${item.clicks} | ${item.impressions} | ${pct(item.ctr)} | ${fixed(item.position)} | ${item.action} | ${queries} |`);
  });
}

function printInspectionResult(data) {
  const result = data.inspectionResult || {};
  const indexResult = result.indexStatusResult || {};
  const ampResult = result.ampResult || {};
  const richResults = result.richResultsResult || {};

  console.log(`Inspection URL: ${result.inspectionResultLink || "n/a"}`);
  console.log(`Coverage state: ${indexResult.coverageState || "n/a"}`);
  console.log(`Indexing state: ${indexResult.indexingState || "n/a"}`);
  console.log(`Last crawl: ${indexResult.lastCrawlTime || "n/a"}`);
  console.log(`Page fetch: ${indexResult.pageFetchState || "n/a"}`);
  console.log(`Robots.txt: ${indexResult.robotsTxtState || "n/a"}`);
  console.log(`Canonical (Google): ${indexResult.googleCanonical || "n/a"}`);
  console.log(`Canonical (user): ${indexResult.userCanonical || "n/a"}`);
  console.log(`Referring sitemaps: ${(indexResult.referringUrls || []).join(", ") || "none"}`);
  console.log(`AMP: ${ampResult.ampIndexStatusVerdict || "n/a"}`);
  console.log(`Rich results: ${richResults.verdict || "n/a"}`);
}

async function runReport(searchconsole, format, lookbackDays) {
  const dateRange = getPerformanceDateRange(lookbackDays);
  const snapshot = await fetchSearchConsoleSnapshot(searchconsole, { lookbackDays });

  if (snapshot.status !== 200) {
    console.error(JSON.stringify(snapshot.body, null, 2));
    process.exit(1);
  }

  const { body } = snapshot;
  const queue = await buildOptimizationQueue(searchconsole, dateRange);

  if (format === "json") {
    console.log(
      JSON.stringify(
        {
          property: body.property,
          access: body.access.permissionLevel,
          dateRange: body.dateRange,
          filters: {
            lookbackDays,
            ctrThreshold: DEFAULTS.ctrThreshold,
            minImpressions: DEFAULTS.minImpressions,
            minPosition: DEFAULTS.minPosition,
            maxPosition: DEFAULTS.maxPosition,
          },
          opportunities: queue.map((item) => ({
            page: item.page,
            pathname: item.pathname,
            pageType: item.type,
            title: item.title,
            metaDescription: item.description,
            clicks: item.clicks,
            impressions: item.impressions,
            ctr: item.ctr,
            position: item.position,
            optimizationPriority: item.priority,
            recommendedAction: item.action,
            topQueries: item.topQueries,
          })),
        },
        null,
        2
      )
    );
    return;
  }

  if (format === "md") {
    printQueueMarkdown(queue, body);
    return;
  }

  console.log(`Property: ${body.property}`);
  console.log(`Access: ${body.access.permissionLevel}`);
  console.log(`Date range: ${body.dateRange.startDate} to ${body.dateRange.endDate}`);
  console.log(`Filters: impressions >= ${DEFAULTS.minImpressions}, position ${DEFAULTS.minPosition}-${DEFAULTS.maxPosition}, CTR < ${pct(DEFAULTS.ctrThreshold)}`);

  printQueueText(queue);

  printSection("Low CTR opportunities", body.opportunities.lowCtrPages, (row) => {
    return `${shortenUrl(row.page)} | ${num(row.impressions)} impressions | ${pct(row.ctr)} CTR | pos ${fixed(row.position)} | ${num(row.clicks)} clicks`;
  });

  printSection("Top pages", body.topPages, (row) => {
    return `${shortenUrl(row.page)} | ${num(row.clicks)} clicks | ${num(row.impressions)} impressions | ${pct(row.ctr)} CTR | pos ${fixed(row.position)}`;
  });

  printSection("Top queries", body.topQueries, (row) => {
    return `${row.query} | ${num(row.clicks)} clicks | ${num(row.impressions)} impressions | ${pct(row.ctr)} CTR | pos ${fixed(row.position)}`;
  });
}

async function runInspect(searchconsole, inspectionTarget) {
  if (!inspectionTarget) {
    console.error("Usage: npm run gsc:inspect -- <url-or-path>");
    process.exit(1);
  }

  const data = await inspectUrl(searchconsole, inspectionTarget);
  printInspectionResult(data);
}

async function runSubmitSitemap(searchconsole, sitemapTarget) {
  const result = await submitSitemap(searchconsole, sitemapTarget);
  console.log(`Property: ${result.property}`);
  console.log(`Submitted sitemap: ${result.sitemap}`);
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const searchconsole = getAuthorizedSearchConsoleClient();

  if (!searchconsole) {
    console.error(`No saved OAuth tokens found at ${TOKEN_PATH}.`);
    console.error("Open /auth/google once, then rerun this command.");
    process.exit(1);
  }

  if (options.command === "inspect") {
    await runInspect(searchconsole, options.value);
    return;
  }

  if (options.command === "submit-sitemap") {
    await runSubmitSitemap(searchconsole, options.value || getDefaultSitemapUrl());
    return;
  }

  await runReport(searchconsole, options.format, options.lookbackDays);
}

main().catch((error) => {
  console.error("GSC command failed.");
  console.error(error.message);
  const message = String(error.message || "").toLowerCase();
  if (message.includes("invalid_grant")) {
    console.error(
      "Refresh token expired or revoked. Run: npm run gsc:start — open /auth/google, sign in, save new tokens, then retry."
    );
  }
  if (
    message.includes("insufficient") ||
    message.includes("permission") ||
    message.includes("403")
  ) {
    console.error("Reconnect at /auth/google once to grant the updated Search Console scope, then retry.");
  }
  process.exit(1);
});

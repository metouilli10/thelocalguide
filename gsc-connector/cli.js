#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const {
  getAuthorizedSearchConsoleClient,
  fetchSearchConsoleSnapshot,
  TOKEN_PATH,
  GSC_SITE_URL,
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
    format: "text",
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];

    if (arg === "--format" && argv[i + 1]) {
      options.format = argv[i + 1];
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

async function fetchOpportunityPages(searchconsole) {
  const response = await searchconsole.searchanalytics.query({
    siteUrl: GSC_SITE_URL,
    requestBody: {
      startDate: getDateRange().startDate,
      endDate: getDateRange().endDate,
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

async function fetchTopQueriesForPage(searchconsole, pageUrl) {
  const response = await searchconsole.searchanalytics.query({
    siteUrl: GSC_SITE_URL,
    requestBody: {
      startDate: getDateRange().startDate,
      endDate: getDateRange().endDate,
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

function getDateRange() {
  const end = new Date();
  end.setDate(end.getDate() - 1);
  const start = new Date(end);
  start.setDate(start.getDate() - 27);

  return {
    startDate: start.toISOString().slice(0, 10),
    endDate: end.toISOString().slice(0, 10),
  };
}

async function buildOptimizationQueue(searchconsole) {
  const pages = await fetchOpportunityPages(searchconsole);

  return Promise.all(
    pages.map(async (page, index) => {
      const metadata = getPageMetadata(page.page);
      const topQueries = await fetchTopQueriesForPage(searchconsole, page.page);

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

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const searchconsole = getAuthorizedSearchConsoleClient();

  if (!searchconsole) {
    console.error(`No saved OAuth tokens found at ${TOKEN_PATH}.`);
    console.error("Open /auth/google once, then rerun this command.");
    process.exit(1);
  }

  const snapshot = await fetchSearchConsoleSnapshot(searchconsole);

  if (snapshot.status !== 200) {
    console.error(JSON.stringify(snapshot.body, null, 2));
    process.exit(1);
  }

  const { body } = snapshot;
  const queue = await buildOptimizationQueue(searchconsole);

  if (options.format === "json") {
    console.log(
      JSON.stringify(
        {
          property: body.property,
          access: body.access.permissionLevel,
          dateRange: body.dateRange,
          filters: {
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

  if (options.format === "md") {
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

main().catch((error) => {
  console.error("Failed to fetch Search Console opportunities.");
  console.error(error.message);
  process.exit(1);
});

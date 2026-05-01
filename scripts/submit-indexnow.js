#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const SITE_HOST = "agadirlocalguide.com";
const SITE_ORIGIN = `https://${SITE_HOST}`;
const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";
const INDEXNOW_KEY = "e75c0512-aa7d-4e2d-ba40-b69d62dc9203";
const INDEXNOW_KEY_LOCATION = `${SITE_ORIGIN}/${INDEXNOW_KEY}.txt`;
const MAX_URLS_PER_REQUEST = 10000;

function printUsage() {
  console.log(`Usage:
  npm run indexnow:submit -- <url-or-path> [more urls or paths]
  npm run indexnow:submit -- --sitemap

Examples:
  npm run indexnow:submit -- /blog/agadir-day-trips.html
  npm run indexnow:submit -- blog/agadir-day-trips.html tours/tour-sandboarding-agadir.html
  npm run indexnow:submit:all`);
}

function normalizeToAbsoluteUrl(value) {
  if (!value) return null;
  const input = value.trim();
  if (!input) return null;

  if (/^https?:\/\//i.test(input)) {
    const url = new URL(input);
    if (url.hostname !== SITE_HOST) {
      throw new Error(`URL must belong to ${SITE_HOST}: ${input}`);
    }
    return url.toString();
  }

  const cleaned = input.replace(/\\/g, "/").replace(/^\.\//, "");
  if (cleaned === "index.html" || cleaned === "/") {
    return `${SITE_ORIGIN}/`;
  }

  return `${SITE_ORIGIN}/${cleaned.replace(/^\/+/, "")}`;
}

function readUrlsFromSitemap() {
  const sitemapPath = path.join(process.cwd(), "sitemap.xml");
  const xml = fs.readFileSync(sitemapPath, "utf8");
  const matches = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)];
  return matches.map((match) => normalizeToAbsoluteUrl(match[1]));
}

function dedupe(values) {
  return [...new Set(values.filter(Boolean))];
}

function chunk(values, size) {
  const chunks = [];
  for (let i = 0; i < values.length; i += size) {
    chunks.push(values.slice(i, i + size));
  }
  return chunks;
}

async function submitBatch(urlList) {
  const payload = {
    host: SITE_HOST,
    key: INDEXNOW_KEY,
    keyLocation: INDEXNOW_KEY_LOCATION,
    urlList,
  };

  const response = await fetch(INDEXNOW_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`IndexNow request failed (${response.status}): ${text}`);
  }
}

async function main() {
  const args = process.argv.slice(2);
  if (args.includes("--help") || args.includes("-h")) {
    printUsage();
    return;
  }

  const useSitemap = args.includes("--sitemap");
  const rawTargets = args.filter((arg) => !arg.startsWith("--"));
  const targets = useSitemap ? readUrlsFromSitemap() : rawTargets.map(normalizeToAbsoluteUrl);
  const urlList = dedupe(targets);

  if (urlList.length === 0) {
    printUsage();
    throw new Error("No URLs provided.");
  }

  const batches = chunk(urlList, MAX_URLS_PER_REQUEST);
  for (const batch of batches) {
    await submitBatch(batch);
  }

  console.log(`Submitted ${urlList.length} URL${urlList.length === 1 ? "" : "s"} to IndexNow.`);
  if (urlList.length <= 20) {
    for (const url of urlList) {
      console.log(`- ${url}`);
    }
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});

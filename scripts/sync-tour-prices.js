const fs = require("fs");
const path = require("path");

const projectRoot = process.cwd();
const tours = require(path.join(projectRoot, "js", "tour-data.js"));

const SITE_ORIGIN = "https://agadirlocalguide.com";
const HTML_DIRECTORIES = [".", "blog", "tours"];
const HTML_EXCLUDE = new Set([
  "node_modules",
  ".git",
  ".cursor",
  ".playwright-mcp"
]);

function normalizePathname(pathname) {
  if (!pathname) {
    return "";
  }

  let normalized = pathname.trim();

  if (/^https?:\/\//i.test(normalized)) {
    normalized = new URL(normalized).pathname;
  }

  if (!normalized.startsWith("/")) {
    normalized = `/${normalized}`;
  }

  return normalized.replace(/\/+$/, "") || "/";
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function collectHtmlFiles(targetPath) {
  const absolute = path.join(projectRoot, targetPath);
  const stats = fs.statSync(absolute);

  if (stats.isFile()) {
    return absolute.endsWith(".html") ? [absolute] : [];
  }

  const files = [];

  for (const entry of fs.readdirSync(absolute, { withFileTypes: true })) {
    if (HTML_EXCLUDE.has(entry.name)) {
      continue;
    }

    const entryPath = path.join(absolute, entry.name);

    if (entry.isDirectory()) {
      files.push(...collectHtmlFiles(path.relative(projectRoot, entryPath)));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith(".html")) {
      files.push(entryPath);
    }
  }

  return files;
}

function getAllHtmlFiles() {
  return HTML_DIRECTORIES.flatMap(collectHtmlFiles)
    .filter((file, index, all) => all.indexOf(file) === index)
    .sort();
}

function buildTourPathMap(items) {
  const map = new Map();

  items.forEach((tour) => {
    [tour.pagePath].concat(tour.aliases || []).forEach((pathname) => {
      map.set(normalizePathname(pathname), tour);
    });
  });

  return map;
}

function formatPriceText(price, currentText) {
  const text = (currentText || "").replace(/\s+/g, " ").trim();
  const hasFrom = /^from\b/i.test(text);
  return `${hasFrom ? "From " : ""}€${price}`;
}

function updateAnchorLinkedPrices(html, filePath, tourByPath) {
  const relativeFilePath = path.relative(projectRoot, filePath);
  const directory = path.posix.dirname(relativeFilePath.split(path.sep).join("/"));
  const basePath = directory === "." ? "/" : `/${directory}/`;
  const baseUrl = new URL(basePath, SITE_ORIGIN);

  return html.replace(/<a\b([^>]*\bhref=(["'])(.*?)\2[^>]*)>([\s\S]*?)<\/a>/g, (match, attrs, quote, href, inner) => {
    if (!href || href.startsWith("#") || href.startsWith("javascript:")) {
      return match;
    }

    let pathname;

    try {
      pathname = normalizePathname(new URL(href, baseUrl).pathname);
    } catch (error) {
      return match;
    }

    const tour = tourByPath.get(pathname);

    if (!tour) {
      return match;
    }

    const nextInner = inner
      .replace(/(<p class="trip-card__price">)([^<]+)(<\/p>)/g, (_, open, text, close) => `${open}${formatPriceText(tour.price, text)}${close}`)
      .replace(/(<div class="tour-card-price">)([^<]+)(<\/div>)/g, (_, open, text, close) => `${open}${formatPriceText(tour.price, text)}${close}`)
      .replace(/(<span class="tour-price">)([^<]+)(<\/span>)/g, (_, open, text, close) => `${open}${formatPriceText(tour.price, text)}${close}`);

    return match.replace(inner, nextInner);
  });
}

function updateCurrentPageBookingPrice(html, currentTour) {
  if (!currentTour) {
    return html;
  }

  return html.replace(
    /(<div class="booking-column">[\s\S]*?<span class="price-amount">)([^<]+)(<\/span>)/,
    (_, open, text, close) => `${open}${formatPriceText(currentTour.price, text)}${close}`
  );
}

function updateSchemaOfferPrices(html, currentPath, tourByPath) {
  return html.replace(
    /("offers"\s*:\s*\{[\s\S]{0,400}?"price"\s*:\s*")(\d+)("(?=[\s\S]{0,400}?"url"\s*:\s*"https:\/\/agadirlocalguide\.com([^"]+)"))/g,
    (match, prefix, price, suffix, urlPath) => {
      const tour = tourByPath.get(normalizePathname(urlPath));

      if (!tour) {
        return match;
      }

      return `${prefix}${tour.price}${suffix}`;
    }
  );
}

function writeInstantBookingData(items) {
  const bookableTours = items
    .filter((tour) => tour.instantBooking)
    .map((tour) => ({
      slug: tour.slug,
      name: tour.name,
      pagePath: tour.pagePath,
      price: tour.price,
      currency: tour.currency,
      duration: tour.duration,
      pickup: tour.pickup,
      tagline: tour.tagline
    }));

  const outputPath = path.join(projectRoot, "data", "instant-booking-tours.json");
  const nextContents = `${JSON.stringify(bookableTours, null, 2)}\n`;

  fs.writeFileSync(outputPath, nextContents, "utf8");
}

function syncHtmlFiles() {
  const tourByPath = buildTourPathMap(tours);
  let changedFiles = 0;

  for (const filePath of getAllHtmlFiles()) {
    const relativeFilePath = path.relative(projectRoot, filePath).split(path.sep).join("/");
    const currentPath = normalizePathname(`/${relativeFilePath}`);
    const currentTour = tourByPath.get(currentPath) || null;
    const original = fs.readFileSync(filePath, "utf8");

    let next = original;
    next = updateAnchorLinkedPrices(next, filePath, tourByPath);
    next = updateCurrentPageBookingPrice(next, currentTour);
    next = updateSchemaOfferPrices(next, currentPath, tourByPath);

    if (next !== original) {
      fs.writeFileSync(filePath, next, "utf8");
      changedFiles += 1;
    }
  }

  return changedFiles;
}

function main() {
  const changedFiles = syncHtmlFiles();
  writeInstantBookingData(tours);
  console.log(`Synced tour prices in ${changedFiles} HTML files and regenerated data/instant-booking-tours.json`);
}

main();

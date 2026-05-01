require("dotenv").config();

const fs = require("fs");
const path = require("path");
const { google } = require("googleapis");

const TOKEN_PATH = path.join(__dirname, "..", ".tokens.json");

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI,
  GSC_SITE_URL,
  GSC_SITEMAP_URL,
} = process.env;

const requiredEnv = {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI,
  GSC_SITE_URL,
};

const missing = Object.entries(requiredEnv)
  .filter(([, value]) => !value || String(value).trim() === "")
  .map(([key]) => key);

if (missing.length) {
  console.error("Missing or empty env vars:", missing.join(", "));
  console.error("Create gsc-connector/.env and set the required Google OAuth values.");
  process.exit(1);
}

const SCOPES = ["https://www.googleapis.com/auth/webmasters"];

/** Inclusive range ending yesterday (GSC data lag). Default 28 matches historical connector behavior. */
function getPerformanceDateRange(lookbackDays = 28) {
  const end = new Date();
  end.setDate(end.getDate() - 1);
  const start = new Date();
  start.setDate(start.getDate() - lookbackDays);
  return {
    startDate: start.toISOString().slice(0, 10),
    endDate: end.toISOString().slice(0, 10),
  };
}

function loadSavedTokens() {
  if (!fs.existsSync(TOKEN_PATH)) {
    return null;
  }

  try {
    const raw = fs.readFileSync(TOKEN_PATH, "utf8");
    return JSON.parse(raw);
  } catch (error) {
    console.error("Failed to read saved OAuth tokens:", error.message);
    return null;
  }
}

function saveTokens(tokens) {
  fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2));
}

function createOAuthClient() {
  return new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI
  );
}

function setOAuthCredentials(tokens) {
  const oauth2Client = createOAuthClient();
  oauth2Client.setCredentials(tokens);
  return oauth2Client;
}

function getAuthorizedSearchConsoleClient() {
  const savedTokens = loadSavedTokens();

  if (!savedTokens) {
    return null;
  }

  const oauth2Client = setOAuthCredentials(savedTokens);

  return google.searchconsole({
    version: "v1",
    auth: oauth2Client,
  });
}

function buildSearchConsoleClient(tokens) {
  const oauth2Client = setOAuthCredentials(tokens);

  return google.searchconsole({
    version: "v1",
    auth: oauth2Client,
  });
}

async function fetchSearchConsoleSnapshot(searchconsole, options = {}) {
  const lookbackDays = Number(options.lookbackDays) > 0 ? Number(options.lookbackDays) : 28;
  const sitesResponse = await searchconsole.sites.list();
  const sites = sitesResponse.data.siteEntry || [];

  const matchedSite = sites.find((site) => site.siteUrl === GSC_SITE_URL);

  if (!matchedSite) {
    return {
      status: 403,
      body: {
        error: "Authenticated Google account does not have access to GSC_SITE_URL.",
        configuredSite: GSC_SITE_URL,
        accessibleSites: sites.map((site) => ({
          siteUrl: site.siteUrl,
          permissionLevel: site.permissionLevel,
        })),
      },
    };
  }

  const { startDate, endDate } = getPerformanceDateRange(lookbackDays);

  const [topQueriesRes, topPagesRes, lowCtrPagesRes] = await Promise.all([
    searchconsole.searchanalytics.query({
      siteUrl: GSC_SITE_URL,
      requestBody: {
        startDate,
        endDate,
        dimensions: ["query"],
        rowLimit: 10,
        startRow: 0,
      },
    }),
    searchconsole.searchanalytics.query({
      siteUrl: GSC_SITE_URL,
      requestBody: {
        startDate,
        endDate,
        dimensions: ["page"],
        rowLimit: 10,
        startRow: 0,
      },
    }),
    searchconsole.searchanalytics.query({
      siteUrl: GSC_SITE_URL,
      requestBody: {
        startDate,
        endDate,
        dimensions: ["page"],
        rowLimit: 50,
        startRow: 0,
      },
    }),
  ]);

  const topQueries = (topQueriesRes.data.rows || []).map((row) => ({
    query: row.keys?.[0] || "",
    clicks: row.clicks || 0,
    impressions: row.impressions || 0,
    ctr: row.ctr || 0,
    position: row.position || 0,
  }));

  const topPages = (topPagesRes.data.rows || []).map((row) => ({
    page: row.keys?.[0] || "",
    clicks: row.clicks || 0,
    impressions: row.impressions || 0,
    ctr: row.ctr || 0,
    position: row.position || 0,
  }));

  const lowCtrPages = (lowCtrPagesRes.data.rows || [])
    .map((row) => ({
      page: row.keys?.[0] || "",
      clicks: row.clicks || 0,
      impressions: row.impressions || 0,
      ctr: row.ctr || 0,
      position: row.position || 0,
    }))
    .filter((row) => row.impressions >= 100 && row.ctr < 0.02)
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 10);

  return {
    status: 200,
    body: {
      success: true,
      property: GSC_SITE_URL,
      dateRange: { startDate, endDate },
      access: {
        siteUrl: matchedSite.siteUrl,
        permissionLevel: matchedSite.permissionLevel,
      },
      topQueries,
      topPages,
      opportunities: {
        lowCtrPages,
      },
      tokens: {
        token_file: TOKEN_PATH,
        refresh_token_saved: Boolean(loadSavedTokens()?.refresh_token),
      },
    },
  };
}

function getDefaultSitemapUrl() {
  if (GSC_SITEMAP_URL) {
    return GSC_SITEMAP_URL;
  }

  if (GSC_SITE_URL.startsWith("sc-domain:")) {
    return `https://${GSC_SITE_URL.replace("sc-domain:", "")}/sitemap.xml`;
  }

  const url = new URL(GSC_SITE_URL);
  return `${url.origin}/sitemap.xml`;
}

function normalizeUrl(input) {
  if (!input) {
    throw new Error("URL is required.");
  }

  if (/^https?:\/\//i.test(input)) {
    return input;
  }

  const pathValue = input.startsWith("/") ? input : `/${input}`;

  if (GSC_SITE_URL.startsWith("sc-domain:")) {
    return `https://${GSC_SITE_URL.replace("sc-domain:", "")}${pathValue}`;
  }

  const url = new URL(GSC_SITE_URL);
  return `${url.origin}${pathValue}`;
}

async function inspectUrl(searchconsole, inspectionUrl) {
  const response = await searchconsole.urlInspection.index.inspect({
    requestBody: {
      inspectionUrl: normalizeUrl(inspectionUrl),
      siteUrl: GSC_SITE_URL,
      languageCode: "en-US",
    },
  });

  return response.data;
}

async function submitSitemap(searchconsole, sitemapUrl) {
  const feedpath = sitemapUrl ? normalizeUrl(sitemapUrl) : getDefaultSitemapUrl();
  await searchconsole.sitemaps.submit({
    siteUrl: GSC_SITE_URL,
    feedpath,
  });

  return {
    success: true,
    property: GSC_SITE_URL,
    sitemap: feedpath,
  };
}

module.exports = {
  SCOPES,
  TOKEN_PATH,
  buildSearchConsoleClient,
  createOAuthClient,
  fetchSearchConsoleSnapshot,
  getDefaultSitemapUrl,
  getPerformanceDateRange,
  getAuthorizedSearchConsoleClient,
  GSC_SITE_URL,
  inspectUrl,
  loadSavedTokens,
  saveTokens,
  submitSitemap,
  normalizeUrl,
};

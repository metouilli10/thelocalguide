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

const oauth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI
);

function getDateNDaysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
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

function setOAuthCredentials(tokens) {
  oauth2Client.setCredentials(tokens);
}

function getAuthorizedSearchConsoleClient() {
  const savedTokens = loadSavedTokens();

  if (!savedTokens) {
    return null;
  }

  setOAuthCredentials(savedTokens);

  return google.searchconsole({
    version: "v1",
    auth: oauth2Client,
  });
}

function buildSearchConsoleClient(tokens) {
  setOAuthCredentials(tokens);

  return google.searchconsole({
    version: "v1",
    auth: oauth2Client,
  });
}

async function fetchSearchConsoleSnapshot(searchconsole) {
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

  const startDate = getDateNDaysAgo(28);
  const endDate = getDateNDaysAgo(1);

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

module.exports = {
  TOKEN_PATH,
  buildSearchConsoleClient,
  fetchSearchConsoleSnapshot,
  getAuthorizedSearchConsoleClient,
  GSC_SITE_URL,
  loadSavedTokens,
  saveTokens,
};

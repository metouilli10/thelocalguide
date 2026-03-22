require("dotenv").config();

const express = require("express");
const {
  TOKEN_PATH,
  buildSearchConsoleClient,
  fetchSearchConsoleSnapshot,
  getAuthorizedSearchConsoleClient,
  GSC_SITE_URL,
  loadSavedTokens,
  saveTokens,
} = require("./lib/gsc");

const app = express();
const PORT = Number(process.env.PORT) || 3000;

const SCOPES = ["https://www.googleapis.com/auth/webmasters.readonly"];

app.get("/", (_req, res) => {
  const savedTokens = loadSavedTokens();

  res.send(`
    <h1>Google Search Console Connector</h1>
    <p><a href="/auth/google">Connect Google Search Console</a></p>
    <p><a href="/data">Fetch saved Search Console data</a></p>
    <p>Site property configured: <strong>${GSC_SITE_URL}</strong></p>
    <p>Saved tokens present: <strong>${savedTokens ? "yes" : "no"}</strong></p>
  `);
});

app.get("/auth/google", (_req, res) => {
  const { google } = require("googleapis");
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  return res.redirect(
    oauth2Client.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      scope: SCOPES,
    })
  );
});

app.get("/oauth2callback", async (req, res) => {
  try {
    const code = req.query.code;
    if (!code) {
      return res.status(400).send("Missing authorization code.");
    }

    const { tokens } = await oauth2Client.getToken(code);
    const savedTokens = loadSavedTokens() || {};
    const tokensToSave = {
      ...savedTokens,
      ...tokens,
      refresh_token: tokens.refresh_token || savedTokens.refresh_token,
    };

    saveTokens(tokensToSave);
    const searchconsole = buildSearchConsoleClient(tokensToSave);

    const snapshot = await fetchSearchConsoleSnapshot(searchconsole);
    return res.status(snapshot.status).json(snapshot.body);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to authenticate or query Search Console.",
      details: error.message,
      hint: "Make sure the redirect URI in Google Cloud exactly matches /oauth2callback and your Google account has access to the configured Search Console property.",
    });
  }
});

app.get("/data", async (_req, res) => {
  try {
    const searchconsole = getAuthorizedSearchConsoleClient();

    if (!searchconsole) {
      return res.status(401).json({
        error: "No saved OAuth tokens found.",
        hint: "Open /auth/google once to connect and save tokens locally.",
      });
    }

    const snapshot = await fetchSearchConsoleSnapshot(searchconsole);
    return res.status(snapshot.status).json(snapshot.body);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Failed to query Search Console with saved tokens.",
      details: error.message,
      hint: "Reconnect at /auth/google if the saved refresh token has been revoked.",
    });
  }
});

const server = app.listen(PORT, () => {
  console.log(`GSC connector at http://localhost:${PORT}`);
  console.log(
    "If OAuth is registered for :3000, use PORT=3000 and stop anything else on that port (e.g. npm run dev)."
  );
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(
      `\nPort ${PORT} is already in use — often "npm run dev" / browser-sync / http-server on 3000.\n\n` +
        `Fix: stop that terminal (Ctrl+C), then run "npm start" here again.\n\n` +
        `Or use another port only if you add the same redirect in Google Cloud (e.g. http://localhost:3001/oauth2callback):\n` +
        `  PORT=3001 npm start\n`
    );
    process.exit(1);
  }
  throw err;
});

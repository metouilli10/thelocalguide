async function readRequestBody(req) {
  if (typeof req.body === "string") {
    return req.body;
  }

  if (req.body && typeof req.body === "object" && !Buffer.isBuffer(req.body)) {
    return JSON.stringify(req.body);
  }

  const chunks = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  return Buffer.concat(chunks).toString("utf8");
}

async function readJsonBody(req) {
  if (req.body && typeof req.body === "object" && !Buffer.isBuffer(req.body)) {
    return req.body;
  }

  const rawBody = await readRequestBody(req);
  return rawBody ? JSON.parse(rawBody) : {};
}

module.exports = {
  readJsonBody,
  readRequestBody
};

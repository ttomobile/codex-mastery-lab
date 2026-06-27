const http = require("http");
const crypto = require("crypto");

const PORT = Number.parseInt(process.env.PORT || "3000", 10);
const HOST = process.env.HOST || "127.0.0.1";
const MAX_BODY_BYTES = 1024 * 16;
const CSRF_TOKEN = process.env.CSRF_TOKEN || "lab-static-token";
const DEFAULT_ALLOWED_ORIGINS = "http://127.0.0.1,http://localhost";
const ALLOWED_ORIGINS = new Set(
  (process.env.ALLOWED_ORIGINS || DEFAULT_ALLOWED_ORIGINS)
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
);

const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX_POSTS = 5;
const rateLimitBuckets = new Map();

function makeRequestId(req) {
  const inbound = req.headers["x-request-id"];
  if (typeof inbound === "string" && /^[A-Za-z0-9_.:-]{1,80}$/.test(inbound)) {
    return inbound;
  }
  return crypto.randomUUID();
}

function auditLog({ requestId, method, path, status, decision }) {
  console.log(JSON.stringify({
    audit: true,
    requestId,
    method,
    path,
    status,
    decision,
  }));
}

function sendJson(req, res, requestId, status, payload, decision, extraHeaders = {}) {
  const origin = req.headers.origin;
  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Request-Id": requestId,
    ...extraHeaders,
  };

  if (origin && ALLOWED_ORIGINS.has(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
    headers.Vary = "Origin";
  }

  res.writeHead(status, headers);
  res.end(JSON.stringify(payload));
  auditLog({
    requestId,
    method: req.method,
    path: new URL(req.url, "http://local").pathname,
    status,
    decision,
  });
}

function sendError(req, res, requestId, status, code, message, decision, extraHeaders = {}) {
  sendJson(
    req,
    res,
    requestId,
    status,
    { ok: false, error: { code, message, requestId } },
    decision,
    extraHeaders,
  );
}

function clientIp(req) {
  return req.socket.remoteAddress || "unknown";
}

function checkRateLimit(ip) {
  const now = Date.now();
  const bucket = rateLimitBuckets.get(ip);

  if (!bucket || now >= bucket.resetAt) {
    rateLimitBuckets.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (bucket.count >= RATE_LIMIT_MAX_POSTS) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000),
    };
  }

  bucket.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let bytes = 0;
    let raw = "";

    req.on("data", (chunk) => {
      bytes += chunk.length;
      if (bytes > MAX_BODY_BYTES) {
        reject(Object.assign(new Error("Request body too large"), { code: "BODY_TOO_LARGE" }));
        req.destroy();
        return;
      }
      raw += chunk;
    });

    req.on("end", () => {
      if (!raw) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(Object.assign(new Error("Malformed JSON"), { code: "MALFORMED_JSON" }));
      }
    });

    req.on("error", reject);
  });
}

function validateContact(payload) {
  const errors = [];
  const name = typeof payload.name === "string" ? payload.name.trim() : "";
  const email = typeof payload.email === "string" ? payload.email.trim() : "";
  const company = typeof payload.company === "string" ? payload.company.trim() : "";
  const message = typeof payload.message === "string" ? payload.message.trim() : "";

  if (!name) errors.push("name is required");
  if (!email) errors.push("email is required");
  if (!message) errors.push("message is required");
  if (name.length > 120) errors.push("name must be 120 characters or fewer");
  if (email.length > 254) errors.push("email must be 254 characters or fewer");
  if (company.length > 120) errors.push("company must be 120 characters or fewer");
  if (message.length > 2000) errors.push("message must be 2000 characters or fewer");

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email && !emailPattern.test(email)) {
    errors.push("email must be valid");
  }

  return { ok: errors.length === 0, errors };
}

function isJsonContentType(req) {
  const contentType = req.headers["content-type"] || "";
  return contentType.toLowerCase().split(";")[0].trim() === "application/json";
}

function isAllowedOrigin(req) {
  const origin = req.headers.origin;
  return !origin || ALLOWED_ORIGINS.has(origin);
}

function hasValidCsrfToken(req) {
  const origin = req.headers.origin;
  if (!origin) return true;
  return req.headers["x-csrf-token"] === CSRF_TOKEN;
}

async function handleContact(req, res, requestId) {
  if (!isAllowedOrigin(req)) {
    sendError(req, res, requestId, 403, "origin_forbidden", "Origin is not allowed.", "security_origin_rejected");
    return;
  }

  if (!hasValidCsrfToken(req)) {
    sendError(req, res, requestId, 403, "csrf_invalid", "CSRF token is missing or invalid.", "security_csrf_rejected");
    return;
  }

  if (!isJsonContentType(req)) {
    sendError(req, res, requestId, 415, "unsupported_media_type", "Content-Type must be application/json.", "validation_content_type_rejected");
    return;
  }

  const rate = checkRateLimit(clientIp(req));
  if (!rate.allowed) {
    sendError(
      req,
      res,
      requestId,
      429,
      "rate_limited",
      "Too many contact submissions. Try again later.",
      "rate_limit_rejected",
      { "Retry-After": String(rate.retryAfterSeconds) },
    );
    return;
  }

  let payload;
  try {
    payload = await readJsonBody(req);
  } catch (err) {
    if (err.code === "BODY_TOO_LARGE") {
      sendError(req, res, requestId, 413, "body_too_large", "Request body is too large.", "validation_body_limit_rejected");
      return;
    }
    sendError(req, res, requestId, 400, "malformed_json", "Request body must be valid JSON.", "validation_json_rejected");
    return;
  }

  const validation = validateContact(payload);
  if (!validation.ok) {
    sendError(req, res, requestId, 422, "validation_failed", "Contact submission is invalid.", "validation_fields_rejected");
    return;
  }

  sendJson(
    req,
    res,
    requestId,
    202,
    { ok: true, data: { accepted: true, requestId } },
    "accepted_no_persistence",
  );
}

function handleOptions(req, res, requestId) {
  if (!isAllowedOrigin(req)) {
    sendError(req, res, requestId, 403, "origin_forbidden", "Origin is not allowed.", "security_origin_rejected");
    return;
  }

  sendJson(req, res, requestId, 204, {}, "cors_preflight_allowed", {
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-CSRF-Token, X-Request-Id",
    "Access-Control-Max-Age": "300",
  });
}

const server = http.createServer(async (req, res) => {
  const requestId = makeRequestId(req);
  const url = new URL(req.url, `http://${req.headers.host || "local"}`);

  if (req.method === "GET" && url.pathname === "/health") {
    sendJson(req, res, requestId, 200, { ok: true, status: "healthy", requestId }, "health_ok");
    return;
  }

  if (req.method === "OPTIONS" && url.pathname === "/api/contact") {
    handleOptions(req, res, requestId);
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/contact") {
    await handleContact(req, res, requestId);
    return;
  }

  sendError(req, res, requestId, 404, "not_found", "Route not found.", "route_not_found");
});

server.listen(PORT, HOST, () => {
  console.log(JSON.stringify({
    audit: true,
    event: "server_started",
    host: HOST,
    port: PORT,
    allowedOrigins: Array.from(ALLOWED_ORIGINS),
  }));
});

"use strict";

const http = require("http");

const PORT = Number(process.env.PORT || 3000);
const MAX_BODY_BYTES = 1024 * 64;

function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload);

  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body),
    "Cache-Control": "no-store",
  });
  res.end(body);
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];

    req.on("data", (chunk) => {
      size += chunk.length;

      if (size > MAX_BODY_BYTES) {
        reject(Object.assign(new Error("Request body is too large"), { statusCode: 413 }));
        req.destroy();
        return;
      }

      chunks.push(chunk);
    });

    req.on("end", () => {
      const rawBody = Buffer.concat(chunks).toString("utf8");

      if (!rawBody.trim()) {
        reject(Object.assign(new Error("Request body must be valid JSON"), { statusCode: 400 }));
        return;
      }

      try {
        resolve(JSON.parse(rawBody));
      } catch {
        reject(Object.assign(new Error("Request body must be valid JSON"), { statusCode: 400 }));
      }
    });

    req.on("error", reject);
  });
}

function cleanString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function validateContact(input) {
  const contact = {
    name: cleanString(input.name),
    email: cleanString(input.email),
    company: cleanString(input.company),
    message: cleanString(input.message),
  };

  const errors = [];

  if (!contact.name) errors.push("name is required");
  if (!contact.email) errors.push("email is required");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) errors.push("email must be valid");
  if (!contact.message) errors.push("message is required");
  if (contact.name.length > 120) errors.push("name must be 120 characters or fewer");
  if (contact.email.length > 254) errors.push("email must be 254 characters or fewer");
  if (contact.company.length > 160) errors.push("company must be 160 characters or fewer");
  if (contact.message.length > 5000) errors.push("message must be 5000 characters or fewer");

  return { contact, errors };
}

async function handleContact(req, res) {
  const contentType = req.headers["content-type"] || "";

  if (!contentType.toLowerCase().includes("application/json")) {
    sendJson(res, 415, { ok: false, error: "Content-Type must be application/json" });
    return;
  }

  const body = await readJsonBody(req);

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    sendJson(res, 400, { ok: false, error: "JSON body must be an object" });
    return;
  }

  const { contact, errors } = validateContact(body);

  if (errors.length > 0) {
    sendJson(res, 422, { ok: false, errors });
    return;
  }

  sendJson(res, 201, {
    ok: true,
    message: "Contact request received",
    contact: {
      name: contact.name,
      email: contact.email,
      company: contact.company || null,
    },
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);

  try {
    if (req.method === "GET" && url.pathname === "/health") {
      sendJson(res, 200, { ok: true, status: "healthy" });
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/contact") {
      await handleContact(req, res);
      return;
    }

    sendJson(res, 404, { ok: false, error: "Not found" });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    const message = statusCode === 500 ? "Internal server error" : error.message;
    sendJson(res, statusCode, { ok: false, error: message });
  }
});

server.listen(PORT, () => {
  console.log(`Contact API listening on http://localhost:${PORT}`);
});

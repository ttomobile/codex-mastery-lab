import { createServer } from "node:http";
import { createState, scenarios } from "./mock-data.mjs";

const port = Number(process.env.PORT ?? 4100);
let currentScenario = "success";

function sendJson(response, status, payload) {
  response.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET,POST,OPTIONS",
    "access-control-allow-headers": "content-type"
  });
  response.end(JSON.stringify(payload));
}

async function readBody(request) {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  if (chunks.length === 0) return {};
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

const server = createServer(async (request, response) => {
  if (request.method === "OPTIONS") {
    sendJson(response, 200, { ok: true });
    return;
  }

  const url = new URL(request.url ?? "/", `http://${request.headers.host}`);

  if (url.pathname === "/health") {
    sendJson(response, 200, { ok: true, service: "mock-sagaforge", scenario: currentScenario });
    return;
  }

  if (url.pathname === "/state") {
    if (currentScenario === "timeout") await new Promise((resolve) => setTimeout(resolve, 900));
    sendJson(response, 200, createState(currentScenario));
    return;
  }

  if (url.pathname === "/__control/state" && request.method === "POST") {
    const body = await readBody(request);
    if (!scenarios.includes(body.scenario)) {
      sendJson(response, 400, { ok: false, message: "unknown scenario", scenarios });
      return;
    }
    currentScenario = body.scenario;
    sendJson(response, 200, createState(currentScenario));
    return;
  }

  sendJson(response, 404, { ok: false, message: "not found" });
});

server.listen(port, "127.0.0.1", () => {
  console.log(`mock-sagaforge listening on http://127.0.0.1:${port}`);
});

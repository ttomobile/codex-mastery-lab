import { createServer } from "node:http";
import { createState, scenarios, serviceStateForScenario } from "./mock-data.mjs";

const port = Number(process.env.PORT ?? 4100);
const host = process.env.HOST ?? "127.0.0.1";
const serviceName = process.env.SERVICE_NAME ?? "mock-api";
let currentScenario = "success";
let currentState = createState(currentScenario);

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
    sendJson(response, 200, { ok: true, service: serviceName, scenario: currentScenario });
    return;
  }

  if (url.pathname === "/state") {
    if (currentScenario === "timeout") await new Promise((resolve) => setTimeout(resolve, 900));
    sendJson(response, 200, currentState);
    return;
  }

  if (url.pathname === "/__control/state" && request.method === "POST") {
    const body = await readBody(request);
    if (!scenarios.includes(body.scenario)) {
      sendJson(response, 400, { ok: false, message: "unknown scenario", scenarios });
      return;
    }
    currentScenario = body.scenario;
    currentState = createState(currentScenario);
    sendJson(response, 200, currentState);
    return;
  }

  if (url.pathname === "/actions/swap-party" && request.method === "POST") {
    const body = await readBody(request);
    if (!currentState.party.includes(body.outId) || currentState.party.includes(body.inId)) {
      sendJson(response, 400, { ok: false, message: "交替できない隊員です", state: currentState });
      return;
    }
    currentState = { ...currentState, party: currentState.party.map((id) => (id === body.outId ? body.inId : id)) };
    sendJson(response, 200, { ok: true, state: currentState });
    return;
  }

  if (url.pathname === "/actions/train" && request.method === "POST") {
    const body = await readBody(request);
    const services = serviceStateForScenario(currentScenario);
    const premiumBonus = services.auth === "premium" ? 62 : 0;
    currentState = {
      ...currentState,
      roster: currentState.roster.map((character) =>
        character.id === body.id ? { ...character, level: character.level + 1, power: character.power + (character.rank === 3 ? 42 : character.rank === 2 ? 34 : 26) + premiumBonus } : character
      )
    };
    sendJson(response, 200, { ok: true, state: currentState });
    return;
  }

  if (url.pathname === "/actions/recruit" && request.method === "POST") {
    const body = await readBody(request);
    const services = serviceStateForScenario(currentScenario);
    if (services.billing === "payment_failed") {
      sendJson(response, 402, { ok: false, message: "決済失敗中は名簿に迎えられません", state: currentState });
      return;
    }
    const total = [...String(body.seed)].reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const recruit = {
      id: `recruit-${body.seed}`,
      name: `星紋候補${total % 100}`,
      role: total % 2 === 0 ? "前衛" : "支援",
      rank: total % 5 === 0 ? 3 : 2,
      level: 28,
      power: 430 + (total % 80),
      symbol: total % 2 === 0 ? "槍" : "灯"
    };
    currentState = {
      ...currentState,
      roster: currentState.roster.some((member) => member.id === recruit.id) ? currentState.roster : [...currentState.roster, recruit]
    };
    sendJson(response, 200, { ok: true, state: currentState });
    return;
  }

  sendJson(response, 404, { ok: false, message: "not found" });
});

server.listen(port, host, () => {
  console.log(`${serviceName} listening on http://${host}:${port}`);
});

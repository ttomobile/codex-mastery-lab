import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";

const healthUrl = "http://127.0.0.1:4100/health";
const stateUrl = "http://127.0.0.1:4100/state";
const controlUrl = "http://127.0.0.1:4100/__control/state";
const servicePorts = { api: 4100, media: 4101, auth: 4102, billing: 4103 };
const scenarios = ["success", "empty_roster", "offline", "timeout", "battle_win", "battle_lose", "party_invalid", "gacha_result", "media_failure", "payment_failed", "auth_anonymous", "auth_premium"];

function run(command, args, options = {}) {
  return spawnSync(command, args, {
    stdio: options.stdio ?? "pipe",
    env: { ...process.env, ...options.env },
    encoding: "utf8"
  });
}

function printResult(label, ok, detail = "") {
  console.log(`${ok ? "OK" : "NG"}: ${label}${detail ? ` - ${detail}` : ""}`);
}

async function getJson(url, options) {
  const response = await fetch(url, options);
  if (!response.ok) throw new Error(`${url} ${response.status}`);
  return response.json();
}

const dockerVersion = run("docker", ["compose", "version"]);
printResult("Docker Compose", dockerVersion.status === 0, dockerVersion.status === 0 ? dockerVersion.stdout.trim() : "Node fallbackを利用");
printResult("docker-compose.yml", existsSync("docker-compose.yml"));

let startedByDoctor = false;
try {
  await getJson(healthUrl);
} catch {
  const start = run("pnpm", ["run", "mock:start"], { stdio: "inherit", env: { SAGAFORGE_MOCK_NODE_ONLY: "1" } });
  startedByDoctor = start.status === 0;
  printResult("Node fallback 起動", startedByDoctor);
}

const health = await getJson(healthUrl);
printResult("/health", health.ok === true, health.scenario);

for (const [service, port] of Object.entries(servicePorts)) {
  const serviceHealth = await getJson(`http://127.0.0.1:${port}/health`);
  const serviceState = await getJson(`http://127.0.0.1:${port}/state`);
  printResult(`${service} /health /state`, serviceHealth.ok === true && serviceState.scenario, `${serviceState.scenario}`);
}

for (const scenario of scenarios) {
  const controlled = await getJson(controlUrl, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ scenario })
  });
  const state = await getJson(stateUrl);
  printResult(`state ${scenario}`, controlled.scenario === scenario && state.scenario === scenario);
}

await getJson(controlUrl, {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ scenario: "success" })
});

if (startedByDoctor) {
  const stop = run("pnpm", ["run", "mock:stop"], { stdio: "inherit" });
  printResult("doctor起動分の停止", stop.status === 0);
}

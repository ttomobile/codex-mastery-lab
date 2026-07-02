import { spawn, spawnSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";

const pidFile = ".sagaforge-mock-services.json";
const services = [
  { name: "mock-api", port: "4100" },
  { name: "mock-media", port: "4101" },
  { name: "mock-auth", port: "4102" },
  { name: "mock-billing", port: "4103" }
];
async function isHealthy() {
  try {
    const results = await Promise.all(services.map((service) => fetch(`http://127.0.0.1:${service.port}/health`).then((response) => response.ok)));
    return results.every(Boolean);
  } catch {
    return false;
  }
}

async function waitForHealth(timeoutMs = 20_000) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    if (await isHealthy()) return;
    await new Promise((resolve) => setTimeout(resolve, 400));
  }
  throw new Error("mock service のhealth checkが時間内に完了しませんでした");
}

function canUseDockerCompose() {
  if (process.env.SAGAFORGE_MOCK_NODE_ONLY === "1") return false;
  return spawnSync("docker", ["compose", "version"], { stdio: "ignore" }).status === 0;
}

async function startWithDocker() {
  console.log("mock services mode: docker compose");
  const result = spawnSync("docker", ["compose", "up", "-d", "mock-api", "mock-media", "mock-auth", "mock-billing"], { stdio: "inherit" });
  if (result.status !== 0) throw new Error("docker compose によるmock service起動に失敗しました");
  writeFileSync(pidFile, JSON.stringify({ mode: "docker" }, null, 2));
  await waitForHealth();
}

async function startWithNode() {
  console.log("mock services mode: node fallback");
  if (existsSync(pidFile)) {
    const existing = JSON.parse(readFileSync(pidFile, "utf8"));
    if (existing.mode === "node" && (await isHealthy())) return;
  }

  const processes = services.map((service) => {
    const child = spawn("node", ["scripts/mock-server.mjs"], {
      detached: true,
      stdio: "ignore",
      env: { ...process.env, PORT: service.port, SERVICE_NAME: service.name }
    });
    child.unref();
    return { name: service.name, pid: child.pid };
  });
  writeFileSync(pidFile, JSON.stringify({ mode: "node", processes }, null, 2));
  await waitForHealth();
}

if (await isHealthy()) {
  console.log("mock service is already healthy");
  process.exit(0);
}

try {
  if (canUseDockerCompose()) await startWithDocker();
  else await startWithNode();
  console.log("mock service is healthy");
} catch (error) {
  if (canUseDockerCompose()) {
    console.warn("Docker起動に失敗したためNode fallbackへ切り替えます");
    await startWithNode();
    console.log("mock service is healthy");
  } else {
    throw error;
  }
}

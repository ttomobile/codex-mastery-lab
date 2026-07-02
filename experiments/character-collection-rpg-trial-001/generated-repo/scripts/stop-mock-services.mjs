import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, rmSync } from "node:fs";

const pidFile = ".sagaforge-mock-services.json";

if (!existsSync(pidFile)) {
  console.log("mock service pid file is absent");
  process.exit(0);
}

const state = JSON.parse(readFileSync(pidFile, "utf8"));
if (state.mode === "docker") {
  spawnSync("docker", ["compose", "down"], { stdio: "inherit" });
}

if (state.mode === "node") {
  for (const processInfo of state.processes ?? []) {
    try {
      process.kill(processInfo.pid, "SIGTERM");
      console.log(`stopped ${processInfo.name} pid=${processInfo.pid}`);
    } catch {
      console.log(`already stopped ${processInfo.name} pid=${processInfo.pid}`);
    }
  }
}

rmSync(pidFile, { force: true });

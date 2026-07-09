import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 120_000,
  expect: { timeout: 90_000 },
  workers: 1,
  retries: process.env.CI ? 1 : 1,
  reporter: [["html", { outputFolder: "playwright-report" }], ["list"]],
  use: {
    baseURL: "http://127.0.0.1:3076",
    trace: "on-first-retry"
  },
  webServer: {
    command: "pnpm exec next dev --hostname 127.0.0.1 --port 3076",
    url: "http://127.0.0.1:3076",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000
  },
  projects: [
    { name: "Chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "Firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "WebKit", use: { ...devices["Desktop Safari"] } }
  ]
});

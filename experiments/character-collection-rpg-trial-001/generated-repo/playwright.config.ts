import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  outputDir: "./test-results",
  timeout: 120_000,
  expect: { timeout: 90_000 },
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 2 : 1,
  reporter: [["html", { outputFolder: "playwright-report", open: "never" }], ["list"]],
  use: {
    baseURL: "http://127.0.0.1:3141",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    viewport: { width: 390, height: 844 }
  },
  webServer: {
    command: "pnpm run mock:start && NEXT_PUBLIC_MOCK_BASE_URL=http://127.0.0.1:4100 pnpm exec next dev --hostname 127.0.0.1 --port 3141",
    url: "http://127.0.0.1:3141",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000
  },
  projects: [
    { name: "chromium", use: { ...devices["Pixel 5"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"], viewport: { width: 390, height: 844 } } },
    { name: "webkit", use: { ...devices["iPhone 12"] } }
  ]
});

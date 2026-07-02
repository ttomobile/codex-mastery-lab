import { chromium, firefox, webkit } from "@playwright/test";

const browsers = [
  ["Chromium", chromium],
  ["Firefox", firefox],
  ["WebKit", webkit]
];

let failed = false;

for (const [name, browserType] of browsers) {
  try {
    const browser = await browserType.launch();
    await browser.close();
    console.log(`OK: ${name}`);
  } catch (error) {
    failed = true;
    console.log(`NG: ${name} - ${error instanceof Error ? error.message.split("\n")[0] : String(error)}`);
  }
}

if (failed) {
  console.log("Playwrightブラウザが未導入の場合は pnpm exec playwright install --with-deps を実行してください。");
  process.exit(1);
}

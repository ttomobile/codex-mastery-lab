import { chromium } from '@playwright/test';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1400 } });
await page.goto('http://127.0.0.1:3022/', { waitUntil: 'networkidle' });
await page.getByRole('heading', { name: 'キャラ収集RPG Trial 007 Evidence Binder: valid' }).scrollIntoViewIfNeeded();
await page.screenshot({ path: '../../../assets/2026-07-03-character-collection-rpg-trial-008-evidence-binder.png', fullPage: false });
await browser.close();

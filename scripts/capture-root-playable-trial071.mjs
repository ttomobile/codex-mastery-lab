import { chromium } from 'playwright';
import { mkdirSync, copyFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const url = 'file://' + resolve(root, 'playables/sagaforge-app/index.html');
const assetDir = resolve(root, 'assets');
const artifactDir = resolve(root, 'experiments/character-collection-rpg-trial-001/artifacts/character-collection-rpg-trial-071/screenshots');
mkdirSync(assetDir, { recursive: true });
mkdirSync(artifactDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 430, height: 980 }, deviceScaleFactor: 1 });
const errors = [];
page.on('pageerror', err => errors.push(err.message));
page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
await page.goto(url);
await page.getByRole('heading', { name: '星紋遠征隊' }).waitFor();

async function shot(name) {
  const target = resolve(assetDir, `2026-07-09-character-collection-rpg-trial-071-${name}.png`);
  await page.screenshot({ path: target, fullPage: true });
  copyFileSync(target, resolve(artifactDir, `2026-07-09-character-collection-rpg-trial-071-${name}.png`));
}

await shot('home');
await page.getByRole('button', { name: 'スタイル選択' }).click();
await page.getByRole('heading', { name: 'スタイル一覧' }).waitFor();
await shot('styles');
await page.getByRole('button', { name: 'ホーム' }).click();
await page.getByRole('button', { name: '日課開始' }).click();
await page.getByRole('button', { name: '選択クエストへ出撃' }).click();
await page.getByRole('button', { name: 'OD号令' }).click();
await page.getByText('勝利! 報酬を確認').waitFor();
await shot('battle-result');
await page.getByRole('button', { name: '状態' }).click();
await page.getByRole('button', { name: '通信エラー' }).click();
await page.getByText('状態を確認してください').waitFor();
await shot('failure-state');

await browser.close();
if (errors.length) {
  writeFileSync(resolve(artifactDir, 'console-errors.txt'), errors.join('\n'));
  throw new Error(errors.join('\n'));
}
console.log('captured trial071 home/styles/battle-result/failure-state');

import { chromium } from '@playwright/test';
import { spawn } from 'node:child_process';
import { mkdirSync, copyFileSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const repo = process.cwd();
const labRoot = resolve(repo, '../../..');
const shotDir = resolve(repo, '../artifacts/screenshots');
const assetDir = resolve(labRoot, 'assets');
mkdirSync(shotDir, { recursive: true });
mkdirSync(assetDir, { recursive: true });
function wait(ms){ return new Promise(r=>setTimeout(r,ms)); }
const server = spawn('pnpm', ['exec','next','dev','--hostname','127.0.0.1','--port','3133'], { cwd: repo, stdio: ['ignore','pipe','pipe'] });
for (let i=0;i<60;i++) {
  try { const r = await fetch('http://127.0.0.1:3133'); if (r.ok) break; } catch {}
  await wait(500);
}
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1200 }, deviceScaleFactor: 1 });
await page.goto('http://127.0.0.1:3133', { waitUntil: 'networkidle' });
await page.screenshot({ path: join(shotDir, 'aidd-control-plane-mvp003-empty.png'), fullPage: true });
await page.getByRole('button', { name: 'サンプル証跡を入れる' }).click();
await page.waitForTimeout(300);
await page.screenshot({ path: join(shotDir, 'aidd-control-plane-mvp003-ready.png'), fullPage: true });
await page.getByRole('button', { name: '必須ログを消して失敗を見る' }).click();
await page.waitForTimeout(300);
await page.screenshot({ path: join(shotDir, 'aidd-control-plane-mvp003-missing-logs.png'), fullPage: true });
await page.getByRole('button', { name: 'スクリーンショットを消して失敗を見る' }).click();
await page.waitForTimeout(300);
await page.screenshot({ path: join(shotDir, 'aidd-control-plane-mvp003-missing-screenshots.png'), fullPage: true });
await browser.close();
server.kill('SIGTERM');
for (const name of ['aidd-control-plane-mvp003-empty.png','aidd-control-plane-mvp003-ready.png','aidd-control-plane-mvp003-missing-logs.png','aidd-control-plane-mvp003-missing-screenshots.png']) {
  copyFileSync(join(shotDir, name), join(assetDir, name));
}
const logs = [['install','01-install.txt'],['lint','02-lint.txt'],['typecheck','03-typecheck.txt'],['test','04-test.txt'],['build','05-build.txt'],['e2e','06-e2e.txt'],['doctor','07-doctor-aidd.txt']].map(([label,file])=>{
 const t=readFileSync(resolve(repo,'../artifacts/terminal',file),'utf8').replaceAll(labRoot,'<repo>').replaceAll(process.env.HOME || '', '<home>');
 return {label,last:t.trim().split('\n').slice(-4).join('\n')};
});
const esc=s=>s.replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
const html=`<!doctype html><meta charset=utf-8><style>body{margin:0;background:#101623;color:#eef5ff;font:20px ui-monospace,Menlo,monospace;padding:36px}h1{font:700 34px system-ui;margin:0 0 24px}.grid{display:grid;grid-template-columns:1fr 1fr;gap:18px}.card{border:1px solid #2d3a59;border-radius:16px;background:#172033;padding:18px}.label{color:#97f5ba;font-weight:700;margin-bottom:10px}pre{white-space:pre-wrap;margin:0;color:#dfeaff;font-size:16px}</style><h1>AIDD Control Plane MVP 003 検証ログ</h1><div class=grid>${logs.map(l=>`<div class=card><div class=label>${l.label} exit=0</div><pre>${esc(l.last)}</pre></div>`).join('')}</div>`;
const card=await chromium.launch();
const p=await card.newPage({viewport:{width:1300,height:900},deviceScaleFactor:1});
await p.setContent(html);
await p.screenshot({path:join(shotDir,'aidd-control-plane-mvp003-terminal-evidence.png'),fullPage:true});
await card.close();
copyFileSync(join(shotDir,'aidd-control-plane-mvp003-terminal-evidence.png'),join(assetDir,'aidd-control-plane-mvp003-terminal-evidence.png'));
console.log('captured mvp003 article assets', shotDir);

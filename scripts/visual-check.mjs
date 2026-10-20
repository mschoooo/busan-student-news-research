import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const base = process.env.SLIDE_URL || 'http://127.0.0.1:4173/';
const out = new URL('../test-results/', import.meta.url);
const outDir = fileURLToPath(out);
mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1 });
const errors = [];
page.on('pageerror', error => errors.push(error.message));
await page.goto(base, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
const report = [];
for (let i = 1; i <= 11; i++) {
  await page.goto(`${base}#${i}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(850);
  await page.screenshot({ path: join(outDir, `slide-${i}.png`) });
  const result = await page.evaluate(() => {
    const slide = document.querySelector('.slide.active');
    const slideRect = slide.getBoundingClientRect();
    const candidates = [...slide.querySelectorAll('h1,h2,h3,p,b,span,footer,.timeline,.criteria-table,.coding-table,.chart-grid,.execution')];
    const overflow = candidates.filter(el => {
      const style = getComputedStyle(el);
      if (style.display === 'none') return false;
      const r = el.getBoundingClientRect();
      return r.width && r.height && (r.left < slideRect.left - 1 || r.right > slideRect.right + 1 || r.top < slideRect.top - 1 || r.bottom > slideRect.bottom + 1);
    }).map(el => ({ tag: el.tagName, text: el.textContent.trim().slice(0, 45), rect: el.getBoundingClientRect().toJSON() }));
    const source = slide.querySelector('.source');
    const sourceTop = source?.getBoundingClientRect().top ?? Infinity;
    const contentBottom = Math.max(...[...slide.children].filter(el => el !== source && getComputedStyle(el).position !== 'absolute').map(el => el.getBoundingClientRect().bottom));
    const brokenImages = [...slide.querySelectorAll('img')].filter(img => !img.complete || img.naturalWidth === 0).map(img => img.getAttribute('src'));
    return { id: slide.id, overflow, sourceGap: Number.isFinite(sourceTop) ? Math.round(sourceTop - contentBottom) : null, brokenImages, scrollWidth: slide.scrollWidth, scrollHeight: slide.scrollHeight };
  });
  report.push(result);
}
await page.goto(`${base}#1`, { waitUntil: 'networkidle' });
await page.keyboard.press('ArrowRight');
const keyboardNext = await page.locator('.slide.active').getAttribute('id');
await page.locator('#next').click();
const buttonNext = await page.locator('.slide.active').getAttribute('id');
writeFileSync(join(outDir, 'report.json'), JSON.stringify({ report, keyboardNext, buttonNext, errors }, null, 2));
await browser.close();
if (errors.length || report.some(x => x.overflow.length || x.brokenImages.length || x.scrollHeight > 900 || (x.sourceGap !== null && x.sourceGap < 5)) || keyboardNext !== 'slide-2' || buttonNext !== 'slide-3') {
  console.error(JSON.stringify({ report, keyboardNext, buttonNext, errors }, null, 2));
  process.exitCode = 1;
} else console.log('11장 화면 경계 및 키보드·버튼 이동 확인 완료');

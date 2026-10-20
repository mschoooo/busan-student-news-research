import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const sources = [
  ['busan', 'https://www.busan.com/view/busan/view.php?code=2025010218174626358'],
  ['kookje', 'https://www.kookje.co.kr/news2011/asp/newsbody.asp?code=0300&key=20250418.22001005833'],
];

await mkdir('tmp/news', { recursive: true });
const browser = await chromium.launch({ headless: true });
for (const [name, url] of sources) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForTimeout(3000);
  if (name === 'busan') await page.addStyleTag({ content: '.wcms_ad{display:none!important}' });
  await page.screenshot({
    path: `public/images/news-${name}-article.png`,
    clip: name === 'busan' ? { x: 100, y: 38, width: 860, height: 410 } : { x: 170, y: 28, width: 800, height: 390 },
  });
  console.log(`${name}: ${await page.title()}`);
  await page.close();
}
await browser.close();

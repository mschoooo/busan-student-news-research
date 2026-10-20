import { chromium } from 'playwright';
import { mkdir, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';

await mkdir('tmp/news', { recursive: true });
const browser = await chromium.launch({ headless: true });

if (existsSync('tmp/news/kookje-full.png')) {
  const b64 = (await readFile('tmp/news/kookje-full.png')).toString('base64');
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
  await page.setContent(
    '<!doctype html><style>body{margin:0;position:relative;background:#fff}.mask{position:absolute;left:170px;top:40px;width:265px;height:90px;background:#fff}</style>' +
    '<img src="data:image/png;base64,' + b64 + '" /><div class="mask"></div>'
  );
  await page.screenshot({
    path: 'public/images/news-kookje-article.png',
    clip: { x: 170, y: 42, width: 780, height: 304 },
  });
  await page.close();
  console.log('kookje: cropped cleanly from tmp/news/kookje-full.png');
}

await browser.close();

import { preview } from 'vite';
import { chromium } from 'playwright';
import { mkdir, copyFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const filename = 'busan-newspaper-international-students.pdf';
const output = resolve('output/pdf', filename);
const publicCopy = resolve('public', filename);
await mkdir(resolve('output/pdf'), { recursive: true });

const server = await preview({ preview: { host: '127.0.0.1', port: 0 } });
const address = server.httpServer.address();
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1 });
  await page.goto(`http://127.0.0.1:${address.port}/`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.locator('.cover-scrapbook img').first().waitFor();
  await page.emulateMedia({ media: 'print', reducedMotion: 'reduce' });
  await page.pdf({ path: output, printBackground: true, preferCSSPageSize: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
  await copyFile(output, publicCopy);
  console.log(`PDF: ${output}`);
} finally {
  await browser.close();
  await new Promise((resolveClose, rejectClose) => server.httpServer.close(error => error ? rejectClose(error) : resolveClose()));
}

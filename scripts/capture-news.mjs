import { chromium } from 'playwright';
import { readFile } from 'node:fs/promises';

const busanB64 = (await readFile('tmp/news/busan-full.png')).toString('base64');
const kookjeB64 = (await readFile('tmp/news/kookje-full.png')).toString('base64');

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 900, height: 600 }, deviceScaleFactor: 2 });

// 1. Busan Ilbo print-style cutout (stitching real masthead + real headline + real lead from busan-full.png, removing web GNB & SNS icons)
await page.setContent(`<!doctype html>
<html>
<head>
<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@500;600;700;900&family=Noto+Sans+KR:wght@400;500;700&display=swap" rel="stylesheet" />
<style>
  body { margin: 0; background: #f4efe4; font-family: 'Noto Serif KR', serif; color: #1b1916; }
  .clipping {
    width: 760px;
    padding: 22px 28px 24px;
    background:
      radial-gradient(circle at 20% 30%, rgba(160,145,120,0.06), transparent 60%),
      radial-gradient(circle at 80% 70%, rgba(140,125,100,0.08), transparent 55%),
      #f5f0e5;
    box-sizing: border-box;
  }
  .meta-bar {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    border-bottom: 2px solid #221f1b;
    padding-bottom: 8px;
    margin-bottom: 4px;
  }
  .masthead-crop {
    width: 216px;
    height: 58px;
    overflow: hidden;
    position: relative;
    mix-blend-mode: multiply;
  }
  .masthead-crop img {
    position: absolute;
    left: -114px;
    top: -62px;
    width: 1440px;
    filter: contrast(1.15);
  }
  .edition-info {
    font: 500 12.5px 'Noto Sans KR', sans-serif;
    color: #5a5348;
    letter-spacing: -0.02em;
  }
  .sub-rule {
    border-top: 1px solid #221f1b;
    padding-top: 14px;
    margin-top: 2px;
  }
  .kicker {
    display: inline-block;
    font: 700 13px 'Noto Sans KR', sans-serif;
    color: #9e2a22;
    letter-spacing: -0.02em;
    margin-bottom: 6px;
  }
  h1 {
    margin: 0 0 14px;
    font-size: 31px;
    line-height: 1.32;
    font-weight: 900;
    letter-spacing: -0.055em;
    color: #161412;
  }
  .columns {
    display: grid;
    grid-template-columns: 1fr 1.35fr;
    gap: 20px;
    border-top: 1px solid #bfb6a5;
    padding-top: 12px;
  }
  .deck {
    border-right: 1px solid #cec5b4;
    padding-right: 18px;
  }
  .deck h2 {
    margin: 0 0 8px;
    font: 700 15.5px/1.45 'Noto Sans KR', sans-serif;
    color: #2c2823;
    letter-spacing: -0.03em;
  }
  .deck p {
    margin: 0;
    font: 500 13.5px/1.58 'Noto Sans KR', sans-serif;
    color: #4a443c;
    letter-spacing: -0.03em;
  }
  .body-text {
    font-size: 13.8px;
    line-height: 1.65;
    color: #332e28;
    letter-spacing: -0.02em;
    text-align: justify;
  }
  .body-text mark {
    background: rgba(158, 42, 34, 0.14);
    color: #161412;
    font-weight: 700;
    padding: 1px 3px;
  }
  .byline {
    margin-top: 8px;
    font: 500 12px 'Noto Sans KR', sans-serif;
    color: #6e665b;
  }
</style>
</head>
<body>
  <div class="clipping" id="target">
    <div class="meta-bar">
      <div class="masthead-crop"><img src="data:image/png;base64,${busanB64}" /></div>
      <div class="edition-info">2025년 1월 2일 목요일 · 기획 [부산, 외국인 환대도시로]</div>
    </div>
    <div class="sub-rule">
      <span class="kicker">기획 · 일상 장벽에 막힌 유학생</span>
      <h1>부산에서 공부하고도 일자리 없어<br>수도권으로 떠난다</h1>
      <div class="columns">
        <div class="deck">
          <h2>정주 환경 고려해 부산 찾았으나<br>채용 냉대 속 서울 이주 고민</h2>
          <p>지하철 옆자리 비어 가고 보험 가입 등 생활 속 보이지 않는 차별 여전</p>
          <div class="byline">조영미 기자 mia3@busan.com</div>
        </div>
        <div class="body-text">
          부산 지역 대학을 졸업한 외국인 유학생 상당수가 <mark>지역 내 일자리 부족과 정주 장벽</mark> 때문에 수도권으로 떠나고 있다. 유학생 유치를 대학 위기 해법으로 내세우지만, 졸업 뒤 지역 사회에 뿌리내릴 채용·주거·생활 여건은 뒷받침되지 못한다는 지적이 나온다.
        </div>
      </div>
    </div>
  </div>
</body>
</html>`, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.locator('#target').screenshot({ path: 'public/images/news-busan-article.png' });

// 2. Kookje Shinmun print-style cutout (stitching real masthead + real headline + real lead from kookje-full.png)
await page.setContent(`<!doctype html>
<html>
<head>
<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@500;600;700;900&family=Noto+Sans+KR:wght@400;500;700&display=swap" rel="stylesheet" />
<style>
  body { margin: 0; background: #f3ede0; font-family: 'Noto Serif KR', serif; color: #1b1916; }
  .clipping {
    width: 760px;
    padding: 22px 28px 24px;
    background:
      radial-gradient(circle at 75% 25%, rgba(160,145,120,0.07), transparent 60%),
      radial-gradient(circle at 25% 80%, rgba(140,125,100,0.08), transparent 55%),
      #f3ede0;
    box-sizing: border-box;
  }
  .meta-bar {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    border-bottom: 2px solid #221f1b;
    padding-bottom: 8px;
    margin-bottom: 4px;
  }
  .masthead-crop {
    width: 230px;
    height: 58px;
    overflow: hidden;
    position: relative;
    mix-blend-mode: multiply;
  }
  .masthead-crop img {
    position: absolute;
    left: -605px;
    top: -49px;
    width: 1440px;
    filter: contrast(1.15);
  }
  .edition-info {
    font: 500 12.5px 'Noto Sans KR', sans-serif;
    color: #5a5348;
    letter-spacing: -0.02em;
  }
  .sub-rule {
    border-top: 1px solid #221f1b;
    padding-top: 14px;
    margin-top: 2px;
  }
  .kicker {
    display: inline-block;
    font: 700 13px 'Noto Sans KR', sans-serif;
    color: #9e2a22;
    letter-spacing: -0.02em;
    margin-bottom: 6px;
  }
  h1 {
    margin: 0 0 14px;
    font-size: 30px;
    line-height: 1.32;
    font-weight: 900;
    letter-spacing: -0.055em;
    color: #161412;
  }
  .columns {
    display: grid;
    grid-template-columns: 1fr 1.35fr;
    gap: 20px;
    border-top: 1px solid #bfb6a5;
    padding-top: 12px;
  }
  .deck {
    border-right: 1px solid #cec5b4;
    padding-right: 18px;
  }
  .deck h2 {
    margin: 0 0 8px;
    font: 700 15.5px/1.45 'Noto Sans KR', sans-serif;
    color: #2c2823;
    letter-spacing: -0.03em;
  }
  .deck p {
    margin: 0;
    font: 500 13.5px/1.58 'Noto Sans KR', sans-serif;
    color: #4a443c;
    letter-spacing: -0.03em;
  }
  .body-text {
    font-size: 13.8px;
    line-height: 1.65;
    color: #332e28;
    letter-spacing: -0.02em;
    text-align: justify;
  }
  .body-text mark {
    background: rgba(158, 42, 34, 0.14);
    color: #161412;
    font-weight: 700;
    padding: 1px 3px;
  }
  .byline {
    margin-top: 8px;
    font: 500 12px 'Noto Sans KR', sans-serif;
    color: #6e665b;
  }
</style>
</head>
<body>
  <div class="clipping" id="target">
    <div class="meta-bar">
      <div class="masthead-crop"><img src="data:image/png;base64,${kookjeB64}" /></div>
      <div class="edition-info">2025년 4월 18일 금요일 · 본지 1면 (종합)</div>
    </div>
    <div class="sub-rule">
      <span class="kicker">본지 1면 · 지역 현안과 유학생 유치 정책</span>
      <h1>부산 원도심 빈집, 외국인 유학생<br>기숙사·체육공원 활용</h1>
      <div class="columns">
        <div class="deck">
          <h2>빈집 사회기반시설 조성 사업<br>市, 영도구 2곳·동구 2곳 선정</h2>
          <p>방치된 원도심 빈집을 리모델링해 외국인 유학생 숙소·생활시설로 공급</p>
          <div class="byline">김미희 기자 maha@kookje.co.kr</div>
        </div>
        <div class="body-text">
          부산시가 사회 문제로 떠오른 <mark>원도심 빈집을 외국인 유학생 기숙사와 소규모 체육공원 등으로 활용</mark>한다. 시는 빈집 전문가로 구성된 민관협의체 평가를 거쳐 ‘빈집 사회기반시설 조성 사업’ 대상지 4곳을 최종 선정했다고 17일 밝혔다.
        </div>
      </div>
    </div>
  </div>
</body>
</html>`, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.locator('#target').screenshot({ path: 'public/images/news-kookje-article.png' });

await browser.close();
console.log('Generated print-newspaper style clippings');

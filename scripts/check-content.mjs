import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
assert.equal((html.match(/<section class="slide(?: cover active)?"/g) || []).length, 8, '정확히 8장이어야 함');
assert.equal((html.match(/<img\b/g) || []).length, 3, '표지 기사 캡처 두 장과 캠퍼스 사진 한 장을 배치해야 함');
assert.ok(html.includes('<title>부산 신문 속 유학생</title>'), '새 제목 누락');
assert.ok(html.includes('news-busan-article.png') && html.includes('news-kookje-article.png'), '신문 기사 캡처 누락');
assert.ok(html.includes('busan-newspaper-international-students.pdf'), 'PDF 링크 누락');
for (const term of ['2023.7.1.~2026.6.30.', '2024.3.28.', '부산일보·국제신문', '당사자 발언', '선행연구의 근거', '재현 관점', '집계 후 막대 표시', '집계 후 건수·비율 표시', '집계 후 점과 n/N 표시']) {
  assert.ok(html.includes(term), `필수 내용 누락: ${term}`);
}
assert.ok(html.includes('실제 1면 기사 사례'), '신문 1면 사례 누락');
assert.ok(!/[0-9]+\s*건의 기사/.test(html), '실제 분석 전 가상 기사 수 표시 금지');
console.log('8장, 핵심 내용, 계획 차트 표시 확인 완료');

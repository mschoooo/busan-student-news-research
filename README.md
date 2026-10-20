# 부산 신문 속 유학생

부산일보와 국제신문의 외국인 유학생 보도를 대상으로 한 8장짜리 데이터 분석 계획 슬라이드입니다. 조사 기간은 2023년 하반기부터 2026년 상반기까지이며, 기사량·주제·재현 관점·당사자 발언·기사 유형을 함께 살핍니다. 차트의 빈 칸은 아직 수집·분류하지 않은 결과를 임의로 채우지 않기 위한 계획 표시입니다.

표지의 기사 화면은 2026년 10월 20일 원문 웹페이지에서 일부를 캡처한 것입니다. [부산일보 기사(2025.1.2.)](https://www.busan.com/view/busan/view.php?code=2025010218174626358), [국제신문 1면 기사(2025.4.17.)](https://www.kookje.co.kr/news2011/asp/newsbody.asp?code=0300&key=20250418.22001005833)로 연결됩니다. 부산일보 캡처에서는 제호와 제목을 한 화면에 보이도록 비어 있는 광고 영역을 숨겼습니다. 4장 캠퍼스 사진은 [Donggeon / Wikimedia Commons](https://commons.wikimedia.org/wiki/File:BUFS.jpg)의 [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) 자료로 화면에 맞게 잘랐습니다.

## 실행 및 검증

```bash
npm install
npm test
npm run pdf
npm run preview
node scripts/visual-check.mjs
```

`npm run pdf`는 HTML을 빌드하고 16:9 PDF를 `output/pdf/busan-newspaper-international-students.pdf`에 저장한 뒤 게시용 사본을 `public/`에 둡니다. 화살표·스페이스 키 또는 화면 오른쪽 아래 버튼으로 슬라이드를 이동할 수 있습니다. 게시용 빌드와 PDF를 함께 갱신하려면 `npm run deploy`를 사용합니다.

원본 과제 계획과 문헌고찰 자료는 공개 저장소에 포함하지 않았습니다. 상세 제작 계획은 `slide-production-plan.md`에 있습니다.

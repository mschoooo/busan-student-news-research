# 부산 지역 유학생 보도 분석 계획

데이터리터러시의 이해 중간고사 대체 과제용 8장 HTML 슬라이드덱입니다. 2023년 하반기부터 2026년 상반기까지 부산일보·국제신문의 외국인 유학생 보도를 어떻게 수집·정제·분류·집계할지 설명합니다.

현재는 분석 계획 단계이므로 기사 수나 비율을 표시하지 않습니다. 7장의 차트는 결과가 아니라 축과 계산 방법을 보여주는 설계도입니다. 주제와 별도로 유학생의 지역 자원·지역 구성원 관점이 나타나는지 각각 기록하고, 주제×관점 및 주제·관점별 발언 포함률을 확인하도록 설계를 확장했습니다. 한 기사에 두 관점이 함께 나타나거나 모두 나타나지 않을 수 있습니다. 표본이 적으면 빈 셀의 비율 순위를 만들지 않고 건수와 근거 문장을 검토합니다.

## 이미지와 1면 기사

- 표지 부산 전경: [S h y numis / Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Skyline_of_Busan_Including_Gwangan_Bridge,_Marine_City_and_LCT_Skyscrapers.jpg), [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). 화면 비율에 맞게 잘라 표시했습니다.
- 4장 부산외국어대학교 캠퍼스: [Donggeon / Wikimedia Commons](https://commons.wikimedia.org/wiki/File:BUFS.jpg), [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). 화면 비율에 맞게 잘라 표시했습니다.
- 2장의 [2023년 12월 19일](https://www.kookje.co.kr/news2011/asp/newsbody.asp?code=0300&key=20231219.22001006105), [2025년 4월 17일](https://www.kookje.co.kr/news2011/asp/newsbody.asp?code=0300&key=20250418.22001005833) 국제신문 1면 제목은 분석 대상 예시입니다. 신문 지면과 기사 사진은 복제하지 않았습니다.

장별 이미지 배치 검토는 `slide-production-plan.md`에 기록했습니다.

## 실행

```bash
npm install
npm run dev
```

방향키, 스페이스, 화면 오른쪽 하단 버튼으로 이동합니다. `#1`부터 `#8`까지의 URL 해시로 각 장에 바로 접근할 수 있습니다.

## 빌드와 확인

```bash
npm test
npm run build
npm run preview
node scripts/visual-check.mjs
```

`visual-check.mjs`는 Playwright Chromium으로 8장의 화면과 이동을 확인합니다. 처음 실행할 때는 `npx playwright install chromium`이 필요할 수 있습니다.

## 게시

```bash
npm run deploy
```

빌드 결과를 `gh-pages` 브랜치에 게시합니다. GitHub Pages의 소스는 해당 브랜치의 루트입니다.

제작 내용은 `orca_busan_student_research_slide_plan.md`를 기준으로 구성했습니다. 해당 원문과 문헌고찰 PDF는 로컬 작업 자료이며 공개 저장소에는 포함하지 않았습니다.

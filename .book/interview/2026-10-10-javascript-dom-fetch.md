# 강의 설계 인터뷰 브리프 (JavaScript 기초와 DOM·fetch)
- 날짜: 2026-10-10

## 인터뷰 결과

| 항목 | 내용 |
|---|---|
| 학습목표 | JavaScript 문법을 익힌다. DOM을 제어해 순수 JavaScript와 HTML만으로 fetch(Ajax) 통신하는 프론트엔드를 구현한다. |
| 선수지식 | 아는 것: HTML·CSS 기본 태그와 선택자 / 처음 배우는 것: JavaScript |
| 후속과정 | 있음: React |
| 강의방법 | 이론 중심 + 실습 중심 혼합 (개념 → 코드 예시 → 실습) |
| 반드시 넣을 주제 | 개발 환경(VS Code, 브라우저), Node.js 실행 환경(V8 배경), JavaScript란, 변수(let·const·var), 자료형과 객체, 연산자, 조건문, 배열, 반복문(구구단 패턴), 함수와 화살표 함수, 구조분해 할당, 템플릿 리터럴, 배열 고차 함수(forEach·map·filter), 전개 연산자와 불변성, 불변 업데이트 배열·객체 CRUD, DOM 탐색, DOM 제어(textContent·innerHTML·value·classList·style), DOM 요소 조작(createElement·append·prepend·before·after·remove), 이벤트 처리(이벤트 객체·버블링·위임), 동적 UI(입력·목록·등록·수정·삭제), 이벤트 루프(Call Stack·Web API·Task Queue·setTimeout), 비동기 처리(Promise 개념·async/await·try/catch), CSS Grid(기본 문법·반응형 카드), AJAX와 fetch(HTTP·REST API·JSON), JSONPlaceholder(GET·POST·PUT·DELETE), 게시글 CRUD 프로젝트(목록·등록·수정·삭제·검색·필터링·오류 처리) |
| 빼도 되는 주제 | 클래스와 프로토타입, localStorage, 모듈(import/export), Promise 직접 구현 실습, HTML·CSS 기초(CSS Grid 제외), jQuery·XMLHttpRequest, Node.js 백엔드 서버 작성, TypeScript·번들러 |
| 실행 환경 | 에디터 VS Code, 브라우저 Chrome. 문법 예제는 VS Code 터미널에서 node로 실행한다. DOM 제어부터는 HTML에 script 태그로 넣고 VS Code Live Server로 연다. fetch 실습은 JSONPlaceholder(https://jsonplaceholder.typicode.com)를 쓴다. |

## 미정 항목

- Node.js 버전: 22 LTS로 가정한다.

## 고정 조건

- 목차는 장 > 세부목차 두 단계(파트 없음).
- 이론·실습 중심: 모든 일반 장에 연습문제, 주제 단위가 끝날 때 독립 미니프로젝트 장, 마지막에 기존 미니프로젝트를 조립하는 종합 프로젝트 장.
- 프로젝트형: 각 장에서 프로젝트를 이어 구현하며 개념을 설명. 독립 프로젝트 장 대신 장별 시작 체크포인트 코드 제공. 장 끝에 연습문제.
- 연습문제 형식·프로젝트 소재는 계획서 초안 검토 때 조정.

## 참고 메모

- 강사 개요: https://getinthere.notion.site/3f58a08b6c0d80c385a2e31a211c0ec6 (부산은행 React 과정의 선행 JavaScript 수업)
- DOM과 이벤트 뒤에 미니프로젝트 장을 둔다.
- 개요의 6개 묶음은 파트로 쓰지 않고 장 순서 참고용으로만 쓴다.
- Promise는 개념만 다루고 직접 구현 실습은 하지 않는다.
- 불변성·전개 연산자·고차 함수는 후속 React 과정의 기반이다.
- 프로젝트 화면 배치는 CSS Grid로만 구현한다. flex는 쓰지 않는다.
- 공통 디자인은 DOM 제어 미니프로젝트, 마지막 CRUD 프로젝트, 모든 실습에 똑같이 쓴다.
- 기본 CSS 파일 하나를 미리 만들어 처음부터 연결해 준다.
- 이 CSS 파일의 내용은 처음에 설명하지 않는다. CSS Grid 장에서 Grid 배치와 함께 풀어 설명한다.
- 디자인 참고: c:\Users\ssarm\Documents\Lightshot\Screenshot_51.png (레이아웃 말고 스타일만)
  - 색상은 흑백만 쓴다. 흰 바탕, 검정 글자, 보조 글자와 구분선은 회색이다.
  - 본문은 산세리프 글꼴이다. 라벨은 작은 회색 고정폭(mono) 글꼴로 "제목 / TITLE"처럼 한글 / 영문 대문자로 쓴다.
  - 카드는 검정 1px 테두리에 둥근 모서리를 쓰고 안쪽에 옅은 점 격자 배경을 깐다.
  - 버튼과 입력칸은 알약 모양(pill) 테두리다. 선택된 버튼은 검정 바탕에 흰 글자다.
  - 카드 위 상태 배지는 검정 알약 모양에 흰 글자다.
  - 제목 입력칸은 테두리 없이 밑줄 하나만 쓴다.
  - 진행 막대는 옅은 회색 줄 위에 검정 줄을 겹친다.

# 원고 과정 설정: JavaScript 기초와 DOM·fetch

- 강의계획서: .book/syllabus/2026-10-10-javascript-dom-fetch.md

## 실행 환경

- 에디터: VS Code + Live Server 확장, 브라우저 Chrome
- 실행 방법: .js는 VS Code 터미널에서 node 파일명.js, .html은 Live Server로 열고 Chrome 개발자 도구 Console 탭에서 확인
- 버전: Node.js 22 LTS
- 예제 형태 규칙: 2~9장 문법은 단일 .js, 10장부터 DOM은 단일 .html(script 태그 + 공통 CSS 연결), 1장은 둘 다
- 16·17장은 .js(node), 16-4와 18~20장은 .html. 18-3 JSON 예제는 .js로 써도 된다
- HTML 예제는 매번 전체 파일을 싣는다. 프로젝트 장(9·14·20)은 단계마다 전체 파일을 둔다

## 실습 파일 규칙

- 과정 폴더 js-course/ 아래 장별 chapter01, chapter02 …
- VS Code는 js-course 폴더를 연다. Live Server 주소는 http://127.0.0.1:5500/chapterNN/파일명
- 공통 CSS는 js-course/css/common.css 한 개, HTML에서 ../css/common.css로 연결
- common.css 전체 코드는 1장 1-3 따라하기에 싣는다. 내용 설명은 15장에서 한다

## 예제 도메인

- 일반 예제: 상품·회원·성적·장바구니 같은 일상 소재(계획서 실습 소재를 따름)
- 프로젝트: 할 일 관리(9장 콘솔, 14장 보드), 게시글 관리(20장, JSONPlaceholder)

## 코드 컨벤션 예외

- var는 쓰지 않는다
- catch의 오류 메시지도 innerHTML로 화면에 넣는다(textContent는 꼭 필요할 때만, 18~20장)
- JSONPlaceholder 자원은 본문에서 "게시글"로 부른다("글"과 섞지 않음)
- 객체 리터럴 단축 속성({ title, content })은 쓰지 않는다. title: title처럼 쓴다. 구조분해와 계산된 속성 이름 [key]는 쓴다(2026-10-10)
- 화면 배치는 CSS Grid만 쓴다(flex 금지)
- HTML의 script 태그는 모든 장에서 body 닫는 태그 바로 앞에 둔다. defer는 src로 연결한 외부 파일에만 적용되고 단일 .html의 인라인 script에는 효과가 없기 때문이다(2026-10-10 바꿈, 전에는 "10장부터 head에 defer")
- defer와 head 위치는 10-1에서 외부 파일 예시로 비교만 한다. 예제에 `<script defer>`와 DOMContentLoaded는 쓰지 않는다

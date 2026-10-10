# 원고 진행 장부: JavaScript 기초와 DOM·fetch

## 장별 기록

### 1장. JavaScript 시작하기

- 상태: 확정
- 파일: book/01장-JavaScript-시작하기.md, 결과 캡처 book/images/01/
- 설명한 개념: JavaScript, JavaScript 엔진, V8, Node.js(실행 환경), Live Server, 콘솔, 문자열(정의만), 문장과 세미콜론, 실행 순서(위에서 아래), 주석, 개발자 도구와 Console 탭
- 쓴 문법과 API: console.log(값), console.log(값1, 값2), // 주석, node 파일명.js, cd, node --version
- 프로젝트 파일과 이름: js-course/css/common.css(공통 CSS 전체), chapter01/hello.js, index.html(HTML 틀), print.js, print.html
- 공통 CSS 클래스: page, form, button-group, card-list, label, muted, divider, card, badge, btn, btn.selected, input, title-input, progress, progress-bar
- 강사 메모: CSS는 1장에 전체 코드를 싣는 방식(가). 막히는 지점·비유 요청 없음. 1-1 시연 예제와 연습문제 2 처리는 제안대로 진행
- 검토 피드백(스킬에 반영함): 뒤 장 예고 금지, 스크린샷 자리는 별도 문단, 실행 방법·결과 짝짓기, 페이지 결과는 회색 테두리 상자 캡처

### 2장. 변수와 자료형

- 상태: 초안
- 파일: book/02장-변수와-자료형.md (캡처 없음, 모두 node 실행)
- 설명한 개념: 변수, 선언, 할당(= 의 뜻), 카멜 표기법과 이름 규칙, 재할당, let과 const(이름표 비유: let=포스트잇, const=고정 명판), 자료형, 원시 자료형 5종(number·string·boolean·undefined·null), 연산자(정의만), typeof, 문자열과 숫자의 차이, undefined와 null의 차이, typeof null이 object인 점, 템플릿 리터럴과 ${}, 여러 줄 문자열, 객체, 속성·키·값, 점 표기법, 대괄호 표기법(변수 키), 속성 추가·수정(같은 = 문법), const 객체의 속성 변경(명판 비유: 명판은 상자에 고정, 상자 안은 바꿀 수 있음), delete, 없는 속성은 undefined
- 쓴 문법과 API: let, const, 재할당, typeof, 템플릿 리터럴(`${}` 안에 typeof 같은 식도 씀), 객체 리터럴(마지막 속성 뒤 쉼표 없음), obj.key, obj["key"], obj[변수], obj.key = 값, delete obj.key
- 프로젝트 파일과 이름: chapter02/ variable.js, reassign.js, const.js, typeof.js, string-number.js, empty-value.js, template.js, multiline.js, product.js(따라하기), object.js, bracket.js, object-update.js, object-delete.js, member.js(따라하기), receipt.js, book.js(연습문제). 주요 변수: productName, price, stock, shopName, member{id,name,age,grade,isAdmin,email}
- 강사 메모: 요청 — const를 비유로 설명하고 let과의 차이를 보여 달라. 이름표 비유로 2-1과 2-4를 잇는다. const 재할당 에러는 실행해 보이지 않음(에러 시연 금지 원칙). 연산자(+ 계산)는 쓰지 않고 합계도 값으로 넣음
- 터미널 위치: 새 터미널은 js-course에서 열리므로 cd chapter02 안내

## 앞으로 미룬 설명

- document.querySelector, textContent → 10장
- addEventListener, 화살표 함수 형태(예제 1-1) → 12장, 5장
- null 여부 확인(=== null) → 3장
- 숫자 계산(+, * 등)과 문자열 + 연결 → 3장
- script 위치와 defer → 10장
- common.css 내용 해설 → 15장
- 화면 글자를 JavaScript로 바꾸기(연습문제 2 해설) → 10장

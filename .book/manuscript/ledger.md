# 원고 진행 장부: JavaScript 기초와 DOM·fetch

## 장별 기록

### 1장. JavaScript 시작하기

- 상태: 확정 (2026-10-10 새 규칙으로 다시 씀. 왜 필요할까: JavaScript, Node.js, console.log. 특징: console.log. 비교표: HTML·CSS·JavaScript, 브라우저와 Node.js, node와 브라우저 출력 위치. 코드와 캡처는 그대로)
- 파일: book/01장-JavaScript-시작하기.md, 결과 캡처 book/images/01/
- 설명한 개념: JavaScript, JavaScript 엔진, V8, Node.js(실행 환경), Live Server, 콘솔, 문자열(정의만), 문장과 세미콜론, 실행 순서(위에서 아래), 주석, 개발자 도구와 Console 탭
- 쓴 문법과 API: console.log(값), console.log(값1, 값2), // 주석, node 파일명.js, cd, node --version
- 프로젝트 파일과 이름: js-course/css/common.css(공통 CSS 전체), chapter01/hello.js, index.html(HTML 틀), print.js, print.html
- 공통 CSS 클래스: page, form, button-group, card-list, label, muted, divider, card, badge, btn, btn.selected, input, title-input, progress, progress-bar
- 강사 메모: CSS는 1장에 전체 코드를 싣는 방식(가). 막히는 지점·비유 요청 없음. 1-1 시연 예제와 연습문제 2 처리는 제안대로 진행
- 검토 피드백(스킬에 반영함): 뒤 장 예고 금지, 스크린샷 자리는 별도 문단, 실행 방법·결과 짝짓기, 페이지 결과는 회색 테두리 상자 캡처. 3장 때 개념 그림·생성 이미지에도 같은 테두리를 붙이도록 넓힘(2장 const-object.png 다시 캡처)

### 2장. 변수와 자료형

- 상태: 확정 (새 규칙으로 다시 씀)
- 파일: book/02장-변수와-자료형.md, 개념 그림 book/images/02/const-object.png(원본 .book/figures/02/const-object.html), 생성 이미지 자리 images/02/let-const-analogy.png(아직 없음)
- 새 규칙 적용: 왜 필요할까(변수, const, 자료형, 템플릿 리터럴, 객체), 특징(재할당, const, typeof, 템플릿 리터럴, 객체, const 객체, delete), 비교표(let과 const, undefined와 null, 큰따옴표 문자열과 템플릿 리터럴, 점 표기법과 대괄호 표기법)
- 설명한 개념: 변수, 선언, 할당(= 의 뜻), 카멜 표기법과 이름 규칙, 재할당, let과 const(이름표 비유: let=포스트잇, const=고정 명판), 자료형, 원시 자료형 5종(number·string·boolean·undefined·null), 연산자(정의만), typeof, 문자열과 숫자의 차이, undefined와 null의 차이, typeof null이 object인 점, 템플릿 리터럴과 ${}, 여러 줄 문자열, 객체, 속성·키·값, 점 표기법, 대괄호 표기법(변수 키), 속성 추가·수정(같은 = 문법), const 객체의 속성 변경(명판 비유: 명판은 상자에 고정, 상자 안은 바꿀 수 있음), delete, 없는 속성은 undefined
- 쓴 문법과 API: let, const, 재할당, typeof, 템플릿 리터럴(`${}` 안에 typeof 같은 식도 씀), 객체 리터럴(마지막 속성 뒤 쉼표 없음), obj.key, obj["key"], obj[변수], obj.key = 값, delete obj.key
- 프로젝트 파일과 이름: chapter02/ variable.js, reassign.js, const.js, typeof.js, string-number.js, empty-value.js, template.js, multiline.js, product.js(따라하기), object.js, bracket.js, object-update.js, object-delete.js, member.js(따라하기), receipt.js, book.js(연습문제). 주요 변수: productName, price, stock, shopName, member{id,name,age,grade,isAdmin,email}
- 강사 메모: 요청 — const를 비유로 설명하고 let과의 차이를 보여 달라. 이름표 비유로 2-1과 2-4를 잇는다. const 재할당 에러는 실행해 보이지 않음(const의 목적이 에러를 막는 것이 아니므로 특징 문장으로만). 연산자(+ 계산)는 쓰지 않고 합계도 값으로 넣음
- 터미널 위치: 새 터미널은 js-course에서 열리므로 cd chapter02 안내

### 3장. 연산자와 조건문

- 상태: 확정 (2026-10-10 검수 10건 반영, 보고서 .book/review/03장-검수.md)
- 파일: book/03장-연산자와-조건문.md, 개념 그림 book/images/03/array-index.png(원본 .book/figures/03/array-index.html)
- 구성 변경(강사 요청): 3-1 객체와 배열 기초를 앞에 새로 두고, truthy·falsy를 if 뒤(3-4)로 옮김. 옵셔널 체이닝은 3-5. 계획서 3장과 4-1 설명을 함께 고침
- 새 규칙 적용: 왜 필요할까(배열, 조건문, 옵셔널 체이닝), 특징(배열, 산술 연산자, ++, if, 삼항, truthy·falsy, ?.), 비교표(객체와 배열, ==와 ===, if·else와 삼항, &&와 ||, ||와 ??)
- 설명한 개념: 중첩 객체, 배열, 인덱스(0부터), 요소, length, 없는 인덱스는 undefined, 객체를 담은 배열(사물함 비유), 산술 연산자와 계산 순서·괄호, 나머지 %, 문자열 연결(+), 증가 연산자 ++와 --(개념만), 비교 연산자, ==와 ===(이 책은 === 만 씀), === null 확인, 논리 연산자 && || !, 조건문, 블록, if, else, else if(위에서부터 처음 true인 블록 하나), 삼항 연산자, truthy·falsy(falsy 다섯: false, 0, "", null, undefined. [] {}는 truthy), 단축 평가(&&·||는 양쪽 값 중 하나를 돌려줌), 기본값, 널 병합 연산자 ??, 옵셔널 체이닝 ?.(예제 3-18에서 TypeError를 실제로 내 보이고 3-19에서 ?.로 막음), TypeError와 에러 위치 읽기(이 예제 범위만)
- 쓴 문법과 API: 배열 리터럴 [], 배열[인덱스], 배열.length, obj.a.b, arr[0].key, + - * / %, 변수++, > < >= <= === !==, == (비교 설명용 1회), && || !, if / else if / else, 조건 ? 값 : 값, 값 || 기본값, 조건 && 값, 값 ?? 기본값, obj.key?.key, arr[0]?.key, ${} 안의 계산식과 삼항
- 프로젝트 파일과 이름: chapter03/ optional-error.js(에러 시연), nested.js, array.js, object-array.js, arithmetic.js, concat.js, increment.js, compare.js, strict-equal.js, logical.js, if.js, if-else.js, else-if.js, ternary.js, grade.js(따라하기), truthy.js, or-default.js, and-value.js, nullish.js, optional.js, optional-default.js, order.js(따라하기), ticket.js, login.js(연습문제). 주요 이름: cart, products{name,price}, member.address{city,zipCode}, stock, purchaseAmount, grade, student{name,scores}, order{id,customer{name,nickname},items,coupon}, user{name,nickname,isAdmin}
- 강사 메모: += 는 쓰지 않음(합계는 total = a + b 꼴). ++는 개념만. 배열은 만들고 꺼내 쓰는 데까지(값 바꾸기·push 없음). 블록 안 const 선언은 쓰지 않음(스코프 제외 과정)
- 검증: node v24.13.0으로 예제·실습·바꿔 보기·정답 전부 실행. Mermaid 4개 --format none으로 재서 모두 가로 배치, 글자 13.3px 이상

## 앞으로 미룬 설명

- document.querySelector, textContent → 10장
- addEventListener, 화살표 함수 형태(예제 1-1) → 12장, 5장
- script 위치와 defer → 10장
- common.css 내용 해설 → 15장
- 화면 글자를 JavaScript로 바꾸기(연습문제 2 해설) → 10장
- 함수 호출에 쓰는 옵셔널 체이닝 ?.() → 5장
- 배열 push·pop, 요소 바꾸기 → 4장 4-1(만들기·꺼내기는 3장에서 끝남)
- 합계 누적은 += 없이 total = total + 값 꼴로 → 4장

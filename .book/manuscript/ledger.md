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

### 4장. 배열과 반복문

- 상태: 확정 (2026-10-10 검수 8건 반영, 보고서 .book/review/04장-검수.md)
- 파일: book/04장-배열과-반복문.md, 개념 그림 book/images/04/push-pop.png(원본 .book/figures/04/push-pop.html)
- 구성 변경(강사 요청): 구구단은 패턴 찾기로 가르친다. 4-2 뒤 따라하기 "구구단 2단 출력하기"를 1단계 직접 적기 → 2단계 바뀌는 수(곱하는 수)를 변수 num으로 → 3단계 for에 넣기로 진행. 2~9단(중첩 for)은 연습문제 1에서 "단이 바뀌는 수"를 찾아 직접 푼다. 중첩 반복문 용어는 정답 해설에서 정의
- 새 규칙 적용: 왜 필요할까(반복문), 특징(요소 바꾸기, push·pop, for, for...of), 비교표(push와 pop, for와 for...of)
- 설명한 개념: 요소 바꾸기(const 배열도 가능, 2장 명판 비유 이어 씀), 메서드(값에 딸린 명령, console.log도 메서드), push(끝에 넣기), pop(끝 요소 빼서 돌려줌), 반복문, for의 세 부분(시작값·조건·증감), 반복 변수, 회차, 관례 이름 i, i < 배열.length, 반복하며 합계 구하기(0에서 시작, total = total + 값), 패턴 찾기(바뀌는 수 → 변수 → 반복문), for...of(요소를 변수에 담음, const 선언, 단수형 이름), 객체 배열 돌기, 반복문 안의 if와 개수 세기(count++), 중첩 반복문(정답 해설), 최댓값 구하기(첫 요소에서 시작, 정답 해설)
- 쓴 문법과 API: 배열[인덱스] = 값, 배열.push(값), const 변수 = 배열.pop(), for (let i = 0; i < 배열.length; i++), 변수++ 실사용, for (const 요소 of 배열), 블록 안 if, 중첩 for
- 프로젝트 파일과 이름: chapter04/ array-update.js, push.js, pop.js, for.js, for-array.js, for-sum.js, gugudan-1.js·gugudan-2.js·gugudan-3.js(따라하기), for-of.js, object-loop.js, stock-check.js, cart-total.js(따라하기), gugudan-all.js, score-stats.js(연습문제). 주요 이름: cart, removedItem, studentNo, i, steps, totalSteps, num, dan, products{name,price,stock}, product, soldOutCount, cartItems{name,price,quantity}, item, totalPrice, totalQuantity, shippingFee, scores, total, maxScore, average
- 강사 메모: break·continue는 다루지 않음. 블록 안 const 선언은 여전히 쓰지 않음(소계는 item.price * item.quantity를 그 자리에서 계산). 구구단 변수는 강사 설명의 a 대신 num·dan
- 검증: node v24.13.0으로 예제·실습·바꿔 보기·코드 조각·정답 전부 실행. Mermaid 2개 --format none으로 재서 모두 가로 배치(재고 확인 그림은 처음에 세로로 뒤집혀 한 회차 분기만 그리도록 줄임), 글자 13.4px 이상. check-markdown 0건

### 5장. 함수와 화살표 함수

- 상태: 확정 (2026-10-10 검수 1차 6건, 2차 4건 반영, 보고서 .book/review/05장-검수.md)
- 파일: book/05장-함수와-화살표-함수.md, 개념 그림 book/images/05/function-io.png(원본 .book/figures/05/function-io.html)
- 구성(강사 답 "없음", 추천안 반영): 5-2 뒤 따라하기 "장바구니 계산을 함수로 나누기" 추가(4장 cart-total.js를 함수 네 개로). 5-3 끝에 ?.() (예제 5-8에서 TypeError를 실제로 내고 5-9에서 막음). 계획서의 let hello = function 은 const로 씀
- 새 규칙 적용: 왜 필요할까(함수, 반환값, 화살표 함수). 일급 객체는 정의 → 특징 세 가지 → 특징마다 예제로 씀(강사 지적: 세 조건은 정의가 아니라 특징, 좋은 점 절은 뺌), 특징(선언과 호출, 매개변수, return, 기본값 매개변수, 콜백, ?.(), 익명 함수, 화살표 함수), 비교표(매개변수와 인수, console.log와 return, 함수 이름과 호출, 함수 선언문과 함수 표현식, 블록 모양과 값 하나 모양), 비유(반환값 = 주문 금액 계산기). 개념 그림은 가로 배치로 줄임(높이 580 → 300)
- 스킬 되돌림(2026-10-10): 요소 조합 방식으로 바꾼 style-guide·few-shot을 4장 때(851bc46)로 되돌림. SKILL.md는 목차 변경 절차만 남김(f628517). 5장은 되돌린 기준에 맞춰 5-2 반환값과 5-5 비교표를 되살림. 바꿨던 내용은 .book/review/backup/skills-20261010.patch
- 설명한 개념: 함수, 함수 선언, 호출, 호출 뒤 돌아옴, 메서드는 값에 딸린 함수(console.log 포함), 매개변수, 인수, return, 반환값, return이 함수를 끝냄, return 없으면 undefined, 함수 안 변수(그 함수 안에서만, 호출마다 새로. 스코프 용어는 안 씀), 기본값 매개변수(인수 없으면 undefined), 일급 객체, 함수 자체와 호출 결과, typeof 함수는 function, 콜백 함수, 고차 함수, 옵셔널 호출 ?.(), TypeError is not a function, 함수 선언문, 익명 함수, 함수 표현식, 선언문은 위에서 호출 가능(표현식은 불가, 실행해 보이지 않음), 화살표 함수 두 모양(블록·값 하나), 매개변수 괄호는 항상 씀, 객체를 돌려줄 때 ({ })
- 쓴 문법과 API: function 이름(매개변수) {}, return, 매개변수 = 기본값, const 이름 = 함수이름, 함수를 인수로 넘기기, 콜백매개변수(인수), 함수?.(), const 이름 = function () {};, 인수 자리 익명 함수, (매개변수) => {}, (매개변수) => 값, () => ({ 속성: 값 }), 중첩 호출 f(g(x)), ${} 안 함수 호출, 함수 블록 안 let·const 선언
- 프로젝트 파일과 이름: chapter05/ function.js, parameter.js, return.js, average.js, default-parameter.js, cart-function.js(따라하기), function-value.js, callback.js, return-function.js, callback-error.js(에러 시연), optional-call.js, anonymous.js, anonymous-callback.js, arrow.js, arrow-callback.js, arrow-object.js, three-ways.js(따라하기), discount.js, count-if.js(연습문제). 주요 함수: printNotice, printOrder, getSubtotal(price, quantity = 1), getAverage, getTotalPrice(items), getShippingFee(totalPrice, freeLimit = 30000), printReceipt, printProducts(items, format), formatWithPrice, formatNameOnly, getFormatter(showPrice), placeOrder(productName, onComplete), sendMessage, greet, formatPrice, createProduct, formatDeclaration·formatExpression·formatArrow, getDiscountPrice(price, rate = 10), countIf(items, check)
- 강사 메모: 막히는 지점·비유 요청 없음. 함수 안 변수 선언은 이 장부터 씀(블록 안 const 금지는 if·for 블록에만 남음). 속성 줄임 표기 { name }은 쓰지 않고 name: name
- 검증: node v24.13.0으로 예제 19개·바꿔 보기 4개·코드 조각 실행. Mermaid 3개 --format none으로 재서 모두 가로(글자 12.3px 이상). 개념 그림 PNG 열어 확인. check-markdown 0건

## 앞으로 미룬 설명

- document.querySelector, textContent → 10장
- addEventListener → 12장 (예제 1-1의 () => {} 형태는 5장 5-5에서 설명함)
- script 위치와 defer → 10장
- common.css 내용 해설 → 15장
- 화면 글자를 JavaScript로 바꾸기(연습문제 2 해설) → 10장
- 합계 누적은 += 없이 total = total + 값 꼴로 씀. 2026-10-10 끝까지 쓰지 않기로 확정
- 객체 리터럴 단축 문법(단축 속성 { name }, 계산된 속성 이름 [key]) → 6장 6-1 (2026-10-10 계획서에 추가). 5장 예제 5-14의 name: name을 6-1 도입 예시로 이어 씀
- 입력칸 여러 개를 함수 하나로 처리 → 6-1([key]), 6-5({ ...원본, [key]: 값 }), 12-2(e.target.name·value), 13-3(조립). React 모양(setPost, prev)은 쓰지 않고 input 이벤트 + post = { ...post, [e.target.name]: e.target.value } + render로 쓴다(강사 요청). 계획서에 항목마다 "이유" 줄을 둠. 원고 "왜 필요할까"는 그 이유를 따른다
- slice → 7장 7-6 (concat·splice는 다루지 않음)
- 2026-10-10 계획서 1~5장을 원고에 맞춰 동기화: 실습 이름(1-3, 3-5, 4-2, 5-2 추가분), 원고에서 더 다룬 내용(요소 바꾸기, 합계, 반복문 안 if, 함수 안 변수, 콜백·고차 함수, ?.(), 함수 표현식, ({ })), 5-4·5-5 예시 let → const. 제목·번호·연습문제는 원래 같았음
- 2026-10-10 6~20장 목차와 규칙을 강사와 장마다 정해 계획서에 반영함. 공통 규칙은 계획서 가정한 것의 "6~20장 결정", 장별 결정은 세부목차에 있다. 바꾸기 전 계획서는 .book/review/backup/syllabus.20261010-pre-batch.md
- 6~20장 장별 질문(막히는 지점·비유·비중)은 이 결정으로 대신한다. 원고 작성 때 다시 묻지 않는다

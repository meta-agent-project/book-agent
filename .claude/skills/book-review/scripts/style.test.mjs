import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync, unlinkSync, rmdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { checkPreservation, inspectStyle } from "./style-core.mjs";
const original = '# 5장. State\n\n## 5-1 State 업데이트\n\n이전 장에서 `prevCount`를 썼습니다.\n앞 함수가 돌려준 값이 다음 함수의 `prevCount`로 들어가므로 1씩 세 번 늘어납니다.\n\n```jsx\nsetCount((prevCount) => prevCount + 1);\n```\n\n⟦CODE 1⟧\n\n- 숫자는 3입니다.\n';
test("명확한 개념·비교·실습 제목 허용", () => {
  for (const title of ["State란?", "Props란?", "불변성이란?", "CSR과 SSR 비교", "회원 등급 변경 실습"]) assert.equal(inspectStyle(`# ${title}`).findings.length, 0);
});
test("구어체와 모호한 제목은 검토 후보", () => {
  for (const title of ["State 알아보기", "함께 해 봅시다", "어떻게 해야 할까요?"]) assert.ok(inspectStyle(`# ${title}`).findings.some((f) => f.rule === "T-WORDING"));
});
test("상위 개념 반복은 판정 없이 후보로 표시", () => assert.ok(inspectStyle('# React의 렌더링 원리\n\n## React의 렌더링 원리 살펴보기').findings.some((f) => f.rule === "T-PARENT")));
test("회상·예고·상투구 탐지, 코드 안은 제외", () => {
  assert.ok(inspectStyle(original).findings.some((f) => f.rule === "S-CHAPTER"));
  assert.equal(inspectStyle('```text\n다음 장에서 알아보겠습니다.\n```').findings.length, 0);
  assert.ok(inspectStyle('이에 대해 알아보겠습니다.').findings.some((f) => f.rule === "S-META"));
});
test("긴 문장의 보호 영역은 음절 수에서 제외", () => {
  assert.ok(inspectStyle('가'.repeat(41) + '합니다.').findings.some((f) => f.rule === "S-LONG"));
  assert.equal(inspectStyle('`' + '가'.repeat(41) + '`입니다.').findings.length, 0);
});
test("학습목표 반복 제외, 본문 가능성 반복 탐지", () => {
  const repeated = '- 할 수 있습니다.\n'.repeat(5);
  assert.ok(inspectStyle('## 내용\n\n' + repeated).findings.some((f) => f.rule === "S-REPEAT-CAN"));
  assert.equal(inspectStyle('**학습목표**\n\n' + repeated).findings.length, 0);
});
test("자연스러운 문장과 그대로인 원고 통과", () => assert.equal(checkPreservation(original, original).passed, true));
test("문장 분리·장 안내 번호 제거·prevCount 표현 교정 허용", () => {
  const changed = original.replace('이전 장에서 `prevCount`를 썼습니다.', '`prevCount`는 이전 상태 값입니다.').replace('앞 함수가 돌려준 값이 다음 함수의', '이전 함수가 돌려준 값이 다음 함수의');
  assert.equal(checkPreservation(original, changed).passed, true);
  assert.equal(checkPreservation('3장에서 State를 배웠습니다.\n이 값은 3입니다.', 'State를 사용합니다.\n이 값은 3입니다.').passed, true);
});
test("코드 공백·인라인 코드·출력·인용 변조 실패", () => {
  for (const [from, to] of [['=> prevCount', '=>  prevCount'], ['`prevCount`', '`count`'], ['```jsx', '```text']]) assert.equal(checkPreservation(original, original.replace(from, to)).passed, false);
  for (const source of ['```text\n3\n```', '출력은 "안녕"입니다.']) assert.equal(checkPreservation(source, source.replace(/3|안녕/, '4')).passed, false);
});
test("숫자·영문 명칭·지정 고유명사 변조 실패", () => {
  assert.equal(checkPreservation('예제 3개입니다.', '예제 4개입니다.').passed, false);
  assert.equal(checkPreservation('예제 2-3에서 상태가 바뀝니다.', '상태가 바뀝니다.').passed, true);
  assert.equal(checkPreservation(original, original.replace('숫자는 3', '숫자는 4')).passed, false);
  assert.equal(checkPreservation('React를 씁니다.', 'Redux를 씁니다.').passed, false);
  assert.equal(checkPreservation('부산은행 키트입니다.', '다른은행 키트입니다.', ['부산은행']).passed, false);
});
test("가림표 문단 이동·제목 변경·문단 순서 변경 실패", () => {
  assert.equal(checkPreservation(original, original.replace('⟦CODE 1⟧\n\n- 숫자는 3입니다.', '- 숫자는 3입니다.\n\n⟦CODE 1⟧')).passed, false);
  assert.equal(checkPreservation(original, original.replace('State 업데이트', 'State 변경')).passed, false);
  assert.equal(checkPreservation('`a`입니다.\n\n`b`입니다.', '`b`입니다.\n\n`a`입니다.').passed, false);
  assert.equal(checkPreservation('첫 설명입니다.\n\n다음 설명입니다.', '다음 설명입니다.\n\n첫 설명입니다.').passed, false);
});
test("목록·표 구조 및 긴 펜스·CRLF 처리", () => {
  assert.equal(checkPreservation('- 긴 문장입니다. 이어 설명합니다.', '- 긴 문장입니다.\n  이어 설명합니다.').passed, true);
  assert.equal(checkPreservation('- 첫 항목\n- 다음 항목', '첫 항목\n다음 항목').passed, false);
  assert.equal(checkPreservation('| A | B |', '| A | B | C |').passed, false);
  const fenced = '````text\n```\n문장입니다.\n````';
  assert.equal(checkPreservation(fenced, fenced.replace('문장', '수정')).passed, false);
  assert.equal(checkPreservation(original, original.replace(/\n/g, '\r\n')).passed, true);
});
test("같은 종결 표현과 호명 반복 검토", () => {
  assert.ok(inspectStyle('실행합니다.\n'.repeat(5)).findings.some(f=>f.rule==='S-ENDING'));
  assert.ok(inspectStyle('여러분은 읽습니다. 여러분은 실행합니다.').findings.some(f=>f.rule==='S-ADDRESS'));
});
test("보존 CLI는 실제 파일을 비교하고 실패 시 1을 반환", () => {
  const folder=mkdtempSync(join(tmpdir(),'book-style-'));
  const before=join(folder,'before.md'),after=join(folder,'after.md');
  const script=fileURLToPath(new URL('./check-preservation.mjs',import.meta.url));
  try {
    writeFileSync(before,original);writeFileSync(after,original);
    let result=spawnSync(process.execPath,[script,before,after,'--json'],{encoding:'utf8'});
    assert.equal(result.status,0);assert.equal(JSON.parse(result.stdout).passed,true);
    writeFileSync(after,original.replace('=> prevCount','=>  prevCount'));
    result=spawnSync(process.execPath,[script,before,after,'--json'],{encoding:'utf8'});
    assert.equal(result.status,1);assert.equal(JSON.parse(result.stdout).passed,false);
  }finally{unlinkSync(before);unlinkSync(after);rmdirSync(folder);}
});

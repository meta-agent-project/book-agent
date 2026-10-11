import { isDeepStrictEqual } from "node:util";

// Keep literal bytes for preservation; normalize only line separators while parsing.
const inlinePattern = /(`+)(?!`)([\s\S]*?[^`])\1(?!`)|⟦CODE\s+\d+⟧|!?\[[^\]\n]*\]\([^\n)]*\)|https?:\/\/[^\s<>]+|"[^"\n]*"|“[^”\n]*”|‘[^’\n]*’|「[^」\n]*」/g;
export function literals(text) {
  return [...text.matchAll(inlinePattern)].map((m) => m[0]);
}
export function plain(text) {
  return text.replace(inlinePattern, (value) => " ".repeat(value.length)).replace(/\*\*/g, "  ");
}
export function blocks(text) {
  const lines = text.split(/\r\n|\n|\r/);
  const result = [];
  let i = 0;
  while (i < lines.length) {
    const start = i, line = lines[i];
    if (!line.trim()) { i++; continue; }
    const fence = line.match(/^\s*(`{3,}|~{3,})/);
    if (fence) {
      const close = new RegExp(`^\\s*${fence[1][0]}{${fence[1].length},}\\s*$`);
      i++;
      while (i < lines.length && !close.test(lines[i])) i++;
      if (i < lines.length) i++;
      result.push({ type: "code", line: start + 1, text: lines.slice(start, i).join("\n") });
      continue;
    }
    const heading = line.match(/^(#{1,6})\s+(.+)$/);
    const list = line.match(/^(\s*(?:[-*+]|\d+[.)])\s+)/);
    const type = heading ? "heading" : /^\s*\|/.test(line) ? "table" : list ? "list" : /^\s*>/.test(line) ? "quote" : /^\s*(?:---+|\*\*\*+)\s*$/.test(line) ? "rule" : "prose";
    i++;
    if (type === "list") {
      while (i < lines.length && /^\s+\S/.test(lines[i]) && !/^\s*(?:`{3,}|~{3,}|[-*+]\s|\d+[.)]\s|\|)/.test(lines[i])) i++;
    }
    if (type === "prose") {
      while (i < lines.length && lines[i].trim() && !/^\s*(?:`{3,}|~{3,}|#{1,6}\s|[-*+]\s|\d+[.)]\s|\||>|---+\s*$)/.test(lines[i])) i++;
    }
    result.push({ type, line: start + 1, text: lines.slice(start, i).join("\n"), level: heading?.[1].length, prefix: list?.[1] });
  }
  return result;
}
export function sentences(text) {
  // A dot in Node.js, a version or a path is not a Korean sentence boundary.
  return text.match(/[^]*?[가-힣][.!?](?=\s|$)|[^]+$/g) ?? [];
}
const recall = /(?:\d+(?:\s*[·,~～–-]\s*\d+)*\s*장(?:에서|의|과|에|은|을|까지|부터)?|(?:이전|앞|다음|뒤)\s*장|앞\s*과정|앞(?:서|에서)\s*배|이전에\s*배)/;
export function inspectStyle(text) {
  const findings = [], outline = [], stack = [];
  let section = "", canCount = 0, canLine = 0, previousEnding = "", endingCount = 0, objective = false;
  const add = (rule, block, detail, severity = "review") => findings.push({ rule, line: block.line, section, detail, severity });
  const flush = () => { if (canCount > 4) findings.push({ rule: "S-REPEAT-CAN", line: canLine, section, detail: `~할 수 있습니다 ${canCount}회`, severity: "review" }); canCount = 0; };
  for (const block of blocks(text)) {
    if (block.type === "heading") {
      if (block.level <= 2) { flush(); section = block.text; }
      objective = false; previousEnding = ""; endingCount = 0;
      const title = block.text.replace(/^#+\s*/, "");
      outline.push({ line: block.line, title });
      if (/(?:해\s*봅시다|하기|합니다|알아보기|살펴보기|이해하기)[.!?]?\s*$/.test(title) || /어떻게\s*(?:해야|할).*까요/.test(title)) add("T-WORDING", block, title);
      if ((title.match(/[가-힣]/g) ?? []).length > 40) add("T-LENGTH", block, title);
      const parent = stack[block.level - 2];
      if (parent && !["연습문제", "정답과 해설"].includes(parent)) {
        const concept = parent.replace(/^(?:\d+장\.|\d+-\d+)\s*/, "");
        if (concept.length > 2 && title.includes(concept)) add("T-PARENT", block, `상위 제목 '${concept}' 반복: 구분에 필요한지 판단`);
      }
      stack.length = block.level - 1; stack[block.level - 1] = title;
      continue;
    }
    if (["code", "quote", "rule"].includes(block.type)) { previousEnding = ""; endingCount = 0; continue; }
    if (/^\*\*학습목표\*\*$/.test(block.text.trim())) { objective = true; continue; }
    const masked = plain(block.text);
    if (recall.test(masked)) add("S-CHAPTER", block, block.text);
    if (/에\s*대해\s*알아보겠습니다|라고\s*할\s*수\s*있습니다|함께\s*알아볼까요|완벽히\s*이해했습니다/.test(masked)) add("S-META", block, block.text);
    if (/에\s*있어서|(?:을|를)\s*진행(?:합니다|하다|하겠습니다)|되어집니다|지게\s*됩니다/.test(masked)) add("S-TRANSLATION", block, block.text);
    if ((masked.match(/여러분/g) ?? []).length > 1) add("S-ADDRESS", block, "여러분이 문단당 1회를 초과");
    if (/\p{Extended_Pictographic}/u.test(masked)) add("S-EMOJI", block, block.text);
    if (!objective) { if (!canCount) canLine = block.line; canCount += (masked.match(/할\s*수\s*있습니다/g) ?? []).length; }
    if (block.type === "table") continue;
    for (const sentence of sentences(masked)) {
      const syllables = (sentence.match(/[가-힣]/g) ?? []).length;
      if (syllables > 40) add("S-LONG", block, `${syllables}음절: ${sentence.trim()}`);
      const ending = sentence.trim().match(/([가-힣]+니다)[.!?]$/)?.[1];
      if (ending && ending === previousEnding) endingCount++; else { previousEnding = ending ?? ""; endingCount = ending ? 1 : 0; }
      if (!objective && endingCount === 5) add("S-ENDING", block, `같은 종결 표현 '${ending}' 연속 5회`);
    }
    if (block.type !== "list") objective = false;
  }
  flush();
  return { findings, outline };
}
function numbers(text) {
  const withoutReferences = plain(text).replace(/\d+(?:\s*[·,~～–-]\s*\d+)*\s*장/g, "").replace(/(?:예제|연습문제|바꿔 보기)\s*\d+(?:-\d+)?(?=$|[\s.,:—]|의|에서|처럼|과|와|은|는)/g, "");
  return [...withoutReferences.matchAll(/\d+(?:\.\d+)*(?:%|ms|px|초|회|개|칸)?/g)].map((m) => m[0]);
}
function identifiers(text) {
  return [...plain(text).matchAll(/\b[A-Za-z][A-Za-z0-9]*(?:[._/-][A-Za-z0-9]+)*\b/g)].map((m) => m[0]);
}
export function checkPreservation(before, after, terms = []) {
  const a = blocks(before), b = blocks(after), errors = [];
  const fail = (rule, index, detail) => errors.push({ rule, line: b[index]?.line ?? a[index]?.line ?? 1, detail });
  if (a.length !== b.length) fail("P-STRUCTURE", 0, `블록 개수 ${a.length} → ${b.length}`);
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    if (!a[i] || !b[i]) continue;
    const old = a[i], next = b[i];
    if (old.text !== next.text && b.some((block, j) => j !== i && block.type === old.type && block.text === old.text) && a.some((block, j) => j !== i && block.type === next.type && block.text === next.text)) {
      fail("P-ORDER", i, "기존 문단·항목의 순서 변경");
    }
    if (old.type !== next.type || old.prefix !== next.prefix) { fail("P-STRUCTURE", i, "문단·목록·표의 유형이나 순서 변경"); continue; }
    if (["heading", "code", "quote", "rule"].includes(old.type) || /^\s*\*\*[^\n]+\*\*\s*$/.test(old.text)) {
      if (old.text !== next.text) fail("P-LITERAL", i, `${old.type} 변경`);
      continue;
    }
    if (!isDeepStrictEqual(literals(old.text), literals(next.text))) fail("P-PROTECTED", i, "코드·인용·링크·가림표 내용, 개수, 순서 또는 문단 위치 변경");
    if (!isDeepStrictEqual(numbers(old.text), numbers(next.text))) fail("P-NUMBER", i, "장 안내를 제외한 수치 변경");
    if (!isDeepStrictEqual(identifiers(old.text), identifiers(next.text))) fail("P-IDENTIFIER", i, "영문 용어·식별자·경로 변경");
    if (old.type === "table" && (old.text.match(/\|/g) ?? []).length !== (next.text.match(/\|/g) ?? []).length) fail("P-TABLE", i, "표 셀 개수 변경");
    for (const term of terms) {
      if (old.text.split(term).length !== next.text.split(term).length) fail("P-TERM", i, `고유명사 '${term}' 변경`);
    }
  }
  return { passed: errors.length === 0, errors, blocks: a.length };
}

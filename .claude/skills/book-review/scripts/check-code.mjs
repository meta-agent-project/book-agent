#!/usr/bin/env node
// 원고 마크다운의 코드 블록에서 들여쓰기, 공백, 따옴표, 세미콜론을 검사한다.
// 사용법: node check-code.mjs <원고.md> [--indent=2|4] [--json]
// 규칙 이름 끝에 ?가 붙은 항목은 "확인 필요"(추정)다.
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

const args = process.argv.slice(2);
const file = args.find((arg) => !arg.startsWith("--"));
const asJson = args.includes("--json");
const indentArg = args.find((arg) => arg.startsWith("--indent="));

if (!file) {
  console.error("사용법: node check-code.mjs <원고.md> [--indent=2|4] [--json]");
  process.exit(2);
}

const lines = readFileSync(file, "utf8").replace(/\r\n/g, "\n").split("\n");
const indentUnit = indentArg ? Number(indentArg.slice("--indent=".length)) : courseIndent(file);
if (![2, 4].includes(indentUnit)) {
  console.error("들여쓰기 값은 2 또는 4입니다. --indent=2 또는 --indent=4를 사용하세요.");
  process.exit(2);
}

function courseIndent(input) {
  let current = dirname(resolve(input));
  let course = null;
  while (true) {
    const name = current.split(/[\\/]/).pop();
    if (/^book\d*$/.test(name)) course = `.${name}`;
    if (course) {
      const setup = join(current, course, "manuscript", "course-setup.md");
      if (existsSync(setup)) {
        const match = readFileSync(setup, "utf8").match(/들여쓰기(?:는)?\s*(2|4)칸/);
        return match ? Number(match[1]) : 2;
      }
    }
    const parent = dirname(current);
    if (parent === current) return 2;
    current = parent;
  }
}

const JS_LANGS = new Set(["javascript", "js", "mjs", "cjs"]);
const HTML_LANGS = new Set(["html", "htm"]);
const LAYOUT_LANGS = new Set(["css", "json"]);
const UNCERTAIN = new Set(["SEMICOLON", "INDENT_JUMP"]);

// 1. 코드 블록 추출

function parseBlocks() {
  const blocks = [];
  for (let i = 0; i < lines.length; i++) {
    const open = lines[i].match(/^(\s*)(`{3,}|~{3,})\s*([\w+-]*)\s*$/);
    if (!open) continue;
    const fenceIndent = open[1].length;
    const fence = open[2];
    const close = new RegExp(`^\\s*${fence[0] === "`" ? "`" : "~"}{${fence.length},}\\s*$`);
    const body = [];
    let j = i + 1;
    while (j < lines.length && !close.test(lines[j])) {
      body.push(lines[j].slice(Math.min(fenceIndent, leadingSpaces(lines[j]))));
      j++;
    }
    blocks.push({
      lang: open[3].toLowerCase(),
      firstLine: i + 2,
      fenceIndent,
      body,
      label: previousLabel(i),
    });
    i = j;
  }
  return blocks;
}

function previousLabel(index) {
  for (let k = index - 1; k >= 0; k--) {
    if (lines[k].trim()) return lines[k].trim();
  }
  return "";
}

function classify(block) {
  const lang = block.lang;
  if (!JS_LANGS.has(lang) && !HTML_LANGS.has(lang) && !LAYOUT_LANGS.has(lang)) return "출력";
  if (/^\*\*실행 결과\*\*/.test(block.label)) return "출력";
  if (/^\*\*기본 문법\*\*/.test(block.label)) return "기본 문법";
  const first = (block.body.find((line) => line.trim()) ?? "").trim();
  if (
    /^\*\*예제 \d+-\d+\*\*/.test(block.label) ||
    /^\*\*실습 코드\*\*/.test(block.label) ||
    /^`[^`]+\.\w+`$/.test(block.label) ||
    /^<!DOCTYPE/i.test(first)
  ) {
    return "완결 코드";
  }
  return "코드 조각";
}

// 2. 자바스크립트 줄 가리기: 문자열 내용은 x, 주석은 공백으로 바꾼다. 위치는 원본과 같다.

function maskJs(line, state) {
  let out = "";
  const singles = [];
  let i = 0;
  while (i < line.length) {
    const c = line[i];
    const next = line[i + 1];
    if (state.block) {
      if (c === "*" && next === "/") {
        state.block = false;
        out += "  ";
        i += 2;
      } else {
        out += " ";
        i++;
      }
      continue;
    }
    if (state.template) {
      if (c === "\\") {
        const step = Math.min(2, line.length - i);
        out += "x".repeat(step);
        i += step;
      } else if (c === "`") {
        state.template = false;
        out += "`";
        i++;
      } else {
        out += "x";
        i++;
      }
      continue;
    }
    if (c === "/" && next === "*") {
      state.block = true;
      out += "  ";
      i += 2;
      continue;
    }
    if (c === "/" && next === "/") {
      out += " ".repeat(line.length - i);
      break;
    }
    if (c === "`") {
      state.template = true;
      out += "`";
      i++;
      continue;
    }
    if (c === '"' || c === "'") {
      let j = i + 1;
      while (j < line.length && line[j] !== c) j += line[j] === "\\" ? 2 : 1;
      if (j >= line.length) {
        out += c + "x".repeat(line.length - i - 1);
        i = line.length;
        continue;
      }
      if (c === "'") singles.push({ start: i, end: j });
      out += c + "x".repeat(j - i - 1) + c;
      i = j + 1;
      continue;
    }
    out += c;
    i++;
  }
  return { masked: out, singles, endsInTemplate: state.template };
}

// 3. 줄 단위 검사

const OPERATOR = /===|!==|\*\*=|\*\*|==|!=|<=|>=|=>|&&|\|\||\?\?|\+\+|--|\+=|-=|\*=|\/=|%=|=|\+|-|\*|\/|%|<|>/g;
const ARITHMETIC = new Set(["+", "-", "*", "/", "%", "**", "<", ">"]);

function checkJsLine(masked, raw, nextMasked, endsInTemplate, checkTerminator = true) {
  const found = [];
  const edits = [];
  const indent = leadingSpaces(masked);
  const code = masked.trimEnd();

  for (const match of code.matchAll(/,(?=\S)/g)) {
    found.push("SPACE_COMMA");
    edits.push({ pos: match.index + 1, del: 0, ins: " " });
  }

  for (const match of code.matchAll(/(?<![?:\s]):(?=[^\s:])/g)) {
    found.push("SPACE_COLON");
    edits.push({ pos: match.index + 1, del: 0, ins: " " });
  }

  const keywordPatterns = [
    // 점 뒤의 이름(.catch( 같은 메서드 호출)은 키워드가 아니므로 제외한다.
    [/(?<!\.)\b(if|for|while|switch|catch)\(/g, (m) => m.index + m[1].length],
    [/\)\{/g, (m) => m.index + 1],
    [/\b(else|try|finally|do)\{/g, (m) => m.index + m[1].length],
    [/\}(else|catch|finally)\b/g, (m) => m.index + 1],
  ];
  for (const [pattern, position] of keywordPatterns) {
    for (const match of code.matchAll(pattern)) {
      found.push("SPACE_KEYWORD");
      edits.push({ pos: position(match), del: 0, ins: " " });
    }
  }

  for (const match of code.matchAll(OPERATOR)) {
    const op = match[0];
    const start = match.index;
    const end = start + op.length;
    if (op === "++" || op === "--") continue;
    if (ARITHMETIC.has(op)) {
      const before = code.slice(0, start).trimEnd();
      const previous = before[before.length - 1] ?? "";
      if (!/[\w$)\]"'`\uAC00-\uD7A3]/.test(previous)) continue;
      if (/\b(return|typeof|case|in|of|void)$/.test(before)) continue;
    }
    const missingBefore = start > indent && code[start - 1] !== " ";
    const missingAfter = end < code.length && code[end] !== " ";
    if (missingBefore || missingAfter) {
      found.push("SPACE_OP");
      if (missingBefore) edits.push({ pos: start, del: 0, ins: " " });
      if (missingAfter) edits.push({ pos: end, del: 0, ins: " " });
    }
  }

  for (const match of code.slice(indent).matchAll(/(?<=\S) {2,}(?=\S)/g)) {
    found.push("SPACE_DOUBLE");
    edits.push({ pos: indent + match.index, del: match[0].length, ins: " " });
  }

  if (checkTerminator && needsSemicolon(code.trim(), (nextMasked ?? "").trim(), endsInTemplate)) {
    found.push("SEMICOLON");
    edits.push({ pos: code.length, del: 0, ins: ";" });
  }

  return { found, edits };
}

function needsSemicolon(code, next, endsInTemplate) {
  if (!code || endsInTemplate) return false;
  if (/[;{}[(,:.]$/.test(code)) return false;
  if (/(=>|[=+\-*/%&|?<>!])$/.test(code)) return false;
  if (/^(if|for|while|else|switch|function|class|try|catch|finally|do)\b/.test(code)) return false;
  if (/^}\s*(else|catch|finally|while)\b/.test(code)) return false;
  if (/^["'\w$]+\s*:/.test(code)) return false;
  if (/^[.?:]/.test(next) || /^[)\]]/.test(next)) return false;
  if (/^(&&|\|\||\?\?|[+\-*/%])/.test(next)) return false;
  return true;
}

function applyEdits(text, edits) {
  const unique = new Map();
  for (const edit of edits) unique.set(`${edit.pos}:${edit.del}:${edit.ins}`, edit);
  return [...unique.values()]
    .sort((a, b) => b.pos - a.pos)
    .reduce((result, edit) => result.slice(0, edit.pos) + edit.ins + result.slice(edit.pos + edit.del), text);
}

function leadingSpaces(text) {
  return text.length - text.trimStart().length;
}

// 4. 블록 검사

function checkBlock(block, kind) {
  const findings = [];
  const nonEmpty = block.body.filter((line) => line.trim());
  const commonIndent = kind === "코드 조각" && nonEmpty.length
    ? Math.min(...nonEmpty.map((line) => line.match(/^[ \t]*/)[0].length))
    : 0;

  if (commonIndent > 0) {
    const firstIndex = block.body.findIndex((line) => line.trim());
    findings.push({
      line: block.firstLine + firstIndex,
      kind,
      rules: ["FRAGMENT_INDENT"],
      current: block.body[firstIndex],
      fix: block.body[firstIndex].slice(commonIndent),
      note: `블록 전체에서 공통 들여쓰기 ${commonIndent}칸 제거`,
      dedented: block.body.map((line) => line.slice(Math.min(commonIndent, line.length))),
    });
  }

  const isJs = JS_LANGS.has(block.lang);
  const isHtml = HTML_LANGS.has(block.lang);
  const state = { block: false, template: false };
  let inScript = isJs;
  const masks = [];
  const scriptFlags = [];
  const templateFlags = [];
  const commentFlags = [];

  for (const raw of block.body) {
    if (isHtml && !inScript && /<script\b(?![^>]*\bsrc=)[^>]*>\s*$/i.test(raw)) {
      masks.push(null);
      scriptFlags.push(false);
      templateFlags.push(false);
      commentFlags.push(false);
      inScript = true;
      continue;
    }
    if (isHtml && inScript && /<\/script>/i.test(raw)) {
      inScript = false;
    }
    if (inScript) {
      commentFlags.push(state.block);
      templateFlags.push(state.template);
      masks.push(maskJs(raw, state));
      scriptFlags.push(true);
    } else {
      masks.push(null);
      scriptFlags.push(false);
      templateFlags.push(false);
      commentFlags.push(false);
    }
  }

  let previousIndent = null;
  block.body.forEach((raw, index) => {
    if (!raw.trim()) return;
    const rules = [];
    let edits = [];
    const singles = masks[index]?.singles ?? [];
    const indent = raw.match(/^[ \t]*/)[0];
    const relativeIndent = Math.max(0, indent.replace(/\t/g, " ".repeat(indentUnit)).length - commonIndent);

    if (raw.includes("\t")) rules.push("TAB");

    const inBlockComment = commentFlags[index] && raw.trim().startsWith("*");
    if (!inBlockComment && relativeIndent % indentUnit !== 0) rules.push("INDENT_UNIT");
    if (!inBlockComment && previousIndent !== null && relativeIndent - previousIndent > indentUnit) {
      rules.push("INDENT_JUMP");
    }
    previousIndent = relativeIndent;

    if (/[ \t]+$/.test(raw)) rules.push("TRAILING_WS");

    if (scriptFlags[index] && !templateFlags[index]) {
      const nextIndex = block.body.findIndex((line, k) => k > index && line.trim());
      const nextMasked = nextIndex >= 0 && masks[nextIndex] ? masks[nextIndex].masked : "";
      const result = checkJsLine(masks[index].masked, raw, nextMasked, masks[index].endsInTemplate, kind !== "기본 문법");
      rules.push(...result.found);
      edits = result.edits;

      for (const quote of singles) {
        const content = raw.slice(quote.start + 1, quote.end);
        rules.push("QUOTE");
        if (!content.includes('"') && !content.includes("\\")) {
          edits.push({ pos: quote.start, del: 1, ins: '"' });
          edits.push({ pos: quote.end, del: 1, ins: '"' });
        }
      }
    }

    if (!rules.length) return;

    let fix = applyEdits(raw, edits).replace(/[ \t]+$/, "");
    fix = fix.replace(/^\t+/, (tabs) => " ".repeat(indentUnit * tabs.length)).replace(/\t/g, " ");
    fix = fix.slice(Math.min(commonIndent, leadingSpaces(fix)));

    findings.push({
      line: block.firstLine + index,
      kind,
      rules: [...new Set(rules)].map((rule) => (UNCERTAIN.has(rule) ? `${rule}?` : rule)),
      current: raw,
      fix: fix === raw ? null : fix,
    });
  });

  return findings;
}

// 5. 출력

const blocks = parseBlocks();
const counts = { "완결 코드": 0, "코드 조각": 0, "기본 문법": 0, 출력: 0 };
const findings = [];
for (const block of blocks) {
  const kind = classify(block);
  counts[kind]++;
  if (kind !== "출력") findings.push(...checkBlock(block, kind));
}
findings.sort((a, b) => a.line - b.line);

if (asJson) {
  console.log(JSON.stringify({ file, indentUnit, counts, findings }, null, 2));
} else {
  console.log(`# 코드 검사: ${file}\n`);
  console.log(
    `블록 ${blocks.length}개: 완결 코드 ${counts["완결 코드"]}, 코드 조각 ${counts["코드 조각"]}, ` +
      `기본 문법 ${counts["기본 문법"]}, 출력/기타(검사 안 함) ${counts["출력"]}`,
  );
  console.log(`발견 ${findings.length}건. 규칙 끝의 ?는 확인 필요.\n`);
  if (findings.length) {
    console.log("| 원고 줄 | 블록 | 규칙 | 현재 | 수정안 |");
    console.log("|---|---|---|---|---|");
    for (const finding of findings) {
      const fix = finding.fix === null ? "(직접 판단)" : cell(finding.fix);
      const note = finding.note ? ` ${finding.note}` : "";
      console.log(
        `| ${finding.line} | ${finding.kind} | ${finding.rules.join(", ")} | ${cell(finding.current)} | ${fix}${note} |`,
      );
    }
  }
}

function cell(text) {
  // 들여쓰기와 줄 끝 공백이 보이도록 앞뒤 공백만 가운뎃점으로 바꾼다.
  const shown = text
    .replace(/\t/g, "\\t")
    .replace(/^ +| +$/g, (spaces) => "·".repeat(spaces.length))
    .replace(/\|/g, "\\|");
  const fence = shown.includes("`") ? "``" : "`";
  return `${fence} ${shown} ${fence}`;
}

#!/usr/bin/env node
// 원고 마크다운의 문서 구조를 검사한다(style-guide.md 9장 MD 가독성).
// 사용법: node check-markdown.mjs <원고.md> [--json]
// MD-1(제목 단계가 내용 범위와 맞는지)은 판단이 필요하므로 목차만 출력한다.
import { readFileSync } from "node:fs";

const args = process.argv.slice(2);
const file = args.find((arg) => !arg.startsWith("--"));
const asJson = args.includes("--json");

if (!file) {
  console.error("사용법: node check-markdown.mjs <원고.md> [--json]");
  process.exit(2);
}

const lines = readFileSync(file, "utf8").replace(/\r\n/g, "\n").split("\n");

const FENCE = /^(\s*)(`{3,}|~{3,})/;
const HEADING = /^(#{1,6})\s+(.*)$/;
const LIST_ITEM = /^(\s*)([-*+]|\d+\.)\s+/;
const TABLE_ROW = /^\s*\|/;
const TABLE_SEPARATOR = /^\s*\|?\s*:?-{3,}/;
const SENTENCE_END = /[가-힣][.?!](?=\s|$)/g;

// 1. 코드 블록 안의 줄 표시

const inCode = new Array(lines.length).fill(false);

// 맨 앞 YAML 머리말(---)은 본문이 아니므로 코드처럼 건너뛴다.
if (lines[0] === "---") {
  const end = lines.indexOf("---", 1);
  for (let k = 0; k <= end; k++) inCode[k] = true;
}

for (let i = 0; i < lines.length; i++) {
  if (inCode[i]) continue;
  const open = lines[i].match(FENCE);
  if (!open) continue;
  const marker = open[2];
  const close = new RegExp(`^\\s*${marker[0] === "`" ? "`" : "~"}{${marker.length},}\\s*$`);
  inCode[i] = true;
  let j = i + 1;
  while (j < lines.length && !close.test(lines[j])) {
    inCode[j] = true;
    j++;
  }
  if (j < lines.length) inCode[j] = true;
  i = j;
}

function stripInlineCode(text) {
  return text.replace(/(`+)[\s\S]*?\1/g, "x");
}

function countSentences(text) {
  // 따옴표로 인용한 화면 글자 안의 마침표는 문장 끝으로 세지 않는다.
  const plain = stripInlineCode(text).replace(/"[^"]*"/g, "x");
  return (plain.match(SENTENCE_END) ?? []).length;
}

// 2. 검사

const findings = [];
const outline = [];
let previousLevel = 0;
let singleRun = [];

for (let i = 0; i < lines.length; i++) {
  if (inCode[i]) {
    flushSingleRun();
    continue;
  }
  const line = lines[i];
  const lineNumber = i + 1;

  if (/\\[ \t]*$/.test(line)) {
    findings.push({ line: lineNumber, rule: "MD-3 TRAILING_BACKSLASH", current: line.trim(), note: "본문·목록 줄 끝의 줄바꿈용 역슬래시를 제거" });
  }

  const heading = line.match(HEADING);
  if (heading) {
    const level = heading[1].length;
    outline.push({ line: lineNumber, level, title: heading[2] });
    if (previousLevel && level > previousLevel + 1) {
      findings.push({ line: lineNumber, rule: "MD-1 HEADING_SKIP", current: line, note: `${"#".repeat(previousLevel)} 다음에 ${heading[1]}` });
    }
    previousLevel = level;
    flushSingleRun();
    continue;
  }

  if (/^\*\*[^*]+[:：]\*\*/.test(line)) {
    findings.push({ line: lineNumber, rule: "MD-4 TITLE_COLON", current: line, note: "블록 제목은 콜론 없이 한 줄, 내용은 다음 줄" });
  }

  const item = line.match(LIST_ITEM);
  if (item) {
    flushSingleRun();
    const contentIndent = item[0].length;
    let j = i + 1;
    while (j < lines.length && !lines[j].trim()) j++;
    const fence = j < lines.length ? lines[j].match(FENCE) : null;
    if (fence && fence[1].length < contentIndent) {
      findings.push({ line: lineNumber, rule: "MD-2 LIST_FENCE", current: line, note: `${j + 1}줄 코드 블록이 목록 밖으로 빠짐` });
    }
    continue;
  }

  if (TABLE_ROW.test(line)) {
    flushSingleRun();
    if (TABLE_SEPARATOR.test(line)) continue;
    const cells = line.replace(/\\\|/g, "").split("|").slice(1, -1);
    cells.forEach((cellText, index) => {
      const plain = stripInlineCode(cellText);
      if (/[가-힣][.?!]\s+\S/.test(plain)) {
        findings.push({ line: lineNumber, rule: "MD-5 TABLE_CELL", current: cellText.trim(), note: `${index + 1}번째 칸에 문장이 둘 이상` });
      }
    });
    continue;
  }

  // 문단: 빈 줄, 제목, 목록, 표, 인용, 코드가 나오기 전까지 이어지는 줄
  const startsParagraph = line.trim() && (i === 0 || !lines[i - 1].trim() || inCode[i - 1]);
  if (startsParagraph && !line.startsWith(">")) {
    const paragraph = [line];
    let j = i + 1;
    while (
      j < lines.length &&
      lines[j].trim() &&
      !inCode[j] &&
      !HEADING.test(lines[j]) &&
      !LIST_ITEM.test(lines[j]) &&
      !TABLE_ROW.test(lines[j])
    ) {
      paragraph.push(lines[j]);
      j++;
    }

    // 문단 안에서는 한 줄에 한 문장, 일반 줄바꿈으로 이어 쓴다.
    let total = 0;
    paragraph.forEach((paragraphLine, k) => {
      const count = countSentences(paragraphLine.replace(/\\$/, ""));
      total += count;
      if (count >= 2) {
        findings.push({ line: lineNumber + k, rule: "MD-3 LINE_MULTI", current: paragraphLine.trim(), note: `한 줄에 ${count}문장` });
      }
    });
    if (total >= 5) {
      findings.push({ line: lineNumber, rule: "MD-3 PARA_LONG", current: paragraph.join(" ").trim(), note: `${total}문장` });
    }

    // 한 문장짜리 문단이 빈 줄만 사이에 두고 연달아 나오면 같은 내용인지 확인한다
    if (paragraph.length === 1 && total === 1) {
      singleRun.push(lineNumber);
    } else {
      flushSingleRun();
    }
    i = j - 1;
    continue;
  }
  if (line.trim()) flushSingleRun();
}
flushSingleRun();

function flushSingleRun() {
  if (singleRun.length >= 2) {
    findings.push({ line: singleRun[0], rule: "MD-3 PARA_RUN?", current: lines[singleRun[0] - 1].trim(), note: `한 문장 문단 ${singleRun.length}개 연속(${singleRun.join(", ")}줄), 이어지는 문장이면 빈 줄 없이 다음 줄에` });
  }
  singleRun = [];
}

// 목록 안의 빈 줄: 항목이 모두 문단으로 바뀌어 간격이 벌어진다(MD-2)
let listOpen = false;
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (!line.trim()) {
    if (listOpen && !inCode[i] && i > 0 && lines[i - 1].trim()) {
      let j = i + 1;
      while (j < lines.length && !lines[j].trim()) j++;
      if (j < lines.length && ((!inCode[j] && LIST_ITEM.test(lines[j])) || /^\s{2,}\S/.test(lines[j]))) {
        findings.push({ line: i + 1, rule: "MD-2 LIST_LOOSE", current: lines[i - 1].trim(), note: `${j + 1}줄과 사이에 빈 줄, 목록 간격이 벌어짐` });
      }
    }
    continue;
  }
  if (!inCode[i] && LIST_ITEM.test(line)) {
    listOpen = true;
    continue;
  }
  if (/^\s/.test(line)) continue;
  listOpen = false;
}

findings.sort((a, b) => a.line - b.line);

// 3. 출력

if (asJson) {
  console.log(JSON.stringify({ file, outline, findings }, null, 2));
} else {
  console.log(`# MD 가독성 검사: ${file}\n`);
  console.log("## 목차 (MD-1은 이 목차를 보고 판단한다)\n");
  for (const entry of outline) {
    console.log(`${"  ".repeat(entry.level - 1)}- ${entry.line}: ${entry.title}`);
  }
  console.log(`\n## 발견 ${findings.length}건\n`);
  if (findings.length) {
    console.log("| 원고 줄 | 규칙 | 현재 | 메모 |");
    console.log("|---|---|---|---|");
    for (const finding of findings) {
      console.log(`| ${finding.line} | ${finding.rule} | ${cell(finding.current)} | ${finding.note} |`);
    }
  }
}

function cell(text) {
  const short = text.length > 60 ? `${text.slice(0, 60)}...` : text;
  return short.replace(/\|/g, "\\|");
}

#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { checkPreservation } from "./style-core.mjs";
const args = process.argv.slice(2), termIndex = args.indexOf("--terms");
const positional = args.filter((arg, index) => !arg.startsWith("--") && (termIndex < 0 || index !== termIndex + 1));
if (positional.length !== 2) { console.error("사용법: node check-preservation.mjs <백업.md> <원고.md> [--json] [--terms 고유명사목록.json]"); process.exit(2); }
const terms = termIndex < 0 ? [] : JSON.parse(readFileSync(args[termIndex + 1], "utf8"));
const report = { before: positional[0], after: positional[1], ...checkPreservation(...positional.map((file) => readFileSync(file, "utf8")), terms) };
if (args.includes("--json")) console.log(JSON.stringify(report, null, 2));
else { for (const error of report.errors) console.log(`${error.rule} ${report.after}:${error.line} ${error.detail}`); console.log(report.passed ? `보존 검사 통과 (${report.blocks}블록). 의미·고유명사 수동 대조는 별도로 수행합니다.` : `보존 검사 실패 ${report.errors.length}건`); }
if (!report.passed) process.exitCode = 1;

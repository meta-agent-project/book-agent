#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { inspectStyle } from "./style-core.mjs";
const args = process.argv.slice(2), file = args.find((arg) => !arg.startsWith("--"));
if (!file) { console.error("사용법: node check-style.mjs <원고.md> [--json] [--strict]"); process.exit(2); }
const report = { file, ...inspectStyle(readFileSync(file, "utf8")) };
if (args.includes("--json")) console.log(JSON.stringify(report, null, 2));
else { for (const item of report.findings) console.log(`${item.rule} ${file}:${item.line} ${item.detail}`); console.log(`검토 후보 ${report.findings.length}건. 자동 치환·의미 판정은 하지 않습니다.`); }
if (args.includes("--strict") && report.findings.length) process.exitCode = 1;

#!/usr/bin/env node
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export function inspectVisuals(file) {
  const source = readFileSync(file, 'utf8').replace(/\r\n?/g, '\n');
  const findings = [], visuals = [];
  const line = offset => source.slice(0, offset).split('\n').length;
  for (const match of source.matchAll(/\[생성 이미지:[^\]\n]*\]/g)) {
    findings.push({ line: line(match.index), rule: 'UNFINISHED_IMAGE', message: match[0] });
  }
  for (const match of source.matchAll(/^(?:!\[[^\]]*\]\(|<img\b[^>]*\bsrc=")(images\/[^)"]+)/gm)) {
    const target = resolve(dirname(file), match[1]);
    if (!existsSync(target)) findings.push({ line: line(match.index), rule: 'MISSING_IMAGE', message: match[1] });
  }
  for (const match of source.matchAll(/^\*\*시각자료[^\n]*\*\*[^\n]*\n/gm)) {
    const section = source.slice(match.index + match[0].length).split(/^#{1,6} |^\*\*(?:시각자료|기본 문법|예제|실행 결과|따라하기)/m)[0];
    // A short reading instruction may precede the actual diagram.
    const after = section.match(/^!\[[^\n]+|^<img\b[^\n]+|^```(?:mermaid|text)\b|^\|[^\n]+/m)?.[0] || '';
    const kind = (after.startsWith('![') || after.startsWith('<img')) ? 'image' : after.startsWith('```mermaid') ? 'mermaid' : after.startsWith('```text') ? 'text' : after.startsWith('|') ? 'table' : 'missing';
    const record = { line: line(match.index), title: match[0].trim(), kind };
    if (kind === 'text') {
      // Rationale must be adjacent to this heading; a previous section does not count.
      const before = source.slice(0, match.index).trimEnd();
      record.reason = before.match(/<!-- visual-text: ([^\n]+) -->$/)?.[1] || '';
      if (!record.reason.trim()) findings.push({ line: record.line, rule: 'UNEXPLAINED_TEXT_VISUAL', message: record.title });
    }
    if (kind === 'missing') findings.push({ line: record.line, rule: 'MISSING_VISUAL', message: record.title });
    visuals.push(record);
  }
  return { file, visuals, findings };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const targets = process.argv.slice(2).filter(a => a !== '--json');
  if (!targets.length) { console.error('사용법: node check-visuals.mjs <원고.md 또는 원고폴더> [--json]'); process.exit(2); }
  const files = targets.flatMap(p => statSync(p).isDirectory() ? readdirSync(p).filter(n => n.endsWith('.md')).map(n => join(p, n)) : [p]);
  const results = files.map(inspectVisuals);
  const errors = results.reduce((n, r) => n + r.findings.length, 0);
  console.log(JSON.stringify({ files: files.length, errors, results }, null, process.argv.includes('--json') ? 2 : 0));
  process.exitCode = errors ? 1 : 0;
}

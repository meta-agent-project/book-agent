#!/usr/bin/env node
// 공통 이미지 표시·확대 보기를 읽기용/비교 HTML에 포함한다. 재실행해도 중복되지 않는다.
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const here = dirname(fileURLToPath(import.meta.url));
const css = readFileSync(resolve(here, '../assets/preview-images.css'), 'utf8');
const js = readFileSync(resolve(here, '../assets/preview-images.js'), 'utf8');
const files = process.argv.slice(2);
if (!files.length) { console.error('사용법: node update-preview-images.mjs <검토.html> [...]'); process.exit(2); }
for (const file of files) {
  let html = readFileSync(file, 'utf8');
  // 검수용 메타데이터는 원고에만 보존하고 읽기용 본문에서는 숨긴다.
  if (!html.includes('version.text.replace(/<!-- visual-text:')) {
    html = html.replace('let lines=version.text.replace(', "let lines=version.text.replace(/<!-- visual-text: [^\\n]* -->/g,'').replace(");
  }
  html = html.replace('const lines = text.trim().split(', "const lines = text.replace(/<!-- visual-text: [^\\n]* -->/g,'').trim().split(");
  html = html.replace(/<!-- book-preview-images:start -->[\s\S]*?<!-- book-preview-images:end -->/g, '');
  if (!html.includes('</head>') || !html.includes('</body>')) throw new Error(`${file}: head/body 종료 태그가 필요합니다.`);
  html = html.replace('</head>', `<!-- book-preview-images:start --><style>${css}</style><!-- book-preview-images:end -->\n</head>`);
  const index = html.lastIndexOf('</body>');
  html = html.slice(0, index) + `<!-- book-preview-images:start --><script>${js}</script><!-- book-preview-images:end -->\n` + html.slice(index);
  writeFileSync(file, html);
  console.log(`이미지 표시·확대 보기 적용: ${file}`);
}

#!/usr/bin/env node
// 개념 그림 HTML의 #figure를 PNG로 캡처한다.
// 쓰는 법: node capture-figure.mjs <그림.html> <출력.png> [--scale 2]
// Playwright와 Pretendard 글꼴은 같은 프로젝트의 book-mermaid 스킬 것을 쓴다.
import { existsSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const mermaidRoot = resolve(here, "../../book-mermaid");
const require = createRequire(join(mermaidRoot, "package.json"));

const args = process.argv.slice(2);
const scaleIndex = args.indexOf("--scale");
const scale = scaleIndex >= 0 ? Number(args[scaleIndex + 1]) : 2;
const [input, output] = args.filter((a, i) => !a.startsWith("--") && !(i > 0 && args[i - 1] === "--scale"));

if (!input || !output) {
  console.error("쓰는 법: node capture-figure.mjs <그림.html> <출력.png> [--scale 2]");
  process.exit(1);
}

let chromium;
try {
  ({ chromium } = require("playwright"));
} catch {
  console.error(`playwright가 없습니다. 한 번만 설치하세요:\n  cd "${mermaidRoot}" && npm install && npx playwright install chromium`);
  process.exit(2);
}

const fontCss = join(mermaidRoot, "node_modules/pretendard/dist/web/static/pretendard.css");
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 800, height: 600 }, deviceScaleFactor: scale });
await page.goto(pathToFileURL(resolve(input)).href);
if (existsSync(fontCss)) {
  await page.addStyleTag({ path: fontCss });
}
// 책의 모든 이미지는 실행 결과 액자(assets/result-frame.html)와 같은 연한 회색 테두리를 붙인다
await page.addStyleTag({
  content: "#figure { box-sizing: border-box; border: 1px solid #d9d9d9; border-radius: 8px; overflow: hidden; }",
});
await page.evaluate(() => document.fonts.ready);

const figure = await page.$("#figure");
if (!figure) {
  console.error("#figure 요소가 없습니다.");
  await browser.close();
  process.exit(1);
}
mkdirSync(dirname(resolve(output)), { recursive: true });
await figure.screenshot({ path: output });
const box = await figure.boundingBox();
await browser.close();
console.log(JSON.stringify({ input, output, width: box.width, height: box.height, scale }));

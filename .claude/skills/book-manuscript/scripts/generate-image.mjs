#!/usr/bin/env node
// 원고의 생성 이미지 자리로 Codex CLI에 그림을 만들게 하고, 테두리를 붙인 PNG로 저장한다.
// 쓰는 법: node generate-image.mjs <원고.md> <파일명>
// 원본은 .book/figures/{NN}/{파일명}.raw.png, 완성본은 book/images/{NN}/{파일명}.png에 둔다.
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../../../..");
const styleRef = ".claude/skills/book-manuscript/assets/style-ref/line-art-shark.png";

const [manuscript, name] = process.argv.slice(2);
if (!manuscript || !name) {
  console.error("쓰는 법: node generate-image.mjs <원고.md> <파일명>");
  process.exit(1);
}

// ```text 블록 중 첫 줄이 [생성 이미지: images/{NN}/{파일명}.png]인 것을 찾는다
const source = readFileSync(resolve(manuscript), "utf8").replace(/\r\n/g, "\n");
const blocks = [...source.matchAll(/```text\n(\[생성 이미지: images\/(\d+)\/([^\]]+)\.png\]\n[\s\S]*?)```/g)];
const block = blocks.find((m) => m[3] === name);
if (!block) {
  console.error(`${manuscript}에 [생성 이미지: images/{NN}/${name}.png] 자리가 없습니다.`);
  process.exit(1);
}
const chapter = block[2];
const field = (label) => block[1].match(new RegExp(`^${label}: (.+)$`, "m"))?.[1] ?? "";

const prompt = [
  "이미지 생성 도구로 그림 1장을 만든다. 파일을 고치거나 다른 명령을 실행하지 않는다.",
  `장면: ${field("장면")}`,
  `비율: ${field("비율") || "가로 3:2"} (1536x1024 가로형)`,
  `스타일: ${field("스타일")}`,
  "첨부한 그림은 선 굵기와 단순함만 참고한다. 첨부 그림의 사물은 그리지 않는다.",
  "Absolutely no text, letters, numbers, or symbols anywhere in the image.",
  "Pure white background. Uniform black outlines. No shadows, no gradients. Use black plus at most one other flat fill color (white does not count).",
].join("\n");

const started = Date.now();
// Windows의 codex.cmd는 셸로만 실행된다. 프롬프트는 따옴표 문제를 피하려고 stdin으로 넘긴다
const result = spawnSync(`codex exec --skip-git-repo-check -s read-only -i ${styleRef} -`, {
  cwd: root,
  input: prompt,
  stdio: ["pipe", "inherit", "inherit"],
  shell: true,
});
if (result.status !== 0) {
  console.error(`codex exec가 실패했습니다(종료 코드 ${result.status}).`);
  process.exit(result.status ?? 1);
}

// 실행 뒤 ~/.codex/generated_images에 새로 생긴 PNG 중 가장 최근 것을 고른다
const imagesRoot = join(homedir(), ".codex", "generated_images");
const fresh = [];
for (const session of existsSync(imagesRoot) ? readdirSync(imagesRoot) : []) {
  const dir = join(imagesRoot, session);
  if (!statSync(dir).isDirectory()) continue;
  for (const file of readdirSync(dir)) {
    const path = join(dir, file);
    const mtime = statSync(path).mtimeMs;
    if (file.endsWith(".png") && mtime >= started) fresh.push({ path, mtime });
  }
}
if (fresh.length === 0) {
  console.error(`${imagesRoot}에 새 이미지가 없습니다. codex 출력에서 이미지 생성이 됐는지 확인하세요.`);
  process.exit(1);
}
const latest = fresh.sort((a, b) => b.mtime - a.mtime)[0].path;

const figureDir = join(root, ".book/figures", chapter);
mkdirSync(figureDir, { recursive: true });
copyFileSync(latest, join(figureDir, `${name}.raw.png`));
const html = join(figureDir, `${name}.html`);
writeFileSync(
  html,
  `<!doctype html>\n<meta charset="utf-8">\n<style>body { margin: 0; background: #fff; } #figure { display: block; width: 760px; }</style>\n<img id="figure" src="${name}.raw.png">\n`,
);

const output = join(root, "book/images", chapter, `${name}.png`);
const capture = spawnSync(process.execPath, [join(here, "capture-figure.mjs"), html, output], { stdio: "inherit" });
if (capture.status !== 0) process.exit(capture.status ?? 1);
console.log(`원본: ${join(figureDir, `${name}.raw.png`)}\n완성: ${output}`);

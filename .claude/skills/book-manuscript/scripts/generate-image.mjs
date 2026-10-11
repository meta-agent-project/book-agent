#!/usr/bin/env node
// 원고의 생성 이미지 자리로 Codex CLI에 그림을 만들게 하고, 테두리를 붙인 PNG로 저장한다.
// 쓰는 법: node generate-image.mjs <원고.md> <파일명> [--prompt-only | --raw <생성한.png>]
// 원본은 .book/figures/{NN}/{파일명}.raw.png, 완성본은 book/images/{NN}/{파일명}.png에 둔다.
// 원고가 book2/에 있으면 .book2/figures, book2/images처럼 원고 폴더 이름을 따른다.
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { basename, dirname, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../../../..");
const defaultRef = ".claude/skills/book-manuscript/assets/style-ref/line-art-house.png";

const args = process.argv.slice(2);
const [manuscript, name] = args;
const rawIndex = args.indexOf("--raw");
const rawInput = rawIndex >= 0 ? args[rawIndex + 1] : null;
if (rawIndex >= 0 && (!rawInput || rawInput.startsWith("--"))) throw new Error("--raw 뒤에 생성한 PNG 경로를 지정하세요.");
if (!manuscript || !name) {
  console.error("쓰는 법: node generate-image.mjs <원고.md> <파일명> [--prompt-only | --raw <생성한.png>]");
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
const bookDir = basename(dirname(resolve(manuscript)));
const field = (label) => block[1].match(new RegExp(`^${label}: (.+)$`, "m"))?.[1] ?? "";

const selectedRef = field("참고 그림") || defaultRef;
const refPath = resolve(root, selectedRef.startsWith("book-manuscript/") ? ".claude/skills/" + selectedRef : selectedRef);
if (!existsSync(refPath)) throw new Error(`참고 그림이 없습니다: ${refPath}`);
// CLI에 전달할 경로에는 셸 제어 문자를 허용하지 않는다.
if (/["%&|<>^\r\n]/.test(refPath)) throw new Error("참고 그림 경로에 셸 제어 문자가 있습니다.");
const prompt = [
  "이미지 생성 도구로 그림 1장을 만든다. 파일을 고치거나 다른 명령을 실행하지 않는다.",
  `장면: ${field("장면")}`,
  `비율: ${field("비율") || "가로 2:1"}`,
  `스타일: ${field("스타일")}`,
  "첨부한 그림은 선 굵기와 단순함만 참고한다. 첨부 그림의 사물은 그리지 않는다.",
  "Absolutely no text, letters, numbers, or symbols anywhere in the image.",
  "Pure white background. Thin, consistent black outlines. Simple recognizable objects and actions. Tight composition, modest outer margins. No large blank areas, decorative cards, shadows or gradients. Black and white only. Add one flat color only if the style line above names it.",
].join("\n");

if (args.includes("--prompt-only")) {
  console.log(JSON.stringify({ reference: refPath, prompt }, null, 2));
  process.exit(0);
}
const started = Date.now();
let latest;
if (rawInput) {
  latest = resolve(rawInput);
  if (!existsSync(latest)) throw new Error(`생성한 PNG가 없습니다: ${latest}`);
} else {
// Windows의 codex.cmd는 셸로만 실행된다. 프롬프트는 따옴표 문제를 피하려고 stdin으로 넘긴다
const result = spawnSync(`codex exec --skip-git-repo-check -s read-only -i "${refPath}" -`, {
  cwd: root,
  input: prompt,
  stdio: ["pipe", "inherit", "inherit"],
  shell: true,
});
if (result.status !== 0) {
  console.error(`codex exec가 실패했습니다(종료 코드 ${result.status}).`);
  process.exit(result.status ?? 1);
}

// 실행 뒤 새 PNG가 하나일 때만 사용한다. 여러 결과면 --raw로 지정한다.
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
if (fresh.length !== 1) throw new Error(`새 PNG가 ${fresh.length}개여서 생성 결과를 확정할 수 없습니다. --raw로 정확한 결과를 지정하세요.`);
latest = fresh[0].path;
}
const rawBytes = readFileSync(latest);
if (rawBytes.length < 24 || rawBytes.subarray(0,8).toString("hex") !== "89504e470d0a1a0a") throw new Error("--raw에는 PNG 파일을 지정하세요.");
const rawWidth = rawBytes.readUInt32BE(16), rawHeight = rawBytes.readUInt32BE(20);
if (!rawWidth || !rawHeight) throw new Error("잘못된 PNG 크기입니다.");
// border-box의 좌우/상하 1px 테두리까지 포함해 280px 안에 맞춘다.
const displayWidth = Math.floor(Math.min(560, (280 - 2) * rawWidth / rawHeight + 2));

const figureDir = join(root, `.${bookDir}`, "figures", chapter);
mkdirSync(figureDir, { recursive: true });
copyFileSync(latest, join(figureDir, `${name}.raw.png`));
const html = join(figureDir, `${name}.html`);
writeFileSync(
  html,
  `<!doctype html>\n<meta charset="utf-8">\n<style>body { margin: 0; background: #fff; } #figure { display: block; width: ${displayWidth}px; height: auto; }</style>\n<img id="figure" src="${name}.raw.png">\n`,
);

const output = join(root, bookDir, "images", chapter, `${name}.png`);
const capture = spawnSync(process.execPath, [join(here, "capture-figure.mjs"), html, output], { stdio: "inherit" });
if (capture.status !== 0) process.exit(capture.status ?? 1);
console.log(`원본: ${join(figureDir, `${name}.raw.png`)}\n완성: ${output}`);

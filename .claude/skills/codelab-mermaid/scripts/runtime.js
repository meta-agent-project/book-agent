// codelab-mermaid 브라우저 쪽 — 테마 설정 · 배치 규칙 · PK 굵게 · 줄바꿈 연결선.
// 강의 앱 src/components/diagram/{theme,layout}.ts 를 그대로 옮긴 것(assets/web/ 참고). window.codelabMermaid 로 쓴다.
(() => {
  function makeConfig(theme) {
    const v = theme.vars, s = theme.style;
    const css = [
      `.node rect,.node polygon,.node circle,.node path,.outer-path,.divider,.actor,.note,.labelBox,.statediagram-state rect{stroke-width:${s.strokeWidth}}`,
      `.node rect,.actor,.note,.statediagram-state rect{rx:${s.radius};ry:${s.radius}}`,
      `.relationshipLine,.flowchart-link,.messageLine0,.messageLine1,.transition{stroke-width:${s.strokeWidth}}`,
      `.label.name .nodeLabel,.cluster-label .nodeLabel,text.actor>tspan{font-weight:${s.boldWeight}}`,
      `.diagram-key .nodeLabel,.nodeLabel strong{font-weight:${s.boldWeight}}`,
      `.wrap-label{fill:${v.textColor};font-size:${v.fontSize};font-family:${v.fontFamily}}`,
    ].join("\n");
    const natural = { useMaxWidth: false };
    return {
      secure: theme.secure,
      startOnLoad: false,
      securityLevel: "strict",
      suppressErrorRendering: true,
      theme: "base",
      fontFamily: v.fontFamily,
      themeVariables: v,
      themeCSS: css,
      flowchart: natural, sequence: natural, er: natural, state: natural, class: natural, gitGraph: natural,
    };
  }

  let MIN_SCALE = 11 / 14;
  let COMPACT = "";

  const FRONTMATTER = /^\s*---\r?\n([\s\S]*?)\r?\n---[ \t]*\r?\n/;
  const DIRECTIVE = /^[ \t]*%%\{[\s\S]*?\}%%[ \t]*(\r?\n|$)/gm;
  function stripOverrides(code) {
    const fm = FRONTMATTER.exec(code);
    const title = fm ? (/^title:[ \t]*(.+?)[ \t]*$/m.exec(fm[1])?.[1] ?? null) : null;
    return { title, body: (fm ? code.slice(fm[0].length) : code).replace(DIRECTIVE, "") };
  }
  const withTitle = (title, body) => (title ? `---\ntitle: ${title}\n---\n${body}` : body);
  const compactOf = (title, body) => (title ? COMPACT.replace("---\nconfig:", `---\ntitle: ${title}\nconfig:`) : COMPACT) + body;

  const ER_OR_STATE = /^\s*(erDiagram|stateDiagram(-v2)?)\b[^\n]*/;
  function preferHorizontal(code) {
    if (!ER_OR_STATE.test(code) || /^\s*direction\s/m.test(code)) return code;
    return code.replace(ER_OR_STATE, (head) => `${head}\n  direction LR`);
  }
  function flipVertical(code) {
    return code.replace(/^(\s*(?:flowchart|graph)\s+)(LR|RL)\b/m, "$1TB").replace(/^(\s*direction\s+)(LR|RL)\b/m, "$1TB");
  }
  function svgWidth(svg) {
    return Number(/viewBox="[-\d.]+ [-\d.]+ ([\d.]+)/.exec(svg)?.[1] ?? 0);
  }

  const SHAPE = { square: ["[", "]"], round: ["(", ")"], stadium: ["([", "])"], diamond: ["{", "}"], circle: ["((", "))"], subroutine: ["[[", "]]"], cylinder: ["[(", ")]"], hexagon: ["{{", "}}"], undefined: ["[", "]"] };
  const LINK = { normal: "-->", dotted: "-.->", thick: "==>" };

  function chainOf(vertices, edges, subgraphs) {
    if (vertices.length < 4 || edges.length !== vertices.length - 1 || subgraphs > 0) return null;
    if (vertices.some((x) => !(String(x.type) in SHAPE) || x.classes.length > 0 || x.styles.length > 0)) return null;
    if (edges.some((x) => !(x.stroke in LINK) || x.type !== "arrow_point")) return null;
    const next = new Map(edges.map((x) => [x.start, x]));
    const ins = new Set(edges.map((x) => x.end));
    if (next.size !== edges.length || ins.size !== edges.length) return null;
    const byId = new Map(vertices.map((x) => [x.id, x]));
    const first = vertices.find((x) => !ins.has(x.id));
    if (!first) return null;
    const order = [first], links = [];
    for (let link = next.get(first.id); link && order.length < vertices.length; link = next.get(link.end)) {
      const to = byId.get(link.end);
      if (!to) return null;
      links.push(link);
      order.push(to);
    }
    return order.length === vertices.length ? { order, links } : null;
  }

  const NAMED = /ﬂ°(\w+)¶ß/g;
  const NUMBERED = /ﬂ°°(\d+)¶ß/g;
  const restoreEntities = (s) => s.replace(NUMBERED, "#$1;").replace(NAMED, "#$1;");
  function displayText(text, labelType) {
    const t = document.createElement("textarea");
    t.innerHTML = text.replace(NUMBERED, "&#$1;").replace(NAMED, "&$1;");
    return labelType === "markdown" ? t.value.replace(/\*\*|__|`/g, "").replace(/(^|[^*])\*(?!\*)/g, "$1") : t.value;
  }

  function wrapSource({ order, links }, k) {
    const label = (text, markdown) => {
      const s = restoreEntities(text).replace(/"/g, "#quot;");
      if (markdown) return `"\`${s}\`"`;
      return `"${s.replace(/`/g, "#96;") || " "}"`;
    };
    const node = (x) => { const [o, c] = SHAPE[String(x.type)]; return `${x.id}${o}${label(x.text, x.labelType === "markdown")}${c}`; };
    const link = (x) => LINK[x.stroke] + (x.text ? `|${label(x.text, x.labelType === "markdown")}|` : "");
    const rows = [];
    for (let i = 0; i < order.length; i += k) rows.push(order.slice(i, i + k));
    const lines = ["flowchart TB"];
    rows.forEach((row, r) => {
      lines.push(`  subgraph wrapRow${r}[" "]`, "    direction LR");
      row.forEach((x, j) => lines.push(j === 0 ? `    ${node(x)}` : `    ${row[j - 1].id} ${link(links[r * k + j - 1])} ${node(x)}`));
      lines.push("  end");
    });
    for (let r = 0; r + 1 < rows.length; r++) lines.push(`  wrapRow${r} ~~~ wrapRow${r + 1}`);
    lines.push("  classDef wrapRow fill:none,stroke:none", `  class ${rows.map((_, r) => `wrapRow${r}`).join(",")} wrapRow`, "");
    return { src: lines.join("\n"), rows };
  }

  async function readChain(m, code) {
    if (!/^\s*(flowchart|graph)\s+(LR|RL)\b/.test(code)) return null;
    const db = (await m.mermaidAPI.getDiagramFromText(code)).db;
    const vs = db.getVertices();
    return chainOf(vs instanceof Map ? [...vs.values()] : Object.values(vs), db.getEdges(), db.getSubGraphs().length);
  }

  /** 원래대로 → 간격 좁혀 줄임(글자 ≥ 최소) → 한 줄 흐름 줄바꿈 → 세로. 첫 그리기 실패만 실패 */
  async function layoutDiagram(m, code, width, id, opts = {}) {
    const attempt = async (rid, text) => { try { return (await m.render(rid, text)).svg; } catch { return null; } };
    const { title, body: raw } = stripOverrides(code);
    const body = preferHorizontal(raw);
    const first = (await m.render(`${id}a`, withTitle(title, body))).svg;
    const natural = svgWidth(first);
    let best = { svg: first, kind: "base", natural };
    if (!width || natural <= width) return best;
    const compact = await attempt(`${id}b`, compactOf(title, body));
    if (compact) {
      best = { svg: compact, kind: "compact", natural };
      if (width / svgWidth(compact) >= MIN_SCALE) return best;
    }
    if (!opts.noWrap) {
      const chain = await readChain(m, body).catch(() => null);
      for (let k = chain ? Math.max(2, Math.floor((width * chain.order.length) / svgWidth(compact ?? first))) : 0; chain && k >= 2; k--) {
        const { src, rows } = wrapSource(chain, k);
        const rid = `${id}w${k}`;
        const svg = await attempt(rid, compactOf(title, src));
        if (!svg) break;
        if (svgWidth(svg) <= width || k === 2) return { svg, kind: "wrap", natural, wrap: { rid, rows, links: chain.links, k } };
      }
    }
    const flipped = flipVertical(body);
    if (flipped !== body) {
      const svg = await attempt(`${id}c`, withTitle(title, flipped));
      if (svg) return { svg, kind: "flip", natural };
    }
    return best;
  }

  function emphasizeKeys(root) {
    const y = (el) => /,\s*([-\d.]+)/.exec(el.getAttribute("transform") ?? "")?.[1];
    for (const keys of root.querySelectorAll(".label.attribute-keys")) {
      if (!/\bPK\b/.test(keys.textContent ?? "")) continue;
      const row = y(keys);
      for (const cell of keys.parentElement?.querySelectorAll(".label.attribute-name, .label.attribute-keys") ?? []) {
        if (y(cell) === row) cell.classList.add("diagram-key");
      }
    }
  }

  function nodeById(root, rid, id) {
    const prefix = `${rid}-flowchart-${id}-`;
    return [...root.querySelectorAll("g.node")].find((g) => g.id.startsWith(prefix) && /^\d+$/.test(g.id.slice(prefix.length))) ?? null;
  }

  const SVG_NS = "http://www.w3.org/2000/svg";
  function drawReturns(svg, { rid, rows, links, k }) {
    const inv = svg.getScreenCTM()?.inverse();
    if (!inv) throw new Error("좌표를 잴 수 없음");
    const box = (id) => {
      const r = nodeById(svg, rid, id)?.getBoundingClientRect();
      if (!r) throw new Error(`도형 ${id} 없음`);
      const a = new DOMPoint(r.left, r.top).matrixTransform(inv), b = new DOMPoint(r.right, r.bottom).matrixTransform(inv);
      return { x1: a.x, y1: a.y, x2: b.x, y2: b.y };
    };
    for (let r = 0; r + 1 < rows.length; r++) {
      const from = box(rows[r][rows[r].length - 1].id), to = box(rows[r + 1][0].id);
      const bottom = Math.max(...rows[r].map((x) => box(x.id).y2)), top = Math.min(...rows[r + 1].map((x) => box(x.id).y1));
      const mid = (bottom + top) / 2, fx = (from.x1 + from.x2) / 2, tx = (to.x1 + to.x2) / 2;
      const link = links[(r + 1) * k - 1];
      const path = document.createElementNS(SVG_NS, "path");
      path.setAttribute("d", `M${fx},${from.y2} V${mid} H${tx} V${to.y1 - 1}`);
      path.setAttribute("class", "flowchart-link wrap-return");
      path.setAttribute("fill", "none");
      if (link.stroke === "dotted") path.setAttribute("stroke-dasharray", "3 3");
      path.setAttribute("marker-end", `url(#${rid}_flowchart-v2-pointEnd)`);
      svg.appendChild(path);
      if (link.text) {
        const t = document.createElementNS(SVG_NS, "text");
        t.setAttribute("x", String((fx + tx) / 2));
        t.setAttribute("y", String(mid - 4));
        t.setAttribute("text-anchor", "middle");
        t.setAttribute("class", "wrap-label");
        t.textContent = displayText(link.text, link.labelType);
        svg.appendChild(t);
      }
    }
  }

  /** 도식 하나를 host(폭 = 읽는 글 · 판면 폭) 안에 그린다. 결과: kind · 비율 · 글자 크기 */
  async function draw(host, code, id) {
    const width = Math.floor(host.getBoundingClientRect().width);
    let laid = await layoutDiagram(window.mermaid, code, width, id);
    const put = (l) => {
      host.innerHTML = l.svg;
      emphasizeKeys(host);
      const svg = host.querySelector("svg");
      if (l.wrap) drawReturns(svg, l.wrap);
      return svg;
    };
    let svg;
    try {
      svg = put(laid);
    } catch {
      laid = await layoutDiagram(window.mermaid, code, width, `${id}n`, { noWrap: true });
      svg = put(laid);
    }
    const vb = svg.viewBox.baseVal;
    const scale = Math.min(1, width / vb.width);
    const fontPx = parseFloat(window.__codelabTheme.vars.fontSize) * scale;
    return { kind: laid.kind, scale, fontPx, width: vb.width * scale, height: vb.height * scale };
  }

  window.codelabMermaid = {
    init(theme) {
      window.__codelabTheme = theme;
      MIN_SCALE = parseFloat(theme.style.minFontSize) / parseFloat(theme.vars.fontSize);
      COMPACT = ["---", "config:", ...theme.compact, "---", ""].join("\n");
      window.mermaid.initialize(makeConfig(theme));
    },
    draw,
  };
})();

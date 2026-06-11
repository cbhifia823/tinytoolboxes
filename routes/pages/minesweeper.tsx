import { useState, useCallback, useEffect, useMemo } from "react";
import { ArrowRight, BadgeDollarSign, RotateCcw, Search } from "lucide-react";

type LocaleKey = "en" | "zh-hk" | "zh-cn" | "es";

const L: Record<LocaleKey, { name: string; title: string; subtitle: string; searchLabel: string; searchPlaceholder: string; reserveAd: string; adLabel: string; adBadge: string; newGame: string; sidebarTitle: string; sidebarSubtitle: string; howToPlay: string[]; suggestionsTitle: string; suggestions: string[]; mines: string; time: string; beginner: string; intermediate: string; expert: string }> = {
  en: { name: "English", title: "Minesweeper", subtitle: "Classic minesweeper game. Find all the mines without detonating one.", searchLabel: "Search tools", searchPlaceholder: "Try: weight, day, invoice, url", reserveAd: "Google Ads space reserved", adLabel: "Advertisement", adBadge: "Reserved", newGame: "New Game", sidebarTitle: "How to play", sidebarSubtitle: "Clear the board without hitting a mine.", howToPlay: ["Left-click a cell to reveal it","Right-click to place or remove a flag","Numbers show how many mines are adjacent","Reveal all safe cells to win"], suggestionsTitle: "You may also like", suggestions: ["Wheel Spinner", "Word Counter", "Percentage Calculator", "Age Calculator", "Unit Converter"], mines: "Mines", time: "Time", beginner: "Beginner", intermediate: "Intermediate", expert: "Expert" },
  "zh-hk": { name: "繁體中文", title: "掃雷", subtitle: "經典掃雷遊戲。搵晒所有地雷，但唔好撳爆佢。", searchLabel: "搜尋工具", searchPlaceholder: "例如：體積重量、工作日、發票", reserveAd: "預留 Google 廣告位", adLabel: "廣告", adBadge: "已預留", newGame: "新遊戲", sidebarTitle: "點玩", sidebarSubtitle: "唔撳爆地雷，清晒所有安全格。", howToPlay: ["左撳揭開一格","右撳插旗或者拔旗","數字代表隔籬有幾多粒地雷","揭晒所有安全格就贏"], suggestionsTitle: "你可能會喜歡", suggestions: ["輪盤", "字數統計", "百分比計算機", "年齡計算機", "單位轉換器"], mines: "地雷", time: "時間", beginner: "初級", intermediate: "中級", expert: "高級" },
  "zh-cn": { name: "简体中文", title: "扫雷", subtitle: "经典扫雷游戏。找到所有地雷，但别踩爆。", searchLabel: "搜索工具", searchPlaceholder: "例如：体积重量、工作日、发票", reserveAd: "预留 Google 广告位", adLabel: "广告", adBadge: "已预留", newGame: "新游戏", sidebarTitle: "怎么玩", sidebarSubtitle: "不踩爆地雷，清空所有安全格。", howToPlay: ["左键点击揭开一格","右键点击插旗或拔旗","数字代表周围有几颗地雷","揭开所有安全格就赢"], suggestionsTitle: "你可能会喜欢", suggestions: ["轮盘", "字数统计", "百分比计算器", "年龄计算器", "单位转换器"], mines: "地雷", time: "时间", beginner: "初级", intermediate: "中级", expert: "高级" },
  es: { name: "Español", title: "Buscaminas", subtitle: "El clásico juego de buscaminas.", searchLabel: "Buscar herramientas", searchPlaceholder: "Prueba: weight, day, invoice", reserveAd: "Espacio reservado para Google Ads", adLabel: "Advertisement", adBadge: "Reserved", newGame: "Nueva partida", sidebarTitle: "Cómo jugar", sidebarSubtitle: "Limpia el tablero sin tocar una mina.", howToPlay: ["Clic izquierdo para revelar una celda","Clic derecho para poner o quitar una bandera","Los números muestran cuántas minas hay adyacentes","Revela todas las celdas seguras para ganar"], suggestionsTitle: "Te puede interesar", suggestions: ["Rueda giratoria", "Contador de palabras", "Calculadora de porcentajes", "Calculadora de edad", "Conversor de unidades"], mines: "Minas", time: "Tiempo", beginner: "Principiante", intermediate: "Intermedio", expert: "Experto" },
};

const DIFF = { beginner: { rows: 9, cols: 9, mines: 10 }, intermediate: { rows: 16, cols: 16, mines: 40 }, expert: { rows: 16, cols: 30, mines: 99 } } as const;
type Difficulty = keyof typeof DIFF;
type Cell = { mine: boolean; revealed: boolean; flagged: boolean; adjacent: number };
type GS = "playing" | "won" | "lost";

const TOOLS = [
  { title: { en: "Wheel Spinner", "zh-hk": "輪盤", "zh-cn": "轮盘", es: "Rueda giratoria" }, href: "/wheel-spinner" },
  { title: { en: "Word Counter", "zh-hk": "字數統計", "zh-cn": "字数统计", es: "Contador de palabras" }, href: "/word-counter" },
  { title: { en: "Percentage Calculator", "zh-hk": "百分比計算機", "zh-cn": "百分比计算器", es: "Calculadora de porcentajes" }, href: "/percentage-calculator" },
  { title: { en: "Age Calculator", "zh-hk": "年齡計算機", "zh-cn": "年龄计算器", es: "Calculadora de edad" }, href: "/age-calculator" },
  { title: { en: "Unit Converter", "zh-hk": "單位轉換器", "zh-cn": "单位转换器", es: "Conversor de unidades" }, href: "/unit-converter" },
];

const SITE_URL = "https://www.tinytoolboxes.com";
const PAGE_PATH = "/minesweeper";

function applySEO(o: { title: string; description: string; path: string; jsonLd?: object | object[] }) {
  if (typeof document === "undefined") return;
  const url = SITE_URL + o.path;
  document.title = o.title;
  const head = document.head;
  const upsert = (sel: string, mk: () => HTMLElement, attr: string, val: string) => { let el = head.querySelector(sel) as HTMLElement | null; if (!el) { el = mk(); head.appendChild(el); } el.setAttribute(attr, val); };
  const meta = (name: string, content: string) => upsert(`meta[name="${name}"]`, () => { const m = document.createElement("meta"); m.setAttribute("name", name); return m; }, "content", content);
  const prop = (p: string, content: string) => upsert(`meta[property="${p}"]`, () => { const m = document.createElement("meta"); m.setAttribute("property", p); return m; }, "content", content);
  meta("description", o.description);
  upsert('link[rel="canonical"]', () => { const l = document.createElement("link"); l.setAttribute("rel", "canonical"); return l; }, "href", url);
  prop("og:title", o.title); prop("og:description", o.description); prop("og:url", url); prop("og:type", "website"); prop("og:site_name", "TinyToolboxes");
  meta("twitter:card", "summary"); meta("twitter:title", o.title); meta("twitter:description", o.description);
  head.querySelectorAll('script[type="application/ld+json"][data-ttb]').forEach((n) => n.remove());
  if (o.jsonLd) { (Array.isArray(o.jsonLd) ? o.jsonLd : [o.jsonLd]).forEach((data) => { const s = document.createElement("script"); s.setAttribute("type", "application/ld+json"); s.setAttribute("data-ttb", ""); s.textContent = JSON.stringify(data); head.appendChild(s); }); }
}

function createBoard(rows: number, cols: number, mines: number, fr: number, fc: number): Cell[][] {
  const b: Cell[][] = Array.from({ length: rows }, () => Array.from({ length: cols }, () => ({ mine: false, revealed: false, flagged: false, adjacent: 0 })));
  const forbid = new Set<string>();
  for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) { const nr = fr + dr, nc = fc + dc; if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) forbid.add(`${nr},${nc}`); }
  let placed = 0;
  while (placed < mines) { const r = Math.floor(Math.random() * rows), c = Math.floor(Math.random() * cols); if (!b[r][c].mine && !forbid.has(`${r},${c}`)) { b[r][c].mine = true; placed++; } }
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    if (b[r][c].mine) continue; let n = 0;
    for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) { if (dr === 0 && dc === 0) continue; const nr = r + dr, nc = c + dc; if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && b[nr][nc].mine) n++; }
    b[r][c].adjacent = n;
  }
  return b;
}

function reveal(b: Cell[][], r: number, c: number, rows: number, cols: number): Cell[][] {
  if (r < 0 || r >= rows || c < 0 || c >= cols || b[r][c].revealed || b[r][c].flagged) return b;
  const nb = b.map((row) => row.map((cl) => ({ ...cl })));
  nb[r][c].revealed = true;
  if (nb[r][c].adjacent === 0 && !nb[r][c].mine) {
    for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !nb[nr][nc].revealed && !nb[nr][nc].flagged) {
        const f = reveal(nb, nr, nc, rows, cols);
        for (let i = 0; i < rows; i++) for (let j = 0; j < cols; j++) nb[i][j] = f[i][j];
      }
    }
  }
  return nb;
}

function checkWin(b: Cell[][], rows: number, cols: number): boolean {
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) if (!b[r][c].mine && !b[r][c].revealed) return false;
  return true;
}

const numColors: Record<number, string> = { 1: "text-blue-400", 2: "text-green-400", 3: "text-red-400", 4: "text-purple-400", 5: "text-yellow-600", 6: "text-teal-400", 7: "text-white", 8: "text-gray-400" };

export default function Minesweeper() {
  const [locale, setLocale] = useState<LocaleKey>(() => typeof window === "undefined" ? "en" : ((window.localStorage.getItem("ttb-locale") as LocaleKey) || "en"));
  const [difficulty, setDifficulty] = useState<Difficulty>("beginner");
  const [board, setBoard] = useState<Cell[][] | null>(null);
  const [gameState, setGameState] = useState<GS>("playing");
  const [flagCount, setFlagCount] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [search, setSearch] = useState("");
  const { rows, cols, mines } = DIFF[difficulty];

  useEffect(() => {
    window.localStorage.setItem("ttb-locale", locale);
    applySEO({ title: `${L[locale].title} | TinyToolboxes`, description: L[locale].subtitle, path: PAGE_PATH, jsonLd: { "@context": "https://schema.org", "@type": "WebApplication", name: L[locale].title, url: SITE_URL + PAGE_PATH, description: L[locale].subtitle, applicationCategory: "GameApplication", operatingSystem: "Web", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, publisher: { "@type": "Organization", name: "TinyToolboxes", url: SITE_URL } } });
  }, [locale]);

  useEffect(() => { if (gameState !== "playing" || !startTime) return; const id = setInterval(() => setElapsed(Math.floor((Date.now() - startTime) / 1000)), 1000); return () => clearInterval(id); }, [gameState, startTime]);

  const initGame = useCallback(() => { setBoard(null); setGameState("playing"); setFlagCount(0); setStartTime(null); setElapsed(0); }, []);
  useEffect(() => { initGame(); }, [difficulty, initGame]);

  const handleClick = (r: number, c: number) => {
    if (gameState !== "playing") return;
    if (!board) {
      const nb = createBoard(rows, cols, mines, r, c);
      const rev = reveal(nb, r, c, rows, cols);
      setBoard(rev); setStartTime(Date.now());
      if (checkWin(rev, rows, cols)) setGameState("won");
      return;
    }
    if (board[r][c].revealed || board[r][c].flagged) return;
    if (board[r][c].mine) { setBoard(board.map((row) => row.map((cl) => (cl.mine ? { ...cl, revealed: true } : cl)))); setGameState("lost"); return; }
    const nb = reveal(board, r, c, rows, cols); setBoard(nb);
    if (checkWin(nb, rows, cols)) setGameState("won");
  };

  const handleRightClick = (e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    if (gameState !== "playing" || !board || board[r][c].revealed) return;
    const nb = board.map((row) => row.map((cl) => ({ ...cl })));
    nb[r][c].flagged = !nb[r][c].flagged;
    setBoard(nb); setFlagCount((p) => nb[r][c].flagged ? p + 1 : p - 1);
  };

  const content = L[locale];
  const hints = locale === "zh-hk" ? ["體積重量", "工作日", "百分比"] : locale === "zh-cn" ? ["体积重量", "工作日", "百分比"] : locale === "es" ? ["peso", "día", "porcentaje"] : ["weight", "day", "percent"];
  const filtered = useMemo(() => { const q = search.trim().toLowerCase(); if (!q) return TOOLS; return TOOLS.filter((t) => `${t.title[locale]} ${t.href}`.toLowerCase().includes(q)); }, [search, locale]);

  const cellSize = difficulty === "expert" ? "w-6 h-6 text-[10px]" : "w-8 h-8 text-sm";

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10 lg:px-8">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400/15 ring-1 ring-emerald-300/20">💣</div>
            <div><p className="text-sm uppercase tracking-[0.3em] text-emerald-300/80">TinyToolboxes</p><h1 className="text-xl font-semibold">{content.title}</h1></div>
          </div>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(L) as LocaleKey[]).map((k) => <button key={k} onClick={() => setLocale(k)} className={`rounded-full border px-3 py-2 text-sm transition ${locale === k ? "border-emerald-400/70 bg-emerald-400/15 text-emerald-200" : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"}`}>{L[k].name}</button>)}
          </div>
        </div>

        <div className="grid flex-1 gap-8 py-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <div className="space-y-6">
            <div className="max-w-3xl space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-200"><BadgeDollarSign className="h-4 w-4" />{content.reserveAd}</div>
              <div className="space-y-4"><h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">{content.title}</h2><p className="max-w-2xl text-base leading-7 text-white/70 sm:text-lg">{content.subtitle}</p></div>
            </div>

            {/* Difficulty selector */}
            <div className="flex flex-wrap gap-2">
              {(Object.keys(DIFF) as Difficulty[]).map((d) => (
                <button key={d} onClick={() => setDifficulty(d)} className={`rounded-full border px-4 py-2 text-sm font-medium transition ${difficulty === d ? "border-emerald-400/70 bg-emerald-400/15 text-emerald-200" : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"}`}>
                  {content[d]} ({DIFF[d].rows}×{DIFF[d].cols}, {DIFF[d].mines} 💣)
                </button>
              ))}
            </div>

            {/* Game board */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="rounded-xl border border-white/10 bg-black/30 px-3 py-1.5 text-sm font-mono">💣 {mines - flagCount}</span>
                  <span className="rounded-xl border border-white/10 bg-black/30 px-3 py-1.5 text-sm font-mono">⏱️ {elapsed}s</span>
                </div>
                <button onClick={initGame} className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/70 hover:bg-white/10 transition"><RotateCcw className="h-4 w-4" />{content.newGame}</button>
              </div>

              {gameState === "won" && <div className="rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-3 text-center text-lg font-bold text-emerald-300">🎉 You Win!</div>}
              {gameState === "lost" && <div className="rounded-xl border border-red-400/30 bg-red-400/10 p-3 text-center text-lg font-bold text-red-300">💥 Game Over!</div>}

              <div className="overflow-x-auto">
                <div className="inline-block rounded-xl border border-white/10 bg-black/30 p-2">
                  {(board ?? Array.from({ length: rows }, () => Array.from({ length: cols }, () => null))).map((row, r) => (
                    <div key={r} className="flex">
                      {row.map((cell, c) => {
                        if (!cell) {
                          return <button key={c} onClick={() => handleClick(r, c)} className={`${cellSize} flex items-center justify-center select-none bg-zinc-600 hover:bg-zinc-500 cursor-pointer border border-zinc-500/50 transition-colors`} />;
                        }
                        if (cell.revealed) {
                          if (cell.mine) {
                            return <div key={c} className={`${cellSize} flex items-center justify-center select-none bg-red-900/60 border border-zinc-700/50`}>💣</div>;
                          }
                          return <div key={c} className={`${cellSize} flex items-center justify-center select-none bg-zinc-800 border border-zinc-700/50 font-bold ${cell.adjacent > 0 ? numColors[cell.adjacent] : ""}`}>{cell.adjacent > 0 ? cell.adjacent : ""}</div>;
                        }
                        return (
                          <button key={c} onClick={() => handleClick(r, c)} onContextMenu={(e) => handleRightClick(e, r, c)} className={`${cellSize} flex items-center justify-center select-none bg-zinc-600 hover:bg-zinc-500 cursor-pointer border border-zinc-500/50 transition-colors`}>
                            {cell.flagged ? "🚩" : ""}
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-xs text-white/40 text-center">Left click to reveal · Right click to flag</p>
            </div>

            {/* Search */}
            <section className="rounded-3xl border border-white/10 bg-black/20 p-4">
              <label className="block space-y-2"><span className="text-sm font-medium text-white/80">{content.searchLabel}</span>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3"><Search className="h-4 w-4 text-emerald-300" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={content.searchPlaceholder} className="w-full bg-transparent text-sm text-white placeholder:text-white/35 outline-none" /></div>
              </label>
              <div className="mt-3 flex flex-wrap gap-2">{hints.map((h) => <button key={h} type="button" onClick={() => setSearch(h)} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 hover:bg-white/10 transition">{h}</button>)}</div>
              <div className="mt-4 grid gap-2">{filtered.map((t) => <button key={t.href} type="button" onClick={() => (window.location.href = t.href)} className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left hover:border-emerald-300/30 hover:bg-white/10 transition"><div><p className="text-sm font-medium text-white">{t.title[locale]}</p></div><ArrowRight className="h-4 w-4 shrink-0 text-white/35" /></button>)}</div>
            </section>

            {/* Ad placeholder */}
            <section className="rounded-3xl border border-dashed border-white/15 bg-white/5 p-5">
              <div className="flex items-center justify-between gap-4"><div><p className="text-sm uppercase tracking-[0.28em] text-emerald-300/80">{content.adLabel}</p></div><span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-white/35">{content.adBadge}</span></div>
              <div className="mt-4 min-h-[120px] rounded-2xl border border-white/10 bg-black/20" />
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center gap-3"><div className="rounded-2xl bg-white/10 p-3">💣</div><div><h2 className="text-lg font-semibold">{content.sidebarTitle}</h2><p className="text-sm text-neutral-300">{content.sidebarSubtitle}</p></div></div>
            <div className="space-y-3 text-sm text-neutral-300">
              {content.howToPlay.map((uc) => <p key={uc} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">{uc}</p>)}
            </div>
            <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
              <h3 className="text-sm font-semibold text-white">{content.suggestionsTitle}</h3>
              <div className="mt-3 space-y-2">
                {content.suggestions.map((name) => {
                  const match = TOOLS.find((tool) => tool.title[locale] === name);
                  return (
                    <button key={name} type="button" onClick={() => match && (window.location.href = match.href)} className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-white/80 transition hover:bg-white/10">
                      <span>{name}</span><ArrowRight className="h-4 w-4 text-white/35" />
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

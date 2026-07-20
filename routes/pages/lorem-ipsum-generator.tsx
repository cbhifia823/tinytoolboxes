import { useEffect, useState } from "react";
import { Copy, RefreshCw, Search } from "lucide-react";

type LocaleKey = "en" | "zh-hk" | "zh-cn" | "es";

const COPY: Record<LocaleKey, any> = {
  en: {
    name: "English", title: "Lorem Ipsum Generator", subtitle: "Generate placeholder text for mockups and designs. Choose paragraphs, words, or bytes.",
    searchLabel: "Search tools", searchPlaceholder: "Try: QR, password, uuid, base64",
    generate: "Generate", copy: "Copy", copied: "Copied!",
    paragraphs: "Paragraphs", words: "Words", bytes: "Bytes",
    whatIsTitle: "What is Lorem Ipsum?",
    whatIsDesc: "Lorem Ipsum is pseudo-Latin placeholder text used in design to demonstrate visual form without meaningful content.",
    useCasesTitle: "Use Cases",
    useCases: ["Website mockups", "Print layout", "Font testing", "CMS demos", "App prototypes", "Client drafts"],
    faqTitle: "FAQ",
    faqs: [{q:"Why Lorem Ipsum?","a":"Real text distracts reviewers from design. Lorem Ipsum looks like readable English without conveying meaning."},{q:"Is it Latin?","a":"Scrambled Latin from Cicero's 'De Finibus Bonorum et Malorum' (45 BC)."}],
    relatedTitle: "Related Tools",
    related: [{href:"/uuid-generator",label:"UUID Generator"},{href:"/password-generator",label:"Password Generator"},{href:"/base64-encoder-decoder",label:"Base64 Encoder / Decoder"}]
  },
  "zh-hk": {
    name: "繁體中文", title: "Lorem Ipsum 產生器", subtitle: "為設計稿生成佔位文字。可選段落、單詞或字節模式。",
    searchLabel: "搜尋工具", searchPlaceholder: "例如：QR、密碼、UUID",
    generate: "產生", copy: "複製", copied: "已複製！",
    paragraphs: "段落", words: "單詞", bytes: "字節",
    whatIsTitle: "咩係 Lorem Ipsum？",
    whatIsDesc: "Lorem Ipsum 係偽拉丁文佔位文字，廣泛用喺設計行業展示視覺效果。",
    useCasesTitle: "使用場景",
    useCases: ["網站模型", "印刷設計", "字體測試", "CMS 示範", "App 原型", "客戶草稿"],
    faqTitle: "常見問題",
    faqs: [{q:"點解用 Lorem Ipsum？","a":"真實文字會令審閱者分心，Lorem Ipsum 睇落似英文但冇意思。"},{q:"係拉丁文嗎？","a":"源自西塞羅公元前45年著作，經過改動嘅拉丁文。"}],
    relatedTitle: "相關工具",
    related: [{href:"/uuid-generator",label:"UUID 產生器"},{href:"/password-generator",label:"密碼產生器"},{href:"/base64-encoder-decoder",label:"Base64 編碼"}]
  },
  "zh-cn": {
    name: "简体中文", title: "Lorem Ipsum 生成器", subtitle: "为设计稿生成占位文字。可选段落、单词或字节模式。",
    searchLabel: "搜索工具", searchPlaceholder: "例如：QR、密码、UUID",
    generate: "生成", copy: "复制", copied: "已复制！",
    paragraphs: "段落", words: "单词", bytes: "字节",
    whatIsTitle: "什么是 Lorem Ipsum？",
    whatIsDesc: "Lorem Ipsum 是伪拉丁文占位文字，广泛用于设计行业展示视觉效果。",
    useCasesTitle: "使用场景",
    useCases: ["网站模型", "印刷设计", "字体测试", "CMS 演示", "App 原型", "客户草稿"],
    faqTitle: "常见问题",
    faqs: [{q:"为什么用 Lorem Ipsum？","a":"真实文字会让审阅者分心，Lorem Ipsum 看起来像英文但没有含义。"},{q:"是拉丁文吗？","a":"源自西塞罗公元前45年著作，经过改动的拉丁文。"}],
    relatedTitle: "相关工具",
    related: [{href:"/uuid-generator",label:"UUID 生成器"},{href:"/password-generator",label:"密码生成器"},{href:"/base64-encoder-decoder",label:"Base64 编码"}]
  },
  es: {
    name: "Español", title: "Generador Lorem Ipsum", subtitle: "Genera texto placeholder para maquetas. Elige párrafos, palabras o bytes.",
    searchLabel: "Buscar herramientas", searchPlaceholder: "Prueba: QR, contraseña, UUID",
    generate: "Generar", copy: "Copiar", copied: "¡Copiado!",
    paragraphs: "Párrafos", words: "Palabras", bytes: "Bytes",
    whatIsTitle: "¿Qué es Lorem Ipsum?",
    whatIsDesc: "Lorem Ipsum es texto pseudo-latino usado en diseño para mostrar forma visual sin contenido significativo.",
    useCasesTitle: "Casos de uso",
    useCases: ["Maquetas web", "Diseño impreso", "Pruebas tipográficas", "Demos CMS", "Prototipos app", "Borradores cliente"],
    faqTitle: "Preguntas frecuentes",
    faqs: [{q:"¿Por qué Lorem Ipsum?","a":"El texto real distrae del diseño. Lorem Ipsum parece inglés legible sin transmitir significado."},{q:"¿Es latín?","a":"Latín alterado de 'De Finibus Bonorum et Malorum' de Cicerón (45 AC)."}],
    relatedTitle: "Herramientas relacionadas",
    related: [{href:"/uuid-generator",label:"Generador UUID"},{href:"/password-generator",label:"Generador Contraseñas"},{href:"/base64-encoder-decoder",label:"Codificador Base64"}]
  }
};

const LOREM_PARAS = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.",
  "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores.",
  "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque.",
  "Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi.",
  "Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates.",
  "Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur.",
];

const PAGE_PATH = "/lorem-ipsum-generator";

function applySEO(o: { title: string; description: string; path: string }) {
  if (typeof document === "undefined") return;
  document.title = o.title + " — TinyToolboxes";
  const metaDesc = document.querySelector('meta[name="description"]') || (() => { const el = document.createElement("meta"); el.name = "description"; document.head.appendChild(el); return el; })();
  metaDesc.setAttribute("content", o.description);
  const canonical = document.querySelector('link[rel="canonical"]') || (() => { const el = document.createElement("link"); el.rel = "canonical"; document.head.appendChild(el); return el; })();
  canonical.setAttribute("href", "https://www.tinytoolboxes.com" + o.path);
}

export default function LoremIpsumGenerator() {
  const [locale, setLocale] = useState<LocaleKey>(() => (typeof localStorage !== "undefined" ? (localStorage.getItem("tt-locale") as LocaleKey) || "en" : "en"));
  const [paras, setParas] = useState(3);
  const [mode, setMode] = useState<"paragraphs"|"words"|"bytes">("paragraphs");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [keyword, setKeyword] = useState("");

  const content = COPY[locale] || COPY.en;

  useEffect(() => {
    applySEO({ title: content.title, description: content.subtitle, path: PAGE_PATH });
    localStorage.setItem("tt-locale", locale);
  }, [locale, content.title, content.subtitle]);

  function generate() {
    if (mode === "paragraphs") {
      setOutput(Array.from({ length: paras }, (_, i) => LOREM_PARAS[i % LOREM_PARAS.length]).join("\n\n"));
    } else if (mode === "words") {
      const allWords = LOREM_PARAS.join(" ").replace(/[.,]/g, "").toLowerCase().split(" ");
      const result: string[] = [];
      for (let i = 0; i < paras; i++) result.push(allWords[i % allWords.length]);
      setOutput(result.join(" "));
    } else {
      const fullText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
      const repeated = fullText.repeat(Math.ceil(paras / fullText.length));
      setOutput(repeated.slice(0, paras));
    }
  }

  function copyText() {
    navigator.clipboard.writeText(output).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500); });
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const v = keyword.trim().toLowerCase();
    if (!v) return;
    const map: Record<string, string> = { lorem: "/lorem-ipsum-generator", ipsum: "/lorem-ipsum-generator", uuid: "/uuid-generator", binary: "/binary-translator", morse: "/morse-code-translator", base64: "/base64-encoder-decoder", password: "/password-generator", json: "/json-formatter", qr: "/qr-code-generator" };
    window.location.href = map[v] || "/";
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-950 to-zinc-900 text-zinc-200">
      <header className="sticky top-0 z-50 backdrop-blur-md bg-zinc-950/80 border-b border-amber-800/30">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <a href="/" className="flex items-center gap-2 font-semibold text-amber-400 hover:text-amber-300 transition-colors shrink-0">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="4"/><path d="M7 8h3M14 8h3M7 12h10M7 16h5"/></svg>
            TinyToolboxes
          </a>
          <div className="flex items-center gap-2 flex-wrap">
            {(["en","zh-hk","zh-cn","es"] as LocaleKey[]).map(l => (
              <button key={l} onClick={() => setLocale(l)} className={"px-2 py-1 text-xs rounded border transition " + (locale === l ? "bg-amber-600/20 border-amber-500 text-amber-300" : "border-zinc-700 text-zinc-400 hover:border-zinc-500")}>{COPY[l]?.name || l}</button>
            ))}
          </div>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">{content.title}</h1>
            <p className="text-zinc-400">{content.subtitle}</p>
          </div>

          <div className="bg-white/5 rounded-xl border border-zinc-700/50 p-6 mb-8">
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <div className="flex bg-zinc-800 rounded-lg p-0.5">
                {(["paragraphs","words","bytes"] as const).map(m => (
                  <button key={m} onClick={() => { setMode(m); }} className={"px-3 py-1.5 text-xs rounded-md font-medium transition " + (mode === m ? "bg-amber-600 text-white" : "text-zinc-400 hover:text-zinc-200")}>{(content as any)[m]}</button>
                ))}
              </div>
              <input type="number" min="1" max="200" value={paras} onChange={e => setParas(Math.min(200, Math.max(1, parseInt(e.target.value) || 1)))} className="w-20 bg-zinc-800 border border-zinc-600 rounded px-3 py-1.5 text-sm text-zinc-200" />
              <button onClick={generate} className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-medium transition flex items-center gap-2"><RefreshCw className="w-4 h-4" />{content.generate}</button>
            </div>
            {output && (
              <div className="relative">
                <textarea readOnly value={output} className="w-full h-48 bg-zinc-800/50 border border-zinc-700/40 rounded-lg p-4 text-sm text-zinc-300 font-mono resize-y" />
                <button onClick={copyText} className="absolute top-3 right-3 p-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg transition" title={content.copy}><Copy className="w-4 h-4 text-zinc-300" /></button>
              </div>
            )}
            {copied && <p className="text-emerald-400 text-xs mt-2">{content.copied}</p>}
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white/5 rounded-xl border border-zinc-700/50 p-5">
              <h2 className="font-semibold text-white mb-3">{content.whatIsTitle}</h2>
              <p className="text-zinc-400 text-sm leading-relaxed">{content.whatIsDesc}</p>
            </div>
            <div className="bg-white/5 rounded-xl border border-zinc-700/50 p-5">
              <h2 className="font-semibold text-white mb-3">{content.useCasesTitle}</h2>
              <ul className="space-y-2 text-sm text-zinc-400">
                {content.useCases.map((u: string, i: number) => (<li key={i} className="flex gap-2"><span className="text-amber-400 shrink-0">•</span>{u}</li>))}
              </ul>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl border border-zinc-700/50 p-5 mb-8">
            <h2 className="font-semibold text-white mb-3">{content.faqTitle}</h2>
            <div className="space-y-4">
              {content.faqs.map((faq: {q:string;a:string}, i: number) => (
                <details key={i} className="group">
                  <summary className="cursor-pointer text-zinc-300 text-sm font-medium hover:text-amber-400 transition-colors">{faq.q}</summary>
                  <p className="mt-2 text-zinc-500 text-sm leading-relaxed pl-3 border-l-2 border-amber-800/40">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>

          <div className="bg-white/5 rounded-xl border border-zinc-700/50 p-5 mb-8">
            <h2 className="font-semibold text-white mb-3">{content.relatedTitle}</h2>
            <div className="grid sm:grid-cols-2 gap-2">
              {content.related.map((r: {href:string;label:string}, i: number) => (
                <a key={i} href={r.href} className="text-sm text-amber-400 hover:text-amber-300 hover:underline transition">{r.label}</a>
              ))}
            </div>
          </div>

          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input type="text" value={keyword} onChange={e => setKeyword(e.target.value)} placeholder={content.searchPlaceholder} className="w-full pl-9 pr-4 py-2.5 bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-amber-600" />
          </form>
        </div>
      </section>
    </main>
  );
}

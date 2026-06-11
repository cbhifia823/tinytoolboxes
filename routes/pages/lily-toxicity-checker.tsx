import { useEffect, useMemo, useState } from "react";
import { ArrowRight, AlertTriangle, BadgeDollarSign, Cat, Search, Flower2 } from "lucide-react";

const LANGUAGES = {
  en: {
    name: "English",
    title: "Lily Toxicity Checker for Cats",
    subtitle: "Search for lily species by common or scientific name to see if they're dangerous for cats. True lilies (Lilium and Hemerocallis) cause acute kidney failure — others are safer.",
    reserveAd: "Google Ads space reserved",
    reserveAdSub: "You can drop AdSense code here later.",
    adLabel: "Advertisement",
    adBadge: "Reserved",
    emergency: "True Lilies Kill Cats",
    emergencyNote: "All parts of true lilies (Lilium and Hemerocallis species) — petals, leaves, pollen, stamens, and even the water in the vase — can cause acute kidney failure in cats within 24-72 hours. Even a tiny amount can be fatal. If your cat licked pollen off its fur or drank from a vase with cut lilies, go to an emergency vet immediately. Do not wait for symptoms.",
    deadly: "Deadly — Emergency vet NOW",
    mild: "Mild — May irritate, not lethal",
    safe: "Safe — Non-toxic",
    searchLabel: "Search lily species",
    searchPlaceholder: "Try: Easter, Tiger, Peace, Calla, Stargazer",
  },
  "zh-hk": {
    name: "繁體中文",
    title: "貓貓百合毒性檢查器",
    subtitle: "用常見名或學名搜尋百合品種，確認對貓有冇危險。真正百合（Lilium 同 Hemerocallis）會引致急性腎衰竭 — 其他品種較安全。",
    reserveAd: "預留 Google 廣告位",
    reserveAdSub: "之後可直接放 AdSense 程式碼。",
    adLabel: "廣告",
    adBadge: "已預留",
    emergency: "真百合會殺貓",
    emergencyNote: "真正百合（Lilium 同 Hemerocallis 品種）嘅所有部分 — 花瓣、葉、花粉、雄蕊，甚至花瓶入面嘅水 — 都可以喺 24-72 小時內引致貓貓急性腎衰竭。即使極微量都可能致命。如果貓貓舔咗身上嘅花粉或者飲咗插花嘅水，立即去急診。唔好等症狀出現。",
    deadly: "致命 — 立即去急診",
    mild: "輕微 — 可能刺激，不致致命",
    safe: "安全 — 無毒",
    searchLabel: "搜尋百合品種",
    searchPlaceholder: "例如：復活節、虎、和平、馬蹄蓮、星佳沙",
  },
  "zh-cn": {
    name: "简体中文",
    title: "猫咪百合毒性检查器",
    subtitle: "用常见名或学名搜索百合品种，确认对猫有无危险。真正百合（Lilium 和 Hemerocallis）会引起急性肾衰竭 — 其他品种较安全。",
    reserveAd: "预留 Google 广告位",
    reserveAdSub: "之后可直接放 AdSense 代码。",
    adLabel: "广告",
    adBadge: "已预留",
    emergency: "真百合会杀猫",
    emergencyNote: "真正百合（Lilium 和 Hemerocallis 品种）的所有部分 — 花瓣、叶、花粉、雄蕊，甚至花瓶里的水 — 都可以在 24-72 小时内引起猫咪急性肾衰竭。即使极微量都可能致命。如果猫咪舔了身上的花粉或者喝了插花的水，立即去急诊。不要等出现症状。",
    deadly: "致命 — 立即去急诊",
    mild: "轻微 — 可能刺激，不致致命",
    safe: "安全 — 无毒",
    searchLabel: "搜索百合品种",
    searchPlaceholder: "例如：复活节、虎、和平、马蹄莲、星佳沙",
  },
  es: {
    name: "Español",
    title: "Comprobador de toxicidad de lirios para gatos",
    subtitle: "Busca especies de lirio por nombre común o científico para ver si son peligrosas para gatos. Los lirios verdaderos (Lilium y Hemerocallis) causan insuficiencia renal aguda — otros son más seguros.",
    reserveAd: "Espacio reservado para Google Ads",
    reserveAdSub: "Puedes insertar AdSense aquí más adelante.",
    adLabel: "Publicidad",
    adBadge: "Reservado",
    emergency: "Los lirios verdaderos matan gatos",
    emergencyNote: "Todas las partes de los lirios verdaderos (especies Lilium y Hemerocallis) — pétalos, hojas, polen, estambres e incluso el agua del jarrón — pueden causar insuficiencia renal aguda en gatos en 24-72 horas. Incluso una cantidad minúscula puede ser fatal. Si tu gato se lamió polen del pelaje o bebió del jarrón con lirios, ve a un veterinario de urgencia inmediatamente. No esperes a los síntomas.",
    deadly: "Mortal — Veterinario urgente YA",
    mild: "Leve — Puede irritar, no letal",
    safe: "Seguro — No tóxico",
    searchLabel: "Buscar especie de lirio",
    searchPlaceholder: "Prueba: Pascua, Tigre, Paz, Cala, Stargazer",
  },
};

const TOOLS = [
  { title: { en: "Chocolate Toxicity Calculator", "zh-hk": "朱古力毒性計算機", "zh-cn": "巧克力毒性计算器", es: "Calculadora de toxicidad del chocolate" }, description: { en: "Theobromine dose for dogs.", "zh-hk": "朱古力對狗嘅可可鹼劑量。", "zh-cn": "巧克力对狗的可可碱剂量。", es: "Dosis de teobromina para perros." }, href: "/chocolate-toxicity-calculator", keywords: ["chocolate", "dog"] },
  { title: { en: "Xylitol Toxicity Calculator", "zh-hk": "木糖醇毒性計算機", "zh-cn": "木糖醇毒性计算器", es: "Calculadora de toxicidad del xilitol" }, description: { en: "Xylitol risk for dogs.", "zh-hk": "木糖醇對狗嘅風險。", "zh-cn": "木糖醇对狗的风险。", es: "Riesgo de xilitol para perros." }, href: "/xylitol-toxicity-calculator", keywords: ["xylitol", "dog"] },
  { title: { en: "Pet Calorie Calculator (RER)", "zh-hk": "寵物卡路里計算機 (RER)", "zh-cn": "宠物卡路里计算器 (RER)", es: "Calculadora de calorías para mascotas (RER)" }, description: { en: "Daily calorie needs.", "zh-hk": "貓狗每日卡路里需求。", "zh-cn": "猫狗每日卡路里需求。", es: "Necesidades calóricas diarias." }, href: "/pet-calorie-calculator", keywords: ["calorie", "rer"] },
  { title: { en: "Can My Dog Eat This?", "zh-hk": "狗狗可以食呢樣嗎？", "zh-cn": "狗狗可以吃这个吗？", es: "¿Mi perro puede comer esto?" }, description: { en: "Food safety lookup.", "zh-hk": "查食物安唔安全畀狗。", "zh-cn": "查食物是否安全给狗。", es: "Búsqueda de seguridad alimentaria." }, href: "/can-my-dog-eat", keywords: ["food", "dog"] },
  { title: { en: "Dog Age in Human Years", "zh-hk": "狗狗年齡換算（人類年齡）", "zh-cn": "狗狗年龄换算（人类年龄）", es: "Edad de perro en años humanos" }, description: { en: "UCSD age formula.", "zh-hk": "用 UCSD 公式計狗年齡。", "zh-cn": "用 UCSD 公式计算狗年龄。", es: "Fórmula UCSD de edad canina." }, href: "/dog-age-calculator", keywords: ["dog", "age"] },
  { title: { en: "Cat Age in Human Years", "zh-hk": "貓貓年齡換算（人類年齡）", "zh-cn": "猫咪年龄换算（人类年龄）", es: "Edad de gato en años humanos" }, description: { en: "Cat age conversion.", "zh-hk": "貓年齡換算人類年齡。", "zh-cn": "猫年龄换算人类年龄。", es: "Conversión de edad felina." }, href: "/cat-age-calculator", keywords: ["cat", "age"] },
];

type Level = "deadly" | "mild" | "safe";

const LILIES: Array<{ id: string; level: Level; names: { en: string; "zh-hk": string; "zh-cn": string; es: string }; scientific: string; note: string; keywords: string[] }> = [
  { id: "easter", level: "deadly", names: { en: "Easter Lily", "zh-hk": "復活節百合", "zh-cn": "复活节百合", es: "Lirio de Pascua" }, scientific: "Lilium longiflorum", note: "All parts of the plant including pollen and vase water cause acute kidney failure in cats.", keywords: ["easter", "lilium", "longiflorum"] },
  { id: "tiger", level: "deadly", names: { en: "Tiger Lily", "zh-hk": "虎百合", "zh-cn": "虎百合", es: "Lirio tigre" }, scientific: "Lilium lancifolium / tigrinum", note: "Highly toxic. Even tiny ingestions can cause renal failure within 24-72 hours.", keywords: ["tiger", "lancifolium", "tigrinum"] },
  { id: "asiatic", level: "deadly", names: { en: "Asiatic Lily", "zh-hk": "亞洲百合", "zh-cn": "亚洲百合", es: "Lirio asiático" }, scientific: "Lilium hybrid (Asiatic group)", note: "Common cut-flower lily. All parts highly toxic to cats.", keywords: ["asiatic", "lilium"] },
  { id: "oriental", level: "deadly", names: { en: "Oriental Lily / Stargazer", "zh-hk": "東方百合／星佳沙", "zh-cn": "东方百合", es: "Lirio oriental / Stargazer" }, scientific: "Lilium hybrid (Oriental group)", note: "Stargazer is a popular florist variety. Acutely nephrotoxic.", keywords: ["oriental", "stargazer", "lilium"] },
  { id: "daylily", level: "deadly", names: { en: "Daylily", "zh-hk": "萱草", "zh-cn": "萱草", es: "Hemerocalis" }, scientific: "Hemerocallis species", note: "Not a true Lilium, but equally toxic to cats — also causes acute kidney failure.", keywords: ["daylily", "hemerocallis"] },
  { id: "rubrum", level: "deadly", names: { en: "Rubrum / Japanese Show Lily", "zh-hk": "鹿子百合", "zh-cn": "鹿子百合", es: "Lirio Rubrum" }, scientific: "Lilium speciosum", note: "Same toxicity profile as other Lilium species.", keywords: ["rubrum", "speciosum"] },
  { id: "wood", level: "deadly", names: { en: "Wood Lily", "zh-hk": "森林百合", "zh-cn": "森林百合", es: "Lirio de bosque" }, scientific: "Lilium philadelphicum", note: "Wild North American Lilium. Toxic to cats.", keywords: ["wood", "philadelphicum"] },
  { id: "redstar", level: "deadly", names: { en: "Red Star Lily / Stargazer Lily", "zh-hk": "紅色星佳沙", "zh-cn": "红星百合", es: "Lirio estrella roja" }, scientific: "Lilium hybrid", note: "Oriental hybrid. Same renal toxicity.", keywords: ["star", "red", "lilium"] },
  { id: "calla", level: "mild", names: { en: "Calla Lily", "zh-hk": "馬蹄蓮", "zh-cn": "马蹄莲", es: "Cala" }, scientific: "Zantedeschia aethiopica", note: "NOT a true lily. Contains insoluble calcium oxalates causing oral irritation, drooling, vomiting. Not nephrotoxic.", keywords: ["calla", "zantedeschia"] },
  { id: "peace", level: "mild", names: { en: "Peace Lily", "zh-hk": "和平百合／白鶴芋", "zh-cn": "和平百合", es: "Lirio de la paz" }, scientific: "Spathiphyllum species", note: "NOT a true lily. Calcium oxalate crystals cause mouth and throat irritation. Not fatal but uncomfortable.", keywords: ["peace", "spathiphyllum"] },
  { id: "peruvian", level: "mild", names: { en: "Peruvian Lily / Alstroemeria", "zh-hk": "秘魯百合", "zh-cn": "秘鲁百合", es: "Alstroemeria" }, scientific: "Alstroemeria species", note: "NOT a true lily. May cause mild GI upset. Safer than true lilies but not 100% benign.", keywords: ["peruvian", "alstroemeria"] },
  { id: "lily_valley", level: "mild", names: { en: "Lily of the Valley", "zh-hk": "鈴蘭", "zh-cn": "铃兰", es: "Lirio del valle" }, scientific: "Convallaria majalis", note: "NOT a true lily but contains cardiac glycosides. Can cause vomiting, arrhythmia, seizures. Different mechanism from Lilium.", keywords: ["valley", "convallaria"] },
  { id: "canna", level: "safe", names: { en: "Canna Lily", "zh-hk": "美人蕉", "zh-cn": "美人蕉", es: "Cana" }, scientific: "Canna species", note: "NOT a true lily. Generally considered non-toxic to cats.", keywords: ["canna"] },
  { id: "plantain", level: "safe", names: { en: "Plantain Lily / Hosta", "zh-hk": "玉簪", "zh-cn": "玉簪", es: "Hosta" }, scientific: "Hosta species", note: "NOT a true lily — but Hostas can cause GI upset in dogs and cats. Not nephrotoxic.", keywords: ["plantain", "hosta"] },
];

const SITE_URL = "https://www.tinytoolboxes.com";
const PAGE_PATH = "/lily-toxicity-checker";

function applySEO(o: { title: string; description: string; path: string; jsonLd?: object | object[] }) {
  if (typeof document === "undefined") return;
  const url = SITE_URL + o.path;
  document.title = o.title;
  const head = document.head;
  const upsert = (sel: string, mk: () => HTMLElement, attr: string, val: string) => {
    let el = head.querySelector(sel) as HTMLElement | null;
    if (!el) { el = mk(); head.appendChild(el); }
    el.setAttribute(attr, val);
  };
  const meta = (name: string, content: string) => upsert(`meta[name="${name}"]`, () => { const m = document.createElement("meta"); m.setAttribute("name", name); return m; }, "content", content);
  const prop = (p: string, content: string) => upsert(`meta[property="${p}"]`, () => { const m = document.createElement("meta"); m.setAttribute("property", p); return m; }, "content", content);
  meta("description", o.description);
  upsert('link[rel="canonical"]', () => { const l = document.createElement("link"); l.setAttribute("rel", "canonical"); return l; }, "href", url);
  prop("og:title", o.title); prop("og:description", o.description); prop("og:url", url); prop("og:type", "website"); prop("og:site_name", "TinyToolboxes");
  meta("twitter:card", "summary"); meta("twitter:title", o.title); meta("twitter:description", o.description);
  const old = head.querySelectorAll('script[type="application/ld+json"][data-ttb]');
  old.forEach((n) => n.remove());
  if (o.jsonLd) { const arr = Array.isArray(o.jsonLd) ? o.jsonLd : [o.jsonLd]; arr.forEach((data) => { const s = document.createElement("script"); s.setAttribute("type", "application/ld+json"); s.setAttribute("data-ttb", ""); s.textContent = JSON.stringify(data); head.appendChild(s); }); }
}

export default function LilyToxicityChecker() {
  const [locale, setLocale] = useState<keyof typeof LANGUAGES>(() => typeof window === "undefined" ? "en" : ((window.localStorage.getItem("ttb-locale") as keyof typeof LANGUAGES) || "en"));
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    window.localStorage.setItem("ttb-locale", locale);
    const L = LANGUAGES[locale];
    applySEO({ title: `${L.title} | TinyToolboxes`, description: L.subtitle, path: PAGE_PATH, jsonLd: { "@context": "https://schema.org", "@type": "WebApplication", name: L.title, url: SITE_URL + PAGE_PATH, description: L.subtitle, applicationCategory: "HealthApplication", operatingSystem: "Web", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, publisher: { "@type": "Organization", name: "TinyToolboxes", url: SITE_URL } } });
  }, [locale]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return LILIES;
    return LILIES.filter((l) => l.names[locale].toLowerCase().includes(q) || l.names.en.toLowerCase().includes(q) || l.scientific.toLowerCase().includes(q) || l.keywords.some((k) => k.includes(q)));
  }, [query, locale]);

  const content = LANGUAGES[locale];
  const hints = locale === "zh-hk" ? ["朱古力", "木糖醇", "卡路里"] : locale === "zh-cn" ? ["巧克力", "木糖醇", "卡路里"] : ["chocolate", "xylitol", "calorie"];
  const filteredTools = useMemo(() => { const q = search.trim().toLowerCase(); if (!q) return TOOLS; return TOOLS.filter((t) => `${t.title[locale]} ${t.description[locale]} ${t.keywords.join(" ")}`.toLowerCase().includes(q)); }, [search]);

  const colorFor = (level: Level) => level === "deadly" ? "from-red-500 to-rose-600 text-white border-red-400/30" : level === "mild" ? "from-amber-400 to-orange-500 text-neutral-900 border-amber-400/40" : "from-emerald-400 to-teal-500 text-neutral-900 border-emerald-400/40";

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10 lg:px-8">
        <div className="flex flex-col gap-4 border-b border-amber-400/15 pb-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-400/15 ring-1 ring-amber-300/20"><Cat className="h-5 w-5 text-amber-300" /></div>
            <div><p className="text-sm uppercase tracking-[0.3em] text-amber-300/80">TinyToolboxes · Pet</p><h1 className="text-xl font-semibold">{content.title}</h1></div>
          </div>
          <div className="flex flex-wrap gap-2">{(Object.keys(LANGUAGES) as Array<keyof typeof LANGUAGES>).map((key) => <button key={key} onClick={() => setLocale(key)} className={`rounded-full border px-3 py-2 text-sm transition ${locale === key ? "border-amber-400/70 bg-amber-400/15 text-amber-200" : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"}`}>{LANGUAGES[key].name}</button>)}</div>
        </div>

        <div className="grid flex-1 gap-8 py-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <div className="space-y-8">
            <div className="max-w-3xl space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-2 text-sm text-amber-200"><BadgeDollarSign className="h-4 w-4" />{content.reserveAd}</div>
              <div className="space-y-4"><h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">{content.title}</h2><p className="max-w-2xl text-base leading-7 text-white/70 sm:text-lg">{content.subtitle}</p></div>
              <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-100">
                <div className="flex items-center gap-2 font-semibold text-rose-200"><AlertTriangle className="h-4 w-4" />{content.emergency}</div>
                <p className="mt-2 leading-6 text-rose-100/85">{content.emergencyNote}</p>
                <p className="mt-2 text-xs text-rose-200/70">ASPCA Animal Poison Control: <span className="font-semibold">(888) 426-4435</span></p>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-4">
              <label className="block space-y-2"><span className="text-sm text-neutral-300">{content.searchLabel}</span>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3"><Flower2 className="h-4 w-4 text-amber-300" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={content.searchPlaceholder} className="w-full bg-transparent text-sm text-white placeholder:text-white/35 outline-none" /></div>
              </label>
              <div className="grid gap-3">
                {results.map((l) => (
                  <div key={l.id} className={`rounded-2xl border bg-gradient-to-br p-4 ${colorFor(l.level)}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-lg font-semibold">{l.names[locale]}</p>
                        <p className="text-xs opacity-75 italic">{l.scientific}</p>
                      </div>
                      <span className="rounded-full bg-black/25 px-3 py-1 text-xs font-semibold uppercase tracking-wider">{content[l.level]}</span>
                    </div>
                    <p className="mt-2 text-sm opacity-90">{l.note}</p>
                  </div>
                ))}
                {!results.length && <p className="text-sm text-white/50">No match. Try "easter", "calla", or "peace".</p>}
              </div>
            </div>

            <section className="rounded-3xl border border-white/10 bg-black/20 p-4">
              <label className="block space-y-2"><span className="text-sm font-medium text-white/80">Search tools</span>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3"><Search className="h-4 w-4 text-amber-300" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={content.searchPlaceholder} className="w-full bg-transparent text-sm text-white placeholder:text-white/35 outline-none" /></div>
              </label>
              <div className="mt-3 flex flex-wrap gap-2">{hints.map((h) => <button key={h} type="button" onClick={() => setSearch(h)} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 hover:bg-white/10 transition">{h}</button>)}</div>
              <div className="mt-4 grid gap-2">{filteredTools.map((t) => <button key={t.href} type="button" onClick={() => (window.location.href = t.href)} className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left hover:border-amber-300/30 hover:bg-white/10 transition"><div><p className="text-sm font-medium text-white">{t.title[locale]}</p><p className="mt-1 text-xs text-white/55">{t.description[locale]}</p></div><ArrowRight className="h-4 w-4 shrink-0 text-white/35" /></button>)}</div>
            </section>

            <article className="space-y-8 rounded-3xl border border-white/10 bg-white/5 p-6 text-white/80">
              <div>
                <h2 className="text-2xl font-bold text-white">True Lilies vs Lookalikes</h2>
                <p className="mt-3 leading-7">"Lily" is a loose word in everyday language. To a cat owner, it should mean one specific thing: any plant in the genus <em>Lilium</em> (true lilies) or <em>Hemerocallis</em> (daylilies). Every part of these plants — petals, leaves, stems, pollen, even the water in a vase — contains an unidentified nephrotoxic compound that causes acute kidney failure in cats. As little as two petals, or grooming pollen from fur, can be fatal without treatment.</p>
                <p className="mt-3 leading-7">Many flowers called "lily" are not actually toxic in this way. Peace lily (Spathiphyllum), calla lily (Zantedeschia), and Peruvian lily (Alstroemeria) are different plant families. They contain calcium oxalates or mild irritants that cause drooling and stomach upset but do not damage the kidneys. Lily of the valley (Convallaria) is its own danger — it contains cardiac glycosides that affect the heart, not the kidneys.</p>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Why Are Cats Uniquely Vulnerable?</h2>
                <p className="mt-3 leading-7">The exact mechanism is still being researched, but cats — and only cats among common pets — develop nephrotoxic damage from Lilium and Hemerocallis exposure. Dogs, rabbits, and rodents do not show the same kidney injury. Within 12–24 hours of ingestion, the cat's renal tubular cells begin to die; if untreated by 18 hours, the kidney damage is often permanent. Survival rates are excellent (above 90%) when treatment begins within 6 hours of exposure, but drop dramatically after 24 hours.</p>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">What Treatment Looks Like</h2>
                <p className="mt-3 leading-7">Veterinarians will induce vomiting if exposure is recent, administer activated charcoal, and start aggressive intravenous fluid therapy for at least 48–72 hours to flush the kidneys and maintain urine output. Blood work is monitored to track kidney values (BUN, creatinine, SDMA). In severe cases, hemodialysis can be used. Cats that survive may have permanent renal compromise requiring lifelong management.</p>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Frequently Asked Questions</h2>
                <div className="mt-4 space-y-5">
                  <div><h3 className="font-semibold text-white">My cat brushed against a lily but didn't eat it — is that dangerous?</h3><p className="mt-1 text-white/70">It can be. Cats groom themselves constantly, and pollen that lands on the fur is licked off and ingested. Even small amounts of pollen are enough to cause kidney injury. Bathe the cat to remove any pollen and call a veterinarian for advice regardless of whether you saw the cat ingest anything.</p></div>
                  <div><h3 className="font-semibold text-white">What signs of lily poisoning should I watch for?</h3><p className="mt-1 text-white/70">Early signs (within 0–12 hours): drooling, vomiting, loss of appetite, lethargy. Later signs (12–72 hours): increased then decreased urination, dehydration, seizures, and collapse as kidney failure progresses. Do not wait for these signs — by the time later signs appear, the kidneys may already be irreparably damaged.</p></div>
                  <div><h3 className="font-semibold text-white">Are lilies dangerous to dogs?</h3><p className="mt-1 text-white/70">Most true lilies cause only mild gastrointestinal upset in dogs — vomiting and diarrhea — without the kidney injury seen in cats. Lily of the valley, however, is dangerous to dogs because of its cardiac toxins. Always keep these plants out of any pet's reach.</p></div>
                  <div><h3 className="font-semibold text-white">Can I keep lilies in a home with cats if they're out of reach?</h3><p className="mt-1 text-white/70">It is risky. Cats jump higher and more deliberately than most owners expect, and pollen can drift onto countertops or fall to the floor. Veterinarians and the ASPCA strongly recommend that homes with cats avoid Lilium and Hemerocallis entirely — choose cat-safe alternatives like orchids, roses, sunflowers, or African violets.</p></div>
                </div>
              </div>
              <div className="rounded-2xl border border-amber-400/30 bg-amber-400/5 p-4 text-sm text-amber-100/85"><strong className="text-amber-200">Disclaimer:</strong> This tool is for informational purposes only. Always seek the advice of a licensed veterinarian for any suspected pet poisoning.</div>
            </article>

            <section className="rounded-3xl border border-dashed border-white/15 bg-white/5 p-5">
              <div className="flex items-center justify-between gap-4"><div><p className="text-sm uppercase tracking-[0.28em] text-amber-300/80">{content.adLabel}</p><p className="mt-1 text-sm text-white/55">{content.reserveAdSub}</p></div><span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-white/35">{content.adBadge}</span></div>
              <div className="mt-4 min-h-[120px] rounded-2xl border border-white/10 bg-black/20" />
            </section>
          </div>

          <aside className="space-y-6 rounded-3xl border border-amber-400/15 bg-amber-400/5 p-5">
            <div className="flex items-center gap-3"><div className="rounded-2xl bg-amber-400/15 p-3"><Cat className="h-5 w-5 text-amber-300" /></div><div><h2 className="text-lg font-semibold">Cat-safe living</h2><p className="text-sm text-amber-100/80">Prevention matters most.</p></div></div>
            <div className="space-y-3 text-sm text-amber-100/80">
              <p className="rounded-2xl border border-amber-400/20 bg-black/30 px-4 py-3">Avoid bouquets that contain any Lilium or Hemerocallis varieties.</p>
              <p className="rounded-2xl border border-amber-400/20 bg-black/30 px-4 py-3">Tell florists you have a cat before they arrange a delivery.</p>
              <p className="rounded-2xl border border-amber-400/20 bg-black/30 px-4 py-3">Treatment within 6 hours gives the best prognosis.</p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

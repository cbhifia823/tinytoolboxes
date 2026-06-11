import { useEffect, useMemo, useState } from "react";
import { ArrowRight, AlertTriangle, BadgeDollarSign, Dog, Search } from "lucide-react";

const LANGUAGES = {
  en: { name: "English", title: "Xylitol Toxicity Calculator for Dogs", subtitle: "Estimate xylitol dose from gum, peanut butter, or sugar-free products and assess risk.", searchLabel: "Search tools", searchPlaceholder: "Try: chocolate, lily, calorie", reserveAd: "Google Ads space reserved", reserveAdSub: "之後可直接放 AdSense 程式碼。", adLabel: "Advertisement", adBadge: "Reserved", adLabel: "Advertisement", adBadge: "Reserved", weightLabel: "Dog weight", productLabel: "Product type", amountLabel: "Amount eaten", emergency: "Veterinary emergency", emergencyNote: "Xylitol can cause life-threatening hypoglycemia within 30 minutes. Call a veterinarian immediately.", result: "Estimated xylitol dose", risk: "Risk level", safe: "Below toxic threshold", hypo: "Hypoglycemia risk", liver: "Liver failure risk", severe: "Severe — emergency now" },
  "zh-hk": { name: "繁體中文", title: "狗狗木糖醇中毒計算機", subtitle: "估算口香糖、花生醬或無糖食品入面嘅木糖醇劑量同危險程度。", searchLabel: "搜尋工具", searchPlaceholder: "例如：朱古力、百合、卡路里", reserveAd: "預留 Google 廣告位", reserveAdSub: "之後可直接放 AdSense 程式碼。", adLabel: "廣告", adBadge: "已預留", adLabel: "廣告", adBadge: "已預留", weightLabel: "狗狗體重", productLabel: "食品種類", amountLabel: "食咗幾多", emergency: "獸醫緊急情況", emergencyNote: "木糖醇可以喺 30 分鐘內引起致命嘅低血糖。即刻打電話畀獸醫。", result: "估算木糖醇劑量", risk: "危險程度", safe: "低於中毒劑量", hypo: "低血糖風險", liver: "肝衰竭風險", severe: "嚴重 — 即刻急症" },
  "zh-cn": { name: "简体中文", title: "狗狗木糖醇中毒计算器", subtitle: "估算口香糖、花生酱或无糖食品中的木糖醇剂量和危险程度。", searchLabel: "搜索工具", searchPlaceholder: "例如：巧克力、百合、卡路里", reserveAd: "预留 Google 广告位", reserveAdSub: "之后可直接放 AdSense 代码。", adLabel: "广告", adBadge: "已预留", adLabel: "广告", adBadge: "已预留", weightLabel: "狗狗体重", productLabel: "食品种类", amountLabel: "吃了多少", emergency: "兽医紧急情况", emergencyNote: "木糖醇可在 30 分钟内引发致命低血糖。请立即联系兽医。", result: "估算木糖醇剂量", risk: "危险程度", safe: "低于中毒剂量", hypo: "低血糖风险", liver: "肝衰竭风险", severe: "严重 — 立即就医" },
  es: { name: "Español", title: "Calculadora de toxicidad por xilitol (perros)", subtitle: "Estima la dosis de xilitol por chicle, mantequilla de maní u otros productos sin azúcar.", searchLabel: "Buscar herramientas", searchPlaceholder: "Prueba: chocolate, lirio, calorías", reserveAd: "Espacio reservado para Google Ads", reserveAdSub: "Puedes insertar AdSense aquí más adelante.", adLabel: "Advertisement", adBadge: "Reserved", adLabel: "Publicidad", adBadge: "Reservado", weightLabel: "Peso del perro", productLabel: "Tipo de producto", amountLabel: "Cantidad ingerida", emergency: "Emergencia veterinaria", emergencyNote: "El xilitol puede causar hipoglucemia mortal en 30 minutos. Llama al veterinario de inmediato.", result: "Dosis de xilitol estimada", risk: "Nivel de riesgo", safe: "Por debajo del umbral", hypo: "Riesgo de hipoglucemia", liver: "Riesgo de insuficiencia hepática", severe: "Grave — emergencia inmediata" },
};

const TOOLS = [
  { title: "Chocolate Toxicity Calculator", description: "Theobromine dose for dogs.", href: "/chocolate-toxicity-calculator", keywords: ["chocolate", "dog"] },
  { title: "Lily Toxicity Checker", description: "Which lilies are dangerous to cats.", href: "/lily-toxicity-checker", keywords: ["lily", "cat"] },
  { title: "Pet Calorie Calculator (RER)", description: "Daily calorie needs.", href: "/pet-calorie-calculator", keywords: ["calorie"] },
  { title: "Can My Dog Eat This?", description: "Food safety lookup.", href: "/can-my-dog-eat", keywords: ["food", "dog"] },
  { title: "Dog Age in Human Years", description: "UCSD formula.", href: "/dog-age-calculator", keywords: ["dog", "age"] },
  { title: "Cat Age in Human Years", description: "Cat age to human years.", href: "/cat-age-calculator", keywords: ["cat", "age"] },
];

const PRODUCTS = {
  gum_piece: { en: "Sugar-free gum (per piece)", "zh-hk": "無糖口香糖（每粒）", "zh-cn": "无糖口香糖（每粒）", es: "Chicle sin azúcar (por unidad)", mgPerUnit: 1000, unitLabel: "pieces" },
  mint: { en: "Sugar-free mint (per piece)", "zh-hk": "無糖薄荷糖（每粒）", "zh-cn": "无糖薄荷糖（每粒）", es: "Menta sin azúcar (por unidad)", mgPerUnit: 250, unitLabel: "pieces" },
  pb_tbsp: { en: "Xylitol peanut butter (per tbsp)", "zh-hk": "木糖醇花生醬（每湯匙）", "zh-cn": "木糖醇花生酱（每汤匙）", es: "Mantequilla de maní con xilitol (por cda)", mgPerUnit: 270, unitLabel: "tbsp" },
  candy: { en: "Sugar-free candy (per piece)", "zh-hk": "無糖糖果（每粒）", "zh-cn": "无糖糖果（每粒）", es: "Caramelo sin azúcar (por unidad)", mgPerUnit: 500, unitLabel: "pieces" },
  baked_g: { en: "Sugar-free baked goods (g)", "zh-hk": "無糖烘焙食品（克）", "zh-cn": "无糖烘焙食品（克）", es: "Repostería sin azúcar (g)", mgPerUnit: 80, unitLabel: "g" },
  powder_g: { en: "Pure xylitol powder (g)", "zh-hk": "純木糖醇粉（克）", "zh-cn": "纯木糖醇粉（克）", es: "Xilitol puro en polvo (g)", mgPerUnit: 1000, unitLabel: "g" },
} as const;

const SITE_URL = "https://www.tinytoolboxes.com";
const PAGE_PATH = "/xylitol-toxicity";

function applySEO(o: { title: string; description: string; path: string }) {
  if (typeof document === "undefined") return;
  const url = SITE_URL + o.path;
  document.title = o.title;
  const head = document.head;
  const upsert = (sel: string, mk: () => HTMLElement, attr: string, val: string) => { let el = head.querySelector(sel) as HTMLElement | null; if (!el) { el = mk(); head.appendChild(el); } el.setAttribute(attr, val); };
  const meta = (name: string, content: string) => upsert('meta[name="'+name+'"]', () => { const m = document.createElement("meta"); m.setAttribute("name", name); return m; }, "content", content);
  const prop = (p: string, content: string) => upsert('meta[property="'+p+'"]', () => { const m = document.createElement("meta"); m.setAttribute("property", p); return m; }, "content", content);
  meta("description", o.description);
  upsert('link[rel="canonical"]', () => { const l = document.createElement("link"); l.setAttribute("rel", "canonical"); return l; }, "href", url);
  prop("og:title", o.title); prop("og:description", o.description); prop("og:url", url); prop("og:type", "website"); prop("og:site_name", "TinyToolboxes");
  meta("twitter:card", "summary"); meta("twitter:title", o.title); meta("twitter:description", o.description);
}

export default function XylitolToxicity() {
  const [locale, setLocale] = useState<keyof typeof LANGUAGES>(() => typeof window === "undefined" ? "en" : ((window.localStorage.getItem("ttb-locale") as keyof typeof LANGUAGES) || "en"));
  const [weight, setWeight] = useState("10");
  const [weightUnit, setWeightUnit] = useState<"kg" | "lb">("kg");
  const [product, setProduct] = useState<keyof typeof PRODUCTS>("gum_piece");
  const [amount, setAmount] = useState("2");
  const [search, setSearch] = useState("");

  useEffect(() => {
    window.localStorage.setItem("ttb-locale", locale);
    const L = LANGUAGES[locale];
    applySEO({ title: L.title + " | TinyToolboxes", description: L.subtitle, path: PAGE_PATH });
  }, [locale]);

  const computation = useMemo(() => {
    const w = parseFloat(weight); const a = parseFloat(amount);
    if (isNaN(w) || isNaN(a) || w <= 0 || a <= 0) return null;
    const weightKg = weightUnit === "lb" ? w * 0.453592 : w;
    const totalMg = a * PRODUCTS[product].mgPerUnit;
    const doseMgPerKg = totalMg / weightKg;
    const doseGPerKg = doseMgPerKg / 1000;
    let level: "safe" | "hypo" | "liver" | "severe" = "safe";
    if (doseGPerKg >= 1.0) level = "severe";
    else if (doseGPerKg >= 0.5) level = "liver";
    else if (doseGPerKg >= 0.1) level = "hypo";
    return { totalMg, doseMgPerKg, doseGPerKg, level, weightKg };
  }, [weight, weightUnit, product, amount]);

  const content = LANGUAGES[locale];
  const hints = locale === "zh-hk" ? ["朱古力","百合","卡路里","食物"] : locale === "zh-cn" ? ["巧克力","百合","卡路里","食物"] : ["chocolate","lily","calorie","food"];
  const filteredTools = useMemo(() => { const q = search.trim().toLowerCase(); if (!q) return TOOLS; return TOOLS.filter(t => (t.title + " " + t.description + " " + t.keywords.join(" ")).toLowerCase().includes(q)); }, [search]);

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10 lg:px-8">
        <div className="flex flex-col gap-4 border-b border-amber-400/15 pb-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-400/15 ring-1 ring-amber-300/20"><Dog className="h-5 w-5 text-amber-300" /></div>
            <div><p className="text-sm uppercase tracking-[0.3em] text-amber-300/80">TinyToolboxes · Pet</p><h1 className="text-xl font-semibold">{content.title}</h1></div>
          </div>
          <div className="flex flex-wrap gap-2">{(Object.keys(LANGUAGES) as Array<keyof typeof LANGUAGES>).map(key => <button key={key} onClick={() => setLocale(key)} className={"rounded-full border px-3 py-2 text-sm transition " + (locale === key ? "border-amber-400/70 bg-amber-400/15 text-amber-200" : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10")}>{LANGUAGES[key].name}</button>)}</div>
        </div>

        <div className="grid flex-1 gap-8 py-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <div className="space-y-8">
            <div className="max-w-3xl space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-2 text-sm text-amber-200"><BadgeDollarSign className="h-4 w-4" />{content.reserveAd}</div>
              <div className="space-y-4"><h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">{content.title}</h2><p className="max-w-2xl text-base leading-7 text-white/70 sm:text-lg">{content.subtitle}</p></div>
              <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-100">
                <div className="flex items-center gap-2 font-semibold text-rose-200"><AlertTriangle className="h-4 w-4" />{content.emergency}</div>
                <p className="mt-2 leading-6 text-rose-100/85">{content.emergencyNote}</p>
                <p className="mt-2 text-xs text-rose-200/70">ASPCA Animal Poison Control: <span className="font-semibold">(888) 426-4435</span> · Pet Poison Helpline: <span className="font-semibold">(855) 764-7661</span></p>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block space-y-2"><span className="text-sm text-neutral-300">{content.weightLabel}</span>
                  <div className="flex gap-2">
                    <input type="number" min="0" step="0.1" value={weight} onChange={e => setWeight(e.target.value)} className="flex-1 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-amber-400/60" />
                    <div className="flex rounded-2xl border border-white/10 bg-black/30 p-1">
                      <button onClick={() => setWeightUnit("kg")} className={"rounded-xl px-3 py-1.5 text-sm transition " + (weightUnit === "kg" ? "bg-amber-400/15 text-amber-200" : "text-white/60")}>kg</button>
                      <button onClick={() => setWeightUnit("lb")} className={"rounded-xl px-3 py-1.5 text-sm transition " + (weightUnit === "lb" ? "bg-amber-400/15 text-amber-200" : "text-white/60")}>lb</button>
                    </div>
                  </div>
                </label>
                <label className="block space-y-2"><span className="text-sm text-neutral-300">{content.productLabel}</span>
                  <select value={product} onChange={e => setProduct(e.target.value as keyof typeof PRODUCTS)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-amber-400/60">
                    {(Object.keys(PRODUCTS) as Array<keyof typeof PRODUCTS>).map(k => <option key={k} value={k}>{PRODUCTS[k][locale]}</option>)}
                  </select>
                </label>
                <label className="block space-y-2 sm:col-span-2"><span className="text-sm text-neutral-300">{content.amountLabel} ({PRODUCTS[product].unitLabel})</span>
                  <input type="number" min="0" step="0.1" value={amount} onChange={e => setAmount(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-amber-400/60" />
                </label>
              </div>

              {computation && (
                <div className="space-y-3">
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4"><p className="text-xs uppercase tracking-[0.2em] text-neutral-400">Total xylitol</p><p className="mt-2 text-2xl font-semibold text-white">{computation.totalMg.toFixed(0)} mg</p></div>
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4"><p className="text-xs uppercase tracking-[0.2em] text-neutral-400">{content.result}</p><p className="mt-2 text-2xl font-semibold text-white">{computation.doseGPerKg.toFixed(2)} <span className="text-sm text-white/60">g/kg</span></p></div>
                    <div className={"rounded-2xl bg-gradient-to-br p-4 " + (computation.level === "severe" ? "from-red-500 to-rose-600 text-white" : computation.level === "liver" ? "from-orange-500 to-red-500 text-white" : computation.level === "hypo" ? "from-amber-400 to-orange-500 text-neutral-900" : "from-emerald-400 to-teal-500 text-neutral-900")}>
                      <p className="text-xs uppercase tracking-[0.2em] opacity-80">{content.risk}</p><p className="mt-2 text-lg font-semibold">{content[computation.level]}</p>
                    </div>
                  </div>
                  <p className="text-xs text-white/45">Thresholds: 0.1 g/kg → hypoglycemia · 0.5 g/kg → liver failure · ≥1 g/kg → potentially fatal.</p>
                </div>
              )}
            </div>

            <section className="rounded-3xl border border-white/10 bg-black/20 p-4">
              <label className="block space-y-2"><span className="text-sm font-medium text-white/80">{content.searchLabel}</span>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3"><Search className="h-4 w-4 text-amber-300" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder={content.searchPlaceholder} className="w-full bg-transparent text-sm text-white placeholder:text-white/35 outline-none" /></div>
              </label>
              <div className="mt-3 flex flex-wrap gap-2">{hints.map(h => <button key={h} type="button" onClick={() => setSearch(h)} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 hover:bg-white/10 transition">{h}</button>)}</div>
              <div className="mt-4 grid gap-2">{filteredTools.map(t => <button key={t.href} type="button" onClick={() => window.location.href = t.href} className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left hover:border-amber-300/30 hover:bg-white/10 transition"><div><p className="text-sm font-medium text-white">{t.title}</p><p className="mt-1 text-xs text-white/55">{t.description}</p></div><ArrowRight className="h-4 w-4 shrink-0 text-white/35" /></button>)}</div>
            </section>

            <section className="rounded-3xl border border-dashed border-white/15 bg-white/5 p-5">
              <div className="flex items-center justify-between gap-4"><div><p className="text-sm uppercase tracking-[0.28em] text-amber-300/80">{content.adLabel}</p><p className="mt-1 text-sm text-white/55">{content.reserveAdSub}</p></div><span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-white/35">{content.adBadge}</span></div>
              <div className="mt-4 min-h-[120px] rounded-2xl border border-white/10 bg-black/20" />
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}

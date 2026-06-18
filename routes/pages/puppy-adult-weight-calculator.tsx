import { useEffect, useMemo, useState } from "react";
import { ArrowRight, BadgeDollarSign, Bone, PawPrint, Search, Sparkles } from "lucide-react";
import content from "../data/puppy-adult-weight-content.json";

type LocaleKey = keyof typeof content;

type BreedClass = {
  id: string;
  label: string;
  factor: number;
  pct: number;
};

const LOCALES = ["en", "zh-hk", "zh-cn", "es"] as const satisfies readonly LocaleKey[];

const BREED_CLASSES: Record<LocaleKey, BreedClass[]> = {
  en: [
    { id: "small", label: "Small / toy breed", factor: 1.12, pct: 12 },
    { id: "medium", label: "Medium breed", factor: 1.25, pct: 25 },
    { id: "large", label: "Large breed", factor: 1.45, pct: 45 },
    { id: "giant", label: "Giant breed", factor: 1.7, pct: 70 },
    { id: "mixed-small", label: "Mixed — small", factor: 1.12, pct: 12 },
    { id: "mixed-medium", label: "Mixed — medium", factor: 1.25, pct: 25 },
    { id: "mixed-large", label: "Mixed — large", factor: 1.45, pct: 45 },
  ],
  "zh-hk": [
    { id: "small", label: "小型 / 玩具犬", factor: 1.12, pct: 12 },
    { id: "medium", label: "中型犬", factor: 1.25, pct: 25 },
    { id: "large", label: "大型犬", factor: 1.45, pct: 45 },
    { id: "giant", label: "巨型犬", factor: 1.7, pct: 70 },
    { id: "mixed-small", label: "混種 — 小型", factor: 1.12, pct: 12 },
    { id: "mixed-medium", label: "混種 — 中型", factor: 1.25, pct: 25 },
    { id: "mixed-large", label: "混種 — 大型", factor: 1.45, pct: 45 },
  ],
  "zh-cn": [
    { id: "small", label: "小型 / 玩具犬", factor: 1.12, pct: 12 },
    { id: "medium", label: "中型犬", factor: 1.25, pct: 25 },
    { id: "large", label: "大型犬", factor: 1.45, pct: 45 },
    { id: "giant", label: "巨型犬", factor: 1.7, pct: 70 },
    { id: "mixed-small", label: "混种 — 小型", factor: 1.12, pct: 12 },
    { id: "mixed-medium", label: "混种 — 中型", factor: 1.25, pct: 25 },
    { id: "mixed-large", label: "混种 — 大型", factor: 1.45, pct: 45 },
  ],
  es: [
    { id: "small", label: "Raza pequeña / toy", factor: 1.12, pct: 12 },
    { id: "medium", label: "Raza mediana", factor: 1.25, pct: 25 },
    { id: "large", label: "Raza grande", factor: 1.45, pct: 45 },
    { id: "giant", label: "Raza gigante", factor: 1.7, pct: 70 },
    { id: "mixed-small", label: "Mestizo — pequeño", factor: 1.12, pct: 12 },
    { id: "mixed-medium", label: "Mestizo — mediano", factor: 1.25, pct: 25 },
    { id: "mixed-large", label: "Mestizo — grande", factor: 1.45, pct: 45 },
  ],
};

const SEARCH_TOOLS = [
  { title: { en: "Pet Calorie Calculator", "zh-hk": "寵物卡路里計算機", "zh-cn": "宠物卡路里计算器", es: "Calculadora de calorías para mascotas" }, description: { en: "Daily calorie needs for pets.", "zh-hk": "寵物每日卡路里需求。", "zh-cn": "宠物每日卡路里需求。", es: "Necesidades calóricas diarias." }, href: "/pet-calorie-calculator" },
  { title: { en: "Can My Dog Eat This?", "zh-hk": "狗狗可以食呢樣嗎？", "zh-cn": "狗狗可以吃这个吗？", es: "¿Mi perro puede comer esto?" }, description: { en: "Food safety lookup.", "zh-hk": "查食物安全。", "zh-cn": "查食物安全。", es: "Consulta de seguridad alimentaria." }, href: "/can-my-dog-eat" },
  { title: { en: "Dog Age in Human Years", "zh-hk": "狗狗年齡換算（人類年齡）", "zh-cn": "狗狗年龄换算（人类年龄）", es: "Edad de perro en años humanos" }, description: { en: "Dog age formula.", "zh-hk": "狗狗年齡公式。", "zh-cn": "狗狗年龄公式。", es: "Fórmula de edad canina." }, href: "/dog-age-calculator" },
  { title: { en: "Cat Age in Human Years", "zh-hk": "貓貓年齡換算（人類年齡）", "zh-cn": "猫咪年龄换算（人类年龄）", es: "Edad de gato en años humanos" }, description: { en: "Cat age conversion.", "zh-hk": "貓貓年齡換算。", "zh-cn": "猫咪年龄换算。", es: "Conversión de edad felina." }, href: "/cat-age-calculator" },
];

const SITE_URL = "https://pets.tinytoolboxes.com";
const PAGE_PATH = "/puppy-adult-weight-calculator";

function applySEO(title: string, description: string) {
  if (typeof document === "undefined") return;
  const url = SITE_URL + PAGE_PATH;
  document.title = title;
  const head = document.head;
  const upsert = (selector: string, create: () => HTMLElement, attr: string, value: string) => {
    let el = head.querySelector(selector) as HTMLElement | null;
    if (!el) {
      el = create();
      head.appendChild(el);
    }
    el.setAttribute(attr, value);
  };
  upsert('meta[name="description"]', () => { const el = document.createElement("meta"); el.setAttribute("name", "description"); return el; }, "content", description);
  upsert('link[rel="canonical"]', () => { const el = document.createElement("link"); el.setAttribute("rel", "canonical"); return el; }, "href", url);
  upsert('meta[property="og:title"]', () => { const el = document.createElement("meta"); el.setAttribute("property", "og:title"); return el; }, "content", title);
  upsert('meta[property="og:description"]', () => { const el = document.createElement("meta"); el.setAttribute("property", "og:description"); return el; }, "content", description);
  upsert('meta[property="og:url"]', () => { const el = document.createElement("meta"); el.setAttribute("property", "og:url"); return el; }, "content", url);
  upsert('meta[property="og:type"]', () => { const el = document.createElement("meta"); el.setAttribute("property", "og:type"); return el; }, "content", "website");
  upsert('meta[property="og:site_name"]', () => { const el = document.createElement("meta"); el.setAttribute("property", "og:site_name"); return el; }, "content", "TinyToolboxes for Pets");
}

function toKg(weight: number, unit: "kg" | "lb") {
  return unit === "kg" ? weight : weight * 0.453592;
}

function estimatedAdultKg(weightKg: number, ageWeeks: number, factor: number) {
  const ageFactor = ageWeeks <= 12 ? 2.2 : ageWeeks <= 24 ? 1.6 : ageWeeks <= 36 ? 1.25 : 1.05;
  const raw = weightKg * factor * ageFactor;
  const low = raw * 0.9;
  const high = raw * 1.1;
  return { raw, low, high };
}

export default function PuppyAdultWeightCalculator() {
  const [locale, setLocale] = useState<LocaleKey>(() => {
    if (typeof window === "undefined") return "en";
    return (window.localStorage.getItem("ttb-locale") as LocaleKey) || "en";
  });
  const [ageWeeks, setAgeWeeks] = useState("12");
  const [weight, setWeight] = useState("8");
  const [weightUnit, setWeightUnit] = useState<"kg" | "lb">("kg");
  const [breed, setBreed] = useState("small");
  const [search, setSearch] = useState("");

  const strings = (content as any)[locale];

  useEffect(() => {
    window.localStorage.setItem("ttb-locale", locale);
    applySEO(`${strings.title} | TinyToolboxes`, strings.subtitle);
  }, [locale, strings.title, strings.subtitle]);

  const result = useMemo(() => {
    const weeks = Number(ageWeeks);
    const currentWeight = Number(weight);
    if (!Number.isFinite(weeks) || !Number.isFinite(currentWeight) || weeks <= 0 || currentWeight <= 0) return null;
    const kg = toKg(currentWeight, weightUnit);
    const classInfo = BREED_CLASSES[locale].find((item) => item.id === breed) ?? BREED_CLASSES[locale][0];
    return { weeks, kg, ...estimatedAdultKg(kg, weeks, classInfo.factor), classInfo };
  }, [ageWeeks, weight, weightUnit, breed, locale]);

  const filteredTools = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return SEARCH_TOOLS;
    return SEARCH_TOOLS.filter((tool) => `${tool.title[locale]} ${tool.description[locale]}`.toLowerCase().includes(q));
  }, [search, locale]);

  const hints = locale === "zh-hk" ? ["幼犬", "卡路里", "朱古力", "貓"] : locale === "zh-cn" ? ["幼犬", "卡路里", "巧克力", "猫"] : locale === "es" ? ["cachorro", "calorías", "chocolate", "gato"] : ["puppy", "calorie", "chocolate", "cat"];
  const pageCopy = (content as any)[locale];
  const breedOptions = BREED_CLASSES[locale];

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10 lg:px-8">
        <div className="flex flex-col gap-4 border-b border-amber-400/15 pb-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-400/15 ring-1 ring-amber-300/20"><PawPrint className="h-5 w-5 text-amber-300" /></div>
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-amber-300/80">TinyToolboxes · Pet</p>
              <h1 className="text-xl font-semibold">{pageCopy.title}</h1>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {LOCALES.map((item) => (
              <button
                key={item}
                onClick={() => setLocale(item)}
                className={`rounded-full border px-3 py-2 text-sm transition ${locale === item ? "border-amber-400/70 bg-amber-400/15 text-amber-200" : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"}`}
              >
                {item === "en" ? "English" : item === "zh-hk" ? "繁體中文" : item === "zh-cn" ? "简体中文" : "Español"}
              </button>
            ))}
          </div>
        </div>

        <div className="grid flex-1 gap-8 py-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <div className="space-y-8">
            <div className="max-w-3xl space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-2 text-sm text-amber-200">
                <BadgeDollarSign className="h-4 w-4" />{pageCopy.adLabel}
              </div>
              <div className="space-y-4">
                <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">{pageCopy.title}</h2>
                <p className="max-w-2xl text-base leading-7 text-white/70 sm:text-lg">{pageCopy.subtitle}</p>
                <p className="text-sm text-amber-100/70">{pageCopy.methodBody}</p>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block space-y-2">
                  <span className="text-sm text-neutral-300">{pageCopy.ageLabel}</span>
                  <div className="flex gap-2">
                    <input value={ageWeeks} onChange={(e) => setAgeWeeks(e.target.value)} type="number" min="0" step="1" className="flex-1 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-amber-400/60" />
                    <div className="flex items-center rounded-2xl border border-white/10 bg-black/30 px-3 text-sm text-white/60">{pageCopy.ageUnit}</div>
                  </div>
                </label>
                <label className="block space-y-2">
                  <span className="text-sm text-neutral-300">{pageCopy.weightLabel}</span>
                  <div className="flex gap-2">
                    <input value={weight} onChange={(e) => setWeight(e.target.value)} type="number" min="0" step="0.1" className="flex-1 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-amber-400/60" />
                    <div className="flex rounded-2xl border border-white/10 bg-black/30 p-1">
                      <button onClick={() => setWeightUnit("kg")} className={`rounded-xl px-3 py-1.5 text-sm transition ${weightUnit === "kg" ? "bg-amber-400/15 text-amber-200" : "text-white/60"}`}>kg</button>
                      <button onClick={() => setWeightUnit("lb")} className={`rounded-xl px-3 py-1.5 text-sm transition ${weightUnit === "lb" ? "bg-amber-400/15 text-amber-200" : "text-white/60"}`}>lb</button>
                    </div>
                  </div>
                </label>
              </div>

              <label className="block space-y-2">
                <span className="text-sm text-neutral-300">{pageCopy.breedLabel}</span>
                <select value={breed} onChange={(e) => setBreed(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-amber-400/60">
                  {breedOptions.map((option) => (
                    <option key={option.id} value={option.id}>{option.label}</option>
                  ))}
                </select>
              </label>

              {result && (
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">{pageCopy.resultExact}</p>
                    <p className="mt-2 text-4xl font-bold text-amber-200">{result.raw.toFixed(1)} kg</p>
                    <p className="mt-2 text-sm text-white/65">{pageCopy.confidence}</p>
                  </div>
                  <div className="rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 p-4 text-neutral-900">
                    <p className="text-xs uppercase tracking-[0.2em] opacity-75">{pageCopy.resultRange}</p>
                    <p className="mt-2 text-3xl font-bold">{result.low.toFixed(1)} — {result.high.toFixed(1)} kg</p>
                    <p className="mt-2 text-sm opacity-75">{pageCopy.rangeNote}</p>
                  </div>
                </div>
              )}
            </div>

            <section className="rounded-3xl border border-dashed border-white/15 bg-white/5 p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.28em] text-amber-300/80">{pageCopy.adLabel}</p>
                  <p className="mt-1 text-sm text-white/55">{pageCopy.adNote}</p>
                </div>
                <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-white/35">{pageCopy.adBadge}</span>
              </div>
              <div className="mt-4 min-h-[120px] rounded-2xl border border-white/10 bg-black/20" />
            </section>

            <article className="space-y-8 rounded-3xl border border-white/10 bg-white/5 p-6 text-white/80">
              <div>
                <h2 className="text-2xl font-bold text-white">{pageCopy.methodTitle}</h2>
                <p className="mt-3 leading-7">{pageCopy.methodBody}</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {breedOptions.slice(0, 3).map((option) => (
                    <div key={option.id} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <p className="font-semibold text-white">{option.label}</p>
                      <p className="mt-1 text-sm text-white/60">× {option.factor.toFixed(2)}</p>
                      <p className="mt-1 text-xs text-white/50">~ {option.pct}% of adult weight</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{pageCopy.faqTitle}</h2>
                <div className="mt-4 space-y-5">
                  {pageCopy.faqs.map((faq: { q: string; a: string }, idx: number) => (
                    <div key={idx}>
                      <h3 className="font-semibold text-white">{faq.q}</h3>
                      <p className="mt-1 text-white/70">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-amber-400/30 bg-amber-400/5 p-4 text-sm text-amber-100/85">
                <strong className="text-amber-200">{pageCopy.disclaimerTitle}:</strong> {pageCopy.disclaimerBody}
              </div>
            </article>
          </div>

          <aside className="space-y-6 rounded-3xl border border-amber-400/15 bg-amber-400/5 p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-amber-400/15 p-3"><Sparkles className="h-5 w-5 text-amber-300" /></div>
              <div>
                <h2 className="text-lg font-semibold">{pageCopy.title}</h2>
                <p className="text-sm text-amber-100/80">{pageCopy.resultSubtitle}</p>
              </div>
            </div>
            <div className="space-y-3 text-sm text-amber-100/80">
              {breedOptions.map((option) => (
                <p key={option.id} className="rounded-2xl border border-amber-400/20 bg-black/30 px-4 py-3">
                  <strong>{option.label}</strong> — ×{option.factor.toFixed(2)}
                </p>
              ))}
            </div>
            <div className="rounded-2xl border border-amber-400/20 bg-black/30 p-4">
              <h3 className="text-sm font-semibold text-white">{pageCopy.searchLabel}</h3>
              <p className="mt-1 text-xs text-white/55">{pageCopy.searchPlaceholder}</p>
              <div className="mt-3 space-y-2">
                {filteredTools.map((tool) => (
                  <a key={tool.href} href={tool.href} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80 transition hover:bg-white/10">
                    <span>{tool.title[locale]}</span>
                    <ArrowRight className="h-4 w-4 text-white/35" />
                  </a>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

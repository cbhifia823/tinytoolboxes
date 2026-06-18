import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Dog, Cat, Search, Sparkles, ArrowRight, Loader2 } from "lucide-react";

type BreedEntry = { slug: string; type: "dog" | "cat"; name: string; hypoallergenic: boolean };

const UI: Record<string, any> = {
  en: {
    title: "Dog & Cat Breed Guides", subtitle: "Complete guides for 45 popular breeds.", searchPlaceholder: "Search breeds\u2026",
    allDogs: "Dogs", allCats: "Cats", allBreeds: "All Breeds", hypoTag: "Hypoallergenic", loading: "Loading\u2026",
  },
  "zh-hk": { title: "狗貓品種指南", subtitle: "45 個熱門品種的完整指南。", searchPlaceholder: "搜尋品種\u2026", allDogs: "狗", allCats: "貓", allBreeds: "所有品種", hypoTag: "低過敏", loading: "載入中\u2026" },
  "zh-cn": { title: "狗猫品种指南", subtitle: "45 个热门品种的完整指南。", searchPlaceholder: "搜索品种\u2026", allDogs: "狗", allCats: "猫", allBreeds: "所有品种", hypoTag: "低过敏", loading: "加载中\u2026" },
  ja: { title: "犬と猫の品種ガイド", subtitle: "人気45品種の完全ガイド。", searchPlaceholder: "品種を検索\u2026", allDogs: "犬", allCats: "猫", allBreeds: "全品種", hypoTag: "低アレルゲン", loading: "読み込み中\u2026" },
  es: { title: "Guías de Razas", subtitle: "Guías completas de 45 razas populares.", searchPlaceholder: "Buscar razas\u2026", allDogs: "Perros", allCats: "Gatos", allBreeds: "Todas", hypoTag: "Hipoalergénico", loading: "Cargando\u2026" },
};

export default function BreedsIndex() {
  const [breeds, setBreeds] = useState<BreedEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState<string>(() => { if (typeof window === "undefined") return "en"; return window.localStorage.getItem("ttb-locale") || "en"; });
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "dog" | "cat">("all");

  useEffect(() => { window.localStorage.setItem("ttb-locale", lang); }, [lang]);
  useEffect(() => { document.title = "Dog & Cat Breed Guides | TinyToolboxes Pets"; }, []);

  useEffect(() => {
    fetch("/breeds-data.json").then(r => r.json()).then((data: Record<string, any>) => {
      const entries: BreedEntry[] = Object.entries(data).map(([slug, b]) => ({
        slug, type: b.type, name: b.names[lang] || b.names.en, hypoallergenic: b.hypoallergenic,
      }));
      setBreeds(entries); setLoading(false);
    }).catch(() => setLoading(false));
  }, [lang]);

  const t = UI[lang] || UI.en;
  const filtered = useMemo(() => breeds.filter(b => {
    if (filter === "dog" && b.type !== "dog") return false;
    if (filter === "cat" && b.type !== "cat") return false;
    if (search.trim()) { const q = search.toLowerCase(); return b.name.toLowerCase().includes(q) || b.slug.includes(q); }
    return true;
  }), [breeds, filter, search]);

  const dogCount = breeds.filter(b => b.type === "dog").length;
  const catCount = breeds.filter(b => b.type === "cat").length;

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">
      <section className="mx-auto max-w-6xl px-6 py-8 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div><h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{t.title}</h1><p className="mt-2 text-white/50">{t.subtitle}</p></div>
          <div className="flex flex-wrap gap-2">
            {Object.entries({ en: "EN", "zh-hk": "\u7E41", "zh-cn": "\u7B80", ja: "\u65E5", es: "ES" }).map(([key, label]) => (
              <button key={key} onClick={() => setLang(key)} className={`rounded-full border px-3 py-2 text-sm transition ${lang === key ? "border-emerald-400/70 bg-emerald-400/15 text-emerald-200" : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"}`}>{label}</button>
            ))}
          </div>
        </div>
        <section className="mt-6 rounded-3xl border border-dashed border-white/15 bg-white/5 p-5">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm uppercase tracking-[0.28em] text-emerald-300/80">Advertisement</p>
            <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-white/35">Reserved</span>
          </div>
          <div className="mt-4 min-h-[120px] rounded-2xl border border-white/10 bg-black/20" />
        </section>
        {loading ? (
          <div className="flex items-center justify-center py-20 text-white/60 gap-3"><Loader2 className="h-5 w-5 animate-spin" /><span>{t.loading}</span></div>
        ) : (
          <>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <div className="flex rounded-full border border-white/10 bg-white/5 p-1">
                {(["all","dog","cat"] as const).map(f => (
                  <button key={f} onClick={() => setFilter(f)} className={`rounded-full px-4 py-2 text-sm transition ${filter === f ? "bg-emerald-400/15 text-emerald-200" : "text-white/50 hover:text-white/70"}`}>
                    {f === "all" ? t.allBreeds : f === "dog" ? `${t.allDogs} (${dogCount})` : `${t.allCats} (${catCount})`}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3 rounded-full border border-white/10 bg-black/30 px-4 py-2 flex-1 max-w-sm">
                <Search className="h-4 w-4 text-emerald-300 shrink-0" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder={t.searchPlaceholder} className="w-full bg-transparent text-sm text-white placeholder:text-white/35 outline-none" />
              </div>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map(breed => (
                <Link key={breed.slug} to={`/breed/${breed.slug}`} className="group rounded-2xl border border-white/10 bg-white/5 p-5 hover:border-emerald-400/30 hover:bg-white/10 transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`rounded-xl p-2.5 ${breed.type === "dog" ? "bg-amber-400/10" : "bg-sky-400/10"}`}>
                        {breed.type === "dog" ? <Dog className="h-5 w-5 text-amber-300" /> : <Cat className="h-5 w-5 text-sky-300" />}
                      </div>
                      <div><h3 className="font-semibold text-white group-hover:text-emerald-200 transition-colors">{breed.name}</h3><p className="text-xs text-white/40 capitalize">{breed.type}</p></div>
                    </div>
                    <div className="flex items-center gap-2">
                      {breed.hypoallergenic && <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2 py-0.5 text-[10px] text-emerald-300 flex items-center gap-1"><Sparkles className="h-2.5 w-2.5" />{t.hypoTag}</span>}
                      <ArrowRight className="h-4 w-4 text-white/20 group-hover:text-emerald-300/60 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            {filtered.length === 0 && <div className="py-20 text-center text-white/40"><Search className="h-10 w-10 mx-auto mb-3 opacity-30" /><p>No breeds found</p></div>}
            <section className="mt-8 rounded-3xl border border-dashed border-white/15 bg-white/5 p-5">
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm uppercase tracking-[0.28em] text-emerald-300/80">Advertisement</p>
                <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-white/35">Reserved</span>
              </div>
              <div className="mt-4 min-h-[120px] rounded-2xl border border-white/10 bg-black/20" />
            </section>
            <div className="mt-8 pt-8 border-t border-white/10 text-center">
              <p className="text-sm text-white/40 mb-4">Part of the <a href="https://www.tinytoolboxes.com" className="text-emerald-300 hover:underline">TinyToolboxes</a> free tools network</p>
              <div className="flex flex-wrap justify-center gap-3">
                <a href="https://www.tinytoolboxes.com/volumetric-weight-calculator" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/50 hover:bg-white/10 transition">Volumetric Weight</a>
                <a href="https://www.tinytoolboxes.com/age-calculator" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/50 hover:bg-white/10 transition">Age Calculator</a>
                <a href="https://www.tinytoolboxes.com/dog-age-calculator" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/50 hover:bg-white/10 transition">Dog Age</a>
                <a href="https://www.tinytoolboxes.com/cat-age-calculator" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/50 hover:bg-white/10 transition">Cat Age</a>
              </div>
            </div>
          </>
        )}
      </section>
    </main>
  );
}

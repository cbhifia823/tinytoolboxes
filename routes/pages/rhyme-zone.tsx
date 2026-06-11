import { useEffect, useMemo, useState } from "react";
import { ArrowRight, BadgeDollarSign, BookOpen, Globe2, LoaderCircle, Search, Sparkles, Wand2 } from "lucide-react";

const LOCALES = [
  { id: "en", label: "EN" },
  { id: "zh-hk", label: "繁" },
  { id: "zh-cn", label: "简" },
  { id: "es", label: "ES" },
] as const;

const COPY = {
  en: {
    collection: "TinyToolboxes collection",
    pageTitle: "Rhyme Zone",
    hero: "Rhymes, near rhymes, synonyms, antonyms, related words.",
    searchLabel: "Search the collection",
    searchPlaceholder: "Try: weight, date, word, url",
    searchHint: "Search hints",
    reserveAd: "Google Ads space reserved",
  },
  "zh-hk": {
    collection: "TinyToolboxes 系列",
    pageTitle: "押韻工具",
    hero: "押韻、近音、同義詞、反義詞、相關字。",
    searchLabel: "搜尋系列",
    searchPlaceholder: "例如：體積重量、日期、字數、URL",
    searchHint: "搜尋提示",
    reserveAd: "預留 Google 廣告位",
  },
  "zh-cn": {
    collection: "TinyToolboxes 系列",
    pageTitle: "押韵工具",
    hero: "押韵、近音、同义词、反义词、相关词。",
    searchLabel: "搜索系列",
    searchPlaceholder: "例如：体积重量、日期、字数、URL",
    searchHint: "搜索提示",
    reserveAd: "预留 Google 广告位",
  },
  es: {
    collection: "Colección TinyToolboxes",
    pageTitle: "Rhyme Zone",
    hero: "Rimas, rimas cercanas, sinónimos, antónimos y palabras relacionadas.",
    searchLabel: "Buscar la colección",
    searchPlaceholder: "Prueba: weight, date, word, url",
    searchHint: "Sugerencias",
    reserveAd: "Espacio reservado para Google Ads",
  },
} as const;

type Mode = "rhymes" | "near" | "synonyms" | "antonyms" | "related";

type ResultItem = {
  word: string;
  score: number;
  tags: string[];
  syllables: number | null;
  partOfSpeech: string | null;
};

type ApiResponse = {
  query?: string;
  mode?: Mode;
  count?: number;
  results?: ResultItem[];
  error?: string;
};

const MODES: Array<{ id: Mode; label: string; helper: string }> = [
  { id: "rhymes", label: "Rhymes", helper: "Perfect rhymes ranked by relevance." },
  { id: "near", label: "Near rhymes", helper: "Close-sounding alternatives." },
  { id: "synonyms", label: "Synonyms", helper: "Different words with similar meaning." },
  { id: "antonyms", label: "Antonyms", helper: "Opposites and contrast words." },
  { id: "related", label: "Related", helper: "Words commonly associated with your query." },
];

const QUICK_PICKS = ["light", "orange", "silver", "sparkle", "moon", "time"];

function Header({ locale, setLocale }: { locale: string; setLocale: (v: any) => void }) {
  const c = COPY[locale as keyof typeof COPY] ?? COPY.en;
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#071018]/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
        <a href="/" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-emerald-300 to-cyan-300 text-sm font-black text-slate-950 shadow-lg shadow-emerald-900/30">TT</span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-semibold tracking-wide">TinyToolboxes</span>
              <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-2 py-0.5 text-[11px] uppercase tracking-[0.18em] text-emerald-200">Collection</span>
            </div>
            <p className="text-sm text-white/50">Boring, useful, searchable.</p>
          </div>
        </a>
        <div className="flex flex-wrap items-center gap-2">
          {LOCALES.map((item) => (
            <button key={item.id} onClick={() => setLocale(item.id)} className={`rounded-full border px-3 py-1 text-xs font-medium transition ${locale === item.id ? "border-emerald-300/60 bg-emerald-300/15 text-emerald-100" : "border-white/10 bg-white/5 text-white/65 hover:border-emerald-300/30 hover:text-white"}`}>
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}

function SearchPanel({ locale }: { locale: string }) {
  const c = COPY[locale as keyof typeof COPY] ?? COPY.en;
  const [query, setQuery] = useState("");
  const filtered = ["weight", "date", "word", "url", "rhyme"].filter((hint) => hint.includes(query.toLowerCase()) || !query);
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-emerald-300">{c.searchLabel}</p>
          <p className="mt-1 text-sm text-white/60">{c.searchHint}</p>
        </div>
        <div className="text-xs text-white/45">{c.reserveAd}</div>
      </div>
      <div className="mt-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
        <Search className="h-4 w-4 text-emerald-300" />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={c.searchPlaceholder} className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/35" />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {filtered.map((hint) => (
          <button key={hint} onClick={() => setQuery(hint)} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/75 hover:border-emerald-300/40 hover:bg-emerald-300/10">{hint}</button>
        ))}
      </div>
    </section>
  );
}

function labelFromTag(tag: string | null) {
  switch (tag) {
    case "n":
      return "noun";
    case "v":
      return "verb";
    case "adj":
      return "adjective";
    case "adv":
      return "adverb";
    case "pron":
      return "pronoun";
    case "prep":
      return "preposition";
    case "conj":
      return "conjunction";
    case "det":
      return "determiner";
    default:
      return tag ?? "word";
  }
}

const SITE_URL = "https://www.tinytoolboxes.com";
const PAGE_PATH = "/rhyme-zone";

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
  if (o.jsonLd) {
    const arr = Array.isArray(o.jsonLd) ? o.jsonLd : [o.jsonLd];
    arr.forEach((data) => { const s = document.createElement("script"); s.setAttribute("type", "application/ld+json"); s.setAttribute("data-ttb", ""); s.textContent = JSON.stringify(data); head.appendChild(s); });
  }
}

export default function RhymeZone() {
  const [locale, setLocale] = useState<keyof typeof LOCALES>(() => {
    if (typeof window === "undefined") return "en";
    const saved = window.localStorage.getItem("ttb-locale") as keyof typeof LOCALES | null;
    return saved && LOCALES[saved] ? saved : "en";
  });
  const [query, setQuery] = useState("light");
  const [mode, setMode] = useState<Mode>("rhymes");
  const [searchedQuery, setSearchedQuery] = useState("light");
  const [searchedMode, setSearchedMode] = useState<Mode>("rhymes");
  const [results, setResults] = useState<ResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const modeInfo = useMemo(() => MODES.find((item) => item.id === mode) ?? MODES[0], [mode]);
  const searchedInfo = useMemo(() => MODES.find((item) => item.id === searchedMode) ?? MODES[0], [searchedMode]);
  const content = COPY[locale as keyof typeof COPY] ?? COPY.en;

  useEffect(() => {
    window.localStorage.setItem("ttb-locale", locale);
    applySEO({
      title: `${content.pageTitle} | TinyToolboxes`,
      description: content.hero,
      path: PAGE_PATH,
      jsonLd: { "@context": "https://schema.org", "@type": "WebApplication", name: content.pageTitle, url: SITE_URL + PAGE_PATH, description: content.hero, applicationCategory: "UtilitiesApplication", operatingSystem: "Web", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, publisher: { "@type": "Organization", name: "TinyToolboxes", url: SITE_URL } },
    });
  }, [content.hero, content.pageTitle, locale]);

  useEffect(() => {
    void runSearch("light", "rhymes");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function runSearch(nextQuery = query, nextMode = mode) {
    const trimmed = nextQuery.trim();
    if (!trimmed) {
      setError("Type a word first.");
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/rhyme-zone?word=${encodeURIComponent(trimmed)}&mode=${encodeURIComponent(nextMode)}`, {
        headers: { Accept: "application/json" },
      });
      const data = (await response.json()) as ApiResponse;
      if (!response.ok) throw new Error(data.error ?? "Something went wrong.");
      setResults(data.results ?? []);
      setSearchedQuery(data.query ?? trimmed);
      setSearchedMode((data.mode ?? nextMode) as Mode);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#163028_0%,#091016_28%,#05070b_100%)] text-white">
      <Header locale={locale} setLocale={setLocale} />
      <section className="mx-auto max-w-7xl px-4 pb-14 pt-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl shadow-black/30 backdrop-blur">
          <div className="flex items-center gap-2 text-sm text-emerald-200"><Sparkles className="h-4 w-4" /><span>{content.collection}</span></div>
          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">{content.pageTitle}</h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-white/70">{content.hero}</p>
        </div>
        <SearchPanel locale={locale} />
        <div className="mt-6 rounded-3xl border border-dashed border-emerald-300/25 bg-emerald-300/5 p-4 text-sm text-emerald-100/80">{content.reserveAd}</div>

        <div className="mt-5 space-y-3">
          {loading ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-white/70">Looking up words...</div>
          ) : results.length ? (
            results.slice(0, 8).map((item, index) => (
              <article key={`${item.word}-${index}`} className="rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-emerald-400/30 hover:bg-white/10">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-semibold">
                        {index + 1}. {item.word}
                      </h3>
                      {item.partOfSpeech ? (
                        <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2 py-0.5 text-[11px] uppercase tracking-[0.2em] text-emerald-200">
                          {labelFromTag(item.partOfSpeech)}
                        </span>
                      ) : null}
                    </div>
                    <div className="mt-1 text-sm text-white/45">
                      Score {item.score.toLocaleString()}
                      {item.syllables !== null ? ` • ${item.syllables} syllables` : ""}
                    </div>
                  </div>
                </div>
                {item.tags.length ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {item.tags.slice(0, 4).map((tag) => (
                      <span key={tag} className="rounded-full border border-white/10 bg-black/25 px-2.5 py-1 text-xs text-white/70">
                        {labelFromTag(tag)}
                      </span>
                    ))}
                  </div>
                ) : null}
              </article>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-5 text-sm text-white/55">Search a word to see ranked results.</div>
          )}
        </div>

        <article className="mt-8 space-y-8 rounded-3xl border border-white/10 bg-white/5 p-6 text-white/80">
          <div>
            <h2 className="text-2xl font-bold text-white">What are Rhymes and Why Do They Matter?</h2>
            <p className="mt-3 leading-7">A rhyme occurs when two or more words share a similar sound pattern, typically from the last stressed vowel through the end of the word. "Cat" and "bat" rhyme because they share the "-at" sound. "Love" and "dove" share the short "uv" sound. Rhyme is one of the most ancient and universal features of human language — found in poetry, songs, children's literature, advertising slogans, and everyday speech across every culture in the world.</p>
            <p className="mt-3 leading-7">Rhymes serve both aesthetic and functional purposes. In poetry and song, they create a musical quality, establish rhythm, and make lines more memorable. In advertising, rhyming slogans are more easily recalled: "Red Bull gives you wings," "Snap, Crackle, Pop." In education, rhymes help children learn vocabulary and phonics — the reason nursery rhymes have been used for centuries to teach language.</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">Types of Rhyme</h2>
            <p className="mt-3 leading-7">Not all rhymes are equal. English poetry and songwriting recognise several categories:</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                { name: "Perfect rhyme", desc: "Identical vowel and final consonant sounds: cat/bat, moon/June, time/rhyme. The gold standard in traditional poetry." },
                { name: "Near rhyme (slant rhyme)", desc: "Similar but not identical sounds: love/move, home/come, shape/cape. Used heavily in modern pop and hip-hop lyrics for flexibility." },
                { name: "Eye rhyme", desc: "Words that look like they should rhyme based on spelling but don't: love/move, pint/mint, come/home. Common in older poetry where pronunciation has shifted." },
                { name: "Identical rhyme", desc: "The same word used at the end of two lines. Generally considered weak in traditional poetry but effective in rap for emphasis." },
                { name: "Feminine rhyme", desc: "Rhymes on an unstressed final syllable: running/cunning, summer/drummer. Creates a lighter, falling cadence." },
                { name: "Rich rhyme (homophone)", desc: "Rhyming words that sound identical but differ in spelling and meaning: right/write/rite, there/their/they're." },
              ].map((t) => (
                <div key={t.name} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="font-semibold text-white">{t.name}</p>
                  <p className="mt-1 text-sm text-white/60">{t.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">Rhyme Schemes in Poetry</h2>
            <p className="mt-3 leading-7">A rhyme scheme is the pattern of rhymes at the end of each line in a poem, denoted by assigning letters to each new sound. The most common schemes include:</p>
            <ul className="mt-3 space-y-2 text-white/70">
              <li className="flex gap-2"><span className="shrink-0 text-emerald-300">→</span><span><strong className="text-white">AABB (couplet):</strong> Lines 1 and 2 rhyme, lines 3 and 4 rhyme. Nursery rhymes and heroic couplets use this. Example: "Roses are red (A) / violets are blue (B) / sugar is sweet (C) / and so are you (B)" is actually ABCB.</span></li>
              <li className="flex gap-2"><span className="shrink-0 text-emerald-300">→</span><span><strong className="text-white">ABAB (alternating):</strong> Lines alternate rhymes. The most common pattern in English lyric poetry and ballads. Used extensively by Shakespeare in his sonnets.</span></li>
              <li className="flex gap-2"><span className="shrink-0 text-emerald-300">→</span><span><strong className="text-white">ABBA (enclosed/chiasmus):</strong> The outer lines rhyme with each other, enclosing a different inner rhyme. Used in Tennyson's "In Memoriam."</span></li>
              <li className="flex gap-2"><span className="shrink-0 text-emerald-300">→</span><span><strong className="text-white">ABCABC or ABABCC (Shakespearean sonnet):</strong> Three quatrains with alternating rhyme followed by a closing rhyming couplet. Shakespeare wrote 154 sonnets in this form.</span></li>
              <li className="flex gap-2"><span className="shrink-0 text-emerald-300">→</span><span><strong className="text-white">Free verse (no scheme):</strong> Modern poetry often abandons end rhyme entirely, relying on internal rhythm, assonance, and other sonic devices instead.</span></li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">Rhyme in Songwriting and Hip-Hop</h2>
            <p className="mt-3 leading-7">Modern songwriting has pushed rhyme far beyond simple end-rhyme patterns. Contemporary pop and hip-hop use sophisticated techniques that would have been unrecognisable to Victorian poets:</p>
            <ul className="mt-3 space-y-3 text-white/70">
              <li><strong className="text-white">Internal rhyme:</strong> Rhyming within a single line, not just at line ends. Eminem is known for dense chains of internal rhymes that can sustain a single rhyme sound for 10+ syllables across multiple lines.</li>
              <li><strong className="text-white">Multi-syllable rhyme:</strong> Matching entire phrases rather than single words. "Motivating" / "stop debating" — the entire sound sequence rhymes, creating a more sophisticated effect.</li>
              <li><strong className="text-white">Assonance:</strong> Matching the vowel sounds within words while consonants differ: "brave" / "late" / "raze" all share a long "a" vowel. Creates a looser sonic connection than full rhyme.</li>
              <li><strong className="text-white">Consonance:</strong> Matching final consonant sounds with different vowels: "black" / "brick" / "book." Common in blues and soul music.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">Frequently Asked Questions</h2>
            <div className="mt-4 space-y-5">
              <div>
                <h3 className="font-semibold text-white">What is the difference between a rhyme and alliteration?</h3>
                <p className="mt-1 text-white/70">Rhyme involves similar sounds at the end of words or syllables ("cat" / "bat"). Alliteration involves repeating the same initial consonant sound at the beginning of nearby words ("Peter Piper picked a peck"). Both are forms of sound repetition used in poetry and rhetoric, but they operate at opposite ends of the word.</p>
              </div>
              <div>
                <h3 className="font-semibold text-white">Why is it so hard to find a rhyme for "orange"?</h3>
                <p className="mt-1 text-white/70">The word "orange" is famously difficult to rhyme in English because of its unusual combination of sounds (the "-ornj" ending). The only near-perfect rhyme commonly cited is "Blorenge" — a hill in Wales — and "sporange," a rare botanic term. Near-rhymes like "door-hinge" work in casual speech. This is why "orange" is a popular example of words that resist standard rhyme-scheme use.</p>
              </div>
              <div>
                <h3 className="font-semibold text-white">What does the "score" mean in the rhyme results?</h3>
                <p className="mt-1 text-white/70">The score is a measure of how closely a word matches the search word in terms of sound and phonetic similarity, calculated by the Datamuse API that powers this tool. Higher scores indicate stronger, more exact rhymes. Words with scores above 10,000 are typically perfect rhymes; lower scores indicate near-rhymes or slant rhymes.</p>
              </div>
              <div>
                <h3 className="font-semibold text-white">What are synonyms and antonyms good for in a rhyme tool?</h3>
                <p className="mt-1 text-white/70">When you can't find a rhyme for the exact word you need, finding a synonym first can unlock a completely different set of rhyming options. If "difficult" has no good rhymes for your purposes, synonyms like "hard" (rhymes: card, guard, starred) or "tough" (rhymes: rough, bluff, enough) may give you more workable options. Antonyms are useful for contrast-based poetic devices.</p>
              </div>
              <div>
                <h3 className="font-semibold text-white">Are there words in English with no rhymes at all?</h3>
                <p className="mt-1 text-white/70">Yes — several common English words have no perfect rhymes. The most cited examples are: orange, silver, purple, month, ninth, pint, wolf, and angst. Poets working with these words must either use near-rhymes (slant rhymes), eye rhymes, or restructure their lines to avoid placing them at a rhyming position. This is a normal challenge in English poetry.</p>
              </div>
            </div>
          </div>
        </article>
      </section>
    </main>
  );
}

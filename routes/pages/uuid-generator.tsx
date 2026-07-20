import { useEffect, useState } from "react";
import { Copy, RefreshCw, Search } from "lucide-react";

type LocaleKey = "en" | "zh-hk" | "zh-cn" | "es";

const COPY = {
  "en": {
    "name": "English",
    "title": "UUID Generator",
    "subtitle": "Generate free UUIDs (Universally Unique Identifiers) v4 online. Supports bulk generation for developers and testers.",
    "searchLabel": "Search tools",
    "searchPlaceholder": "Try: QR, password, json, base64, lorem",
    "countLabel": "Count",
    "generate": "Generate UUIDs",
    "copy": "Copy",
    "copied": "Copied!",
    "copyAll": "Copy All",
    "whatIsTitle": "What is a UUID?",
    "whatIsDesc": "A UUID (Universally Unique Identifier) is a 128-bit identifier guaranteed to be globally unique \u2014 no central registration needed.",
    "versions": [
      "UUID v4 (random)",
      "128-bit",
      "8-4-4-4-12 format"
    ],
    "useCasesTitle": "Use Cases",
    "useCases": [
      "Database primary keys",
      "Session / token IDs",
      "Distributed system tracing",
      "API request correlation",
      "File / resource identifiers",
      "Etcd / container orchestration"
    ],
    "faqTitle": "FAQ",
    "faqs": [
      {
        "q": "Are UUIDs really unique?",
        "a": "Collision probability for UUID v4 is ~1 in 2.8 \u00d7 10^14 trillion. It's astronomically unlikely to ever generate a duplicate."
      },
      {
        "q": "UUID vs GUID \u2014 what's the difference?",
        "a": "They are the same thing. GUID is Microsoft's term, UUID is the IETF standard. Functionally identical."
      },
      {
        "q": "How many UUIDs can I generate at once?",
        "a": "This tool supports up to 100 per batch. For larger batches, consider a command-line tool like `uuid`."
      },
      {
        "q": "Are these cryptographically secure?",
        "a": "UUID v4 uses a cryptographically secure random number generator in modern browsers, making them suitable for most security needs."
      }
    ],
    "relatedTitle": "Related Tools",
    "related": [
      {
        "href": "/password-generator",
        "label": "Password Generator"
      },
      {
        "href": "/base64-encoder-decoder",
        "label": "Base64 Encoder / Decoder"
      },
      {
        "href": "/json-formatter",
        "label": "JSON Formatter"
      },
      {
        "href": "/lorem-ipsum-generator",
        "label": "Lorem Ipsum Generator"
      },
      {
        "href": "/binary-translator",
        "label": "Binary Translator"
      },
      {
        "href": "/hash-generator",
        "label": "Hash Generator (MD5/SHA)"
      }
    ]
  },
  "zh-hk": {
    "name": "\u7e41\u9ad4\u4e2d\u6587",
    "title": "UUID \u7522\u751f\u5668",
    "subtitle": "\u514d\u8cbb\u5728\u7dda\u7522\u751f UUID v4 \u901a\u7528\u552f\u4e00\u8b58\u5225\u78bc\uff0c\u652f\u63f4\u6279\u91cf\u751f\u6210\uff0c\u9069\u5408\u958b\u767c\u8005\u540c\u6e2c\u8a66\u4eba\u54e1\u3002",
    "searchLabel": "\u641c\u5c0b\u5de5\u5177",
    "searchPlaceholder": "\u4f8b\u5982\uff1aQR\u3001\u5bc6\u78bc\u3001JSON\u3001Base64",
    "countLabel": "\u6578\u91cf",
    "generate": "\u7522\u751f UUID",
    "copy": "\u8907\u88fd",
    "copied": "\u5df2\u8907\u88fd\uff01",
    "copyAll": "\u8907\u88fd\u5168\u90e8",
    "whatIsTitle": "\u54a9\u4fc2 UUID\uff1f",
    "whatIsDesc": "UUID\uff08\u901a\u7528\u552f\u4e00\u8b58\u5225\u78bc\uff09\u4fc2\u4e00\u500b 128 \u4f4d\u5143\u5605\u8b58\u5225\u78bc\uff0c\u4fdd\u8b49\u5168\u7403\u552f\u4e00\uff0c\u5514\u9700\u8981\u4e2d\u592e\u767b\u8a18\u3002",
    "versions": [
      "UUID v4\uff08\u96a8\u6a5f\uff09",
      "128-bit",
      "8-4-4-4-12 \u683c\u5f0f"
    ],
    "useCasesTitle": "\u4f7f\u7528\u5834\u666f",
    "useCases": [
      "\u6578\u64da\u5eab\u4e3b\u9375",
      "Session\uff0fToken ID",
      "\u5206\u5e03\u5f0f\u7cfb\u7d71\u8ffd\u8e64",
      "API \u8acb\u6c42\u95dc\u806f",
      "\u6a94\u6848\uff0f\u8cc7\u6e90\u8b58\u5225",
      "\u5bb9\u5668\u7de8\u6392\uff08Etcd\uff09"
    ],
    "faqTitle": "\u5e38\u898b\u554f\u984c",
    "faqs": [
      {
        "q": "UUID \u771f\u4fc2\u4fdd\u8b49\u552f\u4e00\uff1f",
        "a": "UUID v4 \u5605\u885d\u7a81\u6a5f\u7387\u5927\u7d04\u4fc2 2.8 \u00d7 10^14 \u5146\u5206\u4e4b\u4e00\uff0c\u5be6\u969b\u4e0a\u6c38\u9060\u5514\u6703\u91cd\u8907\u3002"
      },
      {
        "q": "UUID \u540c GUID \u6709\u54a9\u5206\u5225\uff1f",
        "a": "\u5176\u5be6\u4fc2\u540c\u4e00\u6a23\u5622\u3002GUID \u4fc2 Microsoft \u5605\u53eb\u6cd5\uff0cUUID \u4fc2 IETF \u6a19\u6e96\u3002\u529f\u80fd\u5b8c\u5168\u4e00\u6a23\u3002"
      },
      {
        "q": "\u4e00\u6b21\u53ef\u4ee5\u7522\u751f\u5e7e\u591a\u500b UUID\uff1f",
        "a": "\u5462\u500b\u5de5\u5177\u6bcf\u6b21\u6700\u591a\u53ef\u4ee5\u7522\u751f 100 \u500b\u3002\u5982\u679c\u9700\u8981\u66f4\u591a\uff0c\u53ef\u4ee5\u7528\u547d\u4ee4\u884c\u5de5\u5177 `uuid`\u3002"
      },
      {
        "q": "\u5462\u5572 UUID \u5b89\u5168\u55ce\uff1f",
        "a": "UUID v4 \u55ba\u73fe\u4ee3\u700f\u89bd\u5668\u5165\u9762\u7528\u5497\u5bc6\u78bc\u5b78\u5b89\u5168\u5605\u96a8\u6a5f\u6578\u751f\u6210\u5668\uff0c\u9069\u5408\u5927\u90e8\u5206\u5b89\u5168\u9700\u6c42\u3002"
      }
    ],
    "relatedTitle": "\u76f8\u95dc\u5de5\u5177",
    "related": [
      {
        "href": "/password-generator",
        "label": "\u5bc6\u78bc\u7522\u751f\u5668"
      },
      {
        "href": "/base64-encoder-decoder",
        "label": "Base64 \u7de8\u78bc\uff0f\u89e3\u78bc"
      },
      {
        "href": "/json-formatter",
        "label": "JSON \u683c\u5f0f\u5316"
      },
      {
        "href": "/lorem-ipsum-generator",
        "label": "Lorem Ipsum \u7522\u751f\u5668"
      },
      {
        "href": "/binary-translator",
        "label": "\u4e8c\u9032\u5236\u7ffb\u8b6f\u5668"
      },
      {
        "href": "/hash-generator",
        "label": "\u54c8\u5e0c\u7522\u751f\u5668\uff08MD5/SHA\uff09"
      }
    ]
  },
  "zh-cn": {
    "name": "\u7b80\u4f53\u4e2d\u6587",
    "title": "UUID \u751f\u6210\u5668",
    "subtitle": "\u514d\u8d39\u5728\u7ebf\u751f\u6210 UUID v4 \u901a\u7528\u552f\u4e00\u8bc6\u522b\u7801\uff0c\u652f\u6301\u6279\u91cf\u751f\u6210\uff0c\u9002\u5408\u5f00\u53d1\u8005\u548c\u6d4b\u8bd5\u4eba\u5458\u3002",
    "searchLabel": "\u641c\u7d22\u5de5\u5177",
    "searchPlaceholder": "\u4f8b\u5982\uff1aQR\u3001\u5bc6\u7801\u3001JSON\u3001Base64",
    "countLabel": "\u6570\u91cf",
    "generate": "\u751f\u6210 UUID",
    "copy": "\u590d\u5236",
    "copied": "\u5df2\u590d\u5236\uff01",
    "copyAll": "\u590d\u5236\u5168\u90e8",
    "whatIsTitle": "\u4ec0\u4e48\u662f UUID\uff1f",
    "whatIsDesc": "UUID\uff08\u901a\u7528\u552f\u4e00\u8bc6\u522b\u7801\uff09\u662f\u4e00\u4e2a 128 \u4f4d\u7684\u6807\u8bc6\u7b26\uff0c\u4fdd\u8bc1\u5168\u7403\u552f\u4e00\uff0c\u65e0\u9700\u4e2d\u592e\u6ce8\u518c\u3002",
    "versions": [
      "UUID v4\uff08\u968f\u673a\uff09",
      "128-bit",
      "8-4-4-4-12 \u683c\u5f0f"
    ],
    "useCasesTitle": "\u4f7f\u7528\u573a\u666f",
    "useCases": [
      "\u6570\u636e\u5e93\u4e3b\u952e",
      "Session/Token ID",
      "\u5206\u5e03\u5f0f\u7cfb\u7edf\u8ffd\u8e2a",
      "API \u8bf7\u6c42\u5173\u8054",
      "\u6587\u4ef6/\u8d44\u6e90\u6807\u8bc6",
      "\u5bb9\u5668\u7f16\u6392\uff08Etcd\uff09"
    ],
    "faqTitle": "\u5e38\u89c1\u95ee\u9898",
    "faqs": [
      {
        "q": "UUID \u771f\u7684\u4fdd\u8bc1\u552f\u4e00\u5417\uff1f",
        "a": "UUID v4 \u7684\u51b2\u7a81\u6982\u7387\u5927\u7ea6\u662f 2.8 \u00d7 10^14 \u4e07\u4ebf\u5206\u4e4b\u4e00\uff0c\u5b9e\u9645\u4e0a\u6c38\u8fdc\u4e0d\u4f1a\u91cd\u590d\u3002"
      },
      {
        "q": "UUID \u548c GUID \u6709\u4ec0\u4e48\u533a\u522b\uff1f",
        "a": "\u5176\u5b9e\u662f\u540c\u4e00\u4e2a\u4e1c\u897f\u3002GUID \u662f\u5fae\u8f6f\u7684\u53eb\u6cd5\uff0cUUID \u662f IETF \u6807\u51c6\u3002\u529f\u80fd\u5b8c\u5168\u4e00\u6837\u3002"
      },
      {
        "q": "\u4e00\u6b21\u53ef\u4ee5\u751f\u6210\u591a\u5c11\u4e2a UUID\uff1f",
        "a": "\u8fd9\u4e2a\u5de5\u5177\u6bcf\u6b21\u6700\u591a\u53ef\u4ee5\u751f\u6210 100 \u4e2a\u3002\u5982\u679c\u9700\u8981\u66f4\u591a\uff0c\u53ef\u4ee5\u4f7f\u7528\u547d\u4ee4\u884c\u5de5\u5177 `uuid`\u3002"
      },
      {
        "q": "\u8fd9\u4e9b UUID \u5b89\u5168\u5417\uff1f",
        "a": "UUID v4 \u5728\u73b0\u4ee3\u6d4f\u89c8\u5668\u4e2d\u4f7f\u7528\u4e86\u5bc6\u7801\u5b66\u5b89\u5168\u7684\u968f\u673a\u6570\u751f\u6210\u5668\uff0c\u9002\u5408\u5927\u90e8\u5206\u5b89\u5168\u9700\u6c42\u3002"
      }
    ],
    "relatedTitle": "\u76f8\u5173\u5de5\u5177",
    "related": [
      {
        "href": "/password-generator",
        "label": "\u5bc6\u7801\u751f\u6210\u5668"
      },
      {
        "href": "/base64-encoder-decoder",
        "label": "Base64 \u7f16\u7801/\u89e3\u7801"
      },
      {
        "href": "/json-formatter",
        "label": "JSON \u683c\u5f0f\u5316"
      },
      {
        "href": "/lorem-ipsum-generator",
        "label": "Lorem Ipsum \u751f\u6210\u5668"
      },
      {
        "href": "/binary-translator",
        "label": "\u4e8c\u8fdb\u5236\u7ffb\u8bd1\u5668"
      },
      {
        "href": "/hash-generator",
        "label": "\u54c8\u5e0c\u751f\u6210\u5668\uff08MD5/SHA\uff09"
      }
    ]
  },
  "es": {
    "name": "Espa\u00f1ol",
    "title": "Generador de UUID",
    "subtitle": "Genera UUIDs v4 gratuitos en l\u00ednea. Admite generaci\u00f3n por lotes para desarrolladores y testers.",
    "searchLabel": "Buscar herramientas",
    "searchPlaceholder": "Prueba: QR, contrase\u00f1a, JSON, Base64",
    "countLabel": "Cantidad",
    "generate": "Generar UUIDs",
    "copy": "Copiar",
    "copied": "\u00a1Copiado!",
    "copyAll": "Copiar todos",
    "whatIsTitle": "\u00bfQu\u00e9 es un UUID?",
    "whatIsDesc": "Un UUID (Identificador \u00danico Universal) es un identificador de 128 bits garantizado como globalmente \u00fanico, sin necesidad de registro central.",
    "versions": [
      "UUID v4 (aleatorio)",
      "128 bits",
      "Formato 8-4-4-4-12"
    ],
    "useCasesTitle": "Casos de uso",
    "useCases": [
      "Claves primarias en BD",
      "IDs de sesi\u00f3n/token",
      "Trazabilidad en sistemas distribuidos",
      "Correlaci\u00f3n de solicitudes API",
      "Identificadores de archivos",
      "Orquestaci\u00f3n de contenedores"
    ],
    "faqTitle": "Preguntas frecuentes",
    "faqs": [
      {
        "q": "\u00bfLos UUIDs son realmente \u00fanicos?",
        "a": "La probabilidad de colisi\u00f3n para UUID v4 es de ~1 en 2.8 \u00d7 10^14 billones. Es astron\u00f3micamente improbable generar un duplicado."
      },
      {
        "q": "\u00bfUUID vs GUID \u2014 cu\u00e1l es la diferencia?",
        "a": "Son lo mismo. GUID es el t\u00e9rmino de Microsoft, UUID es el est\u00e1ndar IETF. Funcionalmente id\u00e9nticos."
      },
      {
        "q": "\u00bfCu\u00e1ntos UUIDs puedo generar a la vez?",
        "a": "Esta herramienta permite hasta 100 por lote. Para lotes m\u00e1s grandes, usa una herramienta CLI como `uuid`."
      },
      {
        "q": "\u00bfSon criptogr\u00e1ficamente seguros?",
        "a": "UUID v4 usa un generador de n\u00fameros aleatorios criptogr\u00e1ficamente seguro en navegadores modernos."
      }
    ],
    "relatedTitle": "Herramientas relacionadas",
    "related": [
      {
        "href": "/password-generator",
        "label": "Generador de Contrase\u00f1as"
      },
      {
        "href": "/base64-encoder-decoder",
        "label": "Codificador Base64"
      },
      {
        "href": "/json-formatter",
        "label": "Formateador JSON"
      },
      {
        "href": "/lorem-ipsum-generator",
        "label": "Generador Lorem Ipsum"
      },
      {
        "href": "/binary-translator",
        "label": "Traductor Binario"
      },
      {
        "href": "/hash-generator",
        "label": "Generador Hash (MD5/SHA)"
      }
    ]
  }
};

function generateUUID() {
  return crypto.randomUUID();
}

function applySEO(o: { title: string; description: string; path: string; jsonLd?: object | object[] }) {
  if (typeof document === "undefined") return;
  document.title = o.title + " — TinyToolboxes";
  const metaDesc = document.querySelector('meta[name="description"]') || (() => { const el = document.createElement("meta"); el.name = "description"; document.head.appendChild(el); return el; })();
  metaDesc.setAttribute("content", o.description);
  const canonical = document.querySelector('link[rel="canonical"]') || (() => { const el = document.createElement("link"); el.rel = "canonical"; document.head.appendChild(el); return el; })();
  canonical.setAttribute("href", "https://www.tinytoolboxes.com" + o.path);
  const ogT = document.querySelector('meta[property="og:title"]') || (() => { const el = document.createElement("meta"); el.setAttribute("property", "og:title"); document.head.appendChild(el); return el; })();
  ogT.setAttribute("content", o.title + " — TinyToolboxes");
  const ogD = document.querySelector('meta[property="og:description"]') || (() => { const el = document.createElement("meta"); el.setAttribute("property", "og:description"); document.head.appendChild(el); return el; })();
  ogD.setAttribute("content", o.description);
  const ogU = document.querySelector('meta[property="og:url"]') || (() => { const el = document.createElement("meta"); el.setAttribute("property", "og:url"); document.head.appendChild(el); return el; })();
  ogU.setAttribute("content", "https://www.tinytoolboxes.com" + o.path);
}

const PAGE_PATH = "/uuid-generator";

export default function UUIDGenerator() {
  const [locale, setLocale] = useState<LocaleKey>(() => (typeof localStorage !== "undefined" ? (localStorage.getItem("tt-locale") as LocaleKey) || "en" : "en"));
  const [uuid, setUuid] = useState("");
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState(1);
  const [copied, setCopied] = useState(false);
  const [keyword, setKeyword] = useState("");

  const content = (COPY as any)[locale] || COPY.en;

  useEffect(() => {
    applySEO({ title: content.title, description: content.subtitle, path: PAGE_PATH, jsonLd: { "@context": "https://schema.org", "@type": "WebApplication", name: content.title, url: "https://www.tinytoolboxes.com" + PAGE_PATH, description: content.subtitle, applicationCategory: "DeveloperApplication" } });
    localStorage.setItem("tt-locale", locale);
  }, [locale, content.title, content.subtitle]);

  function handleGenerate() {
    const arr = Array.from({ length: count }, () => generateUUID());
    setUuid(arr[0] || "");
    setUuids(arr);
  }

  function copyOne(text: string) {
    navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500); });
  }

  function copyAll() {
    navigator.clipboard.writeText(uuids.join("\n")).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500); });
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const v = keyword.trim().toLowerCase();
    if (!v) return;
    const map: Record<string, string> = { uuid: "/uuid-generator", uid: "/uuid-generator", guid: "/uuid-generator", lorem: "/lorem-ipsum-generator", binary: "/binary-translator", morse: "/morse-code-translator", base64: "/base64-encoder-decoder", password: "/password-generator", json: "/json-formatter", qr: "/qr-code-generator", sleep: "/sleep-calculator", age: "/age-calculator", bmi: "/bmi-calculator" };
    window.location.href = map[v] || "/";
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-950 to-zinc-900 text-zinc-200">
      <header className="sticky top-0 z-50 backdrop-blur-md bg-zinc-950/80 border-b border-emerald-800/30">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <a href="/" className="flex items-center gap-2 font-semibold text-emerald-400 hover:text-emerald-300 transition-colors shrink-0">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="4"/><path d="M7 8h3M14 8h3M7 12h10M7 16h5"/></svg>
            TinyToolboxes
          </a>
          <div className="flex items-center gap-2 flex-wrap">
            {(["en","zh-hk","zh-cn","es"] as LocaleKey[]).map(l => (
              <button key={l} onClick={() => setLocale(l)} className={"px-2 py-1 text-xs rounded border transition " + (locale === l ? "bg-emerald-600/20 border-emerald-500 text-emerald-300" : "border-zinc-700 text-zinc-400 hover:border-zinc-500")}>{(COPY as any)[l]?.name || l}</button>
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
            <div className="flex items-center gap-3 mb-4">
              <label className="text-sm text-zinc-400">{content.countLabel}</label>
              <input type="number" min="1" max="100" value={count} onChange={e => setCount(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))} className="w-20 bg-zinc-800 border border-zinc-600 rounded px-3 py-1.5 text-sm text-zinc-200" />
              <button onClick={handleGenerate} className="ml-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition flex items-center gap-2"><RefreshCw className="w-4 h-4" />{content.generate}</button>
            </div>
            {uuids.length > 0 && (
              <div className="space-y-2">
                {uuids.map((u,i) => (
                  <div key={i} className="flex items-center gap-2 bg-zinc-800/50 rounded-lg px-3 py-2 border border-zinc-700/40 group">
                    <code className="flex-1 text-sm text-emerald-300 break-all">{u}</code>
                    <button onClick={() => copyOne(u)} className="opacity-0 group-hover:opacity-100 transition p-1.5 hover:bg-zinc-700 rounded" title={content.copy}><Copy className="w-3.5 h-3.5 text-zinc-400" /></button>
                  </div>
                ))}
                {uuids.length > 1 && (
                  <button onClick={copyAll} className="w-full mt-3 px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-zinc-200 rounded-lg text-sm transition flex items-center justify-center gap-2"><Copy className="w-4 h-4" />{copied ? content.copied : content.copyAll}</button>
                )}
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white/5 rounded-xl border border-zinc-700/50 p-5">
              <h2 className="font-semibold text-white mb-3">{content.whatIsTitle}</h2>
              <p className="text-zinc-400 text-sm leading-relaxed">{content.whatIsDesc}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {(content.versions as string[]).map((v: string, i: number) => (<span key={i} className="text-xs px-2 py-0.5 bg-emerald-900/40 border border-emerald-700/30 rounded text-emerald-300">{v}</span>))}
              </div>
            </div>
            <div className="bg-white/5 rounded-xl border border-zinc-700/50 p-5">
              <h2 className="font-semibold text-white mb-3">{content.useCasesTitle}</h2>
              <ul className="space-y-2 text-sm text-zinc-400">
                {(content.useCases as string[]).map((u: string, i: number) => (<li key={i} className="flex gap-2"><span className="text-emerald-400 shrink-0">•</span>{u}</li>))}
              </ul>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl border border-zinc-700/50 p-5 mb-8">
            <h2 className="font-semibold text-white mb-3">{content.faqTitle}</h2>
            <div className="space-y-4">
              {(content.faqs as Array<{q:string;a:string}>).map((faq, i) => (
                <details key={i} className="group">
                  <summary className="cursor-pointer text-zinc-300 text-sm font-medium hover:text-emerald-400 transition-colors">{faq.q}</summary>
                  <p className="mt-2 text-zinc-500 text-sm leading-relaxed pl-3 border-l-2 border-emerald-800/40">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>

          <div className="bg-white/5 rounded-xl border border-zinc-700/50 p-5 mb-8">
            <h2 className="font-semibold text-white mb-3">{content.relatedTitle}</h2>
            <div className="grid sm:grid-cols-2 gap-2">
              {(content.related as Array<{href:string;label:string}>).map((r, i) => (
                <a key={i} href={r.href} className="text-sm text-emerald-400 hover:text-emerald-300 hover:underline transition">{r.label}</a>
              ))}
            </div>
          </div>

          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input type="text" value={keyword} onChange={e => setKeyword(e.target.value)} placeholder={content.searchPlaceholder} className="w-full pl-9 pr-4 py-2.5 bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-600" />
          </form>
        </div>
      </section>
    </main>
  );
}
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, BadgeDollarSign, Code2, Search, Link2 } from "lucide-react";

const LANGUAGES = {
  en: {
    name: "English",
    title: "URL Encoder / Decoder",
    subtitle: "Encode and decode URLs instantly with a simple URL encoder and decoder.",
    searchLabel: "Search tools",
    searchPlaceholder: "Try: weight, day, invoice, word",
    searchHint: "Search hints",
    reserveAd: "Google Ads space reserved",
    reserveAdSub: "之後可直接放 AdSense 程式碼。",
adLabel: "Advertisement",
adBadge: "Reserved",
    inputLabel: "Input",
    encodedLabel: "Encoded",
    decodedLabel: "Decoded",
    sidebarTitle: "Quick use",
    sidebarSub: "For links, query strings, and parameters.",
    sidebarItem1: "Paste a raw URL to encode it.",
    sidebarItem2: "Paste encoded text to decode it.",
    articleTitle1: "What is URL Encoding?",
    article1: [
      "URLs can only safely contain a limited subset of ASCII characters. Letters (A-Z, a-z), digits (0-9), and a handful of unreserved symbols like hyphens, underscores, periods, and tildes are safe to use as-is. Everything else - spaces, ampersands, equals signs, hash symbols, non-ASCII characters like Chinese or Arabic script, and many punctuation marks - must be transformed before they can appear in a URL.",
      "This transformation is called percent-encoding (commonly called URL encoding). It is defined in RFC 3986. The standard divides URL characters into reserved (special meaning like / and ?) and unreserved (safe anywhere). Reserved characters must be encoded when used outside their intended structural role.",
      "Without URL encoding, a URL like https://example.com/search?q=hello world&lang=en would be ambiguous. Encoding it produces https://example.com/search?q=hello%20world&lang=en, which is unambiguous.",
    ],
    articleTitle2: "How Percent-Encoding Works",
    article2: [
      "Each character that needs encoding is first converted to its byte representation in UTF-8. Then each byte is written as a percent sign followed by two hexadecimal digits.",
      "For ASCII characters: space (32, 0x20) becomes %20. The at-sign @ (64, 0x40) becomes %40. A forward slash / (47, 0x2F) becomes %2F.",
      "For non-ASCII: the Chinese character U+4F60 encodes to UTF-8 bytes E4 BD A0, becoming %E4%BD%A0. This is why Chinese, Arabic, or accented characters appear as long percent-encoded strings.",
    ],
    articleTitle3: "Common Encoded Characters Reference",
    article3: ["Here are the most frequently encountered percent-encoded characters in URLs."],
    articleTitle4: "When Do You Need URL Encoding?",
    article4: [
      "URL encoding is needed whenever special characters appear where they would be misinterpreted.",
      "Search query parameters: Google encodes search terms like hello world as ?q=hello+world or ?q=hello%20world.",
      "HTML form submissions: browsers encode input data before sending it.",
      "API requests with special characters: ampersands, equals signs, or slashes must be encoded.",
      "Non-ASCII content in URLs: Chinese or Arabic titles require encoding for valid URLs.",
      "Email links with pre-filled subjects: mailto links require encoding for email clients.",
    ],
    articleTitle5: "URL Encoding vs Base64 Encoding",
    article5: [
      "URL encoding and Base64 encoding both represent data as text but serve different purposes.",
      "URL encoding makes text safe for URLs. It is human-readable for ASCII and only transforms problematic characters.",
      "Base64 encoding converts binary data (images, files, binary protocols) into 64 safe ASCII chars. It increases data size by ~33% and is unreadable without decoding.",
    ],
    faqTitle: "Frequently Asked Questions",
    faq: [
      { q: "What is the difference between %20 and + for spaces in URLs?", a: "Both represent a space. %20 is strict percent-encoding valid anywhere. + represents a space only in query strings (application/x-www-form-urlencoded). In URL paths, + is a literal plus sign." },
      { q: "Why does a URL have %E4%B8%AD instead of actual Chinese characters?", a: "The Chinese character (U+4E2D) encodes to UTF-8 bytes E4 B8 AD, giving %E4%B8%AD. Modern browsers display decoded characters in the address bar, but the underlying URL uses percent-encoding." },
      { q: "Is URL encoding the same as HTML entity encoding?", a: "No. HTML entity encoding uses &amp; for & or &lt; for <. It prevents HTML interpretation inside documents. URL encoding is separate - it makes characters safe within URLs." },
      { q: "Can I use this tool to decode a URL from a browser address bar?", a: "Yes. Paste the encoded URL and the decoded version appears immediately. Useful for reading search queries, redirect URLs, or API endpoints with encoded parameters." },
      { q: "What characters are safe and don't need encoding?", a: "RFC 3986 unreserved characters: A-Z, a-z, 0-9, hyphen, underscore, period, and tilde. All other characters including structural ones (/, ?, #, &, =) and non-ASCII should be encoded when used as data." },
    ],
  },
"zh-hk": {
    name: "繁體中文",
    title: "URL 編碼／解碼",
    subtitle: "即時將 URL 轉做編碼或還原。",
    searchLabel: "搜尋工具",
    searchPlaceholder: "例如：體積重量、工作日、發票、字數",
    searchHint: "搜尋提示",
    reserveAd: "預留 Google 廣告位",
    reserveAdSub: "之後可直接放 AdSense 程式碼。",
adLabel: "廣告", adBadge: "已預留",

    inputLabel: "輸入",
    encodedLabel: "已編碼",
    decodedLabel: "已解碼",
    sidebarTitle: "快速使用",
    sidebarSub: "處理連結、查詢字串同參數。",
    sidebarItem1: "貼上原始 URL 進行編碼。",
    sidebarItem2: "貼上已編碼文字進行解碼。",
    articleTitle1: "咩係 URL 編碼？",
    article1: [
      "URL 只可以安全咁包含有限嘅 ASCII 字符。字母（A-Z、a-z）、數字（0-9）同少量非保留符號（例如連字號、底線、句號同波浪號）可以直接使用。其他所有嘢——空格、& 符號、等號、井號、非 ASCII 字符（例如中文或阿拉伯文），同好多標點符號——都必須喺放入 URL 之前做轉換。",
      "呢個轉換過程叫做百分號編碼（通常叫 URL 編碼），由 RFC 3986 定義。標準將 URL 字符分為「保留字符」（有特殊意義，例如 / 同 ?）同「非保留字符」（邊度用都得）。保留字符喺唔係用嚟做結構用途嗰陣必須編碼——例如喺查詢參數值入面嘅 & 符號必須變成 %26，以免俾人誤會係參數分隔符。",
      "如果冇 URL 編碼，一個 URL 例如 https://example.com/search?q=hello world&lang=en 會令網頁伺服器無所適從，因為空格同 & 符號都係有結構意義嘅字符。編碼之後變成 https://example.com/search?q=hello%20world&lang=en，咁就清清楚楚。",
    ],
    articleTitle2: "百分號編碼點樣運作",
    article2: [
      "每個需要編碼嘅字符，會先轉成佢嘅 UTF-8 字節表示，然後每個字節寫成百分號加兩個十六進制數字。",
      "ASCII 字符好簡單：空格（ASCII 32，十六進制 20）變成 %20。@ 符號（ASCII 64，十六進制 40）變成 %40。斜線 /（ASCII 47，十六進制 2F）變成 %2F。",
      "非 ASCII 字符要先用 UTF-8 編碼。中文字「你」（U+4F60）嘅 UTF-8 編碼係三個字節：E4 BD A0。百分號編碼之後變成 %E4%BD%A0。呢個就係點解包含中文、阿拉伯文或者有重音符號嘅 URL，喺瀏覽器網址列顯示做一長串百分號編碼嘅原因。",
    ],
    articleTitle3: "常見編碼字符對照表",
    article3: ["以下係 URL 入面最常見嘅百分號編碼字符。"],
    articleTitle4: "幾時需要用 URL 編碼？",
    article4: [
      "每當特殊字符出現喺可能會被誤解嘅地方，就需要用 URL 編碼。",
      "搜尋查詢參數：Google 會將你嘅搜尋字詞編碼，例如搜尋「hello world」會變成 ?q=hello+world 或者 ?q=hello%20world。",
      "HTML 表單提交：瀏覽器會喺發送之前將輸入資料編碼。",
      "帶特殊字符嘅 API 請求：如果 API 參數值入面有 & 符號、等號或者斜線，就要編碼。",
      "URL 入面嘅非 ASCII 內容：分享包含中文或者阿拉伯文標題嘅連結，需要編碼非 ASCII 字符。",
      "帶預填主旨嘅電郵連結：mailto 連結需要編碼先可以俾電郵客戶端正確解析。",
    ],
    articleTitle5: "URL 編碼 vs Base64 編碼",
    article5: [
      "URL 編碼同 Base64 編碼都係將數據用文字表示嘅方法，但用途完全唔同。",
      "URL 編碼係為咗令文字可以安全咁放喺 URL 入面。ASCII 字符仲係可以睇得明，只係轉換咗喺 URL 入面會有問題嘅字符。",
      "Base64 編碼係將任意二進制數據（包括圖像、檔案、二進制協議）轉成 64 個安全 ASCII 字符嘅字串。佢會將數據大細增加約 33%，而且唔解碼嘅話完全睇唔明。",
    ],
    faqTitle: "常見問題",
    faq: [
      { q: "URL 入面嘅 %20 同 + 號有咩分別？", a: "兩個都代表空格，但使用場景唔同。%20 係嚴格嘅百分號編碼，喺 URL 任何位置都有效。+ 號只係喺查詢字串入面代表空格（根據 application/x-www-form-urlencoded 格式）。喺 URL 路徑入面，+ 就係加號，唔係空格。" },
      { q: "點解 URL 有時會出現 %E4%B8%AD 而唔係實際嘅中文字？", a: "中文字「中」（U+4E2D）嘅 UTF-8 編碼係字節 E4 B8 AD。每個字節做百分號編碼就係 %E4%B8%AD。現代瀏覽器會喺網址列顯示解碼後嘅字符俾你睇，但實際傳送去伺服器嘅 URL 係百分號編碼嘅版本。" },
      { q: "URL 編碼同 HTML 實體編碼係咪同一樣嘢？", a: "唔係。HTML 實體編碼用 &amp; 代表 &，用 &lt; 代表 <，係用嚟防止字符俾人當做 HTML 標記嚟解析。URL 編碼係完全獨立嘅系統，用嚟令字符喺 URL 入面可以安全使用。" },
      { q: "我可唔可以用呢個工具解碼瀏覽器網址列嘅 URL？", a: "可以。將編碼咗嘅 URL 貼入輸入框，解碼版本就會即刻顯示。呢個功能對於閱讀搜尋查詢、理解重定向網址、或者檢查包含編碼參數嘅 API 端點好有用。" },
      { q: "邊啲字符係「安全」嘅，唔需要編碼？", a: "RFC 3986 定義嘅非保留字符包括：大細楷字母 A-Z 同 a-z、數字 0-9、連字號（-）、底線（_）、句號（.）同波浪號（~）。呢啲字符永遠唔需要百分號編碼。其他所有字符，包括有特殊結構意義嘅（/、?、#、&、=）同所有非 ASCII 字符，喺用嚟做數據值嗰陣都需要編碼。" },
    ],
  },
  "zh-cn": {
    name: "简体中文",
    title: "URL 编码／解码",
    subtitle: "立即将 URL 进行编码或还原。",
    searchLabel: "搜索工具",
    searchPlaceholder: "例如：体积重量、工作日、发票、字数",
    searchHint: "搜索提示",
    reserveAd: "预留 Google 广告位",
    reserveAdSub: "之後可直接放 AdSense 程式碼。",
adLabel: "广告", adBadge: "已预留",

    inputLabel: "输入",
    encodedLabel: "已编码",
    decodedLabel: "已解码",
    sidebarTitle: "快速使用",
    sidebarSub: "处理链接、查询字符串和参数。",
    sidebarItem1: "粘贴原始 URL 进行编码。",
    sidebarItem2: "粘贴已编码文本进行解码。",
    articleTitle1: "什么是 URL 编码？",
    article1: [
      "URL 只能安全地包含有限的 ASCII 字符。字母（A-Z、a-z）、数字（0-9）和少量非保留符号（如连字符、下划线、句号和波浪号）可以直接使用。其他所有内容——空格、& 符号、等号、井号、非 ASCII 字符（如中文或阿拉伯文），以及许多标点符号——放入 URL 之前都必须进行转换。",
      "这种转换称为百分号编码（通常叫 URL 编码），由 RFC 3986 定义。该标准将 URL 字符分为「保留字符」（有特殊含义，如 / 和 ?）和「非保留字符」（任何地方都安全）。保留字符在非结构用途时必须编码——例如查询参数值中的 & 符号必须变成 %26，以免被误认为是参数分隔符。",
      "如果没有 URL 编码，像 https://example.com/search?q=hello world&lang=en 这样的 URL 会让网络服务器困惑，因为空格和 & 符号都是具有结构意义的字符。编码后变成 https://example.com/search?q=hello%20world&lang=en，含义就清楚了。",
    ],
    articleTitle2: "百分号编码如何工作",
    article2: [
      "每个需要编码的字符，先转换为其 UTF-8 字节表示，然后将每个字节写为百分号加两个十六进制数字。",
      "ASCII 字符很简单：空格（ASCII 32，十六进制 20）变成 %20。@ 符号（ASCII 64，十六进制 40）变成 %40。斜线 /（ASCII 47，十六进制 2F）变成 %2F。",
      "非 ASCII 字符需要先用 UTF-8 编码。中文字「你」（U+4F60）的 UTF-8 编码是三个字节：E4 BD A0。百分号编码后变成 %E4%BD%A0。这就是为什么包含中文、阿拉伯文或带重音字符的 URL，在浏览器地址栏中显示为一长串百分号编码的原因。",
    ],
    articleTitle3: "常见编码字符对照表",
    article3: ["以下是 URL 中最常见的百分号编码字符。"],
    articleTitle4: "什么时候需要 URL 编码？",
    article4: [
      "每当特殊字符出现在可能被误解的地方，就需要 URL 编码。",
      "搜索查询参数：Google 会将你的搜索词编码，如搜索「hello world」变成 ?q=hello+world 或 ?q=hello%20world。",
      "HTML 表单提交：浏览器在发送前将输入数据编码。",
      "带特殊字符的 API 请求：如果 API 参数值中含有 & 符号、等号或斜线，必须编码。",
      "URL 中的非 ASCII 内容：分享含中文或阿拉伯文标题的链接需要编码非 ASCII 字符。",
      "带预填主题的邮件链接：mailto 链接需要编码才能让邮件客户端正确解析。",
    ],
    articleTitle5: "URL 编码 vs Base64 编码",
    article5: [
      "URL 编码和 Base64 编码都是用文本表示数据的方式，但用途完全不同。",
      "URL 编码是为了让文本可以安全地放在 URL 中。ASCII 字符仍然可读，只转换在 URL 中有问题的字符。",
      "Base64 编码将任意二进制数据（包括图像、文件、二进制协议）转换为 64 个安全 ASCII 字符的字符串。它会使数据大小增加约 33%，不解码完全不可读。",
    ],
    faqTitle: "常见问题",
    faq: [
      { q: "URL 中的 %20 和 + 号有什么区别？", a: "两者都代表空格，但使用场景不同。%20 是严格的百分号编码，在 URL 任何位置都有效。+ 号仅在查询字符串中代表空格（根据 application/x-www-form-urlencoded 格式）。在 URL 路径中，+ 就是加号，不是空格。" },
      { q: "为什么 URL 中有时会出现 %E4%B8%AD 而不是实际的中文字？", a: "中文字「中」（U+4E2D）的 UTF-8 编码是字节 E4 B8 AD。每个字节百分号编码后就是 %E4%B8%AD。现代浏览器在地址栏中显示解码后的字符，但发送给服务器和存储在链接中的实际 URL 是百分号编码版本。" },
      { q: "URL 编码和 HTML 实体编码是一回事吗？", a: "不是。HTML 实体编码用 &amp; 表示 &，用 &lt; 表示 <，用于防止字符被当做 HTML 标记解析。URL 编码是完全独立的系统，用于让字符在 URL 中安全使用。" },
      { q: "我可以用这个工具解码浏览器地址栏中的 URL 吗？", a: "可以。将编码后的 URL 粘贴到输入框中，解码版本会立即显示。这个功能对于阅读搜索查询、理解重定向网址或检查包含编码参数的 API 端点很有用。" },
      { q: "哪些字符是「安全」的，不需要编码？", a: "RFC 3986 定义的非保留字符包括：大小写字母 A-Z 和 a-z、数字 0-9、连字符（-）、下划线（_）、句号（.）和波浪号（~）。这些字符永远不需要百分号编码。其他所有字符，包括有特殊结构意义的（/、?、#、&、=）和所有非 ASCII 字符，在用作数据值时都需要编码。" },
    ],
  },
  es: {
    name: "Español",
    title: "Codificador / decodificador de URL",
    subtitle: "Codifica o decodifica URLs al instante con una herramienta simple.",
    searchLabel: "Buscar herramientas",
    searchPlaceholder: "Prueba: weight, day, invoice, word",
    searchHint: "Sugerencias de búsqueda",
    reserveAd: "Espacio reservado para Google Ads",
    reserveAdSub: "之後可直接放 AdSense 程式碼。",
adLabel: "Advertisement",
adBadge: "Reserved",

    inputLabel: "Entrada",
    encodedLabel: "Codificado",
    decodedLabel: "Decodificado",
    sidebarTitle: "Uso rápido",
    sidebarSub: "Para enlaces, cadenas de consulta y parámetros.",
    sidebarItem1: "Pega una URL sin codificar para codificarla.",
    sidebarItem2: "Pega texto codificado para decodificarlo.",
    articleTitle1: "¿Qué es la codificación de URL?",
    article1: [
      "Las URLs solo pueden contener de forma segura un subconjunto limitado de caracteres ASCII. Letras (A-Z, a-z), dígitos (0-9) y algunos símbolos no reservados como guiones, guiones bajos, puntos y tildes se pueden usar tal cual. Todo lo demás — espacios, ampersands, signos de igual, almohadillas, caracteres no ASCII como chino o árabe, y muchos signos de puntuación — deben transformarse antes de aparecer en una URL.",
      "Esta transformación se llama codificación porcentual (comúnmente llamada codificación de URL), definida en RFC 3986. El estándar divide los caracteres de URL en reservados (con significado especial como / y ?) y no reservados (seguros en cualquier lugar). Los caracteres reservados deben codificarse cuando se usan fuera de su función estructural.",
      "Sin codificación de URL, una URL como https://example.com/search?q=hello world&lang=en sería ambigua para un servidor web. Codificada se convierte en https://example.com/search?q=hello%20world&lang=en, que no es ambigua.",
    ],
    articleTitle2: "Cómo funciona la codificación porcentual",
    article2: [
      "Cada carácter que necesita codificación se convierte primero a su representación de bytes en UTF-8. Luego cada byte se escribe como un signo de porcentaje seguido de dos dígitos hexadecimales.",
      "Para caracteres ASCII: espacio (ASCII 32, hex 20) se convierte en %20. El arroba @ (ASCII 64, hex 40) se convierte en %40. Una barra diagonal / (ASCII 47, hex 2F) se convierte en %2F.",
      "Para caracteres no ASCII: el carácter chino U+4F60 se codifica en UTF-8 como tres bytes: E4 BD A0, resultando en %E4%BD%A0. Por eso las URLs con chino, árabe o caracteres acentuados aparecen como largas cadenas codificadas.",
    ],
    articleTitle3: "Referencia de caracteres codificados comunes",
    article3: ["Estos son los caracteres codificados porcentualmente más frecuentes en las URLs."],
    articleTitle4: "¿Cuándo necesitas codificación de URL?",
    article4: [
      "La codificación de URL es necesaria cuando caracteres especiales aparecen donde serían malinterpretados.",
      "Parámetros de búsqueda: Google codifica términos como hello world a ?q=hello+world o ?q=hello%20world.",
      "Envío de formularios HTML: los navegadores codifican los datos antes de enviarlos.",
      "Solicitudes API con caracteres especiales: ampersands, signos de igual o barras deben codificarse.",
      "Contenido no ASCII en URLs: compartir enlaces con títulos en chino o árabe requiere codificación.",
      "Enlaces de correo con asunto predefinido: los enlaces mailto requieren codificación.",
    ],
    articleTitle5: "Codificación URL vs Codificación Base64",
    article5: [
      "La codificación URL y Base64 son formas de representar datos como texto, pero con propósitos diferentes.",
      "La codificación URL hace que el texto sea seguro para usar en URLs. Sigue siendo legible para ASCII y solo transforma caracteres problemáticos.",
      "Base64 convierte datos binarios (imágenes, archivos, protocolos binarios) en una cadena de 64 caracteres ASCII seguros. Aumenta el tamaño ~33% y es ilegible sin decodificar.",
    ],
    faqTitle: "Preguntas frecuentes",
    faq: [
      { q: "¿Cuál es la diferencia entre %20 y + para espacios en URLs?", a: "Ambos representan un espacio. %20 es la codificación porcentual estricta, válida en cualquier parte de la URL. El signo + representa un espacio solo en cadenas de consulta (formato application/x-www-form-urlencoded). En rutas URL, + es un signo más literal." },
      { q: "¿Por qué una URL tiene %E4%B8%AD en lugar de caracteres chinos reales?", a: "El carácter chino (U+4E2D) se codifica en UTF-8 como bytes E4 B8 AD, dando %E4%B8%AD. Los navegadores modernos muestran los caracteres decodificados en la barra de direcciones, pero la URL subyacente usa codificación porcentual." },
      { q: "¿Es la codificación URL lo mismo que la codificación de entidades HTML?", a: "No. La codificación de entidades HTML usa &amp; para & o &lt; para <. Evita que los caracteres se interpreten como marcado HTML. La codificación URL es un sistema separado para hacer que los caracteres sean seguros dentro de las URLs." },
      { q: "¿Puedo usar esta herramienta para decodificar una URL de la barra de direcciones?", a: "Sí. Pega la URL codificada y la versión decodificada aparece inmediatamente. Útil para leer consultas de búsqueda, entender URLs de redirección o inspeccionar endpoints API con parámetros codificados." },
      { q: "¿Qué caracteres son seguros y no necesitan codificación?", a: "Caracteres no reservados según RFC 3986: letras A-Z y a-z, dígitos 0-9, guion, guion bajo, punto y tilde. Todos los demás caracteres, incluidos los estructurales (/, ?, #, &, =) y los no ASCII, deben codificarse cuando se usan como datos." },
    ],
  },
};

const TOOLS = [
  { title: { en: "Age Calculator", "zh-hk": "年齡計算機", "zh-cn": "年龄计算器", es: "Calculadora de edad" }, description: { en: "Calculate exact age.", "zh-hk": "計算準確年齡。", "zh-cn": "计算准确年龄。", es: "Calcula la edad exacta." }, href: "/age-calculator", keywords: ["age", "birthday"] },
  { title: { en: "Unit Converter", "zh-hk": "單位轉換器", "zh-cn": "单位转换器", es: "Conversor de unidades" }, description: { en: "Convert length, weight, temperature.", "zh-hk": "轉換長度、重量、溫度。", "zh-cn": "转换长度、重量、温度。", es: "Convierte longitud, peso, temperatura." }, href: "/unit-converter", keywords: ["convert", "unit"] },
  { title: { en: "Percentage Calculator", "zh-hk": "百分比計算機", "zh-cn": "百分比计算器", es: "Calculadora de porcentajes" }, description: { en: "Percentage of a number.", "zh-hk": "計算一個數嘅百分比。", "zh-cn": "计算一个数的百分比。", es: "Porcentaje de un número." }, href: "/percentage-calculator", keywords: ["percent", "ratio"] },
  { title: { en: "Date Difference Calculator", "zh-hk": "日期差計算機", "zh-cn": "日期差计算器", es: "Calculadora de diferencia de fechas" }, description: { en: "Days between two dates.", "zh-hk": "計算兩日期間嘅日數。", "zh-cn": "计算两日期间的天数。", es: "Días entre dos fechas." }, href: "/date-difference-calculator", keywords: ["date", "days"] },
  { title: { en: "Volumetric Weight Calculator", "zh-hk": "體積重量計算機", "zh-cn": "体积重量计算器", es: "Calculadora de peso volumétrico" }, description: { en: "Dimensional weight for parcels.", "zh-hk": "計算包裹體積重量。", "zh-cn": "计算包裹体积重量。", es: "Peso dimensional para paquetes." }, href: "/volumetric-weight-calculator", keywords: ["weight", "shipping"] },
  { title: { en: "Business Day Calculator", "zh-hk": "工作日計算機", "zh-cn": "工作日计算器", es: "Calculadora de días hábiles" }, description: { en: "Add working days to any date.", "zh-hk": "加工作日至任何日期。", "zh-cn": "加工作日到任何日期。", es: "Agrega días hábiles." }, href: "/business-day-calculator", keywords: ["calendar", "workday"] },
  { title: { en: "Currency Converter", "zh-hk": "貨幣轉換器", "zh-cn": "货币转换器", es: "Conversor de divisas" }, description: { en: "Convert between 30+ currencies.", "zh-hk": "轉換 30 種以上貨幣。", "zh-cn": "转换 30 种以上货币。", es: "Convierte 30+ monedas." }, href: "/currency-converter", keywords: ["currency", "exchange"] },
];

function SearchBox({ locale, value, onChange, onNavigate }: { locale: keyof typeof LANGUAGES; value: string; onChange: (value: string) => void; onNavigate: (href: string) => void; }) {
  const hints = locale === "zh-hk" ? ["體積重量", "工作日", "發票", "字數"] : locale === "zh-cn" ? ["体积重量", "工作日", "发票", "字数"] : locale === "es" ? ["weight", "day", "invoice", "word"] : ["weight", "day", "invoice", "word"];
  const filtered = TOOLS.filter((tool) => `${tool.title[locale]} ${tool.description[locale]} ${tool.keywords.join(" ")}`.toLowerCase().includes(value.trim().toLowerCase())).slice(0, 4);
  return (
    <section className="rounded-3xl border border-white/10 bg-black/20 p-4">
      <label className="block space-y-2">
        <span className="text-sm font-medium text-white/80">{LANGUAGES[locale].searchLabel}</span>
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
          <Search className="h-4 w-4 text-emerald-300" />
          <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={LANGUAGES[locale].searchPlaceholder} className="w-full bg-transparent text-sm text-white placeholder:text-white/35 outline-none" />
        </div>
      </label>
      <div className="mt-3 flex flex-wrap gap-2">{hints.map((hint) => <button key={hint} type="button" onClick={() => onChange(hint)} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 transition hover:bg-white/10">{hint}</button>)}</div>
      <div className="mt-4">
        <p className="mb-3 text-xs uppercase tracking-[0.2em] text-white/45">{LANGUAGES[locale].searchHint}</p>
        <div className="grid gap-2">{filtered.map((tool) => <button key={tool.href} type="button" onClick={() => onNavigate(tool.href)} className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left transition hover:border-emerald-300/30 hover:bg-white/10"><div><p className="text-sm font-medium text-white">{tool.title[locale]}</p><p className="mt-1 text-xs text-white/55">{tool.description[locale]}</p></div><ArrowRight className="h-4 w-4 shrink-0 text-white/35" /></button>)}</div>
      </div>
    </section>
  );
}

const SITE_URL = "https://www.tinytoolboxes.com";
const PAGE_PATH = "/url-encoder-decoder";

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

export default function UrlEncoderDecoder() {
  const [locale, setLocale] = useState<keyof typeof LANGUAGES>(() => (typeof window === "undefined" ? "en" : ((window.localStorage.getItem("ttb-locale") as keyof typeof LANGUAGES) || "en")));
  const [input, setInput] = useState("https://example.com/search?q=hello world&lang=en");
  const [search, setSearch] = useState("");

  useEffect(() => {
    document.documentElement.lang = locale === "zh-hk" ? "zh-Hant-HK" : locale === "zh-cn" ? "zh-Hans-CN" : locale;
    window.localStorage.setItem("ttb-locale", locale);
    const L = LANGUAGES[locale];
    applySEO({
      title: `${L.title} | TinyToolboxes`,
      description: L.subtitle,
      path: PAGE_PATH,
      jsonLd: [
        { "@context": "https://schema.org", "@type": "WebApplication", name: L.title, url: SITE_URL + PAGE_PATH, description: L.subtitle, applicationCategory: "DeveloperApplication", operatingSystem: "Web", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, publisher: { "@type": "Organization", name: "TinyToolboxes", url: SITE_URL } },
        { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: content.faq.map((item: {q: string; a: string}) => ({ "@type": "Question", name: item.q, acceptedAnswer: { "@type": "Answer", text: item.a } })) },
      ],
    });
  }, [locale]);

  const encoded = useMemo(() => { try { return encodeURIComponent(input); } catch { return ""; } }, [input]);
  const decoded = useMemo(() => { try { return decodeURIComponent(input); } catch { return "Invalid encoded text"; } }, [input]);
  const content = LANGUAGES[locale];
  const shownTools = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return TOOLS;
    return TOOLS.filter((tool) => `${tool.title[locale]} ${tool.description[locale]} ${tool.keywords.join(" ")}`.toLowerCase().includes(query));
  }, [search]);

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10 lg:px-8">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400/15 ring-1 ring-emerald-300/20"><Code2 className="h-5 w-5 text-emerald-300" /></div><div><p className="text-sm uppercase tracking-[0.3em] text-emerald-300/80">TinyToolboxes</p><h1 className="text-xl font-semibold">{content.title}</h1></div></div>
          <div className="flex flex-wrap gap-2">{(Object.keys(LANGUAGES) as Array<keyof typeof LANGUAGES>).map((key) => <button key={key} onClick={() => setLocale(key)} className={`rounded-full border px-3 py-2 text-sm transition ${locale === key ? "border-emerald-400/70 bg-emerald-400/15 text-emerald-200" : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"}`}>{LANGUAGES[key].name}</button>)}</div>
        </div>

        <div className="grid flex-1 gap-8 py-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <div className="space-y-8">
            <div className="max-w-3xl space-y-5"><div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-200"><BadgeDollarSign className="h-4 w-4" />{content.reserveAd}</div><div className="space-y-4"><h2 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">{content.title}</h2><p className="max-w-2xl text-base leading-7 text-white/70 sm:text-lg">{content.subtitle}</p></div></div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <label className="block space-y-2">
                <span className="text-sm text-neutral-300">{content.inputLabel}</span>
                <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={7} className="w-full rounded-3xl border border-white/10 bg-black/30 p-5 text-sm leading-6 text-white outline-none focus:border-emerald-400/60" />
              </label>
              <div className="mt-5 grid gap-4"><div className="rounded-2xl border border-white/10 bg-black/20 p-4"><p className="text-xs uppercase tracking-[0.2em] text-neutral-400">{content.encodedLabel}</p><p className="mt-2 break-words text-sm text-white">{encoded}</p></div><div className="rounded-2xl border border-white/10 bg-black/20 p-4"><p className="text-xs uppercase tracking-[0.2em] text-neutral-400">{content.decodedLabel}</p><p className="mt-2 break-words text-sm text-white">{decoded}</p></div></div>
            </div>

            <SearchBox locale={locale} value={search} onChange={setSearch} onNavigate={(href) => (window.location.href = href)} />

            <article className="space-y-8 rounded-3xl border border-white/10 bg-white/5 p-6 text-white/80 shadow-[0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur">
              <div>
                <h2 className="text-2xl font-bold text-white">{content.articleTitle1}</h2>
                {content.article1.map((p: string, i: number) => (
                  <p key={i} className="mt-3 leading-7">{p}</p>
                ))}
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">{content.articleTitle2}</h2>
                {content.article2.map((p: string, i: number) => (
                  <p key={i} className="mt-3 leading-7">{p}</p>
                ))}
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">{content.articleTitle3}</h2>
                <p className="mt-3 leading-7">{content.article3[0]}</p>
                <div className="mt-3 overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="py-2 pr-4 text-left font-semibold text-white">Character</th>
                        <th className="py-2 pr-4 text-left font-semibold text-white">Encoded</th>
                        <th className="py-2 text-left font-semibold text-white">Character</th>
                        <th className="py-2 text-left font-semibold text-white">Encoded</th>
                      </tr>
                    </thead>
                    <tbody className="font-mono text-white/70">
                      <tr className="border-b border-white/5"><td className="py-2 pr-4">space</td><td className="py-2 pr-4 text-emerald-200">%20</td><td className="py-2 pr-4">*</td><td className="py-2 text-emerald-200">%2A</td></tr>
                      <tr className="border-b border-white/5"><td className="py-2 pr-4">!</td><td className="py-2 pr-4 text-emerald-200">%21</td><td className="py-2 pr-4">+</td><td className="py-2 text-emerald-200">%2B</td></tr>
                      <tr className="border-b border-white/5"><td className="py-2 pr-4">#</td><td className="py-2 pr-4 text-emerald-200">%23</td><td className="py-2 pr-4">,</td><td className="py-2 text-emerald-200">%2C</td></tr>
                      <tr className="border-b border-white/5"><td className="py-2 pr-4">$</td><td className="py-2 pr-4 text-emerald-200">%24</td><td className="py-2 pr-4">/</td><td className="py-2 text-emerald-200">%2F</td></tr>
                      <tr className="border-b border-white/5"><td className="py-2 pr-4">&amp;</td><td className="py-2 pr-4 text-emerald-200">%26</td><td className="py-2 pr-4">:</td><td className="py-2 text-emerald-200">%3A</td></tr>
                      <tr className="border-b border-white/5"><td className="py-2 pr-4">'</td><td className="py-2 pr-4 text-emerald-200">%27</td><td className="py-2 pr-4">;</td><td className="py-2 text-emerald-200">%3B</td></tr>
                      <tr className="border-b border-white/5"><td className="py-2 pr-4">(</td><td className="py-2 pr-4 text-emerald-200">%28</td><td className="py-2 pr-4">=</td><td className="py-2 text-emerald-200">%3D</td></tr>
                      <tr className="border-b border-white/5"><td className="py-2 pr-4">)</td><td className="py-2 pr-4 text-emerald-200">%29</td><td className="py-2 pr-4">?</td><td className="py-2 text-emerald-200">%3F</td></tr>
                      <tr className="border-b border-white/5"><td className="py-2 pr-4">@</td><td className="py-2 pr-4 text-emerald-200">%40</td><td className="py-2 pr-4">[</td><td className="py-2 text-emerald-200">%5B</td></tr>
                      <tr><td className="py-2 pr-4">]</td><td className="py-2 pr-4 text-emerald-200">%5D</td><td className="py-2 pr-4"></td><td className="py-2"></td></tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">{content.articleTitle4}</h2>
                <p className="mt-3 leading-7">{content.article4[0]}</p>
                <ul className="mt-3 space-y-2 text-white/70">
                  {content.article4.slice(1).map((p: string, i: number) => (
                    <li key={i} className="flex gap-2"><span className="text-emerald-300 shrink-0">→</span><span>{p}</span></li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">{content.articleTitle5}</h2>
                <p className="mt-3 leading-7">{content.article5[0]}</p>
                {content.article5.slice(1).map((p: string, i: number) => (
                  <p key={i} className="mt-3 leading-7">{p}</p>
                ))}
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">{content.faqTitle}</h2>
                <div className="mt-4 space-y-5">
                  {content.faq.map((item: { q: string; a: string }, i: number) => (
                    <div key={i}>
                      <h3 className="font-semibold text-white">{item.q}</h3>
                      <p className="mt-1 text-white/70">{item.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            </article>

            <section className="rounded-3xl border border-dashed border-white/15 bg-white/5 p-5"><div className="flex items-center justify-between gap-4"><div><p className="text-sm uppercase tracking-[0.28em] text-emerald-300/80">{content.adLabel}</p><p className="mt-1 text-sm text-white/55">AdSense space reserved</p></div><span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-white/35">{content.adBadge}</span></div><div className="mt-4 min-h-[120px] rounded-2xl border border-white/10 bg-black/20" /></section>
          </div>

          <aside className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-5"><div className="flex items-center gap-3"><div className="rounded-2xl bg-white/10 p-3 text-white"><Link2 className="h-5 w-5" /></div><div><h2 className="text-lg font-semibold">{content.sidebarTitle}</h2><p className="text-sm text-neutral-300">{content.sidebarSub}</p></div></div><div className="space-y-3 text-sm text-neutral-300"><p className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">{content.sidebarItem1}</p><p className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">{content.sidebarItem2}</p></div></aside>
        </div>
      </section>
    </main>
  );
}

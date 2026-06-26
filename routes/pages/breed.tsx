import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft, Heart, Activity, Ruler, Weight, Dog, Cat,
  AlertCircle, Search, ChevronRight, Sparkles, Loader2
} from "lucide-react";

interface BreedData {
  type: "dog" | "cat";
  names: Record<string, string>;
  life_expectancy: string;
  weight_male: { min: number; max: number };
  weight_female: { min: number; max: number };
  height: { min: number; max: number };
  energy: number;
  grooming: number;
  trainability: number;
  barking: number;
  apartment: number;
  first_time: number;
  hypoallergenic: boolean;
  shedding: number;
  health_issues: { name: string; calculator: string | null }[];
  overview: string | Record<string, string>;
}

type BreedsMap = Record<string, BreedData>;

const SITE_URL = "https://pets.tinytoolboxes.com";

const UI: Record<string, Record<string, any>> = {
  en: {
    backToBreeds: "← All Breeds", dog: "Dog", cat: "Cat",
    lifeExpectancy: "Life Expectancy", years: "yrs", male: "Male", female: "Female",
    weight: "Weight", height: "Height", cm: "cm", kg: "kg",
    energy: "Energy Level", grooming: "Grooming", trainability: "Trainability",
    barking: "Barking", apartment: "Apartment", firstTime: "First-Time Owner",
    shedding: "Shedding", hypoallergenic: "Hypoallergenic", yes: "Yes", no: "No",
    healthIssues: "Common Health Issues", overview: "Breed Overview",
    relatedBreeds: "More Breeds", traits: "Traits & Ratings", quickStats: "Quick Stats",
    loading: "Loading…", notFound: "Breed Not Found",
    notFoundDesc: "Check the URL or browse all breeds.", browseAll: "Browse All Breeds",
    searchPlaceholder: "Search breeds…", relatedCalculator: "(Related Calculator)",
    ratingLabels: ["Very Low","Low","Moderate","High","Very High"],
  },
  "zh-hk": {
    backToBreeds: "← 所有品種", dog: "狗", cat: "貓",
    lifeExpectancy: "壽命", years: "年", male: "雄性", female: "雌性",
    weight: "體重", height: "身高", cm: "厘米", kg: "公斤",
    energy: "精力水平", grooming: "美容需求", trainability: "可訓練性",
    barking: "吠叫傾向", apartment: "適合公寓", firstTime: "適合新手",
    shedding: "脫毛程度", hypoallergenic: "低過敏性", yes: "是", no: "否",
    healthIssues: "常見健康問題", overview: "品種概述",
    relatedBreeds: "更多品種", traits: "特質與評分", quickStats: "快速統計",
    loading: "載入中…", notFound: "找不到品種",
    notFoundDesc: "請檢查網址或瀏覽所有品種。", browseAll: "瀏覽所有品種",
    searchPlaceholder: "搜尋品種…", relatedCalculator: "（相關計算器）",
    ratingLabels: ["非常低","低","中等","高","非常高"],
  },
  "zh-cn": {
    backToBreeds: "← 所有品种", dog: "狗", cat: "猫",
    lifeExpectancy: "寿命", years: "年", male: "雄性", female: "雌性",
    weight: "体重", height: "身高", cm: "厘米", kg: "公斤",
    energy: "精力水平", grooming: "美容需求", trainability: "可训练性",
    barking: "吠叫倾向", apartment: "适合公寓", firstTime: "适合新手",
    shedding: "脱毛程度", hypoallergenic: "低过敏性", yes: "是", no: "否",
    healthIssues: "常见健康问题", overview: "品种概述",
    relatedBreeds: "更多品种", traits: "特质与评分", quickStats: "快速统计",
    loading: "加载中…", notFound: "找不到品种",
    notFoundDesc: "请检查网址或浏览所有品种。", browseAll: "浏览所有品种",
    searchPlaceholder: "搜索品种…", relatedCalculator: "（相关计算器）",
    ratingLabels: ["非常低","低","中等","高","非常高"],
  },
  ja: {
    backToBreeds: "← 全品種", dog: "犬", cat: "猫",
    lifeExpectancy: "平均寿命", years: "年", male: "オス", female: "メス",
    weight: "体重", height: "体高", cm: "cm", kg: "kg",
    energy: "エネルギーレベル", grooming: "グルーミング", trainability: "訓練性",
    barking: "吠える傾向", apartment: "アパート適性", firstTime: "初心者向け",
    shedding: "抜け毛", hypoallergenic: "低アレルゲン", yes: "はい", no: "いいえ",
    healthIssues: "よくある健康問題", overview: "品種概要",
    relatedBreeds: "他の品種", traits: "特性と評価", quickStats: "基本情報",
    loading: "読み込み中…", notFound: "品種が見つかりません",
    notFoundDesc: "URLを確認するか、全品種を閲覧してください。", browseAll: "全品種を見る",
    searchPlaceholder: "品種を検索…", relatedCalculator: "（関連計算機）",
    ratingLabels: ["非常に低い","低い","中程度","高い","非常に高い"],
  },
  es: {
    backToBreeds: "← Todas las Razas", dog: "Perro", cat: "Gato",
    lifeExpectancy: "Esperanza de Vida", years: "años", male: "Macho", female: "Hembra",
    weight: "Peso", height: "Altura", cm: "cm", kg: "kg",
    energy: "Energía", grooming: "Aseo", trainability: "Adiestramiento",
    barking: "Ladrido", apartment: "Apartamento", firstTime: "Principiante",
    shedding: "Muda", hypoallergenic: "Hipoalergénico", yes: "Sí", no: "No",
    healthIssues: "Salud Común", overview: "Descripción",
    relatedBreeds: "Más Razas", traits: "Rasgos", quickStats: "Datos Rápidos",
    loading: "Cargando…", notFound: "Raza no encontrada",
    notFoundDesc: "Verifica la URL o explora todas las razas.", browseAll: "Ver Todas",
    searchPlaceholder: "Buscar razas…", relatedCalculator: "(Calculadora relacionada)",
    ratingLabels: ["Muy Bajo","Bajo","Moderado","Alto","Muy Alto"],
  },
};

// Translations for standardised health condition names
const HEALTH: Record<string, Record<string, string>> = {
  "Addison's Disease":{"zh-hk":"愛迪生氏病","zh-cn":"艾迪生病","ja":"アジソン病","es":"Enfermedad de Addison"},
  "Allergies":{"zh-hk":"過敏症","zh-cn":"过敏症","ja":"アレルギー","es":"Alergias"},
  "Alopecia X (Black Skin Disease)":{"zh-hk":"脫毛症X（黑皮病）","zh-cn":"脱毛症X（黑皮病）","ja":"無毛症X（黒色皮膚病）","es":"Alopecia X"},
  "Amyloidosis":{"zh-hk":"澱粉樣變性","zh-cn":"淀粉样变性","ja":"アミロイドーシス","es":"Amiloidosis"},
  "Aortic Stenosis":{"zh-hk":"主動脈狹窄","zh-cn":"主动脉狭窄","ja":"大動脈狭窄症","es":"Estenosis Aórtica"},
  "Asthma":{"zh-hk":"哮喘","zh-cn":"哮喘","ja":"喘息","es":"Asma"},
  "Atopic Dermatitis":{"zh-hk":"異位性皮膚炎","zh-cn":"特应性皮炎","ja":"アトピー性皮膚炎","es":"Dermatitis Atópica"},
  "Bladder Stones":{"zh-hk":"膀胱結石","zh-cn":"膀胱结石","ja":"膀胱結石","es":"Cálculos Vesicales"},
  "Bloat (Gastric Dilatation-Volvulus)":{"zh-hk":"胃擴張扭轉症","zh-cn":"胃扩张扭转症","ja":"胃拡張捻転症","es":"Torsión Gástrica (GDV)"},
  "Boxer Cardiomyopathy":{"zh-hk":"拳師犬心肌病","zh-cn":"拳师犬心肌病","ja":"ボクサー心筋症","es":"Cardiomiopatía del Bóxer"},
  "Brachycephalic Airway Syndrome":{"zh-hk":"短頭顱氣道症候群","zh-cn":"短头颅气道综合征","ja":"短頭種気道症候群","es":"Síndrome Braquicefálico"},
  "Cancer (Hemangiosarcoma)":{"zh-hk":"血管肉瘤","zh-cn":"血管肉瘤","ja":"血管肉腫","es":"Cáncer (Hemangiosarcoma)"},
  "Cancer (Mast Cell Tumors)":{"zh-hk":"肥大細胞腫瘤","zh-cn":"肥大细胞肿瘤","ja":"マスト細胞腫","es":"Tumores de Mastocitos"},
  "Cardiomyopathy":{"zh-hk":"心肌病","zh-cn":"心肌病","ja":"心筋症","es":"Cardiomiopatía"},
  "Cataracts":{"zh-hk":"白內障","zh-cn":"白内障","ja":"白内障","es":"Cataratas"},
  "Cherry Eye":{"zh-hk":"第三眼瞼脫出","zh-cn":"第三眼睑脱出（樱桃眼）","ja":"チェリーアイ","es":"Ojo de Cereza"},
  "Collie Eye Anomaly":{"zh-hk":"牧羊犬眼部異常","zh-cn":"柯利犬眼部异常","ja":"コリー眼異常","es":"Anomalía Ocular del Collie"},
  "Corneal Dystrophy":{"zh-hk":"角膜營養不良","zh-cn":"角膜营养不良","ja":"角膜ジストロフィー","es":"Distrofia Corneal"},
  "Corneal Ulcers":{"zh-hk":"角膜潰瘍","zh-cn":"角膜溃疡","ja":"角膜潰瘍","es":"Úlceras Corneales"},
  "Craniofacial Defect":{"zh-hk":"顱面部缺陷","zh-cn":"颅面部缺陷","ja":"頭蓋顔面欠陥","es":"Defecto Craneofacial"},
  "Craniomandibular Osteopathy":{"zh-hk":"顱頜骨病","zh-cn":"颅下颌骨病","ja":"頭蓋下顎骨症","es":"Osteopatía Craneomandibular"},
  "Deafness":{"zh-hk":"耳聾","zh-cn":"耳聋","ja":"難聴","es":"Sordera"},
  "Degenerative Myelopathy":{"zh-hk":"退行性脊髓病","zh-cn":"退行性脊髓病","ja":"変性性脊髄症","es":"Mielopatía Degenerativa"},
  "Dental Disease":{"zh-hk":"牙科疾病","zh-cn":"牙科疾病","ja":"歯科疾患","es":"Enfermedad Dental"},
  "Dental Malocclusion":{"zh-hk":"牙齒咬合不正","zh-cn":"牙齿咬合不正","ja":"不正咬合","es":"Maloclusión Dental"},
  "Dermatomyositis":{"zh-hk":"皮肌炎","zh-cn":"皮肌炎","ja":"皮膚筋炎","es":"Dermatomiositis"},
  "Diabetes Mellitus":{"zh-hk":"糖尿病","zh-cn":"糖尿病","ja":"糖尿病","es":"Diabetes Mellitus"},
  "Dilated Cardiomyopathy":{"zh-hk":"擴張型心肌病","zh-cn":"扩张型心肌病","ja":"拡張型心筋症","es":"Cardiomiopatía Dilatada"},
  "Dry Eye (Keratoconjunctivitis Sicca)":{"zh-hk":"乾眼症","zh-cn":"干眼症","ja":"乾性角結膜炎","es":"Ojo Seco"},
  "Ear Infections":{"zh-hk":"耳部感染","zh-cn":"耳部感染","ja":"耳の感染症","es":"Infecciones de Oído"},
  "Elbow Dysplasia":{"zh-hk":"肘關節發育不良","zh-cn":"肘关节发育不良","ja":"肘関節形成不全","es":"Displasia de Codo"},
  "Epilepsy":{"zh-hk":"癲癇","zh-cn":"癫痫","ja":"てんかん","es":"Epilepsia"},
  "Exercise-Induced Collapse":{"zh-hk":"運動誘發性虛脫","zh-cn":"运动诱发性虚脱","ja":"運動誘発性虚脱","es":"Colapso por Ejercicio"},
  "Exocrine Pancreatic Insufficiency":{"zh-hk":"胰外分泌不足","zh-cn":"胰腺外分泌不足","ja":"膵外分泌不全","es":"Insuficiencia Pancreática Exocrina"},
  "Eye Disorders":{"zh-hk":"眼部疾病","zh-cn":"眼部疾病","ja":"眼疾患","es":"Trastornos Oculares"},
  "Flat-Chested Kitten Syndrome":{"zh-hk":"扁胸幼貓症候群","zh-cn":"扁胸幼猫综合征","ja":"平胸子猫症候群","es":"Síndrome de Pecho Plano en Gatitos"},
  "Gastric Dilatation-Volvulus (Bloat)":{"zh-hk":"胃擴張扭轉症","zh-cn":"胃扩张扭转症","ja":"胃拡張捻転症","es":"Dilatación Gástrica-Vólvulo"},
  "Gastric Dilatation-Volvulus (Standard)":{"zh-hk":"胃擴張扭轉症","zh-cn":"胃扩张扭转症","ja":"胃拡張捻転症","es":"Dilatación Gástrica-Vólvulo"},
  "Gingivitis":{"zh-hk":"牙齦炎","zh-cn":"牙龈炎","ja":"歯肉炎","es":"Gingivitis"},
  "Glycogen Storage Disease IV":{"zh-hk":"醣原貯積病IV型","zh-cn":"糖原贮积病IV型","ja":"グリコーゲン蓄積症IV型","es":"Enfermedad de Almacenamiento de Glucógeno IV"},
  "Heat/Cold Sensitivity":{"zh-hk":"冷熱敏感","zh-cn":"冷热敏感","ja":"暑さ・寒さへの敏感性","es":"Sensibilidad al Calor/Frío"},
  "Hereditary Myopathy":{"zh-hk":"遺傳性肌病","zh-cn":"遗传性肌病","ja":"遺伝性筋疾患","es":"Miopatía Hereditaria"},
  "Hip Dysplasia":{"zh-hk":"髖關節發育不良","zh-cn":"髋关节发育不良","ja":"股関節形成不全","es":"Displasia de Cadera"},
  "Histiocytic Sarcoma":{"zh-hk":"組織細胞肉瘤","zh-cn":"组织细胞肉瘤","ja":"組織球性肉腫","es":"Sarcoma Histiocítico"},
  "Hydrocephalus":{"zh-hk":"腦積水","zh-cn":"脑积水","ja":"水頭症","es":"Hidrocefalia"},
  "Hyperlipidemia":{"zh-hk":"高血脂症","zh-cn":"高脂血症","ja":"高脂血症","es":"Hiperlipidemia"},
  "Hypertrophic Cardiomyopathy":{"zh-hk":"肥厚型心肌病","zh-cn":"肥厚型心肌病","ja":"肥大型心筋症","es":"Cardiomiopatía Hipertrófica"},
  "Hypoglycemia":{"zh-hk":"低血糖","zh-cn":"低血糖","ja":"低血糖症","es":"Hipoglucemia"},
  "Hypokalemic Polymyopathy":{"zh-hk":"低鉀性多發性肌病","zh-cn":"低钾性多发性肌病","ja":"低カリウム性多発筋症","es":"Polimiopatía Hipocalémica"},
  "Hypothyroidism":{"zh-hk":"甲狀腺功能減退症","zh-cn":"甲状腺功能减退症","ja":"甲状腺機能低下症","es":"Hipotiroidismo"},
  "Intervertebral Disc Disease":{"zh-hk":"椎間盤疾病","zh-cn":"椎间盘疾病","ja":"椎間板疾患","es":"Enfermedad del Disco Intervertebral"},
  "Legg-Calvé-Perthes Disease":{"zh-hk":"股骨頭缺血性壞死","zh-cn":"股骨头缺血性坏死","ja":"レッグ・カルベ・ペルテス病","es":"Enfermedad de Legg-Calvé-Perthes"},
  "Mitral Valve Disease":{"zh-hk":"二尖瓣疾病","zh-cn":"二尖瓣疾病","ja":"僧帽弁疾患","es":"Enfermedad de la Válvula Mitral"},
  "Multi-Drug Sensitivity (MDR1)":{"zh-hk":"多藥敏感性（MDR1）","zh-cn":"多药敏感性（MDR1）","ja":"多剤感受性（MDR1）","es":"Sensibilidad a Múltiples Fármacos (MDR1)"},
  "Myotonia Congenita":{"zh-hk":"先天性肌強直","zh-cn":"先天性肌强直","ja":"先天性筋強直症","es":"Miotonía Congénita"},
  "Obesity":{"zh-hk":"肥胖症","zh-cn":"肥胖症","ja":"肥満","es":"Obesidad"},
  "Osteochondrodysplasia":{"zh-hk":"骨軟骨發育不良","zh-cn":"骨软骨发育不良","ja":"骨軟骨異形成症","es":"Osteocondroplasia"},
  "Osteosarcoma":{"zh-hk":"骨肉瘤","zh-cn":"骨肉瘤","ja":"骨肉腫","es":"Osteosarcoma"},
  "Pancreatitis":{"zh-hk":"胰腺炎","zh-cn":"胰腺炎","ja":"膵炎","es":"Pancreatitis"},
  "Patellar Luxation":{"zh-hk":"髕骨脫臼","zh-cn":"髌骨脱臼","ja":"膝蓋骨脱臼","es":"Luxación Patelar"},
  "Periodontal Disease":{"zh-hk":"牙周病","zh-cn":"牙周病","ja":"歯周病","es":"Enfermedad Periodontal"},
  "Polycystic Kidney Disease":{"zh-hk":"多囊腎病","zh-cn":"多囊肾病","ja":"多発性嚢胞腎","es":"Enfermedad Renal Poliquística"},
  "Portosystemic Shunt":{"zh-hk":"門脈分流","zh-cn":"门脉分流","ja":"門脈体循環シャント","es":"Derivación Portosistémica"},
  "Progressive Retinal Atrophy":{"zh-hk":"進行性視網膜萎縮","zh-cn":"进行性视网膜萎缩","ja":"進行性網膜萎縮症","es":"Atrofia Progresiva de Retina"},
  "Pug Dog Encephalitis":{"zh-hk":"八哥犬腦炎","zh-cn":"巴哥犬脑炎","ja":"パグ脳炎","es":"Encefalitis del Pug"},
  "Pyruvate Kinase Deficiency":{"zh-hk":"丙酮酸激酶缺乏症","zh-cn":"丙酮酸激酶缺乏症","ja":"ピルビン酸キナーゼ欠損症","es":"Deficiencia de Piruvato Quinasa"},
  "Renal Amyloidosis":{"zh-hk":"腎澱粉樣變性","zh-cn":"肾淀粉样变性","ja":"腎アミロイドーシス","es":"Amiloidosis Renal"},
  "Sebaceous Adenitis":{"zh-hk":"皮脂腺炎","zh-cn":"皮脂腺炎","ja":"皮脂腺炎","es":"Adenitis Sebácea"},
  "Skin Conditions":{"zh-hk":"皮膚問題","zh-cn":"皮肤问题","ja":"皮膚疾患","es":"Problemas de Piel"},
  "Skin Conditions (Urticaria Pigmentosa)":{"zh-hk":"色素性蕁麻疹","zh-cn":"色素性荨麻疹","ja":"色素性蕁麻疹","es":"Urticaria Pigmentosa"},
  "Skin Fold Dermatitis":{"zh-hk":"皮膚皺褶皮炎","zh-cn":"皮肤皱褶皮炎","ja":"皮膚皺襞皮膚炎","es":"Dermatitis en Pliegues de Piel"},
  "Spinal Muscular Atrophy":{"zh-hk":"脊髓性肌萎縮症","zh-cn":"脊髓性肌萎缩症","ja":"脊髄性筋萎縮症","es":"Atrofia Muscular Espinal"},
  "Strabismus (Crossed Eyes)":{"zh-hk":"斜視","zh-cn":"斜视","ja":"斜視","es":"Estrabismo"},
  "Syringomyelia":{"zh-hk":"脊髓空洞症","zh-cn":"脊髓空洞症","ja":"脊髄空洞症","es":"Siringomielia"},
  "Tracheal Collapse":{"zh-hk":"氣管塌陷","zh-cn":"气管塌陷","ja":"気管虚脱","es":"Colapso Traqueal"},
  "Von Willebrand Disease":{"zh-hk":"馮威里柏蘭氏病","zh-cn":"冯·威勒布兰德病","ja":"フォン・ウィルブランド病","es":"Enfermedad de Von Willebrand"},
  "White Dog Shaker Syndrome":{"zh-hk":"白狗震顫症候群","zh-cn":"白狗震颤综合征","ja":"白色犬シェーカー症候群","es":"Síndrome del Temblor en Perros Blancos"},
  "Wobbler Syndrome":{"zh-hk":"頸椎脊髓病","zh-cn":"颈椎脊髓病","ja":"ウォブラー症候群","es":"Síndrome de Wobbler"},
  "Zinc-Responsive Dermatosis":{"zh-hk":"鋅反應性皮膚病","zh-cn":"锌反应性皮肤病","ja":"亜鉛反応性皮膚症","es":"Dermatosis Responsiva al Zinc"},
};

const RC: Record<number, string> = { 1:"bg-red-400/60",2:"bg-orange-400/60",3:"bg-yellow-400/60",4:"bg-lime-400/60",5:"bg-emerald-400/60" };

function RatingBar({ v, label, t }: { v: number; label: string; t: any }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-sm"><span className="text-white/70">{label}</span><span className="text-white/40 text-xs">{t.ratingLabels[v-1]}</span></div>
      <div className="flex gap-1">{[1,2,3,4,5].map(n=><div key={n} className={`h-2 flex-1 rounded-full ${n<=v?RC[v]:"bg-white/10"}`}/>)}</div>
    </div>
  );
}

function StatCard({ icon: I, label, value, unit }: { icon: any; label: string; value: string; unit?: string }) {
  return <div className="rounded-2xl border border-white/10 bg-white/5 p-4 flex items-start gap-3">
    <div className="rounded-xl bg-emerald-400/10 p-2"><I className="h-4 w-4 text-emerald-300"/></div>
    <div><p className="text-[10px] text-white/40 uppercase tracking-wider">{label}</p><p className="text-lg font-semibold text-white">{value}{unit&&<span className="text-sm font-normal text-white/50"> {unit}</span>}</p></div>
  </div>;
}

export default function BreedPage() {
  const { slug } = useParams<{ slug: string }>();
  const [breeds, setBreeds] = useState<BreedsMap | null>(null);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState<string>(() => {
    if (typeof window === "undefined") return "en";
    return window.localStorage.getItem("ttb-locale") || "en";
  });
  const [search, setSearch] = useState("");

  useEffect(() => { window.localStorage.setItem("ttb-locale", lang); }, [lang]);

  useEffect(() => {
    fetch("/breeds-data.json").then(r=>r.json()).then((d:BreedsMap)=>{setBreeds(d);setLoading(false)}).catch(()=>setLoading(false));
  }, []);

  useEffect(() => {
    if (!breeds||!slug) return;
    const breed = breeds[slug];
    if (!breed) return;
    const name = breed.names[lang] || breed.names.en;
    document.title = `${name} — Breed Guide | TinyToolboxes Pets`;
    const desc = `Complete breed guide for ${name}: life expectancy, weight, height, temperament, health, and more.`;
    const url = `${SITE_URL}/breed/${slug}`;
    const setM = (s:string,a:string,v:string)=>{let e=document.head.querySelector(s) as HTMLElement|null;if(!e&&s.includes("meta[")){e=document.createElement("meta");const m=s.match(/meta\[(.*?)=/);if(m)e.setAttribute(m[1],"");}else if(!e&&s.includes("link[")){e=document.createElement("link");e.setAttribute("rel","canonical");}if(e){e.setAttribute(a,v);if(!document.head.contains(e))document.head.appendChild(e);}};
    setM('meta[name="description"]',"content",desc);
    setM('meta[property="og:title"]',"content",name);
    setM('meta[property="og:description"]',"content",desc);
    setM('meta[property="og:url"]',"content",url);
    setM('meta[name="twitter:title"]',"content",name);
    setM('meta[name="twitter:description"]',"content",desc);
    setM('link[rel="canonical"]',"href",url);
    document.head.querySelectorAll('script[data-ttb-breed]').forEach(n=>n.remove());
    const ld=document.createElement("script");ld.setAttribute("type","application/ld+json");ld.setAttribute("data-ttb-breed","");
    ld.textContent=JSON.stringify({"@context":"https://schema.org","@type":"Article",headline:`${name} Breed Guide`,description:desc,url,publisher:{"@type":"Organization",name:"TinyToolboxes",url:SITE_URL}});
    document.head.appendChild(ld);
  }, [breeds,slug,lang]);

  if (loading) return <main className="min-h-screen bg-neutral-950 flex items-center justify-center"><Loader2 className="h-5 w-5 animate-spin text-white/50"/></main>;
  if (!breeds||!slug||!breeds[slug]) {
    const t = UI[lang]||UI.en;
    return <main className="min-h-screen bg-neutral-950 text-neutral-50 flex items-center justify-center"><div className="text-center px-6"><AlertCircle className="h-16 w-16 mx-auto text-white/20 mb-4"/><h1 className="text-3xl font-bold mb-2">{t.notFound}</h1><p className="text-white/40 mb-8">{t.notFoundDesc}</p><a href="/breeds" className="inline-flex items-center gap-2 rounded-full bg-emerald-400/15 border border-emerald-400/30 px-6 py-3 text-emerald-200 hover:bg-emerald-400/20 transition"><ArrowLeft className="h-4 w-4"/>{t.browseAll}</a></div></main>;
  }

  const breed = breeds[slug];
  const t = UI[lang]||UI.en;
  const name = breed.names[lang]||breed.names.en;
  const Ti = breed.type==="dog"?Dog:Cat;
  const sameType = Object.entries(breeds).filter(([s,b])=>b.type===breed.type&&s!==slug).slice(0,6);
  const allList = Object.entries(breeds).filter(([s])=>{if(!search.trim())return true;const q=search.toLowerCase();const b=breeds[s];const n=(b.names[lang]||b.names.en).toLowerCase();return s.includes(q)||n.includes(q);}).slice(0,20);
  const overviewText = breed.overview && typeof breed.overview === "object"
    ? ((breed.overview as Record<string,string>)[lang] || (breed.overview as Record<string,string>).en)
    : breed.overview as string;

  return <main className="min-h-screen bg-neutral-950 text-neutral-50">
    <div className="mx-auto max-w-6xl px-6 py-8 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
        <a href="/breeds" className="flex items-center gap-2 text-sm text-white/50 hover:text-white/80"><ArrowLeft className="h-4 w-4"/>{t.backToBreeds}</a>
        <div className="flex gap-2">{[["en","EN"],["zh-hk","繁"],["zh-cn","简"],["ja","日"],["es","ES"]].map(([k,l])=><button key={k} onClick={()=>setLang(k)} className={`rounded-full border px-3 py-2 text-xs transition ${lang===k?"border-emerald-400/70 bg-emerald-400/15 text-emerald-200":"border-white/10 bg-white/5 text-white/70 hover:bg-white/10"}`}>{l}</button>)}</div>
      </div>
      <div className="py-8">
        <div className="flex items-center gap-3 mb-3">
          <span className={`rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-wider ${breed.type==="dog"?"text-amber-300/80 bg-amber-400/10":"text-sky-300/80 bg-sky-400/10"}`}><Ti className="h-3 w-3 inline mr-1"/>{breed.type==="dog"?t.dog:t.cat}</span>
          {breed.hypoallergenic&&<span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300 flex items-center gap-1"><Sparkles className="h-3 w-3"/>{t.hypoallergenic}</span>}
        </div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{name}</h1>
      </div>
      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="space-y-8">
          <div>
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><Activity className="h-5 w-5 text-emerald-300"/>{t.quickStats}</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <StatCard icon={Heart} label={t.lifeExpectancy} value={breed.life_expectancy} unit={t.years}/>
              <StatCard icon={Weight} label={`${t.weight} (${t.male})`} value={`${breed.weight_male.min}–${breed.weight_male.max}`} unit={t.kg}/>
              <StatCard icon={Weight} label={`${t.weight} (${t.female})`} value={`${breed.weight_female.min}–${breed.weight_female.max}`} unit={t.kg}/>
              <StatCard icon={Ruler} label={t.height} value={`${breed.height.min}–${breed.height.max}`} unit={t.cm}/>
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-semibold text-white mb-5">{t.traits}</h2>
            <div className="space-y-4">
              <RatingBar v={breed.energy} label={t.energy} t={t}/>
              <RatingBar v={breed.trainability} label={t.trainability} t={t}/>
              <RatingBar v={breed.grooming} label={t.grooming} t={t}/>
              <RatingBar v={breed.shedding} label={t.shedding} t={t}/>
              <RatingBar v={breed.barking} label={t.barking} t={t}/>
              <RatingBar v={breed.apartment} label={t.apartment} t={t}/>
              <RatingBar v={breed.first_time} label={t.firstTime} t={t}/>
            </div>
          </div>
          {breed.health_issues.length>0&&<div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><AlertCircle className="h-5 w-5 text-amber-300"/>{t.healthIssues}</h2>
            <ul className="space-y-2">{[...new Set(breed.health_issues.map(i=>i.name))].map(issueName=>(()=>{const issue=breed.health_issues.find(i=>i.name===issueName)!;const displayName=lang==="en"?issueName:(HEALTH[issueName]?.[lang]||issueName);return <li key={issueName} className="flex items-start gap-3 text-white/70"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-amber-400/60 shrink-0"/><span>{displayName}{issue.calculator&&<a href={issue.calculator} className="ml-2 text-xs text-emerald-300 hover:underline">{t.relatedCalculator}</a>}</span></li>;})())}</ul>
          </div>}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">{t.overview}</h2>
            <p className="text-white/70 leading-7">{overviewText}</p>
          </div>
        </div>
        <aside className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 space-y-4">
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3"><Search className="h-4 w-4 text-emerald-300 shrink-0"/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder={t.searchPlaceholder} className="w-full bg-transparent text-sm text-white placeholder:text-white/35 outline-none"/></div>
            <div className="space-y-1 max-h-[360px] overflow-y-auto">{allList.map(([s,b])=>{const n=b.names[lang]||b.names.en;const isActive=s===slug;return <Link key={s} to={`/breed/${s}`} onClick={()=>setSearch("")} className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-sm transition ${isActive?"bg-emerald-400/10 text-emerald-200":"text-white/60 hover:bg-white/5 hover:text-white/80"}`}><span className="flex items-center gap-2">{b.type==="dog"?<Dog className="h-3.5 w-3.5 text-amber-400/60"/>:<Cat className="h-3.5 w-3.5 text-sky-400/60"/>}{n}</span>{isActive&&<ChevronRight className="h-3.5 w-3.5"/>}</Link>;})}</div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <h3 className="text-sm font-semibold text-white mb-3">{t.relatedBreeds}</h3>
            <div className="space-y-1">{sameType.map(([s,b])=>{const n=b.names[lang]||b.names.en;return <Link key={s} to={`/breed/${s}`} className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm text-white/60 hover:bg-white/5 hover:text-white/80"><span>{n}</span><ChevronRight className="h-3.5 w-3.5 text-white/30"/></Link>;})}</div>
          </div>
        </aside>
      </div>
      <div className="mt-12 pt-8 border-t border-white/10 text-center">
        <p className="text-sm text-white/40 mb-4">Part of the <a href="https://www.tinytoolboxes.com" className="text-emerald-300 hover:underline">TinyToolboxes</a> free tools network</p>
        <div className="flex flex-wrap justify-center gap-3">
          <a href="https://www.tinytoolboxes.com/volumetric-weight-calculator" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/50 hover:bg-white/10 transition">Volumetric Weight</a>
          <a href="https://www.tinytoolboxes.com/age-calculator" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/50 hover:bg-white/10 transition">Age Calculator</a>
          <a href="https://www.tinytoolboxes.com/dog-age-calculator" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/50 hover:bg-white/10 transition">Dog Age</a>
          <a href="https://www.tinytoolboxes.com/cat-age-calculator" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/50 hover:bg-white/10 transition">Cat Age</a>
          <a href="https://www.tinytoolboxes.com/can-my-dog-eat" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/50 hover:bg-white/10 transition">Can My Dog Eat</a>
          <a href="https://www.tinytoolboxes.com/can-my-cat-eat" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/50 hover:bg-white/10 transition">Can My Cat Eat</a>
        </div>
      </div>
    </div>
  </main>;
}

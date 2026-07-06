import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Brain,
  Check,
  ChevronDown,
  Copy,
  RotateCcw,
  Sparkles,
} from "lucide-react";

// ---------------------------------------------------------------------------
// 題庫：88 題，四個維度各 22 題（每個極向 11 題，正反向計分交錯以降低作答偏誤）
// ---------------------------------------------------------------------------

type Pole = "E" | "I" | "S" | "N" | "T" | "F" | "J" | "P";
type DimKey = "EI" | "SN" | "TF" | "JP";

const BANK: Record<Pole, string[]> = {
  E: [
    "在熱鬧的聚會中，我通常越玩越有精神。",
    "我喜歡主動認識新朋友，很快就能和陌生人聊起來。",
    "思考問題時，我傾向把想法說出來，邊講邊整理思路。",
    "週末我更想約朋友出門，而不是自己待在家。",
    "在團體討論中，我常常是最先發言的人之一。",
    "我喜歡同時參與多個不同的社交圈子。",
    "遇到開心的事，我第一時間就想找人分享。",
    "在陌生的場合，我會主動打破沉默、帶起話題。",
    "長時間獨處會讓我覺得無聊或悶悶不樂。",
    "我在人多、有互動的環境中工作反而更有動力。",
    "朋友大多形容我是外向、健談的人。",
  ],
  I: [
    "參加完社交活動後，我需要獨處一段時間來恢復精力。",
    "我更喜歡和一、兩位好友深談，而不是參加大型聚會。",
    "在發言之前，我習慣先在心裡把想法想清楚。",
    "我覺得獨處的時光是一種享受，而不是寂寞。",
    "接到陌生電話或臨時邀約時，我會感到有點抗拒。",
    "我的朋友圈不大，但每一段友誼都很深厚。",
    "在會議中，我傾向先聆聽別人的意見，再表達自己的看法。",
    "我需要安靜、不受打擾的環境才能專心做事。",
    "比起成為眾人注目的焦點，我更喜歡待在幕後。",
    "我常覺得用文字表達想法，比當面說話更自在。",
    "認識新朋友對我來說是比較耗費心力的事。",
  ],
  S: [
    "我比較相信親身經驗，而不是抽象的理論。",
    "做事情時，我喜歡有明確、具體的步驟可以依循。",
    "我對細節很敏銳，常能發現別人忽略的小地方。",
    "我喜歡處理實際、可以立刻看到成果的工作。",
    "描述一件事時，我習慣具體說明實際發生了什麼。",
    "我認為腳踏實地比天馬行空更重要。",
    "學新東西時，我喜歡先看實際範例，再回頭理解原理。",
    "我更關注眼前需要解決的問題，而不是遙遠的可能性。",
    "我信任經過驗證的方法，不太喜歡冒險嘗試未知的做法。",
    "我記得住生活中的具體細節，例如某天吃了什麼、誰說了什麼。",
    "我喜歡照著說明書或食譜，一步一步操作。",
  ],
  N: [
    "我常常思考事情背後的意義和彼此的關聯。",
    "我喜歡想像未來的各種可能性。",
    "讀故事時，我特別喜歡帶有象徵和隱喻的作品。",
    "我常有突如其來的靈感，想到別人沒想過的點子。",
    "比起重複熟悉的做法，我更想嘗試全新的方式。",
    "我對理論和抽象的概念很感興趣。",
    "和朋友聊天時，我喜歡討論想法和概念，而不只是日常瑣事。",
    "我常常一眼就看出事情的整體模式或趨勢。",
    "做計畫時，我會先想大方向，細節之後再補。",
    "我容易發呆，或陷入自己的想像世界。",
    "「如果……會怎樣」這類假設性的問題讓我很著迷。",
  ],
  T: [
    "做決定時，我最看重邏輯與客觀事實。",
    "我認為公平一致比體貼個別狀況更重要。",
    "別人徵求我的意見時，我會直接指出問題，即使可能讓對方不舒服。",
    "我擅長分析利弊，找出最有效率的方案。",
    "面對批評，我通常能就事論事，不太往心裡去。",
    "我覺得在爭論中「講道理」比「顧感受」更重要。",
    "看到不合邏輯的說法，我會忍不住想糾正。",
    "評估一件事時，我會先問「合不合理」，而不是「大家感覺如何」。",
    "我認為規則應該一視同仁，不應因人情而破例。",
    "朋友找我訴苦時，我傾向幫他分析問題、給出解決方法。",
    "做重要決定時，我會刻意排除情緒的干擾。",
  ],
  F: [
    "做決定時，我會優先考慮對別人的影響和感受。",
    "我很容易察覺身邊人的情緒變化。",
    "和諧的氣氛對我非常重要，我會盡量避免衝突。",
    "稱讚和肯定對我來說是很大的動力。",
    "我常常設身處地替別人著想。",
    "看到別人難過，我自己也會跟著難受。",
    "就算對方有錯，我也會顧慮他的感受而委婉表達。",
    "我認為一個決定除了正確，也要讓大家都能接受。",
    "電影或故事裡感人的情節，常常讓我落淚。",
    "朋友難過時，我會先安慰陪伴，而不是急著給建議。",
    "被人誤解時，我會難過很久。",
  ],
  J: [
    "我喜歡把行程和計畫提前安排好。",
    "事情懸而未決會讓我感到不安。",
    "我習慣列待辦清單，並且享受劃掉完成項目的感覺。",
    "我通常會在期限前提早把工作完成。",
    "我的房間和工作空間大多維持整齊有序。",
    "旅行前，我會做好詳細的行程規劃。",
    "我喜歡先把該做的事做完，再放鬆玩樂。",
    "臨時改變計畫會讓我覺得煩躁。",
    "我做事講求按部就班、有始有終。",
    "我喜歡明確的規則和清楚的期望。",
    "開會或約會遲到，會讓我非常不自在。",
  ],
  P: [
    "我喜歡保持彈性，隨機應變勝過事先計畫。",
    "我常常拖到截止日期前，才火力全開。",
    "計畫被打亂時，我反而覺得出現了新的可能性。",
    "我喜歡同時進行好幾件事，靈感來了就切換。",
    "對我來說，過程中的自由比明確的結論更重要。",
    "做決定前，我喜歡盡量保留選項，不急著定案。",
    "說走就走的旅行讓我覺得興奮。",
    "太過詳細的規劃會讓我覺得被束縛。",
    "我的桌面看起來雜亂，但我自己知道東西放在哪裡。",
    "規則對我來說比較像參考，而不是必須遵守的鐵律。",
    "我常常臨時起意，改變原本的主意。",
  ],
};

interface Question {
  text: string;
  pole: Pole;
}

// 依「E→S→T→J→I→N→F→P」輪替排列，讓四個維度與正反向題目均勻交錯
export const QUESTIONS: Question[] = (() => {
  const rotation: Pole[] = ["E", "S", "T", "J", "I", "N", "F", "P"];
  const list: Question[] = [];
  for (let i = 0; i < 11; i++) {
    for (const pole of rotation) list.push({ text: BANK[pole][i], pole });
  }
  return list;
})();

const TOTAL = QUESTIONS.length; // 88

const LIKERT: Array<{ label: string; value: number }> = [
  { label: "非常同意", value: 2 },
  { label: "同意", value: 1 },
  { label: "中立", value: 0 },
  { label: "不同意", value: -1 },
  { label: "非常不同意", value: -2 },
];

// ---------------------------------------------------------------------------
// 計分邏輯
// ---------------------------------------------------------------------------

const DIMS: Array<{
  key: DimKey;
  first: Pole;
  second: Pole;
  firstLabel: string;
  secondLabel: string;
  title: string;
}> = [
  { key: "EI", first: "E", second: "I", firstLabel: "外向", secondLabel: "內向", title: "能量來源" },
  { key: "SN", first: "S", second: "N", firstLabel: "實感", secondLabel: "直覺", title: "資訊接收" },
  { key: "TF", first: "T", second: "F", firstLabel: "思考", secondLabel: "情感", title: "決策方式" },
  { key: "JP", first: "J", second: "P", firstLabel: "判斷", secondLabel: "感知", title: "生活型態" },
];

// 每個維度 22 題、每題 ±2 分，單一極向淨分最大值為 44
const MAX_NET = 44;

export interface DimResult {
  key: DimKey;
  winner: Pole;
  loser: Pole;
  winnerLabel: string;
  loserLabel: string;
  title: string;
  percent: number; // 勝出極向的傾向強度（50–100）
}

export function computeResult(answers: Array<number | null>): {
  type: string;
  dims: DimResult[];
} {
  const totals: Record<Pole, number> = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
  QUESTIONS.forEach((q, i) => {
    const v = answers[i];
    if (typeof v === "number") totals[q.pole] += v;
  });

  const dims: DimResult[] = DIMS.map((d) => {
    const net = totals[d.first] - totals[d.second];
    // 同分時依 MBTI 慣例判給 I / N / F / P
    const firstWins = net > 0;
    const winner = firstWins ? d.first : d.second;
    const loser = firstWins ? d.second : d.first;
    const percent = Math.min(100, Math.round(50 + (Math.abs(net) / MAX_NET) * 50));
    return {
      key: d.key,
      winner,
      loser,
      winnerLabel: firstWins ? d.firstLabel : d.secondLabel,
      loserLabel: firstWins ? d.secondLabel : d.firstLabel,
      title: d.title,
      percent,
    };
  });

  return { type: dims.map((d) => d.winner).join(""), dims };
}

// ---------------------------------------------------------------------------
// 16 型人格解析
// ---------------------------------------------------------------------------

type GroupId = "analyst" | "diplomat" | "sentinel" | "explorer";

const GROUPS: Record<GroupId, { name: string; color: string; badge: string }> = {
  analyst: { name: "分析家", color: "text-violet-300", badge: "bg-violet-500/15 text-violet-300 ring-violet-400/30" },
  diplomat: { name: "外交家", color: "text-emerald-300", badge: "bg-emerald-500/15 text-emerald-300 ring-emerald-400/30" },
  sentinel: { name: "守護者", color: "text-sky-300", badge: "bg-sky-500/15 text-sky-300 ring-sky-400/30" },
  explorer: { name: "探險家", color: "text-amber-300", badge: "bg-amber-500/15 text-amber-300 ring-amber-400/30" },
};

interface TypeProfile {
  name: string;
  group: GroupId;
  tagline: string;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  careers: string[];
  love: string;
  advice: string;
}

const TYPES: Record<string, TypeProfile> = {
  INTJ: {
    name: "建築師",
    group: "analyst",
    tagline: "富有想像力的戰略家，凡事皆有計畫。",
    summary:
      "INTJ 是天生的系統思考者，擅長把複雜的問題拆解成可執行的長期策略。他們獨立、理性、對自己和他人都有極高的標準，習慣在腦中反覆推演未來的每一步。對 INTJ 而言，知識與能力是最可靠的貨幣，他們不追隨潮流，只相信經過驗證的邏輯。",
    strengths: ["策略思考與長期規劃能力極強", "獨立自主，不需要外部監督", "求知慾旺盛，學習速度快", "意志堅定，能貫徹困難的目標", "能客觀看待問題，不受情緒左右"],
    weaknesses: ["容易顯得傲慢或難以親近", "對他人的情感需求較不敏感", "過度追求完美，容易苛責自己與別人", "討厭僵化規則，可能忽視必要的流程", "不擅長處理需要大量社交的場合"],
    careers: ["策略顧問", "軟體架構師", "科學研究員", "投資分析師", "工程師", "大學教授"],
    love: "在感情中，INTJ 忠誠而認真，會把經營關係當成重要的長期計畫；但他們需要學習表達情感，而不是只用行動證明。",
    advice: "試著把「別人的感受」也納入你的決策模型——它不是雜訊，而是真實世界的重要變數。",
  },
  INTP: {
    name: "邏輯學家",
    group: "analyst",
    tagline: "創新的發明家，對知識有無法澆熄的渴望。",
    summary:
      "INTP 活在概念與理論的世界裡，熱衷於找出萬事萬物背後的原理。他們思考跳躍、想像力豐富，常常在腦中同時進行好幾場思想實驗。比起把事情「做完」，INTP 更在意把事情「想通」，是十六型中最純粹的思考者。",
    strengths: ["分析能力出色，能看穿問題本質", "點子多且原創性高", "客觀開放，願意隨證據修正立場", "對感興趣的領域鑽研極深", "遇到抽象難題時特別興奮"],
    weaknesses: ["容易想太多而遲遲不行動", "對日常庶務和細節缺乏耐心", "可能忽略他人的情感訊號", "討厭被規則與時程束縛", "興趣轉移快，計畫常半途擱置"],
    careers: ["程式設計師", "數學家", "哲學研究者", "資料科學家", "系統分析師", "作家"],
    love: "INTP 在感情中真誠而不做作，欣賞能與自己進行深度對話的伴侶；他們需要練習把心裡的在乎說出口。",
    advice: "完成一件八十分的事，勝過構思十件一百分的事。給自己設定明確的截止日，讓想法落地。",
  },
  ENTJ: {
    name: "指揮官",
    group: "analyst",
    tagline: "大膽果斷的領導者，總能找到或開創出路。",
    summary:
      "ENTJ 是天生的組織者與領導者，擅長設定目標、調度資源、推動眾人前進。他們精力充沛、意志強大，看到低效率的事物就想改造。對 ENTJ 來說，困難不是阻礙，而是證明自己能力的舞台。",
    strengths: ["果斷高效，執行力極強", "天生的領導與組織才能", "眼光長遠，善於制定策略", "自信堅韌，抗壓性高", "直言不諱，溝通直接明快"],
    weaknesses: ["容易顯得強勢、不耐煩", "可能輕視效率低或情緒化的人", "難以放慢腳步傾聽他人", "過度聚焦目標而犧牲生活平衡", "不喜歡承認自己的脆弱"],
    careers: ["企業高階主管", "創業家", "管理顧問", "律師", "專案總監", "政治領袖"],
    love: "ENTJ 對感情和事業一樣投入，會主動經營關係並為兩人規劃未來；記得伴侶需要的常是傾聽，而非解決方案。",
    advice: "領導力的最高境界是讓人願意跟隨，而不是不得不服從。多問一句「你覺得呢？」會讓你更有影響力。",
  },
  ENTP: {
    name: "辯論家",
    group: "analyst",
    tagline: "聰明好奇的思考者，無法抗拒任何智識上的挑戰。",
    summary:
      "ENTP 思維敏捷、口才出眾，最享受用新奇的角度挑戰既有的觀點。他們是點子製造機，能在任何討論中找到別人沒想到的切入點。對 ENTP 而言，辯論不是為了贏，而是為了把想法磨得更鋒利。",
    strengths: ["反應快、創意源源不絕", "口才與說服力出色", "勇於挑戰權威與慣例", "跨領域連結知識的能力強", "面對變化與未知時充滿活力"],
    weaknesses: ["容易為辯而辯，讓人感覺好鬥", "對執行與收尾缺乏耐心", "可能忽視他人感受", "難以忍受重複性的例行工作", "興趣廣泛但不易聚焦"],
    careers: ["創業家", "行銷企劃", "產品經理", "記者", "律師", "廣告創意總監"],
    love: "ENTP 的感情充滿火花與笑聲，他們需要能一起腦力激盪的伴侶；穩定經營和及時的溫柔，是他們要修的課題。",
    advice: "把你最好的三個點子挑一個做完，世界才會知道你的聰明不只停留在嘴上。",
  },
  INFJ: {
    name: "提倡者",
    group: "diplomat",
    tagline: "安靜而神祕，卻能鼓舞人心、永不倦怠的理想主義者。",
    summary:
      "INFJ 是十六型中最稀有的類型，兼具深刻的洞察力與溫柔的同理心。他們對人性的理解敏銳得驚人，總能看見別人心裡沒說出口的部分。INFJ 做事有強烈的使命感，渴望自己的存在能讓世界變得更好。",
    strengths: ["洞察力深刻，能理解複雜的人心", "有原則、有使命感", "文字與表達富有感染力", "對在乎的人極度真誠投入", "能把理想轉化為具體行動"],
    weaknesses: ["對批評過度敏感", "容易把別人的問題揹在自己身上", "追求完美，難以對現實妥協", "不易敞開心房，知心朋友少", "長期壓抑情緒，容易突然倦怠"],
    careers: ["心理諮商師", "作家", "非營利組織工作者", "教師", "人力資源專家", "醫療照護人員"],
    love: "INFJ 追求靈魂層次的連結，寧缺勿濫；一旦認定對方，他們是最深情也最忠誠的伴侶。",
    advice: "你不需要拯救所有人。先照顧好自己的能量，你的理想才走得長遠。",
  },
  INFP: {
    name: "調停者",
    group: "diplomat",
    tagline: "詩意善良的利他主義者，永遠熱切地想幫助好的事物。",
    summary:
      "INFP 外表安靜隨和，內心卻燃燒著強烈的價值信念。他們用自己的一套原則衡量世界，對美、對善、對真實有近乎執著的追求。INFP 富有想像力，常透過文字、藝術或幫助他人來表達內心深處的情感。",
    strengths: ["同理心強，能真正理解他人", "忠於自我價值，不隨波逐流", "想像力與創作能力豐富", "包容開放，尊重每個人的獨特", "在乎意義，能為理想長期付出"],
    weaknesses: ["過度理想化，容易對現實失望", "不擅長處理衝突與批評", "容易情緒內耗、自我懷疑", "拖延，難以把夢想化為行動", "太在意和諧而忽略自身需求"],
    careers: ["作家", "諮商心理師", "社會工作者", "插畫家", "編輯", "翻譯"],
    love: "INFP 是浪漫的理想主義者，渴望被完整地理解與接納；學會表達需求，而不是默默期待對方猜到。",
    advice: "完美的時機不存在，先跨出不完美的第一步，你的理想才有機會發芽。",
  },
  ENFJ: {
    name: "主人公",
    group: "diplomat",
    tagline: "富有魅力、鼓舞人心的領導者，能讓聽眾為之著迷。",
    summary:
      "ENFJ 是天生的人心凝聚者，真誠關懷他人，並且有能力把這份關懷化為行動與影響力。他們善於發現每個人的潛力，樂於成就別人勝過成就自己。有 ENFJ 在的地方，團隊總是更有向心力。",
    strengths: ["天生的溝通者與激勵者", "真誠利他，值得信賴", "組織能力強，能凝聚團隊", "對他人的情緒與需求高度敏銳", "有領袖魅力與感染力"],
    weaknesses: ["過度投入他人問題而忽略自己", "太在意別人的評價", "難以做出會讓人失望的決定", "有時顯得過度熱心或控制", "壓力大時容易情緒化"],
    careers: ["教師", "培訓講師", "公關經理", "非營利組織領導者", "人資主管", "活動策劃"],
    love: "ENFJ 在感情中體貼周到，幾乎能預判伴侶的需要；請記得，你的需求也值得被同等重視。",
    advice: "你不必對每個人的快樂負責。偶爾說「不」，是為了把能量留給真正重要的人與事。",
  },
  ENFP: {
    name: "競選者",
    group: "diplomat",
    tagline: "熱情洋溢、創意四射的自由靈魂，總能找到微笑的理由。",
    summary:
      "ENFP 對世界充滿好奇與熱情，擅長在人與人、想法與想法之間看見別人看不到的連結。他們真誠、溫暖、感染力十足，走到哪裡都能點亮氣氛。對 ENFP 來說，人生是一場值得全心探索的冒險。",
    strengths: ["熱情有感染力，善於鼓舞他人", "創意豐富，聯想力驚人", "溝通能力強，能快速拉近距離", "好奇心旺盛，適應力強", "真誠關懷他人的感受與夢想"],
    weaknesses: ["容易三分鐘熱度，難以堅持", "討厭例行公事與繁瑣細節", "過度樂觀，低估執行難度", "情緒起伏大，容易想太多", "難以拒絕別人，常把自己塞太滿"],
    careers: ["行銷創意", "記者", "心理諮商師", "演員", "創業家", "公關專員"],
    love: "ENFP 的愛熱烈而真摯，會不斷為關係注入新鮮感；他們需要的伴侶，是能欣賞其自由又給予安定的人。",
    advice: "熱情是你的超能力，專注是你的修煉。挑一件事堅持九十天，你會嚇到自己。",
  },
  ISTJ: {
    name: "物流師",
    group: "sentinel",
    tagline: "務實重事實的可靠之人，值得信賴的中流砥柱。",
    summary:
      "ISTJ 是社會運轉的基石：話不多，但答應的事一定做到。他們重視事實、程序與責任，用嚴謹和耐心把每一件事做得扎實可靠。對 ISTJ 而言，誠信不是口號，而是每天的實踐。",
    strengths: ["極度可靠，說到做到", "做事有條理、注重細節", "誠實正直，堅守原則", "冷靜務實，臨危不亂", "對職責有超強的耐力與毅力"],
    weaknesses: ["對新方法接受度低，容易固執", "不擅長表達情感", "可能用規則苛求自己與他人", "面對模糊情境會感到不安", "容易把過多責任往身上扛"],
    careers: ["會計師", "審計員", "公務員", "軍警人員", "供應鏈管理師", "品質工程師"],
    love: "ISTJ 用行動而非甜言蜜語去愛人，是最穩定可靠的伴侶；偶爾說出口的肯定，會讓關係更溫暖。",
    advice: "傳統之所以成為傳統，是因為它曾是創新。對新做法多給一次機會，你的可靠會更有價值。",
  },
  ISFJ: {
    name: "守衛者",
    group: "sentinel",
    tagline: "溫暖盡責的守護者，隨時準備捍衛所愛之人。",
    summary:
      "ISFJ 兼具細膩的觀察力與無私的奉獻精神，總是默默記得每個人的喜好與需要。他們謙遜低調，卻在關鍵時刻永遠可靠。ISFJ 的溫柔不是軟弱——為了保護在乎的人，他們可以展現驚人的堅韌。",
    strengths: ["體貼入微，觀察力敏銳", "有極強的責任感與奉獻精神", "耐心可靠，執行力扎實", "忠誠，重視承諾與傳統", "務實的同理心：不只安慰，還會動手幫忙"],
    weaknesses: ["不好意思拒絕，容易被占用", "把委屈往肚裡吞，累積壓力", "低估自己的貢獻，不居功", "對改變與未知感到抗拒", "過度保護所愛的人"],
    careers: ["護理師", "小學教師", "行政管理", "社會工作者", "營養師", "客戶服務主管"],
    love: "ISFJ 是最體貼的伴侶，會把對方的需要放在心上細心照料；記得也讓對方有機會照顧你。",
    advice: "你的付出值得被看見。練習說出自己的需要，這不是自私，而是讓愛能夠雙向流動。",
  },
  ESTJ: {
    name: "總經理",
    group: "sentinel",
    tagline: "出色的管理者，無可匹敵的秩序與流程推動者。",
    summary:
      "ESTJ 是秩序的化身：目標明確、雷厲風行，擅長把混亂的局面整頓得井井有條。他們尊重制度與傳統，相信勤奮與紀律是成功的不二法門。需要有人把事情「搞定」的時候，大家第一個想到的就是 ESTJ。",
    strengths: ["組織與管理能力出眾", "意志堅定，執行貫徹到底", "誠實直接，立場清楚", "有強烈的責任感與公民意識", "擅長建立制度與流程"],
    weaknesses: ["不易接納非傳統的做法", "容易顯得專斷、不近人情", "過於在意社會期待與面子", "難以放鬆，把休息當浪費", "表達關心的方式常太過直接"],
    careers: ["營運主管", "專案經理", "銀行經理", "法官", "學校行政主管", "工廠廠長"],
    love: "ESTJ 對家庭極有擔當，會把承諾看得比什麼都重；學著在對錯之外，先聽聽對方的心情。",
    advice: "不是所有問題都需要立刻被糾正。有時候，先理解再要求，團隊會走得更快。",
  },
  ESFJ: {
    name: "執政官",
    group: "sentinel",
    tagline: "極富同情心、廣受歡迎的人，熱心地促進群體和諧。",
    summary:
      "ESFJ 是人群中的黏著劑：熱情好客、樂於助人，把照顧身邊每個人視為自己的天職。他們重視和諧與歸屬感，擅長組織聚會、記住細節、讓每個人都感到被在乎。有 ESFJ 在，團體就有家的感覺。",
    strengths: ["熱心體貼，樂於服務他人", "實務能力強，把事情打理得妥妥當當", "忠誠盡責，重視承諾", "善於營造和諧的氣氛", "人脈廣，擅長連結彼此"],
    weaknesses: ["太在意別人的看法與評價", "不易接受批評", "有時過度熱心，讓人感到壓力", "對非主流的想法接受度低", "委屈自己以維持表面和諧"],
    careers: ["活動企劃", "護理師", "業務經理", "公關", "餐飲管理", "幼教老師"],
    love: "ESFJ 是把「照顧好你」寫進日常的伴侶，重視儀式感與家庭；他們最需要的回報，是明確的感謝與肯定。",
    advice: "別人的認同是加分，不是你的價值來源。留一點善良給自己。",
  },
  ISTP: {
    name: "鑑賞家",
    group: "explorer",
    tagline: "大膽而實際的實驗家，精通各種工具的使用。",
    summary:
      "ISTP 是天生的動手派：冷靜、理性、好奇，喜歡拆解事物再親手把它組回去。他們話不多，但觀察入微，總能在危機時刻保持沉著、迅速找到最實際的解法。自由與空間，是 ISTP 最珍視的東西。",
    strengths: ["動手解決問題的能力一流", "冷靜沉著，危機處理出色", "樂觀隨性，適應力強", "理性務實，不浪費力氣", "學習新技能上手極快"],
    weaknesses: ["容易顯得疏離、難以捉摸", "討厭承諾與長期規劃", "容易感到無聊，尋求刺激", "不擅長處理情感話題", "獨來獨往，容易忽略團隊溝通"],
    careers: ["機械工程師", "飛行員", "外科醫師", "資安工程師", "運動員", "刑事鑑識人員"],
    love: "ISTP 的愛藏在行動裡——幫你修好東西、默默陪在身邊；給他們空間，他們反而靠得更近。",
    advice: "說出你的想法和感受，對你在乎的人來說，這比修好十樣東西更重要。",
  },
  ISFP: {
    name: "探險家",
    group: "explorer",
    tagline: "靈活迷人的藝術家，隨時準備探索和體驗新事物。",
    summary:
      "ISFP 用五感體驗世界，是低調的美感大師。他們溫柔隨和、活在當下，但內心自有一套不容侵犯的價值準則。ISFP 不愛說教也不愛張揚，而是用作品、穿搭、生活方式，安靜地表達最真實的自己。",
    strengths: ["審美與創作天分出色", "溫暖真誠，包容力強", "活在當下，享受生活細節", "行動靈活，說做就做", "謙和低調，不與人爭"],
    weaknesses: ["過度低估自己，缺乏自信", "討厭規劃，容易走一步算一步", "遇到衝突傾向逃避", "壓力大時容易封閉自己", "對批評比外表看起來更敏感"],
    careers: ["設計師", "攝影師", "廚師", "獸醫", "音樂工作者", "美髮造型師"],
    love: "ISFP 是細水長流型的伴侶，用小驚喜和陪伴表達愛意；他們需要被溫柔對待，也需要保有自己的小天地。",
    advice: "你的才華不該只有自己看見。把作品拿出來，讓世界有機會喜歡你。",
  },
  ESTP: {
    name: "企業家",
    group: "explorer",
    tagline: "聰明有活力、感知敏銳的人，真心享受行走在邊緣。",
    summary:
      "ESTP 是行動的化身：反應快、膽子大、精力旺盛，永遠衝在事件的第一線。他們對環境變化的感知敏銳得像雷達，擅長在混亂中抓住稍縱即逝的機會。對 ESTP 來說，最好的學習就是直接跳下去做。",
    strengths: ["行動力爆表，想到就做", "臨場反應與談判能力一流", "觀察敏銳，能快速讀懂局勢", "大膽果敢，敢冒別人不敢冒的險", "幽默直率，帶動氣氛的高手"],
    weaknesses: ["缺乏耐心，討厭理論與長篇大論", "容易衝動行事、忽略風險", "對規則與結構感到窒息", "可能忽略行動對他人情感的影響", "難以專注於長期目標"],
    careers: ["業務總監", "創業家", "急診醫護", "警消人員", "運動經紀人", "股票交易員"],
    love: "和 ESTP 在一起永遠不無聊，他們把生活過成冒險；願意慢下來經營深度，是他們給伴侶最好的禮物。",
    advice: "衝之前多想三秒鐘。你的行動力配上一點深思，就是無敵。",
  },
  ESFP: {
    name: "表演者",
    group: "explorer",
    tagline: "自發、精力充沛的開心果，有他們在絕不無聊。",
    summary:
      "ESFP 是天生的舞台中心：熱情、幽默、慷慨，最擅長把平凡的日子過成慶典。他們對人真誠而慷慨，喜歡用歡笑把大家聚在一起。對 ESFP 而言，人生最重要的事，就是和喜歡的人一起盡情體驗這個世界。",
    strengths: ["感染力強，天生的氣氛製造者", "大方熱情，真心關懷朋友", "實際的觀察力與美感兼具", "適應力強，樂於嘗試新事物", "在人群中如魚得水"],
    weaknesses: ["容易衝動消費、及時行樂", "難以忍受無聊與重複", "逃避衝突和嚴肅的規劃", "太在意他人眼光", "專注力容易被新鮮事物帶走"],
    careers: ["演藝人員", "活動主持人", "導遊", "銷售專員", "美妝造型師", "餐飲創業者"],
    love: "ESFP 的愛熱情直接、充滿驚喜，會把伴侶捧成主角；學會面對關係中的嚴肅課題，愛就能走得更遠。",
    advice: "快樂是你的天賦，但別用它逃避重要的事。面對問題的你，一樣閃閃發光。",
  },
};

const TYPE_ORDER = [
  "INTJ", "INTP", "ENTJ", "ENTP",
  "INFJ", "INFP", "ENFJ", "ENFP",
  "ISTJ", "ISFJ", "ESTJ", "ESFJ",
  "ISTP", "ISFP", "ESTP", "ESFP",
];

// ---------------------------------------------------------------------------
// SEO
// ---------------------------------------------------------------------------

const SITE_URL = "https://www.tinytoolboxes.com";
const PAGE_PATH = "/mbti-test";
const PAGE_TITLE = "MBTI 十六型人格測驗（88 題完整版）";
const PAGE_DESC =
  "免費繁體中文 MBTI 十六型人格測驗，88 題完整題庫，附四維度傾向分析與 16 型人格深入解析：優勢、盲點、適合職業與感情建議。";

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

// ---------------------------------------------------------------------------
// 元件
// ---------------------------------------------------------------------------

const STORAGE_KEY = "ttb-mbti-v1";

type Stage = "intro" | "quiz" | "result";

interface SavedState {
  stage: Stage;
  idx: number;
  answers: Array<number | null>;
}

function loadSaved(): SavedState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SavedState;
    if (!Array.isArray(parsed.answers) || parsed.answers.length !== TOTAL) return null;
    return parsed;
  } catch {
    return null;
  }
}

function DimBar({ d }: { d: DimResult }) {
  const leftPct = d.percent;
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-4">
      <div className="mb-2 flex items-center justify-between text-xs text-neutral-400">
        <span>{d.title}</span>
        <span className="font-semibold text-neutral-200">
          {d.winnerLabel}（{d.winner}）{d.percent}%
        </span>
      </div>
      <div className="flex h-3 w-full overflow-hidden rounded-full bg-neutral-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-400 transition-all duration-700"
          style={{ width: `${leftPct}%` }}
        />
      </div>
      <div className="mt-1.5 flex justify-between text-[11px] text-neutral-500">
        <span>
          {d.winnerLabel} {d.winner} · {d.percent}%
        </span>
        <span>
          {d.loserLabel} {d.loser} · {100 - d.percent}%
        </span>
      </div>
    </div>
  );
}

function TypeCard({ code, active, onClick }: { code: string; active: boolean; onClick: () => void }) {
  const t = TYPES[code];
  const g = GROUPS[t.group];
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border p-3 text-left transition-colors ${
        active
          ? "border-indigo-400/60 bg-indigo-500/10"
          : "border-neutral-800 bg-neutral-900/60 hover:border-neutral-600"
      }`}
    >
      <div className="font-mono text-sm font-bold tracking-widest text-neutral-100">{code}</div>
      <div className={`text-xs ${g.color}`}>{t.name}</div>
    </button>
  );
}

function TypeProfileView({ code, dims }: { code: string; dims?: DimResult[] }) {
  const t = TYPES[code];
  const g = GROUPS[t.group];
  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 sm:p-8">
      <div className="flex flex-wrap items-center gap-3">
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ring-1 ${g.badge}`}>
          {g.name}
        </span>
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          <span className="font-mono tracking-widest">{code}</span>
          <span className="ml-2 text-indigo-300">{t.name}</span>
        </h2>
      </div>
      <p className="mt-2 text-sm italic text-neutral-400">「{t.tagline}」</p>
      <p className="mt-4 leading-relaxed text-neutral-300">{t.summary}</p>

      {dims && (
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {dims.map((d) => (
            <DimBar key={d.key} d={d} />
          ))}
        </div>
      )}

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div>
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-emerald-300">優勢</h3>
          <ul className="space-y-1.5 text-sm text-neutral-300">
            {t.strengths.map((s) => (
              <li key={s} className="flex gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-hidden />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-rose-300">盲點</h3>
          <ul className="space-y-1.5 text-sm text-neutral-300">
            {t.weaknesses.map((s) => (
              <li key={s} className="flex gap-2">
                <ChevronDown className="mt-0.5 h-4 w-4 shrink-0 rotate-[-90deg] text-rose-400" aria-hidden />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-sky-300">適合的職業方向</h3>
        <div className="flex flex-wrap gap-2">
          {t.careers.map((c) => (
            <span key={c} className="rounded-full border border-neutral-700 bg-neutral-800/80 px-3 py-1 text-xs text-neutral-200">
              {c}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-4">
          <h3 className="mb-1 text-sm font-semibold text-pink-300">感情與人際</h3>
          <p className="text-sm leading-relaxed text-neutral-300">{t.love}</p>
        </div>
        <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-4">
          <h3 className="mb-1 text-sm font-semibold text-amber-300">成長建議</h3>
          <p className="text-sm leading-relaxed text-neutral-300">{t.advice}</p>
        </div>
      </div>
    </div>
  );
}

export default function MbtiTest() {
  const saved = useMemo(loadSaved, []);
  const [stage, setStage] = useState<Stage>(saved?.stage ?? "intro");
  const [idx, setIdx] = useState<number>(saved?.idx ?? 0);
  const [answers, setAnswers] = useState<Array<number | null>>(
    saved?.answers ?? Array.from({ length: TOTAL }, () => null),
  );
  const [browseType, setBrowseType] = useState<string>("INTJ");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    document.documentElement.lang = "zh-Hant";
    applySEO({
      title: `${PAGE_TITLE} | TinyToolboxes`,
      description: PAGE_DESC,
      path: PAGE_PATH,
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: PAGE_TITLE,
        url: SITE_URL + PAGE_PATH,
        description: PAGE_DESC,
        applicationCategory: "LifestyleApplication",
        operatingSystem: "Web",
        inLanguage: "zh-Hant",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        publisher: { "@type": "Organization", name: "TinyToolboxes", url: SITE_URL },
      },
    });
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ stage, idx, answers } satisfies SavedState));
    } catch {
      // 儲存空間不足時直接略過，不影響作答
    }
  }, [stage, idx, answers]);

  const answeredCount = useMemo(() => answers.filter((a) => a !== null).length, [answers]);
  const result = useMemo(() => (stage === "result" ? computeResult(answers) : null), [stage, answers]);

  const startQuiz = (fresh: boolean) => {
    if (fresh) {
      setAnswers(Array.from({ length: TOTAL }, () => null));
      setIdx(0);
    }
    setStage("quiz");
  };

  const restart = () => {
    setAnswers(Array.from({ length: TOTAL }, () => null));
    setIdx(0);
    setCopied(false);
    setStage("intro");
  };

  const select = (value: number) => {
    const next = [...answers];
    next[idx] = value;
    setAnswers(next);
    if (idx < TOTAL - 1) {
      setIdx(idx + 1);
    } else if (next.every((a) => a !== null)) {
      setStage("result");
    } else {
      // 到最後一題但仍有跳過的題目時，跳回第一題未作答處
      setIdx(next.findIndex((a) => a === null));
    }
  };

  const copyResult = async () => {
    if (!result) return;
    const t = TYPES[result.type];
    const lines = [
      `我的 MBTI 是 ${result.type} ${t.name}！`,
      ...result.dims.map((d) => `${d.title}：${d.winnerLabel}（${d.winner}）${d.percent}%`),
      `來測測你的：${SITE_URL}${PAGE_PATH}`,
    ];
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // 剪貼簿權限被拒時靜默失敗
    }
  };

  const q = QUESTIONS[idx];
  const progress = Math.round((answeredCount / TOTAL) * 100);

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">
      <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* 頁首 */}
        <header className="mb-8 flex items-center justify-between gap-4">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-neutral-400 transition-colors hover:text-neutral-100">
            <ArrowLeft className="h-4 w-4" aria-hidden />
            TinyToolboxes
          </Link>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-800 bg-neutral-900 px-3 py-1 text-xs text-neutral-400">
            <Brain className="h-3.5 w-3.5 text-indigo-400" aria-hidden />
            MBTI 十六型人格測驗
          </span>
        </header>

        {/* 開始頁 */}
        {stage === "intro" && (
          <section>
            <div className="rounded-2xl border border-neutral-800 bg-gradient-to-b from-indigo-500/10 to-transparent p-6 sm:p-10">
              <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/15 px-3 py-1 text-xs font-medium text-indigo-300 ring-1 ring-indigo-400/30">
                <Sparkles className="h-3.5 w-3.5" aria-hidden />
                88 題完整版・免費・無需註冊
              </div>
              <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                MBTI 十六型人格測驗
              </h1>
              <p className="mt-3 max-w-2xl leading-relaxed text-neutral-400">
                透過 88 道題目，從「能量來源、資訊接收、決策方式、生活型態」四個維度分析你的人格傾向，
                找出你在十六型人格中的位置，並提供優勢、盲點、職業方向與感情建議的完整解析。
                作答約需 8–12 分鐘，進度會自動儲存在你的瀏覽器。
              </p>
              <ul className="mt-6 grid gap-3 text-sm text-neutral-300 sm:grid-cols-2">
                {DIMS.map((d) => (
                  <li key={d.key} className="flex items-center gap-3 rounded-xl border border-neutral-800 bg-neutral-900/60 px-4 py-3">
                    <span className="font-mono text-xs font-bold tracking-widest text-indigo-300">
                      {d.first}/{d.second}
                    </span>
                    <span>
                      {d.title}：{d.firstLabel} vs {d.secondLabel}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => startQuiz(true)}
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-400"
                >
                  開始測驗
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </button>
                {answeredCount > 0 && answeredCount < TOTAL && (
                  <button
                    type="button"
                    onClick={() => startQuiz(false)}
                    className="inline-flex items-center gap-2 rounded-xl border border-neutral-700 px-6 py-3 text-sm font-semibold text-neutral-200 transition-colors hover:border-neutral-500"
                  >
                    繼續上次進度（已完成 {answeredCount} 題）
                  </button>
                )}
              </div>
              <p className="mt-6 text-xs leading-relaxed text-neutral-500">
                本測驗依據 Carl Jung 心理類型理論與 Myers–Briggs 分類架構設計，僅供自我探索與娛樂參考，
                不構成心理診斷或專業建議。
              </p>
            </div>

            {/* 16 型速覽 */}
            <div className="mt-10">
              <h2 className="text-lg font-semibold">先認識十六型人格</h2>
              <p className="mt-1 text-sm text-neutral-400">點選任一類型，預覽完整解析。</p>
              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {TYPE_ORDER.map((code) => (
                  <TypeCard key={code} code={code} active={browseType === code} onClick={() => setBrowseType(code)} />
                ))}
              </div>
              <div className="mt-4">
                <TypeProfileView code={browseType} />
              </div>
            </div>
          </section>
        )}

        {/* 作答頁 */}
        {stage === "quiz" && (
          <section aria-live="polite">
            <div className="mb-6">
              <div className="mb-2 flex items-center justify-between text-xs text-neutral-400">
                <span>
                  第 <span className="font-semibold text-neutral-100">{idx + 1}</span> / {TOTAL} 題
                </span>
                <span>已完成 {progress}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-400 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 sm:p-10">
              <p className="min-h-16 text-lg font-medium leading-relaxed sm:text-xl">{q.text}</p>
              <div className="mt-6 grid gap-2.5">
                {LIKERT.map((opt) => {
                  const active = answers[idx] === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => select(opt.value)}
                      className={`w-full rounded-xl border px-5 py-3.5 text-left text-sm font-medium transition-colors sm:text-base ${
                        active
                          ? "border-indigo-400 bg-indigo-500/20 text-indigo-100"
                          : "border-neutral-700 bg-neutral-900 text-neutral-200 hover:border-indigo-400/60 hover:bg-neutral-800"
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setIdx(Math.max(0, idx - 1))}
                disabled={idx === 0}
                className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-700 px-4 py-2 text-sm text-neutral-300 transition-colors hover:border-neutral-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden />
                上一題
              </button>
              <button type="button" onClick={restart} className="text-xs text-neutral-500 underline-offset-4 transition-colors hover:text-neutral-300 hover:underline">
                放棄並重新開始
              </button>
              <button
                type="button"
                onClick={() => setIdx(Math.min(TOTAL - 1, idx + 1))}
                disabled={idx === TOTAL - 1 || answers[idx] === null}
                className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-700 px-4 py-2 text-sm text-neutral-300 transition-colors hover:border-neutral-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                下一題
                <ArrowRight className="h-4 w-4" aria-hidden />
              </button>
            </div>
          </section>
        )}

        {/* 結果頁 */}
        {stage === "result" && result && (
          <section>
            <div className="mb-6 rounded-2xl border border-indigo-400/30 bg-gradient-to-b from-indigo-500/15 to-transparent p-6 text-center sm:p-10">
              <p className="text-sm text-neutral-400">你的人格類型是</p>
              <h1 className="mt-2 font-mono text-5xl font-black tracking-[0.2em] text-indigo-300 sm:text-6xl">
                {result.type}
              </h1>
              <p className="mt-2 text-xl font-semibold">
                {TYPES[result.type].name}
                <span className={`ml-3 inline-flex items-center rounded-full px-3 py-1 align-middle text-xs font-medium ring-1 ${GROUPS[TYPES[result.type].group].badge}`}>
                  {GROUPS[TYPES[result.type].group].name}
                </span>
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={copyResult}
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-400"
                >
                  {copied ? <Check className="h-4 w-4" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
                  {copied ? "已複製！" : "複製結果分享"}
                </button>
                <button
                  type="button"
                  onClick={restart}
                  className="inline-flex items-center gap-2 rounded-xl border border-neutral-700 px-5 py-2.5 text-sm font-semibold text-neutral-200 transition-colors hover:border-neutral-500"
                >
                  <RotateCcw className="h-4 w-4" aria-hidden />
                  重新測驗
                </button>
              </div>
            </div>

            <TypeProfileView code={result.type} dims={result.dims} />

            <div className="mt-10">
              <h2 className="text-lg font-semibold">看看其他十五種類型</h2>
              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {TYPE_ORDER.map((code) => (
                  <TypeCard key={code} code={code} active={browseType === code} onClick={() => setBrowseType(code)} />
                ))}
              </div>
              {browseType !== result.type && (
                <div className="mt-4">
                  <TypeProfileView code={browseType} />
                </div>
              )}
            </div>
          </section>
        )}

        {/* 頁尾說明 */}
        <footer className="mt-12 border-t border-neutral-800 pt-6 text-xs leading-relaxed text-neutral-500">
          <p>
            MBTI（Myers–Briggs Type Indicator）以 Carl Jung 的心理類型理論為基礎，將人格分為四個維度、十六種類型。
            本測驗結果反映的是「傾向」而非「能力」，同一個人在不同人生階段的結果也可能改變。
            所有作答資料僅儲存在你的瀏覽器中，不會上傳到任何伺服器。
          </p>
          <p className="mt-2">© TinyToolboxes · 免費線上小工具集</p>
        </footer>
      </div>
    </main>
  );
}

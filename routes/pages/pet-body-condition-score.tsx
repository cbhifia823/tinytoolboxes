import { useEffect, useMemo, useState } from "react";
import { ArrowRight, BadgeDollarSign, Scale, Cat, Dog, RotateCcw, Check } from "lucide-react";

const LANGUAGES = {
  en: {
    name: "English",
    title: "Pet Body Condition Score (BCS) Quiz",
    subtitle: "A vet-style visual quiz to estimate your pet's body condition on the standard 1–9 scale. Get a category, action plan, and vet-visit recommendation.",
    reserveAd: "Google Ads space reserved",
    reserveAdSub: "You can drop AdSense code here later.",
    adLabel: "Advertisement",
    adBadge: "Reserved",
    speciesQ: "Which pet are you scoring?",
    dog: "Dog",
    cat: "Cat",
    start: "Start quiz",
    restart: "Restart",
    questionOf: "Question {n} of {total}",
    yourScore: "Your pet's BCS",
    outOf: "/ 9",
    category: "Weight category",
    catUnder: "Underweight",
    catIdeal: "Ideal",
    catOver: "Overweight",
    catObese: "Obese",
    summaryUnder: "Your pet is below ideal weight. Ribs, spine and hips are visibly prominent.",
    summaryIdeal: "Your pet is at a healthy weight. Ribs can be felt with light pressure; waist is visible from above.",
    summaryOver: "Your pet is carrying extra fat. Ribs are hard to feel; waist is less defined.",
    summaryObese: "Your pet is significantly overweight. Excess fat increases risk of diabetes, arthritis, and reduced lifespan.",
    actionTitle: "Recommended action plan",
    actionUnder: "Have a vet rule out parasites, dental disease, or chronic illness. Increase meals to 3× per day with calorie-dense food.",
    actionIdeal: "Keep doing what you're doing. Re-check BCS every 2–3 months.",
    actionOver: "Cut treats to <5% of daily calories. Reduce portions ~10% and increase walks/playtime. Re-check BCS monthly.",
    actionObese: "Schedule a vet visit. A structured weight-loss plan (often 1% body weight per week) is needed. Avoid crash diets — they can cause hepatic lipidosis, especially in cats.",
    vetTitle: "Vet visit recommendation",
    vetUnder: "Yes — see a vet within 1–2 weeks to investigate the cause.",
    vetIdeal: "Routine annual check is enough.",
    vetOver: "Discuss at next routine visit. No urgency unless other symptoms appear.",
    vetObese: "Schedule a dedicated weight-management consult within the month.",
    relatedTitle: "Related tools",
    searchTools: "Search tools",
    aboutTitle: "About the 1–9 BCS scale",
    aboutP1: "The Body Condition Score (BCS) is the veterinary standard for assessing whether a pet is underweight, ideal, or overweight without a scale. Developed by Purina and adopted by AAHA, WSAVA and most veterinary teaching hospitals, it ranges from 1 (emaciated) to 9 (grossly obese), with 4–5 being ideal.",
    aboutP2: "Unlike weight alone, BCS adjusts for breed, frame, and muscle — a 30 kg Greyhound and a 30 kg Bulldog can be at very different conditions. The score is built from three hands-on checks: ribs, waist (from above), and abdominal tuck (from the side).",
    methodTitle: "How the quiz works",
    methodP1: "You'll answer six short visual questions about your pet's silhouette, rib coverage and waistline. Each answer maps to a 1–9 sub-score, and the final BCS is the average — rounded the way a veterinary technician would round it.",
    methodP2: "This is a screening tool, not a clinical diagnosis. If you're unsure, a vet or qualified tech can do a hands-on BCS in under a minute.",
    faqTitle: "Frequently asked questions",
    faqs: [
      { q: "Is BCS the same for dogs and cats?", a: "The scale is the same (1–9, with 5 ideal) but the visual landmarks differ. Cats sit slightly higher at the spine, and a primordial belly pouch in healthy cats is normal — not a sign of obesity." },
      { q: "What is the difference between BCS and weight?", a: "Weight depends on frame size and muscle. Two dogs of the same weight can have very different BCS. BCS measures fat coverage, which is what matters for health risk." },
      { q: "How often should I check BCS?", a: "Monthly is plenty for healthy adults. Weekly for pets on a weight-loss plan. Re-check after life changes (neuter, illness, new diet)." },
      { q: "My pet is fluffy — how do I judge?", a: "Don't trust the eye for long-coated pets. Use your hands. Press flat against the ribs and feel: ribs you can find easily with light pressure = around BCS 5." },
      { q: "Are some breeds naturally heavier-set?", a: "Yes — Pugs, Bulldogs, Persians and Maine Coons have stockier frames. They can still be lean (BCS 5) without looking 'skinny.' Talk to a vet about breed-adjusted ideals." },
    ],
    disclaimerTitle: "Disclaimer",
    disclaimer: "This quiz is an educational screening tool. It does not replace a veterinary exam. Sudden weight changes, lethargy, or appetite changes deserve a vet visit regardless of BCS.",
    questions: {
      dog: [
        { q: "Look down at your dog from above. What do you see?", a: [
          { label: "Severely indented waist — hipbones jut out", score: 1 },
          { label: "Clear hourglass waist — slightly indented", score: 5 },
          { label: "Slight curve at waist — broader than ribs", score: 6 },
          { label: "No waist — straight or wider at hips", score: 7 },
          { label: "Round, no waist visible at all", score: 9 },
        ]},
        { q: "Feel along your dog's ribs (light pressure, like the back of your hand).", a: [
          { label: "Ribs and spine very prominent — no fat", score: 1 },
          { label: "Ribs easily felt with minimal fat", score: 4 },
          { label: "Ribs felt with light pressure", score: 5 },
          { label: "Ribs felt with firm pressure under a fat layer", score: 7 },
          { label: "Ribs hard or impossible to feel", score: 9 },
        ]},
        { q: "Look at your dog from the side — what about the belly?", a: [
          { label: "Tucked up severely — hollow belly", score: 1 },
          { label: "Clear tuck — belly line rises sharply", score: 5 },
          { label: "Slight tuck", score: 6 },
          { label: "No tuck — belly line is straight", score: 7 },
          { label: "Belly sags below the chest", score: 9 },
        ]},
        { q: "How does fat sit over the spine and hips?", a: [
          { label: "Vertebrae and hip bones easily visible", score: 1 },
          { label: "Spine felt but smoothly covered", score: 5 },
          { label: "Spine hard to feel under fat layer", score: 7 },
          { label: "Spine and hips buried in fat", score: 9 },
        ]},
        { q: "Notice any fat deposits at base of tail, chest, or hind legs?", a: [
          { label: "No fat — bony", score: 1 },
          { label: "Minimal — sleek and smooth", score: 5 },
          { label: "Moderate fat pads", score: 7 },
          { label: "Heavy fat deposits, abdominal sag", score: 9 },
        ]},
        { q: "Does your dog tire easily on normal walks?", a: [
          { label: "Energetic, no signs of tiring", score: 5 },
          { label: "Slightly slower than normal", score: 6 },
          { label: "Frequently slows down or pants heavily", score: 7 },
          { label: "Reluctant to walk or struggles to exercise", score: 9 },
        ]},
      ],
      cat: [
        { q: "Look at your cat from above. What does the waist look like?", a: [
          { label: "Severely tucked — bones visible", score: 1 },
          { label: "Clear hourglass shape", score: 5 },
          { label: "Slight curve — broader than ribs", score: 6 },
          { label: "Straight sides — no waist", score: 7 },
          { label: "Bulges outward — wider than ribs", score: 9 },
        ]},
        { q: "Feel along your cat's ribs.", a: [
          { label: "Ribs sharply prominent, no fat layer", score: 1 },
          { label: "Ribs felt easily with thin fat covering", score: 5 },
          { label: "Ribs felt with light pressure under fat layer", score: 6 },
          { label: "Difficult to feel ribs under fat", score: 8 },
          { label: "Ribs not palpable at all", score: 9 },
        ]},
        { q: "How does the abdomen look from the side?", a: [
          { label: "Severe abdominal tuck — hollow", score: 1 },
          { label: "Slight abdominal tuck — normal primordial pouch", score: 5 },
          { label: "No tuck — belly line straight", score: 7 },
          { label: "Pendulous belly hangs below chest", score: 9 },
        ]},
        { q: "Look at the spine when your cat is standing.", a: [
          { label: "Vertebrae sharply visible", score: 1 },
          { label: "Spine felt with smooth covering", score: 5 },
          { label: "Spine hard to feel through fat", score: 7 },
          { label: "Spine completely buried in fat", score: 9 },
        ]},
        { q: "Is there a primordial pouch (small belly flap)?", a: [
          { label: "Almost none — extremely lean", score: 2 },
          { label: "Small pouch — normal for healthy cats", score: 5 },
          { label: "Pronounced pouch — fat extends past belly button", score: 7 },
          { label: "Large pendulous abdomen, severe pouch", score: 9 },
        ]},
        { q: "Does grooming or jumping seem difficult?", a: [
          { label: "Grooms normally, jumps with ease", score: 5 },
          { label: "Slightly less agile than usual", score: 6 },
          { label: "Difficulty grooming back or hindquarters", score: 8 },
          { label: "Unable to groom — visible mats, refuses to jump", score: 9 },
        ]},
      ],
    },
  },
  "zh-hk": {
    name: "繁體中文",
    title: "寵物體況評分（BCS）測驗",
    subtitle: "獸醫式視覺測驗，用標準 1–9 量表評估你寵物嘅體況。完成後得到分數、體重類別同建議方案。",
    reserveAd: "預留 Google 廣告位",
    reserveAdSub: "之後可直接放 AdSense 程式碼。",
    adLabel: "廣告",
    adBadge: "已預留",
    speciesQ: "你想評估邊一種寵物？",
    dog: "狗狗",
    cat: "貓貓",
    start: "開始測驗",
    restart: "重新測驗",
    questionOf: "問題 {n} / {total}",
    yourScore: "你寵物嘅 BCS 分數",
    outOf: "/ 9",
    category: "體重類別",
    catUnder: "偏瘦",
    catIdeal: "理想",
    catOver: "偏胖",
    catObese: "肥胖",
    summaryUnder: "你寵物低於理想體重。肋骨、脊椎同臀骨明顯突出。",
    summaryIdeal: "你寵物體重健康。輕按可摸到肋骨；從上面睇有明顯腰身。",
    summaryOver: "你寵物有多餘脂肪。肋骨難摸到，腰身唔明顯。",
    summaryObese: "你寵物嚴重超重。過多脂肪會增加糖尿病、關節炎風險，亦會縮短壽命。",
    actionTitle: "建議行動方案",
    actionUnder: "請獸醫排除寄生蟲、牙科疾病或慢性病。增加餐次至每日 3 次，用高熱量糧。",
    actionIdeal: "保持現狀。每 2–3 個月重新評估 BCS。",
    actionOver: "將零食減至每日熱量 <5%，份量減 ~10%，增加散步／玩耍時間。每月重新評估 BCS。",
    actionObese: "預約獸醫。需要有結構嘅減重計劃（通常每週減 1% 體重）。避免極端節食 — 對貓貓可能引發肝脂肪病。",
    vetTitle: "獸醫探訪建議",
    vetUnder: "係 — 1–2 週內見獸醫，查明原因。",
    vetIdeal: "每年定期檢查就足夠。",
    vetOver: "下次定期檢查時討論。除非有其他症狀，否則唔緊急。",
    vetObese: "1 個月內預約專門嘅減重諮詢。",
    relatedTitle: "相關工具",
    searchTools: "搜尋工具",
    aboutTitle: "關於 1–9 BCS 量表",
    aboutP1: "體況評分（Body Condition Score, BCS）係獸醫業界標準，用來評估寵物係偏瘦、理想定偏胖，唔需要磅。由 Purina 開發，AAHA、WSAVA 同大多數獸醫教學醫院都採用，範圍由 1（極瘦）到 9（極度肥胖），4–5 為理想。",
    aboutP2: "同單純睇體重唔同，BCS 會考慮品種、骨架同肌肉 — 30 公斤嘅靈緹同 30 公斤嘅鬥牛犬可能體況差好遠。分數由三個觸診檢查組成：肋骨、腰身（從上面睇）同腹部收緊（從側面睇）。",
    methodTitle: "測驗點樣運作",
    methodP1: "你要答 6 條關於寵物輪廓、肋骨同腰身嘅問題。每個答案對應一個 1–9 分數，最終 BCS 係平均值 — 按獸醫技師嘅四捨五入方式處理。",
    methodP2: "呢個係篩查工具，唔係臨床診斷。如果唔肯定，獸醫或合資格嘅技師可以喺一分鐘內完成觸診 BCS。",
    faqTitle: "常見問題",
    faqs: [
      { q: "狗狗同貓貓嘅 BCS 一樣嗎？", a: "量表相同（1–9，5 為理想），但視覺標記唔同。貓貓嘅脊椎位置略高，健康貓貓有原始腹部囊袋（primordial pouch）係正常嘅 — 唔係肥胖。" },
      { q: "BCS 同體重有咩分別？", a: "體重會受骨架同肌肉影響。同樣體重嘅兩隻狗狗可能 BCS 差好遠。BCS 量度脂肪覆蓋程度，呢個先係影響健康風險嘅因素。" },
      { q: "幾耐評估一次 BCS？", a: "健康成年寵物每月一次足夠。減重計劃中嘅寵物每週一次。生活變化後（絕育、生病、轉糧）要重新評估。" },
      { q: "我寵物毛好厚，點判斷？", a: "長毛寵物唔可以靠睇。用手按平喺肋骨，感受：輕按就摸到肋骨 = BCS 約 5。" },
      { q: "某啲品種天生較壯實嗎？", a: "係 — 八哥、鬥牛犬、波斯貓、緬因貓骨架較壯。佢哋仍然可以體態精瘦（BCS 5）而唔顯得「皮包骨」。同獸醫討論品種特定嘅理想標準。" },
    ],
    disclaimerTitle: "免責聲明",
    disclaimer: "本測驗係教育性篩查工具，並唔取代獸醫檢查。突發體重變化、無精打采或食慾改變，無論 BCS 點，都要見獸醫。",
    questions: {
      dog: [
        { q: "由上面望落你嘅狗狗。睇到咩？", a: [
          { label: "腰身嚴重凹陷 — 臀骨突出", score: 1 },
          { label: "明顯沙漏腰 — 輕微凹陷", score: 5 },
          { label: "腰身輕微彎曲 — 比肋骨闊", score: 6 },
          { label: "冇腰身 — 直線或臀部較闊", score: 7 },
          { label: "圓滾滾，完全冇腰身", score: 9 },
        ]},
        { q: "輕按你狗狗嘅肋骨（力度好似手背輕貼）。", a: [
          { label: "肋骨同脊椎極度突出 — 冇脂肪", score: 1 },
          { label: "輕按就摸到肋骨，脂肪極少", score: 4 },
          { label: "輕按可摸到肋骨", score: 5 },
          { label: "要用力先摸到肋骨（脂肪層）", score: 7 },
          { label: "完全摸唔到肋骨", score: 9 },
        ]},
        { q: "由側面睇 — 肚仔點樣？", a: [
          { label: "極度收緊 — 凹陷腹部", score: 1 },
          { label: "明顯收緊 — 腹線急升", score: 5 },
          { label: "輕微收緊", score: 6 },
          { label: "冇收緊 — 腹線平直", score: 7 },
          { label: "肚仔低於胸線下垂", score: 9 },
        ]},
        { q: "脂肪喺脊椎同臀部點樣分佈？", a: [
          { label: "脊椎同臀骨清晰可見", score: 1 },
          { label: "脊椎可觸但平滑覆蓋", score: 5 },
          { label: "脊椎被脂肪層遮住難摸到", score: 7 },
          { label: "脊椎同臀部完全被脂肪掩埋", score: 9 },
        ]},
        { q: "尾巴根部、胸部或後腿有脂肪堆積嗎？", a: [
          { label: "完全冇脂肪 — 骨感", score: 1 },
          { label: "極少 — 平滑流線", score: 5 },
          { label: "中等脂肪墊", score: 7 },
          { label: "大量脂肪堆積，腹部下垂", score: 9 },
        ]},
        { q: "你狗狗平時散步時容易疲倦嗎？", a: [
          { label: "活力十足，毫無疲態", score: 5 },
          { label: "比平時略慢", score: 6 },
          { label: "經常放慢或大口喘氣", score: 7 },
          { label: "唔願意行或運動有困難", score: 9 },
        ]},
      ],
      cat: [
        { q: "由上面望落你嘅貓貓。腰身點樣？", a: [
          { label: "嚴重內縮 — 骨頭可見", score: 1 },
          { label: "明顯沙漏形", score: 5 },
          { label: "輕微彎曲 — 比肋骨闊", score: 6 },
          { label: "兩側平直 — 冇腰身", score: 7 },
          { label: "向外凸 — 比肋骨更闊", score: 9 },
        ]},
        { q: "輕按你貓貓嘅肋骨。", a: [
          { label: "肋骨極度突出，毫無脂肪層", score: 1 },
          { label: "輕薄脂肪層下易摸到肋骨", score: 5 },
          { label: "脂肪層下輕按可摸到肋骨", score: 6 },
          { label: "肋骨喺脂肪下難摸到", score: 8 },
          { label: "完全摸唔到肋骨", score: 9 },
        ]},
        { q: "從側面睇腹部點樣？", a: [
          { label: "腹部嚴重收緊 — 凹陷", score: 1 },
          { label: "輕微收緊 — 正常原始囊袋", score: 5 },
          { label: "冇收緊 — 腹線平直", score: 7 },
          { label: "肚仔下垂超過胸部", score: 9 },
        ]},
        { q: "貓貓站立時望脊椎。", a: [
          { label: "脊椎清晰可見", score: 1 },
          { label: "脊椎可觸，平滑覆蓋", score: 5 },
          { label: "脊椎被脂肪遮住難摸", score: 7 },
          { label: "脊椎完全埋喺脂肪入面", score: 9 },
        ]},
        { q: "有原始囊袋（小腹皮垂）嗎？", a: [
          { label: "幾乎冇 — 極度精瘦", score: 2 },
          { label: "細囊袋 — 健康貓貓正常表現", score: 5 },
          { label: "明顯囊袋 — 脂肪延伸過肚臍", score: 7 },
          { label: "大型下垂腹部，嚴重囊袋", score: 9 },
        ]},
        { q: "理毛或跳躍有困難嗎？", a: [
          { label: "正常理毛，跳躍輕鬆", score: 5 },
          { label: "略遜於以往", score: 6 },
          { label: "難以理背部或後腿", score: 8 },
          { label: "無法理毛 — 出現打結，拒絕跳躍", score: 9 },
        ]},
      ],
    },
  },
  "zh-cn": {
    name: "简体中文",
    title: "宠物体况评分（BCS）测验",
    subtitle: "兽医式视觉测验，用标准 1–9 量表评估你宠物的体况。完成后得到分数、体重类别和建议方案。",
    reserveAd: "预留 Google 广告位",
    reserveAdSub: "之后可直接放 AdSense 代码。",
    adLabel: "广告",
    adBadge: "已预留",
    speciesQ: "你要评估哪种宠物？",
    dog: "狗狗",
    cat: "猫咪",
    start: "开始测验",
    restart: "重新测验",
    questionOf: "问题 {n} / {total}",
    yourScore: "你宠物的 BCS 分数",
    outOf: "/ 9",
    category: "体重类别",
    catUnder: "偏瘦",
    catIdeal: "理想",
    catOver: "偏胖",
    catObese: "肥胖",
    summaryUnder: "你宠物低于理想体重。肋骨、脊椎和臀骨明显突出。",
    summaryIdeal: "你宠物体重健康。轻按可摸到肋骨；从上面看有明显腰身。",
    summaryOver: "你宠物有多余脂肪。肋骨难摸到，腰身不明显。",
    summaryObese: "你宠物严重超重。过多脂肪会增加糖尿病、关节炎风险，并缩短寿命。",
    actionTitle: "建议行动方案",
    actionUnder: "请兽医排除寄生虫、牙科疾病或慢性病。增加餐次至每日 3 次，用高热量粮。",
    actionIdeal: "保持现状。每 2–3 个月重新评估 BCS。",
    actionOver: "将零食减至每日热量 <5%，分量减 ~10%，增加散步／玩耍时间。每月重新评估 BCS。",
    actionObese: "预约兽医。需要有结构的减重计划（通常每周减 1% 体重）。避免极端节食 — 对猫咪可能引发肝脂肪病。",
    vetTitle: "兽医探访建议",
    vetUnder: "是 — 1–2 周内见兽医，查明原因。",
    vetIdeal: "每年定期检查就足够。",
    vetOver: "下次定期检查时讨论。除非有其他症状，否则不紧急。",
    vetObese: "1 个月内预约专门的减重咨询。",
    relatedTitle: "相关工具",
    searchTools: "搜索工具",
    aboutTitle: "关于 1–9 BCS 量表",
    aboutP1: "体况评分（Body Condition Score, BCS）是兽医业界标准，用来评估宠物是偏瘦、理想还是偏胖，无需称重。由 Purina 开发，AAHA、WSAVA 和大多数兽医教学医院都采用，范围从 1（极瘦）到 9（极度肥胖），4–5 为理想。",
    aboutP2: "与单纯看体重不同，BCS 会考虑品种、骨架和肌肉 — 30 公斤的灵缇和 30 公斤的斗牛犬体况可能差很多。分数由三个触诊检查组成：肋骨、腰身（从上面看）和腹部收紧（从侧面看）。",
    methodTitle: "测验如何运作",
    methodP1: "你要回答 6 个关于宠物轮廓、肋骨和腰身的问题。每个答案对应 1–9 分数，最终 BCS 是平均值 — 按兽医技师的四舍五入方式处理。",
    methodP2: "这是筛查工具，不是临床诊断。如果不确定，兽医或合资格的技师可以在一分钟内完成触诊 BCS。",
    faqTitle: "常见问题",
    faqs: [
      { q: "狗狗和猫咪的 BCS 一样吗？", a: "量表相同（1–9，5 为理想），但视觉标记不同。猫咪的脊椎位置略高，健康猫咪有原始腹部囊袋（primordial pouch）是正常的 — 不是肥胖。" },
      { q: "BCS 和体重有什么分别？", a: "体重受骨架和肌肉影响。同样体重的两只狗狗可能 BCS 差很多。BCS 量度脂肪覆盖程度，这才是影响健康风险的因素。" },
      { q: "多久评估一次 BCS？", a: "健康成年宠物每月一次足够。减重计划中的宠物每周一次。生活变化后（绝育、生病、换粮）要重新评估。" },
      { q: "我宠物毛很厚，怎么判断？", a: "长毛宠物不能靠看。用手按平在肋骨上，感受：轻按就摸到肋骨 = BCS 约 5。" },
      { q: "某些品种天生较壮实吗？", a: "是的 — 八哥、斗牛犬、波斯猫、缅因猫骨架较壮。它们仍可以体态精瘦（BCS 5）而不显得「皮包骨」。和兽医讨论品种特定的理想标准。" },
    ],
    disclaimerTitle: "免责声明",
    disclaimer: "本测验是教育性筛查工具，并不取代兽医检查。突发体重变化、无精打采或食欲改变，无论 BCS 如何，都要看兽医。",
    questions: {
      dog: [
        { q: "从上面看你的狗狗。看到什么？", a: [
          { label: "腰身严重凹陷 — 臀骨突出", score: 1 },
          { label: "明显沙漏腰 — 轻微凹陷", score: 5 },
          { label: "腰身轻微弯曲 — 比肋骨宽", score: 6 },
          { label: "无腰身 — 直线或臀部较宽", score: 7 },
          { label: "圆滚滚，完全无腰身", score: 9 },
        ]},
        { q: "轻按你狗狗的肋骨（力度像手背轻贴）。", a: [
          { label: "肋骨和脊椎极度突出 — 无脂肪", score: 1 },
          { label: "轻按就摸到肋骨，脂肪极少", score: 4 },
          { label: "轻按可摸到肋骨", score: 5 },
          { label: "要用力才摸到肋骨（脂肪层）", score: 7 },
          { label: "完全摸不到肋骨", score: 9 },
        ]},
        { q: "从侧面看 — 肚子怎样？", a: [
          { label: "极度收紧 — 凹陷腹部", score: 1 },
          { label: "明显收紧 — 腹线急升", score: 5 },
          { label: "轻微收紧", score: 6 },
          { label: "无收紧 — 腹线平直", score: 7 },
          { label: "肚子低于胸线下垂", score: 9 },
        ]},
        { q: "脂肪在脊椎和臀部怎样分布？", a: [
          { label: "脊椎和臀骨清晰可见", score: 1 },
          { label: "脊椎可触但平滑覆盖", score: 5 },
          { label: "脊椎被脂肪层挡住难摸到", score: 7 },
          { label: "脊椎和臀部完全被脂肪掩埋", score: 9 },
        ]},
        { q: "尾巴根部、胸部或后腿有脂肪堆积吗？", a: [
          { label: "完全无脂肪 — 骨感", score: 1 },
          { label: "极少 — 平滑流线", score: 5 },
          { label: "中等脂肪垫", score: 7 },
          { label: "大量脂肪堆积，腹部下垂", score: 9 },
        ]},
        { q: "你狗狗散步时容易疲倦吗？", a: [
          { label: "活力十足，毫无疲态", score: 5 },
          { label: "比平时略慢", score: 6 },
          { label: "经常放慢或大口喘气", score: 7 },
          { label: "不愿意走或运动有困难", score: 9 },
        ]},
      ],
      cat: [
        { q: "从上面看你的猫咪。腰身怎样？", a: [
          { label: "严重内缩 — 骨头可见", score: 1 },
          { label: "明显沙漏形", score: 5 },
          { label: "轻微弯曲 — 比肋骨宽", score: 6 },
          { label: "两侧平直 — 无腰身", score: 7 },
          { label: "向外凸 — 比肋骨更宽", score: 9 },
        ]},
        { q: "轻按你猫咪的肋骨。", a: [
          { label: "肋骨极度突出，毫无脂肪层", score: 1 },
          { label: "轻薄脂肪层下易摸到肋骨", score: 5 },
          { label: "脂肪层下轻按可摸到肋骨", score: 6 },
          { label: "肋骨在脂肪下难摸到", score: 8 },
          { label: "完全摸不到肋骨", score: 9 },
        ]},
        { q: "从侧面看腹部怎样？", a: [
          { label: "腹部严重收紧 — 凹陷", score: 1 },
          { label: "轻微收紧 — 正常原始囊袋", score: 5 },
          { label: "无收紧 — 腹线平直", score: 7 },
          { label: "肚子下垂超过胸部", score: 9 },
        ]},
        { q: "猫咪站立时看脊椎。", a: [
          { label: "脊椎清晰可见", score: 1 },
          { label: "脊椎可触，平滑覆盖", score: 5 },
          { label: "脊椎被脂肪挡住难摸", score: 7 },
          { label: "脊椎完全埋在脂肪里", score: 9 },
        ]},
        { q: "有原始囊袋（小腹皮垂）吗？", a: [
          { label: "几乎没有 — 极度精瘦", score: 2 },
          { label: "小囊袋 — 健康猫咪正常表现", score: 5 },
          { label: "明显囊袋 — 脂肪延伸过肚脐", score: 7 },
          { label: "大型下垂腹部，严重囊袋", score: 9 },
        ]},
        { q: "理毛或跳跃有困难吗？", a: [
          { label: "正常理毛，跳跃轻松", score: 5 },
          { label: "略逊于以往", score: 6 },
          { label: "难以理背部或后腿", score: 8 },
          { label: "无法理毛 — 出现打结，拒绝跳跃", score: 9 },
        ]},
      ],
    },
  },
  es: {
    name: "Español",
    title: "Quiz de Condición Corporal (BCS) para Mascotas",
    subtitle: "Quiz visual al estilo veterinario que estima la condición corporal de tu mascota en la escala estándar 1–9. Obtén un puntaje, categoría y plan de acción.",
    reserveAd: "Espacio reservado para Google Ads",
    reserveAdSub: "Puedes insertar AdSense aquí más adelante.",
    adLabel: "Publicidad",
    adBadge: "Reservado",
    speciesQ: "¿Qué mascota vas a evaluar?",
    dog: "Perro",
    cat: "Gato",
    start: "Comenzar quiz",
    restart: "Reiniciar",
    questionOf: "Pregunta {n} de {total}",
    yourScore: "BCS de tu mascota",
    outOf: "/ 9",
    category: "Categoría de peso",
    catUnder: "Bajo peso",
    catIdeal: "Ideal",
    catOver: "Sobrepeso",
    catObese: "Obeso",
    summaryUnder: "Tu mascota está por debajo del peso ideal. Costillas, columna y caderas son visiblemente prominentes.",
    summaryIdeal: "Tu mascota tiene un peso saludable. Las costillas se palpan con presión ligera; cintura visible desde arriba.",
    summaryOver: "Tu mascota tiene grasa extra. Las costillas son difíciles de palpar; cintura poco definida.",
    summaryObese: "Tu mascota tiene sobrepeso significativo. El exceso de grasa aumenta el riesgo de diabetes, artritis y reduce la esperanza de vida.",
    actionTitle: "Plan de acción recomendado",
    actionUnder: "Que un veterinario descarte parásitos, enfermedad dental o crónica. Aumenta a 3 comidas/día con alimento denso en calorías.",
    actionIdeal: "Mantén el ritmo actual. Re-evalúa BCS cada 2–3 meses.",
    actionOver: "Reduce los premios a <5% de calorías diarias. Reduce porciones ~10% y aumenta paseos/juego. Re-evalúa BCS mensualmente.",
    actionObese: "Agenda una visita veterinaria. Necesitas un plan estructurado de pérdida de peso (típicamente 1% del peso por semana). Evita dietas extremas — pueden causar lipidosis hepática, especialmente en gatos.",
    vetTitle: "Recomendación de visita veterinaria",
    vetUnder: "Sí — ve al vet en 1–2 semanas para investigar la causa.",
    vetIdeal: "El chequeo anual de rutina es suficiente.",
    vetOver: "Discútelo en la próxima visita rutinaria. Sin urgencia salvo otros síntomas.",
    vetObese: "Agenda una consulta dedicada de manejo de peso este mes.",
    relatedTitle: "Herramientas relacionadas",
    searchTools: "Buscar herramientas",
    aboutTitle: "Sobre la escala BCS 1–9",
    aboutP1: "El Body Condition Score (BCS) es el estándar veterinario para evaluar si una mascota está baja de peso, ideal o con sobrepeso, sin una báscula. Desarrollado por Purina y adoptado por AAHA, WSAVA y la mayoría de hospitales veterinarios, va de 1 (caquéctico) a 9 (obesidad mórbida), con 4–5 como ideal.",
    aboutP2: "A diferencia del peso solo, BCS ajusta por raza, estructura ósea y músculo — un Galgo de 30 kg y un Bulldog de 30 kg pueden estar en condiciones muy distintas. El puntaje se construye con tres revisiones manuales: costillas, cintura (desde arriba) y abdomen (desde el lado).",
    methodTitle: "Cómo funciona el quiz",
    methodP1: "Responderás seis preguntas visuales cortas sobre la silueta, costillas y cintura de tu mascota. Cada respuesta mapea a un sub-puntaje 1–9, y el BCS final es el promedio — redondeado al estilo veterinario.",
    methodP2: "Esto es una herramienta de cribado, no un diagnóstico clínico. Si tienes dudas, un veterinario o técnico calificado puede hacer un BCS manual en menos de un minuto.",
    faqTitle: "Preguntas frecuentes",
    faqs: [
      { q: "¿El BCS es igual para perros y gatos?", a: "La escala es igual (1–9, con 5 como ideal), pero los puntos de referencia visuales difieren. Los gatos tienen la columna un poco más alta, y la bolsa abdominal primordial en gatos sanos es normal — no es obesidad." },
      { q: "¿Cuál es la diferencia entre BCS y peso?", a: "El peso depende del tamaño y la musculatura. Dos perros con el mismo peso pueden tener BCS muy distintos. BCS mide cobertura de grasa, que es lo que importa para el riesgo de salud." },
      { q: "¿Con qué frecuencia debo revisar el BCS?", a: "Mensualmente para adultos sanos. Semanalmente si está en plan de pérdida de peso. Reevalúa tras cambios de vida (esterilización, enfermedad, nueva dieta)." },
      { q: "Mi mascota es muy peluda — ¿cómo evalúo?", a: "No confíes en la vista para mascotas de pelo largo. Usa las manos. Presiona plano sobre las costillas: si las encuentras con presión ligera = BCS ~5." },
      { q: "¿Hay razas más robustas por naturaleza?", a: "Sí — Pugs, Bulldogs, Persas y Maine Coons tienen estructuras más robustas. Aun así pueden estar magros (BCS 5) sin parecer 'flacos'. Habla con un vet sobre ideales ajustados por raza." },
    ],
    disclaimerTitle: "Aviso",
    disclaimer: "Este quiz es una herramienta educativa de cribado. No reemplaza un examen veterinario. Cambios bruscos de peso, letargia o cambios de apetito merecen una visita al vet sin importar el BCS.",
    questions: {
      dog: [
        { q: "Mira a tu perro desde arriba. ¿Qué ves?", a: [
          { label: "Cintura muy marcada — caderas sobresalen", score: 1 },
          { label: "Cintura en reloj de arena — leve hundimiento", score: 5 },
          { label: "Ligera curva en cintura — más ancha que costillas", score: 6 },
          { label: "Sin cintura — recta o más ancha en caderas", score: 7 },
          { label: "Redondo, sin cintura visible", score: 9 },
        ]},
        { q: "Palpa las costillas de tu perro (presión ligera).", a: [
          { label: "Costillas y columna muy prominentes — sin grasa", score: 1 },
          { label: "Costillas se palpan con mínima grasa", score: 4 },
          { label: "Costillas palpables con presión ligera", score: 5 },
          { label: "Costillas palpables sólo con presión firme", score: 7 },
          { label: "Costillas difíciles o imposibles de palpar", score: 9 },
        ]},
        { q: "Mira a tu perro de lado — ¿el vientre?", a: [
          { label: "Muy retraído — vientre hundido", score: 1 },
          { label: "Retracción clara — línea ventral sube", score: 5 },
          { label: "Leve retracción", score: 6 },
          { label: "Sin retracción — línea ventral recta", score: 7 },
          { label: "Vientre cuelga bajo el pecho", score: 9 },
        ]},
        { q: "¿Cómo se distribuye la grasa sobre columna y caderas?", a: [
          { label: "Vértebras y caderas visibles", score: 1 },
          { label: "Columna palpable pero suavemente cubierta", score: 5 },
          { label: "Columna difícil de palpar bajo grasa", score: 7 },
          { label: "Columna y caderas enterradas en grasa", score: 9 },
        ]},
        { q: "¿Hay depósitos de grasa en cola, pecho o muslos?", a: [
          { label: "Sin grasa — huesudo", score: 1 },
          { label: "Mínima — silueta lisa", score: 5 },
          { label: "Almohadillas de grasa moderadas", score: 7 },
          { label: "Depósitos pesados, vientre colgante", score: 9 },
        ]},
        { q: "¿Tu perro se cansa fácil en paseos normales?", a: [
          { label: "Energético, sin signos de cansancio", score: 5 },
          { label: "Algo más lento que de costumbre", score: 6 },
          { label: "Se enlentece o jadea con frecuencia", score: 7 },
          { label: "Reluctante a caminar o le cuesta hacer ejercicio", score: 9 },
        ]},
      ],
      cat: [
        { q: "Mira a tu gato desde arriba. ¿Cómo se ve la cintura?", a: [
          { label: "Muy retraída — huesos visibles", score: 1 },
          { label: "Reloj de arena claro", score: 5 },
          { label: "Curva leve — más ancha que costillas", score: 6 },
          { label: "Lados rectos — sin cintura", score: 7 },
          { label: "Hacia afuera — más ancho que costillas", score: 9 },
        ]},
        { q: "Palpa las costillas de tu gato.", a: [
          { label: "Costillas muy prominentes, sin grasa", score: 1 },
          { label: "Fácilmente palpables con grasa fina", score: 5 },
          { label: "Palpables con presión ligera bajo grasa", score: 6 },
          { label: "Difícil palpar bajo la grasa", score: 8 },
          { label: "No se palpan", score: 9 },
        ]},
        { q: "¿Cómo se ve el abdomen de lado?", a: [
          { label: "Retracción severa — hundido", score: 1 },
          { label: "Leve retracción — bolsa primordial normal", score: 5 },
          { label: "Sin retracción — línea recta", score: 7 },
          { label: "Vientre péndulo cuelga bajo el pecho", score: 9 },
        ]},
        { q: "Mira la columna cuando tu gato está de pie.", a: [
          { label: "Vértebras claramente visibles", score: 1 },
          { label: "Columna palpable con cubierta suave", score: 5 },
          { label: "Columna difícil de palpar por la grasa", score: 7 },
          { label: "Columna completamente enterrada en grasa", score: 9 },
        ]},
        { q: "¿Tiene bolsa primordial (pequeña piel abdominal)?", a: [
          { label: "Casi nada — muy magro", score: 2 },
          { label: "Bolsa pequeña — normal en gato sano", score: 5 },
          { label: "Bolsa pronunciada — grasa pasa el ombligo", score: 7 },
          { label: "Abdomen grande, péndulo y bolsa marcada", score: 9 },
        ]},
        { q: "¿Le cuesta acicalarse o saltar?", a: [
          { label: "Acicalado normal, salta con facilidad", score: 5 },
          { label: "Ligeramente menos ágil", score: 6 },
          { label: "Dificultad acicalando espalda o trasero", score: 8 },
          { label: "No puede acicalarse — pelo enmarañado, no salta", score: 9 },
        ]},
      ],
    },
  },
} as const;

const TOOLS = [
  { title: { en: "Pet Calorie Calculator", "zh-hk": "寵物卡路里計算機", "zh-cn": "宠物卡路里计算器", es: "Calculadora de calorías para mascotas" }, description: { en: "Daily calorie needs.", "zh-hk": "貓狗每日卡路里需求。", "zh-cn": "猫狗每日卡路里需求。", es: "Necesidades calóricas diarias." }, href: "/pet-calorie-calculator", keywords: ["calorie", "rer"] },
  { title: { en: "Puppy Adult Weight Predictor", "zh-hk": "幼犬成年體重預測器", "zh-cn": "幼犬成年体重预测器", es: "Predictor de peso adulto del cachorro" }, description: { en: "Estimate puppy adult weight.", "zh-hk": "預測幼犬成年體重。", "zh-cn": "预测幼犬成年体重。", es: "Estima el peso adulto del cachorro." }, href: "/puppy-adult-weight-calculator", keywords: ["puppy", "weight"] },
  { title: { en: "Can My Dog Eat This?", "zh-hk": "狗狗可以食呢樣嗎？", "zh-cn": "狗狗可以吃这个吗？", es: "¿Mi perro puede comer esto?" }, description: { en: "Food safety lookup.", "zh-hk": "查食物安唔安全畀狗。", "zh-cn": "查食物是否安全给狗。", es: "Búsqueda de seguridad alimentaria." }, href: "/can-my-dog-eat", keywords: ["food", "dog"] },
  { title: { en: "Can My Cat Eat This?", "zh-hk": "貓貓可以食咩？", "zh-cn": "猫咪能吃什么？", es: "¿Puede mi gato comer esto?" }, description: { en: "Food safety for cats.", "zh-hk": "貓貓食物安全查詢。", "zh-cn": "猫咪食物安全查询。", es: "Seguridad alimentaria felina." }, href: "/can-my-cat-eat", keywords: ["food", "cat"] },
  { title: { en: "Dog Age in Human Years", "zh-hk": "狗狗年齡換算（人類年齡）", "zh-cn": "狗狗年龄换算（人类年龄）", es: "Edad de perro en años humanos" }, description: { en: "UCSD age formula.", "zh-hk": "用 UCSD 公式計狗年齡。", "zh-cn": "用 UCSD 公式计算狗年龄。", es: "Fórmula UCSD." }, href: "/dog-age-calculator", keywords: ["dog", "age"] },
  { title: { en: "Cat Age in Human Years", "zh-hk": "貓貓年齡換算（人類年齡）", "zh-cn": "猫咪年龄换算（人类年龄）", es: "Edad de gato en años humanos" }, description: { en: "Cat age conversion.", "zh-hk": "貓年齡換算人類年齡。", "zh-cn": "猫年龄换算人类年龄。", es: "Conversión de edad felina." }, href: "/cat-age-calculator", keywords: ["cat", "age"] },
];

const SITE_URL = "https://pets.tinytoolboxes.com";
const PAGE_PATH = "/pet-body-condition-score";

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
  prop("og:title", o.title); prop("og:description", o.description); prop("og:url", url); prop("og:type", "website"); prop("og:site_name", "TinyToolboxes for Pets");
  meta("twitter:card", "summary"); meta("twitter:title", o.title); meta("twitter:description", o.description);
  const old = head.querySelectorAll('script[type="application/ld+json"][data-ttb]');
  old.forEach((n) => n.remove());
  if (o.jsonLd) { const arr = Array.isArray(o.jsonLd) ? o.jsonLd : [o.jsonLd]; arr.forEach((data) => { const s = document.createElement("script"); s.setAttribute("type", "application/ld+json"); s.setAttribute("data-ttb", ""); s.textContent = JSON.stringify(data); head.appendChild(s); }); }
}

type LocaleKey = keyof typeof LANGUAGES;
type Species = "dog" | "cat";

function categorize(bcs: number, content: typeof LANGUAGES["en"]) {
  if (bcs <= 3) return { key: "under" as const, label: content.catUnder, summary: content.summaryUnder, action: content.actionUnder, vet: content.vetUnder, style: "border-amber-500/30 bg-amber-500/10 text-amber-200" };
  if (bcs <= 5) return { key: "ideal" as const, label: content.catIdeal, summary: content.summaryIdeal, action: content.actionIdeal, vet: content.vetIdeal, style: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200" };
  if (bcs <= 6) return { key: "over" as const, label: content.catOver, summary: content.summaryOver, action: content.actionOver, vet: content.vetOver, style: "border-orange-500/30 bg-orange-500/10 text-orange-200" };
  return { key: "obese" as const, label: content.catObese, summary: content.summaryObese, action: content.actionObese, vet: content.vetObese, style: "border-red-500/40 bg-red-500/10 text-red-200" };
}

export default function PetBodyConditionScore() {
  const [locale, setLocale] = useState<LocaleKey>(() => typeof window === "undefined" ? "en" : ((window.localStorage.getItem("ttb-locale") as LocaleKey) || "en"));
  const [species, setSpecies] = useState<Species | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [search, setSearch] = useState("");

  const content = LANGUAGES[locale];

  useEffect(() => {
    document.documentElement.lang = locale === "zh-hk" ? "zh-Hant-HK" : locale === "zh-cn" ? "zh-Hans-CN" : locale;
    window.localStorage.setItem("ttb-locale", locale);
    applySEO({ title: `${content.title} | TinyToolboxes`, description: content.subtitle, path: PAGE_PATH, jsonLd: [{ "@context": "https://schema.org", "@type": "WebApplication", name: content.title, url: SITE_URL + PAGE_PATH, description: content.subtitle, applicationCategory: "HealthApplication", operatingSystem: "Web", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, publisher: { "@type": "Organization", name: "TinyToolboxes", url: SITE_URL } }, { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: LANGUAGES[locale].faqs.map((item: {q: string; a: string}) => ({ "@type": "Question", name: item.q, acceptedAnswer: { "@type": "Answer", text: item.a } })) }] });
  }, [locale, content.title, content.subtitle]);

  const questions = species ? content.questions[species] : [];
  const currentIdx = answers.length;
  const done = species && currentIdx >= questions.length;

  const finalScore = useMemo(() => {
    if (!answers.length) return null;
    const avg = answers.reduce((s, n) => s + n, 0) / answers.length;
    return Math.round(avg * 10) / 10;
  }, [answers]);

  const result = (done && finalScore !== null) ? categorize(finalScore, content as typeof LANGUAGES["en"]) : null;

  const reset = () => { setSpecies(null); setAnswers([]); };

  const hints = locale === "zh-hk" ? ["卡路里", "幼犬", "食物", "年齡"] : locale === "zh-cn" ? ["卡路里", "幼犬", "食物", "年龄"] : locale === "es" ? ["calorías", "cachorro", "comida", "edad"] : ["calorie", "puppy", "food", "age"];
  const filteredTools = useMemo(() => { const q = search.trim().toLowerCase(); if (!q) return TOOLS; return TOOLS.filter((t) => `${t.title[locale]} ${t.description[locale]} ${t.keywords.join(" ")}`.toLowerCase().includes(q)); }, [search, locale]);

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10 lg:px-8">
        <div className="flex flex-col gap-4 border-b border-amber-400/15 pb-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-400/15 ring-1 ring-amber-300/20"><Scale className="h-5 w-5 text-amber-300" /></div>
            <div><p className="text-sm uppercase tracking-[0.3em] text-amber-300/80">TinyToolboxes · Pet</p><h1 className="text-xl font-semibold">{content.title}</h1></div>
          </div>
          <div className="flex flex-wrap gap-2">{(Object.keys(LANGUAGES) as LocaleKey[]).map((key) => <button key={key} onClick={() => setLocale(key)} className={`rounded-full border px-3 py-2 text-sm transition ${locale === key ? "border-amber-400/70 bg-amber-400/15 text-amber-200" : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"}`}>{LANGUAGES[key].name}</button>)}</div>
        </div>

        <div className="grid flex-1 gap-8 py-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <div className="space-y-8">
            <div className="max-w-3xl space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-2 text-sm text-amber-200"><BadgeDollarSign className="h-4 w-4" />{content.reserveAd}</div>
              <div className="space-y-4"><h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">{content.title}</h2><p className="max-w-2xl text-base leading-7 text-white/70 sm:text-lg">{content.subtitle}</p></div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-6">
              {!species && (
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-amber-300/80">{content.speciesQ}</p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <button onClick={() => setSpecies("dog")} className="flex items-center gap-3 rounded-2xl border border-amber-400/30 bg-amber-400/5 p-5 text-left transition hover:border-amber-300/60 hover:bg-amber-400/10">
                      <Dog className="h-8 w-8 text-amber-300" />
                      <div><p className="text-lg font-semibold text-white">{content.dog}</p><p className="text-xs text-white/55">{content.start}</p></div>
                    </button>
                    <button onClick={() => setSpecies("cat")} className="flex items-center gap-3 rounded-2xl border border-amber-400/30 bg-amber-400/5 p-5 text-left transition hover:border-amber-300/60 hover:bg-amber-400/10">
                      <Cat className="h-8 w-8 text-amber-300" />
                      <div><p className="text-lg font-semibold text-white">{content.cat}</p><p className="text-xs text-white/55">{content.start}</p></div>
                    </button>
                  </div>
                </div>
              )}

              {species && !done && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-amber-300/80">{content.questionOf.replace("{n}", String(currentIdx + 1)).replace("{total}", String(questions.length))}</p>
                    <button onClick={reset} className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60 transition hover:bg-white/10"><RotateCcw className="h-3 w-3" />{content.restart}</button>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                    <div className="h-full bg-gradient-to-r from-amber-300 to-orange-400 transition-all" style={{ width: `${((currentIdx) / questions.length) * 100}%` }} />
                  </div>
                  <h3 className="text-xl font-semibold text-white">{questions[currentIdx].q}</h3>
                  <div className="grid gap-2">
                    {questions[currentIdx].a.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => setAnswers([...answers, opt.score])}
                        className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-left text-sm text-white/80 transition hover:border-amber-300/40 hover:bg-amber-400/5 hover:text-amber-100"
                      >
                        <span>{opt.label}</span>
                        <ArrowRight className="h-4 w-4 shrink-0 text-white/35" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {done && result && finalScore !== null && (
                <div className="space-y-5">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 p-5 text-neutral-900">
                      <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-75">{content.yourScore}</p>
                      <p className="mt-2 text-6xl font-bold">{finalScore}<span className="text-2xl opacity-60">{content.outOf}</span></p>
                    </div>
                    <div className={`rounded-2xl border p-5 ${result.style}`}>
                      <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-75">{content.category}</p>
                      <p className="mt-2 text-3xl font-bold">{result.label}</p>
                      <p className="mt-3 text-sm opacity-85">{result.summary}</p>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/55">{content.actionTitle}</p>
                    <p className="mt-2 text-sm leading-6 text-white/85">{result.action}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/55">{content.vetTitle}</p>
                    <p className="mt-2 text-sm leading-6 text-white/85">{result.vet}</p>
                  </div>
                  <button onClick={reset} className="inline-flex items-center gap-2 rounded-2xl border border-amber-400/40 bg-amber-400/10 px-4 py-2 text-sm font-medium text-amber-200 transition hover:bg-amber-400/20">
                    <RotateCcw className="h-4 w-4" />{content.restart}
                  </button>
                </div>
              )}
            </div>

            <section className="rounded-3xl border border-white/10 bg-black/20 p-4">
              <label className="block space-y-2"><span className="text-sm font-medium text-white/80">{content.searchTools}</span>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3"><Check className="h-4 w-4 text-amber-300" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="calorie, age, food" className="w-full bg-transparent text-sm text-white placeholder:text-white/35 outline-none" /></div>
              </label>
              <div className="mt-3 flex flex-wrap gap-2">{hints.map((h) => <button key={h} type="button" onClick={() => setSearch(h)} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 hover:bg-white/10 transition">{h}</button>)}</div>
              <div className="mt-4 grid gap-2">{filteredTools.map((t) => <a key={t.href} href={t.href} className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left transition hover:border-amber-300/30 hover:bg-white/10"><div><p className="text-sm font-medium text-white">{t.title[locale]}</p><p className="mt-1 text-xs text-white/55">{t.description[locale]}</p></div><ArrowRight className="h-4 w-4 shrink-0 text-white/35" /></a>)}</div>
            </section>

            <article className="space-y-8 rounded-3xl border border-white/10 bg-white/5 p-6 text-white/80">
              <div>
                <h2 className="text-2xl font-bold text-white">{content.aboutTitle}</h2>
                <p className="mt-3 leading-7">{content.aboutP1}</p>
                <p className="mt-3 leading-7">{content.aboutP2}</p>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{content.methodTitle}</h2>
                <p className="mt-3 leading-7">{content.methodP1}</p>
                <p className="mt-3 leading-7">{content.methodP2}</p>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{content.faqTitle}</h2>
                <div className="mt-4 space-y-5">
                  {content.faqs.map((faq, i) => (
                    <div key={i}>
                      <h3 className="font-semibold text-white">{faq.q}</h3>
                      <p className="mt-1 text-white/70">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-amber-400/30 bg-amber-400/5 p-4 text-sm text-amber-100/85">
                <strong className="text-amber-200">{content.disclaimerTitle}:</strong> {content.disclaimer}
              </div>
            </article>

            <section className="rounded-3xl border border-dashed border-white/15 bg-white/5 p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.28em] text-amber-300/80">{content.adLabel}</p>
                  <p className="mt-1 text-sm text-white/55">{content.reserveAdSub}</p>
                </div>
                <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-white/35">{content.adBadge}</span>
              </div>
              <div className="mt-4 min-h-[120px] rounded-2xl border border-white/10 bg-black/20" />
            </section>
          </div>

          <aside className="space-y-6 rounded-3xl border border-amber-400/15 bg-amber-400/5 p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-amber-400/15 p-3"><Scale className="h-5 w-5 text-amber-300" /></div>
              <div>
                <h2 className="text-lg font-semibold">{content.aboutTitle}</h2>
                <p className="text-sm text-amber-100/80">BCS 1–9</p>
              </div>
            </div>
            <div className="space-y-2 text-sm text-amber-100/80">
              <p className="rounded-2xl border border-amber-500/20 bg-black/30 px-4 py-3"><strong className="text-amber-200">1–3:</strong> {content.catUnder}</p>
              <p className="rounded-2xl border border-emerald-500/20 bg-black/30 px-4 py-3"><strong className="text-emerald-200">4–5:</strong> {content.catIdeal} ✓</p>
              <p className="rounded-2xl border border-orange-500/20 bg-black/30 px-4 py-3"><strong className="text-orange-200">6:</strong> {content.catOver}</p>
              <p className="rounded-2xl border border-red-500/20 bg-black/30 px-4 py-3"><strong className="text-red-200">7–9:</strong> {content.catObese}</p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

import { useEffect, useMemo, useState } from "react";
import { ArrowRight, BadgeDollarSign, Clock, Search } from "lucide-react";

const LANGUAGES = {
  en: {
    name: "English",
    title: "Time Zone Converter",
    subtitle: "Convert times between time zones.",
    reserveAd: "Ad",
    timeLabel: "Time",
    fromLabel: "From",
    resultLabel: "Result",
    searchLabel: "Search",
    searchPlaceholder: "Search tools...",
    now: "Now",
    remove: "Remove",
    addZone: "Add zone",
    adLabel: "Ad",
    reserveAdSub: "Ad",
    adBadge: "Ad",
    useCasesHead: "Use cases",
    useCasesSub: "Time across the world.",
    useCase1: "Schedule meetings across time zones.",
    useCase2: "Plan international calls and webinars.",
    useCase3: "Track deadlines in different countries.",
    sec1Head: "How Time Zones Work",
    sec1P1: "The Earth rotates 360 degrees every 24 hours, which means it moves 15 degrees per hour. This is the basis for the 24 primary time zones that divide the planet: each zone spans roughly 15 degrees of longitude. Move one zone east and you gain one hour; move one zone west and you lose one hour.",
    sec1P2: "The global reference point is UTC — Coordinated Universal Time. UTC is the successor to Greenwich Mean Time (GMT) and is maintained by atomic clocks. All other time zones are expressed as offsets from UTC. New York in winter runs at UTC−5 (Eastern Standard Time), London in winter is UTC+0 (GMT), India is UTC+5:30, and Hong Kong is UTC+8 year-round.",
    sec1P3: "Before 1884, there was no global time standard. Every city kept its own solar time, set by when the sun reached its highest point locally. When railways began connecting cities in the 19th century, the patchwork of local times made timetables nearly impossible to manage. The International Meridian Conference of 1884 designated the Prime Meridian at Greenwich, England, as the reference longitude for global time, giving rise to the modern time zone system. Today, the precise boundaries of time zones are determined by national and regional governments, which is why real-world zones are far from neat 15-degree wedges.",
    sec2Head: "UTC Offsets and Key Time Zones",
    sec2Intro: "Here is a reference table of major time zones and their standard UTC offsets. Note that offsets change during Daylight Saving Time for the regions that observe it.",
    thAbbr: "Abbreviation",
    thOffset: "UTC Offset",
    thRegion: "Region / City",
    sec3Head: "Daylight Saving Time (DST)",
    sec3P1: "Daylight Saving Time is the practice of advancing clocks by one hour in spring and setting them back one hour in autumn. The idea is to shift daylight hours into the evening during summer months, reducing the need for artificial lighting. The phrase \"spring forward, fall back\" captures the pattern: clocks move forward one hour in spring and back one hour in autumn.",
    sec3P2: "Regions that observe DST include the United States, Canada, most of Europe, parts of Australia, and several other countries. In the US, clocks change on the second Sunday of March (spring forward) and the first Sunday of November (fall back). In the European Union, the change happens on the last Sunday of March and the last Sunday of October.",
    sec3P3: "Many major regions do not observe DST at all. China, Japan, India, most of Africa, and the US state of Arizona (except the Navajo Nation) stay on a fixed UTC offset year-round. This creates a scheduling complication: a meeting set for \"3:00 PM EST\" in December is actually a different UTC time than a meeting set for \"3:00 PM EDT\" in July, even though the local clock reads the same. When scheduling international meetings months in advance, always confirm whether clocks will have changed by the meeting date.",
    sec4Head: "Practical Tips for International Scheduling",
    sec4Tip1: "Always anchor to UTC when in doubt.",
    sec4Tip1Body: "Server logs, APIs, databases, and distributed systems should store and communicate timestamps in UTC. Converting to local time is a display concern; storing in UTC ensures there is never ambiguity about when something happened.",
    sec4Tip2: "Confirm both the time zone and the date.",
    sec4Tip2Body: "When scheduling across the International Date Line, the calendar date changes. A 10:00 AM Thursday call in New York is a 11:00 PM Thursday call in London, but a 11:00 PM Thursday call becomes a 10:00 AM Friday call in Tokyo. Always share the date alongside the time.",
    sec4Tip3: "Check DST status when scheduling ahead.",
    sec4Tip3Body: "If you are scheduling a recurring weekly call that spans months, verify whether a DST transition will shift the meeting time. A call that works at 9:00 AM EST in winter might become 8:00 AM EST after clocks spring forward — or 10:00 AM local time for participants in a non-DST country.",
    sec4Tip4: "Understand the International Date Line (IDL).",
    sec4Tip4Body: "The IDL runs roughly along the 180th meridian in the Pacific Ocean. Crossing it westward (toward Asia) advances the calendar by one day; crossing it eastward (toward the Americas) sets the calendar back one day. This is why flights from Los Angeles to Sydney sometimes seem to \"lose a day.\"",
    sec5Head: "Common Mistakes When Converting Time Zones",
    sec5Mistake1: "Forgetting Daylight Saving Time.",
    sec5Mistake1Body: "The most common mistake. EST (UTC−5) and EDT (UTC−4) are both \"Eastern Time,\" but they differ by an hour. Always check whether DST is currently in effect for your target region.",
    sec5Mistake2: "Confusing abbreviations that are reused.",
    sec5Mistake2Body: "CST can mean Central Standard Time (UTC−6 in the US) or China Standard Time (UTC+8). IST can mean India Standard Time (UTC+5:30), Irish Standard Time (UTC+1), or Israel Standard Time (UTC+2). When in doubt, use full IANA timezone names like America/Chicago or Asia/Kolkata instead of abbreviations.",
    sec5Mistake3: "Ignoring half-hour and 45-minute offsets.",
    sec5Mistake3Body: "Not all time zones are whole-hour offsets from UTC. India Standard Time is UTC+5:30. Nepal Time is UTC+5:45. Iran Standard Time is UTC+3:30. Australian Central Standard Time is UTC+9:30. These fractional offsets trip up tools that assume whole-hour increments.",
    sec5Mistake4: "Using GMT when you mean UTC.",
    sec5Mistake4Body: "GMT and UTC are nearly identical in everyday use, but GMT is technically an astronomical time standard that can vary slightly due to Earth's rotation. UTC is maintained by atomic clocks and is always precise. For technical systems, always use UTC.",
    faqHead: "Frequently Asked Questions",
    faqQ1: "What is the difference between GMT and UTC?",
    faqA1: "GMT (Greenwich Mean Time) is an astronomical time standard based on Earth's rotation relative to the sun. UTC (Coordinated Universal Time) is a precise atomic time standard that is occasionally adjusted with leap seconds to stay close to GMT. In everyday use they are essentially the same, but for technical and scientific purposes, UTC is the correct reference. All modern programming systems use UTC internally.",
    faqQ2: "Which countries have the most time zones?",
    faqA2: "France has the most time zones of any country — 12 — because it includes numerous overseas territories spread across the globe. Russia has 11 time zones across its vast land area. The United States has 6 standard time zones (including Alaska and Hawaii), or up to 9 when counting all territories and uninhabited islands.",
    faqQ3: "Why does India use a half-hour offset (UTC+5:30)?",
    faqA3: "India chose UTC+5:30 as a compromise so that the entire country could operate on a single time zone despite spanning about 30 degrees of longitude — a span that would normally warrant two or three zones. The half-hour offset was set to better align local solar time with the clock. Similarly, Nepal chose UTC+5:45 to differentiate itself from neighboring India while staying close to its solar noon.",
    faqQ4: "What is the International Date Line?",
    faqA4: "The International Date Line (IDL) is an imaginary line running from the North Pole to the South Pole along roughly the 180th meridian in the Pacific Ocean. It is where one calendar day ends and the next begins. Crossing the IDL westward (Asia/Pacific direction) moves you one calendar day forward; crossing it eastward (Americas direction) moves you one calendar day back. The IDL is not perfectly straight — it deviates around island nations so they share the same calendar date with their closest neighbors.",
    faqQ5: "How do I convert time zones for a meeting across the US and Hong Kong?",
    faqA5: "Hong Kong is UTC+8 year-round (no DST). New York is UTC−5 in winter (EST) and UTC−4 in summer (EDT). The difference is 13 hours in winter and 12 hours in summer. A 9:00 AM Monday meeting in New York EST corresponds to 10:00 PM Monday in Hong Kong. Use this converter to handle the exact dates and DST status automatically — simply enter the meeting time, select the source zone, and add Hong Kong as a target zone.",
  },
  "zh-hk": {
    name: "繁體中文",
    title: "時區轉換器",
    subtitle: "在不同時區之間轉換時間。",
    reserveAd: "廣告",
    timeLabel: "時間",
    fromLabel: "從",
    resultLabel: "結果",
    searchLabel: "搜尋",
    searchPlaceholder: "搜尋工具...",
    now: "現在",
    remove: "移除",
    addZone: "新增時區",
    adLabel: "廣告",
    reserveAdSub: "廣告",
    adBadge: "廣告",
    useCasesHead: "使用案例",
    useCasesSub: "全球時間。",
    useCase1: "安排跨時區的會議。",
    useCase2: "計劃國際通話和網絡研討會。",
    useCase3: "追蹤不同國家的截止日期。",
    sec1Head: "時區如何運作",
    sec1P1: "地球每 24 小時旋轉 360 度，意味著它每小時移動 15 度。這是 24 個主要時區劃分地球的基礎：每個時區大約跨越 15 度經度。向東移動一個時區，你會多出一小時；向西移動一個時區，你會少出一小時。",
    sec1P2: "全球參考點是 UTC — 協調世界時。UTC 是格林威治標準時間（GMT）的繼承者，並由原子鐘維護。所有其他時區都以 UTC 為基準表示偏移。紐約在冬季運行於 UTC−5（東部標準時間），倫敦在冬季是 UTC+0（GMT），印度是 UTC+5:30，而香港全年是 UTC+8。",
    sec1P3: "在 1884 年之前，沒有全球時間標準。每個城市都保持自己的太陽時，由太陽到達當地最高點的時間設定。當鐵路在 19 世紀開始連接城市時，各地時間的拼貼使得時刻表幾乎無法管理。1884 年的國際經度會議指定格林威治（英國）的零度經線作為全球時間的參考經度，從而產生了現代時區系統。今天，時區的精確邊界由國家和地區政府決定，這就是為什麼現實世界的時區遠非整齊的 15 度楔形。",
    sec2Head: "UTC 偏移和主要時區",
    sec2Intro: "這裡是一個主要時區及其標準 UTC 偏移的參考表。注意，偏移量在夏令時間期間會變化，適用於觀察夏令時間的地區。",
    thAbbr: "縮寫",
    thOffset: "UTC 偏移",
    thRegion: "地區 / 城市",
    sec3Head: "夏令時間（DST）",
    sec3P1: "夏令時間是春季將時鐘向前調一小時，秋季將時鐘向後調一小時的做法。其目的是將白天的時間移到夏季晚上的時段，減少對人工照明的需求。\"春季向前，秋季向後\"這句話捕捉了這種模式：時鐘在春季向前調一小時，秋季向後調一小時。",
    sec3P2: "觀察夏令時間的地區包括美國、加拿大、歐洲大部分地區、澳大利亞部分地區以及幾個其他國家。在美國，時鐘在三月第二個星期日（春季向前）和十一月第一個星期日（秋季向後）改變。在歐盟，改變發生在三月最後一個星期日和十月最後一個星期日。",
    sec3P3: "許多主要地區完全不觀察夏令時間。中國、日本、印度、非洲大部分地區以及美國亞利桑那州（納瓦霍部落除外）全年保持固定的 UTC 偏移。這會造成排程上的複雜性：在十二月設定為 \"下午 3:00 EST\" 的會議，實際上與七月設定為 \"下午 3:00 EDT\" 的會議是不同的 UTC 時間，即使當地時鐘顯示相同。當提前數月安排國際會議時，務必確認時鐘在會議日期是否會改變。",
    sec4Head: "國際排程的實用建議",
    sec4Tip1: "有疑問時，始終以 UTC 為基準。",
    sec4Tip1Body: "伺服器日誌、API、資料庫和分佈式系統應儲存並溝通 UTC 時間戳。轉換為當地時間是顯示問題；儲存於 UTC 確保永遠不會有關於事件發生時間的歧義。",
    sec4Tip2: "確認時區和日期。",
    sec4Tip2Body: "當跨越國際日期線安排時，日曆日期會改變。紐約在星期四上午 10:00 的通話，在倫敦是星期四晚上 11:00，但在東京則是星期五上午 10:00。始終與時間一起分享日期。",
    sec4Tip3: "安排時請檢查夏令時間狀態。",
    sec4Tip3Body: "如果你安排的是跨越數月的每週重複通話，請確認夏令時間轉換是否會改變會議時間。在冬季，一個在上午 9:00 EST 有效的通話，可能在時鐘春季向前後變成上午 8:00 EST，或對於非夏令時間國家的參與者來說，是當地時間上午 10:00。",
    sec4Tip4: "了解國際日期線（IDL）。",
    sec4Tip4Body: "國際日期線大致沿著太平洋的 180 度經線運行。向西跨越（朝向亞洲）會使日曆向前推進一天；向东跨越（朝向美洲）會使日曆向後退回一天。這就是為什麼從洛杉磯飛往悉尼的航班有時似乎會\"失去一天\"。",
    sec5Head: "轉換時區常見錯誤",
    sec5Mistake1: "忘記夏令時間。",
    sec5Mistake1Body: "最常見的錯誤。EST（UTC−5）和 EDT（UTC−4）都是\"東部時間\"，但兩者相差一小時。務必確認夏令時間是否對你的目標地區生效。",
    sec5Mistake2: "混淆重複使用的縮寫。",
    sec5Mistake2Body: "CST 可能指中央標準時間（美國 UTC−6）或中國標準時間（UTC+8）。IST 可能指印度標準時間（UTC+5:30）、愛爾蘭標準時間（UTC+1）或以色列標準時間（UTC+2）。有疑問時，請使用完整的 IANA 時區名稱，例如 America/Chicago 或 Asia/Kolkata，而不是縮寫。",
    sec5Mistake3: "忽略半小時和 45 分鐘偏移。",
    sec5Mistake3Body: "並非所有時區都是整小時的 UTC 偏移。印度標準時間是 UTC+5:30。尼泊爾時間是 UTC+5:45。伊朗標準時間是 UTC+3:30。澳大利亞中部標準時間是 UTC+9:30。這些分數偏移會導致假設整小時增量的工具出錯。",
    sec5Mistake4: "使用 GMT 而非 UTC。",
    sec5Mistake4Body: "GMT 和 UTC 在日常使用中幾乎相同，但 GMT 是天文學時間標準，會因地球自轉而略有變化。UTC 由原子鐘維護，始終精確。對於技術系統，請始終使用 UTC。",
    faqHead: "常見問題",
    faqQ1: "GMT 和 UTC 有什麼區別？",
    faqA1: "GMT（格林威治標準時間）是基於地球相對於太陽的旋轉的天文學時間標準。UTC（協調世界時）是精確的原子時間標準，偶爾會通過閏秒調整以接近 GMT。在日常使用中，兩者本質上相同，但對於技術和科學用途，UTC 是正確的參考。所有現代編程系統內部都使用 UTC。",
    faqQ2: "哪些國家擁有最多的時區？",
    faqA2: "法國擁有最多的時區——12 個——因為它包括許多分散在全球的海外領土。俄羅斯擁有 11 個時區，覆蓋其廣闊的陸地面積。美國擁有 6 個標準時區（包括阿拉斯加和夏威夷），或高達 9 個，如果計算所有領土和無人島嶼。",
    faqQ3: "為什麼印度使用半小時偏移（UTC+5:30）？",
    faqA3: "印度選擇 UTC+5:30 作為妥協方案，使整個國家儘管跨越約 30 度經度，仍能使用單一時區運作——這通常會需要兩個或三個時區。半小時偏移是為了更好地將當地太陽時與時鐘對齊。同樣地，尼泊爾選擇 UTC+5:45 以與鄰近的印度區分，同時保持接近其太陽正午。",
    faqQ4: "什麼是國際日期線？",
    faqA4: "國際日期線（IDL）是一條假想的線，從北極到南極，大致沿著太平洋的 180 度經線運行。這是日曆一天的結束和下一天的開始。向西跨越國際日期線（亞洲/太平洋方向）會使日曆向前推進一天；向东跨越（美洲方向）會使日曆向後退回一天。國際日期線並非完全筆直——它會繞過島嶼國家，使它們與最近的鄰居共享相同的日曆日期。",
    faqQ5: "如何為跨越美國和香港的會議轉換時區？",
    faqA5: "香港全年是 UTC+8（無夏令時間）。紐約在冬季是 UTC−5（EST），夏季是 UTC−4（EDT）。兩者相差冬季 13 小時，夏季 12 小時。紐約在星期一上午 9:00 EST 的會議對應於香港星期一晚上 10:00。使用此轉換器自動處理確切日期和夏令時間狀態——只需輸入會議時間，選擇來源時區，並添加香港作為目標時區。",
  },
  "zh-cn": {
    name: "简体中文",
    title: "时区转换器",
    subtitle: "在不同时区之间转换时间。",
    reserveAd: "广告",
    timeLabel: "时间",
    fromLabel: "从",
    resultLabel: "结果",
    searchLabel: "搜索",
    searchPlaceholder: "搜索工具...",
    now: "现在",
    remove: "移除",
    addZone: "新增时区",
    adLabel: "广告",
    reserveAdSub: "广告",
    adBadge: "广告",
    useCasesHead: "使用案例",
    useCasesSub: "全球时间。",
    useCase1: "安排跨时区的会议。",
    useCase2: "计划国际通话和网络研讨会。",
    useCase3: "追踪不同国家的截止日期。",
    sec1Head: "时区如何运作",
    sec1P1: "地球每 24 小时旋转 360 度，意味着它每小时移动 15 度。这是 24 个主要时区划分地球的基礎：每个时区大约跨越 15 度经度。向东移动一个时区，你会多出一小时；向西移动一个时区，你会少出一小时。",
    sec1P2: "全球参考点是 UTC — 协调世界时。UTC 是格林威治标准时间（GMT）的继承者，并由原子钟维护。所有其他时区都以 UTC 为基准表示偏移。纽约在冬季运行于 UTC−5（东部标准时间），伦敦在冬季是 UTC+0（GMT），印度是 UTC+5:30，而香港全年是 UTC+8。",
    sec1P3: "在 1884 年之前，没有全球时间标准。每个城市都保持自己的太阳时，由太阳到达当地最高点的时间设定。当铁路在 19 世纪开始连接城市时，各地时间的拼贴使得时刻表几乎无法管理。1884 年的国际经度会议指定格林威治（英国）的零度经线作为全球时间的参考经度，从而产生了现代时区系统。今天，时区的精确边界由国家政府和地区政府决定，这就是为什么现实世界的时区远非整齐的 15 度楔形。",
    sec2Head: "UTC 偏移和主要时区",
    sec2Intro: "这里是一个主要时区及其标准 UTC 偏移的参考表。注意，偏移量在夏令时间期间会变化，适用于观察夏令时间的地区。",
    thAbbr: "缩写",
    thOffset: "UTC 偏移",
    thRegion: "地区 / 城市",
    sec3Head: "夏令时间（DST）",
    sec3P1: "夏令时间是春季将时钟向前调一小时，秋季将时钟向后调一小时的做法。其目的是将白天的时间移到夏季晚上的时段，减少对人工照明的需求。\"春季向前，秋季向后\"这句话捕捉了这种模式：时钟在春季向前调一小时，秋季向后调一小时。",
    sec3P2: "观察夏令时间的地区包括美国、加拿大、欧洲大部分地区、澳大利亚部分地区以及几个其他国家。在美国，时钟在三月第二个星期日（春季向前）和十一月第一个星期日（秋季向后）改变。在欧盟，改变发生在三月最后一个星期日和十月最后一个星期日。",
    sec3P3: "许多主要地区完全不观察夏令时间。中国、日本、印度、非洲大部分地区以及美国亚利桑那州（纳瓦霍部落除外）全年保持固定的 UTC 偏移。这会造成排程上的复杂性：在十二月设定为 \"下午 3:00 EST\" 的会议，实际上与七月设定为 \"下午 3:00 EDT\" 的会议是不同的 UTC 时间，即使当地时钟显示相同。当提前数月安排国际会议时，务必确认时钟在会议日期是否改变。",
    sec4Head: "国际排程的实用建议",
    sec4Tip1: "有疑问时，始终以 UTC 为基准。",
    sec4Tip1Body: "服务器日志、API、数据库和分布式系统应存储并沟通 UTC 时间戳。转换为当地时间是显示问题；存储于 UTC 确保永远不会有关于事件发生时间的歧义。",
    sec4Tip2: "确认时区和日期。",
    sec4Tip2Body: "当跨越国际日期线安排时，日历日期会改变。纽约在星期四上午 10:00 的通话，在伦敦是星期四晚上 11:00，但在东京则是星期五上午 10:00。始终与时间一起分享日期。",
    sec4Tip3: "安排时请检查夏令时间状态。",
    sec4Tip3Body: "如果你安排的是跨越数月的每周重复通话，请确认夏令时间转换是否会改变会议时间。在冬季，一个在上午 9:00 EST 有效的通话，可能在时钟春季向前后变成上午 8:00 EST，或对于非夏令时间国家的参与者来说，是当地时间上午 10:00。",
    sec4Tip4: "了解国际日期线（IDL）。",
    sec4Tip4Body: "国际日期线大致沿着太平洋的 180 度经线运行。向西跨越（朝向亚洲）会使日历向前推进一天；向东跨越（朝向美洲）会使日历向后退回一天。这就是为什么从洛杉矶飞往悉尼的航班有时似乎会\"失去一天\"。",
    sec5Head: "转换时区常见错误",
    sec5Mistake1: "忘记夏令时间。",
    sec5Mistake1Body: "最常见的错误。EST（UTC−5）和 EDT（UTC−4）都是\"东部时间\"，但两者相差一小时。务必确认夏令时间是否对你的目标地区生效。",
    sec5Mistake2: "混淆重复使用的缩写。",
    sec5Mistake2Body: "CST 可能指中央标准时间（美国 UTC−6）或中国标准时间（UTC+8）。IST 可能指印度标准时间（UTC+5:30）、爱尔兰标准时间（UTC+1）或以色列标准时间（UTC+2）。有疑问时，请使用完整的 IANA 时区名称，例如 America/Chicago 或 Asia/Kolkata，而不是缩写。",
    sec5Mistake3: "忽略半小时和 45 分钟偏移。",
    sec5Mistake3Body: "并非所有时区都是整小时的 UTC 偏移。印度标准时间是 UTC+5:30。尼泊尔时间是 UTC+5:45。伊朗标准时间是 UTC+3:30。澳大利亚中部标准时间是 UTC+9:30。这些分数偏移会导致假设整小时增量的工具出错。",
    sec5Mistake4: "使用 GMT 而非 UTC。",
    sec5Mistake4Body: "GMT 和 UTC 在日常使用中几乎相同，但 GMT 是天文学时间标准，会因地球自转而略有变化。UTC 由原子钟维护，始终精确。对于技术系统，请始终使用 UTC。",
    faqHead: "常见问题",
    faqQ1: "GMT 和 UTC 有什么区别？",
    faqA1: "GMT（格林威治标准时间）是基于地球相对于太阳的旋转的天文学时间标准。UTC（协调世界时）是精确的原子时间标准，偶尔会通过闰秒调整以接近 GMT。在日常使用中，两者本质上相同，但对于技术和科学用途，UTC 是正确参考。所有现代编程系统内部都使用 UTC。",
    faqQ2: "哪些国家拥有最多的时区？",
    faqA2: "法国拥有最多的时区——12 个——因为它包括许多分散在全球的海外领土。俄罗斯拥有 11 个时区，覆盖其广阔的陆地面积。美国拥有 6 个标准时区（包括阿拉斯加和夏威夷），或高达 9 个，如果计算所有领土和无人岛屿。",
    faqQ3: "为什么印度使用半小时偏移（UTC+5:30）？",
    faqA3: "印度选择 UTC+5:30 作为妥协方案，使整个国家尽管跨越约 30 度经度，仍能使用单一时区运作——这通常需要两个或三个时区。半小时偏移是为了更好地将当地太阳时与时钟对齐。同样地，尼泊尔选择 UTC+5:45 以与邻近的印度区分，同时保持接近其太阳正午。",
    faqQ4: "什么是国际日期线？",
    faqA4: "国际日期线（IDL）是一条假想的线，从北极到南极，大致沿着太平洋的 180 度经线运行。这是日历一天的结束和下一天的开始。向西跨越国际日期线（亚洲/太平洋方向）会使日历向前推进一天；向东跨越（美洲方向）会使日历向后退回一天。国际日期线并非完全笔直——它会绕过岛屿国家，使它们与最近的邻居共享相同的日历日期。",
    faqQ5: "如何为跨越美国和香港的会议转换时区？",
    faqA5: "香港全年是 UTC+8（无夏令时间）。纽约在冬季是 UTC−5（EST），夏季是 UTC−4（EDT）。两者相差冬季 13 小时，夏季 12 小时。纽约在星期一上午 9:00 EST 的会议对应于香港星期一晚上 10:00。使用此转换器自动处理确切日期和夏令时间状态——只需输入会议时间，选择来源时区，并添加香港作为目标时区。",
  },
  es: {
    name: "Español",
    title: "Conversor de Zonas Horarias",
    subtitle: "Convierte horas entre diferentes zonas horarias.",
    reserveAd: "Anuncio",
    timeLabel: "Hora",
    fromLabel: "De",
    resultLabel: "Resultado",
    searchLabel: "Buscar",
    searchPlaceholder: "Buscar herramientas...",
    now: "Ahora",
    remove: "Eliminar",
    addZone: "Añadir zona",
    adLabel: "Anuncio",
    reserveAdSub: "Anuncio",
    adBadge: "Anuncio",
    useCasesHead: "Casos de uso",
    useCasesSub: "Horas en todo el mundo.",
    useCase1: "Programar reuniones entre zonas horarias.",
    useCase2: "Planificar llamadas internacionales y seminarios web.",
    useCase3: "Seguir plazos en diferentes países.",
    sec1Head: "Cómo funcionan las zonas horarias",
    sec1P1: "La Tierra rota 360 grados cada 24 horas, lo que significa que se mueve 15 grados por hora. Esta es la base de las 24 zonas horarias principales que dividen el planeta: cada zona abarca aproximadamente 15 grados de longitud. Muévete una zona al este y ganas una hora; muévete una zona al oeste y pierdes una hora.",
    sec1P2: "El punto de referencia global es UTC — Tiempo Universal Coordinado. UTC es el sucesor del Tiempo Medio de Greenwich (GMT) y se mantiene mediante relojes atómicos. Todas las demás zonas horarias se expresan como desfases respecto a UTC. Nueva York en invierno funciona con UTC−5 (Hora Estándar del Este), Londres en invierno es UTC+0 (GMT), India es UTC+5:30 y Hong Kong es UTC+8 todo el año.",
    sec1P3: "Antes de 1884, no existía un estándar horario global. Cada ciudad mantenía su propia hora solar, determinada por cuándo el sol alcanzaba su punto más alto localmente. Cuando los ferrocarriles comenzaron a conectar ciudades en el siglo XIX, el mosaico de horas locales hizo que los horarios fueran casi imposibles de gestionar. La Conferencia Internacional del Meridiano de 1884 designó el Meridiano Cero en Greenwich, Inglaterra, como la longitud de referencia para la hora global, dando origen al sistema moderno de zonas horarias. Hoy en día, los límites precisos de las zonas horarias son determinados por los gobiernos nacionales y regionales, razón por la cual las zonas del mundo real distan mucho de ser cuñas perfectas de 15 grados.",
    sec2Head: "Desfases UTC y zonas horarias principales",
    sec2Intro: "Aquí hay una tabla de referencia de las principales zonas horarias y sus desfases UTC estándar. Ten en cuenta que los desfases cambian durante el horario de verano para las regiones que lo observan.",
    thAbbr: "Abreviatura",
    thOffset: "Desfase UTC",
    thRegion: "Región / Ciudad",
    sec3Head: "Horario de Verano (DST)",
    sec3P1: "El horario de verano (DST) es la práctica de adelantar los relojes una hora en primavera y retrasarlos una hora en otoño. La idea es trasladar las horas de luz a la tarde durante los meses de verano, reduciendo la necesidad de iluminación artificial. La frase \"adelantar en primavera, retrasar en otoño\" captura el patrón: los relojes se adelantan una hora en primavera y se retrasan una hora en otoño.",
    sec3P2: "Las regiones que observan el horario de verano incluyen Estados Unidos, Canadá, la mayor parte de Europa, partes de Australia y varios otros países. En EE. UU., los relojes cambian el segundo domingo de marzo (adelantar) y el primer domingo de noviembre (retrasar). En la Unión Europea, el cambio ocurre el último domingo de marzo y el último domingo de octubre.",
    sec3P3: "Muchas regiones importantes no observan el horario de verano en absoluto. China, Japón, India, la mayor parte de África y el estado de Arizona en EE. UU. (excepto la Nación Navajo) mantienen un desfase UTC fijo todo el año. Esto crea una complicación de programación: una reunión fijada para las \"3:00 PM EST\" en diciembre es en realidad una hora UTC diferente a una reunión fijada para las \"3:00 PM EDT\" en julio, aunque el reloj local marque lo mismo. Al programar reuniones internacionales con meses de antelación, confirma siempre si los relojes habrán cambiado para la fecha de la reunión.",
    sec4Head: "Consejos prácticos para la programación internacional",
    sec4Tip1: "Ante la duda, usa siempre UTC como referencia.",
    sec4Tip1Body: "Los registros de servidores, APIs, bases de datos y sistemas distribuidos deben almacenar y comunicar marcas de tiempo en UTC. Convertir a hora local es una cuestión de visualización; almacenar en UTC garantiza que nunca haya ambigüedad sobre cuándo ocurrió algo.",
    sec4Tip2: "Confirma tanto la zona horaria como la fecha.",
    sec4Tip2Body: "Al programar a través de la Línea Internacional de Cambio de Fecha, la fecha del calendario cambia. Una llamada a las 10:00 AM del jueves en Nueva York es a las 11:00 PM del jueves en Londres, pero a las 11:00 PM del jueves se convierte en las 10:00 AM del viernes en Tokio. Comparte siempre la fecha junto con la hora.",
    sec4Tip3: "Verifica el estado del horario de verano al programar con antelación.",
    sec4Tip3Body: "Si estás programando una llamada semanal recurrente que abarca varios meses, verifica si una transición de horario de verano cambiará la hora de la reunión. Una llamada que funciona a las 9:00 AM EST en invierno podría convertirse en las 8:00 AM EST después de adelantar los relojes en primavera, o las 10:00 AM hora local para los participantes en un país sin horario de verano.",
    sec4Tip4: "Comprende la Línea Internacional de Cambio de Fecha (IDL).",
    sec4Tip4Body: "La IDL corre aproximadamente a lo largo del meridiano 180 en el Océano Pacífico. Cruzarla hacia el oeste (hacia Asia) adelanta el calendario un día; cruzarla hacia el este (hacia las Américas) retrasa el calendario un día. Por eso los vuelos de Los Ángeles a Sídney a veces parecen \"perder un día\".",
    sec5Head: "Errores comunes al convertir zonas horarias",
    sec5Mistake1: "Olvidar el horario de verano.",
    sec5Mistake1Body: "El error más común. EST (UTC−5) y EDT (UTC−4) son ambos \"Hora del Este\", pero difieren en una hora. Verifica siempre si el horario de verano está actualmente en efecto para tu región de destino.",
    sec5Mistake2: "Confundir abreviaturas que se reutilizan.",
    sec5Mistake2Body: "CST puede significar Hora Estándar Central (UTC−6 en EE. UU.) o Hora Estándar de China (UTC+8). IST puede significar Hora Estándar de India (UTC+5:30), Hora Estándar de Irlanda (UTC+1) o Hora Estándar de Israel (UTC+2). Ante la duda, usa nombres completos de zona horaria IANA como America/Chicago o Asia/Kolkata en lugar de abreviaturas.",
    sec5Mistake3: "Ignorar los desfases de media hora y 45 minutos.",
    sec5Mistake3Body: "No todas las zonas horarias tienen desfases de horas enteras respecto a UTC. La Hora Estándar de India es UTC+5:30. La Hora de Nepal es UTC+5:45. La Hora Estándar de Irán es UTC+3:30. La Hora Estándar Central de Australia es UTC+9:30. Estos desfases fraccionarios hacen tropezar a las herramientas que asumen incrementos de horas enteras.",
    sec5Mistake4: "Usar GMT cuando quieres decir UTC.",
    sec5Mistake4Body: "GMT y UTC son casi idénticos en el uso diario, pero GMT es técnicamente un estándar de tiempo astronómico que puede variar ligeramente debido a la rotación de la Tierra. UTC se mantiene mediante relojes atómicos y siempre es preciso. Para sistemas técnicos, usa siempre UTC.",
    faqHead: "Preguntas frecuentes",
    faqQ1: "¿Cuál es la diferencia entre GMT y UTC?",
    faqA1: "GMT (Tiempo Medio de Greenwich) es un estándar de tiempo astronómico basado en la rotación de la Tierra respecto al sol. UTC (Tiempo Universal Coordinado) es un estándar de tiempo atómico preciso que ocasionalmente se ajusta con segundos intercalares para mantenerse cercano a GMT. En el uso diario son esencialmente lo mismo, pero para fines técnicos y científicos, UTC es la referencia correcta. Todos los sistemas de programación modernos usan UTC internamente.",
    faqQ2: "¿Qué países tienen más zonas horarias?",
    faqA2: "Francia tiene la mayor cantidad de zonas horarias de cualquier país — 12 — porque incluye numerosos territorios de ultramar repartidos por todo el mundo. Rusia tiene 11 zonas horarias en su vasto territorio. Estados Unidos tiene 6 zonas horarias estándar (incluyendo Alaska y Hawái), o hasta 9 contando todos los territorios e islas deshabitadas.",
    faqQ3: "¿Por qué India usa un desfase de media hora (UTC+5:30)?",
    faqA3: "India eligió UTC+5:30 como compromiso para que todo el país pudiera operar con una sola zona horaria a pesar de abarcar unos 30 grados de longitud — una extensión que normalmente requeriría dos o tres zonas. El desfase de media hora se estableció para alinear mejor la hora solar local con el reloj. De manera similar, Nepal eligió UTC+5:45 para diferenciarse de la vecina India manteniéndose cerca de su mediodía solar.",
    faqQ4: "¿Qué es la Línea Internacional de Cambio de Fecha?",
    faqA4: "La Línea Internacional de Cambio de Fecha (IDL) es una línea imaginaria que va del Polo Norte al Polo Sur a lo largo de aproximadamente el meridiano 180 en el Océano Pacífico. Es donde termina un día calendario y comienza el siguiente. Cruzar la IDL hacia el oeste (dirección Asia/Pacífico) te hace avanzar un día en el calendario; cruzarla hacia el este (dirección Américas) te hace retroceder un día. La IDL no es perfectamente recta — se desvía alrededor de las naciones insulares para que compartan la misma fecha calendario con sus vecinos más cercanos.",
    faqQ5: "¿Cómo convierto las zonas horarias para una reunión entre EE. UU. y Hong Kong?",
    faqA5: "Hong Kong es UTC+8 todo el año (sin horario de verano). Nueva York es UTC−5 en invierno (EST) y UTC−4 en verano (EDT). La diferencia es de 13 horas en invierno y 12 horas en verano. Una reunión a las 9:00 AM del lunes en Nueva York EST corresponde a las 10:00 PM del lunes en Hong Kong. Usa este conversor para manejar las fechas exactas y el estado del horario de verano automáticamente — simplemente introduce la hora de la reunión, selecciona la zona de origen y añade Hong Kong como zona de destino.",
  },
};

const POPULAR_ZONES = [
  "UTC", "America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles",
  "America/Sao_Paulo", "Europe/London", "Europe/Paris", "Europe/Berlin", "Europe/Moscow",
  "Asia/Dubai", "Asia/Kolkata", "Asia/Bangkok", "Asia/Hong_Kong", "Asia/Shanghai",
  "Asia/Tokyo", "Asia/Seoul", "Australia/Sydney", "Pacific/Auckland", "Pacific/Honolulu",
];

const ZONE_LABELS: Record<string, string> = {
  "UTC": "UTC", "America/New_York": "New York (ET)", "America/Chicago": "Chicago (CT)",
  "America/Denver": "Denver (MT)", "America/Los_Angeles": "Los Angeles (PT)",
  "America/Sao_Paulo": "São Paulo (BRT)", "Europe/London": "London (GMT/BST)",
  "Europe/Paris": "Paris (CET)", "Europe/Berlin": "Berlin (CET)",
  "Europe/Moscow": "Moscow (MSK)", "Asia/Dubai": "Dubai (GST)",
  "Asia/Kolkata": "Mumbai/Delhi (IST)", "Asia/Bangkok": "Bangkok (ICT)",
  "Asia/Hong_Kong": "Hong Kong (HKT)", "Asia/Shanghai": "Shanghai (CST)",
  "Asia/Tokyo": "Tokyo (JST)", "Asia/Seoul": "Seoul (KST)",
  "Australia/Sydney": "Sydney (AEST)", "Pacific/Auckland": "Auckland (NZST)",
  "Pacific/Honolulu": "Honolulu (HST)",
};

const TOOLS = [
  { title: { en: "Age Calculator", "zh-hk": "年齡計算器", "zh-cn": "年龄计算器", "ja": "年齢計算器" }, description: { en: "Calculate exact age from a birth date.", "zh-hk": "根據出生日期計算準確年齡。", "zh-cn": "根据出生日期计算准确年龄。", "ja": "出生日から正確な年齢を計算します。" }, href: "/age-calculator", keywords: ["age", "birthday"] },
  { title: { en: "Date Difference Calculator", "zh-hk": "日期差計算器", "zh-cn": "日期差计算器", "ja": "日付の差計算器" }, description: { en: "Days between two dates.", "zh-hk": "兩個日期之間的日期。", "zh-cn": "两个日期之间的天数。", "ja": "二つの日付の間の日数。" }, href: "/date-difference-calculator", keywords: ["date", "days"] },
  { title: { en: "Percentage Calculator", "zh-hk": "百分比計算器", "zh-cn": "百分比计算器", "ja": "パーセンテージ計算器" }, description: { en: "Percentage of a number.", "zh-hk": "數字的百分比。", "zh-cn": "数字的百分比。", "ja": "数字のパーセンテージ。" }, href: "/percentage-calculator", keywords: ["percent", "ratio"] },
  { title: { en: "Unit Converter", "zh-hk": "單位轉換器", "zh-cn": "单位转换器", "ja": "単位変換器" }, description: { en: "Convert length, weight, temperature.", "zh-hk": "轉換長度、重量、溫度。", "zh-cn": "转换长度、重量、温度。", "ja": "長さ、重量、温度を変換します。" }, href: "/unit-converter", keywords: ["convert", "unit"] },
  { title: { en: "Business Day Calculator", "zh-hk": "工作日計算器", "zh-cn": "工作日计算器", "ja": "営業日計算器" }, description: { en: "Add working days to any date.", "zh-hk": "為任何日期增加工作日。", "zh-cn": "为任何日期增加工作日。", "ja": "任意の日に営業日を追加します。" }, href: "/business-day-calculator", keywords: ["calendar", "workday"] },
  { title: { en: "Word Counter", "zh-hk": "字數計算器", "zh-cn": "字数计算器", "ja": "文字数計算器" }, description: { en: "Count words and characters.", "zh-hk": "計算字數和字符。", "zh-cn": "计算字数和字符。", "ja": "文字と文字数をカウントします。" }, href: "/word-counter", keywords: ["word", "text"] },
  { title: { en: "URL Encoder / Decoder", "zh-hk": "URL 編碼器 / 解碼器", "zh-cn": "URL 编码器 / 解码器", "ja": "URL エンコーダー / デコーダー" }, description: { en: "Encode or decode URLs.", "zh-hk": "編碼或解碼 URL。", "zh-cn": "编码或解码 URL。", "ja": "URL をエンコードまたはデコードします。" }, href: "/url-encoder-decoder", keywords: ["url", "encode"] },
];

function formatInZone(dt: Date, zone: string) {
  try {
    return new Intl.DateTimeFormat("en-GB", { timeZone: zone, weekday: "short", year: "numeric", month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }).format(dt);
  } catch { return "—"; }
}

const SITE_URL = "https://www.tinytoolboxes.com";
const PAGE_PATH = "/time-zone-converter";

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

export default function TimeZoneConverter() {
  const [locale, setLocale] = useState<keyof typeof LANGUAGES>(() => typeof window === "undefined" ? "en" : ((window.localStorage.getItem("ttb-locale") as keyof typeof LANGUAGES) || "en"));
  const [inputTime, setInputTime] = useState(() => { const d = new Date(); d.setSeconds(0, 0); return d.toISOString().slice(0, 16); });
  const [fromZone, setFromZone] = useState("UTC");
  const [toZones, setToZones] = useState(["America/New_York", "Europe/London", "Asia/Hong_Kong", "Asia/Tokyo"]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    document.documentElement.lang = locale === "zh-hk" ? "zh-Hant-HK" : locale === "zh-cn" ? "zh-Hans-CN" : locale;
    window.localStorage.setItem("ttb-locale", locale);
    const L = LANGUAGES[locale];
    applySEO({
      title: `${L.title} | TinyToolboxes`,
      description: L.subtitle,
      path: PAGE_PATH,
      jsonLd: { "@context": "https://schema.org", "@type": "WebApplication", name: L.title, url: SITE_URL + PAGE_PATH, description: L.subtitle, applicationCategory: "UtilitiesApplication", operatingSystem: "Web", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, publisher: { "@type": "Organization", name: "TinyToolboxes", url: SITE_URL } },
    });
  }, [locale]);

  const sourceDate = useMemo(() => {
    if (!inputTime) return null;
    try {
      const [datePart, timePart] = inputTime.split("T");
      const [year, month, day] = datePart.split("-").map(Number);
      const [hours, minutes] = timePart.split(":").map(Number);
      const localStr = `${datePart}T${timePart}:00`;
      const inZone = new Date(localStr);
      const targetOffset = new Date(new Intl.DateTimeFormat("en", { timeZone: fromZone, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false }).format(inZone)).getTime();
      const diff = inZone.getTime() - targetOffset;
      return new Date(inZone.getTime() + diff);
    } catch { return null; }
  }, [inputTime, fromZone]);

  const content = LANGUAGES[locale];
  const hints = locale === "zh-hk" ? ["年齡", "百分比", "體積重量", "URL"] : locale === "zh-cn" ? ["年龄", "百分比", "体积重量", "URL"] : ["age", "percent", "weight", "url"];
  const filteredTools = useMemo(() => { const q = search.trim().toLowerCase(); if (!q) return TOOLS; return TOOLS.filter((t) => `${t.title[locale]} ${t.description[locale]} ${t.keywords.join(" ")}`.toLowerCase().includes(q)); }, [search]);
  const available = POPULAR_ZONES.filter((z) => z !== fromZone && !toZones.includes(z));

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10 lg:px-8">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400/15 ring-1 ring-emerald-300/20"><Clock className="h-5 w-5 text-emerald-300" /></div>
            <div><p className="text-sm uppercase tracking-[0.3em] text-emerald-300/80">TinyToolboxes</p><h1 className="text-xl font-semibold">{content.title}</h1></div>
          </div>
          <div className="flex flex-wrap gap-2">{(Object.keys(LANGUAGES) as Array<keyof typeof LANGUAGES>).map((key) => <button key={key} onClick={() => setLocale(key)} className={`rounded-full border px-3 py-2 text-sm transition ${locale === key ? "border-emerald-400/70 bg-emerald-400/15 text-emerald-200" : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"}`}>{LANGUAGES[key].name}</button>)}</div>
        </div>

        <div className="grid flex-1 gap-8 py-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <div className="space-y-8">
            <div className="max-w-3xl space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-200"><BadgeDollarSign className="h-4 w-4" />{content.reserveAd}</div>
              <div className="space-y-4"><h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">{content.title}</h2><p className="max-w-2xl text-base leading-7 text-white/70 sm:text-lg">{content.subtitle}</p></div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block space-y-2"><span className="text-sm text-neutral-300">{content.timeLabel}</span>
                  <div className="flex gap-2">
                    <input type="datetime-local" value={inputTime} onChange={(e) => setInputTime(e.target.value)} className="flex-1 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400/60" />
                    <button onClick={() => { const d = new Date(); d.setSeconds(0, 0); setInputTime(d.toISOString().slice(0, 16)); }} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70 hover:bg-white/10 transition">{content.now}</button>
                  </div>
                </label>
                <label className="block space-y-2"><span className="text-sm text-neutral-300">{content.fromLabel}</span>
                  <select value={fromZone} onChange={(e) => setFromZone(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400/60">
                    {POPULAR_ZONES.map((z) => <option key={z} value={z}>{ZONE_LABELS[z] || z}</option>)}
                  </select>
                </label>
              </div>

              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">{content.resultLabel}</p>
                {toZones.map((zone) => (
                  <div key={zone} className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                    <div>
                      <p className="text-xs text-emerald-300/70">{ZONE_LABELS[zone] || zone}</p>
                      <p className="mt-1 text-base font-medium text-white">{sourceDate ? formatInZone(sourceDate, zone) : "—"}</p>
                    </div>
                    <button onClick={() => setToZones(toZones.filter((z) => z !== zone))} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/55 hover:bg-red-500/10 hover:text-red-300 transition">{content.remove}</button>
                  </div>
                ))}
                {available.length > 0 && (
                  <select onChange={(e) => { if (e.target.value) setToZones([...toZones, e.target.value]); e.target.value = ""; }} defaultValue="" className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white/70 outline-none focus:border-emerald-400/60">
                    <option value="" disabled>+ {content.addZone}</option>
                    {available.map((z) => <option key={z} value={z}>{ZONE_LABELS[z] || z}</option>)}
                  </select>
                )}
              </div>
            </div>

            <section className="rounded-3xl border border-white/10 bg-black/20 p-4">
              <label className="block space-y-2"><span className="text-sm font-medium text-white/80">{content.searchLabel}</span>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3"><Search className="h-4 w-4 text-emerald-300" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={content.searchPlaceholder} className="w-full bg-transparent text-sm text-white placeholder:text-white/35 outline-none" /></div>
              </label>
              <div className="mt-3 flex flex-wrap gap-2">{hints.map((h) => <button key={h} type="button" onClick={() => setSearch(h)} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 hover:bg-white/10 transition">{h}</button>)}</div>
              <div className="mt-4 grid gap-2">{filteredTools.map((t) => <button key={t.href} type="button" onClick={() => (window.location.href = t.href)} className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left hover:border-emerald-300/30 hover:bg-white/10 transition"><div><p className="text-sm font-medium text-white">{t.title[locale]}</p><p className="mt-1 text-xs text-white/55">{t.description[locale]}</p></div><ArrowRight className="h-4 w-4 shrink-0 text-white/35" /></button>)}</div>
            </section>

            <article className="space-y-8 rounded-3xl border border-white/10 bg-white/5 p-6 text-white/80 shadow-[0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur">
              <div>
                <h2 className="text-2xl font-bold text-white">{content.sec1Head}</h2>
                <p className="mt-3 leading-7">{content.sec1P1}</p>
                <p className="mt-3 leading-7">{content.sec1P2}</p>
                <p className="mt-3 leading-7">{content.sec1P3}</p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">{content.sec2Head}</h2>
                <p className="mt-3 leading-7">{content.sec2Intro}</p>
                <div className="mt-3 overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="py-2 pr-4 text-left font-semibold text-white">{content.thAbbr}</th>
                        <th className="py-2 pr-4 text-left font-semibold text-white">{content.thOffset}</th>
                        <th className="py-2 text-left font-semibold text-white">{content.thRegion}</th>
                      </tr>
                    </thead>
                    <tbody className="text-white/70">
                      <tr className="border-b border-white/5"><td className="py-2 pr-4 font-mono text-emerald-200">PST</td><td className="py-2 pr-4">UTC−8</td><td className="py-2">Los Angeles, Seattle, Vancouver</td></tr>
                      <tr className="border-b border-white/5"><td className="py-2 pr-4 font-mono text-emerald-200">MST</td><td className="py-2 pr-4">UTC−7</td><td className="py-2">Denver, Phoenix, Calgary</td></tr>
                      <tr className="border-b border-white/5"><td className="py-2 pr-4 font-mono text-emerald-200">CST</td><td className="py-2 pr-4">UTC−6</td><td className="py-2">Chicago, Houston, Mexico City</td></tr>
                      <tr className="border-b border-white/5"><td className="py-2 pr-4 font-mono text-emerald-200">EST</td><td className="py-2 pr-4">UTC−5</td><td className="py-2">New York, Toronto, Miami</td></tr>
                      <tr className="border-b border-white/5"><td className="py-2 pr-4 font-mono text-emerald-200">GMT / UTC</td><td className="py-2 pr-4">UTC+0</td><td className="py-2">London, Reykjavik, Accra</td></tr>
                      <tr className="border-b border-white/5"><td className="py-2 pr-4 font-mono text-emerald-200">CET</td><td className="py-2 pr-4">UTC+1</td><td className="py-2">Paris, Berlin, Rome, Amsterdam</td></tr>
                      <tr className="border-b border-white/5"><td className="py-2 pr-4 font-mono text-emerald-200">EET</td><td className="py-2 pr-4">UTC+2</td><td className="py-2">Athens, Cairo, Helsinki</td></tr>
                      <tr className="border-b border-white/5"><td className="py-2 pr-4 font-mono text-emerald-200">IST</td><td className="py-2 pr-4">UTC+5:30</td><td className="py-2">Mumbai, Delhi, Bengaluru</td></tr>
                      <tr className="border-b border-white/5"><td className="py-2 pr-4 font-mono text-emerald-200">CST (China)</td><td className="py-2 pr-4">UTC+8</td><td className="py-2">Beijing, Shanghai, Chengdu</td></tr>
                      <tr className="border-b border-white/5"><td className="py-2 pr-4 font-mono text-emerald-200">HKT</td><td className="py-2 pr-4">UTC+8</td><td className="py-2">Hong Kong</td></tr>
                      <tr className="border-b border-white/5"><td className="py-2 pr-4 font-mono text-emerald-200">JST</td><td className="py-2 pr-4">UTC+9</td><td className="py-2">Tokyo, Osaka, Sapporo</td></tr>
                      <tr><td className="py-2 pr-4 font-mono text-emerald-200">AEST</td><td className="py-2 pr-4">UTC+10</td><td className="py-2">Sydney, Melbourne, Brisbane</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">{content.sec3Head}</h2>
                <p className="mt-3 leading-7">{content.sec3P1}</p>
                <p className="mt-3 leading-7">{content.sec3P2}</p>
                <p className="mt-3 leading-7">{content.sec3P3}</p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">{content.sec4Head}</h2>
                <ul className="mt-3 space-y-3 text-white/70">
                  <li><strong className="text-white">{content.sec4Tip1}</strong> {content.sec4Tip1Body}</li>
                  <li><strong className="text-white">{content.sec4Tip2}</strong> {content.sec4Tip2Body}</li>
                  <li><strong className="text-white">{content.sec4Tip3}</strong> {content.sec4Tip3Body}</li>
                  <li><strong className="text-white">{content.sec4Tip4}</strong> {content.sec4Tip4Body}</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">{content.sec5Head}</h2>
                <ul className="mt-3 space-y-3 text-white/70">
                  <li><strong className="text-white">{content.sec5Mistake1}</strong> {content.sec5Mistake1Body}</li>
                  <li><strong className="text-white">{content.sec5Mistake2}</strong> {content.sec5Mistake2Body}</li>
                  <li><strong className="text-white">{content.sec5Mistake3}</strong> {content.sec5Mistake3Body}</li>
                  <li><strong className="text-white">{content.sec5Mistake4}</strong> {content.sec5Mistake4Body}</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">{content.faqHead}</h2>
                <div className="mt-4 space-y-5">
                  <div>
                    <h3 className="font-semibold text-white">{content.faqQ1}</h3>
                    <p className="mt-1 text-white/70">{content.faqA1}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{content.faqQ2}</h3>
                    <p className="mt-1 text-white/70">{content.faqA2}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{content.faqQ3}</h3>
                    <p className="mt-1 text-white/70">{content.faqA3}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{content.faqQ4}</h3>
                    <p className="mt-1 text-white/70">{content.faqA4}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{content.faqQ5}</h3>
                    <p className="mt-1 text-white/70">{content.faqA5}</p>
                  </div>
                </div>
              </div>
            </article>

            <section className="rounded-3xl border border-dashed border-white/15 bg-white/5 p-5">
              <div className="flex items-center justify-between gap-4"><div><p className="text-sm uppercase tracking-[0.28em] text-emerald-300/80">{content.adLabel}</p><p className="mt-1 text-sm text-white/55">{content.reserveAdSub}</p></div><span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-white/35">{content.adBadge}</span></div>
              <div className="mt-4 min-h-[120px] rounded-2xl border border-white/10 bg-black/20" />
            </section>
          </div>

          <aside className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center gap-3"><div className="rounded-2xl bg-white/10 p-3"><Clock className="h-5 w-5" /></div><div><h2 className="text-lg font-semibold">{content.useCasesHead}</h2><p className="text-sm text-neutral-300">{content.useCasesSub}</p></div></div>
            <div className="space-y-3 text-sm text-neutral-300">
              <p className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">{content.useCase1}</p>
              <p className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">{content.useCase2}</p>
              <p className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">{content.useCase3}</p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

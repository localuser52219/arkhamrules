import React, { useMemo, useState } from "react";
import { Search, BookOpen, Clock3, Filter, Layers, Swords, Footprints, Brain, Coins, Eye, ShieldAlert } from "lucide-react";

const rules = [
  {
    term: "能力",
    category: "核心概念",
    tags: ["永續能力", "強制能力", "顯現能力", "觸發能力", "關鍵詞"],
    teach: "先分型再判斷時機。看見沒有特殊格式，通常是永續能力；看見『強制』就是必須處理；看見圖示則是玩家可主動或反應觸發。",
    detail:
      "能力分為永續能力、強制能力、顯現能力、觸發能力、關鍵詞，以及敵人的生成與獵物指示。強制能力會自動發動；觸發能力要滿足費用與條件才能使用。",
    refs: ["詞彙表：能力", "附錄I：發動順序"],
  },
  {
    term: "觸發能力",
    category: "核心概念",
    tags: ["免費", "反應", "行動", "U", "Y", "I"],
    teach: "先看圖示。免費能力在玩家時間段可用；反應能力看觸發時點；行動能力要花行動。",
    detail:
      "U為免費觸發能力，Y為反應觸發能力，I為行動觸發能力。能力只有在能改變遊戲且費用可完全支付時才能觸發。",
    refs: ["詞彙表：能力", "詞彙表：觸發能力"],
  },
  {
    term: "行動",
    category: "回合流程",
    tags: ["調查", "移動", "抽牌", "資源", "打出", "攻擊", "交戰", "躲避"],
    teach: "調查員通常每回合最多3個行動。先付費，再結算後果。",
    detail:
      "可進行的基本行動包括：調查、移動、抽1張牌、獲得1資源、打出1張支援或事件、啟動I能力、攻擊、交戰、嘗試躲避。",
    refs: ["詞彙表：行動", "流程詳解 2.2.1"],
  },
  {
    term: "趁亂攻擊",
    category: "戰鬥與敵人",
    tags: ["交戰", "行動懲罰", "敵人"],
    teach: "與重整敵人交戰時，不是攻擊、躲避、或啟動談判／撤退能力，就可能吃到趁亂攻擊。這是最常犯錯的位置。",
    detail:
      "調查員若與重整敵人交戰，每次進行行動時，除攻擊、躲避，或啟動談判或撤退能力外，每個與其交戰的重整敵人都會立刻進行一次趁亂攻擊。",
    refs: ["詞彙表：趁亂攻擊", "流程詳解 2.2.1"],
  },
  {
    term: "調查",
    category: "基本行動",
    tags: ["智慧", "線索", "地點"],
    teach: "調查是對地點的隱藏值做智慧檢定。成功才發現1個線索。",
    detail:
      "每次調查員進行調查行動，對所在地點的隱藏值進行一次智慧檢定。若成功，從該地點拿取1個線索到自己的調查員卡。",
    refs: ["詞彙表：調查行動", "技能檢定時序"],
  },
  {
    term: "攻擊",
    category: "基本行動",
    tags: ["戰鬥", "敵人", "傷害"],
    teach: "攻擊是對敵人的攻擊值做戰鬥檢定。成功默認造成1點傷害。",
    detail:
      "攻擊所在地點的敵人時，對該敵人的攻擊值進行一次戰鬥檢定。成功則攻擊成功，默認造成1點傷害；武器或法術可能提高傷害。",
    refs: ["詞彙表：攻擊行動", "技能檢定時序"],
  },
  {
    term: "躲避",
    category: "基本行動",
    tags: ["敏捷", "橫置", "解除交戰"],
    teach: "躲避只打已與自己交戰的敵人。成功後敵人橫置並解除交戰。",
    detail:
      "要躲避與自己交戰的敵人，需對敵人的躲避值進行一次敏捷檢定。成功後將該敵人橫置，移出威脅區放到所在地點。",
    refs: ["詞彙表：躲避、躲避行動"],
  },
  {
    term: "交戰",
    category: "基本行動",
    tags: ["敵人", "威脅區", "冷漠"],
    teach: "交戰是把同地點敵人拉到自己威脅區。可用來接怪、搶怪，也可主動與冷漠敵人交戰。",
    detail:
      "調查員可對所在地點的敵人執行交戰行動，將所選敵人放入自己的威脅區。不能用交戰行動去交戰已經和自己交戰的敵人。",
    refs: ["詞彙表：交戰行動", "與敵人交戰"],
  },
  {
    term: "技能檢定",
    category: "核心概念",
    tags: ["意志", "智慧", "戰鬥", "敏捷", "混亂標記"],
    teach: "固定八步：定技能類型 → 投牌 → 抽混亂 → 套效果 → 算技能值 → 判成敗 → 套結果 → 結束。",
    detail:
      "技能檢定通常以特定技能對抗難度。流程共有八步，重點是混亂標記在步驟3揭示，成功與失敗在步驟6決定，實際後果在步驟7結算。",
    refs: ["技能檢定時序"],
  },
  {
    term: "線索",
    category: "進度與目標",
    tags: ["地點", "場景", "發現"],
    teach: "線索先在地點上，調查成功後才會被拿到調查員卡上；推進場景通常要花的是調查員持有的線索。",
    detail:
      "地點上的線索可透過成功調查或能力發現。若當前場景沒有目標需求，調查員可在自己回合期間共同支付所需線索以推進場景。",
    refs: ["詞彙表：線索", "場景牌庫和密請牌庫"],
  },
  {
    term: "毀滅",
    category: "進度與目標",
    tags: ["密謀", "神話階段"],
    teach: "每個神話階段通常先在當前密謀放1點毀滅，再檢查閾值。達標就推進密謀。",
    detail:
      "場上的毀滅總數包括當前密謀與其他卡牌上的毀滅。除非卡牌特別說明，密謀通常只會在神話階段的檢查毀滅閾值步驟推進。",
    refs: ["詞彙表：毀滅", "流程詳解 1.2-1.3"],
  },
  {
    term: "神話階段",
    category: "回合流程",
    tags: ["毀滅", "遭遇卡", "輪開始"],
    teach: "第一輪跳過。之後每輪：開始 → 放毀滅 → 檢查密謀 → 每人抽遭遇 → 結束。",
    detail:
      "神話階段是壓力來源。重點是每位調查員都要按玩家順序抽1張遭遇卡，處理顯現、生成、詭計與湧動。",
    refs: ["流程詳解 I.神話階段"],
  },
  {
    term: "調查階段",
    category: "回合流程",
    tags: ["玩家回合", "3行動"],
    teach: "所有人輪流各打一個完整回合，每人通常最多3行動。不是你做1動作我做1動作那種輪替。",
    detail:
      "調查員可以任意決定本輪的行動順序，但一名調查員一旦開始自己的回合，必須先完成該回合，才輪到下一位調查員。",
    refs: ["流程詳解 II.調查階段"],
  },
  {
    term: "敵軍階段",
    category: "回合流程",
    tags: ["獵手", "敵人攻擊"],
    teach: "先移動獵手，再由各調查員依玩家順序結算所有與自己交戰敵人的攻擊。",
    detail:
      "每個未交戰的重整獵手敵人會先移動。之後，每個重整且交戰中的敵人各攻擊一次，通常攻擊後橫置。",
    refs: ["流程詳解 III.敵軍階段"],
  },
  {
    term: "補給階段",
    category: "回合流程",
    tags: ["重整", "抽牌", "資源", "手牌上限"],
    teach: "收尾階段：重置行動數、重整所有橫置牌、每人抽1牌拿1資源、檢查8張手牌上限。",
    detail:
      "補給階段結束後，本輪結束。所有『直到本輪結束』的持續效果此刻失效。",
    refs: ["流程詳解 IV.補給階段"],
  },
  {
    term: "敵人生成",
    category: "戰鬥與敵人",
    tags: ["生成", "遭遇卡", "敵人"],
    teach: "敵人有生成指示就照著生；沒有就直接生在抽到它的調查員身上並交戰。",
    detail:
      "若敵人沒有合法生成地點，則不生成，改為棄掉。若有多個合法地點，通常由生成該敵人的調查員選擇。",
    refs: ["詞彙表：生成", "流程詳解 1.4"],
  },
  {
    term: "獵手",
    category: "戰鬥與敵人",
    tags: ["敵軍階段", "最近調查員", "移動"],
    teach: "獵手只在敵軍階段處理。未交戰且重整的獵手敵人，沿最短路徑朝最近調查員移動。",
    detail:
      "若多位調查員距離一致，則優先依獵物指示；若仍無法決定，由調查員隊長選擇方向。",
    refs: ["詞彙表：獵手", "詞彙表：獵物"],
  },
  {
    term: "冷漠",
    category: "戰鬥與敵人",
    tags: ["不自動交戰", "敵人"],
    teach: "冷漠敵人不會自動咬人。要處理它，通常得主動交戰。",
    detail:
      "冷漠敵人在生成時不處於交戰狀態。未與調查員交戰時，調查員不能攻擊它，但可以用交戰行動或卡牌能力與其交戰。",
    refs: ["詞彙表：冷漠"],
  },
  {
    term: "反擊",
    category: "戰鬥與敵人",
    tags: ["攻擊失敗", "敵人能力"],
    teach: "打重整且有反擊的敵人時，戰鬥檢定失敗，牠會反打你一次。",
    detail:
      "反擊在應用完該次檢定所有結果後結算。不論敵人是否與你交戰，只要你攻擊了它且失敗，就可能吃到反擊。",
    refs: ["詞彙表：反擊"],
  },
  {
    term: "使用(X類型)",
    category: "卡牌概念",
    tags: ["子彈", "充能", "供給"],
    teach: "『使用』不是一般資源。它是卡牌自己的專用計數器。用完未必會丟，要看牌文。",
    detail:
      "帶有使用關鍵詞的卡牌入場時，從供應堆拿取指定數量的標記，這些標記視為該種類型的使用，而不再視為一般資源。",
    refs: ["詞彙表：使用(X類型)"],
  },
  {
    term: "槽位",
    category: "卡牌概念",
    tags: ["手部", "盟友", "法術", "身體", "飾品"],
    teach: "超槽位就要立刻丟。不是等之後再整理。",
    detail:
      "若打出或取得控制權會使某種支援超過槽位限制，調查員必須在新支援進入槽位的同時，選擇並棄掉同槽位下控制的其他支援。",
    refs: ["詞彙表：槽位"],
  },
  {
    term: "退場",
    category: "特殊規則",
    tags: ["擊敗", "撤退", "離場"],
    teach: "退場不是小事。角色控制的場上與場外卡牌幾乎都會被移出遊戲，線索會掉在所在地點。",
    detail:
      "調查員被擊敗或撤退時退場。其控制的場上與場外卡牌會從遊戲中移除；持有的線索放回當前地點；交戰敵人留在該地點並解除交戰。",
    refs: ["詞彙表：退場"],
  },
  {
    term: "劇本模式",
    category: "進階教學",
    tags: ["經驗值", "創傷", "劇本紀錄"],
    teach: "劇本模式重點不只是一局勝負，而是冒險結束後的長期後果：經驗值、創傷、陣亡或發瘋。",
    detail:
      "劇本是一系列連續冒險。完成冒險後可計算經驗值購買新卡；被擊敗可能累積肉體或精神創傷；調查員可能陣亡或發瘋。",
    refs: ["詞彙表：劇本模式遊戲"],
  },
];

const phaseData = [
  {
    phase: "I. 神話階段",
    steps: [
      "第一輪跳過神話階段",
      "放置1點毀滅到當前密謀",
      "檢查毀滅閾值，達標則推進密謀",
      "每位調查員依序抽1張遭遇卡並完整結算",
    ],
  },
  {
    phase: "II. 調查階段",
    steps: [
      "選一位尚未行動的調查員開始完整回合",
      "該調查員通常最多進行3個行動",
      "所有調查員都完成回合後，調查階段結束",
    ],
  },
  {
    phase: "III. 敵軍階段",
    steps: [
      "所有未交戰且重整的獵手敵人移動",
      "各調查員依玩家順序結算與自己交戰敵人的攻擊",
    ],
  },
  {
    phase: "IV. 補給階段",
    steps: [
      "重置調查員行動數",
      "重整所有已橫置卡牌",
      "每位調查員抽1張牌並獲得1資源",
      "檢查8張手牌上限並棄至上限",
    ],
  },
];

const commonConfusions = [
  {
    title: "調查 vs 發現線索",
    left: "調查是行動，要做智慧檢定。",
    right: "發現線索是結果或效果，不一定經過調查行動。",
  },
  {
    title: "打出 vs 放置入場",
    left: "打出通常要付資源，還要遵守打出限制。",
    right: "放置入場不視為打出，通常不付資源。",
  },
  {
    title: "擊敗 vs 退場",
    left: "擊敗會導致調查員退場，劇本中還可能帶來創傷。",
    right: "撤退也會退場，但不視為被擊敗。",
  },
  {
    title: "橫置 vs 重整",
    left: "橫置表示已使用或受躲避等效果影響。",
    right: "重整是回復成直立狀態，通常在補給階段。",
  },
];

const setupChecklist = [
  "每位玩家選1名不同調查員",
  "劇本模式先放上創傷帶來的傷害／恐懼",
  "選出調查員隊長",
  "構建並洗混調查員牌庫",
  "建立標記供應區與混亂袋",
  "每人拿5資源",
  "每人抽5張起始手牌，之後可重調1次",
  "閱讀冒險引言與執行冒險設置",
  "依序放好密謀牌庫與場景牌庫",
  "把冒險參考卡放在密謀旁",
];

function Badge({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border px-2 py-1 text-xs font-medium text-slate-700 bg-white">
      {children}
    </span>
  );
}

function SectionTitle({ icon: Icon, title, subtitle }) {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 text-slate-900">
        <Icon className="h-5 w-5" />
        <h2 className="text-xl font-bold">{title}</h2>
      </div>
      {subtitle ? <p className="mt-1 text-sm text-slate-600">{subtitle}</p> : null}
    </div>
  );
}

export default function ArkhamRulesTeachingApp() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("全部");
  const [selected, setSelected] = useState(rules[0]);
  const [tab, setTab] = useState("檢索");

  const categories = ["全部", ...Array.from(new Set(rules.map((r) => r.category)))];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rules.filter((item) => {
      const inCategory = category === "全部" || item.category === category;
      const haystack = [item.term, item.category, item.teach, item.detail, ...item.tags, ...item.refs]
        .join(" ")
        .toLowerCase();
      return inCategory && (!q || haystack.includes(q));
    });
  }, [query, category]);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto max-w-7xl p-4 md:p-6">
        <div className="mb-6 rounded-3xl bg-white p-6 shadow-sm border">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-2 inline-flex items-center rounded-full border bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
                教學型規則檢索 App
              </div>
              <h1 className="text-3xl font-bold tracking-tight">詭鎮奇談：卡牌版 規則教學檢索</h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                用於教學、查規則、快速釐清常見混淆。設計原則不是把整本規則原封不動塞進來，而是先給教學用摘要，再補完整規則方向。
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:flex">
              {[
                { name: "檢索", icon: Search },
                { name: "流程", icon: Clock3 },
                { name: "混淆", icon: ShieldAlert },
                { name: "設置", icon: Layers },
              ].map(({ name, icon: Icon }) => (
                <button
                  key={name}
                  onClick={() => setTab(name)}
                  className={`inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium transition ${
                    tab === name ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {tab === "檢索" && (
          <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
            <div className="rounded-3xl bg-white p-4 shadow-sm border">
              <SectionTitle icon={Filter} title="檢索與分類" subtitle="先搜關鍵字，再按分類縮小範圍。" />

              <div className="mb-3 flex items-center gap-2 rounded-2xl border bg-slate-50 px-3 py-2">
                <Search className="h-4 w-4 text-slate-500" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="輸入：趁亂攻擊、調查、快速、獵手、技能檢定…"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                />
              </div>

              <div className="mb-4 flex flex-wrap gap-2">
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                      category === c ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>

              <div className="mb-3 text-xs text-slate-500">找到 {filtered.length} 個條目</div>

              <div className="space-y-2 max-h-[65vh] overflow-auto pr-1">
                {filtered.map((item) => (
                  <button
                    key={item.term}
                    onClick={() => setSelected(item)}
                    className={`w-full rounded-2xl border p-3 text-left transition ${
                      selected.term === item.term ? "border-slate-900 bg-slate-50" : "bg-white hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-semibold">{item.term}</div>
                        <div className="mt-1 text-xs text-slate-500">{item.category}</div>
                      </div>
                    </div>
                    <div className="mt-2 line-clamp-2 text-xs text-slate-600">{item.teach}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm border">
              <SectionTitle icon={BookOpen} title={selected.term} subtitle={selected.category} />

              <div className="mb-4 flex flex-wrap gap-2">
                {selected.tags.map((tag) => (
                  <Badge key={tag}>{tag}</Badge>
                ))}
              </div>

              <div className="grid gap-4 xl:grid-cols-2">
                <div className="rounded-2xl border bg-slate-50 p-4">
                  <div className="mb-2 text-sm font-semibold text-slate-900">教學說法</div>
                  <p className="text-sm leading-7 text-slate-700">{selected.teach}</p>
                </div>
                <div className="rounded-2xl border p-4">
                  <div className="mb-2 text-sm font-semibold text-slate-900">規則重點</div>
                  <p className="text-sm leading-7 text-slate-700">{selected.detail}</p>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border p-4">
                <div className="mb-2 text-sm font-semibold">查閱方向</div>
                <div className="flex flex-wrap gap-2">
                  {selected.refs.map((ref) => (
                    <Badge key={ref}>{ref}</Badge>
                  ))}
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border p-4">
                  <div className="mb-2 flex items-center gap-2 font-semibold"><Eye className="h-4 w-4" />教學用途</div>
                  <p className="text-sm text-slate-600">適合帶新手時快速口頭解釋，避免一開始直接翻長文規則。</p>
                </div>
                <div className="rounded-2xl border p-4">
                  <div className="mb-2 flex items-center gap-2 font-semibold"><Swords className="h-4 w-4" />高風險誤判</div>
                  <p className="text-sm text-slate-600">先確認時機、是否交戰、是否為重整敵人、以及是否真的能改變遊戲。</p>
                </div>
                <div className="rounded-2xl border p-4">
                  <div className="mb-2 flex items-center gap-2 font-semibold"><Brain className="h-4 w-4" />教學建議</div>
                  <p className="text-sm text-slate-600">先講摘要，再用完整條文補充，不要反過來。否則新手只會被術語淹沒。</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "流程" && (
          <div className="grid gap-6 lg:grid-cols-2">
            {phaseData.map((phase) => (
              <div key={phase.phase} className="rounded-3xl bg-white p-6 shadow-sm border">
                <SectionTitle icon={Clock3} title={phase.phase} />
                <div className="space-y-3">
                  {phase.steps.map((step, idx) => (
                    <div key={step} className="flex gap-3 rounded-2xl border p-4">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                        {idx + 1}
                      </div>
                      <p className="text-sm leading-6 text-slate-700">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "混淆" && (
          <div className="grid gap-6 lg:grid-cols-2">
            {commonConfusions.map((item) => (
              <div key={item.title} className="rounded-3xl bg-white p-6 shadow-sm border">
                <SectionTitle icon={ShieldAlert} title={item.title} subtitle="這些是教學現場最常出錯的位置。" />
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border bg-slate-50 p-4">
                    <div className="mb-2 text-sm font-semibold text-slate-900">A面</div>
                    <p className="text-sm leading-7 text-slate-700">{item.left}</p>
                  </div>
                  <div className="rounded-2xl border p-4">
                    <div className="mb-2 text-sm font-semibold text-slate-900">B面</div>
                    <p className="text-sm leading-7 text-slate-700">{item.right}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "設置" && (
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-3xl bg-white p-6 shadow-sm border">
              <SectionTitle icon={Layers} title="開局設置清單" subtitle="按順序做，少一步都可能直接教錯。" />
              <div className="space-y-3">
                {setupChecklist.map((item, idx) => (
                  <div key={item} className="flex gap-3 rounded-2xl border p-4">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                      {idx + 1}
                    </div>
                    <p className="text-sm leading-6 text-slate-700">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-3xl bg-white p-6 shadow-sm border">
                <SectionTitle icon={Coins} title="新手教學重點" />
                <div className="space-y-3 text-sm leading-7 text-slate-700">
                  <p>先教輪次結構，再教三大核心：行動、技能檢定、敵人交戰。</p>
                  <p>不要一開始就講劇本模式、升級、創傷。那是第二層教學，不是第一層。</p>
                  <p>最容易出錯的不是術語，而是時機。尤其是『在……時』與『……後』，以及趁亂攻擊何時插入。</p>
                </div>
              </div>

              <div className="rounded-3xl bg-white p-6 shadow-sm border">
                <SectionTitle icon={Footprints} title="建議教學順序" />
                <ol className="space-y-3 text-sm leading-7 text-slate-700 list-decimal pl-5">
                  <li>輪次四階段</li>
                  <li>三個基本行動：移動、調查、資源／抽牌</li>
                  <li>敵人、交戰、躲避、趁亂攻擊</li>
                  <li>技能檢定八步</li>
                  <li>場景、密謀、線索、毀滅</li>
                  <li>最後才補關鍵詞與進階規則</li>
                </ol>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

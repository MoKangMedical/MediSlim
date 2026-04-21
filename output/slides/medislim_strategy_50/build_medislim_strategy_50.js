"use strict";

const fs = require("fs");
const path = require("path");
const PptxGenJS = require("pptxgenjs");
const {
  autoFontSize,
  warnIfSlideHasOverlaps,
  warnIfSlideElementsOutOfBounds,
  safeOuterShadow,
} = require("./pptxgenjs_helpers");

const OUT_DIR = __dirname;
const OUTPUT_FILE = path.join(OUT_DIR, "medislim-strategy-playbook-50.pptx");

const pptx = new PptxGenJS();
pptx.layout = "LAYOUT_WIDE";
pptx.author = "OpenAI Codex";
pptx.company = "MediSlim";
pptx.subject = "MediSlim strategy and operations playbook";
pptx.title = "MediSlim 战略与运营行动方针";
pptx.lang = "zh-CN";
pptx.theme = {
  headFontFace: "Heiti SC",
  bodyFontFace: "Heiti SC",
  lang: "zh-CN",
};

const C = {
  ink: "18322F",
  teal: "2C6E68",
  green: "4A8F74",
  mint: "DCEFE8",
  sage: "8DB4A0",
  sand: "F4F0E7",
  cream: "FBF9F4",
  gold: "B3883B",
  rust: "B65C49",
  rose: "EACFC8",
  blue: "5078A5",
  sky: "D9E7F5",
  gray: "6A7573",
  softGray: "E6E1D8",
  white: "FFFFFF",
  black: "111111",
};

const CARD_ACCENTS = [C.teal, C.green, C.gold, C.blue, C.rust, C.sage];
const FOOTER_TEXT =
  "内部行动方针版 | 来源：MediSlim-商业方案-v1.0 / MediSlim-OPC运营手册-v1.0 / 仓库业务文档";

function toText(body) {
  return Array.isArray(body) ? body.join("\n") : body;
}

function addPageChrome(slide, pageNum, sectionLabel, title, subtitle) {
  slide.background = { color: C.cream };

  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 13.333,
    h: 0.12,
    line: { color: C.teal, transparency: 100 },
    fill: { color: C.teal },
  });

  slide.addText(title, {
    x: 0.58,
    y: 0.28,
    w: 9.2,
    h: 0.45,
    fontFace: "Heiti SC",
    fontSize: 24,
    bold: true,
    color: C.ink,
    margin: 0,
  });

  if (subtitle) {
    slide.addText(subtitle, {
      x: 0.58,
      y: 0.76,
      w: 9.8,
      h: 0.28,
      fontFace: "Heiti SC",
      fontSize: 9.5,
      color: C.gray,
      margin: 0,
    });
  }

  slide.addShape(pptx.ShapeType.roundRect, {
    x: 10.82,
    y: 0.28,
    w: 1.55,
    h: 0.36,
    rectRadius: 0.08,
    line: { color: C.softGray, transparency: 100 },
    fill: { color: C.mint },
  });
  slide.addText(sectionLabel, {
    x: 10.82,
    y: 0.33,
    w: 1.55,
    h: 0.2,
    align: "center",
    fontFace: "Heiti SC",
    fontSize: 10,
    color: C.teal,
    bold: true,
    margin: 0,
  });

  slide.addShape(pptx.ShapeType.line, {
    x: 0.58,
    y: 7.08,
    w: 12.15,
    h: 0,
    line: { color: C.softGray, width: 1.1 },
  });

  slide.addText(FOOTER_TEXT, {
    x: 0.58,
    y: 7.13,
    w: 9.6,
    h: 0.18,
    fontFace: "Heiti SC",
    fontSize: 8,
    color: C.gray,
    margin: 0,
  });

  slide.addText(String(pageNum).padStart(2, "0"), {
    x: 12.12,
    y: 7.08,
    w: 0.6,
    h: 0.22,
    align: "right",
    fontFace: "Heiti SC",
    fontSize: 9.5,
    bold: true,
    color: C.teal,
    margin: 0,
  });
}

function addFitText(slide, text, box, baseOpts = {}) {
  const sizing = autoFontSize(text, "Heiti SC", {
    x: box.x,
    y: box.y,
    w: box.w,
    h: box.h,
    fontSize: baseOpts.fontSize || 14,
    minFontSize: baseOpts.minFontSize || 10.8,
    maxFontSize: baseOpts.maxFontSize || (baseOpts.fontSize || 14),
    mode: "shrink",
    margin: 0,
    breakLine: false,
    valign: "top",
  });

  slide.addText(text, {
    ...sizing,
    x: box.x,
    y: box.y,
    w: box.w,
    h: box.h,
    fontFace: "Heiti SC",
    color: baseOpts.color || C.ink,
    bold: !!baseOpts.bold,
    italic: !!baseOpts.italic,
    margin: 0,
    valign: "top",
    breakLine: false,
  });
}

function addCard(slide, x, y, w, h, card, accent) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x,
    y,
    w,
    h,
    rectRadius: 0.08,
    line: { color: C.softGray, width: 1 },
    fill: { color: C.white },
    shadow: safeOuterShadow("7F8C88", 0.12, 45, 1.5, 0.8),
  });

  slide.addShape(pptx.ShapeType.rect, {
    x,
    y,
    w,
    h: 0.12,
    line: { color: accent, transparency: 100 },
    fill: { color: accent },
  });

  const titleWidth = card.tag ? w - 1.56 : w - 0.36;

  slide.addText(card.title, {
    x: x + 0.18,
    y: y + 0.18,
    w: titleWidth,
    h: 0.34,
    fontFace: "Heiti SC",
    fontSize: 15.5,
    bold: true,
    color: C.ink,
    margin: 0,
  });

  if (card.tag) {
    slide.addShape(pptx.ShapeType.roundRect, {
      x: x + w - 1.18,
      y: y + 0.16,
      w: 0.95,
      h: 0.24,
      rectRadius: 0.04,
      line: { color: C.softGray, transparency: 100 },
      fill: { color: C.sand },
    });
    slide.addText(card.tag, {
      x: x + w - 1.18,
      y: y + 0.19,
      w: 0.95,
      h: 0.16,
      align: "center",
      fontFace: "Heiti SC",
      fontSize: 8.5,
      color: accent,
      bold: true,
      margin: 0,
    });
  }

  addFitText(
    slide,
    toText(card.body),
    { x: x + 0.18, y: y + 0.58, w: w - 0.36, h: h - 0.78 },
    { fontSize: card.fontSize || 13.6, minFontSize: card.minFontSize || 10.8 }
  );
}

function addGridSlide(spec, pageNum) {
  const slide = pptx.addSlide();
  addPageChrome(slide, pageNum, spec.section, spec.title, spec.subtitle || "");

  const cols = spec.cols || 2;
  const cards = spec.cards || [];
  const rows = Math.ceil(cards.length / cols);
  const left = 0.58;
  const top = 1.24;
  const gapX = 0.24;
  const gapY = 0.24;
  const areaW = 12.15;
  const areaH = 5.55;
  const cardW = (areaW - gapX * (cols - 1)) / cols;
  const cardH = (areaH - gapY * (rows - 1)) / rows;

  cards.forEach((card, idx) => {
    const row = Math.floor(idx / cols);
    const col = idx % cols;
    const x = left + col * (cardW + gapX);
    const y = top + row * (cardH + gapY);
    const accent = card.accent || CARD_ACCENTS[idx % CARD_ACCENTS.length];
    addCard(slide, x, y, cardW, cardH, card, accent);
  });

  warnIfSlideHasOverlaps(slide, pptx);
  warnIfSlideElementsOutOfBounds(slide, pptx);
}

function addCoverSlide() {
  const slide = pptx.addSlide();
  slide.background = { color: C.ink };

  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 13.333,
    h: 7.5,
    line: { color: C.ink, transparency: 100 },
    fill: { color: C.ink },
  });

  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 13.333,
    h: 0.18,
    line: { color: C.gold, transparency: 100 },
    fill: { color: C.gold },
  });

  slide.addText("MediSlim", {
    x: 0.72,
    y: 0.7,
    w: 4.4,
    h: 0.55,
    fontFace: "Heiti SC",
    fontSize: 30,
    bold: true,
    color: C.white,
    margin: 0,
  });

  slide.addText("战略与运营行动方针", {
    x: 0.72,
    y: 1.52,
    w: 6.8,
    h: 0.8,
    fontFace: "Heiti SC",
    fontSize: 26,
    bold: true,
    color: C.white,
    margin: 0,
  });

  slide.addText("基于商业方案与 OPC 运营手册整合而成的 50 页内部经营版", {
    x: 0.72,
    y: 2.34,
    w: 7.8,
    h: 0.32,
    fontFace: "Heiti SC",
    fontSize: 12.5,
    color: "D9E6E2",
    margin: 0,
  });

  slide.addText(
    "目标不是做一份介绍稿，而是形成未来 90 天可反复复盘、可逐页执行、可作为团队统一语言的经营蓝图。",
    {
      x: 0.72,
      y: 3.02,
      w: 7.4,
      h: 0.8,
      fontFace: "Heiti SC",
      fontSize: 17,
      color: C.mint,
      margin: 0,
      valign: "mid",
    }
  );

  const coverCards = [
    ["商业模型", "三圈产品结构\n轻资产外包履约\n订阅制现金流"],
    ["增长系统", "公域种草\n私域转化\n复购裂变"],
    ["经营治理", "合规红线\n数据看板\n30/90天计划"],
  ];

  coverCards.forEach((item, idx) => {
    const x = 0.72 + idx * 2.08;
    slide.addShape(pptx.ShapeType.roundRect, {
      x,
      y: 4.45,
      w: 1.86,
      h: 1.18,
      rectRadius: 0.08,
      line: { color: CARD_ACCENTS[idx], transparency: 100 },
      fill: { color: CARD_ACCENTS[idx] },
    });
    slide.addText(item[0], {
      x: x + 0.12,
      y: 4.6,
      w: 1.62,
      h: 0.22,
      fontFace: "Heiti SC",
      fontSize: 11,
      color: C.white,
      bold: true,
      margin: 0,
      align: "center",
    });
    slide.addText(item[1], {
      x: x + 0.12,
      y: 4.9,
      w: 1.62,
      h: 0.5,
      fontFace: "Heiti SC",
      fontSize: 10,
      color: C.white,
      margin: 0,
      align: "center",
      valign: "mid",
    });
  });

  slide.addShape(pptx.ShapeType.roundRect, {
    x: 8.45,
    y: 1.08,
    w: 4.1,
    h: 4.9,
    rectRadius: 0.12,
    line: { color: "40615D", width: 1 },
    fill: { color: "214540" },
  });

  slide.addText("本版使用方式", {
    x: 8.8,
    y: 1.45,
    w: 2.2,
    h: 0.28,
    fontFace: "Heiti SC",
    fontSize: 16,
    color: C.white,
    bold: true,
    margin: 0,
  });

  addFitText(
    slide,
    [
      "1. 先统一边界：我们是流量+技术服务公司，不是医疗主体。",
      "2. 先打爆第二圈：药食同源与保健品是冷启动现金流核心。",
      "3. 处方类只走私域与互联网医院，绝不在公域直接营销。",
      "4. 每周经营会对照本 deck 更新 KPI、风险、行动人。",
      "5. 所有新增产品、渠道、活动，都必须穿过合规和单位经济模型。",
    ].join("\n"),
    { x: 8.8, y: 1.95, w: 3.4, h: 3.55 },
    { fontSize: 14, minFontSize: 11.2, color: "E9F2EF" }
  );

  slide.addText("版本：2026-04-05 | 生成方式：两份源文档 + 仓库业务文档整合", {
    x: 0.72,
    y: 6.88,
    w: 8.1,
    h: 0.2,
    fontFace: "Heiti SC",
    fontSize: 9,
    color: "C8D8D4",
    margin: 0,
  });
}

const slides = [
  {
    section: "总览",
    title: "这份幻灯怎么用",
    subtitle: "它应当被当作经营操作系统，而不是一次性展示材料",
    cols: 2,
    cards: [
      {
        title: "定位",
        body: "这是内部经营版。\n用于统一战略、周会复盘、合作对接、项目排期。\n对外融资版可由此压缩成 12-15 页。",
      },
      {
        title: "更新频率",
        body: "每周更新 KPI、风险、行动项。\n每月更新财务假设、渠道 ROI、合作方状态。\n每季度更新品类路线图。",
      },
      {
        title: "阅读顺序",
        body: "先看 1-10 页定边界。\n再看增长、运营、财务、合规模块。\n最后用 30/90 天计划落地。",
      },
      {
        title: "管理要求",
        body: "每页必须对应一个动作、一个负责人、一个指标。\n无法落到动作的内容不进入经营版。\n数字统一以数据看板为准。",
      },
    ],
  },
  {
    section: "总览",
    title: "50 页内容地图",
    subtitle: "全 deck 分成 10 个模块，分别回答 10 个经营问题",
    cols: 2,
    cards: [
      {
        title: "模块 1 战略总览",
        body: "回答：为什么是现在、为什么是我们、为什么是这个模式。\n覆盖市场、对标、边界、目标、商业模型。",
      },
      {
        title: "模块 2 产品设计",
        body: "回答：卖什么、先卖什么、如何组合。\n覆盖三圈模型、价格带、爆品、订阅盒子、用户画像。",
      },
      {
        title: "模块 3 增长引擎",
        body: "回答：流量从哪里来、如何沉淀到私域。\n覆盖公域矩阵、内容工厂、企微、公众号、小红书、抖音。",
      },
      {
        title: "模块 4 交付系统",
        body: "回答：用户如何从线索变成复购客户。\n覆盖评估、分诊、方案、下单、状态机、履约、随访、裂变。",
      },
      {
        title: "模块 5 组织与系统",
        body: "回答：一人公司如何运转。\n覆盖 AI 四层架构、自动化清单、OPC 组织模型、合作伙伴管理。",
      },
      {
        title: "模块 6 财务与治理",
        body: "回答：怎么赚钱、怎么控风险、怎么推进。\n覆盖资金流、单位经济、收入预测、看板、合规、应急、30/90 天计划。",
      },
    ],
  },
  {
    section: "战略",
    title: "执行摘要",
    subtitle: "先用 4 张卡片记住经营判断，再展开所有细节",
    cols: 2,
    cards: [
      {
        title: "一句话模式",
        body: "MediSlim 是 AI 驱动的消费医疗+健康消费品平台。\n我们做品牌、流量、评估、CRM、复购；\n持牌问诊、处方与药品销售交给合作方。",
      },
      {
        title: "核心增长逻辑",
        body: "公域以药食同源和保健品建立低门槛流量入口。\n私域再承接到互联网医院与处方类服务。\n长期靠订阅、复购、裂变形成现金流。",
      },
      {
        title: "经营优先级",
        body: "优先做第二圈现金流，再用第三圈拉利润，再用第一圈建立专业信任。\n顺序错误，组织会直接陷入合规和获客成本问题。",
      },
      {
        title: "12 个月目标",
        body: "内部测算目标：M12 达到 10,000 付费用户、月收入约 765 万元。\n关键前提是线索转化、复购率和合规稳定三件事同时成立。",
      },
    ],
  },
  {
    section: "战略",
    title: "市场机会：为什么这个赛道值得做",
    subtitle: "不是做“线上卖货”，而是做“持续健康管理的消费入口”",
    cols: 2,
    cards: [
      {
        title: "需求端变化",
        body: "减重、亚健康、女性调养、睡眠、肠胃、护肝都在持续消费化。\n用户想要的是轻诊疗、轻咨询、轻决策，而不是复杂医疗流程。",
      },
      {
        title: "供给端空缺",
        body: "传统医院看病效率低，保健品市场同质化重，用户缺可信的个性化方案。\n“有人解释+有人跟进”仍然是巨大空缺。",
      },
      {
        title: "渠道端机会",
        body: "微信生态、小红书、抖音已经形成“内容种草-私域成交-社群复购”的成熟路径。\n只要合规边界清晰，流量并不缺。",
      },
      {
        title: "模型端优势",
        body: "中国的药食同源文化与体质调理认知，给了我们 Medvi 在美国没有的第二增长曲线。\n这决定了更高复购率和更低毛利压力。",
      },
    ],
  },
  {
    section: "战略",
    title: "对标 Medvi：该学什么，不该学什么",
    subtitle: "学它的极简架构，不复制它的监管灰区",
    cols: 2,
    cards: [
      {
        title: "必须复制的部分",
        body: "前端只做流量、评估、支付、复购管理。\n把持牌能力交给外部网络。\n让平台像 SaaS 一样运转，而不是像医院一样运转。",
      },
      {
        title: "必须本土化的部分",
        body: "美国靠 Google/Meta 广告，中国必须靠微信、小红书、抖音和私域沉淀。\n美国靠 GLP-1 单品，中国需要三圈模型。",
      },
      {
        title: "不能照搬的部分",
        body: "不能在中国公域直接营销处方药。\n不能把模糊疗效表述当作增长技巧。\n不能假设用户会接受纯海外式的功能性话术。",
      },
      {
        title: "我们的升级点",
        body: "中医体质辨识、药食同源订阅、企微陪伴式服务、低成本 AI 自动化。\n这些才是中国版 MediSlim 的真实护城河。",
      },
    ],
  },
  {
    section: "战略",
    title: "中国化机会与约束",
    subtitle: "增长空间巨大，但必须先画出红线",
    cols: 2,
    cards: [
      {
        title: "平台约束",
        body: "小红书、抖音、微信都对药品、医疗功效、前后对比图极度敏感。\n公域要做健康内容，不做直接药品销售表达。",
      },
      {
        title: "持牌约束",
        body: "问诊与处方必须归互联网医院和执业医师。\n药品销售必须归持牌药房。\n我们不能变成事实上的非法医疗主体。",
      },
      {
        title: "内容机会",
        body: "养生、调理、体质、节气、轻体、睡眠、情绪管理都天然适合内容传播。\n这使第二圈和第三圈更适合冷启动。",
      },
      {
        title: "商业机会",
        body: "中国用户更能接受“组合式管理”而不是单一药物。\n套餐盒、社群、直播、节日活动都能把 LTV 做高。",
      },
    ],
  },
  {
    section: "战略",
    title: "项目定位与边界",
    subtitle: "边界不清，后面所有增长动作都会出问题",
    cols: 2,
    cards: [
      {
        title: "我们是谁",
        body: "流量+技术服务公司。\n主营品牌、用户获取、AI 评估、患者管理、复购运营、数据看板。",
      },
      {
        title: "我们不是什么",
        body: "不是医疗机构，不直接行医，不直接持有处方权，不直接销售处方药。\n不碰高风险诊疗动作。",
      },
      {
        title: "合作方边界",
        body: "互联网医院负责问诊和处方。\n药房负责药品调配与配送。\n食品工厂/保健品企业负责生产与供货。",
      },
      {
        title: "经营红线",
        body: "任何人不能在公域许诺疗效、暗示治愈、绕开医师审核、伪造案例或超范围采集数据。\n红线优先于短期 GMV。",
      },
    ],
  },
  {
    section: "战略",
    title: "战略目标与北极星指标",
    subtitle: "所有动作必须服务于 4 个阶段目标和 1 个北极星指标",
    cols: 2,
    cards: [
      {
        title: "阶段一：M1-M3",
        body: "验证 3 个核心产品、1 条稳定线索链路、1 套私域成交话术。\n目标不是规模，而是找对模型。",
        tag: "验证",
      },
      {
        title: "阶段二：M4-M6",
        body: "建立可复制的投放-私域-成交-复购流程。\n形成首个正向现金流月，并确认主打渠道。",
        tag: "复制",
      },
      {
        title: "阶段三：M7-M9",
        body: "扩大品类、提高复购、引入订阅盒。\n把组织从“创始人亲自盯”切到“系统自动跑”。",
        tag: "放大",
      },
      {
        title: "北极星",
        body: "北极星指标不是单日 GMV，而是 MRR（月经常性收入）。\n原因：MRR 直接反映复购、订阅和健康经营质量。",
        tag: "核心",
      },
    ],
  },
  {
    section: "商业",
    title: "商业模式总览",
    subtitle: "平台的收入、成本、能力边界全部围绕这条链展开",
    cols: 2,
    cards: [
      {
        title: "收入来源",
        body: "首单成交收入。\n订阅续费收入。\n组合盒/加购收入。\n私域活动带来的增量收入。",
      },
      {
        title: "核心成本",
        body: "产品与药品成本、合作方分成、物流、流量投放、AI 系统、人力。\n本质上是 CAC 和复购率的平衡游戏。",
      },
      {
        title: "能力配置",
        body: "自己做高频、可标准化、能沉淀数据的前端环节。\n外包低频、持牌、重履约的后端环节。",
      },
      {
        title: "商业判断",
        body: "只要 CAC 可控、30 天复购成立、供应稳定，模型就能滚起来。\n一旦复购不成立，平台会退化成高成本卖货生意。",
      },
    ],
  },
  {
    section: "商业",
    title: "三圈飞轮：平台最重要的结构设计",
    subtitle: "三圈不是三个业务，而是一套彼此导流的生命周期设计",
    cols: 2,
    cards: [
      {
        title: "第一圈：处方医疗",
        body: "作用是建立专业信任与解决高痛点需求。\n品类重在权威感与用户愿意付费，而不是公域规模。",
      },
      {
        title: "第二圈：药食同源",
        body: "作用是低门槛、高频复购、文化认同。\n它是最适合冷启动和社交传播的现金流产品带。",
      },
      {
        title: "第三圈：保健品",
        body: "作用是提升客单价和利润率。\n它承接第二圈用户，并把用户带向更丰富的长期健康管理。",
      },
      {
        title: "飞轮逻辑",
        body: "第一圈给信任，第二圈给复购，第三圈给利润。\n数据反哺 AI 推荐，AI 又提升转化和复购，形成闭环。",
      },
    ],
  },
  {
    section: "产品",
    title: "第一圈：处方医疗产品路线",
    subtitle: "目的不是公域放量，而是在私域建立“专业可信”认知",
    cols: 3,
    cards: [
      {
        title: "GLP-1 减重",
        body: "首月 ¥399，续费 ¥599/月。\n高痛点、高讨论度、高复购。\n必须通过互联网医院与药房链路。",
      },
      {
        title: "防脱生发",
        body: "米诺地尔+非那雄胺组合。\n适合男性长期管理。\n咨询转化率高，复购周期较稳定。",
      },
      {
        title: "男性健康",
        body: "西地那非/他达拉非等。\n私密需求明显，私域成交效率高。\n需要严格处理隐私与话术。",
      },
      {
        title: "助眠调理",
        body: "以轻症管理切入。\n可与褪黑素、放松管理、内容服务组合。\n适合作为桥接型产品。",
      },
      {
        title: "皮肤处方",
        body: "祛痘、维 A 酸、阿达帕林等路径。\n更适合年轻女性用户。\n内容引流能力强，但合规要求高。",
      },
      {
        title: "经营原则",
        body: "公域不直接卖药。\n私域转互联网医院。\n所有处方类只承接已产生咨询意愿的用户。",
        tag: "原则",
      },
    ],
  },
  {
    section: "产品",
    title: "第二圈：药食同源产品路线",
    subtitle: "冷启动现金流的第一优先级，也是最强的中国特色差异化",
    cols: 3,
    cards: [
      {
        title: "祛湿轻体",
        body: "红豆薏米+茯苓+陈皮。\n月价 ¥168。\n大众认知强，转化与复购潜力高。",
      },
      {
        title: "气血调养",
        body: "红枣+枸杞+阿胶+黄芪。\n月价 ¥198。\n适合女性长期调养与送礼场景。",
      },
      {
        title: "护肝养生",
        body: "葛根+枳椇子+菊花+决明子。\n月价 ¥168。\n适合男性、应酬、熬夜场景。",
      },
      {
        title: "暖宫驱寒",
        body: "姜+红糖+桂圆+当归。\n月价 ¥158。\n适合女性月经前后与季节营销。",
      },
      {
        title: "健脾养胃",
        body: "山药+莲子+芡实+薏米。\n月价 ¥148。\n适合长期肠胃不适与轻体人群。",
      },
      {
        title: "润肺清燥",
        body: "雪梨+百合+银耳+枇杷。\n月价 ¥138。\n季节爆品，适合秋冬专题化内容运营。",
      },
    ],
  },
  {
    section: "产品",
    title: "第三圈：保健品与营养补充路线",
    subtitle: "承接第二圈用户，提高客单价和毛利率",
    cols: 3,
    cards: [
      {
        title: "益生菌",
        body: "减重、肠胃、排便、免疫都可挂钩。\n月价 ¥198。\n与第二圈联动最强。",
      },
      {
        title: "胶原蛋白",
        body: "女性美容与轻医美辅助场景。\n月价 ¥228。\n更适合内容种草与礼盒化。",
      },
      {
        title: "维生素 D / K2",
        body: "办公室人群基础营养。\n月价 ¥98。\n适合作为低门槛加购单品。",
      },
      {
        title: "Omega-3 / 鱼油",
        body: "心血管、大脑健康、抗炎认知强。\n月价 ¥168。\n适合 30+ 人群长期管理。",
      },
      {
        title: "辅酶 Q10 / 叶黄素",
        body: "一个打心脏与抗衰，一个打护眼。\n非常适合以场景专题做组合销售。",
      },
      {
        title: "蛋白粉 / 多维",
        body: "适合运动、控糖、减脂、全家健康场景。\n可做家庭装与订阅盒的标准 SKU。",
      },
    ],
  },
  {
    section: "产品",
    title: "产品组合与价格带设计",
    subtitle: "目标不是 SKU 越多越好，而是让每个价格带都有明确角色",
    cols: 2,
    cards: [
      {
        title: "引流单",
        body: "用于降低首次下单门槛。\n代表 SKU：祛湿轻体、益生菌、轻咨询服务。\n原则是痛点明确、文案简单、风险低。",
      },
      {
        title: "利润单",
        body: "用于提高毛利和客单。\n代表 SKU：胶原蛋白、气血调养、护肝养生、Q10。\n原则是效果感知强、故事性强、适合组合售卖。",
      },
      {
        title: "订阅盒",
        body: "女性养生盒、男性健康盒、全家健康盒。\n月价可做到 ¥398-598。\n用于提升留存、品牌感和家庭场景渗透。",
      },
      {
        title: "价格带逻辑",
        body: "¥99-199 做入门与加购。\n¥168-228 做主力现金流。\n¥398+ 做组合盒与高粘性经营。",
      },
    ],
  },
  {
    section: "用户",
    title: "核心用户画像",
    subtitle: "先抓 4 类高意愿、高复购、高传播人群，不要一开始做全市场",
    cols: 2,
    cards: [
      {
        title: "减重白领女性",
        body: "25-38 岁，长期节食反复失败。\n关注体重、代谢、颜值、肠胃与内分泌。\n愿意为“省脑子+有人跟进”付费。",
      },
      {
        title: "湿气焦虑型人群",
        body: "长期感觉水肿、乏力、困倦、肠胃差。\n对“祛湿”“体质调理”认知强。\n更适合第二圈冷启动。",
      },
      {
        title: "熬夜应酬男士",
        body: "30-45 岁，护肝、睡眠、男性健康都是高频痛点。\n更偏向私域成交，重视隐私、效率和体面表达。",
      },
      {
        title: "家庭健康采购者",
        body: "习惯为伴侣、父母、孩子采购健康产品。\n更看重品牌可信、组合管理、长期配送和售后稳定。",
      },
    ],
  },
  {
    section: "用户",
    title: "用户真实需求：他们不是想买产品，而是想买确定性",
    subtitle: "解决“不会选、怕踩坑、没人跟进”比单纯卖功能更重要",
    cols: 2,
    cards: [
      {
        title: "想省决策成本",
        body: "用户不想自己查功效、成分和禁忌。\n他们想要的是“直接告诉我该用什么、怎么用、多久见效”。",
      },
      {
        title: "想降低试错风险",
        body: "健康消费最怕买错、吃错、坚持不了。\n所以评估、陪伴、提醒、复盘都必须内置进服务里。",
      },
      {
        title: "想要有人盯进展",
        body: "如果只有商品链接，没有跟进，用户很快流失。\n企微顾问与 AI 随访决定了复购率上限。",
      },
      {
        title: "想在私密环境成交",
        body: "减重、生发、男性健康等需求天然私密。\n成交环境必须从公域内容转向私域咨询和可追踪的服务链路。",
      },
    ],
  },
  {
    section: "增长",
    title: "渠道漏斗设计",
    subtitle: "让每个渠道只承担自己最擅长的一段，而不是所有事情都做",
    cols: 3,
    cards: [
      {
        title: "公域触达",
        body: "小红书、抖音、公众号、视频号、朋友圈广告。\n负责认知和兴趣，不负责最后成交。",
      },
      {
        title: "留资转私域",
        body: "H5 留资、关键词回复、企微加粉、社群引导。\n目标是留下可持续触达的关系资产。",
      },
      {
        title: "评估与分层",
        body: "AI 问卷把人分成处方类、药食同源类、营养补充类。\n不同人走不同转化路径。",
      },
      {
        title: "成交转化",
        body: "健康顾问+方案说明+支付引导。\n处方类进入互联网医院；非处方类直接成单。",
      },
      {
        title: "复购与加购",
        body: "Day 21 提醒、周跟进、场景加购、组合盒升级。\n没有复购，漏斗就会塌。",
      },
      {
        title: "裂变",
        body: "优惠券、试用装、健康大使、区域合伙人。\n裂变不是冷启动核心，但会成为后期 ROI 放大器。",
      },
    ],
  },
  {
    section: "运营",
    title: "完整用户旅程：从触达到裂变的 9 步",
    subtitle: "每一步都要有动作、系统状态和负责主体",
    cols: 3,
    cards: [
      { title: "1 触达", body: "社交媒体广告、社群推荐、口碑传播。\n目标：获取注意力和第一兴趣。", tag: "Step" },
      { title: "2 落地", body: "H5 落地页、企微社群、朋友推荐。\n目标：把流量变成线索。", tag: "Step" },
      { title: "3 评估", body: "AI 问卷 5 分钟完成。\n根据症状、体质、需求进入不同方案流。", tag: "Step" },
      { title: "4 方案", body: "AI 生成初步方案，必要时交医师审核。\n目标：让用户看到清晰路径。", tag: "Step" },
      { title: "5 下单", body: "微信支付 / 支付宝。\n目标：降低支付摩擦和退款风险。", tag: "Step" },
      { title: "6 履约", body: "处方类走医院和药房；\n药食同源/保健品走工厂或仓库。", tag: "Step" },
      { title: "7 随访", body: "企微顾问 1 对 1 跟踪。\n配合 AI 每周打卡和效果复盘。", tag: "Step" },
      { title: "8 复购", body: "Day 21 自动提醒。\n一键续费和自动发货，降低决策中断。", tag: "Step" },
      { title: "9 裂变", body: "邀请好友、优惠券、社群活动、用户故事。\n让满意用户变流量入口。", tag: "Step" },
    ],
  },
  {
    section: "运营",
    title: "AI 评估与分诊引擎",
    subtitle: "评估不是问卷装饰，而是成交前的第一道风控和推荐系统",
    cols: 2,
    cards: [
      {
        title: "评估输入",
        body: "基础信息、核心诉求、既往病史、过敏史、妊娠状态、当前用药、生活习惯。\n不同品类补充不同题组。",
      },
      {
        title: "评估输出",
        body: "风险等级、适用品类、推荐方案、禁忌提醒、是否需要医师审核。\n用户必须看到“为什么推荐”。",
      },
      {
        title: "分诊规则",
        body: "高风险或处方类自动进入互联网医院链路。\n中低风险用户进入药食同源或保健品成交链路。",
      },
      {
        title: "经营价值",
        body: "把用户从“随便问问”转成“已经理解自己问题的人”。\n这一步直接决定支付转化率和投诉率。",
      },
    ],
  },
  {
    section: "运营",
    title: "AI 体质辨识：最重要的中国化能力",
    subtitle: "它不是医学诊断，而是用户教育、推荐和复购的核心桥梁",
    cols: 3,
    cards: [
      { title: "平和质", body: "通用保健与季节管理。\n适合作为组合盒的基础盘。" },
      { title: "气虚质", body: "黄芪+党参+山药。\n适合乏力、易疲劳、易感冒人群。" },
      { title: "阳虚质", body: "肉桂+干姜+韭菜子。\n适合怕冷、代谢低、畏寒人群。" },
      { title: "阴虚质", body: "百合+枸杞+石斛。\n适合熬夜、口干、烦热与长期耗损人群。" },
      { title: "痰湿 / 湿热", body: "薏米+茯苓+陈皮 / 菊花+绿豆。\n最适合轻体、祛湿与季节推广。" },
      { title: "血瘀 / 气郁 / 特禀", body: "活血、疏肝、过敏调理方向。\n适合作为长期管理与内容科普主题。" },
    ],
  },
  {
    section: "运营",
    title: "方案生成与医师审核",
    subtitle: "用户感知的是“专业方案”，平台管理的是“风险与责任边界”",
    cols: 2,
    cards: [
      {
        title: "方案结构",
        body: "核心问题判断、目标周期、产品建议、服用说明、禁忌提醒、随访节点、复购建议。\n每份方案都要可解释。",
      },
      {
        title: "何时必须医师审核",
        body: "处方需求、合并基础疾病、用药冲突、孕哺期、过敏高风险、症状超出轻管理范围。\n不能模糊处理。",
      },
      {
        title: "对用户的表达",
        body: "公开讲“方案建议”，私域讲“评估结果”，处方类明确说明“需医师进一步审核”。\n避免越界承诺。",
      },
      {
        title: "记录与追溯",
        body: "方案版本、审核结果、沟通记录、支付时间、物流信息都要可回溯。\n这是后续投诉和复盘的基础。",
      },
    ],
  },
  {
    section: "运营",
    title: "订单状态机：15 个状态如何自动流转",
    subtitle: "状态机不是技术细节，而是运营效率和风险控制的骨架",
    cols: 2,
    cards: [
      {
        title: "完整状态",
        body: "new_lead → contacted → assessed → paid → ih_submitted → doctor_review → prescribed → pharmacy_order → dispensing → shipped → delivered → in_use → refill_reminder → refill_paid → cancelled",
        fontSize: 12.3,
      },
      {
        title: "超时处理",
        body: "30 分钟未联系自动预警。\n24 小时未审核自动催医师。\n48 小时未发货自动升级到人工处理。",
      },
      {
        title: "自动动作",
        body: "状态变化同步消息、顾问待办、用户提醒、物流回写、复购触发。\n尽量不依赖人记忆推进流程。",
      },
      {
        title: "经营意义",
        body: "任何卡单、漏单、退款、投诉，最后都能回到状态机定位责任点。\n这就是一人公司能放大的前提。",
      },
    ],
  },
  {
    section: "运营",
    title: "履约网络与服务承诺",
    subtitle: "用户愿不愿意复购，很大程度取决于交付体验是否稳定",
    cols: 2,
    cards: [
      {
        title: "合作层分工",
        body: "互联网医院负责问诊开方；\n药房负责配药与药品履约；\n工厂/仓库负责药食同源与保健品直发；\n顺丰/京东负责末端配送。",
      },
      {
        title: "建议 SLA",
        body: "线索 30 分钟内首次联系。\n处方审核 24 小时内完成。\n非处方订单 24 小时内出库。\n用户 48-72 小时内收到货。",
      },
      {
        title: "包装要求",
        body: "隐私品类使用保密包装。\n配送内容、批次、有效期、客服二维码必须完整。\n用户收到即知道下一步做什么。",
      },
      {
        title: "异常处理",
        body: "缺货、晚发、拒收、破损、地址错误必须有标准分流。\n不能让用户在客服里重复讲三次问题。",
      },
    ],
  },
  {
    section: "运营",
    title: "随访、复购与裂变",
    subtitle: "真正拉开差距的不是首单成交，而是 28 天内有没有形成第二次动作",
    cols: 2,
    cards: [
      {
        title: "Day 0-7",
        body: "确认签收、解释用法、建立打卡关系。\n目标：降低首次流失和误用风险。",
      },
      {
        title: "Day 8-20",
        body: "每周一次效果反馈。\n收集体重、睡眠、食欲、精力、排便等关键变量。\n目标：建立“有人在盯我”的感知。",
      },
      {
        title: "Day 21-28",
        body: "系统自动提醒 + 顾问跟进效果 + 给出下周期建议。\n处方类进入续方，非处方类进入续购或组合升级。",
      },
      {
        title: "裂变梯度",
        body: "邀请 1 人送券；\n邀请 3 人送月度产品；\n邀请 10 人成为健康大使；\n邀请 50 人成为区域合伙人。",
      },
    ],
  },
  {
    section: "增长",
    title: "公域增长总策略",
    subtitle: "公域负责信任预热与线索获取，私域负责成交与复购",
    cols: 2,
    cards: [
      {
        title: "内容定位",
        body: "公开讲健康认知、体质管理、日常调理、营养补充、生活方式。\n避免直接讲药品效果和治疗承诺。",
      },
      {
        title: "预算逻辑",
        body: "预算优先给可验证 ROI 的小红书、抖音、微信生态。\n冷启动阶段宁可内容重于投放，也不盲目烧广告。",
      },
      {
        title: "转化路径",
        body: "内容吸引兴趣 → 私信/评论引导 → H5 评估 → 企微沉淀 → 顾问成交。\n任何一步断开都会导致 CAC 虚高。",
      },
      {
        title: "优化方法",
        body: "每周只优化 3 件事：点击率、留资率、评估完成率。\n先把前端漏斗跑顺，再扩预算。",
      },
    ],
  },
  {
    section: "增长",
    title: "微信生态打法",
    subtitle: "微信是最重要的沉淀场，不只是一个流量入口",
    cols: 2,
    cards: [
      {
        title: "承接结构",
        body: "公众号做内容与关键词应答。\n企微做一对一成交和随访。\nH5 做评估和支付。\n未来小程序负责更完整的服务体验。",
      },
      {
        title: "入口设计",
        body: "所有内容都应有明确 CTA：领评估、领方案、领清单、加顾问、进社群。\n不能让阅读结束后没有动作。",
      },
      {
        title: "菜单建议",
        body: "健康评估、我的订单、咨询顾问三个一级入口足够。\n复杂菜单会稀释转化注意力。",
      },
      {
        title: "经营角色",
        body: "微信是用户资产库，也是复购发动机。\n要把渠道行为沉淀到可复用的关系链上，而不是只追单次阅读量。",
      },
    ],
  },
  {
    section: "增长",
    title: "企业微信 / 社群 SOP",
    subtitle: "私域不是“多聊天”，而是用标准化陪伴换高复购率",
    cols: 2,
    cards: [
      {
        title: "顾问一对一节奏",
        body: "Day 0 欢迎与评估解释。\nDay 1-3 指导使用。\nDay 7 第一次反馈。\nDay 14 复盘感受。\nDay 21 提前铺垫续费。",
        fontSize: 12.8,
      },
      {
        title: "社群运营动作",
        body: "每日早报：一个知识点。\n每周直播：医师答疑或专题讲解。\n每月活动：试用、打卡、晒单、节气主题。",
      },
      {
        title: "群内内容结构",
        body: "知识 40%，用户故事 20%，活动 20%，产品教育 20%。\n比例失衡就会变成纯广告群。",
      },
      {
        title: "关键指标",
        body: "加粉通过率、首条回复率、7 日留存、复购率、群内活跃率、转介绍率。\n不看这些，私域会很快失控。",
      },
    ],
  },
  {
    section: "增长",
    title: "小红书 SOP",
    subtitle: "小红书负责建立需求认知和生活方式场景，不负责做硬转化",
    cols: 2,
    cards: [
      {
        title: "账号矩阵",
        body: "1 个官方号 + 3 个人设号（减重 / 养生 / 医生科普）+ 10 个素人号。\n矩阵的目的是覆盖多种表达方式。",
      },
      {
        title: "内容节奏",
        body: "早 8 点养生知识；\n中 12 点案例或场景产品；\n晚 8 点互动科普。\n维持固定节奏比追爆款更重要。",
      },
      {
        title: "爆文公式",
        body: "标题 = 数字 + 痛点 + 方案。\n封面 = 对比图、成分图、节气图。\n正文 = 故事 + 干货 + CTA。",
      },
      {
        title: "转化动作",
        body: "评论区引导“测一测”“领清单”。\n私信引导到企微或 H5。\n所有话术都要避开处方药表达。",
      },
    ],
  },
  {
    section: "增长",
    title: "抖音 SOP",
    subtitle: "抖音适合建立广谱认知与短周期放量，但要控制内容合规风险",
    cols: 2,
    cards: [
      {
        title: "账号配置",
        body: "1 个官方号 + 1 个达人/人设号。\n官方号负责可信背书，人设号负责钩子与传播。",
      },
      {
        title: "视频公式",
        body: "前 3 秒钩子。\n中间痛点 + 方案 + 数据。\n结尾 CTA：评论区扣 1、测评链接、进群领清单。",
      },
      {
        title: "直播策略",
        body: "先做轻直播：答疑、讲节气、讲产品组合。\n不急于做硬卖货直播。\n先验证互动，再追求 GMV。",
      },
      {
        title: "风险控制",
        body: "短视频不要直接展示处方药、注射器、前后对比治疗承诺。\n全部改写成健康管理与生活方式表达。",
      },
    ],
  },
  {
    section: "增长",
    title: "公众号与内容日历",
    subtitle: "公众号是解释复杂问题、沉淀信任、串联微信生态的深度阵地",
    cols: 2,
    cards: [
      {
        title: "自动回复",
        body: "关注后发欢迎语 + AI 评估链接。\n关键词回复产品介绍、体质测试、客服引导。\n其他问题统一导向企微。",
      },
      {
        title: "栏目结构",
        body: "节气养生、轻体管理、女性调养、护肝睡眠、营养补充、用户故事。\n栏目固定，用户预期才会稳定。",
      },
      {
        title: "内容日历",
        body: "周二发认知科普。\n周四发案例拆解。\n周六发清单式内容。\n大促和节气单独做专题页。",
      },
      {
        title: "经营目的",
        body: "公众号的作用不是阅读量本身，而是让用户完成“看懂问题-愿意加顾问-愿意长期跟”的心理转变。",
      },
    ],
  },
  {
    section: "增长",
    title: "内容生产工厂",
    subtitle: "一人公司不能靠灵感写内容，必须靠模板、素材库和 AI 流程",
    cols: 2,
    cards: [
      {
        title: "内容来源",
        body: "用户提问、客服高频问题、节气节点、品类卖点、真实案例、竞品高赞内容。\n选题必须从真实需求出发。",
      },
      {
        title: "生产流程",
        body: "选题池 → Prompt 模板 → AI 初稿 → 合规过滤 → 视觉封面 → 发布 → 数据回流。\n每一步都可自动化。",
      },
      {
        title: "基础素材库",
        body: "标题模板、封面模板、成分素材、节气图、体质卡、FAQ、直播脚本、评论区回复模板。\n素材重复使用才能提效。",
      },
      {
        title: "周产能目标",
        body: "小红书 20-30 条，抖音 7-10 条，公众号 2-3 篇，社群话题 7 组。\n先追稳定产能，再追单篇爆发。",
      },
    ],
  },
  {
    section: "系统",
    title: "AI 四层架构",
    subtitle: "OPC 的本质不是人少，而是把重复性认知工作交给 AI 层",
    cols: 2,
    cards: [
      {
        title: "第一层：Agent 层",
        body: "内容生成 Agent、客服 Agent、数据分析 Agent、运营 Agent。\n7x24 自动运转，做重复性、高频、标准化任务。",
      },
      {
        title: "第二层：工具层",
        body: "评估系统、管理后台、业务流引擎、内容引擎、数据文件。\n工具层负责把抽象流程固化成操作界面和 API。",
      },
      {
        title: "第三层：合作层",
        body: "互联网医院、药房、食品工厂、物流、支付。\n所有持牌能力和重履约能力全部放在这一层。",
      },
      {
        title: "第四层：人层",
        body: "创始人只做决策、谈判、关键节点把关、投诉升级和 AI 监督。\n人不再做机械执行。",
      },
    ],
  },
  {
    section: "系统",
    title: "现有系统资产与缺口",
    subtitle: "先从现有仓库能力出发，不假装自己已经有完整平台",
    cols: 2,
    cards: [
      {
        title: "已具备",
        body: "主站与评估能力：app.py。\n管理后台：admin.py。\n模板页：评估、流程、后台界面。\n内容引擎：批量生成与追踪。",
      },
      {
        title: "已沉淀数据",
        body: "users、crm_users、leads、orders 等 JSON 数据文件。\n这意味着已具备最小 CRM 和订单资产结构。",
      },
      {
        title: "核心缺口",
        body: "互联网医院 / 药房 / 支付 API 实接。\n订阅管理中心。\n企微 SCRM 打通。\n体质辨识模块产品化。",
      },
      {
        title: "优先修补顺序",
        body: "先补支付与订单闭环。\n再补企微承接和复购提醒。\n最后补更复杂的伙伴 API 和小程序端。",
      },
    ],
  },
  {
    section: "系统",
    title: "AI 自动化清单",
    subtitle: "让系统替代部门，而不是只替代几个零散动作",
    cols: 2,
    cards: [
      {
        title: "内容 Agent",
        body: "批量生成小红书、抖音、公众号、社群文案。\n输入：选题与模板；输出：多平台内容包。",
      },
      {
        title: "客服 Agent",
        body: "处理 FAQ、意向判断、禁忌提醒、分流到人工或顾问。\n目标：把人工只留给高价值对话。",
      },
      {
        title: "运营 Agent",
        body: "发送跟进提醒、生成待办、触发续费、跟踪超时状态、推送活动。\n目标：把 Day 0-28 节奏固定住。",
      },
      {
        title: "数据 Agent",
        body: "每日汇总线索、成交、收入、复购、渠道 ROI。\n自动生成日报与预警，不靠手工导表。",
      },
    ],
  },
  {
    section: "组织",
    title: "OPC 组织模型",
    subtitle: "创始人不应亲自做每件事，只应亲自决定关键事情",
    cols: 2,
    cards: [
      {
        title: "创始人必须亲自做",
        body: "战略取舍、关键合作谈判、合规边界、核心投诉、视频出镜、融资与现金流决策。",
      },
      {
        title: "AI 默认接手",
        body: "内容初稿、客服常见问题、日报周报、素材整理、任务提醒、活动模板、数据预警。",
      },
      {
        title: "合作方接手",
        body: "问诊开方、药品履约、工厂生产、仓储物流、部分法务与会计流程。\n避免把低杠杆动作做在内部。",
      },
      {
        title: "组织原则",
        body: "凡是可 SOP 化的动作，就不靠老板记忆。\n凡是需要持牌或重履约的动作，就不自己做。\n凡是高风险动作，必须有审批链。",
      },
    ],
  },
  {
    section: "组织",
    title: "阶段人力规划",
    subtitle: "人不是越少越好，而是只在出现明确瓶颈时增加",
    cols: 2,
    cards: [
      {
        title: "阶段 1：1 人 + AI",
        body: "创始人兼产品、增长、BD。\nAI 承担内容、客服和报表。\n目标是验证模型，而不是追求完美组织。",
      },
      {
        title: "阶段 2：2-3 人",
        body: "补一个私域成交 / 运营执行位，再补一个内容/剪辑位。\n条件：月度线索量和订单量已稳定增长。",
      },
      {
        title: "阶段 3：4-5 人",
        body: "补供应链/合规协同、数据运营、内容负责人。\n条件：渠道扩张、多品类并行、合作方显著增多。",
      },
      {
        title: "招聘触发器",
        body: "当某项任务每周重复超过 8 小时且 AI/外包无法稳定完成时，才考虑内招。\n先算 ROI，再决定招人。",
      },
    ],
  },
  {
    section: "组织",
    title: "合作伙伴地图与准入标准",
    subtitle: "合作方决定平台是否能长期稳定运转，不能只看价格",
    cols: 2,
    cards: [
      {
        title: "核心伙伴类型",
        body: "互联网医院、合规药房、食品工厂、保健品企业、物流、支付、内容/KOC 机构。\n每类都要至少有备选。",
      },
      {
        title: "准入标准",
        body: "资质齐全、SLA 明确、接口或对接流程清楚、结算规则透明、愿意配合售后与数据回写。",
      },
      {
        title: "合同要点",
        body: "责任边界、时效承诺、数据处理、价格保护、退换货流程、异常赔付、终止条款。\n这些都要在开始前写清楚。",
      },
      {
        title: "管理方式",
        body: "每月一次伙伴复盘：发货时效、投诉率、缺货率、结算误差、配合度。\n不复盘，合作方会慢慢拖垮体验。",
      },
    ],
  },
  {
    section: "组织",
    title: "产品接入标准化 SOP",
    subtitle: "每增加一个 SKU，都必须走同一条准入流程",
    cols: 2,
    cards: [
      {
        title: "Step 1 合规审核",
        body: "判断是否需处方、是否需广告审查、是否涉及特殊资质。\n不合规的品类，价格再高也不上。",
      },
      {
        title: "Step 2 供应链搭建",
        body: "找供应商、打样、确认批次、签合同、定价格、测交付周期。\n同时准备备选供应方。",
      },
      {
        title: "Step 3 系统接入",
        body: "录入产品、定问卷、定规则、定物流、定售后、定活动标签。\n要让系统知道这件商品怎么卖。",
      },
      {
        title: "Step 4 内容与上线",
        body: "准备首批 50 条小红书、20 条抖音、5 篇公众号、顾问话术和 FAQ。\n先内测，再正式上线。",
      },
    ],
  },
  {
    section: "财务",
    title: "资金流与财务流程",
    subtitle: "现金流是这套模式能不能活下来的第一约束",
    cols: 2,
    cards: [
      {
        title: "收款链路",
        body: "用户付款 → 微信 / 支付宝商户号 → 订单确认 → 按合同周期与合作方结算。\n平台尽量保持预收后付。",
      },
      {
        title: "结算逻辑",
        body: "处方类按医院与药房规则分账；\n非处方类按采购与发货周期结算。\n建议保留 1-2 周安全垫。",
      },
      {
        title: "退款流程",
        body: "明确支付前、发货前、发货后、已使用不同阶段的退款规则。\n不要把退款标准交给客服临场判断。",
      },
      {
        title: "经营判断",
        body: "冷启动时最重要的不是利润率漂亮，而是现金回笼快、坏账少、应付周期稳定。\n正现金流优先于规模幻想。",
      },
    ],
  },
  {
    section: "财务",
    title: "单位经济模型",
    subtitle: "每个圈层都要清楚地知道收入、成本和复购贡献",
    cols: 3,
    cards: [
      {
        title: "处方药单",
        body: "收入：¥399 首月 / ¥599 续费。\n成本：药品 180 + 医院 40 + 物流 15 + CAC 80 + 运营 30。\n首月毛利 13.5%，续费毛利 42.4%。",
        fontSize: 12.2,
      },
      {
        title: "药食同源单",
        body: "收入：¥168 / 月。\n成本：原料 35 + 包装 10 + 物流 12 + CAC 40。\n月毛利约 42.3%，LTV 结构更健康。",
        fontSize: 12.4,
      },
      {
        title: "保健品单",
        body: "收入：¥198 / 月。\n成本：产品 45 + 物流 12 + CAC 50。\n毛利约 46%，适合做组合加购和长期维护。",
        fontSize: 12.4,
      },
    ],
  },
  {
    section: "财务",
    title: "12 个月收入预测",
    subtitle: "以下为内部测算，核心用于管理节奏，不应用来掩盖模型风险",
    cols: 3,
    cards: [
      { title: "M1", body: "100 付费用户。\n月收入约 7.65 万。\n目标是找到首条稳定链路，而不是追数字。", tag: "冷启动" },
      { title: "M3", body: "500 付费用户。\n月收入约 38.25 万。\n应开始观察哪个品类先跑出来。", tag: "验证" },
      { title: "M6", body: "2,000 付费用户。\n月收入约 153 万。\n必须形成稳定复购机制。", tag: "复制" },
      { title: "M9", body: "5,000 付费用户。\n月收入约 382.5 万。\n组织要切换为系统驱动。", tag: "放大" },
      { title: "M12", body: "10,000 付费用户。\n月收入约 765 万。\n净利率内部目标 25-30%。", tag: "规模" },
      { title: "关键假设", body: "线索持续增长、支付转化成立、30 日复购成立、供应稳定、无重大合规事件。\n任一假设失效都要重算模型。", tag: "前提" },
    ],
  },
  {
    section: "治理",
    title: "数据看板与核心指标",
    subtitle: "所有争论最后都应该回到指标，而不是回到感觉",
    cols: 2,
    cards: [
      {
        title: "每日必看 5 指标",
        body: "新增线索数、新订单数、今日收入、线索到订单转化率、MRR。\n这 5 个指标决定今天有没有跑偏。",
      },
      {
        title: "渠道指标",
        body: "CAC、LTV、ROI、留资率、评估完成率、加企微率、成交率。\n每个渠道必须独立算账。",
      },
      {
        title: "产品指标",
        body: "首单占比、复购率、加购率、退款率、投诉率、库存周转。\n不拆产品看数据，会错把渠道问题当产品问题。",
      },
      {
        title: "服务指标",
        body: "首次响应时长、发货时长、签收率、咨询满意度、复购触达率。\n运营不是只看 GMV。",
      },
    ],
  },
  {
    section: "治理",
    title: "经营节奏：日、周、月怎么开会",
    subtitle: "没有经营节奏，再好的策略也会在琐事里失真",
    cols: 2,
    cards: [
      {
        title: "每日 15 分钟",
        body: "看昨天线索、成交、发货、投诉、预警。\n只处理异常，不讨论长问题。\n输出当天 3 个优先事项。",
      },
      {
        title: "每周经营会",
        body: "复盘渠道 ROI、成交漏斗、复购、内容表现、伙伴履约、风险清单。\n同时更新这份行动方针 deck。",
      },
      {
        title: "每月财务会",
        body: "复盘现金流、预算、利润结构、SKU 表现和应收应付。\n重新排序下月投放与品类计划。",
      },
      {
        title: "每季度战略会",
        body: "决定是否扩渠道、扩品类、扩团队。\n只有在模型跑顺后，才讨论规模化加速。",
      },
    ],
  },
  {
    section: "合规",
    title: "合规框架",
    subtitle: "合规不是法务部门的任务，而是平台商业模式的一部分",
    cols: 2,
    cards: [
      {
        title: "法规底座",
        body: "互联网诊疗管理办法、药品管理法、食品安全法、广告法、个保法、反不正当竞争法。\n所有动作都要能落回法规依据。",
      },
      {
        title: "主体结构",
        body: "公司主体做健康咨询、技术服务、食品销售等。\n持牌互联网医院负责处方。\n持牌药房负责药品经营。",
      },
      {
        title: "宣传边界",
        body: "不说根治、最佳、唯一、国家级。\n不夸大、不暗示治疗结果、不伪造医患关系。\n公域只做可公开表述的内容。",
      },
      {
        title: "数据边界",
        body: "最小化采集、境内存储、分级授权、可追溯审计。\n用户数据不是拿来“多卖货”，而是拿来提高服务质量。",
      },
    ],
  },
  {
    section: "合规",
    title: "合规检查清单",
    subtitle: "任何新动作上线前，都先走这张检查表",
    cols: 2,
    cards: [
      {
        title: "公司层面",
        body: "营业执照经营范围是否覆盖。\n食品经营许可证是否齐备。\nICP/小程序/商户号是否合规配置。",
      },
      {
        title: "产品层面",
        body: "是否需要处方。\n是否需要蓝帽子或特殊资质。\n标签、批次、说明书、供应商资质是否完整。",
      },
      {
        title: "营销层面",
        body: "话术是否含禁词。\n案例是否有授权。\n是否存在效果夸大、前后对比误导、处方药公开营销。",
      },
      {
        title: "数据与售后层面",
        body: "是否有用户授权。\n是否设定退款与投诉流程。\n是否能留存沟通、支付、履约、审核记录。",
      },
    ],
  },
  {
    section: "风控",
    title: "风险矩阵",
    subtitle: "把风险分级，才能把资源花在真正会致命的地方",
    cols: 2,
    cards: [
      {
        title: "致命级",
        body: "无牌行医、假药风险、严重数据泄露。\n处理原则：宁可停业务，也不能冒险上线。\n必须由创始人直接把关。",
      },
      {
        title: "重大级",
        body: "广告违规、合作医院终止、供应中断、平台封号、集中投诉。\n处理原则：预案前置，至少保留一个备份方案。",
      },
      {
        title: "中等级",
        body: "内容表现波动、客服响应下滑、个别渠道 ROI 下滑、个别产品退款偏高。\n处理原则：通过数据与 SOP 快速修正。",
      },
      {
        title: "风险共识",
        body: "凡是可能伤害资质、现金流、口碑和核心伙伴关系的风险，都不能用短期 GMV 去换。\n这是经营底线。",
      },
    ],
  },
  {
    section: "风控",
    title: "应急手册",
    subtitle: "最怕的不是出问题，而是出了问题没有统一动作",
    cols: 2,
    cards: [
      {
        title: "平台封号 / 限流",
        body: "立即停违规内容，切流量到其他平台与私域。\n复盘违规素材和标题模板。\n保留备用账号矩阵。",
      },
      {
        title: "合作方突然中断",
        body: "启动备选互联网医院 / 供应商 / 药房。\n冻结新单，优先服务已付款用户。\n对外统一口径，避免信任塌陷。",
      },
      {
        title: "用户集中投诉",
        body: "统一接诉窗口，核查问题批次、方案、话术和履约记录。\n必要时先退费再复盘，绝不让投诉升级成舆情。",
      },
      {
        title: "数据与隐私事件",
        body: "立即止损、封禁权限、排查日志、通知相关方。\n形成书面复盘，更新权限与加密流程。\n这类问题只能零容忍。",
      },
    ],
  },
  {
    section: "执行",
    title: "30 天启动计划",
    subtitle: "第一个月不是把所有事情做完，而是把关键链路跑通",
    cols: 2,
    cards: [
      {
        title: "Week 1 产品与系统",
        body: "确认商业模型、评估流程、下单流程、后台看板。\n把当前仓库能力整理成可演示、可内测版本。",
      },
      {
        title: "Week 2 供应链与合规",
        body: "联系 2-3 家互联网医院。\n敲定药食同源和保健品供应商。\n同步推进资质与合同模板。",
      },
      {
        title: "Week 3 内容与流量",
        body: "搭小红书矩阵、抖音号、公众号与企微社群。\n准备第一批内容和转化路径。\n开始小规模测试。",
      },
      {
        title: "Week 4 内测与上线",
        body: "邀请 100 人内测。\n修问题、补 FAQ、看数据。\n在确认履约和投诉可控后，再开始正式投放。",
      },
    ],
  },
  {
    section: "执行",
    title: "未来 90 天路线与行动方针",
    subtitle: "最后一页不是总结，而是未来 3 个月的决策标准",
    cols: 2,
    cards: [
      {
        title: "D1-D30",
        body: "完成最小闭环：内容 → 留资 → 评估 → 支付 → 履约 → 随访。\n目标：证明这不是只会出内容的空系统。",
      },
      {
        title: "D31-D60",
        body: "固定主打品类与主打渠道。\n补齐企微节奏、顾问话术、自动提醒、伙伴协同。\n目标：跑出第一条可复制链路。",
      },
      {
        title: "D61-D90",
        body: "放大第二圈和第三圈，谨慎导入处方类私域服务。\n开始看 MRR、复购和组合盒表现。\n目标：形成正向经营飞轮。",
      },
      {
        title: "6 条行动方针",
        body: "合规优先于规模；\n复购优先于首单；\n现金流优先于利润幻想；\n系统优先于人肉补洞；\n数据优先于感觉；\n慢一点没关系，但边界不能错。",
      },
    ],
  },
];

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  addCoverSlide();
  slides.forEach((slide, idx) => addGridSlide(slide, idx + 2));
  await pptx.writeFile({ fileName: OUTPUT_FILE });
  console.log(`Wrote ${OUTPUT_FILE}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

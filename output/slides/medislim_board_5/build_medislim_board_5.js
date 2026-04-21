"use strict";

const path = require("path");
const fs = require("fs");
const PptxGenJS = require("pptxgenjs");
const {
  autoFontSize,
  warnIfSlideHasOverlaps,
  warnIfSlideElementsOutOfBounds,
  safeOuterShadow,
} = require("./pptxgenjs_helpers");

const OUTPUT = path.join(__dirname, "medislim-board-financing-5.pptx");

const pptx = new PptxGenJS();
pptx.layout = "LAYOUT_WIDE";
pptx.author = "OpenAI Codex";
pptx.company = "MediSlim";
pptx.subject = "MediSlim board and financing summary";
pptx.title = "MediSlim 5页董事会版 / 融资版";
pptx.lang = "zh-CN";
pptx.theme = {
  headFontFace: "Heiti SC",
  bodyFontFace: "Heiti SC",
  lang: "zh-CN",
};

const C = {
  ink: "173632",
  dark: "183A36",
  teal: "2E6C67",
  green: "4E9177",
  gold: "B78B3C",
  blue: "5B84B1",
  rust: "BC6652",
  mint: "DCEFE7",
  sand: "F3EFE6",
  cream: "FBF9F4",
  line: "DDD8CD",
  white: "FFFFFF",
  gray: "687572",
  soft: "EEF3F0",
};

function fit(slide, text, box, opts = {}) {
  const sizing = autoFontSize(text, "Heiti SC", {
    x: box.x,
    y: box.y,
    w: box.w,
    h: box.h,
    fontSize: opts.fontSize || 15,
    minFontSize: opts.minFontSize || 10.5,
    maxFontSize: opts.maxFontSize || (opts.fontSize || 15),
    mode: "shrink",
    margin: 0,
    valign: "top",
    breakLine: false,
  });
  slide.addText(text, {
    ...sizing,
    x: box.x,
    y: box.y,
    w: box.w,
    h: box.h,
    fontFace: "Heiti SC",
    color: opts.color || C.ink,
    bold: !!opts.bold,
    margin: 0,
    valign: "top",
    breakLine: false,
  });
}

function addFooter(slide, page) {
  slide.addShape(pptx.ShapeType.line, {
    x: 0.58,
    y: 7.06,
    w: 12.16,
    h: 0,
    line: { color: C.line, width: 1 },
  });
  slide.addText("MediSlim | 董事会版 / 融资版 | 预测数据均为内部经营测算，外发前需标注已验证数据", {
    x: 0.58,
    y: 7.11,
    w: 10.5,
    h: 0.16,
    fontFace: "Heiti SC",
    fontSize: 8,
    color: C.gray,
    margin: 0,
  });
  slide.addText(String(page).padStart(2, "0"), {
    x: 12.08,
    y: 7.08,
    w: 0.64,
    h: 0.18,
    align: "right",
    fontFace: "Heiti SC",
    fontSize: 9,
    bold: true,
    color: C.teal,
    margin: 0,
  });
}

function addHeader(slide, page, label, title, subtitle) {
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
    w: 8.7,
    h: 0.4,
    fontFace: "Heiti SC",
    fontSize: 24,
    bold: true,
    color: C.ink,
    margin: 0,
  });
  slide.addText(subtitle, {
    x: 0.58,
    y: 0.76,
    w: 9.8,
    h: 0.22,
    fontFace: "Heiti SC",
    fontSize: 9.5,
    color: C.gray,
    margin: 0,
  });
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 11.0,
    y: 0.28,
    w: 1.38,
    h: 0.34,
    rectRadius: 0.06,
    line: { color: C.soft, transparency: 100 },
    fill: { color: C.mint },
  });
  slide.addText(label, {
    x: 11.0,
    y: 0.32,
    w: 1.38,
    h: 0.18,
    align: "center",
    fontFace: "Heiti SC",
    fontSize: 9.5,
    bold: true,
    color: C.teal,
    margin: 0,
  });
  addFooter(slide, page);
}

function card(slide, x, y, w, h, title, body, accent, opts = {}) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x, y, w, h,
    rectRadius: 0.08,
    line: { color: C.line, width: 1 },
    fill: { color: opts.fill || C.white },
    shadow: safeOuterShadow("86918D", 0.12, 45, 1.2, 0.7),
  });
  slide.addShape(pptx.ShapeType.rect, {
    x, y, w, h: 0.11,
    line: { color: accent, transparency: 100 },
    fill: { color: accent },
  });
  slide.addText(title, {
    x: x + 0.18,
    y: y + 0.2,
    w: w - 0.36,
    h: 0.28,
    fontFace: "Heiti SC",
    fontSize: 15,
    bold: true,
    color: C.ink,
    margin: 0,
  });
  fit(slide, body, { x: x + 0.18, y: y + 0.56, w: w - 0.36, h: h - 0.72 }, {
    fontSize: opts.fontSize || 13.2,
    minFontSize: opts.minFontSize || 10.5,
    color: opts.color || C.ink,
  });
}

function coverSlide() {
  const slide = pptx.addSlide();
  slide.background = { color: C.dark };
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: 13.333, h: 0.18,
    line: { color: C.gold, transparency: 100 },
    fill: { color: C.gold },
  });

  slide.addText("MediSlim", {
    x: 0.72, y: 0.66, w: 3.8, h: 0.46,
    fontFace: "Heiti SC", fontSize: 28, bold: true, color: C.white, margin: 0,
  });
  slide.addText("5 页董事会版 / 融资版", {
    x: 0.72, y: 1.38, w: 5.8, h: 0.56,
    fontFace: "Heiti SC", fontSize: 24, bold: true, color: C.white, margin: 0,
  });
  slide.addText("中国版 Medvi 的 AI 消费医疗平台：以三圈产品、轻资产履约和 OPC 运营系统构建订阅型健康生意", {
    x: 0.72, y: 2.08, w: 6.4, h: 0.86,
    fontFace: "Heiti SC", fontSize: 15.5, color: "D9E8E4", margin: 0,
  });

  const stats = [
    ["三圈模型", "处方建立信任\n药食同源做复购\n保健品拉利润"],
    ["组织模式", "1 人 + AI 驱动\n持牌与履约外包\n系统替代部门"],
    ["财务假设", "M12 目标 1 万付费用户\n月收入 765 万\n净利率目标 25-30%"],
  ];
  stats.forEach((s, i) => {
    const x = 0.72 + i * 2.18;
    slide.addShape(pptx.ShapeType.roundRect, {
      x, y: 4.35, w: 1.95, h: 1.26,
      rectRadius: 0.08,
      line: { color: [C.teal, C.green, C.gold][i], transparency: 100 },
      fill: { color: [C.teal, C.green, C.gold][i] },
    });
    slide.addText(s[0], {
      x: x + 0.1, y: 4.5, w: 1.75, h: 0.18,
      fontFace: "Heiti SC", fontSize: 11, bold: true, color: C.white, align: "center", margin: 0,
    });
    fit(slide, s[1], { x: x + 0.1, y: 4.78, w: 1.75, h: 0.58 }, {
      fontSize: 10.2, minFontSize: 8.8, color: C.white,
    });
  });

  slide.addShape(pptx.ShapeType.roundRect, {
    x: 8.45, y: 1.0, w: 4.18, h: 5.0,
    rectRadius: 0.12,
    line: { color: "3C5A56", width: 1 },
    fill: { color: "254C47" },
  });
  slide.addText("投资摘要", {
    x: 8.8, y: 1.44, w: 1.9, h: 0.24,
    fontFace: "Heiti SC", fontSize: 16, bold: true, color: C.white, margin: 0,
  });
  fit(slide, [
    "1. 需求侧：减重、亚健康、女性调养、睡眠与肠胃都在持续消费化。",
    "2. 模型侧：中国可以用药食同源和体质辨识完成 Medvi 在美国做不到的复购设计。",
    "3. 合规侧：我们不做医疗主体，只做流量、评估、CRM 和复购管理。",
    "4. 经营侧：先打爆第二圈，再导向第三圈和第一圈，降低冷启动难度。",
    "5. 本版用途：用于董事会判断 90 天计划、融资准备与关键合作优先级。"
  ].join("\n"), { x: 8.8, y: 1.92, w: 3.38, h: 3.8 }, {
    fontSize: 13.8, minFontSize: 11, color: "E6F0ED",
  });

  slide.addText("注：本 deck 中财务与增长数字均基于现有商业方案和仓库文档的内部经营测算。", {
    x: 0.72, y: 6.86, w: 7.8, h: 0.18,
    fontFace: "Heiti SC", fontSize: 8.6, color: "C8D7D3", margin: 0,
  });
  slide.addText("01", {
    x: 12.08, y: 7.06, w: 0.64, h: 0.18,
    fontFace: "Heiti SC", fontSize: 9.5, color: C.white, bold: true, align: "right", margin: 0,
  });
}

function slide2() {
  const slide = pptx.addSlide();
  addHeader(slide, 2, "机会", "为什么现在值得投 / 值得做", "董事会真正要判断的不是“能不能做”，而是“这是不是一个能成立的中国化模型”");

  card(slide, 0.58, 1.28, 3.0, 2.38, "赛道变化", "医疗消费化已经从单次看病转向长期管理。减重、亚健康、睡眠、女性调养与轻营养都在从“治疗需求”变成“持续付费需求”。", C.teal);
  card(slide, 3.76, 1.28, 3.0, 2.38, "中国化机会", "美国 Medvi 主要靠 GLP-1 和远程处方。中国如果只复制处方路径，会受平台与合规约束；加入药食同源和体质辨识后，冷启动效率更高。", C.green);
  card(slide, 6.94, 1.28, 3.0, 2.38, "差异化护城河", "真正的壁垒不是某个单品，而是：体质辨识、订阅盒、企微陪伴、状态机运营、用户健康数据和低成本 AI 自动化。", C.gold);
  card(slide, 10.12, 1.28, 2.61, 2.38, "边界清晰", "我们不是医疗主体。处方、问诊、药品经营全部归合作方；我们只做品牌、流量、评估、CRM、复购。", C.blue, { fontSize: 12.8 });

  card(slide, 0.58, 3.94, 6.08, 2.64, "商业模式判断", "如果先打处方类，会面临高 CAC、高合规压力和高解释成本；如果先打第二圈与第三圈，就能用更低门槛的内容获取用户，再把高意愿人群导入处方私域。这是整套模型能跑起来的关键顺序。", C.rust, { fontSize: 13.4 });
  card(slide, 6.9, 3.94, 5.83, 2.64, "董事会当前应关心的 3 个问题", "1. 我们是否同意“第二圈优先”的冷启动顺序。\n2. 我们是否接受“流量+技术服务公司”的主体边界。\n3. 我们是否愿意先用 90 天验证模型，再决定规模化投入。", C.teal, { fontSize: 14 });

  warnIfSlideHasOverlaps(slide, pptx);
  warnIfSlideElementsOutOfBounds(slide, pptx);
}

function slide3() {
  const slide = pptx.addSlide();
  addHeader(slide, 3, "模型", "我们怎么赚钱，以及为什么这个模型有机会成立", "把业务拆成收入引擎、单位经济和 12 个月经营节奏");

  card(slide, 0.58, 1.28, 4.05, 2.1, "三圈收入引擎", "第一圈：处方医疗，建立专业信任。\n第二圈：药食同源，高频复购，冷启动现金流核心。\n第三圈：保健品，提高客单价和毛利率。", C.teal, { fontSize: 14 });
  card(slide, 0.58, 3.62, 4.05, 2.82, "单位经济摘要", "处方药单：首月 ¥399 / 续费 ¥599，续费毛利约 42.4%。\n药食同源单：¥168 / 月，月毛利约 42.3%。\n保健品单：¥198 / 月，月毛利约 46%。\n结论：真正决定模型成立的不是首单毛利，而是 30 日复购和组合加购。", C.green, { fontSize: 13 });

  card(slide, 4.9, 1.28, 4.0, 5.16, "12 个月经营测算", "M1：100 付费用户，月收入约 7.65 万。\nM3：500 用户，月收入约 38.25 万。\nM6：2,000 用户，月收入约 153 万。\nM9：5,000 用户，月收入约 382.5 万。\nM12：10,000 用户，月收入约 765 万，净利率目标 25-30%。\n\n这些数字当前属于经营目标，不是已验证业绩。", C.gold, { fontSize: 13.2 });

  card(slide, 9.17, 1.28, 3.56, 2.48, "成本结构", "产品成本约 25%，流量获客约 20%，合作方分成约 8%，物流约 5%，AI 系统约 2%，人力约 5%。\n轻资产结构是利润空间的前提。", C.blue, { fontSize: 12.8 });
  card(slide, 9.17, 4.02, 3.56, 2.42, "融资视角", "投资逻辑不是“卖货 GMV”，而是“可持续 MRR 生意”。\n只要 CAC 可控、复购成立、伙伴稳定，这就是一个能滚起来的订阅型平台。", C.rust, { fontSize: 13 });

  warnIfSlideHasOverlaps(slide, pptx);
  warnIfSlideElementsOutOfBounds(slide, pptx);
}

function slide4() {
  const slide = pptx.addSlide();
  addHeader(slide, 4, "执行", "增长与运营系统：为什么一人公司仍能推进这件事", "关键不在于人少，而在于把重复性工作交给系统和合作网络");

  card(slide, 0.58, 1.28, 4.15, 2.35, "增长漏斗", "公域内容（小红书 / 抖音 / 微信）→ H5 留资 → AI 评估 → 企微顾问 → 支付成交 → 随访复购 → 裂变。\n公域做兴趣，私域做成交，社群做留存。", C.teal, { fontSize: 13.6 });
  card(slide, 0.58, 3.9, 4.15, 2.54, "AI 四层架构", "Agent 层：内容、客服、运营、数据。\n工具层：评估系统、业务流、后台、内容引擎。\n合作层：医院、药房、工厂、物流、支付。\n人层：创始人只做决策、谈判、合规与关键升级。", C.green, { fontSize: 13 });

  card(slide, 5.0, 1.28, 3.78, 2.35, "90 天重点里程碑", "D1-D30：跑通最小闭环。\nD31-D60：固定主打品类和主打渠道。\nD61-D90：放大第二圈和第三圈，谨慎引入处方私域服务。", C.gold, { fontSize: 13.6 });
  card(slide, 5.0, 3.9, 3.78, 2.54, "当前系统基础", "已具备：主站、评估、后台、订单与线索数据结构、内容引擎。\n待补齐：支付闭环、企微承接、订阅管理、伙伴 API 实接。", C.blue, { fontSize: 13.1 });

  card(slide, 9.05, 1.28, 3.68, 5.16, "为什么现在适合推进", "1. 现有文档和仓库已具备最小经营骨架。\n2. 冷启动可以先依赖第二圈与第三圈，不必直接重投处方链路。\n3. 一旦伙伴网络敲定，平台可在较轻的人力结构下扩大。\n4. 风险并不小，但已经足够清楚，可以被前置管理。", C.rust, { fontSize: 13.2 });

  warnIfSlideHasOverlaps(slide, pptx);
  warnIfSlideElementsOutOfBounds(slide, pptx);
}

function slide5() {
  const slide = pptx.addSlide();
  addHeader(slide, 5, "决策", "董事会版结论：现在需要拍板什么，融资版需要补什么", "最后一页只回答“下一步怎么推进”");

  card(slide, 0.58, 1.28, 4.03, 2.32, "董事会需确认的 4 件事", "1. 是否批准以第二圈为先的冷启动顺序。\n2. 是否批准 90 天验证期及对应预算。\n3. 是否批准优先敲定互联网医院 / 药房 / 供应商三类关键合作。\n4. 是否同意启动融资资料准备。", C.teal, { fontSize: 13.2 });
  card(slide, 0.58, 3.86, 4.03, 2.6, "本轮资金若启动，建议用途结构", "35% 用于增长验证与内容投放。\n25% 用于系统补齐：支付、企微、订阅、数据看板。\n20% 用于伙伴接入、合规和打样。\n20% 作为营运与安全垫。\n\n金额由董事会按 12-18 个月 runway 反推。", C.green, { fontSize: 12.8 });

  card(slide, 4.9, 1.28, 3.94, 2.32, "外发融资版还需补齐的 4 个字段", "1. 已验证数据：真实线索、内测用户、成交、复购。\n2. 合作进展：医院、药房、供应商的真实签约状态。\n3. 融资要素：本轮金额、估值区间、资金期限。\n4. 团队亮点：创始人背景、技术与 BD 执行记录。", C.gold, { fontSize: 12.9 });
  card(slide, 4.9, 3.86, 3.94, 2.6, "核心风险与应对", "风险：合规踩线、伙伴失效、供应不稳、平台限流、复购不成立。\n应对：边界清晰、备选伙伴、状态机管理、跨平台布局、把复购当北极星。", C.blue, { fontSize: 13 });

  card(slide, 9.13, 1.28, 3.6, 5.18, "一句话结论", "MediSlim 值得推进的原因，不是它看起来像一个好卖货项目，而是它有机会成为一个中国化的、订阅型的、轻资产的健康管理平台。\n\n董事会如果认可这套顺序：先第二圈、再第三圈、后第一圈；先验证、后放大；先边界、后增长，那么这件事就应该进入下一阶段。\n\n反之，如果想一开始就做重处方、高投放、高复杂度路径，模型会明显变重。", C.rust, { fontSize: 13.5 });

  warnIfSlideHasOverlaps(slide, pptx);
  warnIfSlideElementsOutOfBounds(slide, pptx);
}

async function main() {
  fs.mkdirSync(__dirname, { recursive: true });
  coverSlide();
  slide2();
  slide3();
  slide4();
  slide5();
  await pptx.writeFile({ fileName: OUTPUT });
  console.log(`Wrote ${OUTPUT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

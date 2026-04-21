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

const OUTPUT = path.join(__dirname, "medislim-tech-capability-moat-10.pptx");

const pptx = new PptxGenJS();
pptx.layout = "LAYOUT_WIDE";
pptx.author = "OpenAI Codex";
pptx.company = "MediSlim";
pptx.subject = "MediSlim technical capability and moat";
pptx.title = "MediSlim 技术能力与技术壁垒";
pptx.lang = "zh-CN";
pptx.theme = {
  headFontFace: "Heiti SC",
  bodyFontFace: "Heiti SC",
  lang: "zh-CN",
};

const C = {
  dark: "153633",
  ink: "183934",
  teal: "2D6D67",
  green: "4D9077",
  gold: "B98A3C",
  blue: "5B82AE",
  rust: "BE6855",
  mint: "DCEFE8",
  cream: "FBF9F4",
  sand: "F3EFE6",
  line: "DDD8CE",
  white: "FFFFFF",
  gray: "687572",
  soft: "EEF4F1",
};

const FOOT = "MediSlim 技术能力与技术壁垒 | 基于当前仓库代码、服务接口与内容引擎整理";

function fit(slide, text, box, opts = {}) {
  const sizing = autoFontSize(text, "Heiti SC", {
    x: box.x,
    y: box.y,
    w: box.w,
    h: box.h,
    fontSize: opts.fontSize || 14,
    minFontSize: opts.minFontSize || 10.6,
    maxFontSize: opts.maxFontSize || (opts.fontSize || 14),
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
    italic: !!opts.italic,
    margin: 0,
    valign: "top",
    breakLine: false,
  });
}

function chrome(slide, page, section, title, subtitle) {
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
    w: 9.3,
    h: 0.42,
    fontFace: "Heiti SC",
    fontSize: 24,
    bold: true,
    color: C.ink,
    margin: 0,
  });
  slide.addText(subtitle, {
    x: 0.58,
    y: 0.76,
    w: 10.2,
    h: 0.2,
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
  slide.addText(section, {
    x: 11.0,
    y: 0.32,
    w: 1.38,
    h: 0.16,
    align: "center",
    fontFace: "Heiti SC",
    fontSize: 9.5,
    bold: true,
    color: C.teal,
    margin: 0,
  });
  slide.addShape(pptx.ShapeType.line, {
    x: 0.58,
    y: 7.06,
    w: 12.15,
    h: 0,
    line: { color: C.line, width: 1 },
  });
  slide.addText(FOOT, {
    x: 0.58,
    y: 7.11,
    w: 10.1,
    h: 0.16,
    fontFace: "Heiti SC",
    fontSize: 8,
    color: C.gray,
    margin: 0,
  });
  slide.addText(String(page).padStart(2, "0"), {
    x: 12.1,
    y: 7.08,
    w: 0.62,
    h: 0.18,
    align: "right",
    fontFace: "Heiti SC",
    fontSize: 9,
    bold: true,
    color: C.teal,
    margin: 0,
  });
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
    minFontSize: opts.minFontSize || 10.6,
    color: opts.color || C.ink,
  });
}

function cover() {
  const slide = pptx.addSlide();
  slide.background = { color: C.dark };
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: 13.333, h: 0.18,
    line: { color: C.gold, transparency: 100 },
    fill: { color: C.gold },
  });
  slide.addText("MediSlim", {
    x: 0.72, y: 0.66, w: 3.8, h: 0.44,
    fontFace: "Heiti SC", fontSize: 28, bold: true, color: C.white, margin: 0,
  });
  slide.addText("技术能力与技术壁垒", {
    x: 0.72, y: 1.36, w: 5.8, h: 0.54,
    fontFace: "Heiti SC", fontSize: 24, bold: true, color: C.white, margin: 0,
  });
  slide.addText("10 页版本：说明我们今天已经做成了什么系统，以及这些系统为什么有机会积累成真正的壁垒", {
    x: 0.72, y: 2.04, w: 6.6, h: 0.82,
    fontFace: "Heiti SC", fontSize: 15.5, color: "D8E8E4", margin: 0,
  });

  const stats = [
    ["交易引擎", "评估 → 订单 → 状态机 → 履约\n不是单页面 Demo，而是流程系统"],
    ["增长引擎", "内容生成 → 追踪 → 漏斗 → 排期 → A/B\n从素材到转化形成闭环"],
    ["壁垒方向", "结构化健康数据\n运营自动化\n伙伴抽象层\n内容-成交飞轮"],
  ];
  stats.forEach((s, i) => {
    const accent = [C.teal, C.green, C.gold][i];
    const x = 0.72 + i * 2.18;
    slide.addShape(pptx.ShapeType.roundRect, {
      x, y: 4.38, w: 1.95, h: 1.22,
      rectRadius: 0.08,
      line: { color: accent, transparency: 100 },
      fill: { color: accent },
    });
    slide.addText(s[0], {
      x: x + 0.12, y: 4.52, w: 1.71, h: 0.18,
      fontFace: "Heiti SC", fontSize: 11, bold: true, color: C.white, align: "center", margin: 0,
    });
    fit(slide, s[1], { x: x + 0.1, y: 4.8, w: 1.75, h: 0.54 }, {
      fontSize: 10, minFontSize: 8.6, color: C.white,
    });
  });

  slide.addShape(pptx.ShapeType.roundRect, {
    x: 8.45, y: 1.0, w: 4.16, h: 5.0,
    rectRadius: 0.12,
    line: { color: "3C5A56", width: 1 },
    fill: { color: "244B46" },
  });
  slide.addText("一句话技术 thesis", {
    x: 8.8, y: 1.44, w: 2.2, h: 0.24,
    fontFace: "Heiti SC", fontSize: 16, bold: true, color: C.white, margin: 0,
  });
  fit(slide,
    "MediSlim 的技术并不是一个孤立 AI 聊天工具，而是一套围绕“获客、评估、成交、履约、复购、再获客”建立的运营系统。真正的壁垒不是大模型本身，而是这套系统持续沉淀出来的用户画像、流程数据、转化经验和伙伴协同能力。",
    { x: 8.8, y: 1.94, w: 3.38, h: 3.72 },
    { fontSize: 15, minFontSize: 11.2, color: "E6F0ED" }
  );
  slide.addText("证据来源：当前仓库中的 app.py / admin.py / order_flow.py / content_engine/* / data/*", {
    x: 0.72, y: 6.86, w: 8.2, h: 0.18,
    fontFace: "Heiti SC", fontSize: 8.6, color: "C8D7D3", margin: 0,
  });
  slide.addText("01", {
    x: 12.08, y: 7.06, w: 0.64, h: 0.18,
    fontFace: "Heiti SC", fontSize: 9.5, color: C.white, bold: true, align: "right", margin: 0,
  });
}

const slides = [
  {
    section: "架构",
    title: "当前技术架构总览",
    subtitle: "从代码看，MediSlim 已经具备“前台交易 + 后台运营 + 内容增长 + 数据存储”的四层骨架",
    cards: [
      ["前台交易层", "app.py 提供产品展示、评估问卷、下单、订单状态、合作医院/药房信息等接口。它是用户侧主入口。"],
      ["后台控制层", "admin.py 负责 CRM、订单总览、内容管理、平台配置、系统健康检查，是运营控制平面。"],
      ["增长引擎层", "content_engine 下有 copywriter、batch_generator、tracking、scheduler、ab_testing、preview_server、card_renderer，说明增长系统是独立模块。"],
      ["数据与流程层", "storage.py、order_flow.py、data/users.json、crm_users.json、leads.json、orders.json 组成了最小但完整的交易与画像数据底座。"]],
    colors: [C.teal, C.green, C.gold, C.rust],
    layout: "2x2",
  },
  {
    section: "交易",
    title: "交易系统能力：从评估到订单履约",
    subtitle: "这部分是最接近收入的核心技术能力，也是未来平台 API 化的基础",
    cards: [
      ["多品类评估引擎", "app.py 中已为 glp1、hair、skin、mens、sleep 配置不同评估题组。说明系统已经具备多业务线的规则化评估能力。"],
      ["订单生命周期引擎", "order_flow.py 将订单拆成 pending_payment、paid、doctor_review、approved、pharmacy_processing、shipped、delivered、completed 等状态，并支持合法动作推进。"],
      ["时间线与可追溯", "每个订单记录 timeline、payment、doctor_review、fulfillment、attribution。也就是说，平台已经把“发生过什么”做成了结构化事件。"],
      ["伙伴抽象层", "医院、药房、物流等都被表达成合作节点，而不是写死在页面里。这是未来对接真实互联网医院/药房 API 的基础。"]],
    colors: [C.teal, C.green, C.gold, C.blue],
    layout: "2x2",
  },
  {
    section: "控制",
    title: "控制平面能力：运营后台不是看板，而是调度台",
    subtitle: "真正能支撑一人公司运转的，不是页面数量，而是后台能否成为控制中心",
    cards: [
      ["统一视图", "admin.py 会合并 users 与 crm_users，按手机号/用户 ID 统一用户视图。这意味着系统已经开始形成“一个人、一份全量视图”的基础。"],
      ["系统健康检查", "后台内置对主站、后台、内容工厂、转化追踪服务的健康检查。技术上已经在往“服务化运维”靠近。"],
      ["订单运营接口", "后台不仅能看订单，还能通过 /api/admin/orders/action 去推动状态变化，说明运营动作被设计成可调用接口。"],
      ["平台接入配置", "微信公众号、小程序、企业微信、小红书、抖音、支付宝、微信支付、顺丰等都被做成平台配置对象。这是标准化接入层的雏形。"]],
    colors: [C.teal, C.green, C.gold, C.rust],
    layout: "2x2",
  },
  {
    section: "增长",
    title: "内容工厂能力：不是发内容，而是工业化生成与分发",
    subtitle: "这一层是 MediSlim 最明显区别于普通电商站点的能力",
    cards: [
      ["文案引擎", "copywriter.py 把产品、痛点、收益、场景、钩子公式、风格模板组合起来，可自动生成大量变体。它不是单条文案写作，而是参数化文案生产。"],
      ["批量生成器", "batch_generator.py 把文案、配色、卡片渲染、追踪链接整合起来，能一次生成数百到上千套内容资产。"],
      ["视觉渲染引擎", "card_renderer.py 用 HTML 模板 + Playwright 截图生成小红书标准尺寸 PNG。说明视觉内容也被纳入自动化链路，而不是靠手工设计。"],
      ["预览与筛选", "preview_server.py 可浏览、筛选、预览已生成内容，说明内容库已经具备运营层面的可消费性，而不是只停留在脚本产物。"]],
    colors: [C.teal, C.green, C.gold, C.blue],
    layout: "2x2",
  },
  {
    section: "增长",
    title: "转化追踪与 A/B 优化：增长系统的真正价值在闭环",
    subtitle: "如果没有这一层，内容工厂只是降本工具；有了这一层，它才开始变成壁垒",
    cards: [
      ["UTM 与追踪码", "tracking.py 为每条内容生成 track_code、landing_url、CTA comments，并把平台、品类、内容 ID 编码进来源链路。"],
      ["事件模型", "系统已定义 impression、click、comment、landing、assess_start、assess_done、order_create、order_pay、reorder 等事件。这个模型直接覆盖从曝光到复购的漏斗。"],
      ["漏斗与排名", "tracking.py 和 ab_testing.py 可以按 track_code 和 product 统计漏斗、算权重得分、输出 top 内容与洞察。增长已经进入可量化优化阶段。"],
      ["智能排期", "scheduler.py 会结合内容得分、发布时间、历史表现自动生成每日发布计划。这表示平台开始从“内容生产”走向“内容调度”。"]],
    colors: [C.teal, C.green, C.gold, C.rust],
    layout: "2x2",
  },
  {
    section: "数据",
    title: "数据飞轮：什么数据正在沉淀，为什么它会变成资产",
    subtitle: "壁垒来自结构化数据的持续积累，而不是模型调用次数",
    cards: [
      ["健康与需求数据", "评估问卷沉淀的是用户诉求、症状、风险和偏好。随着样本增加，推荐规则会越来越贴近真实成交逻辑。"],
      ["交易与履约数据", "订单状态、支付、审核、物流、完成与取消理由，会沉淀出一套真实的服务质量与转化数据集。"],
      ["营销与内容数据", "每条内容的追踪码、事件序列、转化得分，会让系统知道“什么内容吸引什么用户、最后带来什么订单”。"],
      ["用户生命周期数据", "CRM 用户池、lifecycle、orders、value_score 等字段说明平台正在形成“从线索到 VIP”的用户经营画像。这是长期护城河。"]],
    colors: [C.teal, C.green, C.gold, C.blue],
    layout: "2x2",
  },
  {
    section: "壁垒",
    title: "技术壁垒 1：流程系统化，而不是功能堆叠",
    subtitle: "很多团队能做页面，但做不出可运营的系统；很多团队能接模型，但做不出可追踪的经营骨架",
    cards: [
      ["壁垒 A：流程抽象能力", "评估题组、订单状态机、顾问动作、平台配置、内容模板、追踪事件都被写成了可复用结构，而不是零散页面逻辑。"],
      ["壁垒 B：运营 API 化", "订单动作、后台总览、内容调度、追踪看板都在向 API 化靠近。这意味着未来无论换前端、加 Agent、接伙伴，都不会推倒重来。"],
      ["壁垒 C：低成本可维护", "当前大量使用原生 Python 与轻量 HTTP 服务，虽然不是重型企业架构，但对 OPC 来说极具效率优势。低复杂度本身就是壁垒。"],
      ["壁垒 D：内容到成交同源", "内容引擎和交易引擎在同一仓库内演化，这使增长与成交天然共享语义、数据和规则，不容易被割裂。"]],
    colors: [C.teal, C.green, C.gold, C.rust],
    layout: "2x2",
  },
  {
    section: "壁垒",
    title: "技术壁垒 2：数据、合规边界与伙伴抽象会越跑越厚",
    subtitle: "真正难复制的不是某一段代码，而是代码与业务边界共同沉淀出来的知识体系",
    cards: [
      ["数据壁垒", "当评估、转化、复购、投诉、内容表现积累到足够样本，MediSlim 会得到一套跨健康需求、跨渠道、跨流程的经营知识图谱。"],
      ["合规壁垒", "我们不是把医疗直接写进系统，而是把“该交给谁做”写进系统。边界越清晰，越能稳定扩品类与扩伙伴。"],
      ["伙伴壁垒", "一旦互联网医院、药房、物流、支付都被标准化接入，后续新增品类的成本会下降。这是平台化而非项目化的关键。"],
      ["运营认知壁垒", "系统不仅记住用户，也记住什么内容、什么动作、什么时机会成交。这个“经营操作系统”比单纯 AI 推荐更难复制。"]],
    colors: [C.teal, C.green, C.gold, C.blue],
    layout: "2x2",
  },
  {
    section: "路线",
    title: "未来 12 个月技术路线：把骨架做成真正的平台",
    subtitle: "最后一页回答两件事：我们下一步补什么，以及壁垒会怎么继续长厚",
    cards: [
      ["0-3 个月", "补齐支付闭环、企微承接、订阅管理、伙伴 API 接口、体质辨识模块，把已有骨架做成真实可跑的交易系统。"],
      ["3-6 个月", "把数据看板从单点统计升级成统一经营中心，打通线索、订单、内容、客服、复购，形成日/周/月经营自动报告。"],
      ["6-12 个月", "沉淀画像与推荐规则，形成“人群 x 内容 x 产品 x 时机”的决策引擎；同时将伙伴接入与新 SKU 接入彻底标准化。"],
      ["一句话结论", "MediSlim 当前最有价值的技术，不是某个模型调用，而是已经在代码层形成了一个围绕健康消费生意运转的最小操作系统。只要继续让数据和流程在这套系统里累积，技术壁垒会比页面和内容更快变厚。"]],
    colors: [C.teal, C.green, C.gold, C.rust],
    layout: "2x2",
  },
];

function buildSlide(spec, index) {
  const slide = pptx.addSlide();
  chrome(slide, index + 2, spec.section, spec.title, spec.subtitle);
  const cards = spec.cards;
  const colors = spec.colors;

  if (spec.layout === "2x2") {
    const positions = [
      [0.58, 1.28, 6.0, 2.42],
      [6.75, 1.28, 5.98, 2.42],
      [0.58, 3.98, 6.0, 2.42],
      [6.75, 3.98, 5.98, 2.42],
    ];
    cards.forEach((c, i) => {
      const [x, y, w, h] = positions[i];
      card(slide, x, y, w, h, c[0], c[1], colors[i]);
    });
  }

  warnIfSlideHasOverlaps(slide, pptx);
  warnIfSlideElementsOutOfBounds(slide, pptx);
}

async function main() {
  fs.mkdirSync(__dirname, { recursive: true });
  cover();
  slides.forEach((spec, i) => buildSlide(spec, i));
  await pptx.writeFile({ fileName: OUTPUT });
  console.log(`Wrote ${OUTPUT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

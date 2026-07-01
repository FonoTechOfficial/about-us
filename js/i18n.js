// i18n.js — internationalization DATA: the bilingual (zh / en) string catalog.
//
// Scope of this file
// ------------------
// This module owns DATA ONLY: the translation dictionary and the conventions that
// describe how HTML nodes reference it. It performs no DOM work. Reading the
// attributes below, swapping text on language change, and persisting the chosen
// locale all live in main.js (which runs after this file — see index.html).
//
// HTML data convention
// --------------------
// Every translatable element in index.html is tagged with a data attribute whose
// value is a KEY into the dictionary. Keys are flat, dot-namespaced strings
// (e.g. "nav.about", "services.web.title"); the dots are purely organizational —
// lookup is a single flat object access, dict[locale][key].
//
//   1. Text content
//        <h2 data-i18n="about.title"></h2>
//      main.js sets el.textContent = dict[locale]["about.title"].
//
//   2. Attribute values (aria-label, placeholder, title, …)
//        <nav data-i18n-attr="aria-label:nav.aria">
//        <input data-i18n-attr="placeholder:contact.form.namePlaceholder">
//      Format is "attribute:key". Multiple pairs are separated by ";":
//        data-i18n-attr="aria-label:nav.aria;title:nav.brand"
//
//   3. Document-level strings (no element binding) — meta.* keys are applied by
//      main.js to <title>, <meta name="description">, and <html lang>.
//
// Contract
// --------
// - `zh` and `en` MUST expose the exact same set of keys (full parity). A missing
//   key in the active locale should fall back to `fallbackLocale`.
// - Values are plain text. Do NOT put markup in values; compose structure in HTML.
// - Brand name, email, and placeholder example addresses are intentionally identical
//   across locales.

'use strict';

/** Supported locale codes, in display/cycle order. */
const LOCALES = ['en', 'zh'];

/** Locale used on first load and as the fallback for any missing key. */
const DEFAULT_LOCALE = 'en';

/** Human-readable label for each locale (used by the language toggle UI). */
const LOCALE_LABELS = {
  en: 'EN',
  zh: '中文',
};

/**
 * The bilingual string catalog: { zh: {...}, en: {...} }.
 * Keys are flat and dot-namespaced; both locales carry identical key sets.
 */
const TRANSLATIONS = {
  en: {
    // ---- Document meta ------------------------------------------------------
    'meta.title': 'fono.tech.llc — Software design & engineering',
    'meta.description':
      'fono.tech.llc — a senior software studio designing and building web, mobile, and cloud products.',

    // ---- Navigation ---------------------------------------------------------
    'nav.brand': 'fono.tech.llc',
    'nav.aria': 'Main navigation',
    'nav.about': 'About',
    'nav.services': 'Services',
    'nav.approach': 'Approach',
    'nav.contact': 'Contact',
    'nav.langToggle': 'Switch language',

    // ---- Hero ---------------------------------------------------------------
    'hero.eyebrow': 'Software studio',
    'hero.title': 'Software that moves your business forward.',
    'hero.subtitle':
      'fono.tech.llc designs and builds web, mobile, and cloud products for teams that want a partner, not just a vendor.',
    'hero.ctaPrimary': 'Start a project',
    'hero.ctaSecondary': 'See our services',

    // ---- About --------------------------------------------------------------
    'about.title': 'About',
    'about.lead':
      'fono.tech.llc is a technology consulting firm, registered in Washington State, USA — connecting technology and products between China and the United States.',
    'about.body':
      'We work across both markets so engineering, products, and partnerships can cross the bridge with less friction.',

    // ---- Services (7) -------------------------------------------------------
    'services.title': 'Services',
    'services.intro':
      'Seven focused ways we help teams design, build, scale, and ship better software.',

    'services.aiConsulting.title': 'AI Implementation Consulting',
    'services.aiConsulting.desc':
      'From use-case selection to production rollout — putting LLMs, RAG, and agents to work where they actually move the needle.',

    'services.cloudMigration.title': 'Cloud Architecture & Migration',
    'services.cloudMigration.desc':
      'Resilient cloud architecture and zero-downtime migrations to AWS, GCP, or Azure, with cost and reliability built in.',

    'services.distributed.title': 'High-Concurrency & Distributed Systems',
    'services.distributed.desc':
      'Architecture reviews and hands-on tuning for systems that must stay fast and correct under heavy, spiky load.',

    'services.fractionalCto.title': 'MVP & Fractional CTO',
    'services.fractionalCto.desc':
      'Part-time technical leadership for founders: shape the roadmap, build the MVP, and grow the first engineering team.',

    'services.dataPlatform.title': 'Data Engineering & Analytics',
    'services.dataPlatform.desc':
      'Reliable pipelines, warehouses, and decision-ready dashboards that turn raw events into metrics you can trust.',

    'services.crossBorder.title': 'Cross-border Tech Liaison',
    'services.crossBorder.desc':
      'A bilingual technical bridge between China and overseas teams — vendor vetting, communication, and delivery without the friction.',

    'services.customDev.title': 'Web, Mini-program & App Development',
    'services.customDev.desc':
      'Custom web apps, WeChat mini-programs, and mobile apps — designed and built end to end by one accountable team.',

    // ---- Approach -----------------------------------------------------------
    'approach.title': 'Approach',
    'approach.intro':
      'A simple, disciplined process that keeps work focused and risk low.',

    'approach.discover.title': 'Discover',
    'approach.discover.desc':
      'We map goals, users, and constraints before writing a line of code.',

    'approach.design.title': 'Design',
    'approach.design.desc':
      'We prototype and pressure-test the experience so the right thing gets built.',

    'approach.build.title': 'Build',
    'approach.build.desc':
      'We ship in small, tested increments with quality and security baked in.',

    'approach.iterate.title': 'Iterate',
    'approach.iterate.desc':
      'We measure, learn, and refine — improvement never stops at launch.',

    // ---- Contact ------------------------------------------------------------
    'contact.title': 'Contact',
    'contact.eyebrow': 'Get in touch',
    'contact.intro':
      'Have a project in mind? Tell us what you’re building and we’ll get back to you.',
    'contact.cta': 'Let’s build something great',
    'contact.emailLabel': 'Email',
    'contact.email': 'fono.tech.llc@gmail.com',
    'contact.form.name': 'Name',
    'contact.form.namePlaceholder': 'Your name',
    'contact.form.email': 'Email',
    'contact.form.emailPlaceholder': 'you@example.com',
    'contact.form.message': 'Message',
    'contact.form.messagePlaceholder': 'Tell us about your project…',
    'contact.form.submit': 'Send',
    'contact.response': 'We usually reply within one business day.',

    // ---- Footer -------------------------------------------------------------
    'footer.brand': 'fono.tech.llc',
    'footer.location': 'Washington, USA',
    'footer.tagline': 'Software design and engineering.',
    'footer.rights': 'All rights reserved.',
    'footer.copyright': '© fono.tech.llc. All rights reserved.',
  },

  zh: {
    // ---- 文档元信息 ---------------------------------------------------------
    'meta.title': 'fono.tech.llc — 软件设计与工程',
    'meta.description':
      'fono.tech.llc — 资深软件工作室，专注 Web、移动与云产品的设计与开发。',

    // ---- 导航 ---------------------------------------------------------------
    'nav.brand': 'fono.tech.llc',
    'nav.aria': '主导航',
    'nav.about': '关于',
    'nav.services': '服务',
    'nav.approach': '方法',
    'nav.contact': '联系',
    'nav.langToggle': '切换语言',

    // ---- 首屏 Hero ----------------------------------------------------------
    'hero.eyebrow': '软件工作室',
    'hero.title': '用软件推动你的业务向前。',
    'hero.subtitle':
      'fono.tech.llc 为追求长期伙伴、而非一次性供应商的团队，设计并开发 Web、移动与云端产品。',
    'hero.ctaPrimary': '启动项目',
    'hero.ctaSecondary': '查看服务',

    // ---- 关于 ---------------------------------------------------------------
    'about.title': '关于我们',
    'about.lead':
      'fono.tech.llc 是一家在美国华盛顿州注册的科技咨询公司，连接中国与美国两地的技术与产品。',
    'about.body':
      '我们扎根中美两大市场，让工程、产品与合作更顺畅地跨越这道桥梁。',

    // ---- 服务（7 项）-------------------------------------------------------
    'services.title': '服务',
    'services.intro': '我们从七个方面，帮助团队更好地设计、构建、扩展并交付软件。',

    'services.aiConsulting.title': 'AI 落地咨询',
    'services.aiConsulting.desc':
      '从场景选型到生产落地——帮你把大模型、RAG 与智能体，真正用在能创造价值的地方。',

    'services.cloudMigration.title': '云架构与迁移',
    'services.cloudMigration.desc':
      '设计高可用的云架构，并以零停机方案把既有系统平滑迁移到 AWS、GCP 或 Azure，兼顾成本与稳定。',

    'services.distributed.title': '高并发 · 分布式系统咨询',
    'services.distributed.desc':
      '面向高并发、突发流量场景的架构评审与实战调优，让系统在重负载下依然又快又稳。',

    'services.fractionalCto.title': 'MVP · 技术合伙人（Fractional CTO）',
    'services.fractionalCto.desc':
      '为创始人提供兼职技术领导：规划路线图、打造 MVP、组建首批工程团队，无需全职 CTO。',

    'services.dataPlatform.title': '数据工程与分析看板',
    'services.dataPlatform.desc':
      '搭建可靠的数据管道、数仓与可决策的分析看板，把原始事件变成可信赖的业务指标。',

    'services.crossBorder.title': '跨境技术对接',
    'services.crossBorder.desc':
      '在中国与海外团队之间搭建双语技术桥梁：供应商评估、沟通协调与交付落地，消除时差与语言摩擦。',

    'services.customDev.title': '网站 · 小程序 · App 定制开发',
    'services.customDev.desc':
      '网站、微信小程序与移动 App 的定制开发——端到端的设计与交付，由一支负责到底的团队完成。',

    // ---- 方法 ---------------------------------------------------------------
    'approach.title': '方法',
    'approach.intro': '一套简单而严谨的流程，让工作聚焦、风险可控。',

    'approach.discover.title': '探索',
    'approach.discover.desc': '在写下第一行代码之前，先理清目标、用户与约束。',

    'approach.design.title': '设计',
    'approach.design.desc': '通过原型反复打磨与验证体验，确保做对的东西。',

    'approach.build.title': '构建',
    'approach.build.desc': '以小步、可测试的增量交付，质量与安全内建其中。',

    'approach.iterate.title': '迭代',
    'approach.iterate.desc': '持续度量、学习与优化——上线绝不是改进的终点。',

    // ---- 联系 ---------------------------------------------------------------
    'contact.title': '联系我们',
    'contact.eyebrow': '取得联系',
    'contact.intro': '有想做的项目？告诉我们你正在打造什么，我们会尽快回复。',
    'contact.cta': '一起打造出色的产品',
    'contact.emailLabel': '邮箱',
    'contact.email': 'fono.tech.llc@gmail.com',
    'contact.form.name': '姓名',
    'contact.form.namePlaceholder': '你的名字',
    'contact.form.email': '邮箱',
    'contact.form.emailPlaceholder': 'you@example.com',
    'contact.form.message': '留言',
    'contact.form.messagePlaceholder': '和我们聊聊你的项目……',
    'contact.form.submit': '发送',
    'contact.response': '我们通常会在一个工作日内回复。',

    // ---- 页脚 ---------------------------------------------------------------
    'footer.brand': 'fono.tech.llc',
    'footer.location': '美国华盛顿州',
    'footer.tagline': '软件设计与工程。',
    'footer.rights': '保留所有权利。',
    'footer.copyright': '© fono.tech.llc 保留所有权利。',
  },
};

/**
 * Public i18n configuration consumed by main.js.
 * `translations` is the { zh, en } catalog; the rest is locale metadata.
 */
const I18N = {
  defaultLocale: DEFAULT_LOCALE,
  fallbackLocale: DEFAULT_LOCALE,
  locales: LOCALES,
  localeLabels: LOCALE_LABELS,
  translations: TRANSLATIONS,
};

// Expose for the browser (main.js reads window.I18N) and, where present, for
// CommonJS consumers such as tests. No-ops harmlessly when neither exists.
if (typeof window !== 'undefined') {
  window.I18N = I18N;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = I18N;
}

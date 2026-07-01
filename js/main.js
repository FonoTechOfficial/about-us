// main.js — site entry point: i18n, footer year, scroll-reveal, and scroll-aware nav.
//
// Deferred, runs after i18n.js once the document is parsed (see index.html).
// Four independent behaviors, each in its own IIFE so a failure in one never
// stops the others:
//
//   1. i18nController()    — apply the bilingual catalog (i18n.js) to the DOM,
//                            wire the EN / 中 toggle, remember the choice, and
//                            choose the first-load locale from the browser.
//   2. stampFooterYear()   — keep the copyright year current.
//   3. revealOnScroll()    — fade + rise each section into view, staggered, via
//                            IntersectionObserver. JS only toggles classes; the
//                            transform/opacity live in CSS (injected below).
//   4. navScrollBehavior() — hide the header on scroll-down / show on scroll-up,
//                            firm it up once the page moves, and highlight the
//                            nav link for the section currently in view.
//
// Design constraints (mirrors the rest of the project):
//   • Only transform + opacity are animated, so motion stays on the compositor.
//   • prefers-reduced-motion is honored — no reveal animation, no header slide.
//   • All visual state is expressed as CSS classes the browser styles; this file
//     never writes inline geometry, it only flips classes.

'use strict';

// ============================================================================
// i18n controller — the DOM half of the bilingual setup. i18n.js owns the DATA
// (the zh/en catalog + the data-* conventions); this applies it:
//   • text:   [data-i18n="key"]            → el.textContent = dict[locale][key]
//   • attrs:  [data-i18n-attr="attr:key;…"] → el.setAttribute(attr, value)
//   • meta:   <title>, <meta description>, <html lang> from the meta.* keys
//   • toggle: move .is-active between the EN / 中 segments of #lang-toggle
//
// First-load locale resolves saved choice → browser language → default, and the
// choice is persisted to localStorage so a refresh keeps the language. Missing
// keys fall back to the default locale, never to a blank string.
// ============================================================================
(function i18nController() {
  const config = window.I18N;
  if (!config || !config.translations) return; // no catalog → keep HTML defaults

  const { translations, locales, defaultLocale, fallbackLocale } = config;
  const STORAGE_KEY = 'fono.locale';

  const root = document.documentElement;
  const toggle = document.getElementById('lang-toggle');

  let activeLocale = resolveInitialLocale();
  applyLocale(activeLocale);

  // The whole pill is one switch: each click advances to the next locale.
  if (toggle) {
    toggle.addEventListener('click', () => applyLocale(nextLocale(activeLocale)));
  }

  // ---- locale resolution ---------------------------------------------------

  // Saved preference wins; otherwise read the browser's languages; otherwise the
  // configured default (guarded so a bad default can't strand us off-list).
  function resolveInitialLocale() {
    return (
      readSavedLocale() ||
      detectBrowserLocale() ||
      (isSupported(defaultLocale) ? defaultLocale : locales[0])
    );
  }

  function readSavedLocale() {
    let saved = null;
    try {
      saved = window.localStorage.getItem(STORAGE_KEY);
    } catch (err) {
      saved = null; // storage blocked (private mode) → fall through to detection
    }
    return isSupported(saved) ? saved : null;
  }

  function detectBrowserLocale() {
    const tags =
      navigator.languages && navigator.languages.length
        ? navigator.languages
        : [navigator.language];
    for (const tag of tags) {
      if (!tag) continue;
      const base = tag.toLowerCase().split('-')[0]; // "zh-CN" → "zh"
      if (isSupported(base)) return base;
    }
    return null;
  }

  function isSupported(locale) {
    return Boolean(locale) && locales.indexOf(locale) !== -1;
  }

  function nextLocale(current) {
    const i = locales.indexOf(current);
    return locales[(i + 1) % locales.length];
  }

  // ---- apply ---------------------------------------------------------------

  function applyLocale(locale) {
    if (!isSupported(locale)) return;
    activeLocale = locale;

    translateText(locale);
    translateAttrs(locale);
    applyDocumentMeta(locale);
    syncToggle(locale);
    saveLocale(locale);
  }

  // Single flat lookup, falling back to the default locale for any missing key.
  function translate(locale, key) {
    const dict = translations[locale] || {};
    if (key in dict) return dict[key];
    const fallback = translations[fallbackLocale] || {};
    return key in fallback ? fallback[key] : null;
  }

  function translateText(locale) {
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const value = translate(locale, el.getAttribute('data-i18n'));
      if (value != null) el.textContent = value;
    });
  }

  function translateAttrs(locale) {
    document.querySelectorAll('[data-i18n-attr]').forEach((el) => {
      el.getAttribute('data-i18n-attr')
        .split(';')
        .forEach((pair) => {
          const sep = pair.indexOf(':'); // "attr:key" — split on the FIRST colon
          if (sep === -1) return;
          const attr = pair.slice(0, sep).trim();
          const key = pair.slice(sep + 1).trim();
          if (!attr || !key) return;
          const value = translate(locale, key);
          if (value != null) el.setAttribute(attr, value);
        });
    });
  }

  function applyDocumentMeta(locale) {
    root.setAttribute('lang', locale);
    const title = translate(locale, 'meta.title');
    if (title) document.title = title;
    const description = translate(locale, 'meta.description');
    if (description) {
      const meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute('content', description);
    }
  }

  // Light up the segment for the current locale, clear the other.
  function syncToggle(locale) {
    if (!toggle) return;
    toggle.querySelectorAll('.nav__lang-option[data-lang]').forEach((option) => {
      option.classList.toggle('is-active', option.getAttribute('data-lang') === locale);
    });
  }

  function saveLocale(locale) {
    try {
      window.localStorage.setItem(STORAGE_KEY, locale);
    } catch (err) {
      // Storage unavailable — the in-page switch still works for this session.
    }
  }
})();

// ============================================================================
// Footer year — stamp the current year into every [data-year] element so the
// copyright never goes stale. The HTML carries a static fallback for no-JS.
// ============================================================================
(function stampFooterYear() {
  const year = String(new Date().getFullYear());
  document.querySelectorAll('[data-year]').forEach((el) => {
    el.textContent = year;
  });
})();

// ============================================================================
// Scroll reveal — each content block starts hidden (opacity 0, nudged down) and
// transitions in as it scrolls into view. Blocks are grouped per section so the
// stagger index resets at each section, giving a tidy top-down cascade instead
// of one ever-growing delay down the page.
// ============================================================================
(function revealOnScroll() {
  // Reveal targets, grouped by section. Each group's selectors resolve in
  // document order and missing nodes are simply skipped, so this degrades
  // gracefully if a section's markup changes. The leading section (#hero) is
  // above the fold and reveals instantly; the rest animate on scroll.
  const REVEAL_GROUPS = [
    ['#hero'],
    ['#about .about__label', '#about .about__lead', '#about .about__note'],
    ['#services h2', '#services .services__intro', '#services .service-card'],
    ['#approach'],
    ['#contact .contact__eyebrow', '#contact .contact__cta-line', '#contact .contact__intro'],
  ];

  const REVEAL_THRESHOLD = 0.15; // fraction of an item visible before it reveals

  // Collect targets and tag each with its stagger index within its group.
  const items = collectRevealItems();
  if (!items.length) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  // Honor reduced motion (and very old browsers without IntersectionObserver):
  // leave everything visible, no hidden state, no animation.
  if (prefersReducedMotion.matches || !('IntersectionObserver' in window)) {
    return;
  }

  injectRevealStyles();

  const observer = new IntersectionObserver(onIntersect, { threshold: REVEAL_THRESHOLD });

  items.forEach((el) => {
    el.classList.add('reveal');
    if (isInViewport(el)) {
      // Already on screen at load: reveal in the SAME frame the hidden class is
      // added, so the computed style is "visible" and the user never sees a
      // flash. (Below-the-fold items stay hidden off-screen and animate later.)
      el.classList.add('is-visible');
    } else {
      observer.observe(el);
    }
  });

  function onIntersect(entries) {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target); // reveal once, then stop watching
    });
  }

  // ---- helpers -------------------------------------------------------------

  function collectRevealItems() {
    const collected = [];
    REVEAL_GROUPS.forEach((selectors) => {
      let order = 0;
      selectors.forEach((selector) => {
        document.querySelectorAll(selector).forEach((el) => {
          el.style.setProperty('--reveal-order', String(order));
          collected.push(el);
          order += 1;
        });
      });
    });
    return collected;
  }

  function isInViewport(el) {
    const rect = el.getBoundingClientRect();
    const viewportH = window.innerHeight || document.documentElement.clientHeight;
    return rect.top < viewportH && rect.bottom > 0;
  }

  // Inject the reveal styles from JS so the whole behavior stays in this file
  // and no-JS visitors are never left with hidden content. Values resolve
  // through the existing design tokens (tokens.css, loaded first). The
  // reduced-motion guard here is a belt-and-suspenders match for the JS check
  // above and also covers a mid-session preference change.
  function injectRevealStyles() {
    if (document.getElementById('reveal-styles')) return;
    const style = document.createElement('style');
    style.id = 'reveal-styles';
    style.textContent = `
      .reveal {
        opacity: 0;
        transform: translateY(1.25rem);
        transition:
          opacity var(--duration-slow) var(--ease-out-expo),
          transform var(--duration-slow) var(--ease-out-expo);
        transition-delay: calc(var(--reveal-order, 0) * 80ms);
        will-change: opacity, transform;
      }
      .reveal.is-visible {
        opacity: 1;
        transform: none;
        will-change: auto;
      }
      @media (prefers-reduced-motion: reduce) {
        .reveal {
          opacity: 1;
          transform: none;
          transition: none;
          will-change: auto;
        }
      }
    `;
    document.head.appendChild(style);
  }
})();

// ============================================================================
// Scroll-aware navigation — two behaviors on the sticky header:
//   • hide / show: tuck the bar away on scroll-down, bring it back on scroll-up
//     (slide via the .is-hidden class; styled in layout.css). Firm the bar up
//     with .is-scrolled once the page has moved off the very top.
//   • active link: highlight the nav link whose section is currently in view,
//     using a thin IntersectionObserver band near the top of the viewport.
// Both only flip classes that layout.css already styles.
// ============================================================================
(function navScrollBehavior() {
  const header = document.getElementById('site-header');
  if (!header) return;

  const SCROLLED_AT = 8;   // px scrolled before the bar commits to its solid look
  const HIDE_DELTA = 6;    // px of movement to ignore as jitter before hide/show

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  initHideOnScroll();
  initActiveLink();

  // ---- hide / show on scroll ----------------------------------------------

  function initHideOnScroll() {
    let lastY = window.scrollY;
    let ticking = false;

    function update() {
      ticking = false;
      const y = window.scrollY;

      // Solid bar with hairline + shadow once we leave the very top.
      header.classList.toggle('is-scrolled', y > SCROLLED_AT);

      if (prefersReducedMotion.matches) {
        // No sliding under reduced motion — keep the bar put.
        header.classList.remove('is-hidden');
      } else {
        const delta = y - lastY;
        if (Math.abs(delta) > HIDE_DELTA) {
          const scrollingDown = delta > 0;
          const pastHeader = y > header.offsetHeight;
          header.classList.toggle('is-hidden', scrollingDown && pastHeader);
        }
      }
      lastY = y;
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update); // coalesce scroll churn into one rAF
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    // If the preference flips to reduced mid-session, reveal the bar at once.
    prefersReducedMotion.addEventListener('change', (e) => {
      if (e.matches) header.classList.remove('is-hidden');
    });

    update(); // set the initial state for the current scroll position
  }

  // ---- active-section highlight -------------------------------------------

  function initActiveLink() {
    if (!('IntersectionObserver' in window)) return;

    const links = Array.from(document.querySelectorAll('.nav__link[href^="#"]'));
    if (!links.length) return;

    // Map each tracked section id to its nav link, then the sections that exist.
    const sectionIds = links
      .map((link) => link.getAttribute('href').slice(1))
      .filter(Boolean);
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    if (!sections.length) return;

    let activeId = null;

    function setActive(id) {
      if (id === activeId) return;
      activeId = id;
      links.forEach((link) => {
        const isActive = link.getAttribute('href') === `#${id}`;
        link.classList.toggle('is-active', isActive);
        if (isActive) {
          link.setAttribute('aria-current', 'page');
        } else {
          link.removeAttribute('aria-current');
        }
      });
    }

    // A thin band ~40% down the viewport: the section overlapping it is current.
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-35% 0px -55% 0px', threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));
  }
})();

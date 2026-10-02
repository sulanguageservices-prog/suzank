// English/Korean switcher. Page text is translated in place from KO_DICT (js/ko.js), keyed by the English text.
(() => {
  const STORAGE_KEY = "site-lang";
  const ATTRS = ["placeholder", "aria-label", "title", "alt"];
  const norm = (s) => s.replace(/\s+/g, " ").trim();

  let lang = "en";
  try { if (localStorage.getItem(STORAGE_KEY) === "ko") lang = "ko"; } catch { /* storage unavailable */ }

  const lookup = (s) => (Object.hasOwn(window.KO_DICT, norm(s)) ? window.KO_DICT[norm(s)] : undefined);
  const t = (s) => (lang === "ko" && lookup(s) !== undefined ? lookup(s) : s);

  const originals = new WeakMap();
  const walk = () =>
    document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: (n) => (n.parentElement.closest("script, style, pre") ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT),
    });

  const translateNode = (node) => {
    const orig = originals.get(node) ?? node.nodeValue;
    const ko = lookup(orig);
    if (ko === undefined) return;
    originals.set(node, orig);
    node.nodeValue = lang === "ko" ? orig.match(/^\s*/)[0] + ko + orig.match(/\s*$/)[0] : orig;
  };

  const translateAttrs = (el) => {
    ATTRS.forEach((attr) => {
      if (!el.hasAttribute(attr)) return;
      const store = `data-en-${attr}`;
      const orig = el.getAttribute(store) ?? el.getAttribute(attr);
      const ko = lookup(orig);
      if (ko === undefined) return;
      el.setAttribute(store, orig);
      el.setAttribute(attr, lang === "ko" ? ko : orig);
    });
  };

  const meta = document.querySelector('meta[name="description"]');
  const enTitle = document.title;
  const enDescription = meta && meta.content;
  const button = document.createElement("button");
  button.type = "button";
  button.className = "lang-toggle";

  const apply = () => {
    document.documentElement.lang = lang;
    const w = walk();
    while (w.nextNode()) translateNode(w.currentNode);
    document.querySelectorAll(ATTRS.map((a) => `[${a}]`).join(",")).forEach(translateAttrs);
    document.title = lang === "ko" ? lookup(enTitle) ?? enTitle : enTitle;
    if (meta) meta.content = lang === "ko" ? lookup(enDescription) ?? enDescription : enDescription;
    button.textContent = lang === "ko" ? "English" : "한국어";
    button.lang = lang === "ko" ? "en" : "ko";
    button.setAttribute("aria-label", lang === "ko" ? "Switch to English" : "한국어로 전환");
  };

  window.i18n = {
    get lang() { return lang; },
    t,
  };

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelector(".nav").append(button);
    button.addEventListener("click", () => {
      lang = lang === "ko" ? "en" : "ko";
      try { localStorage.setItem(STORAGE_KEY, lang); } catch { /* storage unavailable */ }
      apply();
      document.dispatchEvent(new CustomEvent("sitelanguagechange"));
    });
    apply();
  });
})();

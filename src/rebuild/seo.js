/* Per-page head management: title, description, canonical, hreflang
   alternates and Open Graph, localized. */

import { lang } from "./i18n/index.js";

const ORIGIN = "https://www.evrielsystems.com";
const OG_LOCALES = { en: "en_US", it: "it_IT", el: "el_GR", es: "es_ES" };

function ensure(selector, create) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = create();
    document.head.appendChild(el);
  }
  return el;
}

function meta(attr, name, content) {
  const el = ensure(`meta[${attr}="${name}"]`, () => {
    const m = document.createElement("meta");
    m.setAttribute(attr, name);
    return m;
  });
  el.setAttribute("content", content);
}

/* path is the language-free path, e.g. "/" or "/work/clocket". */
export function setHead({ title, desc, path }) {
  document.title = title;
  document.documentElement.setAttribute("lang", lang);
  meta("name", "description", desc);
  meta("property", "og:title", title);
  meta("property", "og:description", desc);
  meta("property", "og:locale", OG_LOCALES[lang]);
  meta("name", "twitter:title", title);
  meta("name", "twitter:description", desc);

  const urlFor = (code) =>
    ORIGIN + (code === "en" ? (path === "/" ? "" : path) : `/${code}${path === "/" ? "" : path}`) + (path === "/" && code === "en" ? "/" : "");

  meta("property", "og:url", urlFor(lang));

  const canonical = ensure('link[rel="canonical"]', () => {
    const l = document.createElement("link");
    l.setAttribute("rel", "canonical");
    return l;
  });
  canonical.setAttribute("href", urlFor(lang));

  document.head.querySelectorAll('link[rel="alternate"][hreflang]').forEach((el) => el.remove());
  for (const code of ["en", "it", "el", "es"]) {
    const l = document.createElement("link");
    l.setAttribute("rel", "alternate");
    l.setAttribute("hreflang", code === "en" ? "en" : code);
    l.setAttribute("href", urlFor(code));
    document.head.appendChild(l);
  }
  const xd = document.createElement("link");
  xd.setAttribute("rel", "alternate");
  xd.setAttribute("hreflang", "x-default");
  xd.setAttribute("href", urlFor("en"));
  document.head.appendChild(xd);
}

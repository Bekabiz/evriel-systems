/* Language layer. English lives at /, the other languages at /it, /el, /es
   with identical pages, so a visitor can switch language anywhere and stay
   on the same page. */

import en from "./en.js";
import it from "./it.js";
import el from "./el.js";
import es from "./es.js";

export const LANGS = [
  { code: "en", name: "English", flag: "gb" },
  { code: "it", name: "Italiano", flag: "it" },
  { code: "el", name: "Ελληνικά", flag: "gr" },
  { code: "es", name: "Español", flag: "es" },
];

const DICTS = { en, it, el, es };

export function detectLang(pathname) {
  const m = pathname.match(/^\/(it|el|es)(\/|$)/);
  return m ? m[1] : "en";
}

export function stripLang(pathname) {
  return pathname.replace(/^\/(it|el|es)(?=\/|$)/, "") || "/";
}

export const lang = detectLang(window.location.pathname);
export const t = DICTS[lang];

/* Prefixes a site path with the current language. */
export function withLang(path, code = lang) {
  if (code === "en" || path.startsWith("#") || path.startsWith("http") || path.startsWith("mailto")) {
    return path;
  }
  if (path.startsWith("/#")) return `/${code}` + path.slice(1);
  if (path === "/") return `/${code}`;
  return `/${code}${path}`;
}

/* The same page in another language, for the switcher. */
export function switchLangHref(code) {
  const base = stripLang(window.location.pathname);
  const suffix = window.location.hash || "";
  if (code === "en") return (base === "/" ? "/" : base) + suffix;
  return `/${code}${base === "/" ? "" : base}` + suffix || `/${code}`;
}

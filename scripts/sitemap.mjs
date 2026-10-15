/* Generates public/sitemap.xml: every page in every language, with
   hreflang alternates on each entry. Run after adding pages. */

import { writeFileSync } from "fs";

const ORIGIN = "https://www.evrielsystems.com";
const LANGS = ["en", "it", "el", "es"];
const PATHS = [
  "/",
  "/work/evriel-inventory",
  "/work/ag-project-monitor",
  "/work/develop-ec",
  "/work/tasktock",
  "/work/domainintel",
  "/work/clocket",
  "/insights",
  "/insights/ai-beyond-chatbots",
  "/insights/automation-failures",
  "/insights/ai-construction-engineering",
  "/insights/digital-transformation-people",
  "/insights/intelligent-systems-advantage",
  "/insights/data-driven-decisions",
];

const url = (path, code) =>
  ORIGIN + (code === "en" ? path : `/${code}${path === "/" ? "" : path}`);

const today = new Date().toISOString().slice(0, 10);
let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n`;

for (const path of PATHS) {
  for (const code of LANGS) {
    xml += `  <url>\n    <loc>${url(path, code)}</loc>\n    <lastmod>${today}</lastmod>\n`;
    for (const alt of LANGS) {
      xml += `    <xhtml:link rel="alternate" hreflang="${alt}" href="${url(path, alt)}"/>\n`;
    }
    xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${url(path, "en")}"/>\n  </url>\n`;
  }
}
xml += `</urlset>\n`;

writeFileSync("public/sitemap.xml", xml);
console.log(`sitemap.xml written: ${PATHS.length * LANGS.length} urls`);

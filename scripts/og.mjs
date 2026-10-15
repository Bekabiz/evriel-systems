/* Captures the live hero at 1200x630 as the Open Graph image. */
import { chromium } from "playwright-core";

const b = await chromium.launch({ channel: "chrome" });
const ctx = await b.newContext({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 2 });
const p = await ctx.newPage();
await p.goto("http://localhost:5173/", { waitUntil: "networkidle" });
await p.evaluate(() => document.fonts.ready);
await new Promise((r) => setTimeout(r, 2500));
const cdp = await ctx.newCDPSession(p);
const { data } = await cdp.send("Page.captureScreenshot", { format: "jpeg", quality: 88 });
const { writeFileSync } = await import("fs");
writeFileSync("public/og-image.jpg", Buffer.from(data, "base64"));
console.log("og-image.jpg captured from the new hero");
await b.close();

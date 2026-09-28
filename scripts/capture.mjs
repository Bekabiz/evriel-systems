/* Captures every project's screens and demo videos.
   Screenshots: PNG at 2x into public/captures/<slug>/.
   Videos: webm recordings of scripted flows, saved as demo.webm.
   Develop EC is captured from the real live site; the other systems are
   captured from the interface pages in captures-src (plan part 6). */

import { chromium } from "playwright-core";
import { mkdirSync, readdirSync, renameSync, rmSync } from "fs";
import { resolve } from "path";

const root = process.cwd();
const src = (f) => "file:///" + resolve(root, "captures-src", f).replace(/\\/g, "/");
const out = (slug) => {
  const d = resolve(root, "public", "captures", slug);
  mkdirSync(d, { recursive: true });
  return d;
};

const LAPTOP = { width: 1440, height: 900 };
const PHONE = { width: 390, height: 844 };
const VIDEO_LAPTOP = { width: 1280, height: 800 };

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const SHOTS = [
  ["evriel-inventory", "dashboard", src("inventory.html?view=dashboard"), LAPTOP],
  ["evriel-inventory", "products", src("inventory.html?view=products"), LAPTOP],
  ["evriel-inventory", "invoice", src("inventory.html?view=invoice"), LAPTOP],
  ["evriel-inventory", "orders", src("inventory.html?view=orders"), LAPTOP],
  ["ag-project-monitor", "tasks", src("ag.html?view=tasks"), PHONE],
  ["ag-project-monitor", "task", src("ag.html?view=task"), PHONE],
  ["ag-project-monitor", "timeline", src("ag.html?view=timeline"), PHONE],
  ["tasktock", "today", src("tasktock.html?view=today"), PHONE],
  ["tasktock", "inbox", src("tasktock.html?view=inbox"), PHONE],
  ["domainintel", "results", src("domainintel.html"), LAPTOP],
  ["clocket", "admin-dashboard", src("clocket-admin.html?view=dashboard"), LAPTOP],
  ["clocket", "admin-reports", src("clocket-admin.html?view=reports"), LAPTOP],
  ["clocket", "app-clockin", src("clocket-app.html?view=clockin"), PHONE],
  ["clocket", "app-working", src("clocket-app.html?view=working"), PHONE],
  ["develop-ec", "home", "https://developec.gr", LAPTOP, 0],
  ["develop-ec", "mid", "https://developec.gr", LAPTOP, 0.38],
  ["develop-ec", "lower", "https://developec.gr", LAPTOP, 0.72],
];

const only = process.argv[2];

async function screenshots(browser) {
  for (const [slug, name, url, viewport, scrollFrac] of SHOTS) {
    if (only && slug !== only) continue;
    const context = await browser.newContext({
      viewport,
      deviceScaleFactor: 2,
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
    });
    const page = await context.newPage();
    await page
      .goto(url, { waitUntil: "domcontentloaded", timeout: 60000 })
      .catch((e) => console.log(`warn ${slug}/${name}: ${e.message.split("\n")[0]}`));
    await page.waitForLoadState("networkidle", { timeout: 15000 }).catch(() => {});
    await sleep(2200);
    if (scrollFrac) {
      await page.evaluate((f) => {
        window.scrollTo(0, (document.documentElement.scrollHeight - window.innerHeight) * f);
      }, scrollFrac);
      await sleep(1200);
    }
    if (url.startsWith("http")) {
      // CDP capture: skips Playwright's font-settling wait, which never
      // resolves on some live sites.
      const cdp = await context.newCDPSession(page);
      const { data } = await cdp.send("Page.captureScreenshot", { format: "png" });
      const { writeFileSync } = await import("fs");
      writeFileSync(resolve(out(slug), `${name}.png`), Buffer.from(data, "base64"));
    } else {
      await page.screenshot({ path: resolve(out(slug), `${name}.png`) });
    }
    await context.close();
    console.log(`shot  ${slug}/${name}.png`);
  }
}

async function recordVideo(browser, slug, size, run) {
  const dir = resolve(root, ".video-tmp", slug);
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  const context = await browser.newContext({
    viewport: size,
    deviceScaleFactor: 1,
    recordVideo: { dir, size },
  });
  const page = await context.newPage();
  await run(page);
  await context.close();
  const file = readdirSync(dir).find((f) => f.endsWith(".webm"));
  renameSync(resolve(dir, file), resolve(out(slug), "demo.webm"));
  rmSync(dir, { recursive: true, force: true });
  console.log(`video ${slug}/demo.webm`);
}

async function smoothScroll(page, to, steps = 40, delay = 30) {
  for (let i = 1; i <= steps; i++) {
    await page.evaluate((y) => window.scrollTo(0, y), (to * i) / steps);
    await sleep(delay);
  }
}

async function videos(browser) {
  const want = (slug) => !only || only === slug;

  if (want("evriel-inventory"))
  await recordVideo(browser, "evriel-inventory", VIDEO_LAPTOP, async (page) => {
    await page.goto(src("inventory.html?view=dashboard"), { waitUntil: "networkidle" });
    await sleep(3200);
    await page.evaluate(() => window.show("products"));
    await sleep(3000);
    await page.evaluate(() => window.show("invoice"));
    await sleep(3400);
    await page.evaluate(() => window.show("orders"));
    await sleep(2600);
  });

  if (want("ag-project-monitor"))
  await recordVideo(browser, "ag-project-monitor", PHONE, async (page) => {
    await page.goto(src("ag.html?view=tasks"), { waitUntil: "networkidle" });
    await sleep(3200);
    await page.evaluate(() => window.show("task"));
    await sleep(4200);
    await page.evaluate(() => window.show("timeline"));
    await sleep(3000);
  });

  if (want("tasktock"))
  await recordVideo(browser, "tasktock", PHONE, async (page) => {
    await page.goto(src("tasktock.html?view=today"), { waitUntil: "networkidle" });
    await sleep(3400);
    await page.evaluate(() => window.show("inbox"));
    await sleep(3400);
  });

  if (want("domainintel"))
  await recordVideo(browser, "domainintel", VIDEO_LAPTOP, async (page) => {
    await page.goto(src("domainintel.html"), { waitUntil: "networkidle" });
    await sleep(3600);
    await smoothScroll(page, 260, 26, 30);
    await sleep(2600);
  });

  if (want("clocket"))
  await recordVideo(browser, "clocket", PHONE, async (page) => {
    await page.goto(src("clocket-app.html?view=clockin"), { waitUntil: "networkidle" });
    await sleep(3600);
    await page.evaluate(() => window.show("working"));
    await sleep(3200);
  });

  if (want("develop-ec"))
  await recordVideo(browser, "develop-ec", VIDEO_LAPTOP, async (page) => {
    await page.goto("https://developec.gr", { waitUntil: "domcontentloaded", timeout: 60000 }).catch(() => {});
    await page.waitForLoadState("networkidle", { timeout: 15000 }).catch(() => {});
    await sleep(2600);
    const height = await page.evaluate(
      () => document.documentElement.scrollHeight - window.innerHeight
    );
    await smoothScroll(page, Math.min(height, 4200), 120, 45);
    await sleep(1400);
  });
}

const browser = await chromium.launch({ channel: "chrome" });
await screenshots(browser);
await videos(browser);
await browser.close();
console.log("done");

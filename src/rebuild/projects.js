/* Content for the six project pages. Plan part 5: every major feature gets
   its own block. Facts come from the old site's project records, the rebuild
   plan and the products' own docs. No invented numbers.
   Client respect rule: no client names, prices or internal data. */

export const PROJECTS = {
  "evriel-inventory": {
    slug: "evriel-inventory",
    name: "Evriel Inventory",
    initials: "EI",
    theme: "inv",
    tagline: "Inventory that runs three stores.",
    gradWord: "Inventory",
    one: "One system for stock, orders, transfers and invoices, in daily use across a retail group in Greece.",
    wanted:
      "A retail group running three stores had its stock, orders and supplier invoices spread across spreadsheets and memory. Every store counted its own truth, and entering a supplier invoice by hand took most of an hour.",
    features: [
      {
        t: "Live stock across three stores",
        d: "Every product, every store, one screen. Staff see what is really on the shelf before they promise it to a customer.",
      },
      {
        t: "Orders",
        d: "Purchase orders are created and tracked inside the system. What was ordered, what arrived and what is still open stays visible.",
      },
      {
        t: "Store transfers",
        d: "Stock moves between the three stores with a transfer record, so quantities stay correct on both sides.",
      },
      {
        t: "Fast invoice entry",
        d: "Supplier invoices are matched to product records instead of being retyped line by line. Entry time went from about 40 minutes to about 5.",
      },
    ],
    results: [
      { b: "39,000+", s: "products tracked" },
      { b: "3", s: "stores connected" },
      { b: "40 to 5 min", s: "invoice entry time" },
    ],
    how: "A web application backed by a PostgreSQL database, deployed on Vercel. Supplier invoices are matched automatically against product and supplier records.",
    device: "laptop",
    live: null,
    next: "ag-project-monitor",
  },

  "ag-project-monitor": {
    slug: "ag-project-monitor",
    name: "AG Project Monitor",
    initials: "AG",
    theme: "ag",
    tagline: "Tasks that start as a voice note.",
    gradWord: "voice note",
    one: "Construction intelligence for building sites: voice notes, site photos and documents become one project record.",
    wanted:
      "On a building site nobody sits at a desk. Instructions were given by phone and voice message, photos lived in chat threads, and by the end of the week nobody could say what was decided, where, and by whom.",
    features: [
      {
        t: "Voice memo transcription",
        d: "A site engineer speaks into a phone. The system transcribes the note, understands it and turns it into a task with the right people attached.",
      },
      {
        t: "Site photo intelligence",
        d: "Photos from the site are tied to the project record and its timeline, so progress is visible without a site visit.",
      },
      {
        t: "Project timeline",
        d: "Tasks, notes and photos land on one timeline per project. What happened last Tuesday is one scroll away, not one phone call away.",
      },
      {
        t: "Documents and drawings",
        d: "Engineering documents and drawing exports live with the project they belong to, not in someone's inbox.",
      },
      {
        t: "AI reporting",
        d: "The system drafts progress reports from what the team already recorded, instead of asking the team to write them twice.",
      },
    ],
    results: [],
    how: "Voice notes pass through a transcription and analysis pipeline that produces structured tasks, notifications and reports. Built phone-first, because the site is where the work happens.",
    device: "phone",
    live: null,
    next: "develop-ec",
  },

  "develop-ec": {
    slug: "develop-ec",
    name: "Develop EC",
    initials: "EC",
    theme: "ec",
    tagline: "Architecture in black and white.",
    gradWord: "black and white",
    one: "The public site of a Greek property developer: calm pages, real photography and a warm copper accent.",
    wanted:
      "A property developer needed a public site that feels like their buildings: solid, calm and confident. No stock renders, no noise, just the work presented properly.",
    features: [
      {
        t: "A black and white identity",
        d: "The whole site runs on real architectural photography in black and white, with one warm copper accent. The buildings carry the design.",
      },
      {
        t: "Project pages",
        d: "Each development gets its own page with its photography, its facts and its status, presented at full width.",
      },
      {
        t: "Built to be read",
        d: "Short pages, plain language and photography first. A visitor understands who the company is within one screen.",
      },
    ],
    results: [],
    how: null,
    device: "browser",
    live: "https://developec.gr",
    next: "tasktock",
  },

  tasktock: {
    slug: "tasktock",
    name: "TaskTock",
    initials: "TT",
    theme: "tt",
    tagline: "Tasks that follow you into Telegram.",
    gradWord: "Telegram",
    one: "A task app with a Telegram bot at its side, so tasks get captured where the conversation already happens.",
    wanted:
      "Tasks were being agreed in chat and then lost in chat. The idea: keep the app for planning, and put a bot inside Telegram so capturing a task costs one message, not an app switch.",
    features: [
      {
        t: "The task app",
        d: "Tasks, deadlines and status in a clean list. Made for people who want to see today, not a project management course.",
      },
      {
        t: "The Telegram bot",
        d: "Send the bot a message and it becomes a task. Ask it what is open and it answers. The bot and the app share one brain.",
      },
      {
        t: "Reminders",
        d: "Deadlines come back to you in Telegram, where you were going to be anyway.",
      },
    ],
    results: [],
    how: "One task database behind two front doors: the web app and the Telegram bot.",
    device: "phone",
    live: null,
    next: "domainintel",
  },

  domainintel: {
    slug: "domainintel",
    name: "DomainIntel",
    initials: "DI",
    theme: "di",
    tagline: "Buy, review or avoid.",
    gradWord: "Buy",
    one: "AI-powered domain research: the system reads a domain the way an experienced SEO would, and gives a clear call.",
    wanted:
      "SEO professionals were spending hours qualifying domains by hand: checking authority, traffic, history and toxicity across separate tools, then still guessing at the final call.",
    features: [
      {
        t: "Semantic search",
        d: "Search domains by meaning, not just keywords. The system understands what a domain is about and finds the ones relevant to your niche.",
      },
      {
        t: "Buy, review or avoid",
        d: "Every domain gets one of three clear recommendations, with the reasoning behind it. The decision arrives qualified, not raw.",
      },
      {
        t: "Toxic domain filtering",
        d: "Domains with a poisoned history are flagged and filtered before they waste your time or your money.",
      },
      {
        t: "Authority and traffic checks",
        d: "Domain rating and traffic signals are pulled into the same view, so the numbers sit next to the recommendation they support.",
      },
      {
        t: "Backlink gap scan",
        d: "The premium scan compares backlink profiles to show where a domain's opportunity actually is.",
      },
    ],
    results: [],
    how: "Built on Supabase with an AI layer for semantic search and scoring. The scoring blends authority, traffic, history and toxicity signals into one recommendation.",
    device: "laptop",
    live: null,
    next: "clocket",
  },

  clocket: {
    slug: "clocket",
    name: "ClockET",
    initials: "CK",
    theme: "ck",
    tagline: "Attendance you can trust.",
    gradWord: "Attendance",
    one: "Workforce attendance for Ethiopian companies: employees clock in with GPS and a selfie, admins see the truth.",
    wanted:
      "Companies with office and field staff could not trust their attendance sheets. Paper sign-ins were signed by friends, and payroll argued with reality every month.",
    features: [
      {
        t: "GPS and selfie clock-in",
        d: "An employee clocks in with their location and a selfie. Geofencing checks they are really at the office, and the photo checks they are really them.",
      },
      {
        t: "Shifts and grace periods",
        d: "Morning, afternoon, night and full-day shifts, each with a grace window. Late is measured, not argued about.",
      },
      {
        t: "Leave requests with a conversation",
        d: "Employees request leave from their phone, admins approve or reject, and both sides can talk inside the request itself.",
      },
      {
        t: "Monthly reports and salary math",
        d: "Attendance rolls up into monthly reports per employee, including the salary deduction for absent days. Payroll stops being a debate.",
      },
      {
        t: "Local payments",
        d: "Companies pay by Telebirr, CBE, Abyssinia or Dashen bank transfer, priced per employee. Built for how Ethiopian companies actually pay.",
      },
    ],
    results: [],
    how: "A mobile-first web app on Supabase: PostgreSQL for attendance, leave and payroll records, storage for clock-in selfies, and a geofencing check using the Haversine formula on the phone's GPS reading.",
    device: "phone",
    live: "https://clocket.netlify.app",
    next: "evriel-inventory",
  },
};

/* Captured media per project. Develop EC is the real live site; the others
   are the systems' interfaces rendered with sample data (plan part 6),
   captured at real device sizes. */
const cap = (slug, f) => `/captures/${slug}/${f}`;

export const MEDIA = {
  "evriel-inventory": {
    video: cap("evriel-inventory", "demo.webm"),
    poster: cap("evriel-inventory", "dashboard.png"),
    shots: [
      { f: cap("evriel-inventory", "dashboard.png"), label: "The dashboard: stock, orders and invoices across all three stores" },
      { f: cap("evriel-inventory", "products.png"), label: "Every product with live quantities per store" },
      { f: cap("evriel-inventory", "invoice.png"), label: "A supplier invoice, matched to products automatically" },
      { f: cap("evriel-inventory", "orders.png"), label: "Purchase orders and what is arriving today" },
    ],
    featureShots: {
      "Live stock across three stores": { src: cap("evriel-inventory", "dashboard.png") },
      "Orders": { src: cap("evriel-inventory", "orders.png") },
      "Store transfers": { src: cap("evriel-inventory", "products.png") },
      "Fast invoice entry": { src: cap("evriel-inventory", "invoice.png") },
    },
  },
  "ag-project-monitor": {
    video: cap("ag-project-monitor", "demo.webm"),
    poster: cap("ag-project-monitor", "tasks.png"),
    phone: true,
    shots: [
      { f: cap("ag-project-monitor", "tasks.png"), label: "Open tasks, each born from a voice note or a site photo", phone: true },
      { f: cap("ag-project-monitor", "task.png"), label: "A voice note becomes a task with people, due date and location", phone: true },
      { f: cap("ag-project-monitor", "timeline.png"), label: "The project timeline: everything that happened, in order", phone: true },
    ],
    featureShots: {
      "Voice memo transcription": { src: cap("ag-project-monitor", "task.png"), phone: true },
      "Site photo intelligence": { src: cap("ag-project-monitor", "tasks.png"), phone: true },
      "Project timeline": { src: cap("ag-project-monitor", "timeline.png"), phone: true },
    },
  },
  /* developec.gr is live but currently serves a blank page (its JS bundle
     fails to download), so the real capture is pending until the hosting
     is fixed. Never substitute designed screens for a real public site. */
  "develop-ec": {
    video: null,
    poster: null,
    shots: [],
    featureShots: {},
  },
  tasktock: {
    video: cap("tasktock", "demo.webm"),
    poster: cap("tasktock", "today.png"),
    phone: true,
    shots: [
      { f: cap("tasktock", "today.png"), label: "Today: what is done, what is left", phone: true },
      { f: cap("tasktock", "inbox.png"), label: "Messages to the Telegram bot, already turned into tasks", phone: true },
    ],
    featureShots: {
      "The task app": { src: cap("tasktock", "today.png"), phone: true },
      "The Telegram bot": { src: cap("tasktock", "inbox.png"), phone: true },
    },
  },
  domainintel: {
    video: cap("domainintel", "demo.webm"),
    poster: cap("domainintel", "results.png"),
    shots: [
      { f: cap("domainintel", "results.png"), label: "A client brief matched by meaning, with a clear call per domain" },
    ],
    featureShots: {
      "Semantic search": { src: cap("domainintel", "results.png") },
    },
  },
  clocket: {
    video: cap("clocket", "demo.webm"),
    poster: cap("clocket", "app-clockin.png"),
    phone: true,
    shots: [
      { f: cap("clocket", "app-clockin.png"), label: "Clock-in with GPS and a selfie, checked against the office zone", phone: true },
      { f: cap("clocket", "admin-dashboard.png"), label: "The admin dashboard: live attendance and pending leave" },
      { f: cap("clocket", "admin-reports.png"), label: "Monthly reports with the salary deduction already calculated" },
      { f: cap("clocket", "app-working.png"), label: "The day running: verified clock-in and a live timer", phone: true },
    ],
    featureShots: {
      "GPS and selfie clock-in": { src: cap("clocket", "app-clockin.png"), phone: true },
      "Shifts and grace periods": { src: cap("clocket", "app-working.png"), phone: true },
      "Leave requests with a conversation": { src: cap("clocket", "admin-dashboard.png") },
      "Monthly reports and salary math": { src: cap("clocket", "admin-reports.png") },
    },
  },
};

export const PROJECT_ORDER = [
  "evriel-inventory",
  "ag-project-monitor",
  "develop-ec",
  "tasktock",
  "domainintel",
  "clocket",
];

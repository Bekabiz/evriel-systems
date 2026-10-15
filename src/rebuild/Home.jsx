/* The evrielsystems.com home page, identical in four languages. */

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  useReveal,
  Cta,
  BrandMark,
  Bezel,
  LaptopFrame,
  PhoneFrame,
  BrowserFrame,
  DemoMedia,
  Slot,
  initTilt,
  initCounters,
} from "./kit.jsx";
import { Nav, Footer } from "./shell.jsx";
import { PROJECTS, MEDIA, LOGOS } from "./projects.js";
import { ARTS } from "../content.js";
import { t, lang, withLang } from "./i18n/index.js";
import { setHead } from "./seo.js";
import "./tokens.css";
import "./home.css";

gsap.registerPlugin(ScrollTrigger);

function Hero() {
  return (
    <section className="hero" id="top">
      <div className="wrap">
        <div className="hero-field">
          <h1 className="t-hero hero-load hl-1">
            {t.hero.h1a}{" "}
            <br />
            {t.hero.h1b}
          </h1>
          <p className="hero-load hl-2">{t.hero.sub}</p>
          <div className="hero-load hl-3">
            <Cta href="#work">{t.hero.cta}</Cta>
          </div>
          <div className="hero-devices hero-load hl-4" aria-hidden="true">
            <div className="hero-laptop">
              <LaptopFrame bezel="var(--charcoal)">
                <DemoMedia
                  video={MEDIA["evriel-inventory"].video}
                  poster={MEDIA["evriel-inventory"].poster}
                  alt="Evriel Inventory running"
                />
              </LaptopFrame>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* The integrations list from the original site, with each brand's real
   colored mark. Wikimedia official assets cover what Simple Icons dropped. */
const wm = (f) => `https://upload.wikimedia.org/wikipedia/commons/${f}`;
const si = (slug) => `https://cdn.simpleicons.org/${slug}`;
const TOOLS_A = [
  ["Gmail", si("gmail")],
  ["Outlook", wm("4/45/Microsoft_Office_Outlook_%282018%E2%80%932024%29.svg")],
  ["Excel", wm("e/e3/Microsoft_Office_Excel_%282019%E2%80%932025%29.svg")],
  ["Google Sheets", si("googlesheets")],
  ["Slack", wm("d/d5/Slack_icon_2019.svg")],
  ["WhatsApp", si("whatsapp")],
  ["n8n", si("n8n")],
];
const TOOLS_B = [
  ["Supabase", si("supabase")],
  ["OpenAI", wm("e/ef/ChatGPT-Logo.svg")],
  ["Anthropic", si("anthropic")],
  ["Notion", si("notion")],
  ["Airtable", si("airtable")],
  ["Zapier", si("zapier")],
  ["Power BI", wm("c/cf/New_Power_BI_Logo.svg")],
];

function ToolRow({ tools, reverse }) {
  const chips = tools.map(([name, src]) => (
    <span key={name} className="tool-chip">
      <img src={src} alt={`${name} logo`} loading="lazy" />
      {name}
    </span>
  ));
  return (
    <div className="tool-row">
      <div className={`tool-track${reverse ? " tool-track-rev" : ""}`}>
        {chips}{chips}{chips}
      </div>
    </div>
  );
}

function Integrations() {
  return (
    <section className="tools">
      <div className="wrap reveal">
        <h2 className="section-h tools-h">{t.tools.h}</h2>
      </div>
      <div className="reveal">
        <ToolRow tools={TOOLS_A} />
        <ToolRow tools={TOOLS_B} reverse />
      </div>
    </section>
  );
}

function Opener() {
  return (
    <section className="opener" id="work">
      <div className="wrap reveal">
        <p>{t.opener}</p>
      </div>
    </section>
  );
}

function FeatureChips({ items }) {
  return (
    <div className="fchips">
      {items.map((f) => (
        <span key={f}>{f}</span>
      ))}
    </div>
  );
}

function InventorySection() {
  const c = t.rooms.inv;
  return (
    <section className="room-section">
      <div className="wrap">
        <div className="room room-inv reveal">
          <div className="room-copy">
            <div className="room-id">
              <BrandMark from="var(--inv)" to="var(--inv-deep)" glyph="inv" />
              <span className="label">Evriel Inventory</span>
            </div>
            <h2 className="t-card">{c.h}</h2>
            <p className="room-sub">{c.sub}</p>
            <FeatureChips items={c.chips} />
            <Cta href={withLang("/work/evriel-inventory")}>{t.rooms.view}</Cta>
            <div className="numbers">
              <div className="n"><b>39,000+</b><span>{c.numbers[0]}</span></div>
              <div className="n"><b>3</b><span>{c.numbers[1]}</span></div>
              <div className="n"><b>{c.minutes}</b><span>{c.numbers[2]}</span></div>
            </div>
          </div>
          <div className="room-stage parallax">
            <div className="glow glow-inv" />
            <Bezel>
              <LaptopFrame bezel="var(--charcoal)">
                <DemoMedia
                  video={MEDIA["evriel-inventory"].video}
                  poster={MEDIA["evriel-inventory"].poster}
                  alt="Evriel Inventory demo"
                />
              </LaptopFrame>
            </Bezel>
          </div>
        </div>
      </div>
    </section>
  );
}

function AGSection() {
  const c = t.rooms.ag;
  return (
    <section className="room-section">
      <div className="wrap">
        <div className="room room-ag room-flip reveal">
          <div className="room-stage room-stage-phone parallax">
            <div className="glow glow-ag" />
            <Bezel>
              <PhoneFrame bezel="var(--charcoal)">
                <DemoMedia
                  video={MEDIA["ag-project-monitor"].video}
                  poster={MEDIA["ag-project-monitor"].poster}
                  alt="AG Project Monitor demo"
                />
              </PhoneFrame>
            </Bezel>
          </div>
          <div className="room-copy">
            <div className="room-id">
              <BrandMark from="var(--ag)" to="var(--ag-deep)" glyph="ag" />
              <span className="label">AG Project Monitor</span>
            </div>
            <h2 className="t-card">{c.h}</h2>
            <p className="room-sub">{c.sub}</p>
            <FeatureChips items={c.chips} />
            <Cta href={withLang("/work/ag-project-monitor")}>{t.rooms.view}</Cta>
          </div>
        </div>
      </div>
    </section>
  );
}

function DevelopECSection() {
  const c = t.rooms.ec;
  return (
    <section className="room-section">
      <div className="wrap">
        <div className="room-dark reveal">
          <div className="room-id room-id-center">
            <BrandMark from="var(--ec)" to="var(--ec-deep)" glyph="ec" {...LOGOS["develop-ec"]} />
            <span className="label">Develop EC</span>
          </div>
          <h2 className="t-card">{c.h}</h2>
          <p className="room-sub">{c.sub}</p>
          <div className="room-dark-actions">
            <Cta href={withLang("/work/develop-ec")} className="cta-on-dark">{t.rooms.view}</Cta>
            <a href="https://developec.gr" target="_blank" rel="noreferrer" className="ec-live-link">
              {c.visit}
            </a>
          </div>
          <div className="room-stage parallax">
            <div className="glow glow-ec" />
            <Bezel dark>
              <BrowserFrame url="developec.gr">
                {MEDIA["develop-ec"].video ? (
                  <DemoMedia
                    video={MEDIA["develop-ec"].video}
                    poster={MEDIA["develop-ec"].poster}
                    alt="developec.gr live"
                  />
                ) : (
                  <Slot>{t.project.pending}</Slot>
                )}
              </BrowserFrame>
            </Bezel>
          </div>
        </div>
      </div>
    </section>
  );
}

const GRID_KEYS = ["tasktock", "domainintel", "clocket"];

function ProjectsGrid() {
  return (
    <section className="grid-section">
      <div className="wrap reveal">
        <h2 className="section-h">{t.grid.h}</h2>
        <div className="proj-grid">
          {GRID_KEYS.map((key, i) => {
            const p = PROJECTS[key];
            const c = t.projects[key];
            return (
              <a
                key={key}
                href={withLang(`/work/${p.slug}`)}
                className={`proj-tile tile-${p.theme}`}
                style={{ transitionDelay: `${i * 70}ms` }}
              >
                <span className={`tile-shot${MEDIA[key].phone ? " tile-shot-phone" : ""}`}>
                  <img src={MEDIA[key].poster} alt={`${p.name} screen`} loading="lazy" />
                </span>
                <BrandMark
                  from={`var(--${p.theme})`}
                  to={`var(--${p.theme}-deep)`}
                  glyph={p.theme}
                  {...(LOGOS[p.slug] || {})}
                  size={52}
                />
                <h3>{p.name}</h3>
                <p>{c.one}</p>
                <ul className="tile-feats">
                  {c.features.slice(0, 3).map((f) => (
                    <li key={f.t}>{f.t}</li>
                  ))}
                </ul>
                <span className="tile-link">
                  {t.rooms.view} <span aria-hidden="true">&#8599;</span>
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section className="services" id="services">
      <div className="wrap reveal">
        <h2 className="section-h">{t.services.h}</h2>
        <p className="section-sub">{t.services.sub}</p>
        <div className="svc-grid">
          {t.services.items.map((s) => (
            <div key={s.t} className="svc">
              <h3>{s.t}</h3>
              <p>{s.d}</p>
              <ul className="svc-list">
                {s.a.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <div className="svc-flow" aria-label={s.flow.join(", ")}>
                {s.flow.map((step) => (
                  <span key={step}>{step}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Industries() {
  return (
    <section className="industries">
      <div className="wrap reveal">
        <h2 className="section-h">{t.industries.h}</h2>
        <p className="section-sub">{t.industries.sub}</p>
        <div className="ind-chips">
          {t.industries.chips.map((i) => (
            <span key={i}>{i}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

function Process() {
  return (
    <section className="process" id="process">
      <div className="wrap reveal">
        <div className="process-inner">
          <h2 className="section-h">{t.process.h}</h2>
          <div className="steps-line" aria-hidden="true"><span /></div>
          <div className="steps">
            {t.process.steps.map((s) => (
              <div key={s.t} className="step">
                <h3>{s.t}</h3>
                <p>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="about" id="about">
      <div className="wrap reveal">
        <div className="about-panel">
          <div>
            <h2 className="section-h">{t.about.h}</h2>
            <div className="about-body">
              <p className="about-lead">{t.about.lead}</p>
              <p>{t.about.p1}</p>
              <p>{t.about.p2}</p>
            </div>
            <div className="about-countries">
              {t.about.countries.map((c) => (
                <span key={c}>{c}</span>
              ))}
            </div>
          </div>
          <div className="about-stats">
            <div className="about-stat"><b data-count="6"></b><span>{t.about.stats[0]}</span></div>
            <div className="about-stat"><b data-count="3"></b><span>{t.about.stats[1]}</span></div>
            <div className="about-stat"><b data-count="39,000" data-suffix="+"></b><span>{t.about.stats[2]}</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function localizedArticle(slug) {
  const base = ARTS.find((a) => a.slug === slug);
  if (!base) return null;
  if (lang === "en" || !t.articles) return base;
  const tr = t.articles[slug];
  return tr ? { ...base, ...tr } : base;
}

function Insights() {
  const latest = ARTS.slice(0, 3).map((a) => localizedArticle(a.slug));
  return (
    <section className="insights" id="insights">
      <div className="wrap reveal">
        <div className="insights-head">
          <h2 className="section-h">{t.insights.h}</h2>
          <a href={withLang("/insights")} className="text-link">{t.insights.all}</a>
        </div>
        <div className="art-grid">
          {latest.map((a) => (
            <a key={a.slug} href={withLang(`/insights/${a.slug}`)} className="art-card">
              <span className="art-tag">{a.tag}</span>
              <h3>{a.title}</h3>
              <p>{a.excerpt}</p>
              <span className="art-more">{t.insights.read}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function Trust() {
  return (
    <section className="trust">
      <div className="wrap reveal">
        <h2 className="section-h">{t.trust.h}</h2>
        <p className="section-sub">{t.trust.p}</p>
        <div className="trust-grid">
          {t.trust.cards.map((c) => (
            <div key={c.t} className="trust-item">
              <h3>{c.t}</h3>
              <p>{c.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ContactSection() {
  const [status, setStatus] = useState("idle");
  const [form, setForm] = useState({ name: "", email: "", company: "", challenge: "" });

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          company: form.company,
          email: form.email,
          phone: "",
          language: lang,
          industry: "",
          interests: [],
          challenge: form.challenge,
        }),
      });
      if (!res.ok) throw new Error("send failed");
      setStatus("ok");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="contact" id="contact">
      <div className="wrap reveal">
        <div className="contact-inner">
        <h2 className="section-h">{t.contact.h}</h2>
        <p className="contact-sub">
          {t.contact.sub1}{" "}
          <a href="mailto:contact@evrielsystems.com" className="text-link">
            contact@evrielsystems.com
          </a>
          {t.contact.sub2}
        </p>
        <div className="contact-grid">
          <div>
            {status === "ok" ? (
              <p className="form-ok">{t.contact.ok}</p>
            ) : (
              <form className="contact-form" onSubmit={submit}>
                <div className="form-row">
                  <div className="field">
                    <label htmlFor="cf-name">{t.contact.name}</label>
                    <input id="cf-name" required value={form.name} onChange={set("name")} autoComplete="name" />
                  </div>
                  <div className="field">
                    <label htmlFor="cf-email">{t.contact.email}</label>
                    <input id="cf-email" type="email" required value={form.email} onChange={set("email")} autoComplete="email" />
                  </div>
                </div>
                <div className="field">
                  <label htmlFor="cf-company">{t.contact.company} <span className="opt">{t.contact.optional}</span></label>
                  <input id="cf-company" value={form.company} onChange={set("company")} autoComplete="organization" />
                </div>
                <div className="field">
                  <label htmlFor="cf-msg">{t.contact.msg}</label>
                  <textarea id="cf-msg" rows={5} required value={form.challenge} onChange={set("challenge")} />
                </div>
                {status === "error" && <p className="form-err">{t.contact.err}</p>}
                <button type="submit" className="btn" disabled={status === "sending"}>
                  {status === "sending" ? t.contact.sending : t.contact.send}
                </button>
              </form>
            )}
          </div>
          <aside className="next-steps">
            <h3>{t.contact.nextH}</h3>
            <ol>
              {t.contact.next.map((s) => (
                <li key={s.t}>
                  <b>{s.t}</b>
                  <span>{s.d}</span>
                </li>
              ))}
            </ol>
          </aside>
        </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const rootRef = useRef(null);
  useReveal(rootRef);

  useEffect(() => {
    setHead({ title: t.meta.home.title, desc: t.meta.home.desc, path: "/" });
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const cleanTilt = initTilt(root, ".svc, .proj-tile, .feat, .art-card, .about-stat, .trust-item");
    const cleanCount = initCounters(root);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let ctx;
    if (!reduce) {
      ctx = gsap.context(() => {
        gsap.utils.toArray(".parallax").forEach((el) => {
          gsap.fromTo(
            el,
            { y: 16 },
            {
              y: -16,
              ease: "none",
              scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 1 },
            }
          );
        });
        gsap.utils.toArray(".bezel").forEach((el) => {
          gsap.from(el, {
            rotateX: 10, y: 48, opacity: 0,
            transformPerspective: 900, transformOrigin: "center bottom",
            duration: 1.1, ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 86%", once: true },
          });
        });
      }, rootRef);
    }
    return () => {
      cleanTilt();
      cleanCount();
      if (ctx) ctx.revert();
    };
  }, []);

  return (
    <div ref={rootRef}>
      <Nav />
      <main>
        <Hero />
        <Integrations />
        <Services />
        <About />
        <Opener />
        <InventorySection />
        <AGSection />
        <DevelopECSection />
        <ProjectsGrid />
        <Industries />
        <Process />
        <Insights />
        <Trust />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}

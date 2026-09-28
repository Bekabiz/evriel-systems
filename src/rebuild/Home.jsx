/* The new evrielsystems.com home page. White system, color rooms, and the
   content depth of the original site. Screens are honest labeled slots until
   the real captures land (plan part 6). */

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  useReveal,
  AmbientLight,
  Cta,
  BrandMark,
  Bezel,
  LaptopFrame,
  PhoneFrame,
  BrowserFrame,
  Slot,
} from "./kit.jsx";
import { Nav, Footer } from "./shell.jsx";
import { PROJECTS } from "./projects.js";
import { SVCS, INDS, TRUST, NEXT_STEPS, ARTS } from "../content.js";
import "./tokens.css";
import "./home.css";

gsap.registerPlugin(ScrollTrigger);

function Hero() {
  return (
    <section className="hero" id="top">
      <AmbientLight />
      <div className="wrap hero-inner">
        <h1 className="hero-load hl-1">
          We build the <span className="hero-grad">systems</span>
          <br />
          real companies run on.
        </h1>
        <p className="hero-load hl-2">
          Inventory for a retail group, task tracking for building sites,
          attendance for a workforce. Real software, in daily use, shown
          working on this page.
        </p>
        <div className="hero-load hl-3">
          <Cta href="#work" className="cta-ink">See the work</Cta>
        </div>
      </div>
    </section>
  );
}

function Opener() {
  return (
    <section className="opener" id="work">
      <div className="wrap reveal">
        <p>Systems in daily use in three countries.</p>
      </div>
    </section>
  );
}

function FeatureChips({ items, tone }) {
  return (
    <div className={`fchips fchips-${tone}`}>
      {items.map((f) => (
        <span key={f}>{f}</span>
      ))}
    </div>
  );
}

function InventorySection() {
  return (
    <section className="room-section">
      <div className="wrap">
        <div className="room room-inv reveal">
          <div className="room-copy">
            <div className="room-id">
              <BrandMark from="var(--inv)" to="var(--inv-deep)" initials="EI" />
              <span className="label" style={{ color: "var(--inv-deep)" }}>Evriel Inventory</span>
            </div>
            <h2>
              <span className="grad grad-inv">Inventory</span> that runs three stores.
            </h2>
            <p className="room-sub">
              One system for stock, orders, transfers and invoices, in daily use
              across a retail group in Greece. Three stores stopped keeping
              three versions of the truth.
            </p>
            <FeatureChips
              tone="inv"
              items={["Live stock", "Orders", "Store transfers", "Fast invoice entry"]}
            />
            <Cta href="/work/evriel-inventory" className="cta-inv">View project</Cta>
            <div className="numbers">
              <div className="n"><b>39,000+</b><span>products tracked</span></div>
              <div className="n"><b>3</b><span>stores connected</span></div>
              <div className="n"><b>40 to 5 min</b><span>invoice entry time</span></div>
            </div>
          </div>
          <div className="room-stage parallax">
            <div className="glow glow-inv" />
            <Bezel>
              <LaptopFrame bezel="var(--inv-deep)">
                <Slot>Real demo video plays here</Slot>
              </LaptopFrame>
            </Bezel>
          </div>
        </div>
      </div>
    </section>
  );
}

function AGSection() {
  return (
    <section className="room-section">
      <div className="wrap">
        <div className="room room-ag room-flip reveal">
          <div className="room-stage room-stage-phone parallax">
            <div className="glow glow-ag" />
            <Bezel>
              <PhoneFrame bezel="var(--ag-deep)">
                <Slot>Vertical demo plays here</Slot>
              </PhoneFrame>
            </Bezel>
          </div>
          <div className="room-copy">
            <div className="room-id">
              <BrandMark from="var(--ag)" to="var(--ag-grad-b)" initials="AG" />
              <span className="label" style={{ color: "var(--ag-grad-b)" }}>AG Project Monitor</span>
            </div>
            <h2>
              Tasks that start as a <span className="grad grad-ag">voice note</span>.
            </h2>
            <p className="room-sub">
              A site engineer speaks into a phone. The system transcribes the
              note, writes the task, attaches the photos and notifies the right
              people. The whole project lives on one timeline.
            </p>
            <FeatureChips
              tone="ag"
              items={["Voice transcription", "Site photos", "Project timeline", "AI reports"]}
            />
            <Cta href="/work/ag-project-monitor" className="cta-ag">View project</Cta>
          </div>
        </div>
      </div>
    </section>
  );
}

function DevelopECSection() {
  return (
    <section className="room-section">
      <div className="wrap">
        <div className="room-dark reveal">
          <div className="room-id room-id-center">
            <BrandMark from="var(--ec)" to="var(--ec-deep)" initials="EC" />
            <span className="label" style={{ color: "var(--ec-on-dark)" }}>Develop EC</span>
          </div>
          <h2>
            Architecture in <span className="grad grad-ec">black and white</span>.
          </h2>
          <p className="room-sub">
            The public site of a Greek property developer. Calm pages, real
            photography and a warm copper accent. The buildings carry the
            design, the site stays out of their way.
          </p>
          <div className="room-dark-actions">
            <Cta href="/work/develop-ec" className="cta-white">View project</Cta>
            <a href="https://developec.gr" target="_blank" rel="noreferrer" className="ec-live-link">
              Visit developec.gr
            </a>
          </div>
          <div className="room-stage parallax">
            <div className="glow glow-ec" />
            <Bezel dark>
              <BrowserFrame url="developec.gr">
                <Slot>Screen recording of developec.gr plays here</Slot>
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
        <h2 className="section-h">And three more.</h2>
        <div className="proj-grid">
          {GRID_KEYS.map((key, i) => {
            const p = PROJECTS[key];
            return (
              <a
                key={key}
                href={`/work/${p.slug}`}
                className={`proj-tile tile-${p.theme}`}
                style={{ transitionDelay: `${i * 70}ms` }}
              >
                <BrandMark
                  from={`var(--${p.theme})`}
                  to={`var(--${p.theme}-deep)`}
                  initials={p.initials}
                  size={52}
                />
                <h3 className={`grad grad-${p.theme}`}>{p.name}</h3>
                <p>{p.one}</p>
                <ul className="tile-feats">
                  {p.features.slice(0, 3).map((f) => (
                    <li key={f.t}>{f.t}</li>
                  ))}
                </ul>
                <span className={`tile-link tile-link-${p.theme}`}>
                  View project <span aria-hidden="true">&#8599;</span>
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
        <h2 className="section-h">What we do</h2>
        <p className="section-sub">
          Four kinds of work, one approach: understand the operation first,
          then build the system around it.
        </p>
        <div className="svc-grid">
          {SVCS.map((s) => (
            <div key={s.t} className="svc">
              <h3>{s.t}</h3>
              <p>{s.d}</p>
              <ul className="svc-list">
                {s.a.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <div className="svc-flow" aria-label={`Flow: ${s.flow.join(", then ")}`}>
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
        <h2 className="section-h">Where we work</h2>
        <p className="section-sub">
          The tools change per industry. The problems rarely do: disconnected
          information, repetitive work, slow decisions.
        </p>
        <div className="ind-chips">
          {INDS.map((i) => (
            <span key={i.short} title={i.desc}>{i.short}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

const STEPS = [
  { t: "Understand", d: "We sit with your team and learn how the work actually flows: objectives, bottlenecks and the workarounds nobody wrote down." },
  { t: "Build and show", d: "You see the system early and often, not only at the end. Feedback lands while it is still cheap to act on." },
  { t: "Hand over", d: "Training, documentation and a clean handover to your people. The system belongs to you, not to us." },
  { t: "Stay close", d: "We keep improving performance, usability and automation as the system grows with your operation." },
];

function Process() {
  return (
    <section className="process band" id="process">
      <div className="wrap reveal">
        <h2 className="section-h">How we work</h2>
        <div className="steps-line" aria-hidden="true"><span /></div>
        <div className="steps">
          {STEPS.map((s) => (
            <div key={s.t} className="step">
              <h3>{s.t}</h3>
              <p>{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="about" id="about">
      <div className="wrap reveal">
        <h2 className="section-h">About Evriel</h2>
        <div className="about-body">
          <p className="about-lead">
            No two organizations operate the same way, which is why effective
            systems must be built around real operational needs rather than
            one-size-fits-all technology.
          </p>
          <p>
            Evriel Systems was founded by Bereket Bizuayehu Teshome and was
            shaped by his work across business, marketing, European projects
            and digital transformation in Poland, Spain, Italy and Greece.
            Across all of it, one challenge kept repeating: organizations
            struggle to turn new technology into practical business value.
          </p>
          <p>
            Technologies change fast. The underlying problems rarely do:
            disconnected information, inefficient workflows and missed chances
            to decide better. Evriel Systems exists to close that gap, with AI,
            automation and intelligent systems that connect people, processes,
            information and technology.
          </p>
          <p>
            Every system on this page is in real use today. That is the whole
            portfolio argument: if they run these operations, they can build
            yours.
          </p>
        </div>
      </div>
    </section>
  );
}

function Insights() {
  const latest = ARTS.slice(0, 3);
  return (
    <section className="insights" id="insights">
      <div className="wrap reveal">
        <div className="insights-head">
          <h2 className="section-h">Insights</h2>
          <a href="/insights" className="text-link">All articles</a>
        </div>
        <div className="art-grid">
          {latest.map((a) => (
            <a key={a.slug} href={`/insights/${a.slug}`} className="art-card">
              <span className="art-tag">{a.tag}</span>
              <h3>{a.title}</h3>
              <p>{a.excerpt}</p>
              <span className="art-more">Read article</span>
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
        <h2 className="section-h">Your data remains yours</h2>
        <p className="section-sub">{TRUST.p}</p>
        <div className="trust-grid">
          {TRUST.cards.map((c) => (
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
          language: "",
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
    <section className="contact band" id="contact">
      <div className="wrap reveal">
        <h2 className="section-h">Start a project</h2>
        <p className="contact-sub">
          Tell us what you are building, or write directly to{" "}
          <a href="mailto:contact@evrielsystems.com" className="text-link">
            contact@evrielsystems.com
          </a>
          . We personally read every inquiry.
        </p>
        <div className="contact-grid">
          <div>
            {status === "ok" ? (
              <p className="form-ok">
                Thank you. Your message is in, and we reply within 24 hours.
              </p>
            ) : (
              <form className="contact-form" onSubmit={submit}>
                <div className="form-row">
                  <div className="field">
                    <label htmlFor="cf-name">Name</label>
                    <input id="cf-name" required value={form.name} onChange={set("name")} autoComplete="name" />
                  </div>
                  <div className="field">
                    <label htmlFor="cf-email">Email</label>
                    <input id="cf-email" type="email" required value={form.email} onChange={set("email")} autoComplete="email" />
                  </div>
                </div>
                <div className="field">
                  <label htmlFor="cf-company">Company <span className="opt">optional</span></label>
                  <input id="cf-company" value={form.company} onChange={set("company")} autoComplete="organization" />
                </div>
                <div className="field">
                  <label htmlFor="cf-msg">Tell us about the work</label>
                  <textarea id="cf-msg" rows={5} required value={form.challenge} onChange={set("challenge")} />
                </div>
                {status === "error" && (
                  <p className="form-err">
                    That did not go through. Please try again, or email contact@evrielsystems.com.
                  </p>
                )}
                <button type="submit" className="btn btn-ink" disabled={status === "sending"}>
                  {status === "sending" ? "Sending..." : "Send message"}
                </button>
              </form>
            )}
          </div>
          <aside className="next-steps">
            <h3>What happens next</h3>
            <ol>
              {NEXT_STEPS.map((s) => (
                <li key={s.t}>
                  <b>{s.t}</b>
                  <span>{s.d}</span>
                </li>
              ))}
            </ol>
          </aside>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const rootRef = useRef(null);
  useReveal(rootRef);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const ctx = gsap.context(() => {
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
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef}>
      <Nav />
      <main>
        <Hero />
        <Opener />
        <InventorySection />
        <AGSection />
        <DevelopECSection />
        <ProjectsGrid />
        <Services />
        <Industries />
        <Process />
        <About />
        <Insights />
        <Trust />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}

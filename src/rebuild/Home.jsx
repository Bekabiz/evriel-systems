/* The new evrielsystems.com home page. REBUILD-PLAN.md part 4, built one
   section at a time on the white system. Screens and demo videos are honest
   labeled slots until the real captures land (plan part 6). */

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Menu, X, Workflow, BarChart3, Boxes, TrendingUp } from "lucide-react";
import {
  useReveal,
  AmbientLight,
  BrandMark,
  LaptopFrame,
  PhoneFrame,
  BrowserFrame,
  Slot,
} from "./kit.jsx";
import { ARTS } from "../content.js";
import "./tokens.css";
import "./home.css";

gsap.registerPlugin(ScrollTrigger);

const NAV_LINKS = [
  { label: "Work", href: "#work" },
  { label: "Services", href: "#services" },
  { label: "Process", href: "#process" },
  { label: "About", href: "#about" },
  { label: "Insights", href: "#insights" },
];

function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="nav">
      <div className="wrap nav-bar">
        <a href="#top" className="nav-logo" aria-label="Evriel Systems, back to top">
          <img src="/logo.svg" alt="Evriel Systems" />
        </a>
        <nav className="nav-links" aria-label="Main">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href}>{l.label}</a>
          ))}
        </nav>
        <a href="#contact" className="btn btn-ink nav-cta">Start a project</a>
        <button
          className="nav-burger"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
        </button>
      </div>
      {open && (
        <div className="nav-sheet">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}>{l.label}</a>
          ))}
          <a href="#contact" className="btn btn-ink" onClick={() => setOpen(false)}>
            Start a project
          </a>
        </div>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section className="hero" id="top">
      <AmbientLight />
      <div className="wrap hero-inner reveal">
        <h1>
          We build the <span className="hero-grad">systems</span>
          <br />
          real companies run on.
        </h1>
        <p>Software built for real operations, shown here with real screens and real numbers.</p>
        <a href="#work" className="btn btn-ink">See the work</a>
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
              across a retail group in Greece.
            </p>
            <a href="/work/evriel-inventory" className="btn room-btn-inv">View project</a>
            <div className="numbers">
              <div className="n"><b>39,000+</b><span>products tracked</span></div>
              <div className="n"><b>3</b><span>stores connected</span></div>
              <div className="n"><b>40 to 5 min</b><span>invoice entry time</span></div>
            </div>
          </div>
          <div className="room-stage parallax">
            <div className="glow glow-inv" />
            <LaptopFrame bezel="var(--inv-deep)">
              <Slot>Real demo video plays here</Slot>
            </LaptopFrame>
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
            <PhoneFrame bezel="var(--ag-deep)">
              <Slot>Vertical demo plays here</Slot>
            </PhoneFrame>
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
              A site engineer speaks into a phone. The system writes the task,
              attaches photos and notifies the right people.
            </p>
            <a href="/work/ag-project-monitor" className="btn room-btn-ag">View project</a>
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
            photography and a warm copper accent.
          </p>
          <div className="room-dark-actions">
            <a href="/work/develop-ec" className="btn room-btn-ec">View project</a>
            <a
              href="https://developec.gr"
              target="_blank"
              rel="noreferrer"
              className="ec-live-link"
            >
              Visit developec.gr
            </a>
          </div>
          <div className="room-stage parallax">
            <div className="glow glow-ec" />
            <BrowserFrame url="developec.gr">
              <Slot>Screen recording of developec.gr plays here</Slot>
            </BrowserFrame>
          </div>
        </div>
      </div>
    </section>
  );
}

const GRID_PROJECTS = [
  {
    key: "tt",
    name: "TaskTock",
    line: "A task app with a Telegram bot at its side.",
    href: "/work/tasktock",
    initials: "TT",
    from: "var(--tt)",
    to: "var(--tt-deep)",
  },
  {
    key: "di",
    name: "DomainIntel",
    line: "Domain research with clear buy, review or avoid calls.",
    href: "/work/domainintel",
    initials: "DI",
    from: "var(--di)",
    to: "var(--di-deep)",
  },
  {
    key: "ck",
    name: "ClockET",
    line: "Workforce attendance for Ethiopian companies, with GPS and a selfie.",
    href: "/work/clocket",
    initials: "CK",
    from: "var(--ck)",
    to: "var(--ck-deep)",
  },
];

function ProjectsGrid() {
  return (
    <section className="grid-section">
      <div className="wrap reveal">
        <h2 className="section-h">And three more.</h2>
        <div className="proj-grid">
          {GRID_PROJECTS.map((p) => (
            <a key={p.key} href={p.href} className={`proj-tile tile-${p.key}`}>
              <BrandMark from={p.from} to={p.to} initials={p.initials} size={52} />
              <h3 className={`grad grad-${p.key}`}>{p.name}</h3>
              <p>{p.line}</p>
              <span className={`tile-link tile-link-${p.key}`}>View project</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

const SERVICES = [
  {
    icon: Workflow,
    t: "AI Automation",
    d: "Reduce repetitive work and improve operational efficiency through intelligent automation.",
  },
  {
    icon: BarChart3,
    t: "Business Intelligence",
    d: "Transform business information into actionable insights.",
  },
  {
    icon: Boxes,
    t: "Intelligent Systems",
    d: "Custom-built solutions designed around the unique needs of each organization.",
  },
  {
    icon: TrendingUp,
    t: "Digital Transformation",
    d: "Support organizations as they modernize operations and adopt emerging technologies.",
  },
];

function Services() {
  return (
    <section className="services" id="services">
      <div className="wrap reveal">
        <h2 className="section-h">What we do</h2>
        <div className="svc-grid">
          {SERVICES.map((s) => (
            <div key={s.t} className="svc">
              <s.icon size={26} strokeWidth={1.5} color="var(--teal)" aria-hidden="true" />
              <h3>{s.t}</h3>
              <p>{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const STEPS = [
  { t: "Understand", d: "We sit with your team and learn how the work actually flows." },
  { t: "Build and show", d: "You see the system early and often, not only at the end." },
  { t: "Hand over", d: "Training, documentation and a clean handover to your people." },
  { t: "Stay close", d: "We stay available as the system grows with you." },
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
          <p>
            Evriel Systems is the studio of Bereket Bizuayehu Teshome. Before
            founding it, he worked across business, marketing and European
            projects in Poland, Spain, Italy and Greece.
          </p>
          <p>
            One lesson kept repeating: companies do not need more technology.
            They need systems built around how they actually work. That is what
            Evriel builds, and every system on this page is in real use today.
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
        <h2 className="section-h">Insights</h2>
        <div className="art-grid">
          {latest.map((a) => (
            <a key={a.slug} href={`/insights/${a.slug}`} className="art-card">
              <span className="art-tag">{a.tag}</span>
              <h3>{a.title}</h3>
              <p>{a.excerpt}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
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
          . We reply within 24 hours.
        </p>
        {status === "ok" ? (
          <p className="form-ok">Thank you. Your message is in, and we reply within 24 hours.</p>
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
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <img src="/logo.svg" alt="Evriel Systems" className="footer-logo" />
        <nav className="footer-links" aria-label="Footer">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href}>{l.label}</a>
          ))}
          <a href="#contact">Contact</a>
        </nav>
        <p className="footer-founder">Founded by Bereket Bizuayehu Teshome</p>
        <p className="footer-legal">
          &copy; {new Date().getFullYear()} Evriel Systems. contact@evrielsystems.com
        </p>
      </div>
    </footer>
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
        <Process />
        <About />
        <Insights />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

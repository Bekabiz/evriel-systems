import { useState, useEffect, useRef, useCallback } from "react";
import { Mail, Linkedin, ArrowRight, ArrowUpRight, ChevronDown, ChevronUp, MapPin, Calendar, ArrowLeft, Cpu, GitBranch, Layers, Zap, Target, Search, BarChart3, Shield, Globe, Users, ExternalLink, Minus, Plus } from "lucide-react";

const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";
const SMOOTH = "cubic-bezier(0.45, 0, 0.15, 1)";

function useReveal(threshold = 0.1) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.unobserve(el); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function useParallax(speed = 0.05) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf;
    const onScroll = () => {
      raf = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const center = rect.top + rect.height / 2 - window.innerHeight / 2;
        el.style.transform = `translate3d(0, ${center * speed}px, 0)`;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, [speed]);
  return ref;
}

function useSmoothCounter(target, duration = 2200, active = false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 4);
      setVal(Math.round(eased * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, active]);
  return val;
}

function useCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [hovering, setHovering] = useState(false);
  useEffect(() => {
    const move = (e) => setPos({ x: e.clientX, y: e.clientY });
    const over = (e) => { if (e.target.closest("[data-cursor]")) setHovering(true); };
    const out = (e) => { if (e.target.closest("[data-cursor]")) setHovering(false); };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    window.addEventListener("mouseout", out);
    return () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseover", over); window.removeEventListener("mouseout", out); };
  }, []);
  return { pos, hovering };
}

function Reveal({ children, className = "", delay = 0, direction = "up" }) {
  const [ref, visible] = useReveal(0.08);
  const t = { up: "translateY(60px)", down: "translateY(-60px)", left: "translateX(60px)", right: "translateX(-60px)", scale: "scale(0.97)" };
  return (
    <div ref={ref} className={className} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translate3d(0,0,0) scale(1)" : t[direction],
      transition: `opacity 1.1s ${EASE} ${delay}ms, transform 1.1s ${EASE} ${delay}ms`,
    }}>{children}</div>
  );
}

function Stagger({ children, className = "", delay = 80 }) {
  const [ref, visible] = useReveal(0.06);
  return (
    <div ref={ref} className={className}>
      {Array.isArray(children) ? children.map((child, i) => (
        <div key={i} style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(50px)",
          transition: `opacity 1s ${EASE} ${i * delay}ms, transform 1s ${EASE} ${i * delay}ms`
        }}>{child}</div>
      )) : children}
    </div>
  );
}

function TextReveal({ children, className = "", delay = 0 }) {
  const [ref, visible] = useReveal(0.1);
  return (
    <div ref={ref} className={className} style={{ overflow: "hidden" }}>
      <div style={{
        transform: visible ? "translateY(0)" : "translateY(110%)",
        transition: `transform 1s ${EASE} ${delay}ms`,
      }}>{children}</div>
    </div>
  );
}

function LineReveal({ delay = 0 }) {
  const [ref, visible] = useReveal(0.1);
  return (
    <div ref={ref} style={{ overflow: "hidden" }}>
      <div style={{
        height: 1,
        background: "var(--border)",
        transform: visible ? "scaleX(1)" : "scaleX(0)",
        transformOrigin: "left",
        transition: `transform 1.2s ${EASE} ${delay}ms`,
      }} />
    </div>
  );
}

const LogoMark = ({ size = 32, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 4L6 14.5V33.5L24 44L42 33.5V14.5L24 4Z" stroke={color} strokeWidth="1" strokeLinejoin="round" />
    <path d="M24 14L14 19.5V30.5L24 36L34 30.5V19.5L24 14Z" stroke={color} strokeWidth="0.7" strokeLinejoin="round" />
    <line x1="24" y1="4" x2="24" y2="14" stroke={color} strokeWidth="0.5" opacity="0.4" />
    <line x1="42" y1="14.5" x2="34" y2="19.5" stroke={color} strokeWidth="0.5" opacity="0.4" />
    <line x1="42" y1="33.5" x2="34" y2="30.5" stroke={color} strokeWidth="0.5" opacity="0.4" />
    <line x1="24" y1="44" x2="24" y2="36" stroke={color} strokeWidth="0.5" opacity="0.4" />
    <line x1="6" y1="33.5" x2="14" y2="30.5" stroke={color} strokeWidth="0.5" opacity="0.4" />
    <line x1="6" y1="14.5" x2="14" y2="19.5" stroke={color} strokeWidth="0.5" opacity="0.4" />
    <circle cx="24" cy="4" r="2" fill={color} />
    <circle cx="42" cy="14.5" r="2" fill={color} />
    <circle cx="42" cy="33.5" r="2" fill={color} />
    <circle cx="24" cy="44" r="2" fill={color} />
    <circle cx="6" cy="33.5" r="2" fill={color} />
    <circle cx="6" cy="14.5" r="2" fill={color} />
    <circle cx="24" cy="25" r="2.5" fill={color} opacity="0.3" />
  </svg>
);

function Section({ id, children, className = "" }) {
  return <section id={id} className={`ev-section ${className}`}>{children}</section>;
}

function SectionNumber({ n }) {
  return <span className="ev-section-num">{n}</span>;
}

/* ═══════════════ NAVBAR ═══════════════ */
function Nav({ page, setPage }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const goPage = (p) => { setPage(p); setMobileOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const goSection = (id) => {
    setMobileOpen(false);
    if (page !== "home") {
      setPage("home");
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 200);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const links = [
    { label: "About", action: () => goSection("about") },
    { label: "Services", action: () => goPage("services"), active: page === "services" },
    { label: "Work", action: () => goSection("work") },
    { label: "Insights", action: () => goPage("insights"), active: page === "insights" },
    { label: "Experience", action: () => goSection("experience") },
  ];

  return (
    <nav className={`ev-nav${scrolled ? " ev-nav--scrolled" : ""}`}>
      <div className="ev-nav-inner">
        <a onClick={() => goPage("home")} className="ev-logo" style={{ cursor: "pointer" }} data-cursor>
          <LogoMark size={22} />
          <div className="ev-logo-text">
            <span className="ev-logo-name">EVRIEL</span>
            <span className="ev-logo-sub">SYSTEMS</span>
          </div>
        </a>

        <div className="ev-nav-links">
          {links.map((l) => (
            <a key={l.label} onClick={l.action} className={`ev-nav-link${l.active ? " active" : ""}`} data-cursor>{l.label}</a>
          ))}
        </div>

        <a onClick={() => goSection("contact")} className="ev-nav-cta" data-cursor>
          Contact
        </a>

        <button className="ev-mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
          <span className={mobileOpen ? "open" : ""} />
          <span className={mobileOpen ? "open" : ""} />
        </button>
      </div>

      <div className={`ev-mobile-menu${mobileOpen ? " open" : ""}`}>
        {[...links, { label: "Contact", action: () => goSection("contact") }].map((l) => (
          <a key={l.label} onClick={l.action} className="ev-mobile-link">{l.label}</a>
        ))}
      </div>
    </nav>
  );
}

/* ═══════════════ HERO ═══════════════ */
function Hero() {
  const [entered, setEntered] = useState(false);
  const parallaxRef = useParallax(0.03);

  useEffect(() => { setTimeout(() => setEntered(true), 200); }, []);

  return (
    <section id="hero" className="ev-hero">
      <div className="ev-hero-bg" ref={parallaxRef}>
        <LogoMark size={320} color="rgba(0,0,0,0.03)" />
      </div>

      <div className={`ev-hero-content${entered ? " entered" : ""}`}>
        <div className="ev-hero-eyebrow">
          <div className="ev-hero-dot" />
          <span>AI Systems Integrator</span>
        </div>

        <h1 className="ev-h1">
          <span className="ev-h1-main">Evriel</span>
          <span className="ev-h1-sub">systems</span>
        </h1>

        <p className="ev-hero-tagline">Connecting Intelligence with Business</p>

        <p className="ev-hero-desc">
          We help businesses identify opportunities, streamline operations, and deploy
          practical AI systems that create measurable business value.
        </p>

        <div className="ev-hero-actions">
          <a href="#work" className="ev-btn ev-btn--dark" data-cursor>
            View Our Work <ArrowRight size={14} strokeWidth={1.5} />
          </a>
          <a href="#contact" className="ev-btn ev-btn--ghost" data-cursor>
            Get in Touch
          </a>
        </div>
      </div>

      <div className={`ev-hero-bottom${entered ? " entered" : ""}`}>
        <div className="ev-hero-line" />
        <div className="ev-hero-scroll">
          <span>Scroll</span>
          <div className="ev-scroll-bar"><div className="ev-scroll-progress" /></div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════ MARQUEE ═══════════════ */
function Marquee() {
  const items = ["AI Integration", "Workflow Automation", "Custom Systems", "Digital Transformation", "Business Strategy", "Intelligent Tools", "Process Design", "Operations"];
  return (
    <div className="ev-marquee-wrap">
      <div className="ev-marquee-track">
        {[0, 1].map(k => (
          <div key={k} className="ev-marquee-inner">
            {items.map((t, i) => (
              <span key={i} className="ev-marquee-item">{t}<span className="ev-marquee-sep">/</span></span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════ ABOUT ═══════════════ */
function About() {
  const [ref, visible] = useReveal();
  const stat1 = useSmoothCounter(4, 2000, visible);

  return (
    <Section id="about">
      <div className="ev-about-top">
        <Reveal>
          <SectionNumber n="01" />
          <h2 className="ev-heading-lg">Most businesses don't have an AI problem</h2>
        </Reveal>
      </div>

      <div className="ev-about-grid">
        <Reveal delay={100}>
          <p className="ev-body-lg">They have an operations problem.</p>
        </Reveal>
        <Reveal delay={200}>
          <p className="ev-body">Information is scattered. Processes are manual. Teams spend hours on repetitive tasks. Decisions rely on disconnected systems.</p>
          <p className="ev-body ev-body--muted">Evriel Systems helps businesses identify where technology can create measurable value, then designs practical solutions that solve those problems. From AI-powered workflows and intelligent automation to custom internal platforms and digital transformation initiatives, every solution is built around one goal: creating real business outcomes.</p>
          <p className="ev-body ev-body--muted">Founded by Bereket Teshome, Evriel Systems operates at the intersection of artificial intelligence, operations, and business strategy, helping organizations transform complexity into clarity.</p>
        </Reveal>
      </div>

      <LineReveal delay={100} />

      <div ref={ref} className="ev-stats">
        <Reveal delay={0}>
          <div className="ev-stat">
            <span className="ev-stat-value">Multiple</span>
            <span className="ev-stat-label">AI Products in Production</span>
          </div>
        </Reveal>
        <Reveal delay={100}>
          <div className="ev-stat">
            <span className="ev-stat-value">{stat1}+</span>
            <span className="ev-stat-label">Countries</span>
          </div>
        </Reveal>
        <Reveal delay={200}>
          <div className="ev-stat">
            <span className="ev-stat-value">Real</span>
            <span className="ev-stat-label">Clients, Real Systems</span>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

/* ═══════════════ PROCESS ═══════════════ */
function Process() {
  const steps = [
    { n: "01", t: "Business Discovery", d: "We begin by understanding how your business operates, how decisions are made, and where time and resources are being lost." },
    { n: "02", t: "Opportunity Mapping", d: "We identify operational bottlenecks, communication gaps, repetitive tasks, and areas where technology can create measurable value." },
    { n: "03", t: "Solution Design", d: "Not every challenge requires AI. Sometimes the answer is a better workflow. Sometimes it is automation. Sometimes it is a custom platform." },
    { n: "04", t: "Build & Deploy", d: "We implement practical systems that work within your business rather than forcing your business to adapt to the technology." },
    { n: "05", t: "Continuous Improvement", d: "We measure results, optimize performance, and evolve systems as your business grows." },
  ];

  return (
    <Section id="process">
      <Reveal>
        <SectionNumber n="02" />
        <h2 className="ev-heading-lg">How we work</h2>
      </Reveal>

      <div className="ev-steps">
        {steps.map((s, i) => (
          <Reveal key={i} delay={i * 60}>
            <div className="ev-step">
              <span className="ev-step-num">{s.n}</span>
              <div className="ev-step-body">
                <h3 className="ev-step-title">{s.t}</h3>
                <p className="ev-step-desc">{s.d}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ═══════════════ SERVICES (Home) ═══════════════ */
const serviceData = [
  { t: "AI Integration", d: "We identify where AI can create measurable value and integrate intelligent systems directly into existing business operations.", tg: ["AI", "Automation", "APIs"] },
  { t: "Workflow Automation", d: "We eliminate repetitive tasks, reduce operational friction, and build workflows that scale.", tg: ["Workflow", "Efficiency", "Systems"] },
  { t: "Custom AI Systems", d: "Every business is different. We design and deploy custom AI tools tailored to specific operational needs, processes, and goals.", tg: ["Custom Tools", "Platforms", "SaaS"] },
  { t: "Digital Transformation", d: "We help businesses modernize their online presence, communication systems, recruitment processes, and internal operations.", tg: ["LinkedIn", "Web", "Content", "Recruitment"] },
];

function ServicesHome({ setPage }) {
  return (
    <Section id="services">
      <div className="ev-services-header">
        <Reveal>
          <SectionNumber n="03" />
          <h2 className="ev-heading-lg">What we do</h2>
        </Reveal>
        <Reveal delay={100}>
          <a onClick={() => { setPage("services"); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="ev-text-link" style={{ cursor: "pointer" }} data-cursor>
            All Services <ArrowRight size={12} strokeWidth={1.5} />
          </a>
        </Reveal>
      </div>

      <div className="ev-services-list">
        {serviceData.map((s, i) => (
          <Reveal key={i} delay={i * 80}>
            <div className="ev-service-row" data-cursor>
              <div className="ev-service-row-num">0{i + 1}</div>
              <div className="ev-service-row-content">
                <h3 className="ev-service-row-title">{s.t}</h3>
                <p className="ev-service-row-desc">{s.d}</p>
              </div>
              <div className="ev-service-row-tags">
                {s.tg.map((t, j) => <span key={j} className="ev-tag">{t}</span>)}
              </div>
              <ArrowUpRight size={16} strokeWidth={1} className="ev-service-row-arrow" />
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ═══════════════ CASE STUDIES ═══════════════ */
const cases = [
  { tag: "AI Business Integration", title: "Adamopoulos and Partners", hook: "From zero digital presence to AI-powered operations in 2 months.", ch: "A Greek civil engineering firm running entirely on manual email, no LinkedIn, no working website, no digital systems.", sol: "Built an AI email system that reads, classifies into 9 categories, scores urgency, drafts professional replies in Greek, and lets the owner approve, edit, and send from a simple dashboard. Then designed a 5-module digital transformation plan covering LinkedIn, recruitment, website, and business development.", res: ["9-category AI classification with urgency scoring", "Auto-drafted professional replies in Greek", "Running cost under 5 euros per month", "LinkedIn strategy in a region with zero competitor presence", "Pan-European recruitment campaign for technical hires"] },
  { tag: "AI SaaS Product", title: "DomainIntel", hook: "AI-powered domain intelligence for the $15B+ SEO industry.", ch: "SEO professionals spend hours evaluating websites, comparing opportunities, analyzing relevance, and identifying the best domains for outreach, content placement, and link acquisition.", sol: "Built a domain intelligence platform that analyzes, compares, and qualifies domains while providing contextual insights into why a website is a strong opportunity. Covers domain discovery, domain qualification, SEO intelligence, opportunity discovery, and decision support.", res: ["AI-powered domain qualification", "Opportunity discovery engine", "Context-aware recommendations", "SEO workflow acceleration", "Decision-support system for agencies"] },
  { tag: "SaaS Product", title: "ClockET", hook: "Workforce management with GPS verification and mobile payments.", ch: "Companies struggle to track attendance, workforce activity, and operational compliance across multiple locations.", sol: "Built a workforce management platform featuring GPS verification, selfie authentication, workforce analytics, payroll integrations, and administrative controls.", res: ["GPS attendance verification", "Selfie authentication", "Workforce analytics dashboard", "Mobile payment integration", "Real-world beta deployment"] },
  { tag: "AI Tool — B2B", title: "Domain Qualification Agent", hook: "AI that scores domains in seconds, not hours.", ch: "Content marketing teams manually review dozens of domains per client brief. Slow and inconsistent.", sol: "Built an AI-powered scoring tool that evaluates domains against client briefs automatically, with toxic content detection and category matching.", res: ["Automated domain scoring system", "Toxic content flagging", "Deployed in production at a European B2B content marketing platform"] },
];

function CaseCard({ cs, i }) {
  const [open, setOpen] = useState(false);

  return (
    <Reveal delay={i * 60}>
      <div className={`ev-case${open ? " ev-case--open" : ""}`} onClick={() => setOpen(!open)} style={{ cursor: "pointer" }} data-cursor>
        <div className="ev-case-header">
          <div className="ev-case-left">
            <span className="ev-case-tag">{cs.tag}</span>
            <h3 className="ev-case-title">{cs.title}</h3>
          </div>
          <div className="ev-case-right">
            <p className="ev-case-hook">{cs.hook}</p>
            <div className="ev-case-toggle">
              {open ? <Minus size={16} strokeWidth={1} /> : <Plus size={16} strokeWidth={1} />}
            </div>
          </div>
        </div>
        <div className={`ev-case-body${open ? " open" : ""}`}>
          <div className="ev-case-columns">
            <div>
              <span className="ev-case-label">The Challenge</span>
              <p className="ev-case-text">{cs.ch}</p>
            </div>
            <div>
              <span className="ev-case-label">What We Built</span>
              <p className="ev-case-text">{cs.sol}</p>
            </div>
          </div>
          <div className="ev-case-results">
            <span className="ev-case-label">Results</span>
            <div className="ev-results-grid">
              {cs.res.map((r, j) => (
                <div key={j} className="ev-result-item">
                  <span className="ev-result-dash">—</span>
                  <span>{r}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

function CaseStudies() {
  return (
    <Section id="work">
      <Reveal>
        <SectionNumber n="04" />
        <h2 className="ev-heading-lg">Selected Work</h2>
      </Reveal>
      <Reveal delay={80}><p className="ev-subtitle">Real challenges, real systems, measurable results</p></Reveal>
      <div className="ev-cases">{cases.map((c, i) => <CaseCard key={i} cs={c} i={i} />)}</div>
    </Section>
  );
}

/* ═══════════════ EXPERIENCE ═══════════════ */
function Experience() {
  const exp = [
    { co: "Adamopoulos and Partners", role: "AI and Digital Integration Intern", loc: "Pyrgos, Greece", yr: "2026", d: "Building AI automation systems and leading digital transformation for a civil engineering firm.", tg: ["AI", "Digital Transformation"] },
    { co: "WhitePress", role: "SEO and Content Operations Intern", loc: "Poland", yr: "2026", d: "Domain qualification, client account management, SEO operations, and website analysis at a B2B content marketing platform.", tg: ["SEO", "B2B", "Operations"] },
    { co: "GEINNOVA", role: "EU Project Technician", loc: "Spain", yr: "2025", d: "EU-funded project work including project drafting, strategic planning, and cross-border collaboration on innovation initiatives.", tg: ["EU Projects", "Strategy", "Innovation"] },
  ];

  return (
    <Section id="experience">
      <Reveal>
        <SectionNumber n="05" />
        <h2 className="ev-heading-lg">Experience</h2>
      </Reveal>

      <div className="ev-exp-list">
        {exp.map((e, i) => (
          <Reveal key={i} delay={i * 80}>
            <div className="ev-exp-row">
              <div className="ev-exp-year">{e.yr}</div>
              <div className="ev-exp-main">
                <h3 className="ev-exp-company">{e.co}</h3>
                <p className="ev-exp-role">{e.role}</p>
                <p className="ev-exp-desc">{e.d}</p>
                <div className="ev-tags">{e.tg.map((t, j) => <span key={j} className="ev-tag">{t}</span>)}</div>
              </div>
              <div className="ev-exp-meta">
                <span className="ev-exp-meta-item"><MapPin size={11} strokeWidth={1} />{e.loc}</span>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ═══════════════ CONTACT ═══════════════ */
function Contact() {
  return (
    <Section id="contact" className="ev-contact-section">
      <Reveal>
        <div className="ev-contact-inner">
          <SectionNumber n="06" />
          <h2 className="ev-heading-xl">Let's Build<br />Something</h2>
          <p className="ev-contact-desc">Have an idea, a broken workflow, or a business that needs AI? Let's talk.</p>

          <div className="ev-contact-email-row">
            <a href="mailto:contact@evrielsystems.com" className="ev-contact-email" data-cursor>contact@evrielsystems.com</a>
          </div>

          <div className="ev-contact-actions">
            <a href="mailto:contact@evrielsystems.com" className="ev-btn ev-btn--dark" data-cursor>
              <Mail size={14} strokeWidth={1.5} /> Send Email
            </a>
            <a href="https://www.linkedin.com/in/bereket-teshome-b71247194" target="_blank" rel="noopener noreferrer" className="ev-btn ev-btn--ghost" data-cursor>
              <Linkedin size={14} strokeWidth={1.5} /> LinkedIn
            </a>
          </div>

          <p className="ev-contact-location">Based in Italy — Working internationally</p>
        </div>
      </Reveal>
    </Section>
  );
}

/* ═══════════════ FOOTER ═══════════════ */
function Footer() {
  return (
    <footer className="ev-footer">
      <div className="ev-footer-inner">
        <div className="ev-footer-left">
          <LogoMark size={18} />
          <span className="ev-footer-name">Evriel Systems</span>
        </div>
        <div className="ev-footer-center">
          <p className="ev-footer-tagline">Connecting Intelligence with Business</p>
        </div>
        <div className="ev-footer-right">
          <p>&copy; 2026 Evriel Systems</p>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════ SERVICES PAGE ═══════════════ */
function ServicesPage({ setPage }) {
  const fullServices = [
    { t: "AI Integration", intro: "We identify where AI can create measurable value and integrate intelligent systems directly into existing business operations.", pts: ["Operational analysis to find high-value AI opportunities", "Integration of intelligent systems into existing tools", "Document and communication processing", "Decision-support and data structuring", "Production deployment within your infrastructure"], tg: ["AI", "Automation", "APIs"] },
    { t: "Workflow Automation", intro: "We eliminate repetitive tasks, reduce operational friction, and build workflows that scale.", pts: ["Mapping of manual and repetitive processes", "Automated handoffs between teams and tools", "Approval and review workflow design", "Reduction of operational bottlenecks", "Scalable systems that grow with the business"], tg: ["Workflow", "Efficiency", "Systems"] },
    { t: "Custom AI Systems", intro: "Every business is different. We design and deploy custom AI tools tailored to specific operational needs, processes, and goals.", pts: ["Tailored tools built around your operations", "Internal platforms and dashboards", "Industry-specific intelligent systems", "End-to-end design and deployment", "Ongoing refinement as needs evolve"], tg: ["Custom Tools", "Platforms", "SaaS"] },
    { t: "Digital Transformation", intro: "We help businesses modernize their online presence, communication systems, recruitment processes, and internal operations.", pts: ["Professional online presence and positioning", "Communication and content systems", "Recruitment and talent processes", "Internal operations modernization", "Brand and market positioning"], tg: ["LinkedIn", "Web", "Content", "Recruitment"] },
  ];

  return (
    <div style={{ position: "relative", zIndex: 2 }}>
      <div className="ev-page-header">
        <a onClick={() => { setPage("home"); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="ev-back" style={{ cursor: "pointer" }} data-cursor>
          <ArrowLeft size={14} strokeWidth={1.5} /> Back
        </a>
        <SectionNumber n="Services" />
        <h2 className="ev-heading-lg">What we offer</h2>
        <p className="ev-subtitle">Practical AI integration and business transformation</p>
      </div>

      {fullServices.map((s, i) => (
        <Reveal key={i} delay={i * 60}>
          <div className="ev-section ev-sf-section">
            <div className="ev-sf-grid">
              <div>
                <span className="ev-sf-num">0{i + 1}</span>
                <h3 className="ev-sf-title">{s.t}</h3>
                <p className="ev-sf-intro">{s.intro}</p>
                <div className="ev-tags">{s.tg.map((t, j) => <span key={j} className="ev-tag">{t}</span>)}</div>
              </div>
              <div className="ev-sf-card">
                <span className="ev-sf-card-label">What's Included</span>
                <div className="ev-sf-points">
                  {s.pts.map((p, j) => (
                    <div key={j} className="ev-sf-point">
                      <span className="ev-sf-dash">—</span>
                      <span>{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {i < fullServices.length - 1 && <LineReveal delay={200} />}
          </div>
        </Reveal>
      ))}
    </div>
  );
}

/* ═══════════════ INSIGHTS PAGE ═══════════════ */
function InsightsPage({ setPage }) {
  const articles = [
    { t: "Why Most Businesses Don't Have an AI Problem", d: "The real challenge is rarely the technology. It's scattered information, manual processes, and disconnected systems.", tg: ["Strategy", "Operations"], y: "2026" },
    { t: "Finding the Inefficiencies That Actually Cost You", d: "Not every bottleneck is worth fixing. We look at where time, money, and attention quietly leak out of a business.", tg: ["Process", "Efficiency"], y: "2026" },
    { t: "When the Answer Isn't AI", d: "Sometimes a better workflow beats a smarter algorithm. Knowing the difference is what separates useful systems from expensive experiments.", tg: ["Workflow", "Design"], y: "2026" },
    { t: "Building Systems That Fit the Business", d: "The best systems work within how a company already operates, instead of forcing teams to bend around the technology.", tg: ["Deployment", "Systems"], y: "2025" },
  ];

  return (
    <div style={{ position: "relative", zIndex: 2 }}>
      <div className="ev-page-header">
        <a onClick={() => { setPage("home"); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="ev-back" style={{ cursor: "pointer" }} data-cursor>
          <ArrowLeft size={14} strokeWidth={1.5} /> Back
        </a>
        <SectionNumber n="Insights" />
        <h2 className="ev-heading-lg">Thoughts on AI & Business</h2>
        <p className="ev-subtitle">Ideas and perspectives on building practical systems</p>
      </div>

      <Stagger className="ev-insights-grid ev-section" delay={100}>
        {articles.map((a, i) => (
          <div key={i} className="ev-insight-row" data-cursor>
            <span className="ev-insight-year">{a.y}</span>
            <div className="ev-insight-main">
              <h3 className="ev-insight-title">{a.t}</h3>
              <p className="ev-insight-desc">{a.d}</p>
              <div className="ev-tags">{a.tg.map((t, j) => <span key={j} className="ev-tag">{t}</span>)}</div>
            </div>
            <ArrowUpRight size={16} strokeWidth={1} className="ev-insight-arrow" />
          </div>
        ))}
      </Stagger>
    </div>
  );
}

/* ═══════════════ HOME ═══════════════ */
function Home({ setPage }) {
  return (
    <>
      <Hero />
      <Marquee />
      <About />
      <Process />
      <ServicesHome setPage={setPage} />
      <CaseStudies />
      <Experience />
      <Contact />
      <Footer />
    </>
  );
}

/* ═══════════════ APP ═══════════════ */
export default function App() {
  const [page, setPage] = useState("home");
  const { pos, hovering } = useCursor();

  return (
    <>
      <style>{`
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=Instrument+Serif:ital@0;1&display=swap');

:root {
  --bg: #ffffff;
  --surface: #fafafa;
  --surface-hover: #f5f5f5;
  --black: #000000;
  --text-primary: #000000;
  --text-secondary: #555555;
  --text-tertiary: #888888;
  --text-muted: #aaaaaa;
  --platinum: #D9D9D9;
  --border: #e8e8e8;
  --border-hover: #d0d0d0;
  --heading: 'Instrument Serif', Georgia, serif;
  --body: 'Inter', -apple-system, system-ui, sans-serif;
  --ease: cubic-bezier(0.16, 1, 0.3, 1);
}

*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
html { scroll-behavior: smooth; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
body { background: var(--bg); color: var(--text-primary); font-family: var(--body); overflow-x: hidden; cursor: default; }
a { text-decoration: none; color: inherit; }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}

/* ═══ CUSTOM CURSOR ═══ */
.ev-cursor {
  position: fixed;
  top: 0;
  left: 0;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 1px solid var(--black);
  pointer-events: none;
  z-index: 9999;
  transition: width 0.4s var(--ease), height 0.4s var(--ease), margin 0.4s var(--ease), opacity 0.3s;
  mix-blend-mode: difference;
}
.ev-cursor--hover {
  width: 48px;
  height: 48px;
  margin: -18px 0 0 -18px;
  border-color: #fff;
}
@media (max-width: 768px) { .ev-cursor { display: none; } }

/* ═══ NAVBAR ═══ */
.ev-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  padding: 24px 0;
  transition: all 0.6s var(--ease);
}
.ev-nav--scrolled {
  padding: 14px 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border);
}
.ev-nav-inner {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 48px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.ev-logo {
  display: flex;
  align-items: center;
  gap: 12px;
}
.ev-logo-text { display: flex; flex-direction: column; }
.ev-logo-name {
  font-family: var(--body);
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.25em;
  color: var(--text-primary);
  line-height: 1;
}
.ev-logo-sub {
  font-family: var(--body);
  font-size: 8px;
  letter-spacing: 0.45em;
  color: var(--text-tertiary);
  font-weight: 400;
  text-transform: uppercase;
  margin-top: 2px;
}
.ev-nav-links {
  display: flex;
  gap: 0;
}
.ev-nav-link {
  font-family: var(--body);
  font-size: 12px;
  color: var(--text-tertiary);
  padding: 8px 20px;
  transition: color 0.3s var(--ease);
  cursor: pointer;
  font-weight: 400;
  letter-spacing: 0.04em;
}
.ev-nav-link:hover, .ev-nav-link.active { color: var(--text-primary); }
.ev-nav-cta {
  font-family: var(--body);
  font-size: 12px;
  padding: 10px 28px;
  border: 1px solid var(--black);
  color: var(--black);
  transition: all 0.4s var(--ease);
  cursor: pointer;
  font-weight: 400;
  letter-spacing: 0.04em;
}
.ev-nav-cta:hover {
  background: var(--black);
  color: var(--bg);
}

/* Mobile Nav */
.ev-mobile-toggle {
  display: none;
  background: none;
  border: none;
  padding: 10px;
  flex-direction: column;
  gap: 6px;
  cursor: pointer;
}
.ev-mobile-toggle span {
  width: 22px;
  height: 1px;
  background: var(--black);
  display: block;
  transition: all 0.4s var(--ease);
  transform-origin: center;
}
.ev-mobile-toggle span.open:nth-child(1) { transform: rotate(45deg) translate(2px, 4px); }
.ev-mobile-toggle span.open:nth-child(2) { transform: rotate(-45deg) translate(2px, -4px); }
.ev-mobile-menu {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.5s var(--ease);
  padding: 0 48px;
  display: flex;
  flex-direction: column;
  background: var(--bg);
}
.ev-mobile-menu.open { max-height: 320px; padding: 16px 48px 32px; border-top: 1px solid var(--border); }
.ev-mobile-link {
  font-family: var(--body);
  font-size: 14px;
  color: var(--text-tertiary);
  cursor: pointer;
  padding: 12px 0;
  transition: color 0.2s;
  letter-spacing: 0.02em;
}
.ev-mobile-link:hover { color: var(--text-primary); }
@media (max-width: 768px) {
  .ev-nav-links, .ev-nav-cta { display: none !important; }
  .ev-mobile-toggle { display: flex !important; }
  .ev-nav-inner { padding: 0 24px; }
}

/* ═══ HERO ═══ */
.ev-hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 160px 24px 80px;
  overflow: hidden;
}
.ev-hero-bg {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  opacity: 0.5;
}
.ev-hero-content {
  position: relative;
  z-index: 2;
  max-width: 900px;
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 1.4s var(--ease), transform 1.6s var(--ease);
}
.ev-hero-content.entered { opacity: 1; transform: translateY(0); }

.ev-hero-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 48px;
}
.ev-hero-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--black);
  animation: evPulse 3s ease-in-out infinite;
}
@keyframes evPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.2; }
}
.ev-hero-eyebrow span {
  font-family: var(--body);
  font-size: 10px;
  color: var(--text-tertiary);
  letter-spacing: 0.3em;
  font-weight: 400;
  text-transform: uppercase;
}
.ev-h1 {
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
}
.ev-h1-main {
  font-family: var(--heading);
  font-size: clamp(72px, 14vw, 180px);
  font-weight: 400;
  color: var(--text-primary);
  line-height: 0.85;
  letter-spacing: -0.02em;
}
.ev-h1-sub {
  font-family: var(--body);
  font-size: clamp(11px, 1.8vw, 16px);
  font-weight: 300;
  letter-spacing: 0.55em;
  color: var(--text-tertiary);
  text-transform: lowercase;
  margin-top: 8px;
}
.ev-hero-tagline {
  font-family: var(--heading);
  font-size: clamp(16px, 2.2vw, 22px);
  font-style: italic;
  color: var(--text-secondary);
  margin: 40px 0 0;
  font-weight: 400;
}
.ev-hero-desc {
  font-family: var(--body);
  font-size: clamp(13px, 1.2vw, 15px);
  line-height: 1.9;
  color: var(--text-tertiary);
  font-weight: 300;
  margin: 24px auto 0;
  max-width: 480px;
}
.ev-hero-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-top: 48px;
  flex-wrap: wrap;
}

/* Buttons */
.ev-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 15px 36px;
  font-family: var(--body);
  font-size: 12px;
  font-weight: 400;
  letter-spacing: 0.06em;
  transition: all 0.5s var(--ease);
  cursor: pointer;
  border: none;
}
.ev-btn--dark {
  background: var(--black);
  color: var(--bg);
}
.ev-btn--dark:hover {
  background: #222;
  transform: translateY(-2px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12);
}
.ev-btn--ghost {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text-secondary);
}
.ev-btn--ghost:hover {
  border-color: var(--black);
  color: var(--text-primary);
  transform: translateY(-2px);
}

/* Hero Bottom */
.ev-hero-bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0 48px 40px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  opacity: 0;
  transition: opacity 1.4s ease 1s;
}
.ev-hero-bottom.entered { opacity: 1; }
.ev-hero-line {
  flex: 1;
  height: 1px;
  background: var(--border);
  margin-right: 24px;
}
.ev-hero-scroll {
  display: flex;
  align-items: center;
  gap: 12px;
}
.ev-hero-scroll span {
  font-family: var(--body);
  font-size: 9px;
  letter-spacing: 0.3em;
  color: var(--text-muted);
  text-transform: uppercase;
}
.ev-scroll-bar {
  width: 40px;
  height: 1px;
  background: var(--border);
  position: relative;
  overflow: hidden;
}
.ev-scroll-progress {
  width: 20px;
  height: 1px;
  background: var(--black);
  position: absolute;
  top: 0;
  left: -20px;
  animation: evScroll 3s ease-in-out infinite;
}
@keyframes evScroll { 0% { left: -20px; } 100% { left: 40px; } }
@media (max-width: 768px) {
  .ev-hero-bottom { display: none; }
  .ev-hero { padding-bottom: 60px; }
}

/* ═══ MARQUEE ═══ */
.ev-marquee-wrap {
  overflow: hidden;
  padding: 32px 0;
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
}
.ev-marquee-track {
  display: flex;
  width: max-content;
  animation: evMarquee 40s linear infinite;
}
.ev-marquee-inner { display: flex; }
.ev-marquee-item {
  font-family: var(--body);
  font-size: 12px;
  color: var(--text-muted);
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-weight: 300;
}
.ev-marquee-sep {
  margin: 0 32px;
  color: var(--platinum);
  font-weight: 300;
}
@keyframes evMarquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }

/* ═══ SECTIONS ═══ */
.ev-section {
  padding: clamp(100px, 12vw, 160px) 48px;
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}
.ev-section-num {
  font-family: var(--body);
  font-size: 10px;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--text-muted);
  font-weight: 400;
  display: block;
  margin-bottom: 24px;
}
.ev-heading-lg {
  font-family: var(--heading);
  font-size: clamp(36px, 5.5vw, 64px);
  font-weight: 400;
  color: var(--text-primary);
  margin: 0 0 24px;
  line-height: 1.05;
  letter-spacing: -0.01em;
}
.ev-heading-xl {
  font-family: var(--heading);
  font-size: clamp(48px, 8vw, 96px);
  font-weight: 400;
  color: var(--text-primary);
  margin: 0 0 24px;
  line-height: 1;
  letter-spacing: -0.02em;
}
.ev-subtitle {
  font-family: var(--body);
  font-size: 14px;
  color: var(--text-tertiary);
  font-weight: 300;
  margin: 0 0 64px;
  line-height: 1.8;
  letter-spacing: 0.01em;
}
.ev-body-lg {
  font-family: var(--heading);
  font-size: clamp(24px, 3vw, 32px);
  font-weight: 400;
  font-style: italic;
  color: var(--text-secondary);
  line-height: 1.4;
  margin: 0 0 24px;
}
.ev-body {
  font-family: var(--body);
  font-size: 14px;
  line-height: 2;
  color: var(--text-secondary);
  font-weight: 300;
  margin: 0 0 16px;
}
.ev-body--muted { color: var(--text-tertiary); }
.ev-text-link {
  font-family: var(--body);
  font-size: 12px;
  color: var(--text-tertiary);
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: color 0.3s;
  letter-spacing: 0.04em;
}
.ev-text-link:hover { color: var(--text-primary); }

/* Tags */
.ev-tag {
  font-family: var(--body);
  font-size: 10px;
  color: var(--text-tertiary);
  padding: 5px 14px;
  border: 1px solid var(--border);
  background: transparent;
  letter-spacing: 0.04em;
  font-weight: 400;
  white-space: nowrap;
}
.ev-tags { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 16px; }

/* ═══ ABOUT ═══ */
.ev-about-top { margin-bottom: 64px; }
.ev-about-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  margin-bottom: 80px;
}
.ev-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 48px;
  padding-top: 64px;
}
.ev-stat { text-align: left; }
.ev-stat-value {
  font-family: var(--heading);
  font-size: 36px;
  font-weight: 400;
  color: var(--text-primary);
  display: block;
  letter-spacing: -0.01em;
}
.ev-stat-label {
  font-family: var(--body);
  font-size: 11px;
  color: var(--text-muted);
  font-weight: 300;
  margin-top: 8px;
  display: block;
  letter-spacing: 0.03em;
}
@media (max-width: 768px) {
  .ev-about-grid { grid-template-columns: 1fr; gap: 32px; }
  .ev-stats { grid-template-columns: 1fr; gap: 32px; }
  .ev-section { padding-left: 24px; padding-right: 24px; }
}

/* ═══ PROCESS ═══ */
.ev-steps {
  display: flex;
  flex-direction: column;
  margin-top: 48px;
}
.ev-step {
  display: grid;
  grid-template-columns: 80px 1fr;
  gap: 40px;
  padding: 40px 0;
  border-top: 1px solid var(--border);
  align-items: start;
  transition: background 0.4s var(--ease);
}
.ev-step:last-child { border-bottom: 1px solid var(--border); }
.ev-step-num {
  font-family: var(--body);
  font-size: 11px;
  color: var(--text-muted);
  font-weight: 400;
  letter-spacing: 0.1em;
  padding-top: 4px;
}
.ev-step-title {
  font-family: var(--heading);
  font-size: clamp(24px, 3vw, 32px);
  font-weight: 400;
  color: var(--text-primary);
  margin: 0 0 12px;
}
.ev-step-desc {
  font-family: var(--body);
  font-size: 14px;
  line-height: 1.9;
  color: var(--text-tertiary);
  font-weight: 300;
  margin: 0;
  max-width: 560px;
}
@media (max-width: 768px) {
  .ev-step { grid-template-columns: 1fr; gap: 8px; }
}

/* ═══ SERVICES ═══ */
.ev-services-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 48px;
}
.ev-services-list {
  display: flex;
  flex-direction: column;
}
.ev-service-row {
  display: grid;
  grid-template-columns: 60px 1fr auto 40px;
  gap: 32px;
  align-items: center;
  padding: 36px 0;
  border-top: 1px solid var(--border);
  transition: all 0.4s var(--ease);
  cursor: pointer;
}
.ev-service-row:last-child { border-bottom: 1px solid var(--border); }
.ev-service-row:hover { padding-left: 12px; }
.ev-service-row-num {
  font-family: var(--body);
  font-size: 11px;
  color: var(--text-muted);
  letter-spacing: 0.08em;
}
.ev-service-row-title {
  font-family: var(--heading);
  font-size: clamp(22px, 2.8vw, 30px);
  font-weight: 400;
  color: var(--text-primary);
  margin: 0 0 6px;
}
.ev-service-row-desc {
  font-family: var(--body);
  font-size: 13px;
  color: var(--text-tertiary);
  font-weight: 300;
  margin: 0;
  max-width: 400px;
  line-height: 1.7;
}
.ev-service-row-tags { display: flex; gap: 6px; flex-wrap: wrap; }
.ev-service-row-arrow {
  color: var(--text-muted);
  transition: all 0.4s var(--ease);
}
.ev-service-row:hover .ev-service-row-arrow {
  color: var(--text-primary);
  transform: translate(2px, -2px);
}
@media (max-width: 768px) {
  .ev-service-row { grid-template-columns: 1fr; gap: 8px; padding: 28px 0; }
  .ev-service-row-num { display: none; }
  .ev-service-row-arrow { display: none; }
}

/* ═══ CASES ═══ */
.ev-cases { display: flex; flex-direction: column; }
.ev-case {
  padding: 36px 0;
  border-top: 1px solid var(--border);
  transition: all 0.3s var(--ease);
}
.ev-case:last-child { border-bottom: 1px solid var(--border); }
.ev-case--open { background: var(--surface); padding: 36px 32px; margin: 0 -32px; }
.ev-case-header {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  align-items: start;
}
.ev-case-tag {
  font-family: var(--body);
  font-size: 9px;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--text-muted);
  font-weight: 400;
  display: block;
  margin-bottom: 12px;
}
.ev-case-title {
  font-family: var(--heading);
  font-size: clamp(24px, 3.5vw, 36px);
  font-weight: 400;
  color: var(--text-primary);
  margin: 0;
}
.ev-case-right {
  display: flex;
  align-items: start;
  gap: 24px;
}
.ev-case-hook {
  font-family: var(--body);
  font-size: 13px;
  color: var(--text-tertiary);
  font-weight: 300;
  font-style: italic;
  margin: 0;
  flex: 1;
  line-height: 1.7;
}
.ev-case-toggle {
  color: var(--text-muted);
  flex-shrink: 0;
  margin-top: 2px;
  transition: color 0.3s;
}
.ev-case:hover .ev-case-toggle { color: var(--text-primary); }
.ev-case-body {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.7s var(--ease);
}
.ev-case-body.open { max-height: 800px; }
.ev-case-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  padding-top: 32px;
  margin-top: 32px;
  border-top: 1px solid var(--border);
}
.ev-case-label {
  font-family: var(--body);
  font-size: 9px;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--text-muted);
  font-weight: 400;
  display: block;
  margin-bottom: 14px;
}
.ev-case-text {
  font-family: var(--body);
  font-size: 13px;
  line-height: 1.9;
  color: var(--text-secondary);
  font-weight: 300;
  margin: 0;
}
.ev-case-results { margin-top: 32px; }
.ev-results-grid { display: flex; flex-direction: column; }
.ev-result-item {
  display: flex;
  align-items: center;
  gap: 16px;
  font-family: var(--body);
  font-size: 13px;
  line-height: 1.5;
  color: var(--text-secondary);
  font-weight: 300;
  padding: 10px 0;
}
.ev-result-dash { color: var(--text-muted); flex-shrink: 0; font-size: 11px; }
@media (max-width: 768px) {
  .ev-case-header { grid-template-columns: 1fr; gap: 12px; }
  .ev-case-columns { grid-template-columns: 1fr; gap: 24px; }
  .ev-case-right { flex-direction: column; gap: 12px; }
}

/* ═══ EXPERIENCE ═══ */
.ev-exp-list {
  display: flex;
  flex-direction: column;
  margin-top: 48px;
}
.ev-exp-row {
  display: grid;
  grid-template-columns: 80px 1fr auto;
  gap: 40px;
  align-items: start;
  padding: 36px 0;
  border-top: 1px solid var(--border);
}
.ev-exp-row:last-child { border-bottom: 1px solid var(--border); }
.ev-exp-year {
  font-family: var(--body);
  font-size: 11px;
  color: var(--text-muted);
  letter-spacing: 0.1em;
  padding-top: 4px;
}
.ev-exp-company {
  font-family: var(--heading);
  font-size: 24px;
  font-weight: 400;
  color: var(--text-primary);
  margin: 0;
}
.ev-exp-role {
  font-family: var(--body);
  font-size: 12px;
  color: var(--text-tertiary);
  margin: 6px 0 0;
  font-weight: 300;
  letter-spacing: 0.02em;
}
.ev-exp-desc {
  font-family: var(--body);
  font-size: 13px;
  line-height: 1.8;
  color: var(--text-tertiary);
  font-weight: 300;
  margin: 14px 0 0;
}
.ev-exp-meta { display: flex; gap: 14px; flex-wrap: wrap; padding-top: 4px; }
.ev-exp-meta-item {
  font-family: var(--body);
  font-size: 11px;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  gap: 5px;
}
@media (max-width: 768px) {
  .ev-exp-row { grid-template-columns: 1fr; gap: 8px; }
}

/* ═══ CONTACT ═══ */
.ev-contact-section { text-align: center; }
.ev-contact-inner {
  max-width: 700px;
  margin: 0 auto;
}
.ev-contact-section .ev-section-num { display: inline-block; }
.ev-contact-desc {
  font-family: var(--body);
  font-size: 14px;
  color: var(--text-tertiary);
  font-weight: 300;
  margin: 0 0 40px;
  line-height: 1.9;
}
.ev-contact-email-row { margin-bottom: 40px; }
.ev-contact-email {
  font-family: var(--body);
  font-size: 16px;
  color: var(--text-primary);
  font-weight: 300;
  letter-spacing: 0.04em;
  padding-bottom: 4px;
  border-bottom: 1px solid var(--border);
  transition: border-color 0.3s;
}
.ev-contact-email:hover { border-color: var(--black); }
.ev-contact-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}
.ev-contact-location {
  font-family: var(--body);
  font-size: 11px;
  color: var(--text-muted);
  margin-top: 40px;
  font-weight: 300;
  letter-spacing: 0.06em;
}

/* ═══ FOOTER ═══ */
.ev-footer {
  border-top: 1px solid var(--border);
}
.ev-footer-inner {
  max-width: 1400px;
  margin: 0 auto;
  padding: 36px 48px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}
.ev-footer-left {
  display: flex;
  align-items: center;
  gap: 10px;
}
.ev-footer-name {
  font-family: var(--body);
  font-size: 11px;
  color: var(--text-tertiary);
  letter-spacing: 0.12em;
  font-weight: 400;
}
.ev-footer-center { }
.ev-footer-tagline {
  font-family: var(--heading);
  font-size: 13px;
  color: var(--text-tertiary);
  font-style: italic;
  margin: 0;
}
.ev-footer-right p {
  font-family: var(--body);
  font-size: 10px;
  color: var(--text-muted);
  font-weight: 300;
  margin: 0;
  letter-spacing: 0.04em;
}
@media (max-width: 768px) {
  .ev-footer-inner { padding: 28px 24px; flex-direction: column; text-align: center; }
}

/* ═══ SUB PAGES ═══ */
.ev-page-header {
  max-width: 1400px;
  margin: 0 auto;
  padding: 140px 48px 0;
  position: relative;
  z-index: 2;
}
.ev-back {
  font-family: var(--body);
  font-size: 12px;
  color: var(--text-muted);
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 40px;
  transition: color 0.3s;
  cursor: pointer;
  letter-spacing: 0.04em;
}
.ev-back:hover { color: var(--text-primary); }

.ev-sf-section { padding-top: 64px !important; padding-bottom: 64px !important; }
.ev-sf-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  align-items: start;
}
.ev-sf-num {
  font-family: var(--body);
  font-size: 10px;
  color: var(--text-muted);
  letter-spacing: 0.15em;
  display: block;
  margin-bottom: 16px;
}
.ev-sf-title {
  font-family: var(--heading);
  font-size: 30px;
  font-weight: 400;
  color: var(--text-primary);
  margin: 0 0 14px;
}
.ev-sf-intro {
  font-family: var(--body);
  font-size: 14px;
  line-height: 1.9;
  color: var(--text-tertiary);
  font-weight: 300;
  margin: 0 0 16px;
}
.ev-sf-card {
  padding: 40px;
  background: var(--surface);
  border: 1px solid var(--border);
}
.ev-sf-card-label {
  font-family: var(--body);
  font-size: 9px;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--text-muted);
  font-weight: 400;
  display: block;
  margin-bottom: 24px;
}
.ev-sf-points {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.ev-sf-point {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  font-family: var(--body);
  font-size: 13px;
  color: var(--text-secondary);
  font-weight: 300;
  line-height: 1.6;
}
.ev-sf-dash { color: var(--text-muted); flex-shrink: 0; }
@media (max-width: 768px) {
  .ev-sf-grid { grid-template-columns: 1fr; gap: 28px; }
  .ev-page-header { padding-left: 24px; padding-right: 24px; }
}

/* Insights */
.ev-insights-grid {
  display: flex;
  flex-direction: column;
}
.ev-insight-row {
  display: grid;
  grid-template-columns: 80px 1fr 40px;
  gap: 40px;
  align-items: center;
  padding: 36px 0;
  border-top: 1px solid var(--border);
  cursor: pointer;
  transition: all 0.4s var(--ease);
}
.ev-insight-row:last-child { border-bottom: 1px solid var(--border); }
.ev-insight-row:hover { padding-left: 12px; }
.ev-insight-year {
  font-family: var(--body);
  font-size: 11px;
  color: var(--text-muted);
  letter-spacing: 0.08em;
}
.ev-insight-title {
  font-family: var(--heading);
  font-size: 24px;
  font-weight: 400;
  color: var(--text-primary);
  margin: 0 0 6px;
}
.ev-insight-desc {
  font-family: var(--body);
  font-size: 13px;
  line-height: 1.7;
  color: var(--text-tertiary);
  font-weight: 300;
  margin: 0;
}
.ev-insight-arrow {
  color: var(--text-muted);
  transition: all 0.4s var(--ease);
}
.ev-insight-row:hover .ev-insight-arrow {
  color: var(--text-primary);
  transform: translate(2px, -2px);
}
@media (max-width: 768px) {
  .ev-insight-row { grid-template-columns: 1fr; gap: 8px; }
  .ev-insight-year { display: none; }
  .ev-insight-arrow { display: none; }
}
      `}</style>

      <div className={`ev-cursor${hovering ? " ev-cursor--hover" : ""}`}
        style={{ transform: `translate(${pos.x - 6}px, ${pos.y - 6}px)` }} />

      <Nav page={page} setPage={setPage} />
      {page === "home" && <Home setPage={setPage} />}
      {page === "services" && <><ServicesPage setPage={setPage} /><Footer /></>}
      {page === "insights" && <><InsightsPage setPage={setPage} /><Footer /></>}
    </>
  );
}

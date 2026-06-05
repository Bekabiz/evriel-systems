import { useState, useEffect, useRef, useCallback } from "react";
import { Mail, ArrowRight, ArrowUpRight, ChevronDown, ChevronUp, MapPin, Calendar, ArrowLeft, Cpu, GitBranch, Layers, Zap, Target, Search, BarChart3, Shield, Globe, Users, ExternalLink } from "lucide-react";

const Linkedin = ({ size = 24, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>
  </svg>
);

/* ═══════════════ MOTION SYSTEM ═══════════════ */
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const SPRING = "cubic-bezier(0.34, 1.56, 0.64, 1)";

function useReveal(threshold = 0.12) {
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

function useParallax(speed = 0.08) {
  const ref = useRef(null);
  const y = useRef(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf;
    const onScroll = () => {
      raf = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const center = rect.top + rect.height / 2 - window.innerHeight / 2;
        y.current = center * speed;
        el.style.transform = `translate3d(0, ${y.current}px, 0)`;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, [speed]);
  return ref;
}

function useSmoothCounter(target, duration = 2000, active = false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(eased * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, active]);
  return val;
}

/* ═══════════════ MAGNETIC BUTTON ═══════════════ */
function MagneticWrap({ children, className = "", strength = 0.3 }) {
  const ref = useRef(null);
  const onMove = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) * strength;
    const dy = (e.clientY - cy) * strength;
    el.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
  }, [strength]);
  const onLeave = useCallback(() => {
    if (ref.current) ref.current.style.transform = "translate3d(0,0,0)";
  }, []);
  return (
    <div ref={ref} className={className} onMouseMove={onMove} onMouseLeave={onLeave}
      style={{ transition: `transform 0.4s ${EASE}`, willChange: "transform" }}>
      {children}
    </div>
  );
}

/* ═══════════════ STAGGER CONTAINER ═══════════════ */
function Stagger({ children, className = "", delay = 60 }) {
  const [ref, visible] = useReveal(0.08);
  return (
    <div ref={ref} className={className}>
      {Array.isArray(children) ? children.map((child, i) => (
        <div key={i} style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(32px)",
          transition: `opacity 0.7s ${EASE} ${i * delay}ms, transform 0.7s ${EASE} ${i * delay}ms`
        }}>{child}</div>
      )) : children}
    </div>
  );
}

/* ═══════════════ REVEAL WRAPPER ═══════════════ */
function Reveal({ children, className = "", delay = 0, direction = "up" }) {
  const [ref, visible] = useReveal(0.1);
  const transforms = {
    up: "translateY(40px)",
    down: "translateY(-40px)",
    left: "translateX(40px)",
    right: "translateX(-40px)",
    scale: "scale(0.95)",
  };
  return (
    <div ref={ref} className={className} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translate3d(0,0,0) scale(1)" : transforms[direction],
      transition: `opacity 0.8s ${EASE} ${delay}ms, transform 0.8s ${EASE} ${delay}ms`,
    }}>{children}</div>
  );
}

/* ═══════════════ SHARED COMPONENTS ═══════════════ */
function Section({ id, children, className = "" }) {
  return <section id={id} className={`es-section ${className}`}>{children}</section>;
}
function Label({ text }) { return <div className="es-label">{text}</div>; }
function Title({ children }) { return <h2 className="es-title">{children}</h2>; }
function Desc({ children }) { return <p className="es-desc">{children}</p>; }
function Divider() { return <div className="es-divider"><div className="es-divider-line" /></div>; }
function Tag({ t }) { return <span className="es-tag">{t}</span>; }

const LogoMark = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L3 7.5V16.5L12 22L21 16.5V7.5L12 2Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    <path d="M12 8L7.5 10.5V15.5L12 18L16.5 15.5V10.5L12 8Z" stroke="currentColor" strokeWidth="0.8" opacity="0.5" strokeLinejoin="round" />
    <circle cx="12" cy="13" r="1.5" fill="currentColor" opacity="0.4" />
  </svg>
);

/* ═══════════════ NAVBAR ═══════════════ */
function Nav({ page, setPage }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const goPage = (p) => { setPage(p); setMobileOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const goSection = (id) => {
    setMobileOpen(false);
    if (page !== "home") {
      setPage("home");
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 150);
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
    <nav className={`es-nav${scrolled ? " es-nav--scrolled" : ""}`}>
      <div className="es-nav-inner">
        <a onClick={() => goPage("home")} className="es-logo" style={{ cursor: "pointer" }}>
          <div className="es-logo-icon"><LogoMark size={16} /></div>
          <div>
            <div className="es-logo-name">Evriel</div>
            <div className="es-logo-sub">Systems</div>
          </div>
        </a>

        <div className="es-nav-links">
          {links.map((l) => (
            <a key={l.label} onClick={l.action} className={`es-nav-link${l.active ? " active" : ""}`}>{l.label}</a>
          ))}
        </div>

        <MagneticWrap>
          <a onClick={() => goSection("contact")} className="es-nav-cta">
            Get in Touch <ArrowUpRight size={11} strokeWidth={2} />
          </a>
        </MagneticWrap>

        <button className="es-mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
          <span className={mobileOpen ? "open" : ""} />
          <span className={mobileOpen ? "open" : ""} />
          <span className={mobileOpen ? "open" : ""} />
        </button>
      </div>

      {mobileOpen && (
        <div className="es-mobile-menu">
          {[...links, { label: "Contact", action: () => goSection("contact") }].map((l) => (
            <a key={l.label} onClick={l.action} className="es-mobile-link">{l.label}</a>
          ))}
        </div>
      )}
    </nav>
  );
}

/* ═══════════════ HERO ═══════════════ */
function Hero() {
  const [entered, setEntered] = useState(false);
  const parallaxRef = useParallax(0.04);

  useEffect(() => { setTimeout(() => setEntered(true), 100); }, []);

  return (
    <section id="hero" className="es-hero">
      <div className="es-hero-glow" />
      <div className="es-hero-grid" ref={parallaxRef} />

      <div className={`es-hero-content${entered ? " entered" : ""}`}>
        <div className="es-hero-badge">
          <div className="es-hero-pulse" />
          <span>AI SYSTEMS INTEGRATOR</span>
        </div>

        <h1 className="es-h1">
          <span className="es-h1-line es-h1-line--1">EVRIEL</span>
          <span className="es-h1-line es-h1-line--2">SYSTEMS</span>
        </h1>

        <p className="es-hero-tagline">Connecting AI with Business</p>

        <p className="es-hero-desc">
          We help businesses identify opportunities, streamline operations, and deploy
          practical AI systems that create measurable business value.
        </p>

        <div className="es-hero-actions">
          <MagneticWrap>
            <a href="#work" className="es-btn es-btn--primary">
              View Our Work <ArrowRight size={14} strokeWidth={2} />
            </a>
          </MagneticWrap>
          <MagneticWrap>
            <a href="#contact" className="es-btn es-btn--outline">Get in Touch</a>
          </MagneticWrap>
        </div>
      </div>

      <div className={`es-hero-marquee${entered ? " entered" : ""}`}>
        <div className="es-marquee-track">
          {[...Array(2)].map((_, k) => (
            <div key={k} className="es-marquee-inner">
              {["AI Integration", "Workflow Automation", "Custom Systems", "Digital Transformation", "Operations", "Business Strategy", "Intelligent Tools", "Process Design"].map((t, i) => (
                <span key={i} className="es-marquee-item">{t}<span className="es-marquee-dot" /></span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className={`es-scroll-hint${entered ? " entered" : ""}`}>
        <span>SCROLL</span>
        <div className="es-scroll-line"><div className="es-scroll-dot" /></div>
      </div>
    </section>
  );
}

/* ═══════════════ ABOUT ═══════════════ */
function About() {
  const [ref, visible] = useReveal();
  const stat1 = useSmoothCounter(4, 1800, visible);

  return (
    <Section id="about">
      <div className="es-about-grid">
        <Reveal>
          <Label text="About" />
          <Title>Most businesses don't<br />have an AI problem</Title>
        </Reveal>
        <Reveal delay={150}>
          <p className="es-body">Most businesses don't have an AI problem. They have an operations problem.</p>
          <p className="es-body es-body--muted">Information is scattered. Processes are manual. Teams spend hours on repetitive tasks. Decisions rely on disconnected systems.</p>
          <p className="es-body es-body--muted">Evriel Systems helps businesses identify where technology can create measurable value, then designs practical solutions that solve those problems. From AI-powered workflows and intelligent automation to custom internal platforms and digital transformation initiatives, every solution is built around one goal: creating real business outcomes.</p>
          <p className="es-body es-body--muted">Founded by Bereket Teshome, Evriel Systems operates at the intersection of artificial intelligence, operations, and business strategy, helping organizations transform complexity into clarity.</p>
        </Reveal>
      </div>

      <div ref={ref} className="es-stats">
        <div className="es-stat">
          <span className="es-stat-value">Multiple</span>
          <span className="es-stat-label">AI Products in Production</span>
        </div>
        <div className="es-stat-sep" />
        <div className="es-stat">
          <span className="es-stat-value">{stat1}+</span>
          <span className="es-stat-label">Countries</span>
        </div>
        <div className="es-stat-sep" />
        <div className="es-stat">
          <span className="es-stat-value">Real</span>
          <span className="es-stat-label">Clients, Real Systems</span>
        </div>
      </div>
    </Section>
  );
}

/* ═══════════════ HOW WE WORK ═══════════════ */
function Process() {
  const steps = [
    { n: "01", t: "Business Discovery", d: "We begin by understanding how your business operates, how decisions are made, and where time and resources are being lost.", icon: <Search size={20} strokeWidth={1.5} /> },
    { n: "02", t: "Opportunity Mapping", d: "We identify operational bottlenecks, communication gaps, repetitive tasks, and areas where technology can create measurable value.", icon: <Target size={20} strokeWidth={1.5} /> },
    { n: "03", t: "Solution Design", d: "Not every challenge requires AI. Sometimes the answer is a better workflow. Sometimes it is automation. Sometimes it is a custom platform.", icon: <Layers size={20} strokeWidth={1.5} /> },
    { n: "04", t: "Build and Deploy", d: "We implement practical systems that work within your business rather than forcing your business to adapt to the technology.", icon: <Zap size={20} strokeWidth={1.5} /> },
    { n: "05", t: "Continuous Improvement", d: "We measure results, optimize performance, and evolve systems as your business grows.", icon: <BarChart3 size={20} strokeWidth={1.5} /> },
  ];

  return (
    <Section id="process">
      <Reveal><Label text="Our Process" /><Title>How we work</Title></Reveal>
      <div className="es-steps">
        {steps.map((s, i) => (
          <Reveal key={i} delay={i * 80}>
            <div className="es-step">
              <div className="es-step-left">
                <div className="es-step-icon">{s.icon}</div>
                <span className="es-step-num">{s.n}</span>
              </div>
              <div className="es-step-body">
                <h3 className="es-step-title">{s.t}</h3>
                <p className="es-step-desc">{s.d}</p>
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
  { icon: <Cpu size={22} strokeWidth={1.5} />, t: "AI Integration", d: "We identify where AI can create measurable value and integrate intelligent systems directly into existing business operations.", tg: ["AI", "Automation", "APIs"] },
  { icon: <GitBranch size={22} strokeWidth={1.5} />, t: "Workflow Automation", d: "We eliminate repetitive tasks, reduce operational friction, and build workflows that scale.", tg: ["Workflow", "Efficiency", "Systems"] },
  { icon: <Shield size={22} strokeWidth={1.5} />, t: "Custom AI Systems", d: "Every business is different. We design and deploy custom AI tools tailored to specific operational needs, processes, and goals.", tg: ["Custom Tools", "Platforms", "SaaS"] },
  { icon: <Globe size={22} strokeWidth={1.5} />, t: "Digital Transformation", d: "We help businesses modernize their online presence, communication systems, recruitment processes, and internal operations.", tg: ["LinkedIn", "Web", "Content", "Recruitment"] },
];

function ServicesHome({ setPage }) {
  return (
    <Section id="services">
      <div className="es-services-header">
        <Reveal>
          <Label text="What We Do" />
          <Title>Smarter systems,<br />built with purpose</Title>
        </Reveal>
        <Reveal delay={100}>
          <a onClick={() => { setPage("services"); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="es-link-arrow" style={{ cursor: "pointer" }}>
            All Services <ArrowRight size={13} strokeWidth={2} />
          </a>
        </Reveal>
      </div>

      <Stagger className="es-services-grid" delay={80}>
        {serviceData.map((s, i) => (
          <MagneticWrap key={i} strength={0.15}>
            <div className="es-card es-service-card">
              <div className="es-card-border" />
              <div className="es-service-icon">{s.icon}</div>
              <h3 className="es-service-title">{s.t}</h3>
              <p className="es-service-desc">{s.d}</p>
              <div className="es-tags">{s.tg.map((t, j) => <Tag key={j} t={t} />)}</div>
            </div>
          </MagneticWrap>
        ))}
      </Stagger>
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
    <Reveal delay={i * 70}>
      <div className={`es-card es-case${open ? " es-case--open" : ""}`} onClick={() => setOpen(!open)} style={{ cursor: "pointer" }}>
        <div className="es-card-border" />
        <div className="es-case-header">
          <div style={{ flex: 1 }}>
            <span className="es-case-tag">{cs.tag}</span>
            <h3 className="es-case-title">{cs.title}</h3>
            <p className="es-case-hook">{cs.hook}</p>
          </div>
          <div className="es-case-toggle">
            {open ? <ChevronUp size={16} strokeWidth={1.5} /> : <ChevronDown size={16} strokeWidth={1.5} />}
          </div>
        </div>
        <div className={`es-case-body${open ? " open" : ""}`}>
          <div className="es-case-columns">
            <div>
              <span className="es-case-label">The Challenge</span>
              <p className="es-case-text">{cs.ch}</p>
            </div>
            <div>
              <span className="es-case-label">What We Built</span>
              <p className="es-case-text">{cs.sol}</p>
            </div>
          </div>
          <div className="es-case-results">
            <span className="es-case-label">Results</span>
            <div className="es-results-list">
              {cs.res.map((r, j) => (
                <div key={j} className="es-result-item">
                  <div className="es-result-dot" />
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
      <Reveal><Label text="Selected Work" /><Title>Projects that speak<br />for themselves</Title></Reveal>
      <Reveal delay={80}><Desc>Real challenges, real systems, measurable results</Desc></Reveal>
      <div className="es-cases">{cases.map((c, i) => <CaseCard key={i} cs={c} i={i} />)}</div>
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
      <Reveal><Label text="Experience" /><Title>Where we've worked</Title></Reveal>
      <Stagger className="es-exp-list" delay={100}>
        {exp.map((e, i) => (
          <MagneticWrap key={i} strength={0.12}>
            <div className="es-card es-exp-card">
              <div className="es-card-border" />
              <div className="es-exp-num">0{i + 1}</div>
              <div className="es-exp-main">
                <div className="es-exp-header">
                  <div>
                    <h3 className="es-exp-company">{e.co}</h3>
                    <p className="es-exp-role">{e.role}</p>
                  </div>
                  <div className="es-exp-meta">
                    <span className="es-exp-meta-item"><MapPin size={11} strokeWidth={1.5} />{e.loc}</span>
                    <span className="es-exp-meta-item"><Calendar size={11} strokeWidth={1.5} />{e.yr}</span>
                  </div>
                </div>
                <p className="es-exp-desc">{e.d}</p>
                <div className="es-tags">{e.tg.map((t, j) => <Tag key={j} t={t} />)}</div>
              </div>
            </div>
          </MagneticWrap>
        ))}
      </Stagger>
    </Section>
  );
}

/* ═══════════════ CONTACT ═══════════════ */
function Contact() {
  return (
    <Section id="contact" className="es-contact-section">
      <div className="es-contact-glow" />
      <Reveal>
        <div className="es-contact-box">
          <Label text="Contact" />
          <Title>Let's Build Something</Title>
          <Desc>Have an idea, a broken workflow, or a business that needs AI? Let's talk.</Desc>

          <div className="es-contact-email">
            <Mail size={16} strokeWidth={1.5} />
            <a href="mailto:bereket@evrielsystems.com" className="es-contact-email-text">bereket@evrielsystems.com</a>
          </div>

          <div className="es-contact-actions">
            <MagneticWrap>
              <a href="mailto:bereket@evrielsystems.com" className="es-btn es-btn--primary">
                <Mail size={14} strokeWidth={2} /> Send Email
              </a>
            </MagneticWrap>
            <MagneticWrap>
              <a href="https://www.linkedin.com/in/bereket-teshome-b71247194" target="_blank" rel="noopener noreferrer" className="es-btn es-btn--outline">
                <Linkedin size={14} strokeWidth={2} /> LinkedIn
              </a>
            </MagneticWrap>
          </div>

          <p className="es-contact-location">Based in Italy. Worked internationally.</p>
        </div>
      </Reveal>
    </Section>
  );
}

/* ═══════════════ FOOTER ═══════════════ */
function Footer() {
  return (
    <footer className="es-footer">
      <div className="es-footer-left">
        <div className="es-logo-icon" style={{ width: 28, height: 28 }}><LogoMark size={13} /></div>
        <span>Evriel Systems</span>
      </div>
      <div className="es-footer-right">
        <p>&copy; 2026 Evriel Systems</p>
        <p className="es-footer-tagline">Built with purpose.</p>
      </div>
    </footer>
  );
}

/* ═══════════════ SERVICES PAGE ═══════════════ */
function ServicesPage({ setPage }) {
  const fullServices = [
    { icon: <Cpu size={24} strokeWidth={1.5} />, t: "AI Integration", intro: "We identify where AI can create measurable value and integrate intelligent systems directly into existing business operations.", pts: ["Operational analysis to find high-value AI opportunities", "Integration of intelligent systems into existing tools", "Document and communication processing", "Decision-support and data structuring", "Production deployment within your infrastructure"], tg: ["AI", "Automation", "APIs"] },
    { icon: <GitBranch size={24} strokeWidth={1.5} />, t: "Workflow Automation", intro: "We eliminate repetitive tasks, reduce operational friction, and build workflows that scale.", pts: ["Mapping of manual and repetitive processes", "Automated handoffs between teams and tools", "Approval and review workflow design", "Reduction of operational bottlenecks", "Scalable systems that grow with the business"], tg: ["Workflow", "Efficiency", "Systems"] },
    { icon: <Shield size={24} strokeWidth={1.5} />, t: "Custom AI Systems", intro: "Every business is different. We design and deploy custom AI tools tailored to specific operational needs, processes, and goals.", pts: ["Tailored tools built around your operations", "Internal platforms and dashboards", "Industry-specific intelligent systems", "End-to-end design and deployment", "Ongoing refinement as needs evolve"], tg: ["Custom Tools", "Platforms", "SaaS"] },
    { icon: <Globe size={24} strokeWidth={1.5} />, t: "Digital Transformation", intro: "We help businesses modernize their online presence, communication systems, recruitment processes, and internal operations.", pts: ["Professional online presence and positioning", "Communication and content systems", "Recruitment and talent processes", "Internal operations modernization", "Brand and market positioning"], tg: ["LinkedIn", "Web", "Content", "Recruitment"] },
  ];

  return (
    <div style={{ position: "relative", zIndex: 2 }}>
      <div className="es-page-header">
        <a onClick={() => { setPage("home"); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="es-back" style={{ cursor: "pointer" }}>
          <ArrowLeft size={13} strokeWidth={2} /> Back to Home
        </a>
        <Label text="Services" />
        <Title>What we offer</Title>
        <Desc>Practical AI integration and business transformation services</Desc>
      </div>

      {fullServices.map((s, i) => (
        <Reveal key={i} delay={i * 60}>
          <div className="es-section es-service-full">
            <div className="es-sf-grid">
              <div>
                <div className="es-sf-icon">{s.icon}</div>
                <h3 className="es-sf-title">{s.t}</h3>
                <p className="es-sf-intro">{s.intro}</p>
                <div className="es-tags">{s.tg.map((t, j) => <Tag key={j} t={t} />)}</div>
              </div>
              <div className="es-card es-sf-card">
                <div className="es-card-border" />
                <span className="es-case-label">What's Included</span>
                <div className="es-sf-points">
                  {s.pts.map((p, j) => (
                    <div key={j} className="es-sf-point">
                      <span className="es-sf-dash">—</span>
                      <span>{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {i < fullServices.length - 1 && <Divider />}
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
      <div className="es-page-header">
        <a onClick={() => { setPage("home"); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="es-back" style={{ cursor: "pointer" }}>
          <ArrowLeft size={13} strokeWidth={2} /> Back to Home
        </a>
        <Label text="Insights" />
        <Title>Thoughts on AI &amp; Business</Title>
        <Desc>Ideas and perspectives on building practical systems</Desc>
      </div>

      <Stagger className="es-insights-grid es-section" delay={90}>
        {articles.map((a, i) => (
          <MagneticWrap key={i} strength={0.12}>
            <div className="es-card es-insight-card">
              <div className="es-card-border" />
              <span className="es-insight-year">{a.y}</span>
              <h3 className="es-insight-title">{a.t}</h3>
              <p className="es-insight-desc">{a.d}</p>
              <div className="es-tags">{a.tg.map((t, j) => <Tag key={j} t={t} />)}</div>
              <div className="es-insight-arrow"><ArrowUpRight size={16} strokeWidth={1.5} /></div>
            </div>
          </MagneticWrap>
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
      <Divider />
      <About />
      <Divider />
      <Process />
      <Divider />
      <ServicesHome setPage={setPage} />
      <Divider />
      <CaseStudies />
      <Divider />
      <Experience />
      <Divider />
      <Contact />
      <Footer />
    </>
  );
}

/* ═══════════════ APP ═══════════════ */
export default function App() {
  const [page, setPage] = useState("home");

  return (
    <>
      <style>{`
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap');

:root {
  --bg: #060608;
  --bg-elevated: #0c0c10;
  --surface: #111116;
  --surface-hover: #16161c;
  --text-primary: #f0f0f3;
  --text-secondary: #a8a8b3;
  --text-tertiary: #6e6e7a;
  --text-quaternary: #4a4a54;
  --accent: #4d7cff;
  --accent-soft: rgba(77, 124, 255, 0.12);
  --accent-text: rgba(77, 124, 255, 0.85);
  --border: rgba(255, 255, 255, 0.06);
  --border-hover: rgba(255, 255, 255, 0.1);
  --border-accent: rgba(77, 124, 255, 0.2);
  --heading: 'Playfair Display', Georgia, serif;
  --body: 'Inter', -apple-system, system-ui, sans-serif;
  --ease: cubic-bezier(0.22, 1, 0.36, 1);
  --spring: cubic-bezier(0.34, 1.56, 0.64, 1);
}

*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
html { scroll-behavior: smooth; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
body { background: var(--bg); color: var(--text-primary); font-family: var(--body); overflow-x: hidden; }
a { text-decoration: none; color: inherit; }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}

/* ═══ CARD SYSTEM ═══ */
.es-card {
  position: relative;
  background: var(--surface);
  border-radius: 16px;
  overflow: hidden;
  transition: background 0.4s var(--ease), box-shadow 0.4s var(--ease);
}
.es-card:hover {
  background: var(--surface-hover);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
}
.es-card-border {
  position: absolute;
  inset: 0;
  border-radius: 16px;
  border: 1px solid var(--border);
  pointer-events: none;
  transition: border-color 0.4s var(--ease);
}
.es-card:hover .es-card-border { border-color: var(--border-hover); }

/* ═══ NAVBAR ═══ */
.es-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  padding: 18px 0;
  transition: all 0.5s var(--ease);
}
.es-nav--scrolled {
  padding: 10px 0;
  background: rgba(6, 6, 8, 0.92);
  backdrop-filter: blur(24px) saturate(1.3);
  border-bottom: 1px solid var(--border);
}
.es-nav-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.es-logo {
  display: flex;
  align-items: center;
  gap: 10px;
}
.es-logo-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border-hover);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.02);
  color: var(--accent-text);
  transition: border-color 0.3s var(--ease), background 0.3s var(--ease);
}
.es-logo:hover .es-logo-icon { border-color: var(--border-accent); background: var(--accent-soft); }
.es-logo-name {
  font-family: var(--heading);
  font-size: 17px;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: 0.04em;
  line-height: 1.1;
}
.es-logo-sub {
  font-family: var(--body);
  font-size: 8px;
  color: var(--text-quaternary);
  letter-spacing: 0.3em;
  font-weight: 400;
  text-transform: uppercase;
}
.es-nav-links {
  display: flex;
  gap: 2px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border);
  border-radius: 100px;
  padding: 3px;
}
.es-nav-link {
  font-family: var(--body);
  font-size: 12.5px;
  color: var(--text-tertiary);
  padding: 7px 18px;
  border-radius: 100px;
  transition: all 0.25s var(--ease);
  cursor: pointer;
  font-weight: 400;
  letter-spacing: 0.01em;
}
.es-nav-link:hover, .es-nav-link.active {
  color: var(--text-primary);
  background: rgba(255, 255, 255, 0.06);
}
.es-nav-cta {
  font-family: var(--body);
  font-size: 12.5px;
  padding: 8px 22px;
  border: 1px solid var(--border-hover);
  border-radius: 100px;
  color: var(--text-secondary);
  transition: all 0.3s var(--ease);
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  font-weight: 400;
}
.es-nav-cta:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.18);
  color: var(--text-primary);
}

/* Mobile Nav */
.es-mobile-toggle {
  display: none;
  background: none;
  border: none;
  padding: 8px;
  flex-direction: column;
  gap: 5px;
  cursor: pointer;
}
.es-mobile-toggle span {
  width: 20px;
  height: 1.5px;
  background: var(--text-secondary);
  display: block;
  transition: all 0.3s var(--ease);
  transform-origin: center;
}
.es-mobile-toggle span.open:nth-child(1) { transform: rotate(45deg) translate(4px, 5px); }
.es-mobile-toggle span.open:nth-child(2) { opacity: 0; }
.es-mobile-toggle span.open:nth-child(3) { transform: rotate(-45deg) translate(4px, -5px); }
.es-mobile-menu {
  padding: 20px 32px 28px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  background: rgba(6, 6, 8, 0.97);
  backdrop-filter: blur(20px);
  border-top: 1px solid var(--border);
}
.es-mobile-link {
  font-family: var(--body);
  font-size: 15px;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 10px 0;
  transition: color 0.2s;
}
.es-mobile-link:hover { color: var(--text-primary); }
@media (max-width: 768px) {
  .es-nav-links, .es-nav-cta { display: none !important; }
  .es-mobile-toggle { display: flex !important; }
}

/* ═══ HERO ═══ */
.es-hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 140px 24px 0;
  overflow: hidden;
}
.es-hero-glow {
  position: absolute;
  top: -15%;
  left: 50%;
  transform: translateX(-50%);
  width: 1000px;
  height: 700px;
  background: radial-gradient(ellipse 45% 45% at 50% 40%, rgba(77, 124, 255, 0.08), rgba(40, 60, 120, 0.04) 50%, transparent 72%);
  pointer-events: none;
  filter: blur(30px);
}
.es-hero-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.012) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.012) 1px, transparent 1px);
  background-size: 80px 80px;
  mask-image: radial-gradient(ellipse at center, rgba(0, 0, 0, 0.3) 10%, transparent 50%);
  -webkit-mask-image: radial-gradient(ellipse at center, rgba(0, 0, 0, 0.3) 10%, transparent 50%);
}
.es-hero-content {
  position: relative;
  z-index: 2;
  max-width: 800px;
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 1s var(--ease), transform 1.2s var(--ease);
}
.es-hero-content.entered { opacity: 1; transform: translateY(0); }

.es-hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 6px 20px;
  border-radius: 100px;
  margin-bottom: 32px;
  border: 1px solid var(--border-hover);
  background: rgba(255, 255, 255, 0.02);
}
.es-hero-pulse {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 14px rgba(77, 124, 255, 0.5);
  animation: esPulse 3s ease-in-out infinite;
}
@keyframes esPulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.6); }
}
.es-hero-badge span {
  font-family: var(--body);
  font-size: 10px;
  color: var(--text-secondary);
  letter-spacing: 0.22em;
  font-weight: 500;
}
.es-h1 { margin: 0; line-height: 0.88; }
.es-h1-line {
  display: block;
  font-family: var(--heading);
  letter-spacing: 0.02em;
}
.es-h1-line--1 {
  font-size: clamp(72px, 14vw, 160px);
  font-weight: 500;
  background: linear-gradient(180deg, #ffffff 20%, #7a7a8a 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.es-h1-line--2 {
  font-size: clamp(12px, 2.2vw, 20px);
  font-weight: 400;
  letter-spacing: 0.65em;
  color: var(--text-tertiary);
  font-family: var(--body);
  margin-top: 6px;
}
.es-hero-tagline {
  font-family: var(--heading);
  font-size: clamp(18px, 2.6vw, 26px);
  font-style: italic;
  color: rgba(77, 124, 255, 0.7);
  margin: 28px 0 0;
  font-weight: 400;
}
.es-hero-desc {
  font-family: var(--body);
  font-size: clamp(14px, 1.4vw, 15.5px);
  line-height: 1.85;
  color: var(--text-secondary);
  font-weight: 300;
  margin: 20px auto 0;
  max-width: 540px;
}
.es-hero-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 40px;
  flex-wrap: wrap;
}

/* Buttons */
.es-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 30px;
  border-radius: 100px;
  font-family: var(--body);
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.02em;
  transition: all 0.35s var(--ease);
  cursor: pointer;
  border: none;
}
.es-btn--primary {
  background: #fff;
  color: #060608;
}
.es-btn--primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(255, 255, 255, 0.1);
}
.es-btn--outline {
  background: transparent;
  border: 1px solid var(--border-hover);
  color: var(--text-secondary);
}
.es-btn--outline:hover {
  border-color: rgba(255, 255, 255, 0.22);
  color: var(--text-primary);
  transform: translateY(-2px);
}

/* Marquee */
.es-hero-marquee {
  position: relative;
  z-index: 2;
  width: 100vw;
  margin-top: 72px;
  overflow: hidden;
  opacity: 0;
  transition: opacity 1.2s ease 0.8s;
  mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent);
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent);
}
.es-hero-marquee.entered { opacity: 0.4; }
.es-marquee-track {
  display: flex;
  width: max-content;
  animation: esMarquee 50s linear infinite;
}
.es-marquee-inner { display: flex; }
.es-marquee-item {
  font-family: var(--body);
  font-size: 13px;
  color: var(--text-tertiary);
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
}
.es-marquee-dot {
  display: inline-block;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: var(--accent-text);
  margin: 0 28px;
  opacity: 0.5;
}
@keyframes esMarquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }

/* Scroll Indicator */
.es-scroll-hint {
  position: absolute;
  bottom: 28px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  opacity: 0;
  transition: opacity 1.2s ease 1.2s;
  z-index: 3;
}
.es-scroll-hint.entered { opacity: 0.35; }
.es-scroll-hint span {
  font-family: var(--body);
  font-size: 8px;
  letter-spacing: 0.4em;
  color: var(--text-quaternary);
}
.es-scroll-line {
  width: 1px;
  height: 30px;
  background: var(--border-hover);
  position: relative;
  overflow: hidden;
}
.es-scroll-dot {
  width: 1px;
  height: 10px;
  background: var(--accent);
  position: absolute;
  top: -10px;
  animation: esScrollDot 3s ease-in-out infinite;
}
@keyframes esScrollDot { 0% { top: -10px; } 100% { top: 30px; } }
@media (max-width: 768px) {
  .es-scroll-hint, .es-hero-marquee { display: none; }
  .es-hero { padding-bottom: 60px; }
}

/* ═══ SECTIONS ═══ */
.es-section {
  padding: clamp(80px, 10vw, 130px) 24px;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}
.es-label {
  font-family: var(--body);
  font-size: 10px;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--accent-text);
  font-weight: 500;
  margin-bottom: 18px;
}
.es-title {
  font-family: var(--heading);
  font-size: clamp(34px, 5vw, 56px);
  font-weight: 400;
  color: var(--text-primary);
  margin: 0 0 16px;
  line-height: 1.06;
  letter-spacing: 0.005em;
}
.es-desc {
  font-family: var(--body);
  font-size: 14.5px;
  color: var(--text-tertiary);
  font-weight: 300;
  margin: 0 0 48px;
  max-width: 460px;
  line-height: 1.8;
}
.es-divider {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  position: relative;
  z-index: 2;
}
.es-divider-line {
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--border-hover), transparent);
}

/* Tags */
.es-tag {
  font-family: var(--body);
  font-size: 10px;
  color: var(--text-tertiary);
  padding: 4px 12px;
  border-radius: 100px;
  border: 1px solid var(--border);
  background: transparent;
  letter-spacing: 0.03em;
  font-weight: 400;
  white-space: nowrap;
}
.es-tags { display: flex; gap: 6px; flex-wrap: wrap; }
.es-link-arrow {
  font-family: var(--body);
  font-size: 13px;
  color: var(--text-tertiary);
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: color 0.25s;
  cursor: pointer;
}
.es-link-arrow:hover { color: var(--text-primary); }

/* ═══ ABOUT ═══ */
.es-about-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: start;
}
.es-body {
  font-family: var(--body);
  font-size: 15px;
  line-height: 1.9;
  color: var(--text-secondary);
  font-weight: 300;
  margin: 0 0 18px;
}
.es-body--muted { color: var(--text-tertiary); }

.es-stats {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 32px;
  margin-top: 60px;
  padding-top: 48px;
  border-top: 1px solid var(--border);
}
.es-stat { text-align: center; }
.es-stat-value {
  font-family: var(--heading);
  font-size: 28px;
  font-weight: 500;
  color: var(--text-primary);
  display: block;
  letter-spacing: 0.02em;
}
.es-stat-label {
  font-family: var(--body);
  font-size: 12px;
  color: var(--text-tertiary);
  font-weight: 300;
  margin-top: 4px;
  display: block;
}
.es-stat-sep {
  width: 1px;
  height: 40px;
  background: var(--border-hover);
}
@media (max-width: 768px) {
  .es-about-grid { grid-template-columns: 1fr; gap: 28px; }
  .es-stats { flex-direction: column; gap: 24px; }
  .es-stat-sep { width: 40px; height: 1px; }
}

/* ═══ PROCESS / STEPS ═══ */
.es-steps {
  display: flex;
  flex-direction: column;
  margin-top: 24px;
}
.es-step {
  display: grid;
  grid-template-columns: 100px 1fr;
  gap: 36px;
  padding: 36px 0;
  border-top: 1px solid var(--border);
  align-items: start;
  transition: background 0.3s var(--ease);
}
.es-step:last-child { border-bottom: 1px solid var(--border); }
.es-step:hover { background: rgba(255, 255, 255, 0.01); }
.es-step-left {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}
.es-step-icon {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: var(--accent-soft);
  border: 1px solid var(--border-accent);
  color: var(--accent);
  transition: all 0.3s var(--ease);
}
.es-step:hover .es-step-icon { background: rgba(77, 124, 255, 0.18); }
.es-step-num {
  font-family: var(--body);
  font-size: 11px;
  color: var(--text-quaternary);
  font-weight: 500;
  letter-spacing: 0.1em;
}
.es-step-title {
  font-family: var(--heading);
  font-size: clamp(22px, 2.6vw, 28px);
  font-weight: 500;
  color: var(--text-primary);
  margin: 0 0 10px;
}
.es-step-desc {
  font-family: var(--body);
  font-size: 14.5px;
  line-height: 1.8;
  color: var(--text-tertiary);
  font-weight: 300;
  margin: 0;
  max-width: 600px;
}
@media (max-width: 768px) {
  .es-step { grid-template-columns: 1fr; gap: 12px; padding: 28px 0; }
  .es-step-left { flex-direction: row; justify-content: flex-start; }
}

/* ═══ SERVICES GRID ═══ */
.es-services-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 48px;
}
.es-services-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}
.es-service-card {
  padding: 40px 36px;
  display: flex;
  flex-direction: column;
  height: 100%;
}
.es-service-icon {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  background: var(--accent-soft);
  border: 1px solid var(--border-accent);
  color: var(--accent);
  margin-bottom: 28px;
  transition: all 0.3s var(--ease);
}
.es-service-card:hover .es-service-icon { background: rgba(77, 124, 255, 0.18); }
.es-service-title {
  font-family: var(--heading);
  font-size: 25px;
  font-weight: 500;
  color: var(--text-primary);
  margin: 0 0 12px;
}
.es-service-desc {
  font-family: var(--body);
  font-size: 14px;
  line-height: 1.78;
  color: var(--text-secondary);
  font-weight: 300;
  margin: 0 0 24px;
  flex: 1;
}
@media (max-width: 768px) { .es-services-grid { grid-template-columns: 1fr; } }

/* ═══ CASES ═══ */
.es-cases { display: flex; flex-direction: column; gap: 12px; }
.es-case { padding: 28px 32px; }
.es-case--open { background: var(--surface-hover) !important; }
.es-case-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}
.es-case-tag {
  font-family: var(--body);
  font-size: 9.5px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--accent-text);
  font-weight: 600;
  display: block;
  margin-bottom: 10px;
}
.es-case-title {
  font-family: var(--heading);
  font-size: clamp(22px, 3vw, 30px);
  font-weight: 500;
  color: var(--text-primary);
  margin: 0 0 6px;
}
.es-case-hook {
  font-family: var(--body);
  font-size: 14px;
  color: var(--text-secondary);
  font-weight: 300;
  font-style: italic;
  margin: 0;
}
.es-case-toggle {
  color: var(--text-tertiary);
  flex-shrink: 0;
  margin-top: 4px;
  transition: color 0.2s;
}
.es-case:hover .es-case-toggle { color: var(--text-secondary); }
.es-case-body {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.6s var(--ease);
}
.es-case-body.open { max-height: 700px; }
.es-case-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  padding-top: 24px;
  margin-top: 22px;
  border-top: 1px solid var(--border);
}
.es-case-label {
  font-family: var(--body);
  font-size: 9.5px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--accent-text);
  font-weight: 600;
  display: block;
  margin-bottom: 12px;
}
.es-case-text {
  font-family: var(--body);
  font-size: 13.5px;
  line-height: 1.8;
  color: var(--text-secondary);
  font-weight: 300;
  margin: 0;
}
.es-case-results { margin-top: 24px; }
.es-results-list { display: flex; flex-direction: column; }
.es-result-item {
  display: flex;
  align-items: center;
  gap: 14px;
  font-family: var(--body);
  font-size: 13.5px;
  line-height: 1.55;
  color: var(--text-secondary);
  font-weight: 300;
  padding: 12px 0;
  border-bottom: 1px solid var(--border);
}
.es-result-item:last-child { border-bottom: none; }
.es-result-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--accent);
  flex-shrink: 0;
  opacity: 0.6;
}
@media (max-width: 768px) { .es-case-columns { grid-template-columns: 1fr; gap: 20px; } }

/* ═══ EXPERIENCE ═══ */
.es-exp-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 36px;
}
.es-exp-card {
  padding: 32px;
  display: flex;
  gap: 24px;
  align-items: flex-start;
}
.es-exp-num {
  font-family: var(--heading);
  font-size: 26px;
  color: rgba(77, 124, 255, 0.25);
  font-weight: 500;
  line-height: 1;
  flex-shrink: 0;
  padding-top: 2px;
}
.es-exp-main { flex: 1; }
.es-exp-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 12px;
}
.es-exp-company {
  font-family: var(--heading);
  font-size: 23px;
  font-weight: 500;
  color: var(--text-primary);
  margin: 0;
}
.es-exp-role {
  font-family: var(--body);
  font-size: 13px;
  color: var(--accent-text);
  margin: 5px 0 0;
  font-weight: 400;
}
.es-exp-meta { display: flex; gap: 14px; flex-wrap: wrap; }
.es-exp-meta-item {
  font-family: var(--body);
  font-size: 11px;
  color: var(--text-tertiary);
  display: flex;
  align-items: center;
  gap: 4px;
}
.es-exp-desc {
  font-family: var(--body);
  font-size: 14px;
  line-height: 1.78;
  color: var(--text-secondary);
  font-weight: 300;
  margin: 14px 0 0;
}
@media (max-width: 768px) {
  .es-exp-card { gap: 16px; padding: 24px; }
  .es-exp-num { font-size: 20px; }
}

/* ═══ CONTACT ═══ */
.es-contact-section { text-align: center; }
.es-contact-section .es-label { display: inline-block; }
.es-contact-section .es-title,
.es-contact-section .es-desc { margin-left: auto; margin-right: auto; }
.es-contact-glow {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 600px;
  height: 300px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(77, 124, 255, 0.06), transparent 65%);
  pointer-events: none;
  filter: blur(50px);
}
.es-contact-box {
  position: relative;
  z-index: 2;
  padding: 64px 44px;
  background: linear-gradient(168deg, rgba(17, 17, 22, 0.85), rgba(10, 10, 14, 0.8));
  border: 1px solid var(--border-hover);
  border-radius: 24px;
}
.es-contact-email {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 28px;
  padding: 10px 24px;
  border-radius: 100px;
  background: var(--accent-soft);
  border: 1px solid var(--border-accent);
  color: var(--accent);
}
.es-contact-email-text {
  font-family: var(--body);
  font-size: 14px;
  color: var(--text-secondary);
  font-weight: 400;
  letter-spacing: 0.02em;
  transition: color 0.2s;
}
.es-contact-email:hover .es-contact-email-text { color: var(--text-primary); }
.es-contact-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}
.es-contact-location {
  font-family: var(--body);
  font-size: 12px;
  color: var(--text-quaternary);
  margin-top: 28px;
  font-weight: 300;
}

/* ═══ FOOTER ═══ */
.es-footer {
  max-width: 1200px;
  margin: 0 auto;
  padding: 36px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  position: relative;
  z-index: 2;
  border-top: 1px solid var(--border);
}
.es-footer-left {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: var(--heading);
  font-size: 15px;
  color: var(--text-secondary);
  letter-spacing: 0.04em;
}
.es-footer-left .es-logo-icon { color: var(--accent-text); }
.es-footer-right { text-align: right; }
.es-footer-right p {
  font-family: var(--body);
  font-size: 11px;
  color: var(--text-quaternary);
  font-weight: 300;
  margin: 0;
}
.es-footer-tagline {
  font-family: var(--heading) !important;
  font-size: 12px !important;
  color: var(--accent-text) !important;
  font-style: italic;
  margin-top: 3px !important;
}

/* ═══ SUB PAGES ═══ */
.es-page-header {
  max-width: 1200px;
  margin: 0 auto;
  padding: 130px 24px 0;
  position: relative;
  z-index: 2;
}
.es-back {
  font-family: var(--body);
  font-size: 12.5px;
  color: var(--text-tertiary);
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 32px;
  transition: color 0.25s;
  cursor: pointer;
}
.es-back:hover { color: var(--text-primary); }
.es-service-full { padding-top: 56px !important; padding-bottom: 56px !important; }
.es-sf-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: start;
}
.es-sf-icon {
  width: 54px;
  height: 54px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  background: var(--accent-soft);
  border: 1px solid var(--border-accent);
  color: var(--accent);
  margin-bottom: 22px;
}
.es-sf-title {
  font-family: var(--heading);
  font-size: 28px;
  font-weight: 500;
  color: var(--text-primary);
  margin: 0 0 12px;
}
.es-sf-intro {
  font-family: var(--body);
  font-size: 14.5px;
  line-height: 1.8;
  color: var(--text-secondary);
  font-weight: 300;
  margin: 0 0 18px;
}
.es-sf-card { padding: 36px; }
.es-sf-points {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 8px;
}
.es-sf-point {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  font-family: var(--body);
  font-size: 13.5px;
  color: var(--text-secondary);
  font-weight: 300;
  line-height: 1.6;
}
.es-sf-dash { color: var(--accent-text); flex-shrink: 0; }
@media (max-width: 768px) { .es-sf-grid { grid-template-columns: 1fr; gap: 24px; } }

/* Insights Page */
.es-insights-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
}
.es-insight-card {
  padding: 34px 30px;
  position: relative;
  cursor: pointer;
}
.es-insight-year {
  font-family: var(--body);
  font-size: 10.5px;
  color: var(--accent-text);
  letter-spacing: 0.1em;
  font-weight: 400;
}
.es-insight-title {
  font-family: var(--heading);
  font-size: 22px;
  font-weight: 500;
  color: var(--text-primary);
  margin: 12px 0;
  line-height: 1.28;
  padding-right: 32px;
}
.es-insight-desc {
  font-family: var(--body);
  font-size: 13.5px;
  line-height: 1.78;
  color: var(--text-secondary);
  font-weight: 300;
  margin: 0 0 18px;
}
.es-insight-arrow {
  position: absolute;
  top: 32px;
  right: 28px;
  color: var(--text-quaternary);
  transition: all 0.3s var(--ease);
}
.es-insight-card:hover .es-insight-arrow {
  color: var(--accent);
  transform: translate(2px, -2px);
}
@media (max-width: 768px) { .es-insights-grid { grid-template-columns: 1fr; } }
      `}</style>

      <Nav page={page} setPage={setPage} />
      {page === "home" && <Home setPage={setPage} />}
      {page === "services" && <><ServicesPage setPage={setPage} /><Footer /></>}
      {page === "insights" && <><InsightsPage setPage={setPage} /><Footer /></>}
    </>
  );
}

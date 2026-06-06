import { useState, useEffect, useRef, useCallback } from "react";
import { Mail, ArrowRight, ArrowUpRight, ChevronDown, MapPin, Cpu, GitBranch, Layers, Zap, Target, BarChart3, Shield, Globe, Users, ExternalLink, Minus, Plus, Menu, X } from "lucide-react";

const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

function useReveal(threshold = 0.08) {
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

function Reveal({ children, className = "", style = {}, delay = 0, direction = "up" }) {
  const [ref, visible] = useReveal(0.06);
  const transforms = {
    up: "translateY(100px)",
    down: "translateY(-100px)",
    left: "translateX(100px)",
    right: "translateX(-100px)",
    scale: "scale(0.85)",
    none: "none",
  };
  return (
    <div ref={ref} className={className} style={{
      ...style,
      opacity: visible ? 1 : 0,
      transform: visible ? "translate3d(0,0,0) scale(1)" : transforms[direction],
      transition: `opacity 1.4s ${EASE} ${delay}ms, transform 1.4s ${EASE} ${delay}ms`,
    }}>{children}</div>
  );
}

function Stagger({ children, className = "", style = {}, delay = 120 }) {
  const [ref, visible] = useReveal(0.05);
  return (
    <div ref={ref} className={className} style={style}>
      {Array.isArray(children) ? children.map((child, i) => (
        <div key={i} style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(70px)",
          transition: `opacity 1.2s ${EASE} ${i * delay}ms, transform 1.2s ${EASE} ${i * delay}ms`
        }}>{child}</div>
      )) : children}
    </div>
  );
}

function TextReveal({ text, tag = "h2", className = "", style = {}, delay = 0, dark = false }) {
  const [ref, visible] = useReveal(0.1);
  const Tag = tag;
  return (
    <div ref={ref} style={{ overflow: "hidden" }}>
      <Tag className={className} style={{
        ...style,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(100%)",
        transition: `opacity 1s ${EASE} ${delay}ms, transform 1.2s ${EASE} ${delay}ms`,
      }}>{text}</Tag>
    </div>
  );
}

function LineReveal({ delay = 0, dark = false, width = "100%" }) {
  const [ref, visible] = useReveal(0.1);
  return (
    <div ref={ref} style={{ overflow: "hidden", width }}>
      <div style={{
        height: 1,
        background: dark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)",
        transform: visible ? "scaleX(1)" : "scaleX(0)",
        transformOrigin: "left",
        transition: `transform 1.6s ${EASE} ${delay}ms`,
      }} />
    </div>
  );
}

const LogoMark = ({ size = 48, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 8L12 28V72L50 92L88 72V28L50 8Z" stroke={color} strokeWidth="2" strokeLinejoin="round" />
    <path d="M50 28L30 38V62L50 72L70 62V38L50 28Z" stroke={color} strokeWidth="1.4" strokeLinejoin="round" />
    <line x1="50" y1="8" x2="50" y2="28" stroke={color} strokeWidth="0.8" opacity="0.5" />
    <line x1="88" y1="28" x2="70" y2="38" stroke={color} strokeWidth="0.8" opacity="0.5" />
    <line x1="88" y1="72" x2="70" y2="62" stroke={color} strokeWidth="0.8" opacity="0.5" />
    <line x1="50" y1="92" x2="50" y2="72" stroke={color} strokeWidth="0.8" opacity="0.5" />
    <line x1="12" y1="72" x2="30" y2="62" stroke={color} strokeWidth="0.8" opacity="0.5" />
    <line x1="12" y1="28" x2="30" y2="38" stroke={color} strokeWidth="0.8" opacity="0.5" />
    <path d="M50 28L30 50L50 72L70 50L50 28Z" stroke={color} strokeWidth="0.7" opacity="0.25" strokeLinejoin="round" />
    <circle cx="50" cy="8" r="3.5" fill={color} />
    <circle cx="88" cy="28" r="3.5" fill={color} />
    <circle cx="88" cy="72" r="3.5" fill={color} />
    <circle cx="50" cy="92" r="3.5" fill={color} />
    <circle cx="12" cy="72" r="3.5" fill={color} />
    <circle cx="12" cy="28" r="3.5" fill={color} />
    <circle cx="50" cy="50" r="3" fill={color} opacity="0.35" />
  </svg>
);

/* ═══════════════ NAV ═══════════════ */
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
    if (page !== "home") { setPage("home"); setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 200); }
    else document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <nav className={`ev-nav ${scrolled ? "ev-nav--scrolled" : ""}`}>
      <div className="ev-nav__inner">
        <div className="ev-nav__logo" onClick={() => goPage("home")} style={{ cursor: "pointer" }}>
          <LogoMark size={32} color={scrolled ? "#0A0A0A" : "#fff"} />
          <div style={{ marginLeft: 12 }}>
            <div style={{ fontFamily: "var(--serif)", fontSize: 18, fontWeight: 600, letterSpacing: "0.12em", color: scrolled ? "#0A0A0A" : "#fff", lineHeight: 1 }}>EVRIEL</div>
            <div style={{ fontFamily: "var(--body)", fontSize: 9, fontWeight: 400, letterSpacing: "0.35em", color: scrolled ? "#666" : "rgba(255,255,255,0.5)", textTransform: "uppercase", marginTop: 2 }}>SYSTEMS</div>
          </div>
        </div>

        <div className="ev-nav__links">
          {[["About", "about"], ["Process", "process"], ["Services", "services"]].map(([label, id]) => (
            <button key={id} onClick={() => goSection(id)} className="ev-nav__link" style={{ color: scrolled ? "#0A0A0A" : "#fff" }}>{label}</button>
          ))}
          <button onClick={() => goPage("insights")} className="ev-nav__link" style={{ color: scrolled ? "#0A0A0A" : "#fff" }}>Insights</button>
          <button onClick={() => goSection("contact")} className="ev-nav__cta" style={{
            background: scrolled ? "#0A0A0A" : "#fff",
            color: scrolled ? "#fff" : "#0A0A0A",
          }}>Get in Touch</button>
        </div>

        <button className="ev-nav__burger" onClick={() => setMobileOpen(!mobileOpen)} style={{ color: scrolled ? "#0A0A0A" : "#fff" }}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="ev-mobile-menu">
          {[["About", "about"], ["Process", "process"], ["Services", "services"]].map(([label, id]) => (
            <button key={id} onClick={() => goSection(id)} className="ev-mobile-link">{label}</button>
          ))}
          <button onClick={() => goPage("insights")} className="ev-mobile-link">Insights</button>
          <button onClick={() => goSection("contact")} className="ev-mobile-link">Contact</button>
        </div>
      )}
    </nav>
  );
}

/* ═══════════════ HERO — BLACK, FULL SCREEN, CINEMATIC ═══════════════ */
function Hero() {
  const [loaded, setLoaded] = useState(false);
  const parallaxRef = useParallax(0.03);
  useEffect(() => { setTimeout(() => setLoaded(true), 100); }, []);
  return (
    <section className="ev-hero">
      <div className="ev-hero__bg">
        <div className="ev-hero__grid" ref={parallaxRef} />
        <div className="ev-hero__gradient" />
        <div className="ev-hero__logo-ghost">
          <LogoMark size={600} color="rgba(255,255,255,0.02)" />
        </div>
      </div>

      <div className="ev-hero__content">
        <div style={{ overflow: "hidden" }}>
          <div className="ev-hero__label" style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(100%)",
            transition: `all 1s ${EASE} 200ms`,
          }}>
            <div className="ev-hero__label-line" />
            <span>AI Systems Integration</span>
          </div>
        </div>

        <div style={{ overflow: "hidden" }}>
          <h1 className="ev-hero__title" style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(100%)",
            transition: `all 1.4s ${EASE} 400ms`,
          }}>
            <span className="ev-hero__title-main">Evriel</span>
            <span className="ev-hero__title-sub">SYSTEMS</span>
          </h1>
        </div>

        <div style={{ overflow: "hidden" }}>
          <p className="ev-hero__tagline" style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(100%)",
            transition: `all 1.2s ${EASE} 700ms`,
          }}>Connecting Intelligence<br/>with Business</p>
        </div>

        <div style={{ overflow: "hidden" }}>
          <div className="ev-hero__cta-row" style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(100%)",
            transition: `all 1.2s ${EASE} 900ms`,
          }}>
            <a href="#about" className="ev-btn ev-btn--white" onClick={(e) => { e.preventDefault(); document.getElementById("about")?.scrollIntoView({ behavior: "smooth" }); }}>
              Explore <ArrowRight size={18} />
            </a>
            <a href="#contact" className="ev-btn ev-btn--ghost" onClick={(e) => { e.preventDefault(); document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }); }}>
              Contact Us
            </a>
          </div>
        </div>
      </div>

      <div className="ev-hero__scroll" style={{ opacity: loaded ? 1 : 0, transition: `opacity 1s ${EASE} 1.2s` }}>
        <div className="ev-scroll-indicator">
          <div className="ev-scroll-indicator__dot" />
        </div>
        <span>Scroll</span>
      </div>
    </section>
  );
}

/* ═══════════════ MARQUEE STRIP — PLATINUM ═══════════════ */
function MarqueeStrip() {
  const items = ["AI Integration", "Machine Learning", "Data Analytics", "Neural Networks", "Cloud Architecture", "Deep Learning", "Automation", "Computer Vision"];
  const row = items.map((t, i) => (
    <span key={i} className="ev-marquee__item">
      <LogoMark size={14} color="#0A0A0A" />
      <span>{t}</span>
    </span>
  ));
  return (
    <div className="ev-marquee">
      <div className="ev-marquee__track">{row}{row}{row}{row}</div>
    </div>
  );
}

/* ═══════════════ ABOUT — WHITE, SPLIT LAYOUT WITH LARGE TYPE ═══════════════ */
function About() {
  const [ref, visible] = useReveal(0.1);
  const y1 = useSmoothCounter(50, 2000, visible);
  const y2 = useSmoothCounter(200, 2000, visible);
  const y3 = useSmoothCounter(99, 2000, visible);
  return (
    <section id="about" className="ev-about">
      <div className="ev-about__container" ref={ref}>
        <div className="ev-about__left">
          <Reveal>
            <div className="ev-section-label">01 — About</div>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="ev-about__heading">We Build<br/>Intelligent<br/><em>Systems</em></h2>
          </Reveal>
          <Reveal delay={200}>
            <p className="ev-about__text">
              Evriel Systems is a forward-thinking AI integration company that bridges the gap between cutting-edge artificial intelligence and real-world business operations. We architect intelligent solutions that transform how organizations operate, compete, and grow.
            </p>
          </Reveal>
          <Reveal delay={300}>
            <a href="#services" className="ev-link" onClick={(e) => { e.preventDefault(); document.getElementById("services")?.scrollIntoView({ behavior: "smooth" }); }}>
              Our Services <ArrowRight size={16} />
            </a>
          </Reveal>
        </div>

        <div className="ev-about__right">
          <Reveal delay={200} direction="right">
            <div className="ev-about__visual">
              <div className="ev-about__visual-logo">
                <LogoMark size={180} color="#0A0A0A" />
              </div>
              <div className="ev-about__visual-ring" />
              <div className="ev-about__visual-ring ev-about__visual-ring--2" />
            </div>
          </Reveal>

          <Stagger className="ev-about__stats" delay={150}>
            <div className="ev-stat">
              <span className="ev-stat__num">{y1}+</span>
              <span className="ev-stat__label">Projects Delivered</span>
            </div>
            <div className="ev-stat">
              <span className="ev-stat__num">{y2}M+</span>
              <span className="ev-stat__label">Data Points Processed</span>
            </div>
            <div className="ev-stat">
              <span className="ev-stat__num">{y3}%</span>
              <span className="ev-stat__label">Client Satisfaction</span>
            </div>
          </Stagger>
        </div>
      </div>
      <LineReveal />
    </section>
  );
}

/* ═══════════════ PROCESS — BLACK, NUMBERED HORIZONTAL CARDS ═══════════════ */
function Process() {
  const steps = [
    { num: "01", title: "Discover", desc: "Deep-dive analysis of your business landscape, data infrastructure, and strategic objectives to identify high-impact AI opportunities.", icon: <Target size={28} /> },
    { num: "02", title: "Architect", desc: "Design robust, scalable system architectures that seamlessly integrate AI capabilities into your existing technology stack.", icon: <Layers size={28} /> },
    { num: "03", title: "Engineer", desc: "Build production-grade AI solutions with rigorous testing, optimization, and performance benchmarking at every stage.", icon: <Cpu size={28} /> },
    { num: "04", title: "Deploy", desc: "Launch with confidence through phased rollouts, comprehensive monitoring, and continuous model optimization.", icon: <Zap size={28} /> },
    { num: "05", title: "Evolve", desc: "Ongoing refinement and scaling as your business grows, ensuring your AI systems stay ahead of the curve.", icon: <GitBranch size={28} /> },
  ];
  return (
    <section id="process" className="ev-process">
      <div className="ev-process__container">
        <Reveal>
          <div className="ev-section-label ev-section-label--light">02 — Process</div>
        </Reveal>
        <Reveal delay={100}>
          <h2 className="ev-process__heading">How We<br/><em>Work</em></h2>
        </Reveal>

        <div className="ev-process__grid">
          {steps.map((s, i) => (
            <Reveal key={i} delay={i * 100}>
              <div className="ev-process__card">
                <div className="ev-process__card-num">{s.num}</div>
                <div className="ev-process__card-icon">{s.icon}</div>
                <h3 className="ev-process__card-title">{s.title}</h3>
                <p className="ev-process__card-desc">{s.desc}</p>
                <div className="ev-process__card-line" />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════ SERVICES — WHITE, LARGE SPLIT CARDS ═══════════════ */
function Services() {
  const services = [
    { icon: <Cpu size={36} />, title: "AI Strategy & Consulting", desc: "Transform your business vision into an actionable AI roadmap. We identify opportunities, assess readiness, and design comprehensive implementation strategies.", tags: ["Strategy", "Roadmap", "Assessment"] },
    { icon: <Layers size={36} />, title: "Systems Integration", desc: "Seamlessly embed AI capabilities into your existing infrastructure. Our integration approach minimizes disruption while maximizing impact across all touchpoints.", tags: ["Integration", "API", "Middleware"] },
    { icon: <BarChart3 size={36} />, title: "Data Engineering", desc: "Build the foundation for intelligence. We architect robust data pipelines, warehouses, and processing systems that fuel accurate AI-driven insights.", tags: ["Pipelines", "Analytics", "ETL"] },
    { icon: <Shield size={36} />, title: "AI Security & Governance", desc: "Protect your AI investments with enterprise-grade security frameworks, bias detection, compliance monitoring, and ethical AI governance protocols.", tags: ["Security", "Compliance", "Ethics"] },
  ];
  return (
    <section id="services" className="ev-services">
      <div className="ev-services__container">
        <div className="ev-services__header">
          <Reveal>
            <div className="ev-section-label">03 — Services</div>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="ev-services__heading">What We<br/><em>Deliver</em></h2>
          </Reveal>
        </div>

        <div className="ev-services__grid">
          {services.map((s, i) => (
            <Reveal key={i} delay={i * 120}>
              <div className="ev-service-card">
                <div className="ev-service-card__top">
                  <div className="ev-service-card__icon">{s.icon}</div>
                  <div className="ev-service-card__num">0{i + 1}</div>
                </div>
                <h3 className="ev-service-card__title">{s.title}</h3>
                <p className="ev-service-card__desc">{s.desc}</p>
                <div className="ev-service-card__tags">
                  {s.tags.map((t, j) => <span key={j} className="ev-tag">{t}</span>)}
                </div>
                <div className="ev-service-card__arrow"><ArrowUpRight size={20} /></div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════ CASE STUDIES — BLACK, IMMERSIVE FULL-WIDTH ═══════════════ */
function CaseStudies() {
  const [active, setActive] = useState(null);
  const cases = [
    { client: "Global Logistics Corp", industry: "Supply Chain", result: "40% reduction in delivery times", desc: "Implemented predictive routing AI across 12 distribution centers, processing 50M+ data points daily to optimize fleet management and reduce operational costs.", year: "2024" },
    { client: "FinServe Capital", industry: "Financial Services", result: "3x faster fraud detection", desc: "Deployed real-time transaction analysis using custom neural networks, achieving 99.7% accuracy while reducing false positives by 60%.", year: "2024" },
    { client: "MedTech Innovations", industry: "Healthcare", result: "85% diagnostic accuracy improvement", desc: "Built an AI-powered diagnostic support system that assists clinicians with pattern recognition across medical imaging datasets.", year: "2023" },
    { client: "RetailFlow", industry: "E-Commerce", result: "28% increase in conversion", desc: "Engineered personalized recommendation engine processing user behavior in real-time, driving significant uplift in customer engagement and revenue.", year: "2023" },
  ];
  return (
    <section id="cases" className="ev-cases">
      <div className="ev-cases__container">
        <div className="ev-cases__header">
          <Reveal>
            <div className="ev-section-label ev-section-label--light">04 — Case Studies</div>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="ev-cases__heading">Proven<br/><em>Results</em></h2>
          </Reveal>
        </div>

        <div className="ev-cases__list">
          {cases.map((c, i) => (
            <Reveal key={i} delay={i * 80}>
              <div className={`ev-case ${active === i ? "ev-case--open" : ""}`} onClick={() => setActive(active === i ? null : i)}>
                <div className="ev-case__header">
                  <div className="ev-case__left">
                    <span className="ev-case__year">{c.year}</span>
                    <h3 className="ev-case__client">{c.client}</h3>
                  </div>
                  <div className="ev-case__right">
                    <span className="ev-case__industry">{c.industry}</span>
                    <span className="ev-case__toggle">{active === i ? <Minus size={20} /> : <Plus size={20} />}</span>
                  </div>
                </div>
                <div className="ev-case__body" style={{
                  maxHeight: active === i ? 300 : 0,
                  opacity: active === i ? 1 : 0,
                  transition: `max-height 0.6s ${EASE}, opacity 0.4s ${EASE}`,
                  overflow: "hidden",
                }}>
                  <div className="ev-case__result">{c.result}</div>
                  <p className="ev-case__desc">{c.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════ EXPERIENCE — WHITE, TIMELINE ═══════════════ */
function Experience() {
  const items = [
    { period: "2022 — Present", role: "AI Systems Architect", org: "Enterprise Clients Worldwide", desc: "Leading end-to-end AI integration projects for Fortune 500 companies across healthcare, finance, and logistics sectors." },
    { period: "2020 — 2022", role: "Machine Learning Lead", org: "Tech Innovation Lab", desc: "Directed R&D for production ML systems, achieving breakthrough performance in NLP and computer vision applications." },
    { period: "2018 — 2020", role: "Data Engineering Director", org: "DataScale Inc.", desc: "Built scalable data infrastructure processing petabytes of data, enabling real-time analytics for enterprise clients." },
  ];
  return (
    <section id="experience" className="ev-experience">
      <div className="ev-experience__container">
        <Reveal>
          <div className="ev-section-label">05 — Experience</div>
        </Reveal>
        <Reveal delay={100}>
          <h2 className="ev-experience__heading">Track<br/><em>Record</em></h2>
        </Reveal>
        <div className="ev-timeline">
          {items.map((item, i) => (
            <Reveal key={i} delay={i * 150}>
              <div className="ev-timeline__item">
                <div className="ev-timeline__dot" />
                <div className="ev-timeline__content">
                  <span className="ev-timeline__period">{item.period}</span>
                  <h3 className="ev-timeline__role">{item.role}</h3>
                  <span className="ev-timeline__org">{item.org}</span>
                  <p className="ev-timeline__desc">{item.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════ BIG STATEMENT — BLACK, FULL SCREEN TYPE ═══════════════ */
function BigStatement() {
  const parallaxRef = useParallax(0.02);
  return (
    <section className="ev-statement">
      <div className="ev-statement__bg" ref={parallaxRef}>
        <LogoMark size={500} color="rgba(255,255,255,0.03)" />
      </div>
      <div className="ev-statement__content">
        <Reveal>
          <h2 className="ev-statement__text">
            The future belongs to<br/>
            organizations that think<br/>
            <em>intelligently.</em>
          </h2>
        </Reveal>
        <Reveal delay={200}>
          <a href="#contact" className="ev-btn ev-btn--white ev-btn--lg" onClick={(e) => { e.preventDefault(); document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }); }}>
            Start Your Journey <ArrowRight size={20} />
          </a>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══════════════ CONTACT — WHITE, ASYMMETRIC LAYOUT ═══════════════ */
function Contact() {
  return (
    <section id="contact" className="ev-contact">
      <div className="ev-contact__container">
        <div className="ev-contact__left">
          <Reveal>
            <div className="ev-section-label">06 — Contact</div>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="ev-contact__heading">Let's Build<br/>Something<br/><em>Extraordinary</em></h2>
          </Reveal>
          <Reveal delay={200}>
            <p className="ev-contact__text">Ready to transform your business with intelligent systems? We'd love to hear about your challenges and explore how AI can drive your next breakthrough.</p>
          </Reveal>
        </div>

        <div className="ev-contact__right">
          <Stagger className="ev-contact__info" delay={120}>
            <div className="ev-contact__block">
              <div className="ev-contact__block-label">Email</div>
              <a href="mailto:contact@evrielsystems.com" className="ev-contact__block-value">contact@evrielsystems.com</a>
            </div>
            <div className="ev-contact__block">
              <div className="ev-contact__block-label">Website</div>
              <a href="https://evrielsystems.com" className="ev-contact__block-value" target="_blank" rel="noopener noreferrer">evrielsystems.com</a>
            </div>
            <div className="ev-contact__block">
              <div className="ev-contact__block-label">Location</div>
              <span className="ev-contact__block-value">Available Worldwide</span>
            </div>
          </Stagger>

          <Reveal delay={400}>
            <a href="mailto:contact@evrielsystems.com" className="ev-btn ev-btn--dark ev-btn--lg" style={{ marginTop: 40 }}>
              <Mail size={20} /> Send a Message
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════ FOOTER — BLACK ═══════════════ */
function Footer() {
  return (
    <footer className="ev-footer">
      <div className="ev-footer__container">
        <div className="ev-footer__top">
          <div className="ev-footer__brand">
            <LogoMark size={36} color="#fff" />
            <div style={{ marginLeft: 12 }}>
              <div style={{ fontFamily: "var(--serif)", fontSize: 16, fontWeight: 600, letterSpacing: "0.12em", color: "#fff" }}>EVRIEL</div>
              <div style={{ fontFamily: "var(--body)", fontSize: 8, letterSpacing: "0.4em", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", marginTop: 1 }}>SYSTEMS</div>
            </div>
          </div>
          <div className="ev-footer__tagline">Connecting Intelligence with Business</div>
        </div>
        <div className="ev-footer__line" />
        <div className="ev-footer__bottom">
          <span>&copy; {new Date().getFullYear()} Evriel Systems. All rights reserved.</span>
          <span>contact@evrielsystems.com</span>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════ INSIGHTS PAGE ═══════════════ */
function InsightsPage() {
  const articles = [
    { tag: "AI Strategy", title: "Why AI Integration Fails: The 5 Critical Gaps Most Organizations Miss", excerpt: "Most AI initiatives fail not because of technology, but because of fundamental gaps in strategy, data readiness, and organizational alignment.", date: "Nov 2024" },
    { tag: "Machine Learning", title: "The Rise of Edge AI: Processing Intelligence Where It Matters", excerpt: "Edge computing is transforming how we deploy ML models, bringing real-time intelligence to devices and reducing latency by orders of magnitude.", date: "Oct 2024" },
    { tag: "Data Engineering", title: "Building Data Pipelines That Scale: Lessons from 50+ Enterprise Projects", excerpt: "Scalable data infrastructure isn't about tools — it's about architecture patterns that grow with your business.", date: "Sep 2024" },
    { tag: "Industry Trends", title: "2025 AI Predictions: What Enterprise Leaders Need to Know", excerpt: "From multimodal AI to autonomous agents, the landscape is shifting. Here's what matters for your business strategy.", date: "Aug 2024" },
  ];
  return (
    <>
      <section className="ev-insights-hero">
        <Reveal>
          <div className="ev-section-label ev-section-label--light">Insights & Perspectives</div>
        </Reveal>
        <Reveal delay={100}>
          <h1 className="ev-insights-hero__title">Thinking<br/><em>Forward</em></h1>
        </Reveal>
      </section>
      <section className="ev-insights-list">
        <div className="ev-insights-list__container">
          {articles.map((a, i) => (
            <Reveal key={i} delay={i * 100}>
              <article className="ev-article">
                <div className="ev-article__meta">
                  <span className="ev-tag">{a.tag}</span>
                  <span className="ev-article__date">{a.date}</span>
                </div>
                <h2 className="ev-article__title">{a.title}</h2>
                <p className="ev-article__excerpt">{a.excerpt}</p>
                <span className="ev-link">Read More <ArrowRight size={14} /></span>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}

/* ═══════════════ MAIN APP ═══════════════ */
export default function EvrielSystems() {
  const [page, setPage] = useState("home");
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@300;400;500;600;700&display=swap');

        :root {
          --black: #0A0A0A;
          --white: #FFFFFF;
          --platinum: #D9D9D9;
          --serif: 'DM Serif Display', Georgia, serif;
          --body: 'Inter', -apple-system, sans-serif;
        }

        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

        html { scroll-behavior: smooth; font-size: 16px; }
        body { font-family: var(--body); background: var(--black); color: var(--black); -webkit-font-smoothing: antialiased; }

        button { background: none; border: none; cursor: pointer; font-family: inherit; }
        a { text-decoration: none; color: inherit; }

        /* ═══ NAV ═══ */
        .ev-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
          padding: 20px 0;
          transition: all 0.5s ${EASE};
        }
        .ev-nav--scrolled {
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(20px);
          padding: 12px 0;
          box-shadow: 0 1px 0 rgba(0,0,0,0.06);
        }
        .ev-nav__inner {
          max-width: 1400px; margin: 0 auto; padding: 0 40px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .ev-nav__logo { display: flex; align-items: center; }
        .ev-nav__links { display: flex; align-items: center; gap: 36px; }
        .ev-nav__link {
          font-size: 13px; font-weight: 400; letter-spacing: 0.06em;
          transition: opacity 0.3s; text-transform: uppercase;
        }
        .ev-nav__link:hover { opacity: 0.6; }
        .ev-nav__cta {
          font-size: 12px; font-weight: 500; letter-spacing: 0.08em;
          padding: 10px 24px; border-radius: 0; text-transform: uppercase;
          transition: all 0.3s;
        }
        .ev-nav__cta:hover { opacity: 0.85; transform: translateY(-1px); }
        .ev-nav__burger { display: none; }

        /* ═══ MOBILE MENU ═══ */
        .ev-mobile-menu {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: var(--black); z-index: 999;
          display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 24px;
          padding-top: 80px;
        }
        .ev-mobile-link {
          font-family: var(--serif); font-size: 36px; color: #fff;
          transition: opacity 0.3s;
        }
        .ev-mobile-link:hover { opacity: 0.6; }

        /* ═══ HERO ═══ */
        .ev-hero {
          position: relative; height: 100vh; min-height: 700px;
          display: flex; align-items: center; justify-content: center;
          background: var(--black); overflow: hidden;
        }
        .ev-hero__bg {
          position: absolute; inset: 0; pointer-events: none;
        }
        .ev-hero__grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 80px 80px;
        }
        .ev-hero__gradient {
          position: absolute; inset: 0;
          background: radial-gradient(ellipse 80% 60% at 50% 50%, rgba(255,255,255,0.04), transparent);
        }
        .ev-hero__logo-ghost {
          position: absolute; top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          animation: heroRotate 60s linear infinite;
        }
        @keyframes heroRotate { from { transform: translate(-50%, -50%) rotate(0deg); } to { transform: translate(-50%, -50%) rotate(360deg); } }

        .ev-hero__content {
          position: relative; z-index: 2;
          text-align: center;
          padding: 0 24px;
        }
        .ev-hero__label {
          display: inline-flex; align-items: center; gap: 12px;
          font-size: 12px; letter-spacing: 0.25em; text-transform: uppercase;
          color: rgba(255,255,255,0.5); margin-bottom: 32px;
          font-weight: 400;
        }
        .ev-hero__label-line { width: 40px; height: 1px; background: rgba(255,255,255,0.3); }
        .ev-hero__title { color: #fff; line-height: 0.9; }
        .ev-hero__title-main {
          display: block;
          font-family: var(--serif); font-size: clamp(80px, 14vw, 180px);
          font-weight: 400; letter-spacing: -0.02em;
        }
        .ev-hero__title-sub {
          display: block;
          font-family: var(--body); font-size: clamp(18px, 3vw, 36px);
          font-weight: 300; letter-spacing: 0.5em;
          margin-top: 12px; color: var(--platinum);
        }
        .ev-hero__tagline {
          font-family: var(--body); font-size: clamp(16px, 2vw, 22px);
          font-weight: 300; color: rgba(255,255,255,0.45);
          margin-top: 40px; line-height: 1.6; letter-spacing: 0.04em;
        }
        .ev-hero__cta-row {
          display: flex; gap: 16px; justify-content: center;
          margin-top: 48px; flex-wrap: wrap;
        }
        .ev-hero__scroll {
          position: absolute; bottom: 40px; left: 50%; transform: translateX(-50%);
          display: flex; flex-direction: column; align-items: center; gap: 12px;
          color: rgba(255,255,255,0.3); font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase;
        }
        .ev-scroll-indicator {
          width: 20px; height: 32px; border: 1px solid rgba(255,255,255,0.2); border-radius: 10px;
          display: flex; justify-content: center; padding-top: 6px;
        }
        .ev-scroll-indicator__dot {
          width: 3px; height: 8px; background: rgba(255,255,255,0.5); border-radius: 2px;
          animation: scrollBounce 2s ease-in-out infinite;
        }
        @keyframes scrollBounce { 0%, 100% { transform: translateY(0); opacity: 1; } 50% { transform: translateY(10px); opacity: 0.3; } }

        /* ═══ BUTTONS ═══ */
        .ev-btn {
          display: inline-flex; align-items: center; gap: 10px;
          font-size: 13px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase;
          padding: 16px 36px; transition: all 0.4s ${EASE};
          border: 1px solid transparent;
        }
        .ev-btn--white { background: #fff; color: var(--black); }
        .ev-btn--white:hover { background: var(--platinum); transform: translateY(-2px); }
        .ev-btn--ghost { border-color: rgba(255,255,255,0.2); color: #fff; background: transparent; }
        .ev-btn--ghost:hover { border-color: #fff; background: rgba(255,255,255,0.05); }
        .ev-btn--dark { background: var(--black); color: #fff; }
        .ev-btn--dark:hover { background: #222; transform: translateY(-2px); }
        .ev-btn--lg { padding: 20px 48px; font-size: 14px; }

        .ev-link {
          display: inline-flex; align-items: center; gap: 8px;
          font-size: 14px; font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase;
          transition: gap 0.3s ${EASE};
        }
        .ev-link:hover { gap: 14px; }

        /* ═══ SECTION LABEL ═══ */
        .ev-section-label {
          font-size: 12px; font-weight: 500; letter-spacing: 0.2em; text-transform: uppercase;
          color: rgba(0,0,0,0.4); margin-bottom: 20px;
        }
        .ev-section-label--light { color: rgba(255,255,255,0.35); }

        /* ═══ MARQUEE ═══ */
        .ev-marquee {
          background: var(--platinum); padding: 16px 0; overflow: hidden;
          border-top: 1px solid rgba(0,0,0,0.06);
          border-bottom: 1px solid rgba(0,0,0,0.06);
        }
        .ev-marquee__track {
          display: flex; gap: 48px; white-space: nowrap;
          animation: marqueeScroll 30s linear infinite;
        }
        .ev-marquee__item {
          display: inline-flex; align-items: center; gap: 10px;
          font-size: 13px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase;
          color: var(--black); opacity: 0.6;
        }
        @keyframes marqueeScroll { from { transform: translateX(0); } to { transform: translateX(-25%); } }

        /* ═══ ABOUT ═══ */
        .ev-about {
          background: var(--white); padding: 140px 0 100px;
        }
        .ev-about__container {
          max-width: 1400px; margin: 0 auto; padding: 0 40px;
          display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: start;
        }
        .ev-about__heading {
          font-family: var(--serif); font-size: clamp(48px, 5.5vw, 80px);
          font-weight: 400; line-height: 1.05; margin-bottom: 32px; color: var(--black);
        }
        .ev-about__heading em { font-style: italic; }
        .ev-about__text {
          font-size: 17px; line-height: 1.7; color: rgba(0,0,0,0.6);
          max-width: 520px; margin-bottom: 32px;
        }
        .ev-about__visual {
          position: relative; display: flex; align-items: center; justify-content: center;
          height: 400px;
        }
        .ev-about__visual-logo { position: relative; z-index: 2; }
        .ev-about__visual-ring {
          position: absolute; width: 300px; height: 300px;
          border: 1px solid rgba(0,0,0,0.06); border-radius: 50%;
          animation: ringPulse 4s ease-in-out infinite;
        }
        .ev-about__visual-ring--2 {
          width: 400px; height: 400px;
          animation-delay: 1s;
        }
        @keyframes ringPulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.05); opacity: 0.5; } }
        .ev-about__stats {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;
          margin-top: 40px;
        }
        .ev-stat { text-align: center; }
        .ev-stat__num {
          display: block; font-family: var(--serif); font-size: 42px;
          font-weight: 400; color: var(--black); line-height: 1;
        }
        .ev-stat__label {
          display: block; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase;
          color: rgba(0,0,0,0.4); margin-top: 8px;
        }

        /* ═══ PROCESS ═══ */
        .ev-process {
          background: var(--black); padding: 140px 0;
        }
        .ev-process__container { max-width: 1400px; margin: 0 auto; padding: 0 40px; }
        .ev-process__heading {
          font-family: var(--serif); font-size: clamp(48px, 5.5vw, 80px);
          font-weight: 400; line-height: 1.05; color: #fff; margin-bottom: 64px;
        }
        .ev-process__heading em { font-style: italic; color: var(--platinum); }
        .ev-process__grid {
          display: grid; grid-template-columns: repeat(5, 1fr); gap: 0;
        }
        .ev-process__card {
          padding: 40px 28px; border-right: 1px solid rgba(255,255,255,0.06);
          transition: background 0.4s;
          position: relative;
        }
        .ev-process__card:last-child { border-right: none; }
        .ev-process__card:hover { background: rgba(255,255,255,0.03); }
        .ev-process__card-num {
          font-family: var(--serif); font-size: 48px; color: rgba(255,255,255,0.08);
          line-height: 1; margin-bottom: 24px;
        }
        .ev-process__card-icon { color: var(--platinum); margin-bottom: 20px; }
        .ev-process__card-title {
          font-family: var(--serif); font-size: 24px; font-weight: 400;
          color: #fff; margin-bottom: 16px;
        }
        .ev-process__card-desc {
          font-size: 14px; line-height: 1.65; color: rgba(255,255,255,0.4);
        }
        .ev-process__card-line {
          position: absolute; bottom: 0; left: 28px; right: 28px;
          height: 1px; background: rgba(255,255,255,0.06);
        }

        /* ═══ SERVICES ═══ */
        .ev-services {
          background: var(--white); padding: 140px 0;
        }
        .ev-services__container { max-width: 1400px; margin: 0 auto; padding: 0 40px; }
        .ev-services__header { margin-bottom: 64px; }
        .ev-services__heading {
          font-family: var(--serif); font-size: clamp(48px, 5.5vw, 80px);
          font-weight: 400; line-height: 1.05; color: var(--black);
        }
        .ev-services__heading em { font-style: italic; }
        .ev-services__grid {
          display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px;
        }
        .ev-service-card {
          background: #FAFAFA; border: 1px solid rgba(0,0,0,0.05);
          padding: 48px; position: relative; overflow: hidden;
          transition: all 0.5s ${EASE};
        }
        .ev-service-card:hover {
          background: var(--black); color: #fff; transform: translateY(-4px);
          box-shadow: 0 30px 60px rgba(0,0,0,0.15);
        }
        .ev-service-card:hover .ev-service-card__desc { color: rgba(255,255,255,0.5); }
        .ev-service-card:hover .ev-service-card__num { color: rgba(255,255,255,0.1); }
        .ev-service-card:hover .ev-service-card__icon { color: var(--platinum); }
        .ev-service-card:hover .ev-tag { background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.6); border-color: rgba(255,255,255,0.1); }
        .ev-service-card:hover .ev-service-card__arrow { color: #fff; border-color: rgba(255,255,255,0.2); }
        .ev-service-card__top {
          display: flex; justify-content: space-between; align-items: flex-start;
          margin-bottom: 24px;
        }
        .ev-service-card__icon { color: var(--black); transition: color 0.5s; }
        .ev-service-card__num {
          font-family: var(--serif); font-size: 56px; color: rgba(0,0,0,0.06);
          line-height: 1; transition: color 0.5s;
        }
        .ev-service-card__title {
          font-family: var(--serif); font-size: 28px; font-weight: 400;
          margin-bottom: 16px; line-height: 1.2;
        }
        .ev-service-card__desc {
          font-size: 15px; line-height: 1.65; color: rgba(0,0,0,0.5);
          margin-bottom: 24px; transition: color 0.5s;
        }
        .ev-service-card__tags { display: flex; flex-wrap: wrap; gap: 8px; }
        .ev-tag {
          font-size: 11px; letter-spacing: 0.06em; text-transform: uppercase;
          padding: 6px 14px; border: 1px solid rgba(0,0,0,0.1); background: transparent;
          transition: all 0.5s;
        }
        .ev-service-card__arrow {
          position: absolute; top: 48px; right: 48px;
          width: 40px; height: 40px; border: 1px solid rgba(0,0,0,0.1);
          display: flex; align-items: center; justify-content: center;
          transition: all 0.5s;
        }

        /* ═══ CASES ═══ */
        .ev-cases {
          background: var(--black); padding: 140px 0;
        }
        .ev-cases__container { max-width: 1200px; margin: 0 auto; padding: 0 40px; }
        .ev-cases__header { margin-bottom: 64px; }
        .ev-cases__heading {
          font-family: var(--serif); font-size: clamp(48px, 5.5vw, 80px);
          font-weight: 400; line-height: 1.05; color: #fff;
        }
        .ev-cases__heading em { font-style: italic; color: var(--platinum); }
        .ev-case {
          border-top: 1px solid rgba(255,255,255,0.08); padding: 32px 0;
          cursor: pointer; transition: all 0.3s;
        }
        .ev-case:last-child { border-bottom: 1px solid rgba(255,255,255,0.08); }
        .ev-case:hover { padding-left: 16px; }
        .ev-case__header {
          display: flex; justify-content: space-between; align-items: center;
        }
        .ev-case__left { display: flex; align-items: center; gap: 24px; }
        .ev-case__year {
          font-size: 13px; color: rgba(255,255,255,0.3); letter-spacing: 0.08em;
          font-variant-numeric: tabular-nums;
        }
        .ev-case__client {
          font-family: var(--serif); font-size: clamp(22px, 3vw, 32px);
          font-weight: 400; color: #fff;
        }
        .ev-case__right { display: flex; align-items: center; gap: 24px; }
        .ev-case__industry {
          font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase;
          color: rgba(255,255,255,0.3);
        }
        .ev-case__toggle { color: rgba(255,255,255,0.4); }
        .ev-case__body { padding-left: 100px; }
        .ev-case__result {
          font-family: var(--serif); font-size: 24px; color: var(--platinum);
          margin: 16px 0 12px; font-style: italic;
        }
        .ev-case__desc {
          font-size: 15px; line-height: 1.65; color: rgba(255,255,255,0.4);
          max-width: 600px;
        }

        /* ═══ EXPERIENCE ═══ */
        .ev-experience {
          background: var(--white); padding: 140px 0;
        }
        .ev-experience__container { max-width: 1200px; margin: 0 auto; padding: 0 40px; }
        .ev-experience__heading {
          font-family: var(--serif); font-size: clamp(48px, 5.5vw, 80px);
          font-weight: 400; line-height: 1.05; color: var(--black); margin-bottom: 64px;
        }
        .ev-experience__heading em { font-style: italic; }
        .ev-timeline { position: relative; padding-left: 40px; }
        .ev-timeline::before {
          content: ''; position: absolute; left: 0; top: 0; bottom: 0;
          width: 1px; background: rgba(0,0,0,0.1);
        }
        .ev-timeline__item {
          position: relative; padding: 0 0 56px 40px;
        }
        .ev-timeline__item:last-child { padding-bottom: 0; }
        .ev-timeline__dot {
          position: absolute; left: -44px; top: 6px;
          width: 9px; height: 9px; background: var(--black); border-radius: 50%;
        }
        .ev-timeline__period {
          font-size: 12px; letter-spacing: 0.15em; text-transform: uppercase;
          color: rgba(0,0,0,0.35); display: block; margin-bottom: 8px;
        }
        .ev-timeline__role {
          font-family: var(--serif); font-size: 28px; font-weight: 400;
          margin-bottom: 4px;
        }
        .ev-timeline__org {
          font-size: 14px; color: rgba(0,0,0,0.4); display: block; margin-bottom: 12px;
        }
        .ev-timeline__desc {
          font-size: 15px; line-height: 1.65; color: rgba(0,0,0,0.5);
          max-width: 560px;
        }

        /* ═══ BIG STATEMENT ═══ */
        .ev-statement {
          position: relative; background: var(--black); padding: 180px 40px;
          display: flex; align-items: center; justify-content: center;
          min-height: 80vh; overflow: hidden;
        }
        .ev-statement__bg {
          position: absolute; top: 50%; left: 50%;
          transform: translate(-50%, -50%);
        }
        .ev-statement__content {
          position: relative; z-index: 2; text-align: center;
        }
        .ev-statement__text {
          font-family: var(--serif); font-size: clamp(36px, 5vw, 72px);
          font-weight: 400; line-height: 1.15; color: #fff;
          margin-bottom: 48px;
        }
        .ev-statement__text em { font-style: italic; color: var(--platinum); }

        /* ═══ CONTACT ═══ */
        .ev-contact {
          background: var(--white); padding: 140px 0;
        }
        .ev-contact__container {
          max-width: 1400px; margin: 0 auto; padding: 0 40px;
          display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: start;
        }
        .ev-contact__heading {
          font-family: var(--serif); font-size: clamp(44px, 5vw, 72px);
          font-weight: 400; line-height: 1.05; margin-bottom: 24px;
        }
        .ev-contact__heading em { font-style: italic; }
        .ev-contact__text {
          font-size: 17px; line-height: 1.7; color: rgba(0,0,0,0.5);
          max-width: 500px;
        }
        .ev-contact__info { display: flex; flex-direction: column; gap: 32px; }
        .ev-contact__block-label {
          font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase;
          color: rgba(0,0,0,0.35); margin-bottom: 6px;
        }
        .ev-contact__block-value {
          font-family: var(--serif); font-size: 22px;
          transition: opacity 0.3s;
        }
        .ev-contact__block-value:hover { opacity: 0.6; }

        /* ═══ FOOTER ═══ */
        .ev-footer {
          background: var(--black); padding: 48px 0 32px;
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        .ev-footer__container { max-width: 1400px; margin: 0 auto; padding: 0 40px; }
        .ev-footer__top {
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 32px;
        }
        .ev-footer__brand { display: flex; align-items: center; }
        .ev-footer__tagline {
          font-size: 13px; color: rgba(255,255,255,0.3); letter-spacing: 0.06em;
        }
        .ev-footer__line {
          height: 1px; background: rgba(255,255,255,0.06); margin-bottom: 24px;
        }
        .ev-footer__bottom {
          display: flex; justify-content: space-between;
          font-size: 12px; color: rgba(255,255,255,0.25); letter-spacing: 0.04em;
        }

        /* ═══ INSIGHTS ═══ */
        .ev-insights-hero {
          background: var(--black); padding: 200px 40px 120px;
          text-align: center;
        }
        .ev-insights-hero__title {
          font-family: var(--serif); font-size: clamp(56px, 8vw, 120px);
          font-weight: 400; color: #fff; line-height: 1;
        }
        .ev-insights-hero__title em { font-style: italic; color: var(--platinum); }
        .ev-insights-list { background: var(--white); padding: 100px 0; }
        .ev-insights-list__container { max-width: 900px; margin: 0 auto; padding: 0 40px; }
        .ev-article {
          padding: 48px 0; border-bottom: 1px solid rgba(0,0,0,0.08);
        }
        .ev-article:first-child { border-top: 1px solid rgba(0,0,0,0.08); }
        .ev-article__meta {
          display: flex; align-items: center; gap: 16px; margin-bottom: 16px;
        }
        .ev-article__date {
          font-size: 12px; color: rgba(0,0,0,0.35); letter-spacing: 0.06em;
        }
        .ev-article__title {
          font-family: var(--serif); font-size: 28px; font-weight: 400;
          line-height: 1.3; margin-bottom: 12px;
          transition: opacity 0.3s; cursor: pointer;
        }
        .ev-article__title:hover { opacity: 0.6; }
        .ev-article__excerpt {
          font-size: 15px; line-height: 1.65; color: rgba(0,0,0,0.5);
          margin-bottom: 16px; max-width: 700px;
        }

        /* ═══ RESPONSIVE ═══ */
        @media (max-width: 1024px) {
          .ev-process__grid { grid-template-columns: repeat(3, 1fr); }
          .ev-process__card { border-bottom: 1px solid rgba(255,255,255,0.06); }
          .ev-about__container { grid-template-columns: 1fr; gap: 48px; }
          .ev-contact__container { grid-template-columns: 1fr; gap: 48px; }
        }

        @media (max-width: 768px) {
          .ev-nav__links { display: none; }
          .ev-nav__burger { display: block; }
          .ev-nav__inner { padding: 0 20px; }

          .ev-hero__title-main { font-size: clamp(56px, 16vw, 100px); }
          .ev-hero__title-sub { font-size: clamp(14px, 3.5vw, 24px); letter-spacing: 0.3em; }
          .ev-hero__tagline { font-size: 16px; }

          .ev-about { padding: 100px 0 80px; }
          .ev-about__container { padding: 0 20px; }
          .ev-about__heading { font-size: clamp(40px, 10vw, 56px); }
          .ev-about__visual { height: 280px; }
          .ev-about__visual-logo svg { width: 120px !important; height: 120px !important; }
          .ev-about__visual-ring { width: 200px; height: 200px; }
          .ev-about__visual-ring--2 { width: 280px; height: 280px; }
          .ev-about__stats { grid-template-columns: repeat(3, 1fr); gap: 16px; }
          .ev-stat__num { font-size: 32px; }

          .ev-process { padding: 100px 0; }
          .ev-process__container { padding: 0 20px; }
          .ev-process__heading { font-size: clamp(40px, 10vw, 56px); margin-bottom: 40px; }
          .ev-process__grid { grid-template-columns: 1fr; }
          .ev-process__card { border-right: none; border-bottom: 1px solid rgba(255,255,255,0.06); padding: 32px 0; }
          .ev-process__card-num { font-size: 36px; }

          .ev-services { padding: 100px 0; }
          .ev-services__container { padding: 0 20px; }
          .ev-services__heading { font-size: clamp(40px, 10vw, 56px); }
          .ev-services__grid { grid-template-columns: 1fr; }
          .ev-service-card { padding: 32px; }
          .ev-service-card__title { font-size: 24px; }
          .ev-service-card__num { font-size: 40px; }

          .ev-cases { padding: 100px 0; }
          .ev-cases__container { padding: 0 20px; }
          .ev-cases__heading { font-size: clamp(40px, 10vw, 56px); }
          .ev-case__header { flex-direction: column; align-items: flex-start; gap: 8px; }
          .ev-case__left { gap: 12px; }
          .ev-case__client { font-size: 22px; }
          .ev-case__right { width: 100%; justify-content: space-between; }
          .ev-case__body { padding-left: 0; }
          .ev-case__result { font-size: 20px; }

          .ev-experience { padding: 100px 0; }
          .ev-experience__container { padding: 0 20px; }
          .ev-experience__heading { font-size: clamp(40px, 10vw, 56px); }
          .ev-timeline__role { font-size: 22px; }

          .ev-statement { padding: 120px 20px; min-height: 60vh; }
          .ev-statement__text { font-size: clamp(28px, 7vw, 48px); }

          .ev-contact { padding: 100px 0; }
          .ev-contact__container { padding: 0 20px; }
          .ev-contact__heading { font-size: clamp(36px, 9vw, 56px); }

          .ev-footer__container { padding: 0 20px; }
          .ev-footer__top { flex-direction: column; gap: 16px; align-items: flex-start; }
          .ev-footer__bottom { flex-direction: column; gap: 8px; }

          .ev-insights-hero { padding: 160px 20px 80px; }
          .ev-insights-list__container { padding: 0 20px; }
          .ev-article__title { font-size: 22px; }
        }

        @media (max-width: 480px) {
          .ev-hero { min-height: 100svh; }
          .ev-hero__title-main { font-size: 56px; }
          .ev-hero__title-sub { font-size: 14px; letter-spacing: 0.25em; }
          .ev-hero__cta-row { flex-direction: column; align-items: center; }
          .ev-btn { width: 100%; justify-content: center; }
          .ev-about__stats { grid-template-columns: 1fr; gap: 24px; }
        }
      `}</style>

      <Nav page={page} setPage={setPage} />
      {page === "home" ? (
        <>
          <Hero />
          <MarqueeStrip />
          <About />
          <Process />
          <Services />
          <CaseStudies />
          <Experience />
          <BigStatement />
          <Contact />
        </>
      ) : page === "insights" ? (
        <InsightsPage />
      ) : null}
      <Footer />
    </>
  );
}

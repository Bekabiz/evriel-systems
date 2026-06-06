import { useState, useEffect, useRef, useCallback } from "react";
import { Mail, ArrowRight, ArrowUpRight, ChevronDown, MapPin, Menu, X, Minus, Plus, Building2, Factory, Plane, ShoppingCart, Ship, Briefcase, Megaphone, Globe, Heart, GraduationCap, Rocket, Zap, BarChart3, Cpu, RefreshCw, Search, Users, FileText, Map, MessageSquare, Lock, Eye, Shield, CheckCircle2 } from "lucide-react";

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
    up: "translateY(100px)", down: "translateY(-100px)",
    left: "translateX(100px)", right: "translateX(-100px)",
    scale: "scale(0.85)", none: "none",
  };
  return (
    <div ref={ref} className={className} style={{
      ...style, opacity: visible ? 1 : 0,
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
          opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(70px)",
          transition: `opacity 1.2s ${EASE} ${i * delay}ms, transform 1.2s ${EASE} ${i * delay}ms`
        }}>{child}</div>
      )) : children}
    </div>
  );
}

function LineReveal({ delay = 0, dark = false, width = "100%" }) {
  const [ref, visible] = useReveal(0.1);
  return (
    <div ref={ref} style={{ overflow: "hidden", width }}>
      <div style={{
        height: 1, background: dark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)",
        transform: visible ? "scaleX(1)" : "scaleX(0)", transformOrigin: "left",
        transition: `transform 1.6s ${EASE} ${delay}ms`,
      }} />
    </div>
  );
}

/* ═══════════════ NEW LOGO ═══════════════ */
const LogoMark = ({ size = 48, color = "currentColor", animate = false }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <svg
      width={size} height={size} viewBox="0 0 200 200" fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ transition: "transform 0.6s cubic-bezier(0.16,1,0.3,1)", transform: hovered && animate ? "rotate(30deg)" : "rotate(0deg)" }}
    >
      <line x1="180" y1="100" x2="140" y2="169.3" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="140" y1="169.3" x2="60" y2="169.3" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="60" y1="169.3" x2="20" y2="100" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="20" y1="100" x2="60" y2="30.7" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="60" y1="30.7" x2="140" y2="30.7" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="140" y1="30.7" x2="180" y2="100" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="100" y1="100" x2="60" y2="30.7" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="100" y1="100" x2="20" y2="100" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="100" y1="100" x2="60" y2="169.3" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="100" y1="100" x2="133.6" y2="100" stroke={color} strokeWidth="1.875" strokeLinecap="round" />
      <circle cx="180" cy="100" r="4.6" fill={color} />
      <circle cx="140" cy="169.3" r="4.6" fill={color} />
      <circle cx="60" cy="169.3" r="4.6" fill={color} />
      <circle cx="20" cy="100" r="4.6" fill={color} />
      <circle cx="60" cy="30.7" r="4.6" fill={color} />
      <circle cx="140" cy="30.7" r="4.6" fill={color} />
      <circle cx="100" cy="100" r="5.6" fill={color} />
      <circle cx="133.6" cy="100" r="3.7" fill={color} />
    </svg>
  );
};

const LogoWordmark = ({ color = "currentColor", subColor, size = 1 }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
    <div style={{ width: 32 * size, height: 2, background: color, marginBottom: 6 * size }} />
    <div style={{ fontFamily: "var(--serif)", fontSize: 22 * size, fontWeight: 400, color, letterSpacing: "0.04em", lineHeight: 1 }}>Evriel</div>
    <div style={{ fontFamily: "var(--body)", fontSize: 8 * size, fontWeight: 400, color: subColor || color, letterSpacing: "0.45em", marginTop: 4 * size, textTransform: "uppercase", opacity: subColor ? 1 : 0.5 }}>Systems</div>
  </div>
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
  const c = scrolled ? "#0A0A0A" : "#fff";
  return (
    <nav className={`ev-nav ${scrolled ? "ev-nav--scrolled" : ""}`}>
      <div className="ev-nav__inner">
        <div className="ev-nav__logo" onClick={() => goPage("home")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 14 }}>
          <LogoMark size={30} color={c} animate />
          <LogoWordmark color={c} subColor={scrolled ? "#888" : "rgba(255,255,255,0.45)"} size={0.85} />
        </div>
        <div className="ev-nav__links">
          {[["About","about"],["Industries","industries"],["Services","services"],["Projects","projects"],["Process","process"]].map(([l,id])=>(
            <button key={id} onClick={()=>goSection(id)} className="ev-nav__link" style={{color:c}}>{l}</button>
          ))}
          <button onClick={()=>goPage("insights")} className="ev-nav__link" style={{color:c}}>Insights</button>
          <button onClick={()=>goSection("contact")} className="ev-nav__cta" style={{background:scrolled?"#0A0A0A":"#fff",color:scrolled?"#fff":"#0A0A0A"}}>Schedule a Consultation</button>
        </div>
        <button className="ev-nav__burger" onClick={()=>setMobileOpen(!mobileOpen)} style={{color:c}}>
          {mobileOpen ? <X size={24}/> : <Menu size={24}/>}
        </button>
      </div>
      {mobileOpen && (
        <div className="ev-mobile-menu">
          {[["About","about"],["Industries","industries"],["Services","services"],["Projects","projects"],["Process","process"]].map(([l,id])=>(
            <button key={id} onClick={()=>goSection(id)} className="ev-mobile-link">{l}</button>
          ))}
          <button onClick={()=>goPage("insights")} className="ev-mobile-link">Insights</button>
          <button onClick={()=>goSection("contact")} className="ev-mobile-link">Contact</button>
        </div>
      )}
    </nav>
  );
}

/* ═══════════════ HERO ═══════════════ */
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
          <LogoMark size={600} color="rgba(255,255,255,0.025)" />
        </div>
      </div>
      <div className="ev-hero__content">
        <div style={{overflow:"hidden"}}>
          <div className="ev-hero__label" style={{opacity:loaded?1:0,transform:loaded?"translateY(0)":"translateY(100%)",transition:`all 1s ${EASE} 200ms`}}>
            <div className="ev-hero__label-line"/>
            <span>AI &middot; Automation &middot; Digital Transformation</span>
          </div>
        </div>
        <div style={{overflow:"hidden"}}>
          <h1 className="ev-hero__title" style={{opacity:loaded?1:0,transform:loaded?"translateY(0)":"translateY(100%)",transition:`all 1.4s ${EASE} 400ms`}}>
            Helping Organizations<br/>Thrive in the Age of<br/><em>Intelligent Systems</em>
          </h1>
        </div>
        <div style={{overflow:"hidden"}}>
          <p className="ev-hero__tagline" style={{opacity:loaded?1:0,transform:loaded?"translateY(0)":"translateY(100%)",transition:`all 1.2s ${EASE} 700ms`}}>
            The future belongs to organizations that can adapt, automate,<br className="ev-br-desktop"/>and make smarter decisions.
          </p>
        </div>
        <div style={{overflow:"hidden"}}>
          <div className="ev-hero__cta-row" style={{opacity:loaded?1:0,transform:loaded?"translateY(0)":"translateY(100%)",transition:`all 1.2s ${EASE} 900ms`}}>
            <a href="#services" className="ev-btn ev-btn--white" onClick={e=>{e.preventDefault();document.getElementById("services")?.scrollIntoView({behavior:"smooth"})}}>
              Explore Solutions <ArrowRight size={18}/>
            </a>
            <a href="#contact" className="ev-btn ev-btn--ghost" onClick={e=>{e.preventDefault();document.getElementById("contact")?.scrollIntoView({behavior:"smooth"})}}>
              Schedule a Consultation
            </a>
          </div>
        </div>
      </div>
      <div className="ev-hero__scroll" style={{opacity:loaded?1:0,transition:`opacity 1s ${EASE} 1.2s`}}>
        <div className="ev-scroll-indicator"><div className="ev-scroll-indicator__dot"/></div>
        <span>Scroll</span>
      </div>
    </section>
  );
}

/* ═══════════════ MARQUEE ═══════════════ */
function MarqueeStrip() {
  const items = ["AI Integration","Digital Transformation","Business Intelligence","Automation","Intelligent Systems","Data Analytics","Cloud Architecture","Industry Solutions"];
  const row = items.map((t,i)=>(
    <span key={i} className="ev-marquee__item">
      <span className="ev-marquee__dot"/>
      <span>{t}</span>
    </span>
  ));
  return <div className="ev-marquee"><div className="ev-marquee__track">{row}{row}{row}{row}</div></div>;
}

/* ═══════════════ ABOUT ═══════════════ */
function About() {
  const [ref, visible] = useReveal(0.1);
  return (
    <section id="about" className="ev-about">
      <div className="ev-about__container" ref={ref}>
        <div className="ev-about__left">
          <Reveal><div className="ev-section-label">01 — About</div></Reveal>
          <Reveal delay={100}><h2 className="ev-about__heading">Intelligence<br/>With <em>Purpose</em></h2></Reveal>
          <Reveal delay={200}>
            <p className="ev-about__lead">Evriel Systems was founded on a simple belief:</p>
            <p className="ev-about__highlight">Technology should solve real problems.</p>
          </Reveal>
          <Reveal delay={300}>
            <p className="ev-about__text">
              Across industries, countries, and organizations, many businesses face similar challenges — fragmented information, repetitive manual work, disconnected systems, inefficient communication, and slow decision-making.
            </p>
            <p className="ev-about__text">
              The challenge is not accessing technology. <strong>The challenge is implementing it correctly.</strong>
            </p>
            <p className="ev-about__text">
              Evriel Systems helps organizations bridge that gap by designing intelligent systems that connect people, processes, information, and technology into unified operational environments.
            </p>
          </Reveal>
        </div>
        <div className="ev-about__right">
          <Reveal delay={200} direction="right">
            <div className="ev-about__visual">
              <div className="ev-about__visual-logo"><LogoMark size={160} color="#0A0A0A" animate /></div>
              <div className="ev-about__visual-ring"/>
              <div className="ev-about__visual-ring ev-about__visual-ring--2"/>
              <div className="ev-about__visual-ring ev-about__visual-ring--3"/>
            </div>
          </Reveal>
          <Stagger className="ev-about__challenges" delay={100}>
            {["Fragmented Information","Repetitive Manual Work","Disconnected Systems","Inefficient Communication","Slow Decision-Making"].map((c,i)=>(
              <div key={i} className="ev-challenge">
                <CheckCircle2 size={16}/>
                <span>{c}</span>
              </div>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════ INDUSTRIES ═══════════════ */
function Industries() {
  const [activeIndustry, setActiveIndustry] = useState(0);
  const industries = [
    { icon: <Building2 size={24}/>, name: "Construction & Engineering", desc: "Digital project monitoring, documentation systems, reporting automation, engineering intelligence tools." },
    { icon: <Factory size={24}/>, name: "Manufacturing & Industrial", desc: "Workflow optimization, operational analytics, predictive monitoring, production support systems." },
    { icon: <Plane size={24}/>, name: "Tourism & Hospitality", desc: "Guest management, operational automation, intelligent customer communication, business analytics." },
    { icon: <ShoppingCart size={24}/>, name: "Retail & Commerce", desc: "Customer intelligence, inventory visibility, process automation, reporting systems." },
    { icon: <Ship size={24}/>, name: "Import & Export", desc: "Trade documentation, workflow automation, operational coordination, information management." },
    { icon: <Briefcase size={24}/>, name: "Professional Services", desc: "Knowledge systems, workflow optimization, AI-assisted operations." },
    { icon: <Megaphone size={24}/>, name: "Marketing & SEO", desc: "Content intelligence, domain qualification systems, opportunity discovery, reporting automation." },
    { icon: <Globe size={24}/>, name: "European Projects", desc: "Project management support, reporting assistance, knowledge management, AI-powered project intelligence." },
    { icon: <Heart size={24}/>, name: "NGOs & Associations", desc: "Operational efficiency, communication systems, data management, project support tools." },
    { icon: <GraduationCap size={24}/>, name: "Education & Training", desc: "Knowledge systems, digital learning support, administrative automation." },
    { icon: <Rocket size={24}/>, name: "Startups & SMEs", desc: "Scalable systems designed to support growth and operational maturity." },
  ];
  return (
    <section id="industries" className="ev-industries">
      <div className="ev-industries__container">
        <Reveal><div className="ev-section-label ev-section-label--light">02 — Industries</div></Reveal>
        <Reveal delay={100}><h2 className="ev-industries__heading">Industries<br/>We <em>Support</em></h2></Reveal>
        <div className="ev-industries__grid">
          {industries.map((ind, i) => (
            <Reveal key={i} delay={i * 60}>
              <div
                className={`ev-industry ${activeIndustry === i ? "ev-industry--active" : ""}`}
                onMouseEnter={() => setActiveIndustry(i)}
              >
                <div className="ev-industry__icon">{ind.icon}</div>
                <h3 className="ev-industry__name">{ind.name}</h3>
                <p className="ev-industry__desc">{ind.desc}</p>
                <div className="ev-industry__line"/>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════ SERVICES — PREMIUM HORIZONTAL LAYOUT ═══════════════ */
function Services() {
  const services = [
    { num: "01", icon: <Zap size={32}/>, title: "AI Automation", desc: "Reduce repetitive work and improve operational efficiency through intelligent automation.", apps: ["Email automation","Workflow automation","Internal process automation","AI-powered assistants","Customer communication systems"] },
    { num: "02", icon: <BarChart3 size={32}/>, title: "Business Intelligence", desc: "Transform business information into actionable insights.", apps: ["Reporting dashboards","Operational analytics","Decision support systems","Data visualization","Performance monitoring"] },
    { num: "03", icon: <Cpu size={32}/>, title: "Intelligent Systems", desc: "Custom-built solutions designed around the unique needs of each organization.", apps: ["Industry-specific platforms","Knowledge management systems","AI-powered operational tools","Intelligent information systems"] },
    { num: "04", icon: <RefreshCw size={32}/>, title: "Digital Transformation", desc: "Support organizations as they modernize operations and adopt emerging technologies.", apps: ["Process redesign","Digital strategy","Technology integration","Operational modernization"] },
  ];
  return (
    <section id="services" className="ev-services">
      <div className="ev-services__container">
        <div className="ev-services__header">
          <Reveal><div className="ev-section-label">03 — Core Services</div></Reveal>
          <Reveal delay={100}><h2 className="ev-services__heading">What We<br/><em>Deliver</em></h2></Reveal>
        </div>
        <div className="ev-services__list">
          {services.map((s, i) => (
            <Reveal key={i} delay={i * 120}>
              <div className="ev-service">
                <div className="ev-service__left">
                  <span className="ev-service__num">{s.num}</span>
                  <div className="ev-service__icon">{s.icon}</div>
                </div>
                <div className="ev-service__center">
                  <h3 className="ev-service__title">{s.title}</h3>
                  <p className="ev-service__desc">{s.desc}</p>
                </div>
                <div className="ev-service__right">
                  <div className="ev-service__apps-label">Applications</div>
                  <ul className="ev-service__apps">
                    {s.apps.map((a, j) => <li key={j}>{a}</li>)}
                  </ul>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════ FEATURED PROJECTS ═══════════════ */
function Projects() {
  const [active, setActive] = useState(null);
  const projects = [
    { title: "Domain Intelligence Platform", desc: "An AI-powered system that automates the identification, evaluation, and qualification of SEO and partnership opportunities.", caps: ["Domain analysis","Relevance scoring","Niche classification","Opportunity prioritization","Workflow automation"], tagline: "Reducing manual research while improving decision quality." },
    { title: "AI Workforce Management Assistant", desc: "A business-trained AI assistant that supports employees through organization-specific knowledge and operational guidance.", caps: ["Internal support","Employee onboarding","Process guidance","Knowledge retrieval","Operational assistance"], tagline: "Functions as a continuously available digital team member." },
    { title: "European Project Intelligence Assistant", desc: "An intelligent assistant designed to simplify the management of European projects.", caps: ["Project documentation support","Reporting assistance","Compliance guidance","Knowledge organization","Stakeholder information access"], tagline: "Helping teams navigate complex project environments." },
    { title: "Engineering Project Monitoring System", desc: "A user-friendly platform designed to support engineering and construction projects.", caps: ["AutoCAD integration support","Project documentation","Site progress monitoring","Reporting workflows","Communication management"], tagline: "Improved visibility across the entire project lifecycle." },
    { title: "Intelligent Email Operations Platform", desc: "An advanced communication system trained on organizational knowledge and business processes.", caps: ["Customer communication support","Intelligent response generation","Workflow execution","Brand-consistent communication"], tagline: "Acts as an intelligent extension of the organization." },
    { title: "GIS & Spatial Intelligence Platform", desc: "A geographic intelligence system supporting planning and operational decision-making.", caps: ["Mapping","Infrastructure analysis","Location intelligence","Spatial data visualization","Geographic decision support"], tagline: "Useful across engineering, infrastructure, logistics, and planning." },
  ];
  return (
    <section id="projects" className="ev-projects">
      <div className="ev-projects__container">
        <Reveal><div className="ev-section-label ev-section-label--light">04 — Featured Projects</div></Reveal>
        <Reveal delay={100}><h2 className="ev-projects__heading">Proven<br/><em>Solutions</em></h2></Reveal>
        <div className="ev-projects__list">
          {projects.map((p, i) => (
            <Reveal key={i} delay={i * 80}>
              <div className={`ev-project ${active===i?"ev-project--open":""}`} onClick={()=>setActive(active===i?null:i)}>
                <div className="ev-project__header">
                  <div className="ev-project__left">
                    <span className="ev-project__idx">0{i+1}</span>
                    <h3 className="ev-project__title">{p.title}</h3>
                  </div>
                  <span className="ev-project__toggle">{active===i?<Minus size={20}/>:<Plus size={20}/>}</span>
                </div>
                <div className="ev-project__body" style={{
                  maxHeight: active===i?600:0, opacity: active===i?1:0,
                  transition: `max-height 0.7s ${EASE}, opacity 0.5s ${EASE}`, overflow:"hidden",
                }}>
                  <p className="ev-project__desc">{p.desc}</p>
                  <div className="ev-project__caps">
                    {p.caps.map((c,j)=><span key={j} className="ev-project__cap">{c}</span>)}
                  </div>
                  <p className="ev-project__tagline">{p.tagline}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════ PROCESS ═══════════════ */
function Process() {
  const steps = [
    { num: "01", title: "Discovery", desc: "We learn how your organization operates. We identify objectives, challenges, workflows, and opportunities." },
    { num: "02", title: "Assessment", desc: "We analyze operational inefficiencies and identify areas where intelligent systems can create measurable value." },
    { num: "03", title: "Design", desc: "We design a solution tailored to your organization's specific requirements. No generic templates. No one-size-fits-all approaches." },
    { num: "04", title: "Implementation", desc: "We build and integrate the solution into your operational environment." },
    { num: "05", title: "Optimization", desc: "We continuously improve performance, usability, automation, and business outcomes." },
  ];
  return (
    <section id="process" className="ev-process">
      <div className="ev-process__container">
        <Reveal><div className="ev-section-label">05 — Our Process</div></Reveal>
        <Reveal delay={100}><h2 className="ev-process__heading">How We<br/><em>Work</em></h2></Reveal>
        <div className="ev-process__grid">
          {steps.map((s,i)=>(
            <Reveal key={i} delay={i*100}>
              <div className="ev-process__card">
                <div className="ev-process__card-num">{s.num}</div>
                <h3 className="ev-process__card-title">{s.title}</h3>
                <p className="ev-process__card-desc">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════ TRUST & SECURITY ═══════════════ */
function Trust() {
  return (
    <section id="trust" className="ev-trust">
      <div className="ev-trust__container">
        <div className="ev-trust__left">
          <Reveal><div className="ev-section-label ev-section-label--light">06 — Trust & Security</div></Reveal>
          <Reveal delay={100}><h2 className="ev-trust__heading">Your Data<br/>Remains <em>Yours</em></h2></Reveal>
          <Reveal delay={200}>
            <p className="ev-trust__text">We believe trust is the foundation of every intelligent system. Client information is used exclusively for the development, operation, and improvement of the agreed solution.</p>
            <p className="ev-trust__text">We do not use client data for unrelated purposes, unauthorized model training, or external development activities.</p>
          </Reveal>
        </div>
        <div className="ev-trust__right">
          <Stagger className="ev-trust__items" delay={120}>
            {[
              { icon: <Lock size={22}/>, title: "Confidentiality", desc: "Your information stays protected at every stage." },
              { icon: <Eye size={22}/>, title: "Transparency", desc: "Clear communication about how data is used." },
              { icon: <Shield size={22}/>, title: "Responsible AI", desc: "Ethical implementation at the core of every system." },
              { icon: <CheckCircle2 size={22}/>, title: "Security-First Design", desc: "Built from the ground up with security as a priority." },
            ].map((item,i)=>(
              <div key={i} className="ev-trust__item">
                <div className="ev-trust__item-icon">{item.icon}</div>
                <div>
                  <h4 className="ev-trust__item-title">{item.title}</h4>
                  <p className="ev-trust__item-desc">{item.desc}</p>
                </div>
              </div>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════ BIG STATEMENT ═══════════════ */
function BigStatement() {
  const parallaxRef = useParallax(0.02);
  return (
    <section className="ev-statement">
      <div className="ev-statement__bg" ref={parallaxRef}>
        <LogoMark size={500} color="rgba(255,255,255,0.03)"/>
      </div>
      <div className="ev-statement__content">
        <Reveal>
          <h2 className="ev-statement__text">
            The future belongs to<br/>organizations that think<br/><em>intelligently.</em>
          </h2>
        </Reveal>
        <Reveal delay={200}>
          <a href="#contact" className="ev-btn ev-btn--white ev-btn--lg" onClick={e=>{e.preventDefault();document.getElementById("contact")?.scrollIntoView({behavior:"smooth"})}}>
            Schedule a Consultation <ArrowRight size={20}/>
          </a>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══════════════ CONTACT ═══════════════ */
function Contact() {
  return (
    <section id="contact" className="ev-contact">
      <div className="ev-contact__container">
        <div className="ev-contact__left">
          <Reveal><div className="ev-section-label">07 — Contact</div></Reveal>
          <Reveal delay={100}><h2 className="ev-contact__heading">Let's Build Something<br/><em>Intelligent</em> Together</h2></Reveal>
          <Reveal delay={200}>
            <p className="ev-contact__text">Whether you are exploring automation, operational improvement, AI implementation, digital transformation, or industry-specific solutions, we would be happy to discuss how intelligent systems can support your goals.</p>
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
          </Stagger>
          <Reveal delay={400}>
            <a href="mailto:contact@evrielsystems.com" className="ev-btn ev-btn--dark ev-btn--lg" style={{marginTop:40}}>
              <Mail size={20}/> Send a Message
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════ FOOTER ═══════════════ */
function Footer() {
  return (
    <footer className="ev-footer">
      <div className="ev-footer__container">
        <div className="ev-footer__top">
          <div className="ev-footer__brand" style={{display:"flex",alignItems:"center",gap:14}}>
            <LogoMark size={28} color="#fff"/>
            <LogoWordmark color="#fff" subColor="rgba(255,255,255,0.35)" size={0.75}/>
          </div>
          <div className="ev-footer__tagline">Connecting Intelligence with Business</div>
        </div>
        <div className="ev-footer__line"/>
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
    { tag: "AI Strategy", title: "AI Beyond Chatbots: Practical Applications for Real Businesses", excerpt: "Exploring how AI creates value far beyond conversational interfaces — in operations, analytics, and decision-making.", date: "Nov 2024" },
    { tag: "Transformation", title: "Why Most Digital Transformation Initiatives Fail", excerpt: "The gap between technology adoption and real transformation is wider than most organizations realize.", date: "Oct 2024" },
    { tag: "Competitive Edge", title: "Building Competitive Advantage Through Intelligent Systems", excerpt: "How forward-thinking organizations use AI integration to create sustainable competitive moats.", date: "Sep 2024" },
    { tag: "Industry", title: "The Future of Construction Technology and Project Intelligence", excerpt: "Digital monitoring, AI-assisted reporting, and intelligent project management are reshaping construction.", date: "Aug 2024" },
    { tag: "Manufacturing", title: "Digital Transformation for Manufacturing and Industrial Operations", excerpt: "From predictive monitoring to workflow optimization — how manufacturers are embracing intelligent systems.", date: "Jul 2024" },
    { tag: "European Projects", title: "AI in European Projects: Opportunities and Challenges", excerpt: "Navigating the complexities of EU-funded projects with intelligent documentation and compliance tools.", date: "Jun 2024" },
    { tag: "SMEs", title: "How SMEs Can Compete Using Automation and Data", excerpt: "Scalable, cost-effective systems that level the playing field for growing businesses.", date: "May 2024" },
    { tag: "Knowledge", title: "Turning Organizational Knowledge Into Strategic Assets", excerpt: "Knowledge management systems that capture, organize, and activate institutional expertise.", date: "Apr 2024" },
  ];
  return (
    <>
      <section className="ev-insights-hero">
        <Reveal><div className="ev-section-label ev-section-label--light">Insights & Knowledge Center</div></Reveal>
        <Reveal delay={100}><h1 className="ev-insights-hero__title">Thinking<br/><em>Forward</em></h1></Reveal>
      </section>
      <section className="ev-insights-list">
        <div className="ev-insights-list__container">
          {articles.map((a,i)=>(
            <Reveal key={i} delay={i*80}>
              <article className="ev-article">
                <div className="ev-article__meta">
                  <span className="ev-tag">{a.tag}</span>
                  <span className="ev-article__date">{a.date}</span>
                </div>
                <h2 className="ev-article__title">{a.title}</h2>
                <p className="ev-article__excerpt">{a.excerpt}</p>
                <span className="ev-link">Read More <ArrowRight size={14}/></span>
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
          --black: #0A0A0A; --white: #FFFFFF; --platinum: #D9D9D9;
          --serif: 'DM Serif Display', Georgia, serif;
          --body: 'Inter', -apple-system, sans-serif;
        }
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
        html{scroll-behavior:smooth;font-size:16px}
        body{font-family:var(--body);background:var(--black);color:var(--black);-webkit-font-smoothing:antialiased}
        button{background:none;border:none;cursor:pointer;font-family:inherit}
        a{text-decoration:none;color:inherit}
        em{font-family:var(--serif);font-style:italic}
        .ev-br-desktop{display:block}

        /* NAV */
        .ev-nav{position:fixed;top:0;left:0;right:0;z-index:1000;padding:20px 0;transition:all 0.5s ${EASE}}
        .ev-nav--scrolled{background:rgba(255,255,255,0.95);backdrop-filter:blur(20px);padding:12px 0;box-shadow:0 1px 0 rgba(0,0,0,0.06)}
        .ev-nav__inner{max-width:1400px;margin:0 auto;padding:0 40px;display:flex;align-items:center;justify-content:space-between}
        .ev-nav__links{display:flex;align-items:center;gap:28px}
        .ev-nav__link{font-size:12px;font-weight:400;letter-spacing:0.06em;transition:opacity 0.3s;text-transform:uppercase}
        .ev-nav__link:hover{opacity:0.6}
        .ev-nav__cta{font-size:11px;font-weight:500;letter-spacing:0.08em;padding:10px 22px;border-radius:0;text-transform:uppercase;transition:all 0.3s}
        .ev-nav__cta:hover{opacity:0.85;transform:translateY(-1px)}
        .ev-nav__burger{display:none}
        .ev-mobile-menu{position:fixed;top:0;left:0;right:0;bottom:0;background:var(--black);z-index:999;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:24px;padding-top:80px}
        .ev-mobile-link{font-family:var(--serif);font-size:32px;color:#fff;transition:opacity 0.3s}
        .ev-mobile-link:hover{opacity:0.6}

        /* HERO */
        .ev-hero{position:relative;height:100vh;min-height:700px;display:flex;align-items:center;justify-content:center;background:var(--black);overflow:hidden}
        .ev-hero__bg{position:absolute;inset:0;pointer-events:none}
        .ev-hero__grid{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px);background-size:80px 80px}
        .ev-hero__gradient{position:absolute;inset:0;background:radial-gradient(ellipse 80% 60% at 50% 50%,rgba(255,255,255,0.04),transparent)}
        .ev-hero__logo-ghost{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);animation:heroRotate 90s linear infinite}
        @keyframes heroRotate{from{transform:translate(-50%,-50%) rotate(0deg)}to{transform:translate(-50%,-50%) rotate(360deg)}}
        .ev-hero__content{position:relative;z-index:2;text-align:center;padding:0 24px;max-width:1100px}
        .ev-hero__label{display:inline-flex;align-items:center;gap:12px;font-size:11px;letter-spacing:0.25em;text-transform:uppercase;color:rgba(255,255,255,0.45);margin-bottom:32px;font-weight:400}
        .ev-hero__label-line{width:40px;height:1px;background:rgba(255,255,255,0.3)}
        .ev-hero__title{color:#fff;font-family:var(--serif);font-size:clamp(36px,5.5vw,72px);font-weight:400;line-height:1.15;letter-spacing:-0.01em}
        .ev-hero__title em{color:var(--platinum)}
        .ev-hero__tagline{font-family:var(--body);font-size:clamp(15px,1.6vw,19px);font-weight:300;color:rgba(255,255,255,0.4);margin-top:32px;line-height:1.7;letter-spacing:0.02em}
        .ev-hero__cta-row{display:flex;gap:16px;justify-content:center;margin-top:44px;flex-wrap:wrap}
        .ev-hero__scroll{position:absolute;bottom:40px;left:50%;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:12px;color:rgba(255,255,255,0.3);font-size:10px;letter-spacing:0.2em;text-transform:uppercase}
        .ev-scroll-indicator{width:20px;height:32px;border:1px solid rgba(255,255,255,0.2);border-radius:10px;display:flex;justify-content:center;padding-top:6px}
        .ev-scroll-indicator__dot{width:3px;height:8px;background:rgba(255,255,255,0.5);border-radius:2px;animation:scrollBounce 2s ease-in-out infinite}
        @keyframes scrollBounce{0%,100%{transform:translateY(0);opacity:1}50%{transform:translateY(10px);opacity:0.3}}

        /* BUTTONS */
        .ev-btn{display:inline-flex;align-items:center;gap:10px;font-size:12px;font-weight:500;letter-spacing:0.08em;text-transform:uppercase;padding:16px 32px;transition:all 0.4s ${EASE};border:1px solid transparent}
        .ev-btn--white{background:#fff;color:var(--black)}
        .ev-btn--white:hover{background:var(--platinum);transform:translateY(-2px)}
        .ev-btn--ghost{border-color:rgba(255,255,255,0.2);color:#fff;background:transparent}
        .ev-btn--ghost:hover{border-color:#fff;background:rgba(255,255,255,0.05)}
        .ev-btn--dark{background:var(--black);color:#fff}
        .ev-btn--dark:hover{background:#222;transform:translateY(-2px)}
        .ev-btn--lg{padding:18px 44px;font-size:13px}
        .ev-link{display:inline-flex;align-items:center;gap:8px;font-size:13px;font-weight:500;letter-spacing:0.06em;text-transform:uppercase;transition:gap 0.3s ${EASE}}
        .ev-link:hover{gap:14px}

        /* SECTION LABEL */
        .ev-section-label{font-size:12px;font-weight:500;letter-spacing:0.2em;text-transform:uppercase;color:rgba(0,0,0,0.35);margin-bottom:20px}
        .ev-section-label--light{color:rgba(255,255,255,0.3)}

        /* MARQUEE */
        .ev-marquee{background:var(--platinum);padding:14px 0;overflow:hidden;border-top:1px solid rgba(0,0,0,0.06);border-bottom:1px solid rgba(0,0,0,0.06)}
        .ev-marquee__track{display:flex;gap:48px;white-space:nowrap;animation:marqueeScroll 35s linear infinite}
        .ev-marquee__item{display:inline-flex;align-items:center;gap:12px;font-size:12px;font-weight:500;letter-spacing:0.12em;text-transform:uppercase;color:var(--black);opacity:0.5}
        .ev-marquee__dot{width:4px;height:4px;border-radius:50%;background:var(--black);opacity:0.4}
        @keyframes marqueeScroll{from{transform:translateX(0)}to{transform:translateX(-25%)}}

        /* ABOUT */
        .ev-about{background:var(--white);padding:140px 0 100px}
        .ev-about__container{max-width:1400px;margin:0 auto;padding:0 40px;display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:start}
        .ev-about__heading{font-family:var(--serif);font-size:clamp(44px,5vw,76px);font-weight:400;line-height:1.05;margin-bottom:32px;color:var(--black)}
        .ev-about__lead{font-size:18px;line-height:1.7;color:rgba(0,0,0,0.6);margin-bottom:8px}
        .ev-about__highlight{font-family:var(--serif);font-size:24px;font-style:italic;color:var(--black);margin-bottom:28px;line-height:1.4}
        .ev-about__text{font-size:16px;line-height:1.75;color:rgba(0,0,0,0.55);margin-bottom:16px;max-width:540px}
        .ev-about__text strong{color:var(--black);font-weight:600}
        .ev-about__visual{position:relative;display:flex;align-items:center;justify-content:center;height:380px}
        .ev-about__visual-logo{position:relative;z-index:2}
        .ev-about__visual-ring{position:absolute;width:250px;height:250px;border:1px solid rgba(0,0,0,0.06);border-radius:50%;animation:ringPulse 4s ease-in-out infinite}
        .ev-about__visual-ring--2{width:340px;height:340px;animation-delay:0.8s}
        .ev-about__visual-ring--3{width:420px;height:420px;animation-delay:1.6s;border-style:dashed}
        @keyframes ringPulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.04);opacity:0.4}}
        .ev-about__challenges{display:flex;flex-direction:column;gap:12px;margin-top:32px}
        .ev-challenge{display:flex;align-items:center;gap:12px;font-size:14px;color:rgba(0,0,0,0.6);padding:10px 16px;border:1px solid rgba(0,0,0,0.06);transition:all 0.3s}
        .ev-challenge:hover{border-color:rgba(0,0,0,0.15);background:rgba(0,0,0,0.02)}
        .ev-challenge svg{color:var(--black);flex-shrink:0}

        /* INDUSTRIES */
        .ev-industries{background:var(--black);padding:140px 0}
        .ev-industries__container{max-width:1400px;margin:0 auto;padding:0 40px}
        .ev-industries__heading{font-family:var(--serif);font-size:clamp(44px,5vw,76px);font-weight:400;line-height:1.05;color:#fff;margin-bottom:64px}
        .ev-industries__heading em{color:var(--platinum)}
        .ev-industries__grid{display:grid;grid-template-columns:repeat(4,1fr);gap:0}
        .ev-industry{padding:32px 28px;border:1px solid rgba(255,255,255,0.04);transition:all 0.5s ${EASE};cursor:default;position:relative;overflow:hidden}
        .ev-industry--active,.ev-industry:hover{background:rgba(255,255,255,0.04)}
        .ev-industry__icon{color:var(--platinum);margin-bottom:16px;transition:transform 0.4s ${EASE}}
        .ev-industry:hover .ev-industry__icon{transform:scale(1.15)}
        .ev-industry__name{font-family:var(--serif);font-size:18px;font-weight:400;color:#fff;margin-bottom:10px;line-height:1.3}
        .ev-industry__desc{font-size:13px;line-height:1.6;color:rgba(255,255,255,0.35)}
        .ev-industry__line{position:absolute;bottom:0;left:0;width:0;height:2px;background:var(--platinum);transition:width 0.6s ${EASE}}
        .ev-industry:hover .ev-industry__line{width:100%}

        /* SERVICES */
        .ev-services{background:var(--white);padding:140px 0}
        .ev-services__container{max-width:1400px;margin:0 auto;padding:0 40px}
        .ev-services__header{margin-bottom:64px}
        .ev-services__heading{font-family:var(--serif);font-size:clamp(44px,5vw,76px);font-weight:400;line-height:1.05;color:var(--black)}
        .ev-services__list{display:flex;flex-direction:column;gap:0}
        .ev-service{display:grid;grid-template-columns:120px 1fr 1fr;gap:40px;padding:48px 0;border-top:1px solid rgba(0,0,0,0.08);transition:all 0.4s ${EASE};align-items:start}
        .ev-service:last-child{border-bottom:1px solid rgba(0,0,0,0.08)}
        .ev-service:hover{padding-left:16px}
        .ev-service__left{display:flex;flex-direction:column;align-items:flex-start;gap:16px}
        .ev-service__num{font-family:var(--serif);font-size:48px;color:rgba(0,0,0,0.06);line-height:1}
        .ev-service__icon{color:var(--black)}
        .ev-service__center{}
        .ev-service__title{font-family:var(--serif);font-size:28px;font-weight:400;margin-bottom:12px;line-height:1.2}
        .ev-service__desc{font-size:15px;line-height:1.7;color:rgba(0,0,0,0.5)}
        .ev-service__right{}
        .ev-service__apps-label{font-size:11px;font-weight:500;letter-spacing:0.15em;text-transform:uppercase;color:rgba(0,0,0,0.3);margin-bottom:12px}
        .ev-service__apps{list-style:none;display:flex;flex-direction:column;gap:8px}
        .ev-service__apps li{font-size:14px;color:rgba(0,0,0,0.55);padding-left:16px;position:relative}
        .ev-service__apps li::before{content:'';position:absolute;left:0;top:8px;width:6px;height:6px;border-radius:50%;background:rgba(0,0,0,0.12)}

        /* PROJECTS */
        .ev-projects{background:var(--black);padding:140px 0}
        .ev-projects__container{max-width:1200px;margin:0 auto;padding:0 40px}
        .ev-projects__heading{font-family:var(--serif);font-size:clamp(44px,5vw,76px);font-weight:400;line-height:1.05;color:#fff;margin-bottom:64px}
        .ev-projects__heading em{color:var(--platinum)}
        .ev-project{border-top:1px solid rgba(255,255,255,0.08);padding:28px 0;cursor:pointer;transition:all 0.3s}
        .ev-project:last-child{border-bottom:1px solid rgba(255,255,255,0.08)}
        .ev-project:hover{padding-left:16px}
        .ev-project__header{display:flex;justify-content:space-between;align-items:center}
        .ev-project__left{display:flex;align-items:center;gap:20px}
        .ev-project__idx{font-family:var(--serif);font-size:16px;color:rgba(255,255,255,0.2)}
        .ev-project__title{font-family:var(--serif);font-size:clamp(20px,2.5vw,28px);font-weight:400;color:#fff}
        .ev-project__toggle{color:rgba(255,255,255,0.4)}
        .ev-project__body{padding:20px 0 8px 48px}
        .ev-project__desc{font-size:15px;line-height:1.7;color:rgba(255,255,255,0.45);margin-bottom:16px;max-width:600px}
        .ev-project__caps{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:16px}
        .ev-project__cap{font-size:11px;letter-spacing:0.06em;text-transform:uppercase;padding:6px 14px;border:1px solid rgba(255,255,255,0.1);color:rgba(255,255,255,0.5);transition:all 0.3s}
        .ev-project__cap:hover{border-color:var(--platinum);color:var(--platinum)}
        .ev-project__tagline{font-family:var(--serif);font-size:16px;font-style:italic;color:var(--platinum);opacity:0.7}

        /* PROCESS */
        .ev-process{background:var(--white);padding:140px 0}
        .ev-process__container{max-width:1400px;margin:0 auto;padding:0 40px}
        .ev-process__heading{font-family:var(--serif);font-size:clamp(44px,5vw,76px);font-weight:400;line-height:1.05;color:var(--black);margin-bottom:64px}
        .ev-process__grid{display:grid;grid-template-columns:repeat(5,1fr);gap:0}
        .ev-process__card{padding:40px 28px;border-right:1px solid rgba(0,0,0,0.06);transition:all 0.4s;position:relative}
        .ev-process__card:last-child{border-right:none}
        .ev-process__card:hover{background:rgba(0,0,0,0.02)}
        .ev-process__card-num{font-family:var(--serif);font-size:48px;color:rgba(0,0,0,0.06);line-height:1;margin-bottom:20px}
        .ev-process__card-title{font-family:var(--serif);font-size:22px;font-weight:400;margin-bottom:14px}
        .ev-process__card-desc{font-size:13px;line-height:1.65;color:rgba(0,0,0,0.45)}

        /* TRUST */
        .ev-trust{background:var(--black);padding:140px 0}
        .ev-trust__container{max-width:1400px;margin:0 auto;padding:0 40px;display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:start}
        .ev-trust__heading{font-family:var(--serif);font-size:clamp(40px,4.5vw,68px);font-weight:400;line-height:1.05;color:#fff;margin-bottom:28px}
        .ev-trust__heading em{color:var(--platinum)}
        .ev-trust__text{font-size:16px;line-height:1.75;color:rgba(255,255,255,0.4);margin-bottom:16px}
        .ev-trust__items{display:flex;flex-direction:column;gap:24px}
        .ev-trust__item{display:flex;gap:16px;align-items:flex-start;padding:24px;border:1px solid rgba(255,255,255,0.06);transition:all 0.4s ${EASE}}
        .ev-trust__item:hover{border-color:rgba(255,255,255,0.15);background:rgba(255,255,255,0.02)}
        .ev-trust__item-icon{color:var(--platinum);flex-shrink:0;margin-top:2px}
        .ev-trust__item-title{font-family:var(--serif);font-size:18px;color:#fff;margin-bottom:4px}
        .ev-trust__item-desc{font-size:13px;line-height:1.6;color:rgba(255,255,255,0.35)}

        /* STATEMENT */
        .ev-statement{position:relative;background:var(--black);padding:160px 40px;display:flex;align-items:center;justify-content:center;min-height:70vh;overflow:hidden;border-top:1px solid rgba(255,255,255,0.04)}
        .ev-statement__bg{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)}
        .ev-statement__content{position:relative;z-index:2;text-align:center}
        .ev-statement__text{font-family:var(--serif);font-size:clamp(32px,4.5vw,64px);font-weight:400;line-height:1.2;color:#fff;margin-bottom:48px}
        .ev-statement__text em{color:var(--platinum)}

        /* CONTACT */
        .ev-contact{background:var(--white);padding:140px 0}
        .ev-contact__container{max-width:1400px;margin:0 auto;padding:0 40px;display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:start}
        .ev-contact__heading{font-family:var(--serif);font-size:clamp(40px,4.5vw,68px);font-weight:400;line-height:1.1;margin-bottom:24px}
        .ev-contact__text{font-size:16px;line-height:1.75;color:rgba(0,0,0,0.5);max-width:500px}
        .ev-contact__info{display:flex;flex-direction:column;gap:32px}
        .ev-contact__block-label{font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(0,0,0,0.3);margin-bottom:6px}
        .ev-contact__block-value{font-family:var(--serif);font-size:20px;transition:opacity 0.3s}
        .ev-contact__block-value:hover{opacity:0.6}

        /* FOOTER */
        .ev-footer{background:var(--black);padding:48px 0 32px;border-top:1px solid rgba(255,255,255,0.06)}
        .ev-footer__container{max-width:1400px;margin:0 auto;padding:0 40px}
        .ev-footer__top{display:flex;justify-content:space-between;align-items:center;margin-bottom:32px}
        .ev-footer__tagline{font-size:13px;color:rgba(255,255,255,0.25);letter-spacing:0.06em;font-style:italic}
        .ev-footer__line{height:1px;background:rgba(255,255,255,0.06);margin-bottom:24px}
        .ev-footer__bottom{display:flex;justify-content:space-between;font-size:12px;color:rgba(255,255,255,0.2);letter-spacing:0.04em}

        /* INSIGHTS */
        .ev-insights-hero{background:var(--black);padding:200px 40px 120px;text-align:center}
        .ev-insights-hero__title{font-family:var(--serif);font-size:clamp(56px,8vw,120px);font-weight:400;color:#fff;line-height:1}
        .ev-insights-hero__title em{color:var(--platinum)}
        .ev-insights-list{background:var(--white);padding:100px 0}
        .ev-insights-list__container{max-width:900px;margin:0 auto;padding:0 40px}
        .ev-article{padding:44px 0;border-bottom:1px solid rgba(0,0,0,0.08)}
        .ev-article:first-child{border-top:1px solid rgba(0,0,0,0.08)}
        .ev-article__meta{display:flex;align-items:center;gap:16px;margin-bottom:14px}
        .ev-tag{font-size:10px;letter-spacing:0.08em;text-transform:uppercase;padding:5px 12px;border:1px solid rgba(0,0,0,0.1);background:transparent}
        .ev-article__date{font-size:12px;color:rgba(0,0,0,0.3);letter-spacing:0.06em}
        .ev-article__title{font-family:var(--serif);font-size:26px;font-weight:400;line-height:1.3;margin-bottom:10px;transition:opacity 0.3s;cursor:pointer}
        .ev-article__title:hover{opacity:0.6}
        .ev-article__excerpt{font-size:14px;line-height:1.65;color:rgba(0,0,0,0.5);margin-bottom:14px;max-width:700px}

        /* RESPONSIVE */
        @media(max-width:1024px){
          .ev-industries__grid{grid-template-columns:repeat(3,1fr)}
          .ev-process__grid{grid-template-columns:repeat(3,1fr)}
          .ev-process__card{border-bottom:1px solid rgba(0,0,0,0.06)}
          .ev-about__container,.ev-contact__container,.ev-trust__container{grid-template-columns:1fr;gap:48px}
          .ev-service{grid-template-columns:80px 1fr;gap:24px}
          .ev-service__right{grid-column:1/-1;padding-left:80px}
        }
        @media(max-width:768px){
          .ev-nav__links{display:none}.ev-nav__burger{display:block}.ev-nav__inner{padding:0 20px}
          .ev-br-desktop{display:none}
          .ev-hero__title{font-size:clamp(28px,7vw,48px)}
          .ev-hero__tagline{font-size:15px}
          .ev-about{padding:100px 0 80px}.ev-about__container{padding:0 20px}
          .ev-about__heading{font-size:clamp(36px,9vw,52px)}
          .ev-about__visual{height:250px}
          .ev-about__visual-logo svg{width:120px!important;height:120px!important}
          .ev-about__visual-ring{width:180px;height:180px}
          .ev-about__visual-ring--2{width:260px;height:260px}
          .ev-about__visual-ring--3{width:340px;height:340px}
          .ev-industries{padding:100px 0}.ev-industries__container{padding:0 20px}
          .ev-industries__heading{font-size:clamp(36px,9vw,52px);margin-bottom:40px}
          .ev-industries__grid{grid-template-columns:1fr 1fr}
          .ev-services{padding:100px 0}.ev-services__container{padding:0 20px}
          .ev-services__heading{font-size:clamp(36px,9vw,52px)}
          .ev-service{grid-template-columns:1fr;gap:16px;padding:32px 0}
          .ev-service__left{flex-direction:row;align-items:center;gap:12px}
          .ev-service__num{font-size:32px}
          .ev-service__right{padding-left:0}
          .ev-service__title{font-size:24px}
          .ev-projects{padding:100px 0}.ev-projects__container{padding:0 20px}
          .ev-projects__heading{font-size:clamp(36px,9vw,52px)}
          .ev-project__left{gap:12px}
          .ev-project__title{font-size:20px}
          .ev-project__body{padding-left:0}
          .ev-process{padding:100px 0}.ev-process__container{padding:0 20px}
          .ev-process__heading{font-size:clamp(36px,9vw,52px);margin-bottom:40px}
          .ev-process__grid{grid-template-columns:1fr}
          .ev-process__card{border-right:none;border-bottom:1px solid rgba(0,0,0,0.06);padding:28px 0}
          .ev-trust{padding:100px 0}.ev-trust__container{padding:0 20px;gap:40px}
          .ev-trust__heading{font-size:clamp(36px,9vw,48px)}
          .ev-statement{padding:100px 20px;min-height:50vh}
          .ev-statement__text{font-size:clamp(26px,6vw,44px)}
          .ev-contact{padding:100px 0}.ev-contact__container{padding:0 20px;gap:40px}
          .ev-contact__heading{font-size:clamp(32px,8vw,52px)}
          .ev-footer__container{padding:0 20px}
          .ev-footer__top{flex-direction:column;gap:16px;align-items:flex-start}
          .ev-footer__bottom{flex-direction:column;gap:8px}
          .ev-insights-hero{padding:160px 20px 80px}
          .ev-insights-list__container{padding:0 20px}
          .ev-article__title{font-size:22px}
        }
        @media(max-width:480px){
          .ev-hero{min-height:100svh}
          .ev-hero__title{font-size:clamp(24px,7vw,36px)}
          .ev-hero__cta-row{flex-direction:column;align-items:center}
          .ev-btn{width:100%;justify-content:center}
          .ev-industries__grid{grid-template-columns:1fr}
        }
      `}</style>

      <Nav page={page} setPage={setPage}/>
      {page === "home" ? (
        <>
          <Hero/>
          <MarqueeStrip/>
          <About/>
          <Industries/>
          <Services/>
          <Projects/>
          <Process/>
          <Trust/>
          <BigStatement/>
          <Contact/>
        </>
      ) : page === "insights" ? (
        <InsightsPage/>
      ) : null}
      <Footer/>
    </>
  );
}

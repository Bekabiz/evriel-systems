import { useState, useEffect, useRef } from "react";
import { Mail, ArrowRight, ArrowUpRight, Menu, X, Minus, Plus, Lock, Eye, Shield, CheckCircle2, ChevronLeft } from "lucide-react";

const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";
const EASE2 = "cubic-bezier(0.22, 1, 0.36, 1)";

/* ═══ HOOKS ═══ */
function useReveal(threshold = 0.08) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(el); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function useParallax(speed = 0.04) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf;
    const onScroll = () => {
      raf = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const center = rect.top + rect.height / 2 - window.innerHeight / 2;
        el.style.transform = `translate3d(0,${center * speed}px,0)`;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, [speed]);
  return ref;
}

/* ═══ ANIMATION COMPONENTS ═══ */
function Reveal({ children, className = "", style = {}, delay = 0, direction = "up" }) {
  const [ref, visible] = useReveal(0.06);
  const transforms = {
    up: "translateY(60px)",
    down: "translateY(-60px)",
    left: "translateX(60px)",
    right: "translateX(-60px)",
    scale: "scale(0.92)",
    none: "none"
  };
  return (
    <div ref={ref} className={className} style={{
      ...style,
      opacity: visible ? 1 : 0,
      transform: visible ? "translate3d(0,0,0) scale(1)" : transforms[direction],
      transition: `opacity 1.1s ${EASE2} ${delay}ms, transform 1.1s ${EASE2} ${delay}ms`
    }}>
      {children}
    </div>
  );
}

function Stagger({ children, className = "", style = {}, delay = 100 }) {
  const [ref, visible] = useReveal(0.05);
  return (
    <div ref={ref} className={className} style={style}>
      {Array.isArray(children) ? children.map((child, i) => (
        <div key={i} style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(40px)",
          transition: `opacity 1s ${EASE2} ${i * delay}ms, transform 1s ${EASE2} ${i * delay}ms`
        }}>{child}</div>
      )) : children}
    </div>
  );
}

function LineReveal({ delay = 0, color = "rgba(0,0,0,0.08)" }) {
  const [ref, visible] = useReveal(0.1);
  return (
    <div ref={ref} style={{ overflow: "hidden" }}>
      <div style={{
        height: 1,
        background: color,
        transform: visible ? "scaleX(1)" : "scaleX(0)",
        transformOrigin: "left",
        transition: `transform 1.4s ${EASE2} ${delay}ms`
      }} />
    </div>
  );
}

/* ═══ LOGO ═══ */
const LogoMark = ({ size = 48, color = "currentColor", spinning = false }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"
    style={{ animation: spinning ? "ev-logospin 90s linear infinite" : "none" }}>
    <line x1="180" y1="100" x2="140" y2="169.3" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="140" y1="169.3" x2="60" y2="169.3" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="60" y1="169.3" x2="20" y2="100" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="20" y1="100" x2="60" y2="30.7" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="60" y1="30.7" x2="140" y2="30.7" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="140" y1="30.7" x2="180" y2="100" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="100" y1="100" x2="60" y2="30.7" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="100" y1="100" x2="20" y2="100" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="100" y1="100" x2="60" y2="169.3" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="100" y1="100" x2="133.6" y2="100" stroke={color} strokeWidth="1.875" strokeLinecap="round"/>
    <circle cx="180" cy="100" r="4.6" fill={color}/>
    <circle cx="140" cy="169.3" r="4.6" fill={color}/>
    <circle cx="60" cy="169.3" r="4.6" fill={color}/>
    <circle cx="20" cy="100" r="4.6" fill={color}/>
    <circle cx="60" cy="30.7" r="4.6" fill={color}/>
    <circle cx="140" cy="30.7" r="4.6" fill={color}/>
    <circle cx="100" cy="100" r="5.6" fill={color} style={{ animation: "ev-centerPulse 3s ease-in-out infinite" }}/>
    <circle cx="133.6" cy="100" r="3.7" fill={color}/>
  </svg>
);

const LogoFull = ({ markSize = 44, color = "#fff", subColor }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
    <LogoMark size={markSize} color={color}/>
    <div>
      <div style={{ width: 24, height: 1, background: color, opacity: 0.4, marginBottom: 5 }}/>
      <div style={{ fontFamily: "var(--display)", fontSize: markSize * 0.52, fontWeight: 400, color, letterSpacing: "0.04em", lineHeight: 1 }}>Evriel</div>
      <div style={{ fontFamily: "var(--body)", fontSize: markSize * 0.18, fontWeight: 400, color: subColor || color, opacity: subColor ? 1 : 0.35, letterSpacing: "0.4em", textTransform: "uppercase", marginTop: 3 }}>Systems</div>
    </div>
  </div>
);

/* ═══ NAV ═══ */
function Nav({ page, setPage, articleSlug }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);
  const goHome = () => { setPage("home"); setOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const goSection = (id) => {
    setOpen(false);
    if (page !== "home") { setPage("home"); setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 250); }
    else document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };
  const c = scrolled ? "var(--dark)" : "#fff";
  return (
    <nav className={`ev-nav${scrolled ? " ev-nav--scrolled" : ""}`}>
      <div className="ev-nav__inner">
        <div onClick={goHome} style={{ cursor: "pointer" }}>
          <LogoFull markSize={34} color={c} subColor={scrolled ? "#999" : "rgba(255,255,255,0.35)"}/>
        </div>
        <div className="ev-nav__links">
          {[["About","about"],["Industries","industries"],["Services","services"],["Work","projects"]].map(([l,id])=>(
            <button key={id} onClick={()=>goSection(id)} className="ev-nav__link" style={{color:c}}>{l}</button>
          ))}
          <button onClick={()=>{ setPage("insights"); setOpen(false); window.scrollTo({top:0,behavior:"smooth"}); }} className="ev-nav__link" style={{color:c}}>Insights</button>
          <button onClick={()=>goSection("contact")} className="ev-nav__cta" style={{
            background: scrolled ? "var(--dark)" : "rgba(255,255,255,0.1)",
            color: scrolled ? "#fff" : "rgba(255,255,255,0.9)",
            border: scrolled ? "none" : "1px solid rgba(255,255,255,0.15)",
            padding: "11px 24px",
            backdropFilter: scrolled ? "none" : "blur(10px)"
          }}>
            Let's Talk
          </button>
        </div>
        <button className="ev-nav__burger" onClick={()=>setOpen(!open)} style={{color:c}}>
          {open ? <X size={22}/> : <Menu size={22}/>}
        </button>
      </div>
      {open && (
        <div className="ev-mobile-menu">
          {[["About","about"],["Industries","industries"],["Services","services"],["Work","projects"]].map(([l,id])=>(
            <button key={id} onClick={()=>goSection(id)} className="ev-mobile-link">{l}</button>
          ))}
          <button onClick={()=>{ setPage("insights"); setOpen(false); window.scrollTo({top:0,behavior:"smooth"}); }} className="ev-mobile-link">Insights</button>
          <button onClick={()=>goSection("contact")} className="ev-mobile-link">Contact</button>
        </div>
      )}
    </nav>
  );
}

/* ═══ HERO ═══ */
function Hero() {
  const [on, setOn] = useState(false);
  const gridRef = useParallax(0.02);
  useEffect(() => { const t = setTimeout(() => setOn(true), 100); return () => clearTimeout(t); }, []);
  const anim = (delay) => ({
    opacity: on ? 1 : 0,
    transform: on ? "translateY(0)" : "translateY(50px)",
    transition: `opacity 1.2s ${EASE2} ${delay}ms, transform 1.2s ${EASE2} ${delay}ms`
  });
  return (
    <section className="ev-hero">
      <div className="ev-hero__bg">
        <div className="ev-hero__grid" ref={gridRef}/>
        <div className="ev-hero__glow"/>
        <div className="ev-hero__glow2"/>
        <div className="ev-hero__ghost"><LogoMark size={600} color="rgba(255,255,255,0.015)" spinning/></div>
      </div>
      <div className="ev-hero__body">
        <div style={{overflow:"hidden"}}>
          <div className="ev-hero__eyebrow" style={anim(200)}>
            <span className="ev-hero__eyedot"/>
            AI Systems &middot; Automation &middot; Digital Transformation
          </div>
        </div>
        <div style={{overflow:"hidden"}}>
          <h1 className="ev-hero__h1" style={anim(400)}>
            Building Intelligent<br/>Systems for Modern<br/><em>Organizations</em>
          </h1>
        </div>
        <div style={{overflow:"hidden"}}>
          <p className="ev-hero__sub" style={anim(650)}>
            We design, build, and implement AI-powered solutions that<br className="desk-br"/>
            transform how organizations operate and grow.
          </p>
        </div>
        <div style={{overflow:"hidden"}}>
          <div className="ev-hero__ctas" style={anim(850)}>
            <a href="#services" className="ev-btn ev-btn--white" onClick={e=>{e.preventDefault();document.getElementById("services")?.scrollIntoView({behavior:"smooth"})}}>
              Explore Solutions <ArrowRight size={16}/>
            </a>
            <a href="#contact" className="ev-btn ev-btn--ghost" onClick={e=>{e.preventDefault();document.getElementById("contact")?.scrollIntoView({behavior:"smooth"})}}>
              Start a Conversation
            </a>
          </div>
        </div>
      </div>
      <div className="ev-hero__scroll" style={{opacity:on?0.6:0,transition:`opacity 1s ${EASE2} 1400ms`}}>
        <div className="ev-scroll-pill"><div className="ev-scroll-dot"/></div>
      </div>
    </section>
  );
}

/* ═══ MARQUEE ═══ */
function Marquee() {
  const items = ["AI Integration","Workflow Automation","Business Intelligence","Digital Transformation","Intelligent Systems","Operational Excellence","Industry Solutions","Data Analytics"];
  const row = items.map((t,i) => <span key={i} className="ev-mq__item"><span className="ev-mq__dot"/>{t}</span>);
  return <div className="ev-mq"><div className="ev-mq__track">{row}{row}{row}{row}</div></div>;
}

/* ═══ ABOUT ═══ */
function About() {
  return (
    <section id="about" className="ev-about">
      <div className="ev-about__inner">
        <div className="ev-about__left">
          <Reveal><p className="ev-label">01 / About</p></Reveal>
          <Reveal delay={100}><h2 className="ev-about__h">Intelligence<br/>With <em>Purpose</em></h2></Reveal>
          <Reveal delay={200}>
            <p className="ev-about__lead">Evriel Systems was founded on a simple belief:</p>
            <p className="ev-about__quote">Technology should solve real problems.</p>
          </Reveal>
          <Reveal delay={280}>
            <p className="ev-about__p">Across industries, countries, and organizations, many businesses face similar challenges. At the same time, artificial intelligence, automation, and digital technologies are transforming how organizations operate.</p>
            <p className="ev-about__p">The challenge is not accessing technology. <strong>The challenge is implementing it correctly.</strong></p>
            <p className="ev-about__p">We design intelligent systems that connect people, processes, information, and technology into unified operational environments, focused on practical solutions that create measurable business value.</p>
          </Reveal>
        </div>
        <div className="ev-about__right">
          <Reveal direction="scale" delay={300}>
            <div className="ev-about__logo-wrap">
              <div className="ev-about__logo-ring ev-about__logo-ring--1"/>
              <div className="ev-about__logo-ring ev-about__logo-ring--2"/>
              <div className="ev-about__logo-ring ev-about__logo-ring--3"/>
              <div className="ev-about__logo-center">
                <LogoMark size={180} color="rgba(255,255,255,0.9)"/>
              </div>
            </div>
          </Reveal>
          <Stagger className="ev-challenges" delay={90}>
            {["Fragmented Information","Repetitive Manual Work","Disconnected Systems","Inefficient Communication","Slow Decision-Making"].map((c,i)=>(
              <div key={i} className="ev-challenge">
                <span className="ev-challenge__line"/>
                <span>{c}</span>
              </div>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}

/* ═══ INDUSTRIES — Editorial Rows ═══ */
const IND_DATA = [
  { name:"Construction & Engineering", items:["Digital monitoring","Project intelligence","Documentation automation","Reporting systems"] },
  { name:"Manufacturing & Industrial", items:["Workflow optimization","Operational analytics","Predictive monitoring","Production systems"] },
  { name:"Tourism & Hospitality", items:["Guest management","Operational automation","Customer communication","Business analytics"] },
  { name:"Retail & Commerce", items:["Customer intelligence","Inventory visibility","Process automation","Reporting systems"] },
  { name:"Import & Export", items:["Trade documentation","Workflow automation","Operational coordination","Information management"] },
  { name:"Professional Services", items:["Knowledge systems","Workflow optimization","AI-assisted operations"] },
  { name:"Marketing & SEO", items:["Content intelligence","Domain qualification","Opportunity discovery","Reporting automation"] },
  { name:"European Projects", items:["Project management support","Reporting assistance","Knowledge management","Project intelligence"] },
  { name:"NGOs & Associations", items:["Operational efficiency","Communication systems","Data management","Project support"] },
  { name:"Education & Training", items:["Knowledge systems","Digital learning support","Administrative automation"] },
  { name:"Startups & SMEs", items:["Scalable systems","Growth support","Operational maturity"] },
];

function Industries() {
  const [hov, setHov] = useState(null);
  return (
    <section id="industries" className="ev-industries">
      <div className="ev-ind__container">
        <Reveal><p className="ev-label">02 / Industries</p></Reveal>
        <Reveal delay={100}>
          <h2 className="ev-section-h">Industries<br/>We <em>Support</em></h2>
          <p className="ev-section-sub">Intelligent systems designed for the specific challenges of each sector.</p>
        </Reveal>
        <div className="ev-ind__list">
          {IND_DATA.map((d,i)=>(
            <Reveal key={i} delay={i * 40}>
              <div
                className={`ev-ind-row${hov === i ? " ev-ind-row--active" : ""}`}
                onMouseEnter={()=>setHov(i)}
                onMouseLeave={()=>setHov(null)}
              >
                <span className="ev-ind-row__num">{String(i+1).padStart(2,"0")}</span>
                <h3 className="ev-ind-row__name">{d.name}</h3>
                <div className="ev-ind-row__items">
                  {d.items.map((item,j)=>(
                    <span key={j} className="ev-ind-row__tag">{item}</span>
                  ))}
                </div>
                <ArrowUpRight size={16} className="ev-ind-row__arrow"/>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══ SERVICES ═══ */
const SVC_DATA = [
  { num:"01", title:"AI Automation", desc:"Reduce repetitive work and improve operational efficiency through intelligent automation.", apps:["Email automation","Workflow automation","Internal process automation","AI-powered assistants","Customer communication systems"] },
  { num:"02", title:"Business Intelligence", desc:"Transform business information into actionable insights.", apps:["Reporting dashboards","Operational analytics","Decision support systems","Data visualization","Performance monitoring"] },
  { num:"03", title:"Intelligent Systems", desc:"Custom-built solutions designed around the unique needs of each organization.", apps:["Industry-specific platforms","Knowledge management","AI-powered operational tools","Intelligent information systems"] },
  { num:"04", title:"Digital Transformation", desc:"Support organizations as they modernize operations and adopt emerging technologies.", apps:["Process redesign","Digital strategy","Technology integration","Operational modernization"] },
];

function Services() {
  return (
    <section id="services" className="ev-services">
      <div className="ev-svc__container">
        <Reveal><p className="ev-label ev-label--light">03 / Services</p></Reveal>
        <Reveal delay={100}><h2 className="ev-section-h ev-section-h--light">What We<br/><em>Deliver</em></h2></Reveal>
        <div className="ev-svc__grid">
          {SVC_DATA.map((s,i)=>(
            <Reveal key={i} delay={i*100}>
              <div className="ev-svc">
                <div className="ev-svc__top">
                  <span className="ev-svc__num">{s.num}</span>
                  <h3 className="ev-svc__title">{s.title}</h3>
                </div>
                <p className="ev-svc__desc">{s.desc}</p>
                <div className="ev-svc__apps">
                  {s.apps.map((a,j)=><span key={j} className="ev-svc__app">{a}</span>)}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══ PROJECTS — Product Names ═══ */
const PROJ_DATA = [
  { title:"Domain Intel", subtitle:"AI-Powered SEO Intelligence", desc:"Automates identification, evaluation, and qualification of SEO and partnership opportunities.", caps:["Domain analysis","Relevance scoring","Niche classification","Opportunity prioritization","Workflow automation"], tagline:"Reducing manual research while improving decision quality." },
  { title:"Workforce AI", subtitle:"Intelligent Team Management", desc:"A business-trained AI assistant that supports employees through organization-specific knowledge.", caps:["Internal support","Employee onboarding","Process guidance","Knowledge retrieval","Operational assistance"], tagline:"Functions as a continuously available digital team member." },
  { title:"EU Project Assistant", subtitle:"European Project Intelligence", desc:"Simplifies the management of complex European-funded projects.", caps:["Documentation support","Reporting assistance","Compliance guidance","Knowledge organization","Stakeholder access"], tagline:"Helping teams navigate complex project environments." },
  { title:"Project Vision", subtitle:"Engineering Monitoring Platform", desc:"Supports engineering and construction projects with real-time operational visibility.", caps:["AutoCAD integration","Project documentation","Site progress monitoring","Reporting workflows","Communication management"], tagline:"Improved visibility across the entire project lifecycle." },
  { title:"Smart Email Ops", subtitle:"AI Communication Platform", desc:"Advanced communication system trained on organizational knowledge and business processes.", caps:["Customer communication","Intelligent responses","Workflow execution","Brand-consistent communication"], tagline:"Acts as an intelligent extension of the organization." },
  { title:"GIS Intel", subtitle:"Spatial Intelligence Platform", desc:"Geographic intelligence system supporting planning and operational decision-making.", caps:["Mapping","Infrastructure analysis","Location intelligence","Spatial data visualization","Decision support"], tagline:"Useful across engineering, infrastructure, logistics, and planning." },
];

function Projects() {
  const [active, setActive] = useState(null);
  return (
    <section id="projects" className="ev-projects">
      <div className="ev-proj__container">
        <Reveal><p className="ev-label">04 / Work</p></Reveal>
        <Reveal delay={100}><h2 className="ev-section-h">Proven<br/><em>Solutions</em></h2></Reveal>
        <div className="ev-proj__list">
          {PROJ_DATA.map((p,i)=>(
            <Reveal key={i} delay={i*60}>
              <div className={`ev-proj${active===i?" ev-proj--open":""}`} onClick={()=>setActive(active===i?null:i)}>
                <div className="ev-proj__header">
                  <div className="ev-proj__hl">
                    <span className="ev-proj__idx">0{i+1}</span>
                    <div>
                      <h3 className="ev-proj__title">{p.title}</h3>
                      <span className="ev-proj__subtitle">{p.subtitle}</span>
                    </div>
                  </div>
                  <span className="ev-proj__tog">{active===i?<Minus size={18}/>:<Plus size={18}/>}</span>
                </div>
                <div style={{ maxHeight:active===i?600:0, opacity:active===i?1:0, overflow:"hidden", transition:`max-height 0.7s ${EASE2}, opacity 0.5s ${EASE2}` }}>
                  <div className="ev-proj__body">
                    <p className="ev-proj__desc">{p.desc}</p>
                    <div className="ev-proj__caps">{p.caps.map((c,j)=><span key={j} className="ev-proj__cap">{c}</span>)}</div>
                    <p className="ev-proj__tagline">{p.tagline}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══ PROCESS ═══ */
const PROC_DATA = [
  { title:"Discovery", desc:"We learn how your organization operates. We identify objectives, challenges, workflows, and opportunities." },
  { title:"Assessment", desc:"We analyze operational inefficiencies and identify areas where intelligent systems can create measurable value." },
  { title:"Design", desc:"We design a solution tailored to your organization. No generic templates. No one-size-fits-all approaches." },
  { title:"Implementation", desc:"We build and integrate the solution into your operational environment." },
  { title:"Optimization", desc:"We continuously improve performance, usability, automation, and business outcomes." },
];

function Process() {
  return (
    <section id="process" className="ev-process">
      <div className="ev-proc__container">
        <Reveal><p className="ev-label ev-label--light">05 / Process</p></Reveal>
        <Reveal delay={100}><h2 className="ev-section-h ev-section-h--light">How We<br/><em>Work</em></h2></Reveal>
        <div className="ev-proc__timeline">
          {PROC_DATA.map((s,i)=>(
            <Reveal key={i} delay={i*120} direction="left">
              <div className="ev-proc__step">
                <div className="ev-proc__step-line">
                  <div className="ev-proc__step-dot"/>
                  {i < PROC_DATA.length - 1 && <div className="ev-proc__step-connector"/>}
                </div>
                <div className="ev-proc__step-content">
                  <span className="ev-proc__step-num">Step {String(i+1).padStart(2,"0")}</span>
                  <h3 className="ev-proc__step-title">{s.title}</h3>
                  <p className="ev-proc__step-desc">{s.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══ WHY EVRIEL — NEW ═══ */
function WhyEvriel() {
  const pillars = [
    { title:"Practical", desc:"We focus on solving operational challenges, not selling technology for the sake of technology." },
    { title:"Intelligent", desc:"AI, automation, and data-driven systems designed around your real business needs." },
    { title:"Human-Centered", desc:"Technology should support people, not complicate their work. We build with this as a principle." },
  ];
  return (
    <section className="ev-why">
      <div className="ev-why__container">
        <Reveal><p className="ev-label">06 / Why Evriel</p></Reveal>
        <Reveal delay={100}><h2 className="ev-section-h">Why Organizations<br/>Choose <em>Evriel</em></h2></Reveal>
        <div className="ev-why__pillars">
          {pillars.map((p,i)=>(
            <Reveal key={i} delay={200 + i * 140}>
              <div className="ev-why__pillar">
                <span className="ev-why__pillar-num">{String(i+1).padStart(2,"0")}</span>
                <h3 className="ev-why__pillar-title">{p.title}</h3>
                <div className="ev-why__pillar-line"/>
                <p className="ev-why__pillar-desc">{p.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══ OUTCOMES — NEW ═══ */
function Outcomes() {
  const data = [
    { title:"Operational Efficiency", desc:"Reduce repetitive work and streamline workflows across your organization." },
    { title:"Decision-Making", desc:"Transform information into actionable insights that drive better outcomes." },
    { title:"Communication", desc:"Connect teams, processes, and systems into unified operational environments." },
    { title:"Growth", desc:"Build scalable digital foundations for future expansion and competitive advantage." },
  ];
  return (
    <section className="ev-outcomes">
      <div className="ev-outcomes__container">
        <Reveal><p className="ev-label ev-label--light">07 / Outcomes</p></Reveal>
        <Reveal delay={100}><h2 className="ev-section-h ev-section-h--light">What We Help<br/><em>Improve</em></h2></Reveal>
        <div className="ev-outcomes__grid">
          {data.map((d,i)=>(
            <Reveal key={i} delay={150 + i * 100}>
              <div className="ev-outcome">
                <span className="ev-outcome__num">{String(i+1).padStart(2,"0")}</span>
                <h3 className="ev-outcome__title">{d.title}</h3>
                <p className="ev-outcome__desc">{d.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══ TRUST ═══ */
function Trust() {
  return (
    <section className="ev-trust">
      <div className="ev-trust__container">
        <div className="ev-trust__left">
          <Reveal><p className="ev-label">08 / Trust</p></Reveal>
          <Reveal delay={100}><h2 className="ev-section-h">Your Data<br/>Remains <em>Yours</em></h2></Reveal>
          <Reveal delay={180}>
            <p className="ev-trust__p">We believe trust is the foundation of every intelligent system. Client information is used exclusively for the development, operation, and improvement of the agreed solution.</p>
            <p className="ev-trust__p">We do not use client data for unrelated purposes, unauthorized model training, or external development activities.</p>
          </Reveal>
        </div>
        <div className="ev-trust__right">
          <Stagger className="ev-trust__items" delay={110}>
            {[
              { icon:<Lock size={20}/>, t:"Confidentiality", d:"Your information stays protected at every stage." },
              { icon:<Eye size={20}/>, t:"Transparency", d:"Clear communication about data usage and management." },
              { icon:<Shield size={20}/>, t:"Responsible AI", d:"Ethical implementation at the core of every system." },
              { icon:<CheckCircle2 size={20}/>, t:"Security-First", d:"Built with security as a non-negotiable priority." },
            ].map((item,i)=>(
              <div key={i} className="ev-trust__item">
                <div className="ev-trust__item-icon">{item.icon}</div>
                <div>
                  <h4 className="ev-trust__item-t">{item.t}</h4>
                  <p className="ev-trust__item-d">{item.d}</p>
                </div>
              </div>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}

/* ═══ BORDERS — NEW ═══ */
function Borders() {
  return (
    <section className="ev-borders">
      <div className="ev-borders__container">
        <Reveal>
          <p className="ev-label ev-label--light">09 / Global</p>
          <h2 className="ev-section-h ev-section-h--light">Working Across<br/><em>Borders</em></h2>
          <p className="ev-borders__text">We support organizations across Europe and beyond. Projects and communications can be conducted in multiple languages depending on client requirements.</p>
          <div className="ev-borders__langs">
            {["English","Italian","Spanish","Greek","Polish"].map((l,i)=>(
              <span key={i} className="ev-borders__lang">{l}</span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══ STATEMENT ═══ */
function Statement() {
  const pRef = useParallax(0.02);
  return (
    <section className="ev-statement">
      <div className="ev-statement__bg" ref={pRef}><LogoMark size={400} color="rgba(255,255,255,0.02)"/></div>
      <div className="ev-statement__body">
        <Reveal>
          <h2 className="ev-statement__h">The future belongs to<br/>organizations that think<br/><em>intelligently.</em></h2>
        </Reveal>
        <Reveal delay={200}>
          <a href="#contact" className="ev-btn ev-btn--white ev-btn--lg" onClick={e=>{e.preventDefault();document.getElementById("contact")?.scrollIntoView({behavior:"smooth"})}}>
            Start a Conversation <ArrowRight size={17}/>
          </a>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══ CONTACT ═══ */
function Contact() {
  const [form, setForm] = useState({ name:"", company:"", email:"", phone:"", language:"English", industry:"", interests:[], challenge:"" });
  const [sent, setSent] = useState(false);
  const toggle = (val) => setForm(f => ({ ...f, interests: f.interests.includes(val) ? f.interests.filter(x=>x!==val) : [...f.interests, val] }));
  const handleSubmit = (e) => { e.preventDefault(); setSent(true); };
  const Field = ({ label, name, type="text", placeholder, optional=false }) => (
    <div className="ev-field">
      <label className="ev-field__label">{label}{optional && <span className="ev-field__opt"> (Optional)</span>}</label>
      <input type={type} className="ev-field__input" placeholder={placeholder} value={form[name]}
        onChange={e=>setForm(f=>({...f,[name]:e.target.value}))} />
    </div>
  );
  return (
    <section id="contact" className="ev-contact">
      <div className="ev-contact__container">
        <div className="ev-contact__left">
          <Reveal><p className="ev-label">10 / Contact</p></Reveal>
          <Reveal delay={100}><h2 className="ev-section-h">Let's Discuss<br/>Your <em>Project</em></h2></Reveal>
          <Reveal delay={180}>
            <p className="ev-contact__sub">Every organization faces different challenges.</p>
            <p className="ev-contact__p">Tell us about your goals, processes, or operational needs, and we'll explore the most effective solution together.</p>
          </Reveal>
          <Stagger className="ev-contact__info" delay={100}>
            <div className="ev-contact__block">
              <div className="ev-contact__blabel">Email</div>
              <a href="mailto:contact@evrielsystems.com" className="ev-contact__bval">contact@evrielsystems.com</a>
            </div>
            <div className="ev-contact__block">
              <div className="ev-contact__blabel">Website</div>
              <a href="https://evrielsystems.com" className="ev-contact__bval" target="_blank" rel="noopener noreferrer">evrielsystems.com</a>
            </div>
          </Stagger>
        </div>
        <div className="ev-contact__right">
          {sent ? (
            <Reveal>
              <div className="ev-sent">
                <CheckCircle2 size={44} style={{color:"var(--dark)", marginBottom:24}}/>
                <h3 className="ev-sent__h">Message Received</h3>
                <p className="ev-sent__p">Thank you for reaching out. We'll review your inquiry and respond within 24 hours.</p>
                <button className="ev-btn ev-btn--dark" style={{marginTop:24}} onClick={()=>setSent(false)}>Send Another</button>
              </div>
            </Reveal>
          ) : (
            <Reveal direction="right">
              <div className="ev-form" >
                <div className="ev-form__row">
                  <Field label="Name" name="name" placeholder="Your full name"/>
                  <Field label="Company" name="company" placeholder="Organization name"/>
                </div>
                <div className="ev-form__row">
                  <Field label="Email" name="email" type="email" placeholder="your@email.com"/>
                  <Field label="Phone" name="phone" placeholder="+1 000 000 0000" optional/>
                </div>
                <div className="ev-field">
                  <label className="ev-field__label">Preferred Language</label>
                  <div className="ev-radios">
                    {["English","Italian","Spanish","Greek","Polish","Other"].map(l=>(
                      <label key={l} className={`ev-radio${form.language===l?" ev-radio--on":""}`}>
                        <input type="radio" name="language" value={l} checked={form.language===l} onChange={()=>setForm(f=>({...f,language:l}))} style={{display:"none"}}/>
                        {l}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="ev-field">
                  <label className="ev-field__label">Industry</label>
                  <select className="ev-select" value={form.industry} onChange={e=>setForm(f=>({...f,industry:e.target.value}))}>
                    <option value="">Select your industry</option>
                    {["Construction & Engineering","Manufacturing","Tourism & Hospitality","Retail & Commerce","Import & Export","Marketing & SEO","European Projects","NGO & Associations","Professional Services","Startup / SME","Other"].map(x=><option key={x}>{x}</option>)}
                  </select>
                </div>
                <div className="ev-field">
                  <label className="ev-field__label">What are you interested in?</label>
                  <div className="ev-checks">
                    {["AI Automation","Business Intelligence","Digital Transformation","Custom Systems","European Projects","Not Sure Yet"].map(x=>(
                      <label key={x} className={`ev-check${form.interests.includes(x)?" ev-check--on":""}`} onClick={()=>toggle(x)}>
                        <span className="ev-check__box">{form.interests.includes(x) && <CheckCircle2 size={12}/>}</span>
                        {x}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="ev-field">
                  <label className="ev-field__label">Tell us about your challenge</label>
                  <textarea className="ev-textarea" rows={4}
                    placeholder="Describe your project, challenge, or business objective."
                    value={form.challenge} onChange={e=>setForm(f=>({...f,challenge:e.target.value}))}/>
                </div>
                <button type="button" onClick={handleSubmit} className="ev-btn ev-btn--dark ev-btn--lg" style={{width:"100%",justifyContent:"center",marginTop:8}}>
                  Start the Conversation <ArrowRight size={16}/>
                </button>
              </div>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}

/* ═══ FOOTER ═══ */
function Footer({ setPage }) {
  return (
    <footer className="ev-footer">
      <div className="ev-footer__inner">
        <div className="ev-footer__top">
          <div onClick={()=>{setPage("home");window.scrollTo({top:0,behavior:"smooth"});}} style={{cursor:"pointer"}}>
            <LogoFull markSize={30} color="rgba(255,255,255,0.7)" subColor="rgba(255,255,255,0.25)"/>
          </div>
          <p className="ev-footer__tag"><em>Connecting Intelligence with Business</em></p>
        </div>
        <div className="ev-footer__line"/>
        <div className="ev-footer__bot">
          <span>&copy; {new Date().getFullYear()} Evriel Systems. All rights reserved.</span>
          <span>contact@evrielsystems.com</span>
        </div>
      </div>
    </footer>
  );
}

/* ═══ ARTICLES ═══ */
const ARTICLES = [
  {
    slug:"ai-beyond-chatbots", tag:"AI Strategy",
    title:"AI Beyond Chatbots: Practical Applications for Real Businesses",
    excerpt:"Artificial intelligence creates value far beyond conversational interfaces.",
    body:[
      "Artificial Intelligence is often associated with chatbots and virtual assistants. While these tools are valuable, they represent only a small part of what AI can achieve within modern organizations.",
      "Today, businesses are using AI to automate workflows, improve operational efficiency, support decision-making, and create better customer experiences.",
      "One of the most impactful applications of AI is workflow automation. Organizations spend countless hours performing repetitive administrative tasks such as data entry, reporting, document processing, and communication management. Intelligent systems can automate many of these processes, allowing employees to focus on higher-value activities.",
      "AI also plays an increasingly important role in decision support. By analyzing large volumes of business information, intelligent systems can identify patterns, detect inefficiencies, and provide recommendations that help organizations make better decisions.",
      "The most successful organizations do not adopt AI simply because it is popular. They identify specific business challenges and implement intelligent solutions that generate measurable results.",
      "The future of AI in business is not about replacing people. It is about empowering people with better tools, better information, and better systems.",
    ]
  },
  {
    slug:"automation-failures", tag:"Transformation",
    title:"Why Most Automation Projects Fail",
    excerpt:"The gap between automation promise and real-world results is wider than most organizations expect.",
    body:[
      "Automation is one of the most powerful tools available to modern organizations. However, many automation initiatives fail to deliver the expected benefits.",
      "The primary reason is simple: organizations often attempt to automate inefficient processes. Automation cannot fix a broken workflow. It can only accelerate it.",
      "Before introducing technology, organizations must first understand how work is performed, identify bottlenecks, and redesign inefficient processes.",
      "Successful automation projects begin with questions such as: What process needs improvement? What outcomes are we trying to achieve? How will success be measured?",
      "The most successful automation initiatives are not technology projects. They are business improvement projects supported by technology.",
      "When implemented correctly, automation can reduce administrative workloads, improve consistency, increase operational visibility, and enable organizations to scale more effectively.",
    ]
  },
  {
    slug:"ai-construction-engineering", tag:"Industry",
    title:"AI in Construction and Engineering",
    excerpt:"How intelligent systems are transforming project visibility and operational control.",
    body:[
      "Construction and engineering projects generate enormous amounts of information. Drawings, reports, site updates, documentation, schedules, budgets, and communication records are often distributed across multiple systems.",
      "Managing this information efficiently has become one of the industry's greatest challenges.",
      "AI can support engineering teams by organizing project documentation, monitoring progress, generating reports, and helping identify potential issues before they impact schedules or budgets.",
      "Digital monitoring systems can improve coordination between office teams, engineers, contractors, and site personnel.",
      "The future of construction technology is not simply about digitizing documents. It is about creating connected environments where information flows efficiently between people, processes, and systems.",
      "Organizations that adopt intelligent technologies today will be better positioned to improve productivity, reduce risk, and deliver projects more effectively.",
    ]
  },
  {
    slug:"digital-transformation-people", tag:"Strategy",
    title:"Digital Transformation Is About People, Not Software",
    excerpt:"Why the most expensive digital transformation failures share the same root cause.",
    body:[
      "When organizations begin digital transformation initiatives, many focus immediately on technology. New software is purchased. New platforms are implemented. New tools are introduced.",
      "Yet despite significant investments, many transformation projects fail to achieve their intended outcomes.",
      "The reason is simple: digital transformation is not primarily a technology challenge. It is a people and process challenge.",
      "Technology can enable change, but it cannot create it on its own.",
      "Successful organizations first understand how people work, how decisions are made, and how information moves throughout the business. Only then can technology be implemented effectively.",
      "Digital transformation is ultimately about creating environments where people, processes, and technology work together effectively.",
    ]
  },
  {
    slug:"intelligent-systems-advantage", tag:"Competitive Edge",
    title:"Building Competitive Advantage Through Intelligent Systems",
    excerpt:"How forward-thinking organizations use AI integration to create sustainable competitive moats.",
    body:[
      "Every organization is searching for ways to become more efficient, more responsive, and more competitive.",
      "Traditionally, competitive advantage was often created through scale, location, or access to resources.",
      "Today, intelligent systems are becoming one of the most important sources of competitive advantage.",
      "Intelligent systems help organizations automate repetitive tasks, identify patterns, support decision-making, and improve operational visibility.",
      "Competitive advantage is no longer created solely through resources. It is increasingly created through intelligence, adaptability, and the ability to make better decisions faster.",
    ]
  },
  {
    slug:"data-driven-decisions", tag:"Intelligence",
    title:"Turning Data Into Better Decisions",
    excerpt:"Modern organizations drown in data but struggle with decisions. Here's how intelligent systems close the gap.",
    body:[
      "Modern organizations generate more information than ever before. Yet many continue to struggle with decision-making.",
      "The problem is not a lack of information. The problem is transforming information into meaningful insights.",
      "Business intelligence and intelligent systems help organizations organize information, identify patterns, and present insights in ways that support effective decision-making.",
      "However, successful data utilization requires more than dashboards and reports. Organizations must establish processes that ensure information is accessible, reliable, and aligned with business objectives.",
      "The future belongs to organizations that can transform information into intelligence and intelligence into action.",
    ]
  },
];

/* ═══ INSIGHTS ═══ */
function InsightsHome({ setPage, setArticleSlug }) {
  return (
    <>
      <section className="ev-insights-hero">
        <Reveal><p className="ev-label ev-label--light">Research & Insights</p></Reveal>
        <Reveal delay={100}><h1 className="ev-insights-hero__h">Thinking<br/><em>Forward</em></h1></Reveal>
        <Reveal delay={200}><p className="ev-insights-hero__sub">Professional perspectives on AI, automation, and digital transformation across industries.</p></Reveal>
      </section>
      <section className="ev-insights-grid">
        <div className="ev-insights-grid__inner">
          {ARTICLES.map((a,i)=>(
            <Reveal key={i} delay={i*70}>
              <article className="ev-art-card" onClick={()=>{ setArticleSlug(a.slug); setPage("article"); window.scrollTo({top:0,behavior:"smooth"}); }}>
                <div className="ev-art-card__meta">
                  <span className="ev-art-card__tag">{a.tag}</span>
                </div>
                <h2 className="ev-art-card__title">{a.title}</h2>
                <p className="ev-art-card__excerpt">{a.excerpt}</p>
                <div className="ev-art-card__read">Read <ArrowRight size={13}/></div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}

function ArticlePage({ slug, setPage }) {
  const art = ARTICLES.find(a=>a.slug===slug);
  if (!art) return null;
  const others = ARTICLES.filter(a=>a.slug!==slug).slice(0,3);
  return (
    <>
      <section className="ev-art-hero">
        <Reveal><span className="ev-art-hero__tag">{art.tag}</span></Reveal>
        <Reveal delay={100}><h1 className="ev-art-hero__h">{art.title}</h1></Reveal>
      </section>
      <section className="ev-art-body">
        <div className="ev-art-body__inner">
          <div className="ev-art-body__content">
            {art.body.map((p,i)=>(
              <Reveal key={i} delay={i*40}><p className="ev-art-body__p">{p}</p></Reveal>
            ))}
            <Reveal delay={200}>
              <div className="ev-art-body__cta">
                <p>Ready to implement intelligent systems?</p>
                <a href="javascript:void(0)" className="ev-btn ev-btn--dark" onClick={()=>{ setPage("home"); setTimeout(()=>document.getElementById("contact")?.scrollIntoView({behavior:"smooth"}),300); }}>
                  Let's Discuss Your Project <ArrowRight size={15}/>
                </a>
              </div>
            </Reveal>
          </div>
          <div className="ev-art-body__sidebar">
            <h4 className="ev-art-sidebar__h">More Articles</h4>
            {others.map((a,i)=>(
              <Reveal key={i} delay={i*80}>
                <div className="ev-art-sidebar__item" onClick={()=>{ setPage("article"); window.scrollTo({top:0,behavior:"smooth"}); }}>
                  <span className="ev-art-sidebar__tag">{a.tag}</span>
                  <p className="ev-art-sidebar__title">{a.title}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

/* ═══ MAIN APP ═══ */
export default function EvrielSystems() {
  const [page, setPage] = useState("home");
  const [articleSlug, setArticleSlug] = useState(null);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400;1,500&family=Outfit:wght@300;400;500;600&display=swap');

        :root {
          --dark: #111111;
          --charcoal: #1A1A1A;
          --warm: #F8F7F4;
          --cream: #F0EDE8;
          --plat: #ACACAC;
          --muted: #888;
          --display: 'Cormorant Garamond', Georgia, serif;
          --body: 'Outfit', -apple-system, sans-serif;
        }

        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box }
        html { scroll-behavior:smooth }
        body { font-family:var(--body); background:var(--dark); color:var(--dark); -webkit-font-smoothing:antialiased }
        button, input, textarea, select { font-family:inherit; background:none; border:none; cursor:pointer }
        a { text-decoration:none; color:inherit }
        em { font-family:var(--display); font-style:italic }
        .desk-br { display:block }

        @keyframes ev-logospin { from{transform:translate(-50%,-50%) rotate(0deg)} to{transform:translate(-50%,-50%) rotate(360deg)} }
        @keyframes ev-centerPulse { 0%,100%{opacity:1;r:5.6} 50%{opacity:0.4;r:7.5} }
        @keyframes ev-ringPulse { 0%,100%{transform:scale(1);opacity:0.4} 50%{transform:scale(1.05);opacity:0.15} }
        @keyframes ev-mq { from{transform:translateX(0)} to{transform:translateX(-25%)} }
        @keyframes ev-scrollBob { 0%,100%{transform:translateY(0);opacity:1} 50%{transform:translateY(8px);opacity:0.2} }

        /* ── LABEL ── */
        .ev-label { font-size:12px; font-weight:400; letter-spacing:0.2em; text-transform:uppercase; color:rgba(0,0,0,0.32); margin-bottom:20px }
        .ev-label--light { color:rgba(255,255,255,0.28) }

        /* ── SECTION HEADINGS ── */
        .ev-section-h { font-family:var(--display); font-size:clamp(42px,6vw,80px); font-weight:400; line-height:1.08; letter-spacing:-0.01em; margin-bottom:20px; color:var(--dark) }
        .ev-section-h--light { color:#fff }
        .ev-section-h em { color:var(--plat) }
        .ev-section-h--light em { color:rgba(255,255,255,0.45) }
        .ev-section-sub { font-size:16px; color:rgba(0,0,0,0.4); line-height:1.7; max-width:520px; margin-bottom:56px; font-weight:300 }

        /* ── NAV ── */
        .ev-nav { position:fixed; top:0; left:0; right:0; z-index:999; padding:20px 0; transition:all 0.5s ${EASE2} }
        .ev-nav--scrolled { background:rgba(248,247,244,0.92); backdrop-filter:blur(20px); padding:12px 0; box-shadow:0 1px 0 rgba(0,0,0,0.05) }
        .ev-nav__inner { max-width:1400px; margin:0 auto; padding:0 48px; display:flex; align-items:center; justify-content:space-between }
        .ev-nav__links { display:flex; align-items:center; gap:36px }
        .ev-nav__link { font-size:12px; font-weight:400; letter-spacing:0.08em; text-transform:uppercase; transition:opacity 0.3s }
        .ev-nav__link:hover { opacity:0.5 }
        .ev-nav__cta { font-size:11px; font-weight:500; letter-spacing:0.08em; text-transform:uppercase; border-radius:0; transition:all 0.3s }
        .ev-nav__cta:hover { opacity:0.8 }
        .ev-nav__burger { display:none; color:#fff }
        .ev-mobile-menu { position:fixed; inset:0; background:var(--dark); z-index:998; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:24px; padding-top:60px }
        .ev-mobile-link { font-family:var(--display); font-size:36px; color:rgba(255,255,255,0.7); transition:color 0.3s }
        .ev-mobile-link:hover { color:#fff }

        /* ── HERO ── */
        .ev-hero { position:relative; height:100vh; min-height:700px; display:flex; align-items:center; justify-content:center; background:var(--dark); overflow:hidden }
        .ev-hero__bg { position:absolute; inset:0; pointer-events:none }
        .ev-hero__grid { position:absolute; inset:0; background-image:linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px); background-size:100px 100px }
        .ev-hero__glow { position:absolute; top:30%; left:50%; transform:translate(-50%,-50%); width:800px; height:600px; background:radial-gradient(ellipse,rgba(255,255,255,0.03),transparent 70%); pointer-events:none }
        .ev-hero__glow2 { position:absolute; bottom:0; left:50%; transform:translateX(-50%); width:100%; height:300px; background:linear-gradient(to top,rgba(255,255,255,0.015),transparent); pointer-events:none }
        .ev-hero__ghost { position:absolute; top:50%; left:50%; animation:ev-logospin 90s linear infinite }
        .ev-hero__body { position:relative; z-index:2; text-align:center; padding:0 24px; max-width:1000px }
        .ev-hero__eyebrow { display:inline-flex; align-items:center; gap:10px; font-size:11px; letter-spacing:0.3em; text-transform:uppercase; color:rgba(255,255,255,0.3); margin-bottom:36px; font-weight:400 }
        .ev-hero__eyedot { width:6px; height:6px; border-radius:50%; background:rgba(255,255,255,0.25); animation:ev-centerPulse 3s ease-in-out infinite }
        .ev-hero__h1 { font-family:var(--display); font-size:clamp(36px,5.5vw,78px); font-weight:400; color:rgba(255,255,255,0.92); line-height:1.12; letter-spacing:-0.015em }
        .ev-hero__h1 em { color:rgba(255,255,255,0.45) }
        .ev-hero__sub { font-size:clamp(15px,1.4vw,18px); font-weight:300; color:rgba(255,255,255,0.3); margin-top:32px; line-height:1.75; letter-spacing:0.02em }
        .ev-hero__ctas { display:flex; gap:14px; justify-content:center; margin-top:48px; flex-wrap:wrap }
        .ev-hero__scroll { position:absolute; bottom:40px; left:50%; transform:translateX(-50%); display:flex; flex-direction:column; align-items:center; gap:8px }
        .ev-scroll-pill { width:18px; height:28px; border:1px solid rgba(255,255,255,0.12); border-radius:9px; display:flex; justify-content:center; padding-top:6px }
        .ev-scroll-dot { width:2px; height:6px; background:rgba(255,255,255,0.3); border-radius:2px; animation:ev-scrollBob 2.5s ease-in-out infinite }

        /* ── BUTTONS ── */
        .ev-btn { display:inline-flex; align-items:center; gap:10px; font-size:12px; font-weight:500; letter-spacing:0.08em; text-transform:uppercase; padding:14px 28px; transition:all 0.4s ${EASE2}; border:1px solid transparent; cursor:pointer; font-family:var(--body) }
        .ev-btn--white { background:rgba(255,255,255,0.95); color:var(--dark) }
        .ev-btn--white:hover { background:#fff; transform:translateY(-2px) }
        .ev-btn--ghost { background:transparent; color:rgba(255,255,255,0.6); border:1px solid rgba(255,255,255,0.12) }
        .ev-btn--ghost:hover { color:#fff; border-color:rgba(255,255,255,0.3) }
        .ev-btn--dark { background:var(--dark); color:#fff }
        .ev-btn--dark:hover { background:#222; transform:translateY(-2px) }
        .ev-btn--lg { padding:16px 36px; font-size:13px }

        /* ── MARQUEE ── */
        .ev-mq { overflow:hidden; padding:28px 0; background:var(--warm); border-bottom:1px solid rgba(0,0,0,0.04) }
        .ev-mq__track { display:flex; animation:ev-mq 40s linear infinite; white-space:nowrap }
        .ev-mq__item { display:inline-flex; align-items:center; gap:12px; padding:0 36px; font-size:13px; color:rgba(0,0,0,0.28); letter-spacing:0.06em; text-transform:uppercase; font-weight:400 }
        .ev-mq__dot { width:4px; height:4px; border-radius:50%; background:rgba(0,0,0,0.15) }

        /* ── ABOUT ── */
        .ev-about { background:var(--warm); padding:0 }
        .ev-about__inner { max-width:1400px; margin:0 auto; display:grid; grid-template-columns:1fr 1fr; min-height:700px }
        .ev-about__left { padding:120px 80px 120px 48px }
        .ev-about__right { background:var(--charcoal); padding:120px 48px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:48px }
        .ev-about__h { font-family:var(--display); font-size:clamp(44px,5vw,72px); font-weight:400; line-height:1.08; margin-bottom:32px; color:var(--dark) }
        .ev-about__h em { color:var(--plat) }
        .ev-about__lead { font-size:18px; color:rgba(0,0,0,0.5); line-height:1.7; margin-bottom:8px; font-weight:300 }
        .ev-about__quote { font-family:var(--display); font-size:28px; font-style:italic; color:var(--dark); margin-bottom:32px; line-height:1.4 }
        .ev-about__p { font-size:15px; color:rgba(0,0,0,0.45); line-height:1.8; margin-bottom:16px; max-width:500px }
        .ev-about__p strong { color:var(--dark); font-weight:500 }
        .ev-about__logo-wrap { width:280px; height:280px; position:relative; display:flex; align-items:center; justify-content:center }
        .ev-about__logo-ring { position:absolute; border:1px solid rgba(255,255,255,0.06); border-radius:50% }
        .ev-about__logo-ring--1 { width:200px; height:200px; animation:ev-ringPulse 4s ease-in-out infinite }
        .ev-about__logo-ring--2 { width:240px; height:240px; animation:ev-ringPulse 4s ease-in-out 0.5s infinite }
        .ev-about__logo-ring--3 { width:280px; height:280px; animation:ev-ringPulse 4s ease-in-out 1s infinite }
        .ev-about__logo-center { position:relative; z-index:2 }
        .ev-challenges { display:flex; flex-direction:column; gap:12px; width:100%; max-width:320px }
        .ev-challenge { display:flex; align-items:center; gap:14px; font-size:13px; color:rgba(255,255,255,0.4); letter-spacing:0.04em }
        .ev-challenge__line { width:20px; height:1px; background:rgba(255,255,255,0.15); flex-shrink:0 }

        /* ── INDUSTRIES — Editorial Rows ── */
        .ev-industries { background:var(--warm); padding:140px 0 }
        .ev-ind__container { max-width:1400px; margin:0 auto; padding:0 48px }
        .ev-ind__list { margin-top:20px }
        .ev-ind-row { display:grid; grid-template-columns:48px 1fr auto 20px; align-items:center; gap:24px; padding:24px 0; border-bottom:1px solid rgba(0,0,0,0.06); cursor:default; transition:all 0.4s ${EASE2} }
        .ev-ind-row:first-child { border-top:1px solid rgba(0,0,0,0.06) }
        .ev-ind-row:hover { padding-left:12px }
        .ev-ind-row__num { font-size:12px; color:rgba(0,0,0,0.2); letter-spacing:0.05em; font-weight:400 }
        .ev-ind-row__name { font-family:var(--display); font-size:clamp(22px,2.5vw,32px); font-weight:400; color:var(--dark); transition:color 0.3s }
        .ev-ind-row:hover .ev-ind-row__name { color:rgba(0,0,0,0.6) }
        .ev-ind-row__items { display:flex; gap:8px; flex-wrap:wrap; justify-content:flex-end }
        .ev-ind-row__tag { font-size:11px; letter-spacing:0.05em; color:rgba(0,0,0,0.28); padding:4px 12px; border:1px solid rgba(0,0,0,0.07); font-weight:400; transition:all 0.3s; white-space:nowrap }
        .ev-ind-row:hover .ev-ind-row__tag { border-color:rgba(0,0,0,0.15); color:rgba(0,0,0,0.45) }
        .ev-ind-row__arrow { color:rgba(0,0,0,0.15); transition:all 0.3s }
        .ev-ind-row:hover .ev-ind-row__arrow { color:rgba(0,0,0,0.5); transform:translate(2px,-2px) }

        /* ── SERVICES ── */
        .ev-services { background:var(--charcoal); padding:140px 0 }
        .ev-svc__container { max-width:1400px; margin:0 auto; padding:0 48px }
        .ev-svc__grid { display:grid; grid-template-columns:1fr 1fr; gap:1px; background:rgba(255,255,255,0.05); margin-top:60px }
        .ev-svc { background:var(--charcoal); padding:48px 40px; transition:background 0.4s }
        .ev-svc:hover { background:rgba(255,255,255,0.03) }
        .ev-svc__top { display:flex; align-items:baseline; gap:16px; margin-bottom:16px }
        .ev-svc__num { font-size:12px; color:rgba(255,255,255,0.2); letter-spacing:0.05em }
        .ev-svc__title { font-family:var(--display); font-size:28px; font-weight:400; color:rgba(255,255,255,0.85) }
        .ev-svc__desc { font-size:14px; color:rgba(255,255,255,0.3); line-height:1.7; margin-bottom:24px; max-width:380px; font-weight:300 }
        .ev-svc__apps { display:flex; flex-wrap:wrap; gap:6px }
        .ev-svc__app { font-size:11px; color:rgba(255,255,255,0.25); letter-spacing:0.04em; padding:5px 12px; border:1px solid rgba(255,255,255,0.06); transition:all 0.3s }
        .ev-svc:hover .ev-svc__app { border-color:rgba(255,255,255,0.12); color:rgba(255,255,255,0.4) }

        /* ── PROJECTS ── */
        .ev-projects { background:var(--warm); padding:140px 0 }
        .ev-proj__container { max-width:1400px; margin:0 auto; padding:0 48px }
        .ev-proj__list { margin-top:48px }
        .ev-proj { border-bottom:1px solid rgba(0,0,0,0.06); cursor:pointer; transition:all 0.3s }
        .ev-proj:first-child { border-top:1px solid rgba(0,0,0,0.06) }
        .ev-proj:hover { background:rgba(0,0,0,0.01) }
        .ev-proj__header { display:flex; align-items:center; justify-content:space-between; padding:28px 0 }
        .ev-proj__hl { display:flex; align-items:center; gap:20px }
        .ev-proj__idx { font-size:12px; color:rgba(0,0,0,0.2); letter-spacing:0.05em; min-width:32px }
        .ev-proj__title { font-family:var(--display); font-size:clamp(24px,3vw,36px); font-weight:400; color:var(--dark) }
        .ev-proj__subtitle { font-size:12px; color:rgba(0,0,0,0.3); letter-spacing:0.06em; text-transform:uppercase; margin-top:2px; display:block }
        .ev-proj__tog { color:rgba(0,0,0,0.25); transition:color 0.3s }
        .ev-proj:hover .ev-proj__tog { color:rgba(0,0,0,0.5) }
        .ev-proj__body { padding:0 0 32px 52px }
        .ev-proj__desc { font-size:15px; color:rgba(0,0,0,0.45); line-height:1.7; max-width:600px; margin-bottom:20px; font-weight:300 }
        .ev-proj__caps { display:flex; flex-wrap:wrap; gap:6px; margin-bottom:16px }
        .ev-proj__cap { font-size:11px; color:rgba(0,0,0,0.3); letter-spacing:0.04em; padding:5px 12px; border:1px solid rgba(0,0,0,0.08) }
        .ev-proj__tagline { font-family:var(--display); font-size:16px; font-style:italic; color:rgba(0,0,0,0.35) }

        /* ── PROCESS ── */
        .ev-process { background:var(--dark); padding:140px 0 }
        .ev-proc__container { max-width:1400px; margin:0 auto; padding:0 48px }
        .ev-proc__timeline { margin-top:64px; display:flex; flex-direction:column; gap:0; max-width:700px }
        .ev-proc__step { display:flex; gap:32px }
        .ev-proc__step-line { display:flex; flex-direction:column; align-items:center; padding-top:6px }
        .ev-proc__step-dot { width:10px; height:10px; border-radius:50%; border:2px solid rgba(255,255,255,0.2); background:var(--dark); flex-shrink:0; position:relative; z-index:2 }
        .ev-proc__step:hover .ev-proc__step-dot { border-color:rgba(255,255,255,0.5) }
        .ev-proc__step-connector { width:1px; flex:1; background:rgba(255,255,255,0.06); min-height:40px }
        .ev-proc__step-content { padding-bottom:48px }
        .ev-proc__step-num { font-size:11px; color:rgba(255,255,255,0.2); letter-spacing:0.15em; text-transform:uppercase; display:block; margin-bottom:8px }
        .ev-proc__step-title { font-family:var(--display); font-size:28px; font-weight:400; color:rgba(255,255,255,0.8); margin-bottom:12px }
        .ev-proc__step-desc { font-size:14px; color:rgba(255,255,255,0.3); line-height:1.75; max-width:480px; font-weight:300 }

        /* ── WHY EVRIEL ── */
        .ev-why { background:var(--cream); padding:140px 0 }
        .ev-why__container { max-width:1400px; margin:0 auto; padding:0 48px }
        .ev-why__pillars { display:grid; grid-template-columns:repeat(3,1fr); gap:60px; margin-top:80px }
        .ev-why__pillar-num { font-size:12px; color:rgba(0,0,0,0.18); letter-spacing:0.08em; display:block; margin-bottom:16px }
        .ev-why__pillar-title { font-family:var(--display); font-size:32px; font-weight:400; color:var(--dark); margin-bottom:16px }
        .ev-why__pillar-line { width:40px; height:1px; background:rgba(0,0,0,0.12); margin-bottom:20px }
        .ev-why__pillar-desc { font-size:15px; color:rgba(0,0,0,0.42); line-height:1.75; font-weight:300 }

        /* ── OUTCOMES ── */
        .ev-outcomes { background:var(--charcoal); padding:140px 0 }
        .ev-outcomes__container { max-width:1400px; margin:0 auto; padding:0 48px }
        .ev-outcomes__grid { display:grid; grid-template-columns:repeat(4,1fr); gap:1px; background:rgba(255,255,255,0.04); margin-top:64px }
        .ev-outcome { background:var(--charcoal); padding:40px 32px; transition:background 0.4s }
        .ev-outcome:hover { background:rgba(255,255,255,0.025) }
        .ev-outcome__num { font-size:11px; color:rgba(255,255,255,0.15); letter-spacing:0.08em; display:block; margin-bottom:20px }
        .ev-outcome__title { font-family:var(--display); font-size:24px; font-weight:400; color:rgba(255,255,255,0.75); margin-bottom:12px }
        .ev-outcome__desc { font-size:13px; color:rgba(255,255,255,0.28); line-height:1.7; font-weight:300 }

        /* ── TRUST ── */
        .ev-trust { background:var(--warm); padding:140px 0 }
        .ev-trust__container { max-width:1400px; margin:0 auto; padding:0 48px; display:grid; grid-template-columns:1fr 1fr; gap:80px; align-items:start }
        .ev-trust__p { font-size:15px; color:rgba(0,0,0,0.42); line-height:1.8; margin-bottom:16px; max-width:460px; font-weight:300 }
        .ev-trust__items { display:flex; flex-direction:column; gap:20px }
        .ev-trust__item { display:flex; gap:16px; padding:20px; background:rgba(0,0,0,0.02); transition:background 0.3s }
        .ev-trust__item:hover { background:rgba(0,0,0,0.04) }
        .ev-trust__item-icon { color:var(--dark); opacity:0.4; flex-shrink:0; margin-top:2px }
        .ev-trust__item-t { font-size:14px; font-weight:500; color:var(--dark); margin-bottom:4px }
        .ev-trust__item-d { font-size:13px; color:rgba(0,0,0,0.38); line-height:1.6; font-weight:300 }

        /* ── BORDERS ── */
        .ev-borders { background:var(--dark); padding:120px 0; text-align:center }
        .ev-borders__container { max-width:800px; margin:0 auto; padding:0 48px }
        .ev-borders__text { font-size:16px; color:rgba(255,255,255,0.35); line-height:1.8; margin-top:24px; margin-bottom:40px; font-weight:300 }
        .ev-borders__langs { display:flex; justify-content:center; gap:12px; flex-wrap:wrap }
        .ev-borders__lang { font-size:12px; letter-spacing:0.1em; text-transform:uppercase; color:rgba(255,255,255,0.3); padding:8px 20px; border:1px solid rgba(255,255,255,0.08); transition:all 0.3s }
        .ev-borders__lang:hover { border-color:rgba(255,255,255,0.2); color:rgba(255,255,255,0.5) }

        /* ── STATEMENT ── */
        .ev-statement { position:relative; min-height:60vh; display:flex; align-items:center; justify-content:center; background:var(--charcoal); overflow:hidden; text-align:center; padding:100px 24px }
        .ev-statement__bg { position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); pointer-events:none }
        .ev-statement__body { position:relative; z-index:2 }
        .ev-statement__h { font-family:var(--display); font-size:clamp(28px,4.5vw,56px); font-weight:400; color:rgba(255,255,255,0.8); line-height:1.25; margin-bottom:40px }
        .ev-statement__h em { color:rgba(255,255,255,0.4) }

        /* ── CONTACT ── */
        .ev-contact { background:var(--warm); padding:140px 0 }
        .ev-contact__container { max-width:1400px; margin:0 auto; padding:0 48px; display:grid; grid-template-columns:1fr 1.1fr; gap:80px; align-items:start }
        .ev-contact__sub { font-size:16px; color:rgba(0,0,0,0.45); margin-bottom:8px; margin-top:20px; font-weight:300 }
        .ev-contact__p { font-size:15px; color:rgba(0,0,0,0.35); line-height:1.7; font-weight:300 }
        .ev-contact__info { display:flex; flex-direction:column; gap:20px; margin-top:40px }
        .ev-contact__block { }
        .ev-contact__blabel { font-size:11px; letter-spacing:0.15em; text-transform:uppercase; color:rgba(0,0,0,0.25); margin-bottom:4px }
        .ev-contact__bval { font-size:15px; color:var(--dark); border-bottom:1px solid rgba(0,0,0,0.1); padding-bottom:2px; transition:border-color 0.3s }
        .ev-contact__bval:hover { border-color:var(--dark) }

        /* ── FORM ── */
        .ev-form { background:#fff; padding:40px; border:1px solid rgba(0,0,0,0.06) }
        .ev-form__row { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:16px }
        .ev-field { margin-bottom:16px }
        .ev-field__label { display:block; font-size:11px; letter-spacing:0.1em; text-transform:uppercase; color:rgba(0,0,0,0.35); margin-bottom:8px; font-weight:400 }
        .ev-field__opt { color:rgba(0,0,0,0.2) }
        .ev-field__input { width:100%; padding:12px 16px; border:1px solid rgba(0,0,0,0.08); font-size:14px; color:var(--dark); transition:border-color 0.3s; background:transparent; font-weight:300 }
        .ev-field__input:focus { outline:none; border-color:rgba(0,0,0,0.25) }
        .ev-select { width:100%; padding:12px 16px; border:1px solid rgba(0,0,0,0.08); font-size:14px; color:var(--dark); background:#fff; appearance:none; font-weight:300 }
        .ev-textarea { width:100%; padding:12px 16px; border:1px solid rgba(0,0,0,0.08); font-size:14px; color:var(--dark); resize:vertical; transition:border-color 0.3s; font-weight:300 }
        .ev-textarea:focus { outline:none; border-color:rgba(0,0,0,0.25) }
        .ev-radios { display:flex; gap:8px; flex-wrap:wrap }
        .ev-radio { font-size:12px; padding:8px 16px; border:1px solid rgba(0,0,0,0.08); color:rgba(0,0,0,0.4); cursor:pointer; transition:all 0.3s; font-weight:400 }
        .ev-radio--on { background:var(--dark); color:#fff; border-color:var(--dark) }
        .ev-checks { display:grid; grid-template-columns:1fr 1fr; gap:8px }
        .ev-check { display:flex; align-items:center; gap:10px; font-size:12px; padding:10px 14px; border:1px solid rgba(0,0,0,0.06); color:rgba(0,0,0,0.4); cursor:pointer; transition:all 0.3s }
        .ev-check--on { background:rgba(0,0,0,0.03); border-color:rgba(0,0,0,0.15) }
        .ev-check__box { width:16px; height:16px; border:1px solid rgba(0,0,0,0.15); display:flex; align-items:center; justify-content:center; flex-shrink:0; transition:all 0.3s }
        .ev-check--on .ev-check__box { background:var(--dark); border-color:var(--dark); color:#fff }
        .ev-sent { display:flex; flex-direction:column; align-items:center; text-align:center; padding:80px 40px }
        .ev-sent__h { font-family:var(--display); font-size:30px; margin-bottom:12px }
        .ev-sent__p { font-size:14px; color:rgba(0,0,0,0.4); line-height:1.65; max-width:340px; font-weight:300 }

        /* ── FOOTER ── */
        .ev-footer { background:var(--dark); padding:48px 0 32px; border-top:1px solid rgba(255,255,255,0.03) }
        .ev-footer__inner { max-width:1400px; margin:0 auto; padding:0 48px }
        .ev-footer__top { display:flex; justify-content:space-between; align-items:center; margin-bottom:32px }
        .ev-footer__tag { font-size:13px; color:rgba(255,255,255,0.18); letter-spacing:0.04em; font-weight:300 }
        .ev-footer__line { height:1px; background:rgba(255,255,255,0.04); margin-bottom:24px }
        .ev-footer__bot { display:flex; justify-content:space-between; font-size:11px; color:rgba(255,255,255,0.15); letter-spacing:0.04em; font-weight:300 }

        /* ── INSIGHTS ── */
        .ev-insights-hero { background:var(--dark); padding:200px 48px 100px; text-align:center }
        .ev-insights-hero__h { font-family:var(--display); font-size:clamp(56px,8vw,110px); font-weight:400; color:rgba(255,255,255,0.9); line-height:1; margin-bottom:24px }
        .ev-insights-hero__h em { color:rgba(255,255,255,0.35) }
        .ev-insights-hero__sub { font-size:16px; color:rgba(255,255,255,0.28); max-width:500px; margin:0 auto; line-height:1.7; font-weight:300 }
        .ev-insights-grid { background:var(--warm); padding:80px 0 120px }
        .ev-insights-grid__inner { max-width:1400px; margin:0 auto; padding:0 48px; display:grid; grid-template-columns:repeat(3,1fr); gap:1px; background:rgba(0,0,0,0.05) }
        .ev-art-card { background:var(--warm); padding:40px 32px; cursor:pointer; transition:all 0.4s ${EASE2}; position:relative }
        .ev-art-card::after { content:''; position:absolute; bottom:0; left:0; width:0; height:1px; background:var(--dark); transition:width 0.6s ${EASE2} }
        .ev-art-card:hover { background:#fff }
        .ev-art-card:hover::after { width:100% }
        .ev-art-card__meta { margin-bottom:16px }
        .ev-art-card__tag { font-size:10px; letter-spacing:0.12em; text-transform:uppercase; padding:4px 10px; border:1px solid rgba(0,0,0,0.1); color:rgba(0,0,0,0.4) }
        .ev-art-card__title { font-family:var(--display); font-size:20px; font-weight:400; line-height:1.35; margin-bottom:12px; color:var(--dark) }
        .ev-art-card__excerpt { font-size:13px; line-height:1.65; color:rgba(0,0,0,0.38); margin-bottom:20px; font-weight:300 }
        .ev-art-card__read { display:inline-flex; align-items:center; gap:8px; font-size:11px; letter-spacing:0.1em; text-transform:uppercase; font-weight:500; color:rgba(0,0,0,0.35); transition:gap 0.3s }
        .ev-art-card:hover .ev-art-card__read { gap:14px; color:var(--dark) }

        /* ── ARTICLE ── */
        .ev-art-hero { background:var(--dark); padding:180px 48px 100px; text-align:center }
        .ev-art-hero__tag { font-size:11px; letter-spacing:0.2em; text-transform:uppercase; color:rgba(255,255,255,0.28); display:block; margin-bottom:24px }
        .ev-art-hero__h { font-family:var(--display); font-size:clamp(30px,4.5vw,56px); font-weight:400; color:rgba(255,255,255,0.9); line-height:1.2; max-width:860px; margin:0 auto }
        .ev-art-body { background:var(--warm); padding:80px 0 120px }
        .ev-art-body__inner { max-width:1200px; margin:0 auto; padding:0 48px; display:grid; grid-template-columns:1fr 320px; gap:80px; align-items:start }
        .ev-art-body__p { font-size:16px; line-height:1.85; color:rgba(0,0,0,0.5); margin-bottom:24px; max-width:640px; font-weight:300 }
        .ev-art-body__cta { margin-top:56px; padding:36px; background:rgba(0,0,0,0.02); border:1px solid rgba(0,0,0,0.06) }
        .ev-art-body__cta p { font-family:var(--display); font-size:20px; margin-bottom:20px; color:var(--dark) }
        .ev-art-body__sidebar { position:sticky; top:120px }
        .ev-art-sidebar__h { font-size:11px; letter-spacing:0.18em; text-transform:uppercase; color:rgba(0,0,0,0.28); margin-bottom:24px; padding-bottom:12px; border-bottom:1px solid rgba(0,0,0,0.06) }
        .ev-art-sidebar__item { padding:16px 0; border-bottom:1px solid rgba(0,0,0,0.05); cursor:pointer; transition:all 0.3s }
        .ev-art-sidebar__item:hover { padding-left:8px }
        .ev-art-sidebar__tag { font-size:10px; letter-spacing:0.1em; text-transform:uppercase; color:rgba(0,0,0,0.25); display:block; margin-bottom:4px }
        .ev-art-sidebar__title { font-family:var(--display); font-size:15px; line-height:1.4; color:var(--dark) }

        /* ── RESPONSIVE ── */
        @media(max-width:1200px) {
          .ev-about__inner { grid-template-columns:1fr }
          .ev-about__left { padding:100px 40px 48px }
          .ev-about__right { padding:64px 40px }
          .ev-ind-row { grid-template-columns:40px 1fr 20px; gap:16px }
          .ev-ind-row__items { display:none }
          .ev-svc__grid { grid-template-columns:1fr }
          .ev-why__pillars { grid-template-columns:1fr }
          .ev-outcomes__grid { grid-template-columns:1fr 1fr }
          .ev-trust__container { grid-template-columns:1fr; gap:48px }
          .ev-contact__container { grid-template-columns:1fr; gap:48px }
          .ev-art-body__inner { grid-template-columns:1fr; gap:48px }
          .ev-art-body__sidebar { position:static }
          .ev-insights-grid__inner { grid-template-columns:1fr 1fr }
        }
        @media(max-width:900px) {
          .ev-nav__links { display:none }
          .ev-nav__burger { display:block }
          .ev-nav__inner { padding:0 20px }
          .desk-br { display:none }
          .ev-hero__h1 { font-size:clamp(28px,7vw,44px) }
          .ev-about__left { padding:80px 20px 40px }
          .ev-about__right { padding:48px 20px }
          .ev-about__logo-wrap { width:220px; height:220px }
          .ev-about__logo-ring--1 { width:160px; height:160px }
          .ev-about__logo-ring--2 { width:190px; height:190px }
          .ev-about__logo-ring--3 { width:220px; height:220px }
          .ev-ind__container, .ev-svc__container, .ev-proj__container, .ev-proc__container, .ev-why__container, .ev-outcomes__container, .ev-trust__container, .ev-contact__container, .ev-borders__container, .ev-footer__inner { padding:0 20px }
          .ev-industries, .ev-services, .ev-projects, .ev-process, .ev-why, .ev-outcomes, .ev-trust, .ev-contact, .ev-borders { padding:100px 0 }
          .ev-section-h { font-size:clamp(36px,8vw,52px) }
          .ev-svc__grid { gap:0 }
          .ev-outcomes__grid { grid-template-columns:1fr }
          .ev-statement { min-height:50vh; padding:80px 20px }
          .ev-statement__h { font-size:clamp(24px,6vw,40px) }
          .ev-form { padding:24px }
          .ev-form__row { grid-template-columns:1fr }
          .ev-checks { grid-template-columns:1fr }
          .ev-footer__top { flex-direction:column; gap:16px; align-items:flex-start }
          .ev-footer__bot { flex-direction:column; gap:8px }
          .ev-insights-hero { padding:160px 20px 80px }
          .ev-insights-grid__inner { grid-template-columns:1fr; padding:0 20px }
          .ev-art-hero { padding:160px 20px 80px }
          .ev-art-body__inner { padding:0 20px }
        }
        @media(max-width:480px) {
          .ev-hero { min-height:100svh }
          .ev-hero__h1 { font-size:28px }
          .ev-hero__ctas { flex-direction:column; align-items:center }
          .ev-btn { width:100%; justify-content:center }
          .ev-radios { flex-direction:column }
          .ev-why__pillars { gap:40px }
        }
      `}</style>

      <Nav page={page} setPage={setPage} articleSlug={articleSlug}/>

      <div style={{ opacity: 1, transition: `opacity 0.5s ${EASE2}` }}>
        {page === "home" && (
          <>
            <Hero/>
            <Marquee/>
            <About/>
            <Industries/>
            <Services/>
            <Projects/>
            <Process/>
            <WhyEvriel/>
            <Outcomes/>
            <Trust/>
            <Borders/>
            <Statement/>
            <Contact/>
          </>
        )}
        {page === "insights" && <InsightsHome setPage={setPage} setArticleSlug={setArticleSlug}/>}
        {page === "article" && <ArticlePage slug={articleSlug} setPage={setPage}/>}
        <Footer setPage={setPage}/>
      </div>
    </>
  );
}

import { useState, useEffect, useRef } from "react";
import { Mail, ArrowRight, ArrowUpRight, Menu, X, Minus, Plus, Building2, Factory, Plane, ShoppingCart, Ship, Briefcase, Megaphone, Globe, Heart, GraduationCap, Rocket, Zap, BarChart3, Cpu, RefreshCw, Lock, Eye, Shield, CheckCircle2, ChevronLeft } from "lucide-react";

const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

function useReveal(threshold = 0.07) {
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
        el.style.transform = `translate3d(0,${center * speed}px,0)`;
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
      setVal(Math.round((1 - Math.pow(1 - p, 4)) * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, active]);
  return val;
}

function Reveal({ children, className = "", style = {}, delay = 0, direction = "up" }) {
  const [ref, visible] = useReveal(0.06);
  const t = { up:"translateY(90px)", down:"translateY(-90px)", left:"translateX(90px)", right:"translateX(-90px)", scale:"scale(0.88)", none:"none" };
  return (
    <div ref={ref} className={className} style={{ ...style, opacity: visible ? 1 : 0, transform: visible ? "translate3d(0,0,0) scale(1)" : t[direction], transition: `opacity 1.3s ${EASE} ${delay}ms, transform 1.3s ${EASE} ${delay}ms` }}>
      {children}
    </div>
  );
}

function Stagger({ children, className = "", style = {}, delay = 110 }) {
  const [ref, visible] = useReveal(0.05);
  return (
    <div ref={ref} className={className} style={style}>
      {Array.isArray(children) ? children.map((child, i) => (
        <div key={i} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(60px)", transition: `opacity 1.1s ${EASE} ${i * delay}ms, transform 1.1s ${EASE} ${i * delay}ms` }}>{child}</div>
      )) : children}
    </div>
  );
}

function SlideIn({ children, className = "", style = {}, delay = 0 }) {
  const [ref, visible] = useReveal(0.06);
  return (
    <div ref={ref} className={className} style={{ ...style, opacity: visible ? 1 : 0, transform: visible ? "translateX(0)" : "translateX(-60px)", transition: `opacity 1.2s ${EASE} ${delay}ms, transform 1.2s ${EASE} ${delay}ms` }}>
      {children}
    </div>
  );
}

function LineReveal({ delay = 0, dark = false }) {
  const [ref, visible] = useReveal(0.1);
  return (
    <div ref={ref} style={{ overflow: "hidden" }}>
      <div style={{ height: 1, background: dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)", transform: visible ? "scaleX(1)" : "scaleX(0)", transformOrigin: "left", transition: `transform 1.6s ${EASE} ${delay}ms` }} />
    </div>
  );
}

/* ═══ LOGO ═══ */
const LogoMark = ({ size = 48, color = "currentColor", spinning = false }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"
    style={{ animation: spinning ? "logospin 80s linear infinite" : "none" }}>
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
    <circle cx="100" cy="100" r="5.6" fill={color} style={{ animation: "centerPulse 2.5s ease-in-out infinite" }}/>
    <circle cx="133.6" cy="100" r="3.7" fill={color}/>
  </svg>
);

const LogoFull = ({ markSize = 44, color = "#fff", subColor }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
    <LogoMark size={markSize} color={color}/>
    <div>
      <div style={{ width: 28, height: 1.5, background: color, opacity: 0.6, marginBottom: 5 }}/>
      <div style={{ fontFamily: "var(--serif)", fontSize: markSize * 0.5, fontWeight: 400, color, letterSpacing: "0.05em", lineHeight: 1 }}>Evriel</div>
      <div style={{ fontFamily: "var(--body)", fontSize: markSize * 0.18, fontWeight: 400, color: subColor || color, opacity: subColor ? 1 : 0.45, letterSpacing: "0.42em", textTransform: "uppercase", marginTop: 3 }}>Systems</div>
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
  const c = scrolled ? "#0A0A0A" : "#fff";
  return (
    <nav className={`ev-nav${scrolled ? " ev-nav--scrolled" : ""}`}>
      <div className="ev-nav__inner">
        <div onClick={goHome} style={{ cursor: "pointer" }}>
          <LogoFull markSize={36} color={c} subColor={scrolled ? "#888" : "rgba(255,255,255,0.4)"}/>
        </div>
        <div className="ev-nav__links">
          {[["About","about"],["Industries","industries"],["Services","services"],["Projects","projects"]].map(([l,id])=>(
            <button key={id} onClick={()=>goSection(id)} className="ev-nav__link" style={{color:c}}>{l}</button>
          ))}
          <button onClick={()=>{ setPage("insights"); setOpen(false); window.scrollTo({top:0,behavior:"smooth"}); }} className="ev-nav__link" style={{color:c}}>Insights</button>
          <button onClick={()=>goSection("contact")} className="ev-nav__cta" style={{background:c,color:scrolled?"#fff":"#0A0A0A", outline: scrolled?"none":"none"}}>
            {scrolled ? <span style={{background:"#0A0A0A",color:"#fff",display:"block",padding:"10px 22px"}}>Let's Talk</span> : <span style={{display:"block",padding:"10px 22px"}}>Let's Talk</span>}
          </button>
        </div>
        <button className="ev-nav__burger" onClick={()=>setOpen(!open)} style={{color:c}}>
          {open ? <X size={22}/> : <Menu size={22}/>}
        </button>
      </div>
      {open && (
        <div className="ev-mobile-menu">
          {[["About","about"],["Industries","industries"],["Services","services"],["Projects","projects"]].map(([l,id])=>(
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
  const gridRef = useParallax(0.025);
  useEffect(() => { const t = setTimeout(() => setOn(true), 80); return () => clearTimeout(t); }, []);
  const anim = (delay) => ({ opacity: on ? 1 : 0, transform: on ? "translateY(0)" : "translateY(80px)", transition: `opacity 1.3s ${EASE} ${delay}ms, transform 1.3s ${EASE} ${delay}ms` });
  return (
    <section className="ev-hero">
      <div className="ev-hero__bg">
        <div className="ev-hero__grid" ref={gridRef}/>
        <div className="ev-hero__radial"/>
        <div className="ev-hero__ghost"><LogoMark size={700} color="rgba(255,255,255,0.018)" spinning/></div>
      </div>
      <div className="ev-hero__body">
        <div style={{overflow:"hidden"}}><div className="ev-hero__eyebrow" style={anim(150)}>AI · Automation · Digital Transformation</div></div>
        <div style={{overflow:"hidden"}}><h1 className="ev-hero__h1" style={anim(350)}>Helping Organizations<br/>Thrive in the Age of<br/><em>Intelligent Systems</em></h1></div>
        <div style={{overflow:"hidden"}}><p className="ev-hero__sub" style={anim(600)}>The future belongs to organizations that can adapt, automate,<br className="desk-br"/>and make smarter decisions.</p></div>
        <div style={{overflow:"hidden"}}>
          <div className="ev-hero__ctas" style={anim(820)}>
            <a href="#services" className="ev-btn ev-btn--white" onClick={e=>{e.preventDefault();document.getElementById("services")?.scrollIntoView({behavior:"smooth"})}}>Explore Solutions <ArrowRight size={17}/></a>
            <a href="#contact" className="ev-btn ev-btn--ghost" onClick={e=>{e.preventDefault();document.getElementById("contact")?.scrollIntoView({behavior:"smooth"})}}>Schedule a Consultation</a>
          </div>
        </div>
      </div>
      <div className="ev-hero__scroll" style={{opacity:on?1:0,transition:`opacity 1s ${EASE} 1300ms`}}>
        <div className="ev-scroll-pill"><div className="ev-scroll-dot"/></div>
        <span>Scroll</span>
      </div>
    </section>
  );
}

/* ═══ MARQUEE ═══ */
function Marquee() {
  const items = ["AI Integration","Digital Transformation","Business Intelligence","Workflow Automation","Intelligent Systems","Data Analytics","Industry Solutions","Operational Excellence"];
  const row = items.map((t,i) => <span key={i} className="ev-mq__item"><span className="ev-mq__dot"/><span>{t}</span></span>);
  return <div className="ev-mq"><div className="ev-mq__track">{row}{row}{row}{row}</div></div>;
}

/* ═══ ABOUT ═══ */
function About() {
  return (
    <section id="about" className="ev-about">
      <div className="ev-about__wrap">
        {/* LEFT — white */}
        <div className="ev-about__left">
          <Reveal><div className="ev-label"><span className="ev-label__n">01</span><span className="ev-label__t">About</span></div></Reveal>
          <Reveal delay={100}><h2 className="ev-about__h">Intelligence<br/>With <em>Purpose</em></h2></Reveal>
          <Reveal delay={180}>
            <p className="ev-about__lead">Evriel Systems was founded on a simple belief:</p>
            <p className="ev-about__quote">Technology should solve real problems.</p>
            <p className="ev-about__p">Across industries, countries, and organizations, many businesses face similar challenges. At the same time, artificial intelligence, automation, and digital technologies are transforming how organizations operate.</p>
            <p className="ev-about__p">The challenge is not accessing technology. <strong>The challenge is implementing it correctly.</strong></p>
            <p className="ev-about__p">We design intelligent systems that connect people, processes, information, and technology into unified operational environments — focused on practical solutions that create measurable business value.</p>
          </Reveal>
        </div>

        {/* RIGHT — black */}
        <div className="ev-about__right">
          <Reveal direction="scale" delay={200}>
            <div className="ev-about__logo-wrap">
              <div className="ev-about__logo-ring ev-about__logo-ring--1"/>
              <div className="ev-about__logo-ring ev-about__logo-ring--2"/>
              <div className="ev-about__logo-ring ev-about__logo-ring--3"/>
              <div className="ev-about__logo-center">
                <LogoMark size={200} color="#fff"/>
              </div>
              <div className="ev-about__logo-label">
                <div style={{width:28,height:1,background:"rgba(255,255,255,0.3)",marginBottom:8}}/>
                <div style={{fontFamily:"var(--serif)",fontSize:22,color:"#fff",letterSpacing:"0.05em"}}>Evriel</div>
                <div style={{fontFamily:"var(--body)",fontSize:9,color:"rgba(255,255,255,0.4)",letterSpacing:"0.45em",textTransform:"uppercase",marginTop:4}}>Systems</div>
              </div>
            </div>
          </Reveal>

          {/* Challenges — animated slide from left */}
          <div className="ev-challenges">
            {["Fragmented Information","Repetitive Manual Work","Disconnected Systems","Inefficient Communication","Slow Decision-Making"].map((c,i)=>(
              <SlideIn key={i} delay={300 + i * 90} className="ev-challenge">
                <CheckCircle2 size={16} className="ev-challenge__icon"/>
                <span>{c}</span>
              </SlideIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══ INDUSTRIES ═══ */
const IND_DATA = [
  { icon:<Building2 size={26}/>, name:"Construction & Engineering", desc:"Digital project monitoring, documentation systems, reporting automation, engineering intelligence tools.", big:true },
  { icon:<Factory size={26}/>, name:"Manufacturing & Industrial", desc:"Workflow optimization, operational analytics, predictive monitoring, production support systems.", big:true },
  { icon:<Plane size={26}/>, name:"Tourism & Hospitality", desc:"Guest management, operational automation, intelligent customer communication, business analytics." },
  { icon:<ShoppingCart size={26}/>, name:"Retail & Commerce", desc:"Customer intelligence, inventory visibility, process automation, reporting systems." },
  { icon:<Ship size={26}/>, name:"Import & Export", desc:"Trade documentation, workflow automation, operational coordination, information management." },
  { icon:<Briefcase size={26}/>, name:"Professional Services", desc:"Knowledge systems, workflow optimization, AI-assisted operations." },
  { icon:<Megaphone size={26}/>, name:"Marketing & SEO", desc:"Content intelligence, domain qualification systems, opportunity discovery, reporting automation." },
  { icon:<Globe size={26}/>, name:"European Projects", desc:"Project management support, reporting assistance, knowledge management, AI-powered project intelligence." },
  { icon:<Heart size={26}/>, name:"NGOs & Associations", desc:"Operational efficiency, communication systems, data management, project support tools." },
  { icon:<GraduationCap size={26}/>, name:"Education & Training", desc:"Knowledge systems, digital learning support, administrative automation." },
  { icon:<Rocket size={26}/>, name:"Startups & SMEs", desc:"Scalable systems designed to support growth and operational maturity." },
];

function Industries() {
  const [hov, setHov] = useState(null);
  const bigCards = IND_DATA.filter(d=>d.big);
  const rest = IND_DATA.filter(d=>!d.big);
  const Card = ({ d, i, className="" }) => (
    <Reveal delay={i*70}>
      <div className={`ev-ind${hov===i?" ev-ind--hov":""} ${className}`} onMouseEnter={()=>setHov(i)} onMouseLeave={()=>setHov(null)}>
        <div className="ev-ind__icon">{d.icon}</div>
        <h3 className="ev-ind__name">{d.name}</h3>
        <p className="ev-ind__desc">{d.desc}</p>
        <div className="ev-ind__bar"/>
      </div>
    </Reveal>
  );
  return (
    <section id="industries" className="ev-industries">
      <div className="ev-ind__container">
        <Reveal><div className="ev-label ev-label--light"><span className="ev-label__n">02</span><span className="ev-label__t">Industries</span></div></Reveal>
        <Reveal delay={100}><h2 className="ev-ind__h">Industries<br/>We <em>Support</em></h2></Reveal>

        {/* Row 1: 2 big */}
        <div className="ev-ind-row ev-ind-row--2">
          {bigCards.map((d,i)=><Card key={i} d={d} i={i} className="ev-ind--big"/>)}
        </div>
        {/* Row 2-3: next 3+3 */}
        <div className="ev-ind-row ev-ind-row--3">
          {rest.slice(0,3).map((d,i)=><Card key={i+2} d={d} i={i+2}/>)}
        </div>
        <div className="ev-ind-row ev-ind-row--3">
          {rest.slice(3,6).map((d,i)=><Card key={i+5} d={d} i={i+5}/>)}
        </div>
        {/* Row 4: last 3 wide */}
        <div className="ev-ind-row ev-ind-row--3">
          {rest.slice(6,9).map((d,i)=><Card key={i+8} d={d} i={i+8}/>)}
        </div>
      </div>
    </section>
  );
}

/* ═══ SERVICES ═══ */
const SVC_DATA = [
  { num:"01", icon:<Zap size={30}/>, title:"AI Automation", desc:"Reduce repetitive work and improve operational efficiency through intelligent automation.", apps:["Email automation","Workflow automation","Internal process automation","AI-powered assistants","Customer communication systems"] },
  { num:"02", icon:<BarChart3 size={30}/>, title:"Business Intelligence", desc:"Transform business information into actionable insights.", apps:["Reporting dashboards","Operational analytics","Decision support systems","Data visualization","Performance monitoring"] },
  { num:"03", icon:<Cpu size={30}/>, title:"Intelligent Systems", desc:"Custom-built solutions designed around the unique needs of each organization.", apps:["Industry-specific platforms","Knowledge management systems","AI-powered operational tools","Intelligent information systems"] },
  { num:"04", icon:<RefreshCw size={30}/>, title:"Digital Transformation", desc:"Support organizations as they modernize operations and adopt emerging technologies.", apps:["Process redesign","Digital strategy","Technology integration","Operational modernization"] },
];

function Services() {
  return (
    <section id="services" className="ev-services">
      <div className="ev-svc__container">
        <div className="ev-svc__header">
          <Reveal><div className="ev-label"><span className="ev-label__n">03</span><span className="ev-label__t">Services</span></div></Reveal>
          <Reveal delay={100}><h2 className="ev-svc__h">What We<br/><em>Deliver</em></h2></Reveal>
        </div>
        {SVC_DATA.map((s,i)=>(
          <Reveal key={i} delay={i*100}>
            <div className="ev-svc">
              <div className="ev-svc__num-col">
                <span className="ev-svc__ghost-num">{s.num}</span>
                <div className="ev-svc__icon">{s.icon}</div>
              </div>
              <div className="ev-svc__mid">
                <h3 className="ev-svc__title">{s.title}</h3>
                <p className="ev-svc__desc">{s.desc}</p>
              </div>
              <div className="ev-svc__apps">
                <div className="ev-svc__apps-label">Applications</div>
                <ul>{s.apps.map((a,j)=><li key={j}>{a}</li>)}</ul>
              </div>
              <div className="ev-svc__line-anim"/>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ═══ PROJECTS ═══ */
const PROJ_DATA = [
  { title:"Domain Intelligence Platform", desc:"An AI-powered system that automates identification, evaluation, and qualification of SEO and partnership opportunities.", caps:["Domain analysis","Relevance scoring","Niche classification","Opportunity prioritization","Workflow automation"], tagline:"Reducing manual research while improving decision quality." },
  { title:"AI Workforce Management Assistant", desc:"A business-trained AI assistant that supports employees through organization-specific knowledge and operational guidance.", caps:["Internal support","Employee onboarding","Process guidance","Knowledge retrieval","Operational assistance"], tagline:"Functions as a continuously available digital team member." },
  { title:"European Project Intelligence Assistant", desc:"An intelligent assistant designed to simplify the management of European projects.", caps:["Project documentation support","Reporting assistance","Compliance guidance","Knowledge organization","Stakeholder information access"], tagline:"Helping teams navigate complex project environments." },
  { title:"Engineering Project Monitoring System", desc:"A user-friendly platform designed to support engineering and construction projects.", caps:["AutoCAD integration support","Project documentation","Site progress monitoring","Reporting workflows","Communication management"], tagline:"Improved visibility across the entire project lifecycle." },
  { title:"Intelligent Email Operations Platform", desc:"An advanced communication system trained on organizational knowledge and business processes.", caps:["Customer communication support","Intelligent response generation","Workflow execution","Brand-consistent communication"], tagline:"Acts as an intelligent extension of the organization." },
  { title:"GIS & Spatial Intelligence Platform", desc:"A geographic intelligence system supporting planning and operational decision-making.", caps:["Mapping","Infrastructure analysis","Location intelligence","Spatial data visualization","Geographic decision support"], tagline:"Useful across engineering, infrastructure, logistics, and planning." },
];

function Projects() {
  const [active, setActive] = useState(null);
  return (
    <section id="projects" className="ev-projects">
      <div className="ev-proj__container">
        <Reveal><div className="ev-label ev-label--light"><span className="ev-label__n">04</span><span className="ev-label__t">Featured Projects</span></div></Reveal>
        <Reveal delay={100}><h2 className="ev-proj__h">Proven<br/><em>Solutions</em></h2></Reveal>
        <div className="ev-proj__list">
          {PROJ_DATA.map((p,i)=>(
            <Reveal key={i} delay={i*70}>
              <div className={`ev-proj${active===i?" ev-proj--open":""}`} onClick={()=>setActive(active===i?null:i)}>
                <div className="ev-proj__header">
                  <div className="ev-proj__hl">
                    <span className="ev-proj__idx">0{i+1}</span>
                    <h3 className="ev-proj__title">{p.title}</h3>
                  </div>
                  <span className="ev-proj__tog">{active===i?<Minus size={18}/>:<Plus size={18}/>}</span>
                </div>
                <div style={{ maxHeight:active===i?500:0, opacity:active===i?1:0, overflow:"hidden", transition:`max-height 0.65s ${EASE}, opacity 0.45s ${EASE}` }}>
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
  { title:"Design", desc:"We design a solution tailored to your organization's specific requirements. No generic templates. No one-size-fits-all approaches." },
  { title:"Implementation", desc:"We build and integrate the solution into your operational environment." },
  { title:"Optimization", desc:"We continuously improve performance, usability, automation, and business outcomes." },
];

function Process() {
  return (
    <section id="process" className="ev-process">
      <div className="ev-proc__container">
        <Reveal><div className="ev-label"><span className="ev-label__n">05</span><span className="ev-label__t">Process</span></div></Reveal>
        <Reveal delay={100}><h2 className="ev-proc__h">How We<br/><em>Work</em></h2></Reveal>
        <div className="ev-proc__grid">
          {PROC_DATA.map((s,i)=>(
            <Reveal key={i} delay={i*110} direction="up">
              <div className="ev-proc__card">
                <div className="ev-proc__card-num">0{i+1}</div>
                <div className="ev-proc__card-dot"/>
                <h3 className="ev-proc__card-title">{s.title}</h3>
                <p className="ev-proc__card-desc">{s.desc}</p>
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
    <section id="trust" className="ev-trust">
      <div className="ev-trust__wrap">
        <div className="ev-trust__left">
          <Reveal><div className="ev-label ev-label--light"><span className="ev-label__n">06</span><span className="ev-label__t">Trust & Security</span></div></Reveal>
          <Reveal delay={100}><h2 className="ev-trust__h">Your Data<br/>Remains <em>Yours</em></h2></Reveal>
          <Reveal delay={180}>
            <p className="ev-trust__p">We believe trust is the foundation of every intelligent system. Client information is used exclusively for the development, operation, and improvement of the agreed solution.</p>
            <p className="ev-trust__p">We do not use client data for unrelated purposes, unauthorized model training, or external development activities.</p>
          </Reveal>
        </div>
        <div className="ev-trust__right">
          <Stagger className="ev-trust__cards" delay={120}>
            {[
              { icon:<Lock size={22}/>, t:"Confidentiality", d:"Your information stays protected at every stage of the engagement." },
              { icon:<Eye size={22}/>, t:"Transparency", d:"Clear communication about how data is used and managed." },
              { icon:<Shield size={22}/>, t:"Responsible AI", d:"Ethical implementation at the core of every system we build." },
              { icon:<CheckCircle2 size={22}/>, t:"Security-First Design", d:"Built from the ground up with security as a non-negotiable priority." },
            ].map((item,i)=>(
              <div key={i} className="ev-trust__card">
                <div className="ev-trust__card-icon">{item.icon}</div>
                <div><h4 className="ev-trust__card-t">{item.t}</h4><p className="ev-trust__card-d">{item.d}</p></div>
              </div>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}

/* ═══ STATEMENT ═══ */
function Statement() {
  const pRef = useParallax(0.02);
  return (
    <section className="ev-statement">
      <div className="ev-statement__bg" ref={pRef}><LogoMark size={460} color="rgba(255,255,255,0.025)"/></div>
      <div className="ev-statement__body">
        <Reveal>
          <h2 className="ev-statement__h">The future belongs to<br/>organizations that think<br/><em>intelligently.</em></h2>
        </Reveal>
        <Reveal delay={200}>
          <a href="#contact" className="ev-btn ev-btn--white ev-btn--lg" onClick={e=>{e.preventDefault();document.getElementById("contact")?.scrollIntoView({behavior:"smooth"})}}>
            Start a Conversation <ArrowRight size={19}/>
          </a>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══ CONTACT FORM ═══ */
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
      <div className="ev-contact__wrap">
        <div className="ev-contact__left">
          <Reveal><div className="ev-label"><span className="ev-label__n">07</span><span className="ev-label__t">Contact</span></div></Reveal>
          <Reveal delay={100}><h2 className="ev-contact__h">Let's Discuss<br/>Your <em>Project</em></h2></Reveal>
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
                <CheckCircle2 size={48} className="ev-sent__icon"/>
                <h3 className="ev-sent__h">Message Received</h3>
                <p className="ev-sent__p">Thank you for reaching out. We'll review your challenge and respond within 24 hours.</p>
                <button className="ev-btn ev-btn--dark" style={{marginTop:24}} onClick={()=>setSent(false)}>Send Another</button>
              </div>
            </Reveal>
          ) : (
            <Reveal direction="right">
              <form className="ev-form" onSubmit={handleSubmit}>
                <div className="ev-form__row">
                  <Field label="Name" name="name" placeholder="Your full name"/>
                  <Field label="Company / Organization" name="company" placeholder="Organization name"/>
                </div>
                <div className="ev-form__row">
                  <Field label="Email" name="email" type="email" placeholder="your@email.com"/>
                  <Field label="Phone Number" name="phone" placeholder="+1 000 000 0000" optional/>
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
                    {["AI Automation","Business Intelligence","Digital Transformation","Custom Business Systems","European Project Solutions","Not Sure Yet"].map(x=>(
                      <label key={x} className={`ev-check${form.interests.includes(x)?" ev-check--on":""}`} onClick={()=>toggle(x)}>
                        <span className="ev-check__box">{form.interests.includes(x) && <CheckCircle2 size={13}/>}</span>
                        {x}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="ev-field">
                  <label className="ev-field__label">Tell us about your challenge</label>
                  <textarea className="ev-textarea" rows={5}
                    placeholder="Describe your project, challenge, idea, workflow, or business objective. The more information you provide, the better we can understand your needs."
                    value={form.challenge} onChange={e=>setForm(f=>({...f,challenge:e.target.value}))}/>
                </div>

                <button type="submit" className="ev-btn ev-btn--dark ev-btn--lg" style={{width:"100%",justifyContent:"center",marginTop:8}}>
                  Start the Conversation <ArrowRight size={18}/>
                </button>
              </form>
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
            <LogoFull markSize={32} color="#fff" subColor="rgba(255,255,255,0.3)"/>
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

/* ═══ ARTICLES DATA ═══ */
const ARTICLES = [
  {
    slug:"ai-beyond-chatbots",
    tag:"AI Strategy",
    date:"Nov 2024",
    title:"AI Beyond Chatbots: Practical Applications for Real Businesses",
    excerpt:"Artificial intelligence creates value far beyond conversational interfaces — in operations, analytics, and decision-making.",
    body:[
      "Artificial Intelligence is often associated with chatbots and virtual assistants. While these tools are valuable, they represent only a small part of what AI can achieve within modern organizations.",
      "Today, businesses are using AI to automate workflows, improve operational efficiency, support decision-making, and create better customer experiences.",
      "One of the most impactful applications of AI is workflow automation. Organizations spend countless hours performing repetitive administrative tasks such as data entry, reporting, document processing, and communication management. Intelligent systems can automate many of these processes, allowing employees to focus on higher-value activities.",
      "AI also plays an increasingly important role in decision support. By analyzing large volumes of business information, intelligent systems can identify patterns, detect inefficiencies, and provide recommendations that help organizations make better decisions.",
      "Customer service is another area where AI creates significant value. Beyond simple chatbots, AI can assist support teams by organizing information, suggesting responses, and providing instant access to organizational knowledge.",
      "The most successful organizations do not adopt AI simply because it is popular. They identify specific business challenges and implement intelligent solutions that generate measurable results.",
      "The future of AI in business is not about replacing people. It is about empowering people with better tools, better information, and better systems.",
      "Organizations that embrace this approach will be better positioned to improve efficiency, increase competitiveness, and adapt to a rapidly changing business environment.",
    ]
  },
  {
    slug:"automation-failures",
    tag:"Transformation",
    date:"Oct 2024",
    title:"Why Most Automation Projects Fail",
    excerpt:"The gap between automation promise and real-world results is wider than most organizations expect — here's why.",
    body:[
      "Automation is one of the most powerful tools available to modern organizations. However, many automation initiatives fail to deliver the expected benefits.",
      "The primary reason is simple: organizations often attempt to automate inefficient processes. Automation cannot fix a broken workflow. It can only accelerate it.",
      "Before introducing technology, organizations must first understand how work is performed, identify bottlenecks, and redesign inefficient processes. Without this foundation, automation often creates additional complexity instead of solving existing problems.",
      "Another common mistake is focusing on software rather than business objectives. Organizations sometimes purchase new tools without clearly defining the problem they are trying to solve.",
      "Successful automation projects begin with questions such as: What process needs improvement? What outcomes are we trying to achieve? How will success be measured?",
      "Employee adoption is equally important. Even the most advanced automation platform will struggle if users do not understand its purpose or if it disrupts established workflows.",
      "The most successful automation initiatives are not technology projects. They are business improvement projects supported by technology.",
      "When implemented correctly, automation can reduce administrative workloads, improve consistency, increase operational visibility, and enable organizations to scale more effectively.",
      "The goal is not simply to automate tasks. The goal is to build smarter and more efficient systems.",
    ]
  },
  {
    slug:"ai-construction-engineering",
    tag:"Industry",
    date:"Sep 2024",
    title:"AI in Construction and Engineering",
    excerpt:"How intelligent systems are transforming project visibility, communication, and operational control in construction.",
    body:[
      "Construction and engineering projects generate enormous amounts of information. Drawings, reports, site updates, documentation, schedules, budgets, and communication records are often distributed across multiple systems and stakeholders.",
      "Managing this information efficiently has become one of the industry's greatest challenges.",
      "Artificial Intelligence and intelligent systems are creating new opportunities to improve project visibility, communication, and operational control.",
      "AI can support engineering teams by organizing project documentation, monitoring progress, generating reports, and helping identify potential issues before they impact schedules or budgets.",
      "Project managers can benefit from real-time access to information that would otherwise require hours of manual review.",
      "Digital monitoring systems can improve coordination between office teams, engineers, contractors, and site personnel. By centralizing information, organizations gain greater visibility into project performance and decision-making.",
      "Intelligent systems can also support technical knowledge management by ensuring that important information remains accessible throughout the project lifecycle.",
      "The future of construction technology is not simply about digitizing documents. It is about creating connected environments where information flows efficiently between people, processes, and systems.",
      "Organizations that adopt intelligent technologies today will be better positioned to improve productivity, reduce risk, and deliver projects more effectively in the future.",
    ]
  },
  {
    slug:"digital-transformation-people",
    tag:"Strategy",
    date:"Aug 2024",
    title:"Digital Transformation Is About People, Not Software",
    excerpt:"Why the most expensive digital transformation failures share the same root cause — and what to do about it.",
    body:[
      "When organizations begin digital transformation initiatives, many focus immediately on technology. New software is purchased. New platforms are implemented. New tools are introduced.",
      "Yet despite significant investments, many transformation projects fail to achieve their intended outcomes.",
      "The reason is simple: digital transformation is not primarily a technology challenge. It is a people and process challenge.",
      "Technology can enable change, but it cannot create it on its own.",
      "Successful organizations first understand how people work, how decisions are made, and how information moves throughout the business. Only then can technology be implemented effectively.",
      "Employees need systems that support their work rather than create additional complexity. Managers need visibility into operations. Leadership teams need reliable information to guide strategic decisions.",
      "When technology aligns with business processes and organizational objectives, transformation becomes sustainable.",
      "The most successful organizations do not simply digitize existing activities. They redesign how work is performed and use technology to create better outcomes.",
      "Digital transformation is ultimately about creating environments where people, processes, and technology work together effectively.",
      "Organizations that understand this principle achieve greater efficiency, adaptability, and long-term growth.",
    ]
  },
  {
    slug:"intelligent-systems-advantage",
    tag:"Competitive Edge",
    date:"Jul 2024",
    title:"Building Competitive Advantage Through Intelligent Systems",
    excerpt:"How forward-thinking organizations use AI integration to create sustainable competitive moats.",
    body:[
      "Every organization is searching for ways to become more efficient, more responsive, and more competitive.",
      "Traditionally, competitive advantage was often created through scale, location, or access to resources.",
      "Today, intelligent systems are becoming one of the most important sources of competitive advantage.",
      "Organizations generate vast amounts of information every day. Customer interactions, operational data, project updates, financial records, and market insights all contain valuable opportunities for improvement.",
      "The challenge is not collecting information. The challenge is transforming information into action.",
      "Intelligent systems help organizations automate repetitive tasks, identify patterns, support decision-making, and improve operational visibility.",
      "By reducing manual work and improving access to information, organizations can respond more quickly to opportunities and challenges.",
      "Competitive organizations are increasingly using intelligent systems to optimize workflows, improve customer experiences, and support strategic planning.",
      "The goal is not to replace human expertise. The goal is to enhance it.",
      "Organizations that successfully combine human knowledge with intelligent systems are better positioned to adapt, innovate, and grow in an increasingly complex business environment.",
      "Competitive advantage is no longer created solely through resources. It is increasingly created through intelligence, adaptability, and the ability to make better decisions faster.",
    ]
  },
  {
    slug:"data-driven-decisions",
    tag:"Intelligence",
    date:"Jun 2024",
    title:"Turning Data Into Better Decisions",
    excerpt:"Modern organizations drown in data but struggle with decisions. Here's how intelligent systems close the gap.",
    body:[
      "Modern organizations generate more information than ever before. Operational reports, customer interactions, project updates, financial records, performance metrics, and digital activities all contribute to growing volumes of data.",
      "Yet many organizations continue to struggle with decision-making.",
      "The problem is not a lack of information. The problem is transforming information into meaningful insights.",
      "Without structure and context, data becomes overwhelming rather than useful.",
      "Business intelligence and intelligent systems help organizations organize information, identify patterns, and present insights in ways that support effective decision-making.",
      "When leaders have access to accurate and relevant information, they can identify opportunities more quickly, address problems earlier, and allocate resources more effectively.",
      "Data-driven organizations are often more agile because decisions are supported by evidence rather than assumptions.",
      "However, successful data utilization requires more than dashboards and reports. Organizations must establish processes that ensure information is accessible, reliable, and aligned with business objectives.",
      "The future belongs to organizations that can transform information into intelligence and intelligence into action.",
      "Better decisions create better outcomes. Intelligent systems make those decisions easier to achieve.",
    ]
  },
];

/* ═══ INSIGHTS HOME ═══ */
function InsightsHome({ setPage, setArticleSlug }) {
  return (
    <>
      <section className="ev-insights-hero">
        <Reveal><div className="ev-label ev-label--light"><span className="ev-label__n">Research</span><span className="ev-label__t">Insights</span></div></Reveal>
        <Reveal delay={100}><h1 className="ev-insights-hero__h">Thinking<br/><em>Forward</em></h1></Reveal>
        <Reveal delay={200}><p className="ev-insights-hero__sub">A professional knowledge hub on AI, automation, and digital transformation across industries.</p></Reveal>
      </section>
      <section className="ev-insights-grid">
        <div className="ev-insights-grid__inner">
          {ARTICLES.map((a,i)=>(
            <Reveal key={i} delay={i*80}>
              <article className="ev-art-card" onClick={()=>{ setArticleSlug(a.slug); setPage("article"); window.scrollTo({top:0,behavior:"smooth"}); }}>
                <div className="ev-art-card__meta">
                  <span className="ev-art-card__tag">{a.tag}</span>
                  <span className="ev-art-card__date">{a.date}</span>
                </div>
                <h2 className="ev-art-card__title">{a.title}</h2>
                <p className="ev-art-card__excerpt">{a.excerpt}</p>
                <div className="ev-art-card__read">Read Article <ArrowRight size={14}/></div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}

/* ═══ ARTICLE PAGE ═══ */
function ArticlePage({ slug, setPage }) {
  const art = ARTICLES.find(a=>a.slug===slug);
  if (!art) return null;
  const others = ARTICLES.filter(a=>a.slug!==slug).slice(0,3);
  return (
    <>
      <section className="ev-art-hero">
        <Reveal><span className="ev-art-hero__tag">{art.tag}</span></Reveal>
        <Reveal delay={100}><h1 className="ev-art-hero__h">{art.title}</h1></Reveal>
        <Reveal delay={180}><span className="ev-art-hero__date">{art.date}</span></Reveal>
      </section>
      <section className="ev-art-body">
        <div className="ev-art-body__inner">
          <div className="ev-art-body__content">
            {art.body.map((p,i)=>(
              <Reveal key={i} delay={i*40}><p className="ev-art-body__p">{p}</p></Reveal>
            ))}
            <Reveal delay={200}>
              <div className="ev-art-body__cta">
                <p>Ready to implement intelligent systems in your organization?</p>
                <a href="javascript:void(0)" className="ev-btn ev-btn--dark" onClick={()=>{ setPage("home"); setTimeout(()=>document.getElementById("contact")?.scrollIntoView({behavior:"smooth"}),300); }}>
                  Let's Discuss Your Project <ArrowRight size={16}/>
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
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@300;400;500;600&display=swap');
        :root { --black:#0A0A0A; --white:#FFFFFF; --plat:#D9D9D9; --serif:'DM Serif Display',Georgia,serif; --body:'Inter',-apple-system,sans-serif; }
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
        html{scroll-behavior:smooth}
        body{font-family:var(--body);background:var(--black);color:var(--black);-webkit-font-smoothing:antialiased}
        button,input,textarea,select{font-family:inherit;background:none;border:none;cursor:pointer}
        a{text-decoration:none;color:inherit}
        em{font-family:var(--serif);font-style:italic}
        .desk-br{display:block}

        @keyframes logospin{from{transform:translate(-50%,-50%) rotate(0deg)}to{transform:translate(-50%,-50%) rotate(360deg)}}
        @keyframes centerPulse{0%,100%{opacity:1;r:5.6}50%{opacity:0.5;r:7}}
        @keyframes ringPulse{0%,100%{transform:scale(1);opacity:0.6}50%{transform:scale(1.06);opacity:0.2}}
        @keyframes mq{from{transform:translateX(0)}to{transform:translateX(-25%)}}
        @keyframes scrollBob{0%,100%{transform:translateY(0);opacity:1}50%{transform:translateY(10px);opacity:0.3}}
        @keyframes indBar{from{width:0}to{width:100%}}

        /* NAV */
        .ev-nav{position:fixed;top:0;left:0;right:0;z-index:999;padding:18px 0;transition:all 0.5s ${EASE}}
        .ev-nav--scrolled{background:rgba(255,255,255,0.96);backdrop-filter:blur(24px);padding:10px 0;box-shadow:0 1px 0 rgba(0,0,0,0.07)}
        .ev-nav__inner{max-width:1440px;margin:0 auto;padding:0 48px;display:flex;align-items:center;justify-content:space-between}
        .ev-nav__links{display:flex;align-items:center;gap:32px}
        .ev-nav__link{font-size:12px;font-weight:400;letter-spacing:0.07em;text-transform:uppercase;transition:opacity 0.3s}
        .ev-nav__link:hover{opacity:0.55}
        .ev-nav__cta{font-size:11px;font-weight:500;letter-spacing:0.09em;text-transform:uppercase;transition:all 0.3s}
        .ev-nav__cta:hover{opacity:0.8}
        .ev-nav__burger{display:none;color:#fff}
        .ev-mobile-menu{position:fixed;inset:0;background:var(--black);z-index:998;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;padding-top:60px}
        .ev-mobile-link{font-family:var(--serif);font-size:34px;color:#fff;transition:opacity 0.3s}
        .ev-mobile-link:hover{opacity:0.55}

        /* HERO */
        .ev-hero{position:relative;height:100vh;min-height:680px;display:flex;align-items:center;justify-content:center;background:var(--black);overflow:hidden}
        .ev-hero__bg{position:absolute;inset:0;pointer-events:none}
        .ev-hero__grid{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,0.028) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.028) 1px,transparent 1px);background-size:80px 80px}
        .ev-hero__radial{position:absolute;inset:0;background:radial-gradient(ellipse 70% 60% at 50% 50%,rgba(255,255,255,0.035),transparent)}
        .ev-hero__ghost{position:absolute;top:50%;left:50%;animation:logospin 90s linear infinite}
        .ev-hero__body{position:relative;z-index:2;text-align:center;padding:0 24px;max-width:1100px}
        .ev-hero__eyebrow{display:inline-flex;align-items:center;font-size:11px;letter-spacing:0.28em;text-transform:uppercase;color:rgba(255,255,255,0.38);margin-bottom:32px;font-weight:400}
        .ev-hero__h1{font-family:var(--serif);font-size:clamp(34px,5.2vw,72px);font-weight:400;color:#fff;line-height:1.18;letter-spacing:-0.01em}
        .ev-hero__h1 em{color:var(--plat)}
        .ev-hero__sub{font-size:clamp(15px,1.5vw,19px);font-weight:300;color:rgba(255,255,255,0.38);margin-top:28px;line-height:1.7;letter-spacing:0.02em}
        .ev-hero__ctas{display:flex;gap:14px;justify-content:center;margin-top:44px;flex-wrap:wrap}
        .ev-hero__scroll{position:absolute;bottom:36px;left:50%;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:10px;color:rgba(255,255,255,0.28);font-size:10px;letter-spacing:0.22em;text-transform:uppercase}
        .ev-scroll-pill{width:20px;height:32px;border:1px solid rgba(255,255,255,0.18);border-radius:10px;display:flex;justify-content:center;padding-top:6px}
        .ev-scroll-dot{width:3px;height:8px;background:rgba(255,255,255,0.45);border-radius:2px;animation:scrollBob 2s ease-in-out infinite}

        /* BUTTONS */
        .ev-btn{display:inline-flex;align-items:center;gap:10px;font-size:12px;font-weight:500;letter-spacing:0.09em;text-transform:uppercase;padding:15px 30px;transition:all 0.4s ${EASE};border:1px solid transparent;cursor:pointer}
        .ev-btn--white{background:#fff;color:var(--black)}
        .ev-btn--white:hover{background:var(--plat);transform:translateY(-2px)}
        .ev-btn--ghost{border-color:rgba(255,255,255,0.2);color:#fff}
        .ev-btn--ghost:hover{border-color:rgba(255,255,255,0.6)}
        .ev-btn--dark{background:var(--black);color:#fff}
        .ev-btn--dark:hover{background:#1a1a1a;transform:translateY(-2px)}
        .ev-btn--lg{padding:18px 42px;font-size:13px}

        /* SECTION LABEL */
        .ev-label{display:flex;align-items:center;gap:10px;margin-bottom:22px}
        .ev-label__n{font-size:12px;font-weight:500;color:rgba(0,0,0,0.25);letter-spacing:0.12em;font-variant-numeric:tabular-nums}
        .ev-label__t{font-size:12px;font-weight:400;letter-spacing:0.2em;text-transform:uppercase;color:rgba(0,0,0,0.4)}
        .ev-label--light .ev-label__n,.ev-label--light .ev-label__t{color:rgba(255,255,255,0.28)}

        /* MARQUEE */
        .ev-mq{background:var(--plat);padding:14px 0;overflow:hidden;border-top:1px solid rgba(0,0,0,0.05);border-bottom:1px solid rgba(0,0,0,0.05)}
        .ev-mq__track{display:flex;gap:52px;white-space:nowrap;animation:mq 38s linear infinite}
        .ev-mq__item{display:inline-flex;align-items:center;gap:12px;font-size:11px;font-weight:500;letter-spacing:0.14em;text-transform:uppercase;color:rgba(0,0,0,0.5)}
        .ev-mq__dot{width:4px;height:4px;border-radius:50%;background:rgba(0,0,0,0.3)}

        /* ABOUT — split dark/light */
        .ev-about{background:linear-gradient(to right,var(--white) 55%,var(--black) 55%)}
        .ev-about__wrap{max-width:1440px;margin:0 auto;display:grid;grid-template-columns:55fr 45fr;min-height:100vh;align-items:center}
        .ev-about__left{padding:140px 60px 100px 48px}
        .ev-about__h{font-family:var(--serif);font-size:clamp(44px,5vw,74px);font-weight:400;line-height:1.08;margin-bottom:32px}
        .ev-about__lead{font-size:18px;color:rgba(0,0,0,0.6);margin-bottom:6px;line-height:1.5}
        .ev-about__quote{font-family:var(--serif);font-size:26px;font-style:italic;color:var(--black);margin-bottom:28px;line-height:1.4}
        .ev-about__p{font-size:15px;line-height:1.78;color:rgba(0,0,0,0.52);margin-bottom:14px;max-width:520px}
        .ev-about__p strong{color:var(--black);font-weight:600}
        .ev-about__right{padding:140px 48px 100px 60px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:48px}
        .ev-about__logo-wrap{position:relative;width:340px;height:340px;display:flex;align-items:center;justify-content:center}
        .ev-about__logo-ring{position:absolute;border-radius:50%;border:1px solid rgba(255,255,255,0.08)}
        .ev-about__logo-ring--1{width:260px;height:260px;animation:ringPulse 3.5s ease-in-out infinite}
        .ev-about__logo-ring--2{width:320px;height:320px;animation:ringPulse 3.5s ease-in-out infinite 0.7s}
        .ev-about__logo-ring--3{width:340px;height:340px;border-style:dashed;border-color:rgba(255,255,255,0.04);animation:ringPulse 3.5s ease-in-out infinite 1.4s}
        .ev-about__logo-center{position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;gap:16px}
        .ev-about__logo-label{text-align:center}
        .ev-challenges{width:100%;display:flex;flex-direction:column;gap:10px}
        .ev-challenge{display:flex;align-items:center;gap:12px;padding:12px 16px;border:1px solid rgba(255,255,255,0.07);color:rgba(255,255,255,0.65);font-size:13px;letter-spacing:0.04em;transition:all 0.35s ${EASE};cursor:default}
        .ev-challenge:hover{border-color:rgba(255,255,255,0.2);background:rgba(255,255,255,0.04);color:#fff}
        .ev-challenge__icon{color:var(--plat);flex-shrink:0}

        /* INDUSTRIES */
        .ev-industries{background:var(--black);padding:140px 0}
        .ev-ind__container{max-width:1440px;margin:0 auto;padding:0 48px}
        .ev-ind__h{font-family:var(--serif);font-size:clamp(44px,5vw,74px);font-weight:400;color:#fff;line-height:1.08;margin-bottom:56px}
        .ev-ind__h em{color:var(--plat)}
        .ev-ind-row{display:grid;gap:1px;margin-bottom:1px}
        .ev-ind-row--2{grid-template-columns:1fr 1fr}
        .ev-ind-row--3{grid-template-columns:1fr 1fr 1fr}
        .ev-ind{padding:36px 32px;border:1px solid rgba(255,255,255,0.04);transition:all 0.45s ${EASE};cursor:default;position:relative;overflow:hidden}
        .ev-ind--big{padding:52px 40px}
        .ev-ind--hov,.ev-ind:hover{background:rgba(255,255,255,0.04)}
        .ev-ind__icon{color:var(--plat);margin-bottom:18px;transition:transform 0.4s ${EASE}}
        .ev-ind:hover .ev-ind__icon{transform:scale(1.15) translateY(-2px)}
        .ev-ind__name{font-family:var(--serif);font-size:20px;font-weight:400;color:#fff;margin-bottom:10px;line-height:1.3}
        .ev-ind--big .ev-ind__name{font-size:26px}
        .ev-ind__desc{font-size:13px;line-height:1.65;color:rgba(255,255,255,0.3)}
        .ev-ind--big .ev-ind__desc{font-size:14px}
        .ev-ind__bar{position:absolute;bottom:0;left:0;height:2px;background:var(--plat);width:0;transition:width 0.6s ${EASE}}
        .ev-ind:hover .ev-ind__bar{width:100%}

        /* SERVICES */
        .ev-services{background:var(--white);padding:140px 0}
        .ev-svc__container{max-width:1440px;margin:0 auto;padding:0 48px}
        .ev-svc__header{margin-bottom:64px}
        .ev-svc__h{font-family:var(--serif);font-size:clamp(44px,5vw,74px);font-weight:400;line-height:1.08}
        .ev-svc{display:grid;grid-template-columns:100px 1fr 1fr;gap:40px;padding:44px 0;border-top:1px solid rgba(0,0,0,0.07);position:relative;transition:padding-left 0.4s ${EASE};align-items:start}
        .ev-svc:last-child{border-bottom:1px solid rgba(0,0,0,0.07)}
        .ev-svc:hover{padding-left:14px}
        .ev-svc__line-anim{position:absolute;left:0;top:0;width:2px;height:0;background:var(--black);transition:height 0.6s ${EASE}}
        .ev-svc:hover .ev-svc__line-anim{height:100%}
        .ev-svc__num-col{display:flex;flex-direction:column;gap:14px;padding-top:4px}
        .ev-svc__ghost-num{font-family:var(--serif);font-size:52px;color:rgba(0,0,0,0.05);line-height:1}
        .ev-svc__icon{color:var(--black)}
        .ev-svc__title{font-family:var(--serif);font-size:28px;font-weight:400;margin-bottom:12px}
        .ev-svc__desc{font-size:14px;line-height:1.72;color:rgba(0,0,0,0.5)}
        .ev-svc__apps-label{font-size:10px;font-weight:500;letter-spacing:0.18em;text-transform:uppercase;color:rgba(0,0,0,0.28);margin-bottom:14px}
        .ev-svc__apps ul{list-style:none;display:flex;flex-direction:column;gap:8px}
        .ev-svc__apps li{font-size:13px;color:rgba(0,0,0,0.5);padding-left:16px;position:relative}
        .ev-svc__apps li::before{content:'';position:absolute;left:0;top:7px;width:5px;height:5px;border-radius:50%;background:rgba(0,0,0,0.12)}

        /* PROJECTS */
        .ev-projects{background:var(--black);padding:140px 0}
        .ev-proj__container{max-width:1200px;margin:0 auto;padding:0 48px}
        .ev-proj__h{font-family:var(--serif);font-size:clamp(44px,5vw,74px);font-weight:400;color:#fff;line-height:1.08;margin-bottom:60px}
        .ev-proj__h em{color:var(--plat)}
        .ev-proj{border-top:1px solid rgba(255,255,255,0.07);padding:26px 0;cursor:pointer;transition:all 0.3s}
        .ev-proj:last-child{border-bottom:1px solid rgba(255,255,255,0.07)}
        .ev-proj:hover{padding-left:14px}
        .ev-proj__header{display:flex;justify-content:space-between;align-items:center}
        .ev-proj__hl{display:flex;align-items:center;gap:20px}
        .ev-proj__idx{font-family:var(--serif);font-size:16px;color:rgba(255,255,255,0.18)}
        .ev-proj__title{font-family:var(--serif);font-size:clamp(19px,2.2vw,26px);font-weight:400;color:#fff}
        .ev-proj__tog{color:rgba(255,255,255,0.38)}
        .ev-proj__body{padding:18px 0 6px 52px}
        .ev-proj__desc{font-size:14px;line-height:1.72;color:rgba(255,255,255,0.4);margin-bottom:16px;max-width:580px}
        .ev-proj__caps{display:flex;flex-wrap:wrap;gap:7px;margin-bottom:14px}
        .ev-proj__cap{font-size:10px;letter-spacing:0.07em;text-transform:uppercase;padding:5px 12px;border:1px solid rgba(255,255,255,0.1);color:rgba(255,255,255,0.45);transition:all 0.3s}
        .ev-proj__cap:hover{border-color:var(--plat);color:var(--plat)}
        .ev-proj__tagline{font-family:var(--serif);font-size:15px;font-style:italic;color:rgba(217,217,217,0.6)}

        /* PROCESS */
        .ev-process{background:var(--white);padding:140px 0}
        .ev-proc__container{max-width:1440px;margin:0 auto;padding:0 48px}
        .ev-proc__h{font-family:var(--serif);font-size:clamp(44px,5vw,74px);font-weight:400;line-height:1.08;margin-bottom:64px}
        .ev-proc__grid{display:grid;grid-template-columns:repeat(5,1fr);gap:0;position:relative}
        .ev-proc__grid::before{content:'';position:absolute;top:20px;left:0;right:0;height:1px;background:rgba(0,0,0,0.08)}
        .ev-proc__card{padding:0 28px 40px;border-right:1px solid rgba(0,0,0,0.07);transition:background 0.4s}
        .ev-proc__card:last-child{border-right:none}
        .ev-proc__card:hover{background:rgba(0,0,0,0.015)}
        .ev-proc__card-num{font-family:var(--serif);font-size:13px;color:rgba(0,0,0,0.2);margin-bottom:28px;display:block;padding-top:12px;letter-spacing:0.1em}
        .ev-proc__card-dot{width:9px;height:9px;border-radius:50%;background:var(--black);margin-bottom:24px;transition:transform 0.4s}
        .ev-proc__card:hover .ev-proc__card-dot{transform:scale(1.4)}
        .ev-proc__card-title{font-family:var(--serif);font-size:22px;font-weight:400;margin-bottom:12px}
        .ev-proc__card-desc{font-size:13px;line-height:1.68;color:rgba(0,0,0,0.44)}

        /* TRUST */
        .ev-trust{background:var(--black);padding:140px 0}
        .ev-trust__wrap{max-width:1440px;margin:0 auto;padding:0 48px;display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:start}
        .ev-trust__h{font-family:var(--serif);font-size:clamp(40px,4.5vw,66px);font-weight:400;color:#fff;line-height:1.08;margin-bottom:28px}
        .ev-trust__h em{color:var(--plat)}
        .ev-trust__p{font-size:15px;line-height:1.75;color:rgba(255,255,255,0.38);margin-bottom:14px}
        .ev-trust__cards{display:flex;flex-direction:column;gap:16px}
        .ev-trust__card{display:flex;gap:16px;align-items:flex-start;padding:22px 20px;border:1px solid rgba(255,255,255,0.06);transition:all 0.4s ${EASE}}
        .ev-trust__card:hover{border-color:rgba(255,255,255,0.14);background:rgba(255,255,255,0.025)}
        .ev-trust__card-icon{color:var(--plat);flex-shrink:0;margin-top:2px}
        .ev-trust__card-t{font-family:var(--serif);font-size:17px;color:#fff;margin-bottom:4px}
        .ev-trust__card-d{font-size:13px;color:rgba(255,255,255,0.33);line-height:1.6}

        /* STATEMENT */
        .ev-statement{position:relative;background:var(--black);padding:160px 48px;display:flex;align-items:center;justify-content:center;min-height:65vh;overflow:hidden}
        .ev-statement__bg{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)}
        .ev-statement__body{position:relative;z-index:2;text-align:center}
        .ev-statement__h{font-family:var(--serif);font-size:clamp(32px,4.5vw,64px);font-weight:400;color:#fff;line-height:1.2;margin-bottom:44px}
        .ev-statement__h em{color:var(--plat)}

        /* CONTACT */
        .ev-contact{background:var(--white);padding:140px 0}
        .ev-contact__wrap{max-width:1440px;margin:0 auto;padding:0 48px;display:grid;grid-template-columns:5fr 7fr;gap:80px;align-items:start}
        .ev-contact__h{font-family:var(--serif);font-size:clamp(38px,4.2vw,64px);font-weight:400;line-height:1.1;margin-bottom:18px}
        .ev-contact__sub{font-size:17px;color:rgba(0,0,0,0.6);margin-bottom:8px;font-family:var(--serif);font-style:italic}
        .ev-contact__p{font-size:14px;line-height:1.72;color:rgba(0,0,0,0.48);margin-bottom:40px;max-width:400px}
        .ev-contact__info{display:flex;flex-direction:column;gap:24px}
        .ev-contact__block{}
        .ev-contact__blabel{font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(0,0,0,0.28);margin-bottom:5px}
        .ev-contact__bval{font-family:var(--serif);font-size:18px;transition:opacity 0.3s}
        .ev-contact__bval:hover{opacity:0.55}

        /* FORM */
        .ev-form{display:flex;flex-direction:column;gap:24px;padding:40px;border:1px solid rgba(0,0,0,0.07);background:#FAFAFA}
        .ev-form__row{display:grid;grid-template-columns:1fr 1fr;gap:20px}
        .ev-field{display:flex;flex-direction:column;gap:8px}
        .ev-field__label{font-size:11px;font-weight:500;letter-spacing:0.14em;text-transform:uppercase;color:rgba(0,0,0,0.45)}
        .ev-field__opt{font-weight:400;opacity:0.6;text-transform:none;letter-spacing:0}
        .ev-field__input{border:none;border-bottom:1px solid rgba(0,0,0,0.12);background:transparent;padding:10px 0;font-size:14px;color:var(--black);transition:border-color 0.3s;outline:none}
        .ev-field__input:focus{border-bottom-color:var(--black)}
        .ev-select{border:none;border-bottom:1px solid rgba(0,0,0,0.12);background:transparent;padding:10px 0;font-size:14px;color:var(--black);outline:none;appearance:none;cursor:pointer;transition:border-color 0.3s}
        .ev-select:focus{border-bottom-color:var(--black)}
        .ev-textarea{border:1px solid rgba(0,0,0,0.1);background:#fff;padding:14px;font-size:14px;color:var(--black);line-height:1.65;resize:vertical;outline:none;transition:border-color 0.3s}
        .ev-textarea:focus{border-color:var(--black)}
        .ev-radios{display:flex;flex-wrap:wrap;gap:8px}
        .ev-radio{font-size:12px;letter-spacing:0.05em;padding:7px 14px;border:1px solid rgba(0,0,0,0.1);cursor:pointer;transition:all 0.3s;user-select:none}
        .ev-radio--on{background:var(--black);color:#fff;border-color:var(--black)}
        .ev-checks{display:grid;grid-template-columns:1fr 1fr;gap:8px}
        .ev-check{display:flex;align-items:center;gap:10px;font-size:13px;cursor:pointer;padding:8px 12px;border:1px solid rgba(0,0,0,0.08);transition:all 0.3s;user-select:none}
        .ev-check--on{background:rgba(0,0,0,0.04);border-color:rgba(0,0,0,0.2)}
        .ev-check__box{width:18px;height:18px;border:1px solid rgba(0,0,0,0.2);border-radius:2px;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all 0.3s}
        .ev-check--on .ev-check__box{background:var(--black);border-color:var(--black);color:#fff}
        .ev-sent{display:flex;flex-direction:column;align-items:center;text-align:center;padding:80px 40px}
        .ev-sent__icon{color:var(--black);margin-bottom:24px}
        .ev-sent__h{font-family:var(--serif);font-size:32px;margin-bottom:12px}
        .ev-sent__p{font-size:15px;color:rgba(0,0,0,0.5);line-height:1.65;max-width:360px}

        /* FOOTER */
        .ev-footer{background:var(--black);padding:48px 0 32px;border-top:1px solid rgba(255,255,255,0.05)}
        .ev-footer__inner{max-width:1440px;margin:0 auto;padding:0 48px}
        .ev-footer__top{display:flex;justify-content:space-between;align-items:center;margin-bottom:32px}
        .ev-footer__tag{font-size:13px;color:rgba(255,255,255,0.22);letter-spacing:0.05em}
        .ev-footer__line{height:1px;background:rgba(255,255,255,0.05);margin-bottom:24px}
        .ev-footer__bot{display:flex;justify-content:space-between;font-size:11px;color:rgba(255,255,255,0.18);letter-spacing:0.04em}

        /* INSIGHTS */
        .ev-insights-hero{background:var(--black);padding:200px 48px 100px;text-align:center}
        .ev-insights-hero__h{font-family:var(--serif);font-size:clamp(56px,8vw,120px);font-weight:400;color:#fff;line-height:1;margin-bottom:24px}
        .ev-insights-hero__h em{color:var(--plat)}
        .ev-insights-hero__sub{font-size:16px;color:rgba(255,255,255,0.35);max-width:540px;margin:0 auto;line-height:1.7}
        .ev-insights-grid{background:var(--white);padding:80px 0 120px}
        .ev-insights-grid__inner{max-width:1440px;margin:0 auto;padding:0 48px;display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:rgba(0,0,0,0.07)}
        .ev-art-card{background:#fff;padding:40px 36px;cursor:pointer;transition:all 0.4s ${EASE};position:relative;overflow:hidden}
        .ev-art-card::after{content:'';position:absolute;bottom:0;left:0;width:0;height:2px;background:var(--black);transition:width 0.5s ${EASE}}
        .ev-art-card:hover{background:#FAFAFA;transform:translateY(-3px)}
        .ev-art-card:hover::after{width:100%}
        .ev-art-card__meta{display:flex;align-items:center;gap:14px;margin-bottom:16px}
        .ev-art-card__tag{font-size:10px;letter-spacing:0.1em;text-transform:uppercase;padding:4px 10px;border:1px solid rgba(0,0,0,0.12)}
        .ev-art-card__date{font-size:11px;color:rgba(0,0,0,0.28);letter-spacing:0.05em}
        .ev-art-card__title{font-family:var(--serif);font-size:20px;font-weight:400;line-height:1.35;margin-bottom:12px}
        .ev-art-card__excerpt{font-size:13px;line-height:1.65;color:rgba(0,0,0,0.48);margin-bottom:20px}
        .ev-art-card__read{display:inline-flex;align-items:center;gap:8px;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;font-weight:500;transition:gap 0.3s}
        .ev-art-card:hover .ev-art-card__read{gap:14px}

        /* ARTICLE PAGE */
        .ev-art-hero{background:var(--black);padding:180px 48px 100px;text-align:center;max-width:none}
        .ev-art-hero__tag{font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(255,255,255,0.35);display:block;margin-bottom:24px}
        .ev-art-hero__h{font-family:var(--serif);font-size:clamp(32px,4.5vw,60px);font-weight:400;color:#fff;line-height:1.2;max-width:900px;margin:0 auto 20px}
        .ev-art-hero__date{font-size:12px;color:rgba(255,255,255,0.28);letter-spacing:0.1em;display:block}
        .ev-art-body{background:var(--white);padding:80px 0 120px}
        .ev-art-body__inner{max-width:1200px;margin:0 auto;padding:0 48px;display:grid;grid-template-columns:1fr 340px;gap:80px;align-items:start}
        .ev-art-body__content{}
        .ev-art-body__p{font-size:17px;line-height:1.82;color:rgba(0,0,0,0.65);margin-bottom:24px;max-width:660px}
        .ev-art-body__cta{margin-top:56px;padding:40px;background:#FAFAFA;border:1px solid rgba(0,0,0,0.07)}
        .ev-art-body__cta p{font-family:var(--serif);font-size:20px;margin-bottom:20px}
        .ev-art-body__sidebar{position:sticky;top:120px}
        .ev-art-sidebar__h{font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:rgba(0,0,0,0.35);margin-bottom:24px;padding-bottom:12px;border-bottom:1px solid rgba(0,0,0,0.08)}
        .ev-art-sidebar__item{padding:18px 0;border-bottom:1px solid rgba(0,0,0,0.07);cursor:pointer;transition:all 0.3s}
        .ev-art-sidebar__item:hover{padding-left:8px}
        .ev-art-sidebar__tag{font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:rgba(0,0,0,0.3);display:block;margin-bottom:6px}
        .ev-art-sidebar__title{font-family:var(--serif);font-size:15px;line-height:1.4;color:var(--black)}

        /* RESPONSIVE */
        @media(max-width:1200px){
          .ev-about{background:var(--white)}
          .ev-about__wrap{grid-template-columns:1fr;background:none}
          .ev-about__left{padding:100px 40px 48px}
          .ev-about__right{background:var(--black);padding:64px 40px}
          .ev-ind-row--3{grid-template-columns:1fr 1fr}
          .ev-svc{grid-template-columns:80px 1fr;gap:24px}
          .ev-svc__apps{grid-column:1/-1;padding-left:80px}
          .ev-trust__wrap{grid-template-columns:1fr;gap:48px}
          .ev-contact__wrap{grid-template-columns:1fr;gap:48px}
          .ev-art-body__inner{grid-template-columns:1fr;gap:48px}
          .ev-art-body__sidebar{position:static}
          .ev-insights-grid__inner{grid-template-columns:1fr 1fr}
        }
        @media(max-width:900px){
          .ev-nav__links{display:none}.ev-nav__burger{display:block}
          .ev-nav__inner{padding:0 20px}
          .desk-br{display:none}
          .ev-hero__h1{font-size:clamp(28px,6vw,44px)}
          .ev-about__left{padding:80px 20px 40px}
          .ev-about__h{font-size:clamp(36px,8vw,52px)}
          .ev-about__right{padding:48px 20px}
          .ev-about__logo-wrap{width:260px;height:260px}
          .ev-about__logo-ring--1{width:200px;height:200px}
          .ev-about__logo-ring--2{width:240px;height:240px}
          .ev-about__logo-ring--3{width:260px;height:260px}
          .ev-ind__container,.ev-svc__container,.ev-proj__container,.ev-proc__container,.ev-trust__wrap,.ev-contact__wrap,.ev-footer__inner{padding:0 20px}
          .ev-industries{padding:100px 0}
          .ev-ind__h,.ev-svc__h,.ev-proj__h,.ev-proc__h,.ev-trust__h,.ev-contact__h{font-size:clamp(36px,8vw,52px)}
          .ev-ind-row--2,.ev-ind-row--3{grid-template-columns:1fr}
          .ev-services{padding:100px 0}
          .ev-svc{grid-template-columns:1fr;gap:16px;padding:32px 0}
          .ev-svc__num-col{flex-direction:row;align-items:center}
          .ev-svc__ghost-num{font-size:36px}
          .ev-svc__apps{padding-left:0}
          .ev-projects{padding:100px 0}
          .ev-proj__body{padding-left:0}
          .ev-process{padding:100px 0}
          .ev-proc__grid{grid-template-columns:1fr}
          .ev-proc__card{border-right:none;border-bottom:1px solid rgba(0,0,0,0.07);padding:28px 0}
          .ev-trust{padding:100px 0}
          .ev-statement{padding:100px 20px;min-height:55vh}
          .ev-statement__h{font-size:clamp(26px,6vw,44px)}
          .ev-contact{padding:100px 0}
          .ev-form{padding:24px}
          .ev-form__row{grid-template-columns:1fr}
          .ev-checks{grid-template-columns:1fr}
          .ev-footer__top{flex-direction:column;gap:16px;align-items:flex-start}
          .ev-footer__bot{flex-direction:column;gap:8px}
          .ev-insights-hero{padding:160px 20px 80px}
          .ev-insights-grid__inner{grid-template-columns:1fr;padding:0 20px}
          .ev-art-hero{padding:160px 20px 80px}
          .ev-art-body__inner{padding:0 20px}
          .ev-art-body__p{font-size:16px}
        }
        @media(max-width:480px){
          .ev-hero{min-height:100svh}
          .ev-hero__h1{font-size:26px}
          .ev-hero__ctas{flex-direction:column;align-items:center}
          .ev-btn{width:100%;justify-content:center}
          .ev-radios{flex-direction:column}
        }
      `}</style>

      <Nav page={page} setPage={setPage} articleSlug={articleSlug}/>

      <div style={{ opacity: 1, transition: `opacity 0.5s ${EASE}` }}>
        {page === "home" && (
          <>
            <Hero/>
            <Marquee/>
            <About/>
            <Industries/>
            <Services/>
            <Projects/>
            <Process/>
            <Trust/>
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

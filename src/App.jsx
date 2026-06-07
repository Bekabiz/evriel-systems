import { useState, useEffect, useRef } from "react";
import { Mail, ArrowRight, ArrowUpRight, Menu, X, Minus, Plus, Workflow, LineChart, Network, Compass, Lock, Eye, Shield, CheckCircle2, Languages, Target } from "lucide-react";

const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

function useReveal(threshold = 0.07) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(el); } }, { threshold });
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
    const onScroll = () => { raf = requestAnimationFrame(() => { const rect = el.getBoundingClientRect(); el.style.transform = `translate3d(0,${(rect.top + rect.height / 2 - window.innerHeight / 2) * speed}px,0)`; }); };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, [speed]);
  return ref;
}

function Reveal({ children, className = "", style = {}, delay = 0, direction = "up" }) {
  const [ref, vis] = useReveal(0.06);
  const t = { up: "translateY(80px)", down: "translateY(-80px)", left: "translateX(80px)", right: "translateX(-80px)", scale: "scale(0.9)", none: "none" };
  return <div ref={ref} className={className} style={{ ...style, opacity: vis ? 1 : 0, transform: vis ? "none" : t[direction], transition: `opacity 1.2s ${EASE} ${delay}ms, transform 1.2s ${EASE} ${delay}ms` }}>{children}</div>;
}

function Stagger({ children, className = "", style = {}, delay = 110 }) {
  const [ref, vis] = useReveal(0.05);
  return <div ref={ref} className={className} style={style}>{Array.isArray(children) ? children.map((c, i) => <div key={i} style={{ opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(60px)", transition: `opacity 1.1s ${EASE} ${i * delay}ms, transform 1.1s ${EASE} ${i * delay}ms` }}>{c}</div>) : children}</div>;
}

/* ═══ LOGO ═══ */
const LogoMark = ({ size = 48, color = "currentColor", spin = false }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" fill="none" style={spin ? { animation: "logospin 80s linear infinite" } : {}}>
    {[[180,100,140,169.3],[140,169.3,60,169.3],[60,169.3,20,100],[20,100,60,30.7],[60,30.7,140,30.7],[140,30.7,180,100]].map(([x1,y1,x2,y2],i)=>
      <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
    )}
    {[[100,100,60,30.7],[100,100,20,100],[100,100,60,169.3]].map(([x1,y1,x2,y2],i)=>
      <line key={`c${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
    )}
    <line x1="100" y1="100" x2="133.6" y2="100" stroke={color} strokeWidth="1.875" strokeLinecap="round"/>
    {[[180,100,4.6],[140,169.3,4.6],[60,169.3,4.6],[20,100,4.6],[60,30.7,4.6],[140,30.7,4.6],[133.6,100,3.7]].map(([cx,cy,r],i)=>
      <circle key={i} cx={cx} cy={cy} r={r} fill={color}/>
    )}
    <circle cx="100" cy="100" r="5.6" fill={color} style={{animation:"cpulse 2.5s ease-in-out infinite"}}/>
  </svg>
);

/* ═══ NAV ═══ */
function Nav({ page, setPage }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => { const h = () => setScrolled(window.scrollY > 50); window.addEventListener("scroll", h, { passive: true }); return () => window.removeEventListener("scroll", h); }, []);
  const go = (id) => { setOpen(false); if (page !== "home") { setPage("home"); setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 250); } else document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); };
  const c = scrolled ? "#0A0A0A" : "#fff";
  return (
    <nav className={`ev-nav${scrolled?" ev-nav--s":""}`}>
      <div className="ev-nav__in">
        <div onClick={()=>{setPage("home");setOpen(false);window.scrollTo({top:0,behavior:"smooth"})}} style={{cursor:"pointer",display:"flex",alignItems:"center",gap:14}}>
          <LogoMark size={32} color={c}/>
          <div><div style={{width:24,height:1.5,background:c,opacity:0.5,marginBottom:4}}/><div style={{fontFamily:"var(--sf)",fontSize:18,fontWeight:400,color:c,letterSpacing:"0.05em",lineHeight:1}}>Evriel</div><div style={{fontFamily:"var(--bd)",fontSize:8,color:scrolled?"#888":"rgba(255,255,255,0.4)",letterSpacing:"0.42em",textTransform:"uppercase",marginTop:3}}>Systems</div></div>
        </div>
        <div className="ev-nav__links">
          {[["About","about"],["Industries","industries"],["Services","services"],["Projects","projects"]].map(([l,id])=>
            <button key={id} onClick={()=>go(id)} className="ev-nav__link" style={{color:c}}>{l}</button>
          )}
          <button onClick={()=>{setPage("insights");setOpen(false);window.scrollTo({top:0,behavior:"smooth"})}} className="ev-nav__link" style={{color:c}}>Insights</button>
          <button onClick={()=>go("contact")} className="ev-nav__cta" style={{background:c,color:scrolled?"#fff":"#0A0A0A"}}>Let's Talk</button>
        </div>
        <button className="ev-nav__burger" onClick={()=>setOpen(!open)} style={{color:c}}>{open?<X size={22}/>:<Menu size={22}/>}</button>
      </div>
      {open&&<div className="ev-mobile-menu">{[["About","about"],["Industries","industries"],["Services","services"],["Projects","projects"]].map(([l,id])=><button key={id} onClick={()=>go(id)} className="ev-mob-link">{l}</button>)}<button onClick={()=>{setPage("insights");setOpen(false);window.scrollTo({top:0,behavior:"smooth"})}} className="ev-mob-link">Insights</button><button onClick={()=>go("contact")} className="ev-mob-link">Contact</button></div>}
    </nav>
  );
}

/* ═══ HERO ═══ */
function Hero() {
  const [on, setOn] = useState(false);
  const gRef = useParallax(0.025);
  useEffect(() => { setTimeout(() => setOn(true), 80); }, []);
  const a = (d) => ({ opacity:on?1:0, transform:on?"translateY(0)":"translateY(70px)", transition:`opacity 1.3s ${EASE} ${d}ms, transform 1.3s ${EASE} ${d}ms` });
  return (
    <section className="ev-hero">
      <div className="ev-hero__bg"><div className="ev-hero__grid" ref={gRef}/><div className="ev-hero__rad"/><div className="ev-hero__ghost"><LogoMark size={700} color="rgba(255,255,255,0.02)" spin/></div></div>
      <div className="ev-hero__body">
        <div style={{overflow:"hidden"}}><div className="ev-hero__eyebrow" style={a(150)}>AI • Automation • Intelligent Systems</div></div>
        <div style={{overflow:"hidden"}}>
          <div style={a(300)} className="ev-hero__brand">
            <LogoMark size={90} color="#fff"/>
            <div className="ev-hero__brand-text">
              <div className="ev-hero__brand-line"/>
              <h1 className="ev-hero__brand-name">Evriel</h1>
              <span className="ev-hero__brand-sub">SYSTEMS</span>
            </div>
          </div>
        </div>
        <div style={{overflow:"hidden"}}><h2 className="ev-hero__h2" style={a(500)}>Connecting Intelligence<br/>with <em>Business</em></h2></div>
        <div style={{overflow:"hidden"}}><p className="ev-hero__sub" style={a(680)}>Helping organizations leverage AI, automation, and intelligent systems<br className="dbr"/>to improve efficiency, make better decisions, and build sustainable<br className="dbr"/>competitive advantages.</p></div>
        <div style={{overflow:"hidden"}}>
          <div className="ev-hero__ctas" style={a(860)}>
            <a href="#services" className="ev-btn ev-btn--w" onClick={e=>{e.preventDefault();document.getElementById("services")?.scrollIntoView({behavior:"smooth"})}}>Explore Solutions <ArrowRight size={17}/></a>
            <a href="#contact" className="ev-btn ev-btn--gh" onClick={e=>{e.preventDefault();document.getElementById("contact")?.scrollIntoView({behavior:"smooth"})}}>Let's Discuss Your Project</a>
          </div>
        </div>
      </div>
      <div className="ev-hero__scroll" style={{opacity:on?1:0,transition:`opacity 1s ${EASE} 1200ms`}}>
        <div className="ev-scr-pill"><div className="ev-scr-dot"/></div><span>Scroll</span>
      </div>
    </section>
  );
}

/* ═══ MARQUEE ═══ */
function Marquee() {
  const items = ["AI Integration","Digital Transformation","Business Intelligence","Workflow Automation","Intelligent Systems","Data Analytics","Industry Solutions","Operational Excellence"];
  const r = items.map((t,i)=><span key={i} className="ev-mq__i"><span className="ev-mq__dot"/>{t}</span>);
  return <div className="ev-mq"><div className="ev-mq__track">{r}{r}{r}{r}</div></div>;
}

/* ═══ ABOUT ═══ */
const ABOUT_FEATS = [
  { t:"AI-Driven", s:"Innovation", d:"Practical applications of AI for real business challenges." },
  { t:"Multi-Industry", s:"Expertise", d:"Solutions designed for diverse operational environments." },
  { t:"24/7", s:"Intelligence", d:"Continuous support through automation and intelligent systems." },
  { t:"Future-Ready", s:"Growth", d:"Built to adapt, scale, and evolve with your organization." },
];

function About() {
  const [ref, vis] = useReveal(0.08);
  return (
    <section id="about" className="ev-about" ref={ref}>
      <div className="ev-about__wrap">
        <div className="ev-about__left">
          <Reveal><div className="ev-label">01 <span>About</span></div></Reveal>
          <Reveal delay={100}><h2 className="ev-about__h">Intelligence<br/>With <em>Purpose</em></h2></Reveal>
          <Reveal delay={180}>
            <p className="ev-about__lead">Every organization faces unique challenges.</p>
            <p className="ev-about__quote">Our role is to understand those challenges and design practical systems that improve how people work, collaborate, and make decisions.</p>
            <p className="ev-about__p">Artificial Intelligence is transforming industries and creating new opportunities to operate more efficiently, make smarter decisions, and remain competitive. <strong>The challenge is not accessing AI — it is implementing it correctly.</strong></p>
            <p className="ev-about__p">Evriel Systems helps organizations integrate AI, automation, and intelligent technologies into practical business systems that create measurable value — connecting people, processes, information, and technology into solutions built for efficiency, growth, and long-term success.</p>
          </Reveal>
          <Stagger className="ev-about__stats" delay={90}>
            {ABOUT_FEATS.map((f,i)=>
              <div key={i} className="ev-afeat"><span className="ev-afeat__n">{f.t}<br/>{f.s}</span><p className="ev-afeat__d">{f.d}</p></div>
            )}
          </Stagger>
        </div>
        <div className="ev-about__right">
          <Reveal direction="scale" delay={200}>
            <div className="ev-about__logo-area">
              <div className="ev-about__ring ev-about__ring--1"/><div className="ev-about__ring ev-about__ring--2"/><div className="ev-about__ring ev-about__ring--3"/>
              <LogoMark size={180} color="#fff"/>
            </div>
          </Reveal>
          <Stagger className="ev-challenges" delay={90}>
            {["Fragmented Information","Repetitive Manual Work","Disconnected Systems","Inefficient Communication","Slow Decision-Making"].map((c,i)=>
              <div key={i} className="ev-ch"><CheckCircle2 size={15}/><span>{c}</span></div>
            )}
          </Stagger>
        </div>
      </div>
    </section>
  );
}

/* ═══ OUTCOMES ═══ */
const OUTCOMES = [
  { t:"AI-Powered Efficiency", d:"Reduce repetitive work and streamline operations through intelligent automation." },
  { t:"Smarter Decision-Making", d:"Use AI, data, and business intelligence to support informed decisions." },
  { t:"Operational Visibility", d:"Connect systems, information, and workflows to improve transparency and control." },
  { t:"Growth & Competitiveness", d:"Leverage intelligent technologies to adapt, innovate, and stay ahead." },
  { t:"Digital Transformation", d:"Build modern operational foundations that support long-term success." },
];

function Outcomes() {
  const pRef = useParallax(0.018);
  return (
    <section className="ev-out-sec">
      <div className="ev-out__glow" ref={pRef}/>
      <div className="ev-out__wrap">
        <Reveal><div className="ev-label ev-label--l">— <span>What We Help Improve</span></div></Reveal>
        <div className="ev-out__grid">
          {OUTCOMES.map((o,i)=>(
            <Reveal key={i} delay={i*90} direction={i%2?"right":"left"}>
              <div className="ev-out">
                <span className="ev-out__ix">0{i+1}</span>
                <h3 className="ev-out__t">{o.t}</h3>
                <p className="ev-out__d">{o.d}</p>
                <div className="ev-out__ln"/>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══ INDUSTRIES ═══ */
const INDS = [
  { name:"Construction & Engineering", desc:"Digital project monitoring, documentation systems, and reporting automation built for complex, multi-stakeholder environments." },
  { name:"Manufacturing & Industrial", desc:"Workflow optimization, operational analytics, and predictive monitoring that improve consistency at scale." },
  { name:"Tourism & Hospitality", desc:"Guest management, operational automation, and business analytics that elevate the experience and the bottom line." },
  { name:"Retail & Commerce", desc:"Customer intelligence, inventory visibility, and process automation across the full commercial journey." },
  { name:"Import & Export", desc:"Trade documentation, workflow automation, and operational coordination across borders and partners." },
  { name:"Professional Services", desc:"Knowledge systems, workflow optimization, and AI-assisted operations that free experts to focus on expertise." },
  { name:"Marketing & SEO", desc:"Content intelligence, domain qualification, and opportunity discovery powered by AI-driven analysis." },
  { name:"European Projects", desc:"Project management support, reporting, and knowledge management for complex funding environments." },
  { name:"NGOs & Associations", desc:"Operational efficiency, communication systems, and data management aligned with mission-driven work." },
  { name:"Education & Training", desc:"Knowledge systems, digital learning support, and administrative automation that support people first." },
  { name:"Startups & SMEs", desc:"Scalable systems designed to support growth and operational maturity at every stage." },
];

function Industries() {
  const [hov, setHov] = useState(null);
  return (
    <section id="industries" className="ev-ind-sec">
      <div className="ev-ind__wrap">
        <Reveal><div className="ev-label ev-label--l">02 <span>Industries</span></div></Reveal>
        <Reveal delay={80}><h2 className="ev-ind__h">Industries We <em>Support</em></h2></Reveal>
        <div className="ev-ind-list">
          {INDS.map((d,i)=>(
            <Reveal key={i} delay={i*50}>
              <div className={`ev-ind${hov===i?" ev-ind--on":""}`} onMouseEnter={()=>setHov(i)} onMouseLeave={()=>setHov(null)}>
                <span className="ev-ind__ix">0{i+1}</span>
                <h3 className="ev-ind__nm">{d.name}</h3>
                <p className="ev-ind__ds">{d.desc}</p>
                <ArrowUpRight size={22} className="ev-ind__ar"/>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══ SERVICES ═══ */
const SVCS = [
  { n:"01",ic:<Workflow size={26}/>,t:"AI Automation",d:"Reduce repetitive work and improve operational efficiency through intelligent automation.",a:["Email automation","Workflow automation","Internal process automation","AI-powered assistants","Customer communication systems"] },
  { n:"02",ic:<LineChart size={26}/>,t:"Business Intelligence",d:"Transform business information into actionable insights.",a:["Reporting dashboards","Operational analytics","Decision support systems","Data visualization","Performance monitoring"] },
  { n:"03",ic:<Network size={26}/>,t:"Intelligent Systems",d:"Custom-built solutions designed around the unique needs of each organization.",a:["Industry-specific platforms","Knowledge management","AI-powered operational tools","Intelligent information systems"] },
  { n:"04",ic:<Compass size={26}/>,t:"Digital Transformation",d:"Support organizations as they modernize operations and adopt emerging technologies.",a:["Process redesign","Digital strategy","Technology integration","Operational modernization"] },
];

function Services() {
  return (
    <section id="services" className="ev-svc-sec">
      <div className="ev-svc__wrap">
        <Reveal><div className="ev-label">03 <span>Services</span></div></Reveal>
        <Reveal delay={80}><h2 className="ev-svc__h">What We <em>Deliver</em></h2></Reveal>
        <Reveal delay={140}><p className="ev-svc__intro">We help organizations turn emerging technologies into practical business advantages.</p></Reveal>
        {SVCS.map((s,i)=>(
          <Reveal key={i} delay={i*90}>
            <div className="ev-svc">
              <div className="ev-svc__l"><span className="ev-svc__gn">{s.n}</span>{s.ic}</div>
              <div className="ev-svc__m"><h3 className="ev-svc__t">{s.t}</h3><p className="ev-svc__d">{s.d}</p></div>
              <div className="ev-svc__r"><div className="ev-svc__al">Applications</div><ul>{s.a.map((x,j)=><li key={j}>{x}</li>)}</ul></div>
              <div className="ev-svc__bar"/>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ═══ PROJECTS ═══ */
const PROJS = [
  { t:"Domain Intel",d:"An AI-powered system that automates identification, evaluation, and qualification of SEO and partnership opportunities.",c:["Domain analysis","Relevance scoring","Niche classification","Workflow automation"],tl:"Helping teams reduce manual research, improve decision quality, and identify opportunities faster through AI-powered analysis." },
  { t:"Workforce AI",d:"A business-trained AI assistant supporting employees through organization-specific knowledge and operational guidance.",c:["Internal support","Employee onboarding","Process guidance","Knowledge retrieval"],tl:"Helping teams onboard faster, reduce repetitive questions, and access guidance the moment it's needed." },
  { t:"EU Project Assistant",d:"An intelligent assistant designed to simplify the management of European projects.",c:["Documentation support","Reporting assistance","Compliance guidance","Stakeholder access"],tl:"Helping teams navigate complex funding environments, reduce administrative load, and stay aligned with compliance requirements." },
  { t:"Project Vision",d:"A user-friendly platform designed to support engineering and construction projects.",c:["AutoCAD integration","Site monitoring","Reporting workflows","Communication management"],tl:"Helping teams gain real-time visibility, reduce delays, and keep every stakeholder aligned across the project lifecycle." },
  { t:"Email Intelligence",d:"An advanced communication system trained on organizational knowledge and business processes.",c:["Intelligent responses","Workflow execution","Brand-consistent comms"],tl:"Helping teams respond faster, maintain consistency, and free up time for higher-value conversations." },
  { t:"GIS Intelligence",d:"A geographic intelligence system supporting planning and operational decision-making.",c:["Mapping","Infrastructure analysis","Location intelligence","Spatial visualization"],tl:"Helping teams visualize complexity, plan with confidence, and make location-driven decisions faster." },
];

function Projects() {
  const [active, setActive] = useState(null);
  return (
    <section id="projects" className="ev-proj-sec">
      <div className="ev-proj__wrap">
        <Reveal><div className="ev-label ev-label--l">04 <span>Featured Projects</span></div></Reveal>
        <Reveal delay={80}><h2 className="ev-proj__h">Proven <em>Solutions</em></h2></Reveal>
        {PROJS.map((p,i)=>(
          <Reveal key={i} delay={i*60}>
            <div className={`ev-prj${active===i?" ev-prj--o":""}`} onClick={()=>setActive(active===i?null:i)}>
              <div className="ev-prj__hd"><div className="ev-prj__hl"><span className="ev-prj__ix">0{i+1}</span><h3 className="ev-prj__t">{p.t}</h3></div><span className="ev-prj__tog">{active===i?<Minus size={18}/>:<Plus size={18}/>}</span></div>
              <div style={{maxHeight:active===i?500:0,opacity:active===i?1:0,overflow:"hidden",transition:`max-height 0.6s ${EASE}, opacity 0.4s ${EASE}`}}>
                <div className="ev-prj__bd"><p>{p.d}</p><div className="ev-prj__caps">{p.c.map((x,j)=><span key={j} className="ev-prj__cap">{x}</span>)}</div><p className="ev-prj__tl">{p.tl}</p></div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ═══ PROCESS ═══ */
const PROCS = [
  { t:"Discovery",d:"We learn how your organization operates. We identify objectives, challenges, workflows, and opportunities." },
  { t:"Assessment",d:"We analyze operational inefficiencies and identify where intelligent systems create measurable value." },
  { t:"Design",d:"We design a solution tailored to your organization. No generic templates. No one-size-fits-all." },
  { t:"Implementation",d:"We build and integrate the solution into your operational environment." },
  { t:"Optimization",d:"We continuously improve performance, usability, automation, and business outcomes." },
];

function Process() {
  return (
    <section id="process" className="ev-proc-sec">
      <div className="ev-proc__wrap">
        <Reveal><div className="ev-label ev-label--l">05 <span>Process</span></div></Reveal>
        <Reveal delay={80}><h2 className="ev-proc__h">How We <em>Work</em></h2></Reveal>
        <Reveal delay={140}><p className="ev-proc__intro">Every organization is different. Our process is designed to understand your specific challenges before recommending technology.</p></Reveal>
        <div className="ev-proc__grid">
          {PROCS.map((s,i)=>(
            <Reveal key={i} delay={i*100}>
              <div className="ev-proc__card"><div className="ev-proc__num">0{i+1}</div><div className="ev-proc__dot"/><h3 className="ev-proc__ct">{s.t}</h3><p className="ev-proc__cd">{s.d}</p></div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══ BORDERS ═══ */
function Borders() {
  const pRef = useParallax(0.03);
  return (
    <section className="ev-bdr-sec">
      <div className="ev-bdr__orb" ref={pRef}><LogoMark size={520} color="rgba(255,255,255,0.022)" spin/></div>
      <div className="ev-bdr__wrap">
        <Reveal><div className="ev-label ev-label--l">— <span>Working Across Borders</span></div></Reveal>
        <Reveal delay={100}><h2 className="ev-bdr__h">Built for a <em>Connected</em> World</h2></Reveal>
        <Reveal delay={180}>
          <p className="ev-bdr__p">Business challenges rarely stop at national boundaries. Evriel Systems supports organizations operating across different industries, markets, and regions.</p>
          <p className="ev-bdr__p">We understand the importance of clear communication, cultural awareness, and practical solutions that work in diverse environments.</p>
        </Reveal>
        <Reveal delay={260}>
          <div className="ev-bdr__tag"><Languages size={16}/><span>Projects and communications can be conducted in multiple languages depending on client requirements.</span></div>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══ WHY ═══ */
const WHY = [
  { t:"Practical Solutions", d:"Focused on real business outcomes." },
  { t:"Intelligent Systems", d:"Built around your organization's needs." },
  { t:"Long-Term Thinking", d:"Designed to support sustainable growth and adaptability." },
];

function Why() {
  return (
    <section className="ev-why-sec">
      <div className="ev-why__wrap">
        <Reveal><div className="ev-label ev-label--l">— <span>Why Evriel Systems</span></div></Reveal>
        <Reveal delay={100}><h2 className="ev-why__h">Clarity, Not <em>Complexity</em></h2></Reveal>
        <Reveal delay={180}>
          <p className="ev-why__lead">Technology should create clarity, not complexity. Our approach combines business understanding, intelligent technology, and practical implementation to help organizations improve operations, make better decisions, and adapt to a rapidly changing world.</p>
          <p className="ev-why__lead ev-why__lead--sub">We focus on solutions that deliver measurable value rather than technology for technology's sake.</p>
        </Reveal>
        <Stagger className="ev-why__grid" delay={100}>
          {WHY.map((w,i)=>
            <div key={i} className="ev-why__card"><Target size={20}/><h3>{w.t}</h3><p>{w.d}</p></div>
          )}
        </Stagger>
      </div>
    </section>
  );
}

/* ═══ TRUST ═══ */
function Trust() {
  return (
    <section id="trust" className="ev-trust-sec">
      <div className="ev-trust__wrap">
        <div className="ev-trust__l">
          <Reveal><div className="ev-label">06 <span>Trust & Security</span></div></Reveal>
          <Reveal delay={80}><h2 className="ev-trust__h">Your Data Remains <em>Yours</em></h2></Reveal>
          <Reveal delay={160}><p className="ev-trust__p">We believe trust is the foundation of every intelligent system. Client information is used exclusively for the development, operation, and improvement of the agreed solution.</p></Reveal>
          <Reveal delay={220}><div className="ev-trust__note"><Lock size={16}/><p><strong>Your data remains your property.</strong> Client information is never used for unrelated purposes, unauthorized training, or external development activities.</p></div></Reveal>
        </div>
        <Stagger className="ev-trust__r" delay={110}>
          {[{ic:<Lock size={20}/>,t:"Confidentiality",d:"Your information stays protected at every stage."},{ic:<Eye size={20}/>,t:"Transparency",d:"Clear communication about how data is used."},{ic:<Shield size={20}/>,t:"Responsible AI",d:"Ethical implementation at the core."},{ic:<CheckCircle2 size={20}/>,t:"Security-First",d:"Built from the ground up with security as priority."}].map((x,i)=>
            <div key={i} className="ev-trust__card"><div className="ev-trust__ci">{x.ic}</div><div><h4 className="ev-trust__ct">{x.t}</h4><p className="ev-trust__cd">{x.d}</p></div></div>
          )}
        </Stagger>
      </div>
    </section>
  );
}

/* ═══ STATEMENT ═══ */
function Statement() {
  const p = useParallax(0.02);
  return (
    <section className="ev-stmt">
      <div className="ev-stmt__bg" ref={p}><LogoMark size={420} color="rgba(255,255,255,0.025)"/></div>
      <div className="ev-stmt__body">
        <Reveal><h2 className="ev-stmt__h">The future belongs to<br/>organizations that can adapt,<br/>innovate, and act <em>intelligently.</em></h2></Reveal>
        <Reveal delay={180}><a href="#contact" className="ev-btn ev-btn--w ev-btn--lg" onClick={e=>{e.preventDefault();document.getElementById("contact")?.scrollIntoView({behavior:"smooth"})}}>Start a Conversation <ArrowRight size={18}/></a></Reveal>
      </div>
    </section>
  );
}

/* ═══ CONTACT ═══ */
function Contact() {
  const [f, setF] = useState({name:"",company:"",email:"",phone:"",language:"English",industry:"",interests:[],challenge:""});
  const [sent, setSent] = useState(false);
  const tog = (v) => setF(p=>({...p,interests:p.interests.includes(v)?p.interests.filter(x=>x!==v):[...p.interests,v]}));
  return (
    <section id="contact" className="ev-contact-sec">
      <div className="ev-contact__wrap">
        <div className="ev-contact__l">
          <Reveal><div className="ev-label ev-label--l">07 <span>Contact</span></div></Reveal>
          <Reveal delay={80}><h2 className="ev-contact__h">Let's Discuss<br/>Your <em>Project</em></h2></Reveal>
          <Reveal delay={160}><p className="ev-contact__p">Whether you have a clear project in mind or are simply exploring possibilities, we'd be happy to learn more about your organization and discuss how intelligent systems can support your goals.</p></Reveal>
          <Stagger className="ev-contact__info" delay={100}>
            <div><div className="ev-contact__bl">Email</div><a href="mailto:contact@evrielsystems.com" className="ev-contact__bv">contact@evrielsystems.com</a></div>
            <div><div className="ev-contact__bl">Website</div><a href="https://evrielsystems.com" className="ev-contact__bv" target="_blank" rel="noopener noreferrer">evrielsystems.com</a></div>
          </Stagger>
        </div>
        <div className="ev-contact__r">
          {sent ? (
            <Reveal><div className="ev-sent"><CheckCircle2 size={44}/><h3>Message Received</h3><p>Thank you. We'll respond within 24 hours.</p><button className="ev-btn ev-btn--w" style={{marginTop:20}} onClick={()=>setSent(false)}>Send Another</button></div></Reveal>
          ) : (
            <Reveal direction="right">
              <form className="ev-form" onSubmit={e=>{e.preventDefault();setSent(true)}}>
                <div className="ev-form__r"><div className="ev-f"><label>Name</label><input placeholder="Your full name" value={f.name} onChange={e=>setF(p=>({...p,name:e.target.value}))}/></div><div className="ev-f"><label>Company</label><input placeholder="Organization" value={f.company} onChange={e=>setF(p=>({...p,company:e.target.value}))}/></div></div>
                <div className="ev-form__r"><div className="ev-f"><label>Email</label><input type="email" placeholder="your@email.com" value={f.email} onChange={e=>setF(p=>({...p,email:e.target.value}))}/></div><div className="ev-f"><label>Phone <span className="opt">(Optional)</span></label><input placeholder="+1 000 000 0000" value={f.phone} onChange={e=>setF(p=>({...p,phone:e.target.value}))}/></div></div>
                <div className="ev-f"><label>Preferred Language</label><div className="ev-radios">{["English","Italian","Spanish","Greek","Polish","French","German","Other"].map(l=><label key={l} className={`ev-rad${f.language===l?" ev-rad--on":""}`}><input type="radio" name="lang" checked={f.language===l} onChange={()=>setF(p=>({...p,language:l}))} style={{display:"none"}}/>{l}</label>)}</div></div>
                <div className="ev-f"><label>Industry</label><select className="ev-sel" value={f.industry} onChange={e=>setF(p=>({...p,industry:e.target.value}))}><option value="">Select your industry</option>{["Construction & Engineering","Manufacturing","Tourism & Hospitality","Retail & Commerce","Import & Export","Marketing & SEO","European Projects","NGO & Associations","Professional Services","Startup / SME","Education & Training","Other"].map(x=><option key={x}>{x}</option>)}</select></div>
                <div className="ev-f"><label>What are you interested in?</label><div className="ev-checks">{["AI Automation","Business Intelligence","Digital Transformation","Custom Business Systems","European Project Solutions","Not Sure Yet"].map(x=><label key={x} className={`ev-chk${f.interests.includes(x)?" ev-chk--on":""}`} onClick={()=>tog(x)}><span className="ev-chk__b">{f.interests.includes(x)&&<CheckCircle2 size={12}/>}</span>{x}</label>)}</div></div>
                <div className="ev-f"><label>Tell us about your challenge</label><textarea rows={5} placeholder="Describe your project, challenge, or business objective..." value={f.challenge} onChange={e=>setF(p=>({...p,challenge:e.target.value}))}/></div>
                <button type="submit" className="ev-btn ev-btn--w ev-btn--lg" style={{width:"100%",justifyContent:"center",marginTop:4}}>Start the Conversation <ArrowRight size={17}/></button>
              </form>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}

/* ═══ FOOTER ═══ */
function Footer({setPage}) {
  return (
    <footer className="ev-footer">
      <div className="ev-footer__in">
        <div className="ev-footer__top">
          <div onClick={()=>{setPage("home");window.scrollTo({top:0,behavior:"smooth"})}} style={{cursor:"pointer",display:"flex",alignItems:"center",gap:12}}>
            <LogoMark size={26} color="#fff"/>
            <div><div style={{width:20,height:1,background:"rgba(255,255,255,0.3)",marginBottom:3}}/><div style={{fontFamily:"var(--sf)",fontSize:14,color:"#fff",letterSpacing:"0.05em"}}>Evriel</div><div style={{fontFamily:"var(--bd)",fontSize:7,color:"rgba(255,255,255,0.3)",letterSpacing:"0.4em",textTransform:"uppercase",marginTop:2}}>Systems</div></div>
          </div>
          <p style={{fontSize:12,color:"rgba(255,255,255,0.2)",fontStyle:"italic",fontFamily:"var(--sf)"}}>Connecting Intelligence with Business</p>
        </div>
        <div className="ev-footer__line"/>
        <div className="ev-footer__bot"><span>&copy; {new Date().getFullYear()} Evriel Systems</span><span>contact@evrielsystems.com</span></div>
      </div>
    </footer>
  );
}

/* ═══ ARTICLES ═══ */
const ARTS = [
  { slug:"ai-beyond-chatbots",tag:"AI Strategy",date:"Nov 2024",title:"AI Beyond Chatbots: Practical Applications for Real Businesses",excerpt:"AI creates value far beyond conversational interfaces — in operations, analytics, and decision-making.",body:["Artificial Intelligence is often associated with chatbots and virtual assistants. While these tools are valuable, they represent only a small part of what AI can achieve within modern organizations.","Today, businesses are using AI to automate workflows, improve operational efficiency, support decision-making, and create better customer experiences.","One of the most impactful applications of AI is workflow automation. Organizations spend countless hours performing repetitive administrative tasks such as data entry, reporting, document processing, and communication management. Intelligent systems can automate many of these processes, allowing employees to focus on higher-value activities.","AI also plays an increasingly important role in decision support. By analyzing large volumes of business information, intelligent systems can identify patterns, detect inefficiencies, and provide recommendations that help organizations make better decisions.","Customer service is another area where AI creates significant value. Beyond simple chatbots, AI can assist support teams by organizing information, suggesting responses, and providing instant access to organizational knowledge.","The most successful organizations do not adopt AI simply because it is popular. They identify specific business challenges and implement intelligent solutions that generate measurable results.","The future of AI in business is not about replacing people. It is about empowering people with better tools, better information, and better systems.","Organizations that embrace this approach will be better positioned to improve efficiency, increase competitiveness, and adapt to a rapidly changing business environment."]},
  { slug:"automation-failures",tag:"Transformation",date:"Oct 2024",title:"Why Most Automation Projects Fail",excerpt:"The gap between automation promise and results is wider than most organizations expect.",body:["Automation is one of the most powerful tools available to modern organizations. However, many automation initiatives fail to deliver the expected benefits.","The primary reason is simple: organizations often attempt to automate inefficient processes. Automation cannot fix a broken workflow. It can only accelerate it.","Before introducing technology, organizations must first understand how work is performed, identify bottlenecks, and redesign inefficient processes. Without this foundation, automation often creates additional complexity instead of solving existing problems.","Another common mistake is focusing on software rather than business objectives. Organizations sometimes purchase new tools without clearly defining the problem they are trying to solve.","Successful automation projects begin with questions such as: What process needs improvement? What outcomes are we trying to achieve? How will success be measured?","Employee adoption is equally important. Even the most advanced automation platform will struggle if users do not understand its purpose or if it disrupts established workflows.","The most successful automation initiatives are not technology projects. They are business improvement projects supported by technology.","When implemented correctly, automation can reduce administrative workloads, improve consistency, increase operational visibility, and enable organizations to scale more effectively.","The goal is not simply to automate tasks. The goal is to build smarter and more efficient systems."]},
  { slug:"ai-construction-engineering",tag:"Industry",date:"Sep 2024",title:"AI in Construction and Engineering",excerpt:"Intelligent systems transforming project visibility, communication, and operational control.",body:["Construction and engineering projects generate enormous amounts of information. Drawings, reports, site updates, documentation, schedules, budgets, and communication records are often distributed across multiple systems and stakeholders.","Managing this information efficiently has become one of the industry's greatest challenges.","AI and intelligent systems are creating new opportunities to improve project visibility, communication, and operational control.","AI can support engineering teams by organizing project documentation, monitoring progress, generating reports, and helping identify potential issues before they impact schedules or budgets.","Project managers can benefit from real-time access to information that would otherwise require hours of manual review.","Digital monitoring systems can improve coordination between office teams, engineers, contractors, and site personnel.","Intelligent systems can also support technical knowledge management by ensuring that important information remains accessible throughout the project lifecycle.","The future of construction technology is not simply about digitizing documents. It is about creating connected environments where information flows efficiently between people, processes, and systems.","Organizations that adopt intelligent technologies today will be better positioned to improve productivity, reduce risk, and deliver projects more effectively."]},
  { slug:"digital-transformation-people",tag:"Strategy",date:"Aug 2024",title:"Digital Transformation Is About People, Not Software",excerpt:"Why the most expensive transformation failures share the same root cause.",body:["When organizations begin digital transformation initiatives, many focus immediately on technology. New software is purchased. New platforms are implemented. New tools are introduced.","Yet despite significant investments, many transformation projects fail to achieve their intended outcomes.","The reason is simple: digital transformation is not primarily a technology challenge. It is a people and process challenge.","Technology can enable change, but it cannot create it on its own.","Successful organizations first understand how people work, how decisions are made, and how information moves throughout the business. Only then can technology be implemented effectively.","Employees need systems that support their work rather than create additional complexity. Managers need visibility into operations. Leadership teams need reliable information to guide strategic decisions.","When technology aligns with business processes and organizational objectives, transformation becomes sustainable.","The most successful organizations do not simply digitize existing activities. They redesign how work is performed and use technology to create better outcomes.","Digital transformation is ultimately about creating environments where people, processes, and technology work together effectively.","Organizations that understand this principle achieve greater efficiency, adaptability, and long-term growth."]},
  { slug:"intelligent-systems-advantage",tag:"Competitive Edge",date:"Jul 2024",title:"Building Competitive Advantage Through Intelligent Systems",excerpt:"How forward-thinking organizations use AI to create sustainable competitive moats.",body:["Every organization is searching for ways to become more efficient, more responsive, and more competitive.","Traditionally, competitive advantage was often created through scale, location, or access to resources.","Today, intelligent systems are becoming one of the most important sources of competitive advantage.","Organizations generate vast amounts of information every day. Customer interactions, operational data, project updates, financial records, and market insights all contain valuable opportunities for improvement.","The challenge is not collecting information. The challenge is transforming information into action.","Intelligent systems help organizations automate repetitive tasks, identify patterns, support decision-making, and improve operational visibility.","By reducing manual work and improving access to information, organizations can respond more quickly to opportunities and challenges.","The goal is not to replace human expertise. The goal is to enhance it.","Organizations that successfully combine human knowledge with intelligent systems are better positioned to adapt, innovate, and grow.","Competitive advantage is no longer created solely through resources. It is increasingly created through intelligence, adaptability, and the ability to make better decisions faster."]},
  { slug:"data-driven-decisions",tag:"Intelligence",date:"Jun 2024",title:"Turning Data Into Better Decisions",excerpt:"Organizations drown in data but struggle with decisions. Here's how intelligent systems close the gap.",body:["Modern organizations generate more information than ever before. Operational reports, customer interactions, project updates, financial records, performance metrics all contribute to growing volumes of data.","Yet many organizations continue to struggle with decision-making.","The problem is not a lack of information. The problem is transforming information into meaningful insights.","Without structure and context, data becomes overwhelming rather than useful.","Business intelligence and intelligent systems help organizations organize information, identify patterns, and present insights in ways that support effective decision-making.","When leaders have access to accurate and relevant information, they can identify opportunities more quickly, address problems earlier, and allocate resources more effectively.","Data-driven organizations are often more agile because decisions are supported by evidence rather than assumptions.","However, successful data utilization requires more than dashboards and reports. Organizations must establish processes that ensure information is accessible, reliable, and aligned with business objectives.","The future belongs to organizations that can transform information into intelligence and intelligence into action.","Better decisions create better outcomes. Intelligent systems make those decisions easier to achieve."]},
];

function InsightsHome({setPage,setSlug}) {
  return (
    <>
      <section className="ev-ins-hero"><Reveal><div className="ev-label ev-label--l">Research <span>Insights</span></div></Reveal><Reveal delay={100}><h1 className="ev-ins-hero__h">Thinking <em>Forward</em></h1></Reveal></section>
      <section className="ev-ins-grid"><div className="ev-ins-grid__in">{ARTS.map((a,i)=>(<Reveal key={i} delay={i*70}><article className="ev-art-card" onClick={()=>{setSlug(a.slug);setPage("article");window.scrollTo({top:0,behavior:"smooth"})}}><div className="ev-art-card__meta"><span className="ev-art-card__tag">{a.tag}</span><span className="ev-art-card__date">{a.date}</span></div><h2 className="ev-art-card__t">{a.title}</h2><p className="ev-art-card__ex">{a.excerpt}</p><div className="ev-art-card__rd">Read Article <ArrowRight size={13}/></div></article></Reveal>))}</div></section>
    </>
  );
}

function ArticlePage({slug,setPage,setSlug}) {
  const art = ARTS.find(a=>a.slug===slug);
  if (!art) return null;
  const others = ARTS.filter(a=>a.slug!==slug).slice(0,3);
  return (
    <>
      <section className="ev-art-hero"><Reveal><span className="ev-art-hero__tag">{art.tag}</span></Reveal><Reveal delay={100}><h1 className="ev-art-hero__h">{art.title}</h1></Reveal><Reveal delay={160}><span className="ev-art-hero__date">{art.date}</span></Reveal></section>
      <section className="ev-art-body"><div className="ev-art-body__in"><div className="ev-art-body__content">{art.body.map((p,i)=><Reveal key={i} delay={i*30}><p className="ev-art-body__p">{p}</p></Reveal>)}<Reveal delay={200}><div className="ev-art-body__cta"><p>Ready to implement intelligent systems?</p><a href="javascript:void(0)" className="ev-btn ev-btn--dk" onClick={()=>{setPage("home");setTimeout(()=>document.getElementById("contact")?.scrollIntoView({behavior:"smooth"}),300)}}>Let's Discuss Your Project <ArrowRight size={15}/></a></div></Reveal></div><div className="ev-art-body__side"><h4 className="ev-art-side__h">More Articles</h4>{others.map((a,i)=><Reveal key={i} delay={i*70}><div className="ev-art-side__item" onClick={()=>{setSlug(a.slug);window.scrollTo({top:0,behavior:"smooth"})}}><span className="ev-art-side__tag">{a.tag}</span><p className="ev-art-side__t">{a.title}</p></div></Reveal>)}</div></div></section>
    </>
  );
}

/* ═══ APP ═══ */
export default function EvrielSystems() {
  const [page, setPage] = useState("home");
  const [slug, setSlug] = useState(null);
  return (
    <>
      <style>{`
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@300;400;500;600&display=swap');
:root{--bk:#0A0A0A;--wh:#FFFFFF;--pt:#D9D9D9;--dk:#111111;--mg:#0E0E0E;--sf:'DM Serif Display',Georgia,serif;--bd:'Inter',-apple-system,sans-serif}
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth}
body{font-family:var(--bd);background:var(--bk);color:var(--bk);-webkit-font-smoothing:antialiased}
button,input,textarea,select{font-family:inherit;background:none;border:none;cursor:pointer}
a{text-decoration:none;color:inherit}
em{font-family:var(--sf);font-style:italic}
.dbr{display:block}
@keyframes logospin{from{transform:translate(-50%,-50%) rotate(0deg)}to{transform:translate(-50%,-50%) rotate(360deg)}}
@keyframes cpulse{0%,100%{opacity:1}50%{opacity:0.4}}
@keyframes ringP{0%,100%{transform:scale(1);opacity:0.5}50%{transform:scale(1.06);opacity:0.15}}
@keyframes mq{from{transform:translateX(0)}to{transform:translateX(-25%)}}
@keyframes scBob{0%,100%{transform:translateY(0);opacity:1}50%{transform:translateY(10px);opacity:0.3}}

/* NAV */
.ev-nav{position:fixed;top:0;left:0;right:0;z-index:999;padding:18px 0;transition:all 0.5s ${EASE}}
.ev-nav--s{background:rgba(255,255,255,0.96);backdrop-filter:blur(24px);padding:10px 0;box-shadow:0 1px 0 rgba(0,0,0,0.06)}
.ev-nav__in{max-width:1440px;margin:0 auto;padding:0 48px;display:flex;align-items:center;justify-content:space-between}
.ev-nav__links{display:flex;align-items:center;gap:30px}
.ev-nav__link{font-size:12px;font-weight:400;letter-spacing:0.07em;text-transform:uppercase;transition:opacity 0.3s}.ev-nav__link:hover{opacity:0.5}
.ev-nav__cta{font-size:11px;font-weight:500;letter-spacing:0.09em;text-transform:uppercase;padding:10px 22px;transition:all 0.3s}.ev-nav__cta:hover{opacity:0.8}
.ev-nav__burger{display:none}
.ev-mobile-menu{position:fixed;inset:0;background:var(--bk);z-index:998;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;padding-top:60px}
.ev-mob-link{font-family:var(--sf);font-size:32px;color:#fff;transition:opacity 0.3s}.ev-mob-link:hover{opacity:0.5}

/* HERO */
.ev-hero{position:relative;height:100vh;min-height:680px;display:flex;align-items:center;justify-content:center;background:var(--bk);overflow:hidden}
.ev-hero__bg{position:absolute;inset:0;pointer-events:none}
.ev-hero__grid{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px);background-size:80px 80px}
.ev-hero__rad{position:absolute;inset:0;background:radial-gradient(ellipse 70% 55% at 50% 50%,rgba(255,255,255,0.035),transparent)}
.ev-hero__ghost{position:absolute;top:50%;left:50%;animation:logospin 90s linear infinite}
.ev-hero__body{position:relative;z-index:2;text-align:center;padding:0 24px;max-width:1100px}
.ev-hero__eyebrow{font-size:11px;letter-spacing:0.28em;text-transform:uppercase;color:rgba(255,255,255,0.35);margin-bottom:36px}
.ev-hero__brand{display:flex;align-items:center;gap:24px;justify-content:center;margin-bottom:28px}
.ev-hero__brand-text{text-align:left}
.ev-hero__brand-line{width:48px;height:2px;background:rgba(255,255,255,0.5);margin-bottom:8px}
.ev-hero__brand-name{font-family:var(--sf);font-size:clamp(52px,8vw,100px);font-weight:400;color:#fff;letter-spacing:0.03em;line-height:0.9}
.ev-hero__brand-sub{font-family:var(--bd);font-size:clamp(12px,1.8vw,20px);font-weight:300;letter-spacing:0.55em;color:var(--pt);display:block;margin-top:6px}
.ev-hero__h2{font-family:var(--sf);font-size:clamp(20px,2.6vw,34px);font-weight:400;color:rgba(255,255,255,0.7);line-height:1.35;letter-spacing:0.01em}
.ev-hero__h2 em{color:var(--pt)}
.ev-hero__sub{font-size:clamp(14px,1.4vw,17px);font-weight:300;color:rgba(255,255,255,0.32);margin-top:24px;line-height:1.7}
.ev-hero__ctas{display:flex;gap:14px;justify-content:center;margin-top:40px;flex-wrap:wrap}
.ev-hero__scroll{position:absolute;bottom:32px;left:50%;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:10px;color:rgba(255,255,255,0.25);font-size:10px;letter-spacing:0.22em;text-transform:uppercase}
.ev-scr-pill{width:20px;height:30px;border:1px solid rgba(255,255,255,0.15);border-radius:10px;display:flex;justify-content:center;padding-top:6px}
.ev-scr-dot{width:3px;height:7px;background:rgba(255,255,255,0.4);border-radius:2px;animation:scBob 2s ease-in-out infinite}

/* BUTTONS */
.ev-btn{display:inline-flex;align-items:center;gap:10px;font-size:12px;font-weight:500;letter-spacing:0.09em;text-transform:uppercase;padding:15px 30px;transition:all 0.4s ${EASE};border:1px solid transparent;cursor:pointer}
.ev-btn--w{background:#fff;color:var(--bk)}.ev-btn--w:hover{background:var(--pt);transform:translateY(-2px)}
.ev-btn--gh{border-color:rgba(255,255,255,0.18);color:#fff}.ev-btn--gh:hover{border-color:rgba(255,255,255,0.5)}
.ev-btn--dk{background:var(--bk);color:#fff}.ev-btn--dk:hover{background:#1a1a1a;transform:translateY(-2px)}
.ev-btn--lg{padding:18px 42px;font-size:13px}

/* LABELS */
.ev-label{font-size:12px;font-weight:400;letter-spacing:0.18em;text-transform:uppercase;color:rgba(0,0,0,0.3);margin-bottom:20px;display:flex;gap:10px}
.ev-label span{opacity:0.7}
.ev-label--l,.ev-label--l span{color:rgba(255,255,255,0.25)}

/* MARQUEE — faster */
.ev-mq{background:var(--mg);padding:13px 0;overflow:hidden;border-top:1px solid rgba(255,255,255,0.04);border-bottom:1px solid rgba(255,255,255,0.04)}
.ev-mq__track{display:flex;gap:48px;white-space:nowrap;animation:mq 16s linear infinite}
.ev-mq__i{display:inline-flex;align-items:center;gap:12px;font-size:11px;font-weight:500;letter-spacing:0.14em;text-transform:uppercase;color:rgba(255,255,255,0.35)}
.ev-mq__dot{width:4px;height:4px;border-radius:50%;background:rgba(255,255,255,0.25)}

/* ═══ FLOWING SECTION BACKGROUNDS ═══ */
/* About: dark top fading to deep charcoal */
.ev-about{background:var(--bk);position:relative;overflow:hidden}
.ev-about::after{content:'';position:absolute;bottom:0;left:0;right:0;height:200px;background:linear-gradient(to bottom,transparent,var(--dk));pointer-events:none}
.ev-about__wrap{max-width:1440px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;min-height:90vh;align-items:center}
.ev-about__left{padding:120px 60px 100px 48px}
.ev-about__h{font-family:var(--sf);font-size:clamp(42px,4.8vw,72px);font-weight:400;line-height:1.08;color:#fff;margin-bottom:28px}
.ev-about__lead{font-size:17px;color:rgba(255,255,255,0.5);margin-bottom:6px;line-height:1.5}
.ev-about__quote{font-family:var(--sf);font-size:24px;font-style:italic;color:var(--pt);margin-bottom:24px;line-height:1.35}
.ev-about__p{font-size:15px;line-height:1.78;color:rgba(255,255,255,0.4);margin-bottom:14px;max-width:500px}
.ev-about__p strong{color:rgba(255,255,255,0.8);font-weight:600}
.ev-about__stats{display:grid;grid-template-columns:repeat(2,1fr);gap:14px;margin-top:36px;padding-top:28px;border-top:1px solid rgba(255,255,255,0.06)}
.ev-afeat{padding:20px;border:1px solid rgba(255,255,255,0.05);transition:all 0.4s ${EASE}}
.ev-afeat:hover{border-color:rgba(255,255,255,0.14);background:rgba(255,255,255,0.02);transform:translateY(-3px)}
.ev-afeat__n{display:block;font-family:var(--sf);font-size:19px;color:var(--pt);line-height:1.25;margin-bottom:8px}
.ev-afeat__d{font-size:12px;line-height:1.6;color:rgba(255,255,255,0.35)}
.ev-about__right{padding:120px 48px 100px 48px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:40px;position:relative}
.ev-about__right::before{content:'';position:absolute;inset:0;background:radial-gradient(circle at center,rgba(255,255,255,0.03),transparent 70%);pointer-events:none}
.ev-about__logo-area{position:relative;width:300px;height:300px;display:flex;align-items:center;justify-content:center}
.ev-about__ring{position:absolute;border-radius:50%;border:1px solid rgba(255,255,255,0.06)}
.ev-about__ring--1{width:240px;height:240px;animation:ringP 3.5s ease-in-out infinite}
.ev-about__ring--2{width:290px;height:290px;animation:ringP 3.5s ease-in-out infinite 0.6s}
.ev-about__ring--3{width:300px;height:300px;border-style:dashed;border-color:rgba(255,255,255,0.03);animation:ringP 3.5s ease-in-out infinite 1.2s}
.ev-challenges{width:100%;display:flex;flex-direction:column;gap:8px}
.ev-ch{display:flex;align-items:center;gap:12px;padding:11px 16px;border:1px solid rgba(255,255,255,0.05);color:rgba(255,255,255,0.55);font-size:13px;transition:all 0.35s ${EASE}}
.ev-ch:hover{border-color:rgba(255,255,255,0.15);background:rgba(255,255,255,0.03);color:#fff}
.ev-ch svg{color:var(--pt);flex-shrink:0}

/* Industries: flowing from dark */
.ev-ind-sec{background:linear-gradient(to bottom,var(--dk),var(--bk));padding:120px 0 140px;position:relative}
.ev-ind-sec::before{content:'';position:absolute;top:0;left:0;right:0;height:120px;background:linear-gradient(to bottom,var(--dk),transparent);pointer-events:none;z-index:1}
.ev-ind__wrap{max-width:1440px;margin:0 auto;padding:0 48px;position:relative;z-index:2}
.ev-ind__h{font-family:var(--sf);font-size:clamp(40px,4.5vw,68px);font-weight:400;color:#fff;line-height:1.08;margin-bottom:56px}
.ev-ind__h em{color:var(--pt)}
.ev-ind-list{display:flex;flex-direction:column}
.ev-ind{display:grid;grid-template-columns:60px 1fr 2fr 40px;gap:32px;align-items:center;padding:34px 8px;border-top:1px solid rgba(255,255,255,0.06);transition:all 0.45s ${EASE};position:relative;cursor:default}
.ev-ind:last-child{border-bottom:1px solid rgba(255,255,255,0.06)}
.ev-ind--on,.ev-ind:hover{padding-left:24px;background:rgba(255,255,255,0.025)}
.ev-ind__ix{font-family:var(--sf);font-size:15px;color:rgba(255,255,255,0.18);letter-spacing:0.05em}
.ev-ind__nm{font-family:var(--sf);font-size:clamp(22px,2.6vw,32px);font-weight:400;color:#fff;line-height:1.2;transition:color 0.4s ${EASE}}
.ev-ind--on .ev-ind__nm,.ev-ind:hover .ev-ind__nm{color:var(--pt)}
.ev-ind__ds{font-size:13px;line-height:1.7;color:rgba(255,255,255,0.32);max-width:480px}
.ev-ind__ar{color:rgba(255,255,255,0.15);justify-self:end;transition:all 0.4s ${EASE};opacity:0;transform:translate(-8px,8px)}
.ev-ind--on .ev-ind__ar,.ev-ind:hover .ev-ind__ar{opacity:1;transform:translate(0,0);color:var(--pt)}

/* Outcomes */
.ev-out-sec{background:linear-gradient(to bottom,var(--bk),var(--dk));padding:120px 0;position:relative;overflow:hidden}
.ev-out__glow{position:absolute;top:10%;right:-10%;width:500px;height:500px;border-radius:50%;background:radial-gradient(circle,rgba(217,217,217,0.04),transparent 65%);pointer-events:none}
.ev-out__wrap{max-width:1100px;margin:0 auto;padding:0 48px;position:relative;z-index:2}
.ev-out__grid{display:flex;flex-direction:column;margin-top:36px}
.ev-out{display:grid;grid-template-columns:60px 1fr 1.4fr;gap:32px;align-items:center;padding:30px 8px;border-top:1px solid rgba(255,255,255,0.06);position:relative;transition:padding-left 0.4s ${EASE}}
.ev-out:last-child{border-bottom:1px solid rgba(255,255,255,0.06)}
.ev-out:hover{padding-left:18px}
.ev-out__ix{font-family:var(--sf);font-size:14px;color:rgba(255,255,255,0.18)}
.ev-out__t{font-family:var(--sf);font-size:clamp(20px,2.4vw,28px);font-weight:400;color:#fff}
.ev-out__d{font-size:13px;line-height:1.7;color:rgba(255,255,255,0.34)}
.ev-out__ln{position:absolute;left:0;bottom:-1px;width:0;height:1px;background:var(--pt);transition:width 0.6s ${EASE}}
.ev-out:hover .ev-out__ln{width:100%}

/* Services: subtle dark background flowing into next */
.ev-svc-sec{background:linear-gradient(to bottom,var(--bk),#131313,var(--bk));padding:140px 0;position:relative}
.ev-svc__wrap{max-width:1440px;margin:0 auto;padding:0 48px}
.ev-svc__h{font-family:var(--sf);font-size:clamp(40px,4.5vw,68px);font-weight:400;color:#fff;line-height:1.08;margin-bottom:18px}
.ev-svc__h em{color:var(--pt)}
.ev-svc__intro{font-family:var(--sf);font-size:18px;font-style:italic;color:var(--pt);margin-bottom:40px;max-width:560px;line-height:1.5}
.ev-svc{display:grid;grid-template-columns:90px 1fr 1fr;gap:36px;padding:40px 0;border-top:1px solid rgba(255,255,255,0.06);position:relative;transition:padding-left 0.4s ${EASE};align-items:start}
.ev-svc:last-child{border-bottom:1px solid rgba(255,255,255,0.06)}
.ev-svc:hover{padding-left:14px}
.ev-svc__bar{position:absolute;left:0;top:0;width:2px;height:0;background:var(--pt);transition:height 0.6s ${EASE}}
.ev-svc:hover .ev-svc__bar{height:100%}
.ev-svc__l{display:flex;flex-direction:column;gap:12px;padding-top:4px}
.ev-svc__gn{font-family:var(--sf);font-size:44px;color:rgba(255,255,255,0.04);line-height:1}
.ev-svc__l svg{color:var(--pt)}
.ev-svc__t{font-family:var(--sf);font-size:26px;font-weight:400;color:#fff;margin-bottom:10px}
.ev-svc__d{font-size:14px;line-height:1.72;color:rgba(255,255,255,0.4)}
.ev-svc__al{font-size:10px;font-weight:500;letter-spacing:0.16em;text-transform:uppercase;color:rgba(255,255,255,0.2);margin-bottom:12px}
.ev-svc__r ul{list-style:none;display:flex;flex-direction:column;gap:7px}
.ev-svc__r li{font-size:13px;color:rgba(255,255,255,0.4);padding-left:14px;position:relative}
.ev-svc__r li::before{content:'';position:absolute;left:0;top:7px;width:4px;height:4px;border-radius:50%;background:rgba(255,255,255,0.12)}

/* Projects: dark flowing */
.ev-proj-sec{background:linear-gradient(to bottom,var(--bk),var(--dk),var(--mg));padding:140px 0}
.ev-proj__wrap{max-width:1200px;margin:0 auto;padding:0 48px}
.ev-proj__h{font-family:var(--sf);font-size:clamp(40px,4.5vw,68px);font-weight:400;color:#fff;line-height:1.08;margin-bottom:56px}
.ev-proj__h em{color:var(--pt)}
.ev-prj{border-top:1px solid rgba(255,255,255,0.06);padding:24px 0;cursor:pointer;transition:all 0.3s}
.ev-prj:last-child{border-bottom:1px solid rgba(255,255,255,0.06)}
.ev-prj:hover{padding-left:14px}
.ev-prj__hd{display:flex;justify-content:space-between;align-items:center}
.ev-prj__hl{display:flex;align-items:center;gap:18px}
.ev-prj__ix{font-family:var(--sf);font-size:15px;color:rgba(255,255,255,0.15)}
.ev-prj__t{font-family:var(--sf);font-size:clamp(18px,2vw,24px);font-weight:400;color:#fff}
.ev-prj__tog{color:rgba(255,255,255,0.3)}
.ev-prj__bd{padding:16px 0 4px 46px}
.ev-prj__bd>p:first-child{font-size:14px;line-height:1.72;color:rgba(255,255,255,0.38);margin-bottom:14px;max-width:560px}
.ev-prj__caps{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px}
.ev-prj__cap{font-size:10px;letter-spacing:0.06em;text-transform:uppercase;padding:5px 12px;border:1px solid rgba(255,255,255,0.08);color:rgba(255,255,255,0.4);transition:all 0.3s}
.ev-prj__cap:hover{border-color:var(--pt);color:var(--pt)}
.ev-prj__tl{font-family:var(--sf);font-size:14px;font-style:italic;color:rgba(217,217,217,0.5)}

/* Process: subtle light on dark */
.ev-proc-sec{background:linear-gradient(to bottom,var(--mg),var(--dk),var(--bk));padding:140px 0}
.ev-proc__wrap{max-width:1440px;margin:0 auto;padding:0 48px}
.ev-proc__h{font-family:var(--sf);font-size:clamp(40px,4.5vw,68px);font-weight:400;color:#fff;line-height:1.08;margin-bottom:18px}
.ev-proc__h em{color:var(--pt)}
.ev-proc__intro{font-size:15px;line-height:1.7;color:rgba(255,255,255,0.35);max-width:560px;margin-bottom:56px}
.ev-proc__grid{display:grid;grid-template-columns:repeat(5,1fr);gap:0;position:relative}
.ev-proc__grid::before{content:'';position:absolute;top:20px;left:0;right:0;height:1px;background:rgba(255,255,255,0.06)}
.ev-proc__card{padding:0 24px 36px;border-right:1px solid rgba(255,255,255,0.04);transition:background 0.4s}
.ev-proc__card:last-child{border-right:none}
.ev-proc__card:hover{background:rgba(255,255,255,0.015)}
.ev-proc__num{font-family:var(--sf);font-size:12px;color:rgba(255,255,255,0.15);margin-bottom:24px;padding-top:10px;letter-spacing:0.1em}
.ev-proc__dot{width:8px;height:8px;border-radius:50%;background:var(--pt);margin-bottom:20px;transition:transform 0.4s}
.ev-proc__card:hover .ev-proc__dot{transform:scale(1.5)}
.ev-proc__ct{font-family:var(--sf);font-size:20px;font-weight:400;color:#fff;margin-bottom:10px}
.ev-proc__cd{font-size:13px;line-height:1.65;color:rgba(255,255,255,0.35)}

/* Borders */
.ev-bdr-sec{background:linear-gradient(to bottom,var(--bk),var(--dk),var(--mg));padding:140px 0;position:relative;overflow:hidden}
.ev-bdr__orb{position:absolute;top:50%;right:-8%;transform:translateY(-50%)}
.ev-bdr__wrap{max-width:760px;margin:0 auto;padding:0 48px;position:relative;z-index:2;text-align:center}
.ev-bdr__h{font-family:var(--sf);font-size:clamp(36px,4.4vw,60px);font-weight:400;color:#fff;line-height:1.1;margin-bottom:28px}
.ev-bdr__h em{color:var(--pt)}
.ev-bdr__p{font-size:15px;line-height:1.8;color:rgba(255,255,255,0.4);margin-bottom:14px}
.ev-bdr__tag{display:inline-flex;align-items:center;gap:12px;margin-top:22px;padding:16px 26px;border:1px solid rgba(255,255,255,0.08);background:rgba(255,255,255,0.02);color:rgba(255,255,255,0.5);font-size:13px;line-height:1.6;text-align:left}
.ev-bdr__tag svg{color:var(--pt);flex-shrink:0}

/* Why */
.ev-why-sec{background:linear-gradient(to bottom,var(--mg),var(--bk));padding:140px 0}
.ev-why__wrap{max-width:1100px;margin:0 auto;padding:0 48px}
.ev-why__h{font-family:var(--sf);font-size:clamp(38px,4.4vw,62px);font-weight:400;color:#fff;line-height:1.1;margin-bottom:24px}
.ev-why__h em{color:var(--pt)}
.ev-why__lead{font-size:15px;line-height:1.8;color:rgba(255,255,255,0.4);max-width:680px;margin-bottom:10px}
.ev-why__lead--sub{color:rgba(255,255,255,0.3);font-style:italic;font-family:var(--sf);font-size:16px}
.ev-why__grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-top:48px}
.ev-why__card{padding:30px 26px;border:1px solid rgba(255,255,255,0.06);transition:all 0.4s ${EASE}}
.ev-why__card:hover{border-color:rgba(255,255,255,0.16);background:rgba(255,255,255,0.025);transform:translateY(-4px)}
.ev-why__card svg{color:var(--pt);margin-bottom:18px}
.ev-why__card h3{font-family:var(--sf);font-size:19px;color:#fff;margin-bottom:8px;font-weight:400}
.ev-why__card p{font-size:13px;line-height:1.6;color:rgba(255,255,255,0.32)}

/* Trust: flowing */
.ev-trust-sec{background:linear-gradient(to bottom,var(--bk),#0D0D0D);padding:140px 0}
.ev-trust__wrap{max-width:1440px;margin:0 auto;padding:0 48px;display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:start}
.ev-trust__h{font-family:var(--sf);font-size:clamp(38px,4.2vw,62px);font-weight:400;color:#fff;line-height:1.08;margin-bottom:24px}
.ev-trust__h em{color:var(--pt)}
.ev-trust__p{font-size:15px;line-height:1.75;color:rgba(255,255,255,0.35);margin-bottom:12px}
.ev-trust__note{display:flex;gap:14px;align-items:flex-start;margin-top:24px;padding:18px 20px;border:1px solid rgba(255,255,255,0.07);background:rgba(255,255,255,0.02)}
.ev-trust__note svg{color:var(--pt);flex-shrink:0;margin-top:2px}
.ev-trust__note p{font-size:13px;line-height:1.7;color:rgba(255,255,255,0.4)}
.ev-trust__note p strong{color:#fff;font-weight:600}
.ev-trust__r{display:flex;flex-direction:column;gap:14px}
.ev-trust__card{display:flex;gap:14px;padding:20px 18px;border:1px solid rgba(255,255,255,0.05);transition:all 0.4s ${EASE}}
.ev-trust__card:hover{border-color:rgba(255,255,255,0.12);background:rgba(255,255,255,0.02)}
.ev-trust__ci{color:var(--pt);flex-shrink:0;margin-top:2px}
.ev-trust__ct{font-family:var(--sf);font-size:16px;color:#fff;margin-bottom:3px}
.ev-trust__cd{font-size:12px;color:rgba(255,255,255,0.3);line-height:1.55}

/* Statement */
.ev-stmt{position:relative;background:var(--bk);padding:150px 48px;display:flex;align-items:center;justify-content:center;min-height:60vh;overflow:hidden}
.ev-stmt__bg{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)}
.ev-stmt__body{position:relative;z-index:2;text-align:center}
.ev-stmt__h{font-family:var(--sf);font-size:clamp(30px,4.2vw,60px);font-weight:400;color:#fff;line-height:1.2;margin-bottom:40px}
.ev-stmt__h em{color:var(--pt)}

/* Contact: dark with subtle lighter form area */
.ev-contact-sec{background:linear-gradient(to bottom,var(--bk),#0C0C0C);padding:140px 0}
.ev-contact__wrap{max-width:1440px;margin:0 auto;padding:0 48px;display:grid;grid-template-columns:5fr 7fr;gap:80px;align-items:start}
.ev-contact__h{font-family:var(--sf);font-size:clamp(36px,4vw,60px);font-weight:400;color:#fff;line-height:1.1;margin-bottom:16px}
.ev-contact__h em{color:var(--pt)}
.ev-contact__sub{font-size:16px;color:rgba(255,255,255,0.5);margin-bottom:6px;font-family:var(--sf);font-style:italic}
.ev-contact__p{font-size:14px;line-height:1.72;color:rgba(255,255,255,0.35);margin-bottom:36px;max-width:380px}
.ev-contact__info{display:flex;flex-direction:column;gap:20px}
.ev-contact__bl{font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(255,255,255,0.2);margin-bottom:4px}
.ev-contact__bv{font-family:var(--sf);font-size:17px;color:rgba(255,255,255,0.7);transition:opacity 0.3s}.ev-contact__bv:hover{opacity:0.5}
.ev-form{display:flex;flex-direction:column;gap:22px;padding:36px;border:1px solid rgba(255,255,255,0.06);background:rgba(255,255,255,0.02)}
.ev-form__r{display:grid;grid-template-columns:1fr 1fr;gap:18px}
.ev-f{display:flex;flex-direction:column;gap:7px}
.ev-f label{font-size:10px;font-weight:500;letter-spacing:0.14em;text-transform:uppercase;color:rgba(255,255,255,0.35)}
.opt{font-weight:400;opacity:0.5;letter-spacing:0;text-transform:none}
.ev-f input{border:none;border-bottom:1px solid rgba(255,255,255,0.1);background:transparent;padding:10px 0;font-size:14px;color:#fff;outline:none;transition:border-color 0.3s}
.ev-f input:focus{border-bottom-color:var(--pt)}
.ev-f input::placeholder{color:rgba(255,255,255,0.2)}
.ev-sel{border:none;border-bottom:1px solid rgba(255,255,255,0.1);background:transparent;padding:10px 0;font-size:14px;color:rgba(255,255,255,0.6);outline:none;appearance:none}
.ev-sel option{background:var(--bk);color:#fff}
.ev-f textarea{border:1px solid rgba(255,255,255,0.08);background:rgba(255,255,255,0.02);padding:14px;font-size:14px;color:#fff;line-height:1.65;resize:vertical;outline:none;transition:border-color 0.3s}
.ev-f textarea:focus{border-color:rgba(255,255,255,0.2)}
.ev-f textarea::placeholder{color:rgba(255,255,255,0.18)}
.ev-radios{display:flex;flex-wrap:wrap;gap:7px}
.ev-rad{font-size:12px;padding:7px 14px;border:1px solid rgba(255,255,255,0.08);color:rgba(255,255,255,0.45);transition:all 0.3s;user-select:none}
.ev-rad--on{background:rgba(255,255,255,0.1);color:#fff;border-color:rgba(255,255,255,0.25)}
.ev-checks{display:grid;grid-template-columns:1fr 1fr;gap:7px}
.ev-chk{display:flex;align-items:center;gap:9px;font-size:12px;padding:8px 12px;border:1px solid rgba(255,255,255,0.06);color:rgba(255,255,255,0.45);cursor:pointer;transition:all 0.3s;user-select:none}
.ev-chk--on{background:rgba(255,255,255,0.05);border-color:rgba(255,255,255,0.18);color:#fff}
.ev-chk__b{width:16px;height:16px;border:1px solid rgba(255,255,255,0.15);border-radius:2px;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all 0.3s}
.ev-chk--on .ev-chk__b{background:var(--pt);border-color:var(--pt);color:var(--bk)}
.ev-sent{display:flex;flex-direction:column;align-items:center;text-align:center;padding:80px 40px;color:#fff}
.ev-sent h3{font-family:var(--sf);font-size:30px;margin:20px 0 10px}
.ev-sent p{font-size:14px;color:rgba(255,255,255,0.45);line-height:1.6;max-width:340px}
.ev-sent svg{color:var(--pt)}

/* Footer */
.ev-footer{background:var(--bk);padding:44px 0 28px;border-top:1px solid rgba(255,255,255,0.04)}
.ev-footer__in{max-width:1440px;margin:0 auto;padding:0 48px}
.ev-footer__top{display:flex;justify-content:space-between;align-items:center;margin-bottom:28px}
.ev-footer__line{height:1px;background:rgba(255,255,255,0.04);margin-bottom:20px}
.ev-footer__bot{display:flex;justify-content:space-between;font-size:11px;color:rgba(255,255,255,0.15)}

/* Insights */
.ev-ins-hero{background:var(--bk);padding:200px 48px 90px;text-align:center}
.ev-ins-hero__h{font-family:var(--sf);font-size:clamp(52px,7vw,110px);font-weight:400;color:#fff;line-height:1;margin-top:16px}.ev-ins-hero__h em{color:var(--pt)}
.ev-ins-grid{background:var(--dk);padding:80px 0 120px}
.ev-ins-grid__in{max-width:1440px;margin:0 auto;padding:0 48px;display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:rgba(255,255,255,0.04)}
.ev-art-card{background:var(--bk);padding:36px 32px;cursor:pointer;transition:all 0.45s ${EASE};position:relative;overflow:hidden}
.ev-art-card::after{content:'';position:absolute;bottom:0;left:0;width:0;height:2px;background:var(--pt);transition:width 0.5s ${EASE}}
.ev-art-card:hover{background:rgba(255,255,255,0.03);transform:translateY(-3px)}.ev-art-card:hover::after{width:100%}
.ev-art-card__meta{display:flex;align-items:center;gap:12px;margin-bottom:14px}
.ev-art-card__tag{font-size:10px;letter-spacing:0.1em;text-transform:uppercase;padding:4px 10px;border:1px solid rgba(255,255,255,0.1);color:rgba(255,255,255,0.4)}
.ev-art-card__date{font-size:11px;color:rgba(255,255,255,0.2)}
.ev-art-card__t{font-family:var(--sf);font-size:19px;font-weight:400;color:#fff;line-height:1.35;margin-bottom:10px}
.ev-art-card__ex{font-size:13px;line-height:1.6;color:rgba(255,255,255,0.35);margin-bottom:18px}
.ev-art-card__rd{display:inline-flex;align-items:center;gap:8px;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;font-weight:500;color:rgba(255,255,255,0.5);transition:gap 0.3s}
.ev-art-card:hover .ev-art-card__rd{gap:14px;color:var(--pt)}

/* Article */
.ev-art-hero{background:var(--bk);padding:180px 48px 90px;text-align:center}
.ev-art-hero__tag{font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(255,255,255,0.3);display:block;margin-bottom:22px}
.ev-art-hero__h{font-family:var(--sf);font-size:clamp(30px,4vw,56px);font-weight:400;color:#fff;line-height:1.2;max-width:860px;margin:0 auto 18px}
.ev-art-hero__date{font-size:12px;color:rgba(255,255,255,0.2);letter-spacing:0.1em}
.ev-art-body{background:var(--dk);padding:80px 0 120px}
.ev-art-body__in{max-width:1200px;margin:0 auto;padding:0 48px;display:grid;grid-template-columns:1fr 320px;gap:72px;align-items:start}
.ev-art-body__p{font-size:16px;line-height:1.82;color:rgba(255,255,255,0.55);margin-bottom:22px;max-width:640px}
.ev-art-body__cta{margin-top:48px;padding:36px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06)}
.ev-art-body__cta p{font-family:var(--sf);font-size:19px;color:#fff;margin-bottom:18px}
.ev-art-body__side{position:sticky;top:110px}
.ev-art-side__h{font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:rgba(255,255,255,0.25);margin-bottom:20px;padding-bottom:10px;border-bottom:1px solid rgba(255,255,255,0.06)}
.ev-art-side__item{padding:16px 0;border-bottom:1px solid rgba(255,255,255,0.04);cursor:pointer;transition:all 0.3s}
.ev-art-side__item:hover{padding-left:8px}
.ev-art-side__tag{font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:rgba(255,255,255,0.2);display:block;margin-bottom:5px}
.ev-art-side__t{font-family:var(--sf);font-size:14px;color:rgba(255,255,255,0.6);line-height:1.35}

/* RESPONSIVE */
@media(max-width:1100px){
  .ev-about__wrap{grid-template-columns:1fr}
  .ev-about__left{padding:100px 40px 48px}
  .ev-about__right{padding:48px 40px}
  .ev-ind{grid-template-columns:44px 1fr;row-gap:8px}
  .ev-ind__ds{grid-column:2/3;max-width:none}
  .ev-ind__ar{display:none}
  .ev-out{grid-template-columns:44px 1fr;row-gap:6px}
  .ev-out__d{grid-column:2/3}
  .ev-why__grid{grid-template-columns:1fr 1fr}
  .ev-svc{grid-template-columns:70px 1fr;gap:20px}
  .ev-svc__r{grid-column:1/-1;padding-left:70px}
  .ev-trust__wrap{grid-template-columns:1fr;gap:40px}
  .ev-contact__wrap{grid-template-columns:1fr;gap:40px}
  .ev-art-body__in{grid-template-columns:1fr;gap:40px}
  .ev-art-body__side{position:static}
  .ev-ins-grid__in{grid-template-columns:1fr 1fr}
}
@media(max-width:768px){
  .ev-nav__links{display:none}.ev-nav__burger{display:block}
  .ev-nav__in{padding:0 20px}
  .dbr{display:none}
  .ev-hero__brand{flex-direction:column;gap:12px}
  .ev-hero__brand-text{text-align:center}
  .ev-hero__brand-line{margin:0 auto 6px}
  .ev-hero__h2{font-size:clamp(18px,4vw,26px)}
  .ev-about__left{padding:80px 20px 36px}
  .ev-about__h{font-size:clamp(34px,8vw,48px)}
  .ev-about__right{padding:36px 20px}
  .ev-about__logo-area{width:220px;height:220px}
  .ev-about__ring--1{width:180px;height:180px}.ev-about__ring--2{width:210px;height:210px}.ev-about__ring--3{width:220px;height:220px}
  .ev-about__stats{grid-template-columns:1fr 1fr;gap:10px}
  .ev-ind__wrap,.ev-svc__wrap,.ev-proj__wrap,.ev-proc__wrap,.ev-trust__wrap,.ev-contact__wrap,.ev-footer__in,.ev-out__wrap,.ev-bdr__wrap,.ev-why__wrap{padding:0 20px}
  .ev-ind__h,.ev-svc__h,.ev-proj__h,.ev-proc__h,.ev-trust__h,.ev-contact__h,.ev-bdr__h,.ev-why__h{font-size:clamp(34px,8vw,48px)}
  .ev-out{grid-template-columns:1fr;text-align:left}
  .ev-out__d{grid-column:auto}
  .ev-ind{grid-template-columns:1fr;text-align:left}
  .ev-ind__ds{grid-column:auto}
  .ev-why__grid{grid-template-columns:1fr}
  .ev-about__stats{grid-template-columns:1fr 1fr}
  .ev-svc{grid-template-columns:1fr;gap:14px;padding:28px 0}
  .ev-svc__l{flex-direction:row;align-items:center;gap:10px}
  .ev-svc__gn{font-size:32px}
  .ev-svc__r{padding-left:0}
  .ev-prj__bd{padding-left:0}
  .ev-proc__grid{grid-template-columns:1fr}.ev-proc__card{border-right:none;border-bottom:1px solid rgba(255,255,255,0.04);padding:24px 0}
  .ev-stmt{padding:100px 20px;min-height:50vh}.ev-stmt__h{font-size:clamp(24px,6vw,40px)}
  .ev-contact-sec{padding:100px 0}
  .ev-form{padding:22px}
  .ev-form__r{grid-template-columns:1fr}
  .ev-checks{grid-template-columns:1fr}
  .ev-footer__top{flex-direction:column;gap:14px;align-items:flex-start}
  .ev-footer__bot{flex-direction:column;gap:6px}
  .ev-ins-hero{padding:160px 20px 70px}
  .ev-ins-grid__in{grid-template-columns:1fr;padding:0 20px}
  .ev-art-hero{padding:150px 20px 70px}
  .ev-art-body__in{padding:0 20px}
}
@media(max-width:480px){
  .ev-hero{min-height:100svh}
  .ev-hero__brand-name{font-size:48px}
  .ev-hero__ctas{flex-direction:column;align-items:center}
  .ev-btn{width:100%;justify-content:center}
  .ev-ind-grid{grid-template-columns:1fr}
  .ev-radios{flex-direction:column}
}
      `}</style>

      <Nav page={page} setPage={setPage}/>
      {page==="home"&&<><Hero/><Marquee/><About/><Outcomes/><Industries/><Services/><Projects/><Process/><Borders/><Why/><Trust/><Statement/><Contact/></>}
      {page==="insights"&&<InsightsHome setPage={setPage} setSlug={setSlug}/>}
      {page==="article"&&<ArticlePage slug={slug} setPage={setPage} setSlug={setSlug}/>}
      <Footer setPage={setPage}/>
    </>
  );
}

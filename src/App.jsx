import { useState, useEffect, useRef } from "react";
import { Mail, ArrowRight, ArrowUpRight, Menu, X, Minus, Plus, Atom, Radar, Boxes, Waypoints, Lock, Eye, Shield, CheckCircle2, Target } from "lucide-react";
import ChatWidget from "./ChatWidget";

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

/* Interactive intelligence network — nodes drift slowly and react to the cursor */
function NetworkCanvas() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = canvas.getContext("2d");
    let raf, w, h, dpr;
    const mouse = { x: -9999, y: -9999 };
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.offsetWidth; h = canvas.offsetHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const N = w < 768 ? 34 : 64;
    const nodes = Array.from({ length: N }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.22, vy: (Math.random() - 0.5) * 0.22,
      r: 1 + Math.random() * 1.6,
    }));
    const LINK = w < 768 ? 110 : 150;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const n of nodes) {
        if (!reduced) {
          n.x += n.vx; n.y += n.vy;
          const dx = n.x - mouse.x, dy = n.y - mouse.y, d = Math.hypot(dx, dy);
          if (d < 160 && d > 0.1) { n.x += (dx / d) * 0.6; n.y += (dy / d) * 0.6; }
          if (n.x < 0 || n.x > w) n.vx *= -1;
          if (n.y < 0 || n.y > h) n.vy *= -1;
          n.x = Math.max(0, Math.min(w, n.x)); n.y = Math.max(0, Math.min(h, n.y));
        }
      }
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < LINK) {
            const o = (1 - d / LINK) * 0.16;
            ctx.strokeStyle = `rgba(125,220,200,${o})`;
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }
      for (const n of nodes) {
        const md = Math.hypot(n.x - mouse.x, n.y - mouse.y);
        const glow = md < 200 ? (1 - md / 200) * 0.5 : 0;
        ctx.fillStyle = `rgba(125,220,200,${0.28 + glow})`;
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx.fill();
      }
      if (!reduced) raf = requestAnimationFrame(draw);
    };
    const onMove = (e) => { const r = canvas.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; };
    const onLeave = () => { mouse.x = -9999; mouse.y = -9999; };
    window.addEventListener("resize", resize);
    canvas.parentElement.parentElement.addEventListener("mousemove", onMove);
    canvas.parentElement.parentElement.addEventListener("mouseleave", onLeave);
    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      canvas.parentElement?.parentElement?.removeEventListener("mousemove", onMove);
      canvas.parentElement?.parentElement?.removeEventListener("mouseleave", onLeave);
    };
  }, []);
  return <canvas ref={ref} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />;
}

/* Scroll progress bar */
function ScrollProgress() {
  const ref = useRef(null);
  useEffect(() => {
    let raf;
    const onScroll = () => { raf = requestAnimationFrame(() => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (ref.current) ref.current.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
    }); };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, []);
  return <div className="ev-progress"><div ref={ref} className="ev-progress__bar" /></div>;
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

/* SEO meta tags + JSON-LD */
function useSEO() {
  useEffect(() => {
    document.title = "Evriel Systems - AI | Automation & Intelligent Systems";
    const metas = [
      { name: "description", content: "Evriel Systems helps organizations integrate AI, automation, and intelligent technologies into practical business systems. Based in Europe. Working across Europe." },
      { name: "keywords", content: "AI consulting, business automation, intelligent systems, digital transformation, AI integration, European projects" },
      { name: "author", content: "Evriel Systems" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Evriel Systems - AI | Automation & Intelligent Systems" },
      { property: "og:description", content: "Helping organizations integrate AI, automation, and intelligent technologies into practical business systems." },
      { property: "og:url", content: "https://evrielsystems.com" },
      { property: "og:image", content: "https://evrielsystems.com/og-image.jpg" },
      { property: "og:site_name", content: "Evriel Systems" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Evriel Systems - AI | Automation & Intelligent Systems" },
      { name: "twitter:description", content: "Helping organizations integrate AI, automation, and intelligent technologies into practical business systems." },
      { name: "twitter:image", content: "https://evrielsystems.com/og-image.jpg" },
    ];
    const els = [];
    metas.forEach(m => {
      const el = document.createElement("meta");
      if (m.name) el.setAttribute("name", m.name);
      if (m.property) el.setAttribute("property", m.property);
      el.setAttribute("content", m.content);
      document.head.appendChild(el);
      els.push(el);
    });
    let canon = document.querySelector('link[rel="canonical"]');
    if (!canon) { canon = document.createElement("link"); canon.setAttribute("rel", "canonical"); document.head.appendChild(canon); els.push(canon); }
    canon.setAttribute("href", "https://evrielsystems.com");
    const ld = document.createElement("script");
    ld.type = "application/ld+json";
    ld.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Evriel Systems",
      url: "https://evrielsystems.com",
      description: "European AI, automation, and intelligent systems consultancy helping organizations integrate emerging technologies into practical business solutions.",
      founder: { "@type": "Person", name: "Bereket Teshome" },
      address: { "@type": "PostalAddress", addressRegion: "Europe" },
      email: "contact@evrielsystems.com",
      sameAs: []
    });
    document.head.appendChild(ld);
    els.push(ld);
    return () => els.forEach(el => el.remove());
  }, []);
}

/* LOGO */
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

/* COOKIE CONSENT */
function CookieConsent({ setPage }) {
  const [show, setShow] = useState(false);
  useEffect(() => { if (!localStorage.getItem("ev_cookie_ok")) setShow(true); }, []);
  if (!show) return null;
  const accept = () => { localStorage.setItem("ev_cookie_ok", "1"); setShow(false); };
  return (
    <div className="ev-cookie">
      <p>We use essential cookies to ensure our website functions properly. We do not use tracking or advertising cookies. By continuing to use this site, you agree to our <a href="#" onClick={e=>{e.preventDefault();setPage("privacy");window.scrollTo({top:0,behavior:"smooth"})}}>Privacy Policy</a>.</p>
      <button className="ev-cookie__btn" onClick={accept}>Accept & Close</button>
    </div>
  );
}

/* NAV */
function Nav({ page, setPage }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => { const h = () => setScrolled(window.scrollY > 50); window.addEventListener("scroll", h, { passive: true }); return () => window.removeEventListener("scroll", h); }, []);
  const go = (id) => { setOpen(false); if (page !== "home") { setPage("home"); setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 250); } else document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); };
  const c = "#F4F7FC";
  return (
    <nav className={`ev-nav${scrolled?" ev-nav--s":""}`}>
      <div className="ev-nav__in">
        <div onClick={()=>{setPage("home");setOpen(false);window.scrollTo({top:0,behavior:"smooth"})}} style={{cursor:"pointer",display:"flex",alignItems:"center",gap:14}}>
          <LogoMark size={32} color="#7A8D9C"/>
          <div><div style={{width:24,height:1.5,background:"#7A8D9C",opacity:0.55,marginBottom:4}}/><div style={{fontFamily:"var(--sf)",fontSize:18,fontWeight:400,color:c,letterSpacing:"0.05em",lineHeight:1}}>Evriel</div><div style={{fontFamily:"var(--bd)",fontSize:8,color:"rgba(201,207,217,0.7)",letterSpacing:"0.42em",textTransform:"uppercase",marginTop:3}}>Systems</div></div>
        </div>
        <div className="ev-nav__links">
          {[["About","about"],["Industries","industries"],["Services","services"],["Projects","projects"]].map(([l,id])=>
            <button key={id} onClick={()=>go(id)} className="ev-nav__link" style={{color:c}}>{l}</button>
          )}
          <button onClick={()=>{setPage("insights");setOpen(false);window.scrollTo({top:0,behavior:"smooth"})}} className="ev-nav__link" style={{color:c}}>Insights</button>
          <button onClick={()=>go("contact")} className="ev-nav__cta">Let's Talk</button>
        </div>
        <button className="ev-nav__burger" onClick={()=>setOpen(!open)} style={{color:c}}>{open?<X size={22}/>:<Menu size={22}/>}</button>
      </div>
      {open&&<div className="ev-mobile-menu">{[["About","about"],["Industries","industries"],["Services","services"],["Projects","projects"]].map(([l,id])=><button key={id} onClick={()=>go(id)} className="ev-mob-link">{l}</button>)}<button onClick={()=>{setPage("insights");setOpen(false);window.scrollTo({top:0,behavior:"smooth"})}} className="ev-mob-link">Insights</button><button onClick={()=>go("contact")} className="ev-mob-link">Contact</button></div>}
    </nav>
  );
}

/* HERO */
function Hero() {
  const [on, setOn] = useState(false);
  const gRef = useParallax(0.025);
  useEffect(() => { setTimeout(() => setOn(true), 80); }, []);
  const a = (d) => ({ opacity:on?1:0, transform:on?"translateY(0)":"translateY(70px)", transition:`opacity 1.3s ${EASE} ${d}ms, transform 1.3s ${EASE} ${d}ms` });
  return (
    <section className="ev-hero">
      <div className="ev-hero__bg"><div className="ev-hero__grid" ref={gRef}/><div className="ev-hero__rad"/><div className="ev-hero__orb"/><div className="ev-hero__ghost"><LogoMark size={700} color="rgba(189,212,240,0.025)" spin/></div><NetworkCanvas/></div>
      <div className="ev-hero__body">
        <div style={{overflow:"hidden"}}><div className="ev-hero__eyebrow" style={a(150)}>AI &bull; Automation &bull; Intelligent Systems</div></div>
        <div style={{overflow:"hidden"}}>
          <div style={a(300)} className="ev-hero__brand">
            <LogoMark size={90} color="#7A8D9C"/>
            <div className="ev-hero__brand-text">
              <div className="ev-hero__brand-line"/>
              <h1 className="ev-hero__brand-name">Evriel</h1>
              <span className="ev-hero__brand-sub">SYSTEMS</span>
            </div>
          </div>
        </div>
        <div style={{overflow:"hidden"}}><h2 className="ev-hero__h2" style={a(500)}>Connecting Intelligence<br/>with <em>Business</em></h2></div>
        <div style={{overflow:"hidden"}}><p className="ev-hero__sub" style={a(680)}>Helping organizations leverage AI, automation, and intelligent systems <br className="dbr"/>to improve efficiency, make better decisions, and build sustainable <br className="dbr"/>competitive advantages.</p></div>
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

/* MARQUEE */
function Marquee() {
  const items = ["AI Integration","Digital Transformation","Business Intelligence","Workflow Automation","Intelligent Systems","Data Analytics","Industry Solutions","Operational Excellence"];
  const r = items.map((t,i)=><span key={i} className="ev-mq__i"><span className="ev-mq__dot"/>{t}</span>);
  return <div className="ev-mq"><div className="ev-mq__track">{r}{r}{r}{r}</div></div>;
}

/* ABOUT */
const ABOUT_FEATS = [
  { t:"AI-Driven", s:"Innovation", d:"Practical applications of AI for real business challenges." },
  { t:"Multi-Industry", s:"Expertise", d:"Solutions designed for diverse operational environments." },
  { t:"24/7", s:"Intelligence", d:"Continuous support through automation and intelligent systems." },
  { t:"Future-Ready", s:"Growth", d:"Built to adapt, scale, and evolve with your organization." },
];

/* People + Processes + Information + Technology converge into Intelligent Systems */
function ConvergenceDiagram() {
  const [ref, vis] = useReveal(0.25);
  const SRC = ["People", "Processes", "Information", "Technology"];
  return (
    <div className="ev-conv" ref={ref}>
      <svg viewBox="0 0 440 340" width="100%" style={{ overflow: "visible" }}>
        {SRC.map((label, i) => {
          const y = 56 + i * 76;
          const path = `M138 ${y} C 215 ${y}, 235 170, 290 170`;
          return (
            <g key={label} style={{ opacity: vis ? 1 : 0, transition: `opacity 0.9s ${EASE} ${i * 160}ms` }}>
              <path d={path} fill="none" stroke="rgba(125,220,200,0.22)" strokeWidth="1.2"
                strokeDasharray="320" strokeDashoffset={vis ? 0 : 320}
                style={{ transition: `stroke-dashoffset 1.6s ${EASE} ${300 + i * 160}ms` }} />
              <circle r="2.6" fill="var(--ac)" opacity={vis ? 0.9 : 0}>
                <animateMotion dur="3.2s" begin={`${i * 0.8}s`} repeatCount="indefinite" path={path} />
              </circle>
              <rect x="6" y={y - 19} width="132" height="38" rx="3" fill="rgba(125,220,200,0.04)" stroke="rgba(125,220,200,0.18)" strokeWidth="1" />
              <text x="72" y={y + 4.5} textAnchor="middle" fill="rgba(244,247,252,0.78)"
                style={{ font: "500 13px var(--bd)", letterSpacing: "0.04em" }}>{label}</text>
            </g>
          );
        })}
        <g style={{ opacity: vis ? 1 : 0, transform: vis ? "none" : "scale(0.85)", transformOrigin: "346px 170px", transition: `opacity 1s ${EASE} 900ms, transform 1s ${EASE} 900ms` }}>
          <circle cx="346" cy="170" r="62" fill="rgba(78,205,180,0.05)" stroke="rgba(78,205,180,0.35)" strokeWidth="1.2" />
          <circle cx="346" cy="170" r="74" fill="none" stroke="rgba(78,205,180,0.12)" strokeWidth="1" strokeDasharray="3 6">
            <animateTransform attributeName="transform" type="rotate" from="0 346 170" to="360 346 170" dur="40s" repeatCount="indefinite" />
          </circle>
          <text x="346" y="164" textAnchor="middle" fill="#fff" style={{ font: "italic 400 17px var(--sf)" }}>Intelligent</text>
          <text x="346" y="186" textAnchor="middle" fill="var(--ac2)" style={{ font: "italic 400 17px var(--sf)" }}>Systems</text>
        </g>
      </svg>
    </div>
  );
}

function About() {
  const [ref, vis] = useReveal(0.08);
  return (
    <section id="about" className="ev-about" ref={ref}>
      <div className="ev-about__wrap">
        <div className="ev-about__left">
          <Reveal><div className="ev-label">01 <span>About</span></div></Reveal>
          <Reveal delay={100} direction="right"><h2 className="ev-about__h">Intelligence<br/>With <em>Purpose</em></h2></Reveal>
          <Reveal delay={180}>
            <p className="ev-about__lead">No two organizations operate the same way, which is why effective solutions must be built around real operational needs rather than one-size-fits-all technology.</p>
            <p className="ev-about__quote">Our role is to understand those challenges and design practical systems that improve how people work, collaborate, and make decisions.</p>
            <p className="ev-about__p">Artificial Intelligence is transforming industries and creating new opportunities to operate more efficiently, make smarter decisions, and remain competitive. <strong>The challenge is not accessing AI. It is implementing it correctly.</strong></p>
            <p className="ev-about__p">Founded by Bereket Teshome, Evriel Systems was shaped by experience across business, marketing, European projects, and digital transformation initiatives in Poland, Spain, Italy, and Greece.</p>
            <p className="ev-about__p">Through these experiences, one challenge consistently emerged: many organizations struggle to transform emerging technologies into practical business value.</p>
            <p className="ev-about__p">Working across industries has shown that while technologies change rapidly, the underlying challenges often remain the same: disconnected information, inefficient workflows, and missed opportunities for better decision-making.</p>
            <p className="ev-about__p">Evriel Systems was created to help bridge that gap through AI, automation, and intelligent systems that connect people, processes, information, and technology into solutions built for efficiency, growth, and long-term success.</p>
            <p className="ev-about__p">Our solutions include AI agents, workflow automation, intelligent knowledge systems, custom software, and digital platforms designed to improve efficiency, streamline operations, and support better decision-making.</p>
          </Reveal>
          <Stagger className="ev-about__stats" delay={90}>
            {ABOUT_FEATS.map((f,i)=>
              <div key={i} className="ev-afeat"><span className="ev-afeat__n">{f.t}<br/>{f.s}</span><p className="ev-afeat__d">{f.d}</p></div>
            )}
          </Stagger>
        </div>
        <div className="ev-about__right">
          <Reveal direction="scale" delay={200}>
            <ConvergenceDiagram/>
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

/* OUTCOMES */
const OUTCOMES = [
  { t:"AI-Powered Efficiency", d:"Reduce repetitive work and streamline operations through intelligent automation." },
  { t:"Smarter Decision-Making", d:"Use AI, data, and business intelligence to support informed decisions." },
  { t:"Operational Visibility", d:"Connect systems, information, and workflows to improve transparency and control." },
  { t:"Growth & Competitiveness", d:"Leverage intelligent technologies to adapt, innovate, and stay ahead." },
  { t:"Digital Transformation", d:"Build modern operational foundations that support long-term success." },
];

const OUT_CYCLE_MS = 4600;

function Outcomes() {
  const [act, setAct] = useState(0);
  return (
    <section className="ev-out-sec">
      <div className="ev-out__wrap">
        <div className="ev-out__left">
          <div className="ev-label ev-label--l"><span>What We Help Improve</span></div>
          <h2 className="ev-out__h">Where intelligence creates <em>real impact</em></h2>
          <p className="ev-out__intro">Five areas where AI and automation translate directly into measurable business results.</p>
            <div className="ev-out__display">
              <svg className="ev-out__ring" viewBox="0 0 220 220">
                <circle cx="110" cy="110" r="102" className="ev-out__ring-bg"/>
                {OUTCOMES.map((_,i)=>{
                  const a = (i/OUTCOMES.length)*Math.PI*2 - Math.PI/2;
                  return <circle key={`d${i}`} cx={110+102*Math.cos(a)} cy={110+102*Math.sin(a)} r={i===act?5:3} fill={i===act?"var(--ac)":"rgba(125,220,200,0.25)"} style={{transition:"all 0.5s"}}/>;
                })}
              </svg>
              <div className="ev-out__bignum">0{act+1}</div>
            </div>
        </div>
        <div className="ev-out__list">
          {OUTCOMES.map((o,i)=>(
              <div key={i} className={`ev-out2${i===act?" ev-out2--on":""}`} onClick={()=>setAct(i)}>
                <div className="ev-out2__head">
                  <span className="ev-out2__ix">0{i+1}</span>
                  <h3 className="ev-out2__t">{o.t}</h3>
                  <span className="ev-out2__chev"><ArrowRight size={15}/></span>
                </div>
                <div className="ev-out2__body"><p>{o.d}</p></div>
              </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* INDUSTRIES — rotating orbit wheel */
const INDS = [
  { name:"Construction & Engineering", short:"Construction", desc:"Digital project monitoring, documentation systems, and reporting automation built for complex, multi-stakeholder environments." },
  { name:"Manufacturing & Industrial", short:"Manufacturing", desc:"Workflow optimization, operational analytics, and predictive monitoring that improve consistency at scale." },
  { name:"Tourism & Hospitality", short:"Tourism", desc:"Guest management, operational automation, and business analytics that elevate the experience and the bottom line." },
  { name:"Retail & Commerce", short:"Retail", desc:"Customer intelligence, inventory visibility, and process automation across the full commercial journey." },
  { name:"Import & Export", short:"Import & Export", desc:"Trade documentation, workflow automation, and operational coordination across borders and partners." },
  { name:"Professional Services", short:"Services", desc:"Knowledge systems, workflow optimization, and AI-assisted operations that free experts to focus on expertise." },
  { name:"Marketing & SEO", short:"Marketing", desc:"Content intelligence, domain qualification, and opportunity discovery powered by AI-driven analysis." },
  { name:"European Projects", short:"EU Projects", desc:"Project management support, reporting, and knowledge management for complex funding environments." },
  { name:"NGOs & Associations", short:"NGOs", desc:"Operational efficiency, communication systems, and data management aligned with mission-driven work." },
  { name:"Education & Training", short:"Education", desc:"Knowledge systems, digital learning support, and administrative automation that support people first." },
  { name:"Startups & SMEs", short:"Startups", desc:"Scalable systems designed to support growth and operational maturity at every stage." },
];

function Industries() {
  const [act, setAct] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setAct(a => (a+1)%INDS.length), 3000);
    return () => clearInterval(id);
  }, [paused]);
  const step = 360/INDS.length;
  return (
    <section id="industries" className="ev-ind-sec">
      <div className="ev-ind__wrap">
        <div className="ev-ind__left">
          <Reveal><div className="ev-label ev-label--l">02 <span>Industries</span></div></Reveal>
          <Reveal delay={80} direction="right"><h2 className="ev-ind__h">Industries We <em>Support</em></h2></Reveal>
          <div className="ev-ind__detail" key={act}>
            <span className="ev-ind__dnum">{String(act+1).padStart(2,"0")} / {INDS.length}</span>
            <h3 className="ev-ind__dname">{INDS[act].name}</h3>
            <p className="ev-ind__ddesc">{INDS[act].desc}</p>
          </div>
          <div className="ev-ind__dots">
            {INDS.map((_,i)=>(
              <button key={i} className={`ev-ind__dot${i===act?" ev-ind__dot--on":""}`} onClick={()=>setAct(i)} aria-label={INDS[i].name}/>
            ))}
          </div>
        </div>
        <Reveal direction="scale" delay={150}>
          <div className="ev-orbit" onMouseEnter={()=>setPaused(true)} onMouseLeave={()=>setPaused(false)}>
            <div className="ev-orbit__ring"/>
            <div className="ev-orbit__ring ev-orbit__ring--in"/>
            <div className="ev-orbit__spin">
              {INDS.map((s,i)=>(
                <div key={i} className="ev-orbit__pos" style={{transform:`rotate(${i*step}deg) translateY(calc(var(--orbR) * -1)) rotate(${-i*step}deg)`}}>
                  <div className="ev-orbit__upright">
                    <button className={`ev-orbit__node${i===act?" ev-orbit__node--on":""}`} onClick={()=>setAct(i)} onMouseEnter={()=>setAct(i)}>{s.short}</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="ev-orbit__hub">
              <LogoMark size={30} color="#7A8D9C"/>
              <span>Evriel<br/>Systems</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* SERVICES */
const SVCS = [
  { n:"01",t:"AI Automation",d:"Reduce repetitive work and improve operational efficiency through intelligent automation.",a:["Email automation","Workflow automation","Internal process automation","AI-powered assistants","Customer communication systems"],flow:["Email","AI Analysis","Automation","Action"] },
  { n:"02",t:"Business Intelligence",d:"Transform business information into actionable insights.",a:["Reporting dashboards","Operational analytics","Decision support systems","Data visualization","Performance monitoring"],flow:["Data","Analysis","Insight","Decision"] },
  { n:"03",t:"Intelligent Systems",d:"Custom-built solutions designed around the unique needs of each organization.",a:["Industry-specific platforms","Knowledge management","AI-powered operational tools","Intelligent information systems"],flow:["Needs","Design","Build","Evolve"] },
  { n:"04",t:"Digital Transformation",d:"Support organizations as they modernize operations and adopt emerging technologies.",a:["Process redesign","Digital strategy","Technology integration","Operational modernization"],flow:["Assess","Strategy","Integrate","Modernize"] },
];

/* Animated workflow diagram — shows how value flows through each service */
function FlowDiagram({ steps }) {
  const [ref, vis] = useReveal(0.4);
  return (
    <div className="ev-flow" ref={ref}>
      {steps.map((s, i) => (
        <div key={s} className="ev-flow__seg" style={{ opacity: vis ? 1 : 0, transform: vis ? "none" : "translateX(-14px)", transition: `opacity 0.7s ${EASE} ${i * 180}ms, transform 0.7s ${EASE} ${i * 180}ms` }}>
          <span className={`ev-flow__node${i === steps.length - 1 ? " ev-flow__node--end" : ""}`}>{s}</span>
          {i < steps.length - 1 && (
            <svg className="ev-flow__link" width="34" height="10" viewBox="0 0 34 10">
              <line x1="0" y1="5" x2="26" y2="5" stroke="rgba(125,220,200,0.35)" strokeWidth="1.2" strokeDasharray="4 4" style={vis ? { animation: "flowDash 1.4s linear infinite" } : {}} />
              <path d="M26 1.5 L32 5 L26 8.5" fill="none" stroke="rgba(125,220,200,0.5)" strokeWidth="1.2" />
            </svg>
          )}
        </div>
      ))}
    </div>
  );
}

function Services() {
  return (
    <section id="services" className="ev-svc-sec">
      <div className="ev-svc__wrap">
        <Reveal><div className="ev-label">03 <span>Services</span></div></Reveal>
        <Reveal delay={80}><h2 className="ev-svc__h">What We <em>Deliver</em></h2></Reveal>
        <Reveal delay={140}><p className="ev-svc__intro">We help organizations turn emerging technologies into practical business advantages.</p></Reveal>
        {SVCS.map((s,i)=>(
          <Reveal key={i} delay={i*90} direction={i%2?"down":"up"}>
            <div className="ev-svc">
              <div className="ev-svc__l"><span className="ev-svc__gn">{s.n}</span></div>
              <div className="ev-svc__m"><h3 className="ev-svc__t">{s.t}</h3><p className="ev-svc__d">{s.d}</p><FlowDiagram steps={s.flow}/></div>
              <div className="ev-svc__r"><div className="ev-svc__al">Applications</div><ul>{s.a.map((x,j)=><li key={j}>{x}</li>)}</ul></div>
              <div className="ev-svc__bar"/>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* PROJECTS */
const PROJS = [
  { t:"AI Business Integration",badge:null,d:"Supporting the transition from manual operations to AI-enhanced business systems.",c:["AI-assisted communication","Email classification","Response generation","Digital transformation roadmap"],tl:"Designed and implemented an AI-powered communication system for a civil engineering firm, expanding into a broader digital transformation initiative.",
    detail:{
      challenge:"A civil engineering firm with established operational processes wanted to modernize communication workflows, improve efficiency, and explore how AI could support future business growth.",
      solution:"Designed and implemented an AI-powered communication system capable of classifying emails, identifying urgency levels, and generating professional draft responses. The project expanded into a broader digital transformation initiative covering communication workflows, recruitment strategy, digital presence, and future business development opportunities.",
      results:["AI-assisted communication workflows","Email classification and prioritization","Professional response generation","Digital transformation roadmap","Foundation for future intelligent business systems"]
    }
  },
  { t:"Funding Intelligence",badge:null,d:"Opportunity discovery for European projects and funding programs.",c:["Funding discovery","Call monitoring","Eligibility analysis","Opportunity matching"],tl:"An intelligent system that monitors funding opportunities, analyzes eligibility requirements, and helps organizations identify relevant European project calls.",
    detail:{
      challenge:"Organizations often spend significant time searching through funding portals, tender databases, and project calls to identify relevant opportunities.",
      solution:"Developed an intelligent system that monitors funding opportunities, analyzes eligibility requirements, and helps organizations identify relevant European project calls more efficiently.",
      results:["Reduced manual search effort","Faster opportunity identification","Improved visibility of relevant funding calls","Enhanced project development workflows"]
    }
  },
  { t:"Workforce AI",badge:null,d:"Intelligent workforce management platform.",c:["GPS attendance","Employee verification","Workforce analytics","Mobile management"],tl:"A platform combining workforce tracking, location verification, employee management, and operational analytics into a unified system.",
    detail:{
      challenge:"Organizations operating across multiple locations often face difficulties tracking attendance, workforce activity, compliance, and operational visibility. Manual processes can lead to inefficiencies, reporting challenges, and limited real-time oversight.",
      solution:"Developed an intelligent workforce management platform designed to improve workforce visibility, attendance verification, and operational control through digital tools and automation. The platform combines workforce tracking, location verification, employee management, and operational analytics into a unified system accessible through mobile and web interfaces.",
      results:["GPS-based attendance verification","Employee check-in and check-out management","Selfie authentication and identity verification","Workforce analytics and reporting","Administrative dashboards","Mobile payment and payroll integration support","Operational compliance monitoring"]
    }
  },
  { t:"Domain Intel",badge:null,d:"AI-powered domain intelligence and opportunity discovery.",c:["Domain qualification","Opportunity discovery","SEO intelligence","Decision support"],tl:"An intelligent platform that analyzes, compares, and qualifies domains while providing contextual insights into relevance, authority, and opportunity potential.",
    detail:{
      challenge:"SEO professionals spend significant time evaluating websites, identifying opportunities, and determining which domains provide the greatest strategic value.",
      solution:"Developed an intelligent platform that analyzes, compares, and qualifies domains while providing contextual insights into relevance, authority, and opportunity potential.",
      results:["AI-powered domain qualification","Opportunity discovery engine","SEO intelligence workflows","Decision-support capabilities","Reduced manual research requirements","Faster identification of high-value opportunities"]
    }
  },
  { t:"Project Vision",badge:"In Development",d:"Construction intelligence platform (in development).",c:["Voice memo transcription","Site photo intelligence","Document management","AI-powered reporting"],tl:"An AI-powered construction intelligence platform designed to bring together project communication, documentation, and operational updates into a unified environment.",
    detail:{
      challenge:"Project Vision is an AI-powered construction intelligence platform currently under development. The platform is designed to bring together project communication, voice notes, site photographs, engineering documentation, AutoCAD exports, and operational updates into a unified project environment.",
      solution:null,
      results:["Voice memo transcription and analysis","Site photo intelligence and progress tracking","Project timeline generation","Document and drawing management","Email integration and project knowledge capture","AI-powered project insights and reporting"],
      vision:"The objective is to provide engineering and construction teams with a single source of truth for project information, enabling better visibility, faster decision-making, and improved operational coordination throughout the project lifecycle."
    }
  },
];

function Projects() {
  const [active, setActive] = useState(null);
  const [expanded, setExpanded] = useState({});
  const togDetail = (i, e) => { e.stopPropagation(); setExpanded(prev => ({...prev, [i]: !prev[i]})); };
  return (
    <section id="projects" className="ev-proj-sec">
      <div className="ev-proj__wrap">
        <Reveal><div className="ev-label ev-label--l">04 <span>Solutions, Products & Case Studies</span></div></Reveal>
        <Reveal delay={80}><h2 className="ev-proj__h">Solutions, Products<br/>& <em>Case Studies</em></h2></Reveal>
        {PROJS.map((p,i)=>(
          <Reveal key={i} delay={i*60} direction={i%2?"right":"left"}>
            <div className={`ev-prj${active===i?" ev-prj--o":""}`} onClick={()=>{setActive(active===i?null:i);if(active===i)setExpanded(prev=>({...prev,[i]:false}))}}>
              <div className="ev-prj__hd">
                <div className="ev-prj__hl">
                  <span className="ev-prj__ix">0{i+1}</span>
                  <h3 className="ev-prj__t">{p.t}</h3>
                  {p.badge&&<span className="ev-prj__badge">{p.badge}</span>}
                </div>
                <span className="ev-prj__tog">{active===i?<Minus size={18}/>:<Plus size={18}/>}</span>
              </div>
              <div style={{maxHeight:active===i?(expanded[i]?2000:500):0,opacity:active===i?1:0,overflow:"hidden",transition:`max-height 0.7s ${EASE}, opacity 0.4s ${EASE}`}}>
                <div className="ev-prj__bd">
                  <p>{p.d}</p>
                  <div className="ev-prj__caps">{p.c.map((x,j)=><span key={j} className="ev-prj__cap">{x}</span>)}</div>
                  <p className="ev-prj__tl">{p.tl}</p>
                  {!expanded[i] && <button className="ev-prj__more" onClick={(e)=>togDetail(i,e)}>Read More <ArrowRight size={13}/></button>}
                  {expanded[i] && (
                    <div className="ev-prj__detail">
                      <div className="ev-prj__detail-sec">
                        <h4>{p.detail.solution ? "Challenge" : "Overview"}</h4>
                        <p>{p.detail.challenge}</p>
                      </div>
                      {p.detail.solution && (
                        <div className="ev-prj__detail-sec">
                          <h4>Solution</h4>
                          <p>{p.detail.solution}</p>
                        </div>
                      )}
                      <div className="ev-prj__detail-sec">
                        <h4>{p.detail.solution ? "Results" : "Key Capabilities"}</h4>
                        <ul>{p.detail.results.map((r,j)=><li key={j}>{r}</li>)}</ul>
                      </div>
                      {p.detail.vision && (
                        <div className="ev-prj__detail-sec">
                          <h4>Vision</h4>
                          <p>{p.detail.vision}</p>
                        </div>
                      )}
                      <button className="ev-prj__more" onClick={(e)=>togDetail(i,e)}>Show Less</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* PROCESS */
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
        <Reveal delay={80} direction="down"><h2 className="ev-proc__h">How We <em>Work</em></h2></Reveal>
        <Reveal delay={140}><p className="ev-proc__intro">Every organization is different. Our process is designed to understand your specific challenges before recommending technology.</p></Reveal>
        <div className="ev-proc__grid">
          {PROCS.map((s,i)=>(
            <Reveal key={i} delay={i*100} direction="down">
              <div className="ev-proc__card"><div className="ev-proc__num">0{i+1}</div><div className="ev-proc__dot"/><h3 className="ev-proc__ct">{s.t}</h3><p className="ev-proc__cd">{s.d}</p></div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* BORDERS */
function Borders() {
  const pRef = useParallax(0.03);
  return (
    <section className="ev-bdr-sec">
      <div className="ev-bdr__orb" ref={pRef}><LogoMark size={520} color="rgba(125,220,200,0.035)" spin/></div>
      <div className="ev-bdr__wrap">
        <Reveal><div className="ev-label ev-label--l"><span>Working Across Borders</span></div></Reveal>
        <Reveal delay={100} direction="scale"><h2 className="ev-bdr__h">Built for a <em>Connected</em> World</h2></Reveal>
        <Reveal delay={180}>
          <p className="ev-bdr__p">Business challenges rarely stop at national boundaries. Evriel Systems supports organizations operating across different industries, markets, and regions.</p>
          <p className="ev-bdr__p">We understand the importance of clear communication, cultural awareness, and practical solutions that work in diverse environments.</p>
        </Reveal>
        <Reveal delay={260}>
          <div className="ev-bdr__tag"><span>Projects and communications can be conducted in multiple languages depending on client requirements.</span></div>
        </Reveal>
      </div>
    </section>
  );
}

/* WHY */
const WHY = [
  { t:"Practical Solutions", d:"Focused on real business outcomes." },
  { t:"Intelligent Systems", d:"Built around your organization's needs." },
  { t:"Long-Term Thinking", d:"Designed to support sustainable growth and adaptability." },
];

function Why() {
  return (
    <section className="ev-why-sec">
      <div className="ev-why__wrap">
        <Reveal><div className="ev-label ev-label--l"><span>Why Evriel Systems</span></div></Reveal>
        <Reveal delay={100} direction="right"><h2 className="ev-why__h">Clarity, Not <em>Complexity</em></h2></Reveal>
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

/* TRUST */
function Trust() {
  return (
    <section id="trust" className="ev-trust-sec">
      <div className="ev-trust__wrap">
        <div className="ev-trust__l">
          <Reveal><div className="ev-label">06 <span>Trust & Security</span></div></Reveal>
          <Reveal delay={80} direction="left"><h2 className="ev-trust__h">Your Data Remains <em>Yours</em></h2></Reveal>
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

/* STATEMENT */
function Statement() {
  const p = useParallax(0.02);
  return (
    <section className="ev-stmt">
      <div className="ev-stmt__bg" ref={p}><LogoMark size={420} color="rgba(125,220,200,0.04)"/></div>
      <div className="ev-stmt__body">
        <Reveal direction="scale"><h2 className="ev-stmt__h">The future belongs to<br/>organizations that can adapt,<br/>innovate, and act <em>intelligently.</em></h2></Reveal>
        <Reveal delay={180}><a href="#contact" className="ev-btn ev-btn--w ev-btn--lg" onClick={e=>{e.preventDefault();document.getElementById("contact")?.scrollIntoView({behavior:"smooth"})}}>Start a Conversation <ArrowRight size={18}/></a></Reveal>
      </div>
    </section>
  );
}

/* WHAT HAPPENS NEXT — the client journey after first contact */
const NEXT_STEPS = [
  { t:"You Reach Out", d:"Send us a message through the form below. We personally read every inquiry and respond within 24 hours." },
  { t:"Initial Conversation", d:"A relaxed introductory call to understand your organization, goals, and challenges. No commitments, no sales pressure." },
  { t:"Discovery & Assessment", d:"We analyze your workflows and identify exactly where AI and intelligent systems can create measurable value." },
  { t:"Solution Design", d:"You receive a clear proposal with scope, timeline, and expected outcomes, written in plain business language." },
  { t:"Implementation & Continuous Improvement", d:"We build, integrate, and continuously improve the solution alongside your team for long-term success." },
];

function WhatNext() {
  const [ref, vis] = useReveal(0.1);
  return (
    <section id="next" className="ev-next-sec" ref={ref}>
      <div className="ev-next__wrap">
        <Reveal><div className="ev-label ev-label--l">07 <span>What Happens Next?</span></div></Reveal>
        <Reveal delay={80} direction="down"><h2 className="ev-next__h">From First Message<br/>to <em>Working System</em></h2></Reveal>
        <Reveal delay={140}><p className="ev-next__intro">No mystery, no pressure. Here is exactly what happens after you contact us.</p></Reveal>
        <div className="ev-next__tl">
          <div className="ev-next__line" style={{transform:vis?"scaleY(1)":"scaleY(0)"}}/>
          {NEXT_STEPS.map((s,i)=>(
            <Reveal key={i} delay={200+i*160} direction={i%2?"left":"right"}>
              <div className={`ev-next__row${i%2?" ev-next__row--r":""}`}>
                <div className="ev-next__card">
                  <span className="ev-next__num">0{i+1}</span>
                  <h3 className="ev-next__t">{s.t}</h3>
                  <p className="ev-next__d">{s.d}</p>
                </div>
                <span className="ev-next__node" style={{transitionDelay:`${300+i*160}ms`,transform:vis?"translateX(-50%) scale(1)":"translateX(-50%) scale(0)"}}/>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* CONTACT */
function Contact({setPage}) {
  const [f, setF] = useState({name:"",company:"",email:"",phone:"",language:"English",industry:"",interests:[],challenge:""});
  const [consent, setConsent] = useState(false);
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState(null);
  const [sending, setSending] = useState(false);
  const tog = (v) => setF(p=>({...p,interests:p.interests.includes(v)?p.interests.filter(x=>x!==v):[...p.interests,v]}));
  const submit = async (e) => {
    e.preventDefault();
    if (!f.name.trim() || !f.company.trim() || !f.email.trim() || !f.industry || !f.challenge.trim()) { setErr("Please fill in all required fields marked with *."); return; }
    if (f.interests.length === 0) { setErr("Please select at least one area of interest."); return; }
    if (!consent) { setErr("Please accept the privacy policy so we can process your inquiry."); return; }
    setSending(true);
    setErr(null);
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify(f) });
      if (!res.ok) throw new Error();
      setSent(true);
    } catch {
      setErr("Something went wrong. Please email us directly at contact@evrielsystems.com");
    } finally { setSending(false); }
  };
  return (
    <section id="contact" className="ev-contact-sec">
      <div className="ev-contact__wrap">
        <div className="ev-contact__l">
          <Reveal><div className="ev-label ev-label--l">08 <span>Contact</span></div></Reveal>
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
              <form className="ev-form" onSubmit={submit}>
                <div className="ev-form__r"><div className="ev-f"><label>Name <span className="req">*</span></label><input required placeholder="Your full name" value={f.name} onChange={e=>setF(p=>({...p,name:e.target.value}))}/></div><div className="ev-f"><label>Company <span className="req">*</span></label><input required placeholder="Organization" value={f.company} onChange={e=>setF(p=>({...p,company:e.target.value}))}/></div></div>
                <div className="ev-form__r"><div className="ev-f"><label>Email <span className="req">*</span></label><input required type="email" placeholder="your@email.com" value={f.email} onChange={e=>setF(p=>({...p,email:e.target.value}))}/></div><div className="ev-f"><label>Phone <span className="opt">(Optional)</span></label><input placeholder="+1 000 000 0000" value={f.phone} onChange={e=>setF(p=>({...p,phone:e.target.value}))}/></div></div>
                <div className="ev-f"><label>Preferred Language</label><div className="ev-radios">{["English","Italian","Spanish","Greek","Polish","French","German","Other"].map(l=><label key={l} className={`ev-rad${f.language===l?" ev-rad--on":""}`}><input type="radio" name="lang" checked={f.language===l} onChange={()=>setF(p=>({...p,language:l}))} style={{display:"none"}}/>{l}</label>)}</div></div>
                <div className="ev-f"><label>Industry <span className="req">*</span></label><select required className="ev-sel" value={f.industry} onChange={e=>setF(p=>({...p,industry:e.target.value}))}><option value="">Select your industry</option>{["Construction & Engineering","Manufacturing","Tourism & Hospitality","Retail & Commerce","Import & Export","Marketing & SEO","European Projects","NGO & Associations","Professional Services","Startup / SME","Education & Training","Other"].map(x=><option key={x}>{x}</option>)}</select></div>
                <div className="ev-f"><label>What are you interested in? <span className="req">*</span></label><div className="ev-checks">{["AI Automation","Business Intelligence","Digital Transformation","Custom Business Systems","European Project Solutions","Not Sure Yet"].map(x=><label key={x} className={`ev-chk${f.interests.includes(x)?" ev-chk--on":""}`} onClick={()=>tog(x)}><span className="ev-chk__b">{f.interests.includes(x)&&<CheckCircle2 size={12}/>}</span>{x}</label>)}</div></div>
                <div className="ev-f"><label>Tell us about your challenge <span className="req">*</span></label><textarea required rows={5} placeholder="Describe your project, challenge, or business objective..." value={f.challenge} onChange={e=>setF(p=>({...p,challenge:e.target.value}))}/></div>
                <label className="ev-consent"><input type="checkbox" required checked={consent} onChange={e=>setConsent(e.target.checked)}/><span>I agree that Evriel Systems may store and process the information I submit to respond to my inquiry, as described in the <a href="#" onClick={e=>{e.preventDefault();setPage&&setPage("privacy");window.scrollTo({top:0,behavior:"smooth"})}}>Privacy Policy</a>. <span className="req">*</span></span></label>
                {err && <p className="ev-form__err">{err}</p>}
                <button type="submit" className="ev-btn ev-btn--w ev-btn--lg" style={{width:"100%",justifyContent:"center",marginTop:4}} disabled={sending}>{sending ? "Sending..." : "Start the Conversation"} {!sending && <ArrowRight size={17}/>}</button>
              </form>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}

/* FOOTER */
function Footer({setPage}) {
  return (
    <footer className="ev-footer">
      <div className="ev-footer__in">
        <div className="ev-footer__top">
          <div onClick={()=>{setPage("home");window.scrollTo({top:0,behavior:"smooth"})}} style={{cursor:"pointer",display:"flex",alignItems:"center",gap:12}}>
            <LogoMark size={26} color="#7A8D9C"/>
            <div><div style={{width:20,height:1,background:"rgba(201,207,217,0.45)",marginBottom:3}}/><div style={{fontFamily:"var(--sf)",fontSize:14,color:"#fff",letterSpacing:"0.05em"}}>Evriel</div><div style={{fontFamily:"var(--bd)",fontSize:7,color:"rgba(201,207,217,0.55)",letterSpacing:"0.4em",textTransform:"uppercase",marginTop:2}}>Systems</div></div>
          </div>
          <p style={{fontSize:12,color:"rgba(255,255,255,0.2)",fontStyle:"italic",fontFamily:"var(--sf)"}}>Connecting Intelligence with Business</p>
        </div>
        <div className="ev-footer__line"/>
        <div className="ev-footer__bot">
          <span>&copy; {new Date().getFullYear()} Evriel Systems</span>
          <div style={{display:"flex",gap:20,alignItems:"center"}}>
            <a href="#" onClick={e=>{e.preventDefault();setPage("privacy");window.scrollTo({top:0,behavior:"smooth"})}} className="ev-footer__link">Privacy Policy</a>
            <span>contact@evrielsystems.com</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ARTICLES */
const ARTS = [
  { slug:"ai-beyond-chatbots",tag:"AI Strategy",date:"2026",title:"AI Beyond Chatbots: Practical Applications for Real Businesses",excerpt:"AI creates value far beyond conversational interfaces, in operations, analytics, and decision-making.",body:["Artificial Intelligence is often associated with chatbots and virtual assistants. While these tools are valuable, they represent only a small part of what AI can achieve within modern organizations.","Today, businesses are using AI to automate workflows, improve operational efficiency, support decision-making, and create better customer experiences.","One of the most impactful applications of AI is workflow automation. Organizations spend countless hours performing repetitive administrative tasks such as data entry, reporting, document processing, and communication management. Intelligent systems can automate many of these processes, allowing employees to focus on higher-value activities.","AI also plays an increasingly important role in decision support. By analyzing large volumes of business information, intelligent systems can identify patterns, detect inefficiencies, and provide recommendations that help organizations make better decisions.","Customer service is another area where AI creates significant value. Beyond simple chatbots, AI can assist support teams by organizing information, suggesting responses, and providing instant access to organizational knowledge.","The most successful organizations do not adopt AI simply because it is popular. They identify specific business challenges and implement intelligent solutions that generate measurable results.","The future of AI in business is not about replacing people. It is about empowering people with better tools, better information, and better systems.","Organizations that embrace this approach will be better positioned to improve efficiency, increase competitiveness, and adapt to a rapidly changing business environment."]},
  { slug:"automation-failures",tag:"Transformation",date:"2026",title:"Why Most Automation Projects Fail",excerpt:"The gap between automation promise and results is wider than most organizations expect.",body:["Automation is one of the most powerful tools available to modern organizations. However, many automation initiatives fail to deliver the expected benefits.","The primary reason is simple: organizations often attempt to automate inefficient processes. Automation cannot fix a broken workflow. It can only accelerate it.","Before introducing technology, organizations must first understand how work is performed, identify bottlenecks, and redesign inefficient processes. Without this foundation, automation often creates additional complexity instead of solving existing problems.","Another common mistake is focusing on software rather than business objectives. Organizations sometimes purchase new tools without clearly defining the problem they are trying to solve.","Successful automation projects begin with questions such as: What process needs improvement? What outcomes are we trying to achieve? How will success be measured?","Employee adoption is equally important. Even the most advanced automation platform will struggle if users do not understand its purpose or if it disrupts established workflows.","The most successful automation initiatives are not technology projects. They are business improvement projects supported by technology.","When implemented correctly, automation can reduce administrative workloads, improve consistency, increase operational visibility, and enable organizations to scale more effectively.","The goal is not simply to automate tasks. The goal is to build smarter and more efficient systems."]},
  { slug:"ai-construction-engineering",tag:"Industry",date:"2026",title:"AI in Construction and Engineering",excerpt:"Intelligent systems transforming project visibility, communication, and operational control.",body:["Construction and engineering projects generate enormous amounts of information. Drawings, reports, site updates, documentation, schedules, budgets, and communication records are often distributed across multiple systems and stakeholders.","Managing this information efficiently has become one of the industry's greatest challenges.","AI and intelligent systems are creating new opportunities to improve project visibility, communication, and operational control.","AI can support engineering teams by organizing project documentation, monitoring progress, generating reports, and helping identify potential issues before they impact schedules or budgets.","Project managers can benefit from real-time access to information that would otherwise require hours of manual review.","Digital monitoring systems can improve coordination between office teams, engineers, contractors, and site personnel.","Intelligent systems can also support technical knowledge management by ensuring that important information remains accessible throughout the project lifecycle.","The future of construction technology is not simply about digitizing documents. It is about creating connected environments where information flows efficiently between people, processes, and systems.","Organizations that adopt intelligent technologies today will be better positioned to improve productivity, reduce risk, and deliver projects more effectively."]},
  { slug:"digital-transformation-people",tag:"Strategy",date:"2026",title:"Digital Transformation Is About People, Not Software",excerpt:"Why the most expensive transformation failures share the same root cause.",body:["When organizations begin digital transformation initiatives, many focus immediately on technology. New software is purchased. New platforms are implemented. New tools are introduced.","Yet despite significant investments, many transformation projects fail to achieve their intended outcomes.","The reason is simple: digital transformation is not primarily a technology challenge. It is a people and process challenge.","Technology can enable change, but it cannot create it on its own.","Successful organizations first understand how people work, how decisions are made, and how information moves throughout the business. Only then can technology be implemented effectively.","Employees need systems that support their work rather than create additional complexity. Managers need visibility into operations. Leadership teams need reliable information to guide strategic decisions.","When technology aligns with business processes and organizational objectives, transformation becomes sustainable.","The most successful organizations do not simply digitize existing activities. They redesign how work is performed and use technology to create better outcomes.","Digital transformation is ultimately about creating environments where people, processes, and technology work together effectively.","Organizations that understand this principle achieve greater efficiency, adaptability, and long-term growth."]},
  { slug:"intelligent-systems-advantage",tag:"Competitive Edge",date:"2026",title:"Building Competitive Advantage Through Intelligent Systems",excerpt:"How forward-thinking organizations use AI to create sustainable competitive moats.",body:["Every organization is searching for ways to become more efficient, more responsive, and more competitive.","Traditionally, competitive advantage was often created through scale, location, or access to resources.","Today, intelligent systems are becoming one of the most important sources of competitive advantage.","Organizations generate vast amounts of information every day. Customer interactions, operational data, project updates, financial records, and market insights all contain valuable opportunities for improvement.","The challenge is not collecting information. The challenge is transforming information into action.","Intelligent systems help organizations automate repetitive tasks, identify patterns, support decision-making, and improve operational visibility.","By reducing manual work and improving access to information, organizations can respond more quickly to opportunities and challenges.","The goal is not to replace human expertise. The goal is to enhance it.","Organizations that successfully combine human knowledge with intelligent systems are better positioned to adapt, innovate, and grow.","Competitive advantage is no longer created solely through resources. It is increasingly created through intelligence, adaptability, and the ability to make better decisions faster."]},
  { slug:"data-driven-decisions",tag:"Intelligence",date:"2026",title:"Turning Data Into Better Decisions",excerpt:"Organizations drown in data but struggle with decisions. Here's how intelligent systems close the gap.",body:["Modern organizations generate more information than ever before. Operational reports, customer interactions, project updates, financial records, performance metrics all contribute to growing volumes of data.","Yet many organizations continue to struggle with decision-making.","The problem is not a lack of information. The problem is transforming information into meaningful insights.","Without structure and context, data becomes overwhelming rather than useful.","Business intelligence and intelligent systems help organizations organize information, identify patterns, and present insights in ways that support effective decision-making.","When leaders have access to accurate and relevant information, they can identify opportunities more quickly, address problems earlier, and allocate resources more effectively.","Data-driven organizations are often more agile because decisions are supported by evidence rather than assumptions.","However, successful data utilization requires more than dashboards and reports. Organizations must establish processes that ensure information is accessible, reliable, and aligned with business objectives.","The future belongs to organizations that can transform information into intelligence and intelligence into action.","Better decisions create better outcomes. Intelligent systems make those decisions easier to achieve."]},
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
      <section className="ev-art-body"><div className="ev-art-body__in"><div className="ev-art-body__content">{art.body.map((p,i)=><Reveal key={i} delay={i*30}><p className="ev-art-body__p">{p}</p></Reveal>)}<Reveal delay={200}><div className="ev-art-body__cta"><p>Ready to implement intelligent systems?</p><a href="#" className="ev-btn ev-btn--dk" onClick={e=>{e.preventDefault();setPage("home");setTimeout(()=>document.getElementById("contact")?.scrollIntoView({behavior:"smooth"}),300)}}>Let's Discuss Your Project <ArrowRight size={15}/></a></div></Reveal></div><div className="ev-art-body__side"><h4 className="ev-art-side__h">More Articles</h4>{others.map((a,i)=><Reveal key={i} delay={i*70}><div className="ev-art-side__item" onClick={()=>{setSlug(a.slug);window.scrollTo({top:0,behavior:"smooth"})}}><span className="ev-art-side__tag">{a.tag}</span><p className="ev-art-side__t">{a.title}</p></div></Reveal>)}</div></div></section>
    </>
  );
}

/* PRIVACY POLICY */
function PrivacyPage() {
  return (
    <section className="ev-privacy">
      <div className="ev-privacy__wrap">
        <Reveal><h1 className="ev-privacy__h">Privacy <em>Policy</em></h1></Reveal>
        <Reveal delay={60}><p className="ev-privacy__updated">Last updated: June 2026</p></Reveal>
        <div className="ev-privacy__content">
          <Reveal delay={100}>
            <h2>Who We Are</h2>
            <p>Evriel Systems is an AI and digital transformation consultancy based in Europe. This policy explains how we collect, use, and protect your information when you use our website (evrielsystems.com).</p>
          </Reveal>
          <Reveal delay={140}>
            <h2>Information We Collect</h2>
            <p>When you submit our contact form, we collect: your name, company name, email address, phone number (optional), preferred language, industry, areas of interest, and project description. We collect this information solely to respond to your inquiry.</p>
          </Reveal>
          <Reveal delay={180}>
            <h2>How We Use Your Information</h2>
            <p>We use the information you provide exclusively to respond to your inquiry, discuss potential projects, and provide requested services. We do not sell, rent, or share your personal information with third parties. We do not use your information for marketing purposes unless you explicitly consent.</p>
          </Reveal>
          <Reveal delay={220}>
            <h2>Cookies</h2>
            <p>This website uses only essential cookies required for basic functionality (such as remembering your cookie consent preference). We do not use tracking cookies, advertising cookies, or third-party analytics that track individual users.</p>
          </Reveal>
          <Reveal delay={260}>
            <h2>Your Rights (GDPR)</h2>
            <p>Under the General Data Protection Regulation (GDPR), you have the right to access, correct, or delete any personal data we hold about you. You may also withdraw consent at any time. To exercise any of these rights, contact us at <a href="mailto:contact@evrielsystems.com">contact@evrielsystems.com</a>.</p>
          </Reveal>
          <Reveal delay={300}>
            <h2>Data Retention</h2>
            <p>We retain contact form submissions only as long as necessary to respond to your inquiry and for legitimate business purposes. You may request deletion of your data at any time.</p>
          </Reveal>
          <Reveal delay={340}>
            <h2>Contact</h2>
            <p>For any privacy-related questions or data requests, contact us at <a href="mailto:contact@evrielsystems.com">contact@evrielsystems.com</a>.</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* APP */
export default function EvrielSystems() {
  const [page, setPage] = useState("home");
  const [slug, setSlug] = useState(null);
  useSEO();
  return (
    <>
      <style>{`
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@300;400;500;600&display=swap');
:root{--bk:#131A21;--wh:#EEF1F4;--pt:#9AACB8;--pl:#7A8D9C;--ac:#4ECDB4;--ac2:#7DDCC8;--acg:rgba(78,205,180,0.14);--dk:#0F151B;--mg:#0C1117;--sf:'DM Serif Display',Georgia,serif;--bd:'Inter',-apple-system,sans-serif}
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth}
body{font-family:var(--bd);background:var(--bk);color:var(--bk);-webkit-font-smoothing:antialiased}
::selection{background:rgba(78,205,180,0.3);color:#fff}
::-webkit-scrollbar{width:10px}
::-webkit-scrollbar-track{background:var(--bk)}
::-webkit-scrollbar-thumb{background:#3D4A55;border-radius:5px;border:2px solid var(--bk)}
::-webkit-scrollbar-thumb:hover{background:#4E5D6A}
button,input,textarea,select{font-family:inherit;background:none;border:none;cursor:pointer}
a{text-decoration:none;color:inherit}
em{font-family:var(--sf);font-style:italic}
.dbr{display:block}
@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:0.01ms!important;animation-iteration-count:1!important;transition-duration:0.01ms!important}html{scroll-behavior:auto}}
@keyframes logospin{from{transform:translate(-50%,-50%) rotate(0deg)}to{transform:translate(-50%,-50%) rotate(360deg)}}
@keyframes cpulse{0%,100%{opacity:1}50%{opacity:0.4}}
@keyframes ringP{0%,100%{transform:scale(1);opacity:0.5}50%{transform:scale(1.06);opacity:0.15}}
@keyframes mq{from{transform:translateX(0)}to{transform:translateX(-25%)}}
@keyframes scBob{0%,100%{transform:translateY(0);opacity:1}50%{transform:translateY(10px);opacity:0.3}}
@keyframes flowDash{to{stroke-dashoffset:-24}}
@keyframes acPulse{0%,100%{box-shadow:0 0 0 0 rgba(78,205,180,0.35)}50%{box-shadow:0 0 0 7px rgba(78,205,180,0)}}
@keyframes orbDrift{0%,100%{transform:translate(0,0)}33%{transform:translate(30px,-40px)}66%{transform:translate(-25px,30px)}}

/* NAV */
.ev-nav{position:fixed;top:0;left:0;right:0;z-index:999;padding:18px 0;transition:all 0.5s ${EASE}}
.ev-nav--s{background:rgba(19,26,33,0.82);backdrop-filter:blur(24px);padding:10px 0;box-shadow:0 1px 0 rgba(125,220,200,0.08)}
.ev-nav__in{max-width:1440px;margin:0 auto;padding:0 48px;display:flex;align-items:center;justify-content:space-between}
.ev-nav__links{display:flex;align-items:center;gap:30px}
.ev-nav__link{font-size:12px;font-weight:400;letter-spacing:0.07em;text-transform:uppercase;transition:opacity 0.3s}.ev-nav__link:hover{opacity:0.5}
.ev-nav__cta{font-size:11px;font-weight:600;letter-spacing:0.09em;text-transform:uppercase;padding:10px 22px;background:var(--ac);color:#0A1A16;border-radius:2px;transition:all 0.3s ${EASE}}.ev-nav__cta:hover{background:var(--ac2);box-shadow:0 0 24px rgba(78,205,180,0.35)}
.ev-nav__burger{display:none}
.ev-mobile-menu{position:fixed;inset:0;background:var(--bk);z-index:998;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;padding-top:60px}
.ev-mob-link{font-family:var(--sf);font-size:32px;color:#fff;transition:opacity 0.3s}.ev-mob-link:hover{opacity:0.5}

/* HERO */
.ev-hero{position:relative;height:100vh;min-height:680px;display:flex;align-items:center;justify-content:center;background:var(--bk);overflow:hidden}
.ev-hero::after{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 90% 55% at 50% -12%,rgba(200,240,230,0.13),rgba(100,200,175,0.05) 45%,transparent 70%);pointer-events:none}
.ev-hero__bg{position:absolute;inset:0;pointer-events:none}
.ev-hero__grid{position:absolute;inset:0;background-image:linear-gradient(rgba(125,220,200,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(125,220,200,0.03) 1px,transparent 1px);background-size:80px 80px}
.ev-hero__rad{position:absolute;inset:0;background:radial-gradient(ellipse 70% 55% at 50% 50%,rgba(78,205,180,0.07),transparent)}
.ev-hero__orb{position:absolute;top:12%;right:8%;width:420px;height:420px;border-radius:50%;background:radial-gradient(circle,rgba(78,205,180,0.08),transparent 65%);animation:orbDrift 18s ease-in-out infinite;pointer-events:none}
.ev-hero__ghost{position:absolute;top:50%;left:50%;animation:logospin 90s linear infinite}
.ev-hero__body{position:relative;z-index:2;text-align:center;padding:0 24px;max-width:1100px}
.ev-hero__eyebrow{font-size:11px;letter-spacing:0.28em;text-transform:uppercase;color:var(--ac2);opacity:0.75;margin-bottom:36px}
.ev-hero__brand{display:flex;align-items:center;gap:24px;justify-content:center;margin-bottom:28px}
.ev-hero__brand-text{text-align:left}
.ev-hero__brand-line{width:48px;height:2px;background:linear-gradient(90deg,var(--pl),transparent);margin-bottom:8px}
.ev-hero__brand-name{font-family:var(--sf);font-size:clamp(52px,8vw,100px);font-weight:400;color:#fff;letter-spacing:0.03em;line-height:0.9}
.ev-hero__brand-sub{font-family:var(--bd);font-size:clamp(12px,1.8vw,20px);font-weight:300;letter-spacing:0.55em;color:var(--pl);display:block;margin-top:6px}
.ev-hero__h2{font-family:var(--sf);font-size:clamp(20px,2.6vw,34px);font-weight:400;color:rgba(255,255,255,0.7);line-height:1.35;letter-spacing:0.01em}
.ev-hero__h2 em{color:var(--pt)}
.ev-hero__sub{font-size:clamp(14px,1.4vw,17px);font-weight:300;color:rgba(255,255,255,0.32);margin-top:24px;line-height:1.7}
.ev-hero__ctas{display:flex;gap:14px;justify-content:center;margin-top:40px;flex-wrap:wrap}
.ev-hero__scroll{position:absolute;bottom:32px;left:50%;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:10px;color:rgba(255,255,255,0.25);font-size:10px;letter-spacing:0.22em;text-transform:uppercase}
.ev-scr-pill{width:20px;height:30px;border:1px solid rgba(255,255,255,0.15);border-radius:10px;display:flex;justify-content:center;padding-top:6px}
.ev-scr-dot{width:3px;height:7px;background:var(--ac);border-radius:2px;animation:scBob 2s ease-in-out infinite}

/* BUTTONS */
.ev-btn{display:inline-flex;align-items:center;gap:10px;font-size:12px;font-weight:500;letter-spacing:0.09em;text-transform:uppercase;padding:15px 30px;transition:all 0.4s ${EASE};border:1px solid transparent;cursor:pointer}
.ev-btn--w{background:var(--ac);color:#0A1A16;border-radius:2px}.ev-btn--w:hover{background:var(--ac2);transform:translateY(-2px);box-shadow:0 8px 32px rgba(78,205,180,0.35)}
.ev-btn--gh{border-color:rgba(125,220,200,0.25);color:#fff;border-radius:2px}.ev-btn--gh:hover{border-color:var(--ac);box-shadow:inset 0 0 24px rgba(78,205,180,0.08)}
.ev-btn--dk{background:var(--ac);color:#0A1A16;border-radius:2px}.ev-btn--dk:hover{background:var(--ac2);transform:translateY(-2px);box-shadow:0 8px 32px rgba(78,205,180,0.35)}
.ev-btn--lg{padding:18px 42px;font-size:13px}
.ev-btn:disabled{opacity:0.5;cursor:not-allowed;transform:none}

/* PROGRESS */
.ev-progress{position:fixed;top:0;left:0;right:0;height:2px;z-index:1001;background:transparent;pointer-events:none}
.ev-progress__bar{height:100%;background:linear-gradient(90deg,var(--ac),var(--ac2));transform-origin:left;transform:scaleX(0)}

/* LABELS */
.ev-label{font-size:12px;font-weight:500;letter-spacing:0.18em;text-transform:uppercase;color:var(--ac);margin-bottom:20px;display:flex;gap:10px}
.ev-label span{color:rgba(244,247,252,0.45)}
.ev-label--l{color:var(--ac)}.ev-label--l span{color:rgba(244,247,252,0.45)}

/* MARQUEE */
.ev-mq{background:var(--mg);padding:13px 0;overflow:hidden;border-top:1px solid rgba(255,255,255,0.04);border-bottom:1px solid rgba(255,255,255,0.04)}
.ev-mq__track{display:flex;gap:48px;white-space:nowrap;animation:mq 16s linear infinite}
.ev-mq__i{display:inline-flex;align-items:center;gap:12px;font-size:11px;font-weight:500;letter-spacing:0.14em;text-transform:uppercase;color:rgba(255,255,255,0.35)}
.ev-mq__dot{width:4px;height:4px;border-radius:50%;background:var(--ac);opacity:0.6}

/* About */
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
.ev-conv{width:100%;max-width:460px}
.ev-challenges{width:100%;display:flex;flex-direction:column;gap:8px}
.ev-ch{display:flex;align-items:center;gap:12px;padding:11px 16px;border:1px solid rgba(255,255,255,0.05);color:rgba(255,255,255,0.55);font-size:13px;transition:all 0.35s ${EASE}}
.ev-ch:hover{border-color:rgba(255,255,255,0.15);background:rgba(255,255,255,0.03);color:#fff}
.ev-ch svg{color:var(--ac);flex-shrink:0}

/* Industries */
.ev-ind-sec{background:linear-gradient(to bottom,var(--dk),var(--bk));padding:120px 0 140px;position:relative;overflow:hidden}
.ev-ind-sec::before{content:'';position:absolute;top:0;left:0;right:0;height:120px;background:linear-gradient(to bottom,var(--dk),transparent);pointer-events:none;z-index:1}
.ev-ind__wrap{max-width:1440px;margin:0 auto;padding:0 48px;position:relative;z-index:2;display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center}
.ev-ind__h{font-family:var(--sf);font-size:clamp(40px,4.5vw,68px);font-weight:400;color:#fff;line-height:1.08;margin-bottom:40px}
.ev-ind__h em{color:var(--pt)}
.ev-ind__detail{min-height:170px;animation:indFade 0.55s ${EASE}}
@keyframes indFade{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
.ev-ind__dnum{font-family:var(--sf);font-size:13px;color:var(--ac);letter-spacing:0.15em;display:block;margin-bottom:14px}
.ev-ind__dname{font-family:var(--sf);font-size:clamp(26px,2.8vw,38px);font-weight:400;color:#fff;line-height:1.15;margin-bottom:14px}
.ev-ind__ddesc{font-size:14px;line-height:1.75;color:rgba(255,255,255,0.42);max-width:440px}
.ev-ind__dots{display:flex;gap:9px;margin-top:30px;flex-wrap:wrap}
.ev-ind__dot{width:8px;height:8px;border-radius:50%;border:none;padding:0;background:rgba(125,220,200,0.18);cursor:pointer;transition:all 0.4s ${EASE}}
.ev-ind__dot--on{background:var(--ac);transform:scale(1.45);box-shadow:0 0 10px rgba(78,205,180,0.6)}
/* orbit wheel */
.ev-orbit{--orbR:235px;position:relative;width:560px;height:560px;margin:0 auto}
.ev-orbit__ring{position:absolute;inset:45px;border:1px solid rgba(125,220,200,0.14);border-radius:50%}
.ev-orbit__ring--in{inset:150px;border-color:rgba(125,220,200,0.07)}
.ev-orbit__spin{position:absolute;inset:0;animation:orbSpin 70s linear infinite}
.ev-orbit:hover .ev-orbit__spin,.ev-orbit:hover .ev-orbit__upright{animation-play-state:paused}
@keyframes orbSpin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes orbSpinRev{from{transform:rotate(0deg)}to{transform:rotate(-360deg)}}
.ev-orbit__pos{position:absolute;top:50%;left:50%;width:0;height:0}
.ev-orbit__node{position:absolute;transform:translate(-50%,-50%);border:1px solid rgba(125,220,200,0.18);background:rgba(10,16,29,0.85);color:rgba(255,255,255,0.55);font-family:var(--bd);font-size:10.5px;letter-spacing:0.06em;text-transform:uppercase;padding:9px 14px;border-radius:99px;cursor:pointer;white-space:nowrap;transition:all 0.4s ${EASE};backdrop-filter:blur(4px)}
.ev-orbit__node--on{border-color:var(--ac);background:rgba(78,205,180,0.14);color:#fff;box-shadow:0 0 24px rgba(78,205,180,0.35)}
.ev-orbit__node:hover{color:#fff;border-color:rgba(125,220,200,0.5)}
.ev-orbit__upright{position:absolute;width:0;height:0;animation:orbSpinRev 70s linear infinite}
.ev-orbit__hub{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:130px;height:130px;border-radius:50%;border:1px solid rgba(125,220,200,0.25);background:radial-gradient(circle,rgba(78,205,180,0.12),rgba(10,16,29,0.9) 70%);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;text-align:center;animation:acPulse 4s ease-in-out infinite}
.ev-orbit__hub span{font-family:var(--sf);font-size:12px;letter-spacing:0.08em;color:rgba(255,255,255,0.8);line-height:1.35}

/* Outcomes — auto-cycling spotlight */
@keyframes outRing{from{stroke-dashoffset:641}to{stroke-dashoffset:0}}
@keyframes outFill{from{width:0}to{width:100%}}
@keyframes outNum{from{opacity:0;transform:translateY(18px) scale(0.96)}to{opacity:1;transform:translateY(0) scale(1)}}
@keyframes beamDrift{0%,100%{opacity:0.25;transform:translateY(0)}50%{opacity:0.55;transform:translateY(-30px)}}
.ev-out-sec{background:linear-gradient(to bottom,var(--bk),var(--dk));padding:130px 0;position:relative;overflow:hidden}
.ev-out-sec::before{content:'';position:absolute;inset:0;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='p'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='240' height='240' filter='url(%23p)'/%3E%3C/svg%3E");opacity:0.05;mix-blend-mode:overlay;pointer-events:none}

.ev-out__wrap{max-width:1240px;margin:0 auto;padding:0 48px;position:relative;z-index:2;display:grid;grid-template-columns:0.9fr 1.1fr;gap:80px;align-items:start}
.ev-out__h{font-family:var(--sf);font-size:clamp(28px,3.4vw,44px);font-weight:400;color:#fff;line-height:1.18;margin-top:26px}
.ev-out__h em{color:var(--pt)}
.ev-out__intro{font-size:14px;font-weight:300;line-height:1.75;color:rgba(255,255,255,0.38);margin-top:18px;max-width:380px}
.ev-out__display{position:relative;width:220px;height:220px;margin-top:44px}
.ev-out__ring{position:absolute;inset:0;transform:rotate(-90deg)}
.ev-out__ring-bg{fill:none;stroke:rgba(125,220,200,0.1);stroke-width:1}
.ev-out__bignum{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:var(--sf);font-size:74px;color:#fff}
.ev-out__list{display:flex;flex-direction:column}
.ev-out2{border-top:1px solid rgba(255,255,255,0.07);position:relative;cursor:pointer;transition:background 0.5s ${EASE}}
.ev-out2:last-child{border-bottom:1px solid rgba(255,255,255,0.07)}
.ev-out2--on{background:linear-gradient(90deg,rgba(78,205,180,0.05),transparent 70%)}
.ev-out2__head{display:flex;align-items:center;gap:24px;padding:24px 14px}
.ev-out2__ix{font-family:var(--sf);font-size:14px;color:rgba(255,255,255,0.22);transition:color 0.4s}
.ev-out2--on .ev-out2__ix{color:var(--ac)}
.ev-out2__t{font-family:var(--sf);font-size:clamp(19px,2.2vw,26px);font-weight:400;color:rgba(255,255,255,0.45);transition:color 0.5s ${EASE};flex:1}
.ev-out2--on .ev-out2__t{color:#fff}
.ev-out2__chev{color:var(--ac);opacity:0;transform:translateX(-8px);transition:all 0.45s ${EASE};display:flex}
.ev-out2--on .ev-out2__chev{opacity:1;transform:translateX(0)}
.ev-out2__body{max-height:0;overflow:hidden;transition:max-height 0.7s ${EASE}}
.ev-out2--on .ev-out2__body{max-height:120px}
.ev-out2__body p{font-size:13.5px;font-weight:300;line-height:1.7;color:rgba(255,255,255,0.42);padding:0 14px 24px 52px;max-width:520px}


/* Services */
.ev-svc-sec{background:linear-gradient(to bottom,var(--bk),#0E1626,var(--bk));padding:140px 0;position:relative}
.ev-svc__wrap{max-width:1440px;margin:0 auto;padding:0 48px}
.ev-svc__h{font-family:var(--sf);font-size:clamp(40px,4.5vw,68px);font-weight:400;color:#fff;line-height:1.08;margin-bottom:18px}
.ev-svc__h em{color:var(--pt)}
.ev-svc__intro{font-family:var(--sf);font-size:18px;font-style:italic;color:var(--pt);margin-bottom:40px;max-width:560px;line-height:1.5}
.ev-svc{display:grid;grid-template-columns:90px 1fr 1fr;gap:36px;padding:40px 0;border-top:1px solid rgba(255,255,255,0.06);position:relative;transition:padding-left 0.4s ${EASE};align-items:start}
.ev-svc:last-child{border-bottom:1px solid rgba(255,255,255,0.06)}
.ev-svc:hover{padding-left:14px}
.ev-svc__bar{position:absolute;left:0;top:0;width:2px;height:0;background:var(--ac);box-shadow:0 0 12px rgba(78,205,180,0.4);transition:height 0.6s ${EASE}}
.ev-svc:hover .ev-svc__bar{height:100%}
.ev-svc__l{display:flex;flex-direction:column;gap:12px;padding-top:4px}
.ev-svc__gn{font-family:var(--sf);font-size:44px;color:rgba(255,255,255,0.04);line-height:1}
.ev-svc__l svg{color:var(--pt)}
.ev-svc__t{font-family:var(--sf);font-size:26px;font-weight:400;color:#fff;margin-bottom:10px}
.ev-svc__d{font-size:14px;line-height:1.72;color:rgba(255,255,255,0.4)}
.ev-flow{display:flex;align-items:center;flex-wrap:wrap;gap:6px;margin-top:18px}
.ev-flow__seg{display:flex;align-items:center;gap:6px}
.ev-flow__node{font-size:10px;font-weight:500;letter-spacing:0.08em;text-transform:uppercase;padding:6px 12px;border:1px solid rgba(125,220,200,0.2);border-radius:2px;color:rgba(244,247,252,0.6);background:rgba(125,220,200,0.03);white-space:nowrap}
.ev-flow__node--end{border-color:var(--ac);color:var(--ac2);background:rgba(78,205,180,0.08)}
.ev-flow__link{flex-shrink:0}
.ev-svc__al{font-size:10px;font-weight:500;letter-spacing:0.16em;text-transform:uppercase;color:rgba(255,255,255,0.2);margin-bottom:12px}
.ev-svc__r ul{list-style:none;display:flex;flex-direction:column;gap:7px}
.ev-svc__r li{font-size:13px;color:rgba(255,255,255,0.4);padding-left:14px;position:relative}
.ev-svc__r li::before{content:'';position:absolute;left:0;top:7px;width:4px;height:4px;border-radius:50%;background:rgba(255,255,255,0.12)}

/* Projects */
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
.ev-prj__badge{font-size:9px;letter-spacing:0.1em;text-transform:uppercase;padding:4px 10px;border:1px solid rgba(78,205,180,0.4);color:var(--ac2);font-weight:500;font-family:var(--bd);background:rgba(78,205,180,0.06)}
.ev-prj__tog{color:rgba(255,255,255,0.3)}
.ev-prj__bd{padding:16px 0 4px 46px}
.ev-prj__bd>p:first-child{font-size:14px;line-height:1.72;color:rgba(255,255,255,0.38);margin-bottom:14px;max-width:560px}
.ev-prj__caps{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px}
.ev-prj__cap{font-size:10px;letter-spacing:0.06em;text-transform:uppercase;padding:5px 12px;border:1px solid rgba(255,255,255,0.08);color:rgba(255,255,255,0.4);transition:all 0.3s}
.ev-prj__cap:hover{border-color:rgba(78,205,180,0.5);color:var(--ac2)}
.ev-prj__tl{font-family:var(--sf);font-size:14px;font-style:italic;color:rgba(217,217,217,0.5)}
.ev-prj__more{display:inline-flex;align-items:center;gap:8px;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;font-weight:500;color:var(--pt);margin-top:16px;transition:gap 0.3s ${EASE};background:none;border:none;cursor:pointer;padding:0}
.ev-prj__more:hover{gap:14px}
.ev-prj__detail{margin-top:24px;padding-top:24px;border-top:1px solid rgba(255,255,255,0.06)}
.ev-prj__detail-sec{margin-bottom:22px}
.ev-prj__detail-sec h4{font-family:var(--sf);font-size:16px;font-weight:400;color:var(--pt);margin-bottom:10px}
.ev-prj__detail-sec p{font-size:14px;line-height:1.72;color:rgba(255,255,255,0.38);max-width:600px}
.ev-prj__detail-sec ul{list-style:none;display:flex;flex-direction:column;gap:6px}
.ev-prj__detail-sec li{font-size:13px;color:rgba(255,255,255,0.4);padding-left:14px;position:relative}
.ev-prj__detail-sec li::before{content:'';position:absolute;left:0;top:7px;width:4px;height:4px;border-radius:50%;background:var(--ac)}

/* Process */
.ev-proc-sec{background:linear-gradient(to bottom,var(--mg),var(--dk),var(--bk));padding:140px 0}
.ev-proc__wrap{max-width:1440px;margin:0 auto;padding:0 48px}
.ev-proc__h{font-family:var(--sf);font-size:clamp(40px,4.5vw,68px);font-weight:400;color:#fff;line-height:1.08;margin-bottom:18px}
.ev-proc__h em{color:var(--pt)}
.ev-proc__intro{font-size:15px;line-height:1.7;color:rgba(255,255,255,0.35);max-width:560px;margin-bottom:56px}
.ev-proc__grid{display:grid;grid-template-columns:repeat(5,1fr);gap:0;position:relative}
.ev-proc__grid::before{content:'';position:absolute;top:20px;left:0;right:0;height:1px;background:linear-gradient(90deg,var(--ac),rgba(125,220,200,0.25) 55%,rgba(125,220,200,0.06))}
.ev-proc__grid::after{content:'';position:absolute;top:18.5px;left:0;width:42px;height:4px;border-radius:2px;background:var(--ac);filter:blur(1px);animation:procRun 7s ${EASE} infinite}
@keyframes procRun{0%{left:0;opacity:0}8%{opacity:1}92%{opacity:1}100%{left:calc(100% - 42px);opacity:0}}
.ev-proc__card{padding:0 24px 36px;border-right:1px solid rgba(255,255,255,0.04);transition:background 0.4s}
.ev-proc__card:last-child{border-right:none}
.ev-proc__card:hover{background:rgba(255,255,255,0.015)}
.ev-proc__num{font-family:var(--sf);font-size:12px;color:rgba(125,220,200,0.4);margin-bottom:24px;padding-top:10px;letter-spacing:0.1em}
.ev-proc__dot{width:8px;height:8px;border-radius:50%;background:var(--ac);margin-bottom:20px;transition:transform 0.4s;animation:acPulse 3s ease-in-out infinite}
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
.ev-why__card svg{color:var(--ac);margin-bottom:18px}
.ev-why__card h3{font-family:var(--sf);font-size:19px;color:#fff;margin-bottom:8px;font-weight:400}
.ev-why__card p{font-size:13px;line-height:1.6;color:rgba(255,255,255,0.32)}

/* Trust */
.ev-trust-sec{background:linear-gradient(to bottom,var(--bk),#0A111F);padding:140px 0}
.ev-trust__wrap{max-width:1440px;margin:0 auto;padding:0 48px;display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:start}
.ev-trust__h{font-family:var(--sf);font-size:clamp(38px,4.2vw,62px);font-weight:400;color:#fff;line-height:1.08;margin-bottom:24px}
.ev-trust__h em{color:var(--pt)}
.ev-trust__p{font-size:15px;line-height:1.75;color:rgba(255,255,255,0.35);margin-bottom:12px}
.ev-trust__note{display:flex;gap:14px;align-items:flex-start;margin-top:24px;padding:18px 20px;border:1px solid rgba(255,255,255,0.07);background:rgba(255,255,255,0.02)}
.ev-trust__note svg{color:var(--ac);flex-shrink:0;margin-top:2px}
.ev-trust__note p{font-size:13px;line-height:1.7;color:rgba(255,255,255,0.4)}
.ev-trust__note p strong{color:#fff;font-weight:600}
.ev-trust__r{display:flex;flex-direction:column;gap:14px}
.ev-trust__card{display:flex;gap:14px;padding:20px 18px;border:1px solid rgba(255,255,255,0.05);transition:all 0.4s ${EASE}}
.ev-trust__card:hover{border-color:rgba(255,255,255,0.12);background:rgba(255,255,255,0.02)}
.ev-trust__ci{color:var(--ac);flex-shrink:0;margin-top:2px}
.ev-trust__ct{font-family:var(--sf);font-size:16px;color:#fff;margin-bottom:3px}
.ev-trust__cd{font-size:12px;color:rgba(255,255,255,0.3);line-height:1.55}

/* Statement */
.ev-stmt{position:relative;background:var(--bk);padding:150px 48px;display:flex;align-items:center;justify-content:center;min-height:60vh;overflow:hidden}
.ev-stmt__bg{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)}
.ev-stmt__body{position:relative;z-index:2;text-align:center}
.ev-stmt__h{font-family:var(--sf);font-size:clamp(30px,4.2vw,60px);font-weight:400;color:#fff;line-height:1.2;margin-bottom:40px}
.ev-stmt__h em{color:var(--pt)}

/* What Happens Next */
.ev-next-sec{background:linear-gradient(to bottom,var(--bk),var(--dk));padding:140px 0 120px;overflow:hidden}
.ev-next__wrap{max-width:1000px;margin:0 auto;padding:0 48px}
.ev-next__h{font-family:var(--sf);font-size:clamp(38px,4.4vw,62px);font-weight:400;color:#fff;line-height:1.1;margin-bottom:18px}
.ev-next__h em{color:var(--pt)}
.ev-next__intro{font-size:15px;line-height:1.7;color:rgba(255,255,255,0.4);max-width:520px;margin-bottom:64px}
.ev-next__tl{position:relative;padding:10px 0 4px}
.ev-next__line{position:absolute;top:0;bottom:0;left:50%;width:1px;background:linear-gradient(to bottom,var(--ac),rgba(125,220,200,0.25) 60%,rgba(125,220,200,0.05));transform-origin:top;transition:transform 2.4s ${EASE} 200ms}
.ev-next__row{position:relative;display:flex;justify-content:flex-start;padding:26px 0}
.ev-next__row--r{justify-content:flex-end}
.ev-next__card{width:44%;padding:28px 30px;border:1px solid rgba(125,220,200,0.12);background:rgba(125,220,200,0.025);transition:all 0.45s ${EASE}}
.ev-next__card:hover{border-color:rgba(78,205,180,0.45);background:rgba(125,220,200,0.05);transform:translateY(-4px);box-shadow:0 14px 40px rgba(0,0,0,0.35)}
.ev-next__num{font-family:var(--sf);font-size:13px;color:var(--ac);letter-spacing:0.12em;display:block;margin-bottom:12px}
.ev-next__t{font-family:var(--sf);font-size:21px;font-weight:400;color:#fff;margin-bottom:10px;line-height:1.25}
.ev-next__d{font-size:13.5px;line-height:1.7;color:rgba(255,255,255,0.4)}
.ev-next__node{position:absolute;top:50%;left:50%;width:11px;height:11px;border-radius:50%;background:var(--ac);box-shadow:0 0 0 5px rgba(78,205,180,0.12);transition:transform 0.6s ${EASE};animation:acPulse 3s ease-in-out infinite}

/* Contact */
.ev-contact-sec{background:linear-gradient(to bottom,var(--bk),#091020);padding:140px 0}
.ev-contact__wrap{max-width:1440px;margin:0 auto;padding:0 48px;display:grid;grid-template-columns:5fr 7fr;gap:80px;align-items:start}
.ev-contact__h{font-family:var(--sf);font-size:clamp(36px,4vw,60px);font-weight:400;color:#fff;line-height:1.1;margin-bottom:16px}
.ev-contact__h em{color:var(--pt)}
.ev-contact__p{font-size:14px;line-height:1.72;color:rgba(255,255,255,0.35);margin-bottom:36px;max-width:380px}
.ev-contact__info{display:flex;flex-direction:column;gap:20px}
.ev-contact__bl{font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(255,255,255,0.2);margin-bottom:4px}
.ev-contact__bv{font-family:var(--sf);font-size:17px;color:rgba(255,255,255,0.7);transition:opacity 0.3s}.ev-contact__bv:hover{opacity:0.5}
.ev-form{display:flex;flex-direction:column;gap:22px;padding:36px;border:1px solid rgba(255,255,255,0.06);background:rgba(255,255,255,0.02)}
.ev-form__r{display:grid;grid-template-columns:1fr 1fr;gap:18px}
.ev-form__err{font-size:13px;color:#e55;line-height:1.5;padding:12px 16px;border:1px solid rgba(255,100,100,0.2);background:rgba(255,100,100,0.05)}
.ev-f{display:flex;flex-direction:column;gap:7px}
.ev-f label{font-size:10px;font-weight:500;letter-spacing:0.14em;text-transform:uppercase;color:rgba(255,255,255,0.35)}
.opt{font-weight:400;opacity:0.5;letter-spacing:0;text-transform:none}
.req{color:var(--ac)}
.ev-consent{display:flex;gap:11px;align-items:flex-start;font-size:12px;line-height:1.65;color:rgba(255,255,255,0.45);cursor:pointer;margin-top:2px}
.ev-consent input{margin-top:3px;accent-color:var(--ac);width:14px;height:14px;flex-shrink:0;cursor:pointer}
.ev-consent a{color:var(--pt);text-decoration:underline;text-underline-offset:2px}
.ev-consent a:hover{color:#fff}
.ev-f input{border:none;border-bottom:1px solid rgba(255,255,255,0.1);background:transparent;padding:10px 0;font-size:14px;color:#fff;outline:none;transition:border-color 0.3s}
.ev-f input:focus{border-bottom-color:var(--ac)}
.ev-f input::placeholder{color:rgba(255,255,255,0.2)}
.ev-sel{border:none;border-bottom:1px solid rgba(255,255,255,0.1);background:transparent;padding:10px 0;font-size:14px;color:rgba(255,255,255,0.6);outline:none;appearance:none}
.ev-sel option{background:var(--bk);color:#fff}
.ev-f textarea{border:1px solid rgba(255,255,255,0.08);background:rgba(255,255,255,0.02);padding:14px;font-size:14px;color:#fff;line-height:1.65;resize:vertical;outline:none;transition:border-color 0.3s}
.ev-f textarea:focus{border-color:rgba(78,205,180,0.5)}
.ev-f textarea::placeholder{color:rgba(255,255,255,0.18)}
.ev-radios{display:flex;flex-wrap:wrap;gap:7px}
.ev-rad{font-size:12px;padding:7px 14px;border:1px solid rgba(255,255,255,0.08);color:rgba(255,255,255,0.45);transition:all 0.3s;user-select:none}
.ev-rad--on{background:rgba(78,205,180,0.12);color:#fff;border-color:rgba(78,205,180,0.45)}
.ev-checks{display:grid;grid-template-columns:1fr 1fr;gap:7px}
.ev-chk{display:flex;align-items:center;gap:9px;font-size:12px;padding:8px 12px;border:1px solid rgba(255,255,255,0.06);color:rgba(255,255,255,0.45);cursor:pointer;transition:all 0.3s;user-select:none}
.ev-chk--on{background:rgba(78,205,180,0.08);border-color:rgba(78,205,180,0.35);color:#fff}
.ev-chk__b{width:16px;height:16px;border:1px solid rgba(255,255,255,0.15);border-radius:2px;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all 0.3s}
.ev-chk--on .ev-chk__b{background:var(--ac);border-color:var(--ac);color:#0A1A16}
.ev-sent{display:flex;flex-direction:column;align-items:center;text-align:center;padding:80px 40px;color:#fff}
.ev-sent h3{font-family:var(--sf);font-size:30px;margin:20px 0 10px}
.ev-sent p{font-size:14px;color:rgba(255,255,255,0.45);line-height:1.6;max-width:340px}
.ev-sent svg{color:var(--ac)}

/* Footer */
.ev-footer{background:var(--bk);padding:44px 0 28px;border-top:1px solid rgba(255,255,255,0.04)}
.ev-footer__in{max-width:1440px;margin:0 auto;padding:0 48px}
.ev-footer__top{display:flex;justify-content:space-between;align-items:center;margin-bottom:28px}
.ev-footer__line{height:1px;background:rgba(255,255,255,0.04);margin-bottom:20px}
.ev-footer__bot{display:flex;justify-content:space-between;font-size:11px;color:rgba(255,255,255,0.15)}
.ev-footer__link{color:rgba(255,255,255,0.25);transition:color 0.3s}.ev-footer__link:hover{color:var(--pt)}

/* Cookie Banner */
.ev-cookie{position:fixed;bottom:0;left:0;right:0;z-index:1000;background:rgba(10,16,29,0.97);backdrop-filter:blur(16px);padding:18px 48px;display:flex;align-items:center;justify-content:space-between;gap:24px;border-top:1px solid rgba(125,220,200,0.1);animation:cookieUp 0.5s ${EASE}}
@keyframes cookieUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
.ev-cookie p{font-size:12px;line-height:1.6;color:rgba(255,255,255,0.45);max-width:700px}
.ev-cookie a{color:var(--pt);text-decoration:underline;text-underline-offset:2px}
.ev-cookie__btn{font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;padding:10px 22px;background:var(--ac);color:#0A1A16;border-radius:2px;white-space:nowrap;transition:all 0.3s ${EASE};flex-shrink:0}
.ev-cookie__btn:hover{background:var(--ac2);transform:translateY(-1px)}

/* Privacy Policy */
.ev-privacy{background:var(--bk);padding:180px 48px 120px;min-height:100vh}
.ev-privacy__wrap{max-width:760px;margin:0 auto}
.ev-privacy__h{font-family:var(--sf);font-size:clamp(40px,5vw,72px);font-weight:400;color:#fff;line-height:1.1;margin-bottom:12px}
.ev-privacy__h em{color:var(--pt)}
.ev-privacy__updated{font-size:12px;color:rgba(255,255,255,0.25);letter-spacing:0.1em;margin-bottom:48px}
.ev-privacy__content h2{font-family:var(--sf);font-size:22px;font-weight:400;color:#fff;margin-top:36px;margin-bottom:12px}
.ev-privacy__content p{font-size:15px;line-height:1.82;color:rgba(255,255,255,0.45);margin-bottom:16px}
.ev-privacy__content a{color:var(--pt);text-decoration:underline;text-underline-offset:2px}

/* Insights */
.ev-ins-hero{background:var(--bk);padding:200px 48px 90px;text-align:center}
.ev-ins-hero__h{font-family:var(--sf);font-size:clamp(52px,7vw,110px);font-weight:400;color:#fff;line-height:1;margin-top:16px}.ev-ins-hero__h em{color:var(--pt)}
.ev-ins-grid{background:var(--dk);padding:80px 0 120px}
.ev-ins-grid__in{max-width:1440px;margin:0 auto;padding:0 48px;display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:rgba(255,255,255,0.04)}
.ev-art-card{background:var(--bk);padding:36px 32px;cursor:pointer;transition:all 0.45s ${EASE};position:relative;overflow:hidden}
.ev-art-card::after{content:'';position:absolute;bottom:0;left:0;width:0;height:2px;background:var(--ac);transition:width 0.5s ${EASE}}
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
  .ev-ind__wrap{grid-template-columns:1fr;gap:40px}
  .ev-orbit{--orbR:148px;width:340px;height:340px;max-width:90vw}
  .ev-orbit__ring{inset:24px}
  .ev-orbit__ring--in{inset:90px}
  .ev-orbit__node{font-size:8px;padding:6px 9px;letter-spacing:0.04em}
  .ev-orbit__hub{width:92px;height:92px;gap:5px}
  .ev-orbit__hub span{font-size:10px}
  .ev-ind__ds{grid-column:2/3;max-width:none}
  .ev-ind__ar{display:none}
  .ev-out__wrap{grid-template-columns:1fr;gap:48px}
  .ev-out__display{margin:36px auto 0}
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
  .ev-conv{max-width:340px;margin:0 auto}
  .ev-about__stats{grid-template-columns:1fr 1fr;gap:10px}
  .ev-ind__wrap,.ev-svc__wrap,.ev-proj__wrap,.ev-proc__wrap,.ev-trust__wrap,.ev-contact__wrap,.ev-footer__in,.ev-out__wrap,.ev-bdr__wrap,.ev-why__wrap{padding:0 20px}
  .ev-ind__h,.ev-svc__h,.ev-proj__h,.ev-proc__h,.ev-trust__h,.ev-contact__h,.ev-bdr__h,.ev-why__h{font-size:clamp(34px,8vw,48px)}
  .ev-out__display{width:180px;height:180px}
  .ev-out__bignum{font-size:60px}
  .ev-out2__body p{padding-left:14px}
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
  .ev-next__wrap{padding:0 20px}
  .ev-next__h{font-size:clamp(34px,8vw,48px)}
  .ev-next__line{left:5px}
  .ev-next__row,.ev-next__row--r{justify-content:flex-start;padding:18px 0 18px 28px}
  .ev-next__card{width:100%}
  .ev-next__node{left:5px;top:38px}
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
  .ev-cookie{flex-direction:column;padding:16px 20px;gap:14px;text-align:center}
  .ev-privacy{padding:140px 20px 80px}
}
@media(max-width:480px){
  .ev-hero{min-height:100svh}
  .ev-hero__brand-name{font-size:48px}
  .ev-hero__ctas{flex-direction:column;align-items:center}
  .ev-btn{width:100%;justify-content:center}
  .ev-radios{flex-direction:column}
}
      `}</style>

      <ScrollProgress/>
      <Nav page={page} setPage={setPage}/>
      {page==="home"&&<><Hero/><Marquee/><About/><Outcomes/><Industries/><Services/><Projects/><Process/><Borders/><Why/><Trust/><Statement/><WhatNext/><Contact setPage={setPage}/></>}
      {page==="insights"&&<InsightsHome setPage={setPage} setSlug={setSlug}/>}
      {page==="article"&&<ArticlePage slug={slug} setPage={setPage} setSlug={setSlug}/>}
      {page==="privacy"&&<PrivacyPage/>}
      <Footer setPage={setPage}/>
      <CookieConsent setPage={setPage}/>
      <ChatWidget/>
    </>
  );
}

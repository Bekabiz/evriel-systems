import { useState, useEffect, useRef } from "react";
import { ArrowRight, ArrowUpRight, Menu, X, Minus, Plus, Lock, Eye, Shield, CheckCircle2, Target, Instagram, Linkedin } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ChatWidget from "./ChatWidget";

gsap.registerPlugin(ScrollTrigger);

const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";
const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ============ GSAP ScrollTrigger reveal primitives ============ */

function FX({ children, className = "", style = {}, delay = 0, y = 64, x = 0, scale = 1 }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced()) { gsap.set(el, { opacity: 1 }); return; }
    const tw = gsap.fromTo(el,
      { opacity: 0, y, x, scale },
      { opacity: 1, y: 0, x: 0, scale: 1, duration: 1.15, ease: "expo.out", delay: delay / 1000,
        scrollTrigger: { trigger: el, start: "top 88%", once: true } });
    return () => { tw.scrollTrigger && tw.scrollTrigger.kill(); tw.kill(); };
  }, []);
  return <div ref={ref} className={className} style={{ ...style, opacity: 0 }}>{children}</div>;
}

function StaggerFX({ children, className = "", style = {}, each = 0.12, y = 48 }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const items = Array.from(el.children);
    if (!items.length) return;
    if (reduced()) { gsap.set(items, { opacity: 1 }); return; }
    const tw = gsap.fromTo(items,
      { opacity: 0, y },
      { opacity: 1, y: 0, duration: 1.05, ease: "expo.out", stagger: each,
        scrollTrigger: { trigger: el, start: "top 88%", once: true } });
    return () => { tw.scrollTrigger && tw.scrollTrigger.kill(); tw.kill(); };
  }, []);
  return <div ref={ref} className={className} style={style}>{children}</div>;
}

/* Draw SVG strokes when scrolled into view */
function useDrawLines(ref, selector) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const lines = root.querySelectorAll(selector);
    if (!lines.length) return;
    lines.forEach((el) => {
      const len = el.getTotalLength ? el.getTotalLength() : 600;
      el.style.strokeDasharray = len;
      el.style.strokeDashoffset = reduced() ? 0 : len;
    });
    if (reduced()) return;
    const tw = gsap.to(lines, { strokeDashoffset: 0, duration: 1.7, ease: "power2.out", stagger: 0.1,
      scrollTrigger: { trigger: root, start: "top 82%", once: true } });
    return () => { tw.scrollTrigger && tw.scrollTrigger.kill(); tw.kill(); };
  }, []);
}

/* ============ Particle sphere — the hero centerpiece ============ */
function ParticleSphere() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const still = reduced();
    let raf, W, H, R, dpr;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas.offsetWidth; H = canvas.offsetHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      R = Math.min(W, H) * 0.365;
    };
    resize();
    const N = W < 700 ? 460 : 820;
    const GA = Math.PI * (3 - Math.sqrt(5));
    const pts = [];
    for (let i = 0; i < N; i++) {
      const t = (i + 0.5) / N;
      const py = 1 - 2 * t;
      const pr = Math.sqrt(1 - py * py);
      const th = GA * i;
      pts.push({ x: Math.cos(th) * pr, y: py, z: Math.sin(th) * pr, w: Math.random() });
    }
    let rotY = 0, offX = -0.3, offY = 0;
    const mouse = { x: 0, y: 0, on: false };
    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = (e.clientX - (r.left + r.width / 2)) / Math.max(r.width, 1);
      mouse.y = (e.clientY - (r.top + r.height / 2)) / Math.max(r.height, 1);
      mouse.on = true;
    };
    const FOV = 3.4;
    // deep teal -> aurora cyan, with rare white / lavender sparks
    const colorFor = (p, depth) => {
      if (p.w > 0.985) return `rgba(250,209,255,${0.25 + depth * 0.55})`;
      if (p.w > 0.94) return `rgba(255,255,255,${0.2 + depth * 0.6})`;
      const m = depth * 0.72 + p.w * 0.28;
      const r = Math.round(0 + (203 - 0) * m);
      const g = Math.round(130 + (255 - 130) * m);
      const b = Math.round(124 + (252 - 124) * m);
      return `rgba(${r},${g},${b},${0.14 + depth * 0.62})`;
    };
    const frame = () => {
      ctx.clearRect(0, 0, W, H);
      if (!still) rotY += 0.0021;
      offY += ((mouse.on ? mouse.x * 0.7 : 0) - offY) * 0.035;
      offX += ((-0.3 + (mouse.on ? mouse.y * 0.5 : 0)) - offX) * 0.035;
      const ry = rotY + offY, rx = offX;
      const sy = Math.sin(ry), cy = Math.cos(ry), sx = Math.sin(rx), cx = Math.cos(rx);
      ctx.globalCompositeOperation = "lighter";
      for (const p of pts) {
        const x1 = p.x * cy - p.z * sy;
        const z1 = p.x * sy + p.z * cy;
        const y1 = p.y * cx - z1 * sx;
        const z2 = p.y * sx + z1 * cx;
        const s = FOV / (FOV + z2);
        const px = W / 2 + x1 * R * s;
        const py = H / 2 + y1 * R * s;
        const depth = (1 - z2) / 2; // 0 far -> 1 near
        const rad = (0.6 + depth * 1.5) * (W < 700 ? 0.85 : 1);
        ctx.fillStyle = colorFor(p, depth);
        ctx.beginPath();
        ctx.arc(px, py, rad, 0, Math.PI * 2);
        ctx.fill();
        if (p.w > 0.94 && depth > 0.55) {
          ctx.fillStyle = `rgba(203,255,252,${(depth - 0.55) * 0.14})`;
          ctx.beginPath();
          ctx.arc(px, py, rad * 3.4, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalCompositeOperation = "source-over";
      if (!still) raf = requestAnimationFrame(frame);
    };
    window.addEventListener("resize", resize);
    if (!still) window.addEventListener("pointermove", onMove, { passive: true });
    frame();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);
  return <canvas ref={ref} className="ev-sphere__canvas" />;
}

/* Scroll progress hairline */
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

/* Scroll-reactive radial glow wash — the background journey */
function GlowWash({ variant = "teal" }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced()) { gsap.set(el, { opacity: 1 }); return; }
    const tw = gsap.fromTo(el, { opacity: 0 }, { opacity: 1, ease: "none",
      scrollTrigger: { trigger: el.parentElement, start: "top 78%", end: "top 15%", scrub: 0.8 } });
    return () => { tw.scrollTrigger && tw.scrollTrigger.kill(); tw.kill(); };
  }, []);
  return <div ref={ref} className={`ev-wash ev-wash--${variant}`} aria-hidden="true" />;
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

/* LOGO — Evriel wordmark SVG from public/ (white on dark, teal on light) */
const Logo = ({ light = false, height = 30 }) => (
  <img src={light ? "/logo-white.svg" : "/logo.svg"} alt="Evriel" style={{ height, width: "auto", display: "block" }} />
);

/* Section eyebrow — teal dot + tracked caps */
const Eyebrow = ({ children }) => <div className="ev-eyebrow"><span className="ev-eyebrow__dot" />{children}</div>;

/* COOKIE CONSENT */
function CookieConsent({ setPage }) {
  const [show, setShow] = useState(false);
  useEffect(() => { if (!localStorage.getItem("ev_cookie_ok")) setShow(true); }, []);
  if (!show) return null;
  const accept = () => { localStorage.setItem("ev_cookie_ok", "1"); setShow(false); };
  return (
    <div className="ev-cookie">
      <p>We use essential cookies to ensure our website functions properly. We do not use tracking or advertising cookies. By continuing to use this site, you agree to our <a href="#" onClick={e=>{e.preventDefault();setPage("privacy");window.scrollTo({top:0,behavior:"smooth"})}}>Privacy Policy</a>.</p>
      <button className="ev-cookie__btn" onClick={accept}>Accept &amp; Close</button>
    </div>
  );
}

/* NAV */
function Nav({ page, setPage }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => { const h = () => setScrolled(window.scrollY > 50); window.addEventListener("scroll", h, { passive: true }); return () => window.removeEventListener("scroll", h); }, []);
  const go = (id) => { setOpen(false); if (page !== "home") { setPage("home"); setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 250); } else document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); };
  return (
    <nav className={`ev-nav${scrolled?" ev-nav--s":""}`}>
      <div className="ev-nav__in">
        <div onClick={()=>{setPage("home");setOpen(false);window.scrollTo({top:0,behavior:"smooth"})}} className="ev-brand">
          <Logo light height={44}/>
        </div>
        <div className="ev-nav__links">
          {[["About","about"],["Industries","industries"],["Services","services"],["Projects","projects"]].map(([l,id])=>
            <button key={id} onClick={()=>go(id)} className="ev-nav__link">{l}</button>
          )}
          <button onClick={()=>{setPage("insights");setOpen(false);window.scrollTo({top:0,behavior:"smooth"})}} className="ev-nav__link">Insights</button>
          <button onClick={()=>go("contact")} className="ev-btn ev-btn--ghost ev-btn--sm">Let's Talk</button>
        </div>
        <button className="ev-nav__burger" onClick={()=>setOpen(!open)} aria-label="Menu">{open?<X size={22}/>:<Menu size={22}/>}</button>
      </div>
      {open&&<div className="ev-mobile-menu">{[["About","about"],["Industries","industries"],["Services","services"],["Projects","projects"]].map(([l,id])=><button key={id} onClick={()=>go(id)} className="ev-mob-link">{l}</button>)}<button onClick={()=>{setPage("insights");setOpen(false);window.scrollTo({top:0,behavior:"smooth"})}} className="ev-mob-link">Insights</button><button onClick={()=>go("contact")} className="ev-mob-link">Contact</button></div>}
    </nav>
  );
}

/* HERO — particle sphere floating in the abyss */
function Hero() {
  const scope = useRef(null);
  useEffect(() => {
    if (reduced()) { gsap.set(scope.current.querySelectorAll("[data-hero]"), { opacity: 1 }); return; }
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.fromTo("[data-hero='sphere']", { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 2.4 }, 0)
        .fromTo("[data-hero='fade']", { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 1.4, stagger: 0.15 }, 0.25);
    }, scope);
    return () => ctx.revert();
  }, []);
  const go = (id) => (e) => { e.preventDefault(); document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); };
  return (
    <section className="ev-hero" ref={scope}>
      <div className="ev-hero__wash" />
      <div className="ev-hero__sphere" data-hero="sphere" style={{opacity:0}}>
        <div className="ev-hero__sphere-glow" />
        <ParticleSphere />
      </div>
      <div className="ev-hero__body">
        <div className="ev-hero__eyebrow" data-hero="fade" style={{opacity:0}}>AI &middot; Automation &middot; Intelligent Systems</div>
        <h1 className="ev-hero__h" data-hero="fade" style={{opacity:0}}>Connecting Intelligence<br/>with <em>Business</em></h1>
        <p className="ev-hero__sub" data-hero="fade" style={{opacity:0}}>Helping organizations leverage AI, automation, and intelligent systems <br className="dbr"/>to improve efficiency, make better decisions, and build sustainable <br className="dbr"/>competitive advantages.</p>
        <div className="ev-hero__ctas" data-hero="fade" style={{opacity:0}}>
          <a href="#contact" className="ev-btn ev-btn--grad" onClick={go("contact")}>Start a Conversation <ArrowUpRight size={14}/></a>
          <a href="#projects" className="ev-btn ev-btn--ghost" onClick={go("projects")}>Our Work</a>
        </div>
      </div>
      <div className="ev-hero__scroll" data-hero="fade" style={{opacity:0}}>
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

/* TECH MARQUEE — tools we connect, with brand icons, two rows opposite directions */
const TOOLS_A = [["Gmail","gmail"],["Outlook","microsoftoutlook"],["Excel","microsoftexcel"],["Google Sheets","googlesheets"],["Slack","slack"],["WhatsApp","whatsapp"],["n8n","n8n"]];
const TOOLS_B = [["Supabase","supabase"],["OpenAI","openai"],["Anthropic","anthropic"],["Notion","notion"],["Airtable","airtable"],["Zapier","zapier"],["Power BI","powerbi"]];

const ToolChip = ({ name, slug }) => (
  <span className="ev-tm__i">
    <img src={`https://cdn.simpleicons.org/${slug}`} alt="" loading="lazy" onError={(e)=>{e.currentTarget.style.display="none";}}/>
    {name}
  </span>
);

function TechMarquee() {
  const r1 = TOOLS_A.map((t,i)=><ToolChip key={i} name={t[0]} slug={t[1]}/>);
  const r2 = TOOLS_B.map((t,i)=><ToolChip key={i} name={t[0]} slug={t[1]}/>);
  return (
    <div className="ev-tm">
      <div className="ev-wrap">
        <FX y={40}>
          <div className="ev-tm__panel">
            <div className="ev-tm__label">We connect the tools you already use</div>
            <div className="ev-tm__row"><div className="ev-tm__track">{r1}{r1}{r1}{r1}</div></div>
            <div className="ev-tm__row"><div className="ev-tm__track ev-tm__track--rev">{r2}{r2}{r2}{r2}</div></div>
          </div>
        </FX>
      </div>
    </div>
  );
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
  const ref = useRef(null);
  useDrawLines(ref, "path[data-draw]");
  const SRC = ["People", "Processes", "Information", "Technology"];
  return (
    <div className="ev-conv" ref={ref}>
      <svg viewBox="0 0 440 340" width="100%" style={{ overflow: "visible" }}>
        <defs>
          <radialGradient id="convGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(0,130,124,0.45)"/>
            <stop offset="55%" stopColor="rgba(0,130,124,0.1)"/>
            <stop offset="100%" stopColor="rgba(0,130,124,0)"/>
          </radialGradient>
        </defs>
        <circle cx="332" cy="170" r="92" fill="url(#convGlow)"/>
        {SRC.map((label, i) => {
          const y = 50 + i * 80;
          const path = `M124 ${y} C 210 ${y}, 244 170, 324 170`;
          return (
            <g key={label}>
              <path data-draw d={path} fill="none" stroke="rgba(203,255,252,0.22)" strokeWidth="1"/>
              <circle r="2.4" fill="#cbfffc" opacity="0.9">
                <animateMotion dur="3.4s" begin={`${i * 0.85}s`} repeatCount="indefinite" path={path}/>
              </circle>
              <circle cx="118" cy={y} r="4" fill="#ffffff"/>
              <text x="104" y={y + 4} textAnchor="end" fill="#bbc7c6" style={{ font: "500 11px Inter, sans-serif", letterSpacing: "1.44px" }}>{label.toUpperCase()}</text>
            </g>
          );
        })}
        <circle cx="332" cy="170" r="7" fill="#cbfffc"/>
        <circle cx="332" cy="170" r="17" fill="none" stroke="rgba(203,255,252,0.35)" strokeWidth="1" className="ev-pulse-ring"/>
        <text x="332" y="216" textAnchor="middle" fill="#ffffff" style={{ font: "500 15px Inter, sans-serif", letterSpacing: "0.2px" }}>Intelligent Systems</text>
      </svg>
    </div>
  );
}

function About() {
  return (
    <section id="about" className="ev-sec ev-about">
      <GlowWash variant="tealRight"/>
      <span className="ev-gnum" aria-hidden="true">01</span>
      <div className="ev-wrap ev-about__grid">
        <div className="ev-about__left">
          <FX><Eyebrow>About</Eyebrow></FX>
          <FX delay={90}><h2 className="ev-h-lg">Intelligence<br/>With <em>Purpose</em></h2></FX>
          <FX delay={170}>
            <p className="ev-about__lead">No two organizations operate the same way, which is why effective solutions must be built around real operational needs rather than one-size-fits-all technology.</p>
            <p className="ev-about__quote">Our role is to understand those challenges and design practical systems that improve how people work, collaborate, and make decisions.</p>
            <p className="ev-about__p">Artificial Intelligence is transforming industries and creating new opportunities to operate more efficiently, make smarter decisions, and remain competitive. <strong>The challenge is not accessing AI. It is implementing it correctly.</strong></p>
            <p className="ev-about__p">Founded by Bereket Teshome, Evriel Systems was shaped by experience across business, marketing, European projects, and digital transformation initiatives in Poland, Spain, Italy, and Greece.</p>
            <p className="ev-about__p">Through these experiences, one challenge consistently emerged: many organizations struggle to transform emerging technologies into practical business value.</p>
            <p className="ev-about__p">Working across industries has shown that while technologies change rapidly, the underlying challenges often remain the same: disconnected information, inefficient workflows, and missed opportunities for better decision-making.</p>
            <p className="ev-about__p">Evriel Systems was created to help bridge that gap through AI, automation, and intelligent systems that connect people, processes, information, and technology into solutions built for efficiency, growth, and long-term success.</p>
            <p className="ev-about__p">Our solutions include AI agents, workflow automation, intelligent knowledge systems, custom software, and digital platforms designed to improve efficiency, streamline operations, and support better decision-making.</p>
          </FX>
          <StaggerFX className="ev-about__stats" each={0.1}>
            {ABOUT_FEATS.map((f,i)=>
              <div key={i} className={`ev-afeat${i===2?" ev-afeat--pink":""}`}><span className="ev-afeat__n">{f.t}<br/>{f.s}</span><p className="ev-afeat__d">{f.d}</p></div>
            )}
          </StaggerFX>
        </div>
        <div className="ev-about__right">
          <FX delay={200} y={40}><ConvergenceDiagram/></FX>
          <StaggerFX className="ev-challenges" each={0.09} y={30}>
            {["Fragmented Information","Repetitive Manual Work","Disconnected Systems","Inefficient Communication","Slow Decision-Making"].map((c,i)=>
              <div key={i} className="ev-ch"><span className="ev-ch__dot"/><span>{c}</span></div>
            )}
          </StaggerFX>
        </div>
      </div>
    </section>
  );
}

/* OUTCOMES — giant gradient index + expanding editorial list */
const OUTCOMES = [
  { t:"AI-Powered Efficiency", d:"Reduce repetitive work and streamline operations through intelligent automation." },
  { t:"Smarter Decision-Making", d:"Use AI, data, and business intelligence to support informed decisions." },
  { t:"Operational Visibility", d:"Connect systems, information, and workflows to improve transparency and control." },
  { t:"Growth & Competitiveness", d:"Leverage intelligent technologies to adapt, innovate, and stay ahead." },
  { t:"Digital Transformation", d:"Build modern operational foundations that support long-term success." },
];

const OUT_CYCLE_MS = 2600;

function Outcomes() {
  const [act, setAct] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused || reduced()) return;
    const id = setInterval(() => setAct(a => (a+1)%OUTCOMES.length), OUT_CYCLE_MS);
    return () => clearInterval(id);
  }, [paused]);
  return (
    <section className="ev-sec ev-out" onMouseEnter={()=>setPaused(true)} onMouseLeave={()=>setPaused(false)}>
      <GlowWash variant="tealLeft"/>
      <div className="ev-wrap ev-out__grid">
        <div className="ev-out__left">
          <FX><Eyebrow>What We Help Improve</Eyebrow></FX>
          <FX delay={90}><h2 className="ev-h-lg">Where intelligence creates <em>real impact</em></h2></FX>
          <FX delay={160}><p className="ev-intro">Five areas where AI and automation translate directly into measurable business results.</p></FX>
          <FX delay={240} y={30}>
            <div className="ev-out__display">
              <span className="ev-out__num" key={act}>0{act+1}</span>
              <span className="ev-out__of">/ 0{OUTCOMES.length}</span>
            </div>
          </FX>
        </div>
        <StaggerFX className="ev-out__list" each={0.1} y={36}>
          {OUTCOMES.map((o,i)=>(
            <div key={i} className={`ev-out__item${i===act?" ev-out__item--on":""}`} onClick={()=>setAct(i)}>
              <div className="ev-out__head">
                <span className="ev-out__ix">0{i+1}</span>
                <h3 className="ev-out__t">{o.t}</h3>
                <span className="ev-out__chev"><ArrowUpRight size={15}/></span>
              </div>
              <div className="ev-out__body"><p>{o.d}</p></div>
            </div>
          ))}
        </StaggerFX>
      </div>
    </section>
  );
}

/* INDUSTRIES — interactive glow card grid */
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

/* Rotating industry orbit — labels circle a center hub, click to select */
function IndustryOrbit({ act, setAct }) {
  const step = 360/INDS.length;
  return (
    <div className="ev-orbit">
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
      <div className="ev-orbit__hub"><span>Evriel<br/>Systems</span></div>
    </div>
  );
}

function Industries() {
  const [act, setAct] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused || reduced()) return;
    const id = setInterval(() => setAct(a => (a+1)%INDS.length), 2800);
    return () => clearInterval(id);
  }, [paused]);
  return (
    <section id="industries" className="ev-sec ev-ind" onMouseEnter={()=>setPaused(true)} onMouseLeave={()=>setPaused(false)}>
      <GlowWash variant="teal"/>
      <span className="ev-gnum ev-gnum--l" aria-hidden="true">02</span>
      <div className="ev-wrap ev-ind__grid">
        <div className="ev-ind__left">
          <FX><Eyebrow>Industries</Eyebrow></FX>
          <FX delay={90}><h2 className="ev-h-lg">Industries We <em>Support</em></h2></FX>
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
        <FX delay={150} y={40}>
          <IndustryOrbit act={act} setAct={setAct}/>
        </FX>
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
  return (
    <div className="ev-flow">
      {steps.map((s, i) => (
        <div key={s} className="ev-flow__seg">
          <span className={`ev-flow__node${i === steps.length - 1 ? " ev-flow__node--end" : ""}`}>{s}</span>
          {i < steps.length - 1 && (
            <svg className="ev-flow__link" width="34" height="10" viewBox="0 0 34 10">
              <line x1="0" y1="5" x2="26" y2="5" stroke="rgba(203,255,252,0.3)" strokeWidth="1" strokeDasharray="4 4" style={{ animation: "flowDash 1.4s linear infinite" }} />
              <path d="M26 1.5 L32 5 L26 8.5" fill="none" stroke="rgba(203,255,252,0.45)" strokeWidth="1" />
            </svg>
          )}
        </div>
      ))}
    </div>
  );
}

/* CSS mockup — inbox chaos becomes AI-triaged order */
function EmailMockup() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rows = el.querySelectorAll("[data-mrow]");
    if (reduced()) { gsap.set(rows, { opacity: 1 }); return; }
    const tw = gsap.fromTo(rows, { opacity: 0, x: -16 }, { opacity: 1, x: 0, duration: 0.7, ease: "power2.out", stagger: 0.14,
      scrollTrigger: { trigger: el, start: "top 86%", once: true } });
    return () => { tw.scrollTrigger && tw.scrollTrigger.kill(); tw.kill(); };
  }, []);
  return (
    <div className="ev-mock" ref={ref}>
      <div className="ev-mock__bar"><span/><span/><span/><i>Inbox — AI Triage</i></div>
      {[
        { from:"Client — urgent quote request", tag:"Urgent", cls:"u" },
        { from:"Supplier — invoice received", tag:"Finance", cls:"f" },
        { from:"Newsletter — weekly digest", tag:"Low", cls:"l" },
      ].map((m,i)=>(
        <div key={i} className="ev-mock__row" data-mrow>
          <span className="ev-mock__dot"/>
          <span className="ev-mock__from">{m.from}</span>
          <span className={`ev-mock__tag ev-mock__tag--${m.cls}`}>{m.tag}</span>
        </div>
      ))}
      <div className="ev-mock__out" data-mrow>
        <span className="ev-mock__ai">AI</span>
        <span>Classified, prioritized, draft response ready</span>
      </div>
    </div>
  );
}

/* CSS mockup — an operations dashboard taking shape */
function DashboardMockup() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const bars = el.querySelectorAll("[data-bar]");
    if (reduced()) { gsap.set(bars, { scaleY: 1 }); return; }
    const tw = gsap.fromTo(bars, { scaleY: 0 }, { scaleY: 1, duration: 0.9, ease: "expo.out", stagger: 0.07,
      scrollTrigger: { trigger: el, start: "top 86%", once: true } });
    return () => { tw.scrollTrigger && tw.scrollTrigger.kill(); tw.kill(); };
  }, []);
  return (
    <div className="ev-mock" ref={ref}>
      <div className="ev-mock__bar"><span/><span/><span/><i>Operations Dashboard</i></div>
      <div className="ev-dash">
        <div className="ev-dash__kpis">
          <div className="ev-dash__kpi"><i>Workflows</i><span/></div>
          <div className="ev-dash__kpi"><i>Visibility</i><span/></div>
        </div>
        <div className="ev-dash__chart">
          {[34,56,42,70,58,86,64,94].map((h,i)=><span key={i} data-bar style={{height:`${h}%`}}/>)}
        </div>
        <svg className="ev-dash__line" viewBox="0 0 200 40" preserveAspectRatio="none" aria-hidden="true">
          <defs><linearGradient id="dashg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#00827c"/><stop offset="1" stopColor="#cbfffc"/></linearGradient></defs>
          <path d="M0 34 C 30 30, 45 22, 70 24 S 120 12, 150 10 S 185 6, 200 4" fill="none" stroke="url(#dashg)" strokeWidth="2"/>
        </svg>
      </div>
    </div>
  );
}

function Services() {
  return (
    <section id="services" className="ev-sec ev-svc">
      <GlowWash variant="lav"/>
      <span className="ev-gnum" aria-hidden="true">03</span>
      <div className="ev-wrap">
        <FX><Eyebrow>Services</Eyebrow></FX>
        <FX delay={90}><h2 className="ev-h-lg">What We <em>Deliver</em></h2></FX>
        <FX delay={160}><p className="ev-intro">We help organizations turn emerging technologies into practical business advantages.</p></FX>
        <div className="ev-svc__rows">
          {SVCS.map((s,i)=>(
            <FX key={i} delay={i*80} y={56}>
              <div className="ev-svc__row">
                <span className="ev-svc__gn">{s.n}</span>
                <div className="ev-svc__m">
                  <h3 className="ev-svc__t">{s.t}</h3>
                  <p className="ev-svc__d">{s.d}</p>
                  <FlowDiagram steps={s.flow}/>
                  {i===0&&<EmailMockup/>}
                  {i===1&&<DashboardMockup/>}
                </div>
                <div className="ev-svc__r">
                  <div className="ev-svc__al">Applications</div>
                  <div className="ev-svc__tags">{s.a.map((x,j)=><span key={j} className="ev-tag">{x}</span>)}</div>
                </div>
              </div>
            </FX>
          ))}
        </div>
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
    <section id="projects" className="ev-sec ev-proj">
      <GlowWash variant="tealRight"/>
      <span className="ev-gnum ev-gnum--l" aria-hidden="true">04</span>
      <div className="ev-wrap">
        <FX><Eyebrow>Solutions, Products &amp; Case Studies</Eyebrow></FX>
        <FX delay={90}><h2 className="ev-h-lg">Solutions, Products<br/>&amp; <em>Case Studies</em></h2></FX>
        <StaggerFX className="ev-proj__list" each={0.09} y={44}>
          {PROJS.map((p,i)=>(
            <div key={i} className={`ev-prj${active===i?" ev-prj--o":""}`} onClick={()=>{setActive(active===i?null:i);if(active===i)setExpanded(prev=>({...prev,[i]:false}))}}>
              <div className="ev-prj__hd">
                <div className="ev-prj__hl">
                  <span className="ev-prj__ix">0{i+1}</span>
                  <h3 className="ev-prj__t">{p.t}</h3>
                  {p.badge&&<span className="ev-prj__badge">{p.badge}</span>}
                </div>
                <span className="ev-prj__tog">{active===i?<Minus size={15}/>:<Plus size={15}/>}</span>
              </div>
              <div style={{maxHeight:active===i?(expanded[i]?2200:520):0,opacity:active===i?1:0,overflow:"hidden",transition:`max-height 0.7s ${EASE}, opacity 0.4s ${EASE}`}}>
                <div className="ev-prj__bd">
                  <p>{p.d}</p>
                  <div className="ev-prj__caps">{p.c.map((x,j)=><span key={j} className="ev-tag">{x}</span>)}</div>
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
          ))}
        </StaggerFX>
      </div>
    </section>
  );
}

/* PROCESS — horizontal current line with beacons */
const PROCS = [
  { t:"Discovery",d:"We learn how your organization operates. We identify objectives, challenges, workflows, and opportunities." },
  { t:"Assessment",d:"We analyze operational inefficiencies and identify where intelligent systems create measurable value." },
  { t:"Design",d:"We design a solution tailored to your organization. No generic templates. No one-size-fits-all." },
  { t:"Implementation",d:"We build and integrate the solution into your operational environment." },
  { t:"Optimization",d:"We continuously improve performance, usability, automation, and business outcomes." },
];

function Process() {
  const secRef = useRef(null);
  const lineRef = useRef(null);
  useEffect(() => {
    const line = lineRef.current;
    if (!line) return;
    if (reduced()) { line.style.transform = "scaleX(1)"; return; }
    const tw = gsap.fromTo(line, { scaleX: 0 }, { scaleX: 1, duration: 1.9, ease: "power3.inOut",
      scrollTrigger: { trigger: secRef.current, start: "top 70%", once: true } });
    return () => { tw.scrollTrigger && tw.scrollTrigger.kill(); tw.kill(); };
  }, []);
  return (
    <section id="process" className="ev-sec ev-proc" ref={secRef}>
      <GlowWash variant="mint"/>
      <span className="ev-gnum" aria-hidden="true">05</span>
      <div className="ev-wrap">
        <FX><Eyebrow>Process</Eyebrow></FX>
        <FX delay={90}><h2 className="ev-h-lg">How We <em>Work</em></h2></FX>
        <FX delay={160}><p className="ev-intro">Every organization is different. Our process is designed to understand your specific challenges before recommending technology.</p></FX>
        <div className="ev-proc__track">
          <div className="ev-proc__line" ref={lineRef}/>
          <StaggerFX className="ev-proc__grid" each={0.14} y={44}>
            {PROCS.map((s,i)=>(
              <div key={i} className="ev-proc__step">
                <span className="ev-proc__beacon"/>
                <span className="ev-proc__num">0{i+1}</span>
                <h3 className="ev-proc__ct">{s.t}</h3>
                <p className="ev-proc__cd">{s.d}</p>
              </div>
            ))}
          </StaggerFX>
        </div>
      </div>
    </section>
  );
}

/* BORDERS — atmospheric statement band */
function Borders() {
  return (
    <section className="ev-sec ev-bdr">
      <div className="ev-bdr__wash"/>
      <div className="ev-wrap ev-bdr__body">
        <FX><Eyebrow>Working Across Borders</Eyebrow></FX>
        <FX delay={100} y={40}><h2 className="ev-h-lg">Built for a <em>Connected</em> World</h2></FX>
        <FX delay={180}>
          <p className="ev-bdr__p">Business challenges rarely stop at national boundaries. Evriel Systems supports organizations operating across different industries, markets, and regions.</p>
          <p className="ev-bdr__p">We understand the importance of clear communication, cultural awareness, and practical solutions that work in diverse environments.</p>
        </FX>
        <FX delay={260} y={26}>
          <div className="ev-bdr__tag"><span>Projects and communications can be conducted in multiple languages depending on client requirements.</span></div>
        </FX>
      </div>
    </section>
  );
}

/* WHY — one big signature card with a glowing dotted sphere */
const WHY = [
  { t:"Practical Solutions", d:"Focused on real business outcomes." },
  { t:"Intelligent Systems", d:"Built around your organization's needs." },
  { t:"Long-Term Thinking", d:"Designed to support sustainable growth and adaptability." },
];

/* Dotted sphere — front-projected lattice of glowing points */
function DottedSphere() {
  const dots = [];
  const R = 132, C = 170;
  for (let la = -75; la <= 75; la += 12.5) {
    const phi = (la * Math.PI) / 180;
    const n = Math.max(8, Math.round(30 * Math.cos(phi)));
    for (let i = 0; i < n; i++) {
      const th = (i / n) * Math.PI * 2 + la * 0.045;
      const X = R * Math.cos(phi) * Math.sin(th);
      const Y = R * Math.sin(phi);
      const d = (Math.cos(phi) * Math.cos(th) + 1) / 2;
      dots.push(<circle key={`${la}:${i}`} cx={C + X} cy={C - Y} r={0.8 + d * 1.4} fill={d > 0.94 ? "#ffffff" : "#cbfffc"} opacity={0.1 + d * 0.65}/>);
    }
  }
  return (
    <svg viewBox="0 0 340 340" className="ev-dsphere" aria-hidden="true">
      <defs>
        <radialGradient id="dsg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(0,194,176,0.42)"/>
          <stop offset="60%" stopColor="rgba(0,130,124,0.13)"/>
          <stop offset="100%" stopColor="rgba(0,130,124,0)"/>
        </radialGradient>
      </defs>
      <circle cx="170" cy="170" r="154" fill="url(#dsg)"/>
      {dots}
    </svg>
  );
}

function Why() {
  const go = (e) => { e.preventDefault(); document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }); };
  return (
    <section className="ev-sec ev-why">
      <div className="ev-wrap">
        <FX y={56}>
          <div className="ev-bigcard">
            <div className="ev-bigcard__glow" aria-hidden="true"/>
            <div className="ev-bigcard__copy">
              <Eyebrow>Why Evriel Systems</Eyebrow>
              <h2 className="ev-h-lg" style={{marginTop:22}}>Clarity, Not <em>Complexity</em></h2>
              <p className="ev-bigcard__p">Technology should create clarity, not complexity. Our approach combines business understanding, intelligent technology, and practical implementation to help organizations improve operations, make better decisions, and adapt to a rapidly changing world.</p>
              <p className="ev-bigcard__p ev-bigcard__p--sub">We focus on solutions that deliver measurable value rather than technology for technology's sake.</p>
              <div className="ev-bigcard__feats">
                {WHY.map((w,i)=>
                  <div key={i} className="ev-bigfeat"><Target size={17}/><div><h3>{w.t}</h3><p>{w.d}</p></div></div>
                )}
              </div>
              <a href="#contact" className="ev-btn ev-btn--grad" onClick={go}>Start a Conversation <ArrowUpRight size={14}/></a>
            </div>
            <div className="ev-bigcard__visual"><DottedSphere/></div>
          </div>
        </FX>
      </div>
    </section>
  );
}

/* TRUST */
function Trust() {
  return (
    <section id="trust" className="ev-sec ev-trust">
      <GlowWash variant="tealLeft"/>
      <span className="ev-gnum ev-gnum--l" aria-hidden="true">06</span>
      <div className="ev-wrap ev-trust__grid">
        <div className="ev-trust__l">
          <FX><Eyebrow>Trust &amp; Security</Eyebrow></FX>
          <FX delay={90}><h2 className="ev-h-lg">Your Data Remains <em>Yours</em></h2></FX>
          <FX delay={170}><p className="ev-trust__p">We believe trust is the foundation of every intelligent system. Client information is used exclusively for the development, operation, and improvement of the agreed solution.</p></FX>
          <FX delay={230} y={30}><div className="ev-trust__note"><Lock size={15}/><p><strong>Your data remains your property.</strong> Client information is never used for unrelated purposes, unauthorized training, or external development activities.</p></div></FX>
        </div>
        <StaggerFX className="ev-trust__r" each={0.11} y={36}>
          {[{ic:<Lock size={18}/>,t:"Confidentiality",d:"Your information stays protected at every stage."},{ic:<Eye size={18}/>,t:"Transparency",d:"Clear communication about how data is used."},{ic:<Shield size={18}/>,t:"Responsible AI",d:"Ethical implementation at the core."},{ic:<CheckCircle2 size={18}/>,t:"Security-First",d:"Built from the ground up with security as priority."}].map((x,i)=>
            <div key={i} className="ev-trust__row"><div className="ev-trust__ci">{x.ic}</div><div><h4 className="ev-trust__ct">{x.t}</h4><p className="ev-trust__cd">{x.d}</p></div></div>
          )}
        </StaggerFX>
      </div>
    </section>
  );
}

/* STATEMENT — display type over twilight wash */
function Statement() {
  return (
    <section className="ev-sec ev-stmt">
      <div className="ev-stmt__wash"/>
      <div className="ev-wrap ev-stmt__body">
        <FX y={70}><h2 className="ev-stmt__h">The future belongs to<br/>organizations that can adapt,<br/>innovate, and act <em>intelligently.</em></h2></FX>
        <FX delay={200} y={30}><a href="#contact" className="ev-btn ev-btn--grad ev-btn--lg" onClick={e=>{e.preventDefault();document.getElementById("contact")?.scrollIntoView({behavior:"smooth"})}}>Start a Conversation <ArrowUpRight size={16}/></a></FX>
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
  const tlRef = useRef(null);
  const lineRef = useRef(null);
  useEffect(() => {
    const line = lineRef.current;
    if (!line) return;
    if (reduced()) { line.style.transform = "scaleY(1)"; return; }
    const tw = gsap.fromTo(line, { scaleY: 0 }, { scaleY: 1, ease: "none",
      scrollTrigger: { trigger: tlRef.current, start: "top 78%", end: "bottom 72%", scrub: 0.6 } });
    return () => { tw.scrollTrigger && tw.scrollTrigger.kill(); tw.kill(); };
  }, []);
  return (
    <section id="next" className="ev-sec ev-next">
      <GlowWash variant="lav"/>
      <span className="ev-gnum" aria-hidden="true">07</span>
      <div className="ev-wrap">
        <FX><Eyebrow>What Happens Next?</Eyebrow></FX>
        <FX delay={90}><h2 className="ev-h-lg">From First Message<br/>to <em>Working System</em></h2></FX>
        <FX delay={160}><p className="ev-intro">No mystery, no pressure. Here is exactly what happens after you contact us.</p></FX>
        <div className="ev-next__tl" ref={tlRef}>
          <div className="ev-next__line" ref={lineRef}/>
          {NEXT_STEPS.map((s,i)=>(
            <FX key={i} delay={80} x={i%2?60:-60} y={0}>
              <div className={`ev-next__row${i%2?" ev-next__row--r":""}`}>
                <div className="ev-next__card">
                  <span className="ev-next__num">0{i+1}</span>
                  <h3 className="ev-next__t">{s.t}</h3>
                  <p className="ev-next__d">{s.d}</p>
                </div>
                <span className="ev-next__node"/>
              </div>
            </FX>
          ))}
        </div>
      </div>
    </section>
  );
}

/* CONTACT — white card floating on a bright teal glow */
const CONTACT_CATS = [
  { t: "General Inquiry", v: "Not Sure Yet" },
  { t: "AI Automation", v: "AI Automation" },
  { t: "Business Intelligence", v: "Business Intelligence" },
  { t: "Partnership", v: "European Project Solutions" },
];

function Contact({setPage}) {
  const [f, setF] = useState({name:"",company:"",email:"",phone:"",language:"English",industry:"",interests:[],challenge:""});
  const [consent, setConsent] = useState(false);
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState(null);
  const [sending, setSending] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const tog = (v) => setF(p=>({...p,interests:p.interests.includes(v)?p.interests.filter(x=>x!==v):[...p.interests,v]}));
  const pick = (v) => {
    setShowForm(true);
    if (v) setF(p=>p.interests.includes(v)?p:{...p,interests:[...p.interests,v]});
    setTimeout(()=>document.getElementById("ev-form-anchor")?.scrollIntoView({behavior:"smooth",block:"start"}),140);
  };
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
    <section id="contact" className="ev-contact2">
      <div className="ev-contact2__glow" aria-hidden="true"/>
      <div className="ev-wrap ev-contact2__in">
        <FX y={56}>
          <div className="ev-wcard">
            <div className="ev-wcard__grid">
              <div className="ev-wcard__l">
                <div className="ev-eyebrow ev-eyebrow--dark"><span className="ev-eyebrow__dot"/>Have a Question?</div>
                <h2 className="ev-wcard__h">Contact Us</h2>
                <p className="ev-wcard__p">Whether you have a clear project in mind or are simply exploring possibilities, we'd be happy to learn more about your organization and discuss how intelligent systems can support your goals.</p>
                <a href="mailto:contact@evrielsystems.com" className="ev-wcard__mail">contact@evrielsystems.com</a>
              </div>
              <div className="ev-cats">
                {CONTACT_CATS.map(c=>(
                  <button key={c.t} className="ev-cat" onClick={()=>pick(c.v)}>
                    <span>{c.t}</span>
                    <span className="ev-cat__go"><ArrowUpRight size={16}/></span>
                  </button>
                ))}
              </div>
            </div>
            {(showForm || sent) && (
              <div className="ev-wcard__form" id="ev-form-anchor">
                {sent ? (
                  <div className="ev-sent ev-sent--light"><CheckCircle2 size={40}/><h3>Message Received</h3><p>Thank you. We'll respond within 24 hours.</p><button className="ev-btn ev-btn--grad" style={{marginTop:20}} onClick={()=>setSent(false)}>Send Another</button></div>
                ) : (
                  <form className="ev-form ev-form--light" onSubmit={submit}>
                    <div className="ev-form__r"><div className="ev-f"><label>Name <span className="req">*</span></label><input required placeholder="Your full name" value={f.name} onChange={e=>setF(p=>({...p,name:e.target.value}))}/></div><div className="ev-f"><label>Company <span className="req">*</span></label><input required placeholder="Organization" value={f.company} onChange={e=>setF(p=>({...p,company:e.target.value}))}/></div></div>
                    <div className="ev-form__r"><div className="ev-f"><label>Email <span className="req">*</span></label><input required type="email" placeholder="your@email.com" value={f.email} onChange={e=>setF(p=>({...p,email:e.target.value}))}/></div><div className="ev-f"><label>Phone <span className="opt">(Optional)</span></label><input placeholder="+1 000 000 0000" value={f.phone} onChange={e=>setF(p=>({...p,phone:e.target.value}))}/></div></div>
                    <div className="ev-f"><label>Preferred Language</label><div className="ev-radios">{["English","Italian","Spanish","Greek","Polish","French","German","Other"].map(l=><label key={l} className={`ev-rad${f.language===l?" ev-rad--on":""}`}><input type="radio" name="lang" checked={f.language===l} onChange={()=>setF(p=>({...p,language:l}))} style={{display:"none"}}/>{l}</label>)}</div></div>
                    <div className="ev-f"><label>Industry <span className="req">*</span></label><select required className="ev-sel" value={f.industry} onChange={e=>setF(p=>({...p,industry:e.target.value}))}><option value="">Select your industry</option>{["Construction & Engineering","Manufacturing","Tourism & Hospitality","Retail & Commerce","Import & Export","Marketing & SEO","European Projects","NGO & Associations","Professional Services","Startup / SME","Education & Training","Other"].map(x=><option key={x}>{x}</option>)}</select></div>
                    <div className="ev-f"><label>What are you interested in? <span className="req">*</span></label><div className="ev-checks">{["AI Automation","Business Intelligence","Digital Transformation","Custom Business Systems","European Project Solutions","Not Sure Yet"].map(x=><label key={x} className={`ev-chk${f.interests.includes(x)?" ev-chk--on":""}`} onClick={()=>tog(x)}><span className="ev-chk__b">{f.interests.includes(x)&&<CheckCircle2 size={12}/>}</span>{x}</label>)}</div></div>
                    <div className="ev-f"><label>Tell us about your challenge <span className="req">*</span></label><textarea required rows={5} placeholder="Describe your project, challenge, or business objective..." value={f.challenge} onChange={e=>setF(p=>({...p,challenge:e.target.value}))}/></div>
                    <label className="ev-consent"><input type="checkbox" required checked={consent} onChange={e=>setConsent(e.target.checked)}/><span>I agree that Evriel Systems may store and process the information I submit to respond to my inquiry, as described in the <a href="#" onClick={e=>{e.preventDefault();setPage&&setPage("privacy");window.scrollTo({top:0,behavior:"smooth"})}}>Privacy Policy</a>. <span className="req">*</span></span></label>
                    {err && <p className="ev-form__err">{err}</p>}
                    <button type="submit" className="ev-btn ev-btn--grad ev-btn--lg" style={{width:"100%",justifyContent:"center",marginTop:4}} disabled={sending}>{sending ? "Sending..." : "Start the Conversation"} {!sending && <ArrowUpRight size={16}/>}</button>
                  </form>
                )}
              </div>
            )}
          </div>
        </FX>
        <FX delay={140} y={30}>
          <div className="ev-contact2__foot">
            <h3 className="ev-contact2__stmt">Connecting Intelligence<br/>with Business</h3>
            <button className="ev-btn ev-btn--grad ev-btn--lg" onClick={()=>pick(null)}>Get in Touch <ArrowUpRight size={16}/></button>
          </div>
        </FX>
      </div>
    </section>
  );
}

/* FOOTER — dark teal, white wordmark, social links */
function Footer({setPage}) {
  return (
    <footer className="ev-footer">
      <div className="ev-wrap">
        <div className="ev-footer__top">
          <div onClick={()=>{setPage("home");window.scrollTo({top:0,behavior:"smooth"})}} className="ev-brand">
            <Logo light height={36}/>
          </div>
          <p className="ev-footer__tag">Connecting Intelligence with Business</p>
          <div className="ev-footer__social">
            <a href="https://www.instagram.com/evrielsystems" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="ev-soc"><Instagram size={16}/></a>
            <a href="https://www.linkedin.com/company/evriel-systems/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="ev-soc"><Linkedin size={16}/></a>
          </div>
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
      <section className="ev-ins-hero">
        <FX><Eyebrow>Research &middot; Insights</Eyebrow></FX>
        <FX delay={100}><h1 className="ev-ins-hero__h">Thinking <em>Forward</em></h1></FX>
      </section>
      <section className="ev-ins-grid"><div className="ev-wrap ev-ins-grid__in">{ARTS.map((a,i)=>(<FX key={i} delay={i*70} y={44}><article className="ev-art-card" onClick={()=>{setSlug(a.slug);setPage("article");window.scrollTo({top:0,behavior:"smooth"})}}><span className="ev-art-card__go"><ArrowUpRight size={13}/></span><div className="ev-art-card__meta"><span className="ev-art-card__tag">{a.tag}</span><span className="ev-art-card__date">{a.date}</span></div><h2 className="ev-art-card__t">{a.title}</h2><p className="ev-art-card__ex">{a.excerpt}</p><div className="ev-art-card__rd">Read Article <ArrowRight size={13}/></div></article></FX>))}</div></section>
    </>
  );
}

function ArticlePage({slug,setPage,setSlug}) {
  const art = ARTS.find(a=>a.slug===slug);
  if (!art) return null;
  const others = ARTS.filter(a=>a.slug!==slug).slice(0,3);
  return (
    <>
      <section className="ev-art-hero"><FX><span className="ev-art-hero__tag">{art.tag}</span></FX><FX delay={100}><h1 className="ev-art-hero__h">{art.title}</h1></FX><FX delay={160}><span className="ev-art-hero__date">{art.date}</span></FX></section>
      <section className="ev-art-body"><div className="ev-wrap ev-art-body__in"><div className="ev-art-body__content">{art.body.map((p,i)=><FX key={i} delay={i*20} y={30}><p className="ev-art-body__p">{p}</p></FX>)}<FX delay={200} y={30}><div className="ev-art-body__cta"><p>Ready to implement intelligent systems?</p><a href="#" className="ev-btn ev-btn--grad" onClick={e=>{e.preventDefault();setPage("home");setTimeout(()=>document.getElementById("contact")?.scrollIntoView({behavior:"smooth"}),300)}}>Let's Discuss Your Project <ArrowUpRight size={14}/></a></div></FX></div><div className="ev-art-body__side"><h4 className="ev-art-side__h">More Articles</h4>{others.map((a,i)=><FX key={i} delay={i*70} y={26}><div className="ev-art-side__item" onClick={()=>{setSlug(a.slug);window.scrollTo({top:0,behavior:"smooth"})}}><span className="ev-art-side__tag">{a.tag}</span><p className="ev-art-side__t">{a.title}</p></div></FX>)}</div></div></section>
    </>
  );
}

/* PRIVACY POLICY */
function PrivacyPage() {
  return (
    <section className="ev-privacy">
      <div className="ev-privacy__wrap">
        <FX><h1 className="ev-privacy__h">Privacy <em>Policy</em></h1></FX>
        <FX delay={60}><p className="ev-privacy__updated">Last updated: June 2026</p></FX>
        <div className="ev-privacy__content">
          <FX delay={100}>
            <h2>Who We Are</h2>
            <p>Evriel Systems is an AI and digital transformation consultancy based in Europe. This policy explains how we collect, use, and protect your information when you use our website (evrielsystems.com).</p>
          </FX>
          <FX delay={140}>
            <h2>Information We Collect</h2>
            <p>When you submit our contact form, we collect: your name, company name, email address, phone number (optional), preferred language, industry, areas of interest, and project description. We collect this information solely to respond to your inquiry.</p>
          </FX>
          <FX delay={180}>
            <h2>How We Use Your Information</h2>
            <p>We use the information you provide exclusively to respond to your inquiry, discuss potential projects, and provide requested services. We do not sell, rent, or share your personal information with third parties. We do not use your information for marketing purposes unless you explicitly consent.</p>
          </FX>
          <FX delay={220}>
            <h2>Cookies</h2>
            <p>This website uses only essential cookies required for basic functionality (such as remembering your cookie consent preference). We do not use tracking cookies, advertising cookies, or third-party analytics that track individual users.</p>
          </FX>
          <FX delay={260}>
            <h2>Your Rights (GDPR)</h2>
            <p>Under the General Data Protection Regulation (GDPR), you have the right to access, correct, or delete any personal data we hold about you. You may also withdraw consent at any time. To exercise any of these rights, contact us at <a href="mailto:contact@evrielsystems.com">contact@evrielsystems.com</a>.</p>
          </FX>
          <FX delay={300}>
            <h2>Data Retention</h2>
            <p>We retain contact form submissions only as long as necessary to respond to your inquiry and for legitimate business purposes. You may request deletion of your data at any time.</p>
          </FX>
          <FX delay={340}>
            <h2>Contact</h2>
            <p>For any privacy-related questions or data requests, contact us at <a href="mailto:contact@evrielsystems.com">contact@evrielsystems.com</a>.</p>
          </FX>
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
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap');

/* ===== EVRIEL DESIGN SYSTEM — abyssal observatory ===== */
:root{
  /* surfaces */
  --abyss:#012624;--trench:#011d1c;--reef:#003734;
  /* text & ui */
  --snow:#ffffff;--fog:#bbc7c6;--ice:#edfffe;--ash:#333333;
  /* accents */
  --lilac:#fde9ff;--teal:#00827c;--cyan:#cbfffc;--lav:#fad1ff;
  /* gradients */
  --g-current:linear-gradient(90deg,#00827c 0%,#cbfffc 100%);
  --g-aurora:linear-gradient(90deg,rgba(203,255,252,0.85) 0%,rgba(237,255,254,0.5) 26%,rgba(255,253,250,0.4) 48%,rgba(250,209,255,0.85) 89%);
  --g-text:linear-gradient(90deg,#cbfffc 0%,#fad1ff 100%);
  --font:'Inter',ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;
  --page-w:1200px;
}
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth}
body{font-family:var(--font);background:var(--abyss);color:var(--fog);font-weight:400;-webkit-font-smoothing:antialiased}
::selection{background:rgba(0,130,124,0.45);color:#fff}
::-webkit-scrollbar{width:10px}
::-webkit-scrollbar-track{background:var(--abyss)}
::-webkit-scrollbar-thumb{background:var(--reef);border-radius:5px;border:2px solid var(--abyss)}
::-webkit-scrollbar-thumb:hover{background:#00524d}
button,input,textarea,select{font-family:inherit;background:none;border:none;cursor:pointer}
a{text-decoration:none;color:inherit}
strong{font-weight:500;color:var(--snow)}
em{font-style:normal;background:var(--g-text);-webkit-background-clip:text;background-clip:text;color:transparent}
.dbr{display:block}
@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:0.01ms!important;animation-iteration-count:1!important;transition-duration:0.01ms!important}html{scroll-behavior:auto}}
@keyframes logospin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes cpulse{0%,100%{opacity:1}50%{opacity:0.4}}
@keyframes mq{from{transform:translateX(0)}to{transform:translateX(-25%)}}
@keyframes scBob{0%,100%{transform:translateY(0);opacity:1}50%{transform:translateY(10px);opacity:0.3}}
@keyframes flowDash{to{stroke-dashoffset:-24}}
@keyframes numFade{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
@keyframes indFade{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
@keyframes ringPulse{0%{transform:scale(0.7);opacity:0.8}100%{transform:scale(1.7);opacity:0}}
.ev-pulse-ring{transform-box:fill-box;transform-origin:center;animation:ringPulse 2.4s ${EASE} infinite}

/* ===== layout primitives ===== */
.ev-wrap{max-width:var(--page-w);margin:0 auto;padding:0 32px}
.ev-sec{position:relative;padding:120px 0}
.ev-intro{font-size:16px;line-height:1.5;color:var(--fog);max-width:520px;margin-top:24px}

/* type scale */
.ev-h-lg{font-size:clamp(38px,4.8vw,61px);font-weight:500;line-height:1.1;letter-spacing:-0.02em;color:var(--snow);margin-top:28px}
.ev-h-md{font-size:clamp(28px,3vw,36px);font-weight:400;line-height:1.3;letter-spacing:-0.013em;color:var(--snow)}

/* eyebrow — teal dot + tracked caps */
.ev-eyebrow{display:inline-flex;align-items:center;gap:12px;font-size:12px;font-weight:500;letter-spacing:1.44px;text-transform:uppercase;color:var(--fog)}
.ev-eyebrow__dot{width:6px;height:6px;border-radius:50%;background:var(--teal);flex-shrink:0}

/* giant decorative numerals — display-xl */
.ev-gnum{position:absolute;top:28px;right:-10px;font-size:clamp(140px,22vw,295px);font-weight:500;line-height:1;letter-spacing:-0.046em;color:rgba(237,255,254,0.035);pointer-events:none;user-select:none;z-index:0}
.ev-gnum--l{right:auto;left:-10px}

/* ===== buttons ===== */
.ev-btn{display:inline-flex;align-items:center;gap:10px;font-size:12px;font-weight:500;letter-spacing:1.44px;text-transform:uppercase;padding:14px 28px;border-radius:6px;transition:all 0.3s ${EASE};cursor:pointer}
.ev-btn svg{transition:transform 0.3s ${EASE}}
.ev-btn--grad{background:var(--g-current);color:var(--trench)}
.ev-btn--grad:hover{filter:brightness(1.07)}
.ev-btn--grad:hover svg{transform:translate(2px,-2px)}
.ev-btn--ghost{border:1px solid transparent;background:linear-gradient(var(--abyss),var(--abyss)) padding-box,var(--g-aurora) border-box;color:var(--snow);padding:13px 24px}
.ev-btn--ghost:hover{background:linear-gradient(var(--reef),var(--reef)) padding-box,linear-gradient(90deg,#cbfffc 0%,#edfffe 26%,#fffdfa 48%,#fad1ff 89%) border-box}
.ev-btn--sm{padding:9px 18px;font-size:11px}
.ev-btn--lg{padding:17px 38px}
.ev-btn:disabled{opacity:0.5;cursor:not-allowed}

/* small ghost arrow square */
.ev-sq{width:28px;height:28px;border:1px solid rgba(237,255,254,0.25);border-radius:6px;display:inline-flex;align-items:center;justify-content:center;color:var(--snow);transition:all 0.3s ${EASE}}
.ev-sq:hover{border-color:var(--ice);transform:scale(1.06)}

/* tags */
.ev-tag{display:inline-flex;font-size:11px;font-weight:500;letter-spacing:1.1px;text-transform:uppercase;color:var(--fog);background:var(--reef);border-radius:6px;padding:7px 12px;transition:all 0.3s ${EASE}}
.ev-tag:hover{color:var(--snow)}

/* ===== progress hairline ===== */
.ev-progress{position:fixed;top:0;left:0;right:0;height:2px;z-index:1001;pointer-events:none}
.ev-progress__bar{height:100%;background:var(--g-current);transform-origin:left;transform:scaleX(0)}

/* ===== nav — transparent, sits on the canvas ===== */
.ev-nav{position:fixed;top:0;left:0;right:0;z-index:999;padding:14px 0;transition:all 0.5s ${EASE};background:transparent}
.ev-nav--s{background:rgba(1,29,28,0.82);backdrop-filter:blur(20px);padding:9px 0}
.ev-nav__in{max-width:var(--page-w);margin:0 auto;padding:0 32px;display:flex;align-items:center;justify-content:space-between;height:52px}
.ev-brand{cursor:pointer;display:flex;align-items:center;gap:12px}
.ev-brand__name{font-size:16px;font-weight:500;color:var(--snow);letter-spacing:0.04em;line-height:1}
.ev-brand__sub{font-size:10px;font-weight:500;color:var(--fog);letter-spacing:2.4px;text-transform:uppercase;margin-top:3px}
.ev-nav__links{display:flex;align-items:center;gap:28px}
.ev-nav__link{font-size:12px;font-weight:500;letter-spacing:1.44px;text-transform:uppercase;color:var(--snow);transition:opacity 0.3s}
.ev-nav__link:hover{opacity:0.55}
.ev-nav__burger{display:none;color:var(--snow)}
.ev-mobile-menu{position:fixed;inset:0;background:var(--abyss);z-index:998;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:22px;padding-top:60px}
.ev-mob-link{font-size:26px;font-weight:500;letter-spacing:-0.01em;color:var(--snow);transition:opacity 0.3s}
.ev-mob-link:hover{opacity:0.55}

/* ===== hero — particle sphere in the abyss ===== */
.ev-hero{position:relative;min-height:100vh;display:flex;align-items:center;justify-content:center;overflow:hidden;padding:172px 0 140px;background:var(--abyss)}
.ev-hero__wash{position:absolute;inset:0;background:radial-gradient(ellipse 75% 50% at 50% 8%,rgba(250,209,255,0.05),rgba(237,255,254,0.03) 45%,transparent 70%);pointer-events:none}
.ev-hero__sphere{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:min(88vw,760px);height:min(88vw,760px);pointer-events:none}
.ev-hero__sphere-glow{position:absolute;inset:8%;border-radius:50%;background:radial-gradient(circle,rgba(0,130,124,0.28),rgba(0,130,124,0.07) 55%,transparent 72%)}
.ev-sphere__canvas{position:absolute;inset:0;width:100%;height:100%;-webkit-mask-image:radial-gradient(circle,#000 58%,transparent 74%);mask-image:radial-gradient(circle,#000 58%,transparent 74%)}
.ev-hero__body{position:relative;z-index:2;text-align:center;padding:0 24px;max-width:1000px}
.ev-hero__eyebrow{font-size:12px;font-weight:500;letter-spacing:2.4px;text-transform:uppercase;color:var(--cyan);margin-bottom:36px}
.ev-hero__h{font-size:clamp(44px,7.4vw,86px);font-weight:500;line-height:1.02;letter-spacing:-0.032em;color:var(--snow)}
.ev-hero__sub{font-size:16px;font-weight:400;color:var(--fog);margin-top:28px;line-height:1.5}
.ev-hero__ctas{display:flex;gap:16px;justify-content:center;margin-top:48px;flex-wrap:wrap}
.ev-hero__scroll{position:absolute;bottom:30px;left:50%;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:10px;color:var(--fog);font-size:10px;font-weight:500;letter-spacing:2.4px;text-transform:uppercase;z-index:2}
.ev-scr-pill{width:20px;height:30px;border:1px solid rgba(237,255,254,0.2);border-radius:10px;display:flex;justify-content:center;padding-top:6px}
.ev-scr-dot{width:3px;height:7px;background:var(--teal);border-radius:2px;animation:scBob 2s ease-in-out infinite}

/* ===== marquee ===== */
.ev-mq{background:var(--trench);padding:14px 0;overflow:hidden}
.ev-mq__track{display:flex;gap:48px;white-space:nowrap;animation:mq 24s linear infinite}
.ev-mq__i{display:inline-flex;align-items:center;gap:12px;font-size:12px;font-weight:500;letter-spacing:1.44px;text-transform:uppercase;color:var(--fog)}
.ev-mq__dot{width:6px;height:6px;border-radius:50%;background:var(--teal)}

/* ===== about — asymmetric editorial + convergence nodes ===== */
.ev-about{overflow:hidden}
.ev-about__grid{display:grid;grid-template-columns:1.08fr 0.92fr;gap:80px;position:relative;z-index:1}
.ev-about__lead{font-size:20px;font-weight:400;line-height:1.4;color:var(--ice);margin-top:36px}
.ev-about__quote{font-size:24px;font-weight:400;line-height:1.4;letter-spacing:-0.29px;color:var(--cyan);margin-top:20px;margin-bottom:28px}
.ev-about__p{font-size:14px;line-height:1.75;letter-spacing:0.2px;color:var(--fog);margin-bottom:14px;max-width:520px}
.ev-about__stats{display:grid;grid-template-columns:repeat(2,1fr);gap:16px;margin-top:48px}
.ev-afeat{background:var(--reef);border-radius:16px;padding:28px;transition:filter 0.3s ${EASE}}
.ev-afeat:hover{filter:brightness(1.12)}
.ev-afeat__n{display:block;font-size:20px;font-weight:500;line-height:1.3;color:var(--lav);margin-bottom:10px}
.ev-afeat__d{font-size:12px;line-height:1.6;letter-spacing:0.3px;color:var(--fog)}
.ev-afeat--pink{background:linear-gradient(135deg,#fad1ff 0%,#fffdfa 62%,#edfffe 100%)}
.ev-afeat--pink:hover{filter:brightness(1.02)}
.ev-afeat--pink .ev-afeat__n{color:#011d1c}
.ev-afeat--pink .ev-afeat__d{color:#274a47}
.ev-about__right{display:flex;flex-direction:column;justify-content:center;gap:48px}
.ev-conv{width:100%;max-width:470px}
.ev-challenges{display:flex;flex-direction:column;gap:10px}
.ev-ch{display:flex;align-items:center;gap:14px;padding:13px 18px;background:var(--trench);border-radius:6px;color:var(--fog);font-size:14px;letter-spacing:0.3px;transition:all 0.3s ${EASE}}
.ev-ch:hover{background:var(--reef);color:var(--snow)}
.ev-ch__dot{width:6px;height:6px;border-radius:50%;background:var(--teal);flex-shrink:0}

/* ===== outcomes — giant gradient index + expanding list ===== */
.ev-out{background:var(--trench)}
.ev-out__grid{display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:start}
.ev-out__display{display:flex;align-items:baseline;gap:14px;margin-top:56px}
.ev-out__num{font-size:clamp(110px,13vw,190px);font-weight:500;line-height:1;letter-spacing:-0.05em;background:var(--g-current);-webkit-background-clip:text;background-clip:text;color:transparent;animation:numFade 0.6s ${EASE}}
.ev-out__of{font-size:20px;font-weight:500;color:var(--fog)}
.ev-out__list{display:flex;flex-direction:column}
.ev-out__item{border-top:1px solid rgba(237,255,254,0.08);cursor:pointer;transition:background 0.3s ${EASE}}
.ev-out__item:last-child{border-bottom:1px solid rgba(237,255,254,0.08)}
.ev-out__head{display:flex;align-items:center;gap:20px;padding:24px 8px}
.ev-out__ix{font-size:12px;font-weight:500;letter-spacing:1.44px;color:var(--fog);transition:color 0.3s}
.ev-out__t{font-size:24px;font-weight:400;letter-spacing:-0.29px;color:var(--snow);flex:1}
.ev-out__chev{color:var(--fog);opacity:0.5;transition:all 0.3s ${EASE}}
.ev-out__item--on .ev-out__ix{color:var(--cyan)}
.ev-out__item--on .ev-out__chev{color:var(--cyan);opacity:1;transform:translate(2px,-2px)}
.ev-out__body{max-height:0;overflow:hidden;transition:max-height 0.55s ${EASE}}
.ev-out__item--on .ev-out__body{max-height:120px}
.ev-out__body p{font-size:14px;line-height:1.6;letter-spacing:0.3px;color:var(--fog);padding:0 8px 26px 46px;max-width:440px}

/* ===== industries — constellation ===== */
.ev-ind{overflow:hidden}
.ev-ind__grid{display:grid;grid-template-columns:0.95fr 1.05fr;gap:60px;align-items:center;position:relative;z-index:1}
.ev-ind__detail{min-height:180px;margin-top:44px;animation:indFade 0.55s ${EASE}}
.ev-ind__dnum{font-size:12px;font-weight:500;letter-spacing:1.44px;color:var(--cyan);display:block;margin-bottom:16px}
.ev-ind__dname{font-size:clamp(26px,2.9vw,36px);font-weight:400;letter-spacing:-0.47px;color:var(--snow);line-height:1.2;margin-bottom:14px}
.ev-ind__ddesc{font-size:14px;line-height:1.7;letter-spacing:0.3px;color:var(--fog);max-width:440px}
.ev-ind__dots{display:flex;gap:9px;margin-top:28px;flex-wrap:wrap}
.ev-ind__dot{width:8px;height:8px;border-radius:50%;padding:0;background:rgba(237,255,254,0.15);cursor:pointer;transition:all 0.4s ${EASE}}
.ev-ind__dot--on{background:var(--cyan);transform:scale(1.4)}

/* rotating industry orbit — cyan rings and glowing nodes on the abyss */
.ev-orbit{--orbR:225px;position:relative;width:540px;height:540px;margin:0 auto}
.ev-orbit__ring{position:absolute;inset:45px;border:1px solid rgba(203,255,252,0.16);border-radius:50%}
.ev-orbit__ring--in{inset:150px;border-color:rgba(203,255,252,0.08)}
.ev-orbit__spin{position:absolute;inset:0;animation:orbSpin 70s linear infinite}
.ev-orbit:hover .ev-orbit__spin,.ev-orbit:hover .ev-orbit__upright{animation-play-state:paused}
@keyframes orbSpin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes orbSpinRev{from{transform:rotate(0deg)}to{transform:rotate(-360deg)}}
.ev-orbit__pos{position:absolute;top:50%;left:50%;width:0;height:0}
.ev-orbit__upright{position:absolute;width:0;height:0;animation:orbSpinRev 70s linear infinite}
.ev-orbit__node{position:absolute;transform:translate(-50%,-50%);border:1px solid rgba(237,255,254,0.18);background:rgba(1,29,28,0.85);color:var(--fog);font-size:10.5px;font-weight:500;letter-spacing:1.1px;text-transform:uppercase;padding:9px 14px;border-radius:9999px;cursor:pointer;white-space:nowrap;transition:all 0.4s ${EASE};backdrop-filter:blur(4px)}
.ev-orbit__node--on{border-color:var(--cyan);background:var(--reef);color:#ffffff}
.ev-orbit__node:hover{color:#ffffff;border-color:rgba(203,255,252,0.5)}
.ev-orbit__hub{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:132px;height:132px;border-radius:50%;border:1px solid rgba(203,255,252,0.3);background:radial-gradient(circle,rgba(0,130,124,0.25),rgba(1,29,28,0.92) 72%);display:flex;align-items:center;justify-content:center;text-align:center}
.ev-orbit__hub span{font-size:13px;font-weight:500;letter-spacing:0.06em;color:#ffffff;line-height:1.4}

/* ===== services — editorial rows with outlined numerals ===== */
.ev-svc__rows{margin-top:64px}
.ev-svc__row{display:grid;grid-template-columns:110px 1.15fr 0.85fr;gap:40px;padding:56px 0;border-top:1px solid rgba(237,255,254,0.08);transition:background 0.3s ${EASE}}
.ev-svc__rows > div:last-child .ev-svc__row{border-bottom:1px solid rgba(237,255,254,0.08)}
.ev-svc__gn{font-size:61px;font-weight:500;line-height:1;letter-spacing:-1.22px;color:transparent;-webkit-text-stroke:1px rgba(203,255,252,0.35);transition:all 0.4s ${EASE}}
.ev-svc__row:hover .ev-svc__gn{-webkit-text-stroke:1px rgba(203,255,252,0.75)}
.ev-svc__t{font-size:clamp(26px,3vw,36px);font-weight:400;letter-spacing:-0.47px;color:var(--snow);margin-bottom:14px}
.ev-svc__d{font-size:14px;line-height:1.7;letter-spacing:0.3px;color:var(--fog);max-width:420px}
.ev-svc__al{font-size:12px;font-weight:500;letter-spacing:1.44px;text-transform:uppercase;color:var(--cyan);margin-bottom:16px}
.ev-svc__tags{display:flex;flex-wrap:wrap;gap:8px}
.ev-flow{display:flex;align-items:center;flex-wrap:wrap;gap:8px;margin-top:28px}
.ev-flow__seg{display:flex;align-items:center;gap:8px}
.ev-flow__node{font-size:11px;font-weight:500;letter-spacing:1.1px;text-transform:uppercase;color:var(--fog);border:1px solid rgba(237,255,254,0.15);border-radius:6px;padding:7px 12px;white-space:nowrap}
.ev-flow__node--end{background:var(--g-current);color:var(--trench);border-color:transparent}
.ev-flow__link{flex-shrink:0}

/* ===== projects — dark teal accent break ===== */
.ev-proj{overflow:hidden;background:var(--abyss)}
.ev-proj__list{margin-top:64px;position:relative;z-index:1}
.ev-prj{background:var(--trench);border-radius:16px;padding:32px 40px;margin-bottom:16px;cursor:pointer;transition:background 0.3s ${EASE}}
.ev-prj:hover,.ev-prj--o{background:var(--reef)}
.ev-prj__hd{display:flex;align-items:center;justify-content:space-between;gap:20px}
.ev-prj__hl{display:flex;align-items:center;gap:22px;flex-wrap:wrap}
.ev-prj__ix{font-size:12px;font-weight:500;letter-spacing:1.44px;color:var(--cyan)}
.ev-prj__t{font-size:24px;font-weight:400;letter-spacing:-0.29px;color:var(--snow)}
.ev-prj__badge{font-size:10px;font-weight:500;letter-spacing:2.4px;text-transform:uppercase;color:var(--lav);border:1px solid transparent;background:linear-gradient(var(--trench),var(--trench)) padding-box,var(--g-aurora) border-box;border-radius:6px;padding:5px 10px}
.ev-prj--o .ev-prj__badge,.ev-prj:hover .ev-prj__badge{background:linear-gradient(var(--reef),var(--reef)) padding-box,var(--g-aurora) border-box}
.ev-prj__tog{width:28px;height:28px;border:1px solid rgba(237,255,254,0.25);border-radius:6px;display:inline-flex;align-items:center;justify-content:center;color:var(--snow);flex-shrink:0;transition:border-color 0.3s}
.ev-prj:hover .ev-prj__tog{border-color:var(--ice)}
.ev-prj__bd{padding:26px 0 8px 0}
.ev-prj__bd > p{font-size:16px;line-height:1.5;color:var(--ice);max-width:600px}
.ev-prj__caps{display:flex;flex-wrap:wrap;gap:8px;margin-top:18px}
.ev-prj--o .ev-tag{background:var(--trench)}
.ev-prj__tl{font-size:14px;line-height:1.7;letter-spacing:0.3px;color:var(--fog);margin-top:18px;max-width:600px}
.ev-prj__more{display:inline-flex;align-items:center;gap:8px;font-size:12px;font-weight:500;letter-spacing:1.44px;text-transform:uppercase;color:var(--cyan);margin-top:20px;transition:opacity 0.3s}
.ev-prj__more:hover{opacity:0.7}
.ev-prj__detail{margin-top:26px;display:flex;flex-direction:column;gap:22px}
.ev-prj__detail-sec h4{font-size:12px;font-weight:500;letter-spacing:1.44px;text-transform:uppercase;color:var(--cyan);margin-bottom:10px}
.ev-prj__detail-sec p{font-size:14px;line-height:1.7;letter-spacing:0.2px;color:var(--fog);max-width:640px}
.ev-prj__detail-sec ul{list-style:none;display:flex;flex-direction:column;gap:8px}
.ev-prj__detail-sec li{font-size:14px;line-height:1.5;letter-spacing:0.2px;color:var(--fog);padding-left:18px;position:relative}
.ev-prj__detail-sec li::before{content:'';position:absolute;left:0;top:8px;width:6px;height:6px;border-radius:50%;background:var(--teal)}

/* ===== process — horizontal current line with beacons ===== */
.ev-proc{background:var(--trench);overflow:hidden}
.ev-proc__track{position:relative;margin-top:80px}
.ev-proc__line{position:absolute;top:5px;left:0;right:0;height:1px;background:linear-gradient(90deg,#00827c 0%,#cbfffc 55%,#fad1ff 100%);transform-origin:left;transform:scaleX(0)}
.ev-proc__grid{display:grid;grid-template-columns:repeat(5,1fr);gap:28px}
.ev-proc__step{padding-top:32px;position:relative}
.ev-proc__beacon{position:absolute;top:0;left:0;width:11px;height:11px;border-radius:50%;background:var(--teal)}
.ev-proc__num{font-size:12px;font-weight:500;letter-spacing:1.44px;color:var(--cyan);display:block;margin-bottom:12px}
.ev-proc__ct{font-size:20px;font-weight:500;color:var(--snow);margin-bottom:10px}
.ev-proc__cd{font-size:14px;line-height:1.6;letter-spacing:0.2px;color:var(--fog)}

/* ===== borders — atmospheric band ===== */
.ev-bdr{overflow:hidden;text-align:center}
.ev-bdr__wash{position:absolute;inset:0;background:radial-gradient(ellipse 62% 58% at 50% 50%,rgba(0,194,176,0.22),rgba(203,255,252,0.07) 45%,transparent 74%),radial-gradient(ellipse 30% 30% at 50% 46%,rgba(250,209,255,0.08),transparent 70%);pointer-events:none}
.ev-bdr__body{position:relative;z-index:1;display:flex;flex-direction:column;align-items:center}
.ev-bdr__p{font-size:16px;line-height:1.6;color:var(--fog);max-width:620px;margin-top:24px}
.ev-bdr__p + .ev-bdr__p{margin-top:14px}
.ev-bdr__tag{display:inline-flex;margin-top:40px;border:1px solid transparent;background:linear-gradient(var(--abyss),var(--abyss)) padding-box,var(--g-aurora) border-box;border-radius:6px;padding:14px 24px}
.ev-bdr__tag span{font-size:12px;font-weight:500;letter-spacing:1.1px;text-transform:uppercase;color:var(--ice);line-height:1.6}

/* ===== why — one big signature card with dotted sphere ===== */
.ev-bigcard{position:relative;overflow:hidden;display:grid;grid-template-columns:1.05fr 0.95fr;gap:48px;background:var(--trench);border-radius:24px;padding:64px;align-items:center}
.ev-bigcard__glow{position:absolute;inset:0;background:radial-gradient(ellipse 55% 85% at 84% 50%,rgba(203,255,252,0.22),rgba(0,194,176,0.08) 45%,transparent 72%);pointer-events:none}
.ev-bigcard__copy{position:relative;z-index:1}
.ev-bigcard__p{font-size:16px;line-height:1.6;color:var(--ice);margin-top:26px;max-width:520px}
.ev-bigcard__p--sub{font-size:14px;color:var(--fog);margin-top:14px}
.ev-bigcard__feats{margin:34px 0 38px}
.ev-bigfeat{display:flex;gap:16px;align-items:flex-start;padding:18px 0;border-top:1px solid rgba(237,255,254,0.08)}
.ev-bigfeat:last-child{border-bottom:1px solid rgba(237,255,254,0.08)}
.ev-bigfeat svg{color:var(--cyan);flex-shrink:0;margin-top:2px}
.ev-bigfeat h3{font-size:16px;font-weight:500;color:var(--snow);margin-bottom:4px}
.ev-bigfeat p{font-size:13px;line-height:1.6;letter-spacing:0.2px;color:var(--fog)}
.ev-bigcard__visual{position:relative;z-index:1;display:flex;justify-content:center}
.ev-dsphere{width:min(100%,380px)}

/* ===== trust — ledger rows ===== */
.ev-trust{background:var(--trench);overflow:hidden}
.ev-trust__grid{display:grid;grid-template-columns:1fr 1fr;gap:80px;position:relative;z-index:1}
.ev-trust__p{font-size:16px;line-height:1.6;color:var(--fog);margin-top:28px;max-width:480px}
.ev-trust__note{display:flex;gap:14px;margin-top:32px;background:var(--reef);border-radius:16px;padding:24px 26px;max-width:500px}
.ev-trust__note svg{color:var(--cyan);flex-shrink:0;margin-top:3px}
.ev-trust__note p{font-size:14px;line-height:1.65;letter-spacing:0.2px;color:var(--fog)}
.ev-trust__r{display:flex;flex-direction:column;justify-content:center}
.ev-trust__row{display:flex;gap:22px;align-items:flex-start;padding:26px 0;border-top:1px solid rgba(237,255,254,0.08)}
.ev-trust__row:last-child{border-bottom:1px solid rgba(237,255,254,0.08)}
.ev-trust__ci{width:44px;height:44px;border:1px solid rgba(237,255,254,0.2);border-radius:6px;display:flex;align-items:center;justify-content:center;color:var(--cyan);flex-shrink:0}
.ev-trust__ct{font-size:20px;font-weight:500;color:var(--snow);margin-bottom:6px}
.ev-trust__cd{font-size:14px;line-height:1.6;letter-spacing:0.3px;color:var(--fog)}

/* ===== statement — display type over twilight wash ===== */
.ev-stmt{overflow:hidden;text-align:center;padding:160px 0;background:var(--abyss)}
.ev-stmt__wash{position:absolute;inset:0;background:radial-gradient(ellipse 55% 62% at 50% 45%,rgba(250,209,255,0.10),rgba(203,255,252,0.06) 45%,rgba(0,194,176,0.04) 70%,transparent 88%);pointer-events:none}
.ev-stmt__body{position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;gap:52px}
.ev-stmt__h{font-size:clamp(32px,5.4vw,72px);font-weight:500;line-height:1.08;letter-spacing:-0.03em;color:var(--snow)}

/* ===== what next — drawn timeline ===== */
.ev-next{overflow:hidden}
.ev-next__tl{position:relative;margin-top:80px;padding:10px 0}
.ev-next__line{position:absolute;top:0;bottom:0;left:50%;width:1px;background:linear-gradient(180deg,#00827c 0%,#cbfffc 60%,#fad1ff 100%);transform-origin:top;transform:scaleY(0)}
.ev-next__row{position:relative;display:flex;justify-content:flex-start;padding:22px 0;width:100%}
.ev-next__row--r{justify-content:flex-end}
.ev-next__card{width:calc(50% - 44px);background:var(--trench);border-radius:16px;padding:32px 36px;transition:background 0.3s ${EASE}}
.ev-next__card:hover{background:var(--reef)}
.ev-next__num{font-size:12px;font-weight:500;letter-spacing:1.44px;color:var(--cyan);display:block;margin-bottom:12px}
.ev-next__t{font-size:20px;font-weight:500;color:var(--snow);margin-bottom:10px}
.ev-next__d{font-size:14px;line-height:1.65;letter-spacing:0.2px;color:var(--fog)}
.ev-next__node{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:11px;height:11px;border-radius:50%;background:var(--cyan)}

/* ===== contact ===== */
.ev-contact{overflow:hidden}
.ev-contact__grid{display:grid;grid-template-columns:0.85fr 1.15fr;gap:80px;position:relative;z-index:1}
.ev-contact__p{font-size:16px;line-height:1.6;color:var(--fog);margin-top:28px;max-width:440px}
.ev-contact__info{display:flex;flex-direction:column;gap:24px;margin-top:48px}
.ev-contact__bl{font-size:12px;font-weight:500;letter-spacing:1.44px;text-transform:uppercase;color:var(--cyan);margin-bottom:6px}
.ev-contact__bv{font-size:16px;color:var(--snow);transition:opacity 0.3s}
.ev-contact__bv:hover{opacity:0.6}
.ev-form{background:var(--trench);border-radius:16px;padding:40px;display:flex;flex-direction:column;gap:22px}
.ev-form__r{display:grid;grid-template-columns:1fr 1fr;gap:18px}
.ev-f{display:flex;flex-direction:column;gap:9px}
.ev-f label{font-size:12px;font-weight:500;letter-spacing:1.44px;text-transform:uppercase;color:var(--fog)}
.req{color:var(--lav)}
.opt{color:var(--fog);opacity:0.6;text-transform:none;letter-spacing:0.3px}
.ev-f input,.ev-f textarea,.ev-sel{background:var(--abyss);border:1px solid transparent;border-radius:6px;padding:13px 16px;font-size:14px;letter-spacing:0.2px;color:var(--snow);cursor:text;transition:border-color 0.3s ${EASE}}
.ev-f input::placeholder,.ev-f textarea::placeholder{color:rgba(187,199,198,0.4)}
.ev-f input:focus,.ev-f textarea:focus,.ev-sel:focus{outline:none;border-color:rgba(237,255,254,0.35)}
.ev-f textarea{resize:vertical;min-height:110px}
.ev-sel{appearance:none;cursor:pointer;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23bbc7c6' fill='none'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 16px center}
.ev-sel option{background:var(--trench);color:var(--snow)}
.ev-radios{display:flex;flex-wrap:wrap;gap:8px}
.ev-rad{font-size:12px;font-weight:500;letter-spacing:1.1px;text-transform:uppercase;color:var(--fog);border-radius:6px;background:var(--abyss);padding:9px 14px;cursor:pointer;transition:all 0.3s ${EASE}}
.ev-rad--on{background:var(--reef);color:var(--snow)}
.ev-checks{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.ev-chk{display:flex;align-items:center;gap:10px;font-size:13px;letter-spacing:0.3px;color:var(--fog);background:var(--abyss);border-radius:6px;padding:11px 14px;cursor:pointer;transition:all 0.3s ${EASE}}
.ev-chk--on{background:var(--reef);color:var(--snow)}
.ev-chk__b{width:16px;height:16px;border:1px solid rgba(237,255,254,0.3);border-radius:4px;display:inline-flex;align-items:center;justify-content:center;color:var(--cyan);flex-shrink:0}
.ev-consent{display:flex;gap:12px;align-items:flex-start;cursor:pointer}
.ev-consent input{margin-top:3px;accent-color:#00827c}
.ev-consent span{font-size:12px;line-height:1.6;letter-spacing:0.3px;color:var(--fog)}
.ev-consent a{color:var(--cyan);text-decoration:underline}
.ev-form__err{font-size:13px;color:var(--lav);letter-spacing:0.2px}
.ev-sent{background:var(--trench);border-radius:16px;padding:64px 40px;text-align:center;display:flex;flex-direction:column;align-items:center;gap:12px}
.ev-sent svg{color:var(--cyan)}
.ev-sent h3{font-size:24px;font-weight:500;color:var(--snow)}
.ev-sent p{font-size:14px;color:var(--fog)}

/* ===== footer — dark teal ===== */
.ev-footer{background:var(--abyss);padding:64px 0 40px}
.ev-footer__top{display:flex;align-items:center;justify-content:space-between;gap:20px;flex-wrap:wrap}
.ev-footer__social{display:flex;gap:10px}
.ev-soc{width:36px;height:36px;border:1px solid rgba(237,255,254,0.25);border-radius:9999px;display:inline-flex;align-items:center;justify-content:center;color:var(--snow);transition:all 0.3s ${EASE}}
.ev-soc:hover{border-color:var(--cyan);color:var(--cyan);transform:scale(1.06)}
.ev-footer__tag{font-size:12px;letter-spacing:1.1px;text-transform:uppercase;color:rgba(187,199,198,0.5)}
.ev-footer__line{height:1px;background:rgba(237,255,254,0.07);margin:28px 0 22px}
.ev-footer__bot{display:flex;align-items:center;justify-content:space-between;gap:12px;font-size:12px;letter-spacing:0.4px;color:rgba(187,199,198,0.55)}
.ev-footer__link{transition:color 0.3s}
.ev-footer__link:hover{color:var(--snow)}

/* ===== insights ===== */
.ev-ins-hero{padding:200px 32px 80px;max-width:var(--page-w);margin:0 auto}
.ev-ins-hero__h{font-size:clamp(48px,8vw,96px);font-weight:500;line-height:1;letter-spacing:-0.04em;color:var(--snow);margin-top:28px}
.ev-ins-grid{padding-bottom:140px}
.ev-ins-grid__in{display:grid;grid-template-columns:1fr 1fr;gap:20px}
.ev-art-card{position:relative;background:var(--trench);border-radius:16px;padding:40px;cursor:pointer;transition:background 0.3s ${EASE}}
.ev-art-card:hover{background:var(--reef)}
.ev-art-card__go{position:absolute;top:24px;right:24px;width:28px;height:28px;border:1px solid rgba(237,255,254,0.25);border-radius:6px;display:flex;align-items:center;justify-content:center;color:var(--snow);transition:all 0.3s ${EASE}}
.ev-art-card:hover .ev-art-card__go{border-color:var(--ice);transform:scale(1.07)}
.ev-art-card__meta{display:flex;align-items:center;gap:14px;margin-bottom:20px}
.ev-art-card__tag{font-size:11px;font-weight:500;letter-spacing:1.44px;text-transform:uppercase;color:var(--cyan)}
.ev-art-card__date{font-size:11px;letter-spacing:1.1px;color:rgba(187,199,198,0.5)}
.ev-art-card__t{font-size:24px;font-weight:400;letter-spacing:-0.29px;line-height:1.35;color:var(--snow);margin-bottom:14px;padding-right:36px}
.ev-art-card__ex{font-size:14px;line-height:1.65;letter-spacing:0.3px;color:var(--fog);margin-bottom:24px}
.ev-art-card__rd{display:inline-flex;align-items:center;gap:8px;font-size:12px;font-weight:500;letter-spacing:1.44px;text-transform:uppercase;color:var(--cyan)}

/* ===== article page ===== */
.ev-art-hero{padding:200px 32px 70px;max-width:820px;margin:0 auto;text-align:center}
.ev-art-hero__tag{font-size:12px;font-weight:500;letter-spacing:2.4px;text-transform:uppercase;color:var(--cyan)}
.ev-art-hero__h{font-size:clamp(30px,4.6vw,52px);font-weight:500;line-height:1.15;letter-spacing:-0.02em;color:var(--snow);margin:24px 0}
.ev-art-hero__date{font-size:12px;letter-spacing:1.44px;color:rgba(187,199,198,0.55)}
.ev-art-body{padding-bottom:140px}
.ev-art-body__in{display:grid;grid-template-columns:1fr 280px;gap:64px}
.ev-art-body__p{font-size:16px;line-height:1.8;color:var(--fog);margin-bottom:22px;max-width:680px}
.ev-art-body__cta{background:var(--trench);border-radius:16px;padding:36px 40px;margin-top:36px;display:flex;flex-direction:column;gap:20px;align-items:flex-start}
.ev-art-body__cta p{font-size:20px;font-weight:500;color:var(--snow)}
.ev-art-side__h{font-size:12px;font-weight:500;letter-spacing:1.44px;text-transform:uppercase;color:var(--cyan);margin-bottom:22px}
.ev-art-side__item{padding:20px 0;border-top:1px solid rgba(237,255,254,0.08);cursor:pointer;transition:opacity 0.3s}
.ev-art-side__item:hover{opacity:0.65}
.ev-art-side__tag{font-size:10px;font-weight:500;letter-spacing:2.4px;text-transform:uppercase;color:var(--cyan)}
.ev-art-side__t{font-size:15px;line-height:1.5;color:var(--snow);margin-top:8px}

/* ===== privacy ===== */
.ev-privacy{padding:200px 32px 140px}
.ev-privacy__wrap{max-width:720px;margin:0 auto}
.ev-privacy__h{font-size:clamp(38px,5vw,61px);font-weight:500;letter-spacing:-0.02em;color:var(--snow)}
.ev-privacy__updated{font-size:12px;letter-spacing:1.44px;text-transform:uppercase;color:rgba(187,199,198,0.55);margin-top:16px}
.ev-privacy__content{margin-top:48px;display:flex;flex-direction:column;gap:36px}
.ev-privacy__content h2{font-size:20px;font-weight:500;color:var(--snow);margin-bottom:12px}
.ev-privacy__content p{font-size:14px;line-height:1.75;letter-spacing:0.2px;color:var(--fog)}
.ev-privacy__content a{color:var(--cyan);text-decoration:underline}

/* ===== cookie consent ===== */
.ev-cookie{position:fixed;bottom:20px;left:50%;transform:translateX(-50%);z-index:1002;width:min(720px,calc(100vw - 32px));background:var(--trench);border-radius:16px;padding:20px 26px;display:flex;align-items:center;gap:22px}
.ev-cookie p{font-size:12px;line-height:1.6;letter-spacing:0.3px;color:var(--fog)}
.ev-cookie a{color:var(--cyan);text-decoration:underline}
.ev-cookie__btn{flex-shrink:0;background:var(--g-current);color:var(--trench);font-size:11px;font-weight:500;letter-spacing:1.44px;text-transform:uppercase;border-radius:6px;padding:11px 18px;transition:filter 0.3s}
.ev-cookie__btn:hover{filter:brightness(1.07)}

/* ===== glow washes — the background journey ===== */
.ev-wash{position:absolute;inset:0;pointer-events:none;opacity:0}
.ev-wash--teal{background:radial-gradient(ellipse 72% 62% at 50% 26%,rgba(0,194,176,0.17),rgba(0,130,124,0.05) 45%,transparent 72%)}
.ev-wash--tealLeft{background:radial-gradient(ellipse 58% 72% at 8% 42%,rgba(0,194,176,0.16),rgba(0,130,124,0.05) 48%,transparent 74%)}
.ev-wash--tealRight{background:radial-gradient(ellipse 58% 72% at 92% 38%,rgba(0,194,176,0.15),rgba(203,255,252,0.05) 45%,transparent 74%)}
.ev-wash--mint{background:radial-gradient(ellipse 52% 64% at 76% 34%,rgba(203,255,252,0.18),rgba(0,194,176,0.06) 45%,transparent 72%)}
.ev-wash--lav{background:radial-gradient(ellipse 62% 58% at 50% 58%,rgba(250,209,255,0.10),rgba(237,255,254,0.05) 50%,transparent 76%)}

/* ===== service mockups — dark cards with glowing edges ===== */
.ev-mock{position:relative;margin-top:28px;max-width:440px;border-radius:16px;padding:16px;border:1px solid transparent;background:linear-gradient(var(--trench),var(--trench)) padding-box,linear-gradient(135deg,rgba(0,194,176,0.55),rgba(203,255,252,0.12) 45%,rgba(250,209,255,0.4)) border-box}
.ev-mock__bar{display:flex;align-items:center;gap:6px;padding-bottom:12px;border-bottom:1px solid rgba(237,255,254,0.07);margin-bottom:12px}
.ev-mock__bar span{width:7px;height:7px;border-radius:50%;background:rgba(237,255,254,0.18)}
.ev-mock__bar i{font-style:normal;margin-left:8px;font-size:10px;font-weight:500;letter-spacing:1.44px;text-transform:uppercase;color:var(--fog)}
.ev-mock__row{display:flex;align-items:center;gap:10px;padding:9px 10px;border-radius:6px;background:var(--abyss);margin-bottom:8px}
.ev-mock__dot{width:6px;height:6px;border-radius:50%;background:var(--teal);flex-shrink:0}
.ev-mock__from{font-size:12px;letter-spacing:0.2px;color:var(--fog);flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ev-mock__tag{font-size:9px;font-weight:500;letter-spacing:1.1px;text-transform:uppercase;border-radius:6px;padding:3px 7px;flex-shrink:0}
.ev-mock__tag--u{background:rgba(250,209,255,0.14);color:var(--lav)}
.ev-mock__tag--f{background:rgba(0,194,176,0.16);color:var(--cyan)}
.ev-mock__tag--l{background:rgba(237,255,254,0.08);color:var(--fog)}
.ev-mock__out{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:6px;background:var(--reef);font-size:12px;letter-spacing:0.2px;color:var(--ice)}
.ev-mock__ai{font-size:9px;font-weight:500;letter-spacing:1.4px;background:var(--g-current);color:var(--trench);border-radius:6px;padding:3px 7px;flex-shrink:0}
.ev-dash{display:flex;flex-direction:column;gap:10px}
.ev-dash__kpis{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.ev-dash__kpi{background:var(--abyss);border-radius:6px;padding:10px 12px}
.ev-dash__kpi i{display:block;font-style:normal;font-size:9px;font-weight:500;letter-spacing:1.4px;text-transform:uppercase;color:var(--fog);margin-bottom:9px}
.ev-dash__kpi span{display:block;height:6px;border-radius:3px;background:var(--g-current);width:72%}
.ev-dash__kpi:last-child span{width:46%;background:linear-gradient(90deg,#cbfffc,#fad1ff)}
.ev-dash__chart{display:flex;align-items:flex-end;gap:6px;height:72px;background:var(--abyss);border-radius:6px;padding:10px 12px}
.ev-dash__chart span{flex:1;border-radius:3px 3px 0 0;background:linear-gradient(180deg,rgba(203,255,252,0.85),rgba(0,130,124,0.45));transform-origin:bottom}
.ev-dash__line{width:100%;height:38px;background:var(--abyss);border-radius:6px;padding:6px 10px}

/* ===== tool marquee — bright panel on the abyss, brand-colored icons ===== */
@keyframes mqR{from{transform:translateX(-25%)}to{transform:translateX(0)}}
.ev-tm{padding:24px 0 56px}
.ev-tm__panel{background:linear-gradient(135deg,#f0fffe 0%,#ebfffd 55%,#fdf4ff 100%);border-radius:24px;padding:44px 0 38px;overflow:hidden}
.ev-tm__label{text-align:center;font-size:10px;font-weight:500;letter-spacing:2.4px;text-transform:uppercase;color:#4a5a58;margin-bottom:26px}
.ev-tm__row{overflow:hidden;padding:6px 0}
.ev-tm__track{display:flex;gap:14px;white-space:nowrap;width:max-content;animation:mq 28s linear infinite}
.ev-tm__track--rev{animation:mqR 32s linear infinite}
.ev-tm__i{display:inline-flex;align-items:center;gap:10px;font-size:13px;font-weight:500;letter-spacing:0.3px;color:#1d3a37;background:#ffffff;border:1px solid rgba(1,38,36,0.08);border-radius:9999px;padding:10px 18px}
.ev-tm__i img{width:17px;height:17px;display:block}

/* ===== contact — white card floating on a bright teal glow ===== */
.ev-contact2{position:relative;padding:150px 0 120px;overflow:hidden}
.ev-contact2__glow{position:absolute;inset:0;background:radial-gradient(ellipse 85% 82% at 50% 42%,rgba(0,194,176,0.5),rgba(0,130,124,0.22) 42%,rgba(1,38,36,0) 74%),radial-gradient(ellipse 42% 36% at 50% 36%,rgba(203,255,252,0.28),transparent 70%);pointer-events:none}
.ev-contact2__in{position:relative;z-index:1}
.ev-wcard{background:#fdfffe;border-radius:24px;padding:56px}
.ev-wcard__grid{display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:start}
.ev-eyebrow--dark{color:#00615c}
.ev-wcard__h{font-size:clamp(38px,4.8vw,61px);font-weight:500;line-height:1.05;letter-spacing:-0.02em;color:#011d1c;margin-top:24px}
.ev-wcard__p{font-size:15px;line-height:1.65;color:#3f4f4e;margin-top:22px;max-width:420px}
.ev-wcard__mail{display:inline-block;margin-top:26px;font-size:15px;font-weight:500;color:#00615c;border-bottom:1px solid rgba(0,97,92,0.35);padding-bottom:2px;transition:opacity 0.3s}
.ev-wcard__mail:hover{opacity:0.6}
.ev-cats{display:flex;flex-direction:column}
.ev-cat{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:24px 4px;border-top:1px solid rgba(1,38,36,0.12);font-size:clamp(18px,2vw,24px);font-weight:400;letter-spacing:-0.2px;color:#011d1c;text-align:left;transition:padding 0.35s ${EASE},color 0.3s}
.ev-cat:last-child{border-bottom:1px solid rgba(1,38,36,0.12)}
.ev-cat:hover{color:#00827c;padding-left:12px}
.ev-cat__go{width:34px;height:34px;border:1px solid rgba(1,38,36,0.2);border-radius:6px;display:inline-flex;align-items:center;justify-content:center;color:#011d1c;flex-shrink:0;transition:all 0.3s ${EASE}}
.ev-cat:hover .ev-cat__go{background:var(--g-current);border-color:transparent}
.ev-wcard__form{margin-top:48px;border-top:1px solid rgba(1,38,36,0.1);padding-top:44px}
.ev-form--light{background:transparent;padding:0}
.ev-form--light .ev-f label{color:#3f4f4e}
.ev-form--light .ev-f input,.ev-form--light .ev-f textarea,.ev-form--light .ev-sel{background:#eef4f3;color:#011d1c}
.ev-form--light .ev-f input::placeholder,.ev-form--light .ev-f textarea::placeholder{color:rgba(63,79,78,0.5)}
.ev-form--light .ev-f input:focus,.ev-form--light .ev-f textarea:focus,.ev-form--light .ev-sel:focus{border-color:rgba(0,130,124,0.5)}
.ev-form--light .ev-sel option{background:#ffffff;color:#011d1c}
.ev-form--light .ev-rad{background:#eef4f3;color:#3f4f4e}
.ev-form--light .ev-rad--on{background:#012624;color:#ffffff}
.ev-form--light .ev-chk{background:#eef4f3;color:#3f4f4e}
.ev-form--light .ev-chk--on{background:#012624;color:#ffffff}
.ev-form--light .ev-chk__b{border-color:rgba(1,38,36,0.3)}
.ev-form--light .ev-consent span{color:#3f4f4e}
.ev-form--light .ev-consent a{color:#00615c}
.ev-form--light .req{color:#b44db0}
.ev-form--light .ev-form__err{color:#b44db0}
.ev-sent--light{background:transparent;padding:24px 0}
.ev-sent--light svg{color:#00827c}
.ev-sent--light h3{color:#011d1c}
.ev-sent--light p{color:#3f4f4e}
.ev-contact2__foot{display:flex;align-items:center;justify-content:space-between;gap:32px;margin-top:72px;flex-wrap:wrap}
.ev-contact2__stmt{font-size:clamp(28px,3.6vw,48px);font-weight:500;line-height:1.1;letter-spacing:-0.02em;color:var(--snow)}

/* ===== responsive ===== */
@media(max-width:1024px){
  .ev-about__grid,.ev-out__grid,.ev-ind__grid,.ev-trust__grid,.ev-contact__grid{grid-template-columns:1fr;gap:56px}
  .ev-bigcard{grid-template-columns:1fr;padding:48px;gap:40px}
  .ev-wcard__grid{grid-template-columns:1fr;gap:44px}
  .ev-orbit{--orbR:190px;width:460px;height:460px}
  .ev-orbit__ring{inset:38px}
  .ev-orbit__ring--in{inset:128px}
  .ev-svc__row{grid-template-columns:70px 1fr;gap:24px}
  .ev-svc__r{grid-column:2}
  .ev-svc__gn{font-size:44px}
  .ev-proc__grid{grid-template-columns:repeat(2,1fr);gap:40px 28px}
  .ev-proc__line{display:none}
  .ev-ins-grid__in{grid-template-columns:1fr}
  .ev-art-body__in{grid-template-columns:1fr}
  .ev-gnum{font-size:clamp(120px,18vw,200px)}
}
@media(max-width:768px){
  .ev-sec{padding:88px 0}
  .ev-wrap,.ev-nav__in{padding:0 20px}
  .ev-nav__links{display:none}
  .ev-nav__burger{display:block}
  .ev-hero{padding:140px 0 100px}
  .ev-hero__sphere{width:130vw;height:130vw;opacity:0.55}
  .ev-hero__sub br{display:none}
  .ev-out__num{font-size:96px}
  .ev-out__t{font-size:20px}
  .ev-out__body p{padding-left:38px}
  .ev-svc__row{grid-template-columns:1fr;gap:18px;padding:40px 0}
  .ev-prj{padding:24px 22px}
  .ev-prj__t{font-size:20px}
  .ev-proc__grid{grid-template-columns:1fr}
  .ev-next__line{left:5px}
  .ev-next__row,.ev-next__row--r{justify-content:flex-start;padding:14px 0 14px 30px}
  .ev-next__card{width:100%}
  .ev-next__node{left:5px}
  .ev-form{padding:24px 20px}
  .ev-form__r,.ev-checks{grid-template-columns:1fr}
  .ev-footer__top,.ev-footer__bot{flex-direction:column;align-items:flex-start;gap:12px}
  .ev-ins-hero{padding:160px 20px 60px}
  .ev-art-hero{padding:150px 20px 60px}
  .ev-privacy{padding:150px 20px 100px}
  .ev-cookie{flex-direction:column;align-items:stretch;text-align:center;padding:18px 20px;gap:14px}
  .ev-about__stats{gap:12px}
  .ev-gnum{display:none}
  .ev-orbit{--orbR:142px;width:340px;height:340px}
  .ev-orbit__ring{inset:28px}
  .ev-orbit__ring--in{inset:96px}
  .ev-orbit__node{font-size:9px;padding:6px 10px;letter-spacing:0.8px}
  .ev-orbit__hub{width:96px;height:96px}
  .ev-orbit__hub span{font-size:11px}
  .ev-bigcard{padding:36px 24px;border-radius:20px}
  .ev-wcard{padding:32px 24px;border-radius:20px}
  .ev-wcard__form{margin-top:36px;padding-top:32px}
  .ev-cat{padding:20px 2px;font-size:18px}
  .ev-contact2{padding:110px 0 96px}
  .ev-contact2__foot{flex-direction:column;align-items:flex-start;gap:24px;margin-top:56px}
  .ev-mock{max-width:100%}
}
@media(max-width:480px){
  .ev-hero__ctas{flex-direction:column;align-items:stretch}
  .ev-hero__ctas .ev-btn{justify-content:center}
  .ev-radios{flex-direction:column;align-items:flex-start}
  .ev-about__stats{grid-template-columns:1fr}
  .ev-orbit{--orbR:126px;width:300px;height:300px}
  .ev-orbit__hub{width:84px;height:84px}
}
      `}</style>

      <ScrollProgress/>
      <Nav page={page} setPage={setPage}/>
      {page==="home"&&<><Hero/><Marquee/><About/><TechMarquee/><Outcomes/><Industries/><Services/><Projects/><Process/><Borders/><Why/><Trust/><Statement/><WhatNext/><Contact setPage={setPage}/></>}
      {page==="insights"&&<InsightsHome setPage={setPage} setSlug={setSlug}/>}
      {page==="article"&&<ArticlePage slug={slug} setPage={setPage} setSlug={setSlug}/>}
      {page==="privacy"&&<PrivacyPage/>}
      <Footer setPage={setPage}/>
      <CookieConsent setPage={setPage}/>
      <ChatWidget/>
    </>
  );
}

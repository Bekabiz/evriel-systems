import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowRight } from "lucide-react";
import EvrielCore from "./EvrielCore";
import { HERO, CHAOS_WORDS, SHIFT_LINE, PILLARS, OUTCOMES, STATEMENT, CONTACT } from "../content";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* deterministic scatter vectors for the 11 module nodes
   (DOM order: 4 outer, 4 middle, 3 inner) */
const SC_X = [26, -34, 30, -24, 38, -30, 34, -40, 18, -26, 22];
const SC_Y = [-30, 22, 34, -28, -22, 36, -30, 24, -34, 18, 30];
const SC_R = [18, -14, 12, -20, 16, -12, 20, -16, 24, -18, 14];

const PHASES = [
  ["01", "Signal"],
  ["02", "The Problem"],
  ["03", "Intelligence Enters"],
  ["04", "The Evriel Structure"],
  ["05", "Outcomes"],
  ["06", "Begin"],
];
const PHASE_AT = [0, 0.15, 0.3, 0.5, 0.7, 0.85];

const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

export default function ScrollJourney() {
  const rootRef = useRef(null);
  const phaseNum = useRef(null);
  const phaseName = useRef(null);
  const phaseIdx = useRef(-1);

  useGSAP(() => {
    const stage = rootRef.current.querySelector(".jn__stage");

    /* ---------- initial state: the Core is incomplete ---------- */
    gsap.set(".ring-in", { strokeDasharray: 1, strokeDashoffset: 0.25, opacity: 1 });
    gsap.set(".ring-mid", { strokeDasharray: 1, strokeDashoffset: 0.62, opacity: 0.55 });
    gsap.set(".ring-out", { strokeDasharray: 1, strokeDashoffset: 0.86, opacity: 0.35 });
    gsap.set(".ring-ticks", { opacity: 0.12 });
    gsap.set(".lk-c", { strokeDasharray: 1, strokeDashoffset: 0.12, opacity: 0.55 });
    gsap.set(".lk-im", { strokeDasharray: 1, strokeDashoffset: 0.78, opacity: 0.3 });
    gsap.set(".lk-mo", { strokeDasharray: 1, strokeDashoffset: 1, opacity: 0.25 });
    gsap.set(".nd-mid", { opacity: 0.45 });
    gsap.set(".nd-out", { opacity: 0.2 });
    gsap.set(".jn__ov:not(.jn__hero)", { autoAlpha: 0 });
    gsap.set(".jn__chaos-w", { autoAlpha: 0, y: 44 });
    gsap.set(".jn__pillar", { autoAlpha: 0, y: 36 });
    gsap.set(".jn__pillar-lead", { scaleX: 0 });
    gsap.set(".jn__out-item", { autoAlpha: 0, y: 26 });
    gsap.set(".nd-halo", { transformOrigin: "50% 50%", scale: 0.5 });

    const tl = gsap.timeline({
      defaults: { ease: "power1.inOut" },
      scrollTrigger: {
        trigger: rootRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        onUpdate: (self) => {
          const p = self.progress;
          document.documentElement.dataset.theme = p > 0.4 ? "light" : "dark";
          let i = 0;
          for (let k = 0; k < PHASE_AT.length; k++) if (p >= PHASE_AT[k]) i = k;
          if (i !== phaseIdx.current) {
            phaseIdx.current = i;
            if (phaseNum.current) phaseNum.current.textContent = PHASES[i][0];
            if (phaseName.current) phaseName.current.textContent = PHASES[i][1];
          }
        },
        onLeave: () => { document.documentElement.dataset.theme = "light"; },
        onEnterBack: () => { document.documentElement.dataset.theme = "light"; },
      },
    });

    /* ================= 0–15 · HERO ================= */
    tl.to(".jn__hero", { autoAlpha: 0, y: -70, duration: 6, ease: "power1.in" }, 8);
    tl.to(".jn__scrollhint", { autoAlpha: 0, duration: 3 }, 5);

    /* ================= 15–30 · BUSINESS CHAOS ================= */
    tl.to(".core-rot--in", { rotation: 26, svgOrigin: "400 400", duration: 13 }, 15);
    tl.to(".core-rot--mid", { rotation: -38, svgOrigin: "400 400", duration: 13 }, 15);
    tl.to(".core-rot--out", { rotation: 15, svgOrigin: "400 400", duration: 13 }, 15);
    tl.to(".nd", {
      x: (i) => SC_X[i], y: (i) => SC_Y[i], rotation: (i) => SC_R[i],
      duration: 12, ease: "power1.inOut",
    }, 15);
    tl.to(".ring-in", { strokeDashoffset: 0.38, duration: 10 }, 15);
    tl.to(".ring-mid", { strokeDashoffset: 0.75, opacity: 0.35, duration: 10 }, 15);
    tl.to(".ring-out", { strokeDashoffset: 0.93, opacity: 0.22, duration: 10 }, 15);
    tl.to(".lk-c", { strokeDashoffset: 0.55, opacity: 0.28, duration: 8 }, 15);
    tl.to(".lk-im", { strokeDashoffset: 1, duration: 8 }, 15);
    tl.to(".jn__grid", { opacity: 0.4, duration: 10 }, 15);
    tl.to(".jn__chaos", { autoAlpha: 1, duration: 1 }, 16);
    tl.to(".jn__chaos-w", { autoAlpha: 1, y: 0, duration: 3.4, stagger: 1.4, ease: "power2.out" }, 16.5);
    tl.to(".jn__chaos-w", { autoAlpha: 0, y: -30, duration: 2.6, stagger: 0.4, ease: "power1.in" }, 26.8);
    tl.to(".jn__chaos", { autoAlpha: 0, duration: 1 }, 29);

    /* ================= 30–50 · INTELLIGENCE ENTERS ================= */
    tl.to(".core-rot--in, .core-rot--mid, .core-rot--out", {
      rotation: 0, svgOrigin: "400 400", duration: 14, ease: "power2.inOut",
    }, 32);
    tl.to(".nd", { x: 0, y: 0, rotation: 0, duration: 13, ease: "power2.out" }, 32);
    tl.to(".ring-in", { strokeDashoffset: 0, opacity: 1, duration: 12 }, 33);
    tl.to(".ring-mid", { strokeDashoffset: 0, opacity: 0.95, duration: 13 }, 34);
    tl.to(".ring-out", { strokeDashoffset: 0, opacity: 0.9, duration: 14 }, 35);
    tl.to(".ring-ticks", { opacity: 0.5, duration: 10 }, 38);
    tl.to(".lk-c", { strokeDashoffset: 0, opacity: 0.9, duration: 6 }, 34);
    tl.to(".lk-im", { strokeDashoffset: 0, opacity: 0.85, duration: 7, stagger: 0.45 }, 37);
    tl.to(".lk-mo", { strokeDashoffset: 0, opacity: 0.7, duration: 7, stagger: 0.35 }, 42);
    tl.to(".nd-mid", { opacity: 1, duration: 6 }, 38);
    tl.to(".nd-out", { opacity: 0.85, duration: 6 }, 43);

    /* dark → warm light */
    tl.to(stage, {
      backgroundColor: "#F6F0E7",
      "--c-ring": "rgba(166,106,67,0.4)",
      "--c-link": "rgba(166,106,67,0.55)",
      "--c-node": "#A66A43",
      "--c-fill": "#F6F0E7",
      "--c-lbl": "rgba(111,103,94,0.85)",
      "--c-grid": "rgba(27,26,23,0.1)",
      duration: 14, ease: "power1.inOut",
    }, 34);
    tl.to(".jn__vignette", { opacity: 0, duration: 12 }, 34);

    tl.to(".jn__shift", { autoAlpha: 1, y: 0, duration: 3.5, ease: "power2.out" }, 35);
    tl.to(".jn__shift", { color: "#1B1A17", duration: 8 }, 38);
    tl.to(".jn__shift", { autoAlpha: 0, y: -40, duration: 2.6, ease: "power1.in" }, 47);

    /* ================= 50–70 · THE EVRIEL STRUCTURE ================= */
    tl.to(".nd-mid rect", { scale: 1.3, transformOrigin: "50% 50%", duration: 5 }, 52);
    tl.to(".nd-halo-mid", { opacity: 0.9, scale: 1, duration: 4, stagger: 0.9 }, 53);
    tl.to(".jn__pillars", { autoAlpha: 1, duration: 1 }, 52.5);
    tl.to(".jn__pillar", { autoAlpha: 1, y: 0, duration: 4, stagger: 1.7, ease: "power2.out" }, 53.5);
    tl.to(".jn__pillar-lead", { scaleX: 1, duration: 3.2, stagger: 1.7, ease: "power2.out" }, 54);
    tl.to(".jn__pillar", { autoAlpha: 0, y: -24, duration: 2.4, stagger: 0.3, ease: "power1.in" }, 66.5);
    tl.to(".jn__pillars", { autoAlpha: 0, duration: 1 }, 68.5);

    /* ================= 70–85 · OUTCOMES ================= */
    tl.to(".nd-halo-out", { opacity: 0.85, scale: 1, duration: 4, stagger: 0.9 }, 71.5);
    tl.to(".nd-out rect:not(.nd-halo)", { fill: "#A66A43", duration: 4 }, 72);
    tl.to(".nd-out", { opacity: 1, duration: 4 }, 72);
    tl.to(".core-glow", { opacity: 0.8, duration: 6 }, 72.5);
    tl.to(".jn__outcomes", { autoAlpha: 1, duration: 1.4 }, 71);
    tl.to(".jn__out-item", { autoAlpha: 1, y: 0, duration: 3, stagger: 1.1, ease: "power2.out" }, 72.5);
    tl.to(".jn__outcomes", { autoAlpha: 0, y: -30, duration: 2.6, ease: "power1.in" }, 82);

    /* ================= 85–100 · INVITATION ================= */
    tl.to(".core-rot--out", { scale: 1.17, svgOrigin: "400 400", duration: 11 }, 86);
    tl.to(".core-rot--mid", { scale: 1.09, svgOrigin: "400 400", duration: 11 }, 86);
    tl.to(".core-rot--in", { scale: 1.04, svgOrigin: "400 400", duration: 11 }, 86);
    tl.to(".lk", { opacity: 0.3, duration: 8 }, 86);
    tl.to(".ring-ticks", { opacity: 0.25, duration: 8 }, 86);
    tl.to(".core-glow", { opacity: 0.5, duration: 8 }, 88);
    tl.fromTo(".jn__invite",
      { autoAlpha: 0, y: 40, scale: 0.97 },
      { autoAlpha: 1, y: 0, scale: 1, duration: 5, ease: "power2.out" }, 87);

    /* pad the timeline so the journey is exactly 100 units long */
    tl.to({}, { duration: 1 }, 99);
  }, { scope: rootRef });

  return (
    <div className="jn" ref={rootRef}>
      <div className="jn__stage">
        <div className="jn__grid" />
        <div className="jn__vignette" />

        <div className="jn__corewrap">
          <EvrielCore />
        </div>

        {/* 0–15% · HERO */}
        <div className="jn__ov jn__hero">
          <p className="jn__eyebrow">{HERO.eyebrow}</p>
          <h1 className="jn__h1">
            {HERO.h2a}<br />with <em>{HERO.h2b.replace("with ", "")}</em>
          </h1>
          <p className="jn__sub">{HERO.sub}</p>
          <div className="jn__ctas">
            <button className="btn btn--solid" onClick={() => scrollTo("services")}>
              {HERO.ctaPrimary} <ArrowRight size={16} />
            </button>
            <button className="btn btn--ghost" onClick={() => scrollTo("contact")}>
              {HERO.ctaSecondary}
            </button>
          </div>
        </div>

        {/* 15–30% · BUSINESS CHAOS */}
        <div className="jn__ov jn__chaos" aria-hidden="true">
          {CHAOS_WORDS.map((w, i) => (
            <span key={w} className={`jn__chaos-w jn__chaos-w--${i}`}>{w}</span>
          ))}
        </div>

        {/* 30–50% · INTELLIGENCE ENTERS */}
        <div className="jn__ov jn__shift">
          <p className="jn__shift-line">{SHIFT_LINE}</p>
        </div>

        {/* 50–70% · THE EVRIEL STRUCTURE */}
        <div className="jn__ov jn__pillars">
          {PILLARS.map((p, i) => (
            <article key={p.id} className={`jn__pillar jn__pillar--${i}`}>
              <span className="jn__pillar-lead" />
              <span className="jn__pillar-id">{p.id}</span>
              <h3 className="jn__pillar-t">{p.t}</h3>
              <p className="jn__pillar-cov">{p.covers.join(" · ")}</p>
              <p className="jn__pillar-d">{p.d}</p>
            </article>
          ))}
        </div>

        {/* 70–85% · OUTCOMES */}
        <div className="jn__ov jn__outcomes">
          <div className="jn__out-head">
            <span className="jn__label">System Complete</span>
            <h2 className="jn__out-h">Where intelligence creates <em>real impact</em></h2>
          </div>
          <ul className="jn__out-list">
            {OUTCOMES.map((o, i) => (
              <li key={o.t} className="jn__out-item">
                <span className="jn__out-ix">0{i + 1}</span>
                <span className="jn__out-t">{o.t}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 85–100% · INVITATION */}
        <div className="jn__ov jn__invite">
          <h2 className="jn__invite-h">
            {STATEMENT.lines[0]}<br />{STATEMENT.lines[1]}<br />
            {STATEMENT.lines[2].replace(" intelligently.", "")} <em>intelligently.</em>
          </h2>
          <div className="jn__ctas">
            <button className="btn btn--solid btn--lg" onClick={() => scrollTo("contact")}>
              {HERO.ctaSecondary} <ArrowRight size={17} />
            </button>
          </div>
          <a className="jn__invite-mail" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
        </div>

        {/* stage chrome */}
        <div className="jn__phase" aria-hidden="true">
          <span className="jn__phase-num" ref={phaseNum}>01</span>
          <span className="jn__phase-sep" />
          <span className="jn__phase-name" ref={phaseName}>Signal</span>
        </div>
        <div className="jn__legend" aria-hidden="true">
          <span><i className="jn__lg-glyph jn__lg-glyph--d" /> R-01 · Intelligence Center</span>
          <span><i className="jn__lg-glyph" /> R-02 · Service Pillars</span>
          <span><i className="jn__lg-glyph jn__lg-glyph--o" /> R-03 · Business Outcomes</span>
        </div>
        <div className="jn__scrollhint" aria-hidden="true">
          <span>Scroll</span>
          <i className="jn__scrollline" />
        </div>
      </div>
    </div>
  );
}

/* Static opening for prefers-reduced-motion: the completed Core, no scrub */
export function StaticOpening() {
  return (
    <div className="jn jn--static">
      <div className="jn__stage jn__stage--static">
        <div className="jn__grid" />
        <div className="jn__corewrap jn__corewrap--static">
          <EvrielCore className="core--complete" />
        </div>
        <div className="jn__ov jn__hero jn__hero--static">
          <p className="jn__eyebrow">{HERO.eyebrow}</p>
          <h1 className="jn__h1">
            {HERO.h2a}<br />with <em>Business</em>
          </h1>
          <p className="jn__sub">{HERO.sub}</p>
          <div className="jn__ctas">
            <button className="btn btn--solid" onClick={() => scrollTo("services")}>
              {HERO.ctaPrimary} <ArrowRight size={16} />
            </button>
            <button className="btn btn--ghost" onClick={() => scrollTo("contact")}>
              {HERO.ctaSecondary}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

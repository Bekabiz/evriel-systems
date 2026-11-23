/* What we do, as a console. The selected state travels: inside a service
   the four flow steps are taken one by one, and when the last step is
   done the next service takes over. Each service ends in a proof strip
   that plays the real product where that kind of work already runs.
   It runs only while on screen, holds while someone reads or tabs through
   the left side, and stands still under reduced motion. */

import React, { useEffect, useRef, useState } from "react";
import { BrandMark } from "./kit.jsx";
import { PROJECTS, MEDIA, LOGOS, SERVICE_PROOF } from "./projects.js";
import { t, withLang } from "./i18n/index.js";
import "./flow.css";

const STEP_MS = 2400;
const RING = 2 * Math.PI * 12;

/* Keeps the previous word around for one beat so it can leave while the
   new one arrives. */
function useRoll(id, label) {
  const [pair, setPair] = useState({ id, label, prev: null });
  useEffect(() => {
    setPair((p) => (p.id === id ? p : { id, label, prev: { id: p.id, label: p.label } }));
  }, [id, label]);
  return pair;
}

export default function ServicesFlow() {
  const items = t.services.items;
  const rootRef = useRef(null);
  const [svc, setSvc] = useState(0);
  const [step, setStep] = useState(0);
  const [inView, setInView] = useState(false);
  const [hold, setHold] = useState(false);
  const [reduce, setReduce] = useState(false);
  const [run, setRun] = useState(0);
  const running = inView && !hold && !reduce;

  useEffect(() => {
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const el = rootRef.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* every time the console starts running again the current step restarts,
     so the ring and the timer stay together */
  useEffect(() => { if (running) setRun((n) => n + 1); }, [running]);

  useEffect(() => {
    if (!running) return;
    const id = setTimeout(() => {
      if (step < 3) setStep(step + 1);
      else { setSvc((svc + 1) % items.length); setStep(0); }
    }, STEP_MS);
    return () => clearTimeout(id);
  }, [running, svc, step, run, items.length]);

  const cur = items[svc];
  const word = useRoll(`${svc}-${step}`, cur.flow[step]);
  const proof = SERVICE_PROOF[svc];
  const pp = PROJECTS[proof.slug];
  const shot = MEDIA[proof.slug].featureShots[pp.features[proof.feature].t];
  const proofTitle = t.projects[proof.slug].features[proof.feature].t;

  const pickService = (i) => { setSvc(i); setStep(0); setRun((n) => n + 1); };
  const pickStep = (i) => { setStep(i); setRun((n) => n + 1); };

  /* reading the left side holds the console; the stage itself never does */
  const reading = {
    onPointerEnter: (e) => { if (e.pointerType === "mouse") setHold(true); },
    onPointerLeave: () => setHold(false),
  };

  return (
    <section className="services" id="services">
      <div className="wrap reveal">
        <h2 className="section-h">{t.services.h}</h2>
        <p className="section-sub">{t.services.sub}</p>

        <div
          ref={rootRef}
          className={`sf${running ? " is-running" : ""}${reduce ? " is-still" : ""}`}
          style={{ "--svc": svc, "--step": step, "--step-ms": `${STEP_MS}ms` }}
          onFocus={(e) => { if (e.target.matches(":focus-visible")) setHold(true); }}
          onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setHold(false); }}
        >
          <div className="sf-tabs" role="tablist" aria-label={t.services.h} {...reading}>
            <span className="sf-pill" aria-hidden="true"><i key={`${svc}-${step}-${run}`} /></span>
            {items.map((s, i) => (
              <button
                key={s.t}
                type="button"
                role="tab"
                id={`sf-tab-${i}`}
                aria-selected={i === svc}
                aria-controls={`sf-panel-${i}`}
                className={`sf-tab${i === svc ? " is-on" : ""}`}
                onClick={() => pickService(i)}
              >
                {s.t}
              </button>
            ))}
          </div>

          <div className="sf-stage">
            <div className="sf-word" aria-hidden="true">
              {word.prev && (
                <span key={`out-${word.prev.id}`} className="sf-word-out" style={{ "--len": word.prev.label.length }}>{word.prev.label}</span>
              )}
              <span key={`in-${word.id}`} className="sf-word-in" style={{ "--len": word.label.length }}>{word.label}</span>
            </div>

            <div className="sf-track">
              <span className="sf-rail" aria-hidden="true" />
              <span className="sf-rail-fill" aria-hidden="true" />
              <span className="sf-token" aria-hidden="true">
                <svg viewBox="0 0 30 30" width="30" height="30">
                  <circle cx="15" cy="15" r="12" className="sf-token-track" />
                  <g key={`${svc}-${step}-${run}`}>
                    <circle
                      cx="15" cy="15" r="12"
                      className="sf-token-ring"
                      strokeDasharray={RING}
                      transform="rotate(-90 15 15)"
                    />
                    <circle cx="15" cy="15" r="4.5" className="sf-token-core" />
                  </g>
                </svg>
              </span>
              {cur.flow.map((label, i) => (
                <button
                  key={`${svc}-${i}`}
                  type="button"
                  style={{ "--i": i }}
                  className={`sf-station${i === step ? " is-on" : ""}${i < step ? " is-done" : ""}`}
                  aria-current={i === step ? "step" : undefined}
                  aria-label={label}
                  onClick={() => pickStep(i)}
                >
                  <span className="sf-dot" aria-hidden="true" />
                  <span className="sf-label" aria-hidden="true">{label}</span>
                </button>
              ))}
            </div>

            <a key={proof.slug} className="sf-proof" href={withLang(`/work/${proof.slug}`)}>
              <span className="sf-proof-screen">
                {shot.video && inView && !reduce ? (
                  <video src={shot.video} poster={shot.poster} muted playsInline autoPlay loop preload="metadata" />
                ) : (
                  <img src={shot.poster || shot.src} alt="" loading="lazy" />
                )}
              </span>
              <span className="sf-proof-copy">
                <span className="sf-proof-k">{t.services.proof}</span>
                <span className="sf-proof-n">
                  <BrandMark
                    from={`var(--${pp.theme})`} to={`var(--${pp.theme}-deep)`}
                    glyph={pp.theme} {...(LOGOS[proof.slug] || {})} size={24}
                  />
                  <span>{pp.name}</span>
                </span>
                <span className="sf-proof-f">{proofTitle}</span>
              </span>
              <span className="sf-proof-go" aria-hidden="true">&#8599;</span>
            </a>
          </div>

          <div className="sf-details" {...reading}>
            {items.map((s, i) => (
              <div
                key={s.t}
                role="tabpanel"
                id={`sf-panel-${i}`}
                aria-labelledby={`sf-tab-${i}`}
                className={`sf-detail${i === svc ? " is-on" : ""}`}
              >
                <p className="sf-d">{s.d}</p>
                <ul className="sf-apps">
                  {s.a.map((item, k) => (
                    <li key={item} style={{ "--k": k }}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

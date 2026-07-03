import { useState, useEffect, useRef } from "react";
import { ArrowRight, Minus, Plus, Lock, Eye, Shield, CheckCircle2, Target } from "lucide-react";
import {
  MARQUEE_ITEMS, ABOUT, ABOUT_FEATS, CHALLENGES, CONVERGENCE, OUTCOMES,
  INDS, SVCS, PROJS, PROCS, BORDERS, WHY, TRUST, NEXT_STEPS, CONTACT,
} from "../content";

const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";
const ICONS = { Lock, Eye, Shield, CheckCircle2 };

/* ---------- restrained reveal (below-the-fold sections only) ---------- */
function useReveal(threshold = 0.12) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setVisible(true); return; }
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(el); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function Reveal({ children, className = "", delay = 0 }) {
  const [ref, vis] = useReveal();
  return (
    <div ref={ref} className={className} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? "none" : "translateY(28px)",
      transition: `opacity 0.9s ${EASE} ${delay}ms, transform 0.9s ${EASE} ${delay}ms`,
    }}>{children}</div>
  );
}

function Stagger({ children, className = "", step = 90 }) {
  const [ref, vis] = useReveal(0.08);
  return (
    <div ref={ref} className={className}>
      {(Array.isArray(children) ? children : [children]).map((c, i) => (
        <div key={i} style={{
          opacity: vis ? 1 : 0,
          transform: vis ? "none" : "translateY(24px)",
          transition: `opacity 0.85s ${EASE} ${i * step}ms, transform 0.85s ${EASE} ${i * step}ms`,
        }}>{c}</div>
      ))}
    </div>
  );
}

const Label = ({ n, children }) => (
  <div className="sec-label">{n && <span className="sec-label__n">{n}</span>}{children}</div>
);

/* ---------- service vocabulary ribbon (original marquee, preserved) ---------- */
export function MarqueeRibbon() {
  const r = MARQUEE_ITEMS.map((t, i) => (
    <span key={i} className="mq__i"><span className="mq__dot" />{t}</span>
  ));
  return <div className="mq" aria-hidden="true"><div className="mq__track">{r}{r}{r}{r}</div></div>;
}

/* ---------- People + Processes + Information + Technology → Intelligent Systems ---------- */
function ConvergenceDiagram() {
  const [ref, vis] = useReveal(0.25);
  return (
    <div className="conv" ref={ref}>
      <svg viewBox="0 0 440 340" width="100%" style={{ overflow: "visible" }}>
        {CONVERGENCE.map((label, i) => {
          const y = 56 + i * 76;
          const path = `M138 ${y} C 215 ${y}, 235 170, 290 170`;
          return (
            <g key={label} style={{ opacity: vis ? 1 : 0, transition: `opacity 0.9s ${EASE} ${i * 150}ms` }}>
              <path d={path} fill="none" stroke="rgba(166,106,67,0.35)" strokeWidth="1.1"
                strokeDasharray="320" strokeDashoffset={vis ? 0 : 320}
                style={{ transition: `stroke-dashoffset 1.6s ${EASE} ${300 + i * 150}ms` }} />
              <circle r="2.6" fill="#A66A43" opacity={vis ? 0.9 : 0}>
                <animateMotion dur="3.2s" begin={`${i * 0.8}s`} repeatCount="indefinite" path={path} />
              </circle>
              <rect x="6" y={y - 19} width="132" height="38" fill="rgba(232,221,208,0.55)"
                stroke="rgba(27,26,23,0.18)" strokeWidth="1" />
              <text x="72" y={y + 4.5} textAnchor="middle" fill="#1B1A17"
                style={{ font: "500 12.5px var(--body)", letterSpacing: "0.03em" }}>{label}</text>
            </g>
          );
        })}
        <g style={{ opacity: vis ? 1 : 0, transform: vis ? "none" : "scale(0.85)", transformOrigin: "346px 170px", transition: `opacity 1s ${EASE} 850ms, transform 1s ${EASE} 850ms` }}>
          <circle cx="346" cy="170" r="62" fill="rgba(166,106,67,0.06)" stroke="rgba(166,106,67,0.5)" strokeWidth="1.1" />
          <circle cx="346" cy="170" r="74" fill="none" stroke="rgba(166,106,67,0.25)" strokeWidth="1" strokeDasharray="3 6">
            <animateTransform attributeName="transform" type="rotate" from="0 346 170" to="360 346 170" dur="40s" repeatCount="indefinite" />
          </circle>
          <text x="346" y="164" textAnchor="middle" fill="#1B1A17" style={{ font: "400 17px var(--serif)" }}>Intelligent</text>
          <text x="346" y="186" textAnchor="middle" fill="#A66A43" style={{ font: "400 17px var(--serif)" }}>Systems</text>
        </g>
      </svg>
    </div>
  );
}

/* ---------- ABOUT ---------- */
export function About() {
  return (
    <section id="about" className="sec about">
      <div className="about__wrap">
        <div className="about__left">
          <Reveal><Label n="01">About</Label></Reveal>
          <Reveal delay={80}><h2 className="sec-h">{ABOUT.h[0]}<br />With <em>Purpose</em></h2></Reveal>
          <Reveal delay={160}>
            <p className="about__lead">{ABOUT.lead}</p>
            <p className="about__quote">{ABOUT.quote}</p>
            {ABOUT.paras.map(([text, strong], i) => (
              <p key={i} className="about__p">{text}{strong && <strong>{strong}</strong>}</p>
            ))}
          </Reveal>
          <Stagger className="about__stats">
            {ABOUT_FEATS.map((f, i) => (
              <div key={i} className="afeat">
                <span className="afeat__n">{f.t}<br />{f.s}</span>
                <p className="afeat__d">{f.d}</p>
              </div>
            ))}
          </Stagger>
        </div>
        <div className="about__right">
          <Reveal delay={200}><ConvergenceDiagram /></Reveal>
          <Stagger className="challenges">
            {CHALLENGES.map((c, i) => (
              <div key={i} className="ch"><CheckCircle2 size={15} /><span>{c}</span></div>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}

/* ---------- OUTCOMES (full descriptions) ---------- */
export function Outcomes() {
  const [act, setAct] = useState(0);
  return (
    <section className="sec sec--surface out">
      <div className="out__wrap">
        <div className="out__left">
          <Reveal><Label>What We Help Improve</Label></Reveal>
          <Reveal delay={80}><h2 className="sec-h">Where intelligence creates <em>real impact</em></h2></Reveal>
          <Reveal delay={140}><p className="sec-intro">Five areas where AI and automation translate directly into measurable business results.</p></Reveal>
          <Reveal delay={200}>
            <div className="out__display">
              <svg className="out__ring" viewBox="0 0 220 220">
                <circle cx="110" cy="110" r="102" fill="none" stroke="rgba(27,26,23,0.14)" strokeWidth="1" />
                {OUTCOMES.map((_, i) => {
                  const a = (i / OUTCOMES.length) * Math.PI * 2 - Math.PI / 2;
                  return <circle key={i} cx={110 + 102 * Math.cos(a)} cy={110 + 102 * Math.sin(a)}
                    r={i === act ? 5 : 3} fill={i === act ? "#A66A43" : "rgba(27,26,23,0.22)"}
                    style={{ transition: "all 0.5s" }} />;
                })}
              </svg>
              <div className="out__bignum">0{act + 1}</div>
            </div>
          </Reveal>
        </div>
        <div className="out__list">
          {OUTCOMES.map((o, i) => (
            <div key={i} className={`out2${i === act ? " out2--on" : ""}`} onClick={() => setAct(i)}>
              <div className="out2__head">
                <span className="out2__ix">0{i + 1}</span>
                <h3 className="out2__t">{o.t}</h3>
                <span className="out2__chev"><ArrowRight size={15} /></span>
              </div>
              <div className="out2__body"><p>{o.d}</p></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- INDUSTRIES — orbit wheel ---------- */
export function Industries() {
  const [act, setAct] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setAct((a) => (a + 1) % INDS.length), 3000);
    return () => clearInterval(id);
  }, [paused]);
  const step = 360 / INDS.length;
  return (
    <section id="industries" className="sec ind">
      <div className="ind__wrap">
        <div className="ind__left">
          <Reveal><Label n="02">Industries</Label></Reveal>
          <Reveal delay={80}><h2 className="sec-h">Industries We <em>Support</em></h2></Reveal>
          <div className="ind__detail" key={act}>
            <span className="ind__dnum">{String(act + 1).padStart(2, "0")} / {INDS.length}</span>
            <h3 className="ind__dname">{INDS[act].name}</h3>
            <p className="ind__ddesc">{INDS[act].desc}</p>
          </div>
          <div className="ind__dots">
            {INDS.map((s, i) => (
              <button key={i} className={`ind__dot${i === act ? " ind__dot--on" : ""}`}
                onClick={() => setAct(i)} aria-label={s.name} />
            ))}
          </div>
        </div>
        <Reveal delay={150}>
          <div className="orbit" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
            <div className="orbit__ring" />
            <div className="orbit__ring orbit__ring--in" />
            <div className="orbit__spin">
              {INDS.map((s, i) => (
                <div key={i} className="orbit__pos"
                  style={{ transform: `rotate(${i * step}deg) translateY(calc(var(--orbR) * -1)) rotate(${-i * step}deg)` }}>
                  <div className="orbit__upright">
                    <button className={`orbit__node${i === act ? " orbit__node--on" : ""}`}
                      onClick={() => setAct(i)} onMouseEnter={() => setAct(i)}>{s.short}</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="orbit__hub">
              <span className="orbit__hub-mark" />
              <span>Evriel<br />Systems</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- SERVICES ---------- */
function FlowDiagram({ steps }) {
  const [ref, vis] = useReveal(0.4);
  return (
    <div className="flow" ref={ref}>
      {steps.map((s, i) => (
        <div key={s} className="flow__seg" style={{
          opacity: vis ? 1 : 0, transform: vis ? "none" : "translateX(-14px)",
          transition: `opacity 0.7s ${EASE} ${i * 160}ms, transform 0.7s ${EASE} ${i * 160}ms`,
        }}>
          <span className={`flow__node${i === steps.length - 1 ? " flow__node--end" : ""}`}>{s}</span>
          {i < steps.length - 1 && (
            <svg className="flow__link" width="34" height="10" viewBox="0 0 34 10">
              <line x1="0" y1="5" x2="26" y2="5" stroke="rgba(166,106,67,0.45)" strokeWidth="1.2"
                strokeDasharray="4 4" style={vis ? { animation: "flowDash 1.4s linear infinite" } : {}} />
              <path d="M26 1.5 L32 5 L26 8.5" fill="none" stroke="rgba(166,106,67,0.6)" strokeWidth="1.2" />
            </svg>
          )}
        </div>
      ))}
    </div>
  );
}

export function Services() {
  return (
    <section id="services" className="sec svc">
      <div className="svc__wrap">
        <Reveal><Label n="03">Services</Label></Reveal>
        <Reveal delay={80}><h2 className="sec-h">What We <em>Deliver</em></h2></Reveal>
        <Reveal delay={140}><p className="sec-intro">We help organizations turn emerging technologies into practical business advantages.</p></Reveal>
        {SVCS.map((s, i) => (
          <Reveal key={i} delay={i * 70}>
            <div className="svcc">
              <div className="svcc__l"><span className="svcc__gn">{s.n}</span></div>
              <div className="svcc__m">
                <h3 className="svcc__t">{s.t}</h3>
                <p className="svcc__d">{s.d}</p>
                <FlowDiagram steps={s.flow} />
              </div>
              <div className="svcc__r">
                <div className="svcc__al">Applications</div>
                <ul>{s.a.map((x, j) => <li key={j}>{x}</li>)}</ul>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------- PROJECTS ---------- */
export function Projects() {
  const [active, setActive] = useState(null);
  const [expanded, setExpanded] = useState({});
  const togDetail = (i, e) => { e.stopPropagation(); setExpanded((prev) => ({ ...prev, [i]: !prev[i] })); };
  return (
    <section id="projects" className="sec sec--surface proj">
      <div className="proj__wrap">
        <Reveal><Label n="04">Solutions, Products & Case Studies</Label></Reveal>
        <Reveal delay={80}><h2 className="sec-h">Solutions, Products<br />& <em>Case Studies</em></h2></Reveal>
        {PROJS.map((p, i) => (
          <Reveal key={i} delay={i * 50}>
            <div className={`prj${active === i ? " prj--o" : ""}`}
              onClick={() => { setActive(active === i ? null : i); if (active === i) setExpanded((prev) => ({ ...prev, [i]: false })); }}>
              <div className="prj__hd">
                <div className="prj__hl">
                  <span className="prj__ix">0{i + 1}</span>
                  <h3 className="prj__t">{p.t}</h3>
                  {p.badge && <span className="prj__badge">{p.badge}</span>}
                </div>
                <span className="prj__tog">{active === i ? <Minus size={18} /> : <Plus size={18} />}</span>
              </div>
              <div style={{
                maxHeight: active === i ? (expanded[i] ? 2200 : 520) : 0,
                opacity: active === i ? 1 : 0, overflow: "hidden",
                transition: `max-height 0.7s ${EASE}, opacity 0.4s ${EASE}`,
              }}>
                <div className="prj__bd">
                  <p>{p.d}</p>
                  <div className="prj__caps">{p.c.map((x, j) => <span key={j} className="prj__cap">{x}</span>)}</div>
                  <p className="prj__tl">{p.tl}</p>
                  {!expanded[i] && <button className="prj__more" onClick={(e) => togDetail(i, e)}>Read More <ArrowRight size={13} /></button>}
                  {expanded[i] && (
                    <div className="prj__detail">
                      <div className="prj__detail-sec">
                        <h4>{p.detail.solution ? "Challenge" : "Overview"}</h4>
                        <p>{p.detail.challenge}</p>
                      </div>
                      {p.detail.solution && (
                        <div className="prj__detail-sec"><h4>Solution</h4><p>{p.detail.solution}</p></div>
                      )}
                      <div className="prj__detail-sec">
                        <h4>{p.detail.solution ? "Results" : "Key Capabilities"}</h4>
                        <ul>{p.detail.results.map((r, j) => <li key={j}>{r}</li>)}</ul>
                      </div>
                      {p.detail.vision && (
                        <div className="prj__detail-sec"><h4>Vision</h4><p>{p.detail.vision}</p></div>
                      )}
                      <button className="prj__more" onClick={(e) => togDetail(i, e)}>Show Less</button>
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

/* ---------- PROCESS ---------- */
export function Process() {
  return (
    <section id="process" className="sec proc">
      <div className="proc__wrap">
        <Reveal><Label n="05">Process</Label></Reveal>
        <Reveal delay={80}><h2 className="sec-h">How We <em>Work</em></h2></Reveal>
        <Reveal delay={140}><p className="sec-intro">Every organization is different. Our process is designed to understand your specific challenges before recommending technology.</p></Reveal>
        <div className="proc__grid">
          {PROCS.map((s, i) => (
            <Reveal key={i} delay={i * 90}>
              <div className="proc__card">
                <div className="proc__num">0{i + 1}</div>
                <div className="proc__dot" />
                <h3 className="proc__ct">{s.t}</h3>
                <p className="proc__cd">{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- BORDERS ---------- */
export function Borders() {
  return (
    <section className="sec sec--surface bdr">
      <div className="bdr__wrap">
        <Reveal><Label>Working Across Borders</Label></Reveal>
        <Reveal delay={90}><h2 className="sec-h">{BORDERS.h[0]} <em>{BORDERS.h[1]}</em> {BORDERS.h[2]}</h2></Reveal>
        <Reveal delay={170}>
          {BORDERS.paras.map((p, i) => <p key={i} className="bdr__p">{p}</p>)}
        </Reveal>
        <Reveal delay={250}>
          <div className="bdr__tag"><span>{BORDERS.tag}</span></div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- WHY ---------- */
export function Why() {
  return (
    <section className="sec why">
      <div className="why__wrap">
        <Reveal><Label>Why Evriel Systems</Label></Reveal>
        <Reveal delay={90}><h2 className="sec-h">{WHY.h[0]} <em>{WHY.h[1]}</em></h2></Reveal>
        <Reveal delay={170}>
          <p className="why__lead">{WHY.lead}</p>
          <p className="why__lead why__lead--sub">{WHY.sub}</p>
        </Reveal>
        <Stagger className="why__grid">
          {WHY.cards.map((w, i) => (
            <div key={i} className="why__card"><Target size={20} /><h3>{w.t}</h3><p>{w.d}</p></div>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

/* ---------- TRUST ---------- */
export function Trust() {
  return (
    <section id="trust" className="sec trust">
      <div className="trust__wrap">
        <div className="trust__l">
          <Reveal><Label n="06">Trust & Security</Label></Reveal>
          <Reveal delay={80}><h2 className="sec-h">{TRUST.h[0]} <em>{TRUST.h[1]}</em></h2></Reveal>
          <Reveal delay={160}><p className="trust__p">{TRUST.p}</p></Reveal>
          <Reveal delay={220}>
            <div className="trust__note"><Lock size={16} /><p><strong>{TRUST.note[0]}</strong>{TRUST.note[1]}</p></div>
          </Reveal>
        </div>
        <Stagger className="trust__r">
          {TRUST.cards.map((x, i) => {
            const Icon = ICONS[x.icon];
            return (
              <div key={i} className="trust__card">
                <div className="trust__ci"><Icon size={20} /></div>
                <div><h4 className="trust__ct">{x.t}</h4><p className="trust__cd">{x.d}</p></div>
              </div>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}

/* ---------- WHAT HAPPENS NEXT ---------- */
export function WhatNext() {
  const [ref, vis] = useReveal(0.08);
  return (
    <section id="next" className="sec sec--surface next" ref={ref}>
      <div className="next__wrap">
        <Reveal><Label n="07">What Happens Next?</Label></Reveal>
        <Reveal delay={80}><h2 className="sec-h">From First Message<br />to <em>Working System</em></h2></Reveal>
        <Reveal delay={140}><p className="sec-intro">No mystery, no pressure. Here is exactly what happens after you contact us.</p></Reveal>
        <div className="next__tl">
          <div className="next__line" style={{ transform: vis ? "scaleY(1)" : "scaleY(0)" }} />
          {NEXT_STEPS.map((s, i) => (
            <Reveal key={i} delay={160 + i * 130}>
              <div className={`next__row${i % 2 ? " next__row--r" : ""}`}>
                <div className="next__card">
                  <span className="next__num">0{i + 1}</span>
                  <h3 className="next__t">{s.t}</h3>
                  <p className="next__d">{s.d}</p>
                </div>
                <span className="next__node" style={{
                  transitionDelay: `${260 + i * 130}ms`,
                  transform: vis ? "translateX(-50%) scale(1)" : "translateX(-50%) scale(0)",
                }} />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- CONTACT ---------- */
export function Contact({ setPage }) {
  const [f, setF] = useState({ name: "", company: "", email: "", phone: "", language: "English", industry: "", interests: [], challenge: "" });
  const [consent, setConsent] = useState(false);
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState(null);
  const [sending, setSending] = useState(false);
  const tog = (v) => setF((p) => ({ ...p, interests: p.interests.includes(v) ? p.interests.filter((x) => x !== v) : [...p.interests, v] }));
  const submit = async (e) => {
    e.preventDefault();
    if (!f.name.trim() || !f.company.trim() || !f.email.trim() || !f.industry || !f.challenge.trim()) { setErr("Please fill in all required fields marked with *."); return; }
    if (f.interests.length === 0) { setErr("Please select at least one area of interest."); return; }
    if (!consent) { setErr("Please accept the privacy policy so we can process your inquiry."); return; }
    setSending(true);
    setErr(null);
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f) });
      if (!res.ok) throw new Error();
      setSent(true);
    } catch {
      setErr(`Something went wrong. Please email us directly at ${CONTACT.email}`);
    } finally { setSending(false); }
  };
  return (
    <section id="contact" className="sec contact">
      <div className="contact__wrap">
        <div className="contact__l">
          <Reveal><Label n="08">Contact</Label></Reveal>
          <Reveal delay={80}><h2 className="sec-h">{CONTACT.h[0]}<br />Your <em>Project</em></h2></Reveal>
          <Reveal delay={160}><p className="contact__p">{CONTACT.p}</p></Reveal>
          <Stagger className="contact__info">
            <div><div className="contact__bl">Email</div><a href={`mailto:${CONTACT.email}`} className="contact__bv">{CONTACT.email}</a></div>
            <div><div className="contact__bl">Website</div><a href={`https://${CONTACT.website}`} className="contact__bv" target="_blank" rel="noopener noreferrer">{CONTACT.website}</a></div>
          </Stagger>
        </div>
        <div className="contact__r">
          {sent ? (
            <Reveal>
              <div className="sent">
                <CheckCircle2 size={44} />
                <h3>Message Received</h3>
                <p>Thank you. We'll respond within 24 hours.</p>
                <button className="btn btn--solid" style={{ marginTop: 20 }} onClick={() => setSent(false)}>Send Another</button>
              </div>
            </Reveal>
          ) : (
            <Reveal delay={120}>
              <form className="form" onSubmit={submit}>
                <div className="form__r">
                  <div className="f"><label>Name <span className="req">*</span></label><input required placeholder="Your full name" value={f.name} onChange={(e) => setF((p) => ({ ...p, name: e.target.value }))} /></div>
                  <div className="f"><label>Company <span className="req">*</span></label><input required placeholder="Organization" value={f.company} onChange={(e) => setF((p) => ({ ...p, company: e.target.value }))} /></div>
                </div>
                <div className="form__r">
                  <div className="f"><label>Email <span className="req">*</span></label><input required type="email" placeholder="your@email.com" value={f.email} onChange={(e) => setF((p) => ({ ...p, email: e.target.value }))} /></div>
                  <div className="f"><label>Phone <span className="opt">(Optional)</span></label><input placeholder="+1 000 000 0000" value={f.phone} onChange={(e) => setF((p) => ({ ...p, phone: e.target.value }))} /></div>
                </div>
                <div className="f"><label>Preferred Language</label>
                  <div className="radios">{CONTACT.languages.map((l) => (
                    <label key={l} className={`rad${f.language === l ? " rad--on" : ""}`}>
                      <input type="radio" name="lang" checked={f.language === l} onChange={() => setF((p) => ({ ...p, language: l }))} style={{ display: "none" }} />{l}
                    </label>
                  ))}</div>
                </div>
                <div className="f"><label>Industry <span className="req">*</span></label>
                  <select required className="sel" value={f.industry} onChange={(e) => setF((p) => ({ ...p, industry: e.target.value }))}>
                    <option value="">Select your industry</option>
                    {CONTACT.industries.map((x) => <option key={x}>{x}</option>)}
                  </select>
                </div>
                <div className="f"><label>What are you interested in? <span className="req">*</span></label>
                  <div className="checks">{CONTACT.interests.map((x) => (
                    <label key={x} className={`chk${f.interests.includes(x) ? " chk--on" : ""}`} onClick={() => tog(x)}>
                      <span className="chk__b">{f.interests.includes(x) && <CheckCircle2 size={12} />}</span>{x}
                    </label>
                  ))}</div>
                </div>
                <div className="f"><label>Tell us about your challenge <span className="req">*</span></label>
                  <textarea required rows={5} placeholder="Describe your project, challenge, or business objective..." value={f.challenge} onChange={(e) => setF((p) => ({ ...p, challenge: e.target.value }))} />
                </div>
                <label className="consent">
                  <input type="checkbox" required checked={consent} onChange={(e) => setConsent(e.target.checked)} />
                  <span>I agree that Evriel Systems may store and process the information I submit to respond to my inquiry, as described in the <a href="#" onClick={(e) => { e.preventDefault(); setPage && setPage("privacy"); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Privacy Policy</a>. <span className="req">*</span></span>
                </label>
                {err && <p className="form__err">{err}</p>}
                <button type="submit" className="btn btn--solid btn--lg" style={{ width: "100%", justifyContent: "center", marginTop: 4 }} disabled={sending}>
                  {sending ? "Sending..." : "Start the Conversation"} {!sending && <ArrowRight size={17} />}
                </button>
              </form>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}

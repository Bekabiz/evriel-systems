/* The showroom: every project gets its own exhibit on the home page.
   Each exhibit plays the product's real captured clips as a reel. The
   selected feature travels down the list while its clip plays on the
   device, then hands over to the next one. Only the exhibit on screen
   plays, and nothing downloads until its exhibit is close. */

import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Cta, ProjectMark, ProjectLogo, Bezel, LaptopFrame, PhoneFrame, BrowserFrame } from "./kit.jsx";
import { PROJECTS, MEDIA, SHOWROOM, PROJECT_ORDER } from "./projects.js";
import { t, withLang } from "./i18n/index.js";
import "./showroom.css";

const STILL_MS = 4600;
const reducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* The reel: features that have a captured clip, with their translated copy. */
export function reelFor(slug) {
  const shots = MEDIA[slug].featureShots;
  const copy = t.projects[slug].features;
  return PROJECTS[slug].features
    .map((f, i) => ({ key: f.t, shot: shots[f.t], t: copy[i].t, d: copy[i].d }))
    .filter((item) => item.shot);
}

function Frame({ device, url, children }) {
  if (device === "phone") return <PhoneFrame bezel="var(--charcoal)">{children}</PhoneFrame>;
  if (device === "browser") return <BrowserFrame url={url}>{children}</BrowserFrame>;
  return <LaptopFrame bezel="var(--charcoal)">{children}</LaptopFrame>;
}

function Stage({ slug, cfg, reel, active, near, live, videoRefs, onEnded, onToggle }) {
  const p = PROJECTS[slug];
  const lastBySlot = useRef({});
  const next = (active + 1) % reel.length;
  const single = cfg.slots.length === 1;

  return (
    <div className={`x-stage x-stage-${cfg.layout} parallax`}>
      {cfg.slots.map((slot, si) => {
        const items = slot.items || reel.map((_, i) => i);
        const on = items.includes(active);
        if (on) lastBySlot.current[si] = active;
        const shown = on ? active : lastBySlot.current[si] ?? items[0];
        const screens = (
          <div className="x-screens">
            {items.map((ri) => {
              const shot = reel[ri].shot;
              return (
                <div key={ri} className={`x-screen${ri === shown ? " is-shown" : ""}`}>
                  {shot.video ? (
                    <video
                      ref={(el) => { videoRefs.current[ri] = el; }}
                      src={near ? shot.video : undefined}
                      poster={near ? shot.poster : undefined}
                      muted
                      playsInline
                      preload={live && (ri === active || ri === next) ? "auto" : "none"}
                      aria-label={`${p.name}: ${reel[ri].t}`}
                      onEnded={() => onEnded(ri)}
                      onClick={() => onToggle(ri)}
                    />
                  ) : (
                    <img src={near ? shot.src : undefined} alt={`${p.name}: ${reel[ri].t}`} />
                  )}
                </div>
              );
            })}
          </div>
        );
        const frame = (
          <Frame device={slot.device} url={p.live ? p.live.replace("https://", "") : p.name}>
            {screens}
          </Frame>
        );
        return (
          <div key={si} className={`x-slot x-slot-${slot.device}${on ? " is-on" : ""}`}>
            <div className="x-slot-in">
              {single ? <Bezel dark={cfg.dark}>{frame}</Bezel> : frame}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Reel({ name, reel, active, onPick, barRef }) {
  const ref = useRef(null);

  /* Every description reserves the height of the longest one, so the
     exhibit keeps one height while the selection moves. */
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      let max = 0;
      el.querySelectorAll(".x-reel-dx").forEach((n) => { max = Math.max(max, n.offsetHeight); });
      el.style.setProperty("--dh", `${max}px`);
    };
    measure();
    if (!("ResizeObserver" in window)) return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [reel]);

  return (
    <div className="x-reel" ref={ref} role="tablist" aria-label={name} style={{ "--n": reel.length }}>
      {reel.map((item, i) => (
        <button
          key={item.key}
          type="button"
          role="tab"
          aria-selected={i === active}
          className={`x-reel-item${i === active ? " is-active" : ""}`}
          onClick={() => onPick(i)}
        >
          <span className="x-reel-t">{item.t}</span>
          <span className="x-reel-d">
            <span className="x-reel-dc">
              <span className="x-reel-dp">
                <span className="x-reel-dx">{item.d}</span>
              </span>
            </span>
          </span>
          <span className="x-reel-bar" ref={i === active ? barRef : null} aria-hidden="true" />
        </button>
      ))}
    </div>
  );
}

function Exhibit({ slug, live, near, entered }) {
  const p = PROJECTS[slug];
  const c = t.projects[slug];
  const cfg = SHOWROOM[slug];
  const reel = useMemo(() => reelFor(slug), [slug]);
  const [active, setActive] = useState(0);
  const [seen, setSeen] = useState(false);
  const videoRefs = useRef([]);
  const barRef = useRef(null);
  const lastPlayed = useRef(-1);
  const stillStart = useRef(0);

  useEffect(() => { if (live) setSeen(true); }, [live]);

  /* Play the selected clip while this exhibit is the one on screen. */
  useEffect(() => {
    const reduce = reducedMotion();
    videoRefs.current.forEach((v, i) => { if (v && i !== active) v.pause(); });
    const v = videoRefs.current[active];
    if (!live || !near) {
      if (v) v.pause();
      return;
    }
    if (reduce) return;
    if (v) {
      if (lastPlayed.current !== active) {
        try { v.currentTime = 0; } catch { /* not loaded yet */ }
      }
      lastPlayed.current = active;
      v.play().catch(() => {});
      return;
    }
    /* a still screen holds for a moment, then hands over */
    lastPlayed.current = active;
    stillStart.current = performance.now();
    const id = setTimeout(() => setActive((a) => (a + 1) % reel.length), STILL_MS);
    return () => clearTimeout(id);
  }, [active, live, near, reel.length]);

  /* The line under the selected feature follows the clip itself. */
  useEffect(() => {
    if (!live || reducedMotion()) return;
    let raf = 0;
    const tick = () => {
      const bar = barRef.current;
      if (bar) {
        const v = videoRefs.current[active];
        let prog = 0;
        if (v) prog = v.duration ? v.currentTime / v.duration : 0;
        else prog = (performance.now() - stillStart.current) / STILL_MS;
        bar.style.transform = `scaleX(${Math.max(0, Math.min(prog, 1)).toFixed(4)})`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [live, active]);

  const onEnded = (ri) => {
    if (ri !== active || reducedMotion()) return;
    setActive((a) => (a + 1) % reel.length);
  };

  const onPick = (i) => {
    if (i === active) {
      const v = videoRefs.current[i];
      if (v) { v.currentTime = 0; v.play().catch(() => {}); }
      return;
    }
    setActive(i);
  };

  const onToggle = (ri) => {
    const v = videoRefs.current[ri];
    if (!v) return;
    if (ri !== active) { setActive(ri); return; }
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  };

  const head = (
    <>
      <div className="x-id">
        <ProjectLogo slug={slug} size={40} tone={cfg.dark ? "white" : "color"} />
      </div>
      <h3 className="x-h">{c.tagline}</h3>
      <p className="x-sub">{c.one}</p>
    </>
  );

  const stage = (
    <Stage
      slug={slug} cfg={cfg} reel={reel} active={active} near={near} live={live}
      videoRefs={videoRefs} onEnded={onEnded} onToggle={onToggle}
    />
  );

  const reelEl = <Reel name={p.name} reel={reel} active={active} onPick={onPick} barRef={barRef} />;

  const cta = (
    <Cta href={withLang(`/work/${slug}`)} className={cfg.dark ? "cta-on-dark" : ""}>
      {t.rooms.view}
    </Cta>
  );

  const cls = [
    "exhibit", `x-${p.theme}`, `x-${cfg.layout}`,
    cfg.flip ? "x-flip" : "", cfg.dark ? "x-dark" : "",
    seen ? "is-seen" : "", live ? "is-live" : "",
    /* the reveal class is owned here: this element re-renders, so a class
       added from outside would be wiped */
    "reveal", entered ? "in" : "",
  ].filter(Boolean).join(" ");

  if (cfg.layout === "stack") {
    return (
      <article className={cls} id={`x-${slug}`} data-slug={slug}>
        <div className="x-top">
          <div className="x-top-copy">{head}</div>
          <div className="x-top-side">
            {cta}
            {p.live && slug === "develop-ec" && (
              <a href={p.live} target="_blank" rel="noreferrer" className="x-live-link">
                {t.rooms.ec.visit}
              </a>
            )}
          </div>
        </div>
        {stage}
        {reelEl}
      </article>
    );
  }

  return (
    <article className={cls} id={`x-${slug}`} data-slug={slug}>
      <div className="x-copy">
        {head}
        {reelEl}
        <div className="x-foot">
          {slug === "evriel-inventory" && (
            <div className="x-numbers">
              <div><b data-count="39,000" data-suffix="+"></b><span>{t.rooms.inv.numbers[0]}</span></div>
              <div><b>3</b><span>{t.rooms.inv.numbers[1]}</span></div>
              <div><b>{t.rooms.inv.minutes}</b><span>{t.rooms.inv.numbers[2]}</span></div>
            </div>
          )}
          {cta}
        </div>
      </div>
      {stage}
    </article>
  );
}

/* Floating index of the six products, pinned to the bottom of the screen
   for as long as the showroom is on it. */
function Dock({ live }) {
  return (
    <nav className={`show-dock${live ? "" : " is-off"}`} aria-label={t.nav.work}>
      <div className="show-dock-in">
        {PROJECT_ORDER.map((slug) => (
          <a
            key={slug}
            href={`#x-${slug}`}
            className={`dock-item${live === slug ? " is-on" : ""}`}
            aria-label={PROJECTS[slug].name}
            aria-current={live === slug ? "true" : undefined}
          >
            <ProjectMark slug={slug} size={26} />
            <span className="dock-name">{PROJECTS[slug].name}</span>
          </a>
        ))}
      </div>
    </nav>
  );
}

export default function Showroom() {
  const ref = useRef(null);
  const [live, setLive] = useState(null);
  const [near, setNear] = useState(() => new Set());
  const [entered, setEntered] = useState(() => new Set());

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const items = Array.from(root.querySelectorAll(".exhibit"));
    if (reducedMotion() || !("IntersectionObserver" in window)) {
      setEntered(new Set(PROJECT_ORDER));
    }
    if (!("IntersectionObserver" in window)) {
      setNear(new Set(PROJECT_ORDER));
      return;
    }

    /* load media a little before an exhibit arrives */
    const nearIo = new IntersectionObserver((entries) => {
      const hits = entries.filter((e) => e.isIntersecting).map((e) => e.target.dataset.slug);
      if (hits.length === 0) return;
      setNear((prev) => {
        const nextSet = new Set(prev);
        hits.forEach((s) => nextSet.add(s));
        return nextSet;
      });
      entries.forEach((e) => { if (e.isIntersecting) nearIo.unobserve(e.target); });
    }, { rootMargin: "900px 0px" });

    /* exactly one exhibit is live: the one holding most of the screen */
    const visible = {};
    const steps = Array.from({ length: 21 }, (_, i) => i / 20);
    const liveIo = new IntersectionObserver((entries) => {
      const arrived = [];
      entries.forEach((e) => {
        visible[e.target.dataset.slug] = e.isIntersecting ? e.intersectionRect.height : 0;
        if (e.isIntersecting && e.intersectionRect.height > 60) arrived.push(e.target.dataset.slug);
      });
      if (arrived.length) {
        setEntered((prev) => {
          if (arrived.every((slug) => prev.has(slug))) return prev;
          const nextSet = new Set(prev);
          arrived.forEach((slug) => nextSet.add(slug));
          return nextSet;
        });
      }
      let best = null;
      let bestH = 0;
      Object.keys(visible).forEach((slug) => {
        if (visible[slug] > bestH) { best = slug; bestH = visible[slug]; }
      });
      setLive(bestH > window.innerHeight * 0.34 ? best : null);
    }, { threshold: steps });

    items.forEach((el) => { nearIo.observe(el); liveIo.observe(el); });
    return () => { nearIo.disconnect(); liveIo.disconnect(); };
  }, []);

  return (
    <section className="showroom" id="work" ref={ref}>
      <div className="wrap">
        <h2 className="show-h reveal">{t.opener}</h2>
        {PROJECT_ORDER.map((slug) => (
          <Exhibit
            key={slug} slug={slug}
            live={live === slug} near={near.has(slug)} entered={entered.has(slug)}
          />
        ))}
      </div>
      <Dock live={live} />
    </section>
  );
}

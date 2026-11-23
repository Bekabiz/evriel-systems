/* Shared pieces for the rebuild: reveal hook, ambient hero light, CTAs,
   device frames in double-bezel trays, and the per-project brand marks. */

import React, { useEffect, useRef } from "react";
import { PROJECTS, LOGOS } from "./projects.js";

/* Adds .in once when an element with .reveal enters the viewport. */
export function useReveal(rootRef) {
  useEffect(() => {
    document.documentElement.classList.add("js");
    const root = rootRef?.current || document;
    const items = root.querySelectorAll(".reveal");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [rootRef]);
}

/* Pointer tilt: gentle 3D on cards for fine pointers. Returns a cleanup. */
export function initTilt(root, selector, max = 5) {
  if (!root) return () => {};
  const fine = window.matchMedia("(pointer: fine)").matches;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!fine || reduce) return () => {};
  const els = Array.from(root.querySelectorAll(selector));
  const cleanups = els.map((el) => {
    el.classList.add("tilt");
    let raf = 0;
    const move = (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transform =
          `perspective(900px) rotateX(${(-y * max).toFixed(2)}deg) rotateY(${(x * max).toFixed(2)}deg) translateY(-2px)`;
      });
    };
    const leave = () => {
      cancelAnimationFrame(raf);
      el.style.transform = "";
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
      cancelAnimationFrame(raf);
      el.style.transform = "";
    };
  });
  return () => cleanups.forEach((fn) => fn());
}

/* Counts data-count elements up when they enter the viewport. */
export function initCounters(root) {
  if (!root) return () => {};
  const els = Array.from(root.querySelectorAll("[data-count]"));
  if (els.length === 0) return () => {};
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finish = (el) => { el.textContent = el.dataset.count + (el.dataset.suffix || ""); };
  if (reduce || !("IntersectionObserver" in window)) {
    els.forEach(finish);
    return () => {};
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      io.unobserve(el);
      const target = parseFloat(el.dataset.count.replace(/,/g, ""));
      const useCommas = el.dataset.count.includes(",");
      const suffix = el.dataset.suffix || "";
      const t0 = performance.now();
      const dur = 1300;
      const tick = (t) => {
        const p = Math.min((t - t0) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        const val = Math.round(target * eased);
        el.textContent = (useCommas ? val.toLocaleString("en-US") : String(val)) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.6 });
  els.forEach((el) => { el.textContent = (el.dataset.count.includes(",") ? "0" : "0") + (el.dataset.suffix || ""); io.observe(el); });
  return () => io.disconnect();
}

/* Very subtle drifting light behind the hero. Canvas only, no assets.
   Static under reduced motion, paused when the tab is hidden. */
export function AmbientLight() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let running = true;
    let t = Math.random() * 1000;

    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
    };

    const blob = (x, y, r, color) => {
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, color);
      g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = g;
      ctx.fillRect(x - r, y - r, r * 2, r * 2);
    };

    const paint = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      blob(
        w * (0.32 + 0.05 * Math.sin(t * 0.00021)),
        h * (0.38 + 0.06 * Math.cos(t * 0.00017)),
        w * 0.32,
        "rgba(6, 182, 212, 0.055)"
      );
      blob(
        w * (0.68 + 0.05 * Math.cos(t * 0.00019)),
        h * (0.52 + 0.05 * Math.sin(t * 0.00023)),
        w * 0.36,
        "rgba(1, 38, 36, 0.045)"
      );
    };

    const loop = (now) => {
      if (!running) return;
      t = now;
      paint();
      raf = requestAnimationFrame(loop);
    };

    size();
    paint();
    if (!reduce) raf = requestAnimationFrame(loop);

    const onResize = () => { size(); paint(); };
    const onVis = () => {
      running = !document.hidden && !reduce;
      if (running) raf = requestAnimationFrame(loop);
      else cancelAnimationFrame(raf);
    };
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return <canvas ref={ref} className="ambient" aria-hidden="true" />;
}

/* Primary CTA: pill with the arrow nested in its own circular chip. */
export function Cta({ href, children, className = "", chip = true, ...rest }) {
  return (
    <a href={href} className={`cta ${className}`} {...rest}>
      <span>{children}</span>
      {chip && <span className="cta-chip" aria-hidden="true">&#8599;</span>}
    </a>
  );
}

/* Pure CSS hamburger that morphs into an X. No icon library. */
export function Burger({ open, onClick }) {
  return (
    <button
      className={`burger${open ? " burger-open" : ""}`}
      aria-label={open ? "Close menu" : "Open menu"}
      aria-expanded={open}
      onClick={onClick}
    >
      <span /><span />
    </button>
  );
}

/* Product logos. Each is flat, one colour and built from a single idea,
   the way the Evriel E is: heavy geometry, square cuts, no gloss.
   inv: a stock box seen from its corner, one face per store.
   ag:  voice bars standing under one roof, which also draws the A.
   tt:  the T and dot of the live TaskTock mark, redrawn flat.
   di:  a D whose stem stands apart, with the dot of a domain as its eye.
   ck:  the C is the clock, and the hands say nine sharp.
   The g-* classes let each logo move once when its exhibit comes alive
   (see showroom.css). Standalone files live in public/brand. */
const MARKS = {
  inv: (
    <g stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
      <path className="g-inv-c" d="M24 5.6 L38.6 14 L24 22.4 L9.4 14 Z" />
      <path className="g-inv-a" d="M7.8 17.2 L22.3 25.6 V42.4 L7.8 34 Z" />
      <path className="g-inv-b" d="M40.2 17.2 L25.7 25.6 V42.4 L40.2 34 Z" opacity="0.55" />
    </g>
  ),
  ag: (
    <g stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round">
      <path className="g-ag g-ag-1" d="M6.4 27.2 L11 21.9 V41.4 H6.4 Z" />
      <path className="g-ag g-ag-2" d="M14 18.4 L18.6 13.1 V41.4 H14 Z" />
      <path className="g-ag g-ag-3" d="M21.7 9.6 L24 7 L26.3 9.6 V28.6 H21.7 Z" />
      <path className="g-ag g-ag-4" d="M29.4 13.1 L34 18.4 V41.4 H29.4 Z" />
      <path className="g-ag g-ag-5" d="M37 21.9 L41.6 27.2 V41.4 H37 Z" />
    </g>
  ),
  tt: (
    <g>
      <path d="M6.5 13 H32.5 V20.6 H6.5 Z" />
      <path className="g-tt-stem" d="M15.6 23.4 H23.4 V42 H15.6 Z" />
      <circle className="g-tt-dot" cx="39.2" cy="10.6" r="4.8" fill="#4FBFA8" />
    </g>
  ),
  di: (
    <g>
      <path d="M7 7 H14.2 V41 H7 Z" />
      <path d="M17.6 7 H23 A17 17 0 0 1 23 41 H17.6 V33.8 H23 A9.8 9.8 0 0 0 23 14.2 H17.6 Z" />
      <circle className="g-di-dot" cx="23.6" cy="24" r="4.3" />
    </g>
  ),
  ck: (
    <g fill="none" stroke="currentColor">
      <path d="M36.2 13.4 A16 16 0 1 0 36.2 34.6" strokeWidth="6.6" />
      <path className="g-ck-hand" d="M24 14.8 V24 H16.2" strokeWidth="4.6" />
    </g>
  ),
};

/* tone: "color" is the logo in its own colour, "white" is for dark
   surfaces, "tile" is the app-icon form (white logo on a flat tile). */
export function ProjectMark({ slug, size = 44, tone = "color" }) {
  const p = PROJECTS[slug];
  const file = LOGOS[slug];
  if (file) {
    return (
      <span className={`mark mark-img mark-${tone}`} aria-hidden="true" style={{ width: size, height: size }}>
        <img src={file.src} alt="" />
      </span>
    );
  }
  const tile = tone === "tile";
  const inner = tile ? Math.round(size * 0.62) : size;
  return (
    <span
      className={`mark mark-${tone}`}
      aria-hidden="true"
      style={{
        width: size, height: size,
        color: tone === "color" ? `var(--${p.theme})` : "#fff",
        ...(tile ? { background: `var(--${p.theme})`, borderRadius: size * 0.24 } : {}),
      }}
    >
      <svg viewBox="0 0 48 48" width={inner} height={inner} fill="currentColor">
        {MARKS[p.theme]}
      </svg>
    </span>
  );
}

/* The full logo: mark plus the name set in two weights. */
export function ProjectLogo({ slug, size = 40, tone = "color", className = "" }) {
  const [a, b] = PROJECTS[slug].wordmark;
  return (
    <span className={`plogo ${className}`}>
      <ProjectMark slug={slug} size={size} tone={tone} />
      <span className="plogo-wm" style={{ fontSize: Math.round(size * 0.56) }}>
        <b>{a}</b>{b}
      </span>
    </span>
  );
}

/* Double-bezel tray: devices sit in a machined shell, never flat on the page. */
export function Bezel({ dark = false, children }) {
  return <div className={`bezel${dark ? " bezel-dark" : ""}`}>{children}</div>;
}

/* Clean CSS device frames. Screens are honest slots until real captures exist. */
export function LaptopFrame({ bezel, children }) {
  return (
    <div className="laptop">
      <div className="laptop-screen" style={{ background: bezel }}>
        <div className="laptop-panel">{children}</div>
      </div>
      <div className="laptop-base" />
    </div>
  );
}

export function PhoneFrame({ bezel, children }) {
  return (
    <div className="phone" style={{ background: bezel }}>
      <div className="phone-panel">{children}</div>
    </div>
  );
}

export function BrowserFrame({ url, children }) {
  return (
    <div className="browser">
      <div className="browser-bar">
        <span className="browser-url">{url}</span>
      </div>
      <div className="browser-panel">{children}</div>
    </div>
  );
}

/* Text slot shown inside device panels until real demo videos are captured. */
export function Slot({ children }) {
  return <span className="slot-note">{children}</span>;
}

/* Demo video: plays once, muted, when it scrolls into view. Click to replay.
   Under reduced motion it stays on the poster until clicked. */
export function DemoMedia({ video, poster, alt }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.play().catch(() => {});
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      className="demo-media"
      src={video}
      poster={poster}
      muted
      playsInline
      preload="metadata"
      aria-label={alt}
      onClick={(e) => {
        const v = e.currentTarget;
        if (v.paused) { v.currentTime = 0; v.play().catch(() => {}); }
        else v.pause();
      }}
    />
  );
}

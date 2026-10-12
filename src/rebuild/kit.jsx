/* Shared pieces for the rebuild: reveal hook, ambient hero light, CTAs,
   device frames in double-bezel trays, and the per-project brand marks. */

import React, { useEffect, useRef } from "react";

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

/* App-icon marks: each project gets its own simple geometric glyph on its
   gradient tile. Bereket asked for real logo marks, not letter monograms. */
const GLYPHS = {
  inv: (
    <g>
      <rect x="4" y="4" width="7" height="7" rx="2" />
      <rect x="13.4" y="4" width="7" height="7" rx="2" />
      <rect x="4" y="13.4" width="7" height="7" rx="2" />
      <rect x="13.4" y="13.4" width="7" height="7" rx="2" fill="currentColor" stroke="none" />
    </g>
  ),
  ag: (
    <g strokeLinecap="round">
      <path d="M5 10.2 V13.8" />
      <path d="M8.5 7.6 V16.4" />
      <path d="M12 5.4 V18.6" />
      <path d="M15.5 7.6 V16.4" />
      <path d="M19 10.2 V13.8" />
    </g>
  ),
  ec: (
    <g strokeLinecap="round">
      <path d="M6.2 19 V11.6 A5.8 5.8 0 0 1 17.8 11.6 V19" />
      <path d="M3.8 19 H20.2" />
    </g>
  ),
  tt: (
    <g strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="8.4" />
      <path d="M8.6 12.3 l2.3 2.3 L15.6 9.5" />
    </g>
  ),
  di: (
    <g>
      <circle cx="12" cy="12" r="8.4" />
      <circle cx="12" cy="12" r="4.4" />
      <circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none" />
    </g>
  ),
  ck: (
    <g strokeLinecap="round">
      <circle cx="12" cy="12" r="8.4" />
      <path d="M12 7.4 V12 L15.3 13.9" />
    </g>
  ),
};

export function BrandMark({ from, to, glyph, size = 44 }) {
  const uid = React.useId().replace(/[^a-zA-Z0-9]/g, "");
  const g = GLYPHS[glyph] || GLYPHS.tt;
  return (
    <span className="mark" aria-hidden="true" style={{ width: size, height: size }}>
      <svg viewBox="0 0 48 48" width={size} height={size}>
        <defs>
          <linearGradient id={`b${uid}`} x1="0" y1="0" x2="0.25" y2="1">
            <stop offset="0" stopColor={from} />
            <stop offset="1" stopColor={to} />
          </linearGradient>
          <radialGradient id={`s${uid}`} cx="0.3" cy="0.08" r="1.1">
            <stop offset="0" stopColor="#fff" stopOpacity="0.38" />
            <stop offset="0.45" stopColor="#fff" stopOpacity="0.08" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect x="1" y="1" width="46" height="46" rx="12.5" fill={`url(#b${uid})`} />
        <rect x="1" y="1" width="46" height="46" rx="12.5" fill={`url(#s${uid})`} />
        <rect x="1.6" y="1.6" width="44.8" height="44.8" rx="12"
          fill="none" stroke="#fff" strokeOpacity="0.22" strokeWidth="1.1" />
        {/* soft glyph shadow, then the glyph */}
        <g transform="translate(12.5, 13.3) scale(0.96)" stroke="#000" opacity="0.18"
          fill="none" strokeWidth="2.1" color="#000">
          {g}
        </g>
        <g transform="translate(12.5, 12.5) scale(0.96)" stroke="#fff"
          fill="none" strokeWidth="2.1" color="#fff">
          {g}
        </g>
      </svg>
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

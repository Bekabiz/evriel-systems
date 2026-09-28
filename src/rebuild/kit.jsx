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

/* App-icon style mark for each project: rounded square, project gradient, initials. */
export function BrandMark({ from, to, initials, size = 44 }) {
  return (
    <span
      className="mark"
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.38,
        borderRadius: size * 0.24,
        background: `linear-gradient(135deg, ${from}, ${to})`,
      }}
    >
      {initials}
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

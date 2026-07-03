import { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";

/* ---------- brand mark (original Evriel hexagon logo, preserved) ---------- */
export const LogoMark = ({ size = 48, color = "currentColor", spin = false }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" fill="none" style={spin ? { animation: "logospin 80s linear infinite" } : {}}>
    {[[180, 100, 140, 169.3], [140, 169.3, 60, 169.3], [60, 169.3, 20, 100], [20, 100, 60, 30.7], [60, 30.7, 140, 30.7], [140, 30.7, 180, 100]].map(([x1, y1, x2, y2], i) => (
      <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    ))}
    {[[100, 100, 60, 30.7], [100, 100, 20, 100], [100, 100, 60, 169.3]].map(([x1, y1, x2, y2], i) => (
      <line key={`c${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    ))}
    <line x1="100" y1="100" x2="133.6" y2="100" stroke={color} strokeWidth="1.875" strokeLinecap="round" />
    {[[180, 100, 4.6], [140, 169.3, 4.6], [60, 169.3, 4.6], [20, 100, 4.6], [60, 30.7, 4.6], [140, 30.7, 4.6], [133.6, 100, 3.7]].map(([cx, cy, r], i) => (
      <circle key={i} cx={cx} cy={cy} r={r} fill={color} />
    ))}
    <circle cx="100" cy="100" r="5.6" fill={color} style={{ animation: "cpulse 2.5s ease-in-out infinite" }} />
  </svg>
);

/* ---------- scroll progress bar (2px, bronze) ---------- */
export function ProgressBar() {
  const ref = useRef(null);
  useEffect(() => {
    let raf;
    const onScroll = () => {
      raf = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        if (ref.current) ref.current.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, []);
  return <div className="progress"><div ref={ref} className="progress__bar" /></div>;
}

/* ---------- fixed top navigation ---------- */
export function Nav({ page, setPage }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);
  const go = (id) => {
    setOpen(false);
    if (page !== "home") {
      setPage("home");
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 250);
    } else document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };
  const goInsights = () => { setPage("insights"); setOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); };
  return (
    <nav className={`nav${scrolled ? " nav--s" : ""}`}>
      <div className="nav__in">
        <button className="nav__brand" onClick={() => { setPage("home"); setOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
          <span className="nav__wordmark">evriel<span className="nav__wordmark-dot">.</span></span>
          <span className="nav__wordmark-sub">Systems</span>
        </button>
        <div className="nav__links">
          {[["About", "about"], ["Industries", "industries"], ["Services", "services"], ["Projects", "projects"]].map(([l, id]) => (
            <button key={id} onClick={() => go(id)} className="nav__link">{l}</button>
          ))}
          <button onClick={goInsights} className="nav__link">Insights</button>
          <button onClick={() => go("contact")} className="nav__cta">Let's Talk</button>
        </div>
        <button className="nav__burger" onClick={() => setOpen(!open)} aria-label={open ? "Close menu" : "Open menu"}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {open && (
        <div className="mobile-menu">
          {[["About", "about"], ["Industries", "industries"], ["Services", "services"], ["Projects", "projects"]].map(([l, id]) => (
            <button key={id} onClick={() => go(id)} className="mob-link">{l}</button>
          ))}
          <button onClick={goInsights} className="mob-link">Insights</button>
          <button onClick={() => go("contact")} className="mob-link">Contact</button>
        </div>
      )}
    </nav>
  );
}

/* ---------- footer ---------- */
export function Footer({ setPage }) {
  return (
    <footer className="footer">
      <div className="footer__in">
        <div className="footer__top">
          <button className="footer__brand" onClick={() => { setPage("home"); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
            <LogoMark size={26} color="#C8945A" />
            <span className="footer__brand-txt">
              <span className="footer__brand-name">Evriel</span>
              <span className="footer__brand-sub">Systems</span>
            </span>
          </button>
          <p className="footer__tagline">Connecting Intelligence with Business</p>
        </div>
        <div className="footer__line" />
        <div className="footer__bot">
          <span>&copy; {new Date().getFullYear()} Evriel Systems</span>
          <div className="footer__bot-r">
            <a href="#" onClick={(e) => { e.preventDefault(); setPage("privacy"); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="footer__link">Privacy Policy</a>
            <span>contact@evrielsystems.com</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ---------- cookie consent ---------- */
export function CookieConsent({ setPage }) {
  const [show, setShow] = useState(false);
  useEffect(() => { if (!localStorage.getItem("ev_cookie_ok")) setShow(true); }, []);
  if (!show) return null;
  const accept = () => { localStorage.setItem("ev_cookie_ok", "1"); setShow(false); };
  return (
    <div className="cookie">
      <p>We use essential cookies to ensure our website functions properly. We do not use tracking or advertising cookies. By continuing to use this site, you agree to our <a href="#" onClick={(e) => { e.preventDefault(); setPage("privacy"); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Privacy Policy</a>.</p>
      <button className="cookie__btn" onClick={accept}>Accept &amp; Close</button>
    </div>
  );
}

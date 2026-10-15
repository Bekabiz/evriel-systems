/* Floating capsule navigation with the language switcher, and the footer.
   Shared by every page, fully localized. */

import React, { useState } from "react";
import { Burger } from "./kit.jsx";
import { PROJECTS, PROJECT_ORDER } from "./projects.js";
import { t, lang, withLang, switchLangHref, LANGS } from "./i18n/index.js";

const NAV_LINKS = () => [
  { label: t.nav.work, href: withLang("/#work") },
  { label: t.nav.services, href: withLang("/#services") },
  { label: t.nav.process, href: withLang("/#process") },
  { label: t.nav.about, href: withLang("/#about") },
  { label: t.nav.insights, href: withLang("/insights") },
];

function LangSwitch({ open }) {
  return (
    <div className={`langs${open ? " langs-sheet" : ""}`} aria-label="Language">
      {LANGS.map((l) => (
        <a
          key={l.code}
          href={switchLangHref(l.code)}
          className={`lang${l.code === lang ? " lang-on" : ""}`}
          aria-label={l.name}
          title={l.name}
        >
          <img src={`https://flagcdn.com/w40/${l.flag}.png`} alt={l.name} width="20" height="15" />
        </a>
      ))}
    </div>
  );
}

export function Nav() {
  const [open, setOpen] = useState(false);
  const links = NAV_LINKS();
  return (
    <header className="navwrap">
      <div className="wrap">
        <div className="nav-capsule">
          <a href={withLang("/")} className="nav-logo" aria-label="Evriel Systems">
            <img src="/logo.svg" alt="Evriel Systems" />
          </a>
          <nav className="nav-links" aria-label="Main">
            {links.map((l) => (
              <a key={l.href} href={l.href}>{l.label}</a>
            ))}
          </nav>
          <div className="nav-side">
            <LangSwitch />
            <a href={withLang("/#contact")} className="btn nav-cta">{t.nav.start}</a>
          </div>
          <Burger open={open} onClick={() => setOpen(!open)} />
        </div>
        <div className={`nav-sheet${open ? " nav-sheet-open" : ""}`}>
          {links.map((l, i) => (
            <a key={l.href} href={l.href} style={{ transitionDelay: `${80 + i * 50}ms` }}
              onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
          <a href={withLang("/#contact")} className="btn" style={{ transitionDelay: "330ms" }}
            onClick={() => setOpen(false)}>
            {t.nav.start}
          </a>
          <LangSwitch open />
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  const links = NAV_LINKS();
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <img src="/logo.svg" alt="Evriel Systems" className="footer-logo" />
            <p className="footer-line">{t.footer.line1}</p>
            <p className="footer-line">{t.footer.line2}</p>
          </div>
          <div>
            <h3 className="footer-h">{t.footer.site}</h3>
            {links.map((l) => (
              <a key={l.href} href={l.href} className="footer-a">{l.label}</a>
            ))}
            <a href={withLang("/#contact")} className="footer-a">{t.nav.contact}</a>
          </div>
          <div>
            <h3 className="footer-h">{t.footer.work}</h3>
            {PROJECT_ORDER.map((slug) => (
              <a key={slug} href={withLang(`/work/${slug}`)} className="footer-a">
                {PROJECTS[slug].name}
              </a>
            ))}
          </div>
        </div>
        <div className="footer-bottom">
          <p className="footer-founder">{t.footer.founder}</p>
          <p className="footer-legal">
            &copy; {new Date().getFullYear()} Evriel Systems &middot;{" "}
            <a href="mailto:contact@evrielsystems.com" className="footer-a footer-a-inline">
              contact@evrielsystems.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

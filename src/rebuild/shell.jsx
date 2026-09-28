/* Nav and footer, shared by the home page and every project and article page. */

import React, { useState } from "react";
import { Burger } from "./kit.jsx";
import { PROJECTS, PROJECT_ORDER } from "./projects.js";

const NAV_LINKS = [
  { label: "Work", href: "/#work" },
  { label: "Services", href: "/#services" },
  { label: "Process", href: "/#process" },
  { label: "About", href: "/#about" },
  { label: "Insights", href: "/insights" },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="nav">
      <div className="wrap nav-bar">
        <a href="/" className="nav-logo" aria-label="Evriel Systems, home">
          <img src="/logo.svg" alt="Evriel Systems" />
        </a>
        <nav className="nav-links" aria-label="Main">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href}>{l.label}</a>
          ))}
        </nav>
        <a href="/#contact" className="btn btn-ink nav-cta">Start a project</a>
        <Burger open={open} onClick={() => setOpen(!open)} />
      </div>
      <div className={`nav-sheet${open ? " nav-sheet-open" : ""}`}>
        {NAV_LINKS.map((l, i) => (
          <a key={l.href} href={l.href} style={{ transitionDelay: `${80 + i * 50}ms` }}
            onClick={() => setOpen(false)}>
            {l.label}
          </a>
        ))}
        <a href="/#contact" className="btn btn-ink" style={{ transitionDelay: "330ms" }}
          onClick={() => setOpen(false)}>
          Start a project
        </a>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <img src="/logo.svg" alt="Evriel Systems" className="footer-logo" />
            <p className="footer-line">
              Real systems for real operations, designed and built in Europe.
            </p>
            <p className="footer-line">
              Projects and communications can be conducted in multiple languages
              depending on client requirements.
            </p>
          </div>
          <div>
            <h3 className="footer-h">Site</h3>
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href} className="footer-a">{l.label}</a>
            ))}
            <a href="/#contact" className="footer-a">Contact</a>
          </div>
          <div>
            <h3 className="footer-h">Work</h3>
            {PROJECT_ORDER.map((slug) => (
              <a key={slug} href={`/work/${slug}`} className="footer-a">
                {PROJECTS[slug].name}
              </a>
            ))}
          </div>
        </div>
        <div className="footer-bottom">
          <p className="footer-founder">Founded by Bereket Bizuayehu Teshome</p>
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

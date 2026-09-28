/* Dedicated project page. One skeleton for all six projects (plan part 5),
   each wearing its own color. Content lives in projects.js. */

import React, { useEffect, useRef } from "react";
import {
  useReveal,
  Cta,
  BrandMark,
  Bezel,
  LaptopFrame,
  PhoneFrame,
  BrowserFrame,
  Slot,
} from "./kit.jsx";
import { Nav, Footer } from "./shell.jsx";
import { ContactSection } from "./Home.jsx";
import { PROJECTS } from "./projects.js";
import "./tokens.css";
import "./home.css";
import "./project.css";

function GradTagline({ tagline, gradWord }) {
  const i = tagline.indexOf(gradWord);
  if (i === -1) return <>{tagline}</>;
  return (
    <>
      {tagline.slice(0, i)}
      <span className="pgrad">{gradWord}</span>
      {tagline.slice(i + gradWord.length)}
    </>
  );
}

function Device({ p, children }) {
  if (p.device === "phone") {
    return <PhoneFrame bezel={`var(--${p.theme}-deep, var(--ink))`}>{children}</PhoneFrame>;
  }
  if (p.device === "browser") {
    return <BrowserFrame url={p.live ? p.live.replace("https://", "") : p.name}>{children}</BrowserFrame>;
  }
  return <LaptopFrame bezel={`var(--${p.theme}-deep, var(--ink))`}>{children}</LaptopFrame>;
}

export default function ProjectPage({ slug }) {
  const p = PROJECTS[slug];
  const rootRef = useRef(null);
  useReveal(rootRef);

  useEffect(() => {
    document.title = `${p.name} - Evriel Systems`;
    window.scrollTo(0, 0);
  }, [p.name]);

  const next = PROJECTS[p.next];
  const dark = p.theme === "ec";

  return (
    <div ref={rootRef} className={`theme-${p.theme}`}>
      <Nav />
      <main>
        <section className={`proj-hero${dark ? " proj-hero-dark" : ""}`}>
          <div className="wrap">
            <div className="room-id">
              <BrandMark from={`var(--${p.theme})`} to={`var(--${p.theme}-deep)`} initials={p.initials} size={52} />
              <span className="label proj-label">{p.name}</span>
            </div>
            <h1>
              <GradTagline tagline={p.tagline} gradWord={p.gradWord} />
            </h1>
            <p className="proj-one">{p.one}</p>
            {p.live && (
              <a href={p.live} target="_blank" rel="noreferrer" className="proj-live">
                Visit {p.live.replace("https://", "")}
              </a>
            )}
            <div className="proj-stage">
              <div className={`glow glow-${p.theme}`} />
              <Bezel dark={dark}>
                <Device p={p}>
                  <Slot>Real demo video plays here</Slot>
                </Device>
              </Bezel>
            </div>
          </div>
        </section>

        <section className="proj-wanted">
          <div className="wrap reveal">
            <h2 className="section-h">What the client wanted</h2>
            <p className="proj-wanted-p">{p.wanted}</p>
          </div>
        </section>

        <section className="proj-solution">
          <div className="wrap reveal">
            <h2 className="section-h">The solution we gave</h2>
            <div className="feat-grid">
              {p.features.map((f) => (
                <div key={f.t} className="feat">
                  <h3>{f.t}</h3>
                  <p>{f.d}</p>
                  <div className="feat-slot">
                    <Slot>Real screenshot goes here</Slot>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="proj-gallery band">
          <div className="wrap reveal">
            <h2 className="section-h">The screens</h2>
            <p className="section-sub">
              A gallery of real screens from the system, after the privacy pass.
              No client data ever appears here.
            </p>
            <div className="gal-grid">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="gal-slot">
                  <Slot>Screenshot slot</Slot>
                </div>
              ))}
            </div>
          </div>
        </section>

        {p.results.length > 0 && (
          <section className="proj-results">
            <div className="wrap reveal">
              <h2 className="section-h">The results</h2>
              <div className="numbers proj-numbers">
                {p.results.map((r) => (
                  <div key={r.s} className="n">
                    <b>{r.b}</b>
                    <span>{r.s}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {p.how && (
          <section className="proj-how">
            <div className="wrap reveal">
              <h2 className="section-h">How it works</h2>
              <p className="proj-how-p">{p.how}</p>
            </div>
          </section>
        )}

        <div className="wrap reveal">
          <p className="proj-byline">
            Designed and built by Bereket Bizuayehu Teshome, Evriel Systems.
          </p>
        </div>

        <section className="proj-next">
          <div className="wrap reveal">
            <a href={`/work/${next.slug}`} className="next-card">
              <span className="next-label">Next project</span>
              <span className={`next-name grad grad-${next.theme}`}>{next.name}</span>
              <span className="next-one">{next.one}</span>
            </a>
          </div>
        </section>

        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}

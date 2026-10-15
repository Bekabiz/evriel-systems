/* Dedicated project page, one skeleton for all six projects, localized. */

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  useReveal,
  Cta,
  BrandMark,
  Bezel,
  LaptopFrame,
  PhoneFrame,
  BrowserFrame,
  DemoMedia,
  Slot,
  initTilt,
} from "./kit.jsx";
import { Nav, Footer } from "./shell.jsx";
import { ContactSection } from "./Home.jsx";
import { PROJECTS, MEDIA, LOGOS } from "./projects.js";
import { t, withLang } from "./i18n/index.js";
import { setHead } from "./seo.js";
import "./tokens.css";
import "./home.css";
import "./project.css";

function Device({ p, children }) {
  if (p.device === "phone") {
    return <PhoneFrame bezel="var(--charcoal)">{children}</PhoneFrame>;
  }
  if (p.device === "browser") {
    return <BrowserFrame url={p.live ? p.live.replace("https://", "") : p.name}>{children}</BrowserFrame>;
  }
  return <LaptopFrame bezel="var(--charcoal)">{children}</LaptopFrame>;
}

export default function ProjectPage({ slug }) {
  const p = PROJECTS[slug];
  const c = t.projects[slug];
  const rootRef = useRef(null);
  useReveal(rootRef);

  useEffect(() => {
    setHead({
      title: t.meta.work.title.replace("{name}", p.name),
      desc: t.meta.work.desc.replace("{one}", c.one),
      path: `/work/${slug}`,
    });
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const cleanTilt = initTilt(rootRef.current, ".feat, .next-card, .gal-slot img");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let ctx;
    if (!reduce) {
      ctx = gsap.context(() => {
        gsap.utils.toArray(".bezel, .feat-slot").forEach((el) => {
          gsap.from(el, {
            rotateX: 9, y: 40, opacity: 0,
            transformPerspective: 900, transformOrigin: "center bottom",
            duration: 1, ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          });
        });
      }, rootRef);
    }
    return () => {
      cleanTilt();
      if (ctx) ctx.revert();
    };
  }, [slug]);

  const next = PROJECTS[p.next];
  const nextC = t.projects[p.next];
  const media = MEDIA[p.slug];
  const dark = p.theme === "ec";

  return (
    <div ref={rootRef} className={`theme-${p.theme}`}>
      <Nav />
      <main>
        <section className={`proj-hero${dark ? " proj-hero-dark" : ""}`}>
          <div className="wrap">
            <div className="proj-field">
              <div className="room-id room-id-center">
                <BrandMark from={`var(--${p.theme})`} to={`var(--${p.theme}-deep)`} glyph={p.theme} {...(LOGOS[p.slug] || {})} size={52} />
                <span className="proj-label">{p.name}</span>
              </div>
              <h1 className="t-hero">{c.tagline}</h1>
              <p className="proj-one">{c.one}</p>
              {p.live && (
                <a href={p.live} target="_blank" rel="noreferrer" className="proj-live">
                  {t.project.visit} {p.live.replace("https://", "")}
                </a>
              )}
              <div className={`proj-stage${p.device === "phone" ? " proj-stage-phone" : ""}`}>
                <Bezel dark={dark}>
                  <Device p={p}>
                    {media.video ? (
                      <DemoMedia video={media.video} poster={media.poster} alt={`${p.name} demo`} />
                    ) : (
                      <Slot>{t.project.pending}</Slot>
                    )}
                  </Device>
                </Bezel>
              </div>
            </div>
          </div>
        </section>

        <section className="proj-wanted">
          <div className="wrap reveal">
            <h2 className="section-h">{t.project.wanted}</h2>
            <p className="proj-wanted-p">{c.wanted}</p>
          </div>
        </section>

        <section className="proj-solution">
          <div className="wrap reveal">
            <h2 className="section-h">{t.project.solution}</h2>
            <div className="feat-grid">
              {c.features.map((f, i) => {
                const shot = media.featureShots[p.features[i] ? p.features[i].t : ""];
                return (
                  <div key={f.t} className="feat">
                    <h3>{f.t}</h3>
                    <p>{f.d}</p>
                    {shot && (
                      <div className={`feat-slot${shot.phone ? " is-phone" : ""}`}>
                        {shot.video ? (
                          <DemoMedia video={shot.video} poster={shot.poster} alt={`${p.name}: ${f.t}`} />
                        ) : (
                          <img src={shot.poster || shot.src} alt={`${p.name}: ${f.t}`} loading="lazy" />
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {media.shots.length > 0 && (
        <section className="proj-gallery band">
          <div className="wrap reveal">
            <h2 className="section-h">{t.project.screens}</h2>
            <p className="section-sub">{t.project.screensSub}</p>
            <div className="gal-grid">
              {media.shots.map((s) => (
                <figure key={s.f} className={`gal-slot${s.phone ? " is-phone" : ""}`}>
                  <img src={s.f} alt={s.label} loading="lazy" />
                  <figcaption>{s.label}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
        )}

        {p.results.length > 0 && (
          <section className="proj-results">
            <div className="wrap reveal">
              <h2 className="section-h">{t.project.results}</h2>
              <div className="numbers proj-numbers">
                {p.results.map((r, i) => (
                  <div key={r.s} className="n">
                    <b>{i === 2 ? t.rooms.inv.minutes : r.b}</b>
                    <span>{(c.results && c.results[i]) || r.s}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {c.how && (
          <section className="proj-how">
            <div className="wrap reveal">
              <h2 className="section-h">{t.project.how}</h2>
              <p className="proj-how-p">{c.how}</p>
            </div>
          </section>
        )}

        <div className="wrap reveal">
          <p className="proj-byline">{t.project.byline}</p>
        </div>

        <section className="proj-next">
          <div className="wrap reveal">
            <a href={withLang(`/work/${next.slug}`)} className="next-card">
              <span className="next-label">{t.project.next}</span>
              <span className="next-name">{next.name}</span>
              <span className="next-one">{nextC.one}</span>
            </a>
          </div>
        </section>

        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}

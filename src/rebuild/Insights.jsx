/* Insights: the article index at /insights and single articles at
   /insights/:slug. Content comes from the existing articles in content.js. */

import React, { useEffect, useRef } from "react";
import { useReveal } from "./kit.jsx";
import { Nav, Footer } from "./shell.jsx";
import { ContactSection } from "./Home.jsx";
import { ARTS } from "../content.js";
import "./tokens.css";
import "./home.css";
import "./project.css";

export function InsightsPage() {
  const rootRef = useRef(null);
  useReveal(rootRef);

  useEffect(() => {
    document.title = "Insights - Evriel Systems";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div ref={rootRef}>
      <Nav />
      <main>
        <section className="ins-hero">
          <div className="wrap reveal">
            <h1>Insights</h1>
            <p className="proj-one">
              Plain writing on AI, automation and intelligent systems, from the
              work itself.
            </p>
          </div>
        </section>
        <section className="ins-list">
          <div className="wrap reveal">
            {ARTS.map((a) => (
              <a key={a.slug} href={`/insights/${a.slug}`} className="ins-row">
                <span className="art-tag">{a.tag}</span>
                <h2>{a.title}</h2>
                <p>{a.excerpt}</p>
                <span className="art-more">Read article</span>
              </a>
            ))}
          </div>
        </section>
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}

export function ArticlePage({ slug }) {
  const a = ARTS.find((x) => x.slug === slug);
  const rootRef = useRef(null);
  useReveal(rootRef);

  useEffect(() => {
    if (a) document.title = `${a.title} - Evriel Systems`;
    window.scrollTo(0, 0);
  }, [a]);

  if (!a) return <InsightsPage />;

  const others = ARTS.filter((x) => x.slug !== slug).slice(0, 2);

  return (
    <div ref={rootRef}>
      <Nav />
      <main>
        <article className="article">
          <div className="wrap">
            <header className="article-head reveal">
              <span className="art-tag">{a.tag}</span>
              <h1>{a.title}</h1>
              <p className="article-by">
                By Bereket Bizuayehu Teshome, Evriel Systems
              </p>
            </header>
            <div className="article-body reveal">
              {a.body.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>
        </article>
        <section className="ins-list ins-list-more band">
          <div className="wrap reveal">
            <h2 className="section-h">Keep reading</h2>
            {others.map((o) => (
              <a key={o.slug} href={`/insights/${o.slug}`} className="ins-row">
                <span className="art-tag">{o.tag}</span>
                <h2>{o.title}</h2>
                <p>{o.excerpt}</p>
                <span className="art-more">Read article</span>
              </a>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

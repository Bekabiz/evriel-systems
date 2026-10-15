/* Insights index and single articles, localized. */

import React, { useEffect, useRef } from "react";
import { useReveal } from "./kit.jsx";
import { Nav, Footer } from "./shell.jsx";
import { ContactSection, localizedArticle } from "./Home.jsx";
import { ARTS } from "../content.js";
import { t, withLang } from "./i18n/index.js";
import { setHead } from "./seo.js";
import "./tokens.css";
import "./home.css";
import "./project.css";

export function InsightsPage() {
  const rootRef = useRef(null);
  useReveal(rootRef);

  useEffect(() => {
    setHead({ title: t.meta.insights.title, desc: t.meta.insights.desc, path: "/insights" });
    window.scrollTo(0, 0);
  }, []);

  const all = ARTS.map((a) => localizedArticle(a.slug));

  return (
    <div ref={rootRef}>
      <Nav />
      <main>
        <section className="ins-hero">
          <div className="wrap reveal">
            <h1>{t.insightsPage.title}</h1>
            <p className="proj-one">{t.insightsPage.sub}</p>
          </div>
        </section>
        <section className="ins-list">
          <div className="wrap reveal">
            {all.map((a) => (
              <a key={a.slug} href={withLang(`/insights/${a.slug}`)} className="ins-row">
                <span className="art-tag">{a.tag}</span>
                <h2>{a.title}</h2>
                <p>{a.excerpt}</p>
                <span className="art-more">{t.insights.read}</span>
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
  const a = localizedArticle(slug);
  const rootRef = useRef(null);
  useReveal(rootRef);

  useEffect(() => {
    if (a) {
      setHead({
        title: `${a.title} | Evriel Systems`,
        desc: a.excerpt,
        path: `/insights/${slug}`,
      });
    }
    window.scrollTo(0, 0);
  }, [slug]);

  if (!a) return <InsightsPage />;

  const others = ARTS.filter((x) => x.slug !== slug).slice(0, 2).map((x) => localizedArticle(x.slug));

  return (
    <div ref={rootRef}>
      <Nav />
      <main>
        <article className="article">
          <div className="wrap">
            <header className="article-head reveal">
              <span className="art-tag">{a.tag}</span>
              <h1>{a.title}</h1>
              <p className="article-by">{t.insightsPage.by}</p>
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
            <h2 className="section-h">{t.insightsPage.keep}</h2>
            {others.map((o) => (
              <a key={o.slug} href={withLang(`/insights/${o.slug}`)} className="ins-row">
                <span className="art-tag">{o.tag}</span>
                <h2>{o.title}</h2>
                <p>{o.excerpt}</p>
                <span className="art-more">{t.insights.read}</span>
              </a>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

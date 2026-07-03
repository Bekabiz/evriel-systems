import { ArrowRight } from "lucide-react";
import { ARTS } from "../content";

/* ---------- INSIGHTS ---------- */
export function InsightsHome({ setPage, setSlug }) {
  return (
    <>
      <section className="ins-hero">
        <div className="sec-label"><span className="sec-label__n">Research</span>Insights</div>
        <h1 className="ins-hero__h">Thinking <em>Forward</em></h1>
      </section>
      <section className="ins-grid">
        <div className="ins-grid__in">
          {ARTS.map((a, i) => (
            <article key={i} className="art-card" onClick={() => { setSlug(a.slug); setPage("article"); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
              <div className="art-card__meta">
                <span className="art-card__tag">{a.tag}</span>
                <span className="art-card__date">{a.date}</span>
              </div>
              <h2 className="art-card__t">{a.title}</h2>
              <p className="art-card__ex">{a.excerpt}</p>
              <div className="art-card__rd">Read Article <ArrowRight size={13} /></div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

export function ArticlePage({ slug, setPage, setSlug }) {
  const art = ARTS.find((a) => a.slug === slug);
  if (!art) return null;
  const others = ARTS.filter((a) => a.slug !== slug).slice(0, 3);
  return (
    <>
      <section className="art-hero">
        <span className="art-hero__tag">{art.tag}</span>
        <h1 className="art-hero__h">{art.title}</h1>
        <span className="art-hero__date">{art.date}</span>
      </section>
      <section className="art-body">
        <div className="art-body__in">
          <div className="art-body__content">
            {art.body.map((p, i) => <p key={i} className="art-body__p">{p}</p>)}
            <div className="art-body__cta">
              <p>Ready to implement intelligent systems?</p>
              <a href="#" className="btn btn--solid" onClick={(e) => { e.preventDefault(); setPage("home"); setTimeout(() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }), 300); }}>
                Let's Discuss Your Project <ArrowRight size={15} />
              </a>
            </div>
          </div>
          <div className="art-body__side">
            <h4 className="art-side__h">More Articles</h4>
            {others.map((a, i) => (
              <div key={i} className="art-side__item" onClick={() => { setSlug(a.slug); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
                <span className="art-side__tag">{a.tag}</span>
                <p className="art-side__t">{a.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

/* ---------- PRIVACY ---------- */
const PRIVACY_SECTIONS = [
  ["Who We Are", "Evriel Systems is an AI and digital transformation consultancy based in Europe. This policy explains how we collect, use, and protect your information when you use our website (evrielsystems.com)."],
  ["Information We Collect", "When you submit our contact form, we collect: your name, company name, email address, phone number (optional), preferred language, industry, areas of interest, and project description. We collect this information solely to respond to your inquiry."],
  ["How We Use Your Information", "We use the information you provide exclusively to respond to your inquiry, discuss potential projects, and provide requested services. We do not sell, rent, or share your personal information with third parties. We do not use your information for marketing purposes unless you explicitly consent."],
  ["Cookies", "This website uses only essential cookies required for basic functionality (such as remembering your cookie consent preference). We do not use tracking cookies, advertising cookies, or third-party analytics that track individual users."],
  ["Your Rights (GDPR)", null],
  ["Data Retention", "We retain contact form submissions only as long as necessary to respond to your inquiry and for legitimate business purposes. You may request deletion of your data at any time."],
  ["Contact", null],
];

export function PrivacyPage() {
  return (
    <section className="privacy">
      <div className="privacy__wrap">
        <h1 className="privacy__h">Privacy <em>Policy</em></h1>
        <p className="privacy__updated">Last updated: June 2026</p>
        <div className="privacy__content">
          {PRIVACY_SECTIONS.map(([h, p]) => (
            <div key={h}>
              <h2>{h}</h2>
              {p ? <p>{p}</p> : h === "Your Rights (GDPR)" ? (
                <p>Under the General Data Protection Regulation (GDPR), you have the right to access, correct, or delete any personal data we hold about you. You may also withdraw consent at any time. To exercise any of these rights, contact us at <a href="mailto:contact@evrielsystems.com">contact@evrielsystems.com</a>.</p>
              ) : (
                <p>For any privacy-related questions or data requests, contact us at <a href="mailto:contact@evrielsystems.com">contact@evrielsystems.com</a>.</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { useState, useEffect } from "react";

const BRAND = {
  teal: "#012624",
  white: "#ffffff",
  black: "#111111",
  gray: "#6b7280",
  lightGray: "#f9fafb",
  border: "#e5e7eb",
  success: "#059669",
  tealLight: "#f0f5f5",
};

const Logo = () => (
  <svg viewBox="0 0 1448 1086" style={{ height: 28 }} xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(0,1086) scale(0.1,-0.1)" fill={BRAND.teal} stroke="none">
      <path d="M12553 7163 l-53 -4 0 -342 c0 -188 0 -800 -1 -1359 l0 -1017 16 -60 c22 -84 49 -144 102 -223 l45 -69 59 -49 c33 -27 79 -61 103 -75 63 -37 173 -73 236 -77 l55 -3 -1 33 c0 17 -1 757 -2 1642 l-2 1610 -252 -2 c-139 -1 -277 -3 -305 -5z"/>
      <path d="M1497 7153 c-4 -3 -7 -134 -7 -290 l0 -283 1250 0 1250 0 0 290 0 290 -1243 0 c-684 0 -1247 -3 -1250 -7z"/>
      <path d="M8790 6870 l0 -290 325 0 325 0 0 290 0 290 -325 0 -325 0 0 -290z"/>
      <path d="M10815 6334 c-86 -13 -249 -60 -325 -94 -160 -71 -261 -142 -388 -274 -85 -88 -165 -203 -221 -314 -39 -77 -84 -211 -107 -317 l-17 -80 0 -160 0 -160 17 -80 c43 -197 119 -368 232 -518 176 -234 436 -397 723 -451 42 -8 114 -18 161 -21 l86 -7 123 12 c149 14 278 45 393 95 219 94 416 260 531 447 20 34 37 65 37 70 0 10 4 9 -308 63 l-263 46 -38 -33 c-62 -53 -160 -106 -246 -135 l-80 -27 -135 0 -135 -1 -80 28 c-44 16 -105 44 -135 62 -31 19 -87 65 -124 102 l-68 68 -43 90 c-24 50 -47 105 -50 123 l-7 32 912 0 911 0 7 18 c4 9 7 89 7 177 l-1 160 -17 87 c-20 99 -76 266 -114 342 -14 28 -51 89 -81 136 l-56 85 -90 90 c-103 103 -198 169 -336 233 l-95 45 -115 29 -115 29 -160 4 c-88 2 -173 1 -190 -1z m300 -539 c83 -17 212 -79 275 -131 25 -21 64 -61 88 -88 42 -50 112 -176 112 -202 l0 -14 -615 0 c-338 0 -615 2 -615 5 0 16 38 98 68 145 47 76 105 135 182 185 78 51 122 70 215 95 l70 19 75 0 c41 0 107 -6 145 -14z"/>
      <path d="M7630 6279 c-47 -5 -130 -20 -185 -34 l-100 -25 -110 -55 -110 -54 -84 -67 c-210 -169 -353 -426 -396 -714 l-15 -95 0 -672 0 -673 315 0 315 0 0 634 0 634 16 83 15 84 35 72 34 71 50 55 c62 68 128 111 222 145 l73 27 363 3 362 4 0 294 0 294 -357 -1 c-197 -1 -396 -5 -443 -10z"/>
      <path d="M8898 6282 l-108 -3 0 -1194 0 -1195 325 0 325 0 -2 1198 -3 1197 -215 0 c-118 0 -263 -1 -322 -3z"/>
      <path d="M3995 6263 c4 -10 15 -40 25 -68 10 -27 88 -230 173 -450 85 -220 259 -670 387 -1000 127 -330 253 -656 280 -725 l48 -125 380 -3 380 -2 37 97 c65 169 528 1367 814 2108 l70 180 -322 3 c-176 1 -324 -1 -328 -5 -9 -10 -346 -912 -570 -1530 -41 -112 -76 -203 -80 -203 -3 0 -56 141 -119 313 -62 171 -207 562 -321 867 l-207 555 -327 3 -327 2 7 -17z"/>
      <path d="M1490 5522 l0 -417 10 -90 c20 -182 65 -336 142 -487 58 -115 123 -202 215 -292 94 -92 167 -144 280 -200 116 -58 206 -90 333 -118 l95 -21 713 -4 712 -4 0 295 0 295 -642 3 -643 4 -79 22 c-43 12 -110 39 -149 59 l-71 38 -77 75 -76 75 -47 95 -46 95 -16 70 c-8 39 -18 125 -21 192 l-6 123 774 2 774 3 0 300 0 300 -1087 2 -1088 2 0 -417z"/>
    </g>
  </svg>
);

function parseCSV(text) {
  const lines = text.split("\n").filter(l => l.trim());
  if (lines.length < 2) return [];
  const questions = [];
  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g);
    if (!parts || parts.length < 2) continue;
    const question = parts[0].replace(/^"|"$/g, "").replace(/;/g, ",");
    const type = parts[1].trim();
    const optionsRaw = parts[2] ? parts[2].replace(/^"|"$/g, "") : "";
    const options = optionsRaw ? optionsRaw.split("|").map(o => o.trim()) : [];
    questions.push({ id: `q${i}`, question, type, options });
  }
  return questions;
}

const DEMO_QUESTIONS = [
  { id: "q1", question: "Are you mainly interested in an e-commerce website, a stock and operations management system, or a combination of both?", type: "single", options: ["An e-commerce website", "A stock and operations management system", "Both", "Other"] },
  { id: "q2", question: "Would you prefer an independent system, or a system that works alongside your existing Hondos Center platform and software?", type: "single", options: ["An independent system", "A system that works alongside Hondos Center", "I'm not sure yet — I need advice on this", "Other"] },
  { id: "q3", question: "Would you like the three stores in Pyrgos, Kalamata and Amaliada to be managed together through one central system?", type: "single", options: ["Yes — all three together in one system", "No — each store managed separately", "Together — but with separate views for each store", "Other"] },
  { id: "q4", question: "What software are you currently using for sales, stock and product management?", type: "text", options: [] },
  { id: "q5", question: "Can your current software export product and stock information in Excel or CSV format?", type: "single", options: ["Yes", "I think so — but I'm not sure how", "No", "I don't know", "Other"] },
];

export default function IntakeForm() {
  const [questions, setQuestions] = useState(DEMO_QUESTIONS);
  const [answers, setAnswers] = useState({});
  const [otherText, setOtherText] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [gdprConsent, setGdprConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sheetId = params.get("id");
    if (sheetId) {
      setLoading(true);
      fetch(`https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`)
        .then(r => r.text())
        .then(csv => { setQuestions(parseCSV(csv)); setLoading(false); })
        .catch(() => setLoading(false));
    }
  }, []);

  const totalSteps = questions.length + 1; // +1 for name/email
  const progress = Math.round(((currentStep + 1) / (totalSteps + 1)) * 100);

  const handleSelect = (qId, option) => {
    if (option === "Other") {
      setAnswers(prev => ({ ...prev, [qId]: "Other" }));
    } else {
      setAnswers(prev => ({ ...prev, [qId]: option }));
      setOtherText(prev => ({ ...prev, [qId]: "" }));
    }
  };

  const handleText = (qId, value) => {
    setAnswers(prev => ({ ...prev, [qId]: value }));
  };

  const handleOtherText = (qId, value) => {
    setOtherText(prev => ({ ...prev, [qId]: value }));
  };

  const getAnswer = (qId) => {
    if (answers[qId] === "Other" && otherText[qId]) {
      return `Other: ${otherText[qId]}`;
    }
    return answers[qId] || "";
  };

  const allAnswered = questions.every(q => {
    const a = answers[q.id];
    if (!a || a.trim() === "") return false;
    if (a === "Other" && (!otherText[q.id] || otherText[q.id].trim() === "")) return false;
    return true;
  }) && gdprConsent && clientName.trim() !== "";

  const handleSubmit = () => {
    const body = questions
      .map(q => `${q.question}\n→ ${getAnswer(q.id)}`)
      .join("\n\n");
    const subject = encodeURIComponent(`Project Questionnaire — ${clientName}`);
    const mailBody = encodeURIComponent(
      `New questionnaire response\n\nName: ${clientName}\nEmail: ${clientEmail}\n\n${body}`
    );
    window.open(`mailto:bekabizuayehu3@gmail.com?subject=${subject}&body=${mailBody}`, "_blank");
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={{ minHeight: "100vh", background: BRAND.white, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
        <div style={{ textAlign: "center", padding: "40px 24px", maxWidth: 440 }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: BRAND.success, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 600, color: BRAND.black, margin: "0 0 10px" }}>Thank you for your response</h2>
          <p style={{ fontSize: 15, color: BRAND.gray, margin: 0, lineHeight: 1.6 }}>We have received your answers and will review them carefully. You will receive a detailed proposal shortly.</p>
          <div style={{ marginTop: 32 }}><Logo /></div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: BRAND.white, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
        <div style={{ textAlign: "center" }}>
          <Logo />
          <p style={{ color: BRAND.gray, marginTop: 16, fontSize: 14 }}>Loading questionnaire...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: BRAND.white, fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>

      {/* Progress bar */}
      <div style={{ position: "sticky", top: 0, zIndex: 10, background: BRAND.white, borderBottom: `1px solid ${BRAND.border}` }}>
        <div style={{ height: 3, background: BRAND.teal, width: `${progress}%`, transition: "width 0.3s ease" }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 24px", maxWidth: 600, margin: "0 auto" }}>
          <Logo />
          <span style={{ fontSize: 12, color: BRAND.gray, fontWeight: 500 }}>{Math.min(currentStep + 1, totalSteps)} of {totalSteps}</span>
        </div>
      </div>

      {/* Header */}
      <div style={{ padding: "40px 24px 28px", maxWidth: 600, margin: "0 auto" }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: BRAND.teal, margin: "0 0 8px", lineHeight: 1.2, letterSpacing: "-0.02em" }}>
          Project Discovery
        </h1>
        <p style={{ fontSize: 14, color: BRAND.gray, margin: 0, lineHeight: 1.6 }}>
          Your answers will help us understand your needs and prepare a proposal tailored to your business.
        </p>
      </div>

      {/* Form */}
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "0 24px 80px" }}>

        {/* Name & Email */}
        <div style={{ marginBottom: 32 }}>
          <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: BRAND.black, marginBottom: 6 }}>Your full name <span style={{ color: "#ef4444" }}>*</span></label>
          <input type="text" value={clientName} onChange={e => { setClientName(e.target.value); setCurrentStep(0); }}
            placeholder="e.g. Kyriakos Diamantakos"
            style={{ width: "100%", padding: "11px 14px", borderRadius: 8, border: `1px solid ${BRAND.border}`, fontSize: 15, color: BRAND.black, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }}
            onFocus={e => e.target.style.borderColor = BRAND.teal} onBlur={e => e.target.style.borderColor = BRAND.border}
          />
        </div>
        <div style={{ marginBottom: 32 }}>
          <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: BRAND.black, marginBottom: 6 }}>Your email</label>
          <input type="email" value={clientEmail} onChange={e => setClientEmail(e.target.value)}
            placeholder="e.g. kyriakos@example.com"
            style={{ width: "100%", padding: "11px 14px", borderRadius: 8, border: `1px solid ${BRAND.border}`, fontSize: 15, color: BRAND.black, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }}
            onFocus={e => e.target.style.borderColor = BRAND.teal} onBlur={e => e.target.style.borderColor = BRAND.border}
          />
        </div>

        <div style={{ height: 1, background: BRAND.border, margin: "8px 0 32px" }} />

        {/* Questions */}
        {questions.map((q, i) => (
          <div key={q.id} style={{ marginBottom: 36 }} onClick={() => setCurrentStep(i + 1)}>
            <div style={{ fontSize: 11, fontWeight: 700, color: BRAND.teal, marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Question {i + 1}
            </div>
            <p style={{ fontSize: 15, fontWeight: 500, color: BRAND.black, margin: "0 0 12px", lineHeight: 1.5 }}>
              {q.question}
            </p>

            {q.type === "single" && q.options.map(opt => {
              const selected = answers[q.id] === opt;
              const isOther = opt === "Other";
              return (
                <div key={opt}>
                  <div onClick={(e) => { e.stopPropagation(); handleSelect(q.id, opt); }}
                    style={{ padding: "11px 14px", marginBottom: 5, borderRadius: 8, border: `1.5px solid ${selected ? BRAND.teal : BRAND.border}`, background: selected ? BRAND.tealLight : BRAND.white, cursor: "pointer", display: "flex", alignItems: "center", gap: 10, transition: "all 0.15s" }}>
                    <div style={{ width: 16, height: 16, borderRadius: "50%", border: `2px solid ${selected ? BRAND.teal : "#d1d5db"}`, background: selected ? BRAND.teal : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {selected && <div style={{ width: 5, height: 5, borderRadius: "50%", background: BRAND.white }} />}
                    </div>
                    <span style={{ fontSize: 14, color: BRAND.black, lineHeight: 1.4 }}>{isOther ? "Other (please specify)" : opt}</span>
                  </div>
                  {isOther && selected && (
                    <textarea value={otherText[q.id] || ""} onChange={e => handleOtherText(q.id, e.target.value)}
                      placeholder="Please describe..."
                      rows={2}
                      style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: `1px solid ${BRAND.teal}`, fontSize: 14, color: BRAND.black, fontFamily: "inherit", resize: "vertical", outline: "none", boxSizing: "border-box", marginBottom: 5, background: BRAND.tealLight }}
                    />
                  )}
                </div>
              );
            })}

            {q.type === "text" && (
              <textarea value={answers[q.id] || ""} onChange={e => handleText(q.id, e.target.value)}
                placeholder="Type your answer here..."
                rows={3}
                style={{ width: "100%", padding: "11px 14px", borderRadius: 8, border: `1px solid ${BRAND.border}`, fontSize: 14, color: BRAND.black, fontFamily: "inherit", resize: "vertical", outline: "none", boxSizing: "border-box" }}
                onFocus={e => e.target.style.borderColor = BRAND.teal} onBlur={e => e.target.style.borderColor = BRAND.border}
              />
            )}
          </div>
        ))}

        {/* GDPR */}
        <div style={{ padding: "18px", borderRadius: 8, background: BRAND.lightGray, border: `1px solid ${BRAND.border}`, marginBottom: 24 }}>
          <div onClick={() => setGdprConsent(!gdprConsent)} style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
            <div style={{ width: 18, height: 18, borderRadius: 4, border: `2px solid ${gdprConsent ? BRAND.teal : "#d1d5db"}`, background: gdprConsent ? BRAND.teal : BRAND.white, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
              {gdprConsent && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
            </div>
            <p style={{ fontSize: 12, color: BRAND.gray, margin: 0, lineHeight: 1.6 }}>
              I consent to Evriel Systems collecting and processing my responses for the sole purpose of understanding my project requirements and preparing a proposal. My data will be handled in accordance with the EU General Data Protection Regulation (GDPR), will not be shared with third parties, and will be retained only for the duration of the project evaluation. Please do not include any confidential case or client information in your answers.
            </p>
          </div>
        </div>

        {/* Submit */}
        <button onClick={handleSubmit} disabled={!allAnswered}
          style={{ width: "100%", padding: "14px 24px", borderRadius: 8, border: "none", background: allAnswered ? BRAND.teal : "#d1d5db", color: BRAND.white, fontSize: 15, fontWeight: 600, cursor: allAnswered ? "pointer" : "not-allowed", transition: "all 0.2s", fontFamily: "inherit" }}>
          Submit
        </button>

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: 32, paddingTop: 20, borderTop: `1px solid ${BRAND.border}` }}>
          <Logo />
          <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 6 }}>evrielsystems.com</p>
        </div>
      </div>
    </div>
  );
}

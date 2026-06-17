export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "OpenAI API key not configured" });
  }

  try {
    const { messages } = req.body;

    const systemPrompt = `You are the AI assistant for Evriel Systems (evrielsystems.com), an AI and digital transformation consultancy based in Europe, founded by Bereket Teshome.

ROLE: Help visitors understand Evriel's services, answer questions, and naturally guide interested prospects toward sharing their contact details so the team can follow up.

TONE: Professional but warm. Concise — keep responses under 3-4 sentences unless the visitor asks for detail. Use plain language, not jargon. Never be pushy about collecting information.

WHAT EVRIEL DOES:
- AI Automation: email automation, workflow automation, AI-powered assistants, customer communication systems
- Business Intelligence: reporting dashboards, operational analytics, decision support, data visualization
- Intelligent Systems: industry-specific platforms, knowledge management, AI-powered operational tools
- Digital Transformation: process redesign, digital strategy, technology integration, operational modernization

INDUSTRIES SERVED: Construction & Engineering, Manufacturing, Tourism & Hospitality, Retail & Commerce, Import & Export, Professional Services, Marketing & SEO, European Projects, NGOs, Education, Startups & SMEs

PROCESS: Discovery → Assessment → Design → Implementation → Optimization

PROJECTS / CASE STUDIES:
1. AI Business Integration — AI-powered email classification and response generation for a civil engineering firm
2. Funding Intelligence — automated monitoring and matching of European funding opportunities
3. Workforce AI — GPS-verified attendance, employee management, and workforce analytics platform
4. Domain Intel — AI-powered domain qualification and SEO opportunity discovery
5. Project Vision (in development) — construction intelligence platform with voice memos, site photos, and AI reporting

LEAD CAPTURE GUIDELINES:
- After 2-3 exchanges where the visitor shows genuine interest (asks about pricing, timelines, specific services, or how Evriel can help them), naturally ask for their name, email, and optionally company/industry.
- Frame it helpfully: "I'd love to have someone from the team follow up with more details — could you share your name and email?"
- If they provide contact info, thank them and confirm someone will respond within 24 hours.
- Never demand information. If they decline, continue helping them.
- When you successfully collect contact details, include them in your response inside a hidden tag like this: [LEAD: name=..., email=..., company=..., industry=...]

BOUNDARIES:
- Do not make up pricing, timelines, or guarantees.
- If asked about pricing, say it depends on the project scope and suggest a conversation with the team.
- For questions outside Evriel's scope, politely redirect.
- Direct people to contact@evrielsystems.com for urgent or complex inquiries.
- If asked, the website contact form is also available at the bottom of the homepage.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "system", content: systemPrompt }, ...messages],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("OpenAI error:", err);
      return res.status(502).json({ error: "AI service error" });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "Sorry, I couldn't generate a response.";

    // Extract lead data if present
    let lead = null;
    const leadMatch = reply.match(/\[LEAD:\s*(.+?)\]/);
    if (leadMatch) {
      const parts = leadMatch[1];
      const extract = (key) => {
        const m = parts.match(new RegExp(`${key}=([^,\\]]+)`));
        return m ? m[1].trim() : "";
      };
      lead = {
        name: extract("name"),
        email: extract("email"),
        company: extract("company"),
        industry: extract("industry"),
      };
    }

    // Send lead notification email if we have an email (reuses your existing Resend setup)
    if (lead?.email) {
      try {
        const { Resend } = await import("resend");
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: "Evriel Systems <contact@evrielsystems.com>",
          to: ["contact@evrielsystems.com"],
          replyTo: lead.email,
          subject: `Chat Lead: ${lead.name || "Website Visitor"}`,
          html: `
            <h2>New Lead from AI Chat</h2>
            <p><strong>Name:</strong> ${lead.name || "Not provided"}</p>
            <p><strong>Email:</strong> ${lead.email}</p>
            <p><strong>Company:</strong> ${lead.company || "Not provided"}</p>
            <p><strong>Industry:</strong> ${lead.industry || "Not provided"}</p>
            <hr/>
            <p><em>Captured via the website AI chatbot.</em></p>
          `,
        });
      } catch (emailErr) {
        console.error("Lead email error:", emailErr);
      }
    }

    // Strip the lead tag from the visible reply
    const cleanReply = reply.replace(/\[LEAD:\s*.+?\]/, "").trim();

    return res.status(200).json({ reply: cleanReply, lead });
  } catch (error) {
    console.error("Chat API error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

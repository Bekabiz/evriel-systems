import { Resend } from "resend";
import { issueToken, sameSite, judge, overLimit, escapeHtml } from "./_guard.js";

const resend = new Resend(process.env.RESEND_API_KEY);

/* GET hands the form a signed token. POST takes a message, and only a
   message that passes the guard (see _guard.js) is emailed. */
export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method === "GET") {
    return res.status(200).json(issueToken());
  }
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    if (!sameSite(req.headers)) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body;
    const result = judge(body);

    if (result.verdict === "drop") {
      console.warn("Contact form: dropped as junk:", result.why);
      return res.status(200).json({ success: true });
    }
    if (result.verdict === "reject") {
      return res.status(400).json({ error: "Invalid submission", field: result.why });
    }

    const ip = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim() || "unknown";
    if (overLimit(ip)) {
      return res.status(429).json({ error: "Too many messages" });
    }

    const { name, company, email, language, challenge } = result.data;

    await resend.emails.send({
      from: "Evriel Systems <contact@evrielsystems.com>",
      to: ["contact@evrielsystems.com"],
      replyTo: email,
      subject: `New Inquiry from ${name}${company ? ` (${company})` : ""}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Company:</strong> ${escapeHtml(company) || "Not provided"}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Language:</strong> ${escapeHtml(language) || "Not provided"}</p>
        <hr/>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(challenge).replace(/\n/g, "<br/>")}</p>
      `,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return res.status(500).json({ error: "Failed to send message" });
  }
}

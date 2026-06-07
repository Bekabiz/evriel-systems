// This file goes in your project at: api/contact.js
// Vercel automatically turns files in the /api folder into serverless functions

const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, company, email, phone, language, industry, interests, challenge } = req.body;

    await resend.emails.send({
      from: "Evriel Systems <contact@evrielsystems.com>",
      to: ["contact@evrielsystems.com"],
      replyTo: email,
      subject: `New Inquiry from ${name}${company ? ` — ${company}` : ""}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Company:</strong> ${company || "Not provided"}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
        <p><strong>Language:</strong> ${language}</p>
        <p><strong>Industry:</strong> ${industry || "Not selected"}</p>
        <p><strong>Interests:</strong> ${interests ? interests.join(", ") : "None selected"}</p>
        <hr/>
        <p><strong>Challenge:</strong></p>
        <p>${challenge || "Not provided"}</p>
      `,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return res.status(500).json({ error: "Failed to send message" });
  }
};

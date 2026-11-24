/* Keeps automated junk out of the contact form without asking a real
   visitor to solve anything. Files that start with an underscore are not
   served as routes by Vercel.

   The layers, in the order the endpoint applies them:
   1. Same-site only: the request must come from a page on this site.
   2. Honeypot: a field no person can see must stay empty.
   3. Signed token: the form asks the server for a token when someone
      first touches it, and has to send it back. A script that posts
      straight to the endpoint has none.
   4. Time: a person needs a few seconds between touching the form and
      sending it. The server measures this itself from the token.
   5. Content: the junk that reached the inbox was random letters. Names
      and messages made of that, and Gmail addresses padded with dots,
      are dropped.
   6. A small per-address limit.

   Junk is answered with the same "ok" a real message gets, so whoever
   runs the script learns nothing. Nothing is emailed. */

import { createHmac, timingSafeEqual } from "crypto";

const MIN_AGE_MS = 3000;
const MAX_AGE_MS = 6 * 60 * 60 * 1000;

const secret = () => process.env.CONTACT_SECRET || process.env.RESEND_API_KEY || "";

const sign = (ts) => createHmac("sha256", secret()).update(`contact:${ts}`).digest("hex");

export function issueToken(now = Date.now()) {
  return { t: now, s: sign(now) };
}

/* Returns the token age in ms, or -1 when the token is missing or forged. */
export function tokenAge(token, now = Date.now()) {
  if (!secret() || !token || typeof token !== "object") return -1;
  const ts = Number(token.t);
  const sig = String(token.s || "");
  if (!Number.isFinite(ts) || !/^[0-9a-f]{64}$/.test(sig)) return -1;
  const want = Buffer.from(sign(ts), "hex");
  const got = Buffer.from(sig, "hex");
  if (want.length !== got.length || !timingSafeEqual(want, got)) return -1;
  return now - ts;
}

export function sameSite(headers) {
  const host = String(headers.host || "").toLowerCase();
  const from = String(headers.origin || headers.referer || "");
  if (!host || !from) return false;
  try {
    return new URL(from).host.toLowerCase() === host;
  } catch {
    return false;
  }
}

export const escapeHtml = (v) =>
  String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const clean = (v, max) => String(v ?? "").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").trim().slice(0, max);
const oneLine = (v, max) => clean(v, max).replace(/\s+/g, " ");

/* Capitals that follow a small letter inside one word: "McDonald" has
   one, random letters like "JByyBtJFJCxzTt" have many. */
const humps = (word) => (word.match(/(?<=[a-z])[A-Z]/g) || []).length;
const randomWord = (text, min) =>
  text.split(/\s+/).some((w) => /^[A-Za-z]{10,}$/.test(w) && humps(w) >= min);

const paddedGmail = (email) => {
  const m = /^([^@]+)@(gmail|googlemail)\.com$/i.exec(email);
  return !!m && (m[1].match(/\./g) || []).length >= 3;
};

/* Reads and judges one submission.
   { verdict: "send", data }   a real message
   { verdict: "drop", why }    junk: answer ok, send nothing
   { verdict: "reject", why }  a form problem a person should hear about */
export function judge(body, { now = Date.now() } = {}) {
  const b = body && typeof body === "object" ? body : {};

  if (clean(b.website, 200)) return { verdict: "drop", why: "honeypot" };

  const age = tokenAge(b.token, now);
  if (age < 0 || age > MAX_AGE_MS) return { verdict: "reject", why: "token" };
  if (age < MIN_AGE_MS) return { verdict: "drop", why: "too fast" };

  const data = {
    name: oneLine(b.name, 80),
    company: oneLine(b.company, 120),
    email: oneLine(b.email, 120).toLowerCase(),
    language: oneLine(b.language, 8),
    challenge: clean(b.challenge, 4000),
  };

  if (randomWord(data.name, 3) || randomWord(data.challenge, 4)) return { verdict: "drop", why: "random letters" };
  if (paddedGmail(data.email)) return { verdict: "drop", why: "padded gmail" };

  if (data.name.length < 2) return { verdict: "reject", why: "name" };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email)) return { verdict: "reject", why: "email" };
  if (data.challenge.length < 10 || data.challenge.split(/\s+/).length < 2) return { verdict: "reject", why: "message" };

  return { verdict: "send", data };
}

/* At most three messages per address in ten minutes. A serverless
   instance forgets this when it sleeps, so it only slows a burst. */
const seen = new Map();
export function overLimit(ip, now = Date.now()) {
  const recent = (seen.get(ip) || []).filter((t) => now - t < 10 * 60 * 1000);
  recent.push(now);
  seen.set(ip, recent);
  if (seen.size > 500) seen.delete(seen.keys().next().value);
  return recent.length > 3;
}

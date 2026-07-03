# FINAL UPDATE COMMAND FOR CLAUDE CODE

Read EVRIEL-DESIGN-REFERENCE.md first. This is a MAJOR UPDATE to the current site. Do NOT rebuild from zero — update the current commit.

## 1. LOGO — COMPLETE REPLACEMENT

Remove the current hexagonal logo everywhere (nav, footer, favicon, mobile menu, everywhere).

Replace with the new custom "Evriel" wordmark SVG. The logo files are in the `public/` folder:
- `logo.svg` — dark teal wordmark (for white/light backgrounds)
- `logo-white.svg` — white wordmark (for dark backgrounds)
- `icon.svg` — standalone E icon (for favicon)
- `icon-white.svg` — white E icon

In the NAV: use `logo-white.svg` when on dark sections, `logo.svg` when on light sections. Size: height 28-32px, auto width.
For FAVICON: use `icon.svg`, set as the site favicon in index.html.
In the FOOTER: use whichever version matches the footer background.

The logo text is just "Evriel" — there is NO "SYSTEMS" subtitle in the logo itself. If you need to show the full company name in text somewhere (footer copyright, etc.), write "Evriel Systems" in Inter font, but the SVG logo is just "Evriel".

## 2. COLOR DIRECTION — WHITE DOMINANT

THIS IS THE BIGGEST CHANGE. The site must NOT be all dark green anymore.

New approach:
- **WHITE (#ffffff) is the dominant background** for most sections
- **Dark teal (#012624) is used for accent sections** — hero, maybe 1-2 dramatic sections, footer
- **Mint green (#ebfffd / #f0fffe)** for subtle section backgrounds — like a very light teal tint
- **The current teal (#012624) particle sphere hero stays dark** — that's the one dramatic dark moment

Section background flow as user scrolls:
1. Hero — DARK (keep particle sphere, dark teal)
2. Marquee — dark or transitional
3. About — WHITE background, dark text
4. Outcomes/Stats — MINT (#ebfffd) background with dark text, pink accent card
5. Industries — WHITE background
6. Services — WHITE background, with mint-tinted service cards
7. Projects — DARK teal section (accent break)
8. Process — WHITE background
9. Trust/Why — MINT background
10. Contact — WHITE card on subtle mint/glow background
11. Footer — DARK teal

Text colors flip accordingly:
- On white/mint backgrounds: headings #012624, body #4a5a58, accents #00827c
- On dark backgrounds: headings #ffffff, body #bbc7c6, accents #cbfffc

## 3. INDUSTRIES — BRING BACK ROTATING ORBIT

Remove the current card grid for industries. Bring back the rotating orbit/constellation from the original evriel-systems repo (github.com/Bekabiz/evriel-systems src/App.jsx).

Copy the orbit logic: circular layout with industry labels orbiting a center point, click-to-select with description panel on the left (counter 10/11 + description text). In the center, display only the text "Evriel Systems" in Inter (no icon, no SVG logo). Keep the interaction where clicking an industry highlights it and shows its description.

This section should be on a WHITE background with the orbit lines/nodes in teal (#00827c) and labels in dark text.

## 4. BACKGROUND GLOWS

Even on white sections, add subtle radial gradient glows that appear as user scrolls:
- Soft mint/teal glow (#cbfffc at 10-15% opacity) appearing behind certain sections
- Like Auros but lighter — just enough to feel alive, not flat white
- Use GSAP ScrollTrigger to animate glow position/opacity
- Some sections get glow on left, some right

On the dark sections (hero, projects, footer), use the existing teal-to-cyan glow at higher intensity.

## 5. TITLE COLOR SHIFT ON SCROLL

Large section headlines on WHITE backgrounds should be in #012624 (deep teal).
As they scroll through viewport, subtly shift to a slightly lighter teal or add a faint gradient tint. Very subtle, not flashy.

## 6. TOOL MARQUEE WITH LOGOS

The scrolling strip showing tools (Gmail, Outlook, Excel, Google Sheets, Slack, WhatsApp, n8n, Supabase, etc.) must show their actual brand logos/icons alongside names.

Use simple SVG icons from CDN (e.g., https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/) or inline SVG. Two rows scrolling in opposite directions. Place it prominently after the hero or after the about section.

## 7. ROTATING SERVICE WORDS — FASTER

The rotating text cycle (Business Intelligence, Workflow Automation, Intelligent Systems) is currently too slow. Speed it up — cycle every 2-3 seconds instead of the current speed. On mobile especially, users need to see it change before they scroll past.

## 8. SERVICE CARDS — WHITE WITH MINT

Service detail cards should have WHITE (#ffffff) backgrounds with dark (#012624) text. Add a subtle left border in teal (#00827c) or a thin top border with the current gradient. Not dark cards — bright, clean cards.

The mockup elements inside (email automation interface, dashboard, etc.) can have a mint (#ebfffd) background to stand out from the white card.

## 9. STAT/PINK ACCENT CARD

In the outcomes/stats area, create ONE card with a soft pink-to-white gradient background (#fad1ff → #fffdfa → #ffffff) with dark #012624 text. Like Auros's "$1.3T+" card. This is the accent — use it ONCE or TWICE max. The other stat cards are white or mint.

## 10. CONTACT SECTION

White card floating on a subtle mint/glow background. Clean form inside. Categories with arrow rows like Auros (General Inquiry ↗, AI Automation ↗, Business Intelligence ↗, Partnership ↗).

## 11. SOCIAL LINKS

Add to the footer with ghost-style circular icon buttons:
- Instagram: https://www.instagram.com/evrielsystems
- LinkedIn: https://www.linkedin.com/company/evriel-systems/

## 12. FOOTER

Dark teal (#012624) background. White logo (logo-white.svg). Links in #bbc7c6. Social icons. Copyright "© 2026 Evriel Systems".

## WHAT TO KEEP (DO NOT CHANGE):
- All existing content (services, industries, projects, about, contact text)
- Particle sphere hero animation
- GSAP ScrollTrigger reveal animations
- Gradient numbers (01/05 style) — but adjust colors for white backgrounds
- Contact form functionality
- ChatWidget
- SEO meta tags, JSON-LD, sitemap
- Mobile responsiveness
- Privacy policy and insights pages

## WHAT TO REMOVE:
- Old hexagonal logo everywhere
- "SYSTEMS" subtitle from logo
- The card grid industries layout (replace with orbit)
- All-dark-green background from every section

## SUMMARY:
White dominant site. Dark teal hero + 1-2 accent sections + footer. Mint green for subtle section tints. New Evriel wordmark SVG logo. Rotating industry orbit. Faster service word rotation. Tool marquee with brand logos. Pink accent stat card. Clean white service cards. Background glows on scroll. Every section has its own identity.

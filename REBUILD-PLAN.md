# Evriel Systems Rebuild Master Plan

Approved plan for the full rebuild of evrielsystems.com. Read this whole file before touching any code. Build calm, senior level, ONE page at a time (see part 10).

## 1. The direction

The new site works like an Apple product page: white, calm, huge type, lots of air, one idea per screen. The color does not come from paint on the page. It comes from the products themselves: real screens and demo videos of Evriel Inventory, AG Project Monitor, Develop EC and the other projects, shown big inside laptop and phone frames, each in its own strong color.

Deep teal (#012624) survives only in the logo, link hovers and tiny labels. No section is ever filled with teal again.

This is a portfolio plus company site. The goal for every visitor: "if they built these systems, they can build mine." Every claim on the site is backed by a real screen, a real number or a real video, not stock graphics.

## 2. Design system

The base stays white like Apple, but the site owns real color. Each project gets its own strong color, used with confidence inside its section and its page: a gradient on the headline, a soft colored wash behind the content, a colored glow behind the device frames, colored buttons. Between projects the page returns to white, so every section feels like entering a new room.

| Role | Value |
| --- | --- |
| Page background | #FFFFFF, alternate sections #F5F5F7 |
| Text | #1D1D1F near black, secondary #6E6E73 |
| Deep teal #012624 | Logo, wordmark, link hover and small labels only, never a section fill |
| Evriel Inventory color | Ocean cyan #06B6D4 with navy #132840 |
| AG Project Monitor color | Construction orange #E85D04 with graphite #26282B |
| Develop EC color | Black and white photography with warm copper #B87333 |
| TaskTock color | Cobalt #2E5BFF |
| DomainIntel color | Jade #00A87E |
| ClockET color | Fresh green #22C55E (the product's own brand color) |

Color revision after the phase 0 tile: Bereket kept the Evriel Inventory pairing and asked for richer hues on the rest, nothing that reads like default library colors. The values above are the revised set.

Fonts: the wordmark stays Young Serif. Everything else is Instrument Sans (Google Fonts), 600 to 700 tight for headlines, 400 for body.

Motion rules (GSAP is already in the repo): sections fade and rise once as they enter, demo videos autoplay muted on scroll, product screens get 10 to 20 px parallax, everything respects reduced motion, nothing loops forever.

## 3. Sitemap

Today the site is one page with fake navigation (state switching, no real URLs). The rebuild gives every page a real URL, which also fixes SEO.

| Page | URL |
| --- | --- |
| Home | / |
| Evriel Inventory | /work/evriel-inventory |
| AG Project Monitor | /work/ag-project-monitor |
| Develop EC | /work/develop-ec |
| TaskTock | /work/tasktock |
| DomainIntel | /work/domainintel |
| ClockET | /work/clocket |
| Insights | /insights and /insights/article-slug |
| Intake form | /intake |
| Privacy | /privacy |

Services, process, about and contact stay as sections of the home page, reachable by anchor. The home page shows the three flagship projects big (Inventory, AG, Develop EC) and the other projects as a colorful grid linking to their pages.

## 4. Home page, section by section

Each section has one job, one identity and one main asset. Nothing repeats.

| # | Section | Identity | Main asset |
| --- | --- | --- | --- |
| 1 | Nav | Thin white bar, frosted blur, teal wordmark, 5 links | Logo SVG (exists in public/) |
| 2 | Hero | Pure typography on white: one huge two-line headline, one sub line, one button. One word carries a soft gradient | A very subtle ambient light animation behind the text, code only |
| 3 | Showcase opener | One quiet line: systems in daily use in three countries | Text only, sets up the product sections |
| 4 | Evriel Inventory | Ocean cyan and navy | Laptop frame with a 25 to 40 s screen demo video, plus 3 big numbers: 39,000+ products, 3 stores, invoice entry 40 min to 5 min |
| 5 | AG Project Monitor | Graphite and amber, phone-first | Phone frame with a vertical demo video of a voice task being created, plus push notification visual |
| 6 | Develop EC | Full-bleed black and white architecture imagery from the real site | Screen-recorded scroll of developec.gr in a browser frame, link to the live site |
| 6b | Other projects grid | Colorful grid: TaskTock, DomainIntel, ClockET, each tile in its own color with one real screenshot | Links to their pages |
| 7 | Services | Back to white, four quiet items, small teal line icons | Icons only, no cards |
| 8 | Process | Light gray band, four steps left to right: Understand, Build and show, Hand over, Stay close | A thin animated line connecting the steps |
| 9 | About | White, short founder story, the four countries worked in | Full name Bereket Bizuayehu Teshome, see part 9 |
| 10 | Insights | Three latest articles from the existing content | Existing article cards, restyled |
| 11 | Contact | Light gray, short form (existing Resend backend), direct email shown | Form, nothing else |
| 12 | Footer | Light gray, teal wordmark, links, legal, "Founded by Bereket Bizuayehu Teshome" | Text only |

Rule: sections 4, 5, 6 and 6b are the color of the page. Everything around them stays white or light gray so they hit harder.

## 5. Project pages

Every project gets one biggest dedicated page, all on the same skeleton, each wearing its own color from part 2:

1. Hero: project name, one line on what it is, the main demo video or image large
2. What the client wanted: their problem, in plain words
3. The solution we gave: EVERY major feature of the system gets its own block with a name, two plain sentences on what it does for the client, and one real screenshot. Nothing summarized. Example for DomainIntel: semantic search, BUY/REVIEW/AVOID recommendations, toxic-domain filtering, DR and traffic checks, premium backlink-gap scan, each as its own block
4. Photo gallery: a big gallery of real screens of the system
5. The results: real numbers
6. How it works: one short technical paragraph for credibility
7. "Designed and built by Bereket Bizuayehu Teshome, Evriel Systems" line
8. Next project teaser plus the contact block

CLIENT RESPECT RULE, applies everywhere: real client data never appears. No client prices, stock figures, customer names, staff names or internal emails in any screenshot or video. Client names appear publicly only at the level Bereket approves, otherwise describe them (for example "a three-store retail group in Greece").

| Project page | Material |
| --- | --- |
| Evriel Inventory | Live system: capture screens and video (privacy pass first) |
| AG Project Monitor | Live system: capture (temporary account, delete after) |
| Develop EC | Live public site developec.gr plus its own photo set |
| TaskTock | Live app and Telegram bot: capture |
| DomainIntel | Capture what runs; design the rest from the real code (Supabase project currently paused, see notes) |
| ClockET | Same approach as DomainIntel |

## 6. Videos, photos and graphics

Real images from the real products. NEVER AI images for a product that exists.

- Screenshots: automated browser opens the live deployments, logs in where needed, captures desktop and phone sizes
- Demo videos: scripted browser flows recorded (Inventory: dashboard, order, transfer; AG: task appearing; Develop EC: smooth scroll; TaskTock: bot flow)
- Photo galleries: curated sets of captured screens, cleaned, framed, ordered
- Laptop, phone and browser frames: clean SVG and CSS, no external mockup images
- Projects with no live UI: design real interface graphics from the project's actual code and data, not AI pictures
- Hero ambient animation: lightweight canvas code
- Every capture gets a privacy pass before it ships (see client respect rule)

## 7. Build order

| Phase | What ships |
| --- | --- |
| 0 | Style tile: the white system, fonts and all six project colors side by side, for approval |
| 1 | Design system tokens, nav, hero, footer |
| 2 | The three home product sections plus the colorful grid, poster images in video slots |
| 3 | The six project pages, one at a time |
| 4 | Services, process, about, insights, contact, chat widget and intake restyled |
| 5 | Real routes, SEO (parts 3 and 9), performance, mobile QA, Vercel preview, then production |

## 8. Approvals needed from Bereket

- Final project list (add or remove from part 5)
- How each client may be named publicly
- Public contact email for the site
- Approval of the style tile before phase 1

## 9. Personal SEO: making Google know Bereket

Goal: someone searching "Bereket Bizuayehu Teshome" or "Bereket Teshome" finds Evriel Systems and understands who he is and what he built.

Do it with strong legitimate placements, NOT name repetition (Google treats stuffing as spam):

- JSON-LD structured data on every page: Person (Bereket Bizuayehu Teshome) as founder of Organization (Evriel Systems), sameAs links to his LinkedIn and GitHub
- About section: full name once, prominently, with the founder story
- Footer on every page: "Founded by Bereket Bizuayehu Teshome"
- Every Insights article: visible author line and author metadata
- Page titles and meta descriptions mention him where natural (About, Insights)
- Each project page: "Designed and built by Bereket Bizuayehu Teshome, Evriel Systems"
- Real URLs and sitemap.xml so all of it gets crawled

## 10. Build style

Calm, senior level, one page at a time. Each page is treated as its own small product: its own character, its own color, its own assets, finished and approved by Bereket before the next page starts. The site must read as months of careful work, because it shows real systems that took months of work.

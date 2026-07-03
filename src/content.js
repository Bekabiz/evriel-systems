/* ============================================================
   EVRIEL SYSTEMS — CONTENT SOURCE OF TRUTH
   All copy below is the real site content. Do not invent text.
   ============================================================ */

export const HERO = {
  eyebrow: "AI • Automation • Intelligent Systems",
  brand: "Evriel",
  brandSub: "SYSTEMS",
  h2a: "Connecting Intelligence",
  h2b: "with Business",
  sub: "Helping organizations leverage AI, automation, and intelligent systems to improve efficiency, make better decisions, and build sustainable competitive advantages.",
  ctaPrimary: "Explore Solutions",
  ctaSecondary: "Let's Discuss Your Project",
};

/* Full service vocabulary from the original marquee — preserved verbatim */
export const MARQUEE_ITEMS = [
  "AI Integration", "Digital Transformation", "Business Intelligence", "Workflow Automation",
  "Intelligent Systems", "Data Analytics", "Industry Solutions", "Operational Excellence",
];

/* The four journey pillars — visual grouping of the eight service terms above */
export const PILLARS = [
  { id: "P-01", t: "AI Integration", covers: ["AI Integration", "Intelligent Systems"], d: "Practical AI built into the systems your teams already use — assistants, knowledge tools, and intelligent platforms." },
  { id: "P-02", t: "Automation", covers: ["Workflow Automation", "Digital Transformation"], d: "Reduce repetitive work and modernize operations through intelligent process automation." },
  { id: "P-03", t: "Business Intelligence", covers: ["Business Intelligence", "Data Analytics"], d: "Transform business information into actionable insights and confident decisions." },
  { id: "P-04", t: "Industry Solutions", covers: ["Industry Solutions", "Operational Excellence"], d: "Custom-built systems designed around the unique operational needs of each organization." },
];

export const CHAOS_WORDS = ["Manual.", "Repetitive.", "Slow.", "Disconnected."];

export const SHIFT_LINE = "Intelligence turns scattered work into a connected system.";

export const ABOUT = {
  h: ["Intelligence", "With Purpose"],
  lead: "No two organizations operate the same way, which is why effective solutions must be built around real operational needs rather than one-size-fits-all technology.",
  quote: "Our role is to understand those challenges and design practical systems that improve how people work, collaborate, and make decisions.",
  paras: [
    ["Artificial Intelligence is transforming industries and creating new opportunities to operate more efficiently, make smarter decisions, and remain competitive. ", "The challenge is not accessing AI. It is implementing it correctly."],
    ["Founded by Bereket Teshome, Evriel Systems was shaped by experience across business, marketing, European projects, and digital transformation initiatives in Poland, Spain, Italy, and Greece.", null],
    ["Through these experiences, one challenge consistently emerged: many organizations struggle to transform emerging technologies into practical business value.", null],
    ["Working across industries has shown that while technologies change rapidly, the underlying challenges often remain the same: disconnected information, inefficient workflows, and missed opportunities for better decision-making.", null],
    ["Evriel Systems was created to help bridge that gap through AI, automation, and intelligent systems that connect people, processes, information, and technology into solutions built for efficiency, growth, and long-term success.", null],
    ["Our solutions include AI agents, workflow automation, intelligent knowledge systems, custom software, and digital platforms designed to improve efficiency, streamline operations, and support better decision-making.", null],
  ],
};

export const ABOUT_FEATS = [
  { t: "AI-Driven", s: "Innovation", d: "Practical applications of AI for real business challenges." },
  { t: "Multi-Industry", s: "Expertise", d: "Solutions designed for diverse operational environments." },
  { t: "24/7", s: "Intelligence", d: "Continuous support through automation and intelligent systems." },
  { t: "Future-Ready", s: "Growth", d: "Built to adapt, scale, and evolve with your organization." },
];

export const CHALLENGES = ["Fragmented Information", "Repetitive Manual Work", "Disconnected Systems", "Inefficient Communication", "Slow Decision-Making"];

export const CONVERGENCE = ["People", "Processes", "Information", "Technology"];

export const OUTCOMES = [
  { t: "AI-Powered Efficiency", d: "Reduce repetitive work and streamline operations through intelligent automation." },
  { t: "Smarter Decision-Making", d: "Use AI, data, and business intelligence to support informed decisions." },
  { t: "Operational Visibility", d: "Connect systems, information, and workflows to improve transparency and control." },
  { t: "Growth & Competitiveness", d: "Leverage intelligent technologies to adapt, innovate, and stay ahead." },
  { t: "Digital Transformation", d: "Build modern operational foundations that support long-term success." },
];

export const INDS = [
  { name: "Construction & Engineering", short: "Construction", desc: "Digital project monitoring, documentation systems, and reporting automation built for complex, multi-stakeholder environments." },
  { name: "Manufacturing & Industrial", short: "Manufacturing", desc: "Workflow optimization, operational analytics, and predictive monitoring that improve consistency at scale." },
  { name: "Tourism & Hospitality", short: "Tourism", desc: "Guest management, operational automation, and business analytics that elevate the experience and the bottom line." },
  { name: "Retail & Commerce", short: "Retail", desc: "Customer intelligence, inventory visibility, and process automation across the full commercial journey." },
  { name: "Import & Export", short: "Import & Export", desc: "Trade documentation, workflow automation, and operational coordination across borders and partners." },
  { name: "Professional Services", short: "Services", desc: "Knowledge systems, workflow optimization, and AI-assisted operations that free experts to focus on expertise." },
  { name: "Marketing & SEO", short: "Marketing", desc: "Content intelligence, domain qualification, and opportunity discovery powered by AI-driven analysis." },
  { name: "European Projects", short: "EU Projects", desc: "Project management support, reporting, and knowledge management for complex funding environments." },
  { name: "NGOs & Associations", short: "NGOs", desc: "Operational efficiency, communication systems, and data management aligned with mission-driven work." },
  { name: "Education & Training", short: "Education", desc: "Knowledge systems, digital learning support, and administrative automation that support people first." },
  { name: "Startups & SMEs", short: "Startups", desc: "Scalable systems designed to support growth and operational maturity at every stage." },
];

export const SVCS = [
  { n: "01", t: "AI Automation", d: "Reduce repetitive work and improve operational efficiency through intelligent automation.", a: ["Email automation", "Workflow automation", "Internal process automation", "AI-powered assistants", "Customer communication systems"], flow: ["Email", "AI Analysis", "Automation", "Action"] },
  { n: "02", t: "Business Intelligence", d: "Transform business information into actionable insights.", a: ["Reporting dashboards", "Operational analytics", "Decision support systems", "Data visualization", "Performance monitoring"], flow: ["Data", "Analysis", "Insight", "Decision"] },
  { n: "03", t: "Intelligent Systems", d: "Custom-built solutions designed around the unique needs of each organization.", a: ["Industry-specific platforms", "Knowledge management", "AI-powered operational tools", "Intelligent information systems"], flow: ["Needs", "Design", "Build", "Evolve"] },
  { n: "04", t: "Digital Transformation", d: "Support organizations as they modernize operations and adopt emerging technologies.", a: ["Process redesign", "Digital strategy", "Technology integration", "Operational modernization"], flow: ["Assess", "Strategy", "Integrate", "Modernize"] },
];

export const PROJS = [
  { t: "AI Business Integration", badge: null, d: "Supporting the transition from manual operations to AI-enhanced business systems.", c: ["AI-assisted communication", "Email classification", "Response generation", "Digital transformation roadmap"], tl: "Designed and implemented an AI-powered communication system for a civil engineering firm, expanding into a broader digital transformation initiative.",
    detail: {
      challenge: "A civil engineering firm with established operational processes wanted to modernize communication workflows, improve efficiency, and explore how AI could support future business growth.",
      solution: "Designed and implemented an AI-powered communication system capable of classifying emails, identifying urgency levels, and generating professional draft responses. The project expanded into a broader digital transformation initiative covering communication workflows, recruitment strategy, digital presence, and future business development opportunities.",
      results: ["AI-assisted communication workflows", "Email classification and prioritization", "Professional response generation", "Digital transformation roadmap", "Foundation for future intelligent business systems"],
    },
  },
  { t: "Funding Intelligence", badge: null, d: "Opportunity discovery for European projects and funding programs.", c: ["Funding discovery", "Call monitoring", "Eligibility analysis", "Opportunity matching"], tl: "An intelligent system that monitors funding opportunities, analyzes eligibility requirements, and helps organizations identify relevant European project calls.",
    detail: {
      challenge: "Organizations often spend significant time searching through funding portals, tender databases, and project calls to identify relevant opportunities.",
      solution: "Developed an intelligent system that monitors funding opportunities, analyzes eligibility requirements, and helps organizations identify relevant European project calls more efficiently.",
      results: ["Reduced manual search effort", "Faster opportunity identification", "Improved visibility of relevant funding calls", "Enhanced project development workflows"],
    },
  },
  { t: "Workforce AI", badge: null, d: "Intelligent workforce management platform.", c: ["GPS attendance", "Employee verification", "Workforce analytics", "Mobile management"], tl: "A platform combining workforce tracking, location verification, employee management, and operational analytics into a unified system.",
    detail: {
      challenge: "Organizations operating across multiple locations often face difficulties tracking attendance, workforce activity, compliance, and operational visibility. Manual processes can lead to inefficiencies, reporting challenges, and limited real-time oversight.",
      solution: "Developed an intelligent workforce management platform designed to improve workforce visibility, attendance verification, and operational control through digital tools and automation. The platform combines workforce tracking, location verification, employee management, and operational analytics into a unified system accessible through mobile and web interfaces.",
      results: ["GPS-based attendance verification", "Employee check-in and check-out management", "Selfie authentication and identity verification", "Workforce analytics and reporting", "Administrative dashboards", "Mobile payment and payroll integration support", "Operational compliance monitoring"],
    },
  },
  { t: "Domain Intel", badge: null, d: "AI-powered domain intelligence and opportunity discovery.", c: ["Domain qualification", "Opportunity discovery", "SEO intelligence", "Decision support"], tl: "An intelligent platform that analyzes, compares, and qualifies domains while providing contextual insights into relevance, authority, and opportunity potential.",
    detail: {
      challenge: "SEO professionals spend significant time evaluating websites, identifying opportunities, and determining which domains provide the greatest strategic value.",
      solution: "Developed an intelligent platform that analyzes, compares, and qualifies domains while providing contextual insights into relevance, authority, and opportunity potential.",
      results: ["AI-powered domain qualification", "Opportunity discovery engine", "SEO intelligence workflows", "Decision-support capabilities", "Reduced manual research requirements", "Faster identification of high-value opportunities"],
    },
  },
  { t: "Project Vision", badge: "In Development", d: "Construction intelligence platform (in development).", c: ["Voice memo transcription", "Site photo intelligence", "Document management", "AI-powered reporting"], tl: "An AI-powered construction intelligence platform designed to bring together project communication, documentation, and operational updates into a unified environment.",
    detail: {
      challenge: "Project Vision is an AI-powered construction intelligence platform currently under development. The platform is designed to bring together project communication, voice notes, site photographs, engineering documentation, AutoCAD exports, and operational updates into a unified project environment.",
      solution: null,
      results: ["Voice memo transcription and analysis", "Site photo intelligence and progress tracking", "Project timeline generation", "Document and drawing management", "Email integration and project knowledge capture", "AI-powered project insights and reporting"],
      vision: "The objective is to provide engineering and construction teams with a single source of truth for project information, enabling better visibility, faster decision-making, and improved operational coordination throughout the project lifecycle.",
    },
  },
];

export const PROCS = [
  { t: "Discovery", d: "We learn how your organization operates. We identify objectives, challenges, workflows, and opportunities." },
  { t: "Assessment", d: "We analyze operational inefficiencies and identify where intelligent systems create measurable value." },
  { t: "Design", d: "We design a solution tailored to your organization. No generic templates. No one-size-fits-all." },
  { t: "Implementation", d: "We build and integrate the solution into your operational environment." },
  { t: "Optimization", d: "We continuously improve performance, usability, automation, and business outcomes." },
];

export const BORDERS = {
  h: ["Built for a", "Connected", "World"],
  paras: [
    "Business challenges rarely stop at national boundaries. Evriel Systems supports organizations operating across different industries, markets, and regions.",
    "We understand the importance of clear communication, cultural awareness, and practical solutions that work in diverse environments.",
  ],
  tag: "Projects and communications can be conducted in multiple languages depending on client requirements.",
};

export const WHY = {
  h: ["Clarity, Not", "Complexity"],
  lead: "Technology should create clarity, not complexity. Our approach combines business understanding, intelligent technology, and practical implementation to help organizations improve operations, make better decisions, and adapt to a rapidly changing world.",
  sub: "We focus on solutions that deliver measurable value rather than technology for technology's sake.",
  cards: [
    { t: "Practical Solutions", d: "Focused on real business outcomes." },
    { t: "Intelligent Systems", d: "Built around your organization's needs." },
    { t: "Long-Term Thinking", d: "Designed to support sustainable growth and adaptability." },
  ],
};

export const TRUST = {
  h: ["Your Data Remains", "Yours"],
  p: "We believe trust is the foundation of every intelligent system. Client information is used exclusively for the development, operation, and improvement of the agreed solution.",
  note: ["Your data remains your property.", " Client information is never used for unrelated purposes, unauthorized training, or external development activities."],
  cards: [
    { icon: "Lock", t: "Confidentiality", d: "Your information stays protected at every stage." },
    { icon: "Eye", t: "Transparency", d: "Clear communication about how data is used." },
    { icon: "Shield", t: "Responsible AI", d: "Ethical implementation at the core." },
    { icon: "CheckCircle2", t: "Security-First", d: "Built from the ground up with security as priority." },
  ],
};

export const STATEMENT = {
  lines: ["The future belongs to", "organizations that can adapt,", "innovate, and act intelligently."],
  cta: "Start a Conversation",
};

export const NEXT_STEPS = [
  { t: "You Reach Out", d: "Send us a message through the form below. We personally read every inquiry and respond within 24 hours." },
  { t: "Initial Conversation", d: "A relaxed introductory call to understand your organization, goals, and challenges. No commitments, no sales pressure." },
  { t: "Discovery & Assessment", d: "We analyze your workflows and identify exactly where AI and intelligent systems can create measurable value." },
  { t: "Solution Design", d: "You receive a clear proposal with scope, timeline, and expected outcomes, written in plain business language." },
  { t: "Implementation & Continuous Improvement", d: "We build, integrate, and continuously improve the solution alongside your team for long-term success." },
];

export const CONTACT = {
  h: ["Let's Discuss", "Your Project"],
  p: "Whether you have a clear project in mind or are simply exploring possibilities, we'd be happy to learn more about your organization and discuss how intelligent systems can support your goals.",
  email: "contact@evrielsystems.com",
  website: "evrielsystems.com",
  languages: ["English", "Italian", "Spanish", "Greek", "Polish", "French", "German", "Other"],
  industries: ["Construction & Engineering", "Manufacturing", "Tourism & Hospitality", "Retail & Commerce", "Import & Export", "Marketing & SEO", "European Projects", "NGO & Associations", "Professional Services", "Startup / SME", "Education & Training", "Other"],
  interests: ["AI Automation", "Business Intelligence", "Digital Transformation", "Custom Business Systems", "European Project Solutions", "Not Sure Yet"],
};

export const ARTS = [
  { slug: "ai-beyond-chatbots", tag: "AI Strategy", date: "2026", title: "AI Beyond Chatbots: Practical Applications for Real Businesses", excerpt: "AI creates value far beyond conversational interfaces, in operations, analytics, and decision-making.", body: ["Artificial Intelligence is often associated with chatbots and virtual assistants. While these tools are valuable, they represent only a small part of what AI can achieve within modern organizations.", "Today, businesses are using AI to automate workflows, improve operational efficiency, support decision-making, and create better customer experiences.", "One of the most impactful applications of AI is workflow automation. Organizations spend countless hours performing repetitive administrative tasks such as data entry, reporting, document processing, and communication management. Intelligent systems can automate many of these processes, allowing employees to focus on higher-value activities.", "AI also plays an increasingly important role in decision support. By analyzing large volumes of business information, intelligent systems can identify patterns, detect inefficiencies, and provide recommendations that help organizations make better decisions.", "Customer service is another area where AI creates significant value. Beyond simple chatbots, AI can assist support teams by organizing information, suggesting responses, and providing instant access to organizational knowledge.", "The most successful organizations do not adopt AI simply because it is popular. They identify specific business challenges and implement intelligent solutions that generate measurable results.", "The future of AI in business is not about replacing people. It is about empowering people with better tools, better information, and better systems.", "Organizations that embrace this approach will be better positioned to improve efficiency, increase competitiveness, and adapt to a rapidly changing business environment."] },
  { slug: "automation-failures", tag: "Transformation", date: "2026", title: "Why Most Automation Projects Fail", excerpt: "The gap between automation promise and results is wider than most organizations expect.", body: ["Automation is one of the most powerful tools available to modern organizations. However, many automation initiatives fail to deliver the expected benefits.", "The primary reason is simple: organizations often attempt to automate inefficient processes. Automation cannot fix a broken workflow. It can only accelerate it.", "Before introducing technology, organizations must first understand how work is performed, identify bottlenecks, and redesign inefficient processes. Without this foundation, automation often creates additional complexity instead of solving existing problems.", "Another common mistake is focusing on software rather than business objectives. Organizations sometimes purchase new tools without clearly defining the problem they are trying to solve.", "Successful automation projects begin with questions such as: What process needs improvement? What outcomes are we trying to achieve? How will success be measured?", "Employee adoption is equally important. Even the most advanced automation platform will struggle if users do not understand its purpose or if it disrupts established workflows.", "The most successful automation initiatives are not technology projects. They are business improvement projects supported by technology.", "When implemented correctly, automation can reduce administrative workloads, improve consistency, increase operational visibility, and enable organizations to scale more effectively.", "The goal is not simply to automate tasks. The goal is to build smarter and more efficient systems."] },
  { slug: "ai-construction-engineering", tag: "Industry", date: "2026", title: "AI in Construction and Engineering", excerpt: "Intelligent systems transforming project visibility, communication, and operational control.", body: ["Construction and engineering projects generate enormous amounts of information. Drawings, reports, site updates, documentation, schedules, budgets, and communication records are often distributed across multiple systems and stakeholders.", "Managing this information efficiently has become one of the industry's greatest challenges.", "AI and intelligent systems are creating new opportunities to improve project visibility, communication, and operational control.", "AI can support engineering teams by organizing project documentation, monitoring progress, generating reports, and helping identify potential issues before they impact schedules or budgets.", "Project managers can benefit from real-time access to information that would otherwise require hours of manual review.", "Digital monitoring systems can improve coordination between office teams, engineers, contractors, and site personnel.", "Intelligent systems can also support technical knowledge management by ensuring that important information remains accessible throughout the project lifecycle.", "The future of construction technology is not simply about digitizing documents. It is about creating connected environments where information flows efficiently between people, processes, and systems.", "Organizations that adopt intelligent technologies today will be better positioned to improve productivity, reduce risk, and deliver projects more effectively."] },
  { slug: "digital-transformation-people", tag: "Strategy", date: "2026", title: "Digital Transformation Is About People, Not Software", excerpt: "Why the most expensive transformation failures share the same root cause.", body: ["When organizations begin digital transformation initiatives, many focus immediately on technology. New software is purchased. New platforms are implemented. New tools are introduced.", "Yet despite significant investments, many transformation projects fail to achieve their intended outcomes.", "The reason is simple: digital transformation is not primarily a technology challenge. It is a people and process challenge.", "Technology can enable change, but it cannot create it on its own.", "Successful organizations first understand how people work, how decisions are made, and how information moves throughout the business. Only then can technology be implemented effectively.", "Employees need systems that support their work rather than create additional complexity. Managers need visibility into operations. Leadership teams need reliable information to guide strategic decisions.", "When technology aligns with business processes and organizational objectives, transformation becomes sustainable.", "The most successful organizations do not simply digitize existing activities. They redesign how work is performed and use technology to create better outcomes.", "Digital transformation is ultimately about creating environments where people, processes, and technology work together effectively.", "Organizations that understand this principle achieve greater efficiency, adaptability, and long-term growth."] },
  { slug: "intelligent-systems-advantage", tag: "Competitive Edge", date: "2026", title: "Building Competitive Advantage Through Intelligent Systems", excerpt: "How forward-thinking organizations use AI to create sustainable competitive moats.", body: ["Every organization is searching for ways to become more efficient, more responsive, and more competitive.", "Traditionally, competitive advantage was often created through scale, location, or access to resources.", "Today, intelligent systems are becoming one of the most important sources of competitive advantage.", "Organizations generate vast amounts of information every day. Customer interactions, operational data, project updates, financial records, and market insights all contain valuable opportunities for improvement.", "The challenge is not collecting information. The challenge is transforming information into action.", "Intelligent systems help organizations automate repetitive tasks, identify patterns, support decision-making, and improve operational visibility.", "By reducing manual work and improving access to information, organizations can respond more quickly to opportunities and challenges.", "The goal is not to replace human expertise. The goal is to enhance it.", "Organizations that successfully combine human knowledge with intelligent systems are better positioned to adapt, innovate, and grow.", "Competitive advantage is no longer created solely through resources. It is increasingly created through intelligence, adaptability, and the ability to make better decisions faster."] },
  { slug: "data-driven-decisions", tag: "Intelligence", date: "2026", title: "Turning Data Into Better Decisions", excerpt: "Organizations drown in data but struggle with decisions. Here's how intelligent systems close the gap.", body: ["Modern organizations generate more information than ever before. Operational reports, customer interactions, project updates, financial records, performance metrics all contribute to growing volumes of data.", "Yet many organizations continue to struggle with decision-making.", "The problem is not a lack of information. The problem is transforming information into meaningful insights.", "Without structure and context, data becomes overwhelming rather than useful.", "Business intelligence and intelligent systems help organizations organize information, identify patterns, and present insights in ways that support effective decision-making.", "When leaders have access to accurate and relevant information, they can identify opportunities more quickly, address problems earlier, and allocate resources more effectively.", "Data-driven organizations are often more agile because decisions are supported by evidence rather than assumptions.", "However, successful data utilization requires more than dashboards and reports. Organizations must establish processes that ensure information is accessible, reliable, and aligned with business objectives.", "The future belongs to organizations that can transform information into intelligence and intelligence into action.", "Better decisions create better outcomes. Intelligent systems make those decisions easier to achieve."] },
];

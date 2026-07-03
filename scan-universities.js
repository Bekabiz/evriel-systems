/**
 * Italian University Master's Program Scanner
 * Uses Firecrawl MCP to deep-crawl university admission pages
 * and Claude API to analyze fit against Bereket's profile
 *
 * Run in Claude Code where Firecrawl MCP is connected.
 * Usage: node scan-universities.js
 */

import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";

// ============================================================
// YOUR PROFILE (used for AI compatibility analysis)
// ============================================================
const STUDENT_PROFILE = {
  name: "Bereket Bizuayehu Teshome",
  university: "UNIVPM - Universita Politecnica delle Marche",
  degree: "L-33 Digital Economics and Business",
  degreeClass: "L-33",
  creditsCompleted: 123,
  creditsTotal: 180,
  weightedAverage: 25.50,
  projectedFinalGrade: "88-90/110",
  englishLevel: "C1 (certified, passed English Language Advanced at UNIVPM)",
  italianLevel: "Working proficiency (not certified B2/C1)",
  computerScience: "9 CFU Fundamentals of Computer Science (passed)",
  isee: 0,
  nationality: "Ethiopian (non-EU nationality BUT residing in Italy with permesso di soggiorno per studio = EU-EQUIVALENT for admission purposes. Use EU/Italian-resident deadlines and procedures, NOT 'non-EU requiring visa' track)",
  internationalExperience: [
    "Spain - EU Project Technician (Erasmus)",
    "Poland - WhitePress SEO/AI internship",
    "Greece - Adamopoulos & Partners digital consultant (current)"
  ],
  mathTolerance: "LOW - Do NOT include programs with mandatory Econometrics, Advanced Mathematics, Mathematical Economics, Quantitative Methods, Statistical Learning. Math difficulty above 5/10 = warning, above 7/10 = BLOCKED.",
  crawlStudyPlan: "ALWAYS crawl the piano di studi / study plan / course catalog page for each program. Extract every course (name, CFU, mandatory/elective, SSD). This is how we check what Bereket will actually study and if math is heavy.",
  admissionCategory: "EU-EQUIVALENT (residing in Italy). Always use EU/Italian-resident deadlines. Ignore non-EU visa deadlines.",
  passedExams: [
    { name: "English Language Advanced (C1)", cfu: 6, grade: 27, sector: "L-LIN/12" },
    { name: "Fundamentals of Computer Science", cfu: 9, grade: 26, sector: "INF/01" },
    { name: "Principles of Economics", cfu: 12, grade: 18, sector: "SECS-P/01" },
    { name: "Business Economics and Principles of Accounting", cfu: 12, grade: 23, sector: "SECS-P/07" },
    { name: "Fundamentals of IT Law", cfu: 6, grade: 30, sector: "IUS/01" },
    { name: "Business Information Systems", cfu: 12, grade: 27, sector: "SECS-P/10" },
    { name: "Society and Digital Transformation", cfu: 6, grade: 27, sector: "SPS/08" },
    { name: "Industrial Economics and Digital Transformation", cfu: 6, grade: 21, sector: "SECS-P/06" },
    { name: "Financial Statement Analysis", cfu: 6, grade: 30, sector: "SECS-P/07" },
    { name: "European Public Law and Labor Protection in Digital Age", cfu: 12, grade: 30, sector: "IUS/09" },
    { name: "Data Analytics for Economics and Business", cfu: 6, grade: 24, sector: "SECS-S/01" },
    { name: "International Trade and Finance", cfu: 9, grade: 20, sector: "SECS-P/02" },
    { name: "Planning and Control Systems", cfu: 9, grade: 26, sector: "SECS-P/07" },
    { name: "Internship", cfu: 12, grade: 30, sector: null }
  ],
  pendingExams: [
    { name: "Mathematics", cfu: 9, sector: "SECS-S/06" },
    { name: "Statistics", cfu: 9, sector: "SECS-S/01" },
    { name: "Economic History of Tech Change", cfu: 6, sector: "SECS-P/12" },
    { name: "Business Management & Digital Apps", cfu: 9, sector: "SECS-P/08" },
    { name: "Marketing & Digital Applications", cfu: 9, sector: "SECS-P/08" },
    { name: "Principles of Financial Economics", cfu: 6, sector: "SECS-P/01" },
    { name: "Financial Mathematics", cfu: 6, sector: "SECS-S/06" },
    { name: "Final Project", cfu: 3, sector: null }
  ],
  cfuBySector: {
    "SECS-P/01": 18,
    "SECS-P/02": 9,
    "SECS-P/06": 6,
    "SECS-P/07": 27,
    "SECS-P/08": 0,
    "SECS-P/10": 12,
    "SECS-S/01": 6,
    "SECS-S/06": 0,
    "IUS/01": 6,
    "IUS/09": 12,
    "INF/01": 9,
    "SPS/08": 6,
    "L-LIN/12": 6,
    "SECS-P/12": 0
  }
};

const UNIVERSITIES = [
  { name: "Bologna (Forli)", url: "https://corsi.unibo.it/2cycle/InternationalPoliticsEconomics", status: "already_analyzed" },
  { name: "Parma", url: "https://corsi.unipr.it/en/cdlm-ibd", status: "already_analyzed" },
  { name: "Tor Vergata", url: "https://economia.uniroma2.it/master-science/ba/", status: "already_analyzed" },
  { name: "Modena (UNIMORE)", url: "https://www.international-management.unimore.it/", status: "already_analyzed" },
  { name: "Udine", url: "https://www.uniud.it/en/didactics/master-degree/economics/international-marketing-management-and-organization", status: "already_analyzed" },
  { name: "Milano Statale", url: "https://www.unimi.it/en/education/masters-degree-programmes", status: "to_scan" },
  { name: "Catania", url: "https://www.unict.it/en/education/masters-degree-programmes-taught-english", status: "to_scan" },
  { name: "Padova", url: "https://www.unipd.it/en/educational-offer/second-cycle-degrees", status: "to_scan" },
  { name: "Pisa", url: "https://www.unipi.it/index.php/english/education", status: "to_scan" },
  { name: "Firenze", url: "https://www.unifi.it/changelang-eng.html", status: "to_scan" },
  { name: "Torino", url: "https://www.unito.it/international-students/studying-unito/degree-programmes-english", status: "to_scan" },
  { name: "Napoli Federico II", url: "https://www.unina.it/en_GB/didattica/corsi-di-studio", status: "to_scan" },
  { name: "Roma La Sapienza", url: "https://www.uniroma1.it/en/pagina/english-taught-programmes", status: "to_scan" },
  { name: "Roma Tre", url: "https://www.uniroma3.it/en/courses/", status: "to_scan" },
  { name: "Genova", url: "https://unige.it/en/students/masters-degrees-english", status: "to_scan" },
  { name: "Pavia", url: "https://web.unipv.it/en/education/courses-taught-in-english/", status: "to_scan" },
  { name: "Siena", url: "https://www.unisi.it/internazionale/international-courses", status: "to_scan" },
  { name: "Perugia", url: "https://www.unipg.it/en/courses", status: "to_scan" },
  { name: "Trieste", url: "https://www.units.it/en/education/master-degrees-english", status: "to_scan" },
  { name: "Cagliari", url: "https://www.unica.it/it/didattica/offerta-formativa", status: "to_scan" },
  { name: "Bari", url: "https://www.uniba.it/en/courses", status: "to_scan" },
  { name: "Calabria (UNICAL)", url: "https://www.unical.it/internazionale/study-at-unical/master-degrees/", status: "to_scan" },
  { name: "Venezia Ca'Foscari", url: "https://www.unive.it/pag/10474/", status: "to_scan" },
  { name: "Verona", url: "https://www.univr.it/en/our-services/-/journal_content/56/35673/1702", status: "to_scan" },
  { name: "Bergamo", url: "https://en.unibg.it/study/master-degrees", status: "to_scan" },
  { name: "Brescia", url: "https://www.unibs.it/en/", status: "to_scan" },
  { name: "Macerata", url: "https://www.unimc.it/en/courses", status: "to_scan" },
  { name: "Salento (Lecce)", url: "https://www.unisalento.it/en/education/master-s-degree-programmes", status: "to_scan" },
  { name: "Sassari", url: "https://www.uniss.it/en/education/degree-programmes", status: "to_scan" },
  { name: "Ferrara", url: "https://www.unife.it/en/education/masters-degree-courses", status: "to_scan" },
  { name: "Insubria", url: "https://www.uninsubria.it/la-didattica/corsi-di-laurea-e-laurea-magistrale", status: "to_scan" },
  { name: "Piemonte Orientale", url: "https://www.uniupo.it/en", status: "to_scan" },
  { name: "Camerino", url: "https://www.unicam.it/en/education", status: "to_scan" },
  { name: "Messina", url: "https://www.unime.it/en", status: "to_scan" },
  { name: "Palermo", url: "https://www.unipa.it/international/en/", status: "to_scan" },
  { name: "Molise", url: "https://www.unimol.it", status: "to_scan" },
  { name: "Basilicata", url: "https://portale.unibas.it/site/home.html", status: "to_scan" },
  { name: "Tuscia (Viterbo)", url: "https://www.unitus.it/en/", status: "to_scan" },
  { name: "Cassino", url: "https://www.unicas.it/en/", status: "to_scan" },
  { name: "Marche Politecnica", url: "https://www.univpm.it/Entra/Courses_702", status: "to_scan" },
  { name: "Salerno", url: "https://www.unisa.it/en/home", status: "to_scan" },
  { name: "Chieti-Pescara", url: "https://www.unich.it/en", status: "to_scan" },
  { name: "Foggia", url: "https://www.unifg.it/en", status: "to_scan" },
  { name: "Teramo", url: "https://www.unite.it/en", status: "to_scan" },
  { name: "Urbino", url: "https://www.uniurb.it/international/students-and-scholars-from-abroad", status: "to_scan" }
];

console.log(`
Universities to scan: ${UNIVERSITIES.filter(u => u.status === "to_scan").length}
Already analyzed: ${UNIVERSITIES.filter(u => u.status === "already_analyzed").length}
Total: ${UNIVERSITIES.length}

Profile: ${STUDENT_PROFILE.name}
Degree: ${STUDENT_PROFILE.degree}
GPA: ${STUDENT_PROFILE.weightedAverage}/30
CFU: ${STUDENT_PROFILE.creditsCompleted}/${STUDENT_PROFILE.creditsTotal}
English: ${STUDENT_PROFILE.englishLevel}
`);

export { STUDENT_PROFILE, UNIVERSITIES };

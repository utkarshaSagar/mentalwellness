/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ExamInfo {
  code: string;
  name: string;
  fullName: string;
  body: string;
  season: string;
  stressProfile: string;
}

export const TARGET_EXAMS: ExamInfo[] = [
  {
    code: "NEET",
    name: "NEET (UG)",
    fullName: "National Eligibility cum Entrance Test",
    body: "NTA",
    season: "Exam in May, Results in June",
    stressProfile: "Single-shot high stakes medicine admission, multiple drop attempts, intense parental and community feedback."
  },
  {
    code: "JEE_MAIN",
    name: "JEE Main",
    fullName: "Joint Entrance Examination (Main)",
    body: "NTA",
    season: "Session 1 in Jan, Session 2 in April",
    stressProfile: "Anxiety around percentile scores across dual sessions, peer-to-peer comparisons."
  },
  {
    code: "JEE_ADV",
    name: "JEE Advanced",
    fullName: "JEE Advanced",
    body: "IIT (Rotating Host)",
    season: "Exam in May-June",
    stressProfile: "Extremely difficult questions, qualifier-on-qualifier selection pressure, top institute target anxiety."
  },
  {
    code: "CUET",
    name: "CUET (UG/PG)",
    fullName: "Common University Entrance Test",
    body: "NTA",
    season: "Exam in May-June",
    stressProfile: "Multi-subject examination load, newly standardized college-admissions format uncertainty."
  },
  {
    code: "CAT",
    name: "CAT",
    fullName: "Common Admission Test",
    body: "IIMs",
    season: "Exam in late November",
    stressProfile: "Working professional time crunch, high speed section percentiles, interview stage anxiety."
  },
  {
    code: "GATE",
    name: "GATE",
    fullName: "Graduate Aptitude Test in Engineering",
    body: "IISc & IITs",
    season: "Exam in February",
    stressProfile: "Long year-round preparation cycles, active career pivot stakes, public sector unit recruitment eligibility pressure."
  },
  {
    code: "UPSC",
    name: "UPSC CSE",
    fullName: "Civil Services Examination",
    body: "UPSC",
    season: "Prelims in May-June, Mains in September",
    stressProfile: "Multistage year-long grind, low percentage success rate, intense isolation during long prep, severe burnout risk."
  },
  {
    code: "BOARD_X",
    name: "Board Exams (X)",
    fullName: "Class 10 Board Exams",
    body: "CBSE / ICSE / State Boards",
    season: "Exams Feb-April, Results in May",
    stressProfile: "Foundational academic fear, first experience of public board results, comparison with relatives and neighbors."
  },
  {
    code: "BOARD_XII",
    name: "Board Exams (XII)",
    fullName: "Class 12 Board Exams",
    body: "CBSE / ISC / State Boards",
    season: "Exams Feb-April, Results in May",
    stressProfile: "Foundational exam combined with university entrance pressure, intense transition anxiety."
  }
];

export const OTHER_EXAMS_CATEGORIES = [
  "BITSAT",
  "MHT-CET / KCET / WBJEE / TS-EAPCET",
  "CLAT (Law Entrance)",
  "NDA / CDS (Defense forces)",
  "SSC CGL / Bank PO (SBI/IBPS)",
  "NEET PG",
  "CSIR-NET / UGC-NET",
  "State PSC (Civils)",
  "CA / CS Foundation"
];

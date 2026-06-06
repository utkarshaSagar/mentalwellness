# Swayam - Self Care Portal (`स्वयं`)

Swayam ("Self") is a production-grade, highly-accessible, and strictly offline-first Personal Wellness and Mental Health Web Application designed for Indian students preparing for major competitive exams (such as NEET, JEE, UPSC, GATE, CAT) or foundational Boards (CBSE, ICSE, and various State boards).

Swayam provides students a verifiably local, secure, and serene digital sanctuary to track daily emotional states, analyze stress drivers, practice breathing patterns, engage in somatic grounding during acute panic, and structure their study habits using mood-aware timers — all with 100% data confidentiality and zero external tracking.

---

## 🚀 Key Features

1. **Skippable & Respectful Onboarding:** Allows students to select target exams, stress-reduction goals, initial baseline mood, and language preferences. The onboarding process is fully skippable to avoid micro-pressuring anxious students.
2. **Rapid 10-Second Check-In:** Log daily mood scores (scale of 1-5), select relevant stress triggers (peer comparison, parental pressure, syllabus backlogs, sleep deprivation, result anxiety), and instantly append custom-made tags.
3. **Structured Reflection (Journal):** Interactive writing exercises featuring guided cognitive reframing prompts (identifying factors within vs. outside control, exam score compartmentalization). Input strings are sanitized at storage boundaries against Cross-Site Scripting (XSS).
4. **Pranayama Box Breathing (4-4-4-4):** Calming breathing cycle simulation featuring dynamic cursor-guided expansion rings. Highly responsive across mobile and touch-screen devices.
5. **Somatic 5-4-3-2-1 Grounding Modal:** A highly accessible "Moment of Panic - Help" trigger reachable from anywhere in the app to guide students step-by-step through sensory-focus exercises during intense panic.
6. **Study-Rhythm Pomodoro Timer (25-minute periods):** Integrates structured study sequences alongside study breaks. **Automatically extends short break lengths from 5 minutes to 10 minutes if a user's checked mood scores are low or tense (score <= 2)**.
7. **Rule-Based Support & Daily Tips:** Direct suggestions computed strictly in-memory mapping logged stress tags to actionable, compassionate micro-reframing nodes.
8. **Crisis Helpline Safety Net:** An automated distress-aware popup system that triggers instantly if a student records a highly low mood score (1/5), connecting them directly to vetted government-approved mental health services (Tele-MANAS, KIRAN mental healthcare helpline, and Vandrevala Foundation) alongside clinical safety disclaimers.
9. **Irreversible Privacy Sandbox Controls:** Settings module supporting direct client-side JSON export of accumulated wellness history, manual JSON-backup copy/paste imports, and irreversible, single-tap local memory purges.
10. **Drishti Eye-Relax Oasis:** An interactive, relaxing visual game space featuring an Ophthalmic Infinity Tracker (where students trace a slow, moving vector orb to exercises focus muscles) and a Harmony Zen color-matching puzzle. No scores or speed stress—designed specifically to release eye-muscle strain caused by hours of textbook study.

---

## 🛠️ Project Design & Layer Architecture

Swayam is constructed according to the strict **Three-Layer Architectural Pattern** ensuring modularity, visual isolation, and decoupling of core computations:

```
                      +---------------------------------------+
                      |       UI PRESENTATION LAYER           |
                      |  - React 18 / 19 Functional Views     |
                      |  - Tailwind Calming CSS Styling       |
                      |  - Interactive Somatic Orbits         |
                      +-------------------+-------------------+
                                          |
                                          | Calls triggers / calculates
                                          v
                      +-------------------+-------------------+
                      |       BUSINESS LOGIC LAYER            |
                      |  - wellnessRules.ts (Recommendations) |
                      |  - wellnessRules.ts (Streaks Logic)   |
                      |  - tests.ts (Automated Diagnostics)   |
                      +-------------------+-------------------+
                                          |
                                          | Reads / Writes State 
                                          v
                      +-------------------+-------------------+
                      |      DATA STORAGE LOGIC LAYER         |
                      |  - localDb.ts (Sanitized Sandbox)    |
                      |  - translations.ts / exams.ts (Defs)  |
                      +---------------------------------------+
```

### 1. Data Definition & Persistence Layer (`src/db/` & `src/data/`)
- `localDb.ts`: Wraps the client's `localStorage` sandbox securely. Enforces XSS mitigation by escaping raw text input fields (`<` to `&lt;` and `>` to `&gt;`) before writing objects.
- `translations.ts` & `exams.ts`: Houses structured translations (English & Hindi) and target-exam profiles containing specific seasonal pressure windows.

### 2. Business Logic Layer (`src/logic/`)
- `wellnessRules.ts`: Clean, side-effect-free evaluator that maps mood histories to personalized recommendations and aggregates trigger tag frequencies, without importing React components. Includes:
  - **Non-Punitive Self-Care Streak Calculator**: Tracks contiguous days logged but treats missed days gracefully — focusing on cumulative self-care totals rather than wiping a user's progress.

### 3. Presentation Layer (`src/components/` & `src/App.tsx`)
- Pure React Functional Components styled using **Tailwind CSS Utility Classes**. Uses named imports and Lucide React icons for lightweight rendering and high performance.

---

## 🔌 Offline-Ready Optimization & Caching

- **PWA Service Worker (`public/sw.js`):** Intercepts network fetch requests and implements a highly performant `Stale-While-Revalidate` caching policy. Swayam operates 100% offline in rural or low-bandwidth connection settings.
- **Micro SVG Trends:** Eliminates heavy external charting dependencies (like Recharts) in favor of lightweight, custom-animated SVG vector graphs. This dramatically reduces resource usage on entry-level smartphones and ensures perfect alignment with the warm sand visual theme.

---

## 🛠️ Installation and Setup Guide

Follow these simple instructions to install, verify, and run Swayam locally on your machine.

### Prerequisites
Make sure you have the following installed on your machine:
- **Node.js** (v18.x or higher recommended)
- **npm** (comes packaged with Node.js)

---

### Step 1: Install Dependencies
First, install all required packages defined in `package.json`:
```bash
npm install
```

### Step 2: Run in Development Mode
To boot up the dynamic local development server:
```bash
npm run dev
```
Once the dev server starts, open your browser and navigate to the local URL (typically `http://localhost:3000`).

### Step 3: Run Stability Tests
To execute the automated diagnostic on-device test assertions:
```bash
npm run test
```
This runs the sanity integrity suite verifying cumulative streaks, non-punitive restorer loops, distress alerts, and offline rules processing.

### Step 4: Run Static Typechecking Check
To verify strict TypeScript compilability and check for errors:
```bash
npm run lint
```

### Step 5: Build for Production
To bundle and compile the application assets optimized for production deployments:
```bash
npm run build
```
The compiled files will build securely inside the `/dist` directory. You can preview the production bundle locally with:
```bash
npm run preview
```

### ☕ Mind-Relaxing Eye-Sanctuary Access
To enjoy the calming visual eye-relaxation and focus game, navigate to the **"Sight Calm & Eye Oasis"** tab on your Study Desk and interact with either the Infinity tracker or Zen Harmony puzzle to release textbook fatigue.

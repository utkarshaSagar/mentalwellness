# Swayam - Architectural Blueprint & Design Choices

This document highlights the core architectural constraints, layer separations, and design decisions utilized in building **Swayam - Self Care Portal** (`स्वयं`).

---

## 1. Architectural Layers Separation

Swayam is structured directly as an offline-capable visual single-page application (SPA). It partitions concerns cleanly:

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

### Decoupled Logic & Testability
- **Local Access Control (`/src/db/localDb.ts`):** Handles all read/write sequences securely via `localStorage`. Imposes strict input-sanitization (XSS guard) on any text fields (e.g., brief note from check-in, free-write content from journal) before committing items to the data arrays. Complete mock import/export backups are bound here.
- **Rules Processing (`/src/logic/wellnessRules.ts`):** Free of UI hooks, this is a pure evaluation system. Features like cumulative streaks are calculated based on raw timestamp lists, returning simple datasets that the UI presents as metrics. This allows full test execution without needing to mock browser nodes.

---

## 2. Key Design Decisions

### Privacy-by-Design Parameter Locks
Swayam handles exceptionally sensitive student emotional logs (from parents, fatigue, failure, result fears).
- **Absolute Local Confidentiality:** The product maintains a full local-first paradigm. Everything stays on the user's browser storage block (`localStorage`).
- **XSS Protections:** Both the data storage adapter and journaling layouts sanitize inputs. HTML tag characters `<` and `>` are escaped automatically to prevent scripting attacks.

### Resource Efficiency & Patchy Web Suitability
Indian students, especially outside major metro areas, often prepare for UPSC, NEET, or JEE on phones with restricted bandwidth.
- **Zero Heavy Extra Chart Libraries:** To accommodate React 19 and optimize CPU usage, we hand-crafted custom, fluid, animated SVG polylines and rects. This keeps the bundle highly efficient, ensures fast initial paints, and matches the warm sand/charcoal theme exactly.
- **Service Worker (`sw.js`):** Implements `Stale-While-Revalidate` service caching. Once downloaded, Swayam works completely offline in remote study environments.

### The "Drishti" Dynamic Eye Oasis
We replaced debug diagnostics with a therapeutic micro-activity to offset ocular strain and release stress. This space uses:
- **Infinity Loop Bernoulli Lemniscate**: Programmed using high-precision trigonometric mathematical curves (`cos(t)` and `sin(t)` overlays) mapped directly onto an HTML5 canvas to guarantee smooth movement. This acts as a tracking tool specifically designed to stretch fixed-near eye muscles without head movement.
- **Harmony Zen pastel matrix**: Designed with custom warm color-wavelength pairings (`HARMONY_COLORS`) that promote gentle optical relaxation, operating through a responsive React tile-matching memory state.

### Calm Human Interface Strategy
Indian exam portals are notoriously loud, highly stressful, and full of alerts. Swayam takes a starkly different aesthetic path:
- **Serene Off-White Interface:** Utilizes warm sand tones (`background-color: #fcfbf9`) paired with soft slate-charcoal text. No rapid blinking alerts, countdown pressure counters, or visual anxiety badges.
- **Translation Scaffolding:** Wireframed using a dual English and Hindi locale switch in the header workspace.
- **Forgiving Micro-interactivity:** Guided somatic 5-4-3-2-1 overlay and interactive calming Box Breathing breathe pulses anchor heart rates without pressuring.

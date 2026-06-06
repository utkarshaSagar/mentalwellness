/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type MoodEntry = {
  id: string;
  timestamp: string;        // ISO 8601
  score: 1 | 2 | 3 | 4 | 5; // 1: Very Low, 2: Low, 3: Normal, 4: Good, 5: Excellent
  note?: string;            // sanitized free text
  triggerTags: string[];    // references TriggerTag.id
};

export type TriggerTag = {
  id: string;
  label: string;            // e.g. "mock-test score"
  isCustom: boolean;
};

export type JournalEntry = {
  id: string;
  timestamp: string;
  promptId?: string;        // null if free-write
  content: string;          // sanitized free text
};

export type UserProfile = {
  id: string;
  exams: string[];          // exam codes, e.g., ["NEET", "JEE_MAIN"]
  examDate?: string;        // ISO format YYYY-MM-DD
  goals?: string[];
  preferredLanguage: string; // 'en' or 'hi'
  dataSharingOptIn: boolean; // default false
};

export type WellnessRecommendation = {
  id: string;
  trigger: string;          // condition that fired this rule (e.g., "Score <= 2", "Trigger: parental pressure")
  type: 'breathing' | 'break' | 'sleep' | 'reframe' | 'resource';
  message: string;
};

export type TranslationKeys = {
  appName: string;
  onboardingTitle: string;
  onboardingDesc: string;
  skipButton: string;
  saveButton: string;
  examSelectLabel: string;
  languageSelectLabel: string;
  baselineMoodLabel: string;
  dashboardTitle: string;
  checkInTitle: string;
  moodQuestion: string;
  triggersTitle: string;
  noteLabel: string;
  journalTitle: string;
  journalPrompt: string;
  submitButton: string;
  recommendationsTitle: string;
  safetyTitle: string;
  safetyDesc: string;
  helplineCallBtn: string;
  breathingTitle: string;
  groundingAlert: string;
  timerTitle: string;
  breaksActive: string;
  historyTitle: string;
  exportDataBtn: string;
  deleteDataBtn: string;
  confirmDeleteLabel: string;
};

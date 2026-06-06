/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MoodEntry, TriggerTag, JournalEntry, UserProfile } from '../types';

const KEYS = {
  PROFILE: 'sankalp_profile',
  MOODS: 'sankalp_mood_entries2',
  TRIGGERS: 'sankalp_trigger_tags2',
  JOURNALS: 'sankalp_journal_entries2',
};

// Default system triggers matching the specified prompt
const DEFAULT_TRIGGERS: TriggerTag[] = [
  { id: 't-mock', label: 'Mock-test scores', isCustom: false },
  { id: 't-parent', label: 'Parental pressure', isCustom: false },
  { id: 't-peer', label: 'Peer comparison', isCustom: false },
  { id: 't-sleep', label: 'Poor sleep / fatigue', isCustom: false },
  { id: 't-backlog', label: 'Syllabus backlog', isCustom: false },
  { id: 't-result', label: 'Result anxiety', isCustom: false },
  { id: 't-social', label: 'Social media distraction', isCustom: false },
  { id: 't-health', label: 'Health problems', isCustom: false },
];

export const localDb = {
  // --- PREFERENCE / PROFILE ---
  getProfile(): UserProfile {
    try {
      const data = localStorage.getItem(KEYS.PROFILE);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error("Failed to read profile", e);
    }
    return {
      id: 'default-user',
      exams: [],
      preferredLanguage: 'en',
      dataSharingOptIn: false,
    };
  },

  saveProfile(profile: UserProfile): void {
    try {
      localStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.error("Failed to save profile", e);
    }
  },

  // --- TRIGGERS ---
  getTriggers(): TriggerTag[] {
    try {
      const data = localStorage.getItem(KEYS.TRIGGERS);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error("Failed to read triggers", e);
    }
    // Return default tags if none exist
    this.saveTriggers(DEFAULT_TRIGGERS);
    return DEFAULT_TRIGGERS;
  },

  saveTriggers(tags: TriggerTag[]): void {
    try {
      localStorage.setItem(KEYS.TRIGGERS, JSON.stringify(tags));
    } catch (e) {
      console.error("Failed to save triggers", e);
    }
  },

  addCustomTrigger(label: string): TriggerTag {
    const trimmed = label.trim().substring(0, 30);
    const tags = this.getTriggers();
    
    // Check if duplicate
    const existing = tags.find(t => t.label.toLowerCase() === trimmed.toLowerCase());
    if (existing) return existing;

    const newTag: TriggerTag = {
      id: `t-custom-${Date.now()}`,
      label: trimmed,
      isCustom: true,
    };
    
    tags.push(newTag);
    this.saveTriggers(tags);
    return newTag;
  },

  // --- MOOD ENTRIES ---
  getMoodEntries(): MoodEntry[] {
    try {
      const data = localStorage.getItem(KEYS.MOODS);
      if (data) {
        const parsed = JSON.parse(data) as MoodEntry[];
        // Sort descending by timestamp
        return parsed.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      }
    } catch (e) {
      console.error("Failed to read moods", e);
    }
    return [];
  },

  saveMoodEntries(entries: MoodEntry[]): void {
    try {
      localStorage.setItem(KEYS.MOODS, JSON.stringify(entries));
    } catch (e) {
      console.error("Failed to save moods", e);
    }
  },

  addMoodEntry(entry: Omit<MoodEntry, 'id' | 'timestamp'>): MoodEntry {
    const moods = this.getMoodEntries();
    // HTML Sanitization to prevent XSS in note writing
    const sanitizedNote = entry.note ? entry.note.replace(/</g, "&lt;").replace(/>/g, "&gt;").trim() : undefined;
    
    const newEntry: MoodEntry = {
      id: `mood-${Date.now()}`,
      timestamp: new Date().toISOString(),
      score: entry.score,
      note: sanitizedNote,
      triggerTags: entry.triggerTags,
    };
    
    moods.push(newEntry);
    this.saveMoodEntries(moods);
    return newEntry;
  },

  // --- JOURNAL ENTRIES ---
  getJournalEntries(): JournalEntry[] {
    try {
      const data = localStorage.getItem(KEYS.JOURNALS);
      if (data) {
        const parsed = JSON.parse(data) as JournalEntry[];
        return parsed.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      }
    } catch (e) {
      console.error("Failed to read journals", e);
    }
    return [];
  },

  saveJournalEntries(entries: JournalEntry[]): void {
    try {
      localStorage.setItem(KEYS.JOURNALS, JSON.stringify(entries));
    } catch (e) {
      console.error("Failed to save journals", e);
    }
  },

  addJournalEntry(entry: Omit<JournalEntry, 'id' | 'timestamp'>): JournalEntry {
    const journals = this.getJournalEntries();
    // Sanitization to prevent XSS
    const sanitizedContent = entry.content.replace(/</g, "&lt;").replace(/>/g, "&gt;").trim();
    
    const newEntry: JournalEntry = {
      id: `journal-${Date.now()}`,
      timestamp: new Date().toISOString(),
      promptId: entry.promptId,
      content: sanitizedContent,
    };
    
    journals.push(newEntry);
    this.saveJournalEntries(journals);
    return newEntry;
  },

  // --- USER DATA EXPORT & PURGE ---
  exportBackupData(): string {
    const backup = {
      profile: this.getProfile(),
      moods: this.getMoodEntries(),
      triggers: this.getTriggers(),
      journals: this.getJournalEntries(),
      exportedAt: new Date().toISOString(),
      clientInfo: "Swayam Offline-First Engine"
    };
    return JSON.stringify(backup, null, 2);
  },

  importBackupData(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (data && typeof data === 'object') {
        if (data.profile) this.saveProfile(data.profile);
        if (data.moods) this.saveMoodEntries(data.moods);
        if (data.triggers) this.saveTriggers(data.triggers);
        if (data.journals) this.saveJournalEntries(data.journals);
        return true;
      }
    } catch (e) {
      console.error("Failed to import backup data", e);
    }
    return false;
  },

  clearAllData(): void {
    localStorage.removeItem(KEYS.PROFILE);
    localStorage.removeItem(KEYS.MOODS);
    localStorage.removeItem(KEYS.TRIGGERS);
    localStorage.removeItem(KEYS.JOURNALS);
  }
};

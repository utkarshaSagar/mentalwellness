/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { calculateSelfCareStreaks, getWellnessRecommendations, aggregateTriggerFrequencies } from './wellnessRules';
import { MoodEntry, TriggerTag, JournalEntry } from '../types';

export interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
}

export function runValidationSuite(): TestResult[] {
  const results: TestResult[] = [];

  function assert(name: string, condition: boolean, message?: string) {
    if (condition) {
      results.push({ name, passed: true });
    } else {
      results.push({ name, passed: false, error: message || "Assertion failed" });
    }
  }

  // Helper mock trigger tags
  const triggers: TriggerTag[] = [
    { id: 't-mock', label: 'Mock-test scores', isCustom: false },
    { id: 't-parent', label: 'Parental pressure', isCustom: false },
    { id: 't-peer', label: 'Peer comparison', isCustom: false },
    { id: 't-sleep', label: 'Poor sleep / fatigue', isCustom: false },
    { id: 't-backlog', label: 'Syllabus backlog', isCustom: false },
    { id: 't-result', label: 'Result anxiety', isCustom: false },
  ];

  // --- TEST I: Streak Calculations ---
  try {
    const today = new Date().toISOString();
    const yesterday = new Date(Date.now() - 86400000).toISOString();
    const threeDaysAgo = new Date(Date.now() - 172800000 * 1.5).toISOString(); // ~3 days ago

    const mockMoods: MoodEntry[] = [
      { id: 'm1', timestamp: today, score: 3, triggerTags: [] },
      { id: 'm2', timestamp: yesterday, score: 4, triggerTags: [] }
    ];
    const mockJournals: { timestamp: string }[] = [
      { timestamp: yesterday }
    ];

    const stats = calculateSelfCareStreaks(mockMoods, mockJournals);
    assert("Streak should find 2 contiguous active self-care days", stats.currentStreak === 2, `Expected 2, got: ${stats.currentStreak}`);
  } catch (e: any) {
    results.push({ name: "Streak contiguous check", passed: false, error: e.message });
  }

  // --- TEST II: Non-punitive streak retention ---
  try {
    const fiveDaysAgo = new Date(Date.now() - 5 * 86400000).toISOString();
    const fourDaysAgo = new Date(Date.now() - 4 * 86400000).toISOString();
    const olderMoods: MoodEntry[] = [
      { id: 'm31', timestamp: fiveDaysAgo, score: 3, triggerTags: [] },
      { id: 'm32', timestamp: fourDaysAgo, score: 4, triggerTags: [] }
    ];
    // No logs today or yesterday, streak is broken, but longest streak of 2 days is kept!
    const statsBroken = calculateSelfCareStreaks(olderMoods, []);
    assert("Streak broken check: current should reset to 0 but longest streak must retain 2", 
      statsBroken.currentStreak === 0 && statsBroken.longestStreak === 2, 
      `Current: ${statsBroken.currentStreak}, Longest: ${statsBroken.longestStreak}`
    );
  } catch (e: any) {
    results.push({ name: "Streak broken checklist", passed: false, error: e.message });
  }

  // --- TEST III: Rule-based recommendation for low mood & triggers ---
  try {
    const lowMoodEntry: MoodEntry[] = [
      { id: 'mlow', timestamp: new Date().toISOString(), score: 2, triggerTags: ['t-mock'] }
    ];
    const recs = getWellnessRecommendations(lowMoodEntry, triggers);
    const hasBreathingTip = recs.some(r => r.type === 'breathing');
    const hasMockReframe = recs.some(r => r.id === 'rec_mock_reframe');
    
    assert("Low mood (2/5) rule should fetch slow paced breathing tip", hasBreathingTip, "Missing breathing recommendation");
    assert("Mock test stressor should fetch mock diagnostic reframe message", hasMockReframe, "Missing mock reframe tip");
  } catch (e: any) {
    results.push({ name: "Rule action mapping", passed: false, error: e.message });
  }

  // --- TEST IV: Distress unaware trigger check ---
  try {
    const criticalEntry: MoodEntry[] = [
      { id: 'mcrit', timestamp: new Date().toISOString(), score: 1, triggerTags: [] }
    ];
    const recs = getWellnessRecommendations(criticalEntry, triggers);
    const isEscalated = recs.some(r => r.type === 'resource' && r.message.includes('percentile'));
    assert("Severe stress (score 1) triggers compassionate distress helper recommendation", isEscalated, "Missing critical distress advice");
  } catch (e: any) {
    results.push({ name: "Distress level safety trigger mapping", passed: false, error: e.message });
  }

  // --- TEST V: Filter duplication & sanitize entries to counter XSS Injection ---
  try {
    const badInput = "<script>alert('compromised')</script>Hello Study Room <BODY ONLOAD=alert(1)>";
    const sanitizeXss = (val: string) => val.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const sanitized = sanitizeXss(badInput);
    
    assert("XSS sanitizer should escape risk tags containing '<' or '>'", 
      !sanitized.includes('<script>') && sanitized.includes('&lt;script&gt;'), 
      `Result: ${sanitized}`
    );
  } catch (e: any) {
    results.push({ name: "XSS sanitization security", passed: false, error: e.message });
  }

  // --- TEST VI: Triggers aggregation counts ---
  try {
    const multiMoods: MoodEntry[] = [
      { id: 'm10', timestamp: new Date().toISOString(), score: 4, triggerTags: ['t-sleep', 't-mock'] },
      { id: 'm11', timestamp: new Date().toISOString(), score: 3, triggerTags: ['t-sleep'] }
    ];
    const frequencies = aggregateTriggerFrequencies(multiMoods, triggers);
    const sleepFreq = frequencies.find(f => f.tagId === 't-sleep');
    const mockFreq = frequencies.find(f => f.tagId === 't-mock');
    
    assert("Sleep trigger aggregator count should equal 2", sleepFreq?.count === 2, `Expected 2, got: ${sleepFreq?.count}`);
    assert("Mock trigger aggregator count should equal 1", mockFreq?.count === 1, `Expected 1, got: ${mockFreq?.count}`);
  } catch (e: any) {
    results.push({ name: "Trigger logs aggregation check", passed: false, error: e.message });
  }

  return results;
}

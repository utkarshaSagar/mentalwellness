/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MoodEntry, TriggerTag, WellnessRecommendation } from '../types';

/**
 * Rule-based system to recommend actionable wellness activities.
 * Strictly rule-based, non-clinical, supportive, peer-toned.
 */
export function getWellnessRecommendations(
  moods: MoodEntry[],
  allTriggers: TriggerTag[]
): WellnessRecommendation[] {
  const recommendations: WellnessRecommendation[] = [];
  const latestEntry = moods[0];

  // Rule 0: Default daily encouragement if no logs yet
  if (!latestEntry) {
    recommendations.push({
      id: 'rec_init',
      trigger: 'No logs yet',
      type: 'break',
      message: 'Welcome to Swayam! Taking 10 seconds to check in with your emotions is your first act of mindful self-care today. Small gains expand.'
    });
    return recommendations;
  }

  const score = latestEntry.score;
  const triggerIds = latestEntry.triggerTags || [];

  // Rule 1: Distress Aware Trigger (Immediate helpline card takes precedence but also gentle micro-instructions populate)
  if (score === 1) {
    recommendations.push({
      id: 'rec_distress_reframe',
      trigger: 'Mood is 1 (Very Low)',
      type: 'resource',
      message: 'You are going through a heavy moment right now. Remember, no exam, rank, or admission scorecard is worth more than your life and health. Let’s slow down, breathe, and connect with supportive advisors.'
    });
  }

  // Rule 2: Low mood general advice
  if (score <= 2) {
    recommendations.push({
      id: 'rec_low_breathe',
      trigger: 'Mood score <= 2',
      type: 'breathing',
      message: 'When stress triggers the "fight-or-flight" system, deliberate breathing slows down the heart rate. Try the 60-second Box Breathing (4-4-4-4) below to re-anchor your body.'
    });
  }

  // Rule 3: Specific Stress Triggers - Mock Tests
  const hasMockStress = triggerIds.includes('t-mock') || 
    triggerIds.some(tid => {
       const tag = allTriggers.find(t => t.id === tid);
       return tag && tag.label.toLowerCase().includes('mock');
    });
  if (hasMockStress) {
    recommendations.push({
      id: 'rec_mock_reframe',
      trigger: 'Trigger: Mock test score anxiety',
      type: 'reframe',
      message: 'Reframing: A mock-test is a diagnostic compass, not a prediction of your potential. Its sole job is to point to study slots. Treat mistakes as saved marks for the final paper!'
    });
  }

  // Rule 4: Specific Stress Triggers - Parental Pressure
  const hasParentalStress = triggerIds.includes('t-parent') ||
    triggerIds.some(tid => {
      const tag = allTriggers.find(t => t.id === tid);
      return tag && (tag.label.toLowerCase().includes('parent') || tag.label.toLowerCase().includes('family'));
    });
  if (hasParentalStress) {
    recommendations.push({
      id: 'rec_parental_affirm',
      trigger: 'Trigger: Parental pressure',
      type: 'reframe',
      message: 'Reminder: Desiring to make parents proud is natural, but your core value is not tied to an eligibility percentile. Your future has multiple beautiful pathways.'
    });
  }

  // Rule 5: Specific Stress Triggers - Peer Comparison
  const hasPeerStress = triggerIds.includes('t-peer') ||
    triggerIds.some(tid => {
      const tag = allTriggers.find(t => t.id === tid);
      return tag && (tag.label.toLowerCase().includes('peer') || tag.label.toLowerCase().includes('friend') || tag.label.toLowerCase().includes('compare'));
    });
  if (hasPeerStress) {
    recommendations.push({
      id: 'rec_peer_compare',
      trigger: 'Trigger: Peer comparison',
      type: 'reframe',
      message: 'Peer Alert: You only see people’s highlighted reels, never their backstage struggles. Your competition is only with the student you were yesterday.'
    });
  }

  // Rule 6: Specific Stress Triggers - Poor Sleep / fatigue
  const hasSleepStress = triggerIds.includes('t-sleep') ||
    triggerIds.some(tid => {
      const tag = allTriggers.find(t => t.id === tid);
      return tag && (tag.label.toLowerCase().includes('sleep') || tag.label.toLowerCase().includes('tired') || tag.label.toLowerCase().includes('fatigue'));
    });
  if (hasSleepStress) {
    recommendations.push({
      id: 'rec_sleep_hygiene',
      trigger: 'Trigger: Fatigue/Sleep backlog',
      type: 'sleep',
      message: 'Sleep Fuel: Sleep is when the brain consolidates information into long-term memory. Cutting sleep to study actually lowers retention. Aim for a hard stop 30 minutes before bed with no tech.'
    });
  }

  // Rule 7: Syllabus Backlog
  const hasSyllabusStress = triggerIds.includes('t-backlog') ||
    triggerIds.some(tid => {
      const tag = allTriggers.find(t => t.id === tid);
      return tag && (tag.label.toLowerCase().includes('syllabus') || tag.label.toLowerCase().includes('backlog') || tag.label.toLowerCase().includes('portion'));
    });
  if (hasSyllabusStress) {
    recommendations.push({
      id: 'rec_backlog_breakdown',
      trigger: 'Trigger: Syllabus backlog',
      type: 'break',
      message: 'Syllabus Rescue: You cannot swallow the ocean at once. Pick exactly ONE micro-topic for the next 25 minutes. Block out the rest of the syllabus. Micro-progress breaks paralysis.'
    });
  }

  // Rule 8: Result Anxiety / Season Pressure
  const hasResultStress = triggerIds.includes('t-result') ||
    triggerIds.some(tid => {
      const tag = allTriggers.find(t => t.id === tid);
      return tag && (tag.label.toLowerCase().includes('result') || tag.label.toLowerCase().includes('rank') || tag.label.toLowerCase().includes('anxiety'));
    });
  if (hasResultStress) {
    recommendations.push({
      id: 'rec_result_anxiety',
      trigger: 'Trigger: Result day anxiety',
      type: 'reframe',
      message: 'Focus anchor: Results are outside your immediate control. Focusing on things you cannot control is the recipe for worry. Bring your hands back to the present moment: drink warm water, do 5 head rolls.'
    });
  }

  // Rule 9: Default positive booster if doing great
  if (score >= 4 && recommendations.length === 0) {
    recommendations.push({
      id: 'rec_high_booster',
      trigger: 'Good baseline mood',
      type: 'break',
      message: 'Excellent state of flow! Anchor this calm feeling. When you feel stable, writing down a quick positive affirmation cements this resilient mental baseline for tougher study sessions.'
    });
  }

  // Ensure we always have at least two practical tips to select
  if (recommendations.length < 2) {
    recommendations.push({
      id: 'rec_generic_tip',
      trigger: 'General balance',
      type: 'break',
      message: 'Hydration & Posture: Stretched neck muscles restrict blood flow to the visual cortex. Do a 20-second active shoulder stretch right now. Take a deep, tall inhale.'
    });
  }

  return recommendations;
}

/**
 * Non-punitive self-care streak calculator.
 * Tracks consecutive days logged, total logs, and high water-mark milestone.
 * Even if streak is 0, user sees "cumulative days of self-care".
 */
export function calculateSelfCareStreaks(
  moods: MoodEntry[],
  journals: { timestamp: string }[]
): {
  currentStreak: number;
  longestStreak: number;
  totalLogs: number;
  selfCareDays: string[];
} {
  // Combine all timestamps
  const datesSet = new Set<string>();
  
  moods.forEach(m => {
    datesSet.add(m.timestamp.substring(0, 10)); // YYYY-MM-DD
  });
  
  journals.forEach(j => {
    datesSet.add(j.timestamp.substring(0, 10));
  });

  const sortedDates = Array.from(datesSet).sort((a, b) => new Date(b).getTime() - new Date(a).getTime()); // descending (newest first)
  const totalLogs = moods.length + journals.length;

  if (sortedDates.length === 0) {
    return { currentStreak: 0, longestStreak: 0, totalLogs: 0, selfCareDays: [] };
  }

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  // Let's get today's date and yesterday's date in local YYYY-MM-DD
  const formatDate = (d: Date) => {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const todayStr = formatDate(new Date());
  
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = formatDate(yesterday);

  // Determine if streak is alive (user logged either today or yesterday)
  const hasLoggedToday = datesSet.has(todayStr);
  const hasLoggedYesterday = datesSet.has(yesterdayStr);
  
  // Calculate streaks sequentially by traversing ascending sorted dates
  const ascendingDates = [...sortedDates].reverse(); // oldest first
  let prevTime: number | null = null;

  ascendingDates.forEach((dateStr) => {
    const currTime = new Date(dateStr).getTime();
    if (prevTime === null) {
      tempStreak = 1;
    } else {
      const diffMs = currTime - prevTime;
      const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        tempStreak += 1;
      } else if (diffDays > 1) {
        tempStreak = 1; // broken, restart
      }
    }
    if (tempStreak > longestStreak) {
      longestStreak = tempStreak;
    }
    prevTime = currTime;
  });

  // Calculate current active streak
  if (hasLoggedToday || hasLoggedYesterday) {
    // Current streak is the size of the streak block trailing from today or yesterday
    let currentCount = 0;
    let checkDate = new Date(hasLoggedToday ? todayStr : yesterdayStr);
    
    while (true) {
      const checkStr = formatDate(checkDate);
      if (datesSet.has(checkStr)) {
        currentCount++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    currentStreak = currentCount;
  } else {
    currentStreak = 0;
  }

  return {
    currentStreak,
    longestStreak: Math.max(longestStreak, currentStreak),
    totalLogs,
    selfCareDays: sortedDates,
  };
}

/**
 * Aggregates frequency of trigger tags across a dataset.
 */
export function aggregateTriggerFrequencies(
  moods: MoodEntry[],
  allTriggers: TriggerTag[]
): { tagId: string; label: string; count: number; percentage: number }[] {
  const counts: Record<string, number> = {};
  let totalTriggersChecked = 0;

  moods.forEach(entry => {
    (entry.triggerTags || []).forEach(tid => {
      counts[tid] = (counts[tid] || 0) + 1;
      totalTriggersChecked++;
    });
  });

  const list = Object.keys(counts).map(tid => {
    const label = allTriggers.find(t => t.id === tid)?.label || "Custom tag";
    return {
      tagId: tid,
      label,
      count: counts[tid],
      percentage: totalTriggersChecked > 0 ? Math.round((counts[tid] / moods.length) * 100) : 0
    };
  });

  // Sort descending
  return list.sort((a, b) => b.count - a.count);
}

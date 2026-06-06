/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { MoodEntry, TriggerTag, JournalEntry } from '../types';
import { calculateSelfCareStreaks, aggregateTriggerFrequencies } from '../logic/wellnessRules';
import { Calendar, Flame, AlertCircle, Quote, TrendingUp, CalendarDays } from 'lucide-react';

interface DashboardProps {
  moods: MoodEntry[];
  journals: JournalEntry[];
  allTriggers: TriggerTag[];
  translations: any;
}

export const Dashboard: React.FC<DashboardProps> = ({
  moods,
  journals,
  allTriggers,
  translations
}) => {
  const stats = calculateSelfCareStreaks(moods, journals);
  const freqList = aggregateTriggerFrequencies(moods, allTriggers);

  const getEmojiForScore = (s: number) => {
    switch (s) {
      case 1: return "🥺";
      case 2: return "😟";
      case 3: return "😐";
      case 4: return "🙂";
      case 5: return "🌟";
      default: return "😐";
    }
  };

  const scoreLabels = ["", "Weighty", "Tense", "Steady", "Focus", "Stellar"];

  // Prepare points for beautiful custom SVG trend graph.
  // We want to show up to the last 10 mood logs (ordered oldest first)
  const lastEntries = [...moods]
    .slice(0, 10)
    .reverse(); // oldest first

  const width = 450;
  const height = 150;
  const paddingX = 35;
  const paddingY = 20;

  let pointsStr = '';
  const graphPoints: { x: number; y: number; score: number; stamp: string }[] = [];

  if (lastEntries.length > 1) {
    const stepX = (width - paddingX * 2) / (lastEntries.length - 1);
    lastEntries.forEach((entry, i) => {
      const x = paddingX + i * stepX;
      // Score maps 1..5. Map score 5 to top (paddingY), map score 1 to bottom (height - paddingY)
      const ratio = (entry.score - 1) / 4; // 0..1
      const y = height - paddingY - ratio * (height - paddingY * 2);
      graphPoints.push({ x, y, score: entry.score, stamp: entry.timestamp });
    });
    pointsStr = graphPoints.map(p => `${p.x},${p.y}`).join(' ');
  }

  return (
    <div id="analytics-master" className="space-y-6">
      
      {/* Visual Banners / Streak Milestones Counter Grid */}
      <div id="badge-counters-grid" className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Active Session Streak */}
        <div id="grid-cell-active-streak" className="bg-white border border-stone-100 rounded-3xl p-5 flex items-center space-x-4 shadow-sm">
          <div className="p-3 bg-amber-50 rounded-2xl">
            <Flame className="w-6 h-6 text-amber-500 fill-amber-500" />
          </div>
          <div>
            <span id="streak-num" className="block text-2xl font-mono font-bold text-stone-900">
              {stats.currentStreak} {stats.currentStreak === 1 ? 'Day' : 'Days'}
            </span>
            <span className="text-[11px] text-stone-400 font-medium uppercase tracking-wider block">
              Active Self-Care Streak
            </span>
          </div>
        </div>

        {/* Longest/High-Water streak */}
        <div id="grid-cell-longest-streak" className="bg-white border border-stone-100 rounded-3xl p-5 flex items-center space-x-4 shadow-sm">
          <div className="p-3 bg-teal-50 rounded-2xl">
            <TrendingUp className="w-6 h-6 text-teal-600" />
          </div>
          <div>
            <span className="block text-2xl font-mono font-bold text-stone-900">
              {stats.longestStreak} Days
            </span>
            <span className="text-[11px] text-stone-400 font-medium uppercase tracking-wider block">
              Longest Consistency Streak
            </span>
          </div>
        </div>

        {/* Total Habit logs */}
        <div id="grid-cell-total-logs" className="bg-white border border-stone-100 rounded-3xl p-5 flex items-center space-x-4 shadow-sm">
          <div className="p-3 bg-stone-50 rounded-2xl">
            <CalendarDays className="w-6 h-6 text-stone-500" />
          </div>
          <div>
            <span className="block text-2xl font-mono font-bold text-stone-900">
              {stats.totalLogs} Logs
            </span>
            <span className="text-[11px] text-stone-400 font-medium uppercase tracking-wider block">
              Cumulative Logs Created
            </span>
          </div>
        </div>
      </div>

      {/* SVG-based Mood Trend Graph */}
      <div id="custom-trend-graph" className="bg-white border border-stone-100 rounded-3xl p-6 shadow-sm">
        <h4 className="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-4 flex items-center space-x-1.5">
          <Calendar className="w-4 h-4 text-stone-400" />
          <span>Somatic Mood Trend Track (Past Logs)</span>
        </h4>

        {lastEntries.length <= 1 ? (
          <div id="no-graph-prompt" className="h-36 flex items-center justify-center border-2 border-dashed border-stone-100 rounded-2xl text-xs text-stone-400 font-medium">
            A linear trend line generates automatically after adding 2 or more daily moods. Check in below!
          </div>
        ) : (
          <div id="svg-graph-container" className="overflow-x-auto">
            <svg viewBox={`0 0 ${width} ${height}`} className="mx-auto w-full max-w-lg select-none">
              <defs>
                <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="#fcfbf9" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* horizontal guides */}
              {[1, 3, 5].map((s) => {
                const ratio = (s - 1) / 4;
                const hY = height - paddingY - ratio * (height - paddingY * 2);
                return (
                  <g key={s} className="opacity-40">
                    <line
                      x1={0}
                      y1={hY}
                      x2={width}
                      y2={hY}
                      stroke="#e2e8f0"
                      strokeDasharray="4,4"
                      strokeWidth={1}
                    />
                    <text
                      x={8}
                      y={hY + 3}
                      fontSize="8"
                      className="fill-stone-400 font-mono"
                    >
                      {getEmojiForScore(s)}
                    </text>
                  </g>
                );
              })}

              {/* area beneath curve */}
              {graphPoints.length > 0 && (
                <path
                  d={`M ${paddingX} ${height - paddingY} L ${pointsStr} L ${graphPoints[graphPoints.length - 1].x} ${height - paddingY} Z`}
                  fill="url(#grad)"
                />
              )}

              {/* Trend line */}
              <polyline
                fill="none"
                stroke="#0d9488"
                strokeWidth="2.5"
                points={pointsStr}
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Interactive nodes */}
              {graphPoints.map((point, index) => (
                <g key={index}>
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r="4.5"
                    className="fill-stone-900 stroke-white stroke-2 cursor-pointer hover:scale-110 transition-transform"
                    title={`Mood: ${point.score}`}
                  />
                  <text
                    x={point.x}
                    y={point.y - 8}
                    fontSize="8"
                    textAnchor="middle"
                    className="fill-stone-600 font-mono font-bold"
                  >
                    {point.score}
                  </text>
                </g>
              ))}
            </svg>
            <div id="graph-legend" className="flex items-center justify-between text-[9px] font-mono text-stone-400 px-8 mt-2 uppercase tracking-wide">
              <span>Oldest Check-In Log</span>
              <span>Latest checked mood ({getEmojiForScore(moods[0]?.score || 0)} Level {moods[0]?.score || 0})</span>
            </div>
          </div>
        )}
      </div>

      {/* Stress triggers stats panel and historic logs list */}
      <div id="trigger-frequencies-split" className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Trigger Freq Table */}
        <div id="table-triggers-box" className="bg-white border border-stone-100 rounded-3xl p-6 shadow-sm">
          <h4 className="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-4 flex items-center space-x-1.5">
            <AlertCircle className="w-4 h-4 text-stone-400" />
            <span>Recurring Stress Triggers Analysis</span>
          </h4>

          {freqList.length === 0 ? (
            <p className="text-xs text-stone-400 font-medium italic py-6 text-center">No stress triggers mapped. Enter daily logs to locate recurrent pressure spots.</p>
          ) : (
            <div id="table-triggers" className="space-y-4">
              {freqList.slice(0, 6).map((item, idx) => (
                <div id={`trigger-freq-${item.tagId}`} key={item.tagId} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-stone-700">{idx + 1}. {item.label}</span>
                    <span className="font-mono text-stone-400 font-semibold">{item.count} times logged</span>
                  </div>
                  {/* Percentage bar */}
                  <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      id={`bar-${item.tagId}`}
                      className="bg-amber-500 h-full rounded-full"
                      style={{ width: `${Math.min(100, item.percentage || 10)}%` }}
                    />
                  </div>
                </div>
              ))}
              <p className="text-[10px] text-stone-400 leading-normal italic pt-2 border-t border-stone-50">Understanding triggers allows rule recommendations to supply customized study-break offsets automatically.</p>
            </div>
          )}
        </div>

        {/* Narrative cumulative summary */}
        <div id="story-narrative-box" className="bg-white border border-stone-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div id="story-narrative">
            <h4 className="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-3 flex items-center space-x-1.5">
              <Quote className="w-4 h-4 text-stone-400" />
              <span>Your Cumulative Wellness Summary</span>
            </h4>
            
            <div className="space-y-3 mt-4 text-xs sm:text-sm text-stone-600 leading-relaxed font-sans">
              <p>
                As you actively navigate this competitive syllabus season, you logged 
                <strong> {stats.selfCareDays.length} separate calendar days</strong> of mindful self-care.
              </p>
              
              {moods.length > 0 ? (
                <p>
                  Your current mental state is typically centered around level 
                  <strong> {Math.round((moods.reduce((acc, m) => acc + m.score, 0) / moods.length) * 10) / 10} out of 5</strong>. 
                  {freqList[0] && (
                    <span> Feedback notes suggest <strong>"{freqList[0].label}"</strong> is a frequent source of distraction or anxiety. Try targeting this during mandated breaks using Pomodoro breath guides.</span>
                  )}
                </p>
              ) : (
                <p>Add mood checkpoints to feed the narrative engine with secure feedback reflections on test prep, sleep, and comparison anxiety.</p>
              )}
            </div>
          </div>

          <div id="badge-seal" className="mt-6 pt-4 border-t border-stone-100 flex items-center space-x-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100 animate-pulse" />
            <span className="text-[10.5px] text-stone-400 uppercase font-mono font-bold tracking-widest">Aasha Offline-Core Secure Connection</span>
          </div>
        </div>

      </div>
    </div>
  );
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TriggerTag, MoodEntry } from '../types';
import { Check, Plus, AlertCircle } from 'lucide-react';

interface MoodCheckInProps {
  onCheckIn: (entry: Omit<MoodEntry, 'id' | 'timestamp'>) => void;
  availableTriggers: TriggerTag[];
  onAddCustomTrigger: (label: string) => TriggerTag;
  translations: any;
}

export const MoodCheckIn: React.FC<MoodCheckInProps> = ({
  onCheckIn,
  availableTriggers,
  onAddCustomTrigger,
  translations
}) => {
  const [score, setScore] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const [customTagInput, setCustomTagInput] = useState('');
  const [errorText, setErrorText] = useState('');
  const [successChecked, setSuccessChecked] = useState(false);

  const toggleTrigger = (id: string) => {
    setSelectedTriggers(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const handleAddCustomTrigger = () => {
    const trimmed = customTagInput.trim();
    if (!trimmed) return;
    if (trimmed.length > 25) {
      setErrorText("Trigger text must be under 25 chars.");
      return;
    }
    
    // Add custom tag to parent
    const newTag = onAddCustomTrigger(trimmed);
    // Pre-select new tag automatically
    if (!selectedTriggers.includes(newTag.id)) {
      setSelectedTriggers(prev => [...prev, newTag.id]);
    }
    setCustomTagInput('');
    setErrorText('');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onCheckIn({
      score,
      note: note.trim() || undefined,
      triggerTags: selectedTriggers
    });

    // Reset layout input state
    setNote('');
    setSelectedTriggers([]);
    setSuccessChecked(true);
    setTimeout(() => {
      setSuccessChecked(false);
    }, 2500);
  };

  const moodLevels = [
    { score: 1 as const, emoji: "🥺", label: "Very Low", color: "border-red-200 hover:border-red-400 bg-red-50/20 text-red-700" },
    { score: 2 as const, emoji: "😟", label: "Low", color: "border-orange-200 hover:border-orange-400 bg-orange-50/20 text-orange-700" },
    { score: 3 as const, emoji: "😐", label: "Normal/Unbiased", color: "border-amber-200 hover:border-amber-400 bg-amber-50/20 text-amber-700" },
    { score: 4 as const, emoji: "🙂", label: "Good/Sustained", color: "border-teal-200 hover:border-teal-400 bg-teal-50/20 text-teal-700" },
    { score: 5 as const, emoji: "🌟", label: "Stellar/Confident", color: "border-emerald-200 hover:border-emerald-400 bg-emerald-50/20 text-emerald-700" }
  ];

  return (
    <div id="checkin-container" className="bg-white border border-stone-100 rounded-3xl p-6 shadow-md shadow-stone-100/50">
      <div id="checkin-header" className="flex items-center justify-between mb-4">
        <h2 id="checkin-title" className="text-xl font-display font-medium tracking-tight text-stone-900">
          {translations.checkInTitle}
        </h2>
        <span id="speedy-indicator" className="text-[10px] font-mono uppercase bg-emerald-50 text-emerald-600 px-2 py-1 rounded-full font-bold">
          ⚡ Quick 10-Sec Check
        </span>
      </div>

      <form id="checkin-form" onSubmit={handleSave} className="space-y-6">
        {/* Mood Selection Row */}
        <div>
          <label id="lbl-mood-question" className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">
            {translations.moodQuestion}
          </label>
          <div className="grid grid-cols-5 gap-2">
            {moodLevels.map((ml) => (
              <button
                id={`mood-option-${ml.score}`}
                key={ml.score}
                type="button"
                onClick={() => setScore(ml.score)}
                className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl border cursor-pointer transition-all ${
                  score === ml.score
                    ? 'border-teal-500 bg-teal-50/30 scale-102 ring-2 ring-teal-400/20 text-teal-950 font-bold'
                    : 'border-stone-100 bg-stone-50/40 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <span className="text-2xl sm:text-3xl mb-1.5">{ml.emoji}</span>
                <span className="text-[10px] text-center leading-tight">{ml.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Triggers Selectors */}
        <div>
          <label id="lbl-triggers" className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
            {translations.triggersTitle}
          </label>
          
          <div id="trigger-grid" className="flex flex-wrap gap-2 mb-3">
            {availableTriggers.map((tag) => {
              const checked = selectedTriggers.includes(tag.id);
              return (
                <button
                  id={`trigger-tag-${tag.id}`}
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTrigger(tag.id)}
                  className={`text-xs px-3 py-2 rounded-xl border cursor-pointer flex items-center space-x-1.5 transition-all ${
                    checked
                      ? 'bg-teal-600 border-teal-600 text-white shadow-sm'
                      : 'bg-stone-50/80 hover:bg-stone-100 border-stone-200/60 text-stone-600'
                  }`}
                >
                  <span>{tag.label}</span>
                  {checked && <Check className="w-3.5 h-3.5 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Quick custom trigger adding input */}
          <div id="custom-add-container" className="flex items-center space-x-2 mt-3">
            <input
              id="input-custom-tag"
              type="text"
              placeholder="+ Add any other custom stress factors..."
              value={customTagInput}
              onChange={(e) => setCustomTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddCustomTrigger();
                }
              }}
              className="flex-1 bg-stone-50 border border-stone-200/80 rounded-xl px-3 py-2 text-xs text-stone-700 focus:outline-none focus:ring-1 focus:ring-teal-400"
            />
            <button
              id="btn-add-custom-tag"
              type="button"
              onClick={handleAddCustomTrigger}
              className="p-2.5 bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-600 rounded-xl cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          {errorText && (
            <div id="trigger-err" className="flex items-center space-x-1 mt-1 text-red-500 text-[11px]">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errorText}</span>
            </div>
          )}
        </div>

        {/* Note textarea */}
        <div>
          <label id="lbl-note-checkin" className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">
            {translations.noteLabel}
          </label>
          <textarea
            id="text-note-checkin"
            rows={2}
            placeholder="e.g. Backlog in Physics Kinematics is building stress..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-4 py-3 text-xs text-stone-700 focus:outline-none focus:ring-1 focus:ring-teal-400"
          />
        </div>

        {/* Form controls */}
        <div id="form-ctrl" className="flex items-center justify-between pt-2">
          {successChecked ? (
            <div id="check-alert-success" className="text-emerald-600 text-xs font-medium flex items-center space-x-1 bg-emerald-50 px-3 py-1.5 rounded-full">
              <Check className="w-4 h-4" />
              <span>Checked in! Recommendation board updated underneath.</span>
            </div>
          ) : (
            <span className="text-[10px] text-stone-400">All responses stay securely locally.</span>
          )}
          
          <button
            id="btn-checkin-submit"
            type="submit"
            className="bg-stone-900 hover:bg-stone-800 text-stone-50 text-xs font-medium px-6 py-3 rounded-xl cursor-pointer transition shadow hover:shadow-md"
          >
            {translations.submitButton}
          </button>
        </div>
      </form>
    </div>
  );
};

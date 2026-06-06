/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TARGET_EXAMS, OTHER_EXAMS_CATEGORIES, ExamInfo } from '../data/exams';
import { UserProfile } from '../types';
import { ArrowRight, Sparkles, Check, Info } from 'lucide-react';

interface OnboardingProps {
  onComplete: (profile: UserProfile, initialMoodScore?: 1 | 2 | 3 | 4 | 5) => void;
  currentLang: 'en' | 'hi';
  onLangChange: (lang: 'en' | 'hi') => void;
  translations: any;
}

export const Onboarding: React.FC<OnboardingProps> = ({
  onComplete,
  currentLang,
  onLangChange,
  translations
}) => {
  const [selectedExams, setSelectedExams] = useState<string[]>([]);
  const [examDate, setExamDate] = useState<string>('');
  const [customGoals, setCustomGoals] = useState<string[]>([]);
  const [goalInput, setGoalInput] = useState('');
  const [baselineMood, setBaselineMood] = useState<1 | 2 | 3 | 4 | 5>(3);

  const goalPresets = [
    "Prioritize continuous 7hr sleep",
    "Limit negative peer score chats",
    "Identify panic cues early",
    "Complete one deep-breathe daily"
  ];

  const toggleExam = (code: string) => {
    setSelectedExams(prev =>
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    );
  };

  const togglePresetGoal = (goal: string) => {
    setCustomGoals(prev =>
      prev.includes(goal) ? prev.filter(g => g !== goal) : [...prev, goal]
    );
  };

  const addCustomGoal = () => {
    if (goalInput.trim() && !customGoals.includes(goalInput.trim())) {
      setCustomGoals(prev => [...prev, goalInput.trim()]);
      setGoalInput('');
    }
  };

  const handleSubmit = () => {
    const profile: UserProfile = {
      id: `user-${Date.now()}`,
      exams: selectedExams,
      examDate: examDate || undefined,
      goals: customGoals,
      preferredLanguage: currentLang,
      dataSharingOptIn: false
    };
    onComplete(profile, baselineMood);
  };

  const handleSkip = () => {
    const defaultProfile: UserProfile = {
      id: `user-${Date.now()}`,
      exams: [],
      preferredLanguage: currentLang,
      dataSharingOptIn: false
    };
    onComplete(defaultProfile);
  };

  return (
    <div id="onboarding-root" className="max-w-2xl mx-auto my-6 sm:my-10 bg-white border border-stone-100 rounded-3xl shadow-xl shadow-stone-100/50 p-6 sm:p-10 transition-transform">
      <div id="onboarding-header" className="text-center mb-8">
        <div id="badge" className="inline-flex items-center space-x-1 px-3 py-1 bg-stone-50 text-stone-600 rounded-full text-xs font-mono tracking-wider mb-4 border border-stone-100">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>OFFLINE-FIRST COMPASS</span>
        </div>
        
        <h1 id="onboarding-title" className="text-3xl font-display font-medium tracking-tight text-stone-900">
          {translations.onboardingTitle}
        </h1>
        <p id="onboarding-subtitle" className="mt-4 text-stone-500 font-sans leading-relaxed text-sm max-w-lg mx-auto">
          {translations.onboardingDesc}
        </p>
      </div>

      {/* Language Section in Onboard */}
      <div id="lang-section" className="mb-8 border-b border-stone-100 pb-6">
        <label id="lbl-lang" className="block text-xs font-mono tracking-wider text-stone-400 uppercase mb-3 text-center">
          {translations.languageSelectLabel}
        </label>
        <div className="flex justify-center space-x-4">
          <button
            id="lang-opt-en"
            onClick={() => onLangChange('en')}
            className={`px-5 py-2.5 rounded-2xl cursor-pointer text-sm font-medium transition-all ${
              currentLang === 'en'
                ? 'bg-stone-900 text-white shadow-md'
                : 'bg-stone-50 hover:bg-stone-100 text-stone-600 border border-stone-200/50'
            }`}
          >
            English (Full Interface)
          </button>
          <button
            id="lang-opt-hi"
            onClick={() => onLangChange('hi')}
            className={`px-5 py-2.5 rounded-2xl cursor-pointer text-sm font-medium transition-all ${
              currentLang === 'hi'
                ? 'bg-stone-900 text-white shadow-md'
                : 'bg-stone-50 hover:bg-stone-100 text-stone-600 border border-stone-200/50'
            }`}
          >
            हिंदी (इंटरफ़ेस अनुदित)
          </button>
        </div>
      </div>

      {/* Target Exams Section */}
      <div id="exams-section" className="mb-8 border-b border-stone-100 pb-6">
        <label id="lbl-exams" className="block text-xs font-mono tracking-wider text-stone-400 uppercase mb-3">
          {translations.examSelectLabel}
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-2 pb-2">
          {TARGET_EXAMS.map(exam => {
            const isSelected = selectedExams.includes(exam.code);
            return (
              <button
                id={`exam-btn-${exam.code}`}
                key={exam.code}
                onClick={() => toggleExam(exam.code)}
                className={`flex flex-col items-start text-left p-3 rounded-2xl cursor-pointer border text-xs sm:text-sm tracking-tight transition-all ${
                  isSelected
                    ? 'border-teal-500 bg-teal-50/20 text-teal-950'
                    : 'border-stone-200/60 bg-white text-stone-600 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center space-x-2 w-full justify-between">
                  <span className="font-semibold text-stone-900">{exam.name}</span>
                  {isSelected && <span className="bg-teal-500 text-white rounded-full p-0.5"><Check className="w-3 h-3" /></span>}
                </div>
                <span className="text-stone-400 text-[10px] mt-0.5">{exam.fullName} ({exam.body})</span>
                <span className="text-stone-500 text-[10px] mt-1 italic block">{exam.season}</span>
              </button>
            );
          })}
        </div>

        {/* Other Categories Selection List */}
        <div id="other-exams-grid" className="mt-4">
          <span className="text-xs text-stone-400 font-medium block mb-2">Other Entrance / State Level Options:</span>
          <div className="flex flex-wrap gap-2">
            {OTHER_EXAMS_CATEGORIES.map(name => {
              const matchesSelected = selectedExams.includes(name);
              return (
                <button
                  id={`other-exam-${name}`}
                  key={name}
                  onClick={() => toggleExam(name)}
                  className={`text-[11px] px-2.5 py-1.5 rounded-full border cursor-pointer transition-all ${
                    matchesSelected 
                      ? 'bg-teal-500 text-white border-teal-500' 
                      : 'bg-stone-50 text-stone-600 hover:bg-stone-100 border-stone-200'
                  }`}
                >
                  {name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Target Exam Date */}
      <div id="exam-date-section" className="mb-8 border-b border-stone-100 pb-6">
        <label id="lbl-exam-date" className="block text-xs font-mono tracking-wider text-stone-400 uppercase mb-2">
          Target Exam / Result Date (Optional)
        </label>
        <input
          id="input-exam-date"
          type="date"
          value={examDate}
          onChange={(e) => setExamDate(e.target.value)}
          className="w-full text-stone-700 bg-stone-50 border border-stone-200/80 rounded-2xl px-4 py-3 text-sm focus:ring-1 focus:ring-teal-400 focus:outline-none"
        />
        <p className="text-[11px] text-stone-400 mt-1">We utilize this to structure gentle affirmations relative to your milestone proximity without any notification alerts.</p>
      </div>

      {/* Baseline Goals Section */}
      <div id="goals-section" className="mb-8 border-b border-stone-100 pb-6">
        <label id="lbl-goals" className="block text-xs font-mono tracking-wider text-stone-400 uppercase mb-3">
          Identify Personal Wellness Goals
        </label>
        <div className="flex flex-wrap gap-2 mb-3">
          {goalPresets.map(preset => {
            const hasChecked = customGoals.includes(preset);
            return (
              <button
                id={`preset-goal-${preset}`}
                key={preset}
                onClick={() => togglePresetGoal(preset)}
                className={`text-xs px-3 py-1.5 rounded-full border cursor-pointer transition-all ${
                  hasChecked
                    ? 'bg-stone-800 text-stone-50 border-stone-850'
                    : 'bg-stone-50 text-stone-500 hover:bg-stone-100 border-stone-200/50'
                }`}
              >
                {preset}
              </button>
            );
          })}
        </div>
        
        <div id="custom-goal-box" className="flex space-x-2">
          <input
            id="input-custom-goal"
            type="text"
            placeholder="Add custom study-wellness goal..."
            value={goalInput}
            onChange={(e) => setGoalInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addCustomGoal()}
            className="flex-1 bg-stone-50 border border-stone-200 rounded-2xl px-4 py-2.5 text-xs text-stone-700 focus:outline-none focus:ring-1 focus:ring-teal-400"
          />
          <button
            id="btn-add-goal"
            onClick={addCustomGoal}
            className="bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium text-xs px-4 rounded-2xl cursor-pointer"
          >
            Add
          </button>
        </div>
      </div>

      {/* Baseline Mood Rating */}
      <div id="baseline-mood-section" className="mb-10 text-center">
        <label id="lbl-baseline" className="block text-xs font-mono tracking-wider text-stone-400 uppercase mb-4">
          {translations.baselineMoodLabel}
        </label>
        <div className="flex justify-center space-x-3 sm:space-x-5">
          {([
            { val: 1, label: "Heavy 🥺" },
            { val: 2, label: "Tense 😟" },
            { val: 3, label: "Calm 😐" },
            { val: 4, label: "Level 🙂" },
            { val: 5, label: "Stellar 🌟" }
          ] as const).map(({ val, label }) => (
            <button
              id={`baseline-mood-${val}`}
              key={val}
              onClick={() => setBaselineMood(val)}
              className={`flex-1 text-center py-3 px-1 rounded-2xl cursor-pointer border transition-all text-xs sm:text-sm font-medium ${
                baselineMood === val
                  ? 'bg-amber-500/10 border-amber-500 text-stone-900 font-semibold'
                  : 'border-stone-100 bg-stone-50 text-stone-500 hover:border-stone-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Decision Keys */}
      <div id="action-keys" className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-stone-50">
        <button
          id="btn-onboarding-skip"
          onClick={handleSkip}
          className="w-full sm:w-auto text-stone-400 hover:text-stone-600 text-xs font-medium cursor-pointer py-2 px-1 text-center"
        >
          {translations.skipButton}
        </button>
        
        <button
          id="btn-onboarding-submit"
          onClick={handleSubmit}
          className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-teal-600 hover:bg-teal-700 text-white font-medium px-8 py-3.5 rounded-full cursor-pointer transition shadow-md shadow-teal-600/10"
        >
          <span>{translations.saveButton}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div id="onboarding-privacy" className="mt-8 flex items-start space-x-2 bg-stone-50 rounded-2xl p-4 text-left border border-stone-200/40">
        <Info className="w-5 h-5 text-stone-400 shrink-0 mt-0.5" />
        <div className="text-[11px] text-stone-500 leading-relaxed font-sans">
          <strong>Privacy by Design Mandate:</strong> Student data is stored in the browser client compartment (<span className="font-mono text-[10px]">localStorage</span>). No email trackers, third-party analytics telemetry, or social tokens are shared outward.
        </div>
      </div>
    </div>
  );
};

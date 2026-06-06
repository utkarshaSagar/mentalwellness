/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Clock, Play, Pause, RotateCcw, AlertCircle, Coffee, CheckCircle, Flame } from 'lucide-react';

interface TimerProps {
  latestMoodScore: number | null; // 1 to 5, or null if no logs yet
  translations: any;
}

export const Timer: React.FC<TimerProps> = ({ latestMoodScore, translations }) => {
  const [sessionMode, setSessionMode] = useState<'study' | 'break'>('study');
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes default study
  const [isRunning, setIsRunning] = useState(false);
  const [presetStudyMins, setPresetStudyMins] = useState(25);
  const [presetsCount, setPresetsCount] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Dynamic short break calculation based on checked mood score
  // If baseline mood is Low (<= 2), give them a generous 10-minute restorative break!
  // Else, a standard 5-minute breather is pre-set.
  const isGenerousBreakNeeded = latestMoodScore !== null && latestMoodScore <= 2;
  const breakDurationMins = isGenerousBreakNeeded ? 10 : 5;

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSessionComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, sessionMode, latestMoodScore]);

  // Adjust timers if user's mood shifts during their study sequence
  useEffect(() => {
    if (!isRunning && sessionMode === 'break') {
      setTimeLeft(breakDurationMins * 60);
    }
  }, [latestMoodScore, sessionMode]);

  const handleSessionComplete = () => {
    setIsRunning(false);
    if (sessionMode === 'study') {
      setSessionMode('break');
      setTimeLeft(breakDurationMins * 60);
      setPresetsCount(p => p + 1);
    } else {
      setSessionMode('study');
      setTimeLeft(presetStudyMins * 60);
    }
    // Simple custom audio/frequency beep can be omitted or triggered safely
  };

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    if (sessionMode === 'study') {
      setTimeLeft(presetStudyMins * 60);
    } else {
      setTimeLeft(breakDurationMins * 60);
    }
  };

  const handleSkip = () => {
    setIsRunning(false);
    if (sessionMode === 'study') {
      setSessionMode('break');
      setTimeLeft(breakDurationMins * 60);
    } else {
      setSessionMode('study');
      setTimeLeft(presetStudyMins * 60);
    }
  };

  const setStudyModeDirectly = (mins: number) => {
    setIsRunning(false);
    setSessionMode('study');
    setPresetStudyMins(mins);
    setTimeLeft(mins * 60);
  };

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  return (
    <div id="pomodoro-timer-card" className="bg-white border border-stone-100 rounded-3xl p-6 shadow-md shadow-stone-100/50">
      <div id="timer-header" className="flex items-center justify-between mb-4 pb-2 border-b border-stone-50">
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-teal-600" />
          <h3 className="font-display font-medium text-stone-900 text-lg">
            {translations.timerTitle}
          </h3>
        </div>
        {sessionMode === 'study' ? (
          <span className="text-[10px] font-mono tracking-wider text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full font-bold">
            FOCUS CONCENTRATION
          </span>
        ) : (
          <span className="text-[10px] font-mono tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full font-bold">
            REST & RE-ANCHOR Break
          </span>
        )}
      </div>

      {sessionMode === 'study' ? (
        <p className="text-xs text-stone-500 leading-relaxed mb-6">
          Study with absolute presence for {presetStudyMins} minutes. Avoid checking percentiles, test ranks, or syllabus guides. Focus raw.
        </p>
      ) : (
        <div id="break-alert-gui" className="p-3 mb-6 bg-amber-50/70 border border-amber-200/80 rounded-2xl flex items-start space-x-2.5 text-left">
          <Coffee className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
          <div className="text-[11px] leading-relaxed text-stone-600">
            <strong>Mandated Calm Breather:</strong> {isGenerousBreakNeeded ? (
              <span>Your checked mood is Low (<span className="font-semibold text-amber-700">Level {latestMoodScore}</span>). We have automatically upgraded your rest block to <span className="font-bold text-amber-700">10 mins</span>. Complete a box breathing exercise now!</span>
            ) : (
              <span>Standard <span className="font-bold text-emerald-700">5-minute</span> breather active. Roll your head, drink warm water, do not touch competitive books during rest.</span>
            )}
          </div>
        </div>
      )}

      {/* Preset study selectors */}
      {sessionMode === 'study' && (
        <div id="preset-selectors" className="flex justify-center space-x-2 mb-6">
          {([15, 25, 45] as const).map((mins) => (
            <button
              id={`preset-study-${mins}`}
              key={mins}
              onClick={() => setStudyModeDirectly(mins)}
              disabled={isRunning}
              className={`text-xs px-3 py-1.5 rounded-full border cursor-pointer transition-all ${
                presetStudyMins === mins
                  ? 'bg-stone-900 border-stone-900 text-stone-50 font-bold'
                  : 'bg-stone-50 hover:bg-stone-100 text-stone-500 border-stone-200/50'
              }`}
            >
              {mins} Mins Study
            </button>
          ))}
        </div>
      )}

      {/* Main Countdown Watch Face */}
      <div id="countdown-watch-face" className="text-center my-6">
        <div className="inline-block relative">
          {/* Animated pulsing outer border */}
          <div className={`absolute -inset-2.5 rounded-full opacity-10 transition-all ${
            isRunning ? (sessionMode === 'study' ? 'bg-amber-500 scale-102 animate-pulse' : 'bg-emerald-500 scale-102 animate-pulse') : 'bg-transparent'
          }`} />
          
          <div
            id="watch-numbers"
            className="w-48 h-48 rounded-full border-4 border-stone-100 bg-stone-50/20 flex flex-col items-center justify-center font-mono font-bold text-4xl text-stone-900 shadow-inner"
          >
            <span>{formatTime(timeLeft)}</span>
            <span className="text-[10px] font-sans font-medium text-stone-400 capitalize tracking-widest mt-1">
              {sessionMode} active
            </span>
          </div>
        </div>
      </div>

      {/* Streak-like counters in timer */}
      <div id="preset-count-meter" className="flex items-center justify-center space-x-1.5 text-xs text-stone-500 mb-6 font-medium">
        <Flame className="w-4 h-4 text-orange-500" />
        <span>Completed Study Sessions Block: <strong className="font-mono">{presetsCount}</strong></span>
      </div>

      {/* Controllers panel */}
      <div id="timer-controllers" className="flex items-center justify-center space-x-3">
        <button
          id="btn-timer-reset"
          onClick={handleReset}
          className="p-3 bg-stone-50 hover:bg-stone-100 border border-stone-200/60 rounded-xl cursor-pointer text-stone-500 transition-colors"
          title="Reset timer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          id="btn-timer-toggle"
          onClick={handleStartPause}
          className={`px-8 py-3 rounded-full text-xs font-semibold tracking-wide cursor-pointer flex items-center space-x-2 shadow transition-transform ${
            isRunning
              ? 'bg-amber-100 hover:bg-amber-200 text-amber-800'
              : 'bg-stone-900 hover:bg-stone-800 text-stone-50'
          }`}
        >
          {isRunning ? (
            <>
              <Pause className="w-4 h-4" />
              <span>Pause Timer</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              <span>Resume Study Session</span>
            </>
          )}
        </button>

        <button
          id="btn-timer-skip"
          onClick={handleSkip}
          className="p-3 bg-stone-50 hover:bg-stone-100 border border-stone-200/60 rounded-xl cursor-pointer text-stone-400 transition-colors"
          title="Skip to next segment"
        >
          <CheckCircle className="w-4 h-4 text-stone-500" />
        </button>
      </div>

      <p className="text-[10px] text-stone-400 mt-6 leading-relaxed">
        {translations.breaksActive}
      </p>
    </div>
  );
};

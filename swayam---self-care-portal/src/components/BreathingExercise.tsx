/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Wind, Play, Square, RefreshCw, VolumeX, ShieldAlert } from 'lucide-react';

interface BreathingExerciseProps {
  translations: any;
}

type BreathePhase = 'inhale' | 'hold1' | 'exhale' | 'hold2';

export const BreathingExercise: React.FC<BreathingExerciseProps> = ({ translations }) => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<BreathePhase>('inhale');
  const [secondsLeft, setSecondsLeft] = useState(4);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            // Switch phrase
            setPhase((currPhase) => {
              switch (currPhase) {
                case 'inhale':
                  return 'hold1';
                case 'hold1':
                  return 'exhale';
                case 'exhale':
                  return 'hold2';
                case 'hold2':
                  setCyclesCompleted(c => c + 1);
                  return 'inhale';
                default:
                  return 'inhale';
              }
            });
            return 4; // Reset phase stopwatch to 4 seconds
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isActive]);

  const handleStartStop = () => {
    if (isActive) {
      setIsActive(false);
      setSecondsLeft(4);
      setPhase('inhale');
    } else {
      setIsActive(true);
      setSecondsLeft(4);
      setPhase('inhale');
    }
  };

  const handleReset = () => {
    setIsActive(false);
    setSecondsLeft(4);
    setPhase('inhale');
    setCyclesCompleted(0);
  };

  const getPhaseData = (p: BreathePhase) => {
    switch (p) {
      case 'inhale':
        return {
          title: "Inhale Slowly 🌬️",
          desc: "Fill your lungs, expand your diaphragm",
          color: "bg-teal-500",
          ringColor: "border-teal-400",
          bubbleClass: "scale-110 duration-4000"
        };
      case 'hold1':
        return {
          title: "Hold Breathing ⚓",
          desc: "Retain the fresh oxygen with a relaxed chest",
          color: "bg-blue-500",
          ringColor: "border-blue-400",
          bubbleClass: "scale-110 duration-1000"
        };
      case 'exhale':
        return {
          title: "Exhale Slowly 💨",
          desc: "Release all mental blocks, let your shoulders drop",
          color: "bg-amber-500",
          ringColor: "border-amber-400",
          bubbleClass: "scale-90 duration-4000"
        };
      case 'hold2':
        return {
          title: "Hold & Empty 🧘",
          desc: "Rest in the still space before the next breath",
          color: "bg-stone-600",
          ringColor: "border-stone-500",
          bubbleClass: "scale-90 duration-1000"
        };
    }
  };

  const currentInfo = getPhaseData(phase);

  return (
    <div id="breathing-card" className="bg-white border border-stone-100 rounded-3xl p-6 shadow-md shadow-stone-100/50 text-center">
      <div id="breathing-header" className="flex items-center justify-between mb-4 text-left border-b border-stone-50 pb-2">
        <div className="flex items-center space-x-2">
          <Wind className="w-5 h-5 text-teal-500" />
          <h3 className="font-display font-medium text-stone-900 text-lg">
            {translations.breathingTitle}
          </h3>
        </div>
        <span className="text-[10px] font-mono bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full font-bold">
          PRANAYAMA BOX
        </span>
      </div>

      <p className="text-xs text-stone-500 max-w-sm mx-auto mb-6">
        Designed to lower sympathetic nervous activity instantly. Adopt a straight spine, relax your eyes, and mirror the expanding beacon.
      </p>

      {/* Breathing Bubble Beacon */}
      <div id="breathing-beacon-container" className="relative my-8 flex items-center justify-center h-48">
        
        {/* Core Animated Bubble */}
        <div
          id="breathe-bubble"
          className={`absolute rounded-full w-32 h-32 flex flex-col items-center justify-center text-white transition-all ease-in-out font-display font-bold text-3xl shadow-xl shadow-stone-200/50 ${currentInfo.color} ${
            isActive ? currentInfo.bubbleClass : 'scale-95'
          }`}
        >
          {isActive ? secondsLeft : "4"}
          <span className="text-[9px] font-sans uppercase font-mono tracking-wider opacity-85 mt-1">
            {isActive ? "Seconds" : "Ready"}
          </span>
        </div>

        {/* Outer Halo Rings */}
        <div
          id="outer-halo"
          className={`absolute w-44 h-44 rounded-full border-2 border-dashed opacity-25 ${
            isActive ? 'animate-spin' : ''
          } ${currentInfo.ringColor}`}
          style={{ animationDuration: '24s' }}
        />
      </div>

      {/* Instruction Box */}
      <div id="instruction-box" className="h-16 mb-6">
        {isActive ? (
          <div id="breathe-active-hud">
            <h4 id="hud-title" className="text-sm font-semibold text-stone-950 font-display transition-all duration-300">
              {currentInfo.title}
            </h4>
            <p id="hud-desc" className="text-[11px] text-stone-400 mt-0.5">{currentInfo.desc}</p>
          </div>
        ) : (
          <div id="breathe-idle-hud">
            <h4 className="text-sm font-semibold text-stone-400">Ready to center?</h4>
            <p className="text-[11.5px] text-stone-400 italic mt-0.5">Press "Begin Breath Cycle" when comfortable.</p>
          </div>
        )}
      </div>

      {/* Indicators */}
      <div id="breathing-cycles-counter" className="mb-6 flex justify-center space-x-6">
        <div className="text-center">
          <span className="block text-xl font-mono font-bold text-stone-800">{cyclesCompleted}</span>
          <span className="text-[10px] text-stone-400 uppercase tracking-widest font-semibold block">Cycles Done</span>
        </div>
        <div className="text-center border-l border-stone-100 pl-6">
          <span className="block text-xl font-mono font-bold text-stone-800">{phase.toUpperCase()}</span>
          <span className="text-[10px] text-stone-400 uppercase tracking-widest font-semibold block">Active State</span>
        </div>
      </div>

      {/* Trigger Buttons */}
      <div id="breathing-controllers" className="flex items-center justify-center space-x-3">
        <button
          id="btn-start-breathe"
          onClick={handleStartStop}
          className={`px-5 py-2.5 rounded-full text-xs font-semibold flex items-center space-x-1.5 cursor-pointer transition-all ${
            isActive
              ? 'bg-red-50 hover:bg-red-100 text-red-600 border border-red-250'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
          }`}
        >
          {isActive ? (
            <>
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>Pause Session</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Begin Breath Cycle</span>
            </>
          )}
        </button>

        <button
          id="btn-reset-breathe"
          onClick={handleReset}
          className="p-2.5 bg-stone-50 hover:bg-stone-100 text-stone-500 rounded-full cursor-pointer border border-stone-200/50"
          title="Reset sequence stats"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div id="volume-indicator" className="mt-5 flex items-center justify-center space-x-1.5 text-[10px] text-stone-400">
        <VolumeX className="w-3.5 h-3.5" />
        <span>Eye-Safe visual mode. Guided entirely by light pulsing.</span>
      </div>
    </div>
  );
};

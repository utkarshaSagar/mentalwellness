/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Eye, HelpCircle, Heart, ShieldAlert, X, ChevronRight, ChevronLeft, RefreshCw } from 'lucide-react';

interface GroundingOverlayProps {
  onClose: () => void;
  translations: any;
}

export const GroundingOverlay: React.FC<GroundingOverlayProps> = ({ onClose, translations }) => {
  const [activeStep, setActiveStep] = useState<number>(5);

  const getStepContent = (step: number) => {
    switch (step) {
      case 5:
        return {
          title: "5 Things You Can See 👀",
          instruction: "Look around your study desk, room, or out of the window. Slow down your gaze. Acknowledge and name 5 distinct physical items.",
          prompt: "Identify: Your pen, the texture of your book, a shadow on the wall, the color of your desk...",
          bg: "bg-teal-50/40 border-teal-200"
        };
      case 4:
        return {
          title: "4 Things You Can Feel ✋",
          instruction: "Bring your mind back to the nerve endings of your skin. Tune into the physical signals supporting you right now.",
          prompt: "Identify: The hard wood backing of your chair, your feet pressing flat against the cold floor, the breeze from the fan on your temples, the weight of your pen.",
          bg: "bg-sky-50/40 border-sky-200"
        };
      case 3:
        return {
          title: "3 Things You Can Hear 👂",
          instruction: "Listen with absolute openness. Avoid categorizing sounds into distractions, just listen as waves of frequency.",
          prompt: "Identify: The hum of the computer, a distant passing vehicle, a sibling's voice, the rustling of draft paper.",
          bg: "bg-blue-50/40 border-blue-200"
        };
      case 2:
        return {
          title: "2 Things You Can Smell 👃",
          instruction: "Draw in a long, deep inhale through your nose. Savor the micro-scents that define your immediate protective environment.",
          prompt: "Identify: The dry wood scent of books, your soap, a cup of tea or coffee, the rain outdoors.",
          bg: "bg-amber-50/40 border-amber-200"
        };
      case 1:
        return {
          title: "1 Thing You Can Taste 👅",
          instruction: "Reflect on a single taste. This anchors the deep digestive nerve system.",
          prompt: "Identify: The mineral taste of a sip of water, or run your tongue along the roof of your mouth. Appreciate the simplicity of being alive right now.",
          bg: "bg-emerald-50/40 border-emerald-200"
        };
      default:
        return {
          title: "Grounding Complete ❤️",
          instruction: "Take a deep, full, slow breath. The physical world is still safe. Competitions do not define your core existence.",
          prompt: "You have completed the somatic anchors. Your body is with you.",
          bg: "bg-stone-50 border-stone-200"
        };
    }
  };

  const stepDetails = getStepContent(activeStep);

  const handleNext = () => {
    if (activeStep > 1) {
      setActiveStep(prev => prev - 1);
    } else {
      setActiveStep(0); // Complete
    }
  };

  const handlePrev = () => {
    if (activeStep === 0) {
      setActiveStep(1);
    } else if (activeStep < 5) {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleRestart = () => {
    setActiveStep(5);
  };

  return (
    <div id="grounding-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-md">
      <div
        id="grounding-modal-body"
        className="w-full max-w-lg bg-stone-50 border border-stone-200 rounded-3xl shadow-2xl p-6 sm:p-8 text-left relative focus:outline-none transition-transform scale-102"
      >
        <button
          id="btn-close-grounding"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-stone-200/50 hover:bg-stone-200 text-stone-600 rounded-full cursor-pointer transition-colors"
          title="Exit grounding overlay"
        >
          <X className="w-4 h-4" />
        </button>

        <div id="grounding-badge" className="inline-flex items-center space-x-1 px-2.5 py-1 bg-teal-50 border border-teal-100 text-teal-700 rounded-full text-[10px] font-mono uppercase font-bold tracking-wider mb-4">
          <Heart className="w-3.5 h-3.5 text-teal-600" />
          <span>Somatic Grounding Active</span>
        </div>

        <h3 id="grounding-title" className="text-xl sm:text-2xl font-display font-medium text-stone-900 tracking-tight">
          {translations.groundingAlert}
        </h3>
        <p id="grounding-subtitle" className="text-xs text-stone-400 mt-1 mb-6 leading-relaxed">
          The 5-4-3-2-1 Somatic Protocol is an clinically backed stress-coping method used to pull your conscious thoughts back from runaway anxiety cascades.
        </p>

        {/* Step Visual Board */}
        <div id="step-visual" className={`p-5 rounded-2xl border ${stepDetails.bg} transition-all duration-300`}>
          {activeStep > 0 ? (
            <div id="step-hud">
              <div id="step-bullet" className="text-[10px] font-mono text-stone-400 uppercase tracking-widest font-semibold mb-1">
                Visual Step {6 - activeStep} of 5
              </div>
              <h4 id="step-title" className="text-lg font-display font-semibold text-stone-900 mb-2">
                {stepDetails.title}
              </h4>
              <p id="step-instruction" className="text-xs text-stone-700 leading-relaxed font-sans font-medium">
                {stepDetails.instruction}
              </p>
              <div id="step-examples" className="mt-4 p-3 bg-white/70 border border-stone-100/50 rounded-xl text-[11px] text-stone-400 font-sans italic">
                {stepDetails.prompt}
              </div>
            </div>
          ) : (
            <div id="step-complete-hud" className="text-center py-4">
              <Eye className="w-12 h-12 text-teal-500 mx-auto mb-2" />
              <h4 className="text-lg font-display font-semibold text-stone-900 mb-2">
                Somatic Balance Restored
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed max-w-xs mx-auto">
                Excellent work. Remember: your worth is baseline constant, regardless of syllabus size or competitive mocks. You are in the present.
              </p>
            </div>
          )}
        </div>

        {/* Sensory indicators row */}
        {activeStep > 0 && (
          <div id="sensory-row" className="flex items-center justify-between mt-6">
            {[5, 4, 3, 2, 1].map((s) => (
              <div
                id={`sensory-dot-${s}`}
                key={s}
                className={`flex-1 h-1.5 mx-0.5 rounded-full transition-all ${
                  activeStep <= s ? 'bg-teal-600' : 'bg-stone-200'
                }`}
              />
            ))}
          </div>
        )}

        {/* Bottom controls */}
        <div id="grounding-footer" className="mt-8 flex items-center justify-between pt-4 border-t border-stone-200/50">
          {activeStep === 0 ? (
            <button
              id="btn-grounding-restart"
              onClick={handleRestart}
              className="inline-flex items-center space-x-1 text-xs text-teal-600 font-medium cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Grounding</span>
            </button>
          ) : (
            <button
              id="btn-grounding-prev"
              onClick={handlePrev}
              disabled={activeStep === 5}
              className={`inline-flex items-center space-x-1 text-xs font-medium cursor-pointer ${
                activeStep === 5 ? 'text-stone-300 cursor-not-allowed' : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          )}

          {activeStep > 0 ? (
            <button
              id="btn-grounding-next"
              onClick={handleNext}
              className="inline-flex items-center space-x-1.5 bg-stone-900 hover:bg-stone-800 text-stone-50 text-xs font-semibold px-4 py-2.5 rounded-xl cursor-pointer shadow-sm transition"
            >
              <span>{activeStep === 1 ? "Complete" : "Proceed"}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              id="btn-grounding-exit"
              onClick={onClose}
              className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold px-6 py-2.5 rounded-xl cursor-pointer shadow transition"
            >
              I feel better now, return to space
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

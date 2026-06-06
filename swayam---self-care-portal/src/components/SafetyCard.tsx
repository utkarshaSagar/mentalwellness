/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React from 'react';
import { ShieldAlert, PhoneCall, Heart, Info } from 'lucide-react';

interface SafetyCardProps {
  forceVisible?: boolean;
  translations: any;
}

export const SafetyCard: React.FC<SafetyCardProps> = ({ forceVisible = false, translations }) => {
  const verifiedHelplines = [
    {
      name: "Tele-MANAS Helpline (Govt. of India)",
      numbers: ["14416", "1800-891-4416"],
      description: "Free, comprehensive, 24/7 mental health counseling services spanning across all states in India.",
      hours: "24x7 Free / Toll-free"
    },
    {
      name: "KIRAN Helpline (Govt. of India)",
      numbers: ["1800-599-0019"],
      description: "Official National Mental Health Rehabilitation Helpline operated by Ministry of Social Justice & Empowerment.",
      hours: "24x7 Toll-free"
    },
    {
      name: "Vandrevala Foundation for Mental Health",
      numbers: ["9999-666-555"],
      description: "Dedicated mental health counselors available to listen, support, and navigate stress crises.",
      hours: "24x7 Free Service"
    }
  ];

  return (
    <div id="safety-escalation-card" className="bg-rose-50/75 border border-rose-200/80 rounded-3xl p-6 text-left shadow-md shadow-rose-50/50">
      <div id="safety-card-title" className="flex items-center space-x-2.5 mb-3 border-b border-rose-100 pb-2">
        <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
        <h4 className="font-display font-semibold text-rose-950 text-base md:text-lg">
          {translations.safetyTitle}
        </h4>
        <span className="text-[9px] font-mono tracking-wider text-rose-700 bg-rose-100/60 px-2 py-0.5 rounded-full font-bold">
          VERIFIED NUMBERS
        </span>
      </div>

      <p id="safety-card-desc" className="text-xs text-rose-900/90 font-sans leading-relaxed mb-5">
        {translations.safetyDesc}
      </p>

      {/* Directory of numbers */}
      <div id="helpline-directory" className="space-y-3.5 mb-5">
        {verifiedHelplines.map((line, index) => (
          <div
            id={`helpline-entry-${index}`}
            key={index}
            className="p-3 bg-white/70 border border-rose-150 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs"
          >
            <div className="flex-1">
              <span className="font-semibold text-stone-900 block">{line.name}</span>
              <span className="text-[10.5px] text-stone-500 leading-normal block mt-0.5">
                {line.description}
              </span>
              <span className="text-[9.5px] text-teal-650 font-mono font-bold uppercase mt-1 block">
                ⌚ {line.hours}
              </span>
            </div>
            
            {/* Call Action Triggers */}
            <div className="flex flex-wrap gap-1">
              {line.numbers.map((num) => (
                <a
                  id={`call-num-${num}`}
                  key={num}
                  href={`tel:${num.replace(/-/g, '')}`}
                  className="inline-flex items-center space-x-1 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-medium text-[11px] rounded-lg transition-colors cursor-pointer"
                >
                  <PhoneCall className="w-3 h-3" />
                  <span>Call {num}</span>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Clinical Disclaimer Block */}
      <div id="safety-disclaimer" className="flex items-start space-x-2 bg-stone-50 rounded-2xl p-3 border border-stone-200/40">
        <Info className="w-4.5 h-4.5 text-stone-400 shrink-0 mt-0.5" />
        <div className="text-[10.5px] text-stone-500 leading-relaxed font-sans">
          <strong>Warm Disclaimer:</strong> This application supports daily stress management through routine habit-tracking and structured rule-based recommendations. It is completely independent of cloud servers, does not utilize artificial neural diagnostics, and is <strong>never</strong> a substitute for formal clinical consultation, psychiatric diagnosis, or professional treatment.
        </div>
      </div>
    </div>
  );
};

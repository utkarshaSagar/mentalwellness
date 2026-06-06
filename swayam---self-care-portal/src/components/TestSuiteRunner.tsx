/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShieldCheck, Play, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';
import { runValidationSuite, TestResult } from '../logic/tests';

export const TestSuiteRunner: React.FC = () => {
  const [running, setRunning] = useState<boolean>(false);
  const [hasRun, setHasRun] = useState<boolean>(false);
  const [results, setResults] = useState<TestResult[]>([]);

  const handleRunDiagnostics = () => {
    setRunning(true);
    setResults([]);
    
    setTimeout(() => {
      try {
        const tests = runValidationSuite();
        setResults(tests);
      } catch (e: any) {
        setResults([{ name: "Suite Execution", passed: false, error: e.message }]);
      } finally {
        setRunning(false);
        setHasRun(true);
      }
    }, 1200); // realistic diagnostic delay
  };

  const allPassed = hasRun && results.every(r => r.passed);

  return (
    <div id="test-runner-root" className="bg-white border border-stone-105 rounded-3xl p-6 shadow-md shadow-stone-100/50 space-y-6">
      
      {/* Header section with integrity badge */}
      <div className="flex items-center justify-between border-b border-stone-50 pb-4">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-5 h-5 text-teal-600" />
          <h3 className="font-display font-semibold text-stone-900 text-base md:text-lg">
            Swayam Portal Verification Checks
          </h3>
        </div>
        <span className="text-[10px] font-mono tracking-wider bg-teal-50 text-teal-600 px-2 py-0.5 rounded-full font-bold">
          INTEGRITY CHECK
        </span>
      </div>

      <p className="text-xs text-stone-500 leading-relaxed text-left">
        Run instant, on-device healthy verification checks to confirm that your local streak calculations, offline recommendations, privacy storage encoders, and distress-safeguards are working perfectly.
      </p>

      {/* Launcher Button with healthy status details */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-stone-50 rounded-2xl gap-4 text-left">
        <div>
          <span className="block text-xs font-semibold text-stone-500 uppercase tracking-widest">
            App Health Profile
          </span>
          <span className="text-[10.5px] text-stone-400">
            6 automated checks verifying calculations and sandbox safety
          </span>
        </div>
        
        <button
          id="btn-trigger-diagnostics"
          onClick={handleRunDiagnostics}
          disabled={running}
          className="inline-flex items-center justify-center space-x-2 bg-stone-900 hover:bg-stone-800 text-stone-50 px-4 py-2.5 rounded-xl text-xs font-bold transition disabled:opacity-50 cursor-pointer shadow-sm select-none"
        >
          {running ? (
            <>
              <Clock className="w-3.5 h-3.5 animate-spin" />
              <span>Verifying state...</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Verify App Functionality</span>
            </>
          )}
        </button>
      </div>

      {/* Loading state spinner */}
      {running && (
        <div className="py-8 text-center space-y-2">
          <div className="w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <span className="text-xs font-mono text-stone-400">Simulating state calculations offline...</span>
        </div>
      )}

      {/* Final Outcome Header */}
      {hasRun && !running && (
        <div 
          className={`p-4 rounded-2xl flex items-start space-x-3 text-left ${
            allPassed 
              ? "bg-teal-50/70 border border-teal-100/60 text-teal-900" 
              : "bg-amber-50/70 border border-amber-100/60 text-amber-900"
          }`}
        >
          {allPassed ? (
            <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          )}
          <div>
            <span className="font-semibold text-sm block">
              {allPassed ? "App Functioning Perfectly!" : "Diagnostic Warning Found"}
            </span>
            <p className="text-[11px] opacity-90 leading-relaxed mt-0.5">
              {allPassed 
                ? "Swayam's local database structures, non-punitive streak milestones, cross-site safety tags, and supportive suggestion engines are 100% robust and stable."
                : "One or more checks returned unexpected values under active code simulation."
              }
            </p>
          </div>
        </div>
      )}

      {/* Inactive idle state board */}
      {!running && !hasRun && (
        <div id="tests-idle-board" className="py-10 text-center border border-dashed border-stone-200 rounded-3xl bg-stone-50/40">
          <ShieldCheck className="w-10 h-10 text-stone-300 mx-auto mb-2" />
          <span className="text-xs text-stone-400 font-semibold block">Health Check Ready</span>
          <p className="text-[11px] text-stone-400 max-w-xs mx-auto mt-1">Press "Verify App Functionality" above to run diagnostic tests on-device.</p>
        </div>
      )}

      {/* Table grid listing results */}
      {hasRun && !running && (
        <div className="border border-stone-100 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-12 bg-stone-50 border-b border-stone-100 px-4 py-2.5 text-[10.5px] font-semibold text-stone-500 text-left uppercase tracking-wider">
            <span className="col-span-8">Test Assertion / Check Point</span>
            <span className="col-span-4 text-right">Result Status</span>
          </div>

          <div className="divide-y divide-stone-50">
            {results.map((res, index) => (
              <div key={index} className="grid grid-cols-12 px-4 py-3 text-xs items-center text-left">
                <div className="col-span-8 pr-4">
                  <span className="font-medium text-stone-800 block text-[11.5px]">{res.name}</span>
                  {res.error && (
                    <span className="text-[10px] font-mono text-rose-500 block mt-0.5">{res.error}</span>
                  )}
                </div>
                <div className="col-span-4 text-right">
                  <span 
                    className={`inline-block text-[10px] font-mono px-2 py-0.5 rounded-full font-bold select-none ${
                      res.passed 
                        ? 'bg-teal-50 text-teal-700' 
                        : 'bg-rose-50 text-rose-700'
                    }`}
                  >
                    {res.passed ? 'PASSED' : 'FAILED'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

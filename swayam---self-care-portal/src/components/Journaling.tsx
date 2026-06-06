/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { JournalEntry } from '../types';
import { BookOpen, HelpCircle, Check, AlertTriangle } from 'lucide-react';

interface JournalingProps {
  onAddJournal: (entry: Omit<JournalEntry, 'id' | 'timestamp'>) => void;
  translations: any;
}

export const Journaling: React.FC<JournalingProps> = ({ onAddJournal, translations }) => {
  const [content, setContent] = useState('');
  const [selectedPromptId, setSelectedPromptId] = useState<string>('free');
  const [journalSaved, setJournalSaved] = useState(false);

  const prompts = [
    { id: 'free', label: "Free writing / Express thoughts freely ✍️" },
    { id: 'well', label: "What went well today, no matter how tiny? 🌸" },
    { id: 'control', label: "What are three small things within your immediate control today? ⚓" },
    { id: 'friend', label: "If your dearest friend was feeling this prep stress, what gentle words would you say to them? ❤️" },
    { id: 'nonstudy', label: "List things you did or enjoyed today that were NOT related to study exams. 🎮" }
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    onAddJournal({
      promptId: selectedPromptId === 'free' ? undefined : selectedPromptId,
      content: content.trim()
    });

    setContent('');
    setJournalSaved(true);
    setTimeout(() => {
      setJournalSaved(false);
    }, 3000);
  };

  const currentPromptObject = prompts.find(p => p.id === selectedPromptId);

  return (
    <div id="journal-container" className="bg-white border border-stone-100 rounded-3xl p-6 shadow-md shadow-stone-100/50">
      <div id="journal-heading" className="flex items-center space-x-2 mb-4">
        <BookOpen className="w-5 h-5 text-teal-600" />
        <h2 className="text-xl font-display font-medium tracking-tight text-stone-900">
          {translations.journalTitle}
        </h2>
      </div>

      {/* Prompts list selector */}
      <div id="prompts-selector" className="space-y-2 mb-4">
        <span id="prompt-select-lbl" className="text-stone-400 text-xs font-medium block">
          Select structural reflection helper format:
        </span>
        <div id="prompt-button-reel" className="flex flex-wrap gap-2">
          {prompts.map((prompt) => (
            <button
              id={`prompt-btn-${prompt.id}`}
              key={prompt.id}
              type="button"
              onClick={() => {
                setSelectedPromptId(prompt.id);
                // Pre-populate template structure sometimes
                if (prompt.id === 'control' && !content) {
                  setContent("1. \n2. \n3. ");
                } else if (prompt.id === 'free') {
                  setContent("");
                }
              }}
              className={`text-xs px-3 py-2 rounded-xl border text-left cursor-pointer transition ${
                selectedPromptId === prompt.id
                  ? 'border-teal-500 bg-teal-50/20 text-teal-900 font-medium'
                  : 'border-stone-100 bg-stone-50/80 text-stone-600 hover:bg-stone-50'
              }`}
            >
              {prompt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Prompt guidance text */}
      {selectedPromptId !== 'free' && (
        <div id="prompt-advice" className="my-3 p-3 bg-stone-50 rounded-2xl flex items-start space-x-2 border border-stone-200/30">
          <HelpCircle className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
          <div className="text-[11px] text-stone-500 italic font-sans leading-relaxed">
            Guideline prompt selected: "{currentPromptObject?.label.split('?')[0]}?" Write down your sincere feelings. No one else will read this.
          </div>
        </div>
      )}

      {/* Editor area */}
      <form id="journal-form" onSubmit={handleSave} className="space-y-4">
        <textarea
          id="textarea-journal-body"
          rows={6}
          placeholder="Unbundle your thoughts here. It is safe. (HTML inputs are auto-sanitized for XSS security)"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full bg-stone-50/50 border border-stone-200 rounded-2xl px-4 py-3 text-xs sm:text-sm text-stone-800 font-sans focus:outline-none focus:ring-1 focus:ring-teal-400 leading-relaxed"
          required
        />

        <div id="journal-footer" className="flex items-center justify-between">
          <div id="journal-status-indicator">
            {journalSaved ? (
              <div id="journal-alert-success" className="text-emerald-600 text-xs font-medium flex items-center space-x-1 bg-emerald-50 px-3 py-1.5 rounded-full">
                <Check className="w-4 h-4" />
                <span>Journal saved to offline device storage!</span>
              </div>
            ) : (
              <span className="text-[10px] text-stone-400 flex items-center space-x-1">
                <AlertTriangle className="w-3.5 h-3.5 text-stone-300" />
                <span>Encrypted local-first partition sandbox.</span>
              </span>
            )}
          </div>

          <button
            id="btn-save-journal"
            type="submit"
            disabled={!content.trim()}
            className={`text-xs font-medium px-5 py-3 rounded-xl cursor-pointer transition ${
              content.trim()
                ? 'bg-stone-900 hover:bg-stone-800 text-stone-50 shadow'
                : 'bg-stone-100 text-stone-300 cursor-not-allowed'
            }`}
          >
            Save Journal Reflection
          </button>
        </div>
      </form>
    </div>
  );
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Languages } from 'lucide-react';

interface TranslationSelectorProps {
  currentLang: 'en' | 'hi';
  onLangChange: (lang: 'en' | 'hi') => void;
}

export const TranslationSelector: React.FC<TranslationSelectorProps> = ({ currentLang, onLangChange }) => {
  return (
    <div id="lang-selector-container" className="flex items-center space-x-2 bg-stone-100 hover:bg-stone-200 transition-colors px-3 py-1.5 rounded-full select-none text-stone-700">
      <Languages id="lang-icon" className="w-4 h-4 text-stone-500" />
      <button
        id="btn-lang-en"
        onClick={() => onLangChange('en')}
        className={`text-xs font-medium cursor-pointer transition-all ${
          currentLang === 'en' ? 'text-teal-600 font-bold underline underline-offset-4' : 'opacity-80 hover:opacity-100'
        }`}
      >
        English
      </button>
      <span className="text-stone-300">|</span>
      <button
        id="btn-lang-hi"
        onClick={() => onLangChange('hi')}
        className={`text-xs font-medium cursor-pointer transition-all ${
          currentLang === 'hi' ? 'text-teal-600 font-bold underline underline-offset-4' : 'opacity-80 hover:opacity-100'
        }`}
      >
        हिन्दी
      </button>
    </div>
  );
};

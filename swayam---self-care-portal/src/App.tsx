/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { localDb } from './db/localDb';
import { translations } from './data/translations';
import { MoodEntry, TriggerTag, JournalEntry, UserProfile } from './types';
import {Onboarding} from './components/Onboarding';
import {MoodCheckIn} from './components/MoodCheckIn';
import {Journaling} from './components/Journaling';
import {BreathingExercise} from './components/BreathingExercise';
import {GroundingOverlay} from './components/GroundingOverlay';
import {Timer} from './components/Timer';
import {SafetyCard} from './components/SafetyCard';
import {Dashboard} from './components/Dashboard';
import {SettingsPanel} from './components/SettingsPanel';
import {VisualGame} from './components/VisualGame';
import {TranslationSelector} from './components/TranslationSelector';
import { TARGET_EXAMS } from './data/exams';
import { calculateSelfCareStreaks } from './logic/wellnessRules';
import {
  Sparkles,
  Award,
  BookOpen,
  Calendar,
  AlertCircle,
  Clock,
  LogOut,
  Sliders,
  Play,
  Activity,
  Compass,
  FileText,
  LifeBuoy,
  BadgeAlert,
  Flame,
  Info,
  Eye
} from 'lucide-react';

export default function App() {
  // --- STATE ---
  const [profile, setProfile] = useState<UserProfile>(localDb.getProfile());
  const [moods, setMoods] = useState<MoodEntry[]>(localDb.getMoodEntries());
  const [triggers, setTriggers] = useState<TriggerTag[]>(localDb.getTriggers());
  const [journals, setJournals] = useState<JournalEntry[]>(localDb.getJournalEntries());
  
  const [currentLang, setCurrentLang] = useState<'en' | 'hi'>(
    (profile?.preferredLanguage as 'en' | 'hi') || 'en'
  );

  const [activeTab, setActiveTab] = useState<'dashboard' | 'checkin' | 'journal' | 'timer' | 'breathing' | 'settings' | 'eyecalm'>('dashboard');
  const [isOnboarded, setIsOnboarded] = useState<boolean>(profile.exams && profile.exams.length > 0);
  const [showGrounding, setShowGrounding] = useState<boolean>(false);
  const [latestAffirmation, setLatestAffirmation] = useState<string>('');

  // Sync Language on Profile updates
  useEffect(() => {
    if (profile?.preferredLanguage) {
      setCurrentLang(profile.preferredLanguage as 'en' | 'hi');
    }
  }, [profile]);

  // Generate Rotating Exam-Specific Affirmation Content
  useEffect(() => {
    const defaultAffirmations = [
      "Hydrate your posture. A calm physical core processes memory better.",
      "The competition is only with yesterday’s baseline version of yourself.",
      "A mockup scorecard does not define your eligibility to succeed.",
      "One single performance test does not limit your life’s expansive potential.",
      "Taking 10 minutes to breathe is an investment, never a waste of study time."
    ];

    const upscAffirmations = [
      "UPSC prep is a year-long marathon of resilience. Give yourself permission to disconnect in the evening.",
      "Solitude has power; but don't hesitate to seek supportive counselor advice when anxiety triggers freeze.",
      "Deep analysis is built on a quiet brain. Balance your notes with deep breath checks."
    ];

    const neetAffirmations = [
      "Becoming a medical practitioner is a high calling. Remind your heart that healing begins with your own self-care.",
      "A specific mockup score is a diagnostic pointer for errors, not a terminal verdict of your MBB/BDS dream.",
      "Repeat attempts build supreme maturity. Treat your effort as a Cumulative Victory."
    ];

    const jeeAffirmations = [
      "JEE percentiles are temporary brackets of separation. Your engineering capability is defined by structured persistence.",
      "Break complex equations down block-by-block. Avoid visual distraction and comparison dialogues.",
      "A calm brain parses physics kinematics formulas far more reliably under high tension."
    ];

    const boardsAffirmations = [
      "Board exams are standard school reviews. Your natural creative capability is completely safe.",
      "Parental and neighbor comparisons are outside your focus. Keep your hands on the present step.",
      "Your foundation is secure. Read each question carefully, taking a slow mental pause."
    ];

    let source = defaultAffirmations;
    const selectedEx = profile.exams || [];

    if (selectedEx.includes("UPSC")) {
      source = [...source, ...upscAffirmations];
    }
    if (selectedEx.includes("NEET")) {
      source = [...source, ...neetAffirmations];
    }
    if (selectedEx.includes("JEE_MAIN") || selectedEx.includes("JEE_ADV")) {
      source = [...source, ...jeeAffirmations];
    }
    if (selectedEx.includes("BOARD_X") || selectedEx.includes("BOARD_XII")) {
      source = [...source, ...boardsAffirmations];
    }

    // Select random affirmation
    const idx = Math.floor(Math.random() * source.length);
    setLatestAffirmation(source[idx]);
  }, [profile]);

  const activeTranslations = translations[currentLang];

  // --- ACTIONS ---
  
  const handleOnboardingComplete = (completedProfile: UserProfile, initialMoodScore?: 1 | 2 | 3 | 4 | 5) => {
    localDb.saveProfile(completedProfile);
    setProfile(completedProfile);
    setIsOnboarded(true);

    if (initialMoodScore) {
      const added = localDb.addMoodEntry({
        score: initialMoodScore,
        triggerTags: []
      });
      setMoods(localDb.getMoodEntries());
    }
  };

  const handleLangToggleInHeader = (lang: 'en' | 'hi') => {
    const updated = {
      ...profile,
      preferredLanguage: lang
    };
    localDb.saveProfile(updated);
    setProfile(updated);
    setCurrentLang(lang);
  };

  const handleMoodCheckIn = (entry: Omit<MoodEntry, 'id' | 'timestamp'>) => {
    localDb.addMoodEntry(entry);
    setMoods(localDb.getMoodEntries());
    setActiveTab('dashboard'); // Redirect to dashboard immediately after logging
  };

  const handleAddJournal = (entry: Omit<JournalEntry, 'id' | 'timestamp'>) => {
    localDb.addJournalEntry(entry);
    setJournals(localDb.getJournalEntries());
    setActiveTab('dashboard');
  };

  const handleAddCustomTrigger = (label: string): TriggerTag => {
    const newTag = localDb.addCustomTrigger(label);
    setTriggers(localDb.getTriggers());
    return newTag;
  };

  const handleUpdateProfile = (updatedProfile: UserProfile) => {
    localDb.saveProfile(updatedProfile);
    setProfile(updatedProfile);
  };

  const handleExportData = (): string => {
    return localDb.exportBackupData();
  };

  const handleImportData = (json: string): boolean => {
    const ok = localDb.importBackupData(json);
    if (ok) {
      setProfile(localDb.getProfile());
      setMoods(localDb.getMoodEntries());
      setTriggers(localDb.getTriggers());
      setJournals(localDb.getJournalEntries());
    }
    return ok;
  };

  const handleClearAllData = () => {
    localDb.clearAllData();
    // Default restore
    setProfile({
      id: 'default-user',
      exams: [],
      preferredLanguage: 'en',
      dataSharingOptIn: false
    });
    setMoods([]);
    setTriggers([]);
    setJournals([]);
    setIsOnboarded(false);
  };

  // --- CALCULATIONS FOR SUMMARY AND RECOMMENDATIONS ---
  const latestMoodEntry = moods[0] || null;
  const isSevereDistress = latestMoodEntry !== null && latestMoodEntry.score === 1;

  // Rule-based active tips from logic layer
  const activeTips = getMockRulesTips();

  function getMockRulesTips() {
    const list: { id: string; type: string; title: string; text: string }[] = [];
    if (!latestMoodEntry) {
      list.push({
        id: 'tip_initial',
        type: 'break',
        title: 'Daily Micro-Step',
        text: 'Record your first mood block above. This triggers automated recommendations relative to your syllabus.'
      });
      return list;
    }

    const sc = latestMoodEntry.score;
    const mappedTags = latestMoodEntry.triggerTags || [];

    if (sc <= 2) {
      list.push({
        id: 'tip_breath_low',
        type: 'breathing',
        title: 'Breathe Anchor Recommended',
        text: 'A mood score <= 2 triggers immediate box breathing recommendation. Switch to the focus breathe panel below.'
      });
    }

    if (mappedTags.includes('t-mock')) {
      list.push({
        id: 'tip_mock_scores',
        type: 'reframe',
        title: 'Mock Scores Reframe',
        text: 'Identify mock errors as saved Marks for the real outcome. They point to focus gaps, not final rankings.'
      });
    }

    if (mappedTags.includes('t-parent')) {
      list.push({
        id: 'tip_parental_reframe',
        type: 'reframe',
        title: 'Parent Affirmation',
        text: 'Honor them, but know your core existence has multiple custom career patterns.'
      });
    }

    if (mappedTags.includes('t-sleep')) {
      list.push({
        id: 'tip_sleep_reframe',
        type: 'sleep',
        title: 'Memory Consolidation',
        text: 'Memory anchors during sleep. Trimming sleep under 7 hours lowers mock analytical performance.'
      });
    }

    if (mappedTags.includes('t-backlog')) {
      list.push({
        id: 'tip_backlog_reframe',
        type: 'break',
        title: 'Focus Micro-Topic',
        text: 'Syllabus backlog paralysis breaks when you isolate ONE 25-minute study block.'
      });
    }

    // Default general advice
    if (list.length < 2) {
      list.push({
        id: 'tip_posture',
        type: 'break',
        title: 'Water & Shoulder Roll',
        text: 'Stand, tilt head left and right, drink 3 sips of warm water, and reset eyes for 10 seconds.'
      });
    }

    return list;
  }

  // --- RENDERING ---

  if (!isOnboarded) {
    return (
      <div id="onboarding-viewport" className="min-h-screen bg-stone-50/50 flex flex-col justify-between py-10 px-4 sm:px-6">
        <Onboarding
          onComplete={handleOnboardingComplete}
          currentLang={currentLang}
          onLangChange={handleLangToggleInHeader}
          translations={activeTranslations}
        />
        <footer id="onboarding-footer" className="text-center text-[10px] text-stone-400 font-mono mt-8 leading-normal uppercase">
          Swayam secure local container sandbox • Verifiably Server-Independent
        </footer>
      </div>
    );
  }

  // Active exam formatted names list
  const activeExamsNamesStr = TARGET_EXAMS
    .filter(e => profile.exams.includes(e.code))
    .map(e => e.name)
    .join(', ') || profile.exams.join(', ');

  return (
    <div id="full-viewport" className="min-h-screen bg-stone-50/30 font-sans flex flex-col">
      
      {/* Top Main Nav Header */}
      <header id="main-portal-header" className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-stone-100/80 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-2xl bg-stone-900 flex items-center justify-center text-teal-400 font-display font-medium text-sm shadow-md">
            S
          </div>
          <div className="text-left">
            <span id="header-appname" className="block text-sm sm:text-base font-display font-semibold text-stone-900 tracking-tight">
              {activeTranslations.appName}
            </span>
            <div className="flex items-center space-x-1">
              <span id="registered-exams-bullet" className="text-[10px] font-mono text-stone-400 bg-stone-50 border border-stone-200/50 px-1.5 py-0.5 rounded">
                🎯 {activeExamsNamesStr || 'General Wellness Workspace'}
              </span>
            </div>
          </div>
        </div>

        {/* Diagnostic switch and triggers */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Somatic distress panic override capsule */}
          <button
            id="floating-sos-capsule"
            onClick={() => setShowGrounding(true)}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-rose-50 hover:bg-rose-100/80 border border-rose-200 text-rose-700 rounded-full text-[11px] font-semibold transition cursor-pointer shadow-sm animate-pulse"
          >
            <span>🚨 Moment of Panic - Help</span>
          </button>

          <TranslationSelector
            currentLang={currentLang}
            onLangChange={handleLangToggleInHeader}
          />
        </div>
      </header>

      {/* Rotating encouraging affirmation ticker block */}
      <div id="affirmation-ticker" className="bg-stone-50/80 border-b border-stone-100/60 py-2.5 px-4 text-center">
        <div className="max-w-4xl mx-auto flex items-center justify-center space-x-1.5 text-stone-500 font-sans text-[11px] sm:text-xs">
          <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span className="font-semibold block shrink-0 text-stone-700">Exam Reminder:</span>
          <span className="italic block font-medium tracking-tight text-stone-600 line-clamp-1">{latestAffirmation}</span>
        </div>
      </div>

      {/* Primary content area splitter */}
      <main id="primary-viewport-splitter" className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Sidebar Nav anchors */}
        <section id="sidebar-nav-panel" className="lg:col-span-3 space-y-6">
          <div className="bg-white border border-stone-100 rounded-3xl p-5 shadow-sm space-y-4">
            <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest block pl-2">
              Swayam Study Desk
            </span>

            <nav id="desk-navigation" className="flex flex-col space-y-1">
              {([
                { id: 'dashboard', label: activeTranslations.dashboardTitle, icon: Compass },
                { id: 'checkin', label: activeTranslations.checkInTitle, icon: Activity },
                { id: 'journal', label: "Journal Reflection", icon: BookOpen },
                { id: 'timer', label: "Self-Pause Timer", icon: Clock },
                { id: 'breathing', label: "Pranayama Breathing", icon: Play },
                { id: 'eyecalm', label: "Sight Calm & Eye Oasis", icon: Eye },
                { id: 'settings', label: "Privacy & Sandbox", icon: Sliders }
              ] as const).map((tab) => {
                const Icon = tab.icon;
                const isCurrent = activeTab === tab.id;
                return (
                  <button
                    id={`sidebar-anchor-tab-${tab.id}`}
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2.5 w-full text-left px-3.5 py-3 rounded-2xl cursor-pointer text-xs font-medium transition ${
                      isCurrent
                        ? 'bg-stone-900 text-stone-50 shadow font-bold'
                        : 'text-stone-500 hover:bg-stone-50 hover:text-stone-800'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isCurrent ? 'text-teal-400' : 'text-stone-400'}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Core dynamic prompt indicator */}
          <div id="cumulative-milestone-panel" className="bg-gradient-to-br from-stone-900 to-stone-950 text-white rounded-3xl p-5 shadow-inner space-y-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/10 rounded-full blur-2xl" />
            
            <div className="flex items-center space-x-1 text-teal-400 text-[10px] tracking-wider uppercase font-mono font-bold">
              <Sparkles className="w-3 h-3 text-amber-500 fill-amber-500" />
              <span>Streak Milestone</span>
            </div>

            <div>
              <span id="stats-streak-badge" className="text-3xl font-mono font-bold block text-white">
                {calculateSelfCareStreaks(moods, journals).currentStreak} Days
              </span>
              <p className="text-[10px] text-stone-400 leading-normal mt-1.5 font-sans">
                You logged {moods.length} moods & {journals.length} journal logs. Remember, our streak mechanism does not clear metrics on missed days. Recovery is cumulative!
              </p>
            </div>
          </div>
        </section>

        {/* Principal Dynamic View Pane */}
        <section id="principal-dynamic-frame" className="lg:col-span-9 space-y-6">
          
          {/* Alarm critical distress alert escalation layer (takes precedence inside the active workspace) */}
          {isSevereDistress && (
            <div id="critical-escalation-hud" className="animate-fade-in">
              <SafetyCard translations={activeTranslations} forceVisible={true} />
            </div>
          )}

          {/* Current selected nav Tab Content board router */}
          {activeTab === 'dashboard' && (
            <div id="tab-dashboard" className="space-y-6">
              
              {/* Daily Action triggers board list */}
              <div id="dashboard-hero-split" className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Rule-based personalized recommendations */}
                <div id="rule-recommendations-board" className="bg-white border border-stone-100 rounded-3xl p-6 shadow-sm">
                  <h4 className="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-4 flex items-center space-x-1.5 border-b border-stone-50 pb-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>{activeTranslations.recommendationsTitle}</span>
                  </h4>

                  <div id="tips-stack" className="space-y-3.5">
                    {activeTips.map((tip) => (
                      <div
                        id={`tip-entry-${tip.id}`}
                        key={tip.id}
                        className="p-3.5 bg-stone-50/50 hover:bg-stone-50 border border-stone-150/60 rounded-2xl flex items-start space-x-3 transition text-xs"
                      >
                        <div className="p-1 px-1.5 rounded-lg bg-teal-50 text-[10px] font-mono font-extrabold uppercase text-teal-700 tracking-wider shrink-0 mt-0.5">
                          {tip.type}
                        </div>
                        <div className="text-left">
                          <span className="font-semibold text-stone-900 block">{tip.title}</span>
                          <span className="text-[11px] text-stone-500 leading-relaxed block mt-0.5">{tip.text}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <p className="text-[10px] text-stone-400 italic mt-5 leading-normal">Tips update dynamically inside this local compartment as soon as checklists or notes are registered.</p>
                </div>

                {/* Micro checklist study timer redirect pane */}
                <div id="micro-dashboard-timer-redirect" className="bg-white border border-stone-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-stone-500 uppercase tracking-wider flex items-center space-x-1.5">
                      <Clock className="w-4 h-4 text-stone-400" />
                      <span>Take a Rest Breather</span>
                    </h4>
                    <p className="text-xs text-stone-500 leading-relaxed font-sans font-medium">
                      Need a structured workspace? Set up a 25-minute Pomodoro focus block to parse difficult chapters, coupled with mood-aware breaks automatically offset for fatigue.
                    </p>
                  </div>
                  
                  <div className="pt-4 border-t border-stone-50 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-stone-400 uppercase tracking-widest">Self-Pause Timer Connected</span>
                    <button
                      id="btn-goto-timer"
                      onClick={() => setActiveTab('timer')}
                      className="bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold px-4 py-2 rounded-xl cursor-pointer transition"
                    >
                      Enter Focus Timer Space
                    </button>
                  </div>
                </div>

              </div>

              {/* Verified Crisis Helpline Resource Center Card */}
              <SafetyCard translations={activeTranslations} />

              <Dashboard
                moods={moods}
                journals={journals}
                allTriggers={triggers}
                translations={activeTranslations}
              />

              {/* Historic check-in timelines logs table */}
              <div id="check-in-historic-timelines" className="bg-white border border-stone-100 rounded-3xl p-6 shadow-sm">
                <h4 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-4">
                  {activeTranslations.historyTitle} ({moods.length} entries registered)
                </h4>

                {moods.length === 0 ? (
                  <p className="text-xs text-stone-400 font-medium italic text-center py-6">No checkpoints recorded yet.</p>
                ) : (
                  <div id="check-in-journals-lines" className="space-y-3.5 max-h-80 overflow-y-auto pr-1">
                    {moods.map((log) => (
                      <div
                        id={`timeline-log-${log.id}`}
                        key={log.id}
                        className="p-3.5 bg-stone-50/50 hover:bg-stone-50/90 border border-stone-150/40 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs"
                      >
                        <div className="flex-1 space-y-1 text-left">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{getEmojiForLog(log.score)}</span>
                            <span className="font-semibold text-stone-900">Score Rating: {log.score} / 5</span>
                            <span className="text-[10px] font-mono text-stone-400">
                              {new Date(log.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          
                          {log.note && (
                            <p className="text-stone-600 bg-white/60 p-2 border border-stone-100 rounded-xl leading-relaxed italic select-text">
                              "{log.note}"
                            </p>
                          )}

                          {/* Trigger pill indicators */}
                          {log.triggerTags && log.triggerTags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {log.triggerTags.map((tid) => {
                                const found = triggers.find(t => t.id === tid);
                                return (
                                  <span id={`timeline-badge-${tid}`} key={tid} className="text-[9.5px] font-semibold bg-stone-100 text-stone-500 rounded px-2 py-0.5">
                                    {found?.label || "Custom Factor"}
                                  </span>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

          {activeTab === 'checkin' && (
            <MoodCheckIn
              onCheckIn={handleMoodCheckIn}
              availableTriggers={triggers}
              onAddCustomTrigger={handleAddCustomTrigger}
              translations={activeTranslations}
            />
          )}

          {activeTab === 'journal' && (
            <div id="tab-journal" className="space-y-6">
              <Journaling onAddJournal={handleAddJournal} translations={activeTranslations} />
              
              {/* Journal Historic review */}
              <div id="journal-history-timelines" className="bg-white border border-stone-100 rounded-3xl p-6 shadow-sm">
                <h4 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-4">
                  Past Reflections History ({journals.length} entries)
                </h4>

                {journals.length === 0 ? (
                  <p className="text-xs text-stone-400 font-medium italic text-center py-6">No journal reflections written yet. Select an anchor prompt above.</p>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
                    {journals.map((j) => (
                      <div
                        id={`journal-history-card-${j.id}`}
                        key={j.id}
                        className="p-4 bg-stone-50/60 hover:bg-stone-50 border border-stone-200/50 rounded-2xl space-y-2 text-left"
                      >
                        <div className="flex items-center justify-between text-[11px] text-stone-400 border-b border-stone-100/60 pb-1.5">
                          <span className="font-semibold uppercase tracking-wider font-mono text-[10px]">
                            {j.promptId ? `Promoted format: ${j.promptId}` : "Free reflection log"}
                          </span>
                          <span className="font-mono">
                            {new Date(j.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        <p className="text-stone-700 leading-relaxed tracking-tight text-xs sm:text-sm font-sans select-text whitespace-pre-wrap">
                          {j.content}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'timer' && (
            <Timer
              latestMoodScore={latestMoodEntry ? latestMoodEntry.score : null}
              translations={activeTranslations}
            />
          )}

          {activeTab === 'breathing' && (
            <BreathingExercise translations={activeTranslations} />
          )}

          {activeTab === 'settings' && (
            <SettingsPanel
              onExport={handleExportData}
              onImport={handleImportData}
              onClear={handleClearAllData}
              currentProfile={profile}
              onUpdateProfile={handleUpdateProfile}
              translations={activeTranslations}
            />
          )}

          {activeTab === 'eyecalm' && (
            <VisualGame />
          )}

        </section>

      </main>

      {/* Floating Somatic panic help Grounding Overlay popup */}
      {showGrounding && (
        <GroundingOverlay
          translations={activeTranslations}
          onClose={() => setShowGrounding(false)}
        />
      )}

      {/* Main footer credentials banner */}
      <footer id="main-portal-footer" className="bg-stone-50 border-t border-stone-100/50 py-10 px-4 sm:px-8 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3 text-left">
            <div className="w-7 h-7 rounded bg-stone-900 flex items-center justify-center text-[10px] text-teal-400 font-bold font-mono">
              S
            </div>
            <div>
              <span className="text-xs font-semibold text-stone-800 block">Swayam Secure Companion</span>
              <span className="text-[10.5px] text-stone-400 block mt-0.5">A verifiably local-first diagnostic tool dedicated to Indian students.</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-[10px] font-mono uppercase text-stone-400 font-semibold tracking-wider">
            <span>Client sandbox storage</span>
            <span>•</span>
            <span>Rule-based suggestion nodes</span>
            <span>•</span>
            <span>Offline caching registered</span>
          </div>
        </div>
      </footer>

    </div>
  );

  function getEmojiForLog(s: number) {
    switch (s) {
      case 1: return "🥺";
      case 2: return "😟";
      case 3: return "😐";
      case 4: return "🙂";
      case 5: return "🌟";
      default: return "😐";
    }
  }
}

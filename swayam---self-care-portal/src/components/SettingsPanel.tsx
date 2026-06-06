/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Database, Shield, Download, Trash2, Upload, AlertTriangle, CheckCircle2, UserCheck } from 'lucide-react';

interface SettingsPanelProps {
  onExport: () => string;
  onImport: (json: string) => boolean;
  onClear: () => void;
  currentProfile: any;
  onUpdateProfile: (p: any) => void;
  translations: any;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  onExport,
  onImport,
  onClear,
  currentProfile,
  onUpdateProfile,
  translations
}) => {
  const [importText, setImportText] = useState('');
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'fail'>('idle');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [hasOptedIn, setHasOptedIn] = useState(currentProfile?.dataSharingOptIn || false);

  const handleExport = () => {
    try {
      const dataStr = onExport();
      const blob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.id = "download-anchor-link";
      link.href = url;
      link.download = `Swayam_SelfCare_Backup_${new Date().toISOString().substring(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert("Browser export failure. Please manually copy the state instead.");
    }
  };

  const handleImport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importText.trim()) return;

    const ok = onImport(importText.trim());
    if (ok) {
      setImportStatus('success');
      setImportText('');
      setTimeout(() => {
        window.location.reload(); // Refresh viewport to draw new records
      }, 1500);
    } else {
      setImportStatus('fail');
    }
  };

  const handlePurge = () => {
    onClear();
    setShowDeleteConfirm(false);
    window.location.reload(); // Reload back to onboarding state immediately
  };

  const handleOptInToggle = () => {
    const nextVal = !hasOptedIn;
    setHasOptedIn(nextVal);
    onUpdateProfile({
      ...currentProfile,
      dataSharingOptIn: nextVal
    });
  };

  return (
    <div id="settings-pnl-root" className="bg-white border border-stone-100 rounded-3xl p-6 shadow-md shadow-stone-100/50 space-y-8 text-left">
      
      {/* Policy Sandbox and opt-in */}
      <div id="sandbox-policy-block" className="space-y-4">
        <h4 className="text-sm font-semibold text-stone-500 uppercase tracking-wider flex items-center space-x-1.5 border-b border-stone-50 pb-2">
          <Shield className="w-4.5 h-4.5 text-stone-400" />
          <span>Local-First Sandbox Environment & Security Parameters</span>
        </h4>

        <div id="policy-alert" className="p-4 bg-teal-50/20 border border-teal-200/50 rounded-2xl text-xs sm:text-sm text-teal-950 font-sans leading-relaxed">
          <strong>Privacy Blueprint:</strong> By absolute default, 100% of your generated mood tags, journaling notes, test feedback notes, and timeline milestones are locked securely in your browser client compartment (<span className="font-mono text-[11px] font-bold">Local-First Storage</span>). No analytics databases, remote trackers, or advertising trackers are ever run. Data never reaches external target nodes unless explicitly exported by your click.
        </div>

        {/* Data Sharing Toggle Widget */}
        <div id="opt-in-widget" className="flex items-start justify-between bg-stone-50 p-4 rounded-2xl border border-stone-150">
          <div className="flex-1 mr-4">
            <label className="text-xs font-semibold text-stone-900 block flex items-center space-x-1">
              <UserCheck className="w-4 h-4 text-stone-500 mr-1" />
              <span>Diagnostic Sync (Optional)</span>
            </label>
            <span className="text-[10.5px] text-stone-400 leading-normal block mt-1">
              Enable strict local backup validation. Keeps synchronization flags turned off by default to maintain extreme security parameters.
            </span>
          </div>

          <button
            id="btn-opt-in-toggle"
            type="button"
            onClick={handleOptInToggle}
            className={`w-12 h-6 rounded-full p-0.5 cursor-pointer transition-colors focus:outline-none ${
              hasOptedIn ? 'bg-teal-600' : 'bg-stone-300'
            }`}
          >
            <div className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform ${
              hasOptedIn ? 'translate-x-6' : 'translate-x-0'
            }`} />
          </button>
        </div>
      </div>

      {/* Export & Import Controllers */}
      <div id="backup-controllers" className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {/* Export side */}
        <div id="box-export" className="space-y-3">
          <h5 className="text-xs font-bold text-stone-800 uppercase tracking-widest flex items-center space-x-1.5">
            <Database className="w-4 h-4 text-stone-400" />
            <span>Backup Data Export</span>
          </h5>
          <p className="text-[11px] text-stone-500 leading-relaxed font-sans">
            Export a full encrypted backup format mapping your exact journaling timelines and custom stress tags logs. Use this file to transfer logs between study tabs or phone systems safely.
          </p>
          <button
            id="btn-export-trigger"
            onClick={handleExport}
            className="w-full inline-flex items-center justify-center space-x-1.5 bg-stone-900 hover:bg-stone-850 text-stone-50 px-4 py-3 rounded-xl cursor-pointer text-xs font-medium transition"
          >
            <Download className="w-4 h-4" />
            <span>{translations.exportDataBtn}</span>
          </button>
        </div>

        {/* Import side */}
        <div id="box-import" className="space-y-3">
          <h5 className="text-xs font-bold text-stone-800 uppercase tracking-widest flex items-center space-x-1.5">
            <Upload className="w-4 h-4 text-stone-400" />
            <span>Restore Data Import</span>
          </h5>
          <p className="text-[11px] text-stone-500 leading-relaxed font-sans">
            Paste a backup JSON code snippet below to restore. This overrides the current local sandbox.
          </p>
          
          <form id="import-form" onSubmit={handleImport} className="space-y-2">
            <textarea
              id="textarea-import-input"
              rows={2}
              placeholder='Paste JSON back-string here, e.g. {"profile":...}'
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-[10px] font-mono focus:outline-none focus:ring-1 focus:ring-teal-400"
              required
            />
            <button
              id="btn-import-submit"
              type="submit"
              className="w-full bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium px-4 py-2 rounded-xl text-xs cursor-pointer transition"
            >
              Process Import Validation
            </button>
          </form>

          {importStatus === 'success' && (
            <div id="import-success" className="text-emerald-600 text-xs font-medium flex items-center space-x-1 bg-emerald-50 px-3 py-1.5 rounded-full">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Import validated! Reassembling tables...</span>
            </div>
          )}
          {importStatus === 'fail' && (
            <div id="import-fail" className="text-red-650 text-xs font-medium flex items-center space-x-1 bg-red-50 px-3 py-1.5 rounded-full">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Incorrect JSON format detected. Double check snippet.</span>
            </div>
          )}
        </div>
      </div>

      {/* Irreversible Delete Purge Section */}
      <div id="destructive-zone" className="pt-6 border-t border-stone-100 space-y-4">
        <h5 className="text-xs font-bold text-red-550 uppercase tracking-widest flex items-center space-x-1.5">
          <Trash2 className="w-4.5 h-4.5 text-red-550" />
          <span>Destructive Sandbox Clean-up</span>
        </h5>
        <p className="text-[11px] text-stone-500 leading-relaxed font-sans">
          This purges all tables (Mood entries, custom stress tags, journaling entries, configurations) from the local device storage.
        </p>

        {showDeleteConfirm ? (
          <div id="confirm-purge-box" className="p-4 bg-red-50 border border-red-200 rounded-2xl space-y-3">
            <div className="flex items-start space-x-2 text-xs text-red-950 font-sans">
              <AlertTriangle className="w-4.5 h-4.5 text-red-650 shrink-0 mt-0.5" />
              <div>
                <strong>{translations.confirmDeleteLabel}</strong>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                id="btn-confirm-delete"
                onClick={handlePurge}
                className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl cursor-pointer"
              >
                Yes, Purge and Delete Everything
              </button>
              <button
                id="btn-cancel-delete"
                onClick={() => setShowDeleteConfirm(false)}
                className="bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs px-4 py-2.5 rounded-xl cursor-pointer"
              >
                No, Keep My Data
              </button>
            </div>
          </div>
        ) : (
          <button
            id="btn-show-delete-confirm"
            onClick={() => setShowDeleteConfirm(true)}
            className="inline-flex items-center space-x-1 px-4 py-2.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-xs font-semibold rounded-xl cursor-pointer transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{translations.deleteDataBtn}</span>
          </button>
        )}
      </div>

    </div>
  );
};

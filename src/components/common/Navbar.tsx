import React, { useState } from 'react';
import { Shield, Award, Terminal, Layers, BookOpen, Flame, Zap, Download, Upload, RotateCcw, User, Check, X } from 'lucide-react';
import { UserProgressState } from '../../types/curriculum';
import { StorageService } from '../../services/storageService';

interface NavbarProps {
  progress: UserProgressState;
  activeView: 'curriculum' | 'incidents' | 'flashcards' | 'certificate';
  onViewChange: (view: 'curriculum' | 'incidents' | 'flashcards' | 'certificate') => void;
  onStateUpdate: (newState: UserProgressState) => void;
  totalTopicsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  progress,
  activeView,
  onViewChange,
  onStateUpdate,
  totalTopicsCount,
}) => {
  const [showDataModal, setShowDataModal] = useState(false);
  const [importJson, setImportJson] = useState('');
  const [importError, setImportError] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(progress.userName || 'Cyber Analyst');

  const completedCount = progress.completedTopics.length;
  const overallPercentage = Math.round((completedCount / totalTopicsCount) * 100) || 0;

  const handleExport = () => {
    const json = StorageService.exportProgressJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cyshield_soc_progress_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    if (!importJson.trim()) return;
    const success = StorageService.importProgressJson(importJson);
    if (success) {
      onStateUpdate(StorageService.loadProgress());
      setShowDataModal(false);
      setImportJson('');
      setImportError('');
    } else {
      setImportError('Invalid JSON format. Please verify your export file.');
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all progress? This action cannot be undone.')) {
      const reset = StorageService.resetProgress();
      onStateUpdate(reset);
      setShowDataModal(false);
    }
  };

  const handleSaveName = () => {
    const updated = StorageService.updateUserName(tempName);
    onStateUpdate(updated);
    setIsEditingName(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0a0d14]/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onViewChange('curriculum')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Shield className="w-6 h-6 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-tight text-white font-sans">
                  CyShield <span className="text-cyan-400 font-mono">SOC</span>
                </span>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800/60 uppercase">
                  Enterprise
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Corporate Cyber Defense Academy</p>
            </div>
          </div>

          {/* Nav Tabs */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => onViewChange('curriculum')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeView === 'curriculum'
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Curriculum ({overallPercentage}%)</span>
            </button>

            <button
              onClick={() => onViewChange('incidents')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeView === 'incidents'
                  ? 'bg-red-500/10 text-red-400 border border-red-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Terminal className="w-4 h-4" />
              <span>Incident Desk</span>
            </button>

            <button
              onClick={() => onViewChange('flashcards')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeView === 'flashcards'
                  ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Interview Deck</span>
            </button>

            <button
              onClick={() => onViewChange('certificate')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeView === 'certificate'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Certification</span>
            </button>
          </nav>

          {/* User Progress Stats & Tools */}
          <div className="flex items-center space-x-3">
            {/* XP Badge */}
            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-400">
              <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="font-bold">{progress.xp}</span>
              <span className="text-slate-500">XP</span>
            </div>

            {/* Streak Badge */}
            <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-orange-400">
              <Flame className="w-3.5 h-3.5 fill-orange-400" />
              <span className="font-bold">{progress.streakDays}</span>
              <span className="text-slate-500">day</span>
            </div>

            {/* User Profile / Backup Button */}
            <button
              onClick={() => setShowDataModal(true)}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
              title="Progress & Backup Manager"
            >
              <User className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Progress & Persistence Modal */}
      {showDataModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-slate-100">Analyst Profile & Persistence</h3>
              </div>
              <button
                onClick={() => setShowDataModal(false)}
                className="text-slate-400 hover:text-white text-lg"
              >
                ✕
              </button>
            </div>

            {/* Profile Name */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-mono">Analyst Name:</label>
              {isEditingName ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tempName}
                    onChange={e => setTempName(e.target.value)}
                    className="flex-1 bg-[#111827] text-white text-xs px-3 py-1.5 rounded border border-slate-700 focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    onClick={handleSaveName}
                    className="p-1.5 bg-emerald-600 rounded text-black hover:bg-emerald-500"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setIsEditingName(false)}
                    className="p-1.5 bg-slate-800 rounded text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between bg-slate-900 px-3 py-2 rounded border border-slate-800">
                  <span className="text-sm font-semibold text-slate-200">{progress.userName}</span>
                  <button
                    onClick={() => {
                      setTempName(progress.userName || '');
                      setIsEditingName(true);
                    }}
                    className="text-xs text-cyan-400 hover:underline font-mono"
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="bg-slate-900/80 p-2.5 rounded border border-slate-800">
                <span className="text-slate-400">Completed Topics:</span>
                <div className="text-cyan-400 font-bold text-sm mt-0.5">{completedCount} / {totalTopicsCount}</div>
              </div>
              <div className="bg-slate-900/80 p-2.5 rounded border border-slate-800">
                <span className="text-slate-400">Tickets Solved:</span>
                <div className="text-emerald-400 font-bold text-sm mt-0.5">{Object.keys(progress.incidentSubmissions).length}</div>
              </div>
            </div>

            {/* Export / Import */}
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <div className="text-xs font-mono text-slate-400">State Persistence & Portability:</div>
              <div className="flex gap-2">
                <button
                  onClick={handleExport}
                  className="flex-1 py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-cyan-400" />
                  Export JSON
                </button>
                <button
                  onClick={handleReset}
                  className="py-2 px-3 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-red-800/60"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-red-400" />
                  Reset
                </button>
              </div>

              <div className="space-y-1.5 pt-1">
                <textarea
                  rows={3}
                  value={importJson}
                  onChange={e => setImportJson(e.target.value)}
                  placeholder="Paste exported JSON here to restore progress on another browser..."
                  className="w-full bg-[#111827] text-slate-200 font-mono text-[11px] p-2 rounded border border-slate-700 focus:outline-none focus:border-cyan-500"
                />
                {importError && (
                  <p className="text-xs text-red-400">{importError}</p>
                )}
                {importJson && (
                  <button
                    onClick={handleImport}
                    className="w-full py-1.5 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs rounded transition-colors"
                  >
                    Apply Restored Progress
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

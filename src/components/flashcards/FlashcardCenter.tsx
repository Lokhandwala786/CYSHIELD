import React, { useState } from 'react';
import { BookOpen, CheckCircle2, Search, Filter, RotateCcw, Eye, EyeOff, Award, Sparkles } from 'lucide-react';
import { Flashcard, Topic, Phase, UserProgressState } from '../../types/curriculum';
import { StorageService } from '../../services/storageService';

interface FlashcardCenterProps {
  cards: { flashcard: Flashcard; topic: Topic; phase: Phase }[];
  progress: UserProgressState;
  onStateUpdate: (newState: UserProgressState) => void;
}

export const FlashcardCenter: React.FC<FlashcardCenterProps> = ({
  cards,
  progress,
  onStateUpdate,
}) => {
  const [selectedPhase, setSelectedPhase] = useState<string>('ALL');
  const [filterMastery, setFilterMastery] = useState<'ALL' | 'MASTERED' | 'REVIEW'>('ALL');
  const [search, setSearch] = useState('');
  const [flippedMap, setFlippedMap] = useState<Record<string, boolean>>({});

  const filteredCards = cards.filter(({ flashcard, phase }) => {
    if (selectedPhase !== 'ALL' && phase.id !== selectedPhase) return false;
    const isMastered = progress.masteredFlashcards.includes(flashcard.id);
    if (filterMastery === 'MASTERED' && !isMastered) return false;
    if (filterMastery === 'REVIEW' && isMastered) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        flashcard.question.toLowerCase().includes(q) ||
        flashcard.category.toLowerCase().includes(q) ||
        flashcard.modelAnswer.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const masteredCount = progress.masteredFlashcards.length;
  const totalCount = cards.length;
  const masteryPercentage = Math.round((masteredCount / totalCount) * 100) || 0;

  const handleToggleFlip = (id: string) => {
    setFlippedMap(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleToggleMastery = (cardId: string) => {
    const updated = StorageService.toggleFlashcardMastery(cardId);
    onStateUpdate(updated);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-purple-400">
            <BookOpen className="w-4 h-4" />
            <span>SOC ANALYST JOB INTERVIEW MASTER DECK</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Technical Interview Flashcards
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Real interview questions from Tier 2 Leads, Principal Architects, and SOC Managers with model 90%+ answers.
          </p>
        </div>

        {/* Mastery Progress Card */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-right">
            <span className="text-slate-400">Mastered:</span>
            <div className="text-lg font-bold text-purple-400 mt-0.5">
              {masteredCount} / {totalCount} ({masteryPercentage}%)
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-[#0b101b] p-3 rounded-xl border border-slate-800">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search questions or keywords..."
            className="w-full bg-[#111827] text-slate-200 font-mono text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-800 focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto text-xs font-mono">
          <span className="text-slate-500">Phase:</span>
          {(['ALL', 'phase-1', 'phase-2', 'phase-3', 'phase-4', 'phase-5'] as const).map(p => (
            <button
              key={p}
              onClick={() => setSelectedPhase(p)}
              className={`px-2 py-1 rounded ${
                selectedPhase === p
                  ? 'bg-purple-600 text-white font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {p === 'ALL' ? 'All Phases' : `P${p.split('-')[1]}`}
            </button>
          ))}

          <span className="text-slate-500 ml-2">Deck:</span>
          {(['ALL', 'REVIEW', 'MASTERED'] as const).map(m => (
            <button
              key={m}
              onClick={() => setFilterMastery(m)}
              className={`px-2 py-1 rounded ${
                filterMastery === m
                  ? 'bg-cyan-500 text-black font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Flashcards List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredCards.map(({ flashcard, topic, phase }) => {
          const isFlipped = flippedMap[flashcard.id];
          const isMastered = progress.masteredFlashcards.includes(flashcard.id);

          return (
            <div
              key={flashcard.id}
              className={`rounded-2xl border transition-all p-5 space-y-4 shadow-xl ${
                isMastered ? 'bg-[#0a121c] border-emerald-500/30' : 'bg-[#0d131f] border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-800 text-purple-300 font-bold">
                    Phase {phase.phaseNumber} • {flashcard.category}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400 px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                    {flashcard.difficulty}
                  </span>
                </div>

                <button
                  onClick={() => handleToggleMastery(flashcard.id)}
                  className={`text-xs px-3 py-1 rounded-lg font-mono flex items-center gap-1.5 transition-colors ${
                    isMastered
                      ? 'bg-emerald-500 text-black font-bold'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isMastered ? 'Mastered' : 'Mark Mastered'}</span>
                </button>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                {flashcard.question}
              </h3>

              <div>
                <button
                  onClick={() => handleToggleFlip(flashcard.id)}
                  className="px-4 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  {isFlipped ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{isFlipped ? 'Hide Answer' : 'Reveal High-Scoring Model Answer'}</span>
                </button>
              </div>

              {isFlipped && (
                <div className="mt-3 p-4 rounded-xl bg-[#060a12] border border-slate-800 space-y-3">
                  <div className="space-y-1">
                    <div className="text-[11px] font-mono font-bold text-emerald-400 uppercase">
                      Model Corporate Answer:
                    </div>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                      {flashcard.modelAnswer}
                    </p>
                  </div>

                  {/* Scoring Tips */}
                  <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 space-y-1">
                    <div className="text-[10px] font-mono text-cyan-400 font-bold uppercase">
                      Hiring Manager Key Evaluation Points:
                    </div>
                    <div className="space-y-0.5">
                      {flashcard.scoringTips.map((tip, i) => (
                        <div key={i} className="text-xs text-slate-300 flex items-start gap-1.5">
                          <span className="text-cyan-400">•</span>
                          <span>{tip}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-400 italic">
                    <strong>Context:</strong> {flashcard.corporateContext}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

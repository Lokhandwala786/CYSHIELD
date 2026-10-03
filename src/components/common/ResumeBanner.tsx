import React from 'react';
import { Bookmark, ArrowRight, CheckCircle2, Clock, Zap } from 'lucide-react';
import { Topic, Phase } from '../../types/curriculum';

interface ResumeBannerProps {
  lastTopic: Topic;
  phase: Phase;
  overallPercentage: number;
  completedCount: number;
  totalCount: number;
  onResume: (topicId: string) => void;
}

export const ResumeBanner: React.FC<ResumeBannerProps> = ({
  lastTopic,
  phase,
  overallPercentage,
  completedCount,
  totalCount,
  onResume,
}) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0d1c31] via-[#0f172a] to-[#0c1524] border border-cyan-500/30 p-5 sm:p-6 shadow-2xl mb-8">
      {/* Background cyber grid & glow */}
      <div className="absolute right-0 top-0 -mt-12 -mr-12 w-64 h-64 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
      <div className="absolute left-1/3 bottom-0 -mb-12 w-48 h-48 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
              <Bookmark className="w-3.5 h-3.5 fill-cyan-400 text-cyan-400" />
              LAST ACTIVE BOOKMARK
            </span>
            <span className="text-xs text-slate-400 font-mono">Phase {phase.phaseNumber}</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            {lastTopic.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl line-clamp-1">
            {lastTopic.subtitle}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 pt-1">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              ~{lastTopic.estimatedMinutes} mins
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              {completedCount} of {totalCount} completed ({overallPercentage}%)
            </span>
          </div>
        </div>

        {/* Action Button & Overall Progress Bar */}
        <div className="flex flex-col sm:items-end gap-3 shrink-0">
          <button
            onClick={() => onResume(lastTopic.id)}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>Resume Learning</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Mini progress bar */}
          <div className="w-full sm:w-48 space-y-1">
            <div className="flex justify-between text-[11px] font-mono text-slate-400">
              <span>Overall Progress</span>
              <span className="text-cyan-400 font-bold">{overallPercentage}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${overallPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

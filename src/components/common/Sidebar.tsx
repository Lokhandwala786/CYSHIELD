import React, { useState } from 'react';
import { ChevronDown, ChevronRight, CheckCircle2, Circle, Search, Layers, ShieldCheck, Terminal, Award } from 'lucide-react';
import { Phase, Topic } from '../../types/curriculum';

interface SidebarProps {
  phases: Phase[];
  selectedTopicId: string;
  completedTopicIds: string[];
  onSelectTopic: (topicId: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  phases,
  selectedTopicId,
  completedTopicIds,
  onSelectTopic,
  isOpen,
  onToggle,
}) => {
  const [search, setSearch] = useState('');
  const [expandedPhases, setExpandedPhases] = useState<Record<string, boolean>>({
    'phase-1': true,
    'phase-2': true,
    'phase-3': true,
    'phase-4': true,
    'phase-5': true,
  });

  const togglePhase = (phaseId: string) => {
    setExpandedPhases(prev => ({
      ...prev,
      [phaseId]: !prev[phaseId]
    }));
  };

  return (
    <aside className={`fixed inset-y-0 left-0 z-30 w-72 lg:w-80 bg-[#090d16] border-r border-slate-800 flex flex-col pt-16 transition-transform duration-300 lg:static lg:translate-x-0 ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    }`}>
      {/* Search Header */}
      <div className="p-3 border-b border-slate-800">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search topics, ports, KQL..."
            className="w-full bg-[#111827] text-slate-200 font-mono text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-800 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Curriculum Tree */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {phases.map(phase => {
          const isExpanded = expandedPhases[phase.id] !== false;
          const filteredTopics = phase.topics.filter(t => {
            if (!search) return true;
            const q = search.toLowerCase();
            return (
              t.title.toLowerCase().includes(q) ||
              t.subtitle.toLowerCase().includes(q)
            );
          });

          if (search && filteredTopics.length === 0) return null;

          const phaseCompletedCount = phase.topics.filter(t => completedTopicIds.includes(t.id)).length;
          const phasePercent = Math.round((phaseCompletedCount / phase.topics.length) * 100);

          return (
            <div key={phase.id} className="rounded-xl bg-slate-900/40 border border-slate-800/80 overflow-hidden">
              {/* Phase header accordion */}
              <button
                onClick={() => togglePhase(phase.id)}
                className="w-full px-3 py-2.5 flex items-center justify-between text-left hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                  <div className="truncate">
                    <div className="text-[10px] font-mono text-cyan-400 font-semibold uppercase tracking-wider">
                      Phase {phase.phaseNumber}
                    </div>
                    <div className="text-xs font-bold text-slate-200 truncate">
                      {phase.title}
                    </div>
                  </div>
                </div>
                <div className="text-[11px] font-mono text-slate-400 shrink-0 ml-2">
                  {phasePercent}%
                </div>
              </button>

              {/* Phase mini progress bar */}
              <div className="h-0.5 w-full bg-slate-800">
                <div
                  className="h-full bg-cyan-500 transition-all duration-300"
                  style={{ width: `${phasePercent}%` }}
                />
              </div>

              {/* Topics list */}
              {isExpanded && (
                <div className="p-1 space-y-0.5 border-t border-slate-800/40 bg-[#0a0e18]">
                  {filteredTopics.map(topic => {
                    const isSelected = selectedTopicId === topic.id;
                    const isCompleted = completedTopicIds.includes(topic.id);

                    return (
                      <button
                        key={topic.id}
                        onClick={() => {
                          onSelectTopic(topic.id);
                          if (window.innerWidth < 1024) onToggle();
                        }}
                        className={`w-full px-2.5 py-2 rounded-lg text-left text-xs flex items-start gap-2.5 transition-all ${
                          isSelected
                            ? 'bg-cyan-500/15 text-cyan-300 font-semibold border border-cyan-500/30'
                            : isCompleted
                            ? 'text-slate-300 hover:bg-slate-800/40 hover:text-white'
                            : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {isCompleted ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 fill-emerald-950" />
                          ) : isSelected ? (
                            <Circle className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />
                          ) : (
                            <Circle className="w-3.5 h-3.5 text-slate-600" />
                          )}
                        </div>
                        <div className="truncate flex-1">
                          <div className="truncate font-medium">{topic.title}</div>
                          <div className="text-[10px] text-slate-500 font-mono truncate">
                            {topic.estimatedMinutes}m • {topic.subtitle}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
};

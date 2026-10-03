import React, { useState } from 'react';
import { Terminal, Filter, AlertTriangle, CheckCircle2, Clock, Shield, Search, ArrowRight, User } from 'lucide-react';
import { CorporateIncident, Topic, Phase, UserProgressState, SeverityLevel } from '../../types/curriculum';
import { Badge } from '../common/Badge';

interface IncidentCenterProps {
  incidents: { incident: CorporateIncident; topic: Topic; phase: Phase }[];
  progress: UserProgressState;
  onSelectTopic: (topicId: string) => void;
}

export const IncidentCenter: React.FC<IncidentCenterProps> = ({
  incidents,
  progress,
  onSelectTopic,
}) => {
  const [filterSeverity, setFilterSeverity] = useState<SeverityLevel | 'ALL'>('ALL');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'RESOLVED' | 'OPEN'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredIncidents = incidents.filter(({ incident, topic }) => {
    if (filterSeverity !== 'ALL' && incident.severity !== filterSeverity) return false;
    const isSolved = !!progress.incidentSubmissions[incident.id];
    if (filterStatus === 'RESOLVED' && !isSolved) return false;
    if (filterStatus === 'OPEN' && isSolved) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        incident.ticketNumber.toLowerCase().includes(q) ||
        incident.title.toLowerCase().includes(q) ||
        incident.affectedAsset.toLowerCase().includes(q) ||
        topic.title.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const solvedCount = Object.keys(progress.incidentSubmissions).length;
  const totalCount = incidents.length;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-red-400">
            <Terminal className="w-4 h-4" />
            <span>ENTERPRISE SOC INCIDENT RESPONSE CENTER</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Active Security Incident Desk
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Real corporate security tickets generated from production SIEM, EDR, and Firewall alerts across 5 phases.
          </p>
        </div>

        {/* Triage Stats Counter */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-right">
            <span className="text-slate-400">Resolved Tickets:</span>
            <div className="text-lg font-bold text-emerald-400 mt-0.5">
              {solvedCount} / {totalCount}
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
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search tickets, assets, CVEs..."
            className="w-full bg-[#111827] text-slate-200 font-mono text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-800 focus:outline-none focus:border-red-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto text-xs font-mono">
          <span className="text-slate-500">Severity:</span>
          {(['ALL', 'Critical', 'High', 'Medium'] as const).map(sev => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-2.5 py-1 rounded ${
                filterSeverity === sev
                  ? 'bg-red-500 text-white font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {sev}
            </button>
          ))}

          <span className="text-slate-500 ml-2">Status:</span>
          {(['ALL', 'OPEN', 'RESOLVED'] as const).map(stat => (
            <button
              key={stat}
              onClick={() => setFilterStatus(stat)}
              className={`px-2.5 py-1 rounded ${
                filterStatus === stat
                  ? 'bg-cyan-500 text-black font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {stat}
            </button>
          ))}
        </div>
      </div>

      {/* Incident Ticket List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredIncidents.map(({ incident, topic, phase }) => {
          const submission = progress.incidentSubmissions[incident.id];
          const isResolved = !!submission;

          return (
            <div
              key={incident.id}
              className={`rounded-2xl border transition-all p-5 space-y-4 shadow-xl ${
                isResolved
                  ? 'bg-[#0a121d] border-emerald-500/30'
                  : 'bg-[#0d131f] border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-bold text-red-400">
                    {incident.ticketNumber}
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="text-xs text-slate-400 font-mono">Phase {phase.phaseNumber}</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-xs text-slate-400 font-mono">SLA: {incident.slaMinutes}m</span>
                </div>

                <div className="flex items-center gap-2">
                  <Badge severity={incident.severity} />
                  {isResolved ? (
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Resolved ({submission.score} XP)
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Open / Unassigned
                    </span>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white hover:text-cyan-300 transition-colors cursor-pointer" onClick={() => onSelectTopic(topic.id)}>
                  {incident.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed line-clamp-2">
                  {incident.summary}
                </p>
              </div>

              {/* MITRE Mapping Tags & Affected Asset */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-xs text-slate-400 font-mono">Asset: <strong className="text-slate-200">{incident.affectedAsset}</strong></span>
                  <span className="text-slate-600">•</span>
                  {incident.mitreTechniques.map((tech, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-purple-300 font-mono">
                      {tech}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => onSelectTopic(topic.id)}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs flex items-center gap-1.5 transition-colors shadow-lg shadow-cyan-500/20 shrink-0"
                >
                  <span>{isResolved ? 'Review Investigation' : 'Investigate & Contain'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

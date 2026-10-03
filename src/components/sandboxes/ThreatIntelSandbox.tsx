import React, { useState } from 'react';
import { Search, ShieldAlert, CheckCircle, Database, Tag, ExternalLink, Zap } from 'lucide-react';

interface IntelRecord {
  indicator: string;
  type: 'SHA256' | 'IP' | 'Domain';
  classification: 'Malicious' | 'Suspicious' | 'Benign';
  score: string;
  threatActor?: string;
  pyramidLevel: string;
  tags: string[];
  summary: string;
}

const INTEL_DB: IntelRecord[] = [
  {
    indicator: '8a3e7b2f4c9102bd5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d',
    type: 'SHA256',
    classification: 'Malicious',
    score: '68/72 Engines',
    threatActor: 'Cobalt Strike Team Server',
    pyramidLevel: 'Hash Values (Trivial)',
    tags: ['c2-beacon', 'malleable-c2', 'process-injection'],
    summary: 'Known Cobalt Strike beacon DLL configured with HTTP/S malleable profile. Connects to 198.51.100.77.'
  },
  {
    indicator: '198.51.100.88',
    type: 'IP',
    classification: 'Suspicious',
    score: '14/90 Engines',
    threatActor: 'Unknown Scanner / Botnet',
    pyramidLevel: 'IP Addresses (Easy)',
    tags: ['ssh-brute-force', 'fast-flux', 'bulletproof-vps'],
    summary: 'Hosting provider with known abuse complaints regarding automated horizontal port scans on Port 22 and 3389.'
  },
  {
    indicator: 'update-sync-services.top',
    type: 'Domain',
    classification: 'Malicious',
    score: '45/88 Engines',
    threatActor: 'APT29 (Suspected)',
    pyramidLevel: 'Domain Names (Simple)',
    tags: ['dns-tunneling', 'newly-registered-domain', 'c2-infrastructure'],
    summary: 'Dynamic DNS domain registered 48 hours ago used for high-entropy DNS tunneling and base64 exfiltration.'
  },
  {
    indicator: 'microsoft.com',
    type: 'Domain',
    classification: 'Benign',
    score: '0/92 Engines',
    pyramidLevel: 'Domain Names (Simple)',
    tags: ['verified-corporate', 'alexa-top-100'],
    summary: 'Legitimate corporate domain owned by Microsoft Corporation.'
  }
];

export const ThreatIntelSandbox: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('8a3e7b2f4c9102bd5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d');
  const [activeRecord, setActiveRecord] = useState<IntelRecord | null>(INTEL_DB[0]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchTerm.trim().toLowerCase();
    const found = INTEL_DB.find(rec => rec.indicator.toLowerCase().includes(query) || query.includes(rec.indicator.toLowerCase()));
    if (found) {
      setActiveRecord(found);
    } else {
      // Simulate live calculation for unlisted sample
      setActiveRecord({
        indicator: searchTerm,
        type: searchTerm.includes('.') && !searchTerm.includes(' ') ? (searchTerm.match(/^\d/) ? 'IP' : 'Domain') : 'SHA256',
        classification: 'Suspicious',
        score: '3/72 Engines (New / Unknown)',
        pyramidLevel: 'Hash Values (Trivial)',
        tags: ['unverified-hash', 'sandbox-detonating'],
        summary: 'Newly observed indicator with low historical telemetry. Behavior analysis recommended before whitelisting.'
      });
    }
  };

  return (
    <div className="bg-[#0b101b] border border-slate-800 rounded-xl overflow-hidden shadow-2xl font-sans">
      <div className="bg-[#0f172a] px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2 text-cyan-400 font-mono text-sm font-semibold">
          <Database className="w-4 h-4" />
          <span>Enterprise Threat Intelligence Platform & Hash Validator</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>Feed: AlienVault OTX & VirusTotal Mirror</span>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Search input */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search file hash (SHA256/MD5), IPv4 address, or domain name..."
              className="w-full bg-[#111827] text-cyan-300 font-mono text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-700 focus:outline-none focus:border-cyan-500"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs rounded-lg transition-colors"
          >
            Lookup IOC
          </button>
        </form>

        {/* Quick presets */}
        <div className="flex flex-wrap gap-1.5 text-xs font-mono">
          <span className="text-slate-500 self-center">Try indicators:</span>
          {INTEL_DB.map((rec, i) => (
            <button
              key={i}
              onClick={() => {
                setSearchTerm(rec.indicator);
                setActiveRecord(rec);
              }}
              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 truncate max-w-xs"
            >
              {rec.type}: {rec.indicator.slice(0, 16)}...
            </button>
          ))}
        </div>

        {/* Record Result */}
        {activeRecord && (
          <div className="bg-[#0d131f] rounded-xl border border-slate-800 p-4 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <span className="text-[11px] font-mono text-slate-400">Indicator Target:</span>
                <div className="font-mono text-xs font-bold text-slate-100 break-all select-all mt-0.5">
                  {activeRecord.indicator}
                </div>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase font-mono border ${
                  activeRecord.classification === 'Malicious'
                    ? 'bg-red-500/20 text-red-400 border-red-500/40'
                    : activeRecord.classification === 'Suspicious'
                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                    : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                }`}>
                  {activeRecord.classification}
                </span>
                <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-slate-800 text-cyan-300 border border-slate-700">
                  {activeRecord.score}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="bg-[#111827] p-3 rounded-lg border border-slate-800">
                <span className="text-slate-400 font-mono text-[11px]">Pyramid of Pain Mapping:</span>
                <div className="text-sm font-bold text-purple-400 mt-1 font-mono">{activeRecord.pyramidLevel}</div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Pain to Adversary if Blocked: {activeRecord.pyramidLevel.includes('Hash') ? 'Trivial (bypassed with single byte change)' : activeRecord.pyramidLevel.includes('IP') ? 'Easy (attacker rotates VPS in minutes)' : 'Simple (domain rotation)'}
                </div>
              </div>

              <div className="bg-[#111827] p-3 rounded-lg border border-slate-800">
                <span className="text-slate-400 font-mono text-[11px]">Associated Threat Actor:</span>
                <div className="text-sm font-bold text-red-400 mt-1">{activeRecord.threatActor || 'Unattributed'}</div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Campaign confidence: High (Correlated across 3 commercial feeds)
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-xs text-slate-400 font-mono">Sandbox Behavioral Tags:</span>
              <div className="flex flex-wrap gap-1.5">
                {activeRecord.tags.map((t, idx) => (
                  <span key={idx} className="flex items-center gap-1 px-2.5 py-0.5 rounded bg-slate-800 text-cyan-300 text-xs font-mono border border-slate-700">
                    <Tag className="w-3 h-3 text-cyan-400" />
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 leading-relaxed">
              <strong className="text-cyan-400">Analyst Summary: </strong>
              {activeRecord.summary}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { GitFork, CheckCircle, XCircle, AlertTriangle, Shield, Clock } from 'lucide-react';
import { TriageClassification, SeverityLevel } from '../../types/curriculum';

interface TriageCase {
  id: string;
  title: string;
  telemetry: string;
  context: string;
  assetCriticality: 'Tier 0' | 'Tier 1' | 'Tier 2' | 'Tier 3';
  correctClassification: TriageClassification;
  correctSeverity: SeverityLevel;
  rationale: string;
}

const CASES: TriageCase[] = [
  {
    id: 'tri-1',
    title: 'LSASS Memory Dump Alert on SQL-PROD-01',
    telemetry: 'Process: procdump64.exe -ma lsass.exe C:\\temp\\lsass.dmp | User: DB_Admin_Local | Time: 02:14:00 UTC',
    context: 'No approved Change Request found in ServiceNow. DBA denies running any diagnostics at 2 AM.',
    assetCriticality: 'Tier 0',
    correctClassification: 'True Positive',
    correctSeverity: 'Critical',
    rationale: 'Credential dumping against LSASS with ProcDump without authorization is a critical true positive compromise on a Tier 0 asset.'
  },
  {
    id: 'tri-2',
    title: 'Port Scan Alert from Internal IP 10.0.10.15',
    telemetry: 'Nessus vulnerability scanner IP 10.0.10.15 conducting full SYN scan on subnet 10.0.2.0/24',
    context: 'Change Request CHG-99201 approved for weekly automated vulnerability assessment.',
    assetCriticality: 'Tier 2',
    correctClassification: 'Benign True Positive',
    correctSeverity: 'Low',
    rationale: 'The scanner matched the port scan rule correctly, but activity is verified by an active approved Change Request.'
  },
  {
    id: 'tri-3',
    title: 'Suspicious PowerShell Execution Alert on HR Laptop',
    telemetry: 'powershell.exe -ExecutionPolicy Bypass -File C:\\Program Files\\ITAssetManager\\inventory.ps1',
    context: 'Verified corporate asset inventory script digitally signed by Internal IT CA.',
    assetCriticality: 'Tier 2',
    correctClassification: 'False Positive',
    correctSeverity: 'Medium',
    rationale: 'Legitimate signed internal enterprise inventory script flagged by generic PowerShell rule; needs rule tuning.'
  }
];

export const TriageTreeSandbox: React.FC = () => {
  const [selectedCase, setSelectedCase] = useState<TriageCase>(CASES[0]);
  const [userClassification, setUserClassification] = useState<TriageClassification | null>(null);
  const [userSeverity, setUserSeverity] = useState<SeverityLevel | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const isClassificationCorrect = userClassification === selectedCase.correctClassification;
  const isSeverityCorrect = userSeverity === selectedCase.correctSeverity;

  const handleSelectCase = (c: TriageCase) => {
    setSelectedCase(c);
    setUserClassification(null);
    setUserSeverity(null);
    setSubmitted(false);
  };

  return (
    <div className="bg-[#0b101b] border border-slate-800 rounded-xl overflow-hidden shadow-2xl font-sans">
      <div className="bg-[#0f172a] px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2 text-cyan-400 font-mono text-sm font-semibold">
          <GitFork className="w-4 h-4" />
          <span>Interactive SOC Triage Decision Tree & Severity Calculator</span>
        </div>
        <div className="text-xs text-slate-400">
          Case {CASES.findIndex(c => c.id === selectedCase.id) + 1} of {CASES.length}
        </div>
      </div>

      {/* Case Switcher */}
      <div className="p-3 bg-[#0a0d14] border-b border-slate-800 flex gap-2">
        {CASES.map(c => (
          <button
            key={c.id}
            onClick={() => handleSelectCase(c)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all text-left truncate flex-1 border ${
              selectedCase.id === c.id
                ? 'bg-cyan-950/80 border-cyan-500 text-cyan-200'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {c.title}
          </button>
        ))}
      </div>

      <div className="p-4 space-y-4">
        {/* Scenario Details */}
        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm text-slate-100">{selectedCase.title}</span>
            <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Asset: {selectedCase.assetCriticality}
            </span>
          </div>
          <div className="bg-[#050811] p-3 rounded font-mono text-xs text-cyan-300 border border-slate-800">
            {selectedCase.telemetry}
          </div>
          <div className="text-xs text-slate-300">
            <strong className="text-slate-400">Contextual Verification: </strong>
            {selectedCase.context}
          </div>
        </div>

        {/* Decision Gates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Step 1: Classification */}
          <div className="bg-[#0d131f] p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="text-xs font-mono uppercase font-bold text-cyan-400">
              Step 1: Determine Triage Classification
            </div>
            <div className="space-y-2">
              {(['True Positive', 'Benign True Positive', 'False Positive'] as TriageClassification[]).map(type => (
                <button
                  key={type}
                  onClick={() => {
                    setUserClassification(type);
                    setSubmitted(false);
                  }}
                  className={`w-full p-2.5 rounded-lg text-xs font-semibold text-left border transition-all ${
                    userClassification === type
                      ? type === 'True Positive'
                        ? 'bg-red-500/20 border-red-500 text-red-300'
                        : type === 'Benign True Positive'
                        ? 'bg-blue-500/20 border-blue-500 text-blue-300'
                        : 'bg-amber-500/20 border-amber-500 text-amber-300'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="font-bold">{type}</div>
                  <div className="text-[11px] font-normal text-slate-400 mt-0.5">
                    {type === 'True Positive' && 'Confirmed malicious / unauthorized activity requiring active containment.'}
                    {type === 'Benign True Positive' && 'Rule matched authorized legitimate activity (verified CR or pentest).'}
                    {type === 'False Positive' && 'Rule misfire on normal harmless software; requires rule tuning.'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Severity / SLA */}
          <div className="bg-[#0d131f] p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="text-xs font-mono uppercase font-bold text-cyan-400">
              Step 2: Assign Incident Severity & SLA
            </div>
            <div className="space-y-2">
              {(['Critical', 'High', 'Medium', 'Low'] as SeverityLevel[]).map(sev => (
                <button
                  key={sev}
                  onClick={() => {
                    setUserSeverity(sev);
                    setSubmitted(false);
                  }}
                  className={`w-full p-2.5 rounded-lg text-xs font-semibold text-left border transition-all ${
                    userSeverity === sev
                      ? 'bg-cyan-500/20 border-cyan-500 text-cyan-200'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold">{sev} Priority</span>
                    <span className="text-[11px] font-mono text-slate-400">
                      SLA: {sev === 'Critical' ? '15 mins' : sev === 'High' ? '30 mins' : sev === 'Medium' ? '2 hours' : '24 hours'}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Submit & Result */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            disabled={!userClassification || !userSeverity}
            onClick={() => setSubmitted(true)}
            className="w-full sm:w-auto px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-800 disabled:text-slate-600 text-black font-bold text-xs rounded-lg transition-colors"
          >
            Submit Triage Decision
          </button>

          {submitted && (
            <div className={`p-3 rounded-lg border text-xs flex-1 ${
              isClassificationCorrect && isSeverityCorrect
                ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-200'
                : 'bg-red-950/60 border-red-500/60 text-red-200'
            }`}>
              <div className="font-bold flex items-center gap-1.5">
                {isClassificationCorrect && isSeverityCorrect ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    Correct Triage Assessment!
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-red-400" />
                    Correction Required
                  </>
                )}
              </div>
              <div className="mt-1 text-[11px] opacity-90">{selectedCase.rationale}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

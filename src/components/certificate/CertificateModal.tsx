import React, { useEffect, useRef } from 'react';
import { Award, Shield, CheckCircle2, Download, Printer, Share2, Sparkles, ExternalLink } from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserProgressState } from '../../types/curriculum';

interface CertificateModalProps {
  progress: UserProgressState;
  totalTopics: number;
  onClose?: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  progress,
  totalTopics,
  onClose,
}) => {
  const completedCount = progress.completedTopics.length;
  const overallPercentage = Math.round((completedCount / totalTopics) * 100);
  const isEligible = overallPercentage >= 75; // 75%+ or all topics
  const certRef = useRef<HTMLDivElement>(null);

  // Verification Hash Simulation based on User name and timestamp
  const issueDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const certId = `CS-SOC-${Math.abs(
    (progress.userName || 'Analyst').split('').reduce((acc, c) => acc + c.charCodeAt(0), 1337)
  ).toString(16).toUpperCase()}-2026`;

  useEffect(() => {
    if (isEligible) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  }, [isEligible]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400">
            <Award className="w-4 h-4" />
            <span>ENTERPRISE SOC DEFENSE CREDENTIAL</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Certificate of Achievement
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Official recognition of demonstrated proficiency in Enterprise SOC Operations, Network Forensics, and Cloud Defense.
          </p>
        </div>

        {isEligible && (
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors shadow-lg shadow-cyan-500/20"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
          </div>
        )}
      </div>

      {!isEligible ? (
        <div className="p-8 rounded-2xl bg-[#0d131f] border border-amber-500/40 text-center space-y-4 shadow-xl">
          <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
            <Award className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white">Certification Milestone in Progress</h2>
          <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
            You have completed <strong>{completedCount} of {totalTopics}</strong> modules ({overallPercentage}%). Complete at least 75% of the curriculum topics to unlock your official verified certificate!
          </p>
          <div className="max-w-xs mx-auto space-y-1 pt-2">
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-cyan-500 rounded-full transition-all duration-500"
                style={{ width: `${overallPercentage}%` }}
              />
            </div>
            <div className="text-xs font-mono text-slate-400 text-right">{overallPercentage}% achieved</div>
          </div>
        </div>
      ) : (
        /* The Printable Certificate Component */
        <div
          ref={certRef}
          className="relative bg-gradient-to-br from-[#0c1424] via-[#090e1a] to-[#070b14] border-4 border-cyan-500/40 rounded-3xl p-8 sm:p-12 shadow-2xl text-center space-y-8 overflow-hidden print:bg-white print:text-black print:border-black"
        >
          {/* Decorative Corner Seals */}
          <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-cyan-400/50 rounded-tl-xl pointer-events-none" />
          <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-cyan-400/50 rounded-tr-xl pointer-events-none" />
          <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-cyan-400/50 rounded-bl-xl pointer-events-none" />
          <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-cyan-400/50 rounded-br-xl pointer-events-none" />

          {/* Crest */}
          <div className="space-y-3">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-cyan-600 via-cyan-500 to-emerald-400 mx-auto flex items-center justify-center shadow-xl shadow-cyan-500/20">
              <Shield className="w-12 h-12 text-black stroke-[2.5]" />
            </div>
            <div className="text-xs font-mono tracking-widest text-cyan-400 uppercase font-bold">
              CyShield Enterprise Cyber Defense Academy
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight uppercase">
              Certified SOC Defense Analyst
            </h2>
            <p className="text-xs font-mono text-slate-400">
              Credential ID: <span className="text-cyan-300 font-bold">{certId}</span>
            </p>
          </div>

          <div className="space-y-1">
            <div className="text-xs text-slate-400 uppercase font-mono">This credential certifies that</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-cyan-300 tracking-tight underline decoration-cyan-500 decoration-2 underline-offset-8">
              {progress.userName || 'Cyber Analyst'}
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Has successfully completed rigorous hands-on enterprise simulation training encompassing Core Networking & Operating System Telemetry, SIEM SPL/KQL Detection Engineering, Alert Triage Decision Trees, MITRE ATT&CK Mapping, Incident Response under NIST SP 800-61 r2, OWASP Web Defense, and AWS Cloud Security Architecture.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800 text-xs font-mono">
            <div>
              <span className="text-slate-500 block">Date of Issue</span>
              <span className="text-slate-200 font-semibold">{issueDate}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Verification Status</span>
              <span className="text-emerald-400 font-semibold flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Verified Active
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Demonstrated Performance</span>
              <span className="text-cyan-400 font-semibold">{progress.xp} Total XP</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

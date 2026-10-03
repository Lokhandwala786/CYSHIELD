import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, ArrowRight, RotateCcw, CheckCircle2, XCircle } from 'lucide-react';

interface IrStep {
  phase: string;
  scenario: string;
  question: string;
  options: {
    text: string;
    isCorrect: boolean;
    feedback: string;
  }[];
}

const IR_STEPS: IrStep[] = [
  {
    phase: '1. Detection & Identification',
    scenario: 'Alert fires: Endpoint FIN-WS-02 is rapidly renaming files to `.locked` on shared network share `\\\\NAS\\Finance` at 500 files/sec. EDR agent is online and responsive.',
    question: 'What is your immediate tactical action as the Tier 1/2 responder?',
    options: [
      {
        text: 'Physically sprint to the office and rip the power cord out of the computer.',
        isCorrect: false,
        feedback: 'Violates Order of Volatility: Powering off flushes volatile RAM, destroying ransomware decryption keys, active network socket states, and malware process memory.'
      },
      {
        text: 'Issue an immediate EDR Network Isolation command from your cloud console.',
        isCorrect: true,
        feedback: 'Correct! EDR network isolation immediately cuts off SMB encryption across the network while keeping the secure EDR management tunnel open for memory capture and live forensic triage.'
      },
      {
        text: 'Email the finance employee asking if they started a bulk file archive.',
        isCorrect: false,
        feedback: 'Too slow: At 500 files/sec, waiting for an email response results in thousands of business-critical spreadsheets getting permanently encrypted.'
      }
    ]
  },
  {
    phase: '2. Containment (Identity & Scope)',
    scenario: 'FIN-WS-02 is successfully network-isolated. Active Directory telemetry reveals the compromised account `jmartinez` also initiated active sessions on the primary backup storage console 12 minutes ago.',
    question: 'How do you contain the identity threat across the Active Directory domain?',
    options: [
      {
        text: 'Immediately disable the Active Directory user account `jmartinez` and revoke all active Kerberos TGT tickets across all Domain Controllers.',
        isCorrect: true,
        feedback: 'Correct! Disabling the user account and purging Kerberos tickets halts any active or queued authenticated access across the enterprise.'
      },
      {
        text: 'Permanently delete the user account from Active Directory.',
        isCorrect: false,
        feedback: 'Deleting the account destroys the user SID and object history, complicating subsequent forensic log correlation.'
      },
      {
        text: 'Wait until the end of the business day to avoid interrupting user workflow.',
        isCorrect: false,
        feedback: 'Ransomware actors use backup server access to delete shadow copies and destroy backups before demanding ransoms.'
      }
    ]
  },
  {
    phase: '3. Eradication & Remediation',
    scenario: 'The threat actor left persistent scheduled tasks and backdoors on the compromised machine.',
    question: 'What is the corporate enterprise standard for eradicating malware on the affected host?',
    options: [
      {
        text: 'Re-image the computer from clean, verified gold image or restore bare-metal from pre-incident offline backups.',
        isCorrect: true,
        feedback: 'Correct! In enterprise incident response, attempting to manually delete individual malware files often leaves hidden rootkits or scheduled tasks behind. Full re-imaging from a trusted baseline is mandatory.'
      },
      {
        text: 'Run standard free antivirus quick scan and hand the laptop back to the user.',
        isCorrect: false,
        feedback: 'Standard AV scans cannot guarantee removal of kernel-level rootkits, living-off-the-land registry persistence, or modified system binaries.'
      }
    ]
  }
];

export const NistIrSandbox: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);

  const step = IR_STEPS[currentStepIndex];

  const handleSelectOption = (idx: number) => {
    setSelectedOption(idx);
    setHasAnswered(true);
  };

  const handleNext = () => {
    if (currentStepIndex < IR_STEPS.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      setSelectedOption(null);
      setHasAnswered(false);
    }
  };

  const handleReset = () => {
    setCurrentStepIndex(0);
    setSelectedOption(null);
    setHasAnswered(false);
  };

  return (
    <div className="bg-[#0b101b] border border-slate-800 rounded-xl overflow-hidden shadow-2xl font-sans">
      <div className="bg-[#0f172a] px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2 text-cyan-400 font-mono text-sm font-semibold">
          <ShieldCheck className="w-4 h-4" />
          <span>NIST SP 800-61 r2 Incident Response Simulation Lab</span>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-white"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Lab
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Progress indicator */}
        <div className="flex items-center gap-2">
          {IR_STEPS.map((s, idx) => (
            <div
              key={idx}
              className={`h-1.5 flex-1 rounded-full transition-all ${
                idx === currentStepIndex
                  ? 'bg-cyan-400'
                  : idx < currentStepIndex
                  ? 'bg-emerald-500'
                  : 'bg-slate-800'
              }`}
            />
          ))}
        </div>

        {/* Phase Header */}
        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-2">
          <div className="text-xs font-mono uppercase font-bold text-cyan-400">
            Current Phase: {step.phase}
          </div>
          <div className="text-xs text-slate-200 leading-relaxed bg-[#050811] p-3 rounded border border-slate-800 font-mono">
            {step.scenario}
          </div>
          <div className="text-sm font-bold text-white pt-1">
            {step.question}
          </div>
        </div>

        {/* Options */}
        <div className="space-y-2">
          {step.options.map((opt, idx) => {
            const isSelected = selectedOption === idx;
            return (
              <button
                key={idx}
                disabled={hasAnswered}
                onClick={() => handleSelectOption(idx)}
                className={`w-full p-3.5 rounded-xl border text-left text-xs font-semibold transition-all ${
                  isSelected
                    ? opt.isCorrect
                      ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                      : 'bg-red-950/60 border-red-500 text-red-200'
                    : hasAnswered && opt.isCorrect
                    ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-300'
                    : 'bg-[#111827] border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start gap-2">
                  <span className="font-mono text-cyan-400 shrink-0">{String.fromCharCode(65 + idx)}.</span>
                  <span>{opt.text}</span>
                </div>

                {hasAnswered && isSelected && (
                  <div className={`mt-2 p-2 rounded text-[11px] leading-relaxed font-sans ${
                    opt.isCorrect ? 'bg-emerald-900/40 text-emerald-300' : 'bg-red-900/40 text-red-300'
                  }`}>
                    {opt.feedback}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Next Step Button */}
        {hasAnswered && (
          <div className="flex justify-end pt-2">
            {currentStepIndex < IR_STEPS.length - 1 ? (
              <button
                onClick={handleNext}
                className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs rounded-lg flex items-center gap-1.5 transition-colors"
              >
                Proceed to Next Phase
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <div className="p-3 bg-emerald-950/60 border border-emerald-500/60 rounded-lg text-emerald-200 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Incident Lifecycle Successfully Contained & Remediated according to NIST SP 800-61 r2!
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Grid, Shield, ExternalLink, Info, CheckCircle2, ChevronRight } from 'lucide-react';

interface TechniqueDetail {
  id: string;
  name: string;
  tactic: string;
  description: string;
  subTechniques: string[];
  detectionSources: string[];
  threatActors: string[];
}

const TECHNIQUES_DATA: Record<string, TechniqueDetail> = {
  'T1566': {
    id: 'T1566',
    name: 'Phishing',
    tactic: 'Initial Access (TA0001)',
    description: 'Adversaries send malicious emails, links, or attachments to gain initial code execution or steal user credentials.',
    subTechniques: ['T1566.001 - Spearphishing Attachment', 'T1566.002 - Spearphishing Link', 'T1566.003 - Spearphishing via Service'],
    detectionSources: ['Email Gateway Logs', 'Web Proxy Telemetry', 'File Creation in %TEMP%'],
    threatActors: ['APT28 (Fancy Bear)', 'FIN7', 'Lazarus Group', 'Wizard Spider']
  },
  'T1059': {
    id: 'T1059',
    name: 'Command and Scripting Interpreter',
    tactic: 'Execution (TA0002)',
    description: 'Adversaries abuse local interpreters like PowerShell, Windows Command Shell (cmd), Unix Shell (bash), or Python to execute commands and malicious payloads.',
    subTechniques: ['T1059.001 - PowerShell', 'T1059.003 - Windows Command Shell', 'T1059.004 - Unix Shell'],
    detectionSources: ['Event ID 4688 with CLI Auditing', 'Sysmon Event 1', 'PowerShell Script Block Logging (Event 4104)'],
    threatActors: ['APT29 (Cozy Bear)', 'BlackCat/ALPHV', 'LockBit']
  },
  'T1543': {
    id: 'T1543',
    name: 'Create or Modify System Process',
    tactic: 'Persistence (TA0003)',
    description: 'Adversaries create or modify system services, daemons, or systemd units to repeatedly execute malicious payloads during startup.',
    subTechniques: ['T1543.003 - Windows Service', 'T1543.002 - systemd Service', 'T1543.001 - Launch Agent'],
    detectionSources: ['Windows System Event 7045', 'Registry key HKLM\\SYSTEM\\CurrentControlSet\\Services', '/etc/systemd/system/'],
    threatActors: ['Turla', 'OilRig', 'Sandworm']
  },
  'T1003': {
    id: 'T1003',
    name: 'OS Credential Dumping',
    tactic: 'Credential Access (TA0006)',
    description: 'Adversaries dump credentials from the operating system memory, LSASS process, or SAM registry hive to obtain plaintext passwords and NTLM/Kerberos ticket hashes.',
    subTechniques: ['T1003.001 - LSASS Memory', 'T1003.002 - Security Account Manager (SAM)', 'T1003.003 - LSA Secrets'],
    detectionSources: ['Sysmon Event 10 (ProcessAccess to lsass.exe)', 'EDR Memory Scanners', 'ProcDump / Mimikatz signatures'],
    threatActors: ['APT41', 'Carbanak', 'LAPSUS$']
  },
  'T1021': {
    id: 'T1021',
    name: 'Remote Services',
    tactic: 'Lateral Movement (TA0008)',
    description: 'Adversaries use valid credentials to log into remote services such as SMB/Admin Shares, RDP, or SSH to pivot across internal networks.',
    subTechniques: ['T1021.001 - Remote Desktop Protocol (RDP)', 'T1021.002 - SMB/Windows Admin Shares', 'T1021.004 - SSH'],
    detectionSources: ['Event ID 4624 (Logon Type 3 or 10)', 'Network connection logs on ports 445 and 3389'],
    threatActors: ['FIN6', 'APT33', 'Conti']
  },
  'T1071': {
    id: 'T1071',
    name: 'Application Layer Protocol',
    tactic: 'Command and Control (TA0011)',
    description: 'Adversaries communicate with their command and control infrastructure using standard enterprise protocols such as HTTPS or DNS to blend with normal traffic.',
    subTechniques: ['T1071.001 - Web Protocols (HTTP/HTTPS)', 'T1071.004 - DNS', 'T1071.002 - File Transfer Protocols'],
    detectionSources: ['Web Proxy Access Logs', 'TLS Certificate Fingerprinting (JA3/JA3S)', 'DNS Query Logs with Shannon Entropy'],
    threatActors: ['APT29', 'Cobalt Group', 'Emotet']
  }
};

export const MitreNavigatorSandbox: React.FC = () => {
  const [selectedTechniqueId, setSelectedTechniqueId] = useState<string>('T1003');

  const selected = TECHNIQUES_DATA[selectedTechniqueId] || TECHNIQUES_DATA['T1003'];

  return (
    <div className="bg-[#0b101b] border border-slate-800 rounded-xl overflow-hidden shadow-2xl font-sans">
      <div className="bg-[#0f172a] px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2 text-cyan-400 font-mono text-sm font-semibold">
          <Grid className="w-4 h-4" />
          <span>Interactive MITRE ATT&CK Matrix Navigator & Technique Mapper</span>
        </div>
        <div className="text-xs text-slate-400 font-mono">
          Enterprise Matrix v14
        </div>
      </div>

      {/* Grid of Core Tactics / Techniques */}
      <div className="p-4 border-b border-slate-800">
        <div className="text-xs text-slate-400 mb-3">
          Select an adversary technique to inspect real-world sub-techniques, detection telemetry, and threat actor procedures:
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          {Object.values(TECHNIQUES_DATA).map(tech => {
            const isSelected = selectedTechniqueId === tech.id;
            return (
              <button
                key={tech.id}
                onClick={() => setSelectedTechniqueId(tech.id)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-purple-950/80 border-purple-500 shadow-lg text-purple-200 ring-1 ring-purple-500/50'
                    : 'bg-[#111827] border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40'
                }`}
              >
                <div className="font-mono text-xs font-bold text-cyan-400">{tech.id}</div>
                <div className="font-bold text-xs mt-1 truncate">{tech.name}</div>
                <div className="text-[10px] text-slate-400 mt-1 truncate">{tech.tactic.split(' ')[0]}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Technique Detail Drawer */}
      <div className="p-4 bg-[#0d131f] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <div className="text-xs font-mono text-purple-400 uppercase font-bold tracking-wider">
              {selected.tactic}
            </div>
            <div className="text-lg font-bold text-slate-100 flex items-center gap-2 mt-0.5">
              <span>{selected.name}</span>
              <span className="font-mono text-sm px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                {selected.id}
              </span>
            </div>
          </div>
          <a
            href={`https://attack.mitre.org/techniques/${selected.id}/`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs font-mono text-cyan-400 hover:text-cyan-300 self-start sm:self-auto"
          >
            <span>View on MITRE Org</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          {selected.description}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          {/* Sub-techniques */}
          <div className="bg-[#111827] p-3 rounded-lg border border-slate-800 space-y-2">
            <div className="text-xs font-mono text-cyan-400 font-bold uppercase">Sub-Techniques</div>
            <div className="space-y-1">
              {selected.subTechniques.map((sub, i) => (
                <div key={i} className="text-xs text-slate-300 flex items-start gap-1.5">
                  <span className="text-cyan-500">•</span>
                  <span>{sub}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Detection Telemetry */}
          <div className="bg-[#111827] p-3 rounded-lg border border-slate-800 space-y-2">
            <div className="text-xs font-mono text-emerald-400 font-bold uppercase">SOC Detection Telemetry</div>
            <div className="space-y-1">
              {selected.detectionSources.map((ds, i) => (
                <div key={i} className="text-xs text-slate-300 flex items-start gap-1.5">
                  <span className="text-emerald-500">✓</span>
                  <span>{ds}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Threat Actors */}
          <div className="bg-[#111827] p-3 rounded-lg border border-slate-800 space-y-2">
            <div className="text-xs font-mono text-red-400 font-bold uppercase">Associated Threat Actors</div>
            <div className="flex flex-wrap gap-1.5">
              {selected.threatActors.map((actor, i) => (
                <span key={i} className="text-[11px] px-2 py-0.5 rounded bg-red-950/50 border border-red-800/60 text-red-300 font-mono">
                  {actor}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Network, Activity, AlertTriangle, ShieldCheck, Zap, ArrowRight } from 'lucide-react';

export const PortsSandbox: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dns' | 'ports'>('dns');
  const [testSubdomain, setTestSubdomain] = useState('a8f4c9102b3e819d.exfil.evil-c2-corp.top');
  const [selectedPort, setSelectedPort] = useState(53);

  // Shannon Entropy calculation for string randomness
  const calculateEntropy = (str: string): number => {
    const clean = str.replace(/[^a-zA-Z0-9]/g, '');
    if (!clean) return 0;
    const len = clean.length;
    const frequencies: Record<string, number> = {};
    for (const char of clean) {
      frequencies[char] = (frequencies[char] || 0) + 1;
    }
    return -Object.values(frequencies).reduce((sum, count) => {
      const p = count / len;
      return sum + p * Math.log2(p);
    }, 0);
  };

  const entropy = calculateEntropy(testSubdomain.split('.')[0] || '');
  const isHighEntropy = entropy > 3.8;
  const isSuspiciousLength = (testSubdomain.split('.')[0] || '').length > 25;
  const isDnsTunneling = isHighEntropy || isSuspiciousLength;

  const portProfiles = [
    { port: 21, service: 'FTP', risk: 'High', threat: 'Cleartext credential transmission, anonymous write abuse', filter: 'tcp.port == 21' },
    { port: 22, service: 'SSH', risk: 'Medium', threat: 'Brute-force credential spraying, unauthorized SSH tunneling/pivoting', filter: 'tcp.port == 22' },
    { port: 53, service: 'DNS', risk: 'Critical', threat: 'DNS Tunneling data exfiltration, DGA botnet C2 command routing', filter: 'udp.port == 53' },
    { port: 80, service: 'HTTP', risk: 'Medium', threat: 'Unencrypted cleartext traffic, webshell access, reverse HTTP shells', filter: 'tcp.port == 80' },
    { port: 88, service: 'Kerberos', risk: 'High', threat: 'Kerberoasting (TGS-REQ RC4 extraction), AS-REP roasting ticket theft', filter: 'tcp.port == 88' },
    { port: 389, service: 'LDAP', risk: 'High', threat: 'Active Directory domain reconnaissance via BloodHound, cleartext creds', filter: 'tcp.port == 389' },
    { port: 445, service: 'SMB', risk: 'Critical', threat: 'PsExec remote execution, EternalBlue (MS17-010), Pass-the-Hash', filter: 'tcp.port == 445' },
    { port: 3389, service: 'RDP', risk: 'Critical', threat: 'Direct brute force, BlueKeep (CVE-2019-0708), interactive ransomware deployment', filter: 'tcp.port == 3389' },
  ];

  return (
    <div className="bg-[#0b101b] border border-slate-800 rounded-xl overflow-hidden shadow-2xl font-sans">
      <div className="bg-[#0f172a] px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2 text-cyan-400 font-mono text-sm font-semibold">
          <Network className="w-4 h-4" />
          <span>Enterprise Protocol Surface & DNS Tunneling Inspector</span>
        </div>
        <div className="flex space-x-1">
          <button
            onClick={() => setActiveTab('dns')}
            className={`px-3 py-1 text-xs rounded font-medium transition-colors ${
              activeTab === 'dns' ? 'bg-cyan-500 text-black font-semibold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Port 53 (DNS Tunneling Lab)
          </button>
          <button
            onClick={() => setActiveTab('ports')}
            className={`px-3 py-1 text-xs rounded font-medium transition-colors ${
              activeTab === 'ports' ? 'bg-cyan-500 text-black font-semibold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            High-Risk Port Matrix
          </button>
        </div>
      </div>

      <div className="p-4">
        {activeTab === 'dns' ? (
          <div className="space-y-4">
            <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 text-xs text-slate-300 leading-relaxed">
              <span className="text-cyan-400 font-bold">DNS Tunneling Detection Engine: </span>
              Adversaries smuggle stolen data or C2 commands inside DNS queries because firewalls rarely block Port 53.
              This analyzer computes the <strong>Shannon Entropy</strong> (randomness) and length of the requested subdomain.
            </div>

            <div className="space-y-2">
              <label className="text-xs text-slate-400 font-mono">Test Inbound DNS Query String:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={testSubdomain}
                  onChange={e => setTestSubdomain(e.target.value)}
                  className="w-full bg-[#111827] text-cyan-300 font-mono text-xs px-3 py-2 rounded border border-slate-700 focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Preset buttons */}
              <div className="flex flex-wrap gap-2 pt-1 text-xs">
                <span className="text-slate-500 text-xs self-center">Try presets:</span>
                <button
                  onClick={() => setTestSubdomain('a8f4c9102b3e819d44c9b1a0.exfil.evil-c2-corp.top')}
                  className="px-2 py-1 rounded bg-red-950/60 border border-red-800 text-red-300 text-xs font-mono hover:bg-red-900/60"
                >
                  Cobalt Strike DNS Beacon (Malicious)
                </button>
                <button
                  onClick={() => setTestSubdomain('cGFzc3dvcmRfaGFzaGVzX2V4ZmM.tunnel.dnscat2.net')}
                  className="px-2 py-1 rounded bg-red-950/60 border border-red-800 text-red-300 text-xs font-mono hover:bg-red-900/60"
                >
                  Base64 Data Exfiltration (Malicious)
                </button>
                <button
                  onClick={() => setTestSubdomain('autodiscover.enterprise-corp.com')}
                  className="px-2 py-1 rounded bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs font-mono hover:bg-emerald-900/60"
                >
                  Legitimate Outlook Query (Benign)
                </button>
                <button
                  onClick={() => setTestSubdomain('api.github.com')}
                  className="px-2 py-1 rounded bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs font-mono hover:bg-emerald-900/60"
                >
                  Legitimate GitHub API (Benign)
                </button>
              </div>
            </div>

            {/* Live Analytics Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
              <div className="bg-[#111827] p-3 rounded-lg border border-slate-800">
                <div className="text-slate-400 text-xs font-mono">Subdomain Shannon Entropy</div>
                <div className="text-2xl font-bold font-mono text-cyan-400 mt-1">
                  {entropy.toFixed(3)} <span className="text-xs text-slate-500">/ 5.0</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Threshold: &gt; 3.8 indicates encrypted / base64 payload
                </div>
              </div>

              <div className="bg-[#111827] p-3 rounded-lg border border-slate-800">
                <div className="text-slate-400 text-xs font-mono">Subdomain Character Length</div>
                <div className="text-2xl font-bold font-mono text-amber-400 mt-1">
                  {(testSubdomain.split('.')[0] || '').length} <span className="text-xs text-slate-500">chars</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Threshold: &gt; 25 chars signals tunneled data payload
                </div>
              </div>

              <div className={`p-3 rounded-lg border flex flex-col justify-between ${
                isDnsTunneling ? 'bg-red-950/50 border-red-500/50 text-red-200' : 'bg-emerald-950/50 border-emerald-500/50 text-emerald-200'
              }`}>
                <div>
                  <div className="text-xs font-mono uppercase font-semibold flex items-center gap-1.5">
                    {isDnsTunneling ? <AlertTriangle className="w-4 h-4 text-red-400" /> : <ShieldCheck className="w-4 h-4 text-emerald-400" />}
                    SIEM Rule Verdict
                  </div>
                  <div className="font-bold text-sm mt-1">
                    {isDnsTunneling ? 'ALERT: DNS Tunneling Exfiltration' : 'NORMAL: Standard Recursive DNS'}
                  </div>
                </div>
                <div className="text-[11px] mt-2 opacity-90">
                  {isDnsTunneling ? 'Action: Block at DNS Resolver & Quarantine Endpoint' : 'Action: Pass query normally'}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="text-xs text-slate-400 mb-2">
              Select an enterprise port to view threat profile and recommended monitoring rules:
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {portProfiles.map(p => (
                <button
                  key={p.port}
                  onClick={() => setSelectedPort(p.port)}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    selectedPort === p.port
                      ? 'bg-cyan-950/80 border-cyan-500 shadow-lg'
                      : 'bg-[#111827] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm font-bold text-white">Port {p.port}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                      p.risk === 'Critical' ? 'bg-red-500/20 text-red-400' : p.risk === 'High' ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {p.risk}
                    </span>
                  </div>
                  <div className="text-xs text-cyan-400 font-semibold mt-1">{p.service}</div>
                </button>
              ))}
            </div>

            {/* Port Deep Dive Card */}
            {(() => {
              const current = portProfiles.find(p => p.port === selectedPort)!;
              return (
                <div className="mt-4 p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-mono text-cyan-400 font-bold text-sm">
                      Port {current.port} ({current.service}) Enterprise Threat Profile
                    </span>
                    <span className="font-mono text-xs text-slate-400">Filter: {current.filter}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed pt-1">
                    <strong className="text-red-400">Primary Attack Vector:</strong> {current.threat}
                  </p>
                  <div className="bg-[#0b101b] p-2.5 rounded border border-slate-800 text-xs font-mono text-emerald-400">
                    <span className="text-slate-500"># Recommended SOC Detection Rule:</span><br />
                    index=firewall dest_port={current.port} action=allowed | stats count by src_ip, dest_ip | where count &gt; 50
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Terminal, Send, Play, ShieldAlert, CheckCircle, RefreshCw } from 'lucide-react';

export const NmapSandbox: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'nmap' | 'burp'>('nmap');
  const [nmapCommand, setNmapCommand] = useState('nmap -sS -sV -p 22,80,443 10.0.2.15');
  const [nmapOutput, setNmapOutput] = useState<string | null>(null);

  // Burp Repeater state
  const [httpMethod, setHttpMethod] = useState('POST');
  const [httpPath, setHttpPath] = useState('/api/v1/transfer');
  const [requestHeaders, setRequestHeaders] = useState('Authorization: Bearer eyJhbGciOiJIUzI1Ni...\nContent-Type: application/json');
  const [requestBody, setRequestBody] = useState('{\n  "recipientAccount": "10029",\n  "amount": 500\n}');
  const [burpResponse, setBurpResponse] = useState<string | null>(null);

  const runNmap = () => {
    let output = `Starting Nmap 7.94 ( https://nmap.org ) at 2026-10-03 22:30 UTC\n`;
    if (nmapCommand.includes('-sS')) {
      output += `Initiating SYN Stealth Scan against 10.0.2.15 at 22:30:01\n`;
      output += `Scanning 10.0.2.15 [3 ports]\n`;
      output += `Discovered open port 80/tcp on 10.0.2.15\n`;
      output += `Discovered open port 443/tcp on 10.0.2.15\n`;
      output += `Discovered open port 22/tcp on 10.0.2.15\n`;
    }
    if (nmapCommand.includes('-sV')) {
      output += `Scanning 3 services on 10.0.2.15\n`;
      output += `Completed Service scan at 22:30:06, 3 services timed\n`;
    }
    output += `Nmap scan report for web-prod-01.corp.local (10.0.2.15)\nHost is up (0.00042s latency).\n\nPORT    STATE SERVICE  VERSION\n22/tcp  open  ssh      OpenSSH 8.9p1 Ubuntu 3ubuntu0.4 (Ubuntu Linux; protocol 2.0)\n80/tcp  open  http     Apache httpd 2.4.52 ((Ubuntu))\n443/tcp open  ssl/http Apache httpd 2.4.52 ((Ubuntu))\n\nService Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel\n\nNmap done: 1 IP address (1 host up) scanned in 6.42 seconds`;

    setNmapOutput(output);
  };

  const sendBurpRequest = () => {
    let resp = `HTTP/1.1 200 OK\nDate: Sat, 03 Oct 2026 22:31:00 GMT\nServer: Apache/2.4.52\nContent-Type: application/json\nContent-Length: 128\nConnection: keep-alive\n\n{\n  "status": "success",\n  "transactionId": "TX-990142",\n  "message": "Transferred $500 to account 10029",\n  "remainingBalance": 14200.50\n}`;
    setBurpResponse(resp);
  };

  return (
    <div className="bg-[#0b101b] border border-slate-800 rounded-xl overflow-hidden shadow-2xl font-sans">
      <div className="bg-[#0f172a] px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2 text-cyan-400 font-mono text-sm font-semibold">
          <Terminal className="w-4 h-4" />
          <span>Offensive Telemetry Simulator: Nmap & Burp Suite Repeater</span>
        </div>
        <div className="flex space-x-1">
          <button
            onClick={() => setActiveTab('nmap')}
            className={`px-3 py-1 text-xs rounded font-medium ${
              activeTab === 'nmap' ? 'bg-cyan-500 text-black font-semibold' : 'bg-slate-800 text-slate-300'
            }`}
          >
            Nmap Port Scanner
          </button>
          <button
            onClick={() => setActiveTab('burp')}
            className={`px-3 py-1 text-xs rounded font-medium ${
              activeTab === 'burp' ? 'bg-cyan-500 text-black font-semibold' : 'bg-slate-800 text-slate-300'
            }`}
          >
            Burp Suite Repeater
          </button>
        </div>
      </div>

      <div className="p-4">
        {activeTab === 'nmap' ? (
          <div className="space-y-3 font-mono text-xs">
            <div className="flex gap-2">
              <input
                type="text"
                value={nmapCommand}
                onChange={e => setNmapCommand(e.target.value)}
                className="w-full bg-[#111827] text-cyan-300 px-3 py-2 rounded-lg border border-slate-700 focus:outline-none focus:border-cyan-500"
              />
              <button
                onClick={runNmap}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-black font-bold rounded-lg flex items-center gap-1.5 shrink-0"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Scan
              </button>
            </div>

            {/* Presets */}
            <div className="flex flex-wrap gap-1.5 text-xs">
              <span className="text-slate-500 self-center">Presets:</span>
              <button
                onClick={() => setNmapCommand('nmap -sS -p 22,80,443 10.0.2.15')}
                className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 hover:text-white"
              >
                -sS (SYN Stealth)
              </button>
              <button
                onClick={() => setNmapCommand('nmap -sV -p 22,80,443 10.0.2.15')}
                className="px-2 py-0.5 rounded bg-slate-800 text-amber-300 hover:text-white"
              >
                -sV (Version Probe)
              </button>
              <button
                onClick={() => setNmapCommand('nmap -sC -sV -p 80,443 10.0.2.15')}
                className="px-2 py-0.5 rounded bg-slate-800 text-purple-300 hover:text-white"
              >
                -sC (Default Scripts)
              </button>
              <button
                onClick={() => setNmapCommand('nmap -A -T4 10.0.2.15')}
                className="px-2 py-0.5 rounded bg-slate-800 text-red-300 hover:text-white"
              >
                -A -T4 (Aggressive)
              </button>
            </div>

            <div className="bg-[#050811] p-3 rounded-lg border border-slate-800 text-slate-300 min-h-[160px] whitespace-pre-wrap leading-relaxed">
              {nmapOutput || '// Click "Scan" to execute Nmap command and view live terminal output...'}
            </div>

            <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-slate-400 text-xs">
              <span className="text-cyan-400 font-bold">SOC Detection Signatures: </span>
              Notice that <code className="text-cyan-300">-sV</code> and <code className="text-purple-300">-sC</code> establish full TCP connections and probe application banners, leaving visible user-agent strings and HTTP error traces in web server logs!
            </div>
          </div>
        ) : (
          <div className="space-y-4 font-mono text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Request Panel */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="font-bold text-cyan-400">Request [Burp Repeater]</span>
                  <button
                    onClick={sendBurpRequest}
                    className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded flex items-center gap-1.5 transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Send Request
                  </button>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={httpMethod}
                    onChange={e => setHttpMethod(e.target.value)}
                    className="w-20 bg-[#111827] text-amber-300 px-2 py-1.5 rounded border border-slate-700"
                  />
                  <input
                    type="text"
                    value={httpPath}
                    onChange={e => setHttpPath(e.target.value)}
                    className="w-full bg-[#111827] text-slate-200 px-3 py-1.5 rounded border border-slate-700"
                  />
                </div>
                <textarea
                  rows={4}
                  value={requestHeaders}
                  onChange={e => setRequestHeaders(e.target.value)}
                  className="w-full bg-[#111827] text-slate-300 p-2 rounded border border-slate-700 font-mono text-xs"
                />
                <textarea
                  rows={4}
                  value={requestBody}
                  onChange={e => setRequestBody(e.target.value)}
                  className="w-full bg-[#111827] text-emerald-400 p-2 rounded border border-slate-700 font-mono text-xs"
                />
              </div>

              {/* Response Panel */}
              <div className="space-y-2">
                <span className="font-bold text-emerald-400">Server Response</span>
                <pre className="bg-[#050811] p-3 rounded-lg border border-slate-800 text-slate-300 min-h-[220px] whitespace-pre-wrap leading-relaxed overflow-x-auto">
                  {burpResponse || '// Click "Send Request" to simulate HTTP repeater response...'}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

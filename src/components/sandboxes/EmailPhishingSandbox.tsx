import React, { useState } from 'react';
import { Mail, ShieldCheck, ShieldAlert, ShieldX, Copy, Check, ArrowRight } from 'lucide-react';

export const EmailPhishingSandbox: React.FC = () => {
  const [inputUrl, setInputUrl] = useState('http://malicious-credential-harvest.ru/login.php?user=victim&session=9821');
  const [copied, setCopied] = useState(false);

  // Defanging logic
  const defang = (str: string) => {
    return str
      .replace(/https:\/\//gi, 'hxxps://')
      .replace(/http:\/\//gi, 'hxxp://')
      .replace(/\./g, '[.]')
      .replace(/@/g, '[@]');
  };

  const refang = (str: string) => {
    return str
      .replace(/hxxps:\/\//gi, 'https://')
      .replace(/hxxp:\/\//gi, 'http://')
      .replace(/\[\.\]/g, '.')
      .replace(/\[@\]/g, '@');
  };

  const defangedUrl = defang(inputUrl);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#0b101b] border border-slate-800 rounded-xl overflow-hidden shadow-2xl font-sans">
      <div className="bg-[#0f172a] px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2 text-cyan-400 font-mono text-sm font-semibold">
          <Mail className="w-4 h-4" />
          <span>Email Forensics Laboratory & 1-Click Defanger Tool</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>Gateway Parser Active</span>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Email Authentication Status Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/40 flex items-start gap-3">
            <ShieldX className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="text-xs">
              <div className="font-bold text-red-300">SPF: FAIL</div>
              <div className="text-slate-400 mt-0.5">MTA IP 198.51.100.220 is not authorized in DNS SPF record for domain.</div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-500/40 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs">
              <div className="font-bold text-amber-300">DKIM: NEUTRAL</div>
              <div className="text-slate-400 mt-0.5">Signature missing or public key selector not published in DNS.</div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/40 flex items-start gap-3">
            <ShieldX className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="text-xs">
              <div className="font-bold text-red-300">DMARC: FAIL (Alignment)</div>
              <div className="text-slate-400 mt-0.5">Header From: microsoft-billing.com does not align with Return-Path.</div>
            </div>
          </div>
        </div>

        {/* Raw Header Hop Inspection */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>Raw MIME Headers (Read bottom to top for origin):</span>
            <span className="text-cyan-400">Originating IP: 198.51.100.220</span>
          </div>
          <div className="bg-[#050811] p-3 rounded-lg border border-slate-800 font-mono text-[11px] text-slate-300 max-h-40 overflow-y-auto space-y-1">
            <div className="text-slate-500">Delivered-To: victim@enterprise-corp.com</div>
            <div className="text-slate-400">Received: from mail-relay-02.enterprise.com by internal-mta (id 89aBcDeF)</div>
            <div className="text-red-400 font-bold bg-red-950/30 p-1 rounded">
              Received: from mail.spoofed-invoice-system.com (198.51.100.220) by mail-relay-02.enterprise.com
            </div>
            <div className="text-amber-400">Authentication-Results: spf=fail; dkim=neutral; dmarc=fail (p=reject)</div>
            <div className="text-cyan-400">From: &quot;Microsoft Billing Support&quot; &lt;billing@microsoft-billing.com&gt;</div>
            <div className="text-red-300">Return-Path: &lt;bounce-handler@spoofed-invoice-system.com&gt;</div>
            <div className="text-slate-300">Subject: URGENT: Corporate Tenant Expiration Notice</div>
          </div>
        </div>

        {/* 1-Click Interactive Defanger Tool */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-xs font-mono uppercase font-bold text-cyan-400">
              Interactive IOC Sanitizer & Defanger
            </div>
            <span className="text-[11px] text-slate-400">Prevents accidental clicks & DNS prefetching</span>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-slate-400">Live Input URL or IP Address:</label>
            <input
              type="text"
              value={inputUrl}
              onChange={e => setInputUrl(e.target.value)}
              className="w-full bg-[#111827] text-slate-200 font-mono text-xs px-3 py-2 rounded-lg border border-slate-700 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-400">Safe Defanged Output (Ready for Tickets & Slack):</label>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-[#050811] text-emerald-400 font-mono text-xs px-3 py-2 rounded-lg border border-slate-800 break-all select-all">
                {defangedUrl}
              </div>
              <button
                onClick={() => handleCopy(defangedUrl)}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg flex items-center gap-1.5 transition-colors shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-1 text-xs">
            <span className="text-slate-500 self-center">Try examples:</span>
            <button
              onClick={() => setInputUrl('https://evil-c2-login.ru/update.iso')}
              className="px-2 py-1 rounded bg-slate-800 text-slate-300 hover:text-white font-mono"
            >
              Malicious ISO URL
            </button>
            <button
              onClick={() => setInputUrl('http://198.51.100.99:8080/beacon.ps1')}
              className="px-2 py-1 rounded bg-slate-800 text-slate-300 hover:text-white font-mono"
            >
              Raw IP with Port
            </button>
            <button
              onClick={() => setInputUrl('phisher@account-service-alert.top')}
              className="px-2 py-1 rounded bg-slate-800 text-slate-300 hover:text-white font-mono"
            >
              Email Address
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

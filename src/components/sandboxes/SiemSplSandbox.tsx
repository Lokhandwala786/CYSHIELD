import React, { useState } from 'react';
import { Search, Terminal, BarChart2, Table, List, Play, Zap, Info } from 'lucide-react';

interface MockLog {
  id: string;
  time: string;
  index: string;
  sourcetype: string;
  EventCode: number;
  user: string;
  src_ip: string;
  status: 'SUCCESS' | 'FAILURE';
  action: 'ALLOW' | 'BLOCK';
  msg: string;
}

const MOCK_DATASET: MockLog[] = [
  { id: '1', time: '14:00:10', index: 'windows', sourcetype: 'WinEventLog:Security', EventCode: 4625, user: 'jdoe', src_ip: '192.168.1.50', status: 'FAILURE', action: 'BLOCK', msg: 'Failed logon attempt bad password' },
  { id: '2', time: '14:00:12', index: 'windows', sourcetype: 'WinEventLog:Security', EventCode: 4625, user: 'jdoe', src_ip: '192.168.1.50', status: 'FAILURE', action: 'BLOCK', msg: 'Failed logon attempt bad password' },
  { id: '3', time: '14:00:15', index: 'windows', sourcetype: 'WinEventLog:Security', EventCode: 4625, user: 'jdoe', src_ip: '192.168.1.50', status: 'FAILURE', action: 'BLOCK', msg: 'Failed logon attempt bad password' },
  { id: '4', time: '14:00:18', index: 'windows', sourcetype: 'WinEventLog:Security', EventCode: 4625, user: 'admin', src_ip: '192.168.1.50', status: 'FAILURE', action: 'BLOCK', msg: 'Failed logon attempt bad password' },
  { id: '5', time: '14:00:20', index: 'windows', sourcetype: 'WinEventLog:Security', EventCode: 4625, user: 'svc_backup', src_ip: '192.168.1.50', status: 'FAILURE', action: 'BLOCK', msg: 'Failed logon attempt bad password' },
  { id: '6', time: '14:00:25', index: 'windows', sourcetype: 'WinEventLog:Security', EventCode: 4624, user: 'svc_backup', src_ip: '192.168.1.50', status: 'SUCCESS', action: 'ALLOW', msg: 'Successful logon Type 3 network' },
  { id: '7', time: '14:01:00', index: 'firewall', sourcetype: 'pan:traffic', EventCode: 101, user: 'svc_backup', src_ip: '192.168.1.50', status: 'SUCCESS', action: 'ALLOW', msg: 'Traffic allowed out port 445' },
  { id: '8', time: '14:01:05', index: 'firewall', sourcetype: 'pan:traffic', EventCode: 102, user: 'svc_backup', src_ip: '192.168.1.50', status: 'FAILURE', action: 'BLOCK', msg: 'Threat detected C2 beaconing to 198.51.100.99' },
  { id: '9', time: '14:02:00', index: 'windows', sourcetype: 'WinEventLog:Security', EventCode: 4688, user: 'svc_backup', src_ip: '127.0.0.1', status: 'SUCCESS', action: 'ALLOW', msg: 'Process created powershell.exe -enc ...' },
  { id: '10', time: '14:02:10', index: 'windows', sourcetype: 'WinEventLog:Security', EventCode: 7045, user: 'SYSTEM', src_ip: '127.0.0.1', status: 'SUCCESS', action: 'ALLOW', msg: 'Service installed Name=PSEXESVC' }
];

export const SiemSplSandbox: React.FC = () => {
  const [syntaxMode, setSyntaxMode] = useState<'spl' | 'kql'>('spl');
  const [query, setQuery] = useState('index=windows EventCode=4625 | stats count by src_ip, user');
  const [activeView, setActiveView] = useState<'table' | 'raw' | 'chart'>('table');
  const [executionStats, setExecutionStats] = useState({ eventsScanned: 10, matched: 5, scanTimeMs: 14 });

  // Real mock evaluation of query
  const executeQuery = () => {
    let filtered = [...MOCK_DATASET];
    const q = query.toLowerCase();

    if (syntaxMode === 'spl') {
      if (q.includes('index=windows')) filtered = filtered.filter(l => l.index === 'windows');
      if (q.includes('index=firewall')) filtered = filtered.filter(l => l.index === 'firewall');
      if (q.includes('eventcode=4625')) filtered = filtered.filter(l => l.EventCode === 4625);
      if (q.includes('eventcode=4624')) filtered = filtered.filter(l => l.EventCode === 4624);
      if (q.includes('user=')) {
        const u = q.split('user=')[1].split(' ')[0].replace(/["']/g, '');
        filtered = filtered.filter(l => l.user.toLowerCase() === u);
      }
    } else {
      if (q.includes('securityevent')) filtered = filtered.filter(l => l.index === 'windows');
      if (q.includes('eventid == 4625') || q.includes('eventcode == 4625')) filtered = filtered.filter(l => l.EventCode === 4625);
      if (q.includes('targetaccount')) filtered = filtered.filter(l => l.user.length > 0);
    }

    setExecutionStats({
      eventsScanned: MOCK_DATASET.length,
      matched: filtered.length,
      scanTimeMs: Math.floor(Math.random() * 15) + 8
    });

    return filtered;
  };

  const results = executeQuery();

  // Compute stats aggregation
  const isStatsQuery = query.toLowerCase().includes('stats') || query.toLowerCase().includes('summarize');
  const statsMap: Record<string, number> = {};
  results.forEach(r => {
    const key = `${r.src_ip} | ${r.user}`;
    statsMap[key] = (statsMap[key] || 0) + 1;
  });

  return (
    <div className="bg-[#0b101b] border border-slate-800 rounded-xl overflow-hidden shadow-2xl font-sans">
      {/* Header & Mode Switcher */}
      <div className="bg-[#0f172a] px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2 text-cyan-400 font-mono text-sm font-semibold">
          <Terminal className="w-4 h-4" />
          <span>Interactive SIEM Console: {syntaxMode === 'spl' ? 'Splunk SPL Engine' : 'Microsoft Sentinel KQL'}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Syntax:</span>
          <button
            onClick={() => {
              setSyntaxMode('spl');
              setQuery('index=windows EventCode=4625 | stats count by src_ip, user');
            }}
            className={`px-2.5 py-1 text-xs rounded font-mono font-semibold transition-colors ${
              syntaxMode === 'spl' ? 'bg-cyan-500 text-black' : 'bg-slate-800 text-slate-300'
            }`}
          >
            Splunk SPL
          </button>
          <button
            onClick={() => {
              setSyntaxMode('kql');
              setQuery('SecurityEvent | where EventID == 4625 | summarize count() by IpAddress, TargetAccount');
            }}
            className={`px-2.5 py-1 text-xs rounded font-mono font-semibold transition-colors ${
              syntaxMode === 'kql' ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-300'
            }`}
          >
            Sentinel KQL
          </button>
        </div>
      </div>

      {/* Query Bar */}
      <div className="p-3 bg-[#0a0d14] border-b border-slate-800 space-y-2">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full bg-[#111827] text-cyan-300 font-mono text-xs px-3 py-2 rounded-lg border border-slate-700 focus:outline-none focus:border-cyan-500 pr-8"
              placeholder={syntaxMode === 'spl' ? 'index=... | stats ...' : 'SecurityEvent | where ... | summarize ...'}
            />
          </div>
          <button
            onClick={executeQuery}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-black font-semibold text-xs rounded-lg transition-colors"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            Search
          </button>
        </div>

        {/* Quick query presets */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
          <span className="text-slate-500">Presets:</span>
          {syntaxMode === 'spl' ? (
            <>
              <button
                onClick={() => setQuery('index=windows EventCode=4625 | stats count by src_ip, user')}
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300"
              >
                Failed Logons by User
              </button>
              <button
                onClick={() => setQuery('index=windows EventCode=4625 | stats dc(user) as unique_targets by src_ip | where unique_targets > 1')}
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-300"
              >
                Password Spraying (dc)
              </button>
              <button
                onClick={() => setQuery('index=firewall action=BLOCK | stats count by dest_ip')}
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-purple-300"
              >
                Firewall Blocks
              </button>
              <button
                onClick={() => setQuery('index=windows | timechart span=1h count by EventCode')}
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-emerald-300"
              >
                Timechart by Event
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setQuery('SecurityEvent | where EventID == 4625 | summarize count() by IpAddress, TargetAccount')}
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300"
              >
                Failed Logons (KQL)
              </button>
              <button
                onClick={() => setQuery('SecurityEvent | where EventID == 4625 | summarize dcount(TargetAccount) by IpAddress')}
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-300"
              >
                Password Spray (dcount)
              </button>
            </>
          )}
        </div>
      </div>

      {/* Execution Metrics Bar & View Selector */}
      <div className="px-4 py-2 bg-[#0e1626] border-b border-slate-800 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center space-x-3 text-slate-400">
          <span>Events: <strong className="text-cyan-400">{results.length}</strong></span>
          <span>•</span>
          <span>Execution Time: <strong className="text-emerald-400">{executionStats.scanTimeMs} ms</strong></span>
          <span>•</span>
          <span className="text-slate-500">Scan Mode: Fast Mode</span>
        </div>
        <div className="flex space-x-1">
          <button
            onClick={() => setActiveView('table')}
            className={`px-2 py-1 rounded flex items-center gap-1 ${activeView === 'table' ? 'bg-cyan-500 text-black font-semibold' : 'bg-slate-800 text-slate-300'}`}
          >
            <Table className="w-3 h-3" />
            Table
          </button>
          <button
            onClick={() => setActiveView('chart')}
            className={`px-2 py-1 rounded flex items-center gap-1 ${activeView === 'chart' ? 'bg-cyan-500 text-black font-semibold' : 'bg-slate-800 text-slate-300'}`}
          >
            <BarChart2 className="w-3 h-3" />
            Chart
          </button>
          <button
            onClick={() => setActiveView('raw')}
            className={`px-2 py-1 rounded flex items-center gap-1 ${activeView === 'raw' ? 'bg-cyan-500 text-black font-semibold' : 'bg-slate-800 text-slate-300'}`}
          >
            <List className="w-3 h-3" />
            Events
          </button>
        </div>
      </div>

      {/* Content View */}
      <div className="p-3 max-h-64 overflow-y-auto">
        {activeView === 'table' ? (
          isStatsQuery ? (
            <table className="w-full text-left font-mono text-xs border-collapse">
              <thead className="bg-[#111827] text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-2 px-3">Source IP</th>
                  <th className="py-2 px-3">Target User</th>
                  <th className="py-2 px-3 text-right">Count</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {Object.entries(statsMap).map(([key, count], idx) => {
                  const [src, user] = key.split(' | ');
                  return (
                    <tr key={idx} className="hover:bg-slate-800/30 text-slate-200">
                      <td className="py-1.5 px-3 text-cyan-300">{src}</td>
                      <td className="py-1.5 px-3 font-semibold">{user}</td>
                      <td className="py-1.5 px-3 text-right text-amber-400 font-bold">{count}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left font-mono text-xs border-collapse">
              <thead className="bg-[#111827] text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-2 px-3">_time</th>
                  <th className="py-2 px-3">EventCode</th>
                  <th className="py-2 px-3">User</th>
                  <th className="py-2 px-3">Source IP</th>
                  <th className="py-2 px-3">Status</th>
                  <th className="py-2 px-3">Message</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {results.map(r => (
                  <tr key={r.id} className="hover:bg-slate-800/30 text-slate-300">
                    <td className="py-1.5 px-3 text-slate-400">{r.time}</td>
                    <td className="py-1.5 px-3 text-cyan-400 font-bold">{r.EventCode}</td>
                    <td className="py-1.5 px-3">{r.user}</td>
                    <td className="py-1.5 px-3">{r.src_ip}</td>
                    <td className="py-1.5 px-3">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] ${r.status === 'SUCCESS' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'}`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="py-1.5 px-3 text-slate-400 truncate max-w-xs">{r.msg}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        ) : activeView === 'chart' ? (
          <div className="p-4 space-y-3 font-mono">
            <div className="text-xs text-slate-400">Aggregation Histogram (Events per Entity):</div>
            <div className="space-y-2">
              {Object.entries(statsMap).map(([key, count], i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>{key}</span>
                    <span className="text-cyan-400 font-bold">{count} events</span>
                  </div>
                  <div className="w-full bg-slate-800 h-3 rounded overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full rounded"
                      style={{ width: `${Math.min(100, (count / 5) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-2 font-mono text-xs">
            {results.map(r => (
              <div key={r.id} className="bg-[#111827] p-2.5 rounded border border-slate-800 text-slate-300 space-y-1">
                <div className="text-slate-500 text-[11px]">{r.time} index={r.index} sourcetype={r.sourcetype}</div>
                <div className="text-emerald-400">
                  EventCode={r.EventCode} user=&quot;{r.user}&quot; src_ip={r.src_ip} status={r.status} action={r.action} msg=&quot;{r.msg}&quot;
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Optimization & Coaching Footer */}
      <div className="p-3 bg-[#0f172a] border-t border-slate-800 flex items-center gap-2 text-xs text-slate-400">
        <Info className="w-4 h-4 text-cyan-400 shrink-0" />
        <div>
          <strong className="text-cyan-300">Query Optimization Tip: </strong>
          Always specify <code className="text-emerald-400 font-mono">index=</code> and <code className="text-emerald-400 font-mono">sourcetype=</code> at the start of your search to prune non-matching buckets prior to pipe execution!
        </div>
      </div>
    </div>
  );
};

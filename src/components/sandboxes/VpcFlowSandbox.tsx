import React, { useState } from 'react';
import { Shield, Filter, Search, AlertCircle, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

interface FlowLogEntry {
  version: number;
  accountId: string;
  eni: string;
  src: string;
  dst: string;
  srcPort: number;
  dstPort: number;
  proto: string;
  packets: number;
  bytes: number;
  action: 'ACCEPT' | 'REJECT';
  explanation: string;
}

const FLOW_DATA: FlowLogEntry[] = [
  { version: 2, accountId: '112233445566', eni: 'eni-088a7b6c', src: '198.51.100.77', dst: '10.0.2.80', srcPort: 54122, dstPort: 8080, proto: 'TCP (6)', packets: 85, bytes: 14200, action: 'ACCEPT', explanation: 'Inbound HTTP to Jenkins server accepted (Security group was misconfigured to 0.0.0.0/0).' },
  { version: 2, accountId: '112233445566', eni: 'eni-088a7b6c', src: '10.0.2.80', dst: '198.51.100.77', srcPort: 41200, dstPort: 4444, proto: 'TCP (6)', packets: 120, bytes: 18400, action: 'ACCEPT', explanation: 'Outbound TCP connection to port 4444 on attacker IP (Reverse shell callback).' },
  { version: 2, accountId: '112233445566', eni: 'eni-01a2b3c4', src: '198.51.100.88', dst: '10.0.1.15', srcPort: 49120, dstPort: 22, proto: 'TCP (6)', packets: 1, bytes: 40, action: 'REJECT', explanation: 'Inbound SSH attempt blocked by Security Group (Public SSH not permitted).' },
  { version: 2, accountId: '112233445566', eni: 'eni-01a2b3c4', src: '198.51.100.88', dst: '10.0.1.15', srcPort: 49121, dstPort: 22, proto: 'TCP (6)', packets: 1, bytes: 40, action: 'REJECT', explanation: 'Port scan continuation blocked by Security Group.' },
  { version: 2, accountId: '112233445566', eni: 'eni-01a2b3c4', src: '203.0.113.50', dst: '10.0.1.15', srcPort: 52144, dstPort: 443, proto: 'TCP (6)', packets: 15, bytes: 3200, action: 'ACCEPT', explanation: 'Legitimate customer HTTPS session to corporate web app.' },
  { version: 2, accountId: '112233445566', eni: 'eni-09f8e7d6', src: '10.0.1.15', dst: '10.0.3.50', srcPort: 41200, dstPort: 3306, proto: 'TCP (6)', packets: 42, bytes: 8400, action: 'REJECT', explanation: 'Unauthorized internal pivot to database subnet blocked by DB Security Group.' }
];

export const VpcFlowSandbox: React.FC = () => {
  const [filterAction, setFilterAction] = useState<'ALL' | 'ACCEPT' | 'REJECT'>('ALL');
  const [selectedEntry, setSelectedEntry] = useState<FlowLogEntry>(FLOW_DATA[0]);

  const filteredLogs = FLOW_DATA.filter(l => {
    if (filterAction === 'ALL') return true;
    return l.action === filterAction;
  });

  return (
    <div className="bg-[#0b101b] border border-slate-800 rounded-xl overflow-hidden shadow-2xl font-sans">
      <div className="bg-[#0f172a] px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2 text-cyan-400 font-mono text-sm font-semibold">
          <Shield className="w-4 h-4" />
          <span>AWS VPC Flow Logs Telemetry & Security Boundary Inspector</span>
        </div>
        <div className="flex gap-1 text-xs font-mono">
          <button
            onClick={() => setFilterAction('ALL')}
            className={`px-2.5 py-1 rounded ${filterAction === 'ALL' ? 'bg-cyan-500 text-black font-bold' : 'bg-slate-800 text-slate-300'}`}
          >
            All Logs
          </button>
          <button
            onClick={() => setFilterAction('ACCEPT')}
            className={`px-2.5 py-1 rounded ${filterAction === 'ACCEPT' ? 'bg-emerald-500 text-black font-bold' : 'bg-slate-800 text-emerald-400'}`}
          >
            ACCEPT Only
          </button>
          <button
            onClick={() => setFilterAction('REJECT')}
            className={`px-2.5 py-1 rounded ${filterAction === 'REJECT' ? 'bg-red-500 text-white font-bold' : 'bg-slate-800 text-red-400'}`}
          >
            REJECT Only
          </button>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div className="max-h-60 overflow-y-auto font-mono text-xs border border-slate-800 rounded-lg">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#111827] text-slate-400 sticky top-0 border-b border-slate-800">
              <tr>
                <th className="py-2 px-3">Interface ENI</th>
                <th className="py-2 px-3">Source IP : Port</th>
                <th className="py-2 px-3">Destination IP : Port</th>
                <th className="py-2 px-3">Protocol</th>
                <th className="py-2 px-3">Packets / Bytes</th>
                <th className="py-2 px-3 text-right">Verdict</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {filteredLogs.map((log, idx) => {
                const isSelected = selectedEntry === log;
                return (
                  <tr
                    key={idx}
                    onClick={() => setSelectedEntry(log)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-cyan-950/80 text-cyan-200 font-semibold'
                        : log.action === 'REJECT'
                        ? 'hover:bg-red-950/20 text-red-300'
                        : 'hover:bg-slate-800/40 text-slate-300'
                    }`}
                  >
                    <td className="py-2 px-3 text-cyan-300">{log.eni}</td>
                    <td className="py-2 px-3">{log.src}:{log.srcPort}</td>
                    <td className="py-2 px-3">{log.dst}:{log.dstPort}</td>
                    <td className="py-2 px-3 text-slate-400">{log.proto}</td>
                    <td className="py-2 px-3 text-slate-400">{log.packets} pkts ({log.bytes} B)</td>
                    <td className="py-2 px-3 text-right">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.action === 'ACCEPT' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-red-500/20 text-red-400 border border-red-500/40'
                      }`}>
                        {log.action}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Selected Record Analysis */}
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-mono text-cyan-400 font-bold">
              Flow Analysis: {selectedEntry.src}:{selectedEntry.srcPort} → {selectedEntry.dst}:{selectedEntry.dstPort}
            </span>
            <span className="font-mono text-slate-400">Account: {selectedEntry.accountId}</span>
          </div>
          <div className="bg-[#050811] p-2.5 rounded font-mono text-slate-300 border border-slate-800">
            2 {selectedEntry.accountId} {selectedEntry.eni} {selectedEntry.src} {selectedEntry.dst} {selectedEntry.srcPort} {selectedEntry.dstPort} 6 {selectedEntry.packets} {selectedEntry.bytes} 1727997600 1727997660 {selectedEntry.action} OK
          </div>
          <div className="text-slate-300">
            <strong className="text-amber-400">Security Architect Context: </strong>
            {selectedEntry.explanation}
          </div>
        </div>
      </div>
    </div>
  );
};

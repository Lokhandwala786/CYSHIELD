import React, { useState } from 'react';
import { Eye, ShieldAlert, Search, Filter, AlertTriangle, Key } from 'lucide-react';

interface CloudTrailEvent {
  eventTime: string;
  eventName: string;
  eventSource: string;
  sourceIPAddress: string;
  userAgent: string;
  userIdentity: {
    type: string;
    userName: string;
    arn: string;
  };
  requestParameters?: any;
  threatVerdict: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
}

const EVENTS: CloudTrailEvent[] = [
  {
    eventTime: '2026-10-03T23:10:00Z',
    eventName: 'GetCallerIdentity',
    eventSource: 'sts.amazonaws.com',
    sourceIPAddress: '198.51.100.44',
    userAgent: 'aws-cli/2.15.0 Python/3.11 Linux/5.15',
    userIdentity: {
      type: 'IAMUser',
      userName: 'svc-backup',
      arn: 'arn:aws:iam::112233445566:user/svc-backup'
    },
    threatVerdict: 'Reconnaissance / Discovery: Calling whoami equivalent after acquiring stolen access keys.',
    severity: 'Medium'
  },
  {
    eventTime: '2026-10-03T23:11:15Z',
    eventName: 'AttachUserPolicy',
    eventSource: 'iam.amazonaws.com',
    sourceIPAddress: '198.51.100.44',
    userAgent: 'aws-cli/2.15.0 Python/3.11 Linux/5.15',
    userIdentity: {
      type: 'IAMUser',
      userName: 'svc-backup',
      arn: 'arn:aws:iam::112233445566:user/svc-backup'
    },
    requestParameters: {
      userName: 'svc-backup',
      policyArn: 'arn:aws:iam::aws:policy/AdministratorAccess'
    },
    threatVerdict: 'CRITICAL Privilege Escalation: Service user attaching AdministratorAccess policy to itself.',
    severity: 'Critical'
  },
  {
    eventTime: '2026-10-03T23:12:00Z',
    eventName: 'StopLogging',
    eventSource: 'cloudtrail.amazonaws.com',
    sourceIPAddress: '198.51.100.44',
    userAgent: 'aws-cli/2.15.0 Python/3.11 Linux/5.15',
    userIdentity: {
      type: 'IAMUser',
      userName: 'svc-backup',
      arn: 'arn:aws:iam::112233445566:user/svc-backup'
    },
    requestParameters: {
      name: 'arn:aws:cloudtrail:us-east-1:112233445566:trail/main-enterprise-trail'
    },
    threatVerdict: 'Defense Evasion: Attempting to blind enterprise SOC by turning off multi-region trail auditing.',
    severity: 'Critical'
  },
  {
    eventTime: '2026-10-03T23:04:12Z',
    eventName: 'ConsoleLogin',
    eventSource: 'signin.amazonaws.com',
    sourceIPAddress: '198.51.100.200',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    userIdentity: {
      type: 'Root',
      userName: 'root',
      arn: 'arn:aws:iam::112233445566:root'
    },
    requestParameters: { MFAUsed: 'No' },
    threatVerdict: 'High Severity Anomaly: Root account logged in from unexpected foreign IP without MFA.',
    severity: 'Critical'
  }
];

export const CloudTrailSandbox: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<CloudTrailEvent>(EVENTS[1]);
  const [search, setSearch] = useState('');

  const filteredEvents = EVENTS.filter(e => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      e.eventName.toLowerCase().includes(q) ||
      e.userIdentity.userName.toLowerCase().includes(q) ||
      e.sourceIPAddress.includes(q)
    );
  });

  return (
    <div className="bg-[#0b101b] border border-slate-800 rounded-xl overflow-hidden shadow-2xl font-sans">
      <div className="bg-[#0f172a] px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2 text-cyan-400 font-mono text-sm font-semibold">
          <Eye className="w-4 h-4" />
          <span>AWS CloudTrail Forensic Log Investigator & Privilege Escalation Triage</span>
        </div>
        <span className="text-xs font-mono text-slate-400">Trail: main-enterprise-trail (Multi-Region)</span>
      </div>

      <div className="p-4 space-y-4">
        {/* Search */}
        <div className="flex gap-2">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search API EventName, UserName, or IP (e.g. StopLogging, ConsoleLogin, svc-backup)..."
            className="w-full bg-[#111827] text-cyan-300 font-mono text-xs px-3 py-2 rounded-lg border border-slate-700 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Event List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <span className="text-xs font-mono text-slate-400">Recent CloudTrail API Events:</span>
            <div className="space-y-2">
              {filteredEvents.map((evt, idx) => {
                const isSelected = selectedEvent === evt;
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedEvent(evt)}
                    className={`w-full p-3 rounded-lg border text-left transition-all ${
                      isSelected
                        ? 'bg-cyan-950/80 border-cyan-500 shadow-lg'
                        : 'bg-[#111827] border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-white">{evt.eventName}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                        evt.severity === 'Critical' ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        {evt.severity}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-1 flex items-center justify-between">
                      <span>User: {evt.userIdentity.userName}</span>
                      <span className="font-mono text-[11px] text-cyan-400">{evt.sourceIPAddress}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Raw JSON Record View */}
          <div className="space-y-2">
            <span className="text-xs font-mono text-slate-400">CloudTrail JSON Record:</span>
            <pre className="bg-[#050811] p-3 rounded-lg border border-slate-800 font-mono text-xs text-emerald-400 min-h-[220px] overflow-x-auto whitespace-pre-wrap leading-relaxed">
              {JSON.stringify(selectedEvent, null, 2)}
            </pre>
          </div>
        </div>

        {/* Forensic Analysis Banner */}
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1">
          <div className="text-cyan-400 font-mono font-bold flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            Cloud SOC Triage Recommendation:
          </div>
          <div className="text-slate-300">
            {selectedEvent.threatVerdict}
          </div>
        </div>
      </div>
    </div>
  );
};

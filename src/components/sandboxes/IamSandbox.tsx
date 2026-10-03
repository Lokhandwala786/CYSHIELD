import React, { useState } from 'react';
import { Key, ShieldAlert, ShieldCheck, Play, Code, AlertTriangle } from 'lucide-react';

const DEFAULT_POLICY = `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowS3ReadDev",
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:ListBucket"
      ],
      "Resource": "arn:aws:s3:::dev-assets/*"
    },
    {
      "Sid": "DenyS3DeleteGlobal",
      "Effect": "Deny",
      "Action": "s3:DeleteObject",
      "Resource": "*"
    }
  ]
}`;

export const IamSandbox: React.FC = () => {
  const [policyJson, setPolicyJson] = useState(DEFAULT_POLICY);
  const [testAction, setTestAction] = useState('s3:GetObject');
  const [testResource, setTestResource] = useState('arn:aws:s3:::dev-assets/image.png');
  const [evaluationResult, setEvaluationResult] = useState<{
    verdict: 'ALLOW' | 'DENY';
    reason: string;
    matchedSid?: string;
  } | null>(null);

  const evaluatePolicy = () => {
    try {
      const parsed = JSON.parse(policyJson);
      const statements: any[] = parsed.Statement || [];

      // Step 1: Check Explicit Deny
      for (const stmt of statements) {
        if (stmt.Effect === 'Deny') {
          const actions = Array.isArray(stmt.Action) ? stmt.Action : [stmt.Action];
          const matchesAction = actions.some((a: string) => a === '*' || a === testAction || testAction.startsWith(a.replace('*', '')));
          if (matchesAction) {
            setEvaluationResult({
              verdict: 'DENY',
              reason: 'Blocked by Explicit Deny rule. In AWS IAM, an Explicit Deny always overrides all allows.',
              matchedSid: stmt.Sid
            });
            return;
          }
        }
      }

      // Step 2: Check Explicit Allow
      for (const stmt of statements) {
        if (stmt.Effect === 'Allow') {
          const actions = Array.isArray(stmt.Action) ? stmt.Action : [stmt.Action];
          const matchesAction = actions.some((a: string) => a === '*' || a === testAction || testAction.startsWith(a.replace('*', '')));
          if (matchesAction) {
            setEvaluationResult({
              verdict: 'ALLOW',
              reason: 'Request matches Explicit Allow condition and no Explicit Deny exists.',
              matchedSid: stmt.Sid
            });
            return;
          }
        }
      }

      // Step 3: Default Implicit Deny
      setEvaluationResult({
        verdict: 'DENY',
        reason: 'Implicit Default Deny: No explicit statement allowed this action.'
      });
    } catch (e: any) {
      setEvaluationResult({
        verdict: 'DENY',
        reason: 'Invalid JSON syntax: ' + e.message
      });
    }
  };

  return (
    <div className="bg-[#0b101b] border border-slate-800 rounded-xl overflow-hidden shadow-2xl font-sans">
      <div className="bg-[#0f172a] px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2 text-cyan-400 font-mono text-sm font-semibold">
          <Key className="w-4 h-4" />
          <span>AWS IAM Policy Evaluation Simulator & Evaluation Algorithm</span>
        </div>
        <span className="text-xs text-slate-400 font-mono">Algorithm: Deny &gt; Allow &gt; Implicit Deny</span>
      </div>

      <div className="p-4 space-y-4">
        {/* Editor and Tester Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Policy JSON Editor */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>IAM Policy Document (JSON):</span>
              <button
                onClick={() => setPolicyJson(DEFAULT_POLICY)}
                className="text-cyan-400 hover:text-cyan-300"
              >
                Reset Default
              </button>
            </div>
            <textarea
              rows={12}
              value={policyJson}
              onChange={e => setPolicyJson(e.target.value)}
              className="w-full bg-[#050811] text-emerald-400 font-mono text-xs p-3 rounded-lg border border-slate-800 focus:outline-none focus:border-cyan-500 leading-relaxed"
            />
          </div>

          {/* Test Action Controls */}
          <div className="space-y-4">
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-3">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase">
                Simulate Incoming AWS API Request:
              </span>

              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-mono">Target API Action:</label>
                <input
                  type="text"
                  value={testAction}
                  onChange={e => setTestAction(e.target.value)}
                  className="w-full bg-[#111827] text-slate-200 font-mono text-xs px-3 py-2 rounded border border-slate-700 focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-mono">Target Resource ARN:</label>
                <input
                  type="text"
                  value={testResource}
                  onChange={e => setTestResource(e.target.value)}
                  className="w-full bg-[#111827] text-slate-200 font-mono text-xs px-3 py-2 rounded border border-slate-700 focus:border-cyan-500"
                />
              </div>

              {/* Presets */}
              <div className="flex flex-wrap gap-1.5 text-xs font-mono pt-1">
                <span className="text-slate-500 self-center">Test cases:</span>
                <button
                  onClick={() => {
                    setTestAction('s3:GetObject');
                    setTestResource('arn:aws:s3:::dev-assets/image.png');
                  }}
                  className="px-2 py-0.5 rounded bg-slate-800 text-emerald-300 hover:text-white"
                >
                  s3:GetObject (Allow)
                </button>
                <button
                  onClick={() => {
                    setTestAction('s3:DeleteObject');
                    setTestResource('arn:aws:s3:::dev-assets/image.png');
                  }}
                  className="px-2 py-0.5 rounded bg-slate-800 text-red-300 hover:text-white"
                >
                  s3:DeleteObject (Explicit Deny)
                </button>
                <button
                  onClick={() => {
                    setTestAction('ec2:TerminateInstances');
                    setTestResource('*');
                  }}
                  className="px-2 py-0.5 rounded bg-slate-800 text-amber-300 hover:text-white"
                >
                  ec2:Terminate (Implicit Deny)
                </button>
              </div>

              <button
                onClick={evaluatePolicy}
                className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 transition-colors mt-2"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Evaluate IAM Policy
              </button>
            </div>

            {/* Evaluation Result Display */}
            {evaluationResult && (
              <div className={`p-4 rounded-xl border space-y-2 ${
                evaluationResult.verdict === 'ALLOW'
                  ? 'bg-emerald-950/50 border-emerald-500 text-emerald-200'
                  : 'bg-red-950/50 border-red-500 text-red-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-mono font-bold text-sm">
                    {evaluationResult.verdict === 'ALLOW' ? (
                      <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <ShieldAlert className="w-5 h-5 text-red-400" />
                    )}
                    <span>Access Decision: {evaluationResult.verdict}</span>
                  </div>
                  {evaluationResult.matchedSid && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/40 border border-slate-700">
                      Statement: {evaluationResult.matchedSid}
                    </span>
                  )}
                </div>
                <div className="text-xs opacity-90 leading-relaxed font-sans">
                  {evaluationResult.reason}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  Lightbulb,
  Building2,
  Table,
  Terminal,
  AlertOctagon,
  HelpCircle,
  CheckCircle2,
  XCircle,
  ChevronRight,
  ChevronLeft,
  Bookmark,
  Share2,
  Award,
  Zap,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Eye,
  EyeOff
} from 'lucide-react';
import { Topic, Phase, UserProgressState, TriageClassification } from '../../types/curriculum';
import { SandboxRenderer } from '../sandboxes/SandboxRenderer';
import { Badge } from '../common/Badge';
import { StorageService } from '../../services/storageService';

interface TopicViewProps {
  topic: Topic;
  phase: Phase;
  progress: UserProgressState;
  onStateUpdate: (newState: UserProgressState) => void;
  onNavigateNext?: () => void;
  onNavigatePrev?: () => void;
}

export const TopicView: React.FC<TopicViewProps> = ({
  topic,
  phase,
  progress,
  onStateUpdate,
  onNavigateNext,
  onNavigatePrev,
}) => {
  const [activeTab, setActiveTab] = useState<'learn' | 'sandbox' | 'incident' | 'flashcards' | 'quiz'>('learn');

  // Flashcards state
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});

  // Incident state
  const existingSubmission = progress.incidentSubmissions[topic.incident.id];
  const [incidentClassification, setIncidentClassification] = useState<TriageClassification | null>(
    existingSubmission ? existingSubmission.classification : null
  );
  const [incidentRootCause, setIncidentRootCause] = useState<number | null>(
    existingSubmission ? existingSubmission.rootCauseIndex : null
  );
  const [incidentContainment, setIncidentContainment] = useState<number | null>(
    existingSubmission ? existingSubmission.containmentIndex : null
  );
  const [incidentFeedback, setIncidentFeedback] = useState<{
    submitted: boolean;
    score: number;
    isCorrect: boolean;
  } | null>(existingSubmission ? { submitted: true, score: existingSubmission.score, isCorrect: existingSubmission.isCorrect } : null);

  // Quiz state
  const existingQuiz = progress.completedQuizzes[topic.id];
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(!!existingQuiz);
  const [quizScore, setQuizScore] = useState<number>(existingQuiz ? existingQuiz.score : 0);

  const isCompleted = progress.completedTopics.includes(topic.id);

  const toggleComplete = () => {
    const result = StorageService.toggleTopicCompleted(topic.id);
    onStateUpdate(result.state);
  };

  const handleToggleCardFlip = (cardId: string) => {
    setFlippedCards(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  };

  const handleToggleMastery = (cardId: string) => {
    const updated = StorageService.toggleFlashcardMastery(cardId);
    onStateUpdate(updated);
  };

  const handleSubmitIncident = () => {
    if (!incidentClassification || incidentRootCause === null || incidentContainment === null) return;

    const classCorrect = incidentClassification === topic.incident.triageOptions.correctClassification;
    const rootCorrect = incidentRootCause === topic.incident.rootCauseOptions.correctIndex;
    const containCorrect = incidentContainment === topic.incident.containmentOptions.correctIndex;

    let score = 0;
    if (classCorrect) score += 40;
    if (rootCorrect) score += 30;
    if (containCorrect) score += 30;

    const isAllCorrect = classCorrect && rootCorrect && containCorrect;

    const updated = StorageService.saveIncidentSubmission(topic.incident.id, {
      classification: incidentClassification,
      rootCauseIndex: incidentRootCause,
      containmentIndex: incidentContainment,
      isCorrect: isAllCorrect,
      score,
    });

    setIncidentFeedback({
      submitted: true,
      score,
      isCorrect: isAllCorrect,
    });

    onStateUpdate(updated);
  };

  const handleSubmitQuiz = () => {
    let correct = 0;
    topic.quiz.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correctIndex) {
        correct++;
      }
    });

    const updated = StorageService.saveQuizScore(topic.id, correct, topic.quiz.length);
    setQuizScore(correct);
    setQuizSubmitted(true);
    onStateUpdate(updated);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16 font-sans">
      {/* Top Breadcrumb & Actions Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400">
            <span>Phase {phase.phaseNumber}: {phase.title}</span>
            <span>•</span>
            <span className="text-slate-400">Est. {topic.estimatedMinutes} mins</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            {topic.title}
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">{topic.subtitle}</p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={toggleComplete}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              isCompleted
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
            }`}
          >
            <CheckCircle2 className={`w-4 h-4 ${isCompleted ? 'text-emerald-400 fill-emerald-950' : 'text-slate-400'}`} />
            <span>{isCompleted ? 'Module Completed' : 'Mark Complete'}</span>
          </button>
        </div>
      </div>

      {/* Mode / Step Tabs Bar */}
      <div className="flex items-center overflow-x-auto space-x-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('learn')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'learn'
              ? 'bg-cyan-500 text-black font-bold shadow-lg shadow-cyan-500/20'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>1. Concept & Corporate Reality</span>
        </button>

        <button
          onClick={() => setActiveTab('sandbox')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'sandbox'
              ? 'bg-cyan-500 text-black font-bold shadow-lg shadow-cyan-500/20'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>2. Interactive Sandbox Lab</span>
        </button>

        <button
          onClick={() => setActiveTab('incident')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'incident'
              ? 'bg-red-500 text-white font-bold shadow-lg shadow-red-500/20'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <AlertOctagon className="w-3.5 h-3.5" />
          <span>3. Corporate Incident Ticket</span>
          {existingSubmission && (
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('flashcards')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'flashcards'
              ? 'bg-purple-500 text-white font-bold shadow-lg shadow-purple-500/20'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>4. Interview Flashcards ({topic.flashcards.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('quiz')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'quiz'
              ? 'bg-emerald-500 text-black font-bold shadow-lg shadow-emerald-500/20'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>5. Knowledge Quiz ({topic.quiz.length})</span>
          {existingQuiz && (
            <span className="text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 px-1.5 py-0.2 rounded">
              {existingQuiz.score}/{existingQuiz.maxScore}
            </span>
          )}
        </button>
      </div>

      {/* Tab 1: Learn (Analogy + Corporate Reality + Cheat Sheet) */}
      {activeTab === 'learn' && (
        <div className="space-y-8">
          {/* Section 1: Relatable Analogy */}
          <div className="rounded-2xl bg-gradient-to-br from-[#101b2b] to-[#0a101d] border border-cyan-500/30 p-6 space-y-3 shadow-xl">
            <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
              <Lightbulb className="w-4 h-4 text-cyan-400" />
              <span>Step 1: The Plain English Analogy</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white">
              {topic.analogy.headline}
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              {topic.analogy.story}
            </p>
            <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-800/40 text-xs text-cyan-200 font-sans flex items-start gap-2">
              <Zap className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-cyan-300 font-mono uppercase">Key SOC Takeaway: </strong>
                {topic.analogy.keyTakeaway}
              </div>
            </div>
          </div>

          {/* Section 2: Corporate Enterprise Architecture */}
          <div className="rounded-2xl bg-[#0d131f] border border-slate-800 p-6 space-y-4 shadow-xl">
            <div className="flex items-center space-x-2 text-purple-400 font-mono text-xs font-bold uppercase tracking-wider">
              <Building2 className="w-4 h-4 text-purple-400" />
              <span>Step 2: Corporate Enterprise Architecture & Reality</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white">
              {topic.corporateReality.headline}
            </h3>
            <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {topic.corporateReality.deepDive}
            </div>

            {/* Architecture Notes List */}
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-mono font-bold text-slate-400 uppercase">
                Production Architecture Directives:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {topic.corporateReality.architectureNotes.map((note, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-slate-900 border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2">
                    <span className="text-cyan-400 font-bold font-mono">0{idx + 1}.</span>
                    <span>{note}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Real World Case Study */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-purple-500/30 text-xs text-slate-300 space-y-1">
              <div className="font-mono text-purple-400 font-bold uppercase flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                Real-World Enterprise Case Study:
              </div>
              <p className="leading-relaxed text-slate-300 pt-0.5">
                {topic.corporateReality.realWorldCase}
              </p>
            </div>
          </div>

          {/* Section 3: Interactive Visual Cheat Sheet */}
          <div className="rounded-2xl bg-[#0b101b] border border-slate-800 overflow-hidden shadow-xl">
            <div className="p-4 bg-[#0f172a] border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-emerald-400 font-mono text-xs font-bold uppercase">
                <Table className="w-4 h-4" />
                <span>Step 3: {topic.cheatSheet.title}</span>
              </div>
            </div>
            <div className="p-4 space-y-3">
              <p className="text-xs text-slate-400">{topic.cheatSheet.description}</p>
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs border-collapse">
                  <thead className="bg-[#111827] text-slate-400 border-b border-slate-800">
                    <tr>
                      {topic.cheatSheet.headers.map((h, i) => (
                        <th key={i} className="py-2.5 px-3 font-semibold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {topic.cheatSheet.rows.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/30 text-slate-300">
                        <td className="py-2 px-3 font-bold text-cyan-300">{row.term}</td>
                        <td className="py-2 px-3">{row.description}</td>
                        <td className="py-2 px-3 text-slate-400 truncate max-w-xs">{row.commandOrId || '-'}</td>
                        <td className="py-2 px-3 text-slate-300">{row.riskOrUsage || '-'}</td>
                        {row.severity && (
                          <td className="py-2 px-3">
                            <Badge severity={row.severity} />
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Next Button Prompt */}
          <div className="flex justify-end pt-4">
            <button
              onClick={() => setActiveTab('sandbox')}
              className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs flex items-center gap-2 transition-colors shadow-lg shadow-cyan-500/20"
            >
              <span>Next: Launch Interactive Sandbox Lab</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: Interactive Sandbox */}
      {activeTab === 'sandbox' && (
        <div className="space-y-4">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Terminal className="w-5 h-5 text-cyan-400" />
              {topic.sandboxConfig.title}
            </h3>
            <p className="text-xs text-slate-400">{topic.sandboxConfig.instructions}</p>
          </div>

          <SandboxRenderer type={topic.sandboxType} />

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setActiveTab('learn')}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-1.5 border border-slate-800"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Concept</span>
            </button>
            <button
              onClick={() => setActiveTab('incident')}
              className="px-6 py-2 rounded-xl bg-red-500 hover:bg-red-400 text-white font-bold text-xs flex items-center gap-2 transition-colors shadow-lg shadow-red-500/20"
            >
              <span>Next: Solve Incident Ticket #{topic.incident.ticketNumber}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Tab 3: Corporate Incident Scenario */}
      {activeTab === 'incident' && (
        <div className="space-y-6">
          {/* Ticket Header Card */}
          <div className="rounded-2xl bg-[#0d131f] border border-slate-800 p-6 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="text-red-400 font-bold">TICKET {topic.incident.ticketNumber}</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-400">SLA: {topic.incident.slaMinutes} mins</span>
                </div>
                <h3 className="text-xl font-extrabold text-white mt-1">
                  {topic.incident.title}
                </h3>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge severity={topic.incident.severity} />
                <span className="text-xs font-mono text-slate-400 px-2.5 py-1 rounded bg-slate-900 border border-slate-800">
                  Asset: {topic.incident.affectedAsset}
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {topic.incident.summary}
            </p>

            {/* Raw Telemetry Log Box */}
            <div className="space-y-1.5">
              <span className="text-xs font-mono text-slate-400 uppercase">Incoming SIEM / EDR Telemetry:</span>
              <pre className="bg-[#050811] p-3 rounded-xl border border-slate-800 font-mono text-xs text-emerald-400 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                {Array.isArray(topic.incident.rawTelemetry)
                  ? topic.incident.rawTelemetry.join('\n')
                  : JSON.stringify(topic.incident.rawTelemetry, null, 2)}
              </pre>
            </div>
          </div>

          {/* Interactive Incident Triage Questions */}
          <div className="rounded-2xl bg-[#0b101b] border border-slate-800 p-6 space-y-6">
            <h4 className="text-sm font-bold font-mono text-cyan-400 uppercase tracking-wider">
              Analyst Incident Disposition & Containment Protocol
            </h4>

            {/* Question 1: Triage Classification */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-200">
                Question 1: What is the accurate Triage Classification for this alert?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {(['True Positive', 'Benign True Positive', 'False Positive'] as TriageClassification[]).map(type => (
                  <button
                    key={type}
                    disabled={incidentFeedback?.submitted}
                    onClick={() => setIncidentClassification(type)}
                    className={`p-3 rounded-xl border text-xs font-semibold text-left transition-all ${
                      incidentClassification === type
                        ? 'bg-cyan-500/20 border-cyan-500 text-cyan-200 shadow-md'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-bold">{type}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Question 2: Root Cause Diagnosis */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-200">
                Question 2: Identify the primary Root Cause:
              </label>
              <div className="space-y-2">
                {topic.incident.rootCauseOptions.options.map((opt, idx) => (
                  <button
                    key={idx}
                    disabled={incidentFeedback?.submitted}
                    onClick={() => setIncidentRootCause(idx)}
                    className={`w-full p-3 rounded-xl border text-xs font-semibold text-left transition-all ${
                      incidentRootCause === idx
                        ? 'bg-cyan-500/20 border-cyan-500 text-cyan-200 shadow-md'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <span className="font-mono text-cyan-400 shrink-0">{String.fromCharCode(65 + idx)}.</span>
                      <span>{opt}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Question 3: Recommended Containment */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-200">
                Question 3: Select the recommended immediate Containment Action:
              </label>
              <div className="space-y-2">
                {topic.incident.containmentOptions.options.map((opt, idx) => (
                  <button
                    key={idx}
                    disabled={incidentFeedback?.submitted}
                    onClick={() => setIncidentContainment(idx)}
                    className={`w-full p-3 rounded-xl border text-xs font-semibold text-left transition-all ${
                      incidentContainment === idx
                        ? 'bg-cyan-500/20 border-cyan-500 text-cyan-200 shadow-md'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <span className="font-mono text-cyan-400 shrink-0">{String.fromCharCode(65 + idx)}.</span>
                      <span>{opt}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit / Reset Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              {!incidentFeedback?.submitted ? (
                <button
                  disabled={!incidentClassification || incidentRootCause === null || incidentContainment === null}
                  onClick={handleSubmitIncident}
                  className="w-full sm:w-auto px-6 py-2.5 bg-red-600 hover:bg-red-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-bold text-xs rounded-xl transition-colors shadow-lg shadow-red-600/20"
                >
                  Submit Incident Triage Report
                </button>
              ) : (
                <button
                  onClick={() => setIncidentFeedback(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Try Scenario Again
                </button>
              )}

              {/* Feedback Alert */}
              {incidentFeedback && (
                <div className={`p-4 rounded-xl border flex-1 text-xs ${
                  incidentFeedback.isCorrect
                    ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-200'
                    : 'bg-amber-950/60 border-amber-500/60 text-amber-200'
                }`}>
                  <div className="font-bold flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      {incidentFeedback.isCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-amber-400" />}
                      {incidentFeedback.isCorrect ? 'Outstanding Triage Assessment!' : 'Review Triage Findings'}
                    </span>
                    <span className="font-mono font-bold text-cyan-300">
                      Score: {incidentFeedback.score} / 100 XP
                    </span>
                  </div>
                  <p className="mt-1 opacity-90 leading-relaxed font-sans">
                    {topic.incident.triageOptions.explanation} {topic.incident.rootCauseOptions.explanation}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setActiveTab('sandbox')}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-1.5 border border-slate-800"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Sandbox</span>
            </button>
            <button
              onClick={() => setActiveTab('flashcards')}
              className="px-6 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 transition-colors shadow-lg shadow-purple-600/20"
            >
              <span>Next: Study SOC Interview Flashcards</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Tab 4: SOC Interview Flashcards */}
      {activeTab === 'flashcards' && (
        <div className="space-y-6">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-purple-400" />
              SOC Analyst Job Interview Mastery Deck
            </h3>
            <p className="text-xs text-slate-400">
              Top corporate technical interview questions asked by Tier 2 Leads and Cybersecurity Hiring Managers.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {topic.flashcards.map((card, idx) => {
              const isFlipped = flippedCards[card.id];
              const isMastered = progress.masteredFlashcards.includes(card.id);

              return (
                <div
                  key={card.id}
                  className={`rounded-2xl border transition-all ${
                    isMastered ? 'bg-[#0b141f] border-emerald-500/40' : 'bg-[#0d131f] border-slate-800'
                  } p-5 space-y-3 shadow-xl`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-800 text-purple-300 font-bold">
                        Question {idx + 1}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400 px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                        {card.difficulty}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleToggleMastery(card.id)}
                        className={`text-xs px-2.5 py-1 rounded-lg font-mono flex items-center gap-1 transition-colors ${
                          isMastered
                            ? 'bg-emerald-500 text-black font-bold'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{isMastered ? 'Mastered' : 'Mark Mastered'}</span>
                      </button>
                    </div>
                  </div>

                  <h4 className="text-base font-bold text-white leading-snug">
                    {card.question}
                  </h4>

                  <div className="pt-1">
                    <button
                      onClick={() => handleToggleCardFlip(card.id)}
                      className="px-4 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      {isFlipped ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      <span>{isFlipped ? 'Hide Model Answer' : 'Reveal High-Scoring Model Answer'}</span>
                    </button>
                  </div>

                  {isFlipped && (
                    <div className="mt-3 p-4 rounded-xl bg-[#060a12] border border-slate-800 space-y-3 animate-fadeIn">
                      <div className="space-y-1">
                        <div className="text-[11px] font-mono font-bold text-emerald-400 uppercase">
                          Model Corporate Answer (Target 90%+ Interview Score):
                        </div>
                        <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line">
                          {card.modelAnswer}
                        </p>
                      </div>

                      {/* Scoring Tips */}
                      <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 space-y-1">
                        <div className="text-[10px] font-mono text-cyan-400 font-bold uppercase">
                          What Hiring Managers Score You On:
                        </div>
                        <div className="space-y-0.5">
                          {card.scoringTips.map((tip, i) => (
                            <div key={i} className="text-xs text-slate-300 flex items-start gap-1.5">
                              <span className="text-cyan-400">•</span>
                              <span>{tip}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-400 italic">
                        <strong>Context:</strong> {card.corporateContext}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setActiveTab('incident')}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-1.5 border border-slate-800"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Incident</span>
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-black font-bold text-xs flex items-center gap-2 transition-colors shadow-lg shadow-emerald-600/20"
            >
              <span>Next: Take Topic Knowledge Quiz</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Tab 5: Topic Knowledge Quiz */}
      {activeTab === 'quiz' && (
        <div className="space-y-6">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-400" />
              Topic Certification Knowledge Quiz
            </h3>
            <p className="text-xs text-slate-400">
              Answer all questions to validate comprehension and permanently save your certification score.
            </p>
          </div>

          <div className="space-y-5">
            {topic.quiz.map((q, qIdx) => {
              const selectedOpt = quizAnswers[qIdx];
              const isCorrect = selectedOpt === q.correctIndex;

              return (
                <div key={q.id} className="rounded-2xl bg-[#0d131f] border border-slate-800 p-5 space-y-3 shadow-xl">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-800 text-cyan-300 font-bold">
                      Question {qIdx + 1} of {topic.quiz.length}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white">
                    {q.question}
                  </h4>

                  <div className="space-y-2 pt-1">
                    {q.options.map((opt, optIdx) => {
                      const isChosen = selectedOpt === optIdx;
                      return (
                        <button
                          key={optIdx}
                          disabled={quizSubmitted}
                          onClick={() => setQuizAnswers(prev => ({ ...prev, [qIdx]: optIdx }))}
                          className={`w-full p-3 rounded-xl border text-xs font-semibold text-left transition-all ${
                            quizSubmitted
                              ? optIdx === q.correctIndex
                                ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                                : isChosen
                                ? 'bg-red-950/60 border-red-500 text-red-200'
                                : 'bg-[#111827] border-slate-800 text-slate-400'
                              : isChosen
                              ? 'bg-cyan-500/20 border-cyan-500 text-cyan-200'
                              : 'bg-[#111827] border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            <span className="font-mono text-cyan-400 shrink-0">{String.fromCharCode(65 + optIdx)}.</span>
                            <span>{opt}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {quizSubmitted && (
                    <div className={`p-3 rounded-xl border text-xs leading-relaxed ${
                      isCorrect ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' : 'bg-red-950/40 border-red-500/40 text-red-300'
                    }`}>
                      <strong className="font-bold">Explanation: </strong>
                      {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quiz Submit & Results */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            {!quizSubmitted ? (
              <button
                disabled={Object.keys(quizAnswers).length < topic.quiz.length}
                onClick={handleSubmitQuiz}
                className="w-full sm:w-auto px-8 py-3 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 disabled:text-slate-600 text-black font-extrabold text-xs rounded-xl transition-colors shadow-lg shadow-emerald-500/20"
              >
                Submit Answers & Save Score
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-emerald-300 text-xs font-bold flex items-center gap-2">
                  <Award className="w-5 h-5 text-emerald-400" />
                  <span>
                    Score: {quizScore} / {topic.quiz.length} (
                    {Math.round((quizScore / topic.quiz.length) * 100)}%)
                  </span>
                </div>
                <button
                  onClick={() => {
                    setQuizSubmitted(false);
                    setQuizAnswers({});
                  }}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Retake Quiz
                </button>
              </div>
            )}

            {onNavigateNext && (
              <button
                onClick={onNavigateNext}
                className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs flex items-center gap-2 transition-colors shadow-lg shadow-cyan-500/20"
              >
                <span>Proceed to Next Topic</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

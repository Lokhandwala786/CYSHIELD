export type SeverityLevel = 'Low' | 'Medium' | 'High' | 'Critical' | 'Info';
export type TriageClassification = 'True Positive' | 'False Positive' | 'Benign True Positive';
export type SandboxType = 
  | 'wireshark' 
  | 'ports' 
  | 'windows-events' 
  | 'linux-cli' 
  | 'siem-spl' 
  | 'triage-tree' 
  | 'phishing-headers' 
  | 'mitre-matrix' 
  | 'nist-ir' 
  | 'threat-intel' 
  | 'web-attacks' 
  | 'nmap-burp' 
  | 'iam-evaluator' 
  | 'vpc-flow' 
  | 'cloudtrail';

export interface Flashcard {
  id: string;
  question: string;
  category: string;
  difficulty: 'Junior' | 'Mid' | 'Senior';
  modelAnswer: string;
  scoringTips: string[];
  corporateContext: string;
}

export interface IncidentQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface CorporateIncident {
  id: string;
  ticketNumber: string;
  title: string;
  severity: SeverityLevel;
  affectedAsset: string;
  timestamp: string;
  summary: string;
  rawTelemetry: string | string[] | Record<string, any>[];
  triageOptions: {
    correctClassification: TriageClassification;
    explanation: string;
  };
  rootCauseOptions: {
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  containmentOptions: {
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  mitreTechniques: string[];
  slaMinutes: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface CheatSheetItem {
  term: string;
  description: string;
  commandOrId?: string;
  riskOrUsage?: string;
  severity?: SeverityLevel;
}

export interface Topic {
  id: string;
  phaseId: string;
  title: string;
  subtitle: string;
  estimatedMinutes: number;
  iconName: string;
  analogy: {
    headline: string;
    story: string;
    keyTakeaway: string;
  };
  corporateReality: {
    headline: string;
    deepDive: string;
    architectureNotes: string[];
    realWorldCase: string;
  };
  cheatSheet: {
    title: string;
    description: string;
    headers: string[];
    rows: CheatSheetItem[];
  };
  sandboxType: SandboxType;
  sandboxConfig: {
    title: string;
    instructions: string;
    defaultData?: any;
  };
  incident: CorporateIncident;
  flashcards: Flashcard[];
  quiz: QuizQuestion[];
}

export interface Phase {
  id: string;
  phaseNumber: number;
  title: string;
  description: string;
  iconName: string;
  badgeColor: string;
  topics: Topic[];
}

export interface UserProgressState {
  completedTopics: string[]; // topic IDs
  completedQuizzes: Record<string, { score: number; maxScore: number; date: string }>;
  incidentSubmissions: Record<string, {
    classification: TriageClassification;
    rootCauseIndex: number;
    containmentIndex: number;
    isCorrect: boolean;
    score: number;
    submittedAt: string;
  }>;
  masteredFlashcards: string[]; // flashcard IDs
  lastActiveTopicId: string;
  lastActiveTimestamp: string;
  xp: number;
  streakDays: number;
  userName?: string;
}

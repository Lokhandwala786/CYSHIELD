import { UserProgressState, TriageClassification } from '../types/curriculum';

const STORAGE_KEY = 'cyshield_soc_academy_state_v2';

const DEFAULT_STATE: UserProgressState = {
  completedTopics: [],
  completedQuizzes: {},
  incidentSubmissions: {},
  masteredFlashcards: [],
  lastActiveTopicId: 'osi-tcpip',
  lastActiveTimestamp: new Date().toISOString(),
  xp: 0,
  streakDays: 1,
  userName: 'Cyber Analyst',
};

export class StorageService {
  static loadProgress(): UserProgressState {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return DEFAULT_STATE;
      const parsed = JSON.parse(data);
      return {
        ...DEFAULT_STATE,
        ...parsed,
        // Guarantee arrays exist
        completedTopics: parsed.completedTopics || [],
        completedQuizzes: parsed.completedQuizzes || {},
        incidentSubmissions: parsed.incidentSubmissions || {},
        masteredFlashcards: parsed.masteredFlashcards || [],
      };
    } catch (e) {
      console.error('Failed to load progress from localStorage', e);
      return DEFAULT_STATE;
    }
  }

  static saveProgress(state: UserProgressState): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save progress to localStorage', e);
    }
  }

  static setLastActive(topicId: string): UserProgressState {
    const current = this.loadProgress();
    const updated: UserProgressState = {
      ...current,
      lastActiveTopicId: topicId,
      lastActiveTimestamp: new Date().toISOString(),
    };
    this.saveProgress(updated);
    return updated;
  }

  static toggleTopicCompleted(topicId: string): { state: UserProgressState; isCompleted: boolean } {
    const current = this.loadProgress();
    const exists = current.completedTopics.includes(topicId);
    let updatedTopics: string[];
    let xpGain = 0;

    if (exists) {
      updatedTopics = current.completedTopics.filter(id => id !== topicId);
    } else {
      updatedTopics = [...current.completedTopics, topicId];
      xpGain = 100;
    }

    const updated: UserProgressState = {
      ...current,
      completedTopics: updatedTopics,
      xp: Math.max(0, current.xp + xpGain),
    };

    this.saveProgress(updated);
    return { state: updated, isCompleted: !exists };
  }

  static saveIncidentSubmission(
    incidentId: string,
    submission: {
      classification: TriageClassification;
      rootCauseIndex: number;
      containmentIndex: number;
      isCorrect: boolean;
      score: number;
    }
  ): UserProgressState {
    const current = this.loadProgress();
    const isNew = !current.incidentSubmissions[incidentId];
    const updatedSubmissions = {
      ...current.incidentSubmissions,
      [incidentId]: {
        ...submission,
        submittedAt: new Date().toISOString(),
      },
    };

    const xpEarned = isNew ? submission.score : Math.max(0, submission.score - (current.incidentSubmissions[incidentId]?.score || 0));

    const updated: UserProgressState = {
      ...current,
      incidentSubmissions: updatedSubmissions,
      xp: current.xp + xpEarned,
    };

    this.saveProgress(updated);
    return updated;
  }

  static saveQuizScore(topicId: string, score: number, maxScore: number): UserProgressState {
    const current = this.loadProgress();
    const currentQuiz = current.completedQuizzes[topicId];
    const prevScore = currentQuiz ? currentQuiz.score : 0;
    const additionalXp = Math.max(0, (score - prevScore) * 20);

    const updated: UserProgressState = {
      ...current,
      completedQuizzes: {
        ...current.completedQuizzes,
        [topicId]: {
          score,
          maxScore,
          date: new Date().toISOString(),
        },
      },
      xp: current.xp + additionalXp,
    };

    // If scored 80% or higher, auto-mark topic as completed if not already
    if (score / maxScore >= 0.8 && !updated.completedTopics.includes(topicId)) {
      updated.completedTopics.push(topicId);
      updated.xp += 50;
    }

    this.saveProgress(updated);
    return updated;
  }

  static toggleFlashcardMastery(cardId: string): UserProgressState {
    const current = this.loadProgress();
    const exists = current.masteredFlashcards.includes(cardId);
    let updatedCards: string[];
    let xpGain = 0;

    if (exists) {
      updatedCards = current.masteredFlashcards.filter(id => id !== cardId);
    } else {
      updatedCards = [...current.masteredFlashcards, cardId];
      xpGain = 15;
    }

    const updated: UserProgressState = {
      ...current,
      masteredFlashcards: updatedCards,
      xp: current.xp + xpGain,
    };

    this.saveProgress(updated);
    return updated;
  }

  static updateUserName(name: string): UserProgressState {
    const current = this.loadProgress();
    const updated: UserProgressState = {
      ...current,
      userName: name.trim() || 'Cyber Analyst',
    };
    this.saveProgress(updated);
    return updated;
  }

  static exportProgressJson(): string {
    const state = this.loadProgress();
    return JSON.stringify(state, null, 2);
  }

  static importProgressJson(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (typeof parsed === 'object' && parsed !== null) {
        this.saveProgress({
          ...DEFAULT_STATE,
          ...parsed,
        });
        return true;
      }
      return false;
    } catch (e) {
      console.error('Import failed', e);
      return false;
    }
  }

  static resetProgress(): UserProgressState {
    localStorage.removeItem(STORAGE_KEY);
    return DEFAULT_STATE;
  }
}

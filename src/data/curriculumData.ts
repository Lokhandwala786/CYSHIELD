import { Phase, Topic, CorporateIncident, Flashcard } from '../types/curriculum';
import { phase1 } from './phases/phase1';
import { phase2 } from './phases/phase2';
import { phase3 } from './phases/phase3';
import { phase4 } from './phases/phase4';
import { phase5 } from './phases/phase5';

export const CURRICULUM: Phase[] = [
  phase1,
  phase2,
  phase3,
  phase4,
  phase5,
];

export function getAllPhases(): Phase[] {
  return CURRICULUM;
}

export function getAllTopics(): Topic[] {
  return CURRICULUM.flatMap(p => p.topics);
}

export function getTopicById(topicId: string): Topic | undefined {
  for (const phase of CURRICULUM) {
    const found = phase.topics.find(t => t.id === topicId);
    if (found) return found;
  }
  return undefined;
}

export function getPhaseByTopicId(topicId: string): Phase | undefined {
  return CURRICULUM.find(phase => phase.topics.some(t => t.id === topicId));
}

export function getAllIncidents(): { incident: CorporateIncident; topic: Topic; phase: Phase }[] {
  const result: { incident: CorporateIncident; topic: Topic; phase: Phase }[] = [];
  for (const phase of CURRICULUM) {
    for (const topic of phase.topics) {
      result.push({
        incident: topic.incident,
        topic,
        phase,
      });
    }
  }
  return result;
}

export function getAllFlashcards(): { flashcard: Flashcard; topic: Topic; phase: Phase }[] {
  const result: { flashcard: Flashcard; topic: Topic; phase: Phase }[] = [];
  for (const phase of CURRICULUM) {
    for (const topic of phase.topics) {
      for (const flashcard of topic.flashcards) {
        result.push({
          flashcard,
          topic,
          phase,
        });
      }
    }
  }
  return result;
}

export function getAdjacentTopics(currentTopicId: string): { prev?: Topic; next?: Topic } {
  const allTopics = getAllTopics();
  const index = allTopics.findIndex(t => t.id === currentTopicId);
  if (index === -1) return {};
  return {
    prev: index > 0 ? allTopics[index - 1] : undefined,
    next: index < allTopics.length - 1 ? allTopics[index + 1] : undefined,
  };
}

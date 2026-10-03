import React, { useState, useEffect } from 'react';
import { Menu, X, Shield, Terminal, BookOpen, Award, Layers } from 'lucide-react';
import {
  CURRICULUM,
  getAllTopics,
  getAllIncidents,
  getAllFlashcards,
  getTopicById,
  getPhaseByTopicId,
  getAdjacentTopics,
} from './data/curriculumData';
import { StorageService } from './services/storageService';
import { UserProgressState, Topic, Phase } from './types/curriculum';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { ResumeBanner } from './components/common/ResumeBanner';
import { TopicView } from './components/topic/TopicView';
import { IncidentCenter } from './components/incident/IncidentCenter';
import { FlashcardCenter } from './components/flashcards/FlashcardCenter';
import { CertificateModal } from './components/certificate/CertificateModal';

export const App: React.FC = () => {
  const [progress, setProgress] = useState<UserProgressState>(() => StorageService.loadProgress());
  const [activeView, setActiveView] = useState<'curriculum' | 'incidents' | 'flashcards' | 'certificate'>('curriculum');
  const [selectedTopicId, setSelectedTopicId] = useState<string>(progress.lastActiveTopicId || 'osi-tcpip');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const allTopics = getAllTopics();
  const allIncidents = getAllIncidents();
  const allFlashcards = getAllFlashcards();

  const currentTopic = getTopicById(selectedTopicId) || allTopics[0];
  const currentPhase = getPhaseByTopicId(currentTopic.id) || CURRICULUM[0];
  const { prev: prevTopic, next: nextTopic } = getAdjacentTopics(currentTopic.id);

  const completedCount = progress.completedTopics.length;
  const overallPercentage = Math.round((completedCount / allTopics.length) * 100) || 0;

  // Set last active whenever topic changes
  const handleSelectTopic = (topicId: string) => {
    setSelectedTopicId(topicId);
    const updated = StorageService.setLastActive(topicId);
    setProgress(updated);
    setActiveView('curriculum');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStateUpdate = (newState: UserProgressState) => {
    setProgress(newState);
  };

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Main Navbar */}
      <Navbar
        progress={progress}
        activeView={activeView}
        onViewChange={view => {
          setActiveView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onStateUpdate={handleStateUpdate}
        totalTopicsCount={allTopics.length}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Sidebar - Visible on Curriculum View */}
        {activeView === 'curriculum' && (
          <Sidebar
            phases={CURRICULUM}
            selectedTopicId={currentTopic.id}
            completedTopicIds={progress.completedTopics}
            onSelectTopic={handleSelectTopic}
            isOpen={sidebarOpen}
            onToggle={() => setSidebarOpen(!sidebarOpen)}
          />
        )}

        {/* Backdrop for Mobile Sidebar */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-20 bg-black/60 backdrop-blur-sm lg:hidden"
          />
        )}

        {/* Main Content Area */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 w-full overflow-hidden">
          {/* Mobile Sidebar Toggle Button */}
          {activeView === 'curriculum' && (
            <div className="lg:hidden mb-4 flex items-center justify-between bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
              <button
                onClick={() => setSidebarOpen(true)}
                className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-semibold"
              >
                <Menu className="w-4 h-4" />
                <span>Browse Curriculum Phases</span>
              </button>
              <span className="text-[11px] font-mono text-slate-400">
                {completedCount}/{allTopics.length} done
              </span>
            </div>
          )}

          {/* Active View Router */}
          {activeView === 'curriculum' && (
            <div>
              {/* Prominent Resume Learning Bookmark Banner */}
              <ResumeBanner
                lastTopic={currentTopic}
                phase={currentPhase}
                overallPercentage={overallPercentage}
                completedCount={completedCount}
                totalCount={allTopics.length}
                onResume={handleSelectTopic}
              />

              {/* Comprehensive Topic View (6-step Pedagogy) */}
              <TopicView
                topic={currentTopic}
                phase={currentPhase}
                progress={progress}
                onStateUpdate={handleStateUpdate}
                onNavigateNext={nextTopic ? () => handleSelectTopic(nextTopic.id) : undefined}
                onNavigatePrev={prevTopic ? () => handleSelectTopic(prevTopic.id) : undefined}
              />
            </div>
          )}

          {activeView === 'incidents' && (
            <IncidentCenter
              incidents={allIncidents}
              progress={progress}
              onSelectTopic={handleSelectTopic}
            />
          )}

          {activeView === 'flashcards' && (
            <FlashcardCenter
              cards={allFlashcards}
              progress={progress}
              onStateUpdate={handleStateUpdate}
            />
          )}

          {activeView === 'certificate' && (
            <CertificateModal
              progress={progress}
              totalTopics={allTopics.length}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;

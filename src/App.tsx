import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HomeView from './views/HomeView';
import LessonsView from './views/LessonsView';
import PracticeView from './views/PracticeView';
import ReviewView from './views/ReviewView';
import ExamsView from './views/ExamsView';
import AchievementsView from './views/AchievementsView';
import AssistantView from './views/AssistantView';
import { Heart, Sparkles, BookOpen } from 'lucide-react';

export function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [targetLessonId, setTargetLessonId] = useState<number>(1);

  const handleNavigate = (tab: string, lessonId?: number) => {
    if (lessonId) {
      setTargetLessonId(lessonId);
    }
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col justify-between selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Navbar */}
      <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex-1 w-full">
        {currentTab === 'home' && <HomeView onNavigate={handleNavigate} />}
        {currentTab === 'lessons' && (
          <LessonsView
            initialLessonId={targetLessonId}
            onNavigateToPractice={(id) => handleNavigate('practice', id)}
          />
        )}
        {currentTab === 'practice' && (
          <PracticeView initialLessonId={targetLessonId} />
        )}
        {currentTab === 'review' && <ReviewView />}
        {currentTab === 'exams' && <ExamsView />}
        {currentTab === 'achievements' && <AchievementsView />}
        {currentTab === 'assistant' && <AssistantView />}
      </main>

      {/* Elegant Footer */}
      <footer className="mt-16 border-t border-amber-500/20 bg-neutral-950/80 py-8 text-neutral-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-amber-400 text-sm">في حب ياسمين</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            <span className="text-neutral-500">|</span>
            <span>منصة الرياضيات والمراجعة التفاعلية</span>
          </div>

          <div className="flex items-center gap-6 text-neutral-400">
            <button
              onClick={() => handleNavigate('lessons')}
              className="hover:text-amber-300 transition-colors cursor-pointer"
            >
              شرح المنهج
            </button>
            <button
              onClick={() => handleNavigate('practice')}
              className="hover:text-amber-300 transition-colors cursor-pointer"
            >
              التدريبات
            </button>
            <button
              onClick={() => handleNavigate('review')}
              className="hover:text-amber-300 transition-colors cursor-pointer"
            >
              المراجعة
            </button>
            <button
              onClick={() => handleNavigate('exams')}
              className="hover:text-amber-300 transition-colors cursor-pointer"
            >
              الامتحانات
            </button>
            <button
              onClick={() => handleNavigate('assistant')}
              className="hover:text-amber-300 transition-colors cursor-pointer text-amber-400"
            >
              المساعد الذكي
            </button>
          </div>

          <div className="text-neutral-500 text-[11px]">
            كل خطوة بتتعلميها بتقربك من النجاح ✨
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  CheckCircle,
  HelpCircle,
  FileCheck2,
  Sparkles,
  ArrowLeft,
  Award,
  Clock,
  Compass,
  Heart,
  Flame,
  Check,
} from 'lucide-react';
import { CURRICULUM_LESSONS } from '../data/curriculum';
import {
  getCompletedLessons,
  getLastLesson,
  getOverallProgress,
  subscribeToProgress,
} from '../services/storage';

interface HomeViewProps {
  onNavigate: (tab: string, lessonId?: number) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);
  const [lastLessonId, setLastLessonId] = useState<number>(1);
  const [progress, setProgress] = useState<number>(0);

  const loadData = () => {
    setCompletedLessons(getCompletedLessons());
    setLastLessonId(getLastLesson());
    setProgress(getOverallProgress());
  };

  useEffect(() => {
    loadData();
    const unsubscribe = subscribeToProgress(loadData);
    return unsubscribe;
  }, []);

  const lastLesson =
    CURRICULUM_LESSONS.find((l) => l.id === lastLessonId) || CURRICULUM_LESSONS[0];

  return (
    <div className="space-y-10 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-neutral-900 via-neutral-950 to-neutral-950 border border-amber-500/30 p-6 sm:p-10 lg:p-12 shadow-2xl gold-border-glow">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-amber-600/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold tracking-wide">
            <Heart className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>منصة الرياضيات المخصصة لياسمين</span>
          </div>

          {/* Welcome Title & Message */}
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              أهلاً بيكي يا <span className="gold-gradient-text">ياسمين</span> <span className="inline-block animate-pulse">❤️</span>
            </h1>
            <div className="text-base sm:text-lg text-neutral-300 leading-relaxed bg-neutral-900/60 p-5 rounded-2xl border border-neutral-800 backdrop-blur-sm space-y-2">
              <p className="font-medium text-amber-200/90 text-lg">
                المكان ده معمول مخصوص علشانك.
              </p>
              <p>
                هنا هنفهم الرياضيات مع بعض، ونحل كل المسائل، ونراجع كل درس لحد ما تبقي متميزة فيها.
              </p>
              <p className="text-amber-400 font-semibold pt-1 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                افتكري دايماً إن كل خطوة بتتعلميها بتقربك من النجاح.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => onNavigate('lessons', lastLessonId)}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-neutral-950 gold-gradient-btn hover:brightness-110 shadow-lg shadow-amber-500/25 transition-all cursor-pointer transform hover:-translate-y-0.5"
            >
              <Flame className="w-5 h-5 fill-neutral-950" />
              <span>ابدأ المذاكرة (تابع من الدرس {lastLessonId})</span>
              <ArrowLeft className="w-4 h-4 mr-1" />
            </button>

            <button
              onClick={() => onNavigate('lessons')}
              className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-neutral-200 bg-neutral-900 hover:bg-neutral-800 border border-amber-500/30 transition-all cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>شرح المنهج</span>
            </button>

            <button
              onClick={() => onNavigate('practice')}
              className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-neutral-200 bg-neutral-900 hover:bg-neutral-800 border border-amber-500/30 transition-all cursor-pointer"
            >
              <CheckCircle className="w-4 h-4 text-amber-400" />
              <span>حل التدريبات</span>
            </button>

            <button
              onClick={() => onNavigate('review')}
              className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-neutral-200 bg-neutral-900 hover:bg-neutral-800 border border-amber-500/30 transition-all cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-amber-400" />
              <span>المراجعة والبطاقات</span>
            </button>

            <button
              onClick={() => onNavigate('exams')}
              className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-neutral-200 bg-neutral-900 hover:bg-neutral-800 border border-amber-500/30 transition-all cursor-pointer"
            >
              <FileCheck2 className="w-4 h-4 text-amber-400" />
              <span>الامتحانات</span>
            </button>
          </div>
        </div>
      </section>

      {/* Progress & Quick Stats Card */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Overall Completion */}
        <div className="bg-neutral-900/70 border border-amber-500/25 p-6 rounded-2xl flex flex-col justify-between gold-card-hover">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-neutral-400">نسبة إنجاز المنهج</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-baseline justify-between">
              <span className="text-4xl font-extrabold gold-gradient-text">{progress}%</span>
              <span className="text-xs text-neutral-400 font-mono">
                {completedLessons.length} من 5 دروس
              </span>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-neutral-950 h-3 rounded-full overflow-hidden border border-neutral-800">
              <div
                className="h-full bg-gradient-to-r from-amber-600 via-amber-400 to-amber-300 transition-all duration-500 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Last Visited Lesson */}
        <div className="bg-neutral-900/70 border border-amber-500/25 p-6 rounded-2xl flex flex-col justify-between gold-card-hover">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-neutral-400">آخر درس تمت زيارته</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-lg font-bold text-amber-300 truncate">
              {lastLesson.title}
            </div>
            <p className="text-xs text-neutral-400 mt-1 line-clamp-1">
              {lastLesson.subtitle}
            </p>
          </div>
          <button
            onClick={() => onNavigate('lessons', lastLesson.id)}
            className="mt-4 flex items-center justify-center gap-2 text-xs font-bold text-amber-400 hover:text-amber-300 py-2 bg-amber-500/10 hover:bg-amber-500/20 rounded-xl transition-all border border-amber-500/20 cursor-pointer"
          >
            <span>متابعة الشرح الآن</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Smart Assistant Card */}
        <div className="bg-gradient-to-br from-neutral-900 to-amber-950/30 border border-amber-500/25 p-6 rounded-2xl flex flex-col justify-between gold-card-hover">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-amber-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              المساعد الرياضي الذكي
            </span>
            <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">
              جاهز لمساعدتك
            </span>
          </div>
          <p className="text-xs text-neutral-300 leading-relaxed">
            واقفة في مسألة أو قانون؟ اسألي مساعدكِ الذكي خطوة بخطوة لشرح النظريات وحل المسائل وحساب المجهول.
          </p>
          <button
            onClick={() => onNavigate('assistant')}
            className="mt-4 flex items-center justify-center gap-2 text-xs font-bold text-neutral-950 bg-amber-400 hover:bg-amber-300 py-2.5 rounded-xl transition-all shadow-md shadow-amber-500/20 cursor-pointer"
          >
            <span>اسألي المساعد الذكي</span>
            <Compass className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Curriculum Lessons Cards */}
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800 pb-4">
          <div>
            <h2 className="text-2xl font-black text-white flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-amber-400" />
              <span>دروس المنهج المقررة (5 دروس)</span>
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1">
              شرح مبسط، قوانين دقيقة، أمثلة محلولة خطوة بخطوة، ورسومات هندسية
            </p>
          </div>
          <span className="text-xs text-neutral-400 font-mono bg-neutral-900 px-3 py-1.5 rounded-lg border border-neutral-800 self-start sm:self-auto">
            يُعتبر الدرس مكتملاً عند الضغط على إنهاء الدرس أو حل 3 تدريبات صحيحة
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {CURRICULUM_LESSONS.map((lesson) => {
            const isCompleted = completedLessons.includes(lesson.id);
            return (
              <div
                key={lesson.id}
                className={`relative bg-neutral-900/80 rounded-2xl border p-6 flex flex-col justify-between gold-card-hover ${
                  isCompleted
                    ? 'border-amber-500/50 shadow-md shadow-amber-500/10'
                    : 'border-neutral-800 hover:border-amber-500/30'
                }`}
              >
                {/* Completed badge */}
                {isCompleted && (
                  <div className="absolute top-4 left-4 bg-amber-500 text-neutral-950 px-2.5 py-1 rounded-full text-[11px] font-extrabold flex items-center gap-1 shadow-sm">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>مكتمل</span>
                  </div>
                )}

                <div>
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-lg mb-4">
                    {lesson.id}
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-amber-300">
                    {lesson.title}
                  </h3>
                  <p className="text-xs text-amber-400/80 font-medium mt-1">
                    {lesson.subtitle}
                  </p>
                  <p className="text-xs text-neutral-400 mt-3 line-clamp-3 leading-relaxed">
                    {lesson.introduction}
                  </p>
                </div>

                <div className="pt-6 mt-4 border-t border-neutral-800/80 flex items-center gap-2">
                  <button
                    onClick={() => onNavigate('lessons', lesson.id)}
                    className="flex-1 py-2 px-3 text-xs font-bold text-neutral-200 bg-neutral-950 hover:bg-neutral-800 border border-amber-500/20 hover:border-amber-500/40 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>عرض الشرح</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onNavigate('practice', lesson.id)}
                    className="py-2 px-3 text-xs font-semibold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 rounded-xl border border-amber-500/20 transition-all cursor-pointer"
                    title="حل تدريبات هذا الدرس"
                  >
                    تدريبات
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default HomeView;

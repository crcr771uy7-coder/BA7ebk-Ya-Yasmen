import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Award,
  CheckCircle,
  Clock,
  Sparkles,
  RotateCcw,
  Star,
  ShieldCheck,
  Zap,
  Target,
} from 'lucide-react';
import {
  getCompletedLessons,
  getLastLesson,
  getOverallProgress,
  getPracticeSolved,
  getExamResults,
  resetAllProgress,
  subscribeToProgress,
} from '../services/storage';
import { CURRICULUM_LESSONS } from '../data/curriculum';
import { EXAMS_CONFIG } from '../data/questions';

export const AchievementsView: React.FC = () => {
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);
  const [progress, setProgress] = useState(0);
  const [lastLessonId, setLastLessonId] = useState(1);
  const [practiceRecords, setPracticeRecords] = useState(getPracticeSolved());
  const [examResults, setExamResults] = useState(getExamResults());
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const loadData = () => {
    setCompletedLessons(getCompletedLessons());
    setProgress(getOverallProgress());
    setLastLessonId(getLastLesson());
    setPracticeRecords(getPracticeSolved());
    setExamResults(getExamResults());
  };

  useEffect(() => {
    loadData();
    const unsub = subscribeToProgress(loadData);
    return unsub;
  }, []);

  const lastLesson =
    CURRICULUM_LESSONS.find((l) => l.id === lastLessonId) || CURRICULUM_LESSONS[0];

  const solvedCount = Object.values(practiceRecords).filter((p) => p.correct).length;
  const has100PercentExam = examResults.some((r) => r.percentage === 100);
  const completedSimilarity = completedLessons.includes(4) && completedLessons.includes(5);
  const completedAll = completedLessons.length === 5;

  // Badges Definitions
  const badges = [
    {
      id: 'first-lesson',
      title: 'أتممت درساً',
      desc: 'إتمام أول درس بنجاح في المنهج',
      icon: CheckCircle,
      unlocked: completedLessons.length >= 1,
    },
    {
      id: 'ten-practice',
      title: 'حللت 10 تدريبات',
      desc: 'إجابة 10 تدريبات رياضية بشكل صحيح',
      icon: Zap,
      unlocked: solvedCount >= 10,
    },
    {
      id: 'perfect-score',
      title: 'حصلت على 100%',
      desc: 'الحصول على الدرجة النهائية الكاملة في أي امتحان',
      icon: Star,
      unlocked: has100PercentExam,
    },
    {
      id: 'geometry-master',
      title: 'عالمة هندسة',
      desc: 'إتقان درسي تشابه المضلعات والمثلثات بنجاح',
      icon: ShieldCheck,
      unlocked: completedSimilarity,
    },
    {
      id: 'math-star',
      title: 'نجمة الرياضيات',
      desc: 'إتمام جميع دروس المنهج الخمسة بنسبة 100%',
      icon: Trophy,
      unlocked: completedAll,
    },
  ];

  const handleReset = () => {
    resetAllProgress();
    setShowResetConfirm(false);
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Header */}
      <div className="bg-neutral-900/80 border border-amber-500/20 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
            <Trophy className="w-7 h-7 text-amber-400" />
            <span>لوحة إنجازاتي يا ياسمين</span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            سجل تقدمكِ الدراسي، الأوسمة والشارات التي حققتِها، ونتائج امتحاناتكِ وتدريباتكِ
          </p>
        </div>

        <button
          onClick={() => setShowResetConfirm(true)}
          className="text-xs text-neutral-400 hover:text-red-400 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-800 hover:border-red-500/30 transition-all self-start md:self-auto cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>إعادة ضبط التقدم</span>
        </button>
      </div>

      {/* Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-neutral-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-red-500/40 rounded-3xl p-6 max-w-sm w-full space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">هل أنتِ متأكدة؟</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              سيتم مسح سجل الدروس المكتملة والامتحانات والتدريبات لإعادة المذاكرة من البداية.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={handleReset}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-500 text-white transition-all cursor-pointer"
              >
                نعم، ابدأ من جديد
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-all cursor-pointer"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Progress Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Progress */}
        <div className="bg-neutral-900/70 border border-amber-500/20 rounded-2xl p-6 flex flex-col justify-between gold-card-hover">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-semibold mb-2">
            <span>نسبة إنجاز المنهج</span>
            <Target className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black gold-gradient-text">
            {progress}%
          </div>
          <div className="w-full bg-neutral-950 h-2 rounded-full mt-3 overflow-hidden border border-neutral-800">
            <div
              className="bg-amber-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Completed Lessons */}
        <div className="bg-neutral-900/70 border border-amber-500/20 rounded-2xl p-6 flex flex-col justify-between gold-card-hover">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-semibold mb-2">
            <span>الدروس المكتملة</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-amber-300">
            {completedLessons.length} <span className="text-base text-neutral-400 font-normal">/ 5</span>
          </div>
          <span className="text-xs text-neutral-400 mt-3 block">
            {completedAll ? 'أتممتِ كل الدروس! 🌟' : `متبقي ${5 - completedLessons.length} دروس`}
          </span>
        </div>

        {/* Practice Solved */}
        <div className="bg-neutral-900/70 border border-amber-500/20 rounded-2xl p-6 flex flex-col justify-between gold-card-hover">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-semibold mb-2">
            <span>التدريبات المحلولة</span>
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-emerald-400">
            {solvedCount}
          </div>
          <span className="text-xs text-neutral-400 mt-3 block">
            تدريب تم حله بصورة صحيحة
          </span>
        </div>

        {/* Last Visited Lesson */}
        <div className="bg-neutral-900/70 border border-amber-500/20 rounded-2xl p-6 flex flex-col justify-between gold-card-hover">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-semibold mb-2">
            <span>آخر درس تمت زيارته</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-base font-bold text-white truncate">
            {lastLesson.title}
          </div>
          <span className="text-xs text-neutral-400 mt-3 block truncate">
            {lastLesson.subtitle}
          </span>
        </div>
      </div>

      {/* Badges Section */}
      <div className="bg-neutral-900/70 border border-amber-500/25 rounded-3xl p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span>الشارات والأوسمة الشرفية</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            شارات تفتح تلقائياً عند تحقيق الإنجازات الرياضية المطلوبة
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {badges.map((badge) => {
            const Icon = badge.icon;
            return (
              <div
                key={badge.id}
                className={`p-5 rounded-2xl border transition-all flex items-start gap-4 ${
                  badge.unlocked
                    ? 'bg-gradient-to-br from-neutral-900 to-amber-950/30 border-amber-500/50 shadow-md shadow-amber-500/10'
                    : 'bg-neutral-950/60 border-neutral-800/80 opacity-50'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                    badge.unlocked
                      ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/30'
                      : 'bg-neutral-900 text-neutral-500 border border-neutral-800'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white text-base">{badge.title}</h3>
                    {badge.unlocked && (
                      <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-bold">
                        مكتسبة ✓
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                    {badge.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Best Scores per Exam */}
      <div className="bg-neutral-900/70 border border-amber-500/25 rounded-3xl p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span>أفضل درجة في كل امتحان</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            متابعة نتائجكِ في الاختبارات التقييمية
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {EXAMS_CONFIG.map((exam) => {
            const results = examResults.filter((r) => r.examId === exam.id);
            const best = results.length > 0 ? Math.max(...results.map((r) => r.percentage)) : null;

            return (
              <div
                key={exam.id}
                className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800 flex flex-col justify-between space-y-3"
              >
                <div>
                  <span className="text-[11px] text-amber-400 block font-semibold mb-1">
                    {exam.title}
                  </span>
                  <div className="text-2xl font-black text-white">
                    {best !== null ? (
                      <span className="gold-gradient-text">{best}%</span>
                    ) : (
                      <span className="text-neutral-500 text-sm font-normal">لم تختبري بعد</span>
                    )}
                  </div>
                </div>
                <div className="text-[11px] text-neutral-400 pt-2 border-t border-neutral-900">
                  {results.length > 0 ? `عدد المحاولات: ${results.length}` : 'في انتظار أول محاولة'}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AchievementsView;

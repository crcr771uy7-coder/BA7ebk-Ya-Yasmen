import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  AlertTriangle,
  Lightbulb,
  Award,
  Check,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { CURRICULUM_LESSONS } from '../data/curriculum';
import { MathView } from '../components/MathView';
import { GeometryDiagram } from '../components/GeometryDiagrams';
import {
  getCompletedLessons,
  markLessonCompleted,
  setLastLesson,
  subscribeToProgress,
} from '../services/storage';
import { triggerCelebration } from '../utils/confetti';

interface LessonsViewProps {
  initialLessonId?: number;
  onNavigateToPractice: (lessonId: number) => void;
}

export const LessonsView: React.FC<LessonsViewProps> = ({
  initialLessonId = 1,
  onNavigateToPractice,
}) => {
  const [selectedLessonId, setSelectedLessonId] = useState<number>(initialLessonId);
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);

  const loadCompleted = () => {
    setCompletedLessons(getCompletedLessons());
  };

  useEffect(() => {
    loadCompleted();
    const unsub = subscribeToProgress(loadCompleted);
    return unsub;
  }, []);

  useEffect(() => {
    if (initialLessonId) {
      setSelectedLessonId(initialLessonId);
      setLastLesson(initialLessonId);
    }
  }, [initialLessonId]);

  const lesson =
    CURRICULUM_LESSONS.find((l) => l.id === selectedLessonId) || CURRICULUM_LESSONS[0];

  const isCompleted = completedLessons.includes(lesson.id);

  const handleToggleComplete = () => {
    const newState = !isCompleted;
    markLessonCompleted(lesson.id, newState);
    if (newState) {
      triggerCelebration();
    }
  };

  const handleSelectLesson = (id: number) => {
    setSelectedLessonId(id);
    setLastLesson(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Lessons Switcher Bar */}
      <div className="bg-neutral-900/90 border border-amber-500/20 p-2 sm:p-3 rounded-2xl shadow-xl flex items-center justify-between gap-1 overflow-x-auto scrollbar-none">
        {CURRICULUM_LESSONS.map((l) => {
          const active = l.id === selectedLessonId;
          const finished = completedLessons.includes(l.id);
          return (
            <button
              key={l.id}
              onClick={() => handleSelectLesson(l.id)}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                active
                  ? 'bg-amber-500 text-neutral-950 font-bold shadow-md shadow-amber-500/30'
                  : 'text-neutral-300 hover:text-amber-300 hover:bg-neutral-800'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                  active
                    ? 'bg-neutral-950 text-amber-400'
                    : finished
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    : 'bg-neutral-800 text-neutral-400'
                }`}
              >
                {finished ? '✓' : l.id}
              </span>
              <span>الدرس {l.id}</span>
            </button>
          );
        })}
      </div>

      {/* Main Lesson Container */}
      <div className="bg-neutral-900/70 border border-amber-500/25 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-10">
        
        {/* Header with Title and Completion Action */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 mb-2">
              <span>المنهج المعتمد</span>
              <span>•</span>
              <span>الدرس {lesson.id} من 5</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white">
              {lesson.title}
            </h1>
            <p className="text-amber-200/80 text-sm sm:text-base font-medium">
              {lesson.subtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigateToPractice(lesson.id)}
              className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-amber-300 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 transition-all flex items-center gap-2 cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>انتقل إلى التدريبات</span>
            </button>

            <button
              onClick={handleToggleComplete}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md ${
                isCompleted
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'
                  : 'gold-gradient-btn text-neutral-950 hover:brightness-110 shadow-amber-500/25'
              }`}
            >
              {isCompleted ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>الدرس مكتمل (اضغطي للإلغاء)</span>
                </>
              ) : (
                <>
                  <Award className="w-4 h-4 fill-neutral-950" />
                  <span>إنهاء الدرس</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 1. مقدمة */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-lg">
            <div className="w-2 h-6 bg-amber-400 rounded-full" />
            <h2>1. مقدمة الدرس</h2>
          </div>
          <div className="bg-neutral-950 p-5 rounded-2xl border border-neutral-800 text-neutral-200 text-sm sm:text-base leading-relaxed">
            {lesson.introduction}
          </div>
        </section>

        {/* 2. شرح مبسط من الصفر */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-lg">
            <div className="w-2 h-6 bg-amber-400 rounded-full" />
            <h2>2. شرح مبسط من الصفر</h2>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {lesson.simplifiedExplanation.map((paragraph, index) => (
              <div
                key={index}
                className="bg-neutral-950/90 p-5 rounded-2xl border border-neutral-800/90 text-neutral-200 text-sm sm:text-base leading-relaxed flex items-start gap-3.5"
              >
                <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <MathView>{paragraph}</MathView>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. التعريفات */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-lg">
            <div className="w-2 h-6 bg-amber-400 rounded-full" />
            <h2>3. التعريفات والمصطلحات الأساسية</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lesson.definitions.map((def, idx) => (
              <div
                key={idx}
                className="bg-neutral-950 p-5 rounded-2xl border border-amber-500/20 hover:border-amber-500/40 transition-all space-y-2"
              >
                <div className="text-amber-300 font-bold text-base flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span>{def.term}</span>
                </div>
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                  {def.explanation}
                </p>
                {def.mathFormula && (
                  <div className="pt-2 text-center bg-neutral-900/60 p-2 rounded-xl border border-neutral-800">
                    <MathView math={def.mathFormula} block />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* 4. القوانين */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-lg">
            <div className="w-2 h-6 bg-amber-400 rounded-full" />
            <h2>4. القوانين والمعادلات الرياضية</h2>
          </div>
          <div className="space-y-4">
            {lesson.laws.map((law, idx) => (
              <div
                key={idx}
                className="bg-neutral-950 p-5 rounded-2xl border border-amber-500/30 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <h3 className="text-amber-300 font-bold text-base">
                    {law.name}
                  </h3>
                  {law.condition && (
                    <span className="text-xs text-neutral-400 bg-neutral-900 px-3 py-1 rounded-full border border-neutral-800 self-start sm:self-auto font-mono">
                      الشرط: {law.condition}
                    </span>
                  )}
                </div>
                
                {/* Math Formula Display */}
                <div className="bg-neutral-900/80 p-3 rounded-xl border border-amber-500/20 text-center">
                  <MathView math={law.formula} block />
                </div>

                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                  {law.explanation}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 5. أمثلة محلولة خطوة بخطوة */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-lg">
            <div className="w-2 h-6 bg-amber-400 rounded-full" />
            <h2>5. أمثلة نموذجية محلولة خطوة بخطوة</h2>
          </div>
          <div className="space-y-6">
            {lesson.solvedExamples.map((ex, idx) => (
              <div
                key={idx}
                className="bg-neutral-950 rounded-2xl border border-neutral-800 overflow-hidden"
              >
                <div className="bg-amber-500/10 border-b border-amber-500/20 px-5 py-3 font-bold text-amber-300 text-sm sm:text-base">
                  {ex.title}
                </div>
                <div className="p-5 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                    <div className="bg-neutral-900/70 p-3 rounded-xl border border-neutral-800">
                      <strong className="text-amber-400 block mb-1">المعطيات:</strong>
                      <span className="text-neutral-300">{ex.given}</span>
                    </div>
                    <div className="bg-neutral-900/70 p-3 rounded-xl border border-neutral-800">
                      <strong className="text-amber-400 block mb-1">المطلوب:</strong>
                      <span className="text-neutral-300">{ex.required}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <strong className="text-xs text-neutral-400 font-bold block">
                      خطوات الحل بالتفصيل:
                    </strong>
                    <div className="space-y-2">
                      {ex.steps.map((step, sIdx) => (
                        <div
                          key={sIdx}
                          className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-200 bg-neutral-900/40 p-2.5 rounded-xl border border-neutral-800/60"
                        >
                          <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                            {sIdx + 1}
                          </span>
                          <span className="flex-1">
                            <MathView>{step}</MathView>
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-amber-500/15 border border-amber-500/30 p-3 rounded-xl flex items-center justify-between text-xs sm:text-sm font-bold text-amber-300">
                    <span>الناتج النهائي:</span>
                    <span className="font-mono text-base">{ex.finalAnswer}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 6. رسومات توضيحية Inline SVG */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-lg">
            <div className="w-2 h-6 bg-amber-400 rounded-full" />
            <h2>6. رسومات توضيحية هندسية دقيقة</h2>
          </div>
          {lesson.id === 1 && (
            <GeometryDiagram type="direct_vs_inverse" />
          )}
          {lesson.id === 2 && (
            <GeometryDiagram type="direct_vs_inverse" />
          )}
          {lesson.id === 3 && (
            <GeometryDiagram type="direct_vs_inverse" />
          )}
          {lesson.id === 4 && (
            <div className="space-y-4">
              <GeometryDiagram type="thales_pyramid" />
              <GeometryDiagram type="golden_ratio" />
            </div>
          )}
          {lesson.id === 5 && (
            <div className="space-y-4">
              <GeometryDiagram type="altitude_theorem" />
              <GeometryDiagram type="parallel_line_theorem" />
              <GeometryDiagram type="mirror_method" />
            </div>
          )}
        </section>

        {/* 7. ملاحظات مهمة */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-lg">
            <Lightbulb className="w-5 h-5 text-amber-400" />
            <h2>7. ملاحظات ذهبية مهمة</h2>
          </div>
          <div className="bg-amber-950/20 border border-amber-500/30 rounded-2xl p-5 space-y-2.5">
            {lesson.importantNotes.map((note, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-amber-200/90 leading-relaxed">
                <span className="text-amber-400 text-base font-bold">•</span>
                <span className="flex-1">
                  <MathView>{note}</MathView>
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* 8. الأخطاء الشائعة */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-red-400 font-bold text-lg">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <h2>8. احذري هذه الأخطاء الشائعة</h2>
          </div>
          <div className="space-y-3">
            {lesson.commonMistakes.map((item, idx) => (
              <div
                key={idx}
                className="bg-neutral-950 rounded-2xl border border-red-500/20 p-5 space-y-2.5"
              >
                <div className="flex items-start gap-2 text-xs sm:text-sm text-red-400 font-bold">
                  <span>❌ الخطأ الشائع:</span>
                  <span className="text-neutral-300 font-normal">{item.mistake}</span>
                </div>
                <div className="flex items-start gap-2 text-xs sm:text-sm text-emerald-400 font-bold">
                  <span>✓ الصواب المعتمد:</span>
                  <span className="text-neutral-200 font-normal">{item.correction}</span>
                </div>
                <div className="text-[11px] sm:text-xs text-neutral-400 bg-neutral-900 p-2.5 rounded-xl border border-neutral-800">
                  <strong className="text-amber-400">السبب الرياضي: </strong>
                  {item.why}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 9. ملخص الدرس */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-lg">
            <CheckCircle2 className="w-5 h-5 text-amber-400" />
            <h2>9. ملخص الدرس في نقاط سريعة</h2>
          </div>
          <div className="bg-neutral-950 p-5 rounded-2xl border border-neutral-800 space-y-2">
            {lesson.summary.map((point, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-neutral-200">
                <span className="text-amber-400 font-bold">✓</span>
                <span className="flex-1">
                  <MathView>{point}</MathView>
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Navigation & Lesson Actions (10 & 11) */}
        <div className="pt-6 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {lesson.id > 1 && (
              <button
                onClick={() => handleSelectLesson(lesson.id - 1)}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 text-xs sm:text-sm font-semibold rounded-xl border border-neutral-800 transition-all cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
                <span>الدرس السابق ({lesson.id - 1})</span>
              </button>
            )}
            {lesson.id < 5 && (
              <button
                onClick={() => handleSelectLesson(lesson.id + 1)}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 text-xs sm:text-sm font-semibold rounded-xl border border-neutral-800 transition-all cursor-pointer"
              >
                <span>الدرس التالي ({lesson.id + 1})</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* 10. زر انتقل إلى التدريبات */}
            <button
              onClick={() => onNavigateToPractice(lesson.id)}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-3 text-xs sm:text-sm font-bold text-amber-300 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 rounded-xl transition-all cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>10. انتقل إلى التدريبات</span>
            </button>

            {/* 11. زر إنهاء الدرس */}
            <button
              onClick={handleToggleComplete}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer shadow-lg ${
                isCompleted
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'
                  : 'gold-gradient-btn text-neutral-950 hover:brightness-110 shadow-amber-500/25'
              }`}
            >
              {isCompleted ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>11. الدرس مكتمل ✓</span>
                </>
              ) : (
                <>
                  <Award className="w-4 h-4 fill-neutral-950" />
                  <span>11. إنهاء الدرس</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LessonsView;

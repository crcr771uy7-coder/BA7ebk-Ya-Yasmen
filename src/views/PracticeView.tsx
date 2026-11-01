import React, { useState, useEffect } from 'react';
import {
  CheckCircle,
  XCircle,
  RotateCcw,
  Sparkles,
  HelpCircle,
  Filter,
  Check,
  Award,
  ChevronLeft,
} from 'lucide-react';
import { QUESTIONS_BANK } from '../data/questions';
import { Question, DifficultyLevel } from '../types';
import { MathView } from '../components/MathView';
import {
  getPracticeSolved,
  recordPracticeSolved,
  subscribeToProgress,
} from '../services/storage';
import { triggerCelebration } from '../utils/confetti';

interface PracticeViewProps {
  initialLessonId?: number;
}

export const PracticeView: React.FC<PracticeViewProps> = ({ initialLessonId }) => {
  const [selectedLesson, setSelectedLesson] = useState<number | 'all'>(
    initialLessonId || 'all'
  );
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | 'all'>('all');
  const [practiceRecords, setPracticeRecords] = useState(getPracticeSolved());

  // User input states: questionId -> selected answer or typed answer
  const [userInputs, setUserInputs] = useState<Record<string, string>>({});
  // Submitted status: questionId -> boolean
  const [submittedStatus, setSubmittedStatus] = useState<Record<string, boolean>>({});

  const reloadRecords = () => {
    setPracticeRecords(getPracticeSolved());
  };

  useEffect(() => {
    reloadRecords();
    const unsub = subscribeToProgress(reloadRecords);
    return unsub;
  }, []);

  useEffect(() => {
    if (initialLessonId) {
      setSelectedLesson(initialLessonId);
    }
  }, [initialLessonId]);

  // Filter questions
  const filteredQuestions = QUESTIONS_BANK.filter((q) => {
    if (selectedLesson !== 'all' && q.lessonId !== selectedLesson) return false;
    if (selectedDifficulty !== 'all' && q.difficulty !== selectedDifficulty) return false;
    return true;
  });

  const handleSelectAnswer = (qId: string, answer: string) => {
    if (submittedStatus[qId]) return; // locked after submission unless reset
    setUserInputs((prev) => ({ ...prev, [qId]: answer }));
  };

  const handleInputChange = (qId: string, value: string) => {
    if (submittedStatus[qId]) return;
    setUserInputs((prev) => ({ ...prev, [qId]: value }));
  };

  const handleSubmitQuestion = (q: Question) => {
    const userAnswer = (userInputs[q.id] || '').trim();
    if (!userAnswer) return;

    // Normalize for comparison
    const normUser = userAnswer.toLowerCase().replace(/\s+/g, '');
    const normAns = q.answer.toLowerCase().replace(/\s+/g, '');
    const isCorrect = normUser === normAns;

    setSubmittedStatus((prev) => ({ ...prev, [q.id]: true }));

    const { newlyCompletedLesson } = recordPracticeSolved(q.id, q.lessonId, isCorrect);

    if (isCorrect) {
      triggerCelebration();
    }
    if (newlyCompletedLesson) {
      triggerCelebration();
    }
  };

  const handleRetryQuestion = (qId: string) => {
    setSubmittedStatus((prev) => ({ ...prev, [qId]: false }));
    setUserInputs((prev) => ({ ...prev, [qId]: '' }));
  };

  const difficultyLabels: Record<DifficultyLevel, { label: string; color: string }> = {
    easy: { label: 'سهل', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
    medium: { label: 'متوسط', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
    hard: { label: 'صعب', color: 'bg-red-500/20 text-red-300 border-red-500/30' },
  };

  const typeLabels: Record<string, string> = {
    mcq: 'اختيار من متعدد',
    true_false: 'صح أو خطأ',
    fill_blank: 'أكمل الفراغ',
    find_unknown: 'أوجد المجهول',
    word_problem: 'مسألة كلامية',
    geometry: 'مسألة هندسية',
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header & Filter Controls */}
      <div className="bg-neutral-900/80 border border-amber-500/20 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
              <CheckCircle className="w-7 h-7 text-amber-400" />
              <span>التدريبات وحل المسائل</span>
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1">
              بنك تدريبات تفاعلي مع تصحيح فوري، شرح خطوة بخطوة، وإمكانية إعادة المحاولة
            </p>
          </div>
          <div className="bg-neutral-950 px-4 py-2 rounded-xl border border-amber-500/30 text-xs text-amber-300 flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <span>حل 3 تدريبات صحيحة في أي درس يجعله مكتملاً تلقائياً!</span>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Lesson Filter */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-amber-400" />
              <span>تصفية حسب الدرس:</span>
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedLesson('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  selectedLesson === 'all'
                    ? 'bg-amber-500 text-neutral-950 font-bold'
                    : 'bg-neutral-950 text-neutral-300 hover:bg-neutral-800 border border-neutral-800'
                }`}
              >
                جميع الدروس
              </button>
              {[1, 2, 3, 4, 5].map((id) => (
                <button
                  key={id}
                  onClick={() => setSelectedLesson(id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    selectedLesson === id
                      ? 'bg-amber-500 text-neutral-950 font-bold'
                      : 'bg-neutral-950 text-neutral-300 hover:bg-neutral-800 border border-neutral-800'
                  }`}
                >
                  الدرس {id}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Filter */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
              <span>مستوى الصعوبة:</span>
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedDifficulty('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  selectedDifficulty === 'all'
                    ? 'bg-amber-500 text-neutral-950 font-bold'
                    : 'bg-neutral-950 text-neutral-300 hover:bg-neutral-800 border border-neutral-800'
                }`}
              >
                الكل
              </button>
              {(['easy', 'medium', 'hard'] as DifficultyLevel[]).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setSelectedDifficulty(lvl)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    selectedDifficulty === lvl
                      ? 'bg-amber-500 text-neutral-950 font-bold'
                      : 'bg-neutral-950 text-neutral-300 hover:bg-neutral-800 border border-neutral-800'
                  }`}
                >
                  {difficultyLabels[lvl].label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Counter of matching questions */}
        <div className="text-xs text-neutral-400">
          يتم عرض <strong className="text-amber-400">{filteredQuestions.length}</strong> تدريباً
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-6">
        {filteredQuestions.map((q, qIndex) => {
          const isSubmitted = submittedStatus[q.id];
          const record = practiceRecords[q.id];
          const userAnswer = userInputs[q.id] || '';

          const normUser = userAnswer.toLowerCase().replace(/\s+/g, '');
          const normAns = q.answer.toLowerCase().replace(/\s+/g, '');
          const isCorrect = isSubmitted && normUser === normAns;

          return (
            <div
              key={q.id}
              className={`bg-neutral-900/70 border rounded-3xl p-6 sm:p-8 space-y-6 transition-all ${
                isSubmitted
                  ? isCorrect
                    ? 'border-emerald-500/50 bg-emerald-950/10'
                    : 'border-red-500/50 bg-red-950/10'
                  : 'border-amber-500/20 hover:border-amber-500/35'
              }`}
            >
              {/* Question Meta Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-800 pb-4">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
                    {qIndex + 1}
                  </span>
                  <span className="text-xs text-neutral-400">
                    الدرس {q.lessonId} • {typeLabels[q.type] || q.type}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                      difficultyLabels[q.difficulty].color
                    }`}
                  >
                    {difficultyLabels[q.difficulty].label}
                  </span>
                  {record?.correct && (
                    <span className="text-[11px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1 font-bold">
                      <Check className="w-3 h-3" />
                      <span>تم الحل سابقاً</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Question Text */}
              <div className="text-base sm:text-lg font-bold text-white leading-relaxed">
                <MathView>{q.question}</MathView>
              </div>

              {/* Interactive Options or Input */}
              {q.options && q.options.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = userAnswer === opt;
                    const isCorrectOpt = isSubmitted && opt === q.answer;
                    const isWrongOpt = isSubmitted && isSelected && !isCorrect;

                    let btnStyle = 'bg-neutral-950 text-neutral-200 border-neutral-800 hover:border-amber-500/40';
                    if (isSelected) {
                      btnStyle = 'bg-amber-500/20 text-amber-300 border-amber-500 font-bold';
                    }
                    if (isSubmitted) {
                      if (isCorrectOpt) {
                        btnStyle = 'bg-emerald-500/25 text-emerald-200 border-emerald-500 font-bold';
                      } else if (isWrongOpt) {
                        btnStyle = 'bg-red-500/25 text-red-200 border-red-500 font-bold';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        disabled={isSubmitted}
                        onClick={() => handleSelectAnswer(q.id, opt)}
                        className={`p-4 rounded-2xl border text-right transition-all flex items-center justify-between gap-3 text-sm sm:text-base cursor-pointer disabled:cursor-default ${btnStyle}`}
                      >
                        <span>
                          <MathView>{opt}</MathView>
                        </span>
                        <span
                          className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs shrink-0 ${
                            isSelected
                              ? 'border-amber-400 bg-amber-400 text-neutral-950'
                              : 'border-neutral-700'
                          }`}
                        >
                          {isSelected && '✓'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                /* Free text / numeric input for find_unknown or fill_blank */
                <div className="space-y-2 max-w-md">
                  <label className="text-xs text-neutral-400 block font-medium">
                    اكتبي إجابتكِ هنا:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      disabled={isSubmitted}
                      value={userAnswer}
                      onChange={(e) => handleInputChange(q.id, e.target.value)}
                      placeholder="مثال: 4 أو 20 سم..."
                      className="flex-1 bg-neutral-950 border border-neutral-700 focus:border-amber-400 rounded-xl px-4 py-2.5 text-neutral-100 placeholder:text-neutral-600 outline-none transition-colors"
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons: Submit or Retry */}
              <div className="flex items-center gap-3 pt-2">
                {!isSubmitted ? (
                  <button
                    onClick={() => handleSubmitQuestion(q)}
                    disabled={!userAnswer}
                    className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-neutral-950 gold-gradient-btn hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md shadow-amber-500/20 cursor-pointer"
                  >
                    تأكيد الإجابة والتصحيح الفوري
                  </button>
                ) : (
                  <button
                    onClick={() => handleRetryQuestion(q.id)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-neutral-200 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4 text-amber-400" />
                    <span>حاولي مرة أخرى</span>
                  </button>
                )}
              </div>

              {/* Instant Correction & Step-by-Step Explanation */}
              {isSubmitted && (
                <div
                  className={`p-5 rounded-2xl border space-y-4 animate-in fade-in duration-200 ${
                    isCorrect
                      ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
                      : 'bg-red-950/20 border-red-500/40 text-red-200'
                  }`}
                >
                  <div className="flex items-center gap-2 text-base font-bold">
                    {isCorrect ? (
                      <>
                        <CheckCircle className="w-5 h-5 text-emerald-400" />
                        <span className="text-emerald-400">إجابة صحيحة وممتازة يا ياسمين! 🌟</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5 text-red-400" />
                        <span className="text-red-400">إجابة غير صحيحة، لا بأس فالأخطاء طريق التعلم! ✨</span>
                      </>
                    )}
                  </div>

                  <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 text-neutral-200 space-y-3 text-xs sm:text-sm">
                    <div className="font-bold text-amber-300">
                      طريقة الوصول للحل خطوة بخطوة:
                    </div>
                    <div className="space-y-1.5">
                      {q.solution.map((step, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <span className="text-amber-400 font-bold">•</span>
                          <span className="flex-1">
                            <MathView>{step}</MathView>
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-neutral-800/80 text-neutral-300">
                      <strong className="text-amber-400">الشرح الرياضي: </strong>
                      <MathView>{q.explanation}</MathView>
                    </div>

                    <div className="pt-1 text-emerald-400 font-mono font-bold">
                      الإجابة النموذجية المعتمدة: {q.answer}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PracticeView;

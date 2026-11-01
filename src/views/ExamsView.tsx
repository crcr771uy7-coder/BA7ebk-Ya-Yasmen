import React, { useState, useEffect } from 'react';
import {
  FileCheck2,
  Clock,
  Award,
  AlertCircle,
  CheckCircle,
  XCircle,
  RotateCcw,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Trophy,
} from 'lucide-react';
import { EXAMS_CONFIG, QUESTIONS_BANK } from '../data/questions';
import { ExamDefinition, ExamResult, Question } from '../types';
import { MathView } from '../components/MathView';
import {
  getExamResults,
  saveExamResult,
  subscribeToProgress,
} from '../services/storage';
import { triggerGrandCelebration, triggerCelebration } from '../utils/confetti';

export const ExamsView: React.FC = () => {
  // Current exam taking state
  const [activeExam, setActiveExam] = useState<ExamDefinition | null>(null);
  const [examQuestions, setExamQuestions] = useState<Question[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState(0);
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [examResult, setExamResult] = useState<ExamResult | null>(null);

  // Past results history
  const [pastResults, setPastResults] = useState<ExamResult[]>([]);

  const loadPastResults = () => {
    setPastResults(getExamResults());
  };

  useEffect(() => {
    loadPastResults();
    const unsub = subscribeToProgress(loadPastResults);
    return unsub;
  }, []);

  // Timer countdown
  useEffect(() => {
    if (!activeExam || examSubmitted) return;

    if (timeRemainingSeconds <= 0) {
      // Auto submit on time out
      handleSubmitExam();
      return;
    }

    const timer = setInterval(() => {
      setTimeRemainingSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [activeExam, examSubmitted, timeRemainingSeconds]);

  const handleStartExam = (exam: ExamDefinition) => {
    // Select relevant questions
    const eligible = QUESTIONS_BANK.filter((q) => exam.lessonIds.includes(q.lessonId));
    
    // Shuffle and pick exam.questionCount questions
    const shuffled = [...eligible].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.min(exam.questionCount, shuffled.length));

    setActiveExam(exam);
    setExamQuestions(selected);
    setCurrentQIndex(0);
    setUserAnswers({});
    setExamSubmitted(false);
    setExamResult(null);
    setTimeRemainingSeconds(exam.timeMinutes * 60);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAnswerOption = (questionId: string, answer: string) => {
    if (examSubmitted) return;
    setUserAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmitExam = () => {
    if (!activeExam || examSubmitted) return;

    // Calculate score
    let score = 0;
    examQuestions.forEach((q) => {
      const uAns = (userAnswers[q.id] || '').trim().toLowerCase().replace(/\s+/g, '');
      const cAns = q.answer.trim().toLowerCase().replace(/\s+/g, '');
      if (uAns === cAns) {
        score++;
      }
    });

    const total = examQuestions.length;
    const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
    const timeSpent = activeExam.timeMinutes * 60 - Math.max(0, timeRemainingSeconds);

    const result: ExamResult = {
      id: `res-${Date.now()}`,
      examId: activeExam.id,
      examTitle: activeExam.title,
      date: new Date().toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      score,
      total,
      percentage,
      timeSpentSeconds: timeSpent,
      userAnswers: { ...userAnswers },
    };

    saveExamResult(result);
    setExamResult(result);
    setExamSubmitted(true);

    if (percentage === 100) {
      triggerGrandCelebration();
    } else if (percentage >= 70) {
      triggerCelebration();
    }
  };

  const handleExitExam = () => {
    setActiveExam(null);
    setExamQuestions([]);
    setExamSubmitted(false);
    setExamResult(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-8 pb-16">
      {/* If taking an exam */}
      {activeExam ? (
        <div className="space-y-6">
          {/* Top Exam Header & Timer */}
          <div className="sticky top-20 z-40 bg-neutral-900/95 backdrop-blur-md border border-amber-500/30 rounded-2xl p-4 sm:p-5 flex items-center justify-between shadow-xl">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-amber-400" />
                <span>{activeExam.title}</span>
              </h2>
              <span className="text-xs text-neutral-400">
                السؤال {currentQIndex + 1} من {examQuestions.length}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {!examSubmitted ? (
                <div className="flex items-center gap-2 bg-neutral-950 px-3.5 py-1.5 rounded-xl border border-amber-500/30 text-amber-300 font-mono text-sm sm:text-base font-bold">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>{formatTimer(timeRemainingSeconds)}</span>
                </div>
              ) : (
                <button
                  onClick={handleExitExam}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-neutral-200 bg-neutral-800 hover:bg-neutral-700 transition-all cursor-pointer"
                >
                  العودة لقائمة الامتحانات
                </button>
              )}
            </div>
          </div>

          {/* If exam is finished and submitted */}
          {examSubmitted && examResult && (
            <div className="bg-neutral-900/90 border border-amber-500/40 rounded-3xl p-6 sm:p-10 space-y-6 text-center shadow-2xl gold-border-glow animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-2">
                <Trophy className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                  نتيجة الامتحان يا ياسمين! 🎉
                </h3>
                <p className="text-sm text-neutral-400 mt-1">
                  {activeExam.title}
                </p>
              </div>

              <div className="inline-flex items-center justify-center gap-6 bg-neutral-950 p-6 rounded-2xl border border-amber-500/30 max-w-md mx-auto w-full">
                <div>
                  <div className="text-xs text-neutral-400 mb-1">الدرجة النهائية</div>
                  <div className="text-3xl font-black text-amber-400">
                    {examResult.score} / {examResult.total}
                  </div>
                </div>
                <div className="w-px h-12 bg-neutral-800" />
                <div>
                  <div className="text-xs text-neutral-400 mb-1">النسبة المئوية</div>
                  <div className="text-3xl font-black gold-gradient-text">
                    {examResult.percentage}%
                  </div>
                </div>
              </div>

              <div className="text-sm text-neutral-300 max-w-lg mx-auto">
                {examResult.percentage >= 85 ? (
                  <span className="text-emerald-400 font-bold">
                    مستوى رائع ومتميز جداً! استمري في هذا التفوق الباهر! 🌟
                  </span>
                ) : examResult.percentage >= 60 ? (
                  <span className="text-amber-300 font-bold">
                    أداء جيد جداً! راجعي الأسئلة غير الصحيحة بالأسفل لتصلي إلى 100% في المحاولة القادمة! ✨
                  </span>
                ) : (
                  <span className="text-neutral-300 font-medium">
                    فرصة ممتازة لمراجعة القوانين وحل المزيد من التدريبات، المحاولة القادمة ستكون أفضل بالتأكيد! 💪
                  </span>
                )}
              </div>

              <div className="flex flex-wrap justify-center gap-3 pt-2">
                <button
                  onClick={() => handleStartExam(activeExam)}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-neutral-950 gold-gradient-btn hover:brightness-110 shadow-lg cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>إعادة الامتحان بأسئلة جديدة</span>
                </button>
                <button
                  onClick={handleExitExam}
                  className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-neutral-200 bg-neutral-800 hover:bg-neutral-700 transition-all cursor-pointer"
                >
                  الخروج لقائمة الامتحانات
                </button>
              </div>
            </div>
          )}

          {/* Current Question Display (During exam or reviewing) */}
          {examQuestions.length > 0 && (
            <div className="space-y-6">
              {examQuestions.map((q, idx) => {
                // If taking exam, only show active question, or if submitted show all for review
                if (!examSubmitted && idx !== currentQIndex) return null;

                const userAnswer = userAnswers[q.id] || '';
                const normUser = userAnswer.trim().toLowerCase().replace(/\s+/g, '');
                const normAns = q.answer.trim().toLowerCase().replace(/\s+/g, '');
                const isCorrect = normUser === normAns;

                return (
                  <div
                    key={q.id}
                    className={`bg-neutral-900/80 border rounded-3xl p-6 sm:p-8 space-y-6 transition-all ${
                      examSubmitted
                        ? isCorrect
                          ? 'border-emerald-500/50 bg-emerald-950/10'
                          : 'border-red-500/50 bg-red-950/10'
                        : 'border-amber-500/25'
                    }`}
                  >
                    <div className="flex items-center justify-between border-b border-neutral-800 pb-3 text-xs">
                      <span className="text-amber-400 font-bold">
                        السؤال {idx + 1} من {examQuestions.length} • الدرس {q.lessonId}
                      </span>
                      {examSubmitted && (
                        <span
                          className={`font-bold px-2.5 py-0.5 rounded-full ${
                            isCorrect
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-red-500/20 text-red-300'
                          }`}
                        >
                          {isCorrect ? '✓ إجابة صحيحة' : '✗ إجابة غير صحيحة'}
                        </span>
                      )}
                    </div>

                    <div className="text-base sm:text-lg font-bold text-white leading-relaxed">
                      <MathView>{q.question}</MathView>
                    </div>

                    {/* Options */}
                    {q.options && q.options.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {q.options.map((opt, optIdx) => {
                          const isSelected = userAnswer === opt;
                          const isCorrectOpt = examSubmitted && opt === q.answer;
                          const isWrongOpt = examSubmitted && isSelected && !isCorrect;

                          let btnStyle = 'bg-neutral-950 text-neutral-200 border-neutral-800';
                          if (isSelected) {
                            btnStyle = 'bg-amber-500/20 text-amber-300 border-amber-500 font-bold';
                          }
                          if (examSubmitted) {
                            if (isCorrectOpt) {
                              btnStyle = 'bg-emerald-500/25 text-emerald-200 border-emerald-500 font-bold';
                            } else if (isWrongOpt) {
                              btnStyle = 'bg-red-500/25 text-red-200 border-red-500 font-bold';
                            }
                          }

                          return (
                            <button
                              key={optIdx}
                              disabled={examSubmitted}
                              onClick={() => handleAnswerOption(q.id, opt)}
                              className={`p-4 rounded-2xl border text-right transition-all flex items-center justify-between gap-3 text-sm cursor-pointer disabled:cursor-default ${btnStyle}`}
                            >
                              <span>
                                <MathView>{opt}</MathView>
                              </span>
                              <span
                                className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs shrink-0 ${
                                  isSelected
                                    ? 'border-amber-400 bg-amber-400 text-neutral-950 font-bold'
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
                      <div className="max-w-md">
                        <input
                          type="text"
                          disabled={examSubmitted}
                          value={userAnswer}
                          onChange={(e) => handleAnswerOption(q.id, e.target.value)}
                          placeholder="اكتبي إجابتكِ..."
                          className="w-full bg-neutral-950 border border-neutral-700 focus:border-amber-400 rounded-xl px-4 py-2.5 text-neutral-100 outline-none"
                        />
                      </div>
                    )}

                    {/* Explanations shown only in review mode */}
                    {examSubmitted && (
                      <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 text-neutral-200 text-xs sm:text-sm space-y-2">
                        <div className="text-emerald-400 font-bold">
                          الإجابة النموذجية: {q.answer}
                        </div>
                        <div className="space-y-1 text-neutral-300">
                          <strong className="text-amber-400 block">خطوات الحل:</strong>
                          {q.solution.map((st, sI) => (
                            <div key={sI}>• <MathView>{st}</MathView></div>
                          ))}
                        </div>
                        <div className="pt-2 text-neutral-400">
                          <strong className="text-amber-300">الشرح: </strong>
                          <MathView>{q.explanation}</MathView>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Navigation Between Questions during Exam */}
          {!examSubmitted && (
            <div className="flex items-center justify-between gap-4 pt-4 border-t border-neutral-800">
              <button
                disabled={currentQIndex === 0}
                onClick={() => setCurrentQIndex((prev) => prev - 1)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-900 text-neutral-200 text-xs sm:text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
                <span>السؤال السابق</span>
              </button>

              {currentQIndex < examQuestions.length - 1 ? (
                <button
                  onClick={() => setCurrentQIndex((prev) => prev + 1)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs sm:text-sm font-bold border border-amber-500/30 cursor-pointer"
                >
                  <span>السؤال التالي</span>
                  <ChevronLeft className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmitExam}
                  className="flex items-center gap-2 px-7 py-3 rounded-xl text-xs sm:text-sm font-bold text-neutral-950 gold-gradient-btn hover:brightness-110 shadow-lg cursor-pointer"
                >
                  <span>إنهاء الامتحان وتسليم الإجابات</span>
                  <CheckCircle className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      ) : (
        /* Exam Selection Dashboard */
        <div className="space-y-10">
          <div className="bg-neutral-900/80 border border-amber-500/20 rounded-3xl p-6 sm:p-8 shadow-xl">
            <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
              <FileCheck2 className="w-7 h-7 text-amber-400" />
              <span>الامتحانات والاختبارات التقييمية</span>
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1">
              امتحانات مجهزة لكل درس، امتحانات وحدات مجمعة، والامتحان النهائي الشامل مع حساب فوري للدرجات وتصحيح تفصيلي
            </p>
          </div>

          {/* Exams Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {EXAMS_CONFIG.map((exam) => {
              // Check past best score
              const relevantResults = pastResults.filter((r) => r.examId === exam.id);
              const bestScore = relevantResults.length > 0
                ? Math.max(...relevantResults.map((r) => r.percentage))
                : null;

              return (
                <div
                  key={exam.id}
                  className="bg-neutral-900/70 border border-amber-500/20 hover:border-amber-500/40 rounded-3xl p-6 flex flex-col justify-between gold-card-hover"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        {exam.questionCount} سؤال • {exam.timeMinutes} دقيقة
                      </span>
                      {bestScore !== null && (
                        <span className="text-xs font-mono font-bold text-amber-300 bg-neutral-950 px-2.5 py-1 rounded-lg border border-neutral-800">
                          أفضل نتيجة: {bestScore}%
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-white group-hover:text-amber-300">
                      {exam.title}
                    </h3>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      {exam.description}
                    </p>
                  </div>

                  <div className="pt-6 mt-4 border-t border-neutral-800">
                    <button
                      onClick={() => handleStartExam(exam)}
                      className="w-full py-3 rounded-xl text-xs sm:text-sm font-bold text-neutral-950 gold-gradient-btn hover:brightness-110 shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>ابدأي الامتحان الآن</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Past Attempts History */}
          {pastResults.length > 0 && (
            <div className="bg-neutral-900/70 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-400" />
                <span>سجل المحاولات السابقة</span>
              </h2>
              <div className="divide-y divide-neutral-800/80 overflow-x-auto">
                {pastResults.slice(0, 5).map((res) => (
                  <div key={res.id} className="py-3 flex items-center justify-between text-xs sm:text-sm gap-4 min-w-[500px]">
                    <div>
                      <strong className="text-white block">{res.examTitle}</strong>
                      <span className="text-neutral-400 text-xs">{res.date}</span>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="text-neutral-300">
                        الدرجة: <strong className="text-amber-400">{res.score}/{res.total}</strong>
                      </span>
                      <span className="font-bold text-base gold-gradient-text">
                        {res.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ExamsView;

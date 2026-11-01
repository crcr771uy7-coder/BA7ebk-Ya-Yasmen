import React, { useState } from 'react';
import {
  HelpCircle,
  Layers,
  BookOpen,
  ArrowRightLeft,
  CheckCircle,
  Lightbulb,
  Sparkles,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { CURRICULUM_LESSONS } from '../data/curriculum';
import { FLASHCARDS_DATA } from '../data/flashcards';
import { MathView } from '../components/MathView';
import { GeometryDiagram } from '../components/GeometryDiagrams';

export const ReviewView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'flashcards' | 'comparisons' | 'all_laws' | 'summaries'>('flashcards');
  
  // Flashcards state
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const currentCard = FLASHCARDS_DATA[currentCardIndex];

  const handleNextCard = () => {
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev + 1) % FLASHCARDS_DATA.length);
  };

  const handlePrevCard = () => {
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev - 1 + FLASHCARDS_DATA.length) % FLASHCARDS_DATA.length);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Review Header */}
      <div className="bg-neutral-900/80 border border-amber-500/20 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
              <HelpCircle className="w-7 h-7 text-amber-400" />
              <span>المراجعة الشاملة والبطاقات الذكية</span>
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1">
              مراجعة سريعة لجميع القوانين والمقارنات الجوهرية وبطاقات فلاش كاردز تفاعلية قابلة للقلب
            </p>
          </div>
        </div>

        {/* Sub-tabs */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-neutral-800">
          <button
            onClick={() => setActiveTab('flashcards')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'flashcards'
                ? 'bg-amber-500 text-neutral-950 font-bold shadow-md shadow-amber-500/20'
                : 'bg-neutral-950 text-neutral-300 hover:bg-neutral-800 border border-neutral-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>البطاقات التعليمية (Flashcards)</span>
          </button>

          <button
            onClick={() => setActiveTab('comparisons')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'comparisons'
                ? 'bg-amber-500 text-neutral-950 font-bold shadow-md shadow-amber-500/20'
                : 'bg-neutral-950 text-neutral-300 hover:bg-neutral-800 border border-neutral-800'
            }`}
          >
            <ArrowRightLeft className="w-4 h-4" />
            <span>المقارنات الجوهرية</span>
          </button>

          <button
            onClick={() => setActiveTab('all_laws')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'all_laws'
                ? 'bg-amber-500 text-neutral-950 font-bold shadow-md shadow-amber-500/20'
                : 'bg-neutral-950 text-neutral-300 hover:bg-neutral-800 border border-neutral-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>دليل القوانين والتعريفات</span>
          </button>

          <button
            onClick={() => setActiveTab('summaries')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'summaries'
                ? 'bg-amber-500 text-neutral-950 font-bold shadow-md shadow-amber-500/20'
                : 'bg-neutral-950 text-neutral-300 hover:bg-neutral-800 border border-neutral-800'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            <span>ملخص الدروس الخمسة</span>
          </button>
        </div>
      </div>

      {/* 1. FLASHCARDS SECTION */}
      {activeTab === 'flashcards' && (
        <div className="space-y-6 max-w-2xl mx-auto">
          <div className="flex items-center justify-between text-xs text-neutral-400 px-2">
            <span>
              بطاقة <strong className="text-amber-400">{currentCardIndex + 1}</strong> من{' '}
              {FLASHCARDS_DATA.length}
            </span>
            <span className="bg-neutral-900 border border-amber-500/20 px-3 py-1 rounded-full text-amber-300">
              {currentCard.category} • الدرس {currentCard.lessonId}
            </span>
          </div>

          {/* Interactive Flip Card */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="cursor-pointer group relative min-h-[320px] rounded-3xl p-8 bg-neutral-900/90 border-2 border-amber-500/30 hover:border-amber-400 transition-all flex flex-col items-center justify-center text-center shadow-2xl gold-border-glow select-none"
          >
            <div className="absolute top-4 right-4 text-[11px] text-amber-400/80 bg-neutral-950/80 px-2.5 py-1 rounded-full border border-amber-500/20">
              {isFlipped ? 'الإجابة والشرح' : 'السؤال (اضغطي للقلب)'}
            </div>

            {!isFlipped ? (
              <div className="space-y-4 animate-in fade-in duration-200">
                <span className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-2">
                  <Lightbulb className="w-6 h-6" />
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white leading-relaxed">
                  {currentCard.front}
                </h3>
                <span className="text-xs text-amber-400/70 block pt-4">
                  اضغطي لرؤية الإجابة والقانون ↻
                </span>
              </div>
            ) : (
              <div className="space-y-4 animate-in fade-in duration-200">
                <span className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-1">
                  ✓
                </span>
                <p className="text-base sm:text-lg text-neutral-200 leading-relaxed font-medium">
                  {currentCard.back}
                </p>
                {currentCard.formula && (
                  <div className="pt-2">
                    <MathView math={currentCard.formula} block />
                  </div>
                )}
                <span className="text-xs text-neutral-400 block pt-2">
                  اضغطي للعودة للسؤال ↺
                </span>
              </div>
            )}
          </div>

          {/* Card Navigation Controls */}
          <div className="flex items-center justify-between gap-4 pt-2">
            <button
              onClick={handlePrevCard}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-200 text-sm font-semibold transition-all cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
              <span>البطاقة السابقة</span>
            </button>
            <button
              onClick={() => setIsFlipped(!isFlipped)}
              className="px-5 py-3 rounded-2xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-sm font-bold transition-all cursor-pointer"
            >
              قلب البطاقة ↻
            </button>
            <button
              onClick={handleNextCard}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-200 text-sm font-semibold transition-all cursor-pointer"
            >
              <span>البطاقة التالية</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 2. COMPARISONS SECTION */}
      {activeTab === 'comparisons' && (
        <div className="space-y-8">
          {/* Direct vs Inverse Variation Comparison */}
          <div className="bg-neutral-900/70 border border-amber-500/25 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-2 text-xl font-bold text-amber-300 border-b border-neutral-800 pb-3">
              <ArrowRightLeft className="w-5 h-5 text-amber-400" />
              <span>مقارنة تفصيلية: التغير الطردي مقابل التغير العكسي</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-neutral-800 text-neutral-400">
                    <th className="py-3 px-4 font-bold">وجه المقارنة</th>
                    <th className="py-3 px-4 font-bold text-amber-400">التغير الطردي (Direct)</th>
                    <th className="py-3 px-4 font-bold text-sky-400">التغير العكسي (Inverse)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60 text-neutral-200">
                  <tr>
                    <td className="py-3.5 px-4 font-semibold text-neutral-300">التعريف اللفظي</td>
                    <td className="py-3.5 px-4">إذا زاد أحدهما زاد الآخر بنفس النسبة (أو نقصا معاً)</td>
                    <td className="py-3.5 px-4">إذا زاد أحدهما نقص الآخر بنفس النسبة (حركة متعاكسة)</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-semibold text-neutral-300">العلاقة والمعادلة</td>
                    <td className="py-3.5 px-4">
                      <MathView math="y = kx \quad (k \neq 0)" />
                    </td>
                    <td className="py-3.5 px-4">
                      <MathView math="y = \frac{k}{x} \quad \text{أو} \quad xy = k" />
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-semibold text-neutral-300">الكمية الثابتة k</td>
                    <td className="py-3.5 px-4 font-bold text-amber-300">
                      <MathView math="k = \frac{y}{x} \quad \text{(النسبة ثابتة)}" />
                    </td>
                    <td className="py-3.5 px-4 font-bold text-sky-300">
                      <MathView math="k = x \cdot y \quad \text{(حاصل الضرب ثابت)}" />
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-semibold text-neutral-300">قانون المقارنة بين حالتين</td>
                    <td className="py-3.5 px-4">
                      <MathView math="\frac{y_1}{y_2} = \frac{x_1}{x_2}" /> (نفس الترتيب)
                    </td>
                    <td className="py-3.5 px-4">
                      <MathView math="\frac{y_1}{y_2} = \frac{x_2}{x_1}" /> (النسبة مقلوبة!)
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-semibold text-neutral-300">التمثيل البياني</td>
                    <td className="py-3.5 px-4">مستقيم يمر بنقطة الأصل (0, 0)</td>
                    <td className="py-3.5 px-4">منحنى قطع زائد لا يمر بنقطة الأصل ولا يمس المحورين</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-semibold text-neutral-300">مثال تطبيقي</td>
                    <td className="py-3.5 px-4">تكلفة إنتاج القطع مع عددها، كمية الماء مع زمن الضخ</td>
                    <td className="py-3.5 px-4">زمن الرحلة مع سرعة السيارة، زمن الإنجاز مع عدد العمال</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <GeometryDiagram type="direct_vs_inverse" />
          </div>

          {/* Ratio vs Proportion Comparison */}
          <div className="bg-neutral-900/70 border border-amber-500/25 rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2 text-xl font-bold text-amber-300 border-b border-neutral-800 pb-3">
              <ArrowRightLeft className="w-5 h-5 text-amber-400" />
              <span>مقارنة: النسبة مقابل التناسب</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-neutral-950 p-5 rounded-2xl border border-neutral-800 space-y-2">
                <h3 className="font-bold text-amber-400 text-base">النسبة (Ratio)</h3>
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                  مقارنة بين كميتين فقط من نفس النوع والوحدة عن طريق القسمة، وتكتب على صورة x/y أو x:y. لا تمييز لها، ولا تتغير قيمتها إذا ضُرب أو قسم حداها على نفس العدد غير الصفري.
                </p>
                <div className="bg-neutral-900 p-2 rounded-xl text-center font-mono text-xs text-amber-300">
                  15 : 20 = 3 : 4
                </div>
              </div>

              <div className="bg-neutral-950 p-5 rounded-2xl border border-neutral-800 space-y-2">
                <h3 className="font-bold text-amber-400 text-base">التناسب (Proportion)</h3>
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                  تساوي نسبتين أو أكثر a/b = c/d. يربط أربع كميات أو أكثر، والخاصية الجوهرية هي الضرب التبادلي: حاصل ضرب الطرفين = حاصل ضرب الوسطين (a × d = b × c).
                </p>
                <div className="bg-neutral-900 p-2 rounded-xl text-center font-mono text-xs text-amber-300">
                  a × d = b × c (لحساب أي مجهول)
                </div>
              </div>
            </div>
          </div>

          {/* Polygons vs Triangles Similarity */}
          <div className="bg-neutral-900/70 border border-amber-500/25 rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2 text-xl font-bold text-amber-300 border-b border-neutral-800 pb-3">
              <ArrowRightLeft className="w-5 h-5 text-amber-400" />
              <span>مراجعة تشابه المضلعات والمثلثات</span>
            </div>
            <div className="space-y-4 text-xs sm:text-sm text-neutral-300 leading-relaxed">
              <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800">
                <strong className="text-amber-400 block mb-1">المضلعات عامة:</strong>
                يجب تحقق الشرطين معاً: تساوي جميع الزوايا المتناظرة + تناسب جميع الأضلاع المتناظرة.
              </div>
              <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800">
                <strong className="text-amber-400 block mb-1">المثلثات خاصة:</strong>
                يكفي تحقق أحد 3 شروط ميسرة:
                <ul className="list-disc list-inside mt-2 space-y-1 text-neutral-200">
                  <li><strong>AA:</strong> تساوي قياس زاويتين في المثلثين.</li>
                  <li><strong>SSS:</strong> تناسب أطوال الأضلاع الثلاثة المتناظرة.</li>
                  <li><strong>SAS:</strong> تناسب طولي ضلعين وتساوي قياس الزاوية المحصورة بينهما.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. ALL LAWS & DEFINITIONS SECTION */}
      {activeTab === 'all_laws' && (
        <div className="space-y-6">
          {CURRICULUM_LESSONS.map((l) => (
            <div
              key={l.id}
              className="bg-neutral-900/70 border border-amber-500/25 rounded-3xl p-6 sm:p-8 space-y-4"
            >
              <h2 className="text-lg sm:text-xl font-bold text-amber-300 flex items-center gap-2 border-b border-neutral-800 pb-3">
                <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs font-bold">
                  {l.id}
                </span>
                <span>{l.title}</span>
              </h2>

              {/* Definitions */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                  التعريفات:
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {l.definitions.map((def, idx) => (
                    <div key={idx} className="bg-neutral-950 p-3.5 rounded-xl border border-neutral-800 text-xs">
                      <strong className="text-amber-400 block mb-1">{def.term}</strong>
                      <span className="text-neutral-300">{def.explanation}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Laws */}
              <div className="space-y-2 pt-2">
                <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                  القوانين والمعادلات:
                </div>
                <div className="space-y-2">
                  {l.laws.map((law, idx) => (
                    <div key={idx} className="bg-neutral-950 p-3.5 rounded-xl border border-neutral-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <strong className="text-white block">{law.name}</strong>
                        <span className="text-neutral-400">{law.explanation}</span>
                      </div>
                      <div className="bg-neutral-900 px-3 py-1.5 rounded-lg border border-neutral-800 text-center font-mono self-start sm:self-auto shrink-0">
                        <MathView math={law.formula} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. SUMMARIES SECTION */}
      {activeTab === 'summaries' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CURRICULUM_LESSONS.map((l) => (
            <div
              key={l.id}
              className="bg-neutral-900/70 border border-amber-500/25 rounded-3xl p-6 space-y-4 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg font-bold text-amber-300 mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs">
                    {l.id}
                  </span>
                  <span>{l.title}</span>
                </h3>
                <div className="space-y-2 mt-4">
                  {l.summary.map((pt, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-neutral-200">
                      <span className="text-amber-400 font-bold">✓</span>
                      <span className="flex-1">
                        <MathView>{pt}</MathView>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewView;

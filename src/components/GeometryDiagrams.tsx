import React from 'react';

interface DiagramProps {
  type: string;
  className?: string;
}

export const GeometryDiagram: React.FC<DiagramProps> = ({ type, className = '' }) => {
  switch (type) {
    case 'altitude_theorem':
      // Right triangle ABC with right angle at A, AD perpendicular to BC
      return (
        <div className={`flex flex-col items-center bg-neutral-900/80 p-5 rounded-2xl border border-amber-500/20 ${className}`}>
          <div className="text-sm font-semibold text-amber-400 mb-2">
            شكل هندسي: نظرية العمود على الوتر في المثلث القائم (إقليدس)
          </div>
          <svg viewBox="0 0 460 260" className="w-full max-w-lg h-auto">
            {/* Background subtle grid */}
            <defs>
              <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>
            </defs>

            {/* Main triangle: B=(40,210), C=(420,210), A=(160,50) */}
            {/* Hypotenuse BC */}
            <line x1="40" y1="210" x2="420" y2="210" stroke="#f59e0b" strokeWidth="3" />
            {/* Side AB */}
            <line x1="40" y1="210" x2="160" y2="50" stroke="#fcd34d" strokeWidth="2.5" />
            {/* Side AC */}
            <line x1="160" y1="50" x2="420" y2="210" stroke="#fcd34d" strokeWidth="2.5" />
            
            {/* Perpendicular AD: D is projection of A(160,50) onto BC (y=210) => D=(160,210) */}
            <line x1="160" y1="50" x2="160" y2="210" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4 3" />

            {/* Right angle marker at A (160, 50) */}
            <path d="M 148 66 L 162 76 L 174 60" fill="none" stroke="#f59e0b" strokeWidth="1.5" />

            {/* Right angle marker at D (160, 210) */}
            <path d="M 160 195 L 175 195 L 175 210" fill="none" stroke="#38bdf8" strokeWidth="1.5" />

            {/* Vertices points */}
            <circle cx="160" cy="50" r="5" fill="#f59e0b" />
            <circle cx="40" cy="210" r="5" fill="#f59e0b" />
            <circle cx="420" cy="210" r="5" fill="#f59e0b" />
            <circle cx="160" cy="210" r="5" fill="#38bdf8" />

            {/* Labels */}
            <text x="160" y="35" fill="#fcd34d" fontSize="16" fontWeight="bold" textAnchor="middle">A (رأس القائمة)</text>
            <text x="25" y="215" fill="#fcd34d" fontSize="16" fontWeight="bold">B</text>
            <text x="430" y="215" fill="#fcd34d" fontSize="16" fontWeight="bold">C</text>
            <text x="160" y="235" fill="#38bdf8" fontSize="15" fontWeight="bold" textAnchor="middle">D (مسقط العمود)</text>

            {/* Segments annotations */}
            <text x="90" y="125" fill="#d4d4d8" fontSize="13">AB</text>
            <text x="300" y="120" fill="#d4d4d8" fontSize="13">AC</text>
            <text x="170" y="140" fill="#38bdf8" fontSize="13">AD ⟂ BC</text>
            <text x="100" y="200" fill="#a1a1aa" fontSize="12">BD</text>
            <text x="280" y="200" fill="#a1a1aa" fontSize="12">DC</text>
          </svg>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3 w-full text-center text-xs">
            <div className="bg-neutral-950 p-2 rounded-lg border border-amber-500/20 text-amber-300">
              <span className="font-mono font-bold">AD² = BD × DC</span>
            </div>
            <div className="bg-neutral-950 p-2 rounded-lg border border-amber-500/20 text-amber-300">
              <span className="font-mono font-bold">AB² = BD × BC</span>
            </div>
            <div className="bg-neutral-950 p-2 rounded-lg border border-amber-500/20 text-amber-300">
              <span className="font-mono font-bold">AC² = DC × BC</span>
            </div>
          </div>
        </div>
      );

    case 'parallel_line_theorem':
      // Triangle ABC with DE parallel to BC
      return (
        <div className={`flex flex-col items-center bg-neutral-900/80 p-5 rounded-2xl border border-amber-500/20 ${className}`}>
          <div className="text-sm font-semibold text-amber-400 mb-2">
            شكل هندسي: نظرية الخط الموازي في المثلث
          </div>
          <svg viewBox="0 0 420 250" className="w-full max-w-lg h-auto">
            {/* Triangle ABC: A(210, 30), B(50, 220), C(370, 220) */}
            <polygon points="210,30 50,220 370,220" fill="none" stroke="#f59e0b" strokeWidth="2.5" />
            
            {/* Parallel line DE: D on AB at 50% => (130, 125), E on AC at 50% => (290, 125) */}
            <line x1="130" y1="125" x2="290" y2="125" stroke="#38bdf8" strokeWidth="3" />
            
            {/* Parallel arrows on DE and BC */}
            <polygon points="205,121 215,125 205,129" fill="#38bdf8" />
            <polygon points="205,216 215,220 205,224" fill="#f59e0b" />

            {/* Vertices */}
            <circle cx="210" cy="30" r="5" fill="#fcd34d" />
            <circle cx="50" cy="220" r="5" fill="#fcd34d" />
            <circle cx="370" cy="220" r="5" fill="#fcd34d" />
            <circle cx="130" cy="125" r="5" fill="#38bdf8" />
            <circle cx="290" cy="125" r="5" fill="#38bdf8" />

            {/* Labels */}
            <text x="210" y="20" fill="#fcd34d" fontSize="16" fontWeight="bold" textAnchor="middle">A</text>
            <text x="35" y="235" fill="#fcd34d" fontSize="16" fontWeight="bold">B</text>
            <text x="380" y="235" fill="#fcd34d" fontSize="16" fontWeight="bold">C</text>
            <text x="110" y="125" fill="#38bdf8" fontSize="16" fontWeight="bold">D</text>
            <text x="300" y="125" fill="#38bdf8" fontSize="16" fontWeight="bold">E</text>

            {/* Highlighted miniature triangle ADE */}
            <polygon points="210,30 130,125 290,125" fill="#38bdf8" fillOpacity="0.12" />
          </svg>
          <div className="bg-neutral-950 p-3 rounded-xl border border-amber-500/20 text-center w-full mt-2">
            <span className="text-amber-300 font-semibold text-sm">
              بما أن DE ∥ BC فإن: △ADE ~ △ABC
            </span>
            <div className="text-xs text-neutral-300 font-mono mt-1">
              AD / AB = AE / AC = DE / BC
            </div>
          </div>
        </div>
      );

    case 'thales_pyramid':
      // Thales pyramid shadow application
      return (
        <div className={`flex flex-col items-center bg-neutral-900/80 p-5 rounded-2xl border border-amber-500/20 ${className}`}>
          <div className="text-sm font-semibold text-amber-400 mb-2">
            تطبيق طاليس: حساب ارتفاع الهرم بواسطة العصا وظلها
          </div>
          <svg viewBox="0 0 520 220" className="w-full max-w-xl h-auto">
            {/* Ground line */}
            <line x1="20" y1="190" x2="500" y2="190" stroke="#78716c" strokeWidth="2" />

            {/* Sun */}
            <circle cx="70" cy="40" r="18" fill="#fbbf24" />
            <line x1="70" y1="15" x2="70" y2="5" stroke="#fbbf24" strokeWidth="2" />
            <line x1="70" y1="65" x2="70" y2="75" stroke="#fbbf24" strokeWidth="2" />
            <line x1="45" y1="40" x2="35" y2="40" stroke="#fbbf24" strokeWidth="2" />
            <line x1="95" y1="40" x2="105" y2="40" stroke="#fbbf24" strokeWidth="2" />

            {/* Pyramid: Peak at (360, 60), Left base (260, 190), Right base (460, 190) */}
            <polygon points="360,60 260,190 460,190" fill="#451a03" stroke="#f59e0b" strokeWidth="2.5" />
            <polygon points="360,60 360,190 460,190" fill="#78350f" fillOpacity="0.4" />
            
            {/* Pyramid Height line: from (360,60) to (360,190) */}
            <line x1="360" y1="60" x2="360" y2="190" stroke="#ef4444" strokeWidth="2" strokeDasharray="3 3" />
            <text x="370" y="125" fill="#ef4444" fontSize="13" fontWeight="bold">الارتفاع المجهول (60 م)</text>

            {/* Pyramid Shadow along ground */}
            <line x1="180" y1="190" x2="360" y2="190" stroke="#f59e0b" strokeWidth="4" />
            <text x="270" y="210" fill="#fcd34d" fontSize="12" textAnchor="middle">ظل الهرم = 90 م</text>

            {/* Sun ray for pyramid */}
            <line x1="180" y1="190" x2="360" y2="60" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="4 2" />

            {/* Stick (عصا): at x=140, height=35 px (1m) */}
            <line x1="140" y1="190" x2="140" y2="140" stroke="#38bdf8" strokeWidth="3" />
            <text x="140" y="130" fill="#38bdf8" fontSize="11" textAnchor="middle" fontWeight="bold">العصا: 1 م</text>

            {/* Stick Shadow: from 85 to 140 (55px = 1.5m) */}
            <line x1="85" y1="190" x2="140" y2="190" stroke="#38bdf8" strokeWidth="4" />
            <text x="110" y="210" fill="#38bdf8" fontSize="11" textAnchor="middle">ظلها = 1.5 م</text>

            {/* Sun ray for stick */}
            <line x1="85" y1="190" x2="140" y2="140" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="4 2" />
          </svg>
          <div className="bg-neutral-950 p-2.5 rounded-xl border border-amber-500/20 text-center w-full mt-2 text-xs text-neutral-300">
            <span>التناسب: </span>
            <span className="font-mono text-amber-300">ارتفاع الهرم = (1 × 90) ÷ 1.5 = 60 م</span>
          </div>
        </div>
      );

    case 'mirror_method':
      // Mirror reflection method for tree height
      return (
        <div className={`flex flex-col items-center bg-neutral-900/80 p-5 rounded-2xl border border-amber-500/20 ${className}`}>
          <div className="text-sm font-semibold text-amber-400 mb-2">
            تطبيق المرآة: قياس ارتفاع الشجرة بالتشابه
          </div>
          <svg viewBox="0 0 520 220" className="w-full max-w-xl h-auto">
            {/* Ground */}
            <line x1="20" y1="180" x2="500" y2="180" stroke="#78716c" strokeWidth="2" />

            {/* Mirror on ground at x=200 */}
            <rect x="185" y="178" width="30" height="4" fill="#38bdf8" rx="2" />
            <text x="200" y="202" fill="#38bdf8" fontSize="12" textAnchor="middle" fontWeight="bold">المرآة</text>

            {/* Person at x=100 (distance to mirror = 100px represents 1.2m) */}
            <line x1="100" y1="180" x2="100" y2="105" stroke="#fbbf24" strokeWidth="3" />
            <circle cx="100" cy="100" r="6" fill="#fbbf24" />
            <text x="100" y="90" fill="#fbbf24" fontSize="11" textAnchor="middle">الشخص (1.5 م)</text>
            <line x1="100" y1="100" x2="200" y2="180" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3 2" />
            <text x="145" y="170" fill="#a1a1aa" fontSize="11">1.2 م</text>

            {/* Tree at x=440 (distance to mirror represents 6m) */}
            {/* Trunk */}
            <rect x="435" y="40" width="10" height="140" fill="#78350f" />
            {/* Leaves */}
            <polygon points="440,20 400,90 480,90" fill="#15803d" />
            <polygon points="440,50 410,120 470,120" fill="#16a34a" />
            <text x="440" y="15" fill="#4ade80" fontSize="12" textAnchor="middle" fontWeight="bold">الشجرة (7.5 م)</text>
            <line x1="440" y1="20" x2="200" y2="180" stroke="#4ade80" strokeWidth="1.5" strokeDasharray="3 2" />
            <text x="320" y="170" fill="#a1a1aa" fontSize="11">6 م</text>
          </svg>
          <div className="bg-neutral-950 p-2.5 rounded-xl border border-amber-500/20 text-center w-full mt-2 text-xs text-neutral-300">
            <span>حساب ارتفاع الشجرة: </span>
            <span className="font-mono text-amber-300">(1.5 × 6) ÷ 1.2 = 7.5 م</span>
          </div>
        </div>
      );

    case 'direct_vs_inverse':
      // Graphs comparison of direct vs inverse variation
      return (
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 bg-neutral-900/80 p-5 rounded-2xl border border-amber-500/20 ${className}`}>
          {/* Direct variation */}
          <div className="flex flex-col items-center bg-neutral-950 p-4 rounded-xl border border-amber-500/10">
            <span className="text-amber-400 font-bold text-sm mb-1">التغير الطردي: y = kx</span>
            <span className="text-xs text-neutral-400 mb-2">خط مستقيم يمر بنقطة الأصل (0, 0)</span>
            <svg viewBox="0 0 200 160" className="w-48 h-36">
              <line x1="20" y1="140" x2="190" y2="140" stroke="#52525b" strokeWidth="1.5" />
              <line x1="30" y1="150" x2="30" y2="10" stroke="#52525b" strokeWidth="1.5" />
              <text x="180" y="155" fill="#a1a1aa" fontSize="11">x</text>
              <text x="15" y="20" fill="#a1a1aa" fontSize="11">y</text>
              {/* Straight line through origin */}
              <line x1="30" y1="140" x2="170" y2="25" stroke="#f59e0b" strokeWidth="2.5" />
              <circle cx="30" cy="140" r="3.5" fill="#f59e0b" />
              <text x="110" y="65" fill="#fcd34d" fontSize="12" fontWeight="bold">y = kx</text>
            </svg>
            <div className="text-xs text-amber-300 font-mono mt-1">y / x = k (ثابت)</div>
          </div>

          {/* Inverse variation */}
          <div className="flex flex-col items-center bg-neutral-950 p-4 rounded-xl border border-amber-500/10">
            <span className="text-sky-400 font-bold text-sm mb-1">التغير العكسي: y = k / x</span>
            <span className="text-xs text-neutral-400 mb-2">منحنى قطع زائد لا يمر بالأصل ولا يمس المحورين</span>
            <svg viewBox="0 0 200 160" className="w-48 h-36">
              <line x1="20" y1="140" x2="190" y2="140" stroke="#52525b" strokeWidth="1.5" />
              <line x1="30" y1="150" x2="30" y2="10" stroke="#52525b" strokeWidth="1.5" />
              <text x="180" y="155" fill="#a1a1aa" fontSize="11">x</text>
              <text x="15" y="20" fill="#a1a1aa" fontSize="11">y</text>
              {/* Hyperbolic curve */}
              <path d="M 40 25 Q 60 110 175 130" fill="none" stroke="#38bdf8" strokeWidth="2.5" />
              <text x="100" y="70" fill="#38bdf8" fontSize="12" fontWeight="bold">xy = k</text>
            </svg>
            <div className="text-xs text-sky-300 font-mono mt-1">x · y = k (ثابت)</div>
          </div>
        </div>
      );

    case 'golden_ratio':
      return (
        <div className={`flex flex-col items-center bg-neutral-900/80 p-5 rounded-2xl border border-amber-500/20 ${className}`}>
          <div className="text-sm font-semibold text-amber-400 mb-2">
            المستطيل الذهبي والنسبة الذهبية: φ ≈ 1.618
          </div>
          <svg viewBox="0 0 340 180" className="w-full max-w-md h-auto">
            {/* Outer golden rectangle: 260 x 160. Ratio ~ 1.618 */}
            <rect x="40" y="20" width="260" height="140" fill="none" stroke="#f59e0b" strokeWidth="2.5" rx="4" />
            
            {/* Square on the left: 140 x 140 */}
            <rect x="40" y="20" width="140" height="140" fill="#f59e0b" fillOpacity="0.1" stroke="#fcd34d" strokeWidth="1.5" />
            
            {/* Golden spiral arc */}
            <path d="M 40 160 A 140 140 0 0 1 180 20" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 2" />

            {/* Labels */}
            <text x="110" y="95" fill="#fcd34d" fontSize="14" textAnchor="middle" fontWeight="bold">مربع (1 × 1)</text>
            <text x="240" y="95" fill="#38bdf8" fontSize="12" textAnchor="middle">مستطيل ذهبي أصغر مشابه</text>
            <text x="170" y="175" fill="#a1a1aa" fontSize="12" textAnchor="middle">الطول الكامل = φ ≈ 1.618</text>
          </svg>
          <div className="bg-neutral-950 p-2 rounded-xl border border-amber-500/20 text-center w-full mt-2 text-xs text-amber-300 font-mono">
            φ = (1 + √5) / 2 ≈ 1.6180339887...
          </div>
        </div>
      );

    default:
      return null;
  }
};

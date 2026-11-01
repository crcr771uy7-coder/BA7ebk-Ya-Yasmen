import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Google GenAI if API key exists
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  try {
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: !!(apiKey && apiKey !== 'MY_GEMINI_API_KEY'),
    serverTime: new Date().toISOString(),
  });
});

// Offline Math Knowledge base fallback
const CURRICULUM_KNOWLEDGE = `
أنت المساعد الرياضي التعليمي لموقع "في حب ياسمين ❤️".
مهمتك مساعدة ياسمين في فهم منهج الرياضيات المكون من 5 دروس بدقة بالغة وبطريقة مشجعة وواضحة:
1. الدرس الأول: النسبة والتناسب وخواصهما.
   - النسبة: مقارنة بين كميتين من نفس النوع والوحدة. x/y أو x:y. x المقدم، y التالي.
   - التناسب: تساوي نسبتين أو أكثر a/b = c/d (b,d ≠ 0). a و d طرفان، b و c وسطان.
   - الضرب التبادلي: a × d = b × c لإيجاد المجهول.
2. الدرس الثاني: التغير الطردي.
   - التعريف: إذا زاد أحدهما زاد الآخر بنفس النسبة والعكس.
   - القوانين: y ∝ x ، y = kx ، y/x = k (k ≠ 0, x ≠ 0).
   - القانون: y₁/y₂ = x₁/x₂ (x₂, y₂ ≠ 0). النسبة y/x ثابتة = k.
3. الدرس الثالث: التغير العكسي.
   - التعريف: إذا زاد أحدهما قل الآخر بنفس النسبة والعكس.
   - القوانين: y ∝ 1/x ، y = k/x ، xy = k (k ≠ 0, x ≠ 0, y ≠ 0).
   - القانون: y₁/y₂ = x₂/x₁ (النسبة مقلوبة). حاصل الضرب xy ثابت = k.
4. الدرس الرابع: تشابه المضلعات.
   - الشرطان: الزوايا المتناظرة متساوية، والأضلاع المتناظرة متناسبة.
   - معامل القياس k: نسبة طول ضلع في الأول إلى نظيره في الثاني. k > 1 تكبير، 0 < k < 1 تصغير، k = 1 تطابق.
   - نسبة المحيطين = k. نسبة المساحتين = k².
   - مسألة طاليس وظل الهرم: (طول العصا × ظل الهرم) ÷ ظل العصا = ارتفاع الهرم.
   - النسبة الذهبية: φ = (1 + √5)/2 ≈ 1.618.
5. الدرس الخامس: تشابه المضلعات والمثلثات.
   - إذا كان ABCD ~ XYZL فإن AB/XY = BC/YZ = CD/ZL = DA/LX = k.
   - الضرب التبادلي: AB × YZ = XY × BC. ومن AB/XY = CD/ZL نحصل على AB × ZL = XY × CD.
   - حالات تشابه المثلثات: AA (زاويتان متساويتان)، SSS (تناسب الأضلاع الثلاثة)، SAS (تناسب ضلعين وتساوي الزاوية المحصورة).
   - نظرية العمود على الوتر (إقليدس): مثلث ABC قائم الزاوية في A، و D على BC، و AD ⟂ BC:
     △ABC ~ △DBA ~ △DAC.
     العلاقات: AD² = BD × DC ، AB² = BD × BC ، AC² = DC × BC.
   - نظرية الخط الموازي: DE ∥ BC مع D ∈ AB, E ∈ AC ينتج △ADE ~ △ABC و AD/AB = AE/AC = DE/BC.

تعليمات الإجابة:
- اشرح دائماً خطوة بخطوة باللغة العربية الواضحة وبأسلوب راقٍ وداعم لياسمين.
- استخدم الرموز الرياضية المناسبة و KaTeX بالصيغة $...$ أو $$...$$.
- لا تبتدع قوانين غير موجودة بالمنهج.
- إن سأل المستخدم عن موضوع خارج الرياضيات، اعتذر بلطف ووجهه للمنهج المذكور.
`;

function getLocalMathAnswer(prompt: string): string {
  const p = prompt.toLowerCase();
  if (p.includes('طردي') || p.includes('التغير الطردي')) {
    return `أهلاً يا ياسمين! 🌟\n\n**التغير الطردي** يعني أنه إذا زاد أحد المتغيرين، زاد الآخر بنفس النسبة.\n\n### القوانين الأساسية:\n- علاقة التغير: $y \\propto x$\n- معادلة التغير: $y = kx$ حيث $k$ هو ثابت التغير ($k \\neq 0$).\n- إيجاد الثابت: $k = \\frac{y}{x}$\n- قانون المقارنة المهم: $$\\frac{y_1}{y_2} = \\frac{x_1}{x_2}$$\n\n**مثال سريع:** إذا كانت $y$ تتغير طردياً مع $x$ وكانت $y = 12$ عندما $x = 4$:\nثابت التغير $k = \\frac{12}{4} = 3$، وبالتالي العلاقة هي $y = 3x$.`;
  }
  if (p.includes('عكسي') || p.includes('التغير العكسي')) {
    return `أهلاً يا ياسمين! ✨\n\n**التغير العكسي** يعني أنه إذا زاد أحد المتغيرين، نقص الآخر بنفس النسبة (وحاصل ضربهما ثابت دائماً).\n\n### القوانين الأساسية:\n- علاقة التغير: $y \\propto \\frac{1}{x}$\n- معادلة التغير: $y = \\frac{k}{x}$ أو $xy = k$ حيث $k \\neq 0$.\n- إيجاد الثابت: $k = x \\cdot y$\n- قانون المقارنة المهم (لاحظ قلب النسبة!): $$\\frac{y_1}{y_2} = \\frac{x_2}{x_1}$$\n\n**تنبيه مهم:** في التغير العكسي حاصل الضرب $xy$ هو الثابت، وكتابة $y = kx$ تعتبر خطأ فادحاً!`;
  }
  if (p.includes('عمود') || p.includes('وتر') || p.includes('إقليدس') || p.includes('قائم')) {
    return `أهلاً يا ياسمين! 📐\n\n**نظرية العمود الساقط من رأس القائمة على الوتر:**\nفي المثلث $ABC$ القائم الزاوية في $A$، إذا رسمنا عموداً $AD \\perp BC$ حيث $D \\in BC$:\n\n1. المثلثات الناتجة متشابهة:\n$$\\triangle ABC \\sim \\triangle DBA \\sim \\triangle DAC$$\n\n2. علاقات الوسط الهندسي المعتمدة:\n- مربع طول العمود: $$AD^2 = BD \\times DC$$\n- مربع الضلع الأول: $$AB^2 = BD \\times BC$$\n- مربع الضلع الثاني: $$AC^2 = DC \\times BC$$\n\nهذه القوانين تسهل حساب أي ضلع مجهول بمجرد معرفة أجزاء الوتر!`;
  }
  if (p.includes('موازي') || p.includes('الخط الموازي')) {
    return `أهلاً يا ياسمين! 📏\n\n**نظرية الخط الموازي في المثلث:**\nإذا رُسم مستقيم يوازي أحد أضلاع المثلث ويقطع الضلعين الآخرين:\nإذا كان $D \\in AB$ و $E \\in AC$ وكان $DE \\parallel BC$، فإن:\n$$\\triangle ADE \\sim \\triangle ABC$$\n\nوسلسلة النسب المتساوية هي:\n$$\\frac{AD}{AB} = \\frac{AE}{AC} = \\frac{DE}{BC}$$`;
  }
  if (p.includes('طاليس') || p.includes('الهرم') || p.includes('ظل')) {
    return `أهلاً يا ياسمين! 🏛️\n\n**تطبيق طاليس وارتفاع الهرم (تشابه المثلثات بأشعة الشمس):**\nعندما تكون زاوية ميل أشعة الشمس متساوية:\n$$\\frac{\\text{ارتفاع الهرم}}{\\text{طول العصا}} = \\frac{\\text{ظل الهرم}}{\\text{ظل العصا}}$$\n\n**المثال المحلول الدقيق:**\n- طول العصا = $1\\text{ م}$\n- ظل العصا = $1.5\\text{ م}$\n- ظل الهرم = $90\\text{ م}$\n\nحساب الارتفاع:\n$$\\text{ارتفاع الهرم} = \\frac{1 \\times 90}{1.5} = 60\\text{ م}$$`;
  }
  if (p.includes('نسبة') || p.includes('تناسب') || p.includes('تبادلي')) {
    return `أهلاً يا ياسمين! 💡\n\n**النسبة والتناسب:**\n- **النسبة:** مقارنة بين كميتين من نفس النوع والوحدة، تكتب $\\frac{x}{y}$ أو $x:y$ ($x$ مقدم، $y$ تالي).\n- **التناسب:** تساوي نسبتين أو أكثر: $$\\frac{a}{b} = \\frac{c}{d}$$\nحيث $a, d$ هما **الطرفان**، و $b, c$ هما **الوسطان**.\n- **خاصية الضرب التبادلي (المقص):**\n$$a \\times d = b \\times c$$\nوتُستخدم دائماً لإيجاد الحد المجهول في أي تناسب.`;
  }
  return `أهلاً يا ياسمين! ❤️\n\nأنا معك في كل خطوة لمساعدتك في فهم دروس الرياضيات:\n1. النسبة والتناسب والضرب التبادلي.\n2. التغير الطردي وقانونه $\\frac{y_1}{y_2} = \\frac{x_1}{x_2}$.\n3. التغير العكسي وقانونه $\\frac{y_1}{y_2} = \\frac{x_2}{x_1}$.\n4. تشابه المضلعات ومعامل القياس $k$ ونسبة المساحات $k^2$.\n5. تشابه المثلثات (AA, SSS, SAS)، نظرية العمود على الوتر، ونظرية الخط الموازي.\n\nاكتبي لي أي مسألة أو قانون تريدين شرح خطوات حله وسأوضحه لك بالتفصيل!`;
}

// Gemini Assistant endpoint
app.post('/api/assistant', async (req, res) => {
  const { message, history } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'الرسالة مطلوبة' });
  }

  // If no AI client available, respond via local intelligent curriculum responder
  if (!aiClient) {
    const localReply = getLocalMathAnswer(message);
    return res.json({
      reply: localReply,
      source: 'local',
      modelUsed: 'offline-math-curriculum',
    });
  }

  try {
    // Attempt with gemini-4-argon with ThinkingLevel.HIGH as requested in instructions
    // If not available on key, gracefully fallback to gemini-3.8-flash with ThinkingLevel.HIGH
    let responseText = '';
    let usedModel = 'gemini-4-argon';

    try {
      const response = await aiClient.models.generateContent({
        model: 'gemini-4-argon',
        contents: [
          { role: 'user', parts: [{ text: `سؤال ياسمين: ${message}` }] },
        ],
        config: {
          systemInstruction: CURRICULUM_KNOWLEDGE,
          thinkingConfig: {
            thinkingLevel: ThinkingLevel.HIGH,
          },
        },
      });
      responseText = response.text || '';
    } catch (argonErr: any) {
      console.warn('gemini-4-argon call failed, falling back to gemini-3.8-flash:', argonErr?.message || argonErr);
      usedModel = 'gemini-3.8-flash';
      const flashResponse = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [
          { role: 'user', parts: [{ text: `سؤال ياسمين: ${message}` }] },
        ],
        config: {
          systemInstruction: CURRICULUM_KNOWLEDGE,
          thinkingConfig: {
            thinkingLevel: ThinkingLevel.HIGH,
          },
        },
      });
      responseText = flashResponse.text || '';
    }

    if (!responseText) {
      responseText = getLocalMathAnswer(message);
    }

    return res.json({
      reply: responseText,
      source: 'ai',
      modelUsed: usedModel,
    });
  } catch (error: any) {
    console.error('Error invoking Gemini model:', error);
    // Return gracefully via local curriculum solver
    const localFallback = getLocalMathAnswer(message);
    return res.json({
      reply: localFallback,
      source: 'fallback',
      modelUsed: 'offline-math-curriculum',
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT} in ${isProd ? 'production' : 'development'} mode`);
  });
}

startServer();

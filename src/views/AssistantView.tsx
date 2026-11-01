import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  User,
  Lightbulb,
  HelpCircle,
  Compass,
  CheckCircle,
} from 'lucide-react';
import { MathView } from '../components/MathView';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  source?: 'ai' | 'local' | 'fallback';
  modelUsed?: string;
}

export const AssistantView: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `أهلاً بيكي يا ياسمين ❤️! أنا مساعدكِ الرياضي في منصتكِ التعليمية.\n\nأنا جاهز للإجابة عن أي استفسار في دروس المنهج الخمسة:\n1. النسبة والتناسب والضرب التبادلي.\n2. التغير الطردي وقوانين $y = kx$ و $\\frac{y_1}{y_2} = \\frac{x_1}{x_2}$.\n3. التغير العكسي وقوانين $xy = k$ و $\\frac{y_1}{y_2} = \\frac{x_2}{x_1}$.\n4. تشابه المضلعات ومعامل القياس $k$ ونسبة المساحة $k^2$ وتطبيق طاليس.\n5. تشابه المثلثات ونظرية العمود على الوتر (إقليدس) ونظرية الخط الموازي وتطبيق المرآة.\n\nكيف أساعدكِ اليوم؟`,
      source: 'local',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const quickPrompts = [
    'اشرح لي نظرية إقليدس والعمود على الوتر',
    'ما الفرق بين التغير الطردي والتغير العكسي؟',
    'كيف نحسب ارتفاع الهرم بطريقة طاليس وظل العصا؟',
    'ما هي شروط تشابه المثلثات الثلاثة؟',
    'إذا تضاعفت الأبعاد الهندسية فماذا يحدث للمساحة؟',
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || isLoading) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: query,
        }),
      });

      if (!response.ok) {
        throw new Error('فشل الاتصال بالخادم');
      }

      const data = await response.json();
      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: data.reply || 'عذراً يا ياسمين، حدث خطأ غير متوقع في جلب الإجابة.',
        source: data.source,
        modelUsed: data.modelUsed,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('Assistant error:', err);
      // Fallback friendly message
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'assistant',
          text: 'أهلاً يا ياسمين! اعتذر عن هذا العطل الطارئ في الاتصال. يمكنكِ تكرار السؤال أو مراجعة القوانين من صفحة المراجعة.',
          source: 'local',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Assistant Header */}
      <div className="bg-neutral-900/80 border border-amber-500/20 rounded-3xl p-6 sm:p-8 shadow-xl flex items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>المساعد الرياضي لمنهج ياسمين</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            المساعد الرياضي الذكي (Math Assistant)
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            شرح النظريات، توضيح خطوات حل المسائل، وحساب المجاهيل بالمعادلات الرياضية
          </p>
        </div>
        <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
          <Bot className="w-8 h-8" />
        </div>
      </div>

      {/* Quick Prompts Suggestions */}
      <div className="space-y-2">
        <span className="text-xs text-neutral-400 font-semibold block px-1">
          أسئلة سريعة مقترحة:
        </span>
        <div className="flex flex-wrap gap-2">
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(p)}
              disabled={isLoading}
              className="text-xs bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-amber-300 px-3.5 py-2 rounded-xl border border-neutral-800 hover:border-amber-500/30 transition-all cursor-pointer disabled:opacity-50"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Box */}
      <div className="bg-neutral-900/70 border border-amber-500/20 rounded-3xl p-5 sm:p-6 min-h-[460px] flex flex-col justify-between shadow-2xl">
        <div className="space-y-4 overflow-y-auto max-h-[500px] pr-1">
          {messages.map((m) => {
            const isUser = m.sender === 'user';
            return (
              <div
                key={m.id}
                className={`flex items-start gap-3 ${
                  isUser ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                    isUser
                      ? 'bg-amber-500 text-neutral-950 font-bold'
                      : 'bg-neutral-800 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                </div>

                {/* Bubble */}
                <div
                  className={`max-w-[85%] rounded-2xl p-4 sm:p-5 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-amber-500/20 text-white border border-amber-500/40'
                      : 'bg-neutral-950 text-neutral-200 border border-neutral-800 space-y-2'
                  }`}
                >
                  <MathView>{m.text}</MathView>
                  {!isUser && m.source && (
                    <div className="text-[10px] text-neutral-500 pt-1 border-t border-neutral-900 flex items-center justify-between">
                      <span>
                        {m.source === 'ai'
                          ? `مدعوم بالذكاء الاصطناعي (${m.modelUsed || 'Gemini'})`
                          : 'مساعد المنهج الرياضي المعتمد'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-neutral-800 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                <Bot className="w-5 h-5 animate-bounce" />
              </div>
              <div className="bg-neutral-950 border border-neutral-800 p-4 rounded-2xl flex items-center gap-2 text-xs text-amber-400">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                <span>جاري إعداد الشرح الرياضي خطوة بخطوة...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="pt-4 border-t border-neutral-800/80 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isLoading}
            placeholder="اكتبي سؤالكِ أو المسألة هنا يا ياسمين..."
            className="flex-1 bg-neutral-950 border border-neutral-700 focus:border-amber-400 rounded-xl px-4 py-3 text-xs sm:text-sm text-neutral-100 placeholder:text-neutral-500 outline-none transition-colors"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="px-5 py-3 rounded-xl font-bold text-neutral-950 gold-gradient-btn hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-amber-500/20"
          >
            <span>إرسال</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AssistantView;

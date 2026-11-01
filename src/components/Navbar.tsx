import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Home,
  CheckCircle,
  HelpCircle,
  FileCheck2,
  Trophy,
  Sparkles,
  Menu,
  X,
  Heart,
} from 'lucide-react';
import { getOverallProgress, getCompletedLessons, subscribeToProgress } from '../services/storage';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab }) => {
  const [progress, setProgress] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const updateStats = () => {
    setProgress(getOverallProgress());
    setCompletedCount(getCompletedLessons().length);
  };

  useEffect(() => {
    updateStats();
    const unsubscribe = subscribeToProgress(updateStats);
    return unsubscribe;
  }, []);

  const navItems = [
    { id: 'home', label: 'الرئيسية', icon: Home },
    { id: 'lessons', label: 'الدروس', icon: BookOpen },
    { id: 'practice', label: 'التدريبات وحل المسائل', icon: CheckCircle },
    { id: 'review', label: 'المراجعة', icon: HelpCircle },
    { id: 'exams', label: 'الامتحانات', icon: FileCheck2 },
    { id: 'achievements', label: 'إنجازاتي', icon: Trophy },
    { id: 'assistant', label: 'المساعد الذكي', icon: Sparkles, highlight: true },
  ];

  return (
    <header className="sticky top-0 z-50 bg-neutral-950/90 backdrop-blur-md border-b border-amber-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* Logo & Branding */}
          <button
            onClick={() => {
              setCurrentTab('home');
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-3 text-right group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Heart className="w-5 h-5 text-neutral-950 fill-neutral-950" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight gold-gradient-text">
                  في حب ياسمين
                </span>
                <span className="text-red-500 text-base animate-pulse">❤️</span>
              </div>
              <span className="text-[11px] text-amber-200/60 block font-medium">
                منصة الرياضيات التعليمية المتكاملة
              </span>
            </div>
          </button>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-sm shadow-amber-500/10'
                      : item.highlight
                      ? 'text-amber-400 hover:text-amber-300 hover:bg-neutral-900 border border-amber-500/20'
                      : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : ''}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Quick Progress Badge */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => setCurrentTab('achievements')}
              className="flex items-center gap-2.5 bg-neutral-900 hover:bg-neutral-800/80 px-3.5 py-1.5 rounded-full border border-amber-500/30 transition-all cursor-pointer text-xs"
              title="عرض إنجازاتك"
            >
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span className="text-neutral-300">
                إنجاز المنهج: <strong className="text-amber-400 font-bold">{progress}%</strong>
              </span>
              <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full text-[10px] font-bold">
                {completedCount}/5 دروس
              </span>
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex items-center lg:hidden gap-2">
            <button
              onClick={() => setCurrentTab('achievements')}
              className="text-xs bg-amber-500/15 text-amber-300 px-2.5 py-1 rounded-full border border-amber-500/30"
            >
              {progress}%
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-neutral-400 hover:text-amber-300 hover:bg-neutral-900 border border-neutral-800 transition-colors"
              aria-label="القائمة"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-neutral-950 border-b border-amber-500/20 px-4 pt-2 pb-6 space-y-1.5 animate-in slide-in-from-top duration-200">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'text-neutral-300 hover:bg-neutral-900 hover:text-amber-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-amber-400" />
                  <span>{item.label}</span>
                </div>
                {item.id === 'assistant' && (
                  <span className="text-[10px] bg-amber-500/30 text-amber-300 px-2 py-0.5 rounded-full font-bold">
                    ذكي
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};

export default Navbar;

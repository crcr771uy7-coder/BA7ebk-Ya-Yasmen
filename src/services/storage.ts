import { ExamResult } from '../types';

export const STORAGE_KEYS = {
  COMPLETED_LESSONS: 'yasmine_completed_lessons',
  LAST_LESSON: 'yasmine_last_lesson',
  EXAM_RESULTS: 'yasmine_exam_results',
  PRACTICE_SOLVED: 'yasmine_practice_solved',
  PROGRESS: 'yasmine_progress',
} as const;

export interface PracticeAttempt {
  solved: boolean;
  attempts: number;
  correct: boolean;
  lessonId: number;
  timestamp: string;
}

// Custom event to sync cross-component updates immediately
const NOTIFY_EVENT = 'yasmine_storage_updated';

function triggerUpdate() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(NOTIFY_EVENT));
  }
}

export function subscribeToProgress(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener(NOTIFY_EVENT, callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener(NOTIFY_EVENT, callback);
    window.removeEventListener('storage', callback);
  };
}

export function getCompletedLessons(): number[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.COMPLETED_LESSONS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.map((item) => Number(item)).filter((n) => !isNaN(n));
    }
    return [];
  } catch (e) {
    console.error('Error reading completed lessons:', e);
    return [];
  }
}

export function getLastLesson(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LAST_LESSON);
    if (!raw) return 1;
    const val = parseInt(raw, 10);
    return isNaN(val) ? 1 : val;
  } catch {
    return 1;
  }
}

export function setLastLesson(lessonId: number): void {
  try {
    localStorage.setItem(STORAGE_KEYS.LAST_LESSON, String(lessonId));
    triggerUpdate();
  } catch (e) {
    console.error('Error saving last lesson:', e);
  }
}

export function markLessonCompleted(lessonId: number, completed = true): void {
  try {
    const current = getCompletedLessons();
    let updated: number[];
    if (completed) {
      if (!current.includes(lessonId)) {
        updated = [...current, lessonId];
      } else {
        updated = current;
      }
    } else {
      updated = current.filter((id) => id !== lessonId);
    }
    localStorage.setItem(STORAGE_KEYS.COMPLETED_LESSONS, JSON.stringify(updated));
    
    // Update progress: عدد الدروس المكتملة ÷ 5 × 100
    const progress = Math.min(100, Math.round((updated.length / 5) * 100));
    localStorage.setItem(STORAGE_KEYS.PROGRESS, String(progress));
    
    triggerUpdate();
  } catch (e) {
    console.error('Error setting completed lesson:', e);
  }
}

export function getOverallProgress(): number {
  try {
    const completed = getCompletedLessons();
    return Math.min(100, Math.round((completed.length / 5) * 100));
  } catch {
    return 0;
  }
}

export function getPracticeSolved(): Record<string, PracticeAttempt> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PRACTICE_SOLVED);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading practice solved:', e);
    return {};
  }
}

export function recordPracticeSolved(
  questionId: string,
  lessonId: number,
  isCorrect: boolean
): { newlyCompletedLesson: boolean; totalCorrectInLesson: number } {
  try {
    const records = getPracticeSolved();
    const prev = records[questionId];
    const updatedAttempts = (prev?.attempts || 0) + 1;
    const alreadyCorrect = prev?.correct || false;

    records[questionId] = {
      solved: true,
      attempts: updatedAttempts,
      correct: alreadyCorrect || isCorrect,
      lessonId,
      timestamp: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEYS.PRACTICE_SOLVED, JSON.stringify(records));

    // Calculate total correct questions for this lesson
    const totalCorrectInLesson = Object.values(records).filter(
      (r) => r.lessonId === lessonId && r.correct
    ).length;

    let newlyCompletedLesson = false;
    const completedLessons = getCompletedLessons();
    // Rule: يُعتبر الدرس مكتملاً عند حل 3 تدريبات صحيحة من تدريبات الدرس
    if (totalCorrectInLesson >= 3 && !completedLessons.includes(lessonId)) {
      markLessonCompleted(lessonId, true);
      newlyCompletedLesson = true;
    }

    triggerUpdate();
    return { newlyCompletedLesson, totalCorrectInLesson };
  } catch (e) {
    console.error('Error recording practice solved:', e);
    return { newlyCompletedLesson: false, totalCorrectInLesson: 0 };
  }
}

export function getExamResults(): ExamResult[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.EXAM_RESULTS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading exam results:', e);
    return [];
  }
}

export function saveExamResult(result: ExamResult): void {
  try {
    const current = getExamResults();
    const updated = [result, ...current];
    localStorage.setItem(STORAGE_KEYS.EXAM_RESULTS, JSON.stringify(updated));
    triggerUpdate();
  } catch (e) {
    console.error('Error saving exam result:', e);
  }
}

export function resetAllProgress(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.COMPLETED_LESSONS);
    localStorage.removeItem(STORAGE_KEYS.LAST_LESSON);
    localStorage.removeItem(STORAGE_KEYS.EXAM_RESULTS);
    localStorage.removeItem(STORAGE_KEYS.PRACTICE_SOLVED);
    localStorage.removeItem(STORAGE_KEYS.PROGRESS);
    triggerUpdate();
  } catch (e) {
    console.error('Error resetting progress:', e);
  }
}

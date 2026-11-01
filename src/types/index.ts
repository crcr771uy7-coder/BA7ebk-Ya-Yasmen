export type QuestionType =
  | 'mcq'
  | 'true_false'
  | 'fill_blank'
  | 'find_unknown'
  | 'word_problem'
  | 'geometry';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface DefinitionItem {
  term: string;
  explanation: string;
  mathFormula?: string;
}

export interface LawItem {
  name: string;
  formula: string;
  condition?: string;
  explanation: string;
}

export interface SolvedExampleItem {
  title: string;
  given: string;
  required: string;
  steps: string[];
  finalAnswer: string;
}

export interface CommonMistakeItem {
  mistake: string;
  correction: string;
  why: string;
}

export interface LessonContent {
  id: number;
  title: string;
  subtitle: string;
  introduction: string;
  simplifiedExplanation: string[];
  definitions: DefinitionItem[];
  laws: LawItem[];
  solvedExamples: SolvedExampleItem[];
  svgDiagramKey?: string;
  importantNotes: string[];
  commonMistakes: CommonMistakeItem[];
  summary: string[];
}

export interface Question {
  id: string;
  lessonId: number;
  type: QuestionType;
  difficulty: DifficultyLevel;
  question: string;
  options?: string[];
  answer: string;
  solution: string[];
  explanation: string;
}

export interface ExamDefinition {
  id: string;
  title: string;
  description: string;
  timeMinutes: number;
  lessonIds: number[];
  questionCount: number;
}

export interface ExamResult {
  id: string;
  examId: string;
  examTitle: string;
  date: string;
  score: number;
  total: number;
  percentage: number;
  timeSpentSeconds: number;
  userAnswers: Record<string, string>;
}

export interface Flashcard {
  id: string;
  lessonId: number;
  category: string;
  front: string;
  back: string;
  formula?: string;
}

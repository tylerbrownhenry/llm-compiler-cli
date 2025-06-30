export interface QuestionCategory {
  category: string;
  title: string;
  description: string;
  order: number;
  questions: Question[];
}

export interface Question {
  id: string;
  text: string;
  type: 'single' | 'multiple' | 'boolean' | 'text';
  options?: string[];
  default?: any;
  dependencies?: string[];
  required: boolean;
  description?: string;
}

export interface LoadedQuestions {
  categories: QuestionCategory[];
  allQuestions: Question[];
  questionMap: Map<string, Question>;
}

export interface QuestionFlow {
  currentIndex: number;
  totalQuestions: number;
  currentQuestion: Question | null;
  answers: Record<string, any>;
}
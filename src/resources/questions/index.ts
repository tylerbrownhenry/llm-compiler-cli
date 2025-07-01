export * from './types/QuestionTypes.js';
export * from './loaders/QuestionLoader.js';
export * from './loaders/CategoryManager.js';

// Create default instances for easy use
import { QuestionLoader } from './loaders/QuestionLoader.js';
import { CategoryManager } from './loaders/CategoryManager.js';

const defaultQuestionLoader = new QuestionLoader();
const defaultCategoryManager = new CategoryManager(defaultQuestionLoader);

// Export convenience functions that match the old API
export const getQuestionById = async (id: string) => {
  return defaultQuestionLoader.getQuestionById(id);
};

export const getQuestionsByCategory = async (category: string) => {
  return defaultQuestionLoader.getQuestionsByCategory(category);
};

export const getNextQuestion = async (
  currentQuestionId: string | null,
  answers: Record<string, any>
) => {
  return defaultCategoryManager.getNextQuestion(currentQuestionId, answers);
};

export const getAllQuestions = async () => {
  return defaultQuestionLoader.getAllQuestions();
};

export const getAllCategories = async () => {
  return defaultQuestionLoader.getAllCategories();
};

export const validateAnswers = async (answers: Record<string, any>) => {
  return defaultCategoryManager.validateAnswers(answers);
};

// For testing or custom paths
export const createQuestionLoader = (categoriesPath?: string) => {
  const loader = new QuestionLoader(categoriesPath);
  return {
    loader,
    manager: new CategoryManager(loader)
  };
};
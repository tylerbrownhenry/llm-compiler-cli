import { describe, it, expect, beforeEach } from 'vitest';
import { QuestionLoader } from '../loaders/QuestionLoader.js';
import path from 'path';

describe('QuestionLoader', () => {
  let questionLoader: QuestionLoader;

  beforeEach(() => {
    const categoriesPath = path.join(process.cwd(), 'src/questions/categories');
    questionLoader = new QuestionLoader(categoriesPath);
    questionLoader.clearCache(); // Clear cache before each test
  });

  it('should load all question categories', async () => {
    const categories = await questionLoader.getAllCategories();
    
    expect(categories).toBeDefined();
    expect(categories.length).toBeGreaterThan(0);
    expect(categories[0]).toHaveProperty('category');
    expect(categories[0]).toHaveProperty('title');
    expect(categories[0]).toHaveProperty('questions');
  });

  it('should load all questions in correct order', async () => {
    const questions = await questionLoader.getAllQuestions();
    
    expect(questions).toBeDefined();
    expect(questions.length).toBeGreaterThan(0);
    
    // Check that projectType is first question
    expect(questions[0].id).toBe('projectType');
    
    // Check that all questions have required properties
    questions.forEach(question => {
      expect(question).toHaveProperty('id');
      expect(question).toHaveProperty('text');
      expect(question).toHaveProperty('type');
      expect(question).toHaveProperty('required');
    });
  });

  it('should get question by ID', async () => {
    const question = await questionLoader.getQuestionById('projectType');
    
    expect(question).toBeDefined();
    expect(question?.id).toBe('projectType');
    expect(question?.text).toContain('project');
  });

  it('should get questions by category', async () => {
    const philosophyQuestions = await questionLoader.getQuestionsByCategory('philosophy');
    
    expect(philosophyQuestions).toBeDefined();
    expect(philosophyQuestions.length).toBeGreaterThan(0);
    expect(philosophyQuestions[0].id).toBe('followTDD');
  });

  it('should return undefined for non-existent question', async () => {
    const question = await questionLoader.getQuestionById('nonExistentQuestion');
    expect(question).toBeUndefined();
  });
});
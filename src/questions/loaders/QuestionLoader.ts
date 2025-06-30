import { promises as fs } from 'fs';
import path from 'path';
import { QuestionCategory, Question, LoadedQuestions } from '../types/QuestionTypes.js';

export class QuestionLoader {
  private categoriesPath: string;
  private loadedQuestions: LoadedQuestions | null = null;

  constructor(categoriesPath?: string) {
    this.categoriesPath = categoriesPath || path.join(process.cwd(), 'src/questions/categories');
  }

  async loadQuestions(): Promise<LoadedQuestions> {
    if (this.loadedQuestions) {
      return this.loadedQuestions;
    }

    const categories = await this.loadCategories();
    const allQuestions = this.flattenQuestions(categories);
    const questionMap = this.createQuestionMap(allQuestions);

    this.loadedQuestions = {
      categories,
      allQuestions,
      questionMap
    };

    return this.loadedQuestions;
  }

  private async loadCategories(): Promise<QuestionCategory[]> {
    try {
      const files = await fs.readdir(this.categoriesPath);
      const jsonFiles = files.filter(file => file.endsWith('.json')).sort();
      
      const categories: QuestionCategory[] = [];
      
      for (const file of jsonFiles) {
        const filePath = path.join(this.categoriesPath, file);
        const content = await fs.readFile(filePath, 'utf-8');
        const category: QuestionCategory = JSON.parse(content);
        categories.push(category);
      }

      return categories.sort((a, b) => a.order - b.order);
    } catch (error) {
      throw new Error(`Failed to load question categories: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private flattenQuestions(categories: QuestionCategory[]): Question[] {
    const questions: Question[] = [];
    
    for (const category of categories) {
      for (const question of category.questions) {
        questions.push(question);
      }
    }
    
    return questions;
  }

  private createQuestionMap(questions: Question[]): Map<string, Question> {
    const map = new Map<string, Question>();
    
    for (const question of questions) {
      map.set(question.id, question);
    }
    
    return map;
  }

  async getQuestionById(id: string): Promise<Question | undefined> {
    const { questionMap } = await this.loadQuestions();
    return questionMap.get(id);
  }

  async getQuestionsByCategory(category: string): Promise<Question[]> {
    const { categories } = await this.loadQuestions();
    const categoryData = categories.find(c => c.category === category);
    return categoryData ? categoryData.questions : [];
  }

  async getAllQuestions(): Promise<Question[]> {
    const { allQuestions } = await this.loadQuestions();
    return allQuestions;
  }

  async getAllCategories(): Promise<QuestionCategory[]> {
    const { categories } = await this.loadQuestions();
    return categories;
  }

  // Clear cache for testing or reloading
  clearCache(): void {
    this.loadedQuestions = null;
  }
}
import { Question, QuestionFlow } from '../types/QuestionTypes.js';
import { QuestionLoader } from './QuestionLoader.js';

export class CategoryManager {
  private questionLoader: QuestionLoader;

  constructor(questionLoader: QuestionLoader) {
    this.questionLoader = questionLoader;
  }

  async getNextQuestion(
    currentQuestionId: string | null,
    answers: Record<string, any>
  ): Promise<Question | null> {
    const allQuestions = await this.questionLoader.getAllQuestions();
    
    if (!currentQuestionId) {
      return allQuestions[0] || null;
    }

    const currentIndex = allQuestions.findIndex(q => q.id === currentQuestionId);
    if (currentIndex === -1 || currentIndex === allQuestions.length - 1) {
      return null;
    }

    const nextQuestion = allQuestions[currentIndex + 1];
    
    // Check if next question has dependencies
    if (nextQuestion.dependencies && nextQuestion.dependencies.length > 0) {
      const dependenciesMet = this.checkDependencies(nextQuestion.dependencies, answers);
      
      if (!dependenciesMet) {
        // Skip this question and try the next one
        return this.getNextQuestion(nextQuestion.id, answers);
      }
    }

    return nextQuestion;
  }

  async getPreviousQuestion(
    currentQuestionId: string,
    answers: Record<string, any>
  ): Promise<Question | null> {
    const allQuestions = await this.questionLoader.getAllQuestions();
    
    const currentIndex = allQuestions.findIndex(q => q.id === currentQuestionId);
    if (currentIndex <= 0) {
      return null;
    }

    const previousQuestion = allQuestions[currentIndex - 1];
    
    // Check if previous question should be shown (dependencies)
    if (previousQuestion.dependencies && previousQuestion.dependencies.length > 0) {
      const dependenciesMet = this.checkDependencies(previousQuestion.dependencies, answers);
      
      if (!dependenciesMet) {
        // Skip this question and try the previous one
        return this.getPreviousQuestion(previousQuestion.id, answers);
      }
    }

    return previousQuestion;
  }

  async createQuestionFlow(
    currentQuestionId: string | null,
    answers: Record<string, any>
  ): Promise<QuestionFlow> {
    const allQuestions = await this.questionLoader.getAllQuestions();
    const currentQuestion = currentQuestionId 
      ? await this.questionLoader.getQuestionById(currentQuestionId)
      : allQuestions[0];
    
    const currentIndex = currentQuestion 
      ? allQuestions.findIndex(q => q.id === currentQuestion.id)
      : 0;

    return {
      currentIndex: Math.max(0, currentIndex),
      totalQuestions: allQuestions.length,
      currentQuestion: currentQuestion || null,
      answers
    };
  }

  private checkDependencies(dependencies: string[], answers: Record<string, any>): boolean {
    return dependencies.every(dep => {
      const answer = answers[dep];
      
      // For boolean questions, dependency is met if answer is true
      if (typeof answer === 'boolean') {
        return answer === true;
      }
      
      // For array questions (multiple choice), dependency is met if array has items
      if (Array.isArray(answer)) {
        return answer.length > 0;
      }
      
      // For string questions, dependency is met if not empty
      if (typeof answer === 'string') {
        return answer.trim().length > 0;
      }
      
      // If answer exists and is not null/undefined, dependency is met
      return answer != null;
    });
  }

  async validateAnswers(answers: Record<string, any>): Promise<{
    isValid: boolean;
    errors: string[];
  }> {
    const allQuestions = await this.questionLoader.getAllQuestions();
    const errors: string[] = [];

    for (const question of allQuestions) {
      // Skip validation for questions whose dependencies aren't met
      if (question.dependencies && question.dependencies.length > 0) {
        const dependenciesMet = this.checkDependencies(question.dependencies, answers);
        if (!dependenciesMet) {
          continue;
        }
      }

      const answer = answers[question.id];

      // Check required questions
      if (question.required && (answer == null || answer === '')) {
        errors.push(`Question "${question.text}" is required but not answered`);
        continue;
      }

      // Validate answer format based on question type
      if (answer != null) {
        switch (question.type) {
          case 'single':
            if (question.options && !question.options.includes(answer)) {
              errors.push(`Invalid answer for "${question.text}": ${answer}`);
            }
            break;
          
          case 'multiple':
            if (!Array.isArray(answer)) {
              errors.push(`Answer for "${question.text}" must be an array`);
            } else if (question.options) {
              const invalidOptions = answer.filter(a => !question.options!.includes(a));
              if (invalidOptions.length > 0) {
                errors.push(`Invalid options for "${question.text}": ${invalidOptions.join(', ')}`);
              }
            }
            break;
          
          case 'boolean':
            if (typeof answer !== 'boolean') {
              errors.push(`Answer for "${question.text}" must be true or false`);
            }
            break;
          
          case 'text':
            if (typeof answer !== 'string') {
              errors.push(`Answer for "${question.text}" must be text`);
            }
            break;
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
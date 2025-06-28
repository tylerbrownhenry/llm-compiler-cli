import { Question } from '../types';

export const questions: Question[] = [
  {
    id: 'projectType',
    text: 'What type of project are you building?',
    type: 'single',
    category: 'project',
    options: ['typescript', 'javascript', 'python', 'other'],
    default: 'typescript',
    description: 'This determines the base language-specific guidelines',
  },
  {
    id: 'followTDD',
    text: 'Do you want to follow Test-Driven Development (TDD)?',
    type: 'boolean',
    category: 'philosophy',
    default: true,
    description: 'TDD means writing tests before implementation code',
  },
  {
    id: 'strictArchitecture',
    text: 'Do you want strictly enforced architecture?',
    type: 'boolean',
    category: 'philosophy',
    default: true,
    description: 'Enforces clean architecture patterns and boundaries',
  },
  {
    id: 'functionalProgramming',
    text: 'Do you prefer functional programming patterns?',
    type: 'boolean',
    category: 'philosophy',
    default: true,
    description: 'Immutable data, pure functions, composition over inheritance',
  },
  {
    id: 'linting',
    text: 'Which linting tools do you use?',
    type: 'multiple',
    category: 'tools',
    options: ['eslint', 'stylelint', 'prettier'],
    default: ['eslint', 'prettier'],
    description: 'Code quality and formatting tools',
  },
  {
    id: 'testingFramework',
    text: 'Which testing frameworks do you use?',
    type: 'multiple',
    category: 'tools',
    options: ['vitest', 'jest', 'react-testing-library', 'cypress', 'playwright'],
    default: ['vitest', 'react-testing-library'],
    description: 'Testing tools and frameworks',
    dependencies: ['followTDD'],
  },
  {
    id: 'uiFramework',
    text: 'Which UI framework are you using?',
    type: 'single',
    category: 'tools',
    options: ['react', 'vue', 'angular', 'svelte', 'none'],
    description: 'Frontend framework for UI development',
  },
  {
    id: 'stateManagement',
    text: 'What state management solution do you use?',
    type: 'single',
    category: 'tools',
    options: ['redux', 'zustand', 'context', 'mobx', 'none'],
    description: 'Global state management approach',
    dependencies: ['uiFramework'],
  },
  {
    id: 'i18n',
    text: 'Do you need internationalization (i18n) support?',
    type: 'boolean',
    category: 'tools',
    default: false,
    description: 'Multi-language support for your application',
  },
  {
    id: 'accessibility',
    text: 'Do you need accessibility (a11y) compliance?',
    type: 'boolean',
    category: 'quality',
    default: true,
    description: 'WCAG guidelines and screen reader support',
  },
  {
    id: 'performance',
    text: 'Do you want performance optimization guidelines?',
    type: 'boolean',
    category: 'quality',
    default: true,
    description: 'Performance monitoring and optimization techniques',
  },
  {
    id: 'security',
    text: 'Do you need security best practices?',
    type: 'boolean',
    category: 'quality',
    default: true,
    description: 'Secure coding practices and vulnerability prevention',
  },
  {
    id: 'codeReview',
    text: 'Do you want code review process guidelines?',
    type: 'boolean',
    category: 'quality',
    default: true,
    description: 'Pull request and code review standards',
  },
  {
    id: 'cicd',
    text: 'Do you use CI/CD pipelines?',
    type: 'boolean',
    category: 'infrastructure',
    default: false,
    description: 'Continuous integration and deployment practices',
  },
  {
    id: 'logging',
    text: 'Do you need logging guidelines?',
    type: 'boolean',
    category: 'infrastructure',
    default: false,
    description: 'Structured logging and monitoring practices',
  },
  {
    id: 'monitoring',
    text: 'Do you use application monitoring?',
    type: 'boolean',
    category: 'infrastructure',
    default: false,
    description: 'APM tools and error tracking',
  },
  {
    id: 'documentation',
    text: 'Do you want documentation standards?',
    type: 'boolean',
    category: 'infrastructure',
    default: true,
    description: 'Code documentation and README guidelines',
  },
  {
    id: 'outputFormats',
    text: 'Which output formats do you want?',
    type: 'multiple',
    category: 'output',
    options: ['claude', 'vscode', 'readme', 'cursor', 'all'],
    default: ['all'],
    description: 'Generated instruction formats',
  },
  {
    id: 'projectName',
    text: 'What is your project name?',
    type: 'text',
    category: 'output',
    default: 'My Project',
    description: 'Used in generated documentation',
  },
];

export const getQuestionById = (id: string): Question | undefined => {
  return questions.find(q => q.id === id);
};

export const getQuestionsByCategory = (category: string): Question[] => {
  return questions.filter(q => q.category === category);
};

export const getNextQuestion = (
  currentQuestionId: string | null,
  answers: Record<string, any>
): Question | null => {
  if (!currentQuestionId) {
    return questions[0];
  }

  const currentIndex = questions.findIndex(q => q.id === currentQuestionId);
  if (currentIndex === -1 || currentIndex === questions.length - 1) {
    return null;
  }

  const nextQuestion = questions[currentIndex + 1];
  
  // Check if next question has dependencies
  if (nextQuestion.dependencies) {
    const dependenciesMet = nextQuestion.dependencies.every(dep => {
      return answers[dep] === true || (Array.isArray(answers[dep]) && answers[dep].length > 0);
    });
    
    if (!dependenciesMet) {
      // Skip this question and try the next one
      return getNextQuestion(nextQuestion.id, answers);
    }
  }

  return nextQuestion;
};
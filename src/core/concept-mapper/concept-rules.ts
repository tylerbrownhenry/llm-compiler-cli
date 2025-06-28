import { ConceptRule } from '../types';

export const conceptRules: ConceptRule[] = [
  // CRAFT - Testing & Quality
  {
    conceptId: 'tdd',
    category: 'craft',
    conditions: [
      { field: 'followTDD', operator: 'equals', value: true }
    ],
    priority: 10,
  },
  {
    conceptId: 'testing-principles',
    category: 'craft',
    conditions: [
      { field: 'followTDD', operator: 'equals', value: true }
    ],
    priority: 9,
  },
  {
    conceptId: 'code-style',
    category: 'craft',
    conditions: [
      { field: 'linting', operator: 'includes', value: 'eslint' }
    ],
    priority: 8,
  },
  {
    conceptId: 'code-review',
    category: 'craft',
    conditions: [
      { field: 'codeReview', operator: 'equals', value: true }
    ],
    priority: 7,
  },
  {
    conceptId: 'exception-handling',
    category: 'craft',
    conditions: [
      { field: 'projectType', operator: 'equals', value: 'typescript' },
      { field: 'projectType', operator: 'equals', value: 'javascript' }
    ],
    priority: 6,
  },

  // CRAFT - TypeScript & Type Safety
  {
    conceptId: 'typescript-standards',
    category: 'craft',
    conditions: [
      { field: 'projectType', operator: 'equals', value: 'typescript' }
    ],
    priority: 10,
  },
  {
    conceptId: 'typescript-guidelines',
    category: 'craft',
    conditions: [
      { field: 'projectType', operator: 'equals', value: 'typescript' }
    ],
    priority: 9,
  },

  // CRAFT - Code Architecture & Design
  {
    conceptId: 'atomic-design',
    category: 'craft',
    conditions: [
      { field: 'uiFramework', operator: 'exists', value: null }
    ],
    priority: 8,
  },
  {
    conceptId: 'architecture-enforcement',
    category: 'craft',
    conditions: [
      { field: 'strictArchitecture', operator: 'equals', value: true }
    ],
    priority: 9,
  },
  {
    conceptId: 'feature-folder-structure',
    category: 'craft',
    conditions: [
      { field: 'uiFramework', operator: 'exists', value: null }
    ],
    priority: 7,
  },
  {
    conceptId: 'reusability',
    category: 'craft',
    conditions: [
      { field: 'functionalProgramming', operator: 'equals', value: true }
    ],
    priority: 6,
  },
  {
    conceptId: 'dependency-injection',
    category: 'craft',
    conditions: [
      { field: 'strictArchitecture', operator: 'equals', value: true }
    ],
    priority: 5,
  },
  {
    conceptId: 'dry-principles',
    category: 'craft',
    conditions: [
      { field: 'functionalProgramming', operator: 'equals', value: true }
    ],
    priority: 5,
  },

  // PROCESS - Development Workflow
  {
    conceptId: 'development-workflow',
    category: 'process',
    conditions: [
      { field: 'followTDD', operator: 'equals', value: true }
    ],
    priority: 10,
  },
  {
    conceptId: 'version-control',
    category: 'process',
    conditions: [], // Always included
    priority: 9,
  },
  {
    conceptId: 'ci-cd',
    category: 'process',
    conditions: [
      { field: 'cicd', operator: 'equals', value: true }
    ],
    priority: 7,
  },

  // PROCESS - System Architecture & Infrastructure
  {
    conceptId: 'configuration-separation',
    category: 'process',
    conditions: [], // Always included for production apps
    priority: 8,
  },
  {
    conceptId: 'state-management',
    category: 'process',
    conditions: [
      { field: 'stateManagement', operator: 'exists', value: null }
    ],
    priority: 7,
  },
  {
    conceptId: 'api-integration',
    category: 'process',
    conditions: [
      { field: 'uiFramework', operator: 'exists', value: null }
    ],
    priority: 6,
  },
  {
    conceptId: 'security',
    category: 'process',
    conditions: [
      { field: 'security', operator: 'equals', value: true }
    ],
    priority: 9,
  },
  {
    conceptId: 'performance',
    category: 'process',
    conditions: [
      { field: 'performance', operator: 'equals', value: true }
    ],
    priority: 7,
  },
  {
    conceptId: 'logging-monitoring',
    category: 'process',
    conditions: [
      { field: 'logging', operator: 'equals', value: true },
      { field: 'monitoring', operator: 'equals', value: true }
    ],
    priority: 5,
  },

  // PROCESS - Documentation & Communication
  {
    conceptId: 'documentation',
    category: 'process',
    conditions: [
      { field: 'documentation', operator: 'equals', value: true }
    ],
    priority: 6,
  },
  {
    conceptId: 'working-with-claude',
    category: 'process',
    conditions: [
      { field: 'outputFormats', operator: 'includes', value: 'claude' },
      { field: 'outputFormats', operator: 'includes', value: 'all' }
    ],
    priority: 5,
  },

  // PRODUCT - User Experience & Interface
  {
    conceptId: 'design-system',
    category: 'product',
    conditions: [
      { field: 'uiFramework', operator: 'exists', value: null }
    ],
    priority: 8,
  },
  {
    conceptId: 'responsive-design',
    category: 'product',
    conditions: [
      { field: 'uiFramework', operator: 'exists', value: null }
    ],
    priority: 7,
  },
  {
    conceptId: 'accessibility',
    category: 'product',
    conditions: [
      { field: 'accessibility', operator: 'equals', value: true }
    ],
    priority: 9,
  },
  {
    conceptId: 'i18n',
    category: 'product',
    conditions: [
      { field: 'i18n', operator: 'equals', value: true }
    ],
    priority: 6,
  },
  {
    conceptId: 'naming-conventions',
    category: 'product',
    conditions: [
      { field: 'uiFramework', operator: 'exists', value: null }
    ],
    priority: 5,
  },
];

export const getApplicableConcepts = (config: Record<string, any>): string[] => {
  const applicableConcepts: Array<{ id: string; priority: number }> = [];

  for (const rule of conceptRules) {
    const isApplicable = rule.conditions.length === 0 || rule.conditions.some(condition => {
      const fieldValue = getNestedValue(config, condition.field);
      
      switch (condition.operator) {
        case 'equals':
          return fieldValue === condition.value;
        case 'includes':
          return Array.isArray(fieldValue) && fieldValue.includes(condition.value);
        case 'exists':
          return fieldValue !== undefined && fieldValue !== null && fieldValue !== '';
        default:
          return false;
      }
    });

    if (isApplicable) {
      applicableConcepts.push({
        id: rule.conceptId,
        priority: rule.priority
      });
    }
  }

  // Sort by priority (highest first) and return concept IDs
  return applicableConcepts
    .sort((a, b) => b.priority - a.priority)
    .map(concept => concept.id);
};

const getNestedValue = (obj: Record<string, any>, path: string): any => {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : undefined;
  }, obj);
};
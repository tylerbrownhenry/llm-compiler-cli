import { z } from 'zod';

export type QuestionType = 'single' | 'multiple' | 'boolean' | 'text';
export type QuestionCategory = 'project' | 'philosophy' | 'tools' | 'quality' | 'infrastructure' | 'output';

export const QuestionSchema = z.object({
  id: z.string(),
  text: z.string(),
  type: z.enum(['single', 'multiple', 'boolean', 'text']),
  options: z.array(z.string()).optional(),
  default: z.any().optional(),
  dependencies: z.array(z.string()).optional(),
  category: z.enum(['project', 'philosophy', 'tools', 'quality', 'infrastructure', 'output']),
  required: z.boolean().default(true),
  description: z.string().optional(),
});

export type Question = z.infer<typeof QuestionSchema>;

export const ProjectConfigSchema = z.object({
  projectType: z.enum(['javascript', 'typescript', 'python', 'other']),
  philosophy: z.object({
    tdd: z.boolean().default(true),
    strictArchitecture: z.boolean().default(true),
    functionalProgramming: z.boolean().default(true),
  }),
  tools: z.object({
    eslint: z.boolean().default(true),
    stylelint: z.boolean().default(false),
    testing: z.array(z.enum(['vitest', 'jest', 'react-testing-library'])).default(['vitest', 'react-testing-library']),
    stateManagement: z.enum(['redux', 'zustand', 'context', 'none']).optional(),
    uiFramework: z.enum(['react', 'vue', 'angular', 'none']).optional(),
    i18n: z.boolean().default(false),
  }),
  quality: z.object({
    accessibility: z.boolean().default(true),
    performance: z.boolean().default(true),
    security: z.boolean().default(true),
    codeReview: z.boolean().default(true),
  }),
  infrastructure: z.object({
    cicd: z.boolean().default(false),
    logging: z.boolean().default(false),
    monitoring: z.boolean().default(false),
    documentation: z.boolean().default(true),
  }),
  output: z.object({
    formats: z.array(z.enum(['claude', 'vscode', 'readme', 'cursor', 'all'])).default(['all']),
    projectName: z.string().default('My Project'),
    customizations: z.record(z.any()).default({}),
  }),
});

export type ProjectConfig = z.infer<typeof ProjectConfigSchema>;

export const ConceptRuleSchema = z.object({
  conceptId: z.string(),
  conditions: z.array(z.object({
    field: z.string(),
    operator: z.enum(['equals', 'includes', 'exists']),
    value: z.any(),
  })),
  priority: z.number(),
  conflicts: z.array(z.string()).optional(),
  category: z.enum(['craft', 'process', 'product']),
});

export type ConceptRule = z.infer<typeof ConceptRuleSchema>;

export const SelectionMatrixSchema = z.object({
  projectType: z.string(),
  selections: z.record(z.any()),
  derivedConcepts: z.array(z.string()),
  outputFormats: z.array(z.string()),
  timestamp: z.date().default(() => new Date()),
});

export type SelectionMatrix = z.infer<typeof SelectionMatrixSchema>;

export const GeneratedOutputSchema = z.object({
  claude: z.string().optional(),
  vscode: z.string().optional(),
  readme: z.string().optional(),
  cursor: z.string().optional(),
  metadata: z.object({
    conceptsUsed: z.array(z.string()),
    generatedAt: z.date(),
    config: ProjectConfigSchema,
  }),
});

export type GeneratedOutput = z.infer<typeof GeneratedOutputSchema>;

export interface ConceptTemplate {
  id: string;
  name: string;
  category: 'craft' | 'process' | 'product';
  subcategory: string;
  content: string;
  dependencies: string[];
  conflicts: string[];
  priority: number;
}

export interface QuestionFlow {
  questions: Question[];
  conditionalLogic: ConditionalRule[];
}

export interface ConditionalRule {
  if: {
    field: string;
    operator: 'equals' | 'includes' | 'exists';
    value: any;
  };
  then: {
    showQuestions?: string[];
    hideQuestions?: string[];
    setDefaults?: Record<string, any>;
  };
}

export type CLIMode = 'interactive' | 'generate' | 'preview' | 'list';

export interface CLIFlags {
  type?: string;
  tdd?: boolean;
  strictArch?: boolean;
  output?: string;
  config?: string;
  silent?: boolean;
  preview?: boolean;
}
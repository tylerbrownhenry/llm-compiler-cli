import { ProjectConfig } from '../../../core/types.js';

export interface ContentRule {
  condition: (config: ProjectConfig) => boolean;
  contentPath: string;
  section: string;
  priority: number;
}

export const contentMapping: Record<string, ContentRule> = {
  // Philosophy
  tdd: {
    condition: (config) => config.philosophy.tdd,
    contentPath: 'categories/philosophy/tdd.md',
    section: 'philosophy',
    priority: 1
  },
  
  strictArchitecture: {
    condition: (config) => config.philosophy.strictArchitecture,
    contentPath: 'categories/philosophy/strict-architecture.md',
    section: 'philosophy',
    priority: 2
  },
  
  functionalProgramming: {
    condition: (config) => config.philosophy.functionalProgramming,
    contentPath: 'categories/philosophy/functional-programming.md',
    section: 'philosophy',
    priority: 3
  },

  // Project Type
  typescript: {
    condition: (config) => config.projectType === 'typescript',
    contentPath: 'categories/project/typescript.md',
    section: 'language',
    priority: 1
  },

  // Tools
  eslint: {
    condition: (config) => config.tools.eslint,
    contentPath: 'categories/tools/eslint.md',
    section: 'tools',
    priority: 1
  },
  
  testing: {
    condition: (config) => config.tools.testing.length > 0,
    contentPath: 'categories/tools/testing.md',
    section: 'tools',
    priority: 2
  },

  // Quality
  accessibility: {
    condition: (config) => config.quality.accessibility,
    contentPath: 'categories/quality/accessibility.md',
    section: 'quality',
    priority: 1
  },
  
  security: {
    condition: (config) => config.quality.security,
    contentPath: 'categories/quality/security.md',
    section: 'quality',
    priority: 2
  }
};

export const getApplicableContent = (config: ProjectConfig): ContentRule[] => {
  return Object.values(contentMapping)
    .filter(rule => rule.condition(config))
    .sort((a, b) => a.priority - b.priority);
};
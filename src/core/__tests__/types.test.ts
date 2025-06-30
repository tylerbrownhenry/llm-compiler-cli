import { describe, it, expect } from 'vitest';
import { ProjectConfigSchema, QuestionSchema } from './types.js';

describe('Type Schemas', () => {
  describe('ProjectConfigSchema', () => {
    it('should validate a complete valid config', () => {
      const validConfig = {
        projectType: 'typescript',
        philosophy: {
          tdd: true,
          strictArchitecture: true,
          functionalProgramming: true,
        },
        tools: {
          eslint: true,
          testing: ['vitest'],
        },
        quality: {
          accessibility: true,
          performance: true,
          security: true,
          codeReview: true,
        },
        infrastructure: {
          documentation: true,
        },
        output: {
          formats: ['claude'],
          projectName: 'Test Project',
        },
      };

      const result = ProjectConfigSchema.parse(validConfig);
      expect(result.projectType).toBe('typescript');
      expect(result.philosophy.tdd).toBe(true);
      expect(result.tools.testing).toEqual(['vitest']);
    });

    it('should apply defaults for missing optional fields', () => {
      const minimalConfig = {
        projectType: 'javascript',
      };

      const result = ProjectConfigSchema.parse(minimalConfig);
      expect(result.philosophy.tdd).toBe(true); // default
      expect(result.tools.eslint).toBe(true); // default
      expect(result.output.formats).toEqual(['all']); // default
      expect(result.output.projectName).toBe('My Project'); // default
    });

    it('should reject invalid project types', () => {
      const invalidConfig = {
        projectType: 'invalid',
      };

      expect(() => ProjectConfigSchema.parse(invalidConfig)).toThrow();
    });
  });

  describe('QuestionSchema', () => {
    it('should validate a complete question', () => {
      const validQuestion = {
        id: 'test-question',
        text: 'Test question?',
        type: 'boolean',
        category: 'project',
        default: true,
        description: 'A test question',
      };

      const result = QuestionSchema.parse(validQuestion);
      expect(result.id).toBe('test-question');
      expect(result.type).toBe('boolean');
      expect(result.required).toBe(true); // default
    });

    it('should validate a minimal question', () => {
      const minimalQuestion = {
        id: 'minimal',
        text: 'Minimal question?',
        type: 'text',
        category: 'tools',
      };

      const result = QuestionSchema.parse(minimalQuestion);
      expect(result.required).toBe(true); // default
      expect(result.description).toBeUndefined();
    });

    it('should reject invalid question types', () => {
      const invalidQuestion = {
        id: 'invalid',
        text: 'Invalid question?',
        type: 'invalid',
        category: 'project',
      };

      expect(() => QuestionSchema.parse(invalidQuestion)).toThrow();
    });
  });
});
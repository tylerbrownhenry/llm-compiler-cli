import { describe, test, expect, beforeAll } from 'vitest';
import path from 'path';
import { ContentManager } from '../ContentManager';

describe('ContentManager', () => {
  let contentManager: ContentManager;
  const contentPath = path.join(process.cwd(), 'content');

  beforeAll(async () => {
    contentManager = new ContentManager(contentPath);
    await contentManager.initialize();
  });

  test('should initialize successfully', () => {
    expect(contentManager).toBeDefined();
  });

  test('should load structured concepts', () => {
    const tddConcept = contentManager.getConcept('tdd');
    expect(tddConcept).toBeDefined();
    expect(tddConcept?.metadata.name).toBe('Test-Driven Development (TDD)');
    expect(tddConcept?.metadata.category).toBe('craft');
    expect(tddConcept?.metadata.subcategory).toBe('testing-and-quality');
  });

  test('should load TypeScript concept', () => {
    const tsConcept = contentManager.getConcept('typescript-standards');
    expect(tsConcept).toBeDefined();
    expect(tsConcept?.metadata.name).toBe('TypeScript Standards & Best Practices');
    expect(tsConcept?.metadata.applicable_to.languages).toContain('typescript');
  });

  test('should filter concepts by language', () => {
    const typescriptConcepts = contentManager.getConceptsByLanguage('typescript');
    expect(typescriptConcepts.length).toBeGreaterThan(0);
    
    const tsConcept = typescriptConcepts.find(c => c.metadata.id === 'typescript-standards');
    expect(tsConcept).toBeDefined();
  });

  test('should filter concepts by category', () => {
    const craftConcepts = contentManager.getConceptsByCategory('craft');
    expect(craftConcepts.length).toBeGreaterThan(0);
    
    const hasTestingConcepts = craftConcepts.some(c => c.metadata.subcategory === 'testing-and-quality');
    expect(hasTestingConcepts).toBe(true);
  });

  test('should provide content statistics', () => {
    const stats = contentManager.getStatistics();
    expect(stats.totalConcepts).toBeGreaterThan(0);
    expect(stats.languagesSupported).toBeGreaterThan(0);
    expect(stats.conceptsByCategory.craft).toBeGreaterThan(0);
  });

  test('should get available languages', () => {
    const languages = contentManager.getAvailableLanguages();
    expect(languages).toContain('typescript');
    expect(languages).toContain('javascript');
  });

  test('should filter concepts with complex criteria', () => {
    const filtered = contentManager.getFilteredConcepts({
      languages: ['typescript'],
      categories: ['craft'],
      min_priority: 1,
      max_priority: 2
    });
    
    expect(filtered.length).toBeGreaterThan(0);
    filtered.forEach(concept => {
      expect(concept.metadata.applicable_to.languages).toContain('typescript');
      expect(concept.metadata.category).toBe('craft');
      expect(concept.metadata.priority).toBeGreaterThanOrEqual(1);
      expect(concept.metadata.priority).toBeLessThanOrEqual(2);
    });
  });
});
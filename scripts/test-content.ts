#!/usr/bin/env tsx

import path from 'path';
import { ContentManager } from '../src/services/content';

async function testContentSystem() {
  console.log('🚀 Testing Structured Content System\n');
  
  const contentPath = path.join(process.cwd(), 'content');
  const contentManager = new ContentManager(contentPath);
  
  try {
    // Initialize content manager
    await contentManager.initialize();
    console.log('✅ Content system initialized successfully\n');
    
    // Show statistics
    const stats = contentManager.getStatistics();
    console.log('📊 Content Statistics:');
    console.log(`   • Total concepts: ${stats.totalConcepts}`);
    console.log(`   • Total categories: ${stats.totalCategories}`);
    console.log(`   • Languages supported: ${stats.languagesSupported}`);
    console.log(`   • Frameworks supported: ${stats.frameworksSupported}`);
    console.log(`   • Concepts by category: ${JSON.stringify(stats.conceptsByCategory, null, 2)}\n`);
    
    // Test concept retrieval
    console.log('🔍 Testing Concept Retrieval:');
    const tddConcept = contentManager.getConcept('tdd');
    if (tddConcept) {
      console.log(`   • Found TDD concept: "${tddConcept.metadata.name}"`);
      console.log(`   • Category: ${tddConcept.metadata.category}/${tddConcept.metadata.subcategory}`);
      console.log(`   • Applicable to: ${tddConcept.metadata.applicable_to.languages.join(', ')}`);
      console.log(`   • Content length: ${tddConcept.content.length} characters`);
    }
    
    const tsConcept = contentManager.getConcept('typescript-standards');
    if (tsConcept) {
      console.log(`   • Found TypeScript concept: "${tsConcept.metadata.name}"`);
      console.log(`   • Weight: ${tsConcept.metadata.weight}`);
      console.log(`   • Tags: ${tsConcept.metadata.tags.join(', ')}`);
    }
    
    console.log();
    
    // Test filtering
    console.log('🎯 Testing Content Filtering:');
    const typescriptConcepts = contentManager.getConceptsByLanguage('typescript');
    console.log(`   • TypeScript concepts: ${typescriptConcepts.length}`);
    typescriptConcepts.forEach(concept => {
      console.log(`     - ${concept.metadata.name} (priority: ${concept.metadata.priority})`);
    });
    
    const craftConcepts = contentManager.getConceptsByCategory('craft');
    console.log(`   • CRAFT category concepts: ${craftConcepts.length}`);
    
    const processConcepts = contentManager.getConceptsByCategory('process');
    console.log(`   • PROCESS category concepts: ${processConcepts.length}`);
    
    console.log();
    
    // Test complex filtering
    console.log('🎨 Testing Complex Filtering:');
    const filtered = contentManager.getFilteredConcepts({
      languages: ['typescript'],
      categories: ['craft'],
      tags: ['testing']
    });
    console.log(`   • TypeScript + CRAFT + testing: ${filtered.length} concepts`);
    filtered.forEach(concept => {
      console.log(`     - ${concept.metadata.name}`);
    });
    
    console.log();
    
    // Test available options
    console.log('📋 Available Options:');
    console.log(`   • Languages: ${contentManager.getAvailableLanguages().join(', ')}`);
    console.log(`   • Categories: ${contentManager.getAvailableCategories().join(', ')}`);
    console.log(`   • Subcategories: ${contentManager.getAvailableSubcategories().join(', ')}`);
    
    console.log('\n✨ All tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Error testing content system:', error);
    process.exit(1);
  }
}

// Run the test
testContentSystem();
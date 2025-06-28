import path from 'path';
import { ContentParser, ParsedConcept, CategoryMetadata, ConceptMetadata } from './ContentParser';

export interface ContentIndex {
  concepts: Map<string, ParsedConcept>;
  categories: Map<string, CategoryMetadata>;
  subcategories: Map<string, CategoryMetadata>;
  conceptsByCategory: Map<string, ParsedConcept[]>;
  conceptsBySubcategory: Map<string, ParsedConcept[]>;
  conceptsByLanguage: Map<string, ParsedConcept[]>;
  conceptsByFramework: Map<string, ParsedConcept[]>;
}

export interface ConceptFilter {
  languages?: string[];
  frameworks?: string[];
  project_types?: string[];
  categories?: string[];
  subcategories?: string[];
  tags?: string[];
  min_priority?: number;
  max_priority?: number;
}

export class ContentManager {
  private contentPath: string;
  private index: ContentIndex | null = null;

  constructor(contentPath: string) {
    this.contentPath = contentPath;
  }

  /**
   * Initialize the content manager by building the content index
   */
  async initialize(): Promise<void> {
    console.log('Initializing content manager...');
    
    const conceptsPath = path.join(this.contentPath, 'concepts');
    
    // Parse all concepts and categories
    const [concepts, categories] = await Promise.all([
      ContentParser.parseAllConcepts(conceptsPath),
      ContentParser.parseAllCategoryMetadata(conceptsPath)
    ]);

    console.log(`Loaded ${concepts.length} concepts and ${categories.length} categories`);

    // Build the content index
    this.index = this.buildContentIndex(concepts, categories);
    
    console.log('Content index built successfully');
  }

  /**
   * Build a comprehensive index of all content for fast lookups
   */
  private buildContentIndex(concepts: ParsedConcept[], categories: CategoryMetadata[]): ContentIndex {
    const index: ContentIndex = {
      concepts: new Map(),
      categories: new Map(),
      subcategories: new Map(),
      conceptsByCategory: new Map(),
      conceptsBySubcategory: new Map(),
      conceptsByLanguage: new Map(),
      conceptsByFramework: new Map()
    };

    // Index categories
    for (const category of categories) {
      if (category.category) {
        // This is a subcategory
        index.subcategories.set(category.id, category);
      } else {
        // This is a main category
        index.categories.set(category.id, category);
      }
    }

    // Index concepts
    for (const concept of concepts) {
      const id = concept.metadata.id;
      
      // Main concept index
      index.concepts.set(id, concept);

      // Group by category
      const categoryKey = concept.metadata.category;
      if (!index.conceptsByCategory.has(categoryKey)) {
        index.conceptsByCategory.set(categoryKey, []);
      }
      index.conceptsByCategory.get(categoryKey)!.push(concept);

      // Group by subcategory
      const subcategoryKey = concept.metadata.subcategory;
      if (!index.conceptsBySubcategory.has(subcategoryKey)) {
        index.conceptsBySubcategory.set(subcategoryKey, []);
      }
      index.conceptsBySubcategory.get(subcategoryKey)!.push(concept);

      // Group by language
      for (const language of concept.metadata.applicable_to.languages) {
        if (!index.conceptsByLanguage.has(language)) {
          index.conceptsByLanguage.set(language, []);
        }
        index.conceptsByLanguage.get(language)!.push(concept);
      }

      // Group by framework (if specified)
      if (concept.metadata.applicable_to.frameworks) {
        for (const framework of concept.metadata.applicable_to.frameworks) {
          if (!index.conceptsByFramework.has(framework)) {
            index.conceptsByFramework.set(framework, []);
          }
          index.conceptsByFramework.get(framework)!.push(concept);
        }
      }
    }

    // Sort concepts by priority and weight within each group
    const sortConcepts = (concepts: ParsedConcept[]) => {
      return concepts.sort((a, b) => {
        // First by priority (lower number = higher priority)
        if (a.metadata.priority !== b.metadata.priority) {
          return a.metadata.priority - b.metadata.priority;
        }
        // Then by weight (higher number = higher weight)
        return b.metadata.weight - a.metadata.weight;
      });
    };

    // Sort all grouped concepts
    for (const [key, concepts] of index.conceptsByCategory) {
      index.conceptsByCategory.set(key, sortConcepts(concepts));
    }
    for (const [key, concepts] of index.conceptsBySubcategory) {
      index.conceptsBySubcategory.set(key, sortConcepts(concepts));
    }
    for (const [key, concepts] of index.conceptsByLanguage) {
      index.conceptsByLanguage.set(key, sortConcepts(concepts));
    }
    for (const [key, concepts] of index.conceptsByFramework) {
      index.conceptsByFramework.set(key, sortConcepts(concepts));
    }

    return index;
  }

  /**
   * Get a concept by ID
   */
  getConcept(id: string): ParsedConcept | null {
    this.ensureInitialized();
    return this.index!.concepts.get(id) || null;
  }

  /**
   * Get all concepts
   */
  getAllConcepts(): ParsedConcept[] {
    this.ensureInitialized();
    return Array.from(this.index!.concepts.values());
  }

  /**
   * Get concepts filtered by criteria
   */
  getFilteredConcepts(filter: ConceptFilter): ParsedConcept[] {
    this.ensureInitialized();
    
    let concepts = this.getAllConcepts();

    // Filter by languages
    if (filter.languages && filter.languages.length > 0) {
      concepts = concepts.filter(concept =>
        filter.languages!.some(lang =>
          concept.metadata.applicable_to.languages.includes(lang)
        )
      );
    }

    // Filter by frameworks
    if (filter.frameworks && filter.frameworks.length > 0) {
      concepts = concepts.filter(concept =>
        concept.metadata.applicable_to.frameworks &&
        filter.frameworks!.some(framework =>
          concept.metadata.applicable_to.frameworks!.includes(framework)
        )
      );
    }

    // Filter by project types
    if (filter.project_types && filter.project_types.length > 0) {
      concepts = concepts.filter(concept =>
        concept.metadata.applicable_to.project_types &&
        filter.project_types!.some(type =>
          concept.metadata.applicable_to.project_types!.includes(type)
        )
      );
    }

    // Filter by categories
    if (filter.categories && filter.categories.length > 0) {
      concepts = concepts.filter(concept =>
        filter.categories!.includes(concept.metadata.category)
      );
    }

    // Filter by subcategories
    if (filter.subcategories && filter.subcategories.length > 0) {
      concepts = concepts.filter(concept =>
        filter.subcategories!.includes(concept.metadata.subcategory)
      );
    }

    // Filter by tags
    if (filter.tags && filter.tags.length > 0) {
      concepts = concepts.filter(concept =>
        filter.tags!.some(tag =>
          concept.metadata.tags.includes(tag)
        )
      );
    }

    // Filter by priority range
    if (filter.min_priority !== undefined) {
      concepts = concepts.filter(concept =>
        concept.metadata.priority >= filter.min_priority!
      );
    }
    if (filter.max_priority !== undefined) {
      concepts = concepts.filter(concept =>
        concept.metadata.priority <= filter.max_priority!
      );
    }

    return concepts;
  }

  /**
   * Get concepts by language
   */
  getConceptsByLanguage(language: string): ParsedConcept[] {
    this.ensureInitialized();
    return this.index!.conceptsByLanguage.get(language) || [];
  }

  /**
   * Get concepts by framework
   */
  getConceptsByFramework(framework: string): ParsedConcept[] {
    this.ensureInitialized();
    return this.index!.conceptsByFramework.get(framework) || [];
  }

  /**
   * Get concepts by category
   */
  getConceptsByCategory(category: string): ParsedConcept[] {
    this.ensureInitialized();
    return this.index!.conceptsByCategory.get(category) || [];
  }

  /**
   * Get concepts by subcategory
   */
  getConceptsBySubcategory(subcategory: string): ParsedConcept[] {
    this.ensureInitialized();
    return this.index!.conceptsBySubcategory.get(subcategory) || [];
  }

  /**
   * Get category metadata
   */
  getCategory(id: string): CategoryMetadata | null {
    this.ensureInitialized();
    return this.index!.categories.get(id) || null;
  }

  /**
   * Get subcategory metadata
   */
  getSubcategory(id: string): CategoryMetadata | null {
    this.ensureInitialized();
    return this.index!.subcategories.get(id) || null;
  }

  /**
   * Get all available languages
   */
  getAvailableLanguages(): string[] {
    this.ensureInitialized();
    return Array.from(this.index!.conceptsByLanguage.keys()).sort();
  }

  /**
   * Get all available frameworks
   */
  getAvailableFrameworks(): string[] {
    this.ensureInitialized();
    return Array.from(this.index!.conceptsByFramework.keys()).sort();
  }

  /**
   * Get all available categories
   */
  getAvailableCategories(): string[] {
    this.ensureInitialized();
    return Array.from(this.index!.categories.keys()).sort();
  }

  /**
   * Get all available subcategories
   */
  getAvailableSubcategories(): string[] {
    this.ensureInitialized();
    return Array.from(this.index!.subcategories.keys()).sort();
  }

  /**
   * Get content statistics
   */
  getStatistics() {
    this.ensureInitialized();
    
    return {
      totalConcepts: this.index!.concepts.size,
      totalCategories: this.index!.categories.size,
      totalSubcategories: this.index!.subcategories.size,
      languagesSupported: this.getAvailableLanguages().length,
      frameworksSupported: this.getAvailableFrameworks().length,
      conceptsByCategory: Object.fromEntries(
        Array.from(this.index!.conceptsByCategory.entries()).map(([key, concepts]) => [
          key,
          concepts.length
        ])
      )
    };
  }

  /**
   * Refresh the content index (reload from disk)
   */
  async refresh(): Promise<void> {
    this.index = null;
    await this.initialize();
  }

  private ensureInitialized(): void {
    if (!this.index) {
      throw new Error('ContentManager not initialized. Call initialize() first.');
    }
  }
}
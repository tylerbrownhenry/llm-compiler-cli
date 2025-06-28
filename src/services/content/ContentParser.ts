import { promises as fs } from 'fs';
import path from 'path';
import yaml from 'yaml';

export interface ConceptMetadata {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  priority: number;
  dependencies: string[];
  conflicts: string[];
  applicable_to: {
    languages: string[];
    frameworks?: string[];
    project_types?: string[];
  };
  triggers?: Record<string, any>;
  weight: number;
  description: string;
  tags: string[];
  version: string;
  author: string;
  created: string;
  updated: string;
}

export interface ParsedConcept {
  metadata: ConceptMetadata;
  content: string;
  filePath: string;
}

export interface CategoryMetadata {
  id: string;
  name: string;
  category?: string;
  description: string;
  priority: number;
  subcategories?: string[];
  concepts?: string[];
  applicable_to: {
    languages: string[];
    project_types: string[];
  };
  tags: string[];
  version: string;
  created: string;
  updated: string;
}

export class ContentParser {
  private static readonly FRONTMATTER_SEPARATOR = '---';

  /**
   * Parse a concept markdown file with YAML frontmatter
   */
  static async parseConcept(filePath: string): Promise<ParsedConcept> {
    const content = await fs.readFile(filePath, 'utf-8');
    const { metadata, content: markdownContent } = this.extractFrontmatter<ConceptMetadata>(content);
    
    this.validateConceptMetadata(metadata, filePath);
    
    return {
      metadata,
      content: markdownContent,
      filePath
    };
  }

  /**
   * Parse a category/subcategory metadata JSON file
   */
  static async parseCategoryMetadata(filePath: string): Promise<CategoryMetadata> {
    const content = await fs.readFile(filePath, 'utf-8');
    const metadata = JSON.parse(content) as CategoryMetadata;
    
    this.validateCategoryMetadata(metadata, filePath);
    
    return metadata;
  }

  /**
   * Extract YAML frontmatter from markdown content
   */
  private static extractFrontmatter<T>(content: string): { metadata: T; content: string } {
    const lines = content.split('\n');
    
    if (lines[0] !== this.FRONTMATTER_SEPARATOR) {
      throw new Error('Content must start with YAML frontmatter (---)');
    }

    const frontmatterEnd = lines.findIndex((line, index) => 
      index > 0 && line === this.FRONTMATTER_SEPARATOR
    );

    if (frontmatterEnd === -1) {
      throw new Error('Frontmatter must be closed with --- separator');
    }

    const frontmatterLines = lines.slice(1, frontmatterEnd);
    const contentLines = lines.slice(frontmatterEnd + 1);

    try {
      const metadata = yaml.parse(frontmatterLines.join('\n')) as T;
      const content = contentLines.join('\n').trim();
      
      return { metadata, content };
    } catch (error) {
      throw new Error(`Failed to parse YAML frontmatter: ${error}`);
    }
  }

  /**
   * Validate concept metadata structure
   */
  private static validateConceptMetadata(metadata: ConceptMetadata, filePath: string): void {
    const required = [
      'id', 'name', 'category', 'subcategory', 'priority', 
      'applicable_to', 'weight', 'description', 'version'
    ];

    for (const field of required) {
      if (!(field in metadata)) {
        throw new Error(`Missing required field '${field}' in concept metadata: ${filePath}`);
      }
    }

    if (!metadata.applicable_to.languages || metadata.applicable_to.languages.length === 0) {
      throw new Error(`Concept must specify applicable languages: ${filePath}`);
    }

    if (typeof metadata.priority !== 'number' || metadata.priority < 1) {
      throw new Error(`Priority must be a positive number: ${filePath}`);
    }

    if (typeof metadata.weight !== 'number' || metadata.weight < 1) {
      throw new Error(`Weight must be a positive number: ${filePath}`);
    }

    if (!Array.isArray(metadata.dependencies)) {
      throw new Error(`Dependencies must be an array: ${filePath}`);
    }

    if (!Array.isArray(metadata.conflicts)) {
      throw new Error(`Conflicts must be an array: ${filePath}`);
    }

    if (!Array.isArray(metadata.tags)) {
      throw new Error(`Tags must be an array: ${filePath}`);
    }
  }

  /**
   * Validate category metadata structure
   */
  private static validateCategoryMetadata(metadata: CategoryMetadata, filePath: string): void {
    const required = ['id', 'name', 'description', 'priority', 'applicable_to', 'version'];

    for (const field of required) {
      if (!(field in metadata)) {
        throw new Error(`Missing required field '${field}' in category metadata: ${filePath}`);
      }
    }

    if (!metadata.applicable_to.languages || metadata.applicable_to.languages.length === 0) {
      throw new Error(`Category must specify applicable languages: ${filePath}`);
    }

    if (typeof metadata.priority !== 'number' || metadata.priority < 1) {
      throw new Error(`Priority must be a positive number: ${filePath}`);
    }
  }

  /**
   * Get all concept files from a directory
   */
  static async getConceptFiles(conceptsDir: string): Promise<string[]> {
    const files: string[] = [];
    
    async function scanDirectory(dir: string): Promise<void> {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory()) {
          await scanDirectory(fullPath);
        } else if (entry.isFile() && entry.name.endsWith('.md') && entry.name !== 'README.md') {
          files.push(fullPath);
        }
      }
    }
    
    await scanDirectory(conceptsDir);
    return files;
  }

  /**
   * Get all metadata files from a directory
   */
  static async getMetadataFiles(conceptsDir: string): Promise<string[]> {
    const files: string[] = [];
    
    async function scanDirectory(dir: string): Promise<void> {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory()) {
          await scanDirectory(fullPath);
        } else if (entry.isFile() && entry.name === 'meta.json') {
          files.push(fullPath);
        }
      }
    }
    
    await scanDirectory(conceptsDir);
    return files;
  }

  /**
   * Parse all concepts from a directory
   */
  static async parseAllConcepts(conceptsDir: string): Promise<ParsedConcept[]> {
    const conceptFiles = await this.getConceptFiles(conceptsDir);
    const concepts: ParsedConcept[] = [];

    for (const filePath of conceptFiles) {
      try {
        const concept = await this.parseConcept(filePath);
        concepts.push(concept);
      } catch (error) {
        console.warn(`Failed to parse concept file ${filePath}: ${error}`);
      }
    }

    return concepts;
  }

  /**
   * Parse all category metadata from a directory
   */
  static async parseAllCategoryMetadata(conceptsDir: string): Promise<CategoryMetadata[]> {
    const metadataFiles = await this.getMetadataFiles(conceptsDir);
    const categories: CategoryMetadata[] = [];

    for (const filePath of metadataFiles) {
      try {
        const category = await this.parseCategoryMetadata(filePath);
        categories.push(category);
      } catch (error) {
        console.warn(`Failed to parse category metadata ${filePath}: ${error}`);
      }
    }

    return categories;
  }
}
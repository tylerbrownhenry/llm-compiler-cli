import { promises as fs } from 'fs';
import path from 'path';
import { ProjectConfig } from '../../../core/types.js';
import { ContentSection } from '../types/ContentTypes.js';
import { getApplicableContent } from '../mapping/content-mapping.js';

export class ContentLoader {
  private contentPath: string;
  private contentCache: Map<string, string> = new Map();

  constructor(contentPath?: string) {
    this.contentPath = contentPath || path.join(process.cwd(), 'src/resources/content');
  }

  async loadContentForConfig(config: ProjectConfig): Promise<ContentSection[]> {
    const applicableRules = getApplicableContent(config);
    const sections: ContentSection[] = [];

    for (const rule of applicableRules) {
      try {
        const content = await this.loadContentFile(rule.contentPath);
        const processedContent = this.processContentVariables(content, config);
        
        sections.push({
          id: this.getContentId(rule.contentPath),
          section: rule.section,
          content: processedContent,
          priority: rule.priority
        });
      } catch (error) {
        // Skip files that fail to load
      }
    }

    return sections.sort((a, b) => a.priority - b.priority);
  }

  private async loadContentFile(contentPath: string): Promise<string> {
    if (this.contentCache.has(contentPath)) {
      return this.contentCache.get(contentPath)!;
    }

    const fullPath = path.join(this.contentPath, contentPath);
    const content = await fs.readFile(fullPath, 'utf-8');
    
    this.contentCache.set(contentPath, content);
    return content;
  }

  private processContentVariables(content: string, config: ProjectConfig): string {
    // Simple template variable replacement
    let processed = content;
    
    // Replace testing frameworks
    if (config.tools.testing.length > 0) {
      processed = processed.replace('{{testing_frameworks}}', config.tools.testing.join(' and '));
    }
    
    // Replace conditional blocks
    if (config.philosophy.tdd) {
      processed = processed.replace(/{{#if tdd}}([\s\S]*?){{\/if}}/g, '$1');
    } else {
      processed = processed.replace(/{{#if tdd}}([\s\S]*?){{\/if}}/g, '');
    }
    
    return processed;
  }

  private getContentId(contentPath: string): string {
    return contentPath
      .replace(/^categories\//, '')
      .replace(/\.md$/, '')
      .replace(/\//g, '-');
  }

  async loadTemplate(format: string): Promise<string> {
    const templatePath = path.join(this.contentPath, 'formats', `${format}-template.md`);
    try {
      return await fs.readFile(templatePath, 'utf-8');
    } catch (error) {
      // Return default template if specific template not found
      return this.getDefaultTemplate(format);
    }
  }

  private getDefaultTemplate(format: string): string {
    switch (format) {
      case 'claude':
        return `# Development Guidelines for {{projectName}}

{{sections}}

Generated on {{date}} for {{projectType}} project`;
      
      case 'readme':
        return `# {{projectName}}

> Generated development guidelines and project setup

{{sections}}

Generated on {{date}}`;
      
      default:
        return '{{sections}}';
    }
  }

  clearCache(): void {
    this.contentCache.clear();
  }
}
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { ProjectConfig, GeneratedOutput, ConceptTemplate } from '../types';
import { getApplicableConcepts } from '../concept-mapper/concept-rules';

export class TemplateEngine {
  private conceptsPath: string;
  private templatesCache: Map<string, ConceptTemplate> = new Map();

  constructor(conceptsPath?: string) {
    this.conceptsPath = conceptsPath || path.join(__dirname, '../../../concepts');
  }

  async generateInstructions(config: ProjectConfig): Promise<GeneratedOutput> {
    const applicableConcepts = getApplicableConcepts(config);
    const conceptTemplates = await this.loadConceptTemplates(applicableConcepts);
    
    const outputs: Partial<GeneratedOutput> = {};

    // Generate each format if requested
    if (this.shouldGenerate('claude', config.output.formats)) {
      outputs.claude = await this.generateClaudeInstructions(config, conceptTemplates);
    }

    if (this.shouldGenerate('vscode', config.output.formats)) {
      outputs.vscode = await this.generateVSCodeSettings(config, conceptTemplates);
    }

    if (this.shouldGenerate('readme', config.output.formats)) {
      outputs.readme = await this.generateReadme(config, conceptTemplates);
    }

    if (this.shouldGenerate('cursor', config.output.formats)) {
      outputs.cursor = await this.generateCursorRules(config, conceptTemplates);
    }

    return {
      ...outputs,
      metadata: {
        conceptsUsed: applicableConcepts,
        generatedAt: new Date(),
        config,
      },
    } as GeneratedOutput;
  }

  private shouldGenerate(format: string, requestedFormats: string[]): boolean {
    // If no formats specified, generate claude and readme by default
    if (requestedFormats.length === 0) {
      return format === 'claude' || format === 'readme';
    }
    return requestedFormats.includes(format) || requestedFormats.includes('all');
  }

  private async loadConceptTemplates(conceptIds: string[]): Promise<ConceptTemplate[]> {
    const templates: ConceptTemplate[] = [];

    for (const conceptId of conceptIds) {
      if (this.templatesCache.has(conceptId)) {
        templates.push(this.templatesCache.get(conceptId)!);
        continue;
      }

      try {
        const template = await this.loadConceptTemplate(conceptId);
        if (template) {
          this.templatesCache.set(conceptId, template);
          templates.push(template);
        }
      } catch (error) {
        console.warn(`Failed to load template for concept: ${conceptId}`, error);
      }
    }

    return templates;
  }

  private async loadConceptTemplate(conceptId: string): Promise<ConceptTemplate | null> {
    // Map concept IDs to file paths
    const conceptToFile = this.getConceptFilePath(conceptId);
    
    if (!conceptToFile) {
      return null;
    }

    try {
      const content = await fs.readFile(conceptToFile.filePath, 'utf-8');
      
      return {
        id: conceptId,
        name: this.formatConceptName(conceptId),
        category: conceptToFile.category.toLowerCase() as 'craft' | 'process' | 'product',
        subcategory: conceptToFile.subcategory,
        content,
        dependencies: [],
        conflicts: [],
        priority: 1,
      };
    } catch (error) {
      console.warn(`Template file not found: ${conceptToFile.filePath}`);
      return null;
    }
  }

  private getConceptFilePath(conceptId: string): { filePath: string; category: string; subcategory: string } | null {
    // Map concept IDs to their file locations
    const conceptMappings: Record<string, { category: string; subcategory: string; fileName: string }> = {
      // CRAFT - Testing & Quality
      'tdd': { category: 'CRAFT', subcategory: 'testing-and-quality', fileName: 'TDD.md' },
      'testing-principles': { category: 'CRAFT', subcategory: 'testing-and-quality', fileName: 'TESTING_PRINCIPLES.md' },
      'code-style': { category: 'CRAFT', subcategory: 'testing-and-quality', fileName: 'CODE_STYLE.md' },
      'code-review': { category: 'CRAFT', subcategory: 'testing-and-quality', fileName: 'CODE_REVIEW.md' },
      'exception-handling': { category: 'CRAFT', subcategory: 'testing-and-quality', fileName: 'EXCEPTION_HANDLING.md' },
      'core-philosophy': { category: 'CRAFT', subcategory: 'testing-and-quality', fileName: 'CORE_PHILOSOPHY.md' },
      'quick-reference': { category: 'CRAFT', subcategory: 'testing-and-quality', fileName: 'QUICK_REFERENCE.md' },
      'example-patterns': { category: 'CRAFT', subcategory: 'testing-and-quality', fileName: 'EXAMPLE_PATTERNS.md' },
      'common-patterns-to-avoid': { category: 'CRAFT', subcategory: 'testing-and-quality', fileName: 'COMMON_PATTERNS_TO_AVOID.md' },

      // CRAFT - TypeScript & Type Safety
      'typescript-standards': { category: 'CRAFT', subcategory: 'typescript-and-type-safety', fileName: 'TYPESCRIPT_STANDARDS.md' },
      'typescript-guidelines': { category: 'CRAFT', subcategory: 'typescript-and-type-safety', fileName: 'TYPESCRIPT_GUIDELINES.md' },

      // CRAFT - Code Architecture & Design
      'atomic-design': { category: 'CRAFT', subcategory: 'code-architecture-and-design', fileName: 'ATOMIC_DESIGN.md' },
      'architecture-enforcement': { category: 'CRAFT', subcategory: 'code-architecture-and-design', fileName: 'ARCHITECTURE_ENFORCEMENT.md' },
      'feature-folder-structure': { category: 'CRAFT', subcategory: 'code-architecture-and-design', fileName: 'FEATURE_FOLDER_STRUCTURE.md' },
      'reusability': { category: 'CRAFT', subcategory: 'code-architecture-and-design', fileName: 'REUSABILITY.md' },
      'dependency-injection': { category: 'CRAFT', subcategory: 'code-architecture-and-design', fileName: 'DEPENDENCY_INJECTION.md' },
      'dry-principles': { category: 'CRAFT', subcategory: 'code-architecture-and-design', fileName: 'DRY_PRINCIPLES.md' },
      'architecture-reviews': { category: 'CRAFT', subcategory: 'code-architecture-and-design', fileName: 'ARCHITECTURE_REVIEWS.md' },

      // PROCESS - Development Workflow
      'development-workflow': { category: 'PROCESS', subcategory: 'development-workflow', fileName: 'DEVELOPMENT_WORKFLOW.md' },
      'version-control': { category: 'PROCESS', subcategory: 'development-workflow', fileName: 'VERSION_CONTROL.md' },
      'ci-cd': { category: 'PROCESS', subcategory: 'development-workflow', fileName: 'CI_CD.md' },

      // PROCESS - System Architecture & Infrastructure
      'configuration-separation': { category: 'PROCESS', subcategory: 'system-architecture-and-infrastructure', fileName: 'CONFIGURATION_SEPARATION.md' },
      'state-management': { category: 'PROCESS', subcategory: 'system-architecture-and-infrastructure', fileName: 'STATE_MANAGEMENT.md' },
      'api-integration': { category: 'PROCESS', subcategory: 'system-architecture-and-infrastructure', fileName: 'API_INTEGRATION.md' },
      'security': { category: 'PROCESS', subcategory: 'system-architecture-and-infrastructure', fileName: 'SECURITY.md' },
      'performance': { category: 'PROCESS', subcategory: 'system-architecture-and-infrastructure', fileName: 'PERFORMANCE.md' },
      'logging-monitoring': { category: 'PROCESS', subcategory: 'system-architecture-and-infrastructure', fileName: 'LOGGING_MONITORING.md' },

      // PROCESS - Documentation & Communication
      'documentation': { category: 'PROCESS', subcategory: 'documentation-and-communication', fileName: 'DOCUMENTATION.md' },
      'working-with-claude': { category: 'PROCESS', subcategory: 'documentation-and-communication', fileName: 'WORKING_WITH_CLAUDE.md' },
      'resources-and-references': { category: 'PROCESS', subcategory: 'documentation-and-communication', fileName: 'RESOURCES_AND_REFERENCES.md' },

      // PRODUCT - User Experience & Interface
      'design-system': { category: 'PRODUCT', subcategory: 'user-experience-and-interface', fileName: 'DESIGN_SYSTEM.md' },
      'responsive-design': { category: 'PRODUCT', subcategory: 'user-experience-and-interface', fileName: 'RESPONSIVE_DESIGN.md' },
      'accessibility': { category: 'PRODUCT', subcategory: 'user-experience-and-interface', fileName: 'ACCESSIBILITY.md' },
      'i18n': { category: 'PRODUCT', subcategory: 'user-experience-and-interface', fileName: 'I18N.md' },
      'naming-conventions': { category: 'PRODUCT', subcategory: 'user-experience-and-interface', fileName: 'NAMING_CONVENTIONS.md' },
    };

    const mapping = conceptMappings[conceptId];
    if (!mapping) {
      return null;
    }

    const filePath = path.join(this.conceptsPath, mapping.category, mapping.subcategory, mapping.fileName);
    
    return {
      filePath,
      category: mapping.category.toLowerCase(),
      subcategory: mapping.subcategory,
    };
  }

  private async generateClaudeInstructions(config: ProjectConfig, templates: ConceptTemplate[]): Promise<string> {
    const sections: string[] = [];

    // Header
    sections.push(`# Development Guidelines for ${config.output.projectName}`);
    sections.push('');

    // Core Philosophy (if TDD is enabled, always include this)
    if (config.philosophy.tdd) {
      const corePhilosophy = templates.find(t => t.id === 'core-philosophy');
      if (corePhilosophy) {
        sections.push(corePhilosophy.content);
        sections.push('');
      }
    }

    // Quick Reference
    const quickRef = templates.find(t => t.id === 'quick-reference');
    if (quickRef) {
      sections.push(quickRef.content);
      sections.push('');
    }

    // Add all concept templates organized by category
    const categorizedTemplates = this.categorizeTemplates(templates);

    if (categorizedTemplates.craft.length > 0) {
      sections.push('## Code Quality & Technical Excellence (CRAFT)');
      sections.push('');
      categorizedTemplates.craft.forEach(template => {
        sections.push(template.content);
        sections.push('');
      });
    }

    if (categorizedTemplates.process.length > 0) {
      sections.push('## Development Workflow & Delivery (PROCESS)');
      sections.push('');
      categorizedTemplates.process.forEach(template => {
        sections.push(template.content);
        sections.push('');
      });
    }

    if (categorizedTemplates.product.length > 0) {
      sections.push('## User-Facing Outcomes (PRODUCT)');
      sections.push('');
      categorizedTemplates.product.forEach(template => {
        sections.push(template.content);
        sections.push('');
      });
    }

    // Footer
    sections.push(`Generated on ${new Date().toLocaleDateString()} for ${config.projectType} project`);

    return sections.join('\n');
  }

  private async generateVSCodeSettings(config: ProjectConfig, _templates: ConceptTemplate[]): Promise<string> {
    const settings: Record<string, any> = {
      'editor.formatOnSave': true,
      'editor.codeActionsOnSave': {
        'source.fixAll': true,
      },
    };

    const extensions: string[] = [];

    // TypeScript specific settings
    if (config.projectType === 'typescript') {
      settings['typescript.preferences.includePackageJsonAutoImports'] = 'auto';
      settings['typescript.preferences.noSemicolons'] = false;
      extensions.push('ms-vscode.vscode-typescript-next');
    }

    // ESLint settings
    if (config.tools.eslint) {
      settings['eslint.validate'] = ['typescript', 'typescriptreact', 'javascript', 'javascriptreact'];
      extensions.push('dbaeumer.vscode-eslint');
    }

    // Testing extensions
    if (config.tools.testing.includes('vitest')) {
      extensions.push('zixuanchen.vitest-explorer');
    }
    if (config.tools.testing.includes('jest')) {
      extensions.push('orta.vscode-jest');
    }

    // UI Framework extensions
    if (config.tools.uiFramework === 'react') {
      extensions.push('burkeholland.simple-react-snippets');
    }

    const vscodeConfig = {
      settings,
      extensions: {
        recommendations: extensions,
      },
    };

    return JSON.stringify(vscodeConfig, null, 2);
  }

  private async generateReadme(config: ProjectConfig, _templates: ConceptTemplate[]): Promise<string> {
    const sections: string[] = [];

    sections.push(`# ${config.output.projectName}`);
    sections.push('');
    sections.push('> Generated development guidelines and project setup');
    sections.push('');

    sections.push('## 🚀 Quick Start');
    sections.push('');
    sections.push('### Prerequisites');
    sections.push('- Node.js 18+');
    if (config.projectType === 'typescript') {
      sections.push('- TypeScript');
    }
    sections.push('');

    sections.push('### Installation');
    sections.push('```bash');
    sections.push('npm install');
    sections.push('```');
    sections.push('');

    sections.push('### Development');
    sections.push('```bash');
    sections.push('npm run dev');
    sections.push('```');
    sections.push('');

    if (config.philosophy.tdd) {
      sections.push('## 🧪 Testing');
      sections.push('');
      sections.push('This project follows **Test-Driven Development (TDD)**.');
      sections.push('');
      sections.push('```bash');
      sections.push('npm test');
      sections.push('npm run test:watch');
      sections.push('```');
      sections.push('');
    }

    sections.push('## 📋 Development Guidelines');
    sections.push('');
    sections.push('This project follows structured development guidelines:');
    sections.push('');

    if (config.philosophy.tdd) {
      sections.push('- **Test-Driven Development**: Write tests before implementation');
    }
    if (config.philosophy.strictArchitecture) {
      sections.push('- **Strict Architecture**: Enforced architectural boundaries');
    }
    if (config.philosophy.functionalProgramming) {
      sections.push('- **Functional Programming**: Immutable data and pure functions');
    }
    if (config.tools.eslint) {
      sections.push('- **Code Quality**: ESLint for consistent code style');
    }
    if (config.quality.accessibility) {
      sections.push('- **Accessibility**: WCAG compliance required');
    }

    sections.push('');

    sections.push('## 🛠 Technology Stack');
    sections.push('');
    sections.push(`- **Language**: ${config.projectType}`);
    if (config.tools.testing.length > 0) {
      sections.push(`- **Testing**: ${config.tools.testing.join(', ')}`);
    }
    if (config.tools.uiFramework) {
      sections.push(`- **UI Framework**: ${config.tools.uiFramework}`);
    }
    if (config.tools.stateManagement) {
      sections.push(`- **State Management**: ${config.tools.stateManagement}`);
    }
    sections.push('');

    sections.push('## 📚 Documentation');
    sections.push('');
    sections.push('- See `CLAUDE.md` for detailed AI assistant instructions');
    if (config.output.formats.includes('vscode')) {
      sections.push('- Import `.vscode/settings.json` for IDE configuration');
    }
    sections.push('');

    sections.push(`Generated on ${new Date().toLocaleDateString()}`);

    return sections.join('\n');
  }

  private async generateCursorRules(config: ProjectConfig, _templates: ConceptTemplate[]): Promise<string> {
    const sections: string[] = [];

    sections.push(`# Cursor Rules for ${config.output.projectName}`);
    sections.push('');

    sections.push('## Project Configuration');
    sections.push(`- Language: ${config.projectType}`);
    sections.push(`- TDD: ${config.philosophy.tdd ? 'Required' : 'Optional'}`);
    sections.push(`- Architecture: ${config.philosophy.strictArchitecture ? 'Strict' : 'Flexible'}`);
    sections.push('');

    sections.push('## Core Principles');
    if (config.philosophy.tdd) {
      sections.push('- Always write tests before implementation');
    }
    if (config.philosophy.functionalProgramming) {
      sections.push('- Prefer functional programming patterns');
      sections.push('- Use immutable data structures');
    }
    if (config.projectType === 'typescript') {
      sections.push('- Use TypeScript strict mode');
      sections.push('- Never use `any` type');
    }
    sections.push('');

    sections.push('## Code Style');
    if (config.tools.eslint) {
      sections.push('- Follow ESLint rules');
    }
    if (config.philosophy.strictArchitecture) {
      sections.push('- Maintain architectural boundaries');
    }
    sections.push('- Use descriptive variable and function names');
    sections.push('- Keep functions small and focused');
    sections.push('');

    if (config.tools.testing.length > 0) {
      sections.push('## Testing Guidelines');
      sections.push(`- Use ${config.tools.testing.join(' and ')} for testing`);
      if (config.philosophy.tdd) {
        sections.push('- Follow Red-Green-Refactor cycle');
        sections.push('- Test behavior, not implementation');
      }
      sections.push('');
    }

    if (config.quality.accessibility) {
      sections.push('## Accessibility');
      sections.push('- Follow WCAG guidelines');
      sections.push('- Include alt text for images');
      sections.push('- Ensure keyboard navigation');
      sections.push('');
    }

    sections.push(`Generated on ${new Date().toLocaleDateString()}`);

    return sections.join('\n');
  }

  private categorizeTemplates(templates: ConceptTemplate[]): {
    craft: ConceptTemplate[];
    process: ConceptTemplate[];
    product: ConceptTemplate[];
  } {
    return {
      craft: templates.filter(t => t.category === 'craft'),
      process: templates.filter(t => t.category === 'process'),
      product: templates.filter(t => t.category === 'product'),
    };
  }

  private formatConceptName(conceptId: string): string {
    return conceptId
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}
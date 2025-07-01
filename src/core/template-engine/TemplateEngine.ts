import { ProjectConfig, GeneratedOutput } from '../types.js';
import { ContentLoader } from '../../resources/content/loaders/ContentLoader.js';

export class TemplateEngine {
  private contentLoader: ContentLoader;

  constructor() {
    this.contentLoader = new ContentLoader();
  }

  async generateInstructions(config: ProjectConfig): Promise<GeneratedOutput> {
    const outputs: Partial<GeneratedOutput> = {};

    // Load content sections based on config
    const contentSections = await this.contentLoader.loadContentForConfig(config);

    // Generate each format if requested
    if (this.shouldGenerate('claude', config.output.formats)) {
      outputs.claude = await this.generateClaudeInstructions(config, contentSections);
    }

    if (this.shouldGenerate('vscode', config.output.formats)) {
      outputs.vscode = await this.generateVSCodeSettings(config);
    }

    if (this.shouldGenerate('readme', config.output.formats)) {
      outputs.readme = await this.generateReadme(config, contentSections);
    }

    if (this.shouldGenerate('cursor', config.output.formats)) {
      outputs.cursor = await this.generateCursorRules(config, contentSections);
    }

    if (this.shouldGenerate('copilot', config.output.formats)) {
      outputs.copilot = await this.generateCopilotInstructions(config, contentSections);
    }

    if (this.shouldGenerate('roocode', config.output.formats)) {
      outputs.roocode = await this.generateRooCodeInstructions(config, contentSections);
    }

    return {
      ...outputs,
      metadata: {
        conceptsUsed: contentSections.map(s => s.id),
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

  private async generateClaudeInstructions(config: ProjectConfig, contentSections: any[]): Promise<string> {
    const sections: string[] = [];

    // Header
    sections.push(`# Development Guidelines for ${config.output.projectName}`);
    sections.push('');

    // Group content by section
    const groupedContent = this.groupContentBySection(contentSections);

    // Add content sections in logical order
    const sectionOrder = ['philosophy', 'language', 'tools', 'quality', 'infrastructure'];
    
    for (const sectionName of sectionOrder) {
      const sectionContent = groupedContent[sectionName];
      if (sectionContent && sectionContent.length > 0) {
        sections.push(`## ${this.getSectionTitle(sectionName)}`);
        sections.push('');
        
        for (const content of sectionContent) {
          sections.push(content.content);
          sections.push('');
        }
      }
    }

    // Footer
    sections.push(`Generated on ${new Date().toLocaleDateString()} for ${config.projectType} project`);

    return sections.join('\n');
  }

  private async generateReadme(config: ProjectConfig, contentSections: any[]): Promise<string> {
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

    // Add guidelines based on loaded content
    const guidelines = this.extractGuidelinesFromContent(contentSections, config);
    guidelines.forEach(guideline => {
      sections.push(`- ${guideline}`);
    });

    sections.push('');

    sections.push('## 🛠 Technology Stack');
    sections.push('');
    sections.push(`- **Language**: ${config.projectType}`);
    if (config.tools.testing.length > 0) {
      sections.push(`- **Testing**: ${config.tools.testing.join(', ')}`);
    }
    if (config.tools.uiFramework && config.tools.uiFramework !== 'none') {
      sections.push(`- **UI Framework**: ${config.tools.uiFramework}`);
    }
    if (config.tools.stateManagement && config.tools.stateManagement !== 'none') {
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

  private async generateCursorRules(config: ProjectConfig, contentSections: any[]): Promise<string> {
    const sections: string[] = [];

    sections.push(`# Cursor Rules for ${config.output.projectName}`);
    sections.push('');

    sections.push('## Project Configuration');
    sections.push(`- Language: ${config.projectType}`);
    sections.push(`- TDD: ${config.philosophy.tdd ? 'Required' : 'Optional'}`);
    sections.push(`- Architecture: ${config.philosophy.strictArchitecture ? 'Strict' : 'Flexible'}`);
    sections.push('');

    // Add core principles from content
    sections.push('## Core Principles');
    const principles = this.extractPrinciplesFromContent(contentSections);
    principles.forEach(principle => {
      sections.push(`- ${principle}`);
    });
    sections.push('');

    sections.push(`Generated on ${new Date().toLocaleDateString()}`);

    return sections.join('\n');
  }

  private async generateCopilotInstructions(config: ProjectConfig, contentSections: any[]): Promise<string> {
    const sections: string[] = [];

    sections.push(`# GitHub Copilot Instructions for ${config.output.projectName}`);
    sections.push('');
    sections.push('This file provides specific instructions for GitHub Copilot to follow when working on this project.');
    sections.push('');

    sections.push('## Project Context');
    sections.push(`- **Language**: ${config.projectType}`);
    sections.push(`- **Architecture**: ${config.philosophy.strictArchitecture ? 'Strict' : 'Flexible'}`);
    sections.push(`- **Testing Approach**: ${config.philosophy.tdd ? 'Test-Driven Development' : 'Standard Testing'}`);
    sections.push('');

    sections.push('## Code Generation Guidelines');
    sections.push('');

    // Add content-based guidelines
    const groupedContent = this.groupContentBySection(contentSections);
    for (const [sectionName, sectionContent] of Object.entries(groupedContent)) {
      if (sectionContent.length > 0) {
        sections.push(`### ${this.getSectionTitle(sectionName)}`);
        sectionContent.forEach((content: any) => {
          sections.push(content.content);
        });
        sections.push('');
      }
    }

    sections.push(`Generated on ${new Date().toLocaleDateString()}`);

    return sections.join('\n');
  }

  private async generateRooCodeInstructions(config: ProjectConfig, contentSections: any[]): Promise<string> {
    const sections: string[] = [];

    sections.push(`# Roo Code Instructions for ${config.output.projectName}`);
    sections.push('');
    sections.push('## Project Configuration');
    sections.push('```yaml');
    sections.push(`project:`);
    sections.push(`  name: "${config.output.projectName}"`);
    sections.push(`  type: ${config.projectType}`);
    sections.push(`  tdd: ${config.philosophy.tdd}`);
    sections.push(`  strict_architecture: ${config.philosophy.strictArchitecture}`);
    sections.push(`  functional_programming: ${config.philosophy.functionalProgramming}`);
    sections.push('```');
    sections.push('');

    sections.push('## Generation Rules');
    sections.push('');

    // Add content-based rules
    const groupedContent = this.groupContentBySection(contentSections);
    for (const [sectionName, sectionContent] of Object.entries(groupedContent)) {
      if (sectionContent.length > 0) {
        sections.push(`### ${this.getSectionTitle(sectionName)} Rules`);
        sectionContent.forEach((content: any) => {
          // Convert content to rule format
          const rules = this.convertContentToRules(content.content);
          rules.forEach(rule => sections.push(`- ${rule}`));
        });
        sections.push('');
      }
    }

    sections.push(`# Generated on ${new Date().toLocaleDateString()}`);

    return sections.join('\n');
  }

  private async generateVSCodeSettings(config: ProjectConfig): Promise<string> {
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

  // Helper methods
  private groupContentBySection(contentSections: any[]): Record<string, any[]> {
    const grouped: Record<string, any[]> = {};
    
    for (const section of contentSections) {
      if (!grouped[section.section]) {
        grouped[section.section] = [];
      }
      grouped[section.section].push(section);
    }
    
    return grouped;
  }

  private getSectionTitle(sectionName: string): string {
    const titles: Record<string, string> = {
      philosophy: 'Development Philosophy',
      language: 'Language-Specific Guidelines',
      tools: 'Development Tools & Quality',
      quality: 'Quality Assurance',
      infrastructure: 'Infrastructure & Operations'
    };
    
    return titles[sectionName] || sectionName.charAt(0).toUpperCase() + sectionName.slice(1);
  }

  private extractGuidelinesFromContent(_contentSections: any[], config: ProjectConfig): string[] {
    const guidelines: string[] = [];
    
    if (config.philosophy.tdd) {
      guidelines.push('**Test-Driven Development**: Write tests before implementation');
    }
    if (config.philosophy.strictArchitecture) {
      guidelines.push('**Strict Architecture**: Enforced architectural boundaries');
    }
    if (config.philosophy.functionalProgramming) {
      guidelines.push('**Functional Programming**: Immutable data and pure functions');
    }
    if (config.tools.eslint) {
      guidelines.push('**Code Quality**: ESLint for consistent code style');
    }
    if (config.quality.accessibility) {
      guidelines.push('**Accessibility**: WCAG compliance required');
    }
    
    return guidelines;
  }

  private extractPrinciplesFromContent(contentSections: any[]): string[] {
    const principles: string[] = [];
    
    // Extract principles from content sections
    for (const section of contentSections) {
      const lines = section.content.split('\n');
      for (const line of lines) {
        if (line.trim().startsWith('- ') && !line.includes('##')) {
          principles.push(line.trim().substring(2));
        }
      }
    }
    
    return principles.slice(0, 10); // Limit to 10 principles
  }

  private convertContentToRules(content: string): string[] {
    const rules: string[] = [];
    const lines = content.split('\n');
    
    for (const line of lines) {
      if (line.trim().startsWith('- ')) {
        // Convert guideline to rule format
        let rule = line.trim().substring(2);
        if (!rule.toLowerCase().includes('generate') && !rule.toLowerCase().includes('ensure')) {
          rule = `Generate code that ${rule.toLowerCase()}`;
        }
        rules.push(rule);
      }
    }
    
    return rules;
  }
}
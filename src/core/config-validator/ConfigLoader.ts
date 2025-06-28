import { promises as fs } from 'fs';
import path from 'path';
import yaml from 'yaml';
import { ProjectConfig, ProjectConfigSchema } from '../types';

export interface ConfigValidationError {
  field: string;
  message: string;
  value?: any;
}

export interface ConfigLoadResult {
  success: boolean;
  config?: ProjectConfig;
  errors?: ConfigValidationError[];
  warnings?: string[];
}

export class ConfigLoader {
  static async loadFromFile(configPath: string): Promise<ConfigLoadResult> {
    try {
      // Check if file exists
      await fs.access(configPath);
      
      // Read file content
      const content = await fs.readFile(configPath, 'utf-8');
      
      // Parse based on file extension
      const ext = path.extname(configPath).toLowerCase();
      let rawConfig: any;

      switch (ext) {
        case '.json':
          rawConfig = JSON.parse(content);
          break;
        case '.yaml':
        case '.yml':
          rawConfig = yaml.parse(content);
          break;
        default:
          return {
            success: false,
            errors: [{ field: 'file', message: `Unsupported config file format: ${ext}` }],
          };
      }

      // Validate and transform config
      return this.validateConfig(rawConfig);
    } catch (error) {
      if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
        return {
          success: false,
          errors: [{ field: 'file', message: `Config file not found: ${configPath}` }],
        };
      }

      return {
        success: false,
        errors: [{ field: 'file', message: `Failed to load config: ${error instanceof Error ? error.message : 'Unknown error'}` }],
      };
    }
  }

  static validateConfig(rawConfig: any): ConfigLoadResult {
    try {
      // Use Zod schema to validate and transform
      const validatedConfig = ProjectConfigSchema.parse(rawConfig);
      
      const warnings: string[] = [];
      
      // Add validation warnings
      if (validatedConfig.tools.testing.length === 0 && validatedConfig.philosophy.tdd) {
        warnings.push('TDD is enabled but no testing frameworks are selected');
      }

      if (validatedConfig.tools.uiFramework && !validatedConfig.tools.stateManagement) {
        warnings.push('UI framework selected but no state management solution specified');
      }

      if (validatedConfig.output.formats.includes('all') && validatedConfig.output.formats.length > 1) {
        warnings.push('Output format "all" selected along with specific formats - "all" will be used');
      }

      return {
        success: true,
        config: validatedConfig,
        warnings: warnings.length > 0 ? warnings : undefined,
      };
    } catch (error: any) {
      const errors: ConfigValidationError[] = [];
      
      if (error.errors) {
        // Zod validation errors
        for (const zodError of error.errors) {
          errors.push({
            field: zodError.path.join('.'),
            message: zodError.message,
            value: zodError.received,
          });
        }
      } else {
        errors.push({
          field: 'config',
          message: error.message || 'Configuration validation failed',
        });
      }

      return {
        success: false,
        errors,
      };
    }
  }

  static async saveToFile(config: ProjectConfig, configPath: string): Promise<void> {
    const ext = path.extname(configPath).toLowerCase();
    let content: string;

    switch (ext) {
      case '.json':
        content = JSON.stringify(config, null, 2);
        break;
      case '.yaml':
      case '.yml':
        content = yaml.stringify(config, { indent: 2 });
        break;
      default:
        throw new Error(`Unsupported config file format: ${ext}`);
    }

    // Ensure directory exists
    const dir = path.dirname(configPath);
    await fs.mkdir(dir, { recursive: true });

    // Write file
    await fs.writeFile(configPath, content, 'utf-8');
  }

  static generateDefaultConfig(): ProjectConfig {
    return ProjectConfigSchema.parse({
      projectType: 'typescript',
      philosophy: {
        tdd: true,
        strictArchitecture: true,
        functionalProgramming: true,
      },
      tools: {
        eslint: true,
        testing: ['vitest', 'react-testing-library'],
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
        formats: ['all'],
        projectName: 'My Project',
      },
    });
  }

  static async createExampleConfig(outputPath: string): Promise<void> {
    const exampleConfig = {
      projectType: 'typescript',
      philosophy: {
        tdd: true,
        strictArchitecture: true,
        functionalProgramming: true,
      },
      tools: {
        eslint: true,
        stylelint: false,
        testing: ['vitest', 'react-testing-library'],
        stateManagement: 'zustand',
        uiFramework: 'react',
        i18n: false,
      },
      quality: {
        accessibility: true,
        performance: true,
        security: true,
        codeReview: true,
      },
      infrastructure: {
        cicd: true,
        logging: true,
        monitoring: false,
        documentation: true,
      },
      output: {
        formats: ['claude', 'vscode', 'readme'],
        projectName: 'My Awesome Project',
        customizations: {},
      },
    };

    const ext = path.extname(outputPath).toLowerCase();
    let content: string;

    if (ext === '.yaml' || ext === '.yml') {
      content = `# AI Rules Generator Configuration
# This file defines the project settings for generating AI instructions

${yaml.stringify(exampleConfig, { indent: 2 })}

# Available options:
# projectType: typescript | javascript | python | other
# philosophy.tdd: boolean - Enable Test-Driven Development
# philosophy.strictArchitecture: boolean - Enforce architectural boundaries  
# philosophy.functionalProgramming: boolean - Prefer functional patterns
# tools.testing: array - Testing frameworks (vitest, jest, react-testing-library, cypress, playwright)
# tools.uiFramework: react | vue | angular | svelte | none
# tools.stateManagement: redux | zustand | context | mobx | none
# quality.accessibility: boolean - WCAG compliance
# output.formats: array - Output formats (claude, vscode, readme, cursor, all)
`;
    } else {
      content = JSON.stringify({
        $schema: './ai-rules.schema.json',
        ...exampleConfig,
      }, null, 2);
    }

    await fs.writeFile(outputPath, content, 'utf-8');
  }

  static getConfigFilenames(): string[] {
    return [
      'ai-rules.config.json',
      'ai-rules.config.yaml',
      'ai-rules.config.yml',
      '.ai-rules.json',
      '.ai-rules.yaml',
      '.ai-rules.yml',
    ];
  }

  static async findConfigFile(searchDir: string = process.cwd()): Promise<string | null> {
    const filenames = this.getConfigFilenames();
    
    for (const filename of filenames) {
      const configPath = path.join(searchDir, filename);
      try {
        await fs.access(configPath);
        return configPath;
      } catch {
        // File doesn't exist, continue searching
      }
    }

    return null;
  }
}
import { promises as fs } from 'fs';
import path from 'path';
import { GeneratedOutput, ProjectConfig } from '../types';

export interface FileGenerationOptions {
  outputDir: string;
  overwrite?: boolean;
  createBackups?: boolean;
  dryRun?: boolean;
}

export interface GeneratedFile {
  path: string;
  content: string;
  size: number;
  exists: boolean;
  backed_up?: boolean;
}

export class FileGenerator {
  private outputDir: string;
  private options: FileGenerationOptions;

  constructor(options: FileGenerationOptions) {
    this.outputDir = options.outputDir;
    this.options = options;
  }

  async generateFiles(output: GeneratedOutput): Promise<GeneratedFile[]> {
    const generatedFiles: GeneratedFile[] = [];

    // Ensure output directory exists
    if (!this.options.dryRun) {
      await this.ensureDirectoryExists(this.outputDir);
    }

    // Generate CLAUDE.md
    if (output.claude) {
      const file = await this.writeFile('CLAUDE.md', output.claude);
      generatedFiles.push(file);
    }

    // Generate VS Code settings
    if (output.vscode) {
      const vscodeDir = path.join(this.outputDir, '.vscode');
      if (!this.options.dryRun) {
        await this.ensureDirectoryExists(vscodeDir);
      }
      
      const file = await this.writeFile('.vscode/settings.json', output.vscode);
      generatedFiles.push(file);

      // Also generate extensions.json if VS Code format requested
      const extensionsContent = this.extractExtensionsFromVSCode(output.vscode);
      if (extensionsContent) {
        const extensionsFile = await this.writeFile('.vscode/extensions.json', extensionsContent);
        generatedFiles.push(extensionsFile);
      }
    }

    // Generate README.md
    if (output.readme) {
      const file = await this.writeFile('README.md', output.readme);
      generatedFiles.push(file);
    }

    // Generate Cursor rules
    if (output.cursor) {
      const file = await this.writeFile('.cursorrules', output.cursor);
      generatedFiles.push(file);
    }

    // Generate Copilot instructions
    if (output.copilot) {
      const githubDir = path.join(this.outputDir, '.github');
      if (!this.options.dryRun) {
        await this.ensureDirectoryExists(githubDir);
      }
      const file = await this.writeFile('.github/copilot-instructions.md', output.copilot);
      generatedFiles.push(file);
    }

    // Generate Roo Code instructions
    if (output.roocode) {
      const rooDir = path.join(this.outputDir, '.roo/rules');
      if (!this.options.dryRun) {
        await this.ensureDirectoryExists(rooDir);
      }
      const file = await this.writeFile('.roo/rules/instructions.md', output.roocode);
      generatedFiles.push(file);
    }

    // Generate metadata file
    const metadataFile = await this.writeFile(
      '.ai-rules-metadata.json',
      JSON.stringify(output.metadata, null, 2)
    );
    generatedFiles.push(metadataFile);

    return generatedFiles;
  }

  private async writeFile(relativePath: string, content: string): Promise<GeneratedFile> {
    const fullPath = path.join(this.outputDir, relativePath);
    const exists = await this.fileExists(fullPath);
    
    let backed_up = false;

    // Create backup if file exists and backups are enabled
    if (exists && this.options.createBackups && !this.options.dryRun) {
      const backupPath = `${fullPath}.backup.${Date.now()}`;
      await fs.copyFile(fullPath, backupPath);
      backed_up = true;
    }

    // Check if we should overwrite
    if (exists && !this.options.overwrite && !this.options.dryRun) {
      throw new Error(`File already exists and overwrite is disabled: ${relativePath}`);
    }

    // Write file (unless dry run)
    if (!this.options.dryRun) {
      await fs.writeFile(fullPath, content, 'utf-8');
    }

    return {
      path: relativePath,
      content,
      size: Buffer.byteLength(content, 'utf-8'),
      exists,
      backed_up,
    };
  }

  private async ensureDirectoryExists(dirPath: string): Promise<void> {
    try {
      await fs.access(dirPath);
    } catch {
      await fs.mkdir(dirPath, { recursive: true });
    }
  }

  private async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  private extractExtensionsFromVSCode(vscodeSettings: string): string | null {
    try {
      const settings = JSON.parse(vscodeSettings);
      if (settings.extensions) {
        return JSON.stringify({ recommendations: settings.extensions.recommendations || [] }, null, 2);
      }
    } catch {
      // Invalid JSON, skip extensions
    }
    return null;
  }

  static async generateToDirectory(
    output: GeneratedOutput,
    targetDir: string,
    options: Partial<FileGenerationOptions> = {}
  ): Promise<GeneratedFile[]> {
    const generator = new FileGenerator({
      outputDir: targetDir,
      overwrite: true,
      createBackups: false,
      dryRun: false,
      ...options,
    });

    return await generator.generateFiles(output);
  }

  static async previewGeneration(
    output: GeneratedOutput,
    targetDir: string
  ): Promise<GeneratedFile[]> {
    const generator = new FileGenerator({
      outputDir: targetDir,
      overwrite: true,
      createBackups: false,
      dryRun: true,
    });

    return await generator.generateFiles(output);
  }

  static formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)}KB`;
    return `${Math.round(bytes / (1024 * 1024))}MB`;
  }

  static summarizeGeneration(files: GeneratedFile[]): {
    totalFiles: number;
    totalSize: string;
    existingFiles: number;
    newFiles: number;
    backedUpFiles: number;
  } {
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    const existingFiles = files.filter(f => f.exists).length;
    const backedUpFiles = files.filter(f => f.backed_up).length;

    return {
      totalFiles: files.length,
      totalSize: FileGenerator.formatFileSize(totalSize),
      existingFiles,
      newFiles: files.length - existingFiles,
      backedUpFiles,
    };
  }
}
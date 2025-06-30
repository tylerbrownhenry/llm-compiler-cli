import { useState, useCallback } from 'react';
import { ProjectConfig, GeneratedOutput } from '../../core/types.js';
import { TemplateEngine } from '../../core/template-engine/TemplateEngine.js';
import { FileGenerator } from '../../core/template-engine/FileGenerator.js';
import path from 'path';

interface UseGenerationReturn {
  generateInstructions: (config: ProjectConfig) => Promise<void>;
  isGenerating: boolean;
  results: GeneratedOutput | null;
  error: string | null;
  progress: number;
  generatedFiles: any[] | null;
}

export const useGeneration = (): UseGenerationReturn => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<GeneratedOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [generatedFiles, setGeneratedFiles] = useState<any[] | null>(null);

  const generateInstructions = useCallback(async (config: ProjectConfig) => {
    setIsGenerating(true);
    setError(null);
    setProgress(0);
    setResults(null);
    setGeneratedFiles(null);

    try {
      const templateEngine = new TemplateEngine();
      
      const generatedOutput = await templateEngine.generateInstructions(config);
      
      const outputDir = path.join(process.cwd(), 'output'); // Output subdirectory
      const files = await FileGenerator.generateToDirectory(generatedOutput, outputDir);

      setProgress(100);
      setResults(generatedOutput);
      setGeneratedFiles(files);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed');
    } finally {
      setIsGenerating(false);
    }
  }, []);

  return {
    generateInstructions,
    isGenerating,
    results,
    error,
    progress,
    generatedFiles,
  };
};


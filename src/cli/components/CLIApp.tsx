import React, { useState, useEffect } from 'react';
import { Box, Text } from 'ink';
import { CLIMode, CLIFlags, ProjectConfig } from '../../core/types';
import { QuestionWizard } from './QuestionWizard';
import { ConceptPreview } from './ConceptPreview';
import { GenerationProgress } from './GenerationProgress';
import { ResultsDisplay } from './ResultsDisplay';
import { ConceptList } from './ConceptList';
import { useGeneration } from '../hooks/useGeneration';

interface CLIAppProps {
  mode: CLIMode;
  flags?: CLIFlags;
}

type AppState = 'questions' | 'preview' | 'generating' | 'results' | 'list';

export const CLIApp: React.FC<CLIAppProps> = ({ mode, flags }) => {
  const [appState, setAppState] = useState<AppState>(() => {
    switch (mode) {
      case 'list':
        return 'list';
      case 'preview':
        return 'preview';
      case 'generate':
        return flags?.config ? 'generating' : 'questions';
      default:
        return 'questions';
    }
  });

  const [config, setConfig] = useState<Partial<ProjectConfig>>({});
  const { generateInstructions, isGenerating, results, error } = useGeneration();

  useEffect(() => {
    if (flags?.config) {
      // Load config from file and start generation
      loadConfigFromFile(flags.config);
    }
  }, [flags?.config]);

  const loadConfigFromFile = async (configPath: string) => {
    try {
      // TODO: Implement config loading
      console.log(`Loading config from ${configPath}`);
    } catch (err) {
      console.error('Failed to load config:', err);
    }
  };

  const handleConfigComplete = (finalConfig: ProjectConfig) => {
    setConfig(finalConfig);
    
    if (mode === 'preview') {
      setAppState('preview');
    } else {
      setAppState('generating');
      generateInstructions(finalConfig);
    }
  };

  const handleGenerationComplete = () => {
    setAppState('results');
  };

  const handleRestart = () => {
    setConfig({});
    setAppState('questions');
  };

  if (error) {
    return (
      <Box flexDirection="column" padding={1}>
        <Text color="red">❌ Error: {error}</Text>
        <Text color="gray">Press Ctrl+C to exit</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" minHeight={20}>
      {/* Header */}
      <Box marginBottom={1} paddingX={1}>
        <Text bold color="cyan">
          🤖 AI Rules Generator
        </Text>
        <Text color="gray"> - Generate customized LLM instructions</Text>
      </Box>

      {/* Main Content */}
      <Box flexGrow={1}>
        {appState === 'list' && <ConceptList />}
        
        {appState === 'questions' && (
          <QuestionWizard
            initialConfig={config}
            onComplete={handleConfigComplete}
            flags={flags}
          />
        )}
        
        {appState === 'preview' && (
          <ConceptPreview
            config={config as ProjectConfig}
            onBack={handleRestart}
            onGenerate={() => {
              setAppState('generating');
              generateInstructions(config as ProjectConfig);
            }}
          />
        )}
        
        {appState === 'generating' && (
          <GenerationProgress
            config={config as ProjectConfig}
            onComplete={handleGenerationComplete}
          />
        )}
        
        {appState === 'results' && results && (
          <ResultsDisplay
            results={results}
            config={config as ProjectConfig}
            onRestart={handleRestart}
          />
        )}
      </Box>

      {/* Footer */}
      <Box marginTop={1} paddingX={1}>
        <Text color="gray" dimColor>
          Press Ctrl+C to exit • Use arrow keys to navigate
        </Text>
      </Box>
    </Box>
  );
};
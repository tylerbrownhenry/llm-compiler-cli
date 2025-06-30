import React, { useState, useEffect } from 'react';
import { Box, Text } from 'ink';
import { CLIMode, CLIFlags, ProjectConfig } from '../../core/types.js';
import { QuestionWizard } from './QuestionWizard.js';
import { GenerationProgress } from './GenerationProgress.js';
import { ResultsDisplay } from './ResultsDisplay.js';
import { useGeneration } from '../hooks/useGeneration.js';

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
  const { generateInstructions, results, error } = useGeneration();

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
        {appState === 'list' && (
          <Box flexDirection="column" padding={1}>
            <Text color="cyan">📋 Available Features</Text>
            <Text>• Test-Driven Development (TDD)</Text>
            <Text>• Strict Architecture Enforcement</Text>
            <Text>• Functional Programming Guidelines</Text>
            <Text>• TypeScript Standards</Text>
            <Text>• Code Quality & Linting</Text>
            <Text>• Accessibility Compliance</Text>
            <Text>• Security Best Practices</Text>
            <Text>• Performance Optimization</Text>
            <Text>• CI/CD Integration</Text>
            <Text>• Documentation Standards</Text>
            <Box marginTop={1}>
              <Text color="gray">Run 'ai-rules init' to configure your project</Text>
            </Box>
          </Box>
        )}
        
        {appState === 'questions' && (
          <QuestionWizard
            initialConfig={config}
            onComplete={handleConfigComplete}
            flags={flags}
          />
        )}
        
        {appState === 'preview' && (
          <Box flexDirection="column" padding={1}>
            <Text color="cyan">🔍 Preview Mode</Text>
            <Text color="gray">Configuration preview coming soon...</Text>
            <Box marginTop={1}>
              <Text color="gray">Use 'ai-rules generate' to create instructions directly</Text>
            </Box>
          </Box>
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
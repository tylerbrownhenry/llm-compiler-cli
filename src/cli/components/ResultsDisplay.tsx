import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import { GeneratedOutput, ProjectConfig } from '../../core/types';

interface ResultsDisplayProps {
  results: GeneratedOutput;
  config: ProjectConfig;
  onRestart: () => void;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  results,
  config,
  onRestart,
}) => {
  const [selectedAction, setSelectedAction] = useState<'restart' | 'exit'>('restart');
  const [showDetails, setShowDetails] = useState(false);

  const outputFiles = getGeneratedFiles(results);

  useInput((input, key) => {
    if (key.leftArrow || key.rightArrow) {
      setSelectedAction(prev => prev === 'restart' ? 'exit' : 'restart');
    } else if (key.return) {
      if (selectedAction === 'restart') {
        onRestart();
      } else {
        process.exit(0);
      }
    } else if (input === 'r' || input === 'R') {
      onRestart();
    } else if (input === 'q' || input === 'Q') {
      process.exit(0);
    } else if (input === 'd' || input === 'D') {
      setShowDetails(prev => !prev);
    }
  });

  return (
    <Box flexDirection="column" padding={1}>
      {/* Header */}
      <Box marginBottom={2}>
        <Text bold color="green">
          🎉 Instructions Generated Successfully!
        </Text>
      </Box>

      {/* Summary */}
      <Box flexDirection="column" marginBottom={2}>
        <Text bold color="yellow">Generated Files:</Text>
        {outputFiles.map(file => (
          <Box key={file.name} marginLeft={2}>
            <Text color="green">✓ </Text>
            <Text color="white">{file.name}</Text>
            <Text color="gray"> ({file.size})</Text>
          </Box>
        ))}
      </Box>

      {/* Concepts Used */}
      <Box flexDirection="column" marginBottom={2}>
        <Text bold color="yellow">
          Concepts Included ({results.metadata.conceptsUsed.length}):
        </Text>
        <Box flexDirection="column" marginLeft={2}>
          {results.metadata.conceptsUsed.slice(0, 8).map(concept => (
            <Text key={concept} color="cyan">
              • {formatConceptName(concept)}
            </Text>
          ))}
          {results.metadata.conceptsUsed.length > 8 && (
            <Text color="gray">
              ... and {results.metadata.conceptsUsed.length - 8} more
            </Text>
          )}
        </Box>
      </Box>

      {/* Project Summary */}
      <Box flexDirection="column" marginBottom={2}>
        <Text bold color="yellow">Project Summary:</Text>
        <Text>• Name: <Text color="green">{config.output.projectName}</Text></Text>
        <Text>• Type: <Text color="green">{config.projectType}</Text></Text>
        <Text>• TDD: <Text color={config.philosophy.tdd ? 'green' : 'red'}>{config.philosophy.tdd ? 'Enabled' : 'Disabled'}</Text></Text>
        <Text>• Generated: <Text color="green">{results.metadata.generatedAt.toLocaleString()}</Text></Text>
      </Box>

      {/* Details Toggle */}
      <Box marginBottom={2}>
        <Text color="cyan">
          [D] {showDetails ? 'Hide' : 'Show'} Content Preview
        </Text>
      </Box>

      {/* Content Preview */}
      {showDetails && (
        <Box flexDirection="column" marginBottom={2} borderStyle="single" borderColor="gray" padding={1}>
          <Text bold color="yellow">Content Preview (first 300 chars):</Text>
          {results.claude && (
            <Box flexDirection="column" marginTop={1}>
              <Text bold color="cyan">CLAUDE.md:</Text>
              <Text color="gray">
                {results.claude.substring(0, 300)}...
              </Text>
            </Box>
          )}
          {results.readme && (
            <Box flexDirection="column" marginTop={1}>
              <Text bold color="cyan">README.md:</Text>
              <Text color="gray">
                {results.readme.substring(0, 300)}...
              </Text>
            </Box>
          )}
        </Box>
      )}

      {/* Next Steps */}
      <Box flexDirection="column" marginBottom={2}>
        <Text bold color="yellow">Next Steps:</Text>
        <Text>1. Review the generated files in your project directory</Text>
        <Text>2. Customize the instructions to fit your specific needs</Text>
        <Text>3. Share with your team or AI assistant</Text>
        {config.output.formats.includes('vscode') && (
          <Text>4. Import VS Code settings to apply configurations</Text>
        )}
      </Box>

      {/* Actions */}
      <Box marginBottom={1}>
        <Box marginRight={4}>
          <Text
            color={selectedAction === 'restart' ? 'black' : 'cyan'}
            backgroundColor={selectedAction === 'restart' ? 'cyan' : undefined}
          >
            [R] Generate Another
          </Text>
        </Box>
        
        <Box>
          <Text
            color={selectedAction === 'exit' ? 'black' : 'gray'}
            backgroundColor={selectedAction === 'exit' ? 'gray' : undefined}
          >
            [Q] Quit
          </Text>
        </Box>
      </Box>

      {/* Instructions */}
      <Text color="gray">
        Use ←→ to navigate, ENTER to confirm, D for details, or press R/Q directly
      </Text>
    </Box>
  );
};

const getGeneratedFiles = (results: GeneratedOutput): Array<{ name: string; size: string }> => {
  const files: Array<{ name: string; size: string }> = [];

  if (results.claude) {
    files.push({ name: 'CLAUDE.md', size: `${Math.round(results.claude.length / 1024)}KB` });
  }
  if (results.vscode) {
    files.push({ name: '.vscode/settings.json', size: `${Math.round(results.vscode.length / 1024)}KB` });
  }
  if (results.readme) {
    files.push({ name: 'README.md', size: `${Math.round(results.readme.length / 1024)}KB` });
  }
  if (results.cursor) {
    files.push({ name: '.cursorrules', size: `${Math.round(results.cursor.length / 1024)}KB` });
  }

  return files;
};

const formatConceptName = (concept: string): string => {
  return concept
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
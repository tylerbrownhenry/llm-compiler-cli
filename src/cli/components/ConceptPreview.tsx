import React from 'react';
import { Box, Text, useInput } from 'ink';
import { ProjectConfig } from '../../core/types';
import { getApplicableConcepts } from '../../core/concept-mapper/concept-rules';

interface ConceptPreviewProps {
  config: ProjectConfig;
  onBack: () => void;
  onGenerate: () => void;
}

export const ConceptPreview: React.FC<ConceptPreviewProps> = ({
  config,
  onBack,
  onGenerate,
}) => {
  const concepts = getApplicableConcepts(config);
  const [selectedAction, setSelectedAction] = React.useState<'back' | 'generate'>('generate');

  useInput((input, key) => {
    if (key.leftArrow || key.rightArrow) {
      setSelectedAction(prev => prev === 'back' ? 'generate' : 'back');
    } else if (key.return) {
      if (selectedAction === 'back') {
        onBack();
      } else {
        onGenerate();
      }
    } else if (input === 'b' || input === 'B') {
      onBack();
    } else if (input === 'g' || input === 'G') {
      onGenerate();
    }
  });

  return (
    <Box flexDirection="column" padding={1}>
      {/* Header */}
      <Box marginBottom={2}>
        <Text bold color="cyan">
          📋 Configuration Preview
        </Text>
      </Box>

      {/* Project Info */}
      <Box flexDirection="column" marginBottom={2}>
        <Text bold color="yellow">Project Configuration:</Text>
        <Text>• Project Type: <Text color="green">{config.projectType}</Text></Text>
        <Text>• TDD: <Text color={config.philosophy.tdd ? 'green' : 'red'}>{config.philosophy.tdd ? 'Yes' : 'No'}</Text></Text>
        <Text>• Strict Architecture: <Text color={config.philosophy.strictArchitecture ? 'green' : 'red'}>{config.philosophy.strictArchitecture ? 'Yes' : 'No'}</Text></Text>
        <Text>• Functional Programming: <Text color={config.philosophy.functionalProgramming ? 'green' : 'red'}>{config.philosophy.functionalProgramming ? 'Yes' : 'No'}</Text></Text>
      </Box>

      {/* Tools */}
      <Box flexDirection="column" marginBottom={2}>
        <Text bold color="yellow">Tools & Frameworks:</Text>
        {config.tools.eslint && <Text>• ESLint enabled</Text>}
        {config.tools.testing.length > 0 && (
          <Text>• Testing: <Text color="green">{config.tools.testing.join(', ')}</Text></Text>
        )}
        {config.tools.uiFramework && (
          <Text>• UI Framework: <Text color="green">{config.tools.uiFramework}</Text></Text>
        )}
        {config.tools.stateManagement && (
          <Text>• State Management: <Text color="green">{config.tools.stateManagement}</Text></Text>
        )}
        {config.tools.i18n && <Text>• Internationalization enabled</Text>}
      </Box>

      {/* Quality Standards */}
      <Box flexDirection="column" marginBottom={2}>
        <Text bold color="yellow">Quality Standards:</Text>
        {config.quality.accessibility && <Text>• Accessibility compliance</Text>}
        {config.quality.performance && <Text>• Performance optimization</Text>}
        {config.quality.security && <Text>• Security best practices</Text>}
        {config.quality.codeReview && <Text>• Code review process</Text>}
      </Box>

      {/* Applicable Concepts */}
      <Box flexDirection="column" marginBottom={2}>
        <Text bold color="yellow">Concepts to Include ({concepts.length}):</Text>
        <Box flexDirection="column" marginLeft={2}>
          {concepts.slice(0, 10).map(concept => (
            <Text key={concept} color="green">
              • {formatConceptName(concept)}
            </Text>
          ))}
          {concepts.length > 10 && (
            <Text color="gray">
              ... and {concepts.length - 10} more
            </Text>
          )}
        </Box>
      </Box>

      {/* Output Formats */}
      <Box flexDirection="column" marginBottom={3}>
        <Text bold color="yellow">Output Formats:</Text>
        {config.output.formats.map(format => (
          <Text key={format} color="green">
            • {formatOutputType(format)}
          </Text>
        ))}
      </Box>

      {/* Actions */}
      <Box>
        <Box marginRight={4}>
          <Text
            color={selectedAction === 'back' ? 'black' : 'gray'}
            backgroundColor={selectedAction === 'back' ? 'yellow' : undefined}
          >
            [B] Back to Questions
          </Text>
        </Box>
        
        <Box>
          <Text
            color={selectedAction === 'generate' ? 'black' : 'green'}
            backgroundColor={selectedAction === 'generate' ? 'green' : undefined}
          >
            [G] Generate Instructions
          </Text>
        </Box>
      </Box>

      {/* Instructions */}
      <Box marginTop={2}>
        <Text color="gray">
          Use ←→ to navigate actions, ENTER to confirm, or press B/G directly
        </Text>
      </Box>
    </Box>
  );
};

const formatConceptName = (concept: string): string => {
  return concept
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const formatOutputType = (format: string): string => {
  switch (format) {
    case 'claude':
      return 'CLAUDE.md (Claude AI instructions)';
    case 'vscode':
      return 'VS Code settings and extensions';
    case 'readme':
      return 'README.md documentation';
    case 'cursor':
      return 'Cursor AI rules';
    case 'all':
      return 'All formats';
    default:
      return format;
  }
};
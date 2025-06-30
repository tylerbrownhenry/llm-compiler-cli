import React, { useEffect } from 'react';
import { Box, Text } from 'ink';
import { ProjectConfig } from '../../core/types.js';

interface GenerationProgressProps {
  config: ProjectConfig;
  onComplete: () => void;
}

export const GenerationProgress: React.FC<GenerationProgressProps> = ({
  config,
  onComplete,
}) => {
  useEffect(() => {
    // Immediately call onComplete to start generation
    onComplete();
  }, [onComplete]);

  return (
    <Box flexDirection="column" padding={1}>
      <Box marginBottom={1}>
        <Text bold color="cyan">
          🚀 Generating Instructions for {config.output.projectName}
        </Text>
      </Box>
      
      <Box>
        <Text color="yellow">
          ⏳ Processing...
        </Text>
      </Box>
    </Box>
  );
};
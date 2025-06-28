import React from 'react';
import { Box, Text } from 'ink';

interface ProgressBarProps {
  current: number;
  total: number;
  percentage: number;
  label?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  total,
  percentage,
  label,
}) => {
  const barWidth = 40;
  const completedWidth = Math.round((percentage / 100) * barWidth);
  const remainingWidth = barWidth - completedWidth;

  const completedBar = '█'.repeat(completedWidth);
  const remainingBar = '░'.repeat(remainingWidth);

  return (
    <Box flexDirection="column">
      <Box marginBottom={1}>
        <Text color="cyan">
          {label || 'Progress'}: {current}/{total} ({Math.round(percentage)}%)
        </Text>
      </Box>
      
      <Box>
        <Text color="green">{completedBar}</Text>
        <Text color="gray">{remainingBar}</Text>
      </Box>
    </Box>
  );
};
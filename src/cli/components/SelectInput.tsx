import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';

interface SelectInputProps {
  options: string[];
  value?: string;
  onSelect: (value: string) => void;
  onCancel: () => void;
}

export const SelectInput: React.FC<SelectInputProps> = ({
  options,
  value,
  onSelect,
  onCancel,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(() => {
    const index = value ? options.indexOf(value) : 0;
    return index >= 0 ? index : 0;
  });

  useInput((_input, key) => {
    if (key.upArrow) {
      setSelectedIndex(prev => prev > 0 ? prev - 1 : options.length - 1);
    } else if (key.downArrow) {
      setSelectedIndex(prev => prev < options.length - 1 ? prev + 1 : 0);
    } else if (key.return) {
      onSelect(options[selectedIndex]);
    } else if (key.escape) {
      onCancel();
    }
  });

  return (
    <Box flexDirection="column">
      <Box marginBottom={1}>
        <Text color="yellow">
          Use ↑↓ to navigate, ENTER to select, ESC to cancel
        </Text>
      </Box>
      
      {options.map((option, index) => (
        <Box key={option}>
          <Text
            color={index === selectedIndex ? 'black' : 'white'}
            backgroundColor={index === selectedIndex ? 'cyan' : undefined}
          >
            {index === selectedIndex ? '► ' : '  '}
            {option}
          </Text>
        </Box>
      ))}
    </Box>
  );
};
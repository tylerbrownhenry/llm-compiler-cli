import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';

interface MultiSelectInputProps {
  options: string[];
  values: string[];
  onSelect: (values: string[]) => void;
  onCancel: () => void;
}

export const MultiSelectInput: React.FC<MultiSelectInputProps> = ({
  options,
  values,
  onSelect,
  onCancel,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedValues, setSelectedValues] = useState<string[]>(values || []);

  const toggleSelection = (option: string) => {
    const newValues = selectedValues.includes(option)
      ? selectedValues.filter(v => v !== option)
      : [...selectedValues, option];
    setSelectedValues(newValues);
  };

  useInput((input, key) => {
    if (key.upArrow) {
      setSelectedIndex(prev => prev > 0 ? prev - 1 : options.length - 1);
    } else if (key.downArrow) {
      setSelectedIndex(prev => prev < options.length - 1 ? prev + 1 : 0);
    } else if (input === ' ') {
      toggleSelection(options[selectedIndex]);
    } else if (key.return) {
      onSelect(selectedValues);
    } else if (key.escape) {
      onCancel();
    }
  });

  return (
    <Box flexDirection="column">
      <Box marginBottom={1}>
        <Text color="yellow">
          Use ↑↓ to navigate, SPACE to toggle, ENTER to confirm, ESC to cancel
        </Text>
      </Box>
      
      <Box marginBottom={1}>
        <Text color="green">
          Selected: {selectedValues.length > 0 ? selectedValues.join(', ') : 'None'}
        </Text>
      </Box>
      
      {options.map((option, index) => {
        const isSelected = selectedValues.includes(option);
        const isHighlighted = index === selectedIndex;
        
        return (
          <Box key={option}>
            <Text
              color={isHighlighted ? 'black' : 'white'}
              backgroundColor={isHighlighted ? 'cyan' : undefined}
            >
              {isHighlighted ? '► ' : '  '}
              {isSelected ? '✓ ' : '○ '}
              {option}
            </Text>
          </Box>
        );
      })}
    </Box>
  );
};
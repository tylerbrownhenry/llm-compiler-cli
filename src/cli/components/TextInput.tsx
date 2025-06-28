import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';

interface TextInputProps {
  value: string;
  placeholder?: string;
  onSubmit: (value: string) => void;
  onCancel: () => void;
}

export const TextInput: React.FC<TextInputProps> = ({
  value,
  placeholder,
  onSubmit,
  onCancel,
}) => {
  const [inputValue, setInputValue] = useState(value || '');

  useInput((input, key) => {
    if (key.return) {
      const finalValue = inputValue.trim() || placeholder || '';
      onSubmit(finalValue);
    } else if (key.escape) {
      onCancel();
    } else if (key.backspace || key.delete) {
      setInputValue(prev => prev.slice(0, -1));
    } else if (input && !key.ctrl && !key.meta) {
      setInputValue(prev => prev + input);
    }
  });

  return (
    <Box flexDirection="column">
      <Text color="yellow" marginBottom={1}>
        Type your answer, ENTER to confirm, ESC to cancel
      </Text>
      
      <Box>
        <Text color="cyan">
          Input: 
        </Text>
        <Text color="white">
          {inputValue}
          <Text backgroundColor="white" color="black">
            {' '}
          </Text>
        </Text>
      </Box>
      
      {placeholder && inputValue === '' && (
        <Box marginTop={1}>
          <Text color="gray">
            Default: {placeholder}
          </Text>
        </Box>
      )}
    </Box>
  );
};
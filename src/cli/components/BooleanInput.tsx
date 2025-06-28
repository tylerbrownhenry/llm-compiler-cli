import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';

interface BooleanInputProps {
  value?: boolean;
  onSelect: (value: boolean) => void;
  onCancel: () => void;
}

export const BooleanInput: React.FC<BooleanInputProps> = ({
  value,
  onSelect,
  onCancel,
}) => {
  const [selectedValue, setSelectedValue] = useState(value ?? true);

  useInput((input, key) => {
    if (key.leftArrow || key.rightArrow) {
      setSelectedValue(prev => !prev);
    } else if (key.return) {
      onSelect(selectedValue);
    } else if (key.escape) {
      onCancel();
    } else if (input === 'y' || input === 'Y') {
      onSelect(true);
    } else if (input === 'n' || input === 'N') {
      onSelect(false);
    }
  });

  return (
    <Box flexDirection="column">
      <Text color="yellow" marginBottom={1}>
        Use ←→ to toggle, ENTER to confirm, ESC to cancel, or press Y/N
      </Text>
      
      <Box>
        <Box marginRight={4}>
          <Text
            color={selectedValue ? 'green' : 'gray'}
            backgroundColor={selectedValue ? 'green' : undefined}
            bold={selectedValue}
          >
            {selectedValue ? '✓ Yes' : '  Yes'}
          </Text>
        </Box>
        
        <Box>
          <Text
            color={!selectedValue ? 'red' : 'gray'}
            backgroundColor={!selectedValue ? 'red' : undefined}
            bold={!selectedValue}
          >
            {!selectedValue ? '✗ No' : '  No'}
          </Text>
        </Box>
      </Box>
    </Box>
  );
};
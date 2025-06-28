import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import { Question } from '../../core/types';
import { SelectInput } from './SelectInput';
import { MultiSelectInput } from './MultiSelectInput';
import { BooleanInput } from './BooleanInput';
import { TextInput } from './TextInput';

interface QuestionDisplayProps {
  question: Question;
  currentAnswer: any;
  onAnswer: (answer: any) => void;
  canGoBack: boolean;
  onBack: () => void;
}

export const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  question,
  currentAnswer,
  onAnswer,
  canGoBack,
  onBack,
}) => {
  const [isAnswering, setIsAnswering] = useState(false);

  const handleAnswer = (answer: any) => {
    setIsAnswering(false);
    onAnswer(answer);
  };

  const startAnswering = () => {
    setIsAnswering(true);
  };

  useInput((input, key) => {
    if (!isAnswering) {
      if (input === ' ' || key.return) {
        startAnswering();
      }
    }
  });

  return (
    <Box flexDirection="column">
      {/* Question Header */}
      <Box marginBottom={1}>
        <Text bold color="cyan">
          {question.text}
        </Text>
      </Box>

      {/* Question Description */}
      {question.description && (
        <Box marginBottom={1}>
          <Text color="gray">
            {question.description}
          </Text>
        </Box>
      )}

      {/* Current Answer Display */}
      {currentAnswer !== undefined && !isAnswering && (
        <Box marginBottom={1}>
          <Text color="green">
            Current: {formatAnswer(currentAnswer)}
          </Text>
        </Box>
      )}

      {/* Input Component */}
      <Box>
        {isAnswering ? (
          <InputComponent
            question={question}
            currentAnswer={currentAnswer}
            onAnswer={handleAnswer}
            onCancel={() => setIsAnswering(false)}
          />
        ) : (
          <Box>
            <Text color="yellow">
              Press SPACE or ENTER to {currentAnswer !== undefined ? 'change' : 'answer'}
            </Text>
            {canGoBack && (
              <Box marginTop={1}>
                <Text color="gray">
                  Press ESC to go back
                </Text>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

interface InputComponentProps {
  question: Question;
  currentAnswer: any;
  onAnswer: (answer: any) => void;
  onCancel: () => void;
}

const InputComponent: React.FC<InputComponentProps> = ({
  question,
  currentAnswer,
  onAnswer,
  onCancel,
}) => {
  switch (question.type) {
    case 'single':
      return (
        <SelectInput
          options={question.options || []}
          value={currentAnswer}
          onSelect={onAnswer}
          onCancel={onCancel}
        />
      );
    
    case 'multiple':
      return (
        <MultiSelectInput
          options={question.options || []}
          values={currentAnswer || []}
          onSelect={onAnswer}
          onCancel={onCancel}
        />
      );
    
    case 'boolean':
      return (
        <BooleanInput
          value={currentAnswer}
          onSelect={onAnswer}
          onCancel={onCancel}
        />
      );
    
    case 'text':
      return (
        <TextInput
          value={currentAnswer || ''}
          placeholder={question.default}
          onSubmit={onAnswer}
          onCancel={onCancel}
        />
      );
    
    default:
      return <Text color="red">Unknown question type</Text>;
  }
};

const formatAnswer = (answer: any): string => {
  if (typeof answer === 'boolean') {
    return answer ? 'Yes' : 'No';
  }
  if (Array.isArray(answer)) {
    return answer.join(', ');
  }
  return String(answer);
};
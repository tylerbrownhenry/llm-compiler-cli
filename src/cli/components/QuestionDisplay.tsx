import React from 'react';
import { Box, Text } from 'ink';
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
}) => {
  const handleAnswer = (answer: any) => {
    onAnswer(answer);
  };

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
      {currentAnswer !== undefined && (
        <Box marginBottom={1}>
          <Text color="green">
            Current: {formatAnswer(currentAnswer)}
          </Text>
        </Box>
      )}

      {/* Input Component */}
      <Box>
        <InputComponent
          question={question}
          currentAnswer={currentAnswer}
          onAnswer={handleAnswer}
          onCancel={() => {}} // No-op since we're always showing input
        />
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
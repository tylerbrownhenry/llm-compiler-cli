import React, { useState, useEffect } from 'react';
import { Box, Text, useInput } from 'ink';
import { ProjectConfig, CLIFlags, ProjectConfigSchema } from '../../core/types';
import { questions, getNextQuestion } from '../../core/question-engine/questions';
import { QuestionDisplay } from './QuestionDisplay';
import { ProgressBar } from './ProgressBar';

const getOutputFormats = (formats: string[] | undefined): string[] => {
  // Handle undefined, null, or empty array - use question default of ['all']
  if (!formats || formats.length === 0) {
    return ['claude', 'vscode', 'readme', 'cursor', 'copilot', 'roocode']; // Default to all formats like the question default
  }
  
  // Handle 'all' selection - expand to all available formats
  if (formats.includes('all')) {
    return ['claude', 'vscode', 'readme', 'cursor', 'copilot', 'roocode'];
  }
  
  // Return user-selected formats
  return formats;
};

interface QuestionWizardProps {
  initialConfig: Partial<ProjectConfig>;
  onComplete: (config: ProjectConfig) => void;
  flags?: CLIFlags;
}

export const QuestionWizard: React.FC<QuestionWizardProps> = ({
  initialConfig,
  onComplete,
  flags
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  // Initialize answers with question defaults
  const initializeAnswersWithDefaults = () => {
    const answersWithDefaults = { ...initialConfig };
    questions.forEach(question => {
      if (question.default !== undefined && !answersWithDefaults[question.id]) {
        answersWithDefaults[question.id] = question.default;
      }
    });
    return answersWithDefaults;
  };
  
  const [answers, setAnswers] = useState<Record<string, any>>(initializeAnswersWithDefaults());
  const [isComplete, setIsComplete] = useState(false);

  // Apply flags to initial answers
  useEffect(() => {
    if (flags) {
      const flagAnswers = {
        ...answers,
        ...(flags.type && { projectType: flags.type }),
        ...(flags.tdd !== undefined && { followTDD: flags.tdd }),
        ...(flags.strictArch !== undefined && { strictArchitecture: flags.strictArch }),
        ...(flags.output && { outputFormats: flags.output.split(',') }),
      };
      setAnswers(flagAnswers);
    }
  }, [flags]);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleAnswer = (answer: any) => {
    const newAnswers = { ...answers, [currentQuestion.id]: answer };
    setAnswers(newAnswers);

    // Find next question based on dependencies
    const nextQuestion = getNextQuestion(currentQuestion.id, newAnswers);
    
    if (nextQuestion) {
      const nextIndex = questions.findIndex(q => q.id === nextQuestion.id);
      setCurrentQuestionIndex(nextIndex);
    } else {
      // All questions completed
      completeWizard(newAnswers);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const completeWizard = (finalAnswers: Record<string, any>) => {
    try {
      // Transform answers into ProjectConfig format
      const configData = transformAnswersToConfig(finalAnswers);
      const validatedConfig = ProjectConfigSchema.parse(configData);
      setIsComplete(true);
      onComplete(validatedConfig);
    } catch (error) {
      console.error('Configuration validation failed:', error);
    }
  };

  const transformAnswersToConfig = (rawAnswers: Record<string, any>): any => {
    const processedFormats = getOutputFormats(rawAnswers.outputFormats);
    
    return {
      projectType: rawAnswers.projectType || 'typescript',
      philosophy: {
        tdd: rawAnswers.followTDD ?? true,
        strictArchitecture: rawAnswers.strictArchitecture ?? true,
        functionalProgramming: rawAnswers.functionalProgramming ?? true,
      },
      tools: {
        eslint: rawAnswers.linting?.includes('eslint') ?? true,
        stylelint: rawAnswers.linting?.includes('stylelint') ?? false,
        testing: (() => {
          const validFrameworks = ['vitest', 'jest', 'react-testing-library', 'cypress', 'playwright'];
          const filtered = (rawAnswers.testingFramework || ['vitest', 'react-testing-library']).filter(item => 
            validFrameworks.includes(item)
          );
          return filtered.length > 0 ? filtered : ['vitest', 'react-testing-library'];
        })(),
        stateManagement: rawAnswers.stateManagement,
        uiFramework: rawAnswers.uiFramework,
        i18n: rawAnswers.i18n ?? false,
      },
      quality: {
        accessibility: rawAnswers.accessibility ?? true,
        performance: rawAnswers.performance ?? true,
        security: rawAnswers.security ?? true,
        codeReview: rawAnswers.codeReview ?? true,
      },
      infrastructure: {
        cicd: rawAnswers.cicd ?? false,
        logging: rawAnswers.logging ?? false,
        monitoring: rawAnswers.monitoring ?? false,
        documentation: rawAnswers.documentation ?? true,
      },
      output: {
        formats: processedFormats,
        projectName: rawAnswers.projectName || 'My Project',
        customizations: {},
      },
    };
  };

  useInput((input, key) => {
    if (key.escape && currentQuestionIndex > 0) {
      handleBack();
    }
  });

  if (isComplete) {
    return (
      <Box flexDirection="column" padding={1}>
        <Text color="green">✅ Configuration complete!</Text>
        <Text color="gray">Processing your selections...</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" padding={1}>
      {/* Progress */}
      <Box marginBottom={1}>
        <ProgressBar 
          current={currentQuestionIndex + 1} 
          total={questions.length}
          percentage={progress}
        />
      </Box>

      {/* Current Question */}
      <QuestionDisplay
        question={currentQuestion}
        currentAnswer={answers[currentQuestion.id]}
        onAnswer={handleAnswer}
        canGoBack={currentQuestionIndex > 0}
        onBack={handleBack}
      />

      {/* Navigation hint */}
      <Box marginTop={2}>
        <Text color="gray" dimColor>
          {currentQuestionIndex > 0 && 'Press ESC to go back • '}
          Question {currentQuestionIndex + 1} of {questions.length}
        </Text>
      </Box>
    </Box>
  );
};
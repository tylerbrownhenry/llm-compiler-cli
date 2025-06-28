import React, { useEffect, useState } from 'react';
import { Box, Text } from 'ink';
import { ProjectConfig } from '../../core/types';
import { ProgressBar } from './ProgressBar';

interface GenerationProgressProps {
  config: ProjectConfig;
  onComplete: () => void;
}

interface GenerationStep {
  id: string;
  label: string;
  completed: boolean;
  duration: number;
}

export const GenerationProgress: React.FC<GenerationProgressProps> = ({
  config,
  onComplete,
}) => {
  const [steps, setSteps] = useState<GenerationStep[]>([
    { id: 'analyze', label: 'Analyzing configuration', completed: false, duration: 800 },
    { id: 'concepts', label: 'Mapping concepts', completed: false, duration: 600 },
    { id: 'templates', label: 'Loading templates', completed: false, duration: 1000 },
    { id: 'generate', label: 'Generating instructions', completed: false, duration: 1200 },
    { id: 'validate', label: 'Validating outputs', completed: false, duration: 400 },
    { id: 'save', label: 'Saving files', completed: false, duration: 500 },
  ]);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [overallProgress, setOverallProgress] = useState(0);

  useEffect(() => {
    if (currentStepIndex >= steps.length) {
      // All steps completed
      setTimeout(onComplete, 500);
      return;
    }

    const currentStep = steps[currentStepIndex];
    const timer = setTimeout(() => {
      setSteps(prev => 
        prev.map((step, index) => 
          index === currentStepIndex ? { ...step, completed: true } : step
        )
      );
      setCurrentStepIndex(prev => prev + 1);
      setOverallProgress(((currentStepIndex + 1) / steps.length) * 100);
    }, currentStep.duration);

    return () => clearTimeout(timer);
  }, [currentStepIndex, steps.length, onComplete]);

  const completedSteps = steps.filter(step => step.completed).length;

  return (
    <Box flexDirection="column" padding={1}>
      {/* Header */}
      <Box marginBottom={2}>
        <Text bold color="cyan">
          🚀 Generating Instructions for {config.output.projectName}
        </Text>
      </Box>

      {/* Overall Progress */}
      <Box marginBottom={2}>
        <ProgressBar
          current={completedSteps}
          total={steps.length}
          percentage={overallProgress}
          label="Overall Progress"
        />
      </Box>

      {/* Steps */}
      <Box flexDirection="column" marginBottom={2}>
        {steps.map((step, index) => (
          <StepDisplay
            key={step.id}
            step={step}
            isActive={index === currentStepIndex}
            isCurrent={index === currentStepIndex}
          />
        ))}
      </Box>

      {/* Current Activity */}
      <Box marginBottom={1}>
        {currentStepIndex < steps.length ? (
          <Box>
            <Text color="yellow">
              ⏳ {steps[currentStepIndex].label}...
            </Text>
          </Box>
        ) : (
          <Box>
            <Text color="green">
              ✅ Generation complete!
            </Text>
          </Box>
        )}
      </Box>

      {/* Stats */}
      <Box flexDirection="column">
        <Text color="gray">
          Project Type: {config.projectType} | Formats: {config.output.formats.join(', ')}
        </Text>
        <Text color="gray">
          TDD: {config.philosophy.tdd ? 'Yes' : 'No'} | 
          Architecture: {config.philosophy.strictArchitecture ? 'Strict' : 'Flexible'}
        </Text>
      </Box>
    </Box>
  );
};

interface StepDisplayProps {
  step: GenerationStep;
  isActive: boolean;
  isCurrent: boolean;
}

const StepDisplay: React.FC<StepDisplayProps> = ({ step, isActive, isCurrent }) => {
  const getIcon = () => {
    if (step.completed) return '✅';
    if (isCurrent) return '⏳';
    return '⭕';
  };

  const getColor = (): string => {
    if (step.completed) return 'green';
    if (isCurrent) return 'yellow';
    return 'gray';
  };

  return (
    <Box>
      <Text color={getColor()}>
        {getIcon()} {step.label}
      </Text>
    </Box>
  );
};
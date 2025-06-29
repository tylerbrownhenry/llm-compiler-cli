# AI-Powered Repository Analysis Plan

## Overview
Create an AI analysis system that automatically scans repositories to infer project characteristics and pre-fill questionnaire answers, reducing manual input and improving accuracy.

## Phase 1: Repository Analysis Engine

### 1.1 File System Scanner
Create a comprehensive scanner that analyzes project structure:

```typescript
interface RepositoryAnalysis {
  projectType: 'typescript' | 'javascript' | 'python' | 'other';
  hasPackageJson: boolean;
  hasTsConfig: boolean;
  hasEslintConfig: boolean;
  hasPrettierConfig: boolean;
  testFrameworks: string[];
  uiFramework?: string;
  stateManagement?: string;
  buildTools: string[];
  cicdPlatforms: string[];
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  fileStructure: FileNode[];
  codeMetrics: CodeMetrics;
}
```

### 1.2 Analysis Rules Engine
```typescript
class RepositoryAnalyzer {
  async analyzeRepository(path: string): Promise<RepositoryAnalysis> {
    const analysis = {
      projectType: await this.detectProjectType(path),
      testing: await this.detectTestingFrameworks(path),
      linting: await this.detectLintingTools(path),
      uiFramework: await this.detectUIFramework(path),
      architecture: await this.analyzeArchitecture(path),
      cicd: await this.detectCICD(path)
    };
    
    return this.consolidateAnalysis(analysis);
  }

  private async detectProjectType(path: string): Promise<string> {
    // Check for tsconfig.json, package.json, requirements.txt, etc.
    // Analyze file extensions (.ts, .js, .py)
    // Look at build scripts and dependencies
  }

  private async detectTestingFrameworks(path: string): Promise<string[]> {
    // Scan package.json devDependencies for jest, vitest, cypress, etc.
    // Look for test directories and test files
    // Analyze test configuration files
  }
}
```

## Phase 2: LLM Integration for Code Analysis

### 2.1 Code Analysis Prompt System
Create specialized prompts for different analysis tasks:

```typescript
interface AnalysisPrompt {
  systemPrompt: string;
  userPrompt: string;
  expectedFormat: 'json' | 'structured' | 'boolean';
  confidence: number;
}

const ANALYSIS_PROMPTS = {
  projectArchitecture: {
    systemPrompt: `You are a senior software architect analyzing a codebase. 
    Your task is to determine if the project follows strict architectural patterns.
    
    Look for:
    - Layered architecture (controllers, services, repositories)
    - Domain-driven design patterns
    - Separation of concerns
    - Clean architecture principles
    - Consistent directory structure
    
    Respond with JSON: {"strictArchitecture": boolean, "confidence": number, "patterns": string[]}`,
    
    userPrompt: (files: FileNode[]) => `
    Analyze this project structure and key files:
    ${JSON.stringify(files, null, 2)}
    
    Determine if this follows strict architectural patterns.`
  },

  testingStrategy: {
    systemPrompt: `You are a testing expert analyzing a codebase to determine testing strategy.
    
    Look for:
    - Test file patterns and locations
    - Testing frameworks in use
    - Test coverage approach
    - TDD indicators (tests written before implementation)
    - Test structure and organization
    
    Respond with JSON: {"tdd": boolean, "frameworks": string[], "coverage": "high" | "medium" | "low"}`,
    
    userPrompt: (testFiles: string[], packageJson: any) => `
    Analyze the testing approach:
    Test files: ${JSON.stringify(testFiles)}
    Package.json dependencies: ${JSON.stringify(packageJson.devDependencies)}
    
    Determine the testing strategy.`
  },

  codeQuality: {
    systemPrompt: `You are a code quality expert analyzing project standards.
    
    Look for:
    - Linting configurations (ESLint, Prettier, etc.)
    - Code formatting consistency
    - Type safety practices
    - Error handling patterns
    - Documentation standards
    
    Respond with JSON: {"eslint": boolean, "prettier": boolean, "typeStrict": boolean, "documented": boolean}`,
    
    userPrompt: (configFiles: string[], sampleCode: string[]) => `
    Config files found: ${JSON.stringify(configFiles)}
    Sample code snippets: ${JSON.stringify(sampleCode)}
    
    Assess code quality practices.`
  }
};
```

### 2.2 LLM Integration Service
```typescript
class LLMAnalysisService {
  constructor(private llmProvider: 'openai' | 'anthropic' | 'local') {}

  async analyzeWithLLM(
    prompt: AnalysisPrompt,
    context: any
  ): Promise<AnalysisResult> {
    const response = await this.callLLM({
      system: prompt.systemPrompt,
      user: prompt.userPrompt(context),
      format: prompt.expectedFormat
    });

    return this.validateAndParseResponse(response, prompt.expectedFormat);
  }

  private async callLLM(request: LLMRequest): Promise<string> {
    switch (this.llmProvider) {
      case 'openai':
        return this.callOpenAI(request);
      case 'anthropic':
        return this.callClaude(request);
      case 'local':
        return this.callLocalModel(request);
    }
  }
}
```

## Phase 3: Intelligent Question Pre-filling

### 3.1 Answer Inference Engine
```typescript
class AnswerInferenceEngine {
  constructor(
    private analyzer: RepositoryAnalyzer,
    private llmService: LLMAnalysisService
  ) {}

  async inferAnswers(repoPath: string): Promise<Partial<QuestionAnswers>> {
    // Step 1: Basic file system analysis
    const basicAnalysis = await this.analyzer.analyzeRepository(repoPath);
    
    // Step 2: LLM-powered deep analysis for complex questions
    const deepAnalysis = await this.performDeepAnalysis(repoPath, basicAnalysis);
    
    // Step 3: Combine results and map to question answers
    return this.mapToQuestionAnswers(basicAnalysis, deepAnalysis);
  }

  private async performDeepAnalysis(
    repoPath: string, 
    basic: RepositoryAnalysis
  ): Promise<DeepAnalysis> {
    const tasks = [
      this.analyzeArchitecturalPatterns(repoPath),
      this.analyzeTDDPractices(repoPath),
      this.analyzeCodeQuality(repoPath),
      this.analyzeAccessibilityPractices(repoPath)
    ];

    const results = await Promise.all(tasks);
    return this.consolidateDeepAnalysis(results);
  }

  private mapToQuestionAnswers(
    basic: RepositoryAnalysis,
    deep: DeepAnalysis
  ): Partial<QuestionAnswers> {
    return {
      projectType: basic.projectType,
      followTDD: deep.tddPractices.likelihood > 0.7,
      strictArchitecture: deep.architecture.isStrict,
      functionalProgramming: deep.codeStyle.functionalPatterns > 0.6,
      linting: basic.hasEslintConfig ? ['eslint'] : [],
      testingFramework: basic.testFrameworks,
      uiFramework: basic.uiFramework,
      stateManagement: basic.stateManagement,
      accessibility: deep.accessibility.score > 0.5,
      // ... map all other questions
    };
  }
}
```

### 3.2 Confidence-Based Pre-filling
```typescript
interface InferredAnswer {
  questionId: string;
  value: any;
  confidence: number;
  reasoning: string;
  sources: string[]; // Files that influenced this decision
}

class ConfidenceBasedPrefill {
  async prefillQuestions(
    questions: Question[],
    inferredAnswers: InferredAnswer[]
  ): Promise<PrefilledQuestions> {
    const prefilled = {};
    
    for (const question of questions) {
      const inferred = inferredAnswers.find(a => a.questionId === question.id);
      
      if (inferred && inferred.confidence >= this.getConfidenceThreshold(question)) {
        prefilled[question.id] = {
          value: inferred.value,
          confidence: inferred.confidence,
          reasoning: inferred.reasoning,
          canEdit: true, // User can still override
          sources: inferred.sources
        };
      }
    }
    
    return prefilled;
  }

  private getConfidenceThreshold(question: Question): number {
    // Different thresholds for different question types
    const thresholds = {
      'projectType': 0.9,      // Very confident needed
      'uiFramework': 0.8,      // High confidence
      'testingFramework': 0.7, // Medium-high confidence
      'accessibility': 0.5,    // Lower threshold for subjective questions
    };
    
    return thresholds[question.id] || 0.6; // Default threshold
  }
}
```

## Phase 4: Enhanced UI with Analysis Results

### 4.1 Analysis Progress Display
```typescript
const AnalysisProgress: React.FC = () => {
  return (
    <Box flexDirection="column">
      <Text bold color="cyan">🔍 Analyzing Repository...</Text>
      
      <ProgressStep 
        name="Scanning file structure" 
        status={analysisStatus.fileSystem} 
      />
      <ProgressStep 
        name="Detecting project type" 
        status={analysisStatus.projectType} 
      />
      <ProgressStep 
        name="Analyzing dependencies" 
        status={analysisStatus.dependencies} 
      />
      <ProgressStep 
        name="AI-powered code analysis" 
        status={analysisStatus.aiAnalysis} 
      />
      <ProgressStep 
        name="Inferring configurations" 
        status={analysisStatus.inference} 
      />
    </Box>
  );
};
```

### 4.2 Pre-filled Question Display
```typescript
const PrefilledQuestionDisplay: React.FC<{
  question: Question;
  inferredAnswer: InferredAnswer;
  onAccept: () => void;
  onEdit: () => void;
}> = ({ question, inferredAnswer, onAccept, onEdit }) => {
  return (
    <Box flexDirection="column">
      <Text bold color="cyan">{question.text}</Text>
      
      <Box marginTop={1} padding={1} borderStyle="round" borderColor="green">
        <Text color="green">
          ✨ Auto-detected: {formatAnswer(inferredAnswer.value)}
        </Text>
        <Text color="gray" dimColor>
          Confidence: {Math.round(inferredAnswer.confidence * 100)}%
        </Text>
        <Text color="gray" dimColor>
          Based on: {inferredAnswer.sources.join(', ')}
        </Text>
      </Box>
      
      <Box marginTop={1}>
        <Text color="yellow">
          Press ENTER to accept • SPACE to edit • ESC to skip
        </Text>
      </Box>
    </Box>
  );
};
```

## Phase 5: Implementation Strategy

### 5.1 Analysis Engine Architecture
```
src/
  analysis/
    core/
      RepositoryAnalyzer.ts      # File system analysis
      LLMAnalysisService.ts      # LLM integration
      AnswerInferenceEngine.ts   # Answer mapping
    
    detectors/
      ProjectTypeDetector.ts     # Language/framework detection
      TestingDetector.ts         # Testing framework detection
      ArchitectureDetector.ts    # Architecture pattern detection
      QualityDetector.ts         # Code quality detection
    
    llm/
      prompts/
        architecture.ts          # Architecture analysis prompts
        testing.ts              # Testing strategy prompts
        quality.ts              # Code quality prompts
      
      providers/
        OpenAIProvider.ts       # OpenAI integration
        ClaudeProvider.ts       # Anthropic Claude integration
        LocalProvider.ts        # Local model integration
    
    types/
      AnalysisTypes.ts          # Analysis result types
      PromptTypes.ts            # LLM prompt types
```

### 5.2 CLI Integration
```bash
# New CLI commands
ai-rules analyze           # Just run analysis, show results
ai-rules init --analyze    # Run analysis then interactive questions
ai-rules generate --auto   # Fully automated based on analysis
ai-rules init --review     # Show analysis results for review before questions
```

### 5.3 Configuration Options
```json
{
  "analysis": {
    "enabled": true,
    "llmProvider": "openai", // "anthropic", "local", "none"
    "confidenceThresholds": {
      "projectType": 0.9,
      "testingFramework": 0.7,
      "architecture": 0.6
    },
    "skipLowConfidence": false,
    "maxAnalysisTime": 30000, // 30 seconds
    "cacheResults": true
  }
}
```

## Phase 6: Advanced Features

### 6.1 Multi-Repository Learning
- Learn from analysis patterns across repositories
- Improve inference accuracy over time
- Build confidence models based on successful inferences

### 6.2 Analysis Caching
- Cache analysis results to avoid re-analyzing unchanged repos
- Version-aware caching (invalidate when files change)
- Share analysis results across team members

### 6.3 Custom Analysis Rules
- Allow users to define custom analysis rules
- Domain-specific analysis patterns
- Organization-specific coding standards detection

## Expected User Experience

### Before (Current)
```bash
ai-rules init
# User manually answers 19 questions
```

### After (With Analysis)
```bash
ai-rules init --analyze
# 🔍 Analyzing repository... (5-10 seconds)
# ✨ Pre-filled 14/19 questions based on analysis
# User reviews and confirms/edits only uncertain answers
```

### Fully Automated
```bash
ai-rules generate --auto
# 🔍 Analyzing repository...
# 🎯 Generated instructions with 95% confidence
# ✅ All AI assistant configs created
```

## Implementation Priorities

1. **File System Analysis** (Week 1)
   - Basic project type detection
   - Dependency analysis
   - Configuration file detection

2. **LLM Integration** (Week 2)
   - OpenAI/Claude integration
   - Basic analysis prompts
   - Response parsing and validation

3. **Answer Inference** (Week 3)
   - Mapping analysis to questions
   - Confidence scoring
   - Pre-filling logic

4. **UI Enhancement** (Week 4)
   - Analysis progress display
   - Pre-filled question UI
   - Review and edit flows

5. **Advanced Analysis** (Week 5+)
   - Architecture pattern detection
   - Code quality assessment
   - Performance optimization

This AI analysis system would transform the tool from a manual questionnaire into an intelligent assistant that understands your codebase and generates appropriate AI instructions with minimal user input.
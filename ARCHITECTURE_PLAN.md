# Architecture Plan: Intelligent AI Rules Generator NPM Package

## Overview
Transform the AI Rules Generator into an intelligent npm package that automatically scans repositories, understands project structure, and dynamically generates contextual questions and guidelines based on discovered technology stack and existing patterns.

## Core Concepts

### 1. Structured Content Management
Move all textual content out of code into parseable markdown files with structured metadata.

### 2. Repository Intelligence
Automatically scan and analyze repositories to understand:
- Technology stack (languages, frameworks, tools)
- Project structure patterns
- Existing AI instructions and guidelines
- Development practices in use

### 3. Dynamic Question Generation
Generate contextual questions based on discovered project characteristics, filtering out irrelevant questions and focusing on applicable concepts.

### 4. NPM Package Distribution
Distribute as a globally installable npm package with CLI interface and programmatic API.

## Detailed Architecture

### Content Structure System

#### Structured Content Files
```
content/
├── concepts/                          # Core concept definitions
│   ├── craft/
│   │   ├── testing-and-quality/
│   │   │   ├── tdd.md                 # TDD concept
│   │   │   ├── testing-principles.md
│   │   │   ├── code-style.md
│   │   │   └── meta.json              # Section metadata
│   │   ├── typescript-and-type-safety/
│   │   ├── code-architecture-and-design/
│   │   └── meta.json                  # Category metadata
│   ├── process/
│   └── product/
│
├── templates/                         # Output format templates
│   ├── claude/
│   │   ├── base-template.md
│   │   ├── sections/
│   │   │   ├── header.md
│   │   │   ├── philosophy.md
│   │   │   └── footer.md
│   │   └── meta.json
│   ├── vscode/
│   ├── readme/
│   └── cursor/
│
├── questions/                         # Question definitions
│   ├── core/
│   │   ├── project-type.md
│   │   ├── philosophy.md
│   │   └── meta.json
│   ├── conditional/
│   │   ├── typescript-specific.md
│   │   ├── react-specific.md
│   │   ├── nodejs-specific.md
│   │   └── meta.json
│   └── dynamic/                       # Auto-generated questions
│
├── detection-rules/                   # Repository analysis rules
│   ├── languages/
│   │   ├── typescript.md
│   │   ├── javascript.md
│   │   ├── python.md
│   │   └── meta.json
│   ├── frameworks/
│   │   ├── react.md
│   │   ├── nextjs.md
│   │   ├── express.md
│   │   └── meta.json
│   ├── tools/
│   │   ├── testing-frameworks.md
│   │   ├── build-tools.md
│   │   └── meta.json
│   └── patterns/
│       ├── existing-ai-instructions.md
│       ├── documentation-patterns.md
│       └── meta.json
│
└── prompts/                           # AI prompts for analysis
    ├── repository-analysis.md         # Main repo analysis prompt
    ├── structure-analysis.md          # Project structure analysis
    ├── existing-guidelines.md         # Find existing AI guidelines
    └── meta.json
```

#### Content File Structure
Each concept/template file follows structured markdown format:

```markdown
---
id: "tdd"
name: "Test-Driven Development"
category: "craft"
subcategory: "testing-and-quality"
priority: 1
dependencies: ["testing-principles"]
conflicts: []
applicable_to:
  languages: ["typescript", "javascript", "python", "java"]
  frameworks: ["react", "express", "fastapi"]
  project_types: ["web", "api", "library"]
triggers:
  - has_testing_framework: true
  - philosophy_tdd: true
weight: 10
---

# Test-Driven Development (TDD)

## Core Philosophy
Write tests before implementation...

## Implementation Guidelines
...

## Examples
...
```

### Repository Intelligence System

#### Scanner Architecture
```typescript
// Core scanning engine
interface RepositoryScanner {
  scanRepository(path: string): Promise<RepositoryContext>;
  detectLanguages(): Promise<DetectedLanguage[]>;
  detectFrameworks(): Promise<DetectedFramework[]>;
  detectTools(): Promise<DetectedTool[]>;
  detectPatterns(): Promise<DetectedPattern[]>;
  analyzeStructure(): Promise<StructureAnalysis>;
  findExistingGuidelines(): Promise<ExistingGuideline[]>;
}

// Repository context
interface RepositoryContext {
  path: string;
  name: string;
  languages: DetectedLanguage[];
  frameworks: DetectedFramework[];
  tools: DetectedTool[];
  patterns: DetectedPattern[];
  structure: StructureAnalysis;
  existingGuidelines: ExistingGuideline[];
  confidence: ConfidenceScore;
  recommendations: Recommendation[];
}
```

#### Detection Rules Engine
```typescript
interface DetectionRule {
  id: string;
  name: string;
  type: 'language' | 'framework' | 'tool' | 'pattern';
  patterns: DetectionPattern[];
  confidence: number;
  weight: number;
}

interface DetectionPattern {
  type: 'file_extension' | 'file_name' | 'file_content' | 'directory_structure' | 'package_dependency';
  pattern: string | RegExp;
  required?: boolean;
  weight: number;
}

// Example detection rule
const typescriptDetection: DetectionRule = {
  id: 'typescript',
  name: 'TypeScript',
  type: 'language',
  patterns: [
    { type: 'file_extension', pattern: '.ts', weight: 10 },
    { type: 'file_extension', pattern: '.tsx', weight: 10 },
    { type: 'file_name', pattern: 'tsconfig.json', weight: 15 },
    { type: 'package_dependency', pattern: 'typescript', weight: 12 }
  ],
  confidence: 0.8,
  weight: 10
};
```

### Dynamic Question System

#### Intelligent Question Filtering
```typescript
interface QuestionFilter {
  filterQuestions(
    allQuestions: Question[], 
    context: RepositoryContext
  ): Promise<FilteredQuestion[]>;
  
  generateDynamicQuestions(
    context: RepositoryContext
  ): Promise<DynamicQuestion[]>;
  
  scoreQuestionRelevance(
    question: Question, 
    context: RepositoryContext
  ): number;
}

interface FilteredQuestion extends Question {
  relevanceScore: number;
  autoAnswer?: any;
  reasoning: string;
}
```

#### Question Generation Strategy
```typescript
// Context-aware question generation
class ContextualQuestionGenerator {
  generateQuestions(context: RepositoryContext): Question[] {
    const questions: Question[] = [];
    
    // Base questions (always asked)
    questions.push(...this.getBaseQuestions());
    
    // Language-specific questions
    for (const language of context.languages) {
      questions.push(...this.getLanguageQuestions(language));
    }
    
    // Framework-specific questions
    for (const framework of context.frameworks) {
      questions.push(...this.getFrameworkQuestions(framework));
    }
    
    // Tool-specific questions
    for (const tool of context.tools) {
      questions.push(...this.getToolQuestions(tool));
    }
    
    // Pattern-based questions
    for (const pattern of context.patterns) {
      questions.push(...this.getPatternQuestions(pattern));
    }
    
    // Filter and rank by relevance
    return this.filterAndRankQuestions(questions, context);
  }
}
```

### NPM Package Structure

#### Package Architecture
```
ai-rules-generator/                    # NPM package root
├── bin/
│   └── ai-rules-gen                   # CLI executable
├── lib/                               # Compiled TypeScript
├── content/                           # Structured content files
├── src/
│   ├── cli/                           # CLI interface
│   ├── core/                          # Core business logic
│   │   ├── scanner/                   # Repository scanning
│   │   ├── content/                   # Content management
│   │   ├── questions/                 # Question engine
│   │   ├── generation/                # Content generation
│   │   └── analysis/                  # AI-powered analysis
│   ├── services/                      # Shared services
│   └── utils/                         # Utilities
├── templates/                         # Default templates
├── package.json
├── README.md
└── CHANGELOG.md
```

#### CLI Interface Design
```bash
# Global installation
npm install -g ai-rules-generator

# Basic usage (auto-scan current directory)
ai-rules-gen init

# Specify target directory
ai-rules-gen init ./my-project

# Advanced options
ai-rules-gen init --scan-depth 3 --include-deps --ai-analysis

# Generate specific formats
ai-rules-gen generate --format claude,vscode,readme

# Update existing configuration
ai-rules-gen update

# Validate existing guidelines
ai-rules-gen validate

# Preview without writing files
ai-rules-gen preview --format claude
```

### AI-Powered Analysis Integration

#### Repository Analysis Prompt System
```typescript
interface AnalysisPromptBuilder {
  buildRepositoryAnalysisPrompt(context: RepositoryContext): string;
  buildStructureAnalysisPrompt(structure: StructureAnalysis): string;
  buildGuidelineAnalysisPrompt(existing: ExistingGuideline[]): string;
}

// Example analysis prompt
const repositoryAnalysisPrompt = `
Analyze this repository structure and provide insights:

## Repository Context
- Name: {{repo_name}}
- Languages: {{languages}}
- Frameworks: {{frameworks}}
- Tools: {{tools}}

## File Structure
{{file_structure}}

## Package Dependencies
{{dependencies}}

## Existing AI Instructions
{{existing_guidelines}}

Please analyze and provide:
1. Primary technology stack assessment
2. Development patterns identification
3. Missing best practices opportunities
4. Recommended AI instruction focus areas
5. Specific customization suggestions

Focus on actionable insights for generating relevant development guidelines.
`;
```

#### Intelligent Content Assembly
```typescript
interface ContentAssembler {
  assembleContextualContent(
    selectedConcepts: Concept[],
    context: RepositoryContext,
    userAnswers: QuestionAnswers
  ): Promise<AssembledContent>;
  
  customizeTemplates(
    templates: Template[],
    context: RepositoryContext
  ): Promise<CustomizedTemplate[]>;
  
  generateRecommendations(
    context: RepositoryContext
  ): Promise<Recommendation[]>;
}
```

## Implementation Strategy

### Phase 1: Content Structure Migration (Week 1)
- [ ] Design structured content file format with frontmatter metadata
- [ ] Migrate existing concepts from TypeScript to structured markdown files
- [ ] Create content parsing and validation system
- [ ] Build content indexing and caching system
- [ ] Create content management CLI tools

### Phase 2: Repository Scanner Development (Week 2)
- [ ] Build file system scanning engine
- [ ] Implement detection rules for languages, frameworks, tools
- [ ] Create pattern recognition for project structures
- [ ] Build existing guideline discovery system
- [ ] Add confidence scoring and recommendation engine

### Phase 3: Dynamic Question System (Week 3)
- [ ] Create question filtering and relevance scoring
- [ ] Build contextual question generation
- [ ] Implement auto-answer detection for obvious cases
- [ ] Create question dependency and conditional logic
- [ ] Add question explanation and reasoning

### Phase 4: AI Analysis Integration (Week 4)
- [ ] Build repository analysis prompt system
- [ ] Integrate with AI services for intelligent analysis
- [ ] Create structure and pattern analysis
- [ ] Build recommendation generation system
- [ ] Add analysis result caching and optimization

### Phase 5: NPM Package & CLI (Week 5)
- [ ] Package as distributable npm module
- [ ] Create comprehensive CLI interface
- [ ] Add global installation and configuration
- [ ] Build update and validation commands
- [ ] Create documentation and examples

### Phase 6: Advanced Features (Week 6)
- [ ] Add multi-repository analysis support
- [ ] Build team/organization guideline templates
- [ ] Create guideline evolution and versioning
- [ ] Add integration with popular IDEs and tools
- [ ] Build analytics and usage tracking

## Key Benefits

### 1. Intelligent Automation
- **Automatic Discovery**: No manual project type selection needed
- **Contextual Questions**: Only relevant questions asked based on detected stack
- **Smart Defaults**: Reasonable defaults based on detected patterns
- **Time Efficiency**: Faster setup with less manual input required

### 2. Content Maintainability
- **Structured Content**: All text content in parseable markdown files
- **Version Control**: Content changes tracked independently of code
- **Collaborative Editing**: Non-developers can contribute to content
- **Modular Design**: Easy to add new concepts, templates, and questions

### 3. NPM Package Benefits
- **Global Installation**: Available as `ai-rules-gen` command anywhere
- **Version Management**: Proper semantic versioning and updates
- **Distribution**: Easy installation and updates via npm
- **Integration**: Can be used in CI/CD pipelines and automation

### 4. Scalability
- **Multi-Language Support**: Easy to add support for new languages/frameworks
- **Extensible Detection**: Simple to add new detection rules
- **Template System**: Flexible output format customization
- **AI Integration**: Leverages AI for intelligent analysis and recommendations

## Example User Flow

```bash
# User installs globally
npm install -g ai-rules-generator

# User navigates to their project
cd /path/to/my-react-typescript-project

# User runs initialization
ai-rules-gen init

# System automatically detects:
# - TypeScript (tsconfig.json, .ts files)
# - React (package.json dependencies, .tsx files)
# - Jest (jest.config.js, test files)
# - ESLint (.eslintrc.js)

# System generates contextual questions:
# ✓ Auto-detected: TypeScript project with React
# ✓ Auto-detected: Testing framework (Jest)
# ✓ Auto-detected: Linting setup (ESLint)
# 
# ? Do you follow Test-Driven Development? (Y/n)
# ? Do you use strict TypeScript configuration? (Y/n)
# ? Which state management do you use? (Redux/Zustand/Context/None)
# ? Do you need accessibility guidelines? (Y/n)

# System generates customized guidelines with:
# - TypeScript-specific best practices
# - React component patterns
# - Jest testing strategies
# - Project-specific recommendations

# Output includes:
# ✓ CLAUDE.md - Customized AI instructions
# ✓ README.md - Project documentation
# ✓ .vscode/settings.json - IDE configuration
# ✓ .cursorrules - Cursor AI rules
```

This architecture transforms the tool from a static question-answer system into an intelligent, context-aware guideline generator that understands project characteristics and provides highly relevant, customized development guidelines.
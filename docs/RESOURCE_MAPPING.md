# Resource Mapping Guide

## Overview

The AI Rules Generator uses a three-layer resource system that connects **Questions** → **Configuration** → **Content** → **Output**. This document explains how these resources work together and how to manage them effectively.

## Resource Architecture

```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐    ┌─────────────┐
│  Questions  │ -> │ ProjectConfig│ -> │   Content   │ -> │   Output    │
│   (JSON)    │    │   (Object)   │    │ (Markdown)  │    │ (Multiple)  │
└─────────────┘    └──────────────┘    └─────────────┘    └─────────────┘
```

### 1. Questions Layer (`/src/resources/questions/`)

Interactive questions collect user preferences and transform them into configuration objects.

**Structure:**
```
questions/categories/
├── 01-project.json      # Project type, language
├── 02-philosophy.json   # TDD, architecture approach  
├── 03-tools.json        # ESLint, testing frameworks
├── 04-quality.json      # Accessibility, security
├── 05-infrastructure.json # CI/CD, deployment
└── 06-output.json       # Output format selection
```

**Question Format:**
```json
{
  "category": "project",
  "title": "Project Configuration",
  "description": "Basic project setup and language configuration",
  "order": 1,
  "questions": [
    {
      "id": "projectType",
      "text": "What type of project are you building?",
      "type": "single",
      "options": ["typescript", "javascript", "python", "other"],
      "default": "typescript",
      "required": true
    }
  ]
}
```

### 2. Configuration Layer

Questions are transformed into a structured `ProjectConfig` object that drives content selection.

**Config Structure:**
```typescript
interface ProjectConfig {
  projectType: string;
  philosophy: {
    tdd: boolean;
    strictArchitecture: boolean;
    functionalProgramming: boolean;
  };
  tools: {
    eslint: boolean;
    testing: string[];
  };
  quality: {
    accessibility: boolean;
    security: boolean;
  };
  infrastructure: {
    ci: string;
    deployment: string;
  };
  output: {
    formats: string[];
  };
}
```

### 3. Content Layer (`/src/resources/content/`)

Markdown content files organized by category, selected based on configuration rules.

**Structure:**
```
content/categories/
├── philosophy/
│   ├── tdd.md
│   ├── strict-architecture.md
│   └── functional-programming.md
├── project/
│   └── typescript.md
├── tools/
│   ├── eslint.md
│   └── testing.md
└── quality/
    ├── accessibility.md
    └── security.md
```

### 4. Content Mapping System

The `content-mapping.ts` file defines rules connecting configuration to content files.

**Mapping Rules:**
```typescript
export const contentMapping: Record<string, ContentRule> = {
  tdd: {
    condition: (config) => config.philosophy.tdd,
    contentPath: 'categories/philosophy/tdd.md',
    section: 'philosophy',
    priority: 1
  },
  typescript: {
    condition: (config) => config.projectType === 'typescript',
    contentPath: 'categories/project/typescript.md', 
    section: 'project',
    priority: 2
  },
  eslint: {
    condition: (config) => config.tools.eslint,
    contentPath: 'categories/tools/eslint.md',
    section: 'tools', 
    priority: 3
  }
};
```

## Resource Flow

### 1. Question Collection
```typescript
// QuestionWizard.tsx
const answers = await collectUserAnswers(questionCategories);
const config = transformAnswersToConfig(answers);
```

### 2. Content Selection  
```typescript
// content-mapping.ts
const applicableContent = getApplicableContent(config);
const selectedContent = applicableContent.filter(rule => rule.condition(config));
```

### 3. Content Loading
```typescript
// ContentLoader.ts
const contentSections = await Promise.all(
  selectedContent.map(rule => loadMarkdownFile(rule.contentPath))
);
```

### 4. Output Generation
```typescript
// TemplateEngine.ts
const outputs = {
  claude: generateClaudeInstructions(contentSections),
  vscode: generateVSCodeSettings(contentSections),
  readme: generateReadme(contentSections),
  cursor: generateCursorRules(contentSections)
};
```

## Resource Management

### Adding New Questions

1. **Choose appropriate category file** (`01-project.json` to `06-output.json`)
2. **Add question object** with unique `id`:
   ```json
   {
     "id": "newFeature",
     "text": "Do you want to enable this feature?",
     "type": "boolean",
     "default": false,
     "required": false
   }
   ```
3. **Update config transformation** in `QuestionWizard.tsx`:
   ```typescript
   const config = {
     // ... existing config
     newSection: {
       newFeature: rawAnswers.newFeature ?? false
     }
   };
   ```

### Adding New Content

1. **Create markdown file** in appropriate category directory:
   ```markdown
   # New Feature Guidelines
   
   ## Overview
   Guidelines for the new feature...
   
   ## Implementation
   - Rule 1
   - Rule 2
   ```

2. **Add mapping rule** in `content-mapping.ts`:
   ```typescript
   newFeature: {
     condition: (config) => config.newSection.newFeature,
     contentPath: 'categories/tools/new-feature.md',
     section: 'tools',
     priority: 4
   }
   ```

### Managing Dependencies

**Question Dependencies:**
```json
{
  "id": "advancedFeature",
  "text": "Enable advanced features?",
  "type": "boolean", 
  "dependsOn": "basicFeature", 
  "showWhen": true
}
```

**Content Dependencies:**
```typescript
advancedContent: {
  condition: (config) => config.basic.feature && config.advanced.feature,
  contentPath: 'categories/advanced/content.md',
  section: 'advanced',
  priority: 5,
  requires: ['basic']
}
```

## File Naming Conventions

### Questions
- **Prefix with order number:** `01-`, `02-`, etc.
- **Use kebab-case:** `project-config.json`
- **Category-based naming:** Match directory structure

### Content  
- **Use kebab-case:** `strict-architecture.md`
- **Descriptive names:** Match the feature/concept
- **Category organization:** Group related content in subdirectories

### Mapping Keys
- **Use camelCase:** `strictArchitecture`, `functionalProgramming`
- **Match config properties:** Align with `ProjectConfig` interface
- **Descriptive names:** Clear purpose and scope

## Validation & Testing

### Question Validation
```typescript
// question-schema.json validates structure
const isValid = validateQuestionFile(questionData);
```

### Content Validation
```typescript  
// Ensure all mapped content files exist
const missingFiles = validateContentMapping(contentMapping);
```

### Mapping Validation
```typescript
// Verify all conditions can be evaluated
const invalidRules = validateMappingRules(contentMapping, configSchema);
```

## Current Issues & Improvements Needed

### Known Issues
1. **Hardcoded Paths:** Question loader uses fixed path `'src/resources/questions/categories'`
2. **Error Handling:** Content loading fails silently if files missing
3. **Cache Coordination:** Multiple loaders cache independently
4. **Migration Status:** Some files marked for deletion during restructuring

### Planned Improvements
1. **Dynamic Resource Discovery:** Auto-detect available resources
2. **Centralized Configuration:** Single source for all paths and settings  
3. **Enhanced Error Handling:** Graceful fallbacks and user feedback
4. **Resource Validation:** Comprehensive validation pipeline
5. **CLI Management Tools:** Tools for updating and maintaining mappings

## Migration Status

The project is currently migrating from the old structure:
- **Old:** `/src/content/` and `/src/questions/`  
- **New:** `/src/resources/content/` and `/src/resources/questions/`

Several files are marked for deletion (`D` in git status) as part of this restructuring toward the modular architecture outlined in `CLAUDE.md`.
# Mapping System Design

## Overview

This document outlines the design for an improved resource mapping system that will automate the generation and maintenance of connections between questions, content, and output formats.

## Current State Analysis

### Existing Manual Process
Currently, adding new resources requires manual updates to multiple files:
1. Add question to appropriate JSON file
2. Update `transformAnswersToConfig` in QuestionWizard.tsx
3. Create content markdown file  
4. Add mapping rule to `content-mapping.ts`
5. Update TypeScript interfaces

### Problems with Current Approach
- **Error-prone:** Easy to forget steps or make mistakes
- **No validation:** Missing files or broken rules discovered at runtime
- **Maintenance overhead:** Each new feature requires 4-5 file updates
- **Inconsistent naming:** No enforced conventions across resources

## Proposed Automated Mapping System

### Core Concept: Resource Descriptors

Replace manual mapping with declarative resource descriptor files that define the complete resource lifecycle.

```typescript
// ResourceDescriptor interface
interface ResourceDescriptor {
  id: string;
  name: string;
  category: string;
  section: string;
  priority: number;
  
  // Question definition
  question: {
    text: string;
    type: 'boolean' | 'single' | 'multiple' | 'text';
    options?: string[];
    default?: any;
    required?: boolean;
    dependsOn?: string[];
    showWhen?: any;
  };
  
  // Config mapping
  config: {
    path: string;           // e.g., "philosophy.tdd"
    transform?: string;     // Optional transformation function
  };
  
  // Content specification
  content: {
    path: string;           // e.g., "categories/philosophy/tdd.md"
    condition: string;      // JavaScript expression
    template?: string;      // Optional template override
  };
  
  // Output integration
  output: {
    sections: string[];     // Which output sections to include in
    weight?: number;        // Relative importance in output
  };
  
  // Metadata
  metadata: {
    author: string;
    created: string;
    lastModified: string;
    description: string;
    tags: string[];
  };
}
```

### Resource Descriptor Examples

```yaml
# resources/descriptors/tdd.yaml
id: tdd
name: Test-Driven Development
category: philosophy
section: development-practices
priority: 1

question:
  text: "Do you follow Test-Driven Development (TDD)?"
  type: boolean
  default: true
  required: false

config:
  path: philosophy.tdd
  
content:
  path: categories/philosophy/tdd.md
  condition: config.philosophy.tdd === true
  
output:
  sections: [claude, readme, cursor]
  weight: 8

metadata:
  author: system
  created: 2024-01-01
  lastModified: 2024-01-15
  description: Enables TDD guidelines and practices
  tags: [testing, methodology, quality]
```

```yaml
# resources/descriptors/typescript.yaml  
id: typescript
name: TypeScript Configuration
category: project
section: language-config
priority: 2

question:
  text: "What is your primary programming language?"
  type: single
  options: [typescript, javascript, python, other]
  default: typescript
  required: true

config:
  path: projectType
  transform: string
  
content:
  path: categories/project/typescript.md
  condition: config.projectType === 'typescript'
  
output:
  sections: [claude, vscode, cursor]
  weight: 10

metadata:
  author: system
  created: 2024-01-01
  lastModified: 2024-01-10
  description: TypeScript-specific development guidelines
  tags: [language, typescript, configuration]
```

## Automated Code Generation

### 1. Question File Generation

```typescript
// Generated questions/categories/02-philosophy.json
{
  "category": "philosophy",
  "title": "Development Philosophy", 
  "description": "Choose your development methodology and practices",
  "order": 2,
  "questions": [
    // Auto-generated from descriptors with category="philosophy"
    {
      "id": "tdd",
      "text": "Do you follow Test-Driven Development (TDD)?",
      "type": "boolean",
      "default": true,
      "required": false
    }
  ]
}
```

### 2. Config Interface Generation

```typescript
// Generated types/ProjectConfig.ts
interface ProjectConfig {
  projectType: string;
  philosophy: {
    tdd: boolean;           // Generated from tdd.yaml
    // ... other philosophy options
  };
  // ... other sections
}
```

### 3. Content Mapping Generation

```typescript
// Generated mapping/ContentMapping.ts
export const contentMapping: Record<string, ContentRule> = {
  tdd: {
    condition: (config) => config.philosophy.tdd === true,
    contentPath: 'categories/philosophy/tdd.md',
    section: 'development-practices',
    priority: 1
  },
  // ... other mappings
};
```

### 4. Config Transformation Generation

```typescript
// Generated transformers/ConfigTransformer.ts
export const transformAnswersToConfig = (rawAnswers: Record<string, any>): ProjectConfig => {
  return {
    projectType: rawAnswers.typescript || 'typescript',
    philosophy: {
      tdd: rawAnswers.tdd ?? true,
      // ... other philosophy
    },
    // ... other sections
  };
};
```

## Generator Architecture

### Core Generator Components

```typescript
interface MappingGenerator {
  loadDescriptors(): Promise<ResourceDescriptor[]>;
  validateDescriptors(descriptors: ResourceDescriptor[]): ValidationResult;
  generateQuestions(descriptors: ResourceDescriptor[]): QuestionCategory[];
  generateMapping(descriptors: ResourceDescriptor[]): ContentMapping;
  generateTypes(descriptors: ResourceDescriptor[]): string;
  generateTransformers(descriptors: ResourceDescriptor[]): string;
}
```

### Generator Implementation

```typescript
class ResourceMappingGenerator implements MappingGenerator {
  constructor(
    private descriptorLoader: DescriptorLoader,
    private codeGenerator: CodeGenerator,
    private validator: ResourceValidator
  ) {}

  async generateAll(): Promise<GenerationResult> {
    // 1. Load all resource descriptors
    const descriptors = await this.loadDescriptors();
    
    // 2. Validate descriptor consistency
    const validation = this.validateDescriptors(descriptors);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }
    
    // 3. Generate all derived files
    const questions = this.generateQuestions(descriptors);
    const mapping = this.generateMapping(descriptors);
    const types = this.generateTypes(descriptors);
    const transformers = this.generateTransformers(descriptors);
    
    // 4. Write generated files
    await this.writeGeneratedFiles({
      questions, mapping, types, transformers
    });
    
    return { success: true, generatedFiles: [...] };
  }
}
```

### Validation Rules

```typescript
interface ValidationRule {
  name: string;
  check: (descriptors: ResourceDescriptor[]) => ValidationError[];
}

const validationRules: ValidationRule[] = [
  {
    name: 'unique-ids',
    check: (descriptors) => {
      const ids = descriptors.map(d => d.id);
      const duplicates = ids.filter((id, i) => ids.indexOf(id) !== i);
      return duplicates.map(id => ({ error: `Duplicate ID: ${id}` }));
    }
  },
  {
    name: 'content-files-exist',
    check: async (descriptors) => {
      const errors = [];
      for (const desc of descriptors) {
        const exists = await fs.pathExists(desc.content.path);
        if (!exists) {
          errors.push({ error: `Content file missing: ${desc.content.path}` });
        }
      }
      return errors;
    }
  },
  {
    name: 'valid-config-paths',
    check: (descriptors) => {
      return descriptors
        .filter(d => !isValidConfigPath(d.config.path))
        .map(d => ({ error: `Invalid config path: ${d.config.path}` }));
    }
  }
];
```

## Directory Structure

```
resources/
├── descriptors/              # Resource descriptor files
│   ├── philosophy/
│   │   ├── tdd.yaml
│   │   ├── strict-architecture.yaml
│   │   └── functional-programming.yaml
│   ├── project/
│   │   ├── typescript.yaml
│   │   └── javascript.yaml
│   └── tools/
│       ├── eslint.yaml
│       └── testing.yaml
│
├── generated/               # Auto-generated files (git-ignored)
│   ├── questions/
│   │   └── categories/
│   ├── mapping/
│   │   └── ContentMapping.ts
│   ├── types/
│   │   └── ProjectConfig.ts
│   └── transformers/
│       └── ConfigTransformer.ts
│
├── templates/               # Code generation templates
│   ├── question-category.hbs
│   ├── content-mapping.hbs
│   ├── project-config.hbs
│   └── config-transformer.hbs
│
└── schemas/                 # Validation schemas
    ├── resource-descriptor.json
    └── validation-rules.json
```

## Benefits of New System

### 1. Single Source of Truth
- All resource information defined in one descriptor file
- No need to update multiple files when adding features
- Automatic consistency across all generated artifacts

### 2. Comprehensive Validation
- Validate descriptor syntax and semantics
- Check for missing content files
- Verify config path validity
- Detect naming conflicts and dependencies

### 3. Automated Maintenance
- Generate all derived files from descriptors
- Update generated files when descriptors change
- Maintain consistent naming conventions
- Track resource metadata and relationships

### 4. Developer Experience
- Clear, declarative resource definitions
- Automated code generation reduces errors
- Built-in validation catches issues early
- Easy to add new resources with guided templates

### 5. Scalability
- Support for complex dependencies and conditions
- Extensible descriptor format
- Plugin architecture for custom generators
- Performance optimizations for large resource sets

## Migration Strategy

### Phase 1: Setup Infrastructure
1. Create resource descriptor schema
2. Build basic generator framework
3. Create validation system
4. Set up automated generation pipeline

### Phase 2: Convert Existing Resources
1. Convert current questions to descriptors
2. Convert content mapping to descriptors  
3. Generate all derived files from descriptors
4. Validate generated files match existing behavior

### Phase 3: Enhanced Features
1. Add dependency management
2. Implement conditional logic
3. Add resource metadata tracking
4. Create descriptor editing tools

### Phase 4: Integration
1. Integrate with CLI generation workflow
2. Add hot-reloading for development
3. Create resource management commands
4. Add comprehensive testing suite

This mapping system will transform resource management from a manual, error-prone process into an automated, validated, and maintainable system.
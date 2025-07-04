# Claude Context for AI Rules Generator Project

## Project Overview
A TypeScript/Node.js CLI tool that generates customized LLM instructions and development guidelines based on project configurations. Supports multiple output formats including Claude instructions, VSCode settings, README files, and Cursor rules.

## Key Commands
- `npm run dev` - Start the interactive CLI in development mode
- `npm run build` - Build the TypeScript project to dist/
- `npm start` - Run the built CLI from dist/
- `npm test` - Run the test suite with Vitest
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - Run ESLint on source files
- `npm run lint:fix` - Auto-fix ESLint issues
- `npm run typecheck` - TypeScript type checking without emit

## Current Project Structure
**NOTE**: This structure needs significant architectural improvements (see Architecture Plan below).

```
.
   src/
      cli/                           # CLI interface (Ink/React)
         components/                # React components for CLI
            CLIApp.tsx             # Main app component
            QuestionWizard.tsx     # Question flow controller
            GenerationProgress.tsx # Progress display
            ResultsDisplay.tsx     # Results screen
            [other components]     # Input/UI components
         hooks/
            useGeneration.ts       # Generation state management
         index.tsx                  # CLI entry point
   
      core/                          # Core business logic
         concept-mapper/            # Concept selection logic
            concept-rules.ts       # Rules for concept application
         question-engine/           # Interactive questions
            questions.ts           # Question definitions
         template-engine/           # File generation
            TemplateEngine.ts      # Main template processor
            FileGenerator.ts       # File writing logic
         config-validator/          # Configuration validation
            ConfigLoader.ts        # Config loading/validation
         types.ts                   # Core type definitions
   
      ui/                            # (Currently empty)

   output/                            # Generated files directory
   templates/                         # Template files (if any)
   docs/                              # Documentation
   tests/                             # Test files
   dist/                              # Built output
   package.json                       # Dependencies and scripts
```

## Architectural Issues & Improvement Plan

### Current Problems
1. **Hardcoded File Paths**: Absolute path to concepts directory hardcoded in useGeneration.ts
2. **Mixed Concerns**: UI logic mixed with business logic in hooks
3. **Poor Error Handling**: Limited error handling and recovery
4. **No Configuration Management**: Settings scattered throughout codebase
5. **Limited Testing**: Minimal test coverage
6. **Monolithic Components**: Large components with multiple responsibilities
7. **No Module Boundaries**: Unclear separation between core and UI logic
8. **Resource Discovery**: No dynamic discovery of concept files

### Proposed Modular Architecture

```
.
   config/                            # Application configuration
      app.json                       # App settings (version, features)
      paths.json                     # File paths and directories
      formats.json                   # Output format configurations
      defaults.json                  # Default values for all systems
      development.json               # Development overrides

   locales/                           # Internationalization
      en/
          messages.json              # UI messages
          questions.json             # Question text
          errors.json                # Error messages

   src/
      core/                          # Core business logic modules
         discovery/                 # Resource discovery
            __tests__/             # Discovery tests
            __mocks__/             # Mock file systems
            README.md              # Module documentation
            config.js              # Discovery configuration
            index.ts               # Public API exports
            ConceptDiscovery.ts    # Concept file discovery
            PathResolver.ts        # Path resolution logic
            DiscoveryTypes.ts      # Discovery type definitions
      
         concepts/                  # Concept management
            __tests__/
            __mocks__/
            README.md
            config.js
            index.ts
            ConceptManager.ts      # Concept loading and caching
            ConceptMapper.ts       # Rule-based concept selection
            ConceptValidator.ts    # Concept file validation
            ConceptTypes.ts        # Concept type definitions
      
         questions/                 # Question engine
            __tests__/
            __mocks__/
            README.md
            config.js
            index.ts
            QuestionEngine.ts      # Question flow logic
            QuestionLoader.ts      # Dynamic question loading
            AnswerValidator.ts     # Answer validation
            QuestionTypes.ts       # Question type definitions
      
         generation/                # Content generation
            __tests__/
            __mocks__/
            README.md
            config.js
            index.ts
            GenerationEngine.ts    # Main generation orchestrator
            TemplateProcessor.ts   # Template processing logic
            ContentBuilder.ts      # Content assembly logic
            GenerationTypes.ts     # Generation type definitions
      
         output/                    # Output management
            __tests__/
            __mocks__/
            README.md
            config.js
            index.ts
            OutputManager.ts       # Output coordination
            FileWriter.ts          # File writing logic
            FormatProcessor.ts     # Format-specific processing
            OutputTypes.ts         # Output type definitions
      
         validation/                # Configuration validation
             __tests__/
             __mocks__/
             README.md
             config.js
             index.ts
             ConfigValidator.ts     # Configuration validation
             SchemaDefinitions.ts   # Validation schemas
             ValidationTypes.ts     # Validation type definitions
   
      services/                      # Cross-module services
         config/                    # Configuration management
            __tests__/
            __mocks__/
            README.md
            config.js
            index.ts
            ConfigService.ts       # Centralized configuration
            EnvironmentConfig.ts   # Environment-specific config
            ConfigTypes.ts         # Configuration type definitions
      
         logger/                    # Centralized logging
            __tests__/
            __mocks__/
            README.md
            config.js
            index.ts
            Logger.ts              # Main logger implementation
            LoggerFactory.ts       # Logger instance management
            LoggerTypes.ts         # Logging type definitions
      
         cache/                     # Caching layer
            __tests__/
            __mocks__/
            README.md
            config.js
            index.ts
            CacheManager.ts        # Cache management
            MemoryCache.ts         # In-memory caching
            CacheTypes.ts          # Cache type definitions
      
         events/                    # Event management
             __tests__/
             __mocks__/
             README.md
             config.js
             index.ts
             EventBus.ts            # Event communication
             EventTypes.ts          # Event type definitions
             EventHandlers.ts       # Event handler utilities
   
      ui/                            # User interface modules
         cli/                       # CLI interface
            __tests__/
            __mocks__/
            README.md
            config.js
            index.ts
            CLIApplication.tsx     # Main CLI app controller
            CLIRouter.tsx          # Screen routing logic
            CLITypes.ts            # CLI type definitions
      
         screens/                   # CLI screens
            __tests__/
            __mocks__/
            README.md
            config.js
            index.ts
            WelcomeScreen.tsx      # Welcome/intro screen
            QuestionScreen.tsx     # Question display screen
            ProgressScreen.tsx     # Generation progress
            ResultsScreen.tsx      # Results display
            ScreenTypes.ts         # Screen type definitions
      
         components/                # Reusable UI components
            __tests__/
            __mocks__/
            README.md
            config.js
            index.ts
            forms/                 # Form input components
            display/               # Display components
            navigation/            # Navigation components
            ComponentTypes.ts      # Component type definitions
      
         hooks/                     # React hooks
             __tests__/
             __mocks__/
             README.md
             config.js
             index.ts
             useGeneration.ts       # Generation state hook
             useConfiguration.ts    # Configuration hook
             useQuestions.ts        # Question flow hook
             HookTypes.ts           # Hook type definitions
   
      utils/                         # Pure utility functions
         file-system/               # File system utilities
            __tests__/
            path-utils.ts
            file-utils.ts
            directory-utils.ts
      
         validation/                # Validation utilities
            __tests__/
            schema-utils.ts
            type-guards.ts
            sanitization.ts
      
         formatting/                # Formatting utilities
             __tests__/
             text-formatting.ts
             json-formatting.ts
             date-formatting.ts
   
      index.ts                       # Main application entry point

   scripts/                           # Development and build scripts
      build/                         # Build scripts
      test/                          # Testing scripts
      dev/                           # Development utilities

   output/                            # Generated files directory
   README.md                          # Project documentation
```

## Architecture Principles

### Self-Contained Module Structure
Each functional domain is organized as a self-contained module with all related files in a dedicated folder.

#### Module Structure Elements
Each module folder must contain:
- `__tests__/`: All test files related to the module
- `__mocks__/`: Mock data and service mocks for testing
- `README.md`: Documentation on module purpose, usage, and API
- `config.js`: Module-specific configuration (optional)
- `index.ts`: Public API exports that define what's accessible from outside
- `ModuleName.ts`: Main implementation
- `ModuleTypes.ts`: TypeScript type definitions

#### Self-Containment Rules
- **Everything related to a module stays in one location**
- **Clear public APIs**: Each module exports a clean API via `index.ts`
- **Configuration separation**: Module-specific config in `config.js`
- **Dependency injection**: Modules receive dependencies rather than creating them
- **No cross-module imports**: Modules only import from `services/` or `utils/`

### Configuration Management System

#### Centralized Configuration Architecture
All application settings centralized in JSON configuration files with type-safe access.

**Configuration Service Features:**
- **Type-Safe Access**: TypeScript interfaces for all configuration sections
- **Environment Overrides**: Support for development/production configuration differences
- **Runtime Configuration**: Dynamic configuration changes without restarts
- **Validation**: Built-in configuration validation with error reporting
- **Path Resolution**: Dynamic path resolution based on environment

**Usage Patterns:**
```typescript
// Access configuration sections
const pathConfig = configService.get('paths');
const formatConfig = configService.get('formats');

// Get specific values with defaults
const conceptsPath = configService.getPath('concepts', './concepts');
const outputPath = configService.getPath('output', './output');

// Environment-specific behavior
if (configService.isDevelopment()) {
  // Enable development features
}
```

### Discovery and Resource Management

#### Dynamic Resource Discovery
Replace hardcoded paths with dynamic discovery of concept files and resources.

**Discovery Features:**
- **Concept File Discovery**: Automatically find and index all concept files
- **Path Resolution**: Resolve relative paths based on project structure
- **Resource Validation**: Validate discovered resources for completeness
- **Caching**: Cache discovered resources for performance

**Discovery Patterns:**
```typescript
// Discover concept files
const conceptDiscovery = new ConceptDiscovery(configService);
const concepts = await conceptDiscovery.discoverConcepts();

// Resolve paths dynamically
const pathResolver = new PathResolver(configService);
const conceptsPath = pathResolver.resolveConceptsPath();
```

## Testing Strategy

### Test-Driven Development (TDD)
- **MUST follow TDD**: Write a failing test first, then write minimal code to make it pass
- Write one failing unit test at a time
- Only write enough production code to make the current test pass
- Refactor only after tests are passing
- All new features and bug fixes require tests first

### Testing Framework & Configuration
- **Vitest Framework**: Fast unit testing with ES modules support
- **Coverage Reporting**: HTML, LCOV, and text formats enabled
- **Coverage Targets**: Minimum 90% line coverage for core modules, 80% for UI
- **Test Location**: Co-located with source code in `__tests__/` folders

### Testing Priorities by Module

**HIGH PRIORITY (Core Functionality)**
1. **core/concepts/ConceptManager.ts** - Concept loading and caching
2. **core/discovery/ConceptDiscovery.ts** - Resource discovery logic
3. **core/generation/GenerationEngine.ts** - Main generation orchestrator
4. **core/output/OutputManager.ts** - Output coordination and file writing
5. **services/config/ConfigService.ts** - Configuration management

**MEDIUM PRIORITY (Services & Processing)**
6. **core/questions/QuestionEngine.ts** - Question flow logic
7. **core/validation/ConfigValidator.ts** - Configuration validation
8. **services/logger/Logger.ts** - Centralized logging
9. **services/cache/CacheManager.ts** - Caching layer
10. **core/output/FormatProcessor.ts** - Format-specific processing

**LOW PRIORITY (UI & Supporting Features)**
11. **ui/screens/QuestionScreen.tsx** - Question display logic
12. **ui/hooks/useGeneration.ts** - Generation state management
13. **utils/file-system/file-utils.ts** - File system utilities
14. **ui/components/forms/** - Form input components

### Testing Patterns & Standards

**Mock Strategy**
- **External Dependencies**: Mock all external dependencies (file system, external APIs)
- **Mock Files**: Store mocks in `__mocks__/` folders alongside tests
- **Shared Mocks**: Common mocks available across modules
- **Dependency Injection**: Design modules to accept dependencies for easier testing

**Test Structure Requirements**
```typescript
describe('ModuleName', () => {
  let module: ModuleName;
  let mockDependencies: MockDependencies;

  beforeEach(() => {
    mockDependencies = createMockDependencies();
    module = new ModuleName(mockDependencies);
  });

  describe('method_name', () => {
    test('should handle success case', () => {
      // Test successful operation
    });

    test('should handle error case', () => {
      // Test error conditions
    });

    test('should validate inputs', () => {
      // Test input validation
    });
  });
});
```

## Code Quality Guidelines

### TypeScript Standards
- **Strict Mode**: Use TypeScript strict mode for all modules
- **Type Safety**: Comprehensive type definitions for all interfaces
- **No Any Types**: Avoid `any` type usage - use proper type definitions
- **Null Safety**: Proper null/undefined handling with strict null checks

### File Organization
- **Keep files small and focused**: Aim for under 300 lines per file
- Each file should have a single responsibility
- Split large files into smaller, more focused modules
- Use clear, descriptive file names that indicate purpose

### Import/Export Discipline
- **Clear module boundaries**: Only import from designated public APIs
- **Barrel exports**: Use index.ts files for clean public APIs
- **No circular dependencies**: Design modules to avoid circular imports
- **Dependency direction**: Core modules should not depend on UI modules

### Error Handling
- **Comprehensive error handling**: All operations should handle potential failures
- **Typed errors**: Use custom error types for different error categories
- **Error recovery**: Provide graceful fallbacks where possible
- **User-friendly messages**: Convert technical errors to user-friendly messages

## Logging Requirements

All console output must use the centralized Logger Service:

- **Use Logger Service**: Import and use logger functions from `services/logger/`
- **No Direct Console**: Never use `console.log`, `console.error`, `console.warn` directly
- **Appropriate Log Levels**: Use correct log levels for different types of output
- **Structured Data**: Pass additional data as second parameter for structured logging

**Required Logging Patterns:**
```typescript
// CORRECT: Use Logger Service
import { logger } from '../services/logger';

logger.debug('Concept discovery starting', { path: conceptsPath });
logger.info('Generation completed successfully');
logger.warn('Invalid concept file found', { file: conceptFile });
logger.error('Generation failed', { error: err.message });

// INCORRECT: Direct console usage
console.log('Generation started');
console.error('Error occurred');
```

## Migration Strategy

### Phase 1: Foundation Setup (Week 1)
- [ ] Create modular folder structure following architecture plan
- [ ] Set up comprehensive configuration management system
- [ ] Create centralized logger service (replace all console usage)
- [ ] Set up testing framework with proper coverage reporting
- [ ] Extract all hardcoded values to configuration files

### Phase 2: Core Module Migration (Week 2)
- [ ] Create discovery module for dynamic resource finding
- [ ] Migrate concept management to dedicated module
- [ ] Create generation engine with proper separation of concerns
- [ ] Create output management module
- [ ] Add comprehensive tests for all core modules

### Phase 3: Service Layer (Week 3)
- [ ] Create configuration service with type-safe access
- [ ] Create caching layer for performance optimization
- [ ] Create event system for module communication
- [ ] Create validation service with comprehensive schemas
- [ ] Add integration tests for service interactions

### Phase 4: UI Refactoring (Week 4)
- [ ] Split CLI components into focused, single-responsibility modules
- [ ] Create screen-based navigation system
- [ ] Create reusable component library
- [ ] Create custom hooks for state management
- [ ] Add UI component testing with React Testing Library

### Phase 5: Testing & Documentation (Week 5)
- [ ] Achieve 90% test coverage on core modules
- [ ] Achieve 80% test coverage on UI components
- [ ] Create comprehensive documentation for each module
- [ ] Set up automated testing pipeline
- [ ] Performance optimization and code review

## Benefits of New Architecture

1. **Maintainability**: Clear separation of concerns makes code changes predictable
2. **Testability**: Isolated modules with dependency injection enable thorough testing
3. **Scalability**: Modular structure supports adding new features easily
4. **Reusability**: Self-contained modules can be reused across projects
5. **Type Safety**: Comprehensive TypeScript coverage prevents runtime errors
6. **Configuration**: Centralized configuration management supports different environments
7. **Performance**: Caching and optimization strategies built into architecture
8. **Developer Experience**: Clear APIs and documentation improve development velocity

This architectural transformation will evolve the AI Rules Generator from a basic CLI tool into a robust, enterprise-grade system for generating customized development guidelines.

## Important Notes
- This tool generates development guidelines and instructions for AI assistants
- Supports multiple output formats (Claude instructions, VSCode settings, README, Cursor rules)
- Uses concept-based approach for modular guideline assembly
- Interactive CLI interface built with Ink (React for CLI)
- TypeScript-first with comprehensive type safety

## Dependencies
- **ink**: React-based CLI interface framework
- **commander**: Command-line interface utilities
- **chalk**: Terminal text styling
- **fs-extra**: Enhanced file system operations
- **zod**: TypeScript-first schema validation
- **yaml**: YAML parsing and generation
- **vitest**: Fast unit testing framework
- **tsx**: TypeScript execution for development

## Recent Changes
- Fixed TypeScript compilation errors in TemplateEngine
- Added output directory for generated files
- Implemented fallback file generation when no formats selected
- Fixed ES modules compatibility issues (top-level await, __dirname)
- Created comprehensive architectural improvement plan
- Identified need for dynamic resource discovery system
- Outlined modular architecture following self-contained module principles
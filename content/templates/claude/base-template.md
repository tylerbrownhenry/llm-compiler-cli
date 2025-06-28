---
id: "claude-base-template"
name: "Claude Instructions Base Template"
format: "claude"
version: "1.0.0"
description: "Base template for generating Claude AI assistant instructions"
sections:
  - "header"
  - "project-overview" 
  - "philosophy"
  - "concepts"
  - "guidelines"
  - "footer"
variables:
  project_name: "Project name"
  project_type: "Project type (web, api, library, etc.)"
  generated_date: "Generation timestamp"
  concepts_used: "List of applied concepts"
  config: "Full project configuration"
created: "2024-06-28"
updated: "2024-06-28"
---

# Claude Context for {{project_name}}

## Project Overview
{{project_overview}}

## Key Commands
{{key_commands}}

## Project Structure
**NOTE**: If any files are created, deleted, or moved, please update this architecture section to reflect the current project structure.

{{project_structure}}

## Core Development Philosophy

{{#if philosophy.tdd}}
### Test-Driven Development (TDD)
- **MUST follow TDD**: Write a failing test first, then write minimal code to make it pass
- Write one failing unit test at a time
- Only write enough production code to make the current test pass
- Refactor only after tests are passing
- All new features and bug fixes require tests first
{{/if}}

{{#if philosophy.strictArchitecture}}
### Strictly Enforced Architecture
- **Self-Contained Module Structure**: Each functional domain organized as a self-contained module
- **Clear public APIs**: Each module exports a clean API via index files
- **Configuration separation**: Module-specific config externalized
- **Dependency injection**: Modules receive dependencies rather than creating them
- **No cross-module imports**: Modules only import from designated service layers
{{/if}}

{{#if philosophy.functionalProgramming}}
### Functional Programming Principles
- **Immutable Data**: Prefer immutable data structures and pure functions
- **Side Effect Management**: Isolate and minimize side effects
- **Composition**: Build complex behavior through function composition
- **Type Safety**: Leverage type systems for correctness guarantees
{{/if}}

## Technical Guidelines

{{#each concepts}}
### {{this.metadata.name}}
{{this.content}}

{{/each}}

## Code Quality Standards

{{#if tools.eslint}}
### ESLint Configuration
- Follow project ESLint rules strictly
- No ESLint warnings or errors allowed in commits
- Use ESLint auto-fix where possible
- Extend rules for project-specific patterns
{{/if}}

{{#if tools.testing}}
### Testing Requirements
{{#each tools.testing}}
- **{{this}}**: {{get_testing_description this}}
{{/each}}
- Minimum test coverage: {{quality.testCoverage}}%
- Test all edge cases and error scenarios
- Use descriptive test names that explain behavior
{{/if}}

## Development Workflow

{{#if infrastructure.cicd}}
### CI/CD Pipeline
- All commits trigger automated builds
- Tests must pass before merging
- Automated deployment from main branch
- Quality gates enforced at each stage
{{/if}}

{{#if quality.codeReview}}
### Code Review Process
- All changes require peer review
- No self-merging of pull requests
- Address all review comments before merging
- Focus on logic, security, and maintainability
{{/if}}

## Important Notes
- {{project_type}} project with {{#each tools.primary}}{{this}}{{#unless @last}}, {{/unless}}{{/each}}
- Generated on {{generated_date}}
- Concepts applied: {{#each concepts_used}}{{this}}{{#unless @last}}, {{/unless}}{{/each}}

## Dependencies
{{dependencies}}

## Recent Changes
{{recent_changes}}
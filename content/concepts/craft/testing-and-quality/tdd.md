---
id: "tdd"
name: "Test-Driven Development (TDD)"
category: "craft"
subcategory: "testing-and-quality"
priority: 1
dependencies: ["testing-principles"]
conflicts: []
applicable_to:
  languages: ["typescript", "javascript", "python", "java", "csharp", "go", "rust"]
  frameworks: ["react", "express", "fastapi", "spring", "aspnet", "gin"]
  project_types: ["web", "api", "library", "cli", "mobile"]
triggers:
  - philosophy_tdd: true
  - has_testing_framework: true
  - project_complexity: "medium"
weight: 15
description: "Core TDD principles and practices for test-first development"
tags: ["testing", "methodology", "quality", "practices"]
version: "1.0.0"
author: "AI Rules Generator"
created: "2024-06-28"
updated: "2024-06-28"
---

# Test-Driven Development (TDD)

## Core Philosophy

Test-Driven Development is a software development methodology where tests are written before the actual implementation. This approach ensures that code is thoroughly tested, maintainable, and meets requirements from the start.

## The Red-Green-Refactor Cycle

Follow this fundamental TDD cycle for all development:

1. **Red**: Write a failing test for the desired functionality
2. **Green**: Write minimal code to make the test pass
3. **Refactor**: Improve code quality while keeping tests green

## Implementation Guidelines

### Test-First Development
- Write tests before implementing functionality
- Each feature should have corresponding unit tests
- Tests should be isolated and not depend on external services
- Use descriptive test names that explain what is being tested

### Code Quality Standards
- Test coverage should be maintained above 80%
- Mock external dependencies and services
- Test edge cases and error scenarios, not just happy paths
- Run all tests before committing code

### Best Practices
- Keep tests simple and focused on a single behavior
- Write tests that are easy to read and understand
- Ensure tests fail for the right reasons
- Refactor tests alongside production code
- Use test doubles (mocks, stubs, fakes) appropriately

## Testing Strategy

### Unit Testing
- Test individual functions/methods in isolation
- Mock all external dependencies
- Focus on behavior rather than implementation details
- Aim for fast execution (< 100ms per test)

### Integration Testing
- Test interactions between components
- Use real dependencies where practical
- Test critical user workflows end-to-end
- Validate system boundaries and contracts

### Test Organization
- Group related tests in describe blocks
- Use clear, descriptive test names
- Follow AAA pattern: Arrange, Act, Assert
- Keep test setup and teardown minimal

## Language-Specific Considerations

### TypeScript/JavaScript
- Use Jest, Vitest, or similar testing frameworks
- Leverage TypeScript's type system for better test safety
- Use factory functions for test data creation
- Consider using MSW for API mocking

### Python
- Use pytest for flexible test discovery and fixtures
- Leverage unittest.mock for mocking dependencies
- Use hypothesis for property-based testing
- Consider using factory_boy for test data

### Java
- Use JUnit 5 for modern testing features
- Leverage Mockito for mocking
- Use AssertJ for fluent assertions
- Consider using TestContainers for integration tests

## Common Anti-Patterns to Avoid

- Writing tests after implementation (test-last)
- Testing implementation details instead of behavior
- Creating tests that are too complex or hard to understand
- Ignoring failing tests or disabling them
- Not refactoring tests alongside production code
- Over-mocking or under-mocking dependencies

## Metrics and Success Criteria

### Code Coverage
- Maintain minimum 80% line coverage
- Aim for 90%+ branch coverage on critical paths
- Track coverage trends over time
- Don't sacrifice test quality for coverage numbers

### Test Quality Indicators
- Tests should run quickly (full suite < 5 minutes)
- Low test flakiness (< 1% failure rate)
- Clear test failure messages
- Minimal test maintenance overhead

## Integration with Development Workflow

### Pre-commit Hooks
- Run all tests before allowing commits
- Fail builds on test failures
- Include linting and formatting checks
- Validate test coverage thresholds

### Continuous Integration
- Run tests on every pull request
- Block merges on test failures
- Generate coverage reports
- Run tests across multiple environments

### Code Review Process
- Review tests alongside production code
- Ensure new features include tests
- Validate test quality and coverage
- Check for proper mocking strategies

## Benefits

- **Quality Assurance**: Catches bugs early in development
- **Design Improvement**: Forces consideration of API design
- **Documentation**: Tests serve as living documentation
- **Confidence**: Enables safe refactoring and changes
- **Maintainability**: Reduces technical debt over time

## Getting Started

1. Choose appropriate testing framework for your language
2. Set up test runner and coverage tools
3. Write your first failing test
4. Implement minimal code to pass
5. Refactor and repeat
6. Gradually increase coverage and test sophistication

## Resources

- [Test-Driven Development: By Example](https://www.oreilly.com/library/view/test-driven-development/0321146530/) by Kent Beck
- [Growing Object-Oriented Software, Guided by Tests](https://www.oreilly.com/library/view/growing-object-oriented-software/9780321574442/)
- [The Art of Unit Testing](https://www.manning.com/books/the-art-of-unit-testing-third-edition)
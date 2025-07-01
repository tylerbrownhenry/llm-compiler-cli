# Development Guidelines for My Projectaaaaaa

## Development Philosophy

## Core Development Philosophy

### Test-Driven Development (TDD)
- **ALWAYS write tests before implementation code**
- Follow the Red-Green-Refactor cycle:
  1. **Red**: Write a failing test first
  2. **Green**: Write minimal code to make the test pass
  3. **Refactor**: Clean up code while keeping tests green
- Test behavior, not implementation details
- Keep tests simple, focused, and readable

### Strict Architecture
- Maintain clear separation of concerns
- Follow layered architecture patterns (controllers, services, repositories)
- Enforce module boundaries and dependencies
- Use dependency injection for loose coupling

### Functional Programming
- Prefer pure functions with no side effects
- Use immutable data structures
- Avoid mutations, use spread operators or library helpers
- Compose functions rather than using classes when possible

## Language-Specific Guidelines

## Language-Specific Guidelines

### TypeScript Standards
- Use TypeScript strict mode
- Never use `any` type - define proper interfaces
- Prefer explicit return types for functions
- Use type guards for runtime type checking
- Implement comprehensive error handling with typed errors

## Development Tools & Quality

### Code Quality
- Follow ESLint rules strictly
- Use consistent formatting with Prettier
- Keep functions small and focused (single responsibility)
- Use descriptive variable and function names

### Testing Guidelines
- Use vitest and react-testing-library for testing

- Follow TDD practices: write tests first

- Aim for high test coverage (>90% for critical paths)
- Use descriptive test names that explain behavior
- Mock external dependencies appropriately

Generated on 6/30/2025 for typescript project
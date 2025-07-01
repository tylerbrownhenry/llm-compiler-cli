# Roo Code Instructions for My Projectaaaaaa

## Project Configuration
```yaml
project:
  name: "My Projectaaaaaa"
  type: typescript
  tdd: true
  strict_architecture: true
  functional_programming: true
```

## Generation Rules

### Development Philosophy Rules
- Generate code that **always write tests before implementation code**
- Generate code that follow the red-green-refactor cycle:
- Generate code that test behavior, not implementation details
- Generate code that keep tests simple, focused, and readable
- Generate code that maintain clear separation of concerns
- Generate code that follow layered architecture patterns (controllers, services, repositories)
- Generate code that enforce module boundaries and dependencies
- Generate code that use dependency injection for loose coupling
- Generate code that prefer pure functions with no side effects
- Generate code that use immutable data structures
- Generate code that avoid mutations, use spread operators or library helpers
- Generate code that compose functions rather than using classes when possible

### Language-Specific Guidelines Rules
- Generate code that use typescript strict mode
- Generate code that never use `any` type - define proper interfaces
- Generate code that prefer explicit return types for functions
- Generate code that use type guards for runtime type checking
- Generate code that implement comprehensive error handling with typed errors

### Development Tools & Quality Rules
- Generate code that follow eslint rules strictly
- Generate code that use consistent formatting with prettier
- Generate code that keep functions small and focused (single responsibility)
- Generate code that use descriptive variable and function names
- Generate code that use vitest and react-testing-library for testing
- Generate code that follow tdd practices: write tests first
- Generate code that aim for high test coverage (>90% for critical paths)
- Generate code that use descriptive test names that explain behavior
- Generate code that mock external dependencies appropriately

# Generated on 6/30/2025
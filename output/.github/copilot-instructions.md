# GitHub Copilot Instructions for My Project

This file provides specific instructions for GitHub Copilot to follow when working on this project.

## Project Context
- **Language**: typescript
- **Architecture**: Strict
- **Testing Approach**: Test-Driven Development
- **UI Framework**: react

## Code Generation Preferences

### TypeScript Guidelines
- Always use strict TypeScript settings
- Prefer explicit return types for functions
- Use proper type definitions, avoid `any`
- Implement type guards for runtime checks

### Testing Requirements
- Generate tests alongside implementation code
- Follow Red-Green-Refactor cycle
- Use descriptive test names that explain behavior
- Use vitest and react-testing-library for testing

### Functional Programming
- Prefer pure functions with no side effects
- Use immutable data structures
- Avoid mutations, use spread operators or library helpers
- Compose functions rather than using classes when possible

### Code Style
- Follow ESLint rules configured for this project
- Use descriptive variable and function names
- Keep functions small and focused (single responsibility)
- Add JSDoc comments for complex functions

### Code Quality Guidelines
#### Typescript Standards
# Project Guidelines: TypeScript Usage and Standards

- Use TypeScript strict mode with all strict flags enabled.
- Avoid using `any` type; use `unknown` when type is truly unknown.
- Define explicit return types for all functions.
- Use interfaces for object shapes and types for unions/primitives.
- Leverage TypeScript's type inference where it improves readability.
- Create type definitions for all API responses and requests.
- Use enums for fixed sets of values, const assertions for literals.
- Implement proper error types instead of throwing plain strings.
- Utilize generics to create reusable, type-safe components.
- Use type guards and discriminated unions for runtime type checking.
- Keep type definitions close to their usage, preferably in the same file.
- Document complex types with JSDoc comments.
- Run type checking as part of the build process.

#### Typescript Guidelines
# TypeScript Guidelines

## Strict Mode Requirements
```typescript
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

## Type Safety Rules
- No `any` - ever. Use `unknown` if type is truly unknown
- No type assertions (`as SomeType`) without clear justification
- No `@ts-ignore` or `@ts-expect-error` without explicit explanation
- These rules apply to test code as well

## Type Definitions
- Prefer `type` over `interface` in all cases
- Use explicit typing where it aids clarity
- Leverage inference where appropriate
- Utilize utility types effectively (Pick, Omit, Partial, Required)
- Create domain-specific branded types:

```typescript
type UserId = string & { readonly brand: unique symbol };
type PaymentAmount = number & { readonly brand: unique symbol };
```

## Schema-First Development
```typescript
import { z } from "zod";

// Define schemas first
const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(1),
});

// Derive types from schemas
type User = z.infer<typeof UserSchema>;

// Use schemas at runtime boundaries
export const parseUser = (data: unknown): User => {
  return UserSchema.parse(data);
};
```

## Schema Usage in Tests
**CRITICAL**: Import real schemas from production code, never redefine:

```typescript
// ✅ CORRECT
import { UserSchema, type User } from "@app/schemas";

// ❌ WRONG
const UserSchema = z.object({ ... }); // Don't redefine!
```

#### Exception Handling
# Project Guidelines: Exception Handling Standards

- Implement consistent error handling across the application.
- Use try-catch blocks for operations that might fail.
- Create custom error classes for different error types.
- Include meaningful error messages and error codes.
- Log errors with appropriate severity levels (error, warn, info).
- Never expose sensitive information in error messages.
- Implement global error boundaries in React applications.
- Handle async errors with proper Promise rejection handling.
- Provide user-friendly error messages in the UI.
- Implement retry logic for transient failures.
- Use error monitoring services in production (Sentry, etc.).
- Document expected errors and their handling strategies.
- Always clean up resources in finally blocks.

Generated on 6/29/2025
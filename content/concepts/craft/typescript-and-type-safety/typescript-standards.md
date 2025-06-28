---
id: "typescript-standards"
name: "TypeScript Standards & Best Practices"
category: "craft"
subcategory: "typescript-and-type-safety"
priority: 2
dependencies: []
conflicts: []
applicable_to:
  languages: ["typescript"]
  frameworks: ["react", "express", "nextjs", "nestjs", "angular", "vue"]
  project_types: ["web", "api", "library", "cli"]
triggers:
  - language_typescript: true
  - strict_architecture: true
weight: 12
description: "TypeScript usage standards, type safety practices, and configuration guidelines"
tags: ["typescript", "types", "safety", "standards"]
version: "1.0.0"
author: "AI Rules Generator"
created: "2024-06-28"
updated: "2024-06-28"
---

# TypeScript Standards & Best Practices

## Core Principles

TypeScript should be used to its full potential to catch errors at compile time, improve code documentation, and enhance developer experience through superior tooling support.

## TypeScript Configuration

### Strict Mode Requirements
Always use TypeScript strict mode with all strict flags enabled:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

### Essential Compiler Options
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  }
}
```

## Type System Best Practices

### Type vs Interface Usage
- **Use interfaces** for object shapes and extensible contracts
- **Use types** for unions, primitives, and computed types

```typescript
// ✅ Good: Interface for object shape
interface User {
  id: string;
  name: string;
  email: string;
}

// ✅ Good: Type for union
type Status = 'pending' | 'approved' | 'rejected';

// ✅ Good: Type for computed/complex types
type UserWithStatus = User & { status: Status };
```

### Avoiding `any` Type
Never use `any` type. Use appropriate alternatives:

```typescript
// ❌ Bad
function processData(data: any): any {
  return data.someProperty;
}

// ✅ Good: Use unknown when type is truly unknown
function processData(data: unknown): unknown {
  if (typeof data === 'object' && data !== null && 'someProperty' in data) {
    return (data as { someProperty: unknown }).someProperty;
  }
  throw new Error('Invalid data structure');
}

// ✅ Better: Use generics for reusable type-safe functions
function processData<T extends { someProperty: unknown }>(data: T): T['someProperty'] {
  return data.someProperty;
}
```

### Explicit Return Types
Define explicit return types for all functions, especially public APIs:

```typescript
// ✅ Good: Explicit return type
function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// ✅ Good: Async function with explicit return type
async function fetchUser(id: string): Promise<User | null> {
  const response = await fetch(`/api/users/${id}`);
  if (!response.ok) return null;
  return response.json() as User;
}
```

## Advanced Type Patterns

### Generic Constraints
Use generic constraints to create reusable, type-safe components:

```typescript
// ✅ Good: Generic with constraints
interface Repository<T extends { id: string }> {
  findById(id: string): Promise<T | null>;
  save(entity: T): Promise<T>;
  delete(id: string): Promise<void>;
}

// ✅ Usage
class UserRepository implements Repository<User> {
  async findById(id: string): Promise<User | null> {
    // Implementation
  }
}
```

### Discriminated Unions
Use discriminated unions for type-safe state management:

```typescript
// ✅ Good: Discriminated union
type AsyncState<T> = 
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string };

function handleState<T>(state: AsyncState<T>) {
  switch (state.status) {
    case 'idle':
      return 'No operation started';
    case 'loading':
      return 'Loading...';
    case 'success':
      return `Data: ${JSON.stringify(state.data)}`;
    case 'error':
      return `Error: ${state.error}`;
  }
}
```

### Type Guards
Implement type guards for runtime type checking:

```typescript
// ✅ Good: Type guard function
function isUser(obj: unknown): obj is User {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'name' in obj &&
    'email' in obj &&
    typeof (obj as User).id === 'string' &&
    typeof (obj as User).name === 'string' &&
    typeof (obj as User).email === 'string'
  );
}

// ✅ Usage
function processUserData(data: unknown) {
  if (isUser(data)) {
    // TypeScript knows data is User here
    console.log(data.name);
  } else {
    throw new Error('Invalid user data');
  }
}
```

## API and Data Types

### API Response Types
Create comprehensive type definitions for all API interactions:

```typescript
// ✅ Good: API response types
interface ApiResponse<T> {
  data: T;
  status: 'success' | 'error';
  message?: string;
  timestamp: string;
}

interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasNext: boolean;
  };
}

// ✅ Usage
async function fetchUsers(page: number): Promise<PaginatedResponse<User>> {
  const response = await fetch(`/api/users?page=${page}`);
  return response.json() as PaginatedResponse<User>;
}
```

### Error Types
Implement proper error types instead of throwing plain strings:

```typescript
// ✅ Good: Custom error types
class ValidationError extends Error {
  constructor(
    message: string,
    public field: string,
    public code: string
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public endpoint: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// ✅ Usage with typed error handling
function validateEmail(email: string): string {
  if (!email.includes('@')) {
    throw new ValidationError('Invalid email format', 'email', 'INVALID_FORMAT');
  }
  return email;
}
```

## Documentation and Maintenance

### JSDoc Integration
Document complex types and functions with JSDoc:

```typescript
/**
 * Calculates the compound interest for an investment
 * @param principal - Initial investment amount in dollars
 * @param rate - Annual interest rate as a decimal (0.05 for 5%)
 * @param time - Time period in years
 * @param compound - Number of times interest compounds per year
 * @returns The final amount after compound interest
 * @example
 * ```typescript
 * const finalAmount = calculateCompoundInterest(1000, 0.05, 10, 12);
 * // Returns: 1643.62
 * ```
 */
function calculateCompoundInterest(
  principal: number,
  rate: number,
  time: number,
  compound: number = 1
): number {
  return principal * Math.pow(1 + rate / compound, compound * time);
}
```

### Type Organization
Keep type definitions organized and discoverable:

```typescript
// ✅ Good: Organized type definitions
// types/user.ts
export interface User {
  id: string;
  profile: UserProfile;
  preferences: UserPreferences;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  notifications: boolean;
  language: string;
}

// ✅ Good: Barrel export for types
// types/index.ts
export * from './user';
export * from './api';
export * from './common';
```

## Build Integration

### Type Checking in CI/CD
Include TypeScript type checking in your build process:

```json
{
  "scripts": {
    "type-check": "tsc --noEmit",
    "build": "npm run type-check && vite build",
    "test": "npm run type-check && vitest run"
  }
}
```

### Pre-commit Hooks
Set up pre-commit hooks to catch type errors early:

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm run type-check && lint-staged"
    }
  }
}
```

## Framework-Specific Considerations

### React with TypeScript
- Use proper prop types and component typing
- Leverage generic components for reusability
- Use proper event handler types

### Node.js/Express with TypeScript
- Type request/response objects properly
- Use middleware typing for type safety
- Implement proper error handling types

### Testing with TypeScript
- Use typed test utilities and matchers
- Create type-safe test data factories
- Leverage TypeScript for better test assertions

## Performance Considerations

### Type Complexity
- Avoid overly complex computed types that slow compilation
- Use type aliases to simplify complex intersections
- Consider using `interface` over `type` for performance in large codebases

### Build Optimization
- Enable `skipLibCheck` for faster builds
- Use project references for large monorepos
- Consider incremental compilation for development

## Migration Strategies

### Gradual TypeScript Adoption
- Start with `allowJs: true` for mixed codebases
- Use `// @ts-check` comments in JavaScript files
- Gradually convert files to `.ts`/`.tsx` extensions
- Enable strict mode incrementally

### Legacy Code Integration
- Create declaration files for untyped dependencies
- Use module augmentation for extending third-party types
- Implement wrapper functions with proper typing

This comprehensive approach to TypeScript ensures type safety, improves developer experience, and maintains code quality throughout the development lifecycle.
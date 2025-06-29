# NPM Package Publishing Plan for AI Rules Generator

## Overview
Convert the AI Rules Generator CLI into a globally installable npm package that developers can use to add AI coding assistant instructions to any repository.

## Package Name Options
- `ai-rules-generator`
- `ai-code-rules`
- `create-ai-instructions`
- `ai-assistant-config`

## Phase 1: Package Preparation

### 1.1 Update package.json
```json
{
  "name": "ai-rules-generator",
  "version": "1.0.0",
  "description": "Generate AI coding assistant instructions for your project (Claude, Copilot, Cursor, etc.)",
  "main": "dist/index.js",
  "bin": {
    "ai-rules": "./dist/cli/index.js",
    "ai-rules-gen": "./dist/cli/index.js"
  },
  "type": "module",
  "engines": {
    "node": ">=18.0.0"
  },
  "keywords": [
    "ai", "llm", "claude", "copilot", "cursor", "roo-code",
    "development-guidelines", "ai-instructions", "cli"
  ],
  "author": "Your Name <email@example.com>",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/yourusername/ai-rules-generator"
  },
  "homepage": "https://github.com/yourusername/ai-rules-generator#readme",
  "bugs": {
    "url": "https://github.com/yourusername/ai-rules-generator/issues"
  },
  "files": [
    "dist/",
    "content/",
    "README.md",
    "LICENSE",
    "CHANGELOG.md"
  ],
  "scripts": {
    "prepublishOnly": "npm run build && npm run test",
    "postinstall": "node scripts/post-install.js"
  }
}
```

### 1.2 Fix Hardcoded Paths
Currently hardcoded path that needs fixing:
```typescript
// src/cli/hooks/useGeneration.ts line 36
const conceptsPath = '/Users/tylerhenry/Desktop/ai-rules';
```

Replace with dynamic path resolution:
```typescript
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const conceptsPath = join(__dirname, '../../content');
```

### 1.3 Add Shebang to CLI Entry
Update `src/cli/index.tsx`:
```typescript
#!/usr/bin/env node
```

### 1.4 Create Post-Install Script
Create `scripts/post-install.js`:
```javascript
#!/usr/bin/env node

console.log('\n🎉 AI Rules Generator installed successfully!');
console.log('\nUsage:');
console.log('  ai-rules init        - Interactive setup wizard');
console.log('  ai-rules generate    - Generate with options');
console.log('  ai-rules --help      - Show all commands\n');
```

## Phase 2: Build Configuration

### 2.1 Update tsconfig.json for Library Build
```json
{
  "compilerOptions": {
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "output", "tests"]
}
```

### 2.2 Add Build Scripts
```json
{
  "scripts": {
    "clean": "rm -rf dist",
    "build": "npm run clean && tsc",
    "build:watch": "tsc --watch",
    "prepublishOnly": "npm run lint && npm run test && npm run build"
  }
}
```

## Phase 3: Testing & Quality

### 3.1 Add Comprehensive Tests
- Test all output format generations
- Test CLI commands and flags
- Test path resolution
- Test error handling

### 3.2 Add CI/CD
Create `.github/workflows/publish.yml`:
```yaml
name: Publish to NPM

on:
  release:
    types: [created]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'
      - run: npm ci
      - run: npm test
      - run: npm run build
      - run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{secrets.NPM_TOKEN}}
```

## Phase 4: Documentation

### 4.1 Create Comprehensive README
```markdown
# AI Rules Generator

Generate AI coding assistant instructions for your project with a single command.

## Installation
\`\`\`bash
npm install -g ai-rules-generator
\`\`\`

## Quick Start
\`\`\`bash
# Run interactive setup in your project directory
cd your-project
ai-rules init

# Or generate with specific options
ai-rules generate --type typescript --output all
\`\`\`

## Supported AI Assistants
- Claude (.claude.md)
- GitHub Copilot (.github/copilot-instructions.md)
- Cursor (.cursorrules)
- Roo Code (.roo/rules/instructions.md)
- VS Code settings (.vscode/)

## Features
- Interactive questionnaire
- Multiple output formats
- TypeScript, JavaScript, Python support
- TDD, architecture, and code quality guidelines
- Customizable templates
```

### 4.2 Add LICENSE file
Choose MIT or Apache 2.0

### 4.3 Create CHANGELOG.md
Track version changes

## Phase 5: NPM Publishing Process

### 5.1 Create NPM Account
1. Go to https://www.npmjs.com/signup
2. Create account and verify email
3. Enable 2FA (required for publishing)

### 5.2 Login to NPM
```bash
npm login
# Enter username, password, email, and 2FA code
```

### 5.3 First Time Publishing
```bash
# Test the package locally first
npm link
cd /tmp/test-project
npm link ai-rules-generator
ai-rules init

# If everything works, publish
npm publish --access public
```

### 5.4 Version Management
```bash
# Patch version (1.0.0 -> 1.0.1)
npm version patch

# Minor version (1.0.0 -> 1.1.0)
npm version minor

# Major version (1.0.0 -> 2.0.0)
npm version major

# Publish after version bump
npm publish
```

## Phase 6: Advanced Features

### 6.1 Add Update Notifier
```typescript
import updateNotifier from 'update-notifier';
import pkg from './package.json';

const notifier = updateNotifier({ pkg });
notifier.notify();
```

### 6.2 Add Analytics (Optional)
Track usage patterns to improve the tool

### 6.3 Add Config File Support
Allow `.ai-rules.config.json` for preset configurations

### 6.4 Add Template Customization
Allow users to add custom templates

## Phase 7: Maintenance

### 7.1 Security Updates
```bash
npm audit
npm audit fix
```

### 7.2 Dependency Updates
```bash
npm outdated
npm update
```

### 7.3 Community Management
- Respond to issues
- Review PRs
- Update documentation
- Release regularly

## Implementation Checklist

- [ ] Fix hardcoded paths
- [ ] Update package.json with proper metadata
- [ ] Add shebang to CLI entry
- [ ] Create post-install script
- [ ] Write comprehensive tests
- [ ] Create CI/CD pipeline
- [ ] Write detailed README
- [ ] Add LICENSE file
- [ ] Create CHANGELOG
- [ ] Set up npm account
- [ ] Test package locally with npm link
- [ ] Publish initial version
- [ ] Set up GitHub releases
- [ ] Add badges to README
- [ ] Announce on social media
- [ ] Submit to awesome-cli lists

## Expected Usage After Publishing

```bash
# Install globally
npm install -g ai-rules-generator

# Use in any project
cd my-awesome-project
ai-rules init

# Or with npx (no install needed)
npx ai-rules-generator init
```

## Marketing & Adoption

1. **Blog Post**: "Streamline Your AI Coding Assistant Setup"
2. **Tweet Thread**: Show before/after workflow
3. **Dev.to Article**: Tutorial on using the tool
4. **Submit to**:
   - Awesome CLI Apps
   - Awesome AI Tools
   - Product Hunt
   - Hacker News

## Success Metrics

- NPM weekly downloads
- GitHub stars
- Community contributions
- User feedback
- Integration requests

## Future Enhancements

1. **Web Interface**: Create web version for non-CLI users
2. **VS Code Extension**: Direct integration
3. **More AI Tools**: Support for more AI assistants
4. **Language Support**: More programming languages
5. **Team Features**: Shared team configurations
6. **Cloud Sync**: Sync preferences across projects
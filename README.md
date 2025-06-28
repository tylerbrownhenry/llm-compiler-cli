# AI Rules Generator

> Generate customized LLM instructions based on your project configuration

A TypeScript CLI tool with interactive UI that creates tailored development guidelines for AI assistants like Claude, Cursor, and others based on your project's specific needs.

## 🚀 Quick Start

### Installation

```bash
npm install -g ai-rules-generator
```

### Interactive Mode

```bash
ai-rules-gen init
```

### Quick Generation

```bash
# TypeScript project with TDD and strict architecture
ai-rules-gen generate --type=typescript --tdd --strict-arch

# From configuration file
ai-rules-gen generate --config=./ai-rules.config.json

# Preview mode (don't create files)
ai-rules-gen preview --type=javascript --output=claude,readme
```

## 📋 Features

### 🎯 **Smart Configuration**
- Interactive questionnaire covering all development aspects
- Intelligent concept mapping based on your selections
- Support for TypeScript, JavaScript, Python, and more

### 🧩 **Comprehensive Concepts**
- **CRAFT**: Code quality, testing, TypeScript, architecture
- **PROCESS**: Workflow, CI/CD, documentation, infrastructure  
- **PRODUCT**: UI/UX, accessibility, internationalization

### 📤 **Multiple Output Formats**
- **CLAUDE.md**: Detailed instructions for Claude AI
- **VS Code Settings**: `.vscode/settings.json` and extensions
- **README.md**: Project documentation with guidelines
- **Cursor Rules**: `.cursorrules` for Cursor AI
- **All Formats**: Generate everything at once

### ⚡ **Rich CLI Experience**
- Built with [Ink](https://github.com/vadimdemedes/ink) for React-like CLI components
- Real-time progress indicators and live previews
- Keyboard navigation and intuitive controls
- Color-coded output and helpful hints

## 🛠 Configuration

### Config File

Create an `ai-rules.config.json`:

```json
{
  "projectType": "typescript",
  "philosophy": {
    "tdd": true,
    "strictArchitecture": true,
    "functionalProgramming": true
  },
  "tools": {
    "eslint": true,
    "testing": ["vitest", "react-testing-library"],
    "uiFramework": "react",
    "stateManagement": "zustand"
  },
  "quality": {
    "accessibility": true,
    "performance": true,
    "security": true
  },
  "output": {
    "formats": ["claude", "vscode", "readme"],
    "projectName": "My Awesome Project"
  }
}
```

### Generate Example Config

```bash
ai-rules-gen config --example > ai-rules.config.json
```

## 📚 Available Concepts

### CRAFT (Code Quality & Technical Excellence)
- **Testing & Quality**: TDD, testing principles, code style, reviews
- **TypeScript**: Strict mode, type safety, schema-first development
- **Architecture**: Atomic design, DDD, dependency injection, DRY principles

### PROCESS (Development Workflow & Delivery)
- **Workflow**: Git strategies, CI/CD, development processes
- **Infrastructure**: Configuration, state management, API integration
- **Documentation**: Standards, communication, knowledge sharing

### PRODUCT (User-Facing Outcomes)
- **UI/UX**: Design systems, responsive design, component patterns
- **Accessibility**: WCAG compliance, inclusive design
- **Internationalization**: Multi-language support, localization

## 🎮 CLI Commands

### Interactive Mode
```bash
ai-rules-gen init              # Start interactive setup wizard
```

### Generation
```bash
ai-rules-gen generate [flags]  # Generate with command line flags
ai-rules-gen preview [flags]   # Preview without creating files
```

### Utilities
```bash
ai-rules-gen list              # List all available concepts
ai-rules-gen config --example  # Generate example config file
```

### Flags
- `--type, -t`: Project type (typescript, javascript, python)
- `--tdd`: Enable Test-Driven Development
- `--strict-arch`: Enable strict architecture enforcement
- `--output, -o`: Output formats (claude,vscode,readme,cursor,all)
- `--config, -c`: Config file path
- `--silent, -s`: Silent mode (no interactive prompts)
- `--preview, -p`: Preview mode (don't generate files)

## 🎨 Examples

### TypeScript React Project
```bash
ai-rules-gen generate \\
  --type=typescript \\
  --tdd \\
  --strict-arch \\
  --output=all
```

### JavaScript Node.js API
```bash
ai-rules-gen generate \\
  --type=javascript \\
  --output=claude,readme \\
  --config=./api-rules.json
```

### Preview Generation
```bash
ai-rules-gen preview \\
  --type=typescript \\
  --tdd \\
  --output=claude
```

## 🏗 Architecture

### Project Structure
```
ai-rules-generator/
├── src/
│   ├── core/                 # Core engine
│   │   ├── question-engine/  # Interactive questions
│   │   ├── concept-mapper/   # Selection to concept mapping
│   │   ├── template-engine/  # Template processing
│   │   └── config-validator/ # Configuration validation
│   ├── cli/                  # CLI interface (Ink components)
│   │   ├── components/       # React-like CLI components
│   │   └── hooks/           # CLI state management
│   └── templates/           # Concept templates
└── concepts/                # Organized concept library
    ├── CRAFT/
    ├── PROCESS/
    └── PRODUCT/
```

### Key Technologies
- **TypeScript**: Strict mode with comprehensive type safety
- **Ink**: React-based CLI framework for rich terminal UIs
- **Zod**: Schema validation and type inference
- **Commander.js**: Command-line argument parsing
- **YAML**: Configuration file support

## 🔧 Development

### Setup
```bash
git clone https://github.com/your-org/ai-rules-generator
cd ai-rules-generator
npm install
```

### Development Mode
```bash
npm run dev                   # Start CLI in development mode
npm run build                # Build for production
npm test                     # Run tests
npm run lint                 # Check code style
```

### Adding Concepts
1. Create a new `.md` file in the appropriate `concepts/` folder
2. Add mapping rules in `src/core/concept-mapper/concept-rules.ts`
3. Update the template engine if needed

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes following the project's coding standards
4. Add tests for new functionality
5. Submit a pull request

## 🆘 Support

- 📖 [Documentation](https://docs.ai-rules-generator.com)
- 🐛 [Issue Tracker](https://github.com/your-org/ai-rules-generator/issues)
- 💬 [Discussions](https://github.com/your-org/ai-rules-generator/discussions)

---

Built with ❤️ for developers who want AI assistants that truly understand their projects.
# CLI Management Tool Plan

## Overview

This document outlines the design and implementation plan for a CLI management tool that will automate the creation, updating, and maintenance of resource mappings in the AI Rules Generator project.

## Tool Architecture

### Command Structure

```bash
# Main command structure
npm run manage [command] [options]

# Resource management commands
npm run manage add-resource [resource-name]
npm run manage update-resource [resource-id]
npm run manage remove-resource [resource-id]
npm run manage list-resources
npm run manage validate-resources

# Generation commands  
npm run manage generate-mapping
npm run manage generate-all
npm run manage watch-resources

# Maintenance commands
npm run manage check-consistency
npm run manage fix-issues
npm run manage migrate-old-resources
```

### Core CLI Components

```typescript
interface ManagementCLI {
  // Resource CRUD operations
  addResource(descriptor: ResourceDescriptor): Promise<void>;
  updateResource(id: string, updates: Partial<ResourceDescriptor>): Promise<void>;
  removeResource(id: string): Promise<void>;
  listResources(filters?: ResourceFilter): Promise<ResourceDescriptor[]>;
  
  // Validation and consistency
  validateResources(): Promise<ValidationResult>;
  checkConsistency(): Promise<ConsistencyReport>;
  fixIssues(issues: Issue[]): Promise<FixResult>;
  
  // Code generation
  generateMapping(): Promise<GenerationResult>;
  generateAll(): Promise<GenerationResult>;
  watchResources(): Promise<void>;
  
  // Migration utilities
  migrateOldResources(): Promise<MigrationResult>;
}
```

## Command Implementations

### 1. Add Resource Command

```bash
npm run manage add-resource my-feature
```

**Interactive Flow:**
1. **Resource Type Selection:** Choose category (philosophy, project, tools, quality, infrastructure, output)
2. **Basic Information:** Name, description, priority
3. **Question Configuration:** Question text, type, options, defaults
4. **Config Mapping:** Where to store the answer in ProjectConfig
5. **Content Specification:** Content file path, condition logic
6. **Output Integration:** Which output formats to include

**Implementation:**
```typescript
class AddResourceCommand {
  async execute(resourceName: string): Promise<void> {
    // 1. Collect resource information interactively
    const resourceInfo = await this.collectResourceInfo(resourceName);
    
    // 2. Generate resource descriptor
    const descriptor = this.createDescriptor(resourceInfo);
    
    // 3. Validate descriptor
    const validation = await this.validator.validateDescriptor(descriptor);
    if (!validation.isValid) {
      throw new Error(`Invalid descriptor: ${validation.errors.join(', ')}`);
    }
    
    // 4. Create content file if it doesn't exist
    await this.createContentFile(descriptor);
    
    // 5. Save descriptor
    await this.saveDescriptor(descriptor);
    
    // 6. Regenerate mapping files
    await this.regenerateMapping();
    
    console.log(`✅ Resource '${resourceName}' added successfully!`);
  }
  
  private async collectResourceInfo(name: string): Promise<ResourceInfo> {
    const questions = [
      {
        type: 'select',
        name: 'category',
        message: 'Select resource category:',
        choices: ['philosophy', 'project', 'tools', 'quality', 'infrastructure', 'output']
      },
      {
        type: 'input',
        name: 'description',
        message: 'Enter resource description:'
      },
      {
        type: 'select',
        name: 'questionType',
        message: 'Select question type:',
        choices: ['boolean', 'single', 'multiple', 'text']
      },
      {
        type: 'input',
        name: 'questionText',
        message: 'Enter question text:'
      },
      {
        type: 'input',
        name: 'configPath',
        message: 'Enter config path (e.g., "tools.eslint"):',
        default: this.suggestConfigPath(name)
      }
    ];
    
    return await inquirer.prompt(questions);
  }
}
```

### 2. Update Resource Command

```bash
npm run manage update-resource tdd
```

**Features:**
- Interactive selection of fields to update
- Validation of changes
- Automatic regeneration of derived files
- Backup of original descriptor

**Implementation:**
```typescript
class UpdateResourceCommand {
  async execute(resourceId: string): Promise<void> {
    // 1. Load existing descriptor
    const descriptor = await this.loadDescriptor(resourceId);
    if (!descriptor) {
      throw new Error(`Resource '${resourceId}' not found`);
    }
    
    // 2. Show current values and collect updates
    const updates = await this.collectUpdates(descriptor);
    
    // 3. Apply updates
    const updatedDescriptor = { ...descriptor, ...updates };
    
    // 4. Validate updated descriptor
    const validation = await this.validator.validateDescriptor(updatedDescriptor);
    if (!validation.isValid) {
      throw new Error(`Invalid updates: ${validation.errors.join(', ')}`);
    }
    
    // 5. Backup original and save updated
    await this.backupDescriptor(descriptor);
    await this.saveDescriptor(updatedDescriptor);
    
    // 6. Regenerate mapping files
    await this.regenerateMapping();
    
    console.log(`✅ Resource '${resourceId}' updated successfully!`);
  }
}
```

### 3. Resource Validation Command

```bash
npm run manage validate-resources
```

**Validation Checks:**
- Descriptor schema compliance
- Content file existence
- Config path validity
- Dependency resolution
- Naming convention compliance
- Duplicate ID detection

**Implementation:**
```typescript
class ValidateResourcesCommand {
  async execute(): Promise<void> {
    console.log('🔍 Validating resources...\n');
    
    // 1. Load all descriptors
    const descriptors = await this.loadAllDescriptors();
    
    // 2. Run validation rules
    const results = await this.runValidationRules(descriptors);
    
    // 3. Display results
    this.displayValidationResults(results);
    
    // 4. Exit with appropriate code
    process.exit(results.hasErrors ? 1 : 0);
  }
  
  private displayValidationResults(results: ValidationResults): void {
    if (results.errors.length === 0) {
      console.log('✅ All resources are valid!');
      return;
    }
    
    console.log(`❌ Found ${results.errors.length} validation errors:\n`);
    
    results.errors.forEach((error, index) => {
      console.log(`${index + 1}. ${error.message}`);
      console.log(`   Resource: ${error.resourceId}`);
      console.log(`   Rule: ${error.rule}`);
      console.log('');
    });
    
    if (results.warnings.length > 0) {
      console.log(`⚠️  Found ${results.warnings.length} warnings:\n`);
      results.warnings.forEach((warning, index) => {
        console.log(`${index + 1}. ${warning.message}`);
      });
    }
  }
}
```

### 4. Generate Mapping Command

```bash
npm run manage generate-mapping
```

**Features:**
- Regenerate all derived files from descriptors
- Validation before generation
- Backup of existing files
- Diff display of changes

**Implementation:**
```typescript
class GenerateMappingCommand {
  async execute(): Promise<void> {
    console.log('🔄 Generating mapping files...\n');
    
    // 1. Load and validate descriptors
    const descriptors = await this.loadAndValidateDescriptors();
    
    // 2. Generate all derived files
    const generated = await this.generator.generateAll(descriptors);
    
    // 3. Show diff of changes
    await this.showDiff(generated);
    
    // 4. Confirm before writing
    const confirmed = await this.confirmWrite();
    if (!confirmed) {
      console.log('Generation cancelled.');
      return;
    }
    
    // 5. Write generated files
    await this.writeGeneratedFiles(generated);
    
    console.log('✅ Mapping files generated successfully!');
  }
  
  private async showDiff(generated: GeneratedFiles): Promise<void> {
    for (const [filePath, content] of Object.entries(generated.files)) {
      const existingContent = await this.readExistingFile(filePath);
      if (existingContent !== content) {
        console.log(`📝 Changes in ${filePath}:`);
        console.log(this.createDiff(existingContent, content));
        console.log('');
      }
    }
  }
}
```

### 5. Watch Resources Command

```bash
npm run manage watch-resources
```

**Features:**
- Watch descriptor files for changes
- Automatic regeneration on file changes
- Live validation feedback
- Performance optimizations

**Implementation:**
```typescript
class WatchResourcesCommand {
  async execute(): Promise<void> {
    console.log('👀 Watching resources for changes...\n');
    
    const watcher = chokidar.watch('resources/descriptors/**/*.yaml', {
      ignored: /node_modules/,
      persistent: true
    });
    
    watcher.on('change', async (filePath) => {
      console.log(`📁 File changed: ${filePath}`);
      await this.handleFileChange(filePath);
    });
    
    watcher.on('add', async (filePath) => {
      console.log(`📁 File added: ${filePath}`);
      await this.handleFileChange(filePath);
    });
    
    watcher.on('unlink', async (filePath) => {
      console.log(`📁 File removed: ${filePath}`);
      await this.handleFileRemoval(filePath);
    });
    
    console.log('Press Ctrl+C to stop watching.\n');
  }
  
  private async handleFileChange(filePath: string): Promise<void> {
    try {
      // 1. Validate changed file
      const descriptor = await this.loadDescriptor(filePath);
      const validation = await this.validator.validateDescriptor(descriptor);
      
      if (!validation.isValid) {
        console.error(`❌ Validation failed for ${filePath}:`);
        validation.errors.forEach(error => console.error(`  - ${error}`));
        return;
      }
      
      // 2. Regenerate mapping if valid
      await this.regenerateMapping();
      console.log(`✅ Regenerated mapping for ${filePath}`);
      
    } catch (error) {
      console.error(`❌ Error processing ${filePath}:`, error.message);
    }
  }
}
```

## Configuration Management

### CLI Configuration File

```json
// .ai-rules-manage.json
{
  "descriptorPath": "resources/descriptors",
  "generatedPath": "resources/generated", 
  "contentPath": "resources/content",
  "templatesPath": "resources/templates",
  "backupPath": "resources/backups",
  
  "validation": {
    "strict": true,
    "rules": ["unique-ids", "content-files-exist", "valid-config-paths"],
    "warnings": ["naming-conventions", "missing-metadata"]
  },
  
  "generation": {
    "autoGenerate": true,
    "createBackups": true,
    "showDiff": true
  },
  
  "watch": {
    "debounceMs": 500,
    "validateOnChange": true,
    "regenerateOnChange": true
  }
}
```

## Template System

### Resource Descriptor Template

```yaml
# resources/templates/resource-template.yaml
id: ${resourceId}
name: ${resourceName}
category: ${category}
section: ${section}
priority: ${priority}

question:
  text: "${questionText}"
  type: ${questionType}
  ${questionOptions}
  default: ${defaultValue}
  required: ${required}

config:
  path: ${configPath}
  
content:
  path: categories/${category}/${resourceId}.md
  condition: ${condition}
  
output:
  sections: ${outputSections}
  weight: ${weight}

metadata:
  author: ${author}
  created: ${createdDate}
  lastModified: ${createdDate}
  description: "${description}"
  tags: ${tags}
```

### Content Template

```markdown
# ${resourceName}

## Overview
${description}

## Guidelines
- Guideline 1
- Guideline 2
- Guideline 3

## Implementation
Implementation details...

## Best Practices
- Best practice 1
- Best practice 2

## Resources
- [Resource 1](url)
- [Resource 2](url)
```

## Integration with Existing Project

### Package.json Scripts

```json
{
  "scripts": {
    "manage": "tsx src/cli/manage.ts",
    "manage:add": "npm run manage add-resource",
    "manage:validate": "npm run manage validate-resources",
    "manage:generate": "npm run manage generate-mapping",
    "manage:watch": "npm run manage watch-resources"
  }
}
```

### Build Integration

```json
{
  "scripts": {
    "prebuild": "npm run manage validate-resources",
    "build": "npm run manage generate-mapping && tsc",
    "dev": "npm run manage watch-resources & npm run dev:cli"
  }
}
```

## Error Handling & Recovery

### Backup System
- Automatic backups before destructive operations
- Rollback capability for failed operations
- Version tracking of descriptor changes

### Validation Recovery
- Suggest fixes for common validation errors
- Interactive repair mode for broken descriptors
- Automatic cleanup of orphaned files

### Generation Recovery
- Rollback to previous generated files on failure
- Partial generation for individual resources
- Dry-run mode for testing changes

## Benefits

### Developer Experience
- **Guided Resource Creation:** Interactive prompts eliminate guesswork
- **Automatic Validation:** Catch errors before they cause runtime issues
- **Live Feedback:** Watch mode provides immediate validation and regeneration
- **Consistent Workflows:** Standardized commands for all resource operations

### Code Quality
- **Single Source of Truth:** All resource definitions in descriptors
- **Automated Generation:** Eliminate manual file updates and sync issues
- **Comprehensive Validation:** Catch inconsistencies and missing dependencies
- **Version Control:** Track changes to resource definitions over time

### Maintenance
- **Automated Maintenance:** Tools for fixing common issues
- **Migration Support:** Migrate existing resources to new format
- **Consistency Checks:** Ensure all resources follow conventions
- **Performance Optimization:** Cache and optimize resource operations

This CLI management tool will transform resource management from a manual, error-prone process into an automated, validated, and developer-friendly workflow.
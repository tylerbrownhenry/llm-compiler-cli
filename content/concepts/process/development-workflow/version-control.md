---
id: "version-control"
name: "Version Control & Branching Strategy"
category: "process"
subcategory: "development-workflow"
priority: 1
dependencies: []
conflicts: []
applicable_to:
  languages: ["typescript", "javascript", "python", "java", "csharp", "go", "rust", "php"]
  frameworks: ["react", "express", "nextjs", "django", "spring", "aspnet", "laravel"]
  project_types: ["web", "api", "library", "cli", "mobile", "desktop"]
triggers:
  - has_git_repository: true
  - team_size: ">1"
weight: 14
description: "Git workflow, branching strategies, and version control best practices for team collaboration"
tags: ["git", "version-control", "workflow", "collaboration", "branching"]
version: "1.0.0"
author: "AI Rules Generator"
created: "2024-06-28"
updated: "2024-06-28"
---

# Version Control & Branching Strategy

## Core Principles

Version control is the foundation of collaborative software development. A well-defined Git workflow ensures code quality, maintainable history, and smooth team collaboration.

## Git Workflow Strategy

### Branch Management
- **Main/Master Branch**: Always deployable, represents production-ready code
- **Feature Branches**: Created from main for new development work
- **Release Branches**: For preparing production releases (when needed)
- **Hotfix Branches**: For critical production fixes

### Branching Strategy
```
main (production-ready)
├── feature/user-authentication
├── feature/payment-integration
├── hotfix/critical-security-fix
└── release/v2.1.0
```

## Branch Naming Conventions

### Feature Branches
- `feature/short-description`
- `feature/user-authentication`
- `feature/payment-integration`
- `feature/responsive-dashboard`

### Bug Fix Branches
- `bugfix/short-description`
- `bugfix/login-validation-error`
- `bugfix/memory-leak-fix`

### Hotfix Branches
- `hotfix/critical-description`
- `hotfix/security-vulnerability`
- `hotfix/production-crash`

### Release Branches
- `release/version-number`
- `release/v2.1.0`
- `release/v1.5.2`

## Commit Message Standards

### Format
```
type(scope): brief description

Detailed explanation of changes if needed.

- Bullet points for specific changes
- Reference issue numbers: Fixes #123
```

### Commit Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code formatting, no logic changes
- `refactor`: Code restructuring without behavior changes
- `test`: Adding or updating tests
- `chore`: Maintenance tasks, dependency updates

### Examples
```bash
feat(auth): add JWT token validation

Implement middleware for validating JWT tokens in API requests.
- Add token verification logic
- Create custom error handling for expired tokens
- Update authentication flow

Fixes #145
```

```bash
fix(payment): resolve stripe webhook validation

The webhook signature validation was failing due to incorrect
encoding. Updated to use raw body buffer for verification.

Fixes #203
```

## Commit Best Practices

### Atomic Commits
- Each commit represents a single logical change
- Keep commits focused and small
- Avoid mixing unrelated changes
- Make commits that can be safely reverted

### Commit Frequency
- Commit early and often during development
- Don't wait until feature is complete
- Use meaningful intermediate commits
- Squash commits before merging if needed

### Commit Content
- Include all necessary files for the change
- Ensure code compiles and tests pass
- Update documentation when needed
- Remove debug code and console logs

## Pull Request Workflow

### Creating Pull Requests
1. Create feature branch from latest main
2. Develop feature with atomic commits
3. Write or update tests
4. Update documentation if needed
5. Rebase on latest main before creating PR
6. Create PR with clear description

### Pull Request Requirements
- **Title**: Clear, descriptive summary
- **Description**: Explain what and why
- **Testing**: How changes were tested
- **Breaking Changes**: Document any breaking changes
- **Screenshots**: For UI changes

### Pull Request Template
```markdown
## Description
Brief description of changes and motivation.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No console.log statements
```

## Code Review Process

### Review Requirements
- All PRs require at least one approval
- No self-merging (except for solo projects)
- Address all review comments
- Resolve merge conflicts before review

### Review Guidelines
- Focus on logic, security, and maintainability
- Check test coverage and quality
- Verify documentation updates
- Ensure consistent code style
- Look for potential performance issues

### Review Checklist
- [ ] Code logic is correct and efficient
- [ ] Tests are comprehensive and pass
- [ ] Security considerations addressed
- [ ] Error handling is appropriate
- [ ] Code is readable and well-commented
- [ ] No hardcoded secrets or credentials

## Release Management

### Semantic Versioning
Follow [SemVer](https://semver.org/) for version numbers:
- **MAJOR**: Breaking changes (v2.0.0)
- **MINOR**: New features, backward compatible (v1.1.0)
- **PATCH**: Bug fixes, backward compatible (v1.0.1)

### Release Process
1. Create release branch from main
2. Update version numbers
3. Update CHANGELOG.md
4. Test release candidate
5. Merge to main and tag
6. Deploy to production
7. Delete release branch

### Tagging Releases
```bash
# Create annotated tag
git tag -a v1.2.3 -m "Release version 1.2.3"

# Push tag to remote
git push origin v1.2.3

# List all tags
git tag -l
```

## Advanced Git Practices

### Rebasing vs Merging
- **Rebase**: For feature branches to maintain linear history
- **Merge**: For integrating feature branches to main
- **Interactive Rebase**: For cleaning up commit history

```bash
# Rebase feature branch on latest main
git checkout feature/new-feature
git rebase main

# Interactive rebase to clean up commits
git rebase -i HEAD~3
```

### Conflict Resolution
```bash
# Start merge or rebase
git merge main
# or
git rebase main

# Resolve conflicts in files
# Edit conflicted files manually

# Stage resolved files
git add conflicted-file.ts

# Continue the operation
git rebase --continue
# or
git merge --continue
```

### Git Hooks
Set up pre-commit hooks for code quality:

```bash
# .git/hooks/pre-commit
#!/bin/sh
npm run lint
npm run test
npm run type-check
```

## Repository Maintenance

### Branch Cleanup
```bash
# Delete merged local branches
git branch --merged main | grep -v main | xargs -n 1 git branch -d

# Delete remote tracking branches
git remote prune origin

# List stale branches
git for-each-ref --format='%(refname:short) %(committerdate)' refs/heads | sort -k2
```

### Git Configuration
```bash
# Set up user information
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Useful aliases
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.st status
git config --global alias.lg "log --oneline --graph --all"
```

## Integration with Development Tools

### IDE Integration
- Configure IDE for Git integration
- Use built-in merge conflict resolution
- Set up automatic formatting on save
- Enable Git blame and history views

### CI/CD Integration
- Trigger builds on PR creation
- Run tests on every commit
- Block merges on failing tests
- Automatic deployment from main branch

### Project Management
- Link commits to issue trackers
- Use conventional commits for automated changelogs
- Integrate with project boards
- Automate milestone management

## Common Anti-Patterns to Avoid

### Poor Commit Practices
- Massive commits with unrelated changes
- Vague commit messages ("fix stuff", "WIP")
- Committing broken or untested code
- Including sensitive information in commits

### Branch Management Issues
- Long-lived feature branches
- Merging without code review
- Not cleaning up merged branches
- Working directly on main branch

### Collaboration Problems
- Force pushing to shared branches
- Not communicating breaking changes
- Ignoring merge conflicts
- Not following established workflows

## Team Guidelines

### Onboarding New Team Members
- Document Git workflow in project README
- Provide Git training and resources
- Set up development environment with Git hooks
- Review first few PRs carefully

### Workflow Enforcement
- Use branch protection rules
- Require status checks before merging
- Enforce code review requirements
- Set up automated quality gates

### Communication
- Use descriptive PR titles and descriptions
- Comment on complex changes
- Communicate breaking changes early
- Update team on workflow changes

This version control strategy ensures code quality, maintains project history, and enables effective team collaboration throughout the development lifecycle.
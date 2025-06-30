#!/usr/bin/env node

import { createElement } from 'react';
import { render } from 'ink';
import { Command } from 'commander';
import { CLIApp } from './components/CLIApp.js';
import { CLIMode, CLIFlags } from '../core/types.js';

const program = new Command();

program
  .name('ai-rules')
  .description('Generate AI coding assistant instructions for your project (Claude, Copilot, Cursor, etc.)')
  .version('1.0.0');

program
  .command('init')
  .description('Start interactive setup wizard')
  .action(() => {
    render(createElement(CLIApp, { mode: "interactive" }));
  });

program
  .command('generate')
  .description('Generate instructions with flags')
  .option('-t, --type <type>', 'project type (typescript, javascript, python)')
  .option('--tdd', 'enable test-driven development')
  .option('--strict-arch', 'enable strict architecture enforcement')
  .option('-o, --output <formats>', 'output formats (claude,vscode,readme,cursor,all)', 'all')
  .option('-c, --config <path>', 'config file path')
  .option('-s, --silent', 'silent mode (no interactive prompts)')
  .option('-p, --preview', 'preview mode (don\'t generate files)')
  .action((options: CLIFlags) => {
    const mode: CLIMode = options.preview ? 'preview' : 'generate';
    render(createElement(CLIApp, { mode, flags: options }));
  });

program
  .command('list')
  .description('List available concepts and their descriptions')
  .action(() => {
    render(createElement(CLIApp, { mode: "list" }));
  });

program
  .command('preview')
  .description('Preview generated instructions without creating files')
  .option('-t, --type <type>', 'project type')
  .option('--tdd', 'enable test-driven development')
  .option('--strict-arch', 'enable strict architecture enforcement')
  .option('-c, --config <path>', 'config file path')
  .action((options: CLIFlags) => {
    render(createElement(CLIApp, { mode: "preview", flags: options }));
  });

// Handle unknown commands
program.on('command:*', () => {
  console.error('Invalid command: %s\nSee --help for a list of available commands.', program.args.join(' '));
  process.exit(1);
});

// Parse arguments
if (process.argv.length === 2) {
  // No arguments provided, show interactive mode
  render(createElement(CLIApp, { mode: "interactive" }));
} else {
  program.parse(process.argv);
}
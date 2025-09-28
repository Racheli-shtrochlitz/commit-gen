#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { generateCommitSuggestions } from './services/commitGenerator';
import { getGitDiff } from './services/gitService';
import { setupConfig } from './services/configService';
import { selectCommitMessage } from './services/uiService';
import { checkForSensitiveData, sanitizeDiff } from './services/securityService';
import { OllamaService, GroqService } from './services/aiServices';
import { OfflineService } from './services/offlineService';

const program = new Command();

program
  .name('commit-gen')
  .description('AI-powered commit message generator')
  .version('1.0.0');

program
  .option('-v, --verbose', 'verbose output')
  .option('-m, --model <model>', 'AI model to use', 'gpt-3.5-turbo')
  .action(async (options) => {
    try {
      console.log(chalk.blue('🚀 Commit Gen - AI-Powered Commit Generator\n'));

      // Check if we're in a git repository
      const gitDiff = await getGitDiff();
      if (!gitDiff) {
        console.log(chalk.red('❌ No changes detected or not in a git repository'));
        process.exit(1);
      }

      // Check for sensitive data
      checkForSensitiveData(gitDiff);
      
      // Sanitize diff for AI processing
      const sanitizedDiff = sanitizeDiff(gitDiff);

      if (options.verbose) {
        console.log(chalk.gray('📝 Git diff:'));
        console.log(chalk.gray(gitDiff));
        console.log('');
      }

      // Setup configuration (API key, etc.)
      const config = await setupConfig();

      // Generate commit suggestions based on provider
      console.log(chalk.yellow('🤖 Generating commit suggestions...'));
      let suggestions;
      
      switch (config.aiProvider) {
        case 'offline':
          const offlineService = new OfflineService();
          suggestions = await offlineService.generateCommitSuggestions(sanitizedDiff);
          break;
        case 'ollama':
          const ollamaService = new OllamaService();
          if (await ollamaService.isAvailable()) {
            suggestions = await ollamaService.generateCommitSuggestions(sanitizedDiff);
          } else {
            console.log(chalk.red('❌ Ollama not available. Install Ollama first: https://ollama.ai'));
            process.exit(1);
          }
          break;
        case 'groq':
          const groqService = new GroqService(config.groqApiKey || '');
          if (await groqService.isAvailable()) {
            suggestions = await groqService.generateCommitSuggestions(sanitizedDiff);
          } else {
            console.log(chalk.red('❌ Groq API key not configured'));
            process.exit(1);
          }
          break;
        case 'openai':
        default:
          suggestions = await generateCommitSuggestions(sanitizedDiff, config.apiKey, options.model);
          break;
      }

      // Let user select a commit message
      const selectedMessage = await selectCommitMessage(suggestions);

      // Execute the commit
      console.log(chalk.green(`\n✅ Committing: ${selectedMessage}`));
      const { executeCommit } = await import('./services/gitService');
      const success = await executeCommit(selectedMessage);
      
      if (success) {
        console.log(chalk.green('🎉 Commit created successfully!'));
      } else {
        console.log(chalk.red('❌ Failed to create commit'));
        process.exit(1);
      }

    } catch (error) {
      console.error(chalk.red('❌ Error:'), error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });

program.parse();

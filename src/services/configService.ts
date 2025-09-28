import fs from 'fs';
import path from 'path';
import os from 'os';
import inquirer from 'inquirer';
import chalk from 'chalk';

export interface Config {
  apiKey: string;
  model: string;
  defaultEmoji: boolean;
  aiProvider: 'openai' | 'groq' | 'ollama' | 'offline';
  groqApiKey?: string;
}

const CONFIG_FILE = path.join(os.homedir(), '.commit-gen-config.json');

export async function setupConfig(): Promise<Config> {
  let config: Config;

  // Try to load existing config
  if (fs.existsSync(CONFIG_FILE)) {
    try {
      const configData = fs.readFileSync(CONFIG_FILE, 'utf8');
      config = JSON.parse(configData);
      
      // Validate config based on provider
      if (config.aiProvider === 'openai' && !config.apiKey) {
        config = await promptForConfig();
        saveConfig(config);
      } else if (config.aiProvider === 'groq' && !config.groqApiKey) {
        config = await promptForConfig();
        saveConfig(config);
      }
    } catch (error) {
      console.log(chalk.yellow('⚠️  Invalid config file, creating new one...'));
      config = await promptForConfig();
      saveConfig(config);
    }
  } else {
    console.log(chalk.blue('🔧 First time setup - configuring Commit Gen...\n'));
    config = await promptForConfig();
    saveConfig(config);
  }

  return config;
}

async function promptForConfig(): Promise<Config> {
  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'aiProvider',
      message: 'Choose AI provider:',
      choices: [
        { name: '🆓 Offline Templates (Free, no setup)', value: 'offline' },
        { name: '🏠 Ollama (Local AI, Free)', value: 'ollama' },
        { name: '⚡ Groq (Free, requires API key)', value: 'groq' },
        { name: '🤖 OpenAI (Paid, best quality)', value: 'openai' },
      ],
      default: 'offline',
    },
  ]);

  let apiKey = '';
  let groqApiKey = '';
  let model = 'gpt-3.5-turbo';

  if (answers.aiProvider === 'openai') {
    const openaiAnswers = await inquirer.prompt([
      {
        type: 'input',
        name: 'apiKey',
        message: 'Enter your OpenAI API key:',
        validate: (input: string) => {
          if (!input.trim()) {
            return 'API key is required';
          }
          if (!input.startsWith('sk-')) {
            return 'API key should start with "sk-"';
          }
          return true;
        },
      },
      {
        type: 'list',
        name: 'model',
        message: 'Choose AI model:',
        choices: [
          { name: 'GPT-3.5 Turbo (faster, cheaper)', value: 'gpt-3.5-turbo' },
          { name: 'GPT-4 (better quality)', value: 'gpt-4' },
        ],
        default: 'gpt-3.5-turbo',
      },
    ]);
    apiKey = openaiAnswers.apiKey;
    model = openaiAnswers.model;
  } else if (answers.aiProvider === 'groq') {
    const groqAnswers = await inquirer.prompt([
      {
        type: 'input',
        name: 'groqApiKey',
        message: 'Enter your Groq API key (get free at console.groq.com):',
        validate: (input: string) => {
          if (!input.trim()) {
            return 'API key is required';
          }
          return true;
        },
      },
    ]);
    groqApiKey = groqAnswers.groqApiKey;
  }

  const emojiAnswer = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'defaultEmoji',
      message: 'Include emojis in commit messages?',
      default: true,
    },
  ]);

  return {
    apiKey,
    model,
    defaultEmoji: emojiAnswer.defaultEmoji,
    aiProvider: answers.aiProvider,
    groqApiKey,
  };
}

function saveConfig(config: Config): void {
  try {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
    console.log(chalk.green('✅ Configuration saved successfully!\n'));
  } catch (error) {
    console.error(chalk.red('❌ Error saving config:'), error);
  }
}

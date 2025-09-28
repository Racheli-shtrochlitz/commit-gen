import inquirer from 'inquirer';
import chalk from 'chalk';
import { CommitSuggestion } from './commitGenerator';

export async function selectCommitMessage(suggestions: CommitSuggestion[]): Promise<string> {
  const choices = suggestions.map((suggestion, index) => ({
    name: `${suggestion.emoji} ${suggestion.message} - ${suggestion.description}`,
    value: suggestion.message,
    short: suggestion.message,
  }));

  const { selectedMessage } = await inquirer.prompt([
    {
      type: 'list',
      name: 'selectedMessage',
      message: chalk.cyan('Choose a commit message:'),
      choices: choices,
      default: 0,
    },
  ]);

  return selectedMessage;
}

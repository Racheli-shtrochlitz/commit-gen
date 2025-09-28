import simpleGit, { SimpleGit } from 'simple-git';
import chalk from 'chalk';

export async function getGitDiff(): Promise<string | null> {
  try {
    const git: SimpleGit = simpleGit();
    
    // Check if we're in a git repository
    const isRepo = await git.checkIsRepo();
    if (!isRepo) {
      return null;
    }

    // Get staged changes
    const stagedDiff = await git.diff(['--cached']);
    
    // If no staged changes, get unstaged changes
    if (!stagedDiff.trim()) {
      const unstagedDiff = await git.diff();
      if (!unstagedDiff.trim()) {
        return null;
      }
      return unstagedDiff;
    }

    return stagedDiff;
  } catch (error) {
    console.error(chalk.red('Error getting git diff:'), error);
    return null;
  }
}

export async function executeCommit(message: string): Promise<boolean> {
  try {
    const git: SimpleGit = simpleGit();
    await git.add('.');
    await git.commit(message);
    return true;
  } catch (error) {
    console.error(chalk.red('Error executing commit:'), error);
    return false;
  }
}

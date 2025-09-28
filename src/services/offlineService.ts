import { CommitSuggestion } from './commitGenerator';

export class OfflineService {
  name = 'Offline Templates';

  async generateCommitSuggestions(gitDiff: string): Promise<CommitSuggestion[]> {
    const changeType = this.analyzeChangeType(gitDiff);
    const suggestions = this.getTemplatesForChangeType(changeType);
    
    return suggestions.map(suggestion => ({
      ...suggestion,
      description: this.generateDescription(suggestion.message, gitDiff)
    }));
  }

  private analyzeChangeType(gitDiff: string): string {
    const diff = gitDiff.toLowerCase();
    
    if (diff.includes('test') || diff.includes('spec')) {
      return 'test';
    }
    if (diff.includes('readme') || diff.includes('doc')) {
      return 'docs';
    }
    if (diff.includes('fix') || diff.includes('bug') || diff.includes('error')) {
      return 'fix';
    }
    if (diff.includes('style') || diff.includes('css') || diff.includes('format')) {
      return 'style';
    }
    if (diff.includes('refactor') || diff.includes('clean')) {
      return 'refactor';
    }
    if (diff.includes('feat') || diff.includes('add') || diff.includes('new')) {
      return 'feat';
    }
    if (diff.includes('config') || diff.includes('package.json') || diff.includes('yarn.lock')) {
      return 'config';
    }
    
    return 'chore';
  }

  private getTemplatesForChangeType(changeType: string): CommitSuggestion[] {
    const templates: Record<string, CommitSuggestion[]> = {
      feat: [
        { message: 'feat: add new feature', emoji: '✨', description: '' },
        { message: 'feat: implement new functionality', emoji: '🚀', description: '' },
        { message: 'feat: add feature enhancement', emoji: '⭐', description: '' }
      ],
      fix: [
        { message: 'fix: resolve bug issue', emoji: '🐛', description: '' },
        { message: 'fix: correct error handling', emoji: '🔧', description: '' },
        { message: 'fix: address reported issue', emoji: '✅', description: '' }
      ],
      docs: [
        { message: 'docs: update documentation', emoji: '📝', description: '' },
        { message: 'docs: improve README', emoji: '📚', description: '' },
        { message: 'docs: add code comments', emoji: '💬', description: '' }
      ],
      style: [
        { message: 'style: improve code formatting', emoji: '🎨', description: '' },
        { message: 'style: fix code style issues', emoji: '💄', description: '' },
        { message: 'style: update UI styling', emoji: '🌈', description: '' }
      ],
      refactor: [
        { message: 'refactor: improve code structure', emoji: '♻️', description: '' },
        { message: 'refactor: optimize code performance', emoji: '⚡', description: '' },
        { message: 'refactor: clean up code', emoji: '🧹', description: '' }
      ],
      test: [
        { message: 'test: add unit tests', emoji: '🧪', description: '' },
        { message: 'test: improve test coverage', emoji: '✅', description: '' },
        { message: 'test: fix failing tests', emoji: '🔧', description: '' }
      ],
      config: [
        { message: 'config: update configuration', emoji: '⚙️', description: '' },
        { message: 'config: add new settings', emoji: '🔧', description: '' },
        { message: 'config: optimize build settings', emoji: '🚀', description: '' }
      ],
      chore: [
        { message: 'chore: update dependencies', emoji: '📦', description: '' },
        { message: 'chore: improve project structure', emoji: '🏗️', description: '' },
        { message: 'chore: update project files', emoji: '📋', description: '' }
      ]
    };

    return templates[changeType] || templates.chore;
  }

  private generateDescription(message: string, gitDiff: string): string {
    const lines = gitDiff.split('\n').filter(line => line.startsWith('+') || line.startsWith('-'));
    const fileCount = new Set(lines.map(line => line.split(' ')[0])).size;
    
    if (fileCount === 1) {
      return `Updated single file`;
    } else if (fileCount <= 3) {
      return `Updated ${fileCount} files`;
    } else {
      return `Updated multiple files (${fileCount})`;
    }
  }
}

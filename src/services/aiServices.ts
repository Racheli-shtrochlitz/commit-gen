import { CommitSuggestion } from './commitGenerator';

export interface AIService {
  name: string;
  generateCommitSuggestions(gitDiff: string): Promise<CommitSuggestion[]>;
  isAvailable(): Promise<boolean>;
}

export class OllamaService implements AIService {
  name = 'Ollama (Local AI)';
  
  async isAvailable(): Promise<boolean> {
    try {
      const response = await fetch('http://localhost:11434/api/tags');
      return response.ok;
    } catch {
      return false;
    }
  }

  async generateCommitSuggestions(gitDiff: string): Promise<CommitSuggestion[]> {
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama3.2:3b',
        prompt: `Analyze this git diff and suggest 3 commit messages with emojis. Return JSON array with message, emoji, description:\n\n${gitDiff}`,
        stream: false
      })
    });

    const data = await response.json() as any;
    const suggestions = JSON.parse(data.response);
    return suggestions;
  }
}

export class GroqService implements AIService {
  name = 'Groq (Free)';
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async isAvailable(): Promise<boolean> {
    return !!this.apiKey;
  }

  async generateCommitSuggestions(gitDiff: string): Promise<CommitSuggestion[]> {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [
          {
            role: 'user',
            content: `Analyze this git diff and suggest 3 commit messages with emojis. Return JSON array with message, emoji, description:\n\n${gitDiff}`
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    const data = await response.json() as any;
    const suggestions = JSON.parse(data.choices[0].message.content);
    return suggestions;
  }
}

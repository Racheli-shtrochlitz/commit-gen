import OpenAI from 'openai';
import chalk from 'chalk';

export interface CommitSuggestion {
  message: string;
  emoji: string;
  description: string;
}

export async function generateCommitSuggestions(
  gitDiff: string,
  apiKey: string,
  model: string = 'gpt-3.5-turbo'
): Promise<CommitSuggestion[]> {
  try {
    const openai = new OpenAI({
      apiKey: apiKey,
    });

    const prompt = `
Analyze the following git diff and generate 3 commit message suggestions.
Each suggestion should include:
1. A clear, concise commit message following conventional commits format
2. An appropriate emoji based on the type of change
3. A brief description of what the change does

IMPORTANT: Only analyze the code changes. Do not include any personal information, passwords, or sensitive data in your response.

Git diff:
${gitDiff}

Please respond with a JSON array of exactly 3 objects, each with:
- "message": the commit message (max 50 characters)
- "emoji": appropriate emoji
- "description": brief description

Use conventional commits format (feat:, fix:, docs:, style:, refactor:, test:, chore:)
and appropriate emojis:
- 🎨 for style changes
- 🐛 for bug fixes  
- ✨ for new features
- 📝 for documentation
- 🔧 for configuration
- ♻️ for refactoring
- ⚡ for performance
- 🔒 for security
- 🚀 for deployment
- 📦 for dependencies
`;

    const completion = await openai.chat.completions.create({
      model: model,
      messages: [
        {
          role: 'system',
          content: 'You are an expert at writing clear, concise git commit messages following conventional commits standards.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('No response from AI');
    }

    // Parse JSON response
    const suggestions = JSON.parse(response);
    
    if (!Array.isArray(suggestions) || suggestions.length !== 3) {
      throw new Error('Invalid response format from AI');
    }

    return suggestions;
  } catch (error) {
    console.error(chalk.red('Error generating commit suggestions:'), error);
    throw error;
  }
}

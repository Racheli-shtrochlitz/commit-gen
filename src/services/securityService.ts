import chalk from 'chalk';

export function checkForSensitiveData(gitDiff: string): boolean {
  const sensitivePatterns = [
    /password\s*[:=]\s*['"][^'"]+['"]/i,
    /api[_-]?key\s*[:=]\s*['"][^'"]+['"]/i,
    /secret\s*[:=]\s*['"][^'"]+['"]/i,
    /token\s*[:=]\s*['"][^'"]+['"]/i,
    /private[_-]?key/i,
    /\.env/i,
    /config[_-]?file/i,
  ];

  const hasSensitiveData = sensitivePatterns.some(pattern => pattern.test(gitDiff));
  
  if (hasSensitiveData) {
    console.log(chalk.yellow('⚠️  Warning: Potential sensitive data detected in diff'));
    console.log(chalk.yellow('   Make sure no passwords, API keys, or secrets are included'));
    console.log(chalk.yellow('   Consider using .gitignore for sensitive files\n'));
  }

  return hasSensitiveData;
}

export function sanitizeDiff(gitDiff: string): string {
  // Remove potential sensitive lines
  const lines = gitDiff.split('\n');
  const sanitizedLines = lines.filter(line => {
    const lowerLine = line.toLowerCase();
    return !lowerLine.includes('password') && 
           !lowerLine.includes('api_key') && 
           !lowerLine.includes('secret') &&
           !lowerLine.includes('token');
  });
  
  return sanitizedLines.join('\n');
}

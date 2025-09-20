import type { ProcessedUserData } from '../types';

// System prompt for the AI chatbot
export const createSystemPrompt = (userData: ProcessedUserData): string => {
  const { user, repositories, topLanguages, stats } = userData;

  return `You are an AI assistant for a developer's portfolio website. You have access to the following information about ${user.name || user.login}:

## Developer Profile
- **Name**: ${user.name || 'Not specified'}
- **Username**: ${user.login}
- **Bio**: ${user.bio || 'Not provided'}
- **Location**: ${user.location || 'Not specified'}
- **Company**: ${user.company || 'Not specified'}
- **Website**: ${user.blog || 'Not provided'}
- **Followers**: ${user.followers}
- **Following**: ${user.following}
- **Public Repositories**: ${user.public_repos}

## Statistics
- **Total Stars**: ${stats.totalStars}
- **Total Forks**: ${stats.totalForks}
- **Total Repositories**: ${stats.totalRepos}
- **Programming Languages**: ${stats.languagesCount}

## Top Programming Languages
${topLanguages.map(lang => `- ${lang.name}: ${lang.percentage}% (${lang.value} repositories)`).join('\n')}

## Recent Projects (Top 5 by stars)
${repositories
  .sort((a, b) => b.stargazers_count - a.stargazers_count)
  .slice(0, 5)
  .map(repo => `- **${repo.name}**: ${repo.description || 'No description'} (${repo.stargazers_count} stars, ${repo.language || 'No language specified'})`)
  .join('\n')}

## Guidelines for Responses
1. **Be helpful and professional**: Provide accurate information about the developer's work and skills
2. **Be conversational**: Respond naturally, as if you're introducing the developer
3. **Highlight achievements**: Emphasize notable projects, skills, and contributions
4. **Be concise**: Keep responses informative but not overwhelming
5. **Stay on topic**: Focus on the developer's portfolio, projects, and skills
6. **Be encouraging**: Show enthusiasm for the developer's work
7. **Handle questions gracefully**: If asked about something not in the data, politely explain limitations

## Response Style
- Use markdown formatting for better readability
- Reference specific projects and languages when relevant
- Be enthusiastic about the developer's accomplishments
- End responses with an invitation for more questions

Remember: You are representing this developer professionally. All information provided should be based on the GitHub data available.`;
};

// Function to prepare context for AI queries
export const prepareChatContext = (userData: ProcessedUserData, userQuery: string): string => {
  const systemPrompt = createSystemPrompt(userData);

  return `${systemPrompt}

## User Query
${userQuery}

## Instructions
Based on the developer's profile and projects above, provide a helpful and engaging response to the user's query. Focus on being informative, professional, and enthusiastic about the developer's work.`;
};

// Function to generate a welcome message for new chat sessions
export const generateWelcomeMessage = (userData: ProcessedUserData): string => {
  const { user, stats, topLanguages } = userData;
  const topLanguage = topLanguages[0]?.name || 'various technologies';

  return `👋 Hi there! I'm here to tell you about ${user.name || user.login}, a talented developer with ${stats.totalRepos} public repositories and expertise in ${topLanguage}.

${user.bio ? `They describe themselves as: "${user.bio}"` : ''}

Feel free to ask me about their projects, skills, or anything else you'd like to know about their work! 🚀`;
};

// Function to handle common query patterns
export const getQuickResponse = (query: string, userData: ProcessedUserData): string | null => {
  const { user, repositories, stats, topLanguages } = userData;
  const lowerQuery = query.toLowerCase();

  // Handle common questions with quick responses
  if (lowerQuery.includes('what do they do') || lowerQuery.includes('what is their specialty')) {
    const topLang = topLanguages[0]?.name || 'programming';
    return `${user.name || user.login} specializes in ${topLang} and has worked on ${stats.totalRepos} projects, earning ${stats.totalStars} stars across their repositories.`;
  }

  if (lowerQuery.includes('best project') || lowerQuery.includes('top project')) {
    const topRepo = repositories.sort((a, b) => b.stargazers_count - a.stargazers_count)[0];
    if (topRepo) {
      return `Their most popular project is **${topRepo.name}** with ${topRepo.stargazers_count} stars. ${topRepo.description || 'Check it out on GitHub!'}`;
    }
  }

  if (lowerQuery.includes('how many') && lowerQuery.includes('repositories')) {
    return `${user.name || user.login} has ${stats.totalRepos} public repositories on GitHub.`;
  }

  if (lowerQuery.includes('what languages') || lowerQuery.includes('programming languages')) {
    const langs = topLanguages.slice(0, 3).map(l => l.name).join(', ');
    return `They primarily work with ${langs}${topLanguages.length > 3 ? ` and ${topLanguages.length - 3} other languages` : ''}.`;
  }

  if (lowerQuery.includes('where are they') || lowerQuery.includes('location')) {
    return user.location ? `${user.name || user.login} is based in ${user.location}.` : `I don't have information about their location.`;
  }

  if (lowerQuery.includes('contact') || lowerQuery.includes('reach out')) {
    return `You can find ${user.name || user.login} on GitHub at @${user.login}${user.blog ? ` or visit their website at ${user.blog}` : ''}.`;
  }

  // Return null if no quick response matches
  return null;
};
// Portfolio API - Core functionality for GitHub portfolio data and AI chat
import { githubService } from './utils/github';
import { createGeminiModel } from './utils/gemini';
import { processUserData } from './utils/dataProcessing';
import { createSystemPrompt } from './utils/chatPrompts';
import { generateText } from 'ai';
import type { ProcessedUserData } from './types';

export * from './hooks/useGitHubData';
export * from './hooks/useGitHubDataWrapper';
export * from './utils/github';
export * from './utils/gemini';
export * from './utils/chatPrompts';
export * from './utils/dataProcessing';
export * from './types';
export * from './tools';

// Main API class for programmatic access
export class PortfolioAPI {
  private githubService: typeof githubService;
  private geminiModel: ReturnType<typeof createGeminiModel>;

  constructor() {
    // Initialize services
    this.githubService = githubService;
    this.geminiModel = createGeminiModel();
  }

  /**
   * Fetch GitHub user data and repositories
   */
  async getUserData(username: string) {
    try {
      const [user, repos] = await Promise.all([
        this.githubService.getUser(username),
        this.githubService.getUserRepos(username)
      ]);

      return processUserData(user, repos);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to fetch user data: ${errorMessage}`);
    }
  }

  /**
   * Generate AI response for a user query
   */
  async generateChatResponse(userData: ProcessedUserData, userQuery: string) {
    try {
      const systemPrompt = createSystemPrompt(userData);

      const result = await generateText({
        model: this.geminiModel,
        system: systemPrompt,
        prompt: userQuery,
      });

      return result.text;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to generate AI response: ${errorMessage}`);
    }
  }

  /**
   * Get user repositories
   */
  async getUserRepos(username: string, options?: { limit?: number; sort?: 'created' | 'updated' | 'pushed' | 'full_name' }) {
    try {
      const apiOptions = options ? {
        per_page: options.limit || 30,
        sort: options.sort || 'updated'
      } : {};
      return await this.githubService.getUserRepos(username, apiOptions);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to fetch repositories: ${errorMessage}`);
    }
  }

  /**
   * Get user profile
   */
  async getUserProfile(username: string) {
    try {
      return await this.githubService.getUser(username);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to fetch user profile: ${errorMessage}`);
    }
  }
}

// Export default instance
export default new PortfolioAPI();
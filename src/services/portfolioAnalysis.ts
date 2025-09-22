import { portfolioAnalysisAgent } from '../agent';

export interface PortfolioAnalysisService {
  analyzePortfolio: (prompt: string, username: string) => Promise<string>;
}

class PortfolioAnalysisServiceImpl implements PortfolioAnalysisService {
  async analyzePortfolio(prompt: string, username: string): Promise<string> {
    try {
      // For now, we'll create a mock response since the agent requires server-side execution
      // In a real implementation, this would call your backend API that runs the portfolioAnalysisAgent
      
      const contextualPrompt = `for user '${username}'. ${prompt}`

      const agentResponse = await portfolioAnalysisAgent(contextualPrompt);
      return agentResponse;

    } catch (error) {
      console.error('Error in portfolio analysis:', error);
      throw new Error('Failed to analyze portfolio. Please try again.');
    }
  }
}

export const portfolioAnalysisService = new PortfolioAnalysisServiceImpl();
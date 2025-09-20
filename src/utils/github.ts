import axios, { type AxiosResponse } from 'axios';
import type {
  GitHubUser,
  GitHubRepository,
  GitHubLanguages,
  GitHubApiError
} from '../types';

// Create axios instance with base configuration
const githubApi = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'Portfolio-Generator/1.0.0'
  },
  timeout: 10000 // 10 second timeout
});

// Add GitHub token if available
const githubToken = import.meta.env.VITE_GITHUB_TOKEN;
if (githubToken) {
  githubApi.defaults.headers.common['Authorization'] = `token ${githubToken}`;
}

// Error handling utility
const handleApiError = (error: any): GitHubApiError => {
  if (error.response) {
    // Server responded with error status
    return {
      message: error.response.data?.message || 'API request failed',
      status: error.response.status,
      documentation_url: error.response.data?.documentation_url
    };
  } else if (error.request) {
    // Network error
    return {
      message: 'Network error - please check your internet connection',
      status: undefined
    };
  } else {
    // Other error
    return {
      message: error.message || 'An unexpected error occurred',
      status: undefined
    };
  }
};

// Rate limit handling
let lastRequestTime = 0;
const RATE_LIMIT_DELAY = 1000; // 1 second between requests

const enforceRateLimit = async () => {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;

  if (timeSinceLastRequest < RATE_LIMIT_DELAY) {
    await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY - timeSinceLastRequest));
  }

  lastRequestTime = Date.now();
};

// API Functions
export const githubService = {
  // Fetch user profile
  async getUser(username: string): Promise<GitHubUser> {
    try {
      await enforceRateLimit();
      const response: AxiosResponse<GitHubUser> = await githubApi.get(`/users/${username}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Fetch user repositories with pagination
  async getUserRepos(username: string, options: {
    sort?: 'created' | 'updated' | 'pushed' | 'full_name';
    direction?: 'asc' | 'desc';
    per_page?: number;
    page?: number;
  } = {}): Promise<GitHubRepository[]> {
    try {
      await enforceRateLimit();
      const params = {
        sort: options.sort || 'updated',
        direction: options.direction || 'desc',
        per_page: Math.min(options.per_page || 30, 100), // Max 100 per page
        page: options.page || 1,
        type: 'owner' // Only repos owned by the user
      };

      const response: AxiosResponse<GitHubRepository[]> = await githubApi.get(
        `/users/${username}/repos`,
        { params }
      );

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Fetch repository languages
  async getRepoLanguages(username: string, repoName: string): Promise<GitHubLanguages> {
    try {
      await enforceRateLimit();
      const response: AxiosResponse<GitHubLanguages> = await githubApi.get(
        `/repos/${username}/${repoName}/languages`
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Get rate limit status
  async getRateLimit(): Promise<any> {
    try {
      const response = await githubApi.get('/rate_limit');
      return response.data;
    } catch (error) {
      console.warn('Could not fetch rate limit status:', error);
      return null;
    }
  }
};

export default githubService;
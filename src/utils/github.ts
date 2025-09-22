import axios, { type AxiosResponse, type AxiosError } from 'axios';
import type {
  GitHubUser,
  GitHubRepository,
  GitHubLanguages,
  GitHubApiError,
  GitHubRateLimit
} from '../types';

// Create axios instance with base configuration
const githubApi = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    'Accept': 'application/vnd.github.v3+json'
  },
  timeout: 10000 // 10 second timeout
});

// Add GitHub token if available
const githubToken = import.meta.env.VITE_GITHUB_TOKEN;
if (githubToken) {
  githubApi.defaults.headers.common['Authorization'] = `token ${githubToken}`;
}

// Error handling utility
const handleApiError = (error: unknown): GitHubApiError => {
  const axiosError = error as AxiosError;
  if (axiosError.response) {
    // Server responded with error status
    const data = axiosError.response.data as Record<string, unknown>;
    return {
      message: (data?.message as string) || 'API request failed',
      status: axiosError.response.status,
      documentation_url: data?.documentation_url as string
    };
  } else if (axiosError.request) {
    // Request was made but no response received
    return {
      message: 'Network error - no response received',
      status: undefined
    };
  } else {
    // Something else happened
    return {
      message: axiosError.message || 'An unexpected error occurred',
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
      console.log(`Fetching user: ${username}`);
      const response: AxiosResponse<GitHubUser> = await githubApi.get(`/users/${username}`);
      console.log('User data fetched successfully:', response.data.login, response.data.public_repos);
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
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
        per_page: Math.min(options.per_page || 100, 100), // Increase to max 100
        page: options.page || 1,
        type: 'all' // Fetch all repos (owned and forked)
      };

      console.log(`Fetching repos for ${username} with params:`, params);
      const url = `/users/${username}/repos`;
      console.log('Making request to:', url);

      const response: AxiosResponse<GitHubRepository[]> = await githubApi.get(url, { params });
      
      console.log(`Repositories fetched: ${response.data.length} repos`);
      console.log('First few repos:', response.data.slice(0, 3).map(r => ({ 
        name: r.name, 
        stars: r.stargazers_count, 
        language: r.language 
      })));

      return response.data;
    } catch (error) {
      console.error('Error fetching repositories:', error);
      if (error instanceof Error) {
        console.error('Error details:', {
          message: error.message,
          response: (error as AxiosError).response?.data,
          status: (error as AxiosError).response?.status
        });
      }
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
  async getRateLimit(): Promise<GitHubRateLimit | null> {
    try {
      const response = await githubApi.get('/rate_limit');
      console.log('Rate limit status:', response.data);
      return response.data;
    } catch (error) {
      console.warn('Could not fetch rate limit status:', error);
      return null;
    }
  }
};

export default githubService;
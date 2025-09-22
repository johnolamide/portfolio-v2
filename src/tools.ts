import { z } from "zod";
import { tool } from "ai";
import api from "./index";

// Tool for fetching complete user data (profile + repos + languages)
const getUserDataInput = z.object({
  username: z.string().min(1).describe("The GitHub username to fetch data for"),
});

type GetUserDataInput = z.infer<typeof getUserDataInput>;

async function getUserData({ username }: GetUserDataInput) {
  try {
    return await api.getUserData(username);
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unknown error occurred while fetching user data"
    };
  }
}

export const getUserDataTool = tool({
  description: "Fetch complete GitHub user data including profile, repositories, and programming languages",
  inputSchema: getUserDataInput,
  execute: getUserData,
});

// Tool for fetching user repositories
const getUserReposInput = z.object({
  username: z.string().min(1).describe("The GitHub username to fetch repositories for"),
  limit: z.number().optional().describe("Maximum number of repositories to return"),
  sort: z.enum(['created', 'updated', 'pushed', 'full_name']).optional().describe("Sort order for repositories"),
});

type GetUserReposInput = z.infer<typeof getUserReposInput>;

async function getUserRepos({ username, limit, sort }: GetUserReposInput) {
  try {
    const options: { limit?: number; sort?: 'created' | 'updated' | 'pushed' | 'full_name' } = {};
    if (limit) options.limit = limit;
    if (sort) options.sort = sort;

    return await api.getUserRepos(username, options);
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unknown error occurred while fetching user repositories"
    };
  }
}

export const getUserReposTool = tool({
  description: "Fetch GitHub user repositories with optional sorting and limiting",
  inputSchema: getUserReposInput,
  execute: getUserRepos,
});

// Tool for fetching user profile
const getUserProfileInput = z.object({
  username: z.string().min(1).describe("The GitHub username to fetch profile for"),
});

type GetUserProfileInput = z.infer<typeof getUserProfileInput>;

async function getUserProfile({ username }: GetUserProfileInput) {
  try {
    return await api.getUserProfile(username);
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unknown error occurred while fetching user profile"
    };
  }
}

export const getUserProfileTool = tool({
  description: "Fetch GitHub user profile information",
  inputSchema: getUserProfileInput,
  execute: getUserProfile,
});
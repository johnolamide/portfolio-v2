#!/usr/bin/env node

// Example usage of the Portfolio API
import { PortfolioAPI } from './src/index.js';
import type { GitHubRepository } from './src/types/index.js';

type LanguageStat = { name: string; value: number; percentage: number };

async function main() {
  console.log('=== Portfolio API Examples ===\n');

  const api = new PortfolioAPI();

  try {
    // Example: Get user data
    console.log('1. Fetching GitHub data for user "johnolamide"...');
    const userData = await api.getUserData('johnolamide');
    console.log('User:', userData.user.login);
    console.log('Repositories:', userData.stats.totalRepos);
    console.log('Top languages:', userData.topLanguages.slice(0, 3).map((l: LanguageStat) => `${l.name} (${l.percentage}%)`));

    // Example: Get user repositories
    console.log('\n2. Fetching user repositories...');
    const repos = await api.getUserRepos('johnolamide', { limit: 3, sort: 'updated' });
    console.log('Recent repos:', repos.slice(0, 3).map((r: GitHubRepository) => r.name));

    // Example: Get user profile
    console.log('\n3. Fetching user profile...');
    const profile = await api.getUserProfile('johnolamide');
    console.log('Profile:', {
      name: profile.name,
      bio: profile.bio,
      followers: profile.followers,
      public_repos: profile.public_repos
    });

    console.log('\n4. MCP Tools Available:');
    console.log('- getUserDataTool: Fetch complete user data');
    console.log('- getUserReposTool: Fetch user repositories with options');
    console.log('- getUserProfileTool: Fetch user profile');
    console.log('\nThese tools can be used by AI agents that support MCP (Model Context Protocol)');

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error:', errorMessage);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
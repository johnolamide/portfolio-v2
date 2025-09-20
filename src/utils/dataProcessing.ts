import type {
  GitHubRepository,
  GitHubLanguages,
  ProcessedUserData,
  GitHubUser
} from '../types';

// Process user repositories to extract language statistics
export const processLanguages = (repos: GitHubRepository[]): {
  languages: GitHubLanguages;
  topLanguages: Array<{ name: string; value: number; percentage: number }>;
} => {
  const languageMap: { [key: string]: number } = {};

  // Aggregate language usage across all repositories
  repos.forEach(repo => {
    if (repo.language) {
      languageMap[repo.language] = (languageMap[repo.language] || 0) + 1;
    }
  });

  // Calculate total for percentages
  const totalRepos = repos.length;
  const topLanguages = Object.entries(languageMap)
    .map(([name, count]) => ({
      name,
      value: count,
      percentage: Math.round((count / totalRepos) * 100)
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10); // Top 10 languages

  return {
    languages: languageMap,
    topLanguages
  };
};

// Calculate user statistics
export const calculateUserStats = (repos: GitHubRepository[]) => {
  const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
  const totalForks = repos.reduce((sum, repo) => sum + repo.forks_count, 0);
  const languages = processLanguages(repos);

  return {
    totalStars,
    totalForks,
    totalRepos: repos.length,
    languagesCount: Object.keys(languages.languages).length,
    topLanguages: languages.topLanguages
  };
};

// Process complete user data for dashboard
export const processUserData = (
  user: GitHubUser,
  repos: GitHubRepository[]
): ProcessedUserData => {
  const stats = calculateUserStats(repos);
  const { languages } = processLanguages(repos);

  return {
    user,
    repositories: repos,
    languages,
    topLanguages: stats.topLanguages,
    stats: {
      totalStars: stats.totalStars,
      totalForks: stats.totalForks,
      totalRepos: stats.totalRepos,
      languagesCount: stats.languagesCount
    }
  };
};

// Sort repositories by different criteria
export const sortRepositories = (
  repos: GitHubRepository[],
  sortBy: 'stars' | 'forks' | 'updated' | 'created' | 'name' = 'updated',
  order: 'asc' | 'desc' = 'desc'
): GitHubRepository[] => {
  const sorted = [...repos].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'stars':
        comparison = a.stargazers_count - b.stargazers_count;
        break;
      case 'forks':
        comparison = a.forks_count - b.forks_count;
        break;
      case 'updated':
        comparison = new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime();
        break;
      case 'created':
        comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        break;
      case 'name':
        comparison = a.name.toLowerCase().localeCompare(b.name.toLowerCase());
        break;
      default:
        return 0;
    }

    return order === 'asc' ? comparison : -comparison;
  });

  return sorted;
};

// Filter repositories by criteria
export const filterRepositories = (
  repos: GitHubRepository[],
  filters: {
    language?: string;
    minStars?: number;
    hasTopics?: boolean;
    isFork?: boolean;
  }
): GitHubRepository[] => {
  return repos.filter(repo => {
    if (filters.language && repo.language !== filters.language) {
      return false;
    }
    if (filters.minStars && repo.stargazers_count < filters.minStars) {
      return false;
    }
    if (filters.hasTopics && (!repo.topics || repo.topics.length === 0)) {
      return false;
    }
    if (filters.isFork !== undefined && repo.fork !== filters.isFork) {
      return false;
    }
    return true;
  });
};

// Format numbers for display
export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

// Get repository health score (simple metric)
export const getRepositoryHealth = (repo: GitHubRepository): {
  score: number;
  factors: string[];
} => {
  let score = 0;
  const factors: string[] = [];

  // Stars contribute to health
  if (repo.stargazers_count > 0) {
    score += Math.min(repo.stargazers_count / 10, 20);
    factors.push(`${repo.stargazers_count} stars`);
  }

  // Forks indicate interest
  if (repo.forks_count > 0) {
    score += Math.min(repo.forks_count / 5, 15);
    factors.push(`${repo.forks_count} forks`);
  }

  // Recent updates are good
  const daysSinceUpdate = (Date.now() - new Date(repo.updated_at).getTime()) / (1000 * 60 * 60 * 24);
  if (daysSinceUpdate < 30) {
    score += 15;
    factors.push('Recently updated');
  } else if (daysSinceUpdate < 90) {
    score += 10;
    factors.push('Updated within 3 months');
  }

  // Description and topics improve discoverability
  if (repo.description) {
    score += 10;
    factors.push('Has description');
  }

  if (repo.topics && repo.topics.length > 0) {
    score += 5;
    factors.push('Has topics');
  }

  // Language diversity
  if (repo.language) {
    score += 5;
    factors.push(`Written in ${repo.language}`);
  }

  return {
    score: Math.min(Math.round(score), 100),
    factors
  };
};
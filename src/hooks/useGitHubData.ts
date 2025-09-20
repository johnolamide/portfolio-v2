import { useState, useEffect, useCallback } from 'react';
import { githubService } from '../utils/github';
import { processUserData } from '../utils/dataProcessing';
import type {
  GitHubUser,
  GitHubRepository,
  ProcessedUserData,
  GitHubApiError
} from '../types';

// Hook for fetching user profile
export const useGitHubUser = (username: string | null) => {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<GitHubApiError | null>(null);

  const fetchUser = useCallback(async () => {
    if (!username) {
      setUser(null);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const userData = await githubService.getUser(username);
      setUser(userData);
    } catch (err) {
      setError(err as GitHubApiError);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return {
    user,
    loading,
    error,
    refetch: fetchUser
  };
};

// Hook for fetching user repositories
export const useGitHubRepos = (username: string | null, options = {}) => {
  const [repos, setRepos] = useState<GitHubRepository[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<GitHubApiError | null>(null);
  const [hasMore, setHasMore] = useState(false);

  const fetchRepos = useCallback(async (loadMore = false) => {
    if (!username) {
      setRepos([]);
      setError(null);
      setHasMore(false);
      return;
    }

    setLoading(true);
    if (!loadMore) {
      setError(null);
    }

    try {
      const currentPage = loadMore ? Math.ceil(repos.length / 30) + 1 : 1;
      const repoData = await githubService.getUserRepos(username, {
        ...options,
        page: currentPage,
        per_page: 30
      });

      if (loadMore) {
        setRepos(prev => [...prev, ...repoData]);
      } else {
        setRepos(repoData);
      }

      // Check if there are more pages (GitHub returns up to 100 repos per page)
      setHasMore(repoData.length === 30);
    } catch (err) {
      setError(err as GitHubApiError);
      if (!loadMore) {
        setRepos([]);
      }
    } finally {
      setLoading(false);
    }
  }, [username, repos.length, options]);

  useEffect(() => {
    fetchRepos();
  }, [fetchRepos]);

  return {
    repos,
    loading,
    error,
    hasMore,
    loadMore: () => fetchRepos(true),
    refetch: () => fetchRepos(false)
  };
};

// Combined hook for fetching complete user data
export const useGitHubUserData = (username: string | null) => {
  const [processedData, setProcessedData] = useState<ProcessedUserData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<GitHubApiError | null>(null);

  const {
    user,
    loading: userLoading,
    error: userError,
    refetch: refetchUser
  } = useGitHubUser(username);

  const {
    repos,
    loading: reposLoading,
    error: reposError,
    loadMore,
    refetch: refetchRepos
  } = useGitHubRepos(username);

  // Process data when both user and repos are loaded
  useEffect(() => {
    if (user && repos.length > 0) {
      try {
        const processed = processUserData(user, repos);
        setProcessedData(processed);
        setError(null);
      } catch (err) {
        setError({
          message: 'Failed to process user data',
          status: undefined
        });
        setProcessedData(null);
      }
    } else if (user && repos.length === 0) {
      // Handle case where user has no repositories
      try {
        const processed = processUserData(user, []);
        setProcessedData(processed);
        setError(null);
      } catch (err) {
        setError({
          message: 'Failed to process user data',
          status: undefined
        });
        setProcessedData(null);
      }
    } else {
      setProcessedData(null);
    }
  }, [user, repos]);

  // Set loading state
  useEffect(() => {
    setLoading(userLoading || reposLoading);
  }, [userLoading, reposLoading]);

  // Set error state (prioritize user errors)
  useEffect(() => {
    setError(userError || reposError);
  }, [userError, reposError]);

  const refetch = useCallback(() => {
    refetchUser();
    refetchRepos();
  }, [refetchUser, refetchRepos]);

  return {
    data: processedData,
    loading,
    error,
    refetch,
    loadMoreRepos: loadMore
  };
};

// Hook for checking API rate limit status
export const useGitHubRateLimit = () => {
  const [rateLimit, setRateLimit] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const checkRateLimit = useCallback(async () => {
    setLoading(true);
    try {
      const limit = await githubService.getRateLimit();
      setRateLimit(limit);
    } catch (err) {
      console.warn('Failed to check rate limit:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkRateLimit();
  }, [checkRateLimit]);

  return {
    rateLimit,
    loading,
    refetch: checkRateLimit
  };
};
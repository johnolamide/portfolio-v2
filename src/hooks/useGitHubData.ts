import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { githubService } from '../utils/github';
import { processUserData } from '../utils/dataProcessing';
import type {
  GitHubUser,
  GitHubRepository,
  ProcessedUserData,
  GitHubApiError,
  GitHubRateLimit
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
      console.log(`useGitHubUser: Fetching user ${username}`);
      const userData = await githubService.getUser(username);
      console.log(`useGitHubUser: User data received for ${userData.login}`);
      setUser(userData);
    } catch (err) {
      console.error(`useGitHubUser: Error fetching user ${username}:`, err);
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
  const currentPageRef = useRef(0);

  const stableOptions = useMemo(() => options, [options]);

  const fetchRepos = useCallback(async (loadMore = false) => {
    if (!username) {
      console.log('No username provided, clearing repos');
      setRepos([]);
      setError(null);
      setHasMore(false);
      currentPageRef.current = 0;
      return;
    }

    setLoading(true);
    if (!loadMore) {
      setError(null);
      currentPageRef.current = 0;
    }

    try {
      const page = loadMore ? currentPageRef.current + 1 : 1;
      currentPageRef.current = page;

      console.log(`useGitHubRepos: Fetching repos for ${username}, page ${page}`);
      
      const repoData = await githubService.getUserRepos(username, {
        ...stableOptions,
        page,
        per_page: 100 // Increase to max
      });

      console.log(`useGitHubRepos: Received ${repoData.length} repositories`);

      if (loadMore) {
        setRepos(prev => {
          const newRepos = [...prev, ...repoData];
          console.log(`Total repos after loading more: ${newRepos.length}`);
          return newRepos;
        });
      } else {
        setRepos(repoData);
        console.log(`Set repos to ${repoData.length} repositories`);
      }

      // Check if there are more pages
      setHasMore(repoData.length === 100);
    } catch (err) {
      console.error('useGitHubRepos: Error fetching repositories:', err);
      setError(err as GitHubApiError);
      if (!loadMore) {
        setRepos([]);
      }
    } finally {
      setLoading(false);
    }
  }, [username]); // Remove stableOptions from dependencies

  useEffect(() => {
    fetchRepos();
  }, [fetchRepos]); // Now fetchRepos only depends on username, so this is safe

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
    console.log('useGitHubUserData: Processing data...', {
      hasUser: !!user,
      userLoading,
      reposLoading,
      reposCount: repos.length,
      username: user?.login
    });

    if (user && !userLoading && !reposLoading) {
      try {
        console.log('useGitHubUserData: Both user and repos loaded, processing...');
        const processed = processUserData(user, repos);
        setProcessedData(processed);
        setError(null);
        console.log('useGitHubUserData: Data processed successfully');
      } catch (err) {
        console.error('useGitHubUserData: Error processing data:', err);
        setError({
          message: 'Failed to process user data',
          status: undefined
        });
        setProcessedData(null);
      }
    } else {
      console.log('useGitHubUserData: Not ready to process data yet');
      setProcessedData(null);
    }
  }, [user, repos, userLoading, reposLoading]);

  // Set loading state
  useEffect(() => {
    const isLoading = userLoading || reposLoading;
    console.log('useGitHubUserData: Loading state:', { userLoading, reposLoading, isLoading });
    setLoading(isLoading);
  }, [userLoading, reposLoading]);

  // Set error state (prioritize user errors)
  useEffect(() => {
    const currentError = userError || reposError;
    if (currentError) {
      console.log('useGitHubUserData: Error state:', currentError);
    }
    setError(currentError);
  }, [userError, reposError]);

  const refetch = useCallback(() => {
    console.log('useGitHubUserData: Refetching data...');
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
  const [rateLimit, setRateLimit] = useState<GitHubRateLimit | null>(null);
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
import { useState, useCallback, useEffect } from 'react';
import { useGitHubUserData } from './useGitHubData';

export const useGitHubData = () => {
  const [username, setUsername] = useState<string | null>(null);
  const { data, loading, error } = useGitHubUserData(username);

  // Handle initial URL parameter loading
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const usernameFromUrl = urlParams.get('user');
    
    if (usernameFromUrl && !username && !data && !loading) {
      setUsername(usernameFromUrl);
    }
  }, [username, data, loading]);

  const fetchUserData = useCallback(async (newUsername: string) => {
    setUsername(newUsername);
  }, []);

  const resetData = useCallback(() => {
    setUsername(null);
  }, []);

  return {
    userData: data,
    loading,
    error,
    fetchUserData,
    resetData,
  };
};
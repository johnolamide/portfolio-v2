import { useState, useEffect } from 'react';
import { ThemeProvider, useTheme } from './components/theme-provider';
import { ThemeToggle } from './components/theme-toggle';
// import { TailwindTest } from './components/tailwind-test';
import { Dashboard } from './components/Dashboard';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { useGitHubUserData } from './hooks/useGitHubData';
import { Github, Sparkles, Code, Users, Star } from 'lucide-react';
import './App.css';

function ThemeDebug() {
  const { theme } = useTheme();
  return (
    <div className="fixed top-16 right-4 z-50 bg-black/80 text-white px-2 py-1 rounded text-xs font-mono">
      Theme: {theme}
    </div>
  );
}

function LandingPage({ onSubmit }: { onSubmit: (username: string) => void }) {
  const [username, setUsername] = useState('johnolamide');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Please enter a GitHub username');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await onSubmit(username.trim());
    } catch {
      setError('Failed to load portfolio. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-100 dark:from-purple-950 dark:via-pink-950 dark:to-indigo-950 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 dark:bg-purple-600 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-300 dark:bg-pink-600 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-indigo-300 dark:bg-indigo-600 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 rounded-2xl shadow-lg">
                <Github className="w-12 h-12 text-white" />
              </div>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent mb-6">
              GitHub Portfolio Generator
            </h1>

            <p className="text-xl md:text-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent mb-8 max-w-2xl mx-auto leading-relaxed font-medium">
              Discover amazing developer portfolios powered by AI insights.
              Transform any GitHub profile into a stunning, interactive portfolio dashboard.
            </p>

            {/* Feature highlights */}
            <div className="flex flex-wrap justify-center gap-6 mb-12">
              <div className="flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-purple-200 dark:border-purple-700">
                <Code className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <span className="text-sm font-semibold bg-gradient-to-r from-purple-700 to-purple-600 dark:from-purple-300 dark:to-purple-400 bg-clip-text text-transparent">Code Analytics</span>
              </div>
              <div className="flex items-center space-x-2 bg-gradient-to-r from-pink-100 to-rose-100 dark:from-pink-900/30 dark:to-rose-900/30 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-pink-200 dark:border-pink-700">
                <Users className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                <span className="text-sm font-semibold bg-gradient-to-r from-pink-700 to-rose-600 dark:from-pink-300 dark:to-rose-400 bg-clip-text text-transparent">Social Insights</span>
              </div>
              <div className="flex items-center space-x-2 bg-gradient-to-r from-indigo-100 to-blue-100 dark:from-indigo-900/30 dark:to-blue-900/30 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-indigo-200 dark:border-indigo-700">
                <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <span className="text-sm font-semibold bg-gradient-to-r from-indigo-700 to-blue-600 dark:from-indigo-300 dark:to-blue-400 bg-clip-text text-transparent">AI-Powered</span>
              </div>
            </div>
          </div>

          {/* Username Input Form */}
          <div className="max-w-md mx-auto">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-lg font-bold bg-gradient-to-r from-purple-700 to-pink-600 dark:from-purple-300 dark:to-pink-400 bg-clip-text text-transparent mb-3 text-center">
                  Enter GitHub Username
                </label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setError('');
                  }}
                  placeholder="e.g., johnolamide"
                  className="w-full text-center text-lg py-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-2 border-purple-200 dark:border-purple-700 focus:border-purple-500 dark:focus:border-purple-400 shadow-xl text-gray-900 dark:text-white placeholder:text-purple-400 dark:placeholder:text-purple-500"
                  disabled={isLoading}
                  required
                />
              </div>

              {error && (
                <div className="bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30 backdrop-blur-sm py-3 px-4 rounded-lg border border-red-200 dark:border-red-700">
                  <p className="text-red-700 dark:text-red-300 text-center font-medium">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Loading Portfolio...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <Star className="w-5 h-5" />
                    <span>Generate Portfolio</span>
                  </div>
                )}
              </Button>
            </form>

            <div className="text-center mt-6">
              <p className="text-base bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent font-medium">
                Try with <span className="font-bold text-purple-700 dark:text-purple-300">"johnolamide"</span> or any GitHub username
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard'>(() => {
    // Restore view from localStorage on page load
    return (localStorage.getItem('portfolio-current-view') as 'landing' | 'dashboard') || 'landing';
  });
  const [username, setUsername] = useState<string | null>(() => {
    // Restore username from localStorage on page load
    return localStorage.getItem('portfolio-username') || null;
  });

  const { data, loading, error, refetch } = useGitHubUserData(username);

  // Save view and username to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('portfolio-current-view', currentView);
    if (username) {
      localStorage.setItem('portfolio-username', username);
    }
  }, [currentView, username]);

  const handleUsernameSubmit = async (submittedUsername: string) => {
    setUsername(submittedUsername);
    setCurrentView('dashboard');
  };

  const handleBackToLanding = () => {
    setCurrentView('landing');
    // Don't clear username from localStorage, just change view
  };

  const handleRetry = () => {
    refetch();
  };

  return (
    <ThemeProvider defaultTheme="light" storageKey="portfolio-theme">
      <ThemeToggle />
      <ThemeDebug />
      {/* <TailwindTest /> */}

      {currentView === 'landing' ? (
        <LandingPage onSubmit={handleUsernameSubmit} />
      ) : (
        <Dashboard
          data={data}
          loading={loading}
          error={error?.message || null}
          onRetry={handleRetry}
          onBackToLanding={handleBackToLanding}
        />
      )}
    </ThemeProvider>
  );
}

export default App;

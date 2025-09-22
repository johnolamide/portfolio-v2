import React from 'react';
import type { ProcessedUserData } from '../types';
import { UserProfileCard } from './UserProfileCard';
import { ProgrammingLanguagesChart } from './ProgrammingLanguagesChart';
import { RepositoryGrid } from './RepositoryGrid';
import { ActivityTimeline } from './ActivityTimeline';
import { StatisticsOverview } from './StatisticsOverview';
import { ChatBot } from './ChatBot';
import { Card, CardContent } from './ui/card';
import { Loader2, AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { portfolioAnalysisService } from '../services/portfolioAnalysis';

interface DashboardProps {
  data: ProcessedUserData | null;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onBackToLanding: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  data,
  loading,
  error,
  onRetry,
  onBackToLanding
}) => {
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="p-8 text-center">
            <Loader2 className="w-12 h-12 animate-spin text-purple-600 dark:text-purple-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Loading Portfolio Data
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Fetching your GitHub profile and repositories...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Error Loading Data
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {error}
            </p>
            <Button onClick={onRetry} className="w-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Data Available
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Unable to load portfolio data. Please try again.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { user, repositories, stats, topLanguages } = data;
  console.log('Top Languages:', topLanguages);
  console.log('User Stats:', stats);
  console.log('Total Repositories:', repositories);
  console.log('User Info:', user);

  const handlePortfolioAnalysis = async (prompt: string): Promise<string> => {
    return await portfolioAnalysisService.analyzePortfolio(prompt, user.login);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Back Button */}
      <div className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4 max-w-7xl">
          <Button
            onClick={onBackToLanding}
            variant="outline"
            className="flex items-center space-x-2 hover:bg-purple-50 dark:hover:bg-purple-900/20 border-purple-200 dark:border-purple-700"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Landing</span>
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Portfolio Dashboard
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Your GitHub profile and project analytics
          </p>
        </div>

        {/* User Profile Section */}
        <div className="mb-8">
          <UserProfileCard
            user={user}
            totalStars={stats.totalStars}
          />
        </div>

        {/* Statistics Overview */}
        <div className="mb-8">
          <StatisticsOverview
            repositories={repositories}
            totalStars={stats.totalStars}
            totalForks={stats.totalForks}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
          {/* Programming Languages Chart */}
          <div className="xl:col-span-1">
            <ProgrammingLanguagesChart
              languages={topLanguages}
              chartType="pie"
            />
          </div>

          {/* Activity Timeline */}
          <div className="xl:col-span-1">
            <ActivityTimeline repositories={repositories} />
          </div>
        </div>

        {/* Repository Grid */}
        <div className="mb-8">
          <RepositoryGrid
            repositories={repositories}
            maxItems={12}
          />
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 dark:text-gray-400 text-sm">
          <p>
            Data fetched from GitHub API • Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* AI Chatbot - Floating */}
      <ChatBot 
        username={user.login}
        onAnalyzePortfolio={handlePortfolioAnalysis}
      />
    </div>
  );
};
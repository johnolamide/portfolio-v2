import React, { useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import type { GitHubRepository } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import {
  Star,
  GitFork,
  GitBranch,
  TrendingUp,
  Award,
  BarChart3,
  PieChart as PieChartIcon
} from 'lucide-react';

interface StatisticsOverviewProps {
  repositories: GitHubRepository[];
  totalStars: number;
  totalForks: number;
}

interface LanguageStats {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

interface RepoStats {
  name: string;
  stars: number;
  forks: number;
  language: string;
}

const COLORS = [
  '#8b5cf6', // purple-500
  '#3b82f6', // blue-500
  '#10b981', // emerald-500
  '#f59e0b', // amber-500
  '#ef4444', // red-500
  '#06b6d4', // cyan-500
  '#84cc16', // lime-500
  '#f97316', // orange-500
  '#ec4899', // pink-500
  '#6b7280', // gray-500
];

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
        <p className="font-semibold text-gray-900 dark:text-white">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }} className="text-sm">
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

interface PieTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: LanguageStats;
  }>;
}

const PieTooltip = ({ active, payload }: PieTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
        <p className="font-semibold text-gray-900 dark:text-white">{data.name}</p>
        <p className="text-purple-600 dark:text-purple-400">
          {data.value} repositories ({data.percentage}%)
        </p>
      </div>
    );
  }
  return null;
};

export const StatisticsOverview: React.FC<StatisticsOverviewProps> = ({
  repositories,
  totalStars,
  totalForks
}) => {
  const stats = useMemo(() => {
    const languageMap: { [key: string]: number } = {};
    const topRepos: RepoStats[] = [];

    // Process language distribution
    repositories.forEach(repo => {
      if (repo.language) {
        languageMap[repo.language] = (languageMap[repo.language] || 0) + 1;
      }

      // Collect top repositories by stars
      topRepos.push({
        name: repo.name,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        language: repo.language || 'Unknown'
      });
    });

    // Create language stats for pie chart
    const languageStats: LanguageStats[] = Object.entries(languageMap)
      .map(([name, count], index) => ({
        name,
        value: count,
        percentage: Math.round((count / repositories.length) * 100),
        color: COLORS[index % COLORS.length]
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8); // Top 8 languages

    // Top repositories by stars
    const topStarredRepos = topRepos
      .sort((a, b) => b.stars - a.stars)
      .slice(0, 10);

    // Calculate additional metrics
    const avgStarsPerRepo = repositories.length > 0 ? (totalStars / repositories.length).toFixed(1) : '0';
    const avgForksPerRepo = repositories.length > 0 ? (totalForks / repositories.length).toFixed(1) : '0';
    const mostUsedLanguage = languageStats.length > 0 ? languageStats[0].name : 'None';

    return {
      languageStats,
      topStarredRepos,
      avgStarsPerRepo,
      avgForksPerRepo,
      mostUsedLanguage,
      totalLanguages: Object.keys(languageMap).length
    };
  }, [repositories, totalStars, totalForks]);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  return (
    <div className="w-full space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                <Star className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatNumber(totalStars)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Stars</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <GitFork className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatNumber(totalForks)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Forks</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <GitBranch className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {repositories.length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Repositories</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Award className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalLanguages}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Languages</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
              {stats.avgStarsPerRepo}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Avg Stars per Repo</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              {stats.avgForksPerRepo}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Avg Forks per Repo</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              {stats.mostUsedLanguage}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Most Used Language</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Language Distribution Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <PieChartIcon className="w-5 h-5" />
              Language Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    data={stats.languageStats as any}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name} ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {stats.languageStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Repositories Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Top Repositories by Stars
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stats.topStarredRepos.slice(0, 8)}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 10 }}
                    className="text-gray-600 dark:text-gray-400"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    interval={0}
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    className="text-gray-600 dark:text-gray-400"
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="stars" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Repositories List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Top Performing Repositories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats.topStarredRepos.slice(0, 5).map((repo, index) => (
              <div
                key={repo.name}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full">
                    <span className="text-sm font-bold text-purple-700 dark:text-purple-300">
                      {index + 1}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {repo.name}
                    </h4>
                    {repo.language && (
                      <Badge variant="secondary" className="text-xs mt-1">
                        {repo.language}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="font-medium">{formatNumber(repo.stars)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <GitFork className="w-4 h-4 text-blue-500" />
                    <span className="font-medium">{formatNumber(repo.forks)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
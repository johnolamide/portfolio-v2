import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import type { GitHubRepository } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Activity, TrendingUp, Calendar, GitCommit } from 'lucide-react';

interface ActivityTimelineProps {
  repositories: GitHubRepository[];
}

interface ActivityData {
  date: string;
  repositories: number;
  commits: number; // Placeholder for future commit data
  displayDate: string;
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: ActivityData;
  }>;
}

const CustomTooltip = ({ active, payload }: TooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
        <p className="font-semibold text-gray-900 dark:text-white">{data.displayDate}</p>
        <p className="text-purple-600 dark:text-purple-400">
          {data.repositories} repositories active
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {data.commits} commits (estimated)
        </p>
      </div>
    );
  }
  return null;
};

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ repositories }) => {
  const activityData = useMemo(() => {
    if (!repositories || repositories.length === 0) return [];

    // Group repositories by month
    const monthlyData: { [key: string]: { count: number; repos: GitHubRepository[] } } = {};

    repositories.forEach(repo => {
      const date = new Date(repo.created_at);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { count: 0, repos: [] };
      }
      monthlyData[monthKey].count += 1;
      monthlyData[monthKey].repos.push(repo);
    });

    // Convert to chart data format
    const chartData: ActivityData[] = Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([monthKey, data]) => {
        const [year, month] = monthKey.split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1);

        // Estimate commits based on repository activity (this is a placeholder)
        const avgCommitsPerRepo = 50; // Rough estimate
        const estimatedCommits = data.count * avgCommitsPerRepo;

        return {
          date: monthKey,
          repositories: data.count,
          commits: estimatedCommits,
          displayDate: date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short'
          })
        };
      });

    return chartData;
  }, [repositories]);

  const recentActivity = useMemo(() => {
    if (!repositories || repositories.length === 0) return [];

    return repositories
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      .slice(0, 5)
      .map(repo => ({
        ...repo,
        daysSinceUpdate: Math.floor(
          (new Date().getTime() - new Date(repo.updated_at).getTime()) / (1000 * 60 * 60 * 24)
        )
      }));
  }, [repositories]);

  if (!repositories || repositories.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Activity Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
            No activity data available
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalActivity = activityData.reduce((sum, month) => sum + month.repositories, 0);
  const avgMonthlyActivity = activityData.length > 0 ? (totalActivity / activityData.length).toFixed(1) : '0';

  return (
    <div className="w-full space-y-6">
      {/* Activity Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <GitCommit className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {repositories.length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Repositories</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {avgMonthlyActivity}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg Monthly Activity</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {activityData.length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Months</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
            Repository Creation Timeline
          </CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Monthly breakdown of repository creation activity
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={activityData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis
                  dataKey="displayDate"
                  tick={{ fontSize: 12 }}
                  className="text-gray-600 dark:text-gray-400"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  className="text-gray-600 dark:text-gray-400"
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="repositories"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#8b5cf6', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
            Recent Activity
          </CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Latest repository updates
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((repo) => (
              <div
                key={repo.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 dark:text-white truncate">
                    {repo.name}
                  </h4>
                  {repo.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate mt-1">
                      {repo.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3 ml-4">
                  {repo.language && (
                    <Badge variant="secondary" className="text-xs">
                      {repo.language}
                    </Badge>
                  )}

                  <div className="text-right">
                    <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                      <Activity className="w-3 h-3" />
                      <span>
                        {repo.daysSinceUpdate === 0
                          ? 'Today'
                          : `${repo.daysSinceUpdate} days ago`
                        }
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <span>⭐ {repo.stargazers_count}</span>
                      <span>🍴 {repo.forks_count}</span>
                    </div>
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
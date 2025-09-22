import React from 'react';
import type { GitHubRepository } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Star, GitFork, Calendar, ExternalLink } from 'lucide-react';

interface RepositoryGridProps {
  repositories: GitHubRepository[];
  maxItems?: number;
}

const RepositoryCard: React.FC<{ repo: GitHubRepository }> = ({ repo }) => {
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 30) {
      return `${diffDays} days ago`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months > 1 ? 's' : ''} ago`;
    } else {
      const years = Math.floor(diffDays / 365);
      return `${years} year${years > 1 ? 's' : ''} ago`;
    }
  };

  const getLanguageColor = (language: string | null): string => {
    const colors: { [key: string]: string } = {
      JavaScript: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      TypeScript: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      Python: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      Java: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      'C++': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
      'C#': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      PHP: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
      Ruby: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      Go: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300',
      Rust: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      Swift: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      Kotlin: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      Dart: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      HTML: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      CSS: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      Shell: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
    };
    return colors[language || ''] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  };

  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-200 border-gray-200 dark:border-gray-700">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 leading-tight">
            {repo.name}
          </CardTitle>
          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors flex-shrink-0"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {repo.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-2">
            {repo.description}
          </p>
        )}
      </CardHeader>

      <CardContent className="pt-0">
        {/* Language Badge */}
        {repo.language && (
          <div className="mb-3">
            <Badge className={getLanguageColor(repo.language)}>
              {repo.language}
            </Badge>
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center gap-4 mb-3">
          <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
            <Star className="w-4 h-4" />
            <span>{formatNumber(repo.stargazers_count)}</span>
          </div>

          <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
            <GitFork className="w-4 h-4" />
            <span>{formatNumber(repo.forks_count)}</span>
          </div>
        </div>

        {/* Topics */}
        {repo.topics && repo.topics.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {repo.topics.slice(0, 3).map((topic) => (
              <Badge
                key={topic}
                variant="secondary"
                className="text-xs bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
              >
                {topic}
              </Badge>
            ))}
            {repo.topics.length > 3 && (
              <Badge
                variant="secondary"
                className="text-xs bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
              >
                +{repo.topics.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Updated Date */}
        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
          <Calendar className="w-3 h-3" />
          <span>Updated {formatDate(repo.updated_at)}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export const RepositoryGrid: React.FC<RepositoryGridProps> = ({
  repositories,
  maxItems = 12
}) => {
  const displayRepos = repositories.slice(0, maxItems);

  if (!repositories || repositories.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
            Repositories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
            No repositories found
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Repositories
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Your latest {displayRepos.length} repositories
          </p>
        </div>

        {repositories.length > maxItems && (
          <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
            Showing {maxItems} of {repositories.length}
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayRepos.map((repo) => (
          <RepositoryCard key={repo.id} repo={repo} />
        ))}
      </div>
    </div>
  );
};
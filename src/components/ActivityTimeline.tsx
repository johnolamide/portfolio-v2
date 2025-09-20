import React from 'react';
import { motion } from 'framer-motion';
import type { GitHubRepository } from '../types';

interface ActivityTimelineProps {
  repositories: GitHubRepository[];
}

const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ repositories }) => {
  // Sort repositories by most recent update and take top 10
  const recentRepos = repositories
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 10);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  if (recentRepos.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
      >
        <h3 className="text-xl font-semibold text-white mb-4">Recent Activity</h3>
        <p className="text-gray-400">No recent activity available</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
    >
      <h3 className="text-xl font-semibold text-white mb-6">Recent Activity</h3>

      <div className="space-y-4">
        {recentRepos.map((repo, index) => (
          <motion.div
            key={repo.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start space-x-4 p-4 bg-white/5 rounded-lg border border-white/10 hover:border-white/20 transition-colors"
          >
            <div className="flex-shrink-0">
              <div className="w-3 h-3 bg-purple-500 rounded-full mt-2"></div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-white font-medium truncate">
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-purple-300 transition-colors hover:underline"
                  >
                    {repo.name}
                  </a>
                </h4>
                <span className="text-sm text-gray-400 ml-2">
                  {formatDate(repo.updated_at)}
                </span>
              </div>

              {repo.description && (
                <p className="text-gray-300 text-sm mt-1 line-clamp-2">
                  {repo.description}
                </p>
              )}

              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-400">
                {repo.language && (
                  <div className="flex items-center">
                    <div
                      className="w-2 h-2 rounded-full mr-1"
                      style={{
                        backgroundColor: getLanguageColor(repo.language)
                      }}
                    ></div>
                    {repo.language}
                  </div>
                )}

                {repo.stargazers_count > 0 && (
                  <div className="flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {repo.stargazers_count}
                  </div>
                )}

                {repo.forks_count > 0 && (
                  <div className="flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    {repo.forks_count}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// Helper function for language colors (same as in ProjectCard)
const getLanguageColor = (language: string) => {
  const colors: { [key: string]: string } = {
    JavaScript: '#f1e05a',
    TypeScript: '#3178c6',
    Python: '#3572A5',
    Java: '#b07219',
    'C++': '#f34b7d',
    'C#': '#239120',
    PHP: '#4F5D95',
    Ruby: '#701516',
    Go: '#00ADD8',
    Rust: '#dea584',
    Swift: '#ffac45',
    Kotlin: '#F18E33',
    Dart: '#00B4AB',
    HTML: '#e34c26',
    CSS: '#1572B6',
    Vue: '#4FC08D',
    React: '#61DAFB',
    Shell: '#89e051'
  };
  return colors[language] || '#586069';
};

export default ActivityTimeline;
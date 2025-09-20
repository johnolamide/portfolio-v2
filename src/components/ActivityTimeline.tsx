import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Clock, Star, GitFork, ExternalLink, TrendingUp } from 'lucide-react';
import type { GitHubRepository } from '../types';

interface ActivityTimelineProps {
  repositories: GitHubRepository[];
}

const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ repositories }) => {
  const [showAll, setShowAll] = useState(false);
  
  // Sort repositories by most recent update
  const recentRepos = repositories
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
    
  const displayRepos = showAll ? recentRepos : recentRepos.slice(0, 8);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? 's' : ''} ago`;
    return `${Math.floor(diffDays / 365)} year${Math.floor(diffDays / 365) > 1 ? 's' : ''} ago`;
  };

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

  if (recentRepos.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl"
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-blue-600/10 to-cyan-600/10 rounded-2xl blur-2xl"
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <div className="relative z-10 text-center">
          <motion.div
            className="flex justify-center mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Activity className="w-8 h-8 text-purple-400" />
          </motion.div>
          <h3 className="text-2xl font-bold text-white mb-4">Recent Activity</h3>
          <p className="text-gray-400">No recent activity available</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative"
    >
      {/* Background gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-blue-600/10 to-cyan-600/10 rounded-2xl blur-2xl"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 1 }}
      />

      <motion.div
        className="relative bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl overflow-hidden"
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
      >
        {/* Animated background pattern */}
        <motion.div
          className="absolute inset-0 opacity-5"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          style={{
            backgroundImage: 'radial-gradient(circle at 25% 25%, #ffffff 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />

        <div className="relative z-10">
          {/* Header */}
          <motion.div
            className="flex items-center gap-4 mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              className="p-3 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl shadow-lg"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <Activity className="w-8 h-8 text-white" />
            </motion.div>
            <div>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-white via-green-200 to-teal-200 bg-clip-text text-transparent">
                Recent Activity
              </h3>
              <p className="text-gray-400 mt-1">Latest repository updates and contributions</p>
            </div>
          </motion.div>

          {/* Timeline */}
          <div className="relative">
            {/* Timeline line */}
            <motion.div
              className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 via-blue-500 to-cyan-500"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
            />

            <div className="space-y-6">
              <AnimatePresence>
                {displayRepos.map((repo, index) => (
                  <motion.div
                    key={repo.id}
                    initial={{ opacity: 0, x: -50, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 50, scale: 0.9 }}
                    transition={{ 
                      delay: 0.6 + index * 0.1,
                      duration: 0.6,
                      ease: [0.25, 0.46, 0.45, 0.94]
                    }}
                    className="relative"
                  >
                    {/* Timeline dot */}
                    <motion.div
                      className="absolute left-5 top-6 w-3 h-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full border-2 border-white/20 shadow-lg"
                      whileHover={{ scale: 1.5 }}
                      animate={{
                        boxShadow: [
                          "0 0 0 0 rgba(147, 51, 234, 0.4)",
                          "0 0 0 10px rgba(147, 51, 234, 0)",
                          "0 0 0 0 rgba(147, 51, 234, 0)"
                        ]
                      }}
                      transition={{
                        boxShadow: {
                          duration: 2,
                          repeat: Infinity,
                          delay: index * 0.2
                        }
                      }}
                    />

                    {/* Content card */}
                    <motion.div
                      className="ml-16 p-6 bg-white/5 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300"
                      whileHover={{ 
                        scale: 1.02,
                        backgroundColor: 'rgba(255, 255, 255, 0.1)'
                      }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <motion.h4
                          className="text-lg font-semibold text-white group"
                          whileHover={{ scale: 1.02 }}
                        >
                          <motion.a
                            href={repo.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-purple-300 transition-colors flex items-center gap-2"
                            whileHover={{ x: 2 }}
                          >
                            {repo.name}
                            <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </motion.a>
                        </motion.h4>

                        <motion.div
                          className="flex items-center gap-1 text-gray-400"
                          whileHover={{ scale: 1.05 }}
                        >
                          <Clock className="w-4 h-4" />
                          <span className="text-sm">{formatDate(repo.updated_at)}</span>
                        </motion.div>
                      </div>

                      {repo.description && (
                        <motion.p
                          className="text-gray-300 text-sm mb-4 leading-relaxed"
                          initial={{ opacity: 0.8 }}
                          whileHover={{ opacity: 1 }}
                        >
                          {repo.description}
                        </motion.p>
                      )}

                      {/* Stats and language */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {repo.language && (
                            <motion.div
                              className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full"
                              whileHover={{ scale: 1.05 }}
                            >
                              <div
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: getLanguageColor(repo.language) }}
                              />
                              <span className="text-sm text-gray-300">{repo.language}</span>
                            </motion.div>
                          )}
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          {repo.stargazers_count > 0 && (
                            <motion.div
                              className="flex items-center gap-1"
                              whileHover={{ scale: 1.1, color: '#fbbf24' }}
                            >
                              <Star className="w-4 h-4" />
                              <span>{repo.stargazers_count}</span>
                            </motion.div>
                          )}

                          {repo.forks_count > 0 && (
                            <motion.div
                              className="flex items-center gap-1"
                              whileHover={{ scale: 1.1, color: '#34d399' }}
                            >
                              <GitFork className="w-4 h-4" />
                              <span>{repo.forks_count}</span>
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Show more/less button */}
            {recentRepos.length > 8 && (
              <motion.div
                className="text-center mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <motion.button
                  onClick={() => setShowAll(!showAll)}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 flex items-center gap-2 mx-auto"
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 10px 30px rgba(147, 51, 234, 0.3)"
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <TrendingUp className="w-5 h-5" />
                  {showAll ? `Show Less` : `Show All ${recentRepos.length} Activities`}
                </motion.button>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ActivityTimeline;
import React from 'react';
import { motion } from 'framer-motion';
import type { ProjectCardProps } from '../types';

const ProjectCard: React.FC<ProjectCardProps> = ({ repository }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getLanguageColor = (language: string | null) => {
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
    return colors[language || ''] || '#586069';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-white mb-2 hover:text-purple-300 transition-colors">
            <a
              href={repository.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              {repository.name}
            </a>
          </h3>
          {repository.description && (
            <p className="text-gray-300 text-sm leading-relaxed mb-3 line-clamp-2">
              {repository.description}
            </p>
          )}
        </div>
        <div className="flex items-center space-x-1 ml-4">
          <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="text-sm text-gray-400">{repository.stargazers_count}</span>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
        {repository.language && (
          <div className="flex items-center">
            <div
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: getLanguageColor(repository.language) }}
            ></div>
            {repository.language}
          </div>
        )}
        <div className="flex items-center space-x-4">
          {repository.forks_count > 0 && (
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              {repository.forks_count}
            </div>
          )}
          <div>Updated {formatDate(repository.updated_at)}</div>
        </div>
      </div>

      {repository.topics && repository.topics.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {repository.topics.slice(0, 5).map((topic) => (
            <span
              key={topic}
              className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full border border-purple-500/30"
            >
              {topic}
            </span>
          ))}
          {repository.topics.length > 5 && (
            <span className="px-2 py-1 bg-gray-500/20 text-gray-400 text-xs rounded-full">
              +{repository.topics.length - 5} more
            </span>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default ProjectCard;
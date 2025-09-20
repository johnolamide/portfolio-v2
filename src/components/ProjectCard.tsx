import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, animate, AnimatePresence } from 'framer-motion';
import { ExternalLink, Star, GitFork, Calendar, Eye, GitBranch } from 'lucide-react';
import type { ProjectCardProps } from '../types';

// Animated counter hook
const useAnimatedCounter = (end: number, duration: number = 1000) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  React.useEffect(() => {
    const controls = animate(count, end, { duration });
    return controls.stop;
  }, [count, end, duration]);

  return rounded;
};

const ProjectCard: React.FC<ProjectCardProps> = ({ repository }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Animated counters
  const animatedStars = useAnimatedCounter(repository.stargazers_count);
  const animatedForks = useAnimatedCounter(repository.forks_count);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getLanguageGradient = (language: string | null) => {
    const gradients: { [key: string]: string } = {
      JavaScript: 'from-yellow-400 to-yellow-600',
      TypeScript: 'from-blue-400 to-blue-600',
      Python: 'from-green-400 to-green-600',
      Java: 'from-orange-400 to-orange-600',
      'C++': 'from-pink-400 to-pink-600',
      'C#': 'from-green-400 to-green-600',
      PHP: 'from-purple-400 to-purple-600',
      Ruby: 'from-red-400 to-red-600',
      Go: 'from-cyan-400 to-cyan-600',
      Rust: 'from-orange-400 to-orange-600',
      Swift: 'from-orange-400 to-orange-600',
      Kotlin: 'from-orange-400 to-orange-600',
      Dart: 'from-teal-400 to-teal-600',
      HTML: 'from-red-400 to-red-600',
      CSS: 'from-blue-400 to-blue-600',
      Vue: 'from-green-400 to-green-600',
      React: 'from-cyan-400 to-cyan-600',
      Shell: 'from-green-400 to-green-600'
    };
    return gradients[language || ''] || 'from-gray-400 to-gray-600';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{
        y: -8,
        scale: 1.02,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }}
      transition={{
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative group"
    >
      {/* Background gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-blue-600/10 to-cyan-600/10 rounded-2xl blur-2xl"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 1 }}
      />

      {/* Animated border */}
      <motion.div
        className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 opacity-0 group-hover:opacity-100"
        animate={isHovered ? {
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        } : {}}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          backgroundSize: '200% 200%',
          padding: '1px',
        }}
      />

      <motion.div
        className="relative bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 overflow-hidden"
        whileHover={{ borderColor: 'rgba(255, 255, 255, 0.3)' }}
      >
        {/* Animated background pattern */}
        <motion.div
          className="absolute inset-0 opacity-5"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          style={{
            backgroundImage: 'radial-gradient(circle at 25% 25%, #ffffff 1px, transparent 1px)',
            backgroundSize: '15px 15px',
          }}
        />

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0">
              <motion.h3
                className="text-xl font-bold text-white mb-2 truncate"
                whileHover={{ scale: 1.02 }}
              >
                <motion.a
                  href={repository.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-purple-300 transition-colors duration-300 flex items-center gap-2 group/link"
                  whileHover={{ x: 2 }}
                >
                  {repository.name}
                  <ExternalLink className="w-4 h-4 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                </motion.a>
              </motion.h3>

              {repository.description && (
                <motion.p
                  className="text-gray-300 text-sm leading-relaxed mb-3 line-clamp-2"
                  initial={{ opacity: 0.8 }}
                  animate={{ opacity: isHovered ? 1 : 0.8 }}
                >
                  {repository.description}
                </motion.p>
              )}
            </div>

            {/* Stars counter */}
            <motion.div
              className="flex items-center gap-1 ml-4 px-3 py-1 bg-yellow-500/20 rounded-full border border-yellow-500/30"
              whileHover={{ scale: 1.05 }}
            >
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <motion.span
                className="text-sm font-semibold text-yellow-300"
                key={repository.stargazers_count}
              >
                {animatedStars}
              </motion.span>
            </motion.div>
          </div>

          {/* Language and stats */}
          <div className="flex items-center justify-between mb-4">
            {repository.language && (
              <motion.div
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
              >
                <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${getLanguageGradient(repository.language)}`} />
                <span className="text-sm font-medium text-gray-300">{repository.language}</span>
              </motion.div>
            )}

            <div className="flex items-center gap-4">
              {repository.forks_count > 0 && (
                <motion.div
                  className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors"
                  whileHover={{ scale: 1.05 }}
                >
                  <GitFork className="w-4 h-4" />
                  <motion.span
                    className="text-sm font-medium"
                    key={repository.forks_count}
                  >
                    {animatedForks}
                  </motion.span>
                </motion.div>
              )}

              <motion.div
                className="flex items-center gap-1 text-gray-400"
                whileHover={{ scale: 1.05 }}
              >
                <Calendar className="w-4 h-4" />
                <span className="text-xs">{formatDate(repository.updated_at)}</span>
              </motion.div>
            </div>
          </div>

          {/* Topics */}
          {repository.topics && repository.topics.length > 0 && (
            <motion.div
              className="flex flex-wrap gap-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {repository.topics.slice(0, 4).map((topic, index) => (
                <motion.span
                  key={topic}
                  className="px-3 py-1 bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-300 text-xs font-medium rounded-full border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300"
                  whileHover={{
                    scale: 1.05,
                    backgroundColor: 'rgba(147, 51, 234, 0.3)'
                  }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  {topic}
                </motion.span>
              ))}
              {repository.topics.length > 4 && (
                <motion.span
                  className="px-3 py-1 bg-gray-500/20 text-gray-400 text-xs font-medium rounded-full border border-gray-500/30"
                  whileHover={{ scale: 1.05 }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  +{repository.topics.length - 4}
                </motion.span>
              )}
            </motion.div>
          )}

          {/* Hover overlay with additional info */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 pt-4 border-t border-white/10"
              >
                <div className="grid grid-cols-2 gap-4 text-center">
                  <motion.div
                    className="flex flex-col items-center p-2 bg-white/5 rounded-lg"
                    whileHover={{ scale: 1.05 }}
                  >
                    <Eye className="w-4 h-4 text-blue-400 mb-1" />
                    <span className="text-xs text-gray-400">Watchers</span>
                    <span className="text-sm font-semibold text-white">{repository.watchers_count}</span>
                  </motion.div>

                  <motion.div
                    className="flex flex-col items-center p-2 bg-white/5 rounded-lg"
                    whileHover={{ scale: 1.05 }}
                  >
                    <GitBranch className="w-4 h-4 text-green-400 mb-1" />
                    <span className="text-xs text-gray-400">Default Branch</span>
                    <span className="text-sm font-semibold text-white">{repository.default_branch}</span>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProjectCard;
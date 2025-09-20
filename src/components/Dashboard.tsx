import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, Code, Star, TrendingUp } from 'lucide-react';
import UserProfile from './UserProfile';
import SkillsChart from './SkillsChart';
import ProjectCard from './ProjectCard';
import ActivityTimeline from './ActivityTimeline';
import type { ProcessedUserData } from '../types';

interface DashboardProps {
  userData: ProcessedUserData;
  onReset: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ userData, onReset }) => {
  const { user, repositories, topLanguages, stats } = userData;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden"
    >
      {/* Animated background */}
      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{
          duration: 60,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
        style={{
          backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(120, 119, 198, 0.3) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      {/* Floating orbs */}
      <motion.div
        className="absolute top-20 left-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        {/* Enhanced Header */}
        <motion.div
          variants={itemVariants}
          className="flex justify-between items-center mb-12"
        >
          <motion.div
            className="flex items-center gap-4"
            whileHover={{ scale: 1.02 }}
          >
            <motion.div
              className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl shadow-lg"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <Sparkles className="w-8 h-8 text-white" />
            </motion.div>
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                Portfolio Dashboard
              </h1>
              <p className="text-gray-400 mt-1">Explore {user.login}'s GitHub journey</p>
            </div>
          </motion.div>

          <motion.button
            variants={itemVariants}
            onClick={onReset}
            className="group flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-xl hover:bg-white/20 text-white rounded-xl border border-white/20 hover:border-white/30 transition-all duration-300 shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Change User
          </motion.button>
        </motion.div>

        {/* User Profile Section */}
        <motion.div variants={itemVariants} className="mb-12">
          <UserProfile user={user} stats={stats} />
        </motion.div>

        {/* Skills Chart Section */}
        <motion.div variants={itemVariants} className="mb-12">
          <SkillsChart languages={topLanguages} />
        </motion.div>

        {/* Projects Section */}
        <motion.div variants={itemVariants} className="mb-12">
          <motion.div
            className="flex items-center gap-4 mb-8"
            whileHover={{ scale: 1.01 }}
          >
            <motion.div
              className="p-3 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl shadow-lg"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <Code className="w-8 h-8 text-white" />
            </motion.div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-green-200 to-teal-200 bg-clip-text text-transparent">
                Featured Projects
              </h2>
              <p className="text-gray-400 mt-1">Top repositories by stars and activity</p>
            </div>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
          >
            {repositories
              .sort((a, b) => b.stargazers_count - a.stargazers_count)
              .slice(0, 6)
              .map((repo) => (
                <motion.div
                  key={repo.id}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <ProjectCard repository={repo} />
                </motion.div>
              ))}
          </motion.div>

          {repositories.length > 6 && (
            <motion.div
              variants={itemVariants}
              className="text-center mt-8"
            >
              <motion.div
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-xl text-gray-300 rounded-xl border border-white/20"
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
              >
                <TrendingUp className="w-5 h-5" />
                And {repositories.length - 6} more amazing projects...
              </motion.div>
            </motion.div>
          )}
        </motion.div>

        {/* Activity Timeline Section */}
        <motion.div variants={itemVariants}>
          <ActivityTimeline repositories={repositories} />
        </motion.div>

        {/* Footer */}
        <motion.div
          variants={itemVariants}
          className="text-center mt-16 py-8 border-t border-white/10"
        >
          <motion.div
            className="flex items-center justify-center gap-2 mb-4"
            whileHover={{ scale: 1.05 }}
          >
            <Star className="w-5 h-5 text-yellow-400" />
            <span className="text-gray-400">Built with passion using React, TypeScript & Framer Motion</span>
            <Star className="w-5 h-5 text-yellow-400" />
          </motion.div>
          <p className="text-sm text-gray-500">
            Portfolio data powered by GitHub API • Last updated: {new Date().toLocaleDateString()}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};
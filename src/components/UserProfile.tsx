import React from 'react';
import { motion } from 'framer-motion';
import type { GitHubUser } from '../types';

interface UserProfileProps {
  user: GitHubUser;
  stats?: {
    totalStars: number;
    totalForks: number;
    totalRepos: number;
    languagesCount: number;
  };
}

const UserProfile: React.FC<UserProfileProps> = ({ user, stats }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-2xl border border-white/20 mb-8"
    >
      <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-6">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <img
            src={user.avatar_url}
            alt={`${user.login}'s avatar`}
            className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white/20 shadow-lg"
          />
        </motion.div>

        <div className="flex-1 text-center md:text-left">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl md:text-4xl font-bold text-white mb-2"
          >
            {user.name || user.login}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-purple-300 mb-4"
          >
            @{user.login}
          </motion.p>

          {user.bio && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-gray-300 mb-4 leading-relaxed"
            >
              {user.bio}
            </motion.p>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-400"
          >
            {user.location && (
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                {user.location}
              </div>
            )}

            {user.company && (
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10v2a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h4a2 2 0 012 2v2a2 2 0 01-2 2H8a2 2 0 01-2-2v-2zm6 0a1 1 0 00-1-1H9a1 1 0 00-1 1v1a1 1 0 001 1h1a1 1 0 001-1v-1z" clipRule="evenodd" />
                </svg>
                {user.company}
              </div>
            )}

            {user.blog && (
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0113.971 9h1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" clipRule="evenodd" />
                </svg>
                <a href={user.blog} target="_blank" rel="noopener noreferrer" className="hover:text-purple-300 transition-colors">
                  Website
                </a>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {stats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/20"
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{stats.totalRepos}</div>
            <div className="text-sm text-gray-400">Repositories</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{user.followers}</div>
            <div className="text-sm text-gray-400">Followers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{stats.totalStars}</div>
            <div className="text-sm text-gray-400">Stars</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{stats.languagesCount}</div>
            <div className="text-sm text-gray-400">Languages</div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default UserProfile;
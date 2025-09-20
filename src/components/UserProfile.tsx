import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { MapPin, Building, Globe, Github, Star, Users, Code } from 'lucide-react';
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

// Animated counter hook
const useAnimatedCounter = (end: number, duration: number = 2000) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    const controls = animate(count, end, { duration });
    return controls.stop;
  }, [count, end, duration]);

  return rounded;
};

const UserProfile: React.FC<UserProfileProps> = ({ user, stats }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  // Animated counters
  const animatedRepos = useAnimatedCounter(stats?.totalRepos || 0);
  const animatedFollowers = useAnimatedCounter(user.followers || 0);
  const animatedStars = useAnimatedCounter(stats?.totalStars || 0);
  const animatedLanguages = useAnimatedCounter(stats?.languagesCount || 0);

  const statItems = [
    {
      label: 'Repositories',
      value: animatedRepos,
      staticValue: stats?.totalRepos || 0,
      icon: Github,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      label: 'Followers',
      value: animatedFollowers,
      staticValue: user.followers || 0,
      icon: Users,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-500/10'
    },
    {
      label: 'Stars',
      value: animatedStars,
      staticValue: stats?.totalStars || 0,
      icon: Star,
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-500/10'
    },
    {
      label: 'Languages',
      value: animatedLanguages,
      staticValue: stats?.languagesCount || 0,
      icon: Code,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-500/10'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative mb-8"
    >
      {/* Background gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-blue-600/10 to-cyan-600/10 rounded-2xl blur-2xl"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 1 }}
      />

      <motion.div
        className="relative bg-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/20 overflow-hidden"
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
            backgroundSize: '15px 15px',
          }}
        />

        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-8 lg:space-y-0 lg:space-x-8">
            {/* Avatar Section */}
            <motion.div
              className="flex-shrink-0"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                delay: 0.2,
                duration: 0.8,
                type: "spring",
                stiffness: 200,
                damping: 20
              }}
            >
              <div className="relative">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur-lg"
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <motion.img
                  src={user.avatar_url}
                  alt={`${user.login}'s avatar`}
                  className="relative w-32 h-32 lg:w-40 lg:h-40 rounded-full border-4 border-white/30 shadow-2xl object-cover"
                  onLoad={() => setImageLoaded(true)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: imageLoaded ? 1 : 0 }}
                  transition={{ duration: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                />
                {!imageLoaded && (
                  <motion.div
                    className="absolute inset-0 bg-white/10 rounded-full animate-pulse"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}
              </div>
            </motion.div>

            {/* Info Section */}
            <div className="flex-1 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <motion.h1
                  className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent mb-2"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  {user.name || user.login}
                </motion.h1>

                <motion.div
                  className="flex items-center justify-center lg:justify-start text-xl text-purple-300 mb-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Github className="w-5 h-5 mr-2" />
                  @{user.login}
                </motion.div>
              </motion.div>

              {user.bio && (
                <motion.p
                  className="text-gray-300 text-lg leading-relaxed mb-6 max-w-2xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  {user.bio}
                </motion.p>
              )}

              {/* Contact Info */}
              <motion.div
                className="flex flex-wrap justify-center lg:justify-start gap-6 text-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                {user.location && (
                  <motion.div
                    className="flex items-center text-gray-300 hover:text-white transition-colors cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                  >
                    <MapPin className="w-4 h-4 mr-2 text-purple-400" />
                    {user.location}
                  </motion.div>
                )}

                {user.company && (
                  <motion.div
                    className="flex items-center text-gray-300 hover:text-white transition-colors cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                  >
                    <Building className="w-4 h-4 mr-2 text-blue-400" />
                    {user.company}
                  </motion.div>
                )}

                {user.blog && (
                  <motion.a
                    href={user.blog}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-gray-300 hover:text-purple-300 transition-colors"
                    whileHover={{ scale: 1.05 }}
                  >
                    <Globe className="w-4 h-4 mr-2 text-cyan-400" />
                    Website
                  </motion.a>
                )}
              </motion.div>
            </div>
          </div>

          {/* Stats Grid */}
          {stats && (
            <motion.div
              className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-8 pt-8 border-t border-white/20"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              {statItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.label}
                    className={`relative ${item.bgColor} rounded-xl p-4 text-center overflow-hidden`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                    whileHover={{
                      scale: 1.05,
                      boxShadow: `0 10px 30px rgba(0,0,0,0.3)`
                    }}
                  >
                    {/* Animated background */}
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0`}
                      whileHover={{ opacity: 0.1 }}
                      transition={{ duration: 0.3 }}
                    />

                    <div className="relative z-10">
                      <motion.div
                        className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/10 mb-3"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </motion.div>

                      <motion.div
                        className="text-3xl font-bold text-white mb-1"
                        key={item.staticValue} // Re-trigger animation when value changes
                      >
                        <motion.span
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
                        >
                          {item.value}
                        </motion.span>
                      </motion.div>

                      <div className="text-sm text-gray-400 font-medium">
                        {item.label}
                      </div>

                      {/* Progress bar animation */}
                      <motion.div
                        className="mt-3 h-1 bg-white/20 rounded-full overflow-hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2 + index * 0.1 }}
                      >
                        <motion.div
                          className={`h-full bg-gradient-to-r ${item.color} rounded-full`}
                          initial={{ width: 0 }}
                          animate={{ width: '100%' }}
                          transition={{
                            delay: 1.4 + index * 0.1,
                            duration: 1.5,
                            ease: "easeOut"
                          }}
                        />
                      </motion.div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default UserProfile;
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Sparkles, ArrowRight } from 'lucide-react';
import type { UsernameFormProps } from '../types';

const UsernameForm: React.FC<UsernameFormProps> = ({
  defaultUsername = 'johnolamide',
  onSubmit,
  isLoading = false
}) => {
  const [username, setUsername] = useState(defaultUsername);
  const [error, setError] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [hasContent, setHasContent] = useState(!!defaultUsername);

  const validateUsername = (value: string): boolean => {
    if (!value.trim()) {
      setError('Username is required');
      return false;
    }
    if (value.length < 1 || value.length > 39) {
      setError('Username must be between 1 and 39 characters');
      return false;
    }
    if (!/^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/.test(value)) {
      setError('Username contains invalid characters');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateUsername(username)) {
      onSubmit(username.trim());
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsername(value);
    setHasContent(!!value);
    if (error) {
      validateUsername(value);
    }
  };

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      className="max-w-lg mx-auto"
    >
      <div className="relative">
        {/* Background glow effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-cyan-600/20 rounded-2xl blur-xl"
          animate={{
            scale: isFocused ? 1.05 : 1,
            opacity: isFocused ? 0.8 : 0.4
          }}
          transition={{ duration: 0.3 }}
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
              duration: 20,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
            style={{
              backgroundImage: 'radial-gradient(circle at 25% 25%, #ffffff 2px, transparent 2px)',
              backgroundSize: '20px 20px',
            }}
          />

          <div className="relative z-10">
            {/* Header */}
            <motion.div
              className="text-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div
                className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mb-4"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <Github className="w-8 h-8 text-white" />
              </motion.div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent mb-2">
                Portfolio Generator
              </h1>
              <p className="text-gray-300 text-lg">
                Transform any GitHub profile into a stunning portfolio
              </p>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Input field with floating label */}
              <motion.div
                className="relative"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <motion.div
                  className={`relative overflow-hidden rounded-xl border-2 transition-all duration-300 ${
                    error
                      ? 'border-red-400 bg-red-500/10'
                      : isFocused
                      ? 'border-purple-400 bg-white/5 shadow-lg shadow-purple-500/25'
                      : 'border-white/20 bg-white/5'
                  }`}
                  whileFocus={{ scale: 1.02 }}
                  animate={{
                    boxShadow: isFocused
                      ? '0 0 30px rgba(147, 51, 234, 0.3)'
                      : '0 0 0px rgba(147, 51, 234, 0)',
                  }}
                >
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={handleInputChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholder=""
                    className="w-full px-4 py-4 bg-transparent text-white placeholder-transparent focus:outline-none text-lg"
                    disabled={isLoading}
                  />

                  {/* Floating label */}
                  <motion.label
                    htmlFor="username"
                    className={`absolute left-4 transition-all duration-300 pointer-events-none text-lg ${
                      isFocused || hasContent
                        ? 'top-2 text-sm text-purple-300'
                        : 'top-4 text-gray-400'
                    }`}
                    animate={{
                      color: isFocused ? '#c084fc' : hasContent ? '#a78bfa' : '#9ca3af',
                    }}
                  >
                    GitHub Username
                  </motion.label>

                  {/* Animated border */}
                  <motion.div
                    className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500"
                    initial={{ width: 0 }}
                    animate={{ width: isFocused ? '100%' : 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>

                {/* Error message */}
                <AnimatePresence>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -10, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: 'auto' }}
                      exit={{ opacity: 0, y: -10, height: 0 }}
                      className="mt-2 text-sm text-red-400 flex items-center"
                    >
                      <motion.span
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 0.5, repeat: 3 }}
                        className="mr-2"
                      >
                        ⚠️
                      </motion.span>
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Submit button */}
              <motion.button
                type="submit"
                disabled={isLoading || !!error}
                className="w-full relative overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 p-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <motion.div
                  className="relative bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl px-8 py-4 text-white font-semibold text-lg flex items-center justify-center"
                  whileHover={{ backgroundPosition: ['0%', '100%'] }}
                  transition={{ duration: 0.3 }}
                >
                  {isLoading ? (
                    <motion.div
                      className="flex items-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <motion.div
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full mr-3"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      />
                      <span className="flex items-center">
                        Generating Portfolio
                        <motion.div
                          animate={{ opacity: [0, 1, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="ml-1"
                        >
                          <Sparkles className="w-4 h-4" />
                        </motion.div>
                      </span>
                    </motion.div>
                  ) : (
                    <motion.div
                      className="flex items-center"
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      Generate Portfolio
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </motion.div>
                  )}
                </motion.div>
              </motion.button>
            </form>

            {/* Footer text */}
            <motion.p
              className="text-sm text-gray-400 mt-6 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              Try with "johnolamide" or enter any GitHub username to get started
            </motion.p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default UsernameForm;
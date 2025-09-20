import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { UsernameFormProps } from '../types';

const UsernameForm: React.FC<UsernameFormProps> = ({
  defaultUsername = 'johnolamide',
  onSubmit,
  isLoading = false
}) => {
  const [username, setUsername] = useState(defaultUsername);
  const [error, setError] = useState('');

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
    if (error) {
      validateUsername(value);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md mx-auto mb-8"
    >
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-2xl border border-white/20">
        <h2 className="text-2xl font-bold text-white mb-4 text-center">
          Generate Portfolio
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
              GitHub Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={handleInputChange}
              placeholder="Enter GitHub username"
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              disabled={isLoading}
            />
            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-2 text-sm text-red-400"
              >
                {error}
              </motion.p>
            )}
          </div>
          <motion.button
            type="submit"
            disabled={isLoading || !!error}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Generating...
              </div>
            ) : (
              'Generate Portfolio'
            )}
          </motion.button>
        </form>
        <p className="text-sm text-gray-400 mt-4 text-center">
          Enter any GitHub username to create a personalized portfolio dashboard
        </p>
      </div>
    </motion.div>
  );
};

export default UsernameForm;
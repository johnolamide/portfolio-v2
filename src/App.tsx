import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout, UsernameForm, Dashboard, LoadingSpinner, ErrorMessage, Chatbot } from './components';
import { useGitHubData } from './hooks/useGitHubDataWrapper';

const App: React.FC = () => {
  const { userData, loading, error, fetchUserData, resetData } = useGitHubData();

  const handleUsernameSubmit = async (username: string) => {
    // Update URL for shareable portfolio
    const url = new URL(window.location.href);
    url.searchParams.set('user', username);
    window.history.pushState({}, '', url.toString());
    
    await fetchUserData(username);
  };

  const handleReset = () => {
    // Clear URL parameter when resetting
    const url = new URL(window.location.href);
    url.searchParams.delete('user');
    window.history.pushState({}, '', url.toString());
    
    resetData();
  };

  return (
    <Layout>
      <div className="relative min-h-screen overflow-hidden">
        {/* Dynamic Background */}
        <motion.div
          className="fixed inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900"
          animate={{
            background: [
              'linear-gradient(45deg, #1e1b4b, #581c87, #be185d)',
              'linear-gradient(90deg, #312e81, #7c2d12, #be123c)',
              'linear-gradient(135deg, #1e3a8a, #6b21a8, #c2410c)',
              'linear-gradient(45deg, #1e1b4b, #581c87, #be185d)'
            ]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Animated Background Elements */}
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
        >
          {/* Floating Orbs */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white/10 backdrop-blur-sm"
              style={{
                width: Math.random() * 200 + 100,
                height: Math.random() * 200 + 100,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                x: [0, Math.random() * 100 - 50],
                y: [0, Math.random() * 100 - 50],
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 2,
              }}
            />
          ))}

          {/* Grid Pattern */}
          <motion.div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `radial-gradient(circle at 25px 25px, rgba(255,255,255,0.2) 2px, transparent 0)`,
              backgroundSize: '50px 50px',
            }}
            animate={{
              backgroundPosition: ['0px 0px', '50px 50px'],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </motion.div>

        {/* Content Container */}
        <div className="relative z-10">
          <AnimatePresence mode="wait">
            {!userData && !loading && (
              <motion.div
                key="username-form"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="flex items-center justify-center min-h-screen px-4"
              >
                <motion.div
                  initial={{ y: 50 }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="w-full max-w-md"
                >
                  <UsernameForm onSubmit={handleUsernameSubmit} />
                </motion.div>
              </motion.div>
            )}

            {loading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-center min-h-screen"
              >
                <LoadingSpinner />
              </motion.div>
            )}

            {error && (
              <motion.div
                key="error"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="flex items-center justify-center min-h-screen px-4"
              >
                <ErrorMessage message={error.message} onRetry={handleReset} />
              </motion.div>
            )}

            {userData && !loading && !error && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <Dashboard userData={userData} onReset={handleReset} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Chatbot with enhanced positioning */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.5, type: "spring" }}
          className="relative z-20"
        >
          <Chatbot userData={userData} isLoading={loading} />
        </motion.div>
      </div>
    </Layout>
  );
};

export default App;

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Bot, User, Send, X } from 'lucide-react';
import { generateText } from 'ai';
import type { ProcessedUserData } from '../types';
import { prepareChatContext, generateWelcomeMessage, getQuickResponse } from '../utils/chatPrompts';
import { createGeminiModel } from '../utils/gemini';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

interface ChatbotProps {
  userData: ProcessedUserData | null;
  isLoading: boolean;
}

export const Chatbot: React.FC<ChatbotProps> = ({ userData, isLoading }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize welcome message when userData is available
  useEffect(() => {
    if (userData && messages.length === 0) {
      const welcomeMessage: Message = {
        id: 'welcome',
        content: generateWelcomeMessage(userData),
        role: 'assistant',
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [userData, messages.length]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !userData || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      // Check for quick responses first
      const quickResponse = getQuickResponse(userMessage.content, userData);
      if (quickResponse) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: quickResponse,
          role: 'assistant',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, assistantMessage]);
        setIsTyping(false);
        return;
      }

      // Use AI for more complex queries
      const context = prepareChatContext(userData, userMessage.content);

      const { text } = await generateText({
        model: createGeminiModel(),
        prompt: context,
        temperature: 0.7,
      });

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: text,
        role: 'assistant',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error generating AI response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I encountered an error while processing your question. Please try again.",
        role: 'assistant',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    if (userData) {
      const welcomeMessage: Message = {
        id: 'welcome',
        content: generateWelcomeMessage(userData),
        role: 'assistant',
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    } else {
      setMessages([]);
    }
  };

  if (isLoading || !userData) {
    return null; // Don't show chatbot until data is loaded
  }

  return (
    <>
      {/* Floating Chat Button */}
      <motion.button
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        whileHover={{ 
          scale: 1.1, 
          rotate: 5,
          boxShadow: "0 20px 25px -5px rgba(59, 130, 246, 0.4), 0 10px 10px -5px rgba(59, 130, 246, 0.04)"
        }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 text-white p-4 rounded-full shadow-2xl transition-all duration-300 border border-blue-500/20 backdrop-blur-sm group"
        aria-label="Open chat"
      >
        <motion.div
          animate={{ rotate: isOpen ? 0 : 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-md group-hover:blur-lg transition-all duration-300"
        />
        <motion.div
          whileHover={{ rotate: 15 }}
          className="relative z-10"
        >
          <MessageCircle size={24} />
        </motion.div>
        
        {/* Pulse animation */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 rounded-full bg-blue-400/30 blur-sm"
        />
      </motion.button>

      {/* Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-end p-4 pointer-events-none"
          >
            {/* Backdrop blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50, rotateX: -15 }}
              animate={{ scale: 1, opacity: 1, y: 0, rotateX: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50, rotateX: -15 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-md h-[500px] flex flex-col pointer-events-auto border border-gray-200/50 dark:border-gray-700/50 overflow-hidden"
            >
              {/* Gradient background overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50 dark:from-blue-900/20 dark:via-transparent dark:to-purple-900/20" />
              
              {/* Animated border gradient */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-2xl p-[1px] bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 opacity-50"
              >
                <div className="h-full w-full rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl" />
              </motion.div>
              {/* Header */}
              <div className="relative flex items-center justify-between p-4 border-b border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
                {/* Floating particles */}
                <motion.div
                  animate={{ 
                    y: [-5, 5, -5],
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute top-2 left-8 w-2 h-2 bg-blue-400 rounded-full blur-sm"
                />
                <motion.div
                  animate={{ 
                    y: [5, -5, 5],
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                  className="absolute top-3 right-16 w-1 h-1 bg-purple-400 rounded-full blur-sm"
                />
                
                <div className="flex items-center space-x-3">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="relative"
                  >
                    <Bot className="text-blue-600 dark:text-blue-400" size={24} />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 bg-blue-400/20 rounded-full blur-md"
                    />
                  </motion.div>
                  <div>
                    <h3 className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Portfolio Assistant
                    </h3>
                    <motion.p
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-xs text-gray-500 dark:text-gray-400"
                    >
                      AI-powered insights
                    </motion.p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={clearChat}
                    className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    aria-label="Clear chat"
                  >
                    <X size={16} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                    aria-label="Close chat"
                  >
                    <X size={20} />
                  </motion.button>
                </div>
              </div>

              {/* Messages */}
              <div className="relative flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-transparent via-white/30 to-transparent dark:via-gray-800/30">
                {/* Scrolling background pattern */}
                <motion.div
                  animate={{ y: [0, -20, 0] }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 opacity-5 dark:opacity-10 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.3),transparent)] bg-[length:20px_20px]"
                />
                
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ 
                      delay: index * 0.1,
                      type: "spring",
                      damping: 20,
                      stiffness: 300
                    }}
                    className={`flex items-start space-x-3 ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.role === 'assistant' && (
                      <motion.div
                        animate={{ 
                          rotate: [0, 5, -5, 0],
                          scale: [1, 1.05, 1]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="relative"
                      >
                        <Bot className="text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" size={20} />
                        <motion.div
                          animate={{ scale: [1, 1.3, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="absolute inset-0 bg-blue-400/20 rounded-full blur-sm"
                        />
                      </motion.div>
                    )}
                    <motion.div
                      whileHover={{ scale: 1.02, y: -2 }}
                      className={`max-w-[75%] rounded-2xl px-4 py-3 backdrop-blur-sm relative overflow-hidden group ${
                        message.role === 'user'
                          ? 'bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 text-white shadow-lg shadow-blue-500/25'
                          : 'bg-white/70 dark:bg-gray-700/70 text-gray-900 dark:text-white border border-gray-200/50 dark:border-gray-600/50 shadow-lg'
                      }`}
                    >
                      {/* Animated background for assistant messages */}
                      {message.role === 'assistant' && (
                        <motion.div
                          animate={{ 
                            background: [
                              'linear-gradient(45deg, rgba(59,130,246,0.1) 0%, transparent 50%, rgba(147,51,234,0.1) 100%)',
                              'linear-gradient(45deg, rgba(147,51,234,0.1) 0%, transparent 50%, rgba(59,130,246,0.1) 100%)'
                            ]
                          }}
                          transition={{ duration: 3, repeat: Infinity }}
                          className="absolute inset-0 opacity-50"
                        />
                      )}
                      
                      {/* Shine effect for user messages */}
                      {message.role === 'user' && (
                        <motion.div
                          animate={{ x: [-100, 200] }}
                          transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 opacity-0 group-hover:opacity-100"
                        />
                      )}
                      
                      <div className="relative z-10">
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                        <motion.span 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 0.7 }}
                          className="text-xs opacity-70 mt-2 block font-medium"
                        >
                          {message.timestamp.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </motion.span>
                      </div>
                    </motion.div>
                    {message.role === 'user' && (
                      <motion.div
                        animate={{ 
                          rotate: [0, -5, 5, 0],
                          scale: [1, 1.05, 1]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="relative"
                      >
                        <User className="text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" size={20} />
                        <motion.div
                          animate={{ scale: [1, 1.3, 1] }}
                          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                          className="absolute inset-0 bg-blue-400/20 rounded-full blur-sm"
                        />
                      </motion.div>
                    )}
                  </motion.div>
                ))}

                {/* Enhanced Typing Indicator */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center space-x-3"
                  >
                    <motion.div
                      animate={{ 
                        rotate: [0, 360],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ 
                        rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                        scale: { duration: 1, repeat: Infinity }
                      }}
                      className="relative"
                    >
                      <Bot className="text-blue-600 dark:text-blue-400" size={20} />
                      <motion.div
                        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0.8, 0.5] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="absolute inset-0 bg-blue-400/20 rounded-full blur-sm"
                      />
                    </motion.div>
                    <motion.div
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      className="bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm rounded-2xl px-4 py-3 border border-gray-200/50 dark:border-gray-600/50 shadow-lg relative overflow-hidden"
                    >
                      <motion.div
                        animate={{ 
                          background: [
                            'linear-gradient(90deg, rgba(59,130,246,0.1) 0%, rgba(147,51,234,0.1) 100%)',
                            'linear-gradient(90deg, rgba(147,51,234,0.1) 0%, rgba(59,130,246,0.1) 100%)'
                          ]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0"
                      />
                      <div className="relative z-10 flex space-x-1.5">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            animate={{ 
                              y: [-2, -8, -2],
                              scale: [1, 1.2, 1],
                              backgroundColor: [
                                'rgb(59, 130, 246)',
                                'rgb(147, 51, 234)',
                                'rgb(59, 130, 246)'
                              ]
                            }}
                            transition={{ 
                              duration: 0.8, 
                              repeat: Infinity, 
                              delay: i * 0.2,
                              ease: "easeInOut"
                            }}
                            className="w-2.5 h-2.5 rounded-full shadow-sm"
                          />
                        ))}
                      </div>
                    </motion.div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Enhanced Input */}
              <div className="relative p-4 border-t border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
                {/* Floating input particles */}
                <motion.div
                  animate={{ 
                    x: [-10, 10, -10],
                    opacity: [0.2, 0.4, 0.2]
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute top-2 left-6 w-1 h-1 bg-blue-400 rounded-full blur-sm"
                />
                <motion.div
                  animate={{ 
                    x: [10, -10, 10],
                    opacity: [0.2, 0.4, 0.2]
                  }}
                  transition={{ duration: 4, repeat: Infinity, delay: 2 }}
                  className="absolute top-2 right-6 w-1 h-1 bg-purple-400 rounded-full blur-sm"
                />
                
                <div className="flex space-x-3 relative">
                  <div className="flex-1 relative">
                    <motion.input
                      ref={inputRef}
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask about their projects, skills, or experience..."
                      className="w-full px-4 py-3 bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm border border-gray-300/50 dark:border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 shadow-lg transition-all duration-300 focus:shadow-xl focus:shadow-blue-500/10"
                      disabled={isTyping}
                      whileFocus={{ scale: 1.02 }}
                    />
                    {/* Input glow effect */}
                    <motion.div
                      animate={{ 
                        opacity: inputValue ? [0.3, 0.6, 0.3] : [0, 0, 0]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-md -z-10"
                    />
                  </div>
                  <motion.button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isTyping}
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: "0 10px 20px -5px rgba(59, 130, 246, 0.4)"
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 hover:from-blue-700 hover:via-blue-800 hover:to-purple-800 disabled:from-gray-400 disabled:via-gray-500 disabled:to-gray-600 text-white p-3 rounded-xl transition-all duration-300 flex-shrink-0 shadow-lg disabled:shadow-none relative overflow-hidden group"
                    aria-label="Send message"
                  >
                    {/* Button shine effect */}
                    <motion.div
                      animate={{ x: [-100, 100] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 opacity-0 group-hover:opacity-100"
                    />
                    <motion.div
                      animate={{ rotate: isTyping ? 360 : 0 }}
                      transition={{ duration: 1, repeat: isTyping ? Infinity : 0 }}
                      className="relative z-10"
                    >
                      <Send size={18} />
                    </motion.div>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github.css';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  Loader2,
  Sparkles,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

interface ChatBotProps {
  username: string | null;
  onAnalyzePortfolio: (prompt: string) => Promise<string>;
}

export const ChatBot: React.FC<ChatBotProps> = ({ username, onAnalyzePortfolio }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hello! I'm your AI portfolio analyst. I can help you understand ${username ? `${username}'s` : 'this'} GitHub portfolio, analyze coding patterns, suggest improvements, and answer questions about the projects. What would you like to know?`,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Add streaming message placeholder
      const streamingMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
        timestamp: new Date(),
        isStreaming: true
      };
      setMessages(prev => [...prev, streamingMessage]);

      const response = await onAnalyzePortfolio(userMessage.content);

      // Update with final response
      setMessages(prev => 
        prev.map(msg => 
          msg.isStreaming 
            ? { ...msg, content: response, isStreaming: false }
            : msg
        )
      );
    } catch (error) {
      console.error('Error getting AI response:', error);
      setMessages(prev => 
        prev.map(msg => 
          msg.isStreaming 
            ? { 
                ...msg, 
                content: 'Sorry, I encountered an error while analyzing the portfolio. Please try again.', 
                isStreaming: false 
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatContent = (content: string) => {
    return (
      <div className="prose prose-sm max-w-none dark:prose-invert text-left">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
          components={{
            // Custom styling for different markdown elements
            h1: ({ children }) => <h1 className="text-lg font-bold mb-2 text-inherit text-left">{children}</h1>,
            h2: ({ children }) => <h2 className="text-base font-semibold mb-2 text-inherit text-left">{children}</h2>,
            h3: ({ children }) => <h3 className="text-sm font-semibold mb-1 text-inherit text-left">{children}</h3>,
            p: ({ children }) => <p className="mb-2 last:mb-0 text-inherit text-left">{children}</p>,
            ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1 text-left">{children}</ul>,
            ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1 text-left">{children}</ol>,
            li: ({ children }) => <li className="text-sm text-inherit text-left">{children}</li>,
            code: ({ children, className }) => {
              const isInline = !className;
              return isInline ? (
                <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-xs font-mono text-inherit">{children}</code>
              ) : (
                <code className={className}>{children}</code>
              );
            },
            pre: ({ children }) => (
              <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg overflow-x-auto text-xs font-mono mb-2">
                {children}
              </pre>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-purple-500 pl-3 italic text-gray-700 dark:text-gray-300 mb-2 text-left">
                {children}
              </blockquote>
            ),
            strong: ({ children }) => <strong className="font-semibold text-inherit">{children}</strong>,
            em: ({ children }) => <em className="italic text-inherit">{children}</em>,
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    );
  };

  // Floating chat button
  if (!isOpen) {
    return (
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="h-14 w-14 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-200 group"
        >
          <MessageCircle className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-200" />
        </Button>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute -left-40 top-2 bg-gray-900 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap"
        >
          Ask AI about this portfolio
          <div className="absolute top-2 right-[-6px] w-0 h-0 border-l-[6px] border-l-gray-900 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent"></div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="fixed bottom-6 right-6 z-50"
    >
      <Card 
        className={`w-96 transition-all duration-300 shadow-2xl border-purple-200 dark:border-purple-800 ${
          isMinimized ? 'h-16' : 'h-[32rem]'
        }`}
      >
        <CardHeader className="p-4 border-b border-purple-100 dark:border-purple-800 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <CardTitle className="text-sm font-semibold text-gray-900 dark:text-white">
                  AI Portfolio Analyst
                </CardTitle>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">Online</span>
                  <Sparkles className="w-3 h-3 text-purple-500" />
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 h-auto hover:bg-purple-100 dark:hover:bg-purple-900"
              >
                {isMinimized ? (
                  <Maximize2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                ) : (
                  <Minimize2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="p-1 h-auto hover:bg-purple-100 dark:hover:bg-purple-900"
              >
                <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <AnimatePresence>
          {!isMinimized && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="flex flex-col h-full"
            >
              <CardContent className="flex-1 p-0 overflow-hidden">
                {/* Messages Area */}
                <div className="h-80 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          message.role === 'user'
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white ml-4'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white mr-4'
                        }`}
                      >
                        <div className="flex items-start space-x-2">
                          {message.role === 'assistant' && (
                            <div className="flex-shrink-0 mt-0.5">
                              <Bot className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="text-sm text-left">
                              {message.isStreaming ? (
                                <div className="flex items-center space-x-2">
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                  <span>Analyzing portfolio...</span>
                                </div>
                              ) : (
                                formatContent(message.content)
                              )}
                            </div>
                            <div className={`text-xs mt-1 opacity-70 ${
                              message.role === 'user' ? 'text-purple-100' : 'text-gray-500 dark:text-gray-400'
                            }`}>
                              {message.timestamp.toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </div>
                          </div>
                          {message.role === 'user' && (
                            <div className="flex-shrink-0 mt-0.5">
                              <User className="w-4 h-4 text-purple-200" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="border-t border-purple-100 dark:border-purple-800 p-4">
                  <div className="flex space-x-2">
                    <Input
                      ref={inputRef}
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask about this portfolio..."
                      disabled={isLoading}
                      className="flex-1 border-purple-200 dark:border-purple-700 focus:border-purple-500 dark:focus:border-purple-400"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim() || isLoading}
                      size="sm"
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  
                  {/* Quick suggestions */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {[
                      "Analyze coding skills",
                      "Project recommendations",
                      "Top languages used"
                    ].map((suggestion) => (
                      <Badge
                        key={suggestion}
                        variant="secondary"
                        className="cursor-pointer text-xs bg-purple-100 hover:bg-purple-200 dark:bg-purple-900 dark:hover:bg-purple-800 text-purple-700 dark:text-purple-300"
                        onClick={() => setInputMessage(suggestion)}
                      >
                        {suggestion}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
};
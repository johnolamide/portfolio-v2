import { createGoogleGenerativeAI } from '@ai-sdk/google';

// Get API key from environment
export const getGeminiApiKey = (): string => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('VITE_GEMINI_API_KEY environment variable is not set');
  }
  return apiKey;
};

// Create Google AI provider with API key
export const createGoogleProvider = () => {
  const apiKey = getGeminiApiKey();
  return createGoogleGenerativeAI({
    apiKey: apiKey,
  });
};

// Gemini model instance
export const createGeminiModel = () => {
  const google = createGoogleProvider();
  return google('gemini-1.5-flash');
};

// Validate API key format (basic check)
export const validateGeminiApiKey = (apiKey: string): boolean => {
  // Gemini API keys typically start with "AIza" and are 39 characters long
  return apiKey.startsWith('AIza') && apiKey.length === 39;
};
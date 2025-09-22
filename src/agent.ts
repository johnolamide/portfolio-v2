import { stepCountIs, streamText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { SYSTEM_PROMPT } from "./prompts";
import { getUserDataTool, getUserReposTool, getUserProfileTool } from "./tools";

export const portfolioAnalysisAgent = async (prompt: string) => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!apiKey) {
        throw new Error('Google Gemini API key is not configured. Please add VITE_GEMINI_API_KEY to your .env.local file.');
    }

    // Create Google provider with API key
    const google = createGoogleGenerativeAI({
        apiKey: apiKey
    });

    const result = streamText({
        model: google("models/gemini-2.5-flash"),
        prompt,
        system: SYSTEM_PROMPT,
        tools: {
            getUserData: getUserDataTool,
            getUserRepos: getUserReposTool,
            getUserProfile: getUserProfileTool
        },
        stopWhen: stepCountIs(15),
    });

    return result.text;
};

// Example usage: Analyze a GitHub portfolio
// await portfolioAnalysisAgent("Analyze the GitHub portfolio for user 'johnolamide'. Provide a comprehensive assessment of their technical skills, project quality, and professional presentation. Include specific recommendations for portfolio improvement.");
// const resp = await portfolioAnalysisAgent("what are the top 3 languages used by johnolamide and what is the total stars across all repos?");
// console.log(resp);
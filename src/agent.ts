import { stepCountIs, streamText } from "ai";
import { google } from "@ai-sdk/google";
import { SYSTEM_PROMPT } from "./prompts";
import { getUserDataTool, getUserReposTool, getUserProfileTool } from "./tools";

export const portfolioAnalysisAgent = async (prompt: string) => {
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

    for await (const chunk of result.textStream) {
        process.stdout.write(chunk);
    }
};

// Example usage: Analyze a GitHub portfolio
// await portfolioAnalysisAgent("Analyze the GitHub portfolio for user 'johnolamide'. Provide a comprehensive assessment of their technical skills, project quality, and professional presentation. Include specific recommendations for portfolio improvement.");
await portfolioAnalysisAgent("what are the top 3 languages used by johnolamide and what is the total stars across all repos?");
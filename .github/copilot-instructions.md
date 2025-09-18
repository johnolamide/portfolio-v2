# AI Agent Instructions for Personal Portfolio Website v2

## Project Overview
This is a dynamic portfolio generator that creates custom dashboards from GitHub usernames using real-time API data. Default showcase: "johnolamide". Features AI chatbot powered by Google Gemini API.

## Architecture & Structure
- **Client-side React app** with no database - all data fetched via APIs
- **Folder structure**: `src/components/` (UI), `src/hooks/` (data fetching), `src/utils/` (API services), `src/types/` (TypeScript interfaces), `src/pages/` (routes)
- **Data flow**: Username input → GitHub API fetch → Dashboard render → AI context preparation
- **Key components**: UsernameForm (pre-filled with "johnolamide"), Dashboard (profile + repos + charts), Chatbot (floating button with modal)

## Tech Stack Conventions
- **Package manager**: Bun exclusively (`bun add`, `bun install`, `bun run`)
- **Build tool**: Vite with React + TypeScript template
- **Styling**: Tailwind CSS with utility-first approach
- **State management**: React hooks (useState, useEffect) for component state
- **API calls**: Axios for HTTP requests, custom hooks for data fetching
- **AI integration**: Vercel AI SDK with @ai-sdk/google provider

## Development Workflow
- **Initialization**: `bun create vite . --template react-ts` in project root
- **Dependencies**: Install core packages first, then dev dependencies
- **Environment**: Use `.env.local` for API keys (GITHUB_TOKEN, GEMINI_API_KEY)
- **Build**: `bun run dev` for development, `bun run build` for production
- **Testing**: Vitest with @testing-library/react for component testing

## Implementation Patterns
- **GitHub API**: Use personal access token for authentication, handle rate limits
- **Data transformation**: Convert API responses to chart-friendly formats (Recharts)
- **Error handling**: Graceful fallbacks for invalid usernames or API failures
- **AI System Prompt**: Create context-aware prompt using GitHub data for chatbot responses
- **Responsive design**: Mobile-first with Tailwind breakpoints
- **Animations**: Framer Motion for page transitions and loading states

## Key Files to Reference
- `process_plan.md`: Detailed implementation roadmap and user flow
- `README.md`: Project goals, features, and tech stack
- `src/types/index.ts`: TypeScript interfaces for GitHub API responses
- `src/utils/github.ts`: API service functions
- `src/hooks/useGitHubData.ts`: Custom hook for data fetching

## AI-Specific Guidelines
- **System Prompt**: Craft prompt that incorporates user's GitHub bio, repos, languages, and activity
- **Context Preparation**: Pass structured GitHub data to AI for personalized responses
- **Error Boundaries**: Handle API failures in chatbot gracefully
- **Conversation State**: Maintain chat history for contextual follow-ups

## Quality Standards
- **TypeScript**: Strict typing for all props, API responses, and state
- **Accessibility**: WCAG compliance with proper ARIA labels
- **Performance**: Lazy loading for components, API response caching
- **Security**: Input sanitization, secure API key handling

## Common Pitfalls to Avoid
- Don't create database schemas - this is API-only
- Avoid over-fetching GitHub data; implement pagination
- Don't hardcode API keys; always use environment variables
- Keep default username "johnolamide" pre-filled in input field
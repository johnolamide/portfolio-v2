# Portfolio API

<div align="center">

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white) ![Bun](https://img.shields.io/badge/Bun-000000?style=for-the-badge&logo=bun&logoColor=white) ![GitHub API](https://img.shields.io/badge/GitHub_API-100000?style=for-the-badge&logo=github&logoColor=white) ![Google Gemini](https://img.shields.io/badge/Google_Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white)

</div>

A functional API for fetching GitHub portfolio data and generating AI-powered chat responses. This library provides programmatic access to GitHub user profiles, repositories, and AI chatbot functionality without any UI components.

## Features

- **GitHub Data Fetching**: Retrieve user profiles, repositories, languages, and statistics
- **AI Chatbot**: Generate context-aware responses using Google Gemini API
- **Data Processing**: Transform raw GitHub data into structured portfolio information
- **TypeScript Support**: Full type safety with comprehensive TypeScript definitions
- **Rate Limiting**: Built-in handling for GitHub API rate limits

## Installation

```bash
npm install portfolio-api
# or
bun add portfolio-api
```

## Environment Variables

Create a `.env` file with the following variables:

```env
VITE_GITHUB_TOKEN=your_github_personal_access_token
VITE_GEMINI_API_KEY=your_google_gemini_api_key
```

## Usage

### Basic Usage

```typescript
import { PortfolioAPI } from 'portfolio-api';

const api = new PortfolioAPI();

// Fetch user data
const userData = await api.getUserData('johnolamide');
console.log(userData.user.login); // 'johnolamide'
console.log(userData.stats.totalRepos); // Repository count

// Generate AI response
const response = await api.generateChatResponse(userData, 'Tell me about this developer');
console.log(response);
```

### Advanced Usage

```typescript
import { PortfolioAPI } from 'portfolio-api';

async function createPortfolio(username: string) {
  const api = new PortfolioAPI();

  try {
    // Get comprehensive user data
    const userData = await api.getUserData(username);

    // Get specific repositories
    const repos = await api.getUserRepos(username, {
      limit: 10,
      sort: 'stars'
    });

    // Generate personalized introduction
    const intro = await api.generateChatResponse(
      userData,
      'Create a professional introduction for this developer'
    );

    return {
      profile: userData.user,
      stats: userData.stats,
      topLanguages: userData.topLanguages,
      repositories: repos,
      introduction: intro
    };

  } catch (error) {
    console.error('Error creating portfolio:', error.message);
  }
}
```

## API Reference

### PortfolioAPI Class

#### `getUserData(username: string)`

Fetches complete user data including profile, repositories, and language statistics.

**Parameters:**
- `username` (string): GitHub username

**Returns:** `Promise<ProcessedUserData>`

#### `getUserProfile(username: string)`

Fetches basic user profile information.

**Parameters:**
- `username` (string): GitHub username

**Returns:** `Promise<GitHubUser>`

#### `getUserRepos(username: string, options?)`

Fetches user repositories with optional filtering.

**Parameters:**
- `username` (string): GitHub username
- `options` (object, optional):
  - `limit` (number): Maximum number of repositories to return
  - `sort` (string): Sort order ('stars', 'updated', etc.)

**Returns:** `Promise<GitHubRepository[]>`

#### `generateChatResponse(userData: ProcessedUserData, query: string)`

Generates an AI response based on user data and query.

**Parameters:**
- `userData` (ProcessedUserData): User portfolio data
- `query` (string): User question or prompt

**Returns:** `Promise<string>`

## Data Types

```typescript
interface ProcessedUserData {
  user: GitHubUser;
  repositories: GitHubRepository[];
  topLanguages: LanguageStat[];
  stats: UserStats;
}

interface GitHubUser {
  login: string;
  name: string | null;
  bio: string | null;
  location: string | null;
  company: string | null;
  blog: string | null;
  followers: number;
  following: number;
  public_repos: number;
  // ... additional fields
}

interface LanguageStat {
  name: string;
  value: number;
  percentage: number;
}
```

## Example Script

See `example.ts` for a complete working example:

```bash
# Run the example
bun run example.ts
```

## Development

```bash
# Install dependencies
bun install

# Build the library
bun run build

# Run in development mode
bun run dev
```

## MCP Tools

This library includes MCP (Model Context Protocol) tools that can be used by AI agents to interact with GitHub data:

- **`getUserDataTool`** - Fetch complete user data (profile + repos + languages)
- **`getUserReposTool`** - Fetch user repositories with sorting and limiting options
- **`getUserProfileTool`** - Fetch basic user profile information

### Using MCP Tools

```typescript
import { getUserDataTool, getUserReposTool, getUserProfileTool } from 'portfolio-api';

// These tools can be used with AI frameworks that support MCP
const tools = {
  getUserData: getUserDataTool,
  getUserRepos: getUserReposTool,
  getUserProfile: getUserProfileTool,
};
```

🔖 **Project Title & Description**

**Personal Portfolio Website v2** is a dynamic, AI-powered web application that revolutionizes portfolio creation for developers. The platform allows any GitHub user to instantly generate a professional, personalized portfolio dashboard by simply entering their GitHub username. By default, it showcases the portfolio for username "johnolamide", but users can explore any public GitHub profile.

**Key Features:**
- **Instant Portfolio Generation**: Fetches real-time data from GitHub API including user profiles, repositories, languages, and activity
- **Interactive Dashboard**: Displays user stats, project showcases, skills visualization charts, and activity timelines
- **AI-Powered Chatbot**: Context-aware assistant that answers questions about the portfolio owner's background, projects, and expertise using Google's Gemini API
- **Responsive Design**: Built with modern web technologies for seamless experience across devices
- **Shareable URLs**: Generate unique links for any portfolio dashboard

**What It Achieves:**
- **Democratizes Portfolio Creation**: Eliminates the need for manual portfolio building - anyone with a GitHub account gets a professional showcase instantly
- **Enhances Developer Networking**: Provides a standardized way to present skills and projects to potential employers, clients, and collaborators
- **AI-Assisted Self-Presentation**: The chatbot offers personalized insights and answers, making portfolios more interactive and engaging
- **Community Building**: Fosters sharing and discovery of developer portfolios within the tech community
- **Scalable Architecture**: Client-side application with no database requirements, ensuring fast loading and easy deployment

This project transforms how developers present themselves online, making portfolio creation accessible, data-driven, and AI-enhanced in today's competitive tech landscape.

🛠️ **Tech Stack**

- **Language**: TypeScript for type-safe development
- **Build Tool**: Vite for fast development and optimized production builds
- **Package Manager**: Bun for lightning-fast package installation and script execution
- **UI Framework**: React with TypeScript for component-based architecture
- **Component Library**: shadcn/ui for modern, accessible UI components built on Radix UI and Tailwind CSS
- **Styling**: Tailwind CSS for utility-first, responsive styling
- **Animation**: Framer Motion for smooth, performant animations and transitions
- **API Integration**: GitHub API for dynamically fetching and displaying project repositories; Axios for HTTP requests
- **Data Visualization**: Recharts for interactive charts (e.g., skills breakdown)
- **AI Chatbot**: Google Gemini API for natural language processing and context-aware responses
- **Deployment**: (To be determined - potentially Vercel, Netlify, or GitHub Pages)

🧠 **AI Integration Strategy**

Throughout the development process, AI tools will be leveraged to accelerate coding, ensure quality, and maintain comprehensive documentation. The primary AI assistant (GitHub Copilot in VS Code) will be used as follows:

**Code Generation**: The IDE's AI agent will scaffold initial project structure, React components, TypeScript interfaces, and API integration logic. For example, prompts like "Create a React component for displaying project cards with TypeScript props" or "Generate a custom hook for fetching GitHub repositories" will be used to bootstrap features quickly while maintaining best practices.

**Testing**: AI will assist in writing comprehensive test suites, including unit tests for individual components and integration tests for API interactions. Prompts such as "Write Vitest unit tests for the ProjectCard component" or "Create integration tests for GitHub API error handling" will ensure robust test coverage and help catch bugs early in development.

**Documentation**: AI will help craft and maintain documentation throughout the project. This includes generating detailed README sections, writing docstrings for functions and components, and adding inline comments to explain complex logic. The AI will also assist in updating documentation as the project evolves, ensuring it remains accurate and comprehensive.

**Context-Aware Techniques**: To maximize AI effectiveness, relevant context will be provided in prompts, including:
- GitHub API documentation snippets for accurate integration
- Project file structure and component hierarchies for consistent code generation
- Code diffs and error messages for targeted debugging assistance
- User stories and design requirements for feature implementation
- Existing codebase patterns to maintain consistency across the project

**Runtime AI Features**: The application itself incorporates AI through the interactive chatbot, which uses Google's Gemini API to provide context-aware responses based on the user's GitHub data. The chatbot can be prompted with questions about the portfolio owner's background, projects, and skills, enhancing user engagement and providing personalized insights.

This AI-driven approach will enable rapid prototyping, maintain high code quality, and ensure thorough documentation, allowing focus on creative aspects of portfolio design and user experience.

## AI Portfolio Analysis Agent

This library includes an AI-powered portfolio analysis agent that can automatically analyze GitHub profiles and provide comprehensive portfolio assessments.

### Running the Agent

```bash
# Analyze a GitHub portfolio
bun run agent
```

The agent uses the MCP tools to fetch GitHub data and provides detailed analysis including:
- Technical skill assessment
- Project quality evaluation
- Professional presentation review
- Growth recommendations
- Industry alignment insights

### Agent Architecture

The agent (`src/agent.ts`) combines:
- **Google Gemini 2.5 Flash** for intelligent analysis
- **MCP Tools** for GitHub data access
- **Specialized System Prompt** for portfolio analysis expertise
- **Streaming Output** for real-time analysis

### Custom Analysis

You can modify the agent prompt in `src/agent.ts` to analyze different users or focus on specific aspects of portfolios.
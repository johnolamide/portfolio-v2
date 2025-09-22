# GitHub Portfolio Generator v2

<div align="center">

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white) ![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

![Bun](https://img.shields.io/badge/Bun-000000?style=for-the-badge&logo=bun&logoColor=white) ![GitHub API](https://img.shields.io/badge/GitHub_API-100000?style=for-the-badge&logo=github&logoColor=white) ![Google Gemini](https://img.shields.io/badge/Google_Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white) ![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)

</div>

🚀 **A dynamic, AI-powered web application that transforms GitHub profiles into professional portfolio dashboards instantly!**

Simply enter any GitHub username to generate a comprehensive, interactive portfolio showcasing their coding skills, projects, and professional presentation - all powered by real-time GitHub data and AI analysis.

## ✨ Features

- **🔥 Instant Portfolio Generation**: Enter any GitHub username and get a professional portfolio dashboard in seconds
- **📊 Interactive Analytics**: Comprehensive data visualization with charts, statistics, and project metrics using Recharts
- **🤖 AI-Powered Chatbot**: Context-aware assistant powered by Google Gemini that analyzes portfolios and answers questions
- **🎨 Modern UI/UX**: Beautiful, responsive design with dark/light themes and smooth animations
- **📱 Mobile-First Design**: Fully responsive across all devices and screen sizes
- **⚡ Real-Time Data**: Live GitHub API integration for up-to-date repository and profile information
- **🔍 Advanced Filtering**: Sort and filter repositories by language, stars, forks, and update date
- **📈 Visual Analytics**: Programming language distribution, activity timelines, and contribution patterns
- **🎯 Professional Presentation**: Clean, portfolio-ready interface perfect for sharing with employers or clients

## 🚀 Live Demo

Default showcase: **johnolamide** - Try it with any GitHub username!

[🌟 View Live Demo](https://your-demo-url.com) *(Coming Soon)*

## 📸 Screenshots

*Screenshots coming soon - showcasing the beautiful dashboard and AI chatbot in action!*

## 🛠️ Installation & Setup

### Prerequisites
- [Bun](https://bun.sh/) (recommended) or Node.js 18+
- GitHub Personal Access Token
- Google Gemini API Key

### Quick Start

1. **Clone the repository**
```bash
git clone https://github.com/johnolamide/portfolio-v2.git
cd portfolio-v2
```

2. **Install dependencies**
```bash
bun install
```

3. **Set up environment variables**
```bash
cp env.example .env.local
```

Edit `.env.local` with your API keys:
```env
VITE_GITHUB_TOKEN=your_github_personal_access_token
VITE_GEMINI_API_KEY=your_google_gemini_api_key
```

4. **Start the development server**
```bash
bun run dev
```

5. **Open in browser**
Navigate to `http://localhost:5173` and start exploring GitHub portfolios!

## 🎯 How It Works

1. **Enter Username**: Type any GitHub username in the landing page
2. **Data Fetching**: Real-time retrieval of profile, repositories, and language statistics
3. **Dashboard Generation**: Automatic creation of a comprehensive portfolio dashboard
4. **AI Analysis**: Intelligent chatbot provides insights about the developer's skills and projects
5. **Share & Explore**: Get shareable URLs for any generated portfolio

## 🔧 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_GITHUB_TOKEN` | GitHub Personal Access Token for API access | ✅ |
| `VITE_GEMINI_API_KEY` | Google Gemini API key for AI features | ✅ |

### Getting Your API Keys

**GitHub Token:**
1. Go to [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
2. Generate a new token with `public_repo` scope
3. Copy the token to your `.env.local` file

**Google Gemini API:**
1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Create a new API key
3. Copy the key to your `.env.local` file

## 📚 Usage Examples

### Basic Portfolio Generation
```typescript
import { PortfolioGenerator } from './src/utils/github';

// Generate portfolio for any GitHub user
const portfolioData = await PortfolioGenerator.generate('johnolamide');
```

### AI Chatbot Integration
```typescript
import { portfolioAnalysisAgent } from './src/agent';

// Get AI insights about a developer's portfolio
const analysis = await portfolioAnalysisAgent({
  githubData: portfolioData,
  userQuery: "What are this developer's main strengths?"
});
```

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Reusable UI components (shadcn/ui)
│   ├── ChatBot.tsx     # AI chatbot interface
│   └── Dashboard/      # Portfolio dashboard components
├── hooks/              # Custom React hooks
│   ├── useGitHubData.ts    # GitHub API data fetching
│   └── useTheme.ts         # Theme management
├── utils/              # Utility functions
│   ├── github.ts       # GitHub API services
│   ├── gemini.ts       # Google Gemini AI integration
│   └── dataProcessing.ts   # Data transformation
├── types/              # TypeScript type definitions
└── pages/              # Application routes
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [GitHub API](https://docs.github.com/en/rest) for providing comprehensive developer data
- [Google Gemini](https://deepmind.google/technologies/gemini/) for AI-powered portfolio analysis
- [Recharts](https://recharts.org/) for beautiful data visualizations
- [shadcn/ui](https://ui.shadcn.com/) for elegant UI components
- [Tailwind CSS](https://tailwindcss.com/) for rapid styling
- The open-source community for inspiration and support

## 📧 Contact

**John Olamide** - [@johnolamide](https://github.com/johnolamide)

Project Link: [https://github.com/johnolamide/portfolio-v2](https://github.com/johnolamide/portfolio-v2)

---

⭐ **Star this repo if you found it helpful!** ⭐
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
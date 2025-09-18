# Personal Portfolio Website v2

<div align="center">

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white) ![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white) ![Bun](https://img.shields.io/badge/Bun-000000?style=for-the-badge&logo=bun&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white) ![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white) ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) ![GitHub API](https://img.shields.io/badge/GitHub_API-100000?style=for-the-badge&logo=github&logoColor=white)

</div>

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
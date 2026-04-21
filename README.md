# envsetup.dev 🚀

**Standardize your development environments with AI-powered orchestration.**

`envsetup.dev` replaces manual, error-prone `setup.sh` scripts and inconsistent Docker configs with a powerful, modern CLI and an AI-driven platform.

[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/fSuP1nkcamn)
[![CLI Version](https://img.shields.io/badge/CLI-v0.0.1--alpha-orange?style=for-the-badge)](./cli)

## 🌟 Key Features

- **Standardized Environments**: Generate production-ready Docker setups for any stack (Next.js, FastAPI, Go, Express).
- **Interactive Wizard**: A beautiful, modern CLI experience to initialize your projects in seconds.
- **AI Recommendation Engine**: (Coming Soon) Let AI find the perfect tools and versions for your specific project needs.
- **Unified Orchestration**: Manage your entire project lifecycle (Dev, Sync, Deploy) through a single tool.

---

## 🛠️ Getting Started with the CLI

The core of `envsetup.dev` is our global CLI. To get started locally:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/kbrahmateja/v0-envsetup-dev.git
   cd v0-envsetup-dev
   ```

2. **Setup the CLI**:
   ```bash
   cd cli
   pnpm install
   pnpm build
   ```

3. **Run your first initialization**:
   ```bash
   # From your project directory
   node /path/to/cli/dist/index.js init
   ```

---

## 📁 Project Structure

- `/app`: The web platform (Next.js 15) for managing architectures and analytics.
- `/components`: Premium UI components powered by Tailwind CSS and Framer Motion.
- `/cli`: The source code for the `envsetup` CLI tool.
- `/lib`: Shared utilities and database logic.

---

## 🚀 Roadmap

- [x] CLI Foundation & Interactive Wizard
- [x] Presentation & Strategy Deck
- [ ] **Phase 2**: Expanded Framework Templates (Java, Ruby, Rust)
- [ ] **Phase 3**: `envsetup doctor` for local system health checks
- [ ] **Phase 4**: MCP (Model Context Protocol) Server for AI Agent integration

---

Built with ❤️ by the envsetup.dev team.
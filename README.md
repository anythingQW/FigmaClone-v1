# Flavor - Figma Clone 🎨

Flavor is a full-stack, real-time collaborative design tool inspired by Figma. It features a scalable monorepo architecture with a React-based frontend and an Express/WebSocket backend.

## 🚀 Features

- **Real-time Collaboration:** See other users' cursors and updates instantly via WebSockets.
- **Advanced Canvas:** Built with HTML5 Canvas API for high-performance rendering.
- **Shape System:** Supports rectangles, ellipses, lines, arrows, text, frames, polygons, and stars.
- **State Management:** Powered by Zustand for seamless and fast UI updates.
- **Infinite Canvas:** Pan and zoom freely around the workspace.
- **Export Capabilities:** Export designs as JSON or PNG files.
- **Templates:** Start quickly with built-in UI and wireframe templates.

## 🏗️ Architecture

This project is a monorepo managed by **Turborepo** and **pnpm workspaces**.

- `apps/client`: Next.js frontend application.
- `apps/server`: Node.js + Express + WS backend server.
- `packages/shared`: Shared TypeScript types and constants for both frontend and backend.

## 🛠️ Tech Stack

- **Frontend:** React, Next.js, Zustand, Tailwind CSS, Lucide Icons, Framer Motion.
- **Backend:** Node.js, Express, `ws` (WebSockets).
- **Tooling:** TypeScript, Turborepo, Prettier.

## 📦 Getting Started

### Prerequisites
- Node.js (v18+)
- pnpm (v8+)

### Installation
1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd "Figma Clone"
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```

### Running Locally
To start both the client and server concurrently in development mode:
```bash
pnpm dev
```
- Client runs at: `http://localhost:3000`
- API & WebSocket Server runs at: `http://localhost:3001` (ws://localhost:3001)

### Building for Production
```bash
pnpm build
```

## 📝 License
MIT License

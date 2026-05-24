### 1. Install dependency

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install

```

### 2. Run the Development Server

Start the development server with Turbopack enabled:

```bash
npm run dev

```

Open [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) with your browser to see the result.

## 📜 Available Scripts

| Command          | Description                                                                 |
| ---------------- | --------------------------------------------------------------------------- |
| `npm run dev`    | Starts the Next.js development server with Turbopack for instant HMR.       |
| `npm run build`  | Compiles the application for production using Turbopack.                    |
| `npm run start`  | Starts the production server.                                               |
| `npm run lint`   | Runs **Biome** to quickly check your codebase for errors and anti-patterns. |
| `npm run format` | Runs **Biome** to format all files in a fraction of a second.               |

## 🏗️ Architecture & Tooling Choices

### Material UI + Next.js App Router

Integrating MUI with the Next.js App Router normally requires boilerplate to handle Emotion's CSS cache and prevent server-side rendering mismatch. This template uses the official `@mui/material-nextjs` package to seamlessly handle the SSR registry, ensuring lightning-fast loads and perfect hydration.

### The React Compiler

This template includes `babel-plugin-react-compiler`. It automatically analyzes your React 19 code and memoizes values and functions, meaning you can write cleaner code without manually managing performance optimizations.

### Biome (The Prettier & ESLint Killer)

Instead of juggling heavy configurations for ESLint and Prettier, this project uses **Biome** (`@biomejs/biome`). It formats and lints your code in milliseconds, directly replacing standard setups and vastly improving CI/CD and local save times.

## 🤝 Contributing

Contributions, issues and feature requests are welcome!
Feel free to check [issues page](https://www.google.com/search?q=%23).
"""

```json
{
  "name": "portfolio",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --turbo",
    "build": "next build --turbo",
    "start": "next start",
    "lint": "biome check",
    "format": "biome format --write"
  },
  "dependencies": {
    "@emotion/cache": "^11.14.0",
    "@emotion/styled": "^11.14.1",
    "@mui/icons-material": "^9.0.1",
    "@mui/material": "^9.0.1",
    "@mui/material-nextjs": "^9.0.1",
    "next": "16.2.6",
    "react": "19.2.4",
    "react-dom": "19.2.4"
  },
  "devDependencies": {
    "@biomejs/biome": "2.2.0",
    "@types/node": "^20.19.41",
    "@types/react": "^19.2.14",
    "@types/react-dom": "^19.2.3",
    "babel-plugin-react-compiler": "1.0.0",
    "typescript": "^5.9.3"
  },
  "ignoreScripts": ["sharp", "unrs-resolver"],
  "trustedDependencies": ["sharp", "unrs-resolver"]
}
```

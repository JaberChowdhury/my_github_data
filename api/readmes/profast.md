# Profast

Profast is a modern, full-stack React application template designed for fast parcel delivery and logistics services. It leverages React Router for routing, TailwindCSS for styling, and includes a beautiful Catppuccin theme switcher for a customizable user experience.

## Features

- 🚀 **Server-side rendering** with React Router
- ⚡️ **Hot Module Replacement (HMR)** for rapid development
- 🎨 **Catppuccin theme switcher** (Latte, Frappe, Macchiato, Mocha)
- 📦 **Asset bundling and optimization**
- 🔄 **Data loading and mutations**
- 🔒 **TypeScript** by default
- 💅 **TailwindCSS** and shadcn/ui for modern UI components
- 🗺️ **Parcel delivery, reviews, and warehouse data**

## Getting Started

### Installation

Install dependencies:

```bash
pnpm install
# or
npm install
```

### Development

Start the development server:

```bash
pnpm run dev
# or
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

Create a production build:

```bash
pnpm run build
# or
npm run build
```

### Docker Deployment

Build and run using Docker:

```bash
docker build -t profast .
docker run -p 3000:3000 profast
```

## Project Structure

```
├───.react-router
│   └───types
│       └───app
│           ├───+types
│           └───routes
│               └───+types
├───.vercel
├───app
│   ├───components
│   │   ├───custom
│   │   └───ui
│   ├───lib
│   ├───routes
│   ├───src
│   │   ├───data
│   │   └───json
│   └───welcome
├───build
│   ├───client
│   │   ├───assets
│   │   └───resources
│   │       ├───animations
│   │       └───assets
│   │           ├───banner
│   │           └───brands
│   └───server
│       └───nodejs_eyJydW50aW1lIjoibm9kZWpzIn0
│           └───.vite
└───public
    └───resources
        ├───animations
        └───assets
            ├───banner
            └───brands
```

## Styling & Theming

- Uses **TailwindCSS** for utility-first styling
- **Catppuccin** color palette with four variants
- Theme switcher in the UI (top-right corner)
- Customizable via CSS variables in `app/app.css`

## Scripts

- `dev` - Start development server
- `build` - Build for production
- `start` - Start production server
- `typecheck` - TypeScript type checking

## Credits

- [React Router](https://reactrouter.com/)
- [TailwindCSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Catppuccin](https://catppuccin.com/)

---

**Profast** – Fast, modern, and beautiful parcel delivery platform starter.

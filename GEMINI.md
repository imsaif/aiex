# Project: AI Design Patterns

## Project Overview

This project, "AI Design Patterns," is a Next.js application built with TypeScript. Its primary purpose is to serve as an educational platform that showcases 14 essential AI design patterns. The platform provides interactive demonstrations, code examples, and best practices for developers, designers, and product managers. The goal is to standardize AI user experience design and bridge the gap between AI capabilities and user-centered design principles. The application is styled with Tailwind CSS and uses Framer Motion for animations.

## Building and Running

### Prerequisites
- Node.js
- npm, yarn, pnpm, or bun

### Installation
```bash
npm install
```

### Running the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

### Building for Production
```bash
npm run build
```
This command also runs an image optimization script and a build analysis script.

### Testing
The project uses Jest and React Testing Library for testing.

- **Run all tests:**
  ```bash
  npm test
  ```
- **Run tests in watch mode:**
  ```bash
  npm run test:watch
  ```
- **Run tests with coverage report:**
  ```bash
  npm run test:coverage
  ```

## Development Conventions

### Coding Style
- The project uses ESLint with `next/core-web-vitals` and `next/typescript` configurations to enforce code quality and consistency.
- TypeScript is used for type safety.
- The project follows standard React and Next.js conventions.

### Testing Practices
- The project has a comprehensive testing setup with Jest and React Testing Library.
- Tests are organized by component and data validation.
- There are specific npm scripts for running different test suites (e.g., `test:patterns`, `test:components`).
- The project aims for a 70% test coverage threshold for statements, branches, functions, and lines.

### Image Optimization
- The project includes an automatic image optimization script that runs during the build process.
- It is recommended to use `.webp` for static images and `.webm` for animations.
- The `optimize-images` script can be run manually:
  ```bash
  npm run optimize-images
  ```

### Deployment
- The project is intended to be deployed on Vercel.
- A `deployment.md` file provides a checklist for deployment.

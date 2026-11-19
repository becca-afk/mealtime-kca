# Contributing to MealTime

Thank you for your interest in contributing to **MealTime — KCA University Campus Dining & Queuing System**!

## Development Workflow

1. Fork this repository and clone your fork locally.
2. Create a feature or bug-fix branch from `main`:
   ```bash
   git checkout -b feat/your-feature-name
   ```
3. Install dependencies and run the development server:
   ```bash
   npm install
   npm run dev
   ```
4. Verify your changes pass TypeScript checks and production build before opening a Pull Request:
   ```bash
   npm run lint
   npm run build
   ```

## Guidelines
- Keep frontend components modular under `src/components/`.
- Do not commit secrets, API keys, or local temporary files.
- Open an issue first for major feature proposals or schema changes.

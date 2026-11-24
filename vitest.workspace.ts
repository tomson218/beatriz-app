import { defineWorkspace } from 'vitest/config';

// Lets `npx vitest run` / `npm test` work from the repo root: each project runs with its own config
// (backend/vitest.config.ts, frontend/vite.config.ts) instead of one shared config that fits neither.
export default defineWorkspace(['backend/vitest.config.ts', 'frontend/vite.config.ts']);

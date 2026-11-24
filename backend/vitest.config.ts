import { readFileSync } from 'node:fs';
import path from 'node:path';
import { parseEnv } from 'node:util';
import { defineConfig } from 'vitest/config';

// On Windows the VS Code terminal may start the process with a lowercase drive letter (`c:\...`). Vitest then
// resolves module paths inconsistently (`c:/` vs `C:/`) and `vi.mock` stops working, so `root` uses an uppercase drive letter.
const root = import.meta.dirname.replace(/^[a-z]:/, drive => drive.toUpperCase());

// Only .env.test is read (not Vite's `loadEnv`, which would also pull the real secrets from .env.local into the tests).
const testEnv = parseEnv(readFileSync(path.join(root, '.env.test'), 'utf8'));

export default defineConfig({
	root,
	test: {
		environment: 'node',
		include: ['tests/**/*.test.ts'],
		exclude: ['node_modules/**'],
		restoreMocks: true,
		env: testEnv,
		// `npm run test:coverage` — the HTML report is written to coverage/index.html.
		coverage: {
			provider: 'v8',
			include: ['modules/**/*.ts', 'utils/**/*.ts', 'shared/**/*.ts', 'app.ts'],
			exclude: ['**/*.type.ts', 'shared/types/**'],
			reporter: ['text-summary', 'text', 'html', 'lcov'],
			reportsDirectory: 'coverage',
		},
	},
});

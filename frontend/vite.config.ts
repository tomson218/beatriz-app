// vite.config.ts
/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
//import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';

// On Windows the VS Code terminal may start the process with a lowercase drive letter (`c:\...`). Vitest then
// resolves module paths inconsistently (`c:/` vs `C:/`) and `vi.mock` stops working, so the drive letter is
// normalized for both the `@` alias and the test root.
const projectDir = __dirname.replace(/^[a-z]:/, drive => drive.toUpperCase());

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			'@': path.resolve(projectDir, './src'),
		},
	},
	server: {
		host: '0.0.0.0',
	},
	test: {
		root: projectDir,
		globals: true,
		environment: 'jsdom',
		include: ['tests/**/*.test.{ts,tsx}'],
		setupFiles: './tests/setup.ts',
		css: true,
		restoreMocks: true,
		// Node 25+ has its own (experimental) `localStorage` that hides the jsdom one; it is disabled in the test workers.
		poolOptions: {
			forks: { execArgv: ['--no-experimental-webstorage'] },
		},
		// `npm run test:coverage` — the HTML report is written to coverage/index.html.
		coverage: {
			provider: 'v8',
			include: ['src/**/*.{ts,tsx}'],
			exclude: ['src/main.tsx', 'src/**/*.d.ts', 'src/shared/components/ui/**'],
			reporter: ['text-summary', 'text', 'html', 'lcov'],
			reportsDirectory: 'coverage',
		},
	},
});

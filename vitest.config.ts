import { defineConfig } from 'vitest/config';

// Root config used only when tests run from the repo root (see vitest.workspace.ts).
// Some options are global in workspace mode, so the fixes from the project configs are repeated here:
// - On Windows the VS Code terminal may start the process with a lowercase drive letter (`c:\...`); Vitest then
//   resolves module paths inconsistently (`c:/` vs `C:/`) and `vi.mock` stops working, so `root` uses an uppercase one.
// - Node 25+ has its own (experimental) `localStorage` that hides the jsdom one used by the frontend tests.
export default defineConfig({
	root: import.meta.dirname.replace(/^[a-z]:/, drive => drive.toUpperCase()),
	test: {
		poolOptions: {
			forks: { execArgv: ['--no-experimental-webstorage'] },
		},
	},
});

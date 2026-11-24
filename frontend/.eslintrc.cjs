module.exports = {
	root: true,
	env: { browser: true, es2020: true },
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:react-hooks/recommended',
		// Must stay last: turns off ESLint rules about formatting (e.g. mixed spaces and tabs); Prettier handles those.
		'prettier',
	],
	ignorePatterns: ['dist', '.eslintrc.cjs'],
	parser: '@typescript-eslint/parser',
	plugins: ['react-refresh'],
	rules: {
		'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
		'no-restricted-syntax': [
			'warn',
			{
				selector: 'ForStatement',
				message: 'Use array methods (forEach, map, filter, reduce) instead of a for loop.',
			},
			{ selector: 'ForInStatement', message: 'Use Object.keys/entries with array methods instead of for...in.' },
			{
				selector: 'ForOfStatement',
				message: 'Use array methods (forEach, map, filter, reduce) instead of for...of.',
			},
		],
	},
	overrides: [
		{
			// Test files are never loaded by Fast Refresh (HMR), so this rule does not apply to them.
			files: ['tests/**/*.{ts,tsx}'],
			rules: { 'react-refresh/only-export-components': 'off' },
		},
	],
};

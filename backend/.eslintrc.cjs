module.exports = {
	root: true,
	env: { node: true, es2022: true },
	parser: '@typescript-eslint/parser',
	parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
	ignorePatterns: ['node_modules', 'public', '.eslintrc.cjs'],
	rules: {
		'no-restricted-syntax': [
			'warn',
			{ selector: 'ForStatement', message: 'Use array methods (forEach, map, filter, reduce) instead of a for loop.' },
			{ selector: 'ForInStatement', message: 'Use Object.keys/entries with array methods instead of for...in.' },
			{ selector: 'ForOfStatement', message: 'Use array methods (forEach, map, filter, reduce) instead of for...of.' },
		],
	},
};

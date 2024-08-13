import js from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default [
	js.configs.recommended,
	eslintPluginPrettierRecommended,
	{
		ignores: ['node_modules/**'],
		files: ['**/*.js'],
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module'
		},
		rules: {
			semi: 'error',
			'prefer-const': 'error',
			'no-unused-vars': 'error',
			'no-debugger': 'error',
			'no-var': 'error',
			'no-undef': 'off'
		}
	}
];

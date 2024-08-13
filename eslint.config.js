import js from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import { configs } from 'eslint-plugin-import';

export default [
	js.configs.recommended,
	eslintPluginPrettierRecommended,
	{
		ignores: ['node_modules/**']
	},
	{
		files: ['**/*.js'],
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module'
		}
	},
	{
		rules: {
			...configs.recommended.rules,
			semi: 'error',
			'prefer-const': 'error',
			'no-unused-vars': 'warn'
		}
	}
];

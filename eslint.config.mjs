import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import pkg from '@typescript-eslint/eslint-plugin';
import parser from '@typescript-eslint/parser';

const { configs } = pkg;

export default [
	eslintPluginPrettierRecommended,
	{
		files: ['core/**/*.ts'],
		ignores: ['node_modules/**', 'dist/**'],
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			parser, // 使用 TypeScript 解析器
			parserOptions: {
				project: './tsconfig.base.json' // 确保有 tsconfig.json 文件
			}
		},
		plugins: {
			'@typescript-eslint': configs // 使用 TypeScript 插件
		},
		rules: {
			semi: 'error',
			'prefer-const': 'error',
			'no-debugger': 'error',
			'no-var': 'error',
			'no-undef': 'off'
		}
	}
];

import { TemplateItem } from './types';

/** 所有模版 */
export const TEMPLATE_LIST: TemplateItem[] = [
	{
		name: 'baseIndex模版',
		value: 'baseIndex',
		npmName: 'template-storybook',
		module: 'fragment',
		version: 'latest',
		copyPath: 'src/pages',
		sourcePath: 'src/template/pages/base',
		ignore: [],
		type: 'component'
	},
	{
		name: 'context模版',
		value: 'context',
		npmName: 'template-storybook',
		module: 'fragment',
		version: 'latest',
		copyPath: 'src/pages',
		sourcePath: 'src/template/context',
		ignore: [],
		type: 'context'
	},
	{
		name: 'swr本地存储',
		value: 'swrStorage',
		npmName: 'template-storybook',
		module: 'fragment',
		version: 'latest',
		copyPath: 'src/pages/data',
		sourcePath: 'src/template/data/swrStorage',
		ignore: [''],
		type: 'swr'
	},
	{
		name: 'swr请求',
		value: 'swrRequest',
		npmName: 'template-storybook',
		module: 'fragment',
		version: 'latest',
		copyPath: 'src/pages/data',
		sourcePath: 'src/template/data/swrRequest',
		ignore: [''],
		type: 'swr'
	},
	{
		name: '基础图表',
		value: 'BaseChart',
		npmName: 'template-storybook',
		module: 'component',
		version: 'latest',
		copyPath: 'src/pages',
		/** 组件相关源码路径 */
		sourceCodePath: [
			'/src/components/echarts/BaseChart',
			'/src/components/echarts/publicConfig'
		],
		sourcePath: 'src/template/components/baseChart',
		ignore: ['chart-data.ts'],
		type: 'component'
	}
];

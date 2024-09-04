import { TemplateItem } from './types';

/** 所有模版 */
export const TEMPLATE_LIST: TemplateItem[] = [
	{
		name: '榜单table',
		value: 'rank-table',
		npmName: 'yutu-software-template-section',
		module: 'pages',
		version: 'latest',
		copyPath: 'src/pages',
		sourcePath: 'template/pages/list',
		ignore: ['**/node_modules/**'],
		type: 'page'
	},
	{
		name: 'context模版',
		value: 'context',
		npmName: 'yutu-software-template-section',
		module: 'fragment',
		version: 'latest',
		copyPath: 'src/pages',
		sourcePath: 'template/contexts/paramsContext',
		ignore: [],
		type: 'context'
	},
	{
		name: 'swr本地存储',
		value: 'swrStorage',
		npmName: 'yutu-software-template-section',
		module: 'fragment',
		version: 'latest',
		copyPath: 'src/pages/data',
		sourcePath: 'template/data/swrStorage',
		ignore: [''],
		type: 'swr'
	},
	{
		name: 'swr请求',
		value: 'swrRequest',
		npmName: 'yutu-software-template-section',
		module: 'fragment',
		version: 'latest',
		copyPath: 'src/pages/data',
		sourcePath: 'template/data/swrRequest',
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
		sourcePath: 'src/pages/baseChart',
		ignore: ['chart-data.ts'],
		type: 'component'
	}
];

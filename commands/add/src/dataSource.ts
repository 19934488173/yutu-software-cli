import { TemplateItem, TemplateModules } from './types';

/** 所有模版 */
export const TEMPLATE_LIST: TemplateItem[] = [
	{
		name: '榜单table',
		value: 'list',
		npmName: 'yutu-software-template-section',
		module: TemplateModules.page,
		version: 'latest',
		copyPath: 'src/pages',
		sourcePath: 'template/pages/list',
		ignore: ['**/node_modules/**']
	},
	{
		name: 'context模版',
		value: 'paramsContext',
		npmName: 'yutu-software-template-section',
		module: TemplateModules.context,
		version: 'latest',
		copyPath: 'src/pages',
		sourcePath: 'template/contexts/paramsContext',
		ignore: []
	},
	{
		name: 'swr本地存储',
		value: 'swrStorage',
		npmName: 'yutu-software-template-section',
		module: TemplateModules.data,
		version: 'latest',
		copyPath: 'src/pages/data',
		sourcePath: 'template/data/swrStorage',
		ignore: ['']
	},
	{
		name: 'swr请求',
		value: 'swrRequest',
		npmName: 'yutu-software-template-section',
		module: TemplateModules.data,
		version: 'latest',
		copyPath: 'src/pages/data',
		sourcePath: 'template/data/swrRequest',
		ignore: ['']
	},
	{
		name: '基础图表',
		value: 'baseChart',
		npmName: 'yutu-software-template-section',
		module: TemplateModules.echarts,
		version: 'latest',
		copyPath: 'src/pages',
		sourcePath: 'template/echarts/baseChart',
		ignore: ['chart-data.ts']
	}
];

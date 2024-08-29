import createLogger from '@yutu-software-cli/debug-log';

export type Logger = ReturnType<typeof createLogger>;

/** 模板类型定义 */
export const TemplateModules = {
	data: 'data',
	page: 'page',
	echarts: 'echarts',
	context: 'context',
	components: 'components',
	hooks: 'hooks',
	section: 'section'
} as const;
export type TemplateModuleType =
	(typeof TemplateModules)[keyof typeof TemplateModules];

//模版字段
export interface TemplateItem {
	name: string;
	value: string;
	npmName: string;
	module: TemplateModuleType;
	version: string;
	copyPath: string;
	sourcePath: string;
	ignore: string[];
}
//模版字段的基础上扩展用户输入的信息
export interface ITemplateInfo extends TemplateItem {
	templateName: string;
}

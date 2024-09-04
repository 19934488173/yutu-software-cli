import createLogger from '@yutu-software-cli/debug-log';

export type Logger = ReturnType<typeof createLogger>;

//模版字段
export interface TemplateItem {
	name: string;
	value: string;
	npmName: string;
	module: string;
	version: string;
	copyPath: string;
	sourcePath: string;
	ignore: string[];
	sourceCodePath?: string[];
}
//模版字段的基础上扩展用户输入的信息
export interface ITemplateInfo extends TemplateItem {
	templateName: string;
}

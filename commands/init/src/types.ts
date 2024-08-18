export const TYPE_PROJECT = 'project' as const;
export const TYPE_COMPONENT = 'component' as const;
export const TEMPLATE_TYPE_NORMAL = 'normal' as const;
export const TEMPLATE_TYPE_CUSTOM = 'custom' as const;

// 项目模版字段
export interface IProjectTemplate {
	name: string;
	version: string;
	npmName: string;
	type: typeof TEMPLATE_TYPE_NORMAL | typeof TEMPLATE_TYPE_CUSTOM;
}

//准备阶段方法参数
export interface IPrepareOptions {
	projectName: string;
	force: boolean;
}

export interface IProjectInfo {
	type: typeof TYPE_PROJECT | typeof TYPE_COMPONENT;
	projectName: string;
	projectVersion: string;
	projectTemplate: IProjectTemplate;
}

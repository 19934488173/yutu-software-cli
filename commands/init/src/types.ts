import PackageHandler from '@yutu-software-cli/package-handler';

export const WHITE_COMMAND = ['npm', 'cnpm', 'pnpm', 'yarn'];

// PackageHandler的实例类型
export type PackageType = InstanceType<typeof PackageHandler>;

// 项目模版字段
export interface IProjectTemplate {
	name: string;
	version: string;
	npmName: string;
	ignore?: string[];
	tag?: string[];
	buildPath?: string;
	examplePath?: string;
	installCommand?: string;
	startCommand?: string;
}

// 项目选中信息
export interface IProjectInfo extends IProjectTemplate {
	projectName: string;
	projectVersion: string;
}

//准备阶段方法参数
export interface IPrepareOptions {
	projectName: string;
	force: boolean;
}

//ejs渲染参数
export interface IEjsRenderOptions {
	ignoreFiles?: string | string[];
}

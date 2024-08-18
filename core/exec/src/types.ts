import { Command } from 'commander';
import PackageHandler from '@yutu-cli/package-handler';
import createLogger from '@yutu-cli/debug-log';

// 命令的配置
export interface Settings {
	[key: string]: string;
}

// PackageHandler的实例类型
export type PackageType = InstanceType<typeof PackageHandler>;

// 执行命令函数的参数类型
export type ExecArgs = [...string[], Command];

// getOrInstallPackage 函数的参数类型
export interface IGetOrInstallPackage {
	targetPath: string;
	homePath: string;
	packageName: string;
	packageVersion: string;
	logger: ReturnType<typeof createLogger>;
}

// executeCommand 执行命令函数的参数类型
export interface IExecuteCommandOptions {
	rootFile: string;
	args: ExecArgs;
	logger: ReturnType<typeof createLogger>;
}

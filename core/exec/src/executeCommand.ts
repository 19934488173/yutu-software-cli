import { Command } from 'commander';
import { spawnPlus } from '@amber-yutu-cli/share-utils';

import { IExecuteCommandOptions } from './types';

// 清理命令行参数的函数
const cleanCommandArgs = (args: any[]) => {
	// 获取最后一个参数，通常是Command对象
	const cmd = args[args.length - 1] as Command;
	// 清理Command对象中不需要的属性
	const cleanedCmd = Object.keys(cmd).reduce(
		(acc, key) => {
			// 排除以 _ 开头的属性和 parent 属性
			if (cmd.hasOwnProperty(key) && !key.startsWith('_') && key !== 'parent') {
				(acc as Record<string, any>)[key] = cmd[key as keyof Command];
			}
			return acc;
		},
		{} as Record<string, any>
	);
	// 替换最后一个参数为清理后的命令对象
	args[args.length - 1] = cleanedCmd;
	return args;
};

// 执行命令的函数
const executeCommand = (options: IExecuteCommandOptions) => {
	const { rootFile, args, logger } = options;
	try {
		// 清理命令行参数
		const cleanedArgs = cleanCommandArgs(args);

		// 使用 spawnPlus 开启子进程执行命令
		const child = spawnPlus('node', [rootFile, JSON.stringify(cleanedArgs)], {
			cwd: process.cwd(),
			stdio: 'inherit'
		});

		// 监听子进程错误事件
		child.on('error', handleProcessError);

		// 监听子进程退出事件
		child.on('exit', (e) => {
			logger.log('命令执行成功');
			process.exit(e);
		});
	} catch (error: any) {
		handleProcessError(error);
	}
};

// 处理子进程错误的辅助函数
function handleProcessError(error: Error) {
	console.error('执行子进程时发生错误: ' + error.message);
	process.exit(1);
}

export default executeCommand;

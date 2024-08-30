import { Command } from 'commander';
import createLogger from '@yutu-software-cli/debug-log';
import getOrInstallPackage from './getOrInstallPackage';
import executeCommand from './executeCommand';
import { SETTINGS } from './constants';
import { ExecArgs, PackageType } from './types';

// 异步执行命令函数
const exec = async (...args: ExecArgs) => {
	// 命名日志空间为：exec
	const logger = createLogger('@yutu-software-cli:exec');

	let pkg: PackageType | undefined;

	// 获取环境变量中的目标路径和主目录路径
	const targetPath = process.env.CLI_TARGET_PATH ?? '';
	const homePath = process.env.CLI_HOME_PATH ?? '';

	// 验证路径是否有效
	if (!homePath) {
		throw new Error('CLI_HOME_PATH 未定义');
	}

	// 从命令行参数中获取最后一个参数Command 对象
	const cmdObj = args[args.length - 1] as Command;
	const cmdName = cmdObj.name();

	// 根据命令名称获取包名
	const packageName = SETTINGS[cmdName];
	// 默认安装最新版本的包
	const packageVersion = 'latest';

	logger.log('targetPath', targetPath);
	logger.log('homePath', homePath);

	try {
		// 获取或安装包，并返回包的实例
		pkg = await getOrInstallPackage({
			targetPath,
			homePath,
			packageName,
			packageVersion,
			logger
		});

		// 获取包的根文件路径
		const rootFile = pkg?.getRootFilePath();

		if (rootFile) {
			// 如果根文件路径存在，则执行命令
			executeCommand({ rootFile, args, logger });
		} else {
			logger.error('未找到可执行的根文件路径');
		}
	} catch (error: any) {
		logger.error('执行子进程时发生错误: ' + error.message);
		process.exit(1);
	}
};

export default exec;

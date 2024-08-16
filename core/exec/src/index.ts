import path from 'path';
import { Command } from 'commander';
import PackageHandler from '@yutu-cli/package-handler';
import createLogger from '@yutu-cli/debug-log';
import shareUtils from '@yutu-cli/share-utils';

const { spawnPlus } = shareUtils;

// 定义命令设置类型
interface Settings {
	[key: string]: string;
}

type PackageType = InstanceType<typeof PackageHandler>;

const SETTINGS: Settings = {
	init: '@imooc-cli/init'
};
const CACHE_DIR = 'dependencies';
// 更通用的类型定义
type ExecArgs = [...string[], Command];

const exec = async (...args: ExecArgs) => {
	//命名日志空间为：exec
	const logger = createLogger('exec');

	let pkg: PackageType | undefined;

	const targetPath = process.env.CLI_TARGET_PATH ?? '';
	const homePath = process.env.CLI_HOME_PATH ?? '';
	//在 .action 回调函数中，commander 总是将命令的 Command 对象作为最后一个参数传递，这样取能保证代码能够适应不同数量的命令行参数。
	const cmdObj = args[args.length - 1] as Command;
	const cmdName = cmdObj.name();
	const packageName = SETTINGS[cmdName];
	const packageVersion = 'latest';

	logger.log('targetPath', targetPath);
	logger.log('homePath', homePath);

	try {
		pkg = await getOrInstallPackage({
			targetPath,
			homePath,
			packageName,
			packageVersion
		});

		const rootFile = pkg?.getRootFilePath();
		if (rootFile) {
			executeCommand(rootFile, args);
		} else {
			console.error('未找到可执行的根文件路径');
		}
	} catch (error: any) {
		console.error('执行命令时发生错误: ' + error.message);
	}
};

async function getOrInstallPackage({
	targetPath,
	homePath,
	packageName,
	packageVersion
}: {
	targetPath: string;
	homePath: string;
	packageName: string;
	packageVersion: string;
}) {
	//命名日志空间为：exec
	const logger = createLogger('exec');

	let pkg: PackageType;
	let storeDir = '';

	if (!targetPath) {
		const cachePath = path.resolve(homePath, CACHE_DIR);
		storeDir = path.resolve(cachePath, 'node_modules');

		logger.log('cachePath', cachePath);
		logger.log('storeDir', storeDir);

		pkg = new PackageHandler({
			targetPath: cachePath,
			storeDir,
			packageName,
			packageVersion
		});

		if (await pkg.exists()) {
			await pkg.update();
		} else {
			await pkg.install();
		}
	} else {
		pkg = new PackageHandler({ targetPath, packageName, packageVersion });
	}
	return pkg;
}

function executeCommand(rootFile: string, args: any[]): void {
	try {
		const cleanedArgs = cleanCommandArgs(args);
		const child = spawnPlus('node', [rootFile, JSON.stringify(cleanedArgs)], {
			cwd: process.cwd(),
			stdio: 'inherit'
		});

		child.on('error', (e) => {
			console.error('子进程发生错误: ' + e.message);
			process.exit(1);
		});

		child.on('exit', (e) => {
			console.log('命令执行成功');
			process.exit(e);
		});
	} catch (error: any) {
		console.error('执行子进程时发生错误: ' + error.message);
	}
}

function cleanCommandArgs(args: any[]): any[] {
	const cmd = args[args.length - 1];
	const cleanedCmd = Object.keys(cmd).reduce(
		(acc, key) => {
			if (cmd.hasOwnProperty(key) && !key.startsWith('_') && key !== 'parent') {
				acc[key] = cmd[key];
			}
			return acc;
		},
		{} as Record<string, any>
	);
	args[args.length - 1] = cleanedCmd;
	return args;
}

export default exec;

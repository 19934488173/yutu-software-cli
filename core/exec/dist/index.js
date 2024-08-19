// core/exec/src/index.ts
import createLogger from '@yutu-software-cli/debug-log';

// core/exec/src/getOrInstallPackage.ts
import path from 'path';
import PackageHandler from '@yutu-software-cli/package-handler';

// core/exec/src/constants.ts
var SETTINGS = {
	init: '@yutu-software-cli/init'
};
var CACHE_DIR = 'dependencies';

// core/exec/src/getOrInstallPackage.ts
var resolveCachePath = (homePath, dir) => {
	const cachePath = path.resolve(homePath, dir);
	const storeDir = path.resolve(cachePath, 'node_modules');
	return { cachePath, storeDir };
};
var getOrInstallPackage = async (options) => {
	const { targetPath, homePath, packageName, packageVersion, logger } = options;
	let pkg;
	if (!targetPath) {
		const { cachePath, storeDir } = resolveCachePath(homePath, CACHE_DIR);
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
};
var getOrInstallPackage_default = getOrInstallPackage;

// core/exec/src/executeCommand.ts
import { spawnPlus } from '@yutu-software-cli/share-utils';
var cleanCommandArgs = (args) => {
	const cmd = args[args.length - 1];
	const cleanedCmd = Object.keys(cmd).reduce((acc, key) => {
		if (cmd.hasOwnProperty(key) && !key.startsWith('_') && key !== 'parent') {
			acc[key] = cmd[key];
		}
		return acc;
	}, {});
	args[args.length - 1] = cleanedCmd;
	return args;
};
var executeCommand = (options) => {
	const { rootFile, args, logger } = options;
	try {
		const cleanedArgs = cleanCommandArgs(args);
		const child = spawnPlus('node', [rootFile, JSON.stringify(cleanedArgs)], {
			cwd: process.cwd(),
			stdio: 'inherit'
		});
		child.on('error', handleProcessError);
		child.on('exit', (e) => {
			logger.log('\u547D\u4EE4\u6267\u884C\u6210\u529F');
			process.exit(e);
		});
	} catch (error) {
		handleProcessError(error);
	}
};
function handleProcessError(error) {
	console.error(
		'\u6267\u884C\u5B50\u8FDB\u7A0B\u65F6\u53D1\u751F\u9519\u8BEF: ' +
			error.message
	);
	process.exit(1);
}
var executeCommand_default = executeCommand;

// core/exec/src/index.ts
var exec = async (...args) => {
	const logger = createLogger('@yutu-software-cli:exec');
	let pkg;
	const targetPath = process.env.CLI_TARGET_PATH ?? '';
	const homePath = process.env.CLI_HOME_PATH ?? '';
	if (!homePath) {
		throw new Error('CLI_HOME_PATH \u672A\u5B9A\u4E49');
	}
	const cmdObj = args[args.length - 1];
	const cmdName = cmdObj.name();
	const packageName = SETTINGS[cmdName];
	const packageVersion = 'latest';
	logger.log('targetPath', targetPath);
	logger.log('homePath', homePath);
	try {
		pkg = await getOrInstallPackage_default({
			targetPath,
			homePath,
			packageName,
			packageVersion,
			logger
		});
		const rootFile = pkg?.getRootFilePath();
		if (rootFile) {
			executeCommand_default({ rootFile, args, logger });
		} else {
			logger.error(
				'\u672A\u627E\u5230\u53EF\u6267\u884C\u7684\u6839\u6587\u4EF6\u8DEF\u5F84'
			);
		}
	} catch (error) {
		logger.error(
			'\u6267\u884C\u5B50\u8FDB\u7A0B\u65F6\u53D1\u751F\u9519\u8BEF: ' +
				error.message
		);
		process.exit(1);
	}
};
var src_default = exec;
export { src_default as default };

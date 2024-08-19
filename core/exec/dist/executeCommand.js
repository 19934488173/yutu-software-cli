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
export { executeCommand_default as default };

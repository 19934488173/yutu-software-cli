import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { Command } from 'commander';
import chalk from 'chalk';
import shareUtils from '@yutu-cli/share-utils';
import createLogger from '@yutu-cli/debug-log';
import prepare from './prepare';

const { readPackageJson } = shareUtils;
//实例化commander
const program = new Command();

// 拿到当前目录的package.json
export let pkg: any;
async function getPkg() {
	const __dirname = dirname(fileURLToPath(import.meta.url));
	pkg = await readPackageJson(__dirname);
}

// 脚手架核心入口
const cli = async () => {
	try {
		await getPkg();
		await prepare();
		registerCommand();
	} catch (error) {
		console.log(error);
	}
};

// 脚手架命令注册
function registerCommand() {
	// 检查node版本
	program
		.name(Object.keys(pkg.bin)[0])
		.version(pkg.version)
		.usage('<command> [options]')
		.option('-d, --debug [namespace]', '开启调试模式', false)
		.option('-tp, --targetPath <targetPath>', '指定本地调试文件目标路径', '');

	// 注册命令
	// 1,初始化项目
	program
		.command('init <projectName>')
		.option('-f, --force', '强制初始化项目')
		.action(() => {});

	//监听debug参数
	program.on('option:debug', () => {
		const debugOption = program.getOptionValue('debug');
		process.env.DEBUG = debugOption !== true ? debugOption : '*';
		// 在设置环境变量后再创建 logger
		const logger = createLogger('cli');
		logger.info('debug模式已开启');
	});

	// 监听targetPath参数，用于本地调试
	program.on('option:targetPath', () => {
		const targetPath = program.getOptionValue('targetPath');
		process.env.CLI_TARGET_PATH = targetPath;
	});

	//处理未知命令
	program.on('command:*', (obj) => {
		console.error(chalk.red('未知的命令: %s'), obj[0]);
		program.help();
	});

	// 解析命令参数
	program.parse(process.argv);
}

export default cli;

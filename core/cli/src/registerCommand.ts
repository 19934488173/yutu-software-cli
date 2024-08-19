import { Command } from 'commander';
import chalk from 'chalk';
import createLogger from '@yutu-cli/debug-log';
import exec from '@yutu-cli/exec';
import { pkg } from './cli';
//实例化commander
const program = new Command();

// 脚手架命令注册
const registerCommand = () => {
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
		.action(exec);

	//监听debug参数
	program.on('option:debug', () => {
		const debugOption = program.getOptionValue('debug');
		process.env.DEBUG = debugOption === true ? '@yutu-cli:*' : debugOption;
		// 在设置环境变量后再创建 logger
		const logger = createLogger('@yutu-cli:cli');
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
};

export default registerCommand;

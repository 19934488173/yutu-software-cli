import rootCheck from 'root-check';
import userhome from 'userhome';
import path from 'path';
import dotenv from 'dotenv';
import semver from 'semver';
import chalk from 'chalk';
import { pathExistsSync } from 'path-exists';
import getNpmSemverVersion from '@yutu-software-cli/get-npm-info';

import { pkg } from './cli';

// 环境变量默认值，防止用户没有.env文件读不到值代码报错
const DEFAULT_CLI_HOME = '.yutu-software-cli';

// 2，检查用户主目录
const checkHomeDir = () => {
	const homeDir = userhome();
	if (!homeDir || !pathExistsSync(homeDir)) {
		throw new Error('无法获取用户主目录');
	}
};

// 3，检查环境变量
interface CLIConfig {
	home: string;
	cliHome: string;
}
const checkEnv = () => {
	const homeDir = userhome();
	const cliConfig: CLIConfig = {
		home: homeDir,
		cliHome: ''
	};
	const dotenvPath = path.resolve(homeDir, '.env');

	// 如果 .env 文件存在，则加载环境变量
	if (pathExistsSync(dotenvPath)) {
		dotenv.config({ path: dotenvPath });
	}

	// 根据环境变量 CLI_HOME 设置 cliHome，否则使用默认值
	cliConfig.cliHome = process.env.CLI_HOME
		? path.join(homeDir, process.env.CLI_HOME)
		: path.join(homeDir, DEFAULT_CLI_HOME);

	// 将 CLI_HOME_PATH 设置为环境变量
	process.env.CLI_HOME_PATH = cliConfig.cliHome;
};

// 4，检查脚手架版本号
const checkVersion = async () => {
	//1，获取最新版本号与模块名
	const currentVersion = pkg.version;
	const npmName = pkg.name;
	//2，获取远程版本号
	const latestVersion = await getNpmSemverVersion(currentVersion, npmName);
	if (latestVersion && semver.gt(latestVersion, currentVersion)) {
		console.log(
			'更新提示：',
			chalk.yellow(
				`请手动更新${npmName},当前版本：${currentVersion}，最新版本：${latestVersion},更新命令:pnpm install -g ${npmName}`
			)
		);
	}
};

//操作系统执行准备阶段
const prepare = async () => {
	/** 1，检查root账户：这里可以用node的process.geteuid()，但是有系统兼容性问题，用第三方库更稳定
	 * root-check 库会在检测到 root 权限时自动退出并显示警告信息。
	 * */
	rootCheck();
	// 2，检查用户主目录
	checkHomeDir();
	// 3，检查环境变量
	checkEnv();
	// 4，检查脚手架版本号
	// await checkVersion();
};

export default prepare;

import path from 'path';
import userHome from 'user-home';
import {
	sleep,
	spawnPlus,
	spinnerStart,
	catchError
} from '@yutu-software-cli/share-utils';
import templateInstaller from '@yutu-software-cli/template-installer';
import createLogger from '@yutu-software-cli/debug-log';
import { ejsRender, fse } from '@yutu-software-cli/ejs-render';
import { IProjectInfo, PackageType, WHITE_COMMAND } from './types';

class InstallService {
	private logger = createLogger('@yutu-software-cli:init');
	private projectNpmInfo?: PackageType;
	private projectInfo: IProjectInfo;

	constructor(projectInfo: IProjectInfo) {
		this.projectInfo = projectInfo;
	}

	async installModule() {
		try {
			// 1，下载模板
			await this.downloadProject();
			// 2，安装模板
			await this.installProject();
		} catch (error) {
			catchError({ msg: '项目安装失败:', error });
		}
	}

	/** 下载或更新项目模板 */
	private async downloadProject() {
		// 设置模板存储路径和 node_modules 目录路径
		const targetPath = path.resolve(
			userHome,
			process.env.CLI_HOME_PATH ?? '',
			'template'
		);
		const storeDir = path.resolve(targetPath, 'node_modules');

		// 从模板信息中解构获取 npm 包名和版本号
		const { npmName, version } = this.projectInfo;

		try {
			this.projectNpmInfo = await templateInstaller({
				packageName: npmName,
				packageVersion: version,
				storeDir,
				targetPath,
				logger: this.logger
			});
			this.logger.info(`项目模板下载成功: ${npmName}@${version}`);
		} catch (error) {
			catchError({ msg: '项目模板下载失败:', error });
		}
	}

	/** 安装 normal 类型模板 */
	private async installProject() {
		const { ignore, installCommand, startCommand } = this.projectInfo;
		// 检查模板信息是否存在
		if (!this.projectNpmInfo) {
			throw new Error('项目信息不存在，请先下载模板！');
		}
		this.logger.info('项目信息', this.projectNpmInfo);

		// 1. 启动模板安装的进度提示
		const spinner = spinnerStart('正在安装模板...');
		await sleep();

		// 获取当前工作目录作为模板的目标路径
		const currentPath = process.cwd();

		try {
			// 计算模板的源路径
			const templatePath = path.resolve(
				this.projectNpmInfo.cacheFilePath,
				`template`
			);

			// 确保模板源路径和目标路径存在
			fse.ensureDirSync(templatePath);
			fse.ensureDirSync(currentPath);

			// 复制模板文件到当前工作目录
			fse.copySync(templatePath, currentPath);
		} catch (error) {
			this.logger.error('项目安装失败', error);
			throw error;
		} finally {
			spinner.stop(true);
			this.logger.info('项目安装成功');
		}

		// 3. 渲染 EJS 模板
		const templateIgnore = ignore || [];
		const ignoreFiles = ['**/node_modules/**', ...templateIgnore];
		await ejsRender({
			data: this.projectInfo,
			options: { ignoreFiles }
		});

		// 4. 安装依赖
		if (installCommand) {
			await this.execCommand(installCommand, '依赖安装失败！');
		}

		// 5. 执行启动命令
		if (startCommand) {
			await this.execCommand(startCommand, '启动执行命令失败！');
		}
	}

	/** 执行命令行命令 */
	private async execCommand(command: string, errMsg: string) {
		if (!command) return;

		const cmdArray = command.split(' ');
		const cmd = WHITE_COMMAND.includes(cmdArray[0]) ? cmdArray[0] : null;
		if (!cmd) {
			throw new Error('命令不存在！命令：' + command);
		}
		const args = cmdArray.slice(1);

		return new Promise<void>((resolve, reject) => {
			const child = spawnPlus(cmd, args, {
				stdio: 'inherit',
				cwd: process.cwd()
			});

			child.on('error', (err) => {
				console.error(`子进程错误: ${err}`);
				reject(new Error(errMsg));
			});

			child.on('close', (code) => {
				if (code === 0) {
					resolve();
				} else {
					reject(new Error(`${errMsg} 退出码: ${code}`));
				}
			});
		});
	}
}

export default InstallService;

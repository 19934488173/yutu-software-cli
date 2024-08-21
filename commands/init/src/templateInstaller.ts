import path from 'path';
import userHome from 'user-home';
import { sleep, spawnPlus, spinnerStart } from '@yutu-software-cli/share-utils';
import PackageHandler from '@yutu-software-cli/package-handler';
import createLogger from '@yutu-software-cli/debug-log';
import { copySync, ensureDirSync, existsSync } from './fsUtils';
import ejsRender from './ejsRender';
import {
	IProjectInfo,
	PackageType,
	TEMPLATE_TYPE_CUSTOM,
	TEMPLATE_TYPE_NORMAL,
	WHITE_COMMAND
} from './types';

class TemplateInstaller {
	// 存储模板的PackageHandler实例
	private templateNpmInfo?: PackageType;
	// 模版类型
	private projectInfo: IProjectInfo;
	// 日志记录器
	private logger: ReturnType<typeof createLogger>;

	constructor(
		projectInfo: IProjectInfo,
		logger: ReturnType<typeof createLogger>
	) {
		this.logger = logger;
		this.projectInfo = projectInfo;
	}

	/** 下载或更新项目模板 */
	async download() {
		// 设置模板存储路径和 node_modules 目录路径
		const targetPath = path.resolve(userHome, '.yutu-software-cli', 'template');
		const storeDir = path.resolve(
			userHome,
			'.yutu-software-cli',
			'template',
			'node_modules'
		);

		// 从模板信息中解构获取 npm 包名和版本号
		const { npmName, version } = this.projectInfo.projectTemplate;

		// 创建 PackageHandler 实例，用于处理模板的安装和更新
		const templateNpm = new PackageHandler({
			targetPath,
			storeDir,
			packageName: npmName,
			packageVersion: version
		});

		// 判断模板是否已存在
		const templateExists = await templateNpm.exists();
		const spinnerMessage = templateExists
			? '正在更新模板...'
			: '正在下载模板...';

		// 启动命令行加载动画
		const spinner = spinnerStart(spinnerMessage);
		await sleep(); // 模拟下载或更新的延迟

		try {
			if (templateExists) {
				// 如果模板存在，执行更新操作
				await templateNpm.update();
			} else {
				// 如果模板不存在，执行安装操作
				await templateNpm.install();
			}

			// 模板下载或更新成功后的操作
			if (await templateNpm.exists()) {
				this.logger.info(templateExists ? '更新模板成功！' : '下载模板成功！');
				this.templateNpmInfo = templateNpm; // 保存模板信息
			}
		} catch (error: any) {
			// 捕获安装或更新过程中的错误并抛出
			throw new Error(
				`模板${templateExists ? '更新' : '下载'}失败: ${error.message}`
			);
		} finally {
			// 停止加载动画
			spinner.stop(true);
		}
	}

	/** 安装项目模板 */
	async install() {
		try {
			const { type } = this.projectInfo.projectTemplate;
			// 1. 如果模板类型不存在，默认设置为 'normal'
			this.projectInfo.projectTemplate.type = type || TEMPLATE_TYPE_NORMAL;

			// 2. 根据模板类型选择安装方式
			switch (type) {
				case TEMPLATE_TYPE_NORMAL:
					await this.installNormal();
					break;
				case TEMPLATE_TYPE_CUSTOM:
					await this.installCustom();
					break;
				default:
					throw new Error(`无法识别的项目模板类型: ${type}`);
			}
		} catch (error: any) {
			// 错误处理
			this.logger.error(`模板安装失败: ${error.message}`);
			throw error;
		}
	}

	/** 安装 custom 类型模板 */
	private async installCustom() {
		// 解构 templateNpmInfo 以获取需要的属性
		const { exists, getRootFilePath, cacheFilePath } = this.templateNpmInfo!;

		// 检查模板信息是否存在，若不存在则提前返回
		if (!(await exists())) {
			this.logger.warn('模板信息不存在，安装终止');
			return;
		}

		// 获取模板的主入口文件路径
		const rootFile = getRootFilePath() || '';

		// 检查主入口文件是否存在，若不存在则提前返回
		if (!existsSync(rootFile)) {
			this.logger.warn('模板主入口文件不存在，安装终止');
			return;
		}

		this.logger.info('开始执行自定义模板');

		// 构建模板路径和安装选项
		const templatePath = path.resolve(cacheFilePath, 'template');
		const options = {
			projectInfo: this.projectInfo,
			sourcePath: templatePath,
			targetPath: process.cwd()
		};

		// 执行模板的主入口文件
		await spawnPlus('node', [rootFile, JSON.stringify(options)]);

		this.logger.success('自定义模板安装成功');
	}

	/** 安装 normal 类型模板 */
	private async installNormal() {
		const { npmName, ignore, installCommand, startCommand } =
			this.projectInfo.projectTemplate;
		// 检查模板信息是否存在
		if (!this.templateNpmInfo) {
			throw new Error('模板信息不存在，请先下载模板！');
		}
		this.logger.info('模板信息', this.templateNpmInfo);

		// 1. 启动模板安装的进度提示
		const spinner = spinnerStart('正在安装模板...');
		await sleep(); // 模拟安装过程中的延时

		// 获取当前工作目录作为模板的目标路径
		const currentPath = process.cwd();

		try {
			// 计算模板的源路径
			const templatePath = path.resolve(
				this.templateNpmInfo.cacheFilePath,
				`template`
			);

			// 确保模板源路径和目标路径存在
			ensureDirSync(templatePath);
			ensureDirSync(currentPath);

			// 复制模板文件到当前工作目录
			copySync(templatePath, currentPath);
		} catch (error) {
			this.logger.error('模板安装失败', error);
			throw error;
		} finally {
			spinner.stop(true);
			this.logger.info('模板安装成功');
		}

		// 3. 渲染 EJS 模板
		const templateIgnore = ignore || [];
		const ignoreFiles = ['**/node_modules/**', ...templateIgnore];
		await ejsRender(this.projectInfo, { ignoreFiles });

		// 4. 安装依赖
		if (installCommand) {
			await this.execCommand(installCommand, '依赖安装失败！');
		}

		// 5. 执行启动命令
		if (startCommand) {
			setTimeout(() => {
				this.execCommand(startCommand, '启动执行命令失败！');
			}, 5000);
		}
	}

	/** 执行命令行命令 */
	private async execCommand(command: string, errMsg: string) {
		let ret: any;
		if (command) {
			const cmdArray = command.split(' ');
			const cmd = WHITE_COMMAND.includes(cmdArray[0]) ? cmdArray[0] : null;
			if (!cmd) {
				throw new Error('命令不存在！命令：' + command);
			}
			const args = cmdArray.slice(1);

			try {
				console.log('cmd', cmd);
				// 使用 await 等待 spawnPlus 执行完成
				ret = await spawnPlus(cmd, args, {
					stdio: 'inherit',
					cwd: process.cwd()
				});
				console.log('ret', ret);
				// if (ret.error) {
				// 	throw ret.error;
				// }
				// if (ret.status !== 0) {
				// 	throw new Error(`${errMsg}: ${ret.stderr?.toString()}`);
				// }
			} catch (error: any) {
				// 捕获命令执行中的异常，并抛出错误信息
				throw new Error(`${errMsg}：${error.message}`);
			}
		}
		return ret;
	}
}

export default TemplateInstaller;

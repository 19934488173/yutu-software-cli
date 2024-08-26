import path from 'path';
import userHome from 'user-home';
import createLogger from '@yutu-software-cli/debug-log';
import templateInstaller from '@yutu-software-cli/template-installer';
import PackageHandler from '@yutu-software-cli/package-handler';
import { sleep, spinnerStart } from '@yutu-software-cli/share-utils';
import fse from 'fs-extra';

import { getTemplate, getTemplateName } from './templateService';
import { ADD_MODE_SECTION, TEMPLATE_LIST } from './dataSource';

class InstallService {
	// 日志记录器
	private logger: ReturnType<typeof createLogger>;
	private templateName: string;
	private addModule: string;
	private targetPath: string = '';
	private dir: string;
	private templateInfo: any;
	private templateNpmInfo: InstanceType<typeof PackageHandler> | undefined;

	constructor(
		logger: ReturnType<typeof createLogger>,
		addModule: string,
		templateName: string
	) {
		//1,获取安装文件夹路径
		this.dir = process.cwd();
		this.logger = logger;
		this.addModule = addModule;
		this.templateName = templateName;
	}

	// 安装页面模块
	async installModule() {
		// 2,选择代码模版,拿到安装信息
		this.templateInfo = await this.getTemplateInfo();
		this.logger.info('模版信息：', this.templateInfo);
		// 3,检查安装环境，先生成拷贝路径
		this.targetPath = path.resolve(
			this.dir,
			`${this.addModule === ADD_MODE_SECTION ? 'components' : ''}`,
			this.templateInfo.templateName
		);
		console.log('拷贝路径：', this.targetPath);
		// 4,下载模版
		await this.downloadTemplate();
		// 5,安装模版
		await this.installTemplate();
	}

	/** 获取模版详细信息 */
	async getTemplateInfo() {
		const npmName = await getTemplate(this.addModule);
		let template: any;
		template = TEMPLATE_LIST.find((item) => item.value === npmName);

		if (!template) {
			return this.logger.error(`${npmName}模版不存在`);
		}
		// 用户输入模版名称
		const templateName = await getTemplateName(this.templateName);
		template.templateName = templateName;
		return template;
	}

	/** 下载模版 */
	async downloadTemplate() {
		// 设置模板存储路径和 node_modules 目录路径
		const targetPath = path.resolve(
			userHome,
			process.env.CLI_HOME_PATH ?? '',
			'template'
		);
		const storeDir = path.resolve(targetPath, 'node_modules');
		// 从模板信息中解构获取 npm 包名和版本号
		const { value: packageName, version: packageVersion } = this.templateInfo;
		// 执行下载命令
		this.templateNpmInfo = await templateInstaller({
			packageName,
			packageVersion,
			storeDir,
			targetPath,
			logger: this.logger
		});
	}

	/** 安装模版 */
	async installTemplate() {
		// 1. 启动模板安装的进度提示
		const spinner = spinnerStart('正在安装模板...');
		await sleep();
		// 获取当前工作目录作为模板的目标路径
		const currentPath = process.cwd();
		try {
			// 计算模板的源路径
			const templatePath = path.resolve(
				this.templateNpmInfo!.cacheFilePath,
				`template/sections`
			);
			// 复制模板文件到当前工作目录
			fse.copySync(templatePath, currentPath);
		} catch (error) {
			this.logger.error('模板安装失败', error);
			throw error;
		} finally {
			spinner.stop(true);
			this.logger.info('模板安装成功');
		}
	}
}

export default InstallService;

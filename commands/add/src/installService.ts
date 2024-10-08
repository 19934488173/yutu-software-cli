import path from 'path';
import userHome from 'user-home';
import templateInstaller from '@yutu-software-cli/template-installer';
import PackageHandler from '@yutu-software-cli/package-handler';
import {
	sleep,
	spinnerStart,
	catchError
} from '@yutu-software-cli/share-utils';
import createLogger from '@yutu-software-cli/debug-log';
import { ejsRender, fse } from '@yutu-software-cli/ejs-render';
import { ITemplateInfo, Logger } from './types';

class InstallService {
	private logger: Logger = createLogger('@yutu-software-cli:add');
	private executeDir = ''; // 执行目录
	private targetPath = ''; // 拷贝目标路径
	private templatePath = ''; // 模板路径
	private componentPath = [] as string[]; // 组件路径
	private componentTargetPath = [] as string[]; // 组件路径
	private templateInfo: ITemplateInfo;
	private templateNpmInfo: InstanceType<typeof PackageHandler> | null = null;

	constructor(templateInfo: ITemplateInfo) {
		this.executeDir = process.cwd();
		this.templateInfo = templateInfo;
	}

	async installModule() {
		try {
			// 1，下载模板
			await this.downloadTemplate();
			// 2，设置路径
			await this.setPath();
			// 3，安装模板
			await this.installTemplate();
		} catch (error) {
			catchError({ msg: '模块安装失败:', error });
		}
	}

	/** 设置拷贝目标路径 */
	private setPath() {
		if (!this.templateNpmInfo) {
			throw new Error('模板信息未下载，请先下载模板');
		}
		const { copyPath, sourcePath, sourceCodePath } = this.templateInfo;
		//组件源码路径存在，计算出要拷贝的组件路径
		if (sourceCodePath && sourceCodePath?.length > 0) {
			this.componentPath = sourceCodePath.map(
				(path) => `${this.templateNpmInfo?.cacheFilePath}${path}`
			);
			this.componentTargetPath = sourceCodePath.map(
				(path) => `${this.executeDir}${path}`
			);
		}
		this.targetPath = path.resolve(this.executeDir, copyPath);
		this.templatePath = path.resolve(
			this.templateNpmInfo.cacheFilePath,
			sourcePath
		);
		this.logger.info(`模版路径: ${this.templatePath}`);
		this.logger.info(`拷贝路径: ${this.targetPath}`);
	}

	/** 下载模板 */
	private async downloadTemplate() {
		const targetPath = path.resolve(
			userHome,
			process.env.CLI_HOME_PATH ?? '',
			'template'
		);
		const storeDir = path.resolve(targetPath, 'node_modules');
		const { npmName: packageName, version: packageVersion } = this.templateInfo;
		try {
			this.templateNpmInfo = await templateInstaller({
				packageName,
				packageVersion,
				storeDir,
				targetPath,
				logger: this.logger
			});
			this.logger.info(`模板下载成功: ${packageName}@${packageVersion}`);
		} catch (error) {
			catchError({ msg: '模板下载失败:', error });
		}
	}

	/** 安装模板 */
	private async installTemplate() {
		const spinner = spinnerStart('正在安装模板...');
		await sleep();
		try {
			// 安装相关组件逻辑
			if (this.componentPath?.length > 0) {
				for (let i = 0; i < this.componentPath.length; i++) {
					const componentPath = this.componentPath[i];
					const componentTargetPath = this.componentTargetPath[i];
					if (!fse.pathExistsSync(componentTargetPath)) {
						fse.copySync(componentPath, componentTargetPath);
					}
				}
			}

			// 如果目标路径不存在，则创建
			// 确保模板源路径和目标路径存在
			fse.ensureDirSync(this.templatePath);
			fse.ensureDirSync(this.targetPath);

			// 复制模板到目标目录
			fse.copySync(this.templatePath, this.targetPath);
			//ejs渲染
			const ignoreFiles = this.templateInfo.ignore || [];
			await ejsRender({
				data: this.templateInfo,
				options: { ignoreFiles, ejsDir: this.targetPath }
			});
			process.stdout.write('\x1B[2K\r'); // 清空控制台
			console.log('模板安装成功');
		} catch (error) {
			catchError({ msg: '模板安装失败:', error, spinner });
		} finally {
			spinner.stop(true);
		}
	}
}

export default InstallService;

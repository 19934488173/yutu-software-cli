import path from 'path';
import userHome from 'user-home';
import { sleep, spawnPlus, spinnerStart } from '@amber-yutu-cli/share-utils';
import PackageHandler from '@amber-yutu-cli/package-handler';
import createLogger from '@amber-yutu-cli/debug-log';
import {
	IProjectInfo,
	IProjectTemplate,
	TEMPLATE_TYPE_CUSTOM,
	TEMPLATE_TYPE_NORMAL
} from './types';
import { copySync, ensureDirSync, existsSync } from './fsUtils';

// 存储
let templateNpmInfo: PackageHandler;

/** 下载或更新项目模板 */
export const downloadTemplate = async (
	templateInfo: IProjectTemplate,
	logger: ReturnType<typeof createLogger>
) => {
	// 设置模板存储路径和 node_modules 目录路径
	const targetPath = path.resolve(userHome, '.amber-yutu-cli', 'template');
	const storeDir = path.resolve(
		userHome,
		'.amber-yutu-cli',
		'template',
		'node_modules'
	);

	// 从模板信息中解构获取 npm 包名和版本号
	const { npmName, version } = templateInfo;

	// 创建 PackageHandler 实例，用于处理模板的安装和更新
	const templateNpm = new PackageHandler({
		targetPath,
		storeDir,
		packageName: npmName,
		packageVersion: version
	});

	// 判断模板是否已存在
	const templateExists = await templateNpm.exists();
	const spinnerMessage = templateExists ? '正在更新模板...' : '正在下载模板...';

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
			logger.info(templateExists ? '更新模板成功！' : '下载模板成功！');
			templateNpmInfo = templateNpm; // 保存模板信息
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
};

/** 安装模版 */
export const installTemplate = async (
	templateInfo: IProjectTemplate,
	projectInfo: IProjectInfo,
	logger: ReturnType<typeof createLogger>
) => {
	try {
		// 1. 如果模板类型不存在，默认设置为 'normal'
		templateInfo.type = templateInfo.type || TEMPLATE_TYPE_NORMAL;

		// 2. 根据模板类型选择安装方式
		switch (templateInfo.type) {
			case TEMPLATE_TYPE_NORMAL:
				// 普通模板安装流程
				await installNormalTemplate(templateInfo, logger);
				break;

			case TEMPLATE_TYPE_CUSTOM:
				// 自定义模板安装流程
				await installCustomTemplate(templateInfo, projectInfo, logger);
				break;

			default:
				// 未知的模板类型，抛出错误
				throw new Error(`无法识别的项目模板类型: ${templateInfo.type}`);
		}
	} catch (error: any) {
		// 错误处理
		logger.error(`模板安装失败: ${error.message}`);
		throw error;
	}
};

/** normal模版安装 */
export const installNormalTemplate = async (
	templateInfo: IProjectTemplate,
	logger: ReturnType<typeof createLogger>
) => {
	if (!templateNpmInfo) {
		throw new Error('模板信息不存在，请先下载模板！');
	}
	logger.info('模板信息', templateNpmInfo);

	// 启动加载动画，提示用户正在安装模板
	const spinner = spinnerStart('正在安装模板...');
	await sleep(); // 模拟安装过程中的延时

	// 获取当前工作目录作为模板的目标路径
	const targetPath = process.cwd();

	try {
		// 计算模板的源路径
		const templatePath = path.resolve(
			templateNpmInfo?.cacheFilePath,
			`node_modules/${templateInfo.npmName}/template`
		);

		// 确保模板源路径和目标路径存在
		ensureDirSync(templatePath);
		ensureDirSync(targetPath);

		// 复制模板文件到当前工作目录
		copySync(templatePath, targetPath);
	} catch (error) {
		logger.error('模板安装失败', error);
		throw error;
	} finally {
		spinner.stop(true);
		logger.info('模板安装成功');
	}
};

/** custom模版安装 */
export const installCustomTemplate = async (
	templateInfo: IProjectTemplate,
	projectInfo: IProjectInfo,
	logger: ReturnType<typeof createLogger>
) => {
	// 解构 templateNpmInfo 以获取需要的属性
	const { exists, getRootFilePath, cacheFilePath } = templateNpmInfo;

	// 检查模板信息是否存在，若不存在则提前返回
	if (!(await exists())) {
		logger.warn('模板信息不存在，安装终止');
		return;
	}

	// 获取模板的主入口文件路径
	const rootFile = getRootFilePath() || '';

	// 检查主入口文件是否存在，若不存在则提前返回
	if (!existsSync(rootFile)) {
		logger.warn('模板主入口文件不存在，安装终止');
		return;
	}

	logger.info('开始执行自定义模板');

	// 构建模板路径和安装选项
	const templatePath = path.resolve(cacheFilePath, 'template');
	const options = {
		templateInfo,
		projectInfo,
		sourcePath: templatePath,
		targetPath: process.cwd()
	};

	// 执行模板的主入口文件
	await spawnPlus('node', [rootFile, JSON.stringify(options)]);

	logger.success('自定义模板安装成功');
};

import PackageHandler from '@yutu-software-cli/package-handler';
import createLogger from '@yutu-software-cli/debug-log';
import {
	sleep,
	spinnerStart,
	shouldUpdate,
	updateTimestamp
} from '@yutu-software-cli/share-utils';

const TEMPLATE_UPDATE_INTERVAL = 6 * 60 * 60 * 1000; // 72小时
const TIMESTAMP_FILE_NAME = '.lastTemplateUpdate';

//模版安装及更新逻辑
interface IOptions {
	targetPath: string;
	packageName: string;
	packageVersion: string;
	logger: ReturnType<typeof createLogger>;
	storeDir?: string;
}
const templateInstaller = async (options: IOptions) => {
	const {
		targetPath,
		packageName,
		packageVersion,
		logger,
		storeDir = ''
	} = options;
	// 创建 PackageHandler 实例，用于处理模板的安装和更新
	const template = new PackageHandler({
		targetPath,
		storeDir,
		packageName,
		packageVersion
	});

	// 判断模板是否已存在
	const templateExists = await template.exists();
	const spinnerMessage = templateExists ? '正在更新模板...' : '正在下载模板...';

	// 启动命令行加载动画
	const spinner = spinnerStart(spinnerMessage);
	await sleep(); // 模拟下载或更新的延迟

	try {
		if (templateExists) {
			// 检查是否需要更新模板
			if (
				await shouldUpdate(
					targetPath,
					TEMPLATE_UPDATE_INTERVAL,
					TIMESTAMP_FILE_NAME
				)
			) {
				await template.update();
				await updateTimestamp(targetPath, TIMESTAMP_FILE_NAME); // 更新成功后更新时间戳
			} else {
				logger.info('模板已存在且在6小时内已更新，无需再次更新。');
			}
		} else {
			// 如果模板不存在，执行安装操作
			await template.install();
			await updateTimestamp(targetPath, TIMESTAMP_FILE_NAME); // 安装后设置时间戳
		}

		// 模板下载或更新成功后的操作
		if (await template.exists()) {
			logger.info(templateExists ? '更新模板成功！' : '下载模板成功！');
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

	return template;
};

export default templateInstaller;

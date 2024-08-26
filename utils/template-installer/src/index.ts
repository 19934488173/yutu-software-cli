import PackageHandler from '@yutu-software-cli/package-handler';
import createLogger from '@yutu-software-cli/debug-log';
import { sleep, spinnerStart } from '@yutu-software-cli/share-utils';

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
			// 如果模板存在，执行更新操作
			await template.update();
		} else {
			// 如果模板不存在，执行安装操作
			await template.install();
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

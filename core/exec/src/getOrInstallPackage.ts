import path from 'path';
import { shouldUpdate, updateTimestamp } from '@yutu-software-cli/share-utils';
import PackageHandler from '@yutu-software-cli/package-handler';

import { CACHE_DIR } from './constants';
import { IGetOrInstallPackage, PackageType } from './types';

// 解析缓存路径的辅助函数
const resolveCachePath = (homePath: string, dir: string) => {
	const cachePath = path.resolve(homePath, dir);
	const storeDir = path.resolve(cachePath, 'node_modules');
	return { cachePath, storeDir };
};

const PACKAGE_UPDATE_INTERVAL = 72 * 60 * 60 * 1000; // 24小时
const TIMESTAMP_FILE_NAME = '.lastUpdate';

// 获取或安装包的函数
const getOrInstallPackage = async (options: IGetOrInstallPackage) => {
	const { targetPath, homePath, packageName, packageVersion, logger } = options;

	let pkg: PackageType;

	if (!targetPath) {
		// 解析缓存路径并生成存储目录路径
		const { cachePath, storeDir } = resolveCachePath(homePath, CACHE_DIR);

		logger.log('cachePath', cachePath);
		logger.log('storeDir', storeDir);

		// 创建包处理程序实例
		pkg = new PackageHandler({
			targetPath: cachePath,
			storeDir,
			packageName,
			packageVersion
		});

		// 检查包是否存在
		if (await pkg.exists()) {
			// 检查是否需要更新包
			if (
				await shouldUpdate(
					cachePath,
					PACKAGE_UPDATE_INTERVAL,
					TIMESTAMP_FILE_NAME
				)
			) {
				await pkg.update();
				await updateTimestamp(cachePath, TIMESTAMP_FILE_NAME); // 更新成功后更新时间戳
			}
		} else {
			// 安装包并设置时间戳
			await pkg.install();
			await updateTimestamp(cachePath, TIMESTAMP_FILE_NAME);
		}
	} else {
		// 如果指定了 targetPath，则直接使用它创建包处理程序实例
		pkg = new PackageHandler({ targetPath, packageName, packageVersion });
	}
	return pkg;
};

export default getOrInstallPackage;

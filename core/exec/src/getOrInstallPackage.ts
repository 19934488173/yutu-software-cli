import path from 'path';
import PackageHandler from '@yutu-cli/package-handler';

import { CACHE_DIR } from './constants';
import { IGetOrInstallPackage, PackageType } from './types';

// 解析缓存路径的辅助函数
const resolveCachePath = (homePath: string, dir: string) => {
	const cachePath = path.resolve(homePath, dir);
	const storeDir = path.resolve(cachePath, 'node_modules');
	return { cachePath, storeDir };
};

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
		// 如果包已经存在，则更新包，否则安装包
		if (await pkg.exists()) {
			await pkg.update();
		} else {
			await pkg.install();
		}
	} else {
		// 如果目标路径已指定，直接使用它创建包处理程序实例
		pkg = new PackageHandler({ targetPath, packageName, packageVersion });
	}
	return pkg;
};

export default getOrInstallPackage;

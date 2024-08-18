import path from 'path';
import { pathExistsSync } from 'path-exists';
import fse from 'fs-extra';

/**
 * CacheManager类用于管理package的缓存目录和文件路径。
 * 创建缓存目录，生成缓存文件路径，并检查缓存文件是否存在。
 */
class CacheManager {
	private storeDir: string;
	private packageName: string;
	private cacheFilePathPrefix: string;

	constructor(storeDir: string, packageName: string) {
		this.storeDir = storeDir;
		this.packageName = packageName;
		// 将package名称中的'/'替换为'+'，用于生成合法的文件名
		this.cacheFilePathPrefix = packageName.replace('/', '+');
	}

	/** 确保缓存目录存在， 如果缓存目录不存在，则创建该目录 */
	ensureStoreDirExists() {
		// 使用pathExistsSync检查目录是否存在
		if (!pathExistsSync(this.storeDir)) {
			// 如果目录不存在，使用mkdirpSync递归创建目录
			fse.mkdirpSync(this.storeDir);
		}
	}

	/** 生成特定版本的package缓存文件路径 */
	getCacheFilePath(packageVersion: string) {
		// 生成缓存文件的完整路径
		return path.resolve(
			this.storeDir,
			`.store/${this.cacheFilePathPrefix}@${packageVersion}/node_modules/${this.packageName}`
		);
	}

	/** 检查特定版本的缓存文件是否存在 */
	cacheExists(packageVersion: string) {
		// 获取缓存文件的完整路径
		const cacheFilePath = this.getCacheFilePath(packageVersion);
		// 使用pathExistsSync检查该路径是否存在
		return pathExistsSync(cacheFilePath);
	}
}

export default CacheManager;

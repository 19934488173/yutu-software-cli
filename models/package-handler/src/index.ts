import { packageDirectorySync } from 'pkg-dir';
import { pathExistsSync } from 'path-exists';
import path from 'path';
import {
	isObject,
	readPackageJson,
	formatPath
} from '@amber-yutu-cli/share-utils';
import { getNpmLatestVersion } from '@amber-yutu-cli/get-npm-info';
import CacheManager from './cacheManager';
import PackageInstaller from './packageInstaller';

/** Package类封装了npm包的管理逻辑，包括安装、更新、判断是否存在等功能 */
class PackageHandler {
	private targetPath: string;
	private packageName: string;
	private packageVersion: string;
	private storeDir?: string;
	private cacheManager?: CacheManager;

	constructor(options: InstallOptions) {
		if (!options) {
			throw new Error('Package类的options参数不能为空！');
		}
		if (!isObject(options)) {
			throw new Error('Package类的options参数必须为对象！');
		}
		this.targetPath = options.targetPath;
		this.storeDir = options.storeDir;
		this.packageName = options.packageName;
		this.packageVersion = options.packageVersion;

		// 如果存在storeDir，初始化CacheManager
		if (this.storeDir) {
			this.cacheManager = new CacheManager(this.storeDir, this.packageName);
			this.cacheManager.ensureStoreDirExists(); // 确保缓存目录存在
		}
	}

	// 生成当前版本文件路径供外面调用
	get cacheFilePath() {
		if (!this.cacheManager) return '';
		return this.cacheManager.getCacheFilePath(this.packageVersion);
	}

	/** 准备工作：如果packageVersion是'latest'，获取最新的npm版本号 */
	private async prepare() {
		if (this.packageVersion === 'latest') {
			this.packageVersion = (await getNpmLatestVersion(this.packageName)) ?? '';
		}
	}

	/**
	 * 判断当前包是否存在。
	 * 如果使用缓存管理器，则检查缓存中是否存在指定版本的包。
	 * 否则，检查目标路径下的包是否存在。
	 */
	async exists() {
		await this.prepare();
		if (this.cacheManager) {
			return this.cacheManager.cacheExists(this.packageVersion);
		} else {
			return pathExistsSync(this.targetPath);
		}
	}

	/** 安装当前包 */
	async install() {
		await this.prepare();
		await PackageInstaller.installPackage({
			targetPath: this.targetPath,
			storeDir: this.storeDir,
			packageName: this.packageName,
			packageVersion: this.packageVersion
		});
	}

	/** 更新当前包至最新版本 */
	async update() {
		await this.prepare();
		const latestPackageVersion =
			(await getNpmLatestVersion(this.packageName)) ?? '';
		if (
			this.cacheManager &&
			!this.cacheManager.cacheExists(latestPackageVersion)
		) {
			await PackageInstaller.installPackage({
				targetPath: this.targetPath,
				storeDir: this.storeDir,
				packageName: this.packageName,
				packageVersion: latestPackageVersion
			});
		}
		// 更新packageVersion为最新版本
		this.packageVersion = latestPackageVersion;
	}

	/**
	 * 获取包的入口文件路径。
	 * 该方法通过查找package.json中的main字段来确定入口文件路径。
	 */
	getRootFilePath() {
		const _getRootFile = (targetPath: string) => {
			// 获取package.json所在目录
			const dir = packageDirectorySync({ cwd: targetPath });
			if (dir) {
				const pkgFile: any = readPackageJson(dir);
				if (pkgFile && pkgFile.main) {
					// 返回入口文件的路径
					return formatPath(path.resolve(dir, pkgFile.main));
				}
			}
			return null;
		};

		// 如果使用缓存管理器，则获取缓存路径下的入口文件
		if (this.cacheManager) {
			return _getRootFile(
				this.cacheManager.getCacheFilePath(this.packageVersion)
			);
		} else {
			// 否则，获取目标路径下的入口文件
			return _getRootFile(this.targetPath);
		}
	}
}

export default PackageHandler;

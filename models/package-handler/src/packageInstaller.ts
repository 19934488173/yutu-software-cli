import npminstall from 'npminstall';
import { getDefaultRegistry } from '@amber-yutu-cli/get-npm-info';

/**
 * PackageInstaller类负责处理package的安装逻辑。
 * 通过封装npminstall库，简化package的安装过程。
 */
class PackageInstaller {
	static async installPackage(options: InstallOptions) {
		const { targetPath, storeDir, packageName, packageVersion } = options;

		// 调用npminstall方法安装package
		return npminstall({
			root: targetPath,
			storeDir: storeDir,
			registry: getDefaultRegistry(),
			pkgs: [
				{
					name: packageName,
					version: packageVersion
				}
			]
		});
	}
}

export default PackageInstaller;

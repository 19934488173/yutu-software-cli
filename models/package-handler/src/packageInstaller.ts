import npminstall from 'npminstall';
import { getDefaultRegistry } from '@yutu-software-cli/get-npm-info';

interface InstallOptions {
	targetPath: string;
	storeDir?: string;
	packageName: string;
	packageVersion: string;
	registry?: string;
}

/** 通过 npminstall 库封装了安装逻辑 */
const packageInstaller = async (options: InstallOptions) => {
	const { targetPath, storeDir, packageName, packageVersion, registry } =
		options;

	// 如果没有指定 registry，默认使用 getDefaultRegistry()
	const installRegistry = registry || getDefaultRegistry();

	try {
		// 使用 npminstall 安装包
		await npminstall({
			root: targetPath,
			storeDir: storeDir,
			registry: installRegistry,
			pkgs: [
				{
					name: packageName,
					version: packageVersion
				}
			]
		});
	} catch (error) {
		console.error(`Failed to install ${packageName}@${packageVersion}:`, error);
		throw error;
	}
};

export default packageInstaller;

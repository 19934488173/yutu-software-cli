// models/package-handler/src/packageInstaller.ts
import npminstall from 'npminstall';
import { getDefaultRegistry } from '@amber-yutu-cli/get-npm-info';
var PackageInstaller = class {
	static async installPackage(options) {
		const { targetPath, storeDir, packageName, packageVersion } = options;
		return npminstall({
			root: targetPath,
			storeDir,
			registry: getDefaultRegistry(),
			pkgs: [
				{
					name: packageName,
					version: packageVersion
				}
			]
		});
	}
};
var packageInstaller_default = PackageInstaller;
export { packageInstaller_default as default };

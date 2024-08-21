// models/package-handler/src/packageInstaller.ts
import npminstall from "npminstall";
import { getDefaultRegistry } from "@yutu-software-cli/get-npm-info";
var packageInstaller = async (options) => {
  const { targetPath, storeDir, packageName, packageVersion, registry } = options;
  const installRegistry = registry || getDefaultRegistry();
  try {
    await npminstall({
      root: targetPath,
      storeDir,
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
var packageInstaller_default = packageInstaller;
export {
  packageInstaller_default as default
};

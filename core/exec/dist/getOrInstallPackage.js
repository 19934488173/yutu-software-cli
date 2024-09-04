// core/exec/src/getOrInstallPackage.ts
import path from "path";
import { shouldUpdate, updateTimestamp } from "@yutu-software-cli/share-utils";
import PackageHandler from "@yutu-software-cli/package-handler";

// core/exec/src/constants.ts
var CACHE_DIR = "dependencies";

// core/exec/src/getOrInstallPackage.ts
var resolveCachePath = (homePath, dir) => {
  const cachePath = path.resolve(homePath, dir);
  const storeDir = path.resolve(cachePath, "node_modules");
  return { cachePath, storeDir };
};
var PACKAGE_UPDATE_INTERVAL = 24 * 60 * 60 * 1e3;
var TIMESTAMP_FILE_NAME = ".lastUpdate";
var getOrInstallPackage = async (options) => {
  const { targetPath, homePath, packageName, packageVersion, logger } = options;
  let pkg;
  if (!targetPath) {
    const { cachePath, storeDir } = resolveCachePath(homePath, CACHE_DIR);
    logger.log("cachePath", cachePath);
    logger.log("storeDir", storeDir);
    pkg = new PackageHandler({
      targetPath: cachePath,
      storeDir,
      packageName,
      packageVersion
    });
    if (await pkg.exists()) {
      if (await shouldUpdate(
        cachePath,
        PACKAGE_UPDATE_INTERVAL,
        TIMESTAMP_FILE_NAME
      )) {
        await pkg.update();
        await updateTimestamp(cachePath, TIMESTAMP_FILE_NAME);
      }
    } else {
      await pkg.install();
      await updateTimestamp(cachePath, TIMESTAMP_FILE_NAME);
    }
  } else {
    pkg = new PackageHandler({ targetPath, packageName, packageVersion });
  }
  return pkg;
};
var getOrInstallPackage_default = getOrInstallPackage;
export {
  getOrInstallPackage_default as default
};

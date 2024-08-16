// models/package-handler/src/cacheManager.ts
import path from "path";

// node_modules/.pnpm/path-exists@5.0.0/node_modules/path-exists/index.js
import fs, { promises as fsPromises } from "node:fs";
function pathExistsSync(path2) {
  try {
    fs.accessSync(path2);
    return true;
  } catch {
    return false;
  }
}

// models/package-handler/src/cacheManager.ts
import fse from "fs-extra";
var CacheManager = class {
  storeDir;
  cacheFilePathPrefix;
  constructor(storeDir, packageName) {
    this.storeDir = storeDir;
    this.cacheFilePathPrefix = packageName.replace("/", "+");
  }
  /** 确保缓存目录存在， 如果缓存目录不存在，则创建该目录 */
  ensureStoreDirExists() {
    if (!pathExistsSync(this.storeDir)) {
      fse.mkdirpSync(this.storeDir);
    }
  }
  /** 生成特定版本的package缓存文件路径 */
  getCacheFilePath(packageVersion) {
    return path.resolve(
      this.storeDir,
      `.store/${this.cacheFilePathPrefix}@${packageVersion}`
    );
  }
  /** 检查特定版本的缓存文件是否存在 */
  cacheExists(packageVersion) {
    const cacheFilePath = this.getCacheFilePath(packageVersion);
    return pathExistsSync(cacheFilePath);
  }
};
var cacheManager_default = CacheManager;
export {
  cacheManager_default as default
};

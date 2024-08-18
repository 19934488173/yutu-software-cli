// models/package-handler/src/index.ts
import { packageDirectorySync } from "pkg-dir";

// node_modules/.pnpm/path-exists@5.0.0/node_modules/path-exists/index.js
import fs, { promises as fsPromises } from "node:fs";
function pathExistsSync(path3) {
  try {
    fs.accessSync(path3);
    return true;
  } catch {
    return false;
  }
}

// models/package-handler/src/index.ts
import path2 from "path";
import { isObject, readPackageJson, formatPath } from "@yutu-cli/share-utils";
import { getNpmLatestVersion } from "@yutu-cli/get-npm-info";

// models/package-handler/src/cacheManager.ts
import path from "path";
import fse from "fs-extra";
var CacheManager = class {
  storeDir;
  packageName;
  cacheFilePathPrefix;
  constructor(storeDir, packageName) {
    this.storeDir = storeDir;
    this.packageName = packageName;
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
      `.store/${this.cacheFilePathPrefix}@${packageVersion}/node_modules/${this.packageName}`
    );
  }
  /** 检查特定版本的缓存文件是否存在 */
  cacheExists(packageVersion) {
    const cacheFilePath = this.getCacheFilePath(packageVersion);
    return pathExistsSync(cacheFilePath);
  }
};
var cacheManager_default = CacheManager;

// models/package-handler/src/packageInstaller.ts
import npminstall from "npminstall";
import { getDefaultRegistry } from "@yutu-cli/get-npm-info";
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

// models/package-handler/src/index.ts
var PackageHandler = class {
  targetPath;
  packageName;
  packageVersion;
  storeDir;
  cacheManager;
  constructor(options) {
    if (!options) {
      throw new Error("Package\u7C7B\u7684options\u53C2\u6570\u4E0D\u80FD\u4E3A\u7A7A\uFF01");
    }
    if (!isObject(options)) {
      throw new Error("Package\u7C7B\u7684options\u53C2\u6570\u5FC5\u987B\u4E3A\u5BF9\u8C61\uFF01");
    }
    this.targetPath = options.targetPath;
    this.storeDir = options.storeDir;
    this.packageName = options.packageName;
    this.packageVersion = options.packageVersion;
    if (this.storeDir) {
      this.cacheManager = new cacheManager_default(this.storeDir, this.packageName);
      this.cacheManager.ensureStoreDirExists();
    }
  }
  // 生成当前版本文件路径供外面调用
  get cacheFilePath() {
    if (!this.cacheManager) return "";
    return this.cacheManager.getCacheFilePath(this.packageVersion);
  }
  /** 准备工作：如果packageVersion是'latest'，获取最新的npm版本号 */
  async prepare() {
    if (this.packageVersion === "latest") {
      this.packageVersion = await getNpmLatestVersion(this.packageName) ?? "";
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
    await packageInstaller_default.installPackage({
      targetPath: this.targetPath,
      storeDir: this.storeDir,
      packageName: this.packageName,
      packageVersion: this.packageVersion
    });
  }
  /** 更新当前包至最新版本 */
  async update() {
    await this.prepare();
    const latestPackageVersion = await getNpmLatestVersion(this.packageName) ?? "";
    if (this.cacheManager && !this.cacheManager.cacheExists(latestPackageVersion)) {
      await packageInstaller_default.installPackage({
        targetPath: this.targetPath,
        storeDir: this.storeDir,
        packageName: this.packageName,
        packageVersion: latestPackageVersion
      });
    }
    this.packageVersion = latestPackageVersion;
  }
  /**
   * 获取包的入口文件路径。
   * 该方法通过查找package.json中的main字段来确定入口文件路径。
   */
  getRootFilePath() {
    const _getRootFile = (targetPath) => {
      const dir = packageDirectorySync({ cwd: targetPath });
      if (dir) {
        const pkgFile = readPackageJson(dir);
        if (pkgFile && pkgFile.main) {
          return formatPath(path2.resolve(dir, pkgFile.main));
        }
      }
      return null;
    };
    if (this.cacheManager) {
      return _getRootFile(
        this.cacheManager.getCacheFilePath(this.packageVersion)
      );
    } else {
      return _getRootFile(this.targetPath);
    }
  }
};
var src_default = PackageHandler;
export {
  src_default as default
};

// commands/add/src/installService.ts
import path from "path";
import userHome from "user-home";
import templateInstaller from "@yutu-software-cli/template-installer";
import {
  sleep,
  spinnerStart,
  catchError
} from "@yutu-software-cli/share-utils";
import createLogger from "@yutu-software-cli/debug-log";
import { ejsRender, fse } from "@yutu-software-cli/ejs-render";
var InstallService = class {
  logger = createLogger("@yutu-software-cli:add");
  executeDir = "";
  // 执行目录
  targetPath = "";
  // 拷贝目标路径
  templatePath = "";
  // 模板路径
  componentPath = [];
  // 组件路径
  componentTargetPath = [];
  // 组件路径
  templateInfo;
  templateNpmInfo = null;
  constructor(templateInfo) {
    this.executeDir = process.cwd();
    this.templateInfo = templateInfo;
  }
  async installModule() {
    try {
      await this.downloadTemplate();
      await this.setPath();
      await this.installTemplate();
    } catch (error) {
      catchError({ msg: "\u6A21\u5757\u5B89\u88C5\u5931\u8D25:", error });
    }
  }
  /** 设置拷贝目标路径 */
  setPath() {
    if (!this.templateNpmInfo) {
      throw new Error("\u6A21\u677F\u4FE1\u606F\u672A\u4E0B\u8F7D\uFF0C\u8BF7\u5148\u4E0B\u8F7D\u6A21\u677F");
    }
    const { copyPath, sourcePath, sourceCodePath } = this.templateInfo;
    if (sourceCodePath && sourceCodePath?.length > 0) {
      this.componentPath = sourceCodePath.map(
        (path2) => `${this.templateNpmInfo?.cacheFilePath}${path2}`
      );
      this.componentTargetPath = sourceCodePath.map(
        (path2) => `${this.executeDir}${path2}`
      );
    }
    this.targetPath = path.resolve(this.executeDir, copyPath);
    this.templatePath = path.resolve(
      this.templateNpmInfo.cacheFilePath,
      sourcePath
    );
    this.logger.info(`\u6A21\u7248\u8DEF\u5F84: ${this.templatePath}`);
    this.logger.info(`\u62F7\u8D1D\u8DEF\u5F84: ${this.targetPath}`);
  }
  /** 下载模板 */
  async downloadTemplate() {
    const targetPath = path.resolve(
      userHome,
      process.env.CLI_HOME_PATH ?? "",
      "template"
    );
    const storeDir = path.resolve(targetPath, "node_modules");
    const { npmName: packageName, version: packageVersion } = this.templateInfo;
    try {
      this.templateNpmInfo = await templateInstaller({
        packageName,
        packageVersion,
        storeDir,
        targetPath,
        logger: this.logger
      });
      this.logger.info(`\u6A21\u677F\u4E0B\u8F7D\u6210\u529F: ${packageName}@${packageVersion}`);
    } catch (error) {
      catchError({ msg: "\u6A21\u677F\u4E0B\u8F7D\u5931\u8D25:", error });
    }
  }
  /** 安装模板 */
  async installTemplate() {
    const spinner = spinnerStart("\u6B63\u5728\u5B89\u88C5\u6A21\u677F...");
    await sleep();
    try {
      if (this.componentPath?.length > 0) {
        for (let i = 0; i < this.componentPath.length; i++) {
          const componentPath = this.componentPath[i];
          const componentTargetPath = this.componentTargetPath[i];
          if (!fse.pathExistsSync(componentTargetPath)) {
            fse.copySync(componentPath, componentTargetPath);
          }
        }
      }
      fse.ensureDirSync(this.templatePath);
      fse.ensureDirSync(this.targetPath);
      fse.copySync(this.templatePath, this.targetPath);
      const ignoreFiles = this.templateInfo.ignore || [];
      await ejsRender({
        data: this.templateInfo,
        options: { ignoreFiles, ejsDir: this.targetPath }
      });
      process.stdout.write("\x1B[2K\r");
      console.log("\u6A21\u677F\u5B89\u88C5\u6210\u529F");
    } catch (error) {
      catchError({ msg: "\u6A21\u677F\u5B89\u88C5\u5931\u8D25:", error, spinner });
    } finally {
      spinner.stop(true);
    }
  }
};
var installService_default = InstallService;
export {
  installService_default as default
};

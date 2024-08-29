// commands/init/src/installService.ts
import path from "path";
import userHome from "user-home";
import {
  sleep,
  spawnPlus,
  spinnerStart,
  catchError
} from "@yutu-software-cli/share-utils";
import templateInstaller from "@yutu-software-cli/template-installer";
import createLogger from "@yutu-software-cli/debug-log";
import { ejsRender, fse } from "@yutu-software-cli/ejs-render";

// commands/init/src/types.ts
var WHITE_COMMAND = ["npm", "cnpm", "pnpm", "yarn"];

// commands/init/src/installService.ts
var InstallService = class {
  logger = createLogger("@yutu-software-cli:init");
  projectNpmInfo;
  projectInfo;
  constructor(projectInfo) {
    this.projectInfo = projectInfo;
  }
  async installModule() {
    try {
      await this.downloadProject();
      await this.installProject();
    } catch (error) {
      catchError({ msg: "\u9879\u76EE\u5B89\u88C5\u5931\u8D25:", error });
    }
  }
  /** 下载或更新项目模板 */
  async downloadProject() {
    const targetPath = path.resolve(
      userHome,
      process.env.CLI_HOME_PATH ?? "",
      "template"
    );
    const storeDir = path.resolve(targetPath, "node_modules");
    const { npmName, version } = this.projectInfo;
    try {
      this.projectNpmInfo = await templateInstaller({
        packageName: npmName,
        packageVersion: version,
        storeDir,
        targetPath,
        logger: this.logger
      });
      this.logger.info(`\u9879\u76EE\u6A21\u677F\u4E0B\u8F7D\u6210\u529F: ${npmName}@${version}`);
    } catch (error) {
      catchError({ msg: "\u9879\u76EE\u6A21\u677F\u4E0B\u8F7D\u5931\u8D25:", error });
    }
  }
  /** 安装 normal 类型模板 */
  async installProject() {
    const { ignore, installCommand, startCommand } = this.projectInfo;
    if (!this.projectNpmInfo) {
      throw new Error("\u9879\u76EE\u4FE1\u606F\u4E0D\u5B58\u5728\uFF0C\u8BF7\u5148\u4E0B\u8F7D\u6A21\u677F\uFF01");
    }
    this.logger.info("\u9879\u76EE\u4FE1\u606F", this.projectNpmInfo);
    const spinner = spinnerStart("\u6B63\u5728\u5B89\u88C5\u6A21\u677F...");
    await sleep();
    const currentPath = process.cwd();
    try {
      const templatePath = path.resolve(
        this.projectNpmInfo.cacheFilePath,
        `template`
      );
      fse.ensureDirSync(templatePath);
      fse.ensureDirSync(currentPath);
      fse.copySync(templatePath, currentPath);
    } catch (error) {
      this.logger.error("\u9879\u76EE\u5B89\u88C5\u5931\u8D25", error);
      throw error;
    } finally {
      spinner.stop(true);
      this.logger.info("\u9879\u76EE\u5B89\u88C5\u6210\u529F");
    }
    const templateIgnore = ignore || [];
    const ignoreFiles = ["**/node_modules/**", ...templateIgnore];
    await ejsRender({
      data: this.projectInfo,
      options: { ignoreFiles }
    });
    if (installCommand) {
      await this.execCommand(installCommand, "\u4F9D\u8D56\u5B89\u88C5\u5931\u8D25\uFF01");
    }
    if (startCommand) {
      await this.execCommand(startCommand, "\u542F\u52A8\u6267\u884C\u547D\u4EE4\u5931\u8D25\uFF01");
    }
  }
  /** 执行命令行命令 */
  async execCommand(command, errMsg) {
    if (!command) return;
    const cmdArray = command.split(" ");
    const cmd = WHITE_COMMAND.includes(cmdArray[0]) ? cmdArray[0] : null;
    if (!cmd) {
      throw new Error("\u547D\u4EE4\u4E0D\u5B58\u5728\uFF01\u547D\u4EE4\uFF1A" + command);
    }
    const args = cmdArray.slice(1);
    return new Promise((resolve, reject) => {
      const child = spawnPlus(cmd, args, {
        stdio: "inherit",
        cwd: process.cwd()
      });
      child.on("error", (err) => {
        console.error(`\u5B50\u8FDB\u7A0B\u9519\u8BEF: ${err}`);
        reject(new Error(errMsg));
      });
      child.on("close", (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`${errMsg} \u9000\u51FA\u7801: ${code}`));
        }
      });
    });
  }
};
var installService_default = InstallService;
export {
  installService_default as default
};

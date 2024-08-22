// commands/init/src/templateInstaller.ts
import path2 from "path";
import userHome from "user-home";
import { sleep, spawnPlus, spinnerStart } from "@yutu-software-cli/share-utils";
import PackageHandler from "@yutu-software-cli/package-handler";

// commands/init/src/fsUtils.ts
import pkg from "fs-extra";
var { emptyDirSync, ensureDirSync, copySync, existsSync } = pkg;

// commands/init/src/ejsRender.ts
import path from "path";
import ejs from "ejs";
import fse from "fs-extra";
import { glob } from "glob";
import pLimit from "p-limit";
var limit = pLimit(10);
var ejsRender = async (projectInfo, options = {}) => {
  try {
    const dir = process.cwd();
    const files = await glob("**", {
      cwd: dir,
      ignore: options?.ignoreFiles,
      nodir: true
    });
    await Promise.all(
      files.map(
        (file) => limit(async () => {
          const filePath = path.join(dir, file);
          const result = await ejs.renderFile(filePath, projectInfo, {});
          fse.writeFileSync(filePath, result);
        })
      )
    );
  } catch (err) {
    throw new Error(`EJS \u6E32\u67D3\u5931\u8D25: ${err.message}`);
  }
};
var ejsRender_default = ejsRender;

// commands/init/src/types.ts
var TEMPLATE_TYPE_NORMAL = "normal";
var TEMPLATE_TYPE_CUSTOM = "custom";
var WHITE_COMMAND = ["npm", "cnpm", "pnpm", "yarn"];

// commands/init/src/templateInstaller.ts
var TemplateInstaller = class {
  // 存储模板的PackageHandler实例
  templateNpmInfo;
  // 模版类型
  projectInfo;
  // 日志记录器
  logger;
  constructor(projectInfo, logger) {
    this.logger = logger;
    this.projectInfo = projectInfo;
  }
  /** 下载或更新项目模板 */
  async download() {
    const targetPath = path2.resolve(userHome, ".yutu-software-cli", "template");
    const storeDir = path2.resolve(
      userHome,
      ".yutu-software-cli",
      "template",
      "node_modules"
    );
    const { npmName, version } = this.projectInfo.projectTemplate;
    const templateNpm = new PackageHandler({
      targetPath,
      storeDir,
      packageName: npmName,
      packageVersion: version
    });
    const templateExists = await templateNpm.exists();
    const spinnerMessage = templateExists ? "\u6B63\u5728\u66F4\u65B0\u6A21\u677F..." : "\u6B63\u5728\u4E0B\u8F7D\u6A21\u677F...";
    const spinner = spinnerStart(spinnerMessage);
    await sleep();
    try {
      if (templateExists) {
        await templateNpm.update();
      } else {
        await templateNpm.install();
      }
      if (await templateNpm.exists()) {
        this.logger.info(templateExists ? "\u66F4\u65B0\u6A21\u677F\u6210\u529F\uFF01" : "\u4E0B\u8F7D\u6A21\u677F\u6210\u529F\uFF01");
        this.templateNpmInfo = templateNpm;
      }
    } catch (error) {
      throw new Error(
        `\u6A21\u677F${templateExists ? "\u66F4\u65B0" : "\u4E0B\u8F7D"}\u5931\u8D25: ${error.message}`
      );
    } finally {
      spinner.stop(true);
    }
  }
  /** 安装项目模板 */
  async install() {
    try {
      const { type } = this.projectInfo.projectTemplate;
      this.projectInfo.projectTemplate.type = type || TEMPLATE_TYPE_NORMAL;
      switch (type) {
        case TEMPLATE_TYPE_NORMAL:
          await this.installNormal();
          break;
        case TEMPLATE_TYPE_CUSTOM:
          await this.installCustom();
          break;
        default:
          throw new Error(`\u65E0\u6CD5\u8BC6\u522B\u7684\u9879\u76EE\u6A21\u677F\u7C7B\u578B: ${type}`);
      }
    } catch (error) {
      this.logger.error(`\u6A21\u677F\u5B89\u88C5\u5931\u8D25: ${error.message}`);
      throw error;
    }
  }
  /** 安装 custom 类型模板 */
  async installCustom() {
    const { exists, getRootFilePath, cacheFilePath } = this.templateNpmInfo;
    if (!await exists()) {
      this.logger.warn("\u6A21\u677F\u4FE1\u606F\u4E0D\u5B58\u5728\uFF0C\u5B89\u88C5\u7EC8\u6B62");
      return;
    }
    const rootFile = getRootFilePath() || "";
    if (!existsSync(rootFile)) {
      this.logger.warn("\u6A21\u677F\u4E3B\u5165\u53E3\u6587\u4EF6\u4E0D\u5B58\u5728\uFF0C\u5B89\u88C5\u7EC8\u6B62");
      return;
    }
    this.logger.info("\u5F00\u59CB\u6267\u884C\u81EA\u5B9A\u4E49\u6A21\u677F");
    const templatePath = path2.resolve(cacheFilePath, "template");
    const options = {
      projectInfo: this.projectInfo,
      sourcePath: templatePath,
      targetPath: process.cwd()
    };
    await spawnPlus("node", [rootFile, JSON.stringify(options)]);
    this.logger.success("\u81EA\u5B9A\u4E49\u6A21\u677F\u5B89\u88C5\u6210\u529F");
  }
  /** 安装 normal 类型模板 */
  async installNormal() {
    const { npmName, ignore, installCommand, startCommand } = this.projectInfo.projectTemplate;
    if (!this.templateNpmInfo) {
      throw new Error("\u6A21\u677F\u4FE1\u606F\u4E0D\u5B58\u5728\uFF0C\u8BF7\u5148\u4E0B\u8F7D\u6A21\u677F\uFF01");
    }
    this.logger.info("\u6A21\u677F\u4FE1\u606F", this.templateNpmInfo);
    const spinner = spinnerStart("\u6B63\u5728\u5B89\u88C5\u6A21\u677F...");
    await sleep();
    const currentPath = process.cwd();
    try {
      const templatePath = path2.resolve(
        this.templateNpmInfo.cacheFilePath,
        `template`
      );
      ensureDirSync(templatePath);
      ensureDirSync(currentPath);
      copySync(templatePath, currentPath);
    } catch (error) {
      this.logger.error("\u6A21\u677F\u5B89\u88C5\u5931\u8D25", error);
      throw error;
    } finally {
      spinner.stop(true);
      this.logger.info("\u6A21\u677F\u5B89\u88C5\u6210\u529F");
    }
    const templateIgnore = ignore || [];
    const ignoreFiles = ["**/node_modules/**", ...templateIgnore];
    await ejsRender_default(this.projectInfo, { ignoreFiles });
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
var templateInstaller_default = TemplateInstaller;
export {
  templateInstaller_default as default
};

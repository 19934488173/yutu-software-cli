// commands/init/src/initCommand.ts
import CommandHandler from "@yutu-software-cli/command-handler";
import createLogger2 from "@yutu-software-cli/debug-log";
import { catchError as catchError3 } from "@yutu-software-cli/share-utils";

// commands/init/src/prepareStage.ts
import {
  confirm,
  safeSelectPrompt,
  input
} from "@yutu-software-cli/inquirer-prompts";
import { catchError } from "@yutu-software-cli/share-utils";
import { fse } from "@yutu-software-cli/ejs-render";

// commands/init/src/utils.ts
import semver from "semver";
import fs from "fs";

// commands/init/src/dataSource.ts
var PROJECT_LIST = [
  {
    name: "React\u9879\u76EE\u6A21\u677F",
    value: " react",
    version: "1.0.2",
    npmName: "yutu-software-template-react",
    type: "normal",
    installCommand: "pnpm install",
    startCommand: "pnpm run dev"
  }
];

// commands/init/src/utils.ts
function isDirEmpty(localPath) {
  let fileList = fs.readdirSync(localPath);
  fileList = fileList.filter(
    (file) => !file.startsWith(".") && !["node_modules"].includes(file)
  );
  return fileList.length === 0;
}
var isValidName = (name) => {
  const namePattern = /^(@[a-zA-Z0-9-_]+\/)?[a-zA-Z]+([-][a-zA-Z][a-zA-Z0-9]*|[_][a-zA-Z][a-zA-Z0-9]*|[a-zA-Z0-9])*$/;
  return namePattern.test(name);
};
var isValidVersion = (version) => {
  return semver.valid(version) !== null;
};
var filterVersion = (version) => {
  return semver.valid(version) || version;
};
var getNamePrompt = (defaultName) => {
  return {
    message: `\u8BF7\u8F93\u5165\u9879\u76EE\u540D\u79F0\uFF08\u4F8B\u5982 my-project\uFF09\uFF1A`,
    default: defaultName,
    validate: (name) => isValidName(name) ? true : "\u8BF7\u8F93\u5165\u5408\u6CD5\u7684\u9879\u76EE\u540D\u79F0\uFF08\u5B57\u6BCD\u3001\u6570\u5B57\u3001\u4E0B\u5212\u7EBF\u548C\u77ED\u6A2A\u7EBF\u7EC4\u6210\uFF09"
  };
};
var versionPrompt = {
  message: `\u8BF7\u8F93\u5165\u9879\u76EE\u7248\u672C\u53F7\uFF08\u4F8B\u5982 1.0.0\uFF09\uFF1A`,
  default: "1.0.0",
  validate: (version) => isValidVersion(version) ? true : "\u8BF7\u8F93\u5165\u5408\u6CD5\u7684\u7248\u672C\u53F7\uFF08\u7B26\u5408 semver \u89C4\u8303\uFF09",
  filter: filterVersion
};
var projectPrompt = {
  message: "\u8BF7\u9009\u62E9\u9879\u76EE\u6A21\u677F\uFF1A",
  choices: PROJECT_LIST
};

// commands/init/src/prepareStage.ts
var prepareStage = async (options) => {
  const { projectName, force } = options;
  let projectInfo = {};
  const currentPath = process.cwd();
  if (!isDirEmpty(currentPath)) {
    if (!force) {
      const ifContinue = await confirm({
        message: "\u5F53\u524D\u6587\u4EF6\u5939\u4E0D\u4E3A\u7A7A\uFF0C\u662F\u5426\u7EE7\u7EED\u521B\u5EFA\u9879\u76EE\uFF1F"
      });
      if (!ifContinue) return null;
    }
    const confirmDelete = await confirm({
      message: "\u662F\u5426\u786E\u8BA4\u6E05\u7A7A\u5F53\u524D\u76EE\u5F55\u4E0B\u7684\u6587\u4EF6?"
    });
    if (confirmDelete) {
      try {
        fse.emptyDirSync(currentPath);
      } catch (error) {
        catchError({ msg: "\u6E05\u7A7A\u76EE\u5F55\u5931\u8D25:", error });
      }
    }
  }
  try {
    const name = await input(getNamePrompt(projectName));
    const version = await input(versionPrompt);
    const npmName = await safeSelectPrompt(projectPrompt);
    const template = PROJECT_LIST.find((item) => item.value === npmName);
    if (!template) {
      catchError({ msg: "\u672A\u627E\u5230\u5BF9\u5E94\u7684\u6A21\u677F\u4FE1\u606F" });
    } else {
      projectInfo = {
        ...template,
        projectName: name,
        projectVersion: version
      };
    }
  } catch (error) {
    catchError({ msg: "\u83B7\u53D6\u9879\u76EE\u4FE1\u606F\u5931\u8D25:", error });
  }
  return projectInfo;
};
var prepareStage_default = prepareStage;

// commands/init/src/installService.ts
import path from "path";
import userHome from "user-home";
import {
  sleep,
  spawnPlus,
  spinnerStart,
  catchError as catchError2
} from "@yutu-software-cli/share-utils";
import templateInstaller from "@yutu-software-cli/template-installer";
import createLogger from "@yutu-software-cli/debug-log";
import { ejsRender, fse as fse2 } from "@yutu-software-cli/ejs-render";

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
      catchError2({ msg: "\u9879\u76EE\u5B89\u88C5\u5931\u8D25:", error });
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
      catchError2({ msg: "\u9879\u76EE\u6A21\u677F\u4E0B\u8F7D\u5931\u8D25:", error });
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
      fse2.ensureDirSync(templatePath);
      fse2.ensureDirSync(currentPath);
      fse2.copySync(templatePath, currentPath);
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

// commands/init/src/initCommand.ts
var InitCommand = class extends CommandHandler {
  logger = createLogger2("@yutu-software-cli:init");
  projectName = "";
  force = false;
  projectInfo = null;
  //初始化命令参数
  init() {
    this.projectName = this._argv[0] || "";
    this.force = this._argv[1]?.force || false;
  }
  // 命令执行的主逻辑
  async exec() {
    try {
      await this.prepareProjectInfo();
      await this.executeInstallService();
    } catch (error) {
      catchError3({ msg: "init\u547D\u4EE4\u6267\u884C\u5931\u8D25:", error });
    }
  }
  /** 获取模板信息 */
  async prepareProjectInfo() {
    this.projectInfo = await prepareStage_default({
      projectName: this.projectName,
      force: this.force
    });
    if (!this.projectInfo) {
      throw new Error("\u83B7\u53D6\u6A21\u677F\u4FE1\u606F\u5931\u8D25");
    }
    this.logger.info("\u6A21\u7248\u4FE1\u606F\uFF1A", this.projectInfo);
  }
  /** 执行安装服务 */
  async executeInstallService() {
    if (!this.projectInfo) {
      throw new Error("\u6A21\u677F\u4FE1\u606F\u672A\u5B9A\u4E49\uFF0C\u65E0\u6CD5\u6267\u884C\u5B89\u88C5");
    }
    const installService = new installService_default(this.projectInfo);
    await installService.installModule();
  }
};
var initCommand_default = InitCommand;

// commands/init/src/index.ts
var init = () => {
  const args = process.argv.slice(2);
  const parsedArgs = JSON.parse(args[0]);
  return new initCommand_default(parsedArgs);
};
init();

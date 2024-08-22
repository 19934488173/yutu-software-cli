// commands/init/src/initCommand.ts
import CommandHandler from "@yutu-software-cli/command-handler";
import createLogger from "@yutu-software-cli/debug-log";

// commands/init/src/prepareStage.ts
import inquirer2 from "inquirer";

// commands/init/src/fsUtils.ts
import fs from "fs";
import pkg from "fs-extra";
var { emptyDirSync, ensureDirSync, copySync, existsSync } = pkg;
function isDirEmpty(localPath) {
  let fileList = fs.readdirSync(localPath);
  fileList = fileList.filter(
    (file) => !file.startsWith(".") && !["node_modules"].includes(file)
  );
  return fileList.length === 0;
}

// commands/init/src/projectTemplate.ts
var getProjectTemplate = () => {
  return [
    {
      name: "React\u9879\u76EE\u6A21\u677F",
      version: "1.0.2",
      npmName: "yutu-software-template-react",
      type: "normal",
      installCommand: "pnpm install",
      startCommand: "pnpm run dev"
    }
  ];
};
var projectTemplate_default = getProjectTemplate;

// commands/init/src/projectInfoHandler.ts
import inquirer from "inquirer";
import semver from "semver";

// commands/init/src/types.ts
var TYPE_PROJECT = "project";
var TYPE_COMPONENT = "component";
var TEMPLATE_TYPE_NORMAL = "normal";
var TEMPLATE_TYPE_CUSTOM = "custom";
var WHITE_COMMAND = ["npm", "cnpm", "pnpm", "yarn"];

// commands/init/src/projectInfoHandler.ts
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
var createTemplateChoices = () => {
  return projectTemplate_default().map((template) => ({
    name: template.name,
    value: template
  }));
};
var getProjectQuestions = (projectName) => [
  {
    type: "input",
    name: "projectName",
    message: "\u8BF7\u8F93\u5165\u9879\u76EE\u540D\u79F0\uFF08\u4F8B\u5982 my-project\uFF09\uFF1A",
    default: projectName,
    validate: (name) => isValidName(name) ? true : "\u8BF7\u8F93\u5165\u5408\u6CD5\u7684\u9879\u76EE\u540D\u79F0\uFF08\u5B57\u6BCD\u3001\u6570\u5B57\u3001\u4E0B\u5212\u7EBF\u548C\u77ED\u6A2A\u7EBF\u7EC4\u6210\uFF09"
  },
  {
    type: "input",
    name: "projectVersion",
    message: "\u8BF7\u8F93\u5165\u9879\u76EE\u7248\u672C\u53F7\uFF08\u4F8B\u5982 1.0.0\uFF09\uFF1A",
    default: "1.0.0",
    validate: (version) => isValidVersion(version) ? true : "\u8BF7\u8F93\u5165\u5408\u6CD5\u7684\u7248\u672C\u53F7\uFF08\u7B26\u5408 semver \u89C4\u8303\uFF09",
    filter: filterVersion
  },
  {
    type: "list",
    name: "projectTemplate",
    message: "\u8BF7\u9009\u62E9\u9879\u76EE\u6A21\u677F\uFF1A",
    choices: createTemplateChoices()
  }
];
var getComponentQuestions = () => {
  return [];
};
var getQuestionsForType = (type, projectName) => {
  switch (type) {
    case TYPE_PROJECT:
      return getProjectQuestions(projectName);
    case TYPE_COMPONENT:
      return getComponentQuestions();
    default:
      throw new Error(`Unsupported project type: ${type}`);
  }
};
var getProjectInfo = async (projectName) => {
  let projectInfo = {};
  const isProjectNameValid = isValidName(projectName);
  if (isProjectNameValid) {
    projectInfo.projectName = projectName;
  }
  try {
    const { type } = await inquirer.prompt({
      type: "list",
      name: "type",
      message: "\u8BF7\u9009\u62E9\u521D\u59CB\u5316\u9879\u76EE\u7C7B\u578B\uFF1A",
      default: TYPE_PROJECT,
      choices: [
        { name: "\u9879\u76EE", value: TYPE_PROJECT },
        { name: "\u7EC4\u4EF6", value: TYPE_COMPONENT }
      ]
    });
    const questions = getQuestionsForType(type, projectName);
    const responses = await inquirer.prompt(questions);
    projectInfo = { ...projectInfo, ...responses, type };
    return projectInfo;
  } catch (error) {
    console.error("\u83B7\u53D6\u9879\u76EE\u4FE1\u606F\u65F6\u51FA\u9519\uFF1A", error);
    throw new Error("\u83B7\u53D6\u9879\u76EE\u4FE1\u606F\u65F6\u51FA\u9519");
  }
};
var projectInfoHandler_default = getProjectInfo;

// commands/init/src/prepareStage.ts
var askConfirmation = async (message) => {
  const question = {
    type: "confirm",
    name: "confirmation",
    default: false,
    message
  };
  const { confirmation } = await inquirer2.prompt([question]);
  return confirmation;
};
var prepareStage = async (options) => {
  const { projectName, force } = options;
  const template = projectTemplate_default();
  if (!template || template.length === 0) throw new Error("\u9879\u76EE\u6A21\u677F\u4E0D\u5B58\u5728");
  const currentPath = process.cwd();
  if (!isDirEmpty(currentPath)) {
    if (!force) {
      const ifContinue = await askConfirmation("\u5F53\u524D\u6587\u4EF6\u5939\u4E0D\u4E3A\u7A7A\uFF0C\u662F\u5426\u7EE7\u7EED\u521B\u5EFA\u9879\u76EE\uFF1F");
      if (!ifContinue) return null;
    }
    const confirmDelete = await askConfirmation("\u662F\u5426\u786E\u8BA4\u6E05\u7A7A\u5F53\u524D\u76EE\u5F55\u4E0B\u7684\u6587\u4EF6\uFF1F");
    if (confirmDelete) {
      try {
        emptyDirSync(currentPath);
      } catch (error) {
        throw new Error(`\u6E05\u7A7A\u76EE\u5F55\u5931\u8D25: ${error.message}`);
      }
    }
  }
  try {
    return await projectInfoHandler_default(projectName);
  } catch (error) {
    throw new Error(`\u83B7\u53D6\u9879\u76EE\u4FE1\u606F\u5931\u8D25: ${error.message}`);
  }
};
var prepareStage_default = prepareStage;

// commands/init/src/templateInstaller.ts
import path2 from "path";
import userHome from "user-home";
import { sleep, spawnPlus, spinnerStart } from "@yutu-software-cli/share-utils";
import PackageHandler from "@yutu-software-cli/package-handler";

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

// commands/init/src/initCommand.ts
var InitCommand = class extends CommandHandler {
  projectName;
  force;
  //日志记录器
  logger;
  //初始化命令参数
  init() {
    this.logger = createLogger("@yutu-software-cli:init");
    this.projectName = this._argv[0] || "";
    this.force = this._argv[1]?.force || false;
    this.logger.log("projectName", this.projectName);
    this.logger.log("force", this.force);
  }
  // 命令执行的主逻辑
  async exec() {
    try {
      const projectInfo = await prepareStage_default({
        projectName: this.projectName,
        force: this.force
      });
      if (projectInfo) {
        this.logger?.log("projectInfo", projectInfo);
        const templateInstaller = new templateInstaller_default(
          projectInfo,
          this.logger
        );
        await templateInstaller.download();
        await templateInstaller.install();
      }
    } catch (e) {
      this.logger?.error(e);
    }
  }
};
var initCommand_default = InitCommand;
export {
  initCommand_default as default
};

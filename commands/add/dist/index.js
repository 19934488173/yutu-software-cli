// commands/add/src/addCommand.ts
import CommandHandler from "@yutu-software-cli/command-handler";
import createLogger2 from "@yutu-software-cli/debug-log";
import { catchError as catchError3 } from "@yutu-software-cli/share-utils";

// commands/add/src/getTemplateInfo.ts
import { safeSelectPrompt, input } from "@yutu-software-cli/inquirer-prompts";
import { catchError } from "@yutu-software-cli/share-utils";

// commands/add/src/dataSource.ts
var TEMPLATE_LIST = [
  {
    name: "\u699C\u5355table",
    value: "rank-table",
    npmName: "yutu-software-template-section",
    module: "pages",
    version: "latest",
    copyPath: "src/pages",
    sourcePath: "template/pages/list",
    ignore: ["**/node_modules/**"]
  },
  {
    name: "context\u6A21\u7248",
    value: "paramsContext",
    npmName: "yutu-software-template-section",
    module: "fragment",
    version: "latest",
    copyPath: "src/pages",
    sourcePath: "template/contexts/paramsContext",
    ignore: []
  },
  {
    name: "swr\u672C\u5730\u5B58\u50A8",
    value: "swrStorage",
    npmName: "yutu-software-template-section",
    module: "fragment",
    version: "latest",
    copyPath: "src/pages/data",
    sourcePath: "template/data/swrStorage",
    ignore: [""]
  },
  {
    name: "swr\u8BF7\u6C42",
    value: "swrRequest",
    npmName: "yutu-software-template-section",
    module: "fragment",
    version: "latest",
    copyPath: "src/pages/data",
    sourcePath: "template/data/swrRequest",
    ignore: [""]
  },
  {
    name: "\u57FA\u7840\u56FE\u8868",
    value: "BaseChart",
    npmName: "template-storybook",
    module: "component",
    version: "latest",
    copyPath: "src/pages",
    /** 组件相关源码路径 */
    sourceCodePath: [
      "/src/components/echarts/BaseChart",
      "/src/components/echarts/publicConfig"
    ],
    sourcePath: "src/pages/baseChart",
    ignore: ["chart-data.ts"]
  }
];

// commands/add/src/promptUtils.ts
var TEMPLATE_TYPE = [
  {
    name: "\u4EE3\u7801\u7247\u6BB5",
    value: "fragment"
  },
  {
    name: "\u7EC4\u4EF6",
    value: "component"
  }
];
var modulePrompt = {
  message: "\u8BF7\u9009\u62E9\u4EE3\u7801\u590D\u7528\u7C7B\u578B",
  choices: TEMPLATE_TYPE
};
var namePrompt = {
  message: `\u8BF7\u8F93\u5165\u751F\u6210\u6587\u4EF6\u540D\u79F0`,
  validate: (value) => !value || !value.trim() ? `\u540D\u79F0\u4E0D\u80FD\u4E3A\u7A7A` : true
};
var getCopyPathPrompt = (defaultPath) => {
  return {
    message: `\u8BF7\u8F93\u5165\u62F7\u8D1D\u7684\u76F8\u5BF9\u8DEF\u5F84`,
    default: defaultPath,
    validate: (value) => !value || !value.trim() ? `\u8DEF\u5F84\u4E0D\u80FD\u4E3A\u7A7A` : true
  };
};

// commands/add/src/getTemplateInfo.ts
var getTemplateInfo = async () => {
  try {
    const module = await safeSelectPrompt(modulePrompt);
    let npmName;
    if (module === "fragment") {
      const fragmentList = TEMPLATE_LIST.filter(
        (item) => item.module === module
      );
      npmName = await safeSelectPrompt({
        message: "\u8BF7\u9009\u62E9\u4EE3\u7801\u6A21\u677F",
        choices: fragmentList
      });
    } else {
      npmName = await input({
        message: "\u8BF7\u8F93\u5165\u7EC4\u4EF6\u540D\u79F0",
        default: "BaseChart"
      });
    }
    const templateName = await input(namePrompt);
    const template = TEMPLATE_LIST.find((item) => item.value === npmName);
    const copyPath = await input(getCopyPathPrompt(template?.copyPath || ""));
    if (!template) {
      catchError({ msg: "\u672A\u627E\u5230\u5BF9\u5E94\u7684\u6A21\u677F\u4FE1\u606F" });
    }
    return {
      ...template,
      copyPath,
      templateName
    };
  } catch (error) {
    catchError({ msg: "\u83B7\u53D6\u6A21\u677F\u4FE1\u606F\u65F6\u53D1\u751F\u9519\u8BEF:", error });
  }
};
var getTemplateInfo_default = getTemplateInfo;

// commands/add/src/installService.ts
import path from "path";
import userHome from "user-home";
import templateInstaller from "@yutu-software-cli/template-installer";
import {
  sleep,
  spinnerStart,
  catchError as catchError2
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
      catchError2({ msg: "\u6A21\u5757\u5B89\u88C5\u5931\u8D25:", error });
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
      catchError2({ msg: "\u6A21\u677F\u4E0B\u8F7D\u5931\u8D25:", error });
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
          if (fse.pathExistsSync(componentPath)) {
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
      this.logger.info("\u6A21\u677F\u5B89\u88C5\u6210\u529F");
    } catch (error) {
      catchError2({ msg: "\u6A21\u677F\u5B89\u88C5\u5931\u8D25:", error });
    } finally {
      spinner.stop(true);
    }
  }
};
var installService_default = InstallService;

// commands/add/src/addCommand.ts
var AddCommand = class extends CommandHandler {
  logger = createLogger2("@yutu-software-cli:add");
  templateInfo = void 0;
  init() {
  }
  /* 命令执行的主逻辑 */
  async exec() {
    try {
      await this.prepareTemplateInfo();
      await this.executeInstallService();
    } catch (error) {
      catchError3({ msg: "add\u547D\u4EE4\u6267\u884C\u5931\u8D25:", error });
    }
  }
  /** 获取模板信息 */
  async prepareTemplateInfo() {
    this.templateInfo = await getTemplateInfo_default();
    if (!this.templateInfo) {
      throw new Error("\u83B7\u53D6\u6A21\u677F\u4FE1\u606F\u5931\u8D25");
    }
    this.logger.info("\u6A21\u7248\u4FE1\u606F\uFF1A", this.templateInfo);
  }
  /** 执行安装服务 */
  async executeInstallService() {
    if (!this.templateInfo) {
      throw new Error("\u6A21\u677F\u4FE1\u606F\u672A\u5B9A\u4E49\uFF0C\u65E0\u6CD5\u6267\u884C\u5B89\u88C5");
    }
    const installService = new installService_default(this.templateInfo);
    await installService.installModule();
  }
};
var addCommand_default = AddCommand;

// commands/add/src/index.ts
var add = () => {
  const args = process.argv.slice(2);
  const parsedArgs = JSON.parse(args[0]);
  return new addCommand_default(parsedArgs);
};
add();
var src_default = add;
export {
  src_default as default
};

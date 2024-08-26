// commands/add/src/installService.ts
import path from "path";
import userHome from "user-home";
import templateInstaller from "@yutu-software-cli/template-installer";
import { sleep, spinnerStart } from "@yutu-software-cli/share-utils";
import fse from "fs-extra";

// commands/add/src/templateService.ts
import inquirer from "inquirer";

// commands/add/src/dataSource.ts
var ADD_MODE_SECTION = "section";
var ADD_MODE_PAGE = "page";
var TEMPLATE_LIST = [
  { name: "\u9996\u9875", value: "home", module: "page", version: "1.0.0" },
  { name: "\u9875\u811A", value: "footer", module: "page", version: "1.0.0" },
  {
    name: "useParamsContext",
    value: "yutu-software-template-section",
    module: "section",
    version: "1.0.0"
  },
  { name: "\u6587\u672C", value: "text", module: "section", version: "1.0.0" }
];
var PAGE_TEMPLATE_LIST = TEMPLATE_LIST.filter(
  (item) => item.module === "page"
);
var SECTION_TEMPLATE_LIST = TEMPLATE_LIST.filter(
  (item) => item.module === "section"
);

// commands/add/src/templateService.ts
var getTemplate = async (addModule) => {
  const { template } = await inquirer.prompt({
    type: "list",
    name: "template",
    message: `\u8BF7\u9009\u62E9${addModule === ADD_MODE_PAGE ? "\u9875\u9762" : "\u4EE3\u7801\u7247\u6BB5"}\u6A21\u677F`,
    choices: addModule === ADD_MODE_PAGE ? PAGE_TEMPLATE_LIST : SECTION_TEMPLATE_LIST
  });
  return template;
};
var getTemplateName = async (defaultName) => {
  const { templateName } = await inquirer.prompt({
    type: "input",
    name: "templateName",
    message: "\u8BF7\u8F93\u5165\u6A21\u677F\u540D\u79F0",
    default: defaultName,
    validate: (value) => !value || !value.trim() ? "\u6A21\u677F\u540D\u79F0\u4E0D\u80FD\u4E3A\u7A7A" : true
  });
  return templateName;
};

// commands/add/src/installService.ts
var InstallService = class {
  // 日志记录器
  logger;
  templateName;
  addModule;
  targetPath = "";
  dir;
  templateInfo;
  templateNpmInfo;
  constructor(logger, addModule, templateName) {
    this.dir = process.cwd();
    this.logger = logger;
    this.addModule = addModule;
    this.templateName = templateName;
  }
  // 安装页面模块
  async installModule() {
    this.templateInfo = await this.getTemplateInfo();
    this.logger.info("\u6A21\u7248\u4FE1\u606F\uFF1A", this.templateInfo);
    this.targetPath = path.resolve(
      this.dir,
      `${this.addModule === ADD_MODE_SECTION ? "components" : ""}`,
      this.templateInfo.templateName
    );
    console.log("\u62F7\u8D1D\u8DEF\u5F84\uFF1A", this.targetPath);
    await this.downloadTemplate();
    await this.installTemplate();
  }
  /** 获取模版详细信息 */
  async getTemplateInfo() {
    const npmName = await getTemplate(this.addModule);
    let template;
    template = TEMPLATE_LIST.find((item) => item.value === npmName);
    if (!template) {
      return this.logger.error(`${npmName}\u6A21\u7248\u4E0D\u5B58\u5728`);
    }
    const templateName = await getTemplateName(this.templateName);
    template.templateName = templateName;
    return template;
  }
  /** 下载模版 */
  async downloadTemplate() {
    const targetPath = path.resolve(
      userHome,
      process.env.CLI_HOME_PATH ?? "",
      "template"
    );
    const storeDir = path.resolve(targetPath, "node_modules");
    const { value: packageName, version: packageVersion } = this.templateInfo;
    this.templateNpmInfo = await templateInstaller({
      packageName,
      packageVersion,
      storeDir,
      targetPath,
      logger: this.logger
    });
  }
  /** 安装模版 */
  async installTemplate() {
    const spinner = spinnerStart("\u6B63\u5728\u5B89\u88C5\u6A21\u677F...");
    await sleep();
    const currentPath = process.cwd();
    try {
      const templatePath = path.resolve(
        this.templateNpmInfo.cacheFilePath,
        `template/sections`
      );
      fse.copySync(templatePath, currentPath);
    } catch (error) {
      this.logger.error("\u6A21\u677F\u5B89\u88C5\u5931\u8D25", error);
      throw error;
    } finally {
      spinner.stop(true);
      this.logger.info("\u6A21\u677F\u5B89\u88C5\u6210\u529F");
    }
  }
};
var installService_default = InstallService;
export {
  installService_default as default
};

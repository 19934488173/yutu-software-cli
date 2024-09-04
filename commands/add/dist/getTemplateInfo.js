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
export {
  getTemplateInfo_default as default
};

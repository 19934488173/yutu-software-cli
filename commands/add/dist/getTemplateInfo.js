// commands/add/src/getTemplateInfo.ts
import { safeSelectPrompt, input } from "@yutu-software-cli/inquirer-prompts";
import { catchError } from "@yutu-software-cli/share-utils";

// commands/add/src/dataSource.ts
var TEMPLATE_LIST = [
  {
    name: "context\u6A21\u7248",
    value: "context",
    npmName: "template-storybook",
    module: "fragment",
    version: "latest",
    copyPath: "src/pages",
    /** 组件相关源码路径 */
    sourceCodePath: ["/src/hooks/useCustomContext.ts"],
    sourcePath: "src/template/context",
    ignore: [],
    type: "context"
  },
  {
    name: "swr\u672C\u5730\u5B58\u50A8",
    value: "swrStorage",
    npmName: "template-storybook",
    module: "fragment",
    version: "latest",
    copyPath: "src/pages/data",
    sourcePath: "src/template/data/swrStorage",
    ignore: [""],
    type: "swr"
  },
  {
    name: "swr\u8BF7\u6C42",
    value: "swrRequest",
    npmName: "template-storybook",
    module: "fragment",
    version: "latest",
    copyPath: "src/pages/data",
    sourcePath: "src/template/data/swrRequest",
    ignore: [""],
    type: "swr"
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
    sourcePath: "src/template/components/baseChart",
    ignore: ["chart-data.ts"],
    type: "component"
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
var namePatterns = {
  swr: /^use(-[a-z]+)+$/,
  context: /^use[A-Z][a-zA-Z]*Context$/,
  component: /^[A-Z][a-zA-Z]*$/
};
var defaultValues = {
  swr: "use-example",
  context: "useExampleContext",
  component: "MyExample"
};
var errorMessages = {
  swr: "\u540D\u79F0\u683C\u5F0F\u4E0D\u6B63\u786E\uFF0C\u5FC5\u987B\u662F use-xxx \u6216 use-xxx-xxx \u683C\u5F0F",
  context: '\u540D\u79F0\u683C\u5F0F\u4E0D\u6B63\u786E\uFF0C\u5FC5\u987B\u662F\u4EE5 "use" \u5F00\u5934\uFF0C\u9A7C\u5CF0\u547D\u540D\uFF0C\u4E14\u4EE5 "Context" \u7ED3\u5C3E',
  component: "\u540D\u79F0\u683C\u5F0F\u4E0D\u6B63\u786E\uFF0C\u5FC5\u987B\u662F\u4EE5\u5927\u5199\u5B57\u6BCD\u5F00\u5934\u7684\u9A7C\u5CF0\u547D\u540D\u683C\u5F0F"
};
var getNamePrompt = (type) => ({
  message: `\u751F\u6210\u4EE3\u7801\u6587\u4EF6\u540D\uFF1A`,
  default: defaultValues[type],
  validate: (value) => {
    const trimmedValue = value.trim();
    if (!trimmedValue) {
      return "\u540D\u79F0\u4E0D\u80FD\u4E3A\u7A7A";
    }
    const regex = namePatterns[type];
    if (regex && !regex.test(trimmedValue)) {
      return errorMessages[type];
    }
    return true;
  }
});
var getCopyPathPrompt = (defaultPath) => {
  return {
    message: `\u4EE3\u7801\u751F\u6210\u5728\u54EA\u4E2A\u6587\u4EF6\u4E0B\uFF1F`,
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
        message: "\u8BF7\u9009\u62E9\u4EE3\u7801\u7247\u6BB5\u6A21\u677F",
        choices: fragmentList
      });
    } else {
      npmName = await input({
        message: "\u8BF7\u8F93\u5165\u7EC4\u4EF6\u540D\u79F0\uFF0C\u4ECE\u7EC4\u4EF6\u6587\u6863\u5E93\u4E2D\u67E5\u627E\u7B26\u5408\u9700\u6C42\u7684\u7EC4\u4EF6",
        default: "BaseChart"
      });
    }
    const template = TEMPLATE_LIST.find((item) => item.value === npmName);
    if (!template) {
      catchError({ msg: "\u672A\u627E\u5230\u5BF9\u5E94\u7684\u6A21\u677F\u4FE1\u606F" });
    }
    const templateName = await input(getNamePrompt(template?.type || ""));
    const copyPath = await input(getCopyPathPrompt(template?.copyPath || ""));
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

// commands/add/src/types.ts
var TemplateModules = {
  data: "data",
  page: "page",
  echarts: "echarts",
  context: "context",
  components: "components",
  hooks: "hooks",
  section: "section"
};

// commands/add/src/dataSource.ts
var TEMPLATE_LIST = [
  {
    name: "\u699C\u5355table",
    value: "list",
    npmName: "yutu-software-template-section",
    module: TemplateModules.page,
    version: "latest",
    copyPath: "src/pages",
    sourcePath: "template/pages/list",
    ignore: ["**/node_modules/**"]
  },
  {
    name: "context\u6A21\u7248",
    value: "paramsContext",
    npmName: "yutu-software-template-section",
    module: TemplateModules.context,
    version: "latest",
    copyPath: "src/pages",
    sourcePath: "template/contexts/paramsContext",
    ignore: []
  },
  {
    name: "swr\u672C\u5730\u5B58\u50A8",
    value: "swrStorage",
    npmName: "yutu-software-template-section",
    module: TemplateModules.data,
    version: "latest",
    copyPath: "src/pages/data",
    sourcePath: "template/data/swrStorage",
    ignore: [""]
  },
  {
    name: "swr\u8BF7\u6C42",
    value: "swrRequest",
    npmName: "yutu-software-template-section",
    module: TemplateModules.data,
    version: "latest",
    copyPath: "src/pages/data",
    sourcePath: "template/data/swrRequest",
    ignore: [""]
  },
  {
    name: "\u57FA\u7840\u56FE\u8868",
    value: "baseChart",
    npmName: "yutu-software-template-section",
    module: TemplateModules.echarts,
    version: "latest",
    copyPath: "src/pages",
    sourcePath: "template/echarts/baseChart",
    ignore: ["chart-data.ts"]
  }
];

// commands/add/src/promptUtils.ts
var TEMPLATE_TYPE = Object.values(TemplateModules).map((value) => ({
  name: value,
  value
}));
var filterTemplatesByModule = (module) => TEMPLATE_LIST.filter((item) => item.module === module);
var modulePrompt = {
  message: "\u8BF7\u9009\u62E9\u4EE3\u7801\u590D\u7528\u7C7B\u578B",
  choices: TEMPLATE_TYPE
};
var getNpmNamePrompt = (module) => {
  const choices = filterTemplatesByModule(module);
  return {
    message: `\u8BF7\u9009\u62E9${module}\u6A21\u677F`,
    choices
  };
};
var namePrompt = {
  message: `\u8BF7\u8F93\u5165\u6A21\u7248\u540D\u79F0`,
  validate: (value) => !value || !value.trim() ? `\u540D\u79F0\u4E0D\u80FD\u4E3A\u7A7A` : true
};
var getCopyPathPrompt = (defaultPath) => {
  return {
    message: `\u8BF7\u8F93\u5165\u62F7\u8D1D\u7684\u76F8\u5BF9\u8DEF\u5F84`,
    default: defaultPath,
    validate: (value) => !value || !value.trim() ? `\u8DEF\u5F84\u4E0D\u80FD\u4E3A\u7A7A` : true
  };
};
export {
  TEMPLATE_TYPE,
  getCopyPathPrompt,
  getNpmNamePrompt,
  modulePrompt,
  namePrompt
};

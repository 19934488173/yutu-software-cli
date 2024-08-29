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
export {
  TEMPLATE_LIST
};

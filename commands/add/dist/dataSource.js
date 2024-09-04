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
export {
  TEMPLATE_LIST
};

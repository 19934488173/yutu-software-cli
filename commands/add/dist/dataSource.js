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
export {
  TEMPLATE_LIST
};

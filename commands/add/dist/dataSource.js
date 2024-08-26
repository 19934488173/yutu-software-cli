// commands/add/src/dataSource.ts
var ADD_MODE_SECTION = "section";
var ADD_MODE_PAGE = "page";
var TEMPLATE_TYPE = [
  { name: "\u9875\u9762\u6A21\u677F", value: ADD_MODE_PAGE },
  { name: "\u4EE3\u7801\u7247\u6BB5", value: ADD_MODE_SECTION }
];
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
export {
  ADD_MODE_PAGE,
  ADD_MODE_SECTION,
  PAGE_TEMPLATE_LIST,
  SECTION_TEMPLATE_LIST,
  TEMPLATE_LIST,
  TEMPLATE_TYPE
};

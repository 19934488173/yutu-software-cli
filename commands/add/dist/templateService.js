// commands/add/src/templateService.ts
import inquirer from "inquirer";

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

// commands/add/src/templateService.ts
var getAddMode = async () => {
  const { addModule } = await inquirer.prompt({
    type: "list",
    name: "addModule",
    message: "\u8BF7\u9009\u62E9\u4EE3\u7801\u590D\u7528\u6A21\u5F0F",
    choices: TEMPLATE_TYPE
  });
  return addModule;
};
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
export {
  getAddMode,
  getTemplate,
  getTemplateName
};

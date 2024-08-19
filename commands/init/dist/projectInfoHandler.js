// commands/init/src/projectInfoHandler.ts
import inquirer from "inquirer";
import semver from "semver";

// commands/init/src/types.ts
var TYPE_PROJECT = "project";
var TYPE_COMPONENT = "component";

// commands/init/src/projectTemplate.ts
var getProjectTemplate = () => {
  return [
    {
      name: "React \u9879\u76EE\u6A21\u677F",
      version: "1.0.2",
      npmName: "imooc-cli-dev-template-vue2",
      type: "normal"
    }
  ];
};
var projectTemplate_default = getProjectTemplate;

// commands/init/src/projectInfoHandler.ts
var isValidName = (v) => /^(@[a-zA-Z0-9-_]+\/)?[a-zA-Z]+([-][a-zA-Z][a-zA-Z0-9]*|[_][a-zA-Z][a-zA-Z0-9]*|[a-zA-Z0-9])*$/.test(
  v
);
var createTemplateChoice = () => {
  const projectTemplate = projectTemplate_default();
  return projectTemplate.map((item) => {
    return {
      name: item.name,
      value: item
    };
  });
};
var getProjectInfo = async (projectName) => {
  const { type } = await inquirer.prompt({
    type: "list",
    name: "type",
    message: "\u8BF7\u9009\u62E9\u521D\u59CB\u5316\u9879\u76EE\u7C7B\u578B\uFF1A",
    default: TYPE_PROJECT,
    choices: [
      { name: "\u9879\u76EE", value: TYPE_PROJECT },
      { name: "\u7EC4\u4EF6", value: TYPE_COMPONENT }
    ]
  });
  let projectInfo = {};
  if (type === TYPE_PROJECT) {
    const project = await inquirer.prompt([
      {
        type: "input",
        name: "projectName",
        message: "\u8BF7\u8F93\u5165\u9879\u76EE\u540D\u79F0\uFF1A",
        default: projectName,
        validate: (name) => {
          return isValidName(name) ? true : "\u8BF7\u8F93\u5165\u5408\u6CD5\u540D\u79F0";
        }
      },
      {
        type: "input",
        name: "projectVersion",
        message: "\u8BF7\u8F93\u5165\u9879\u76EE\u7248\u672C\u53F7\uFF1A",
        default: "1.0.0",
        validate: (version) => {
          return semver.valid(version) ? true : "\u8BF7\u8F93\u5165\u5408\u6CD5\u7684\u7248\u672C\u53F7";
        },
        filter: (v) => semver.valid(v) || v
      },
      {
        type: "list",
        name: "projectTemplate",
        message: "\u8BF7\u9009\u62E9\u9879\u76EE\u6A21\u677F",
        choices: createTemplateChoice()
      }
    ]);
    projectInfo = { type, ...project };
  }
  if (type === TYPE_COMPONENT) {
  }
  return projectInfo;
};
var projectInfoHandler_default = getProjectInfo;
export {
  projectInfoHandler_default as default
};

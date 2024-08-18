// commands/init/src/prepareStage.ts
import inquirer2 from "inquirer";

// commands/init/src/fsUtils.ts
import fs from "fs";
import pkg from "fs-extra";
var { emptyDirSync, ensureDirSync, copySync } = pkg;
function isDirEmpty(localPath) {
  let fileList = fs.readdirSync(localPath);
  fileList = fileList.filter(
    (file) => !file.startsWith(".") && !["node_modules"].includes(file)
  );
  return fileList.length === 0;
}

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
import inquirer from "inquirer";
import semver from "semver";

// commands/init/src/types.ts
var TYPE_PROJECT = "project";
var TYPE_COMPONENT = "component";

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
    projectInfo = { type };
  }
  return projectInfo;
};
var projectInfoHandler_default = getProjectInfo;

// commands/init/src/prepareStage.ts
var prepareStage = async (options) => {
  const { projectName, force } = options;
  const template = projectTemplate_default();
  if (!template || template.length === 0) throw new Error("\u9879\u76EE\u6A21\u677F\u4E0D\u5B58\u5728");
  const localPath = process.cwd();
  if (!isDirEmpty(localPath)) {
    let ifContinue = false;
    if (!force) {
      const confirmQuestion = {
        type: "confirm",
        name: "ifContinue",
        default: false,
        message: "\u5F53\u524D\u6587\u4EF6\u5939\u4E0D\u4E3A\u7A7A\uFF0C\u662F\u5426\u7EE7\u7EED\u521B\u5EFA\u9879\u76EE\uFF1F"
      };
      const response = await inquirer2.prompt([confirmQuestion]);
      ifContinue = response.ifContinue;
      if (!ifContinue) return null;
    }
    if (!ifContinue || force) {
      const confirmDeleteQuestion = {
        type: "confirm",
        name: "confirmDelete",
        default: false,
        message: "\u662F\u5426\u786E\u8BA4\u6E05\u7A7A\u5F53\u524D\u76EE\u5F55\u4E0B\u7684\u6587\u4EF6\uFF1F"
      };
      const { confirmDelete } = await inquirer2.prompt([confirmDeleteQuestion]);
      if (confirmDelete) {
        emptyDirSync(localPath);
      }
    }
  }
  return await projectInfoHandler_default(projectName);
};
var prepareStage_default = prepareStage;
export {
  prepareStage_default as default
};

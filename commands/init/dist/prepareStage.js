// commands/init/src/prepareStage.ts
import inquirer2 from "inquirer";

// commands/init/src/fsUtils.ts
import fs from "fs";
import pkg from "fs-extra";
var { emptyDirSync, ensureDirSync, copySync, existsSync } = pkg;
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
      name: "React\u9879\u76EE\u6A21\u677F",
      version: "1.0.2",
      npmName: "yutu-software-template-react",
      type: "normal",
      installCommand: "pnpm install",
      startCommand: "pnpm run dev"
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
var isValidName = (name) => {
  const namePattern = /^(@[a-zA-Z0-9-_]+\/)?[a-zA-Z]+([-][a-zA-Z][a-zA-Z0-9]*|[_][a-zA-Z][a-zA-Z0-9]*|[a-zA-Z0-9])*$/;
  return namePattern.test(name);
};
var isValidVersion = (version) => {
  return semver.valid(version) !== null;
};
var filterVersion = (version) => {
  return semver.valid(version) || version;
};
var createTemplateChoices = () => {
  return projectTemplate_default().map((template) => ({
    name: template.name,
    value: template
  }));
};
var getProjectQuestions = (projectName) => [
  {
    type: "input",
    name: "projectName",
    message: "\u8BF7\u8F93\u5165\u9879\u76EE\u540D\u79F0\uFF08\u4F8B\u5982 my-project\uFF09\uFF1A",
    default: projectName,
    validate: (name) => isValidName(name) ? true : "\u8BF7\u8F93\u5165\u5408\u6CD5\u7684\u9879\u76EE\u540D\u79F0\uFF08\u5B57\u6BCD\u3001\u6570\u5B57\u3001\u4E0B\u5212\u7EBF\u548C\u77ED\u6A2A\u7EBF\u7EC4\u6210\uFF09"
  },
  {
    type: "input",
    name: "projectVersion",
    message: "\u8BF7\u8F93\u5165\u9879\u76EE\u7248\u672C\u53F7\uFF08\u4F8B\u5982 1.0.0\uFF09\uFF1A",
    default: "1.0.0",
    validate: (version) => isValidVersion(version) ? true : "\u8BF7\u8F93\u5165\u5408\u6CD5\u7684\u7248\u672C\u53F7\uFF08\u7B26\u5408 semver \u89C4\u8303\uFF09",
    filter: filterVersion
  },
  {
    type: "list",
    name: "projectTemplate",
    message: "\u8BF7\u9009\u62E9\u9879\u76EE\u6A21\u677F\uFF1A",
    choices: createTemplateChoices()
  }
];
var getComponentQuestions = () => {
  return [];
};
var getQuestionsForType = (type, projectName) => {
  switch (type) {
    case TYPE_PROJECT:
      return getProjectQuestions(projectName);
    case TYPE_COMPONENT:
      return getComponentQuestions();
    default:
      throw new Error(`Unsupported project type: ${type}`);
  }
};
var getProjectInfo = async (projectName) => {
  let projectInfo = {};
  const isProjectNameValid = isValidName(projectName);
  if (isProjectNameValid) {
    projectInfo.projectName = projectName;
  }
  try {
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
    const questions = getQuestionsForType(type, projectName);
    const responses = await inquirer.prompt(questions);
    projectInfo = { ...projectInfo, ...responses, type };
    return projectInfo;
  } catch (error) {
    console.error("\u83B7\u53D6\u9879\u76EE\u4FE1\u606F\u65F6\u51FA\u9519\uFF1A", error);
    throw new Error("\u83B7\u53D6\u9879\u76EE\u4FE1\u606F\u65F6\u51FA\u9519");
  }
};
var projectInfoHandler_default = getProjectInfo;

// commands/init/src/prepareStage.ts
var askConfirmation = async (message) => {
  const question = {
    type: "confirm",
    name: "confirmation",
    default: false,
    message
  };
  const { confirmation } = await inquirer2.prompt([question]);
  return confirmation;
};
var prepareStage = async (options) => {
  const { projectName, force } = options;
  const template = projectTemplate_default();
  if (!template || template.length === 0) throw new Error("\u9879\u76EE\u6A21\u677F\u4E0D\u5B58\u5728");
  const currentPath = process.cwd();
  if (!isDirEmpty(currentPath)) {
    if (!force) {
      const ifContinue = await askConfirmation("\u5F53\u524D\u6587\u4EF6\u5939\u4E0D\u4E3A\u7A7A\uFF0C\u662F\u5426\u7EE7\u7EED\u521B\u5EFA\u9879\u76EE\uFF1F");
      if (!ifContinue) return null;
    }
    const confirmDelete = await askConfirmation("\u662F\u5426\u786E\u8BA4\u6E05\u7A7A\u5F53\u524D\u76EE\u5F55\u4E0B\u7684\u6587\u4EF6\uFF1F");
    if (confirmDelete) {
      try {
        emptyDirSync(currentPath);
      } catch (error) {
        throw new Error(`\u6E05\u7A7A\u76EE\u5F55\u5931\u8D25: ${error.message}`);
      }
    }
  }
  try {
    return await projectInfoHandler_default(projectName);
  } catch (error) {
    throw new Error(`\u83B7\u53D6\u9879\u76EE\u4FE1\u606F\u5931\u8D25: ${error.message}`);
  }
};
var prepareStage_default = prepareStage;
export {
  prepareStage_default as default
};

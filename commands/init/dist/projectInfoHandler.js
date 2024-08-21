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
export {
  projectInfoHandler_default as default
};

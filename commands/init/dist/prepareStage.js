// commands/init/src/prepareStage.ts
import {
  confirm,
  safeSelectPrompt,
  input
} from "@yutu-software-cli/inquirer-prompts";
import { catchError } from "@yutu-software-cli/share-utils";
import { fse } from "@yutu-software-cli/ejs-render";

// commands/init/src/utils.ts
import semver from "semver";
import fs from "fs";

// commands/init/src/dataSource.ts
var PROJECT_LIST = [
  {
    name: "React\u9879\u76EE\u6A21\u677F",
    value: " react",
    version: "1.0.2",
    npmName: "yutu-software-template-react",
    type: "normal",
    installCommand: "pnpm install",
    startCommand: "pnpm run dev"
  }
];

// commands/init/src/utils.ts
function isDirEmpty(localPath) {
  let fileList = fs.readdirSync(localPath);
  fileList = fileList.filter(
    (file) => !file.startsWith(".") && !["node_modules"].includes(file)
  );
  return fileList.length === 0;
}
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
var getNamePrompt = (defaultName) => {
  return {
    message: `\u8BF7\u8F93\u5165\u9879\u76EE\u540D\u79F0\uFF08\u4F8B\u5982 my-project\uFF09\uFF1A`,
    default: defaultName,
    validate: (name) => isValidName(name) ? true : "\u8BF7\u8F93\u5165\u5408\u6CD5\u7684\u9879\u76EE\u540D\u79F0\uFF08\u5B57\u6BCD\u3001\u6570\u5B57\u3001\u4E0B\u5212\u7EBF\u548C\u77ED\u6A2A\u7EBF\u7EC4\u6210\uFF09"
  };
};
var versionPrompt = {
  message: `\u8BF7\u8F93\u5165\u9879\u76EE\u7248\u672C\u53F7\uFF08\u4F8B\u5982 1.0.0\uFF09\uFF1A`,
  default: "1.0.0",
  validate: (version) => isValidVersion(version) ? true : "\u8BF7\u8F93\u5165\u5408\u6CD5\u7684\u7248\u672C\u53F7\uFF08\u7B26\u5408 semver \u89C4\u8303\uFF09",
  filter: filterVersion
};
var projectPrompt = {
  message: "\u8BF7\u9009\u62E9\u9879\u76EE\u6A21\u677F\uFF1A",
  choices: PROJECT_LIST
};

// commands/init/src/prepareStage.ts
var prepareStage = async (options) => {
  const { projectName, force } = options;
  let projectInfo = {};
  const currentPath = process.cwd();
  if (!isDirEmpty(currentPath)) {
    if (!force) {
      const ifContinue = await confirm({
        message: "\u5F53\u524D\u6587\u4EF6\u5939\u4E0D\u4E3A\u7A7A\uFF0C\u662F\u5426\u7EE7\u7EED\u521B\u5EFA\u9879\u76EE\uFF1F"
      });
      if (!ifContinue) return null;
    }
    const confirmDelete = await confirm({
      message: "\u662F\u5426\u786E\u8BA4\u6E05\u7A7A\u5F53\u524D\u76EE\u5F55\u4E0B\u7684\u6587\u4EF6?"
    });
    if (confirmDelete) {
      try {
        fse.emptyDirSync(currentPath);
      } catch (error) {
        catchError({ msg: "\u6E05\u7A7A\u76EE\u5F55\u5931\u8D25:", error });
      }
    }
  }
  try {
    const name = await input(getNamePrompt(projectName));
    const version = await input(versionPrompt);
    const npmName = await safeSelectPrompt(projectPrompt);
    const template = PROJECT_LIST.find((item) => item.value === npmName);
    if (!template) {
      catchError({ msg: "\u672A\u627E\u5230\u5BF9\u5E94\u7684\u6A21\u677F\u4FE1\u606F" });
    } else {
      projectInfo = {
        ...template,
        projectName: name,
        projectVersion: version
      };
    }
  } catch (error) {
    catchError({ msg: "\u83B7\u53D6\u9879\u76EE\u4FE1\u606F\u5931\u8D25:", error });
  }
  return projectInfo;
};
var prepareStage_default = prepareStage;
export {
  prepareStage_default as default
};

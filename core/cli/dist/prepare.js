// core/cli/src/prepare.ts
import rootCheck from "root-check";
import userHome from "user-home";
import path from "path";
import dotenv from "dotenv";
import semver from "semver";

// node_modules/.pnpm/path-exists@5.0.0/node_modules/path-exists/index.js
import fs, { promises as fsPromises } from "node:fs";
function pathExistsSync(path2) {
  try {
    fs.accessSync(path2);
    return true;
  } catch {
    return false;
  }
}

// core/cli/src/prepare.ts
import getNpmSemverVersion from "@yutu-software-cli/get-npm-info";

// core/cli/src/cli.ts
import { readPackageJson } from "@yutu-software-cli/share-utils";

// core/cli/src/registerCommand.ts
import { Command } from "commander";
import createLogger from "@yutu-software-cli/debug-log";
import exec from "@yutu-software-cli/exec";
var program = new Command();

// core/cli/src/prepare.ts
var DEFAULT_CLI_HOME = ".yutu-software-cli";
var checkHomeDir = () => {
  if (!userHome || !pathExistsSync(userHome)) {
    throw new Error("\u65E0\u6CD5\u83B7\u53D6\u7528\u6237\u4E3B\u76EE\u5F55");
  }
};
var checkEnv = () => {
  const cliConfig = {
    home: userHome,
    cliHome: ""
  };
  const dotenvPath = path.resolve(userHome, ".env");
  if (pathExistsSync(dotenvPath)) {
    dotenv.config({ path: dotenvPath });
  }
  cliConfig.cliHome = process.env.CLI_HOME ? path.join(userHome, process.env.CLI_HOME) : path.join(userHome, DEFAULT_CLI_HOME);
  process.env.CLI_HOME_PATH = cliConfig.cliHome;
};
var prepare = async () => {
  rootCheck();
  checkHomeDir();
  checkEnv();
};
var prepare_default = prepare;
export {
  prepare_default as default
};

// core/cli/src/prepare.ts
import rootCheck from "root-check";
import userhome from "userhome";
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
import getNpmSemverVersion from "@yutu-cli/get-npm-info";

// core/cli/src/cli.ts
import { Command } from "commander";
import { readPackageJson } from "@yutu-cli/share-utils";
import createLogger from "@yutu-cli/debug-log";
import exec from "@yutu-cli/exec";
var program = new Command();

// core/cli/src/prepare.ts
var DEFAULT_CLI_HOME = ".yutu-cli";
var checkHomeDir = () => {
  const homeDir = userhome();
  if (!homeDir || !pathExistsSync(homeDir)) {
    throw new Error("\u65E0\u6CD5\u83B7\u53D6\u7528\u6237\u4E3B\u76EE\u5F55");
  }
};
var checkEnv = () => {
  const homeDir = userhome();
  const cliConfig = {
    home: homeDir,
    cliHome: ""
  };
  const dotenvPath = path.resolve(homeDir, ".env");
  if (pathExistsSync(dotenvPath)) {
    dotenv.config({ path: dotenvPath });
  }
  cliConfig.cliHome = process.env.CLI_HOME ? path.join(homeDir, process.env.CLI_HOME) : path.join(homeDir, DEFAULT_CLI_HOME);
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

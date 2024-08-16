// core/exec/src/index.ts
import path from "path";
import PackageHandler from "@yutu-cli/package-handler";
import createLogger from "@yutu-cli/debug-log";
import shareUtils from "@yutu-cli/share-utils";
var { spawnPlus } = shareUtils;
var SETTINGS = {
  init: "@imooc-cli/init"
};
var CACHE_DIR = "dependencies";
var exec = async (...args) => {
  const logger = createLogger("exec");
  let pkg;
  const targetPath = process.env.CLI_TARGET_PATH ?? "";
  const homePath = process.env.CLI_HOME_PATH ?? "";
  const cmdObj = args[args.length - 1];
  const cmdName = cmdObj.name();
  const packageName = SETTINGS[cmdName];
  const packageVersion = "latest";
  logger.log("targetPath", targetPath);
  logger.log("homePath", homePath);
  try {
    pkg = await getOrInstallPackage({
      targetPath,
      homePath,
      packageName,
      packageVersion
    });
    const rootFile = pkg?.getRootFilePath();
    if (rootFile) {
      executeCommand(rootFile, args);
    } else {
      console.error("\u672A\u627E\u5230\u53EF\u6267\u884C\u7684\u6839\u6587\u4EF6\u8DEF\u5F84");
    }
  } catch (error) {
    console.error("\u6267\u884C\u547D\u4EE4\u65F6\u53D1\u751F\u9519\u8BEF: " + error.message);
  }
};
async function getOrInstallPackage({
  targetPath,
  homePath,
  packageName,
  packageVersion
}) {
  const logger = createLogger("exec");
  let pkg;
  let storeDir = "";
  if (!targetPath) {
    const cachePath = path.resolve(homePath, CACHE_DIR);
    storeDir = path.resolve(cachePath, "node_modules");
    logger.log("cachePath", cachePath);
    logger.log("storeDir", storeDir);
    pkg = new PackageHandler({
      targetPath: cachePath,
      storeDir,
      packageName,
      packageVersion
    });
    if (await pkg.exists()) {
      await pkg.update();
    } else {
      await pkg.install();
    }
  } else {
    pkg = new PackageHandler({ targetPath, packageName, packageVersion });
  }
  return pkg;
}
function executeCommand(rootFile, args) {
  try {
    const cleanedArgs = cleanCommandArgs(args);
    const child = spawnPlus("node", [rootFile, JSON.stringify(cleanedArgs)], {
      cwd: process.cwd(),
      stdio: "inherit"
    });
    child.on("error", (e) => {
      console.error("\u5B50\u8FDB\u7A0B\u53D1\u751F\u9519\u8BEF: " + e.message);
      process.exit(1);
    });
    child.on("exit", (e) => {
      console.log("\u547D\u4EE4\u6267\u884C\u6210\u529F");
      process.exit(e);
    });
  } catch (error) {
    console.error("\u6267\u884C\u5B50\u8FDB\u7A0B\u65F6\u53D1\u751F\u9519\u8BEF: " + error.message);
  }
}
function cleanCommandArgs(args) {
  const cmd = args[args.length - 1];
  const cleanedCmd = Object.keys(cmd).reduce(
    (acc, key) => {
      if (cmd.hasOwnProperty(key) && !key.startsWith("_") && key !== "parent") {
        acc[key] = cmd[key];
      }
      return acc;
    },
    {}
  );
  args[args.length - 1] = cleanedCmd;
  return args;
}
var src_default = exec;
export {
  src_default as default
};

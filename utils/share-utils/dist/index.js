// utils/share-utils/src/isObject.ts
function isObject(value) {
  return Object.prototype.toString.call(value) === "[object Object]";
}

// utils/share-utils/src/readPackageJson.ts
import { readFile } from "fs/promises";
import { join } from "path";
async function readPackageJson(path2) {
  try {
    const newPath = path2.replace(/\/dist$/, "");
    const fullPath = join(newPath, "./package.json");
    const data = await readFile(fullPath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading package.json:", error);
    throw error;
  }
}
var readPackageJson_default = readPackageJson;

// utils/share-utils/src/format-path.ts
import path from "path";
var formatPath = (p) => {
  const sep = path.sep;
  return sep === "/" ? p : p.replace(/\\/g, "/");
};
var format_path_default = formatPath;

// utils/share-utils/src/spawn-plus.ts
import { spawn as cpSpawn } from "child_process";
var spawnPlus = (command, args, options) => {
  const isWin32 = process.platform === "win32";
  const cmd = isWin32 ? "cmd" : command;
  const cmdArgs = isWin32 ? ["/c", command, ...args] : args;
  return cpSpawn(cmd, cmdArgs, options || {});
};
var spawn_plus_default = spawnPlus;

// utils/share-utils/src/index.ts
var shareUtils = {
  isObject,
  readPackageJson: readPackageJson_default,
  formatPath: format_path_default,
  spawnPlus: spawn_plus_default
};
var src_default = shareUtils;
export {
  src_default as default
};

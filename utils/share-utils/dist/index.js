// utils/share-utils/src/isObject.ts
var isObject = (value) => {
  return Object.prototype.toString.call(value) === "[object Object]";
};
var isObject_default = isObject;

// utils/share-utils/src/readPackageJson.ts
import { readFileSync } from "fs";
import { join } from "path";
var readPackageJson = (path2) => {
  try {
    const newPath = path2.replace(/\/dist$/, "");
    const fullPath = join(newPath, "./package.json");
    const data = readFileSync(fullPath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading package.json:", error);
    throw error;
  }
};
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

// utils/share-utils/src/sleep.ts
var sleep = (ms = 1e3) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
var sleep_default = sleep;

// utils/share-utils/src/spinner-start.ts
import { Spinner } from "cli-spinner";
var spinnerStart = (msg, spinnerString = "|/-\\") => {
  const spinner = new Spinner(msg + " %s");
  spinner.setSpinnerString(spinnerString);
  spinner.start();
  return spinner;
};
var spinner_start_default = spinnerStart;

// utils/share-utils/src/catch-error.ts
var catchError = (options) => {
  const {
    msg = "",
    error = null,
    exitCode = 1,
    logger = console,
    // 默认使用 console 打印日志
    onErrorHandled
  } = options;
  if (error) {
    logger.error(`${msg} ${error.message}`);
    logger.error(error.stack);
  } else {
    logger.error(`${msg}`);
  }
  if (onErrorHandled && typeof onErrorHandled === "function") {
    onErrorHandled();
  }
  process.exit(exitCode);
};
var catch_error_default = catchError;
export {
  catch_error_default as catchError,
  format_path_default as formatPath,
  isObject_default as isObject,
  readPackageJson_default as readPackageJson,
  sleep_default as sleep,
  spawn_plus_default as spawnPlus,
  spinner_start_default as spinnerStart
};

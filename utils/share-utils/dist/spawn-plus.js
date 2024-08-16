// utils/share-utils/src/spawn-plus.ts
import { spawn as cpSpawn } from "child_process";
var spawnPlus = (command, args, options) => {
  const isWin32 = process.platform === "win32";
  const cmd = isWin32 ? "cmd" : command;
  const cmdArgs = isWin32 ? ["/c", command, ...args] : args;
  return cpSpawn(cmd, cmdArgs, options || {});
};
var spawn_plus_default = spawnPlus;
export {
  spawn_plus_default as default
};

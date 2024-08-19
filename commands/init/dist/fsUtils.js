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
export {
  copySync,
  emptyDirSync,
  ensureDirSync,
  existsSync,
  isDirEmpty
};

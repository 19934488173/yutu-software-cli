// utils/share-utils/src/isObject.ts
function isObject(value) {
  return Object.prototype.toString.call(value) === "[object Object]";
}

// utils/share-utils/src/readPackageJson.ts
import { readFile } from "fs/promises";
import { join } from "path";
async function readPackageJson(path) {
  try {
    const newPath = path.replace(/\/dist$/, "");
    const fullPath = join(newPath, "./package.json");
    const data = await readFile(fullPath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading package.json:", error);
    throw error;
  }
}
var readPackageJson_default = readPackageJson;

// utils/share-utils/src/index.ts
var shareUtils = {
  isObject,
  readPackageJson: readPackageJson_default
};
var src_default = shareUtils;
export {
  src_default as default
};

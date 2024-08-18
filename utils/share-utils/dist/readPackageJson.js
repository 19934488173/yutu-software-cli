// utils/share-utils/src/readPackageJson.ts
import { readFileSync } from "fs";
import { join } from "path";
var readPackageJson = (path) => {
  try {
    const newPath = path.replace(/\/dist$/, "");
    const fullPath = join(newPath, "./package.json");
    const data = readFileSync(fullPath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading package.json:", error);
    throw error;
  }
};
var readPackageJson_default = readPackageJson;
export {
  readPackageJson_default as default
};

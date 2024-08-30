// utils/share-utils/src/time-stamp.ts
import path from "path";
import fs from "fs/promises";
var shouldUpdate = async (targetPath, interval, timestampFileName) => {
  const timestampFile = path.resolve(targetPath, timestampFileName);
  try {
    const lastUpdate = await fs.readFile(timestampFile, "utf-8");
    const lastUpdateTime = new Date(parseInt(lastUpdate, 10));
    const now = /* @__PURE__ */ new Date();
    return now.getTime() - lastUpdateTime.getTime() > interval;
  } catch {
    return true;
  }
};
var updateTimestamp = async (targetPath, timestampFileName) => {
  const timestampFile = path.resolve(targetPath, timestampFileName);
  await fs.writeFile(timestampFile, Date.now().toString(), "utf-8");
};
export {
  shouldUpdate,
  updateTimestamp
};

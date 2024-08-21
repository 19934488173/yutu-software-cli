// commands/init/src/ejsRender.ts
import path from "path";
import ejs from "ejs";
import fse from "fs-extra";
import { glob } from "glob";
import pLimit from "p-limit";
var limit = pLimit(10);
var ejsRender = async (projectInfo, options = {}) => {
  try {
    const dir = process.cwd();
    const files = await glob("**", {
      cwd: dir,
      ignore: options?.ignoreFiles,
      nodir: true
    });
    await Promise.all(
      files.map(
        (file) => limit(async () => {
          const filePath = path.join(dir, file);
          const result = await ejs.renderFile(filePath, projectInfo, {});
          fse.writeFileSync(filePath, result);
        })
      )
    );
  } catch (err) {
    throw new Error(`EJS \u6E32\u67D3\u5931\u8D25: ${err.message}`);
  }
};
var ejsRender_default = ejsRender;
export {
  ejsRender_default as default
};

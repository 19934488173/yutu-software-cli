// utils/ejs-render/src/index.ts
import path from "path";
import ejs from "ejs";
import fse from "fs-extra";
import { glob } from "glob";
import pLimit from "p-limit";
var regex = /<%=\s*[^%]+\s*%>/;
var renderFile = async (filePath, data) => {
  try {
    return await ejs.renderFile(filePath, data, {});
  } catch (err) {
    throw new Error(`EJS \u6E32\u67D3\u5931\u8D25: ${err?.message}\uFF0C\u6587\u4EF6: ${filePath}`);
  }
};
var writeFile = (filePath, content) => {
  try {
    const dir = path.dirname(filePath);
    fse.ensureDirSync(dir);
    fse.writeFileSync(filePath, content);
  } catch (err) {
    throw new Error(`\u6587\u4EF6\u5199\u5165\u5931\u8D25: ${err?.message}\uFF0C\u6587\u4EF6: ${filePath}`);
  }
};
var ejsRender = async (params) => {
  const { data, options } = params;
  const {
    ejsDir = process.cwd(),
    ignoreFiles,
    concurrencyLimit = 20
  } = options;
  try {
    const files = await glob("**", {
      cwd: ejsDir,
      ignore: ignoreFiles,
      nodir: false
    });
    const limit = pLimit(concurrencyLimit);
    const directoriesToRename = [];
    await Promise.all(
      files.map(
        (relativePath) => limit(async () => {
          const originalPath = path.join(ejsDir, relativePath);
          let renderedPath = originalPath;
          if (regex.test(originalPath)) {
            renderedPath = await ejs.render(originalPath, data);
          }
          const stats = fse.statSync(originalPath);
          if (stats.isDirectory()) {
            if (originalPath !== renderedPath) {
              directoriesToRename.push({
                original: originalPath,
                rendered: renderedPath
              });
            }
            return;
          }
          const renderedContent = await renderFile(originalPath, data);
          writeFile(renderedPath, renderedContent);
          if (renderedPath !== originalPath) {
            fse.removeSync(originalPath);
          }
        })
      )
    );
    for (const { original, rendered } of directoriesToRename) {
      if (fse.existsSync(rendered)) {
        fse.copySync(original, rendered, { overwrite: true });
        fse.removeSync(original);
      } else {
        fse.renameSync(original, rendered);
      }
    }
  } catch (err) {
    throw new Error(`EJS \u6E32\u67D3\u5931\u8D25: ${err?.message}`);
  }
};
export {
  ejsRender,
  fse
};

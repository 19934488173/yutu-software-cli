// utils/template-installer/src/index.ts
import PackageHandler from "@yutu-software-cli/package-handler";
import {
  sleep,
  spinnerStart,
  shouldUpdate,
  updateTimestamp
} from "@yutu-software-cli/share-utils";
var TEMPLATE_UPDATE_INTERVAL = 6 * 60 * 60 * 1e3;
var TIMESTAMP_FILE_NAME = ".lastTemplateUpdate";
var templateInstaller = async (options) => {
  const {
    targetPath,
    packageName,
    packageVersion,
    logger,
    storeDir = ""
  } = options;
  const template = new PackageHandler({
    targetPath,
    storeDir,
    packageName,
    packageVersion
  });
  const templateExists = await template.exists();
  const spinnerMessage = templateExists ? "\u6B63\u5728\u66F4\u65B0\u6A21\u677F..." : "\u6B63\u5728\u4E0B\u8F7D\u6A21\u677F...";
  const spinner = spinnerStart(spinnerMessage);
  await sleep();
  try {
    if (templateExists) {
      if (await shouldUpdate(
        targetPath,
        TEMPLATE_UPDATE_INTERVAL,
        TIMESTAMP_FILE_NAME
      )) {
        await template.update();
        await updateTimestamp(targetPath, TIMESTAMP_FILE_NAME);
      } else {
        logger.info("\u6A21\u677F\u5DF2\u5B58\u5728\u4E14\u57286\u5C0F\u65F6\u5185\u5DF2\u66F4\u65B0\uFF0C\u65E0\u9700\u518D\u6B21\u66F4\u65B0\u3002");
      }
    } else {
      await template.install();
      await updateTimestamp(targetPath, TIMESTAMP_FILE_NAME);
    }
    if (await template.exists()) {
      logger.info(templateExists ? "\u66F4\u65B0\u6A21\u677F\u6210\u529F\uFF01" : "\u4E0B\u8F7D\u6A21\u677F\u6210\u529F\uFF01");
    }
  } catch (error) {
    process.stdout.write("\x1B[2K\r");
    throw new Error(
      `\u6A21\u677F${templateExists ? "\u66F4\u65B0" : "\u4E0B\u8F7D"}\u5931\u8D25: ${error.message}`
    );
  } finally {
    spinner.stop(true);
  }
  return template;
};
var src_default = templateInstaller;
export {
  src_default as default
};

// utils/template-installer/src/index.ts
import PackageHandler from "@yutu-software-cli/package-handler";
import { sleep, spinnerStart } from "@yutu-software-cli/share-utils";
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
      await template.update();
    } else {
      await template.install();
    }
    if (await template.exists()) {
      logger.info(templateExists ? "\u66F4\u65B0\u6A21\u677F\u6210\u529F\uFF01" : "\u4E0B\u8F7D\u6A21\u677F\u6210\u529F\uFF01");
    }
  } catch (error) {
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

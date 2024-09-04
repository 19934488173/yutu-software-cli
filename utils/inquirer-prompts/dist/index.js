// utils/inquirer-prompts/src/index.ts
import { select, confirm, input, search } from "@inquirer/prompts";
var safeSelectPrompt = async (options) => {
  const { message, choices, defaultValue } = options;
  try {
    if (!choices || choices.length === 0) {
      throw new Error("\u6682\u65E0\u53EF\u9009\u9879");
    }
    const result = await select({
      message,
      choices,
      default: defaultValue
    });
    return result;
  } catch (error) {
    handleSelectPromptError(error);
    return null;
  }
};
var handleSelectPromptError = (error) => {
  console.log(`\u9009\u62E9\u51FA\u9519: ${error.message}`);
  process.exit(1);
};
export {
  confirm,
  input,
  safeSelectPrompt,
  search
};

import { select, confirm, input, search } from '@inquirer/prompts';

interface PromptOptions {
	message: string;
	choices: Array<{ name: string; value: any }>;
	defaultValue?: any;
}
// 选择安全提示
const safeSelectPrompt = async (options: PromptOptions) => {
	const { message, choices, defaultValue } = options;
	try {
		if (!choices || choices.length === 0) {
			throw new Error('暂无可选项');
		}
		const result = await select({
			message: message,
			choices: choices,
			default: defaultValue
		});
		return result;
	} catch (error: any) {
		handleSelectPromptError(error);
		return null;
	}
};

const handleSelectPromptError = (error: Error) => {
	console.log(`选择出错: ${error.message}`);
	process.exit(1);
};

export { safeSelectPrompt, confirm, input, search };

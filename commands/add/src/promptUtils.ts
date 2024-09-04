export const TEMPLATE_TYPE = [
	{
		name: '代码片段',
		value: 'fragment'
	},
	{
		name: '组件',
		value: 'component'
	}
];

export const modulePrompt = {
	message: '请选择代码复用类型',
	choices: TEMPLATE_TYPE
};

export const namePrompt = {
	message: `生成代码文件名：`,
	validate: (value: string) => (!value || !value.trim() ? `名称不能为空` : true)
};

const namePatterns: Record<string, RegExp> = {
	swr: /^use(-[a-z]+)+$/,
	context: /^use[A-Z][a-zA-Z]*Context$/,
	component: /^[A-Z][a-zA-Z]*$/
};

const defaultValues: Record<string, string> = {
	swr: 'use-example',
	context: 'useExampleContext',
	component: 'MyExample'
};

const errorMessages: Record<string, string> = {
	swr: '名称格式不正确，必须是 use-xxx 或 use-xxx-xxx 格式',
	context: '名称格式不正确，必须是以 "use" 开头，驼峰命名，且以 "Context" 结尾',
	component: '名称格式不正确，必须是以大写字母开头的驼峰命名格式'
};

export const getNamePrompt = (type: string) => ({
	message: `生成代码文件名：`,
	default: defaultValues[type],
	validate: (value: string) => {
		const trimmedValue = value.trim();
		if (!trimmedValue) {
			return '名称不能为空';
		}
		const regex = namePatterns[type];
		if (regex && !regex.test(trimmedValue)) {
			return errorMessages[type];
		}
		return true;
	}
});

export const getCopyPathPrompt = (defaultPath: string) => {
	return {
		message: `代码生成在哪个文件下？`,
		default: defaultPath,
		validate: (value: string) =>
			!value || !value.trim() ? `路径不能为空` : true
	};
};

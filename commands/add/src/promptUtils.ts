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
	message: `请输入生成文件名称`,
	validate: (value: string) => (!value || !value.trim() ? `名称不能为空` : true)
};

export const getCopyPathPrompt = (defaultPath: string) => {
	return {
		message: `请输入拷贝的相对路径`,
		default: defaultPath,
		validate: (value: string) =>
			!value || !value.trim() ? `路径不能为空` : true
	};
};

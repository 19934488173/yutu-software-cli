import { TEMPLATE_LIST } from './dataSource';
import { TemplateModuleType, TemplateModules } from './types';

/** 模版类型选项 */
export const TEMPLATE_TYPE = Object.values(TemplateModules).map((value) => ({
	name: value,
	value
}));

/** 根据模块类型筛选模板列表 */
const filterTemplatesByModule = (module: TemplateModuleType) =>
	TEMPLATE_LIST.filter((item) => item.module === module);

export const modulePrompt = {
	message: '请选择代码复用类型',
	choices: TEMPLATE_TYPE
};

export const getNpmNamePrompt = (module: TemplateModuleType) => {
	const choices = filterTemplatesByModule(module);
	return {
		message: `请选择${module}模板`,
		choices
	};
};

export const namePrompt = {
	message: `请输入模版名称`,
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

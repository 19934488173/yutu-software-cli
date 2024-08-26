import inquirer from 'inquirer';
import {
	ADD_MODE_PAGE,
	PAGE_TEMPLATE_LIST,
	SECTION_TEMPLATE_LIST,
	TEMPLATE_TYPE
} from './dataSource';

/** 选择代码模版形式 */
export const getAddMode = async () => {
	const { addModule } = await inquirer.prompt({
		type: 'list',
		name: 'addModule',
		message: '请选择代码复用模式',
		choices: TEMPLATE_TYPE
	} as any);
	return addModule;
};

/** 选择代码模版 */
export const getTemplate = async (addModule: string) => {
	const { template } = await inquirer.prompt({
		type: 'list',
		name: 'template',
		message: `请选择${addModule === ADD_MODE_PAGE ? '页面' : '代码片段'}模板`,
		choices:
			addModule === ADD_MODE_PAGE ? PAGE_TEMPLATE_LIST : SECTION_TEMPLATE_LIST
	} as any);
	return template;
};

/** 输入模版名称 */
export const getTemplateName = async (defaultName: string) => {
	const { templateName } = await inquirer.prompt({
		type: 'input',
		name: 'templateName',
		message: '请输入模板名称',
		default: defaultName,
		validate: (value: string) =>
			!value || !value.trim() ? '模板名称不能为空' : true
	} as any);
	return templateName;
};

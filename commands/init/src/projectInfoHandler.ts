import inquirer from 'inquirer';
import semver from 'semver';
import {
	IProjectInfo,
	TYPE_PROJECT,
	TYPE_COMPONENT,
	IProjectTemplate
} from './types';
import getProjectTemplate from './projectTemplate';

/** 校验名称是否合法 */
const isValidName = (name: string) => {
	const namePattern =
		/^(@[a-zA-Z0-9-_]+\/)?[a-zA-Z]+([-][a-zA-Z][a-zA-Z0-9]*|[_][a-zA-Z][a-zA-Z0-9]*|[a-zA-Z0-9])*$/;
	return namePattern.test(name);
};

/** 校验版本号是否合法 */
const isValidVersion = (version: string) => {
	return semver.valid(version) !== null;
};

/** 过滤版本号为有效的形式 */
const filterVersion = (version: string) => {
	return semver.valid(version) || version;
};

/** 创建项目模板选项  */
const createTemplateChoices = (): Array<{
	name: string;
	value: IProjectTemplate;
}> => {
	return getProjectTemplate().map((template) => ({
		name: template.name,
		value: template
	}));
};

/** 获取项目相关问题配置 */
const getProjectQuestions = (projectName: string) => [
	{
		type: 'input',
		name: 'projectName',
		message: '请输入项目名称（例如 my-project）：',
		default: projectName,
		validate: (name: string) =>
			isValidName(name)
				? true
				: '请输入合法的项目名称（字母、数字、下划线和短横线组成）'
	},
	{
		type: 'input',
		name: 'projectVersion',
		message: '请输入项目版本号（例如 1.0.0）：',
		default: '1.0.0',
		validate: (version: string) =>
			isValidVersion(version) ? true : '请输入合法的版本号（符合 semver 规范）',
		filter: filterVersion
	},
	{
		type: 'list',
		name: 'projectTemplate',
		message: '请选择项目模板：',
		choices: createTemplateChoices()
	}
];

/** 获取组件相关问题配置 */
const getComponentQuestions = () => {
	// TODO: 根据需要实现组件类型相关的提问逻辑
	return [];
};

/** 根据项目类型获取对应的问题配置 */
const getQuestionsForType = (type: string, projectName: string) => {
	switch (type) {
		case TYPE_PROJECT:
			return getProjectQuestions(projectName);
		case TYPE_COMPONENT:
			return getComponentQuestions();
		default:
			throw new Error(`Unsupported project type: ${type}`);
	}
};

/** 获取项目信息 */
const getProjectInfo = async (projectName: string) => {
	let projectInfo = {} as IProjectInfo;
	//校验项目名称是否合法
	const isProjectNameValid = isValidName(projectName);
	// 如果项目名称合法，则直接赋值
	if (isProjectNameValid) {
		projectInfo.projectName = projectName;
	}

	try {
		// 选择初始化项目类型
		const { type } = await inquirer.prompt({
			type: 'list',
			name: 'type',
			message: '请选择初始化项目类型：',
			default: TYPE_PROJECT,
			choices: [
				{ name: '项目', value: TYPE_PROJECT },
				{ name: '组件', value: TYPE_COMPONENT }
			]
		} as any);

		// 获取对应类型的问题配置
		const questions = getQuestionsForType(type, projectName);
		const responses = await inquirer.prompt(questions as any);

		// 整合项目信息
		projectInfo = { ...projectInfo, ...responses, type };

		// 返回完整的项目信息
		return projectInfo;
	} catch (error) {
		console.error('获取项目信息时出错：', error);
		throw new Error('获取项目信息时出错');
	}
};

export default getProjectInfo;

import inquirer from 'inquirer';
import semver from 'semver';
import { IProjectInfo, TYPE_PROJECT, TYPE_COMPONENT } from './types';
import getProjectTemplate from './projectTemplate';

// 校验项目名称是否合法
const isValidName = (v: string): boolean =>
	/^(@[a-zA-Z0-9-_]+\/)?[a-zA-Z]+([-][a-zA-Z][a-zA-Z0-9]*|[_][a-zA-Z][a-zA-Z0-9]*|[a-zA-Z0-9])*$/.test(
		v
	);

// 创建模板选项
const createTemplateChoice = () => {
	const projectTemplate = getProjectTemplate();
	return projectTemplate.map((item) => {
		return {
			name: item.name,
			value: item
		};
	});
};

const getProjectInfo = async (projectName: string) => {
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

	let projectInfo = {} as IProjectInfo;

	// 项目模版
	if (type === TYPE_PROJECT) {
		const project = await inquirer.prompt([
			{
				type: 'input',
				name: 'projectName',
				message: '请输入项目名称：',
				default: projectName,
				validate: (name: string) => {
					return isValidName(name) ? true : '请输入合法名称';
				}
			},
			{
				type: 'input',
				name: 'projectVersion',
				message: '请输入项目版本号：',
				default: '1.0.0',
				validate: (version: string) => {
					return semver.valid(version) ? true : '请输入合法的版本号';
				},
				filter: (v: string) => semver.valid(v) || v
			},
			{
				type: 'list',
				name: 'projectTemplate',
				message: '请选择项目模板',
				choices: createTemplateChoice()
			}
		] as any);

		projectInfo = { type, ...project };
	}
	/// 组件模版
	if (type === TYPE_COMPONENT) {
		projectInfo = { type };
	}

	return projectInfo;
};

export default getProjectInfo;

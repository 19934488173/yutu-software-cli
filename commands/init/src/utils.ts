import semver from 'semver';
import fs from 'fs';
import { PROJECT_LIST } from './dataSource';

// 判断目录是否为空
export function isDirEmpty(localPath: string) {
	let fileList = fs.readdirSync(localPath);
	//过滤掉.开头的文件和node_modules
	fileList = fileList.filter(
		(file) => !file.startsWith('.') && !['node_modules'].includes(file)
	);
	return fileList.length === 0;
}

/** 校验名称是否合法 */
export const isValidName = (name: string) => {
	const namePattern =
		/^(@[a-zA-Z0-9-_]+\/)?[a-zA-Z]+([-][a-zA-Z][a-zA-Z0-9]*|[_][a-zA-Z][a-zA-Z0-9]*|[a-zA-Z0-9])*$/;
	return namePattern.test(name);
};

/** 校验版本号是否合法 */
export const isValidVersion = (version: string) => {
	return semver.valid(version) !== null;
};

/** 过滤版本号为有效的形式 */
export const filterVersion = (version: string) => {
	return semver.valid(version) || version;
};

export const getNamePrompt = (defaultName: string) => {
	return {
		message: `请输入项目名称（例如 my-project）：`,
		default: defaultName,
		validate: (name: string) =>
			isValidName(name)
				? true
				: '请输入合法的项目名称（字母、数字、下划线和短横线组成）'
	};
};

export const versionPrompt = {
	message: `请输入项目版本号（例如 1.0.0）：`,
	default: '1.0.0',
	validate: (version: string) =>
		isValidVersion(version) ? true : '请输入合法的版本号（符合 semver 规范）',
	filter: filterVersion
};

export const projectPrompt = {
	message: '请选择项目模板：',
	choices: PROJECT_LIST
};

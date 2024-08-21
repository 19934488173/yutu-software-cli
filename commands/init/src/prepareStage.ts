import inquirer from 'inquirer';
import { emptyDirSync, isDirEmpty } from './fsUtils';
import getProjectTemplate from './projectTemplate';
import { IPrepareOptions } from './types';
import getProjectInfo from './projectInfoHandler';

// 提取询问确认的通用函数
const askConfirmation = async (message: string) => {
	const question: any = {
		type: 'confirm',
		name: 'confirmation',
		default: false,
		message
	};
	const { confirmation } = await inquirer.prompt([question]);
	return confirmation;
};

//准备阶段逻辑
const prepareStage = async (options: IPrepareOptions) => {
	const { projectName, force } = options;
	const template = getProjectTemplate();
	if (!template || template.length === 0) throw new Error('项目模板不存在');

	// 获取当前执行路径
	const currentPath = process.cwd();

	// 检查当前目录是否为空
	if (!isDirEmpty(currentPath)) {
		if (!force) {
			const ifContinue =
				await askConfirmation('当前文件夹不为空，是否继续创建项目？');
			if (!ifContinue) return null;
		}

		// 如果用户选择继续或者强制执行
		const confirmDelete =
			await askConfirmation('是否确认清空当前目录下的文件？');
		if (confirmDelete) {
			try {
				emptyDirSync(currentPath);
			} catch (error: any) {
				throw new Error(`清空目录失败: ${error.message}`);
			}
		}
	}

	// 获取项目信息
	try {
		return await getProjectInfo(projectName);
	} catch (error: any) {
		throw new Error(`获取项目信息失败: ${error.message}`);
	}
};

export default prepareStage;

import inquirer from 'inquirer';
import { emptyDirSync, isDirEmpty } from './fsUtils';
import getProjectTemplate from './projectTemplate';
import { IPrepareOptions } from './types';
import getProjectInfo from './projectInfoHandler';

//准备阶段逻辑
const prepareStage = async (options: IPrepareOptions) => {
	const { projectName, force } = options;
	const template = getProjectTemplate();
	if (!template || template.length === 0) throw new Error('项目模板不存在');

	// 获取当前执行路径
	const localPath = process.cwd();

	// 检查当前目录是否为空
	if (!isDirEmpty(localPath)) {
		// 是否继续的标志
		let ifContinue = false;
		// 如果不强制执行，询问用户是否继续
		if (!force) {
			const confirmQuestion: any = {
				type: 'confirm',
				name: 'ifContinue',
				default: false,
				message: '当前文件夹不为空，是否继续创建项目？'
			};
			const response = await inquirer.prompt([confirmQuestion]);
			ifContinue = response.ifContinue;

			if (!ifContinue) return null;
		}

		// 如果用户选择继续或者强制执行
		if (!ifContinue || force) {
			// 询问用户是否确认清空当前目录下的文件
			const confirmDeleteQuestion: any = {
				type: 'confirm',
				name: 'confirmDelete',
				default: false,
				message: '是否确认清空当前目录下的文件？'
			};
			const { confirmDelete } = await inquirer.prompt([confirmDeleteQuestion]);
			// 如果用户确认删除，清空当前目录
			if (confirmDelete) {
				emptyDirSync(localPath);
			}
		}
	}
	return await getProjectInfo(projectName);
};

export default prepareStage;

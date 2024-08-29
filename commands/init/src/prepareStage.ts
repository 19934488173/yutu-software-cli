import {
	confirm,
	safeSelectPrompt,
	input
} from '@yutu-software-cli/inquirer-prompts';
import { catchError } from '@yutu-software-cli/share-utils';
import { fse } from '@yutu-software-cli/ejs-render';
import { isDirEmpty } from './utils';
import { IPrepareOptions, IProjectInfo } from './types';
import { getNamePrompt, projectPrompt, versionPrompt } from './utils';
import { PROJECT_LIST } from './dataSource';

//准备阶段逻辑
const prepareStage = async (options: IPrepareOptions) => {
	const { projectName, force } = options;

	let projectInfo = {} as IProjectInfo;

	// 获取当前执行路径
	const currentPath = process.cwd();

	// 1, 检查当前目录是否为空
	if (!isDirEmpty(currentPath)) {
		if (!force) {
			const ifContinue = await confirm({
				message: '当前文件夹不为空，是否继续创建项目？'
			});
			if (!ifContinue) return null;
		}

		// 如果用户选择继续或者强制执行
		const confirmDelete = await confirm({
			message: '是否确认清空当前目录下的文件?'
		});
		if (confirmDelete) {
			try {
				fse.emptyDirSync(currentPath);
			} catch (error) {
				catchError({ msg: '清空目录失败:', error });
			}
		}
	}

	// 2, 获取项目信息
	try {
		// 输入新建项目名称
		const name = await input(getNamePrompt(projectName));
		// 输入新建项项目版本号
		const version = await input(versionPrompt);
		// 选择项目模版
		const npmName = await safeSelectPrompt(projectPrompt);

		// 查找对应的模板信息
		const template = PROJECT_LIST.find((item) => item.value === npmName);

		if (!template) {
			catchError({ msg: '未找到对应的模板信息' });
		} else {
			projectInfo = {
				...template,
				projectName: name,
				projectVersion: version
			};
		}
	} catch (error) {
		catchError({ msg: '获取项目信息失败:', error });
	}

	return projectInfo;
};

export default prepareStage;

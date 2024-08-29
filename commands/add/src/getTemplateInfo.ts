import { safeSelectPrompt, input } from '@yutu-software-cli/inquirer-prompts';
import { catchError } from '@yutu-software-cli/share-utils';
import { TEMPLATE_LIST } from './dataSource';
import {
	getNpmNamePrompt,
	namePrompt,
	modulePrompt,
	getCopyPathPrompt
} from './promptUtils';
import { ITemplateInfo } from './types';

/*  获取用户选择的模板信息 */
const getTemplateInfo = async () => {
	// 代码复用详细信息存储
	let templateInfo = {} as ITemplateInfo;

	try {
		// 获取代码复用模式
		const module = await safeSelectPrompt(modulePrompt);
		// 获取模板npmName
		const npmName = await safeSelectPrompt(getNpmNamePrompt(module));
		//输入生成文件名名称
		const templateName = await input(namePrompt);
		// 查找对应的模板信息
		const template = TEMPLATE_LIST.find((item) => item.value === npmName);
		//输入复制路径
		const copyPath = await input(getCopyPathPrompt(template?.copyPath || ''));
		// 如果找到模板信息，添加用户输入的模板名称
		if (!template) {
			catchError({ msg: '未找到对应的模板信息' });
		} else {
			templateInfo = {
				...template,
				copyPath,
				templateName
			};
		}
		return templateInfo;
	} catch (error) {
		catchError({ msg: '获取模板信息时发生错误:', error });
	}
};

export default getTemplateInfo;

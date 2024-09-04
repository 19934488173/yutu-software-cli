import { safeSelectPrompt, input } from '@yutu-software-cli/inquirer-prompts';
import { catchError } from '@yutu-software-cli/share-utils';
import { TEMPLATE_LIST } from './dataSource';
import { namePrompt, modulePrompt, getCopyPathPrompt } from './promptUtils';
import { ITemplateInfo } from './types';

/*  获取用户选择的模板信息 */
const getTemplateInfo = async () => {
	try {
		// 获取代码复用模式
		const module = await safeSelectPrompt(modulePrompt);
		let npmName: string;
		//处理模版代码片段
		if (module === 'fragment') {
			// 查找对应的模板信息
			const fragmentList = TEMPLATE_LIST.filter(
				(item) => item.module === module
			);
			// 如果找到模板信息，添加用户输入的模板名称
			npmName = await safeSelectPrompt({
				message: '请选择代码模板',
				choices: fragmentList
			});
		} else {
			//输入已有的组件名称
			npmName = await input({
				message: '请输入组件名称',
				default: 'BaseChart'
			});
		}
		//输入生成文件名名称
		const templateName = await input(namePrompt);
		// 查找对应的模板信息
		const template = TEMPLATE_LIST.find((item) => item.value === npmName);
		//输入复制路径
		const copyPath = await input(getCopyPathPrompt(template?.copyPath || ''));
		//如果找到模板信息，添加用户输入的模板名称
		if (!template) {
			catchError({ msg: '未找到对应的模板信息' });
		}
		return {
			...template,
			copyPath,
			templateName
		};
	} catch (error) {
		catchError({ msg: '获取模板信息时发生错误:', error });
	}
};

export default getTemplateInfo;

import CommandHandler from '@amber-yutu-cli/command-handler';
import createLogger from '@amber-yutu-cli/debug-log';
import prepareStage from './prepareStage';
import { downloadTemplate, installTemplate } from './templateHandler';
import getProjectTemplate from './projectTemplate';

// InitCommand 类，继承自 CommandHandler 基类，初始化命令的执行逻辑
class InitCommand extends CommandHandler {
	private projectName: string | undefined;
	private force: boolean | undefined;
	//日志记录器
	private logger: ReturnType<typeof createLogger> | undefined;

	//初始化命令参数
	init() {
		this.logger = createLogger('@amber-yutu-cli:init');

		this.projectName = this._argv[0] || '';
		this.force = this._argv[1]?.force || false;

		this.logger.log('projectName', this.projectName);
		this.logger.log('force', this.force);
	}

	// 命令执行的主逻辑
	public async exec() {
		try {
			// 1,调用 prepareStage 函数，获取项目信息
			const projectInfo = await prepareStage({
				projectName: this.projectName!,
				force: this.force!
			});
			if (projectInfo) {
				// 获取可用的项目模板列表
				const templateList = getProjectTemplate();

				// 根据项目信息，获取对应的模板信息
				const templateInfo = templateList.find(
					(item) => item.npmName === projectInfo.projectTemplate.npmName
				);

				this.logger?.log('templateInfo', templateInfo);

				// 如果模板信息不存在，抛出错误
				if (!templateInfo) {
					throw new Error('项目模板信息不存在');
				}
				// 2,调用 downloadTemplate 函数，下载模板
				await downloadTemplate(templateInfo, this.logger!);
				// 3,调用 installTemplate 函数，安装模板
				await installTemplate(templateInfo, projectInfo, this.logger!);
			}
		} catch (e) {
			this.logger?.error(e);
		}
	}
}

export default InitCommand;

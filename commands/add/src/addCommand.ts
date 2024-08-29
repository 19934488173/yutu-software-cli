import CommandHandler from '@yutu-software-cli/command-handler';
import createLogger from '@yutu-software-cli/debug-log';
import { catchError } from '@yutu-software-cli/share-utils';
import { ITemplateInfo } from './types';
import getTemplateInfo from './getTemplateInfo';
import InstallService from './installService';

class AddCommand extends CommandHandler {
	private logger = createLogger('@yutu-software-cli:add');
	private templateInfo: ITemplateInfo | undefined = undefined;

	init() {}

	/* 命令执行的主逻辑 */
	public async exec() {
		try {
			// 获取模板信息
			await this.prepareTemplateInfo();
			// 执行安装服务
			await this.executeInstallService();
		} catch (error) {
			catchError({ msg: 'add命令执行失败:', error });
		}
	}

	/** 获取模板信息 */
	private async prepareTemplateInfo() {
		this.templateInfo = await getTemplateInfo();

		if (!this.templateInfo) {
			throw new Error('获取模板信息失败');
		}
		this.logger.info('模版信息：', this.templateInfo);
	}

	/** 执行安装服务 */
	private async executeInstallService() {
		if (!this.templateInfo) {
			throw new Error('模板信息未定义，无法执行安装');
		}
		const installService = new InstallService(this.templateInfo);
		await installService.installModule();
	}
}

export default AddCommand;

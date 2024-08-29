import CommandHandler from '@yutu-software-cli/command-handler';
import createLogger from '@yutu-software-cli/debug-log';
import { catchError } from '@yutu-software-cli/share-utils';
import prepareStage from './prepareStage';
import InstallService from './installService';
import { IProjectInfo } from './types';

// InitCommand 类，继承自 CommandHandler 基类，初始化命令的执行逻辑
class InitCommand extends CommandHandler {
	private logger = createLogger('@yutu-software-cli:init');
	private projectName = '';
	private force = false;
	private projectInfo: IProjectInfo | null = null;

	//初始化命令参数
	init() {
		this.projectName = this._argv[0] || '';
		this.force = this._argv[1]?.force || false;
	}

	// 命令执行的主逻辑
	public async exec() {
		try {
			// 1,获取项目信息
			await this.prepareProjectInfo();
			// 执行安装服务
			await this.executeInstallService();
		} catch (error) {
			catchError({ msg: 'init命令执行失败:', error });
		}
	}

	/** 获取模板信息 */
	private async prepareProjectInfo() {
		this.projectInfo = await prepareStage({
			projectName: this.projectName,
			force: this.force
		});

		if (!this.projectInfo) {
			throw new Error('获取模板信息失败');
		}
		this.logger.info('模版信息：', this.projectInfo);
	}

	/** 执行安装服务 */
	private async executeInstallService() {
		if (!this.projectInfo) {
			throw new Error('模板信息未定义，无法执行安装');
		}
		const installService = new InstallService(this.projectInfo);
		// 2,下载模板
		await installService.installModule();
		// 3,安装模板
		// await installService.install();
	}
}

export default InitCommand;

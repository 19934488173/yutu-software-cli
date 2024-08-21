import CommandHandler from '@yutu-software-cli/command-handler';
import createLogger from '@yutu-software-cli/debug-log';
import prepareStage from './prepareStage';
import TemplateInstaller from './templateInstaller';

// InitCommand 类，继承自 CommandHandler 基类，初始化命令的执行逻辑
class InitCommand extends CommandHandler {
	private projectName: string | undefined;
	private force: boolean | undefined;
	//日志记录器
	private logger: ReturnType<typeof createLogger> | undefined;

	//初始化命令参数
	init() {
		this.logger = createLogger('@yutu-software-cli:init');

		this.projectName = this._argv[0] || '';
		this.force = this._argv[1]?.force || false;

		this.logger.log('projectName', this.projectName);
		this.logger.log('force', this.force);
	}

	// 命令执行的主逻辑
	public async exec() {
		try {
			// 1,获取项目信息
			const projectInfo = await prepareStage({
				projectName: this.projectName!,
				force: this.force!
			});

			if (projectInfo) {
				this.logger?.log('projectInfo', projectInfo);

				// 创建模版安装器
				const templateInstaller = new TemplateInstaller(
					projectInfo,
					this.logger!
				);

				// 2,下载模板
				await templateInstaller.download();
				// 3,安装模板
				await templateInstaller.install();
			}
		} catch (e) {
			this.logger?.error(e);
		}
	}
}

export default InitCommand;

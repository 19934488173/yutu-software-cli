import CommandHandler from '@yutu-software-cli/command-handler';
import createLogger from '@yutu-software-cli/debug-log';

import { getAddMode } from './templateService';
import InstallService from './installService';
import { ADD_MODE_SECTION } from './dataSource';

// AddCommand 类，继承自 CommandHandler 基类
class AddCommand extends CommandHandler {
	private templateName: string;
	private force: boolean | undefined;
	private logger: ReturnType<typeof createLogger> | undefined;

	//初始化命令参数
	init() {
		this.logger = createLogger('@yutu-software-cli:add');
		this.templateName = this._argv[0] || '';
		this.force = this._argv[1]?.force || false;
		this.logger.log('templateName', this.templateName);
		this.logger.log('force', this.force);
	}

	// 命令执行的主逻辑
	public async exec() {
		try {
			// 获取添加模式
			const addModule = await getAddMode();
			if (!addModule) {
				this.logger?.error('请选择添加模式');
				return;
			}

			// 执行安装服务
			const installService = new InstallService(
				this.logger!,
				addModule,
				this.templateName
			);
			await installService.installModule();
		} catch (e) {
			this.logger?.error(e);
		}
	}
}

export default AddCommand;

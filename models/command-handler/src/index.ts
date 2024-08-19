import semver from 'semver';
import chalk from 'chalk';
import createLogger from '@yutu-software-cli/debug-log';

// 设置最低支持的Node.js版本号
export const LOWEST_NODE_VERSION = '12.0.0';

// 命令类，所有命令都将继承自该类
abstract class CommandHandler {
	protected _argv: any[];
	protected _cmd!: any;
	private runner: Promise<void>;

	constructor(argv: string[]) {
		//注册日志空间
		const logger = createLogger('@yutu-software-cli:command-handler');

		// 检查参数是否为空
		if (!argv) {
			throw new Error('参数不能为空');
		}

		// 检查参数是否为数组
		if (!Array.isArray(argv)) {
			throw new Error('参数必须为数组！');
		}

		// 检查参数数组是否为空
		if (argv.length < 1) {
			throw new Error('参数列表为空！');
		}

		this._argv = argv;

		// 初始化Promise链，确保命令执行流程顺序
		const runner = new Promise<void>((resolve, reject) => {
			let chain = Promise.resolve();
			chain = chain.then(() => this.checkNodeVersion());
			chain = chain.then(() => this.initArgs());
			chain = chain.then(() => this.init());
			chain = chain.then(() => this.exec());
			chain.then(resolve).catch((err) => {
				// 捕获执行流程中的错误并记录日志
				logger.error(err.message);
				reject(err);
			});
		});

		// 将runner存储为实例属性，方便后续使用
		this.runner = runner;
	}

	// 检查Node.js版本号是否满足最低要求
	private checkNodeVersion() {
		// 获取当前Node.js版本号
		const currentVersion = process.version;
		// 比较当前版本号是否不低于最低要求版本号
		if (!semver.gte(currentVersion, LOWEST_NODE_VERSION)) {
			throw new Error(
				chalk.red(
					`yutu-software-cli 需要安装v${LOWEST_NODE_VERSION}以上版本的Node.js`
				)
			);
		}
	}

	// 参数初始化操作
	private initArgs(): void {
		// 提取命令行最后一个参数作为命令
		this._cmd = this._argv[this._argv.length - 1];
		// 将剩余的参数存储为命令行参数
		this._argv = this._argv.slice(0, this._argv.length - 1);
	}

	// 命令准备阶段，子类必须实现该方法
	protected abstract init(): void;

	// 命令执行阶段，子类必须实现该方法
	protected abstract exec(): void;
}

export default CommandHandler;

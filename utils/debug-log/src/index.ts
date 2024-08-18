import chalk from 'chalk';
import debug from 'debug';

/**
 * 打印日志封装
 * @param namespace
 * @returns
 */
const createLogger = (namespace: string) => {
	// 如果 DEBUG 环境变量未设置或与当前命名空间不匹配，则动态设置 DEBUG 环境变量
	if (process.env.DEBUG || !process.env.DEBUG!.includes(namespace)) {
		//在运行时动态启用或更新调试输出，而不需要重新启动进程。
		debug.enable(process.env.DEBUG!);
	}

	const logger = debug(namespace);

	return {
		log: (...args: any[]) => logger(args),
		info: (...args: any[]) => logger('INFO:', ...args),
		warn: (...args: any[]) => {
			const coloredArgs = args.map((arg) => chalk.yellow(arg));
			logger('WARN:', ...coloredArgs);
		},
		error: (...args: any[]) => {
			const coloredArgs = args.map((arg) => chalk.red(arg));
			logger('ERROR:', ...coloredArgs);
		}
	};
};

export default createLogger;

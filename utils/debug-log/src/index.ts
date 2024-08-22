import chalk from 'chalk';
import debug from 'debug';

/**
 * 打印日志封装
 * @param namespace
 * @returns
 */
const createLogger = (namespace: string) => {
	// 如果 DEBUG 环境变量未设置或与当前命名空间不匹配，则动态设置 DEBUG 环境变量
	if (process.env.DEBUG || !process.env.DEBUG?.includes(namespace)) {
		//在运行时动态启用或更新调试输出，而不需要重新启动进程。
		debug.enable(process.env.DEBUG!);
	}

	const logger = debug(namespace);

	// 通用的日志打印方法
	const logWithColor = (
		prefix: string,
		colorFn: (text: string) => string,
		...args: any[]
	) => {
		const coloredArgs = args.map((arg) =>
			typeof arg === 'string' ? colorFn(arg) : arg
		);
		logger(prefix, ...coloredArgs);
	};

	return {
		log: (...args: any[]) => logger(args),
		info: (...args: any[]) => logger('INFO:', ...args),
		success: (...args: any[]) => logWithColor('SUCCESS:', chalk.green, ...args),
		warn: (...args: any[]) => logWithColor('WARN:', chalk.yellow, ...args),
		error: (...args: any[]) => logWithColor('ERROR:', chalk.red, ...args)
	};
};

export default createLogger;

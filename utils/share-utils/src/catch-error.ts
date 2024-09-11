//统一的捕获错误退出程序方法 inquirer
interface CatchErrorOptions {
	msg?: string;
	error?: any;
	exitCode?: number;
	logger?: { error: (msg: string) => void }; // 可选的自定义日志工具
	onErrorHandled?: () => void; // 可选的错误处理后的回调函数
	spinner?: any;
}
const catchError = (options: CatchErrorOptions) => {
	const {
		msg = '',
		error = null,
		exitCode = 1,
		logger = console, // 默认使用 console 打印日志
		onErrorHandled,
		spinner
	} = options;

	if (spinner) {
		// 清除 spinner 的输出
		spinner.stop(true);
		process.stdout.write('\x1B[2K\r'); // 清除当前行
	}

	// 错误信息处理
	if (error) {
		logger.error(`${msg} ${error.message}`);
		logger.error(error.stack);
	} else {
		logger.error(`${msg}`);
	}

	// 执行错误处理后的回调（如清理操作）
	if (onErrorHandled && typeof onErrorHandled === 'function') {
		onErrorHandled();
	}

	// 退出进程，使用指定的退出码
	process.exit(exitCode);
};

export default catchError;

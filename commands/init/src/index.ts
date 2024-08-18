import InitCommand from './initCommand';

// 在子进程中初始化脚手架 init 事件
const init = () => {
	const args = process.argv.slice(2);
	const parsedArgs = JSON.parse(args[0]);
	return new InitCommand(parsedArgs);
};
// 调用 init 函数，启动命令执行流程
init();

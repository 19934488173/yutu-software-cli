import { spawn as cpSpawn, SpawnOptions, ChildProcess } from 'child_process';

/**
 * 执行命令，并确保在 Windows 上使用 `cmd` 执行，以确保系统兼容性。
 *
 * @param command - 要执行的命令
 * @param args - 命令的参数列表
 * @param options - 可选的命令执行选项
 * @returns 返回一个 ChildProcess 对象，表示子进程
 */
const spawnPlus = (
	command: string,
	args: string[],
	options?: SpawnOptions
): ChildProcess => {
	const isWin32 = process.platform === 'win32';

	// 在 Windows 系统上使用 `cmd` 执行命令
	const cmd = isWin32 ? 'cmd' : command;
	const cmdArgs = isWin32 ? ['/c', command, ...args] : args;

	return cpSpawn(cmd, cmdArgs, options || {});
};

export default spawnPlus;

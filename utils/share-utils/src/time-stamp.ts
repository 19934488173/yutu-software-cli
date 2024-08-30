import path from 'path';
import fs from 'fs/promises';

// 检查是否超过指定的时间间隔（以毫秒为单位）
export const shouldUpdate = async (
	targetPath: string,
	interval: number,
	timestampFileName: string
): Promise<boolean> => {
	const timestampFile = path.resolve(targetPath, timestampFileName);
	try {
		const lastUpdate = await fs.readFile(timestampFile, 'utf-8');
		const lastUpdateTime = new Date(parseInt(lastUpdate, 10));
		const now = new Date();
		// 检查是否超过指定的时间间隔
		return now.getTime() - lastUpdateTime.getTime() > interval;
	} catch {
		// 如果读取文件时出错（例如文件不存在），则应更新
		return true;
	}
};

// 将当前时间写入时间戳文件
export const updateTimestamp = async (
	targetPath: string,
	timestampFileName: string
) => {
	const timestampFile = path.resolve(targetPath, timestampFileName);
	await fs.writeFile(timestampFile, Date.now().toString(), 'utf-8');
};

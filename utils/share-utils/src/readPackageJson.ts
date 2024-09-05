import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * 读取指定路径的 package.json 文件
 * @param {string} packageJsonPath - package.json 的相对路径
 * @returns {Promise<Object>} - 返回解析后的 package.json 内容
 */
const readPackageJson = (path: string) => {
	try {
		// 去掉结尾的 /dist 或 \dist
		const newPath = path.replace(/[\/\\]dist$/, '');
		const fullPath = join(newPath, 'package.json'); // 构造 package.json 的绝对路径

		// 打印调试信息
		console.log(`Reading package.json from: ${fullPath}`);

		const data = readFileSync(fullPath, 'utf-8'); // 读取文件内容
		return JSON.parse(data); // 解析并返回 JSON 数据
	} catch (error) {
		console.error('Error reading package.json:', error);
		throw error; // 抛出错误以便调用者处理
	}
};

export default readPackageJson;

import path from 'path';
import ejs from 'ejs';
import fse from 'fs-extra';
import { glob } from 'glob';
import pLimit from 'p-limit';
import { IProjectInfo, IEjsRenderOptions } from './types';

const limit = pLimit(10); // 限制并发为 10

const ejsRender = async (
	projectInfo: IProjectInfo,
	options: IEjsRenderOptions = {}
) => {
	try {
		const dir = process.cwd();

		// 获取文件列表
		const files = await glob('**', {
			cwd: dir,
			ignore: options?.ignoreFiles,
			nodir: true
		});

		// 并行处理文件渲染和写入操作，使用并发限制
		await Promise.all(
			files.map((file) =>
				limit(async () => {
					const filePath = path.join(dir, file);
					const result = await ejs.renderFile(filePath, projectInfo, {});
					fse.writeFileSync(filePath, result);
				})
			)
		);
	} catch (err: any) {
		throw new Error(`EJS 渲染失败: ${err.message}`);
	}
};

export default ejsRender;

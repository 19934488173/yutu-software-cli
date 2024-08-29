import path from 'path';
import ejs from 'ejs';
import fse from 'fs-extra';
import { glob } from 'glob';
import pLimit from 'p-limit';

// 匹配 <%= 变量 %> 的正则表达式
const regex = /<%=\s*[^%]+\s*%>/;

/** 渲染单个文件并返回渲染后的内容 */
const renderFile = async <T extends ejs.Data>(filePath: string, data: T) => {
	try {
		return await ejs.renderFile(filePath, data, {});
	} catch (err: any) {
		throw new Error(`EJS 渲染失败: ${err?.message}，文件: ${filePath}`);
	}
};

/** 将渲染后的内容写入文件 */
const writeFile = (filePath: string, content: string) => {
	try {
		// 在写入文件之前，确保文件目录存在
		const dir = path.dirname(filePath);
		fse.ensureDirSync(dir);

		fse.writeFileSync(filePath, content);
	} catch (err: any) {
		throw new Error(`文件写入失败: ${err?.message}，文件: ${filePath}`);
	}
};

interface EjsRenderOptions {
	// ejs 文件所在目录,默认为当前工作目录
	ejsDir?: string;
	// 忽略文件的匹配模式
	ignoreFiles?: string[];
	// 并发限制
	concurrencyLimit?: number;
}

/** 渲染文件 */
const ejsRender = async <T extends ejs.Data>(params: {
	data: T;
	options: EjsRenderOptions;
}) => {
	const { data, options } = params;
	const {
		ejsDir = process.cwd(),
		ignoreFiles,
		concurrencyLimit = 20
	} = options;

	try {
		// 获取所有需要处理的文件和目录
		const files = await glob('**', {
			cwd: ejsDir,
			ignore: ignoreFiles,
			nodir: false
		});
		// 并发限制
		const limit = pLimit(concurrencyLimit);

		// 存储所有需要重命名的目录
		const directoriesToRename: { original: string; rendered: string }[] = [];

		await Promise.all(
			files.map((relativePath) =>
				limit(async () => {
					const originalPath = path.join(ejsDir, relativePath);
					let renderedPath = originalPath;

					// 如果路径包含模板变量，渲染路径
					if (regex.test(originalPath)) {
						renderedPath = await ejs.render(originalPath, data);
					}

					const stats = fse.statSync(originalPath);

					// 如果是目录，推迟重命名操作
					if (stats.isDirectory()) {
						if (originalPath !== renderedPath) {
							directoriesToRename.push({
								original: originalPath,
								rendered: renderedPath
							});
						}
						return;
					}

					// 如果是文件，渲染内容并写入
					const renderedContent = await renderFile(originalPath, data);

					// 写入文件前确保目录存在
					writeFile(renderedPath, renderedContent);

					// 删除原始文件
					if (renderedPath !== originalPath) {
						fse.removeSync(originalPath);
					}
				})
			)
		);

		// 在所有文件操作完成后，再处理目录重命名
		for (const { original, rendered } of directoriesToRename) {
			// 检查目标目录是否存在
			if (fse.existsSync(rendered)) {
				// 合并目录内容
				fse.copySync(original, rendered, { overwrite: true });
				fse.removeSync(original);
			} else {
				fse.renameSync(original, rendered);
			}
		}
	} catch (err: any) {
		throw new Error(`EJS 渲染失败: ${err?.message}`);
	}
};

export { ejsRender, fse };

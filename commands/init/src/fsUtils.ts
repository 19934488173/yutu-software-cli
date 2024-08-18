import fs from 'fs';
import pkg from 'fs-extra';

const { emptyDirSync, ensureDirSync, copySync } = pkg;

// 判断目录是否为空
export function isDirEmpty(localPath: string) {
	let fileList = fs.readdirSync(localPath);
	//过滤掉.开头的文件和node_modules
	fileList = fileList.filter(
		(file) => !file.startsWith('.') && !['node_modules'].includes(file)
	);
	return fileList.length === 0;
}

// 导出其他文件系统相关的函数
export { emptyDirSync, ensureDirSync, copySync };

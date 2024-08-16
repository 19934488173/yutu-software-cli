import path from 'path';

/** 格式化路径，将路径中的反斜杠转换为正斜杠 */
const formatPath = (p: string) => {
	const sep = path.sep;
	return sep === '/' ? p : p.replace(/\\/g, '/');
};

export default formatPath;

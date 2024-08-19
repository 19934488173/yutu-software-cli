import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { readPackageJson } from '@yutu-cli/share-utils';
import prepare from './prepare';
import registerCommand from './registerCommand';

// 拿到当前目录的package.json
export let pkg: any;
const getPkg = () => {
	const __dirname = dirname(fileURLToPath(import.meta.url));
	pkg = readPackageJson(__dirname);
};

// 脚手架核心入口
const cli = async () => {
	try {
		getPkg();
		await prepare();
		registerCommand();
	} catch (error) {
		console.log(error);
	}
};

export default cli;

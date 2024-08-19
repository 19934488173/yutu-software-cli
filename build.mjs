import { build } from 'esbuild';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { nodeExternalsPlugin } from 'esbuild-node-externals';

// 需要排除的包，不打包进去，减小体积的同时，也避免打包时出现循环依赖的问题，还能解决nodejs的模块查找问题
const excludeFiles = [
	'commander',
	'import-local',
	'debug',
	'root-check',
	'userhome',
	'dotenv',
	'url-join',
	'semver',
	'axios',
	'npminstall',
	'pkg-dir',
	'fs-extra',
	'inquirer',
	'cli-spinner',
	'user-home',
	'@yutu-software-cli/debug-log',
	'@yutu-software-cli/get-npm-info',
	'@yutu-software-cli/exec',
	'@yutu-software-cli/package-handler',
	'@yutu-software-cli/share-utils',
	'@yutu-software-cli/command-handler',
	'@yutu-software-cli/init'
];

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const packages = [
	path.join(__dirname, 'core/cli'),
	path.join(__dirname, 'core/exec'),
	path.join(__dirname, 'models/package-handler'),
	path.join(__dirname, 'models/command-handler'),
	path.join(__dirname, 'commands/init'),
	path.join(__dirname, 'utils/share-utils'),
	path.join(__dirname, 'utils/debug-log'),
	path.join(__dirname, 'utils/get-npm-info')
];

function hashFile(filePath) {
	const fileBuffer = fs.readFileSync(filePath);
	const hashSum = crypto.createHash('sha256');
	hashSum.update(fileBuffer);
	return hashSum.digest('hex');
}

const fileHashes = new Map();

function compilePackage(filePath, pkgPath) {
	const relativePath = path.relative(path.join(pkgPath, 'src'), filePath);
	const outPath = path.join(
		pkgPath,
		'dist',
		relativePath.replace(/\.ts$/, '.js')
	);

	const currentHash = hashFile(filePath);
	const previousHash = fileHashes.get(filePath);

	if (currentHash !== previousHash) {
		// 更新文件哈希值
		fileHashes.set(filePath, currentHash);

		build({
			entryPoints: [filePath],
			outfile: outPath,
			format: 'esm',
			sourcemap: false,
			minify: false,
			platform: 'node',
			target: 'esnext',
			bundle: true,
			plugins: [nodeExternalsPlugin()],
			external: excludeFiles
		})
			.then(() => {
				console.log(`Built ${filePath} -> ${outPath}`);
			})
			.catch(() => process.exit(1));
	} else {
		console.log(`Skipped ${filePath}, no changes detected.`);
	}
}

// 初始编译：对所有文件进行编译
packages.forEach((pkgPath) => {
	const srcPath = path.join(pkgPath, 'src');
	if (fs.existsSync(srcPath)) {
		const files = fs.readdirSync(srcPath, { withFileTypes: true });
		files.forEach((file) => {
			if (file.isFile() && file.name.endsWith('.ts')) {
				const filePath = path.join(srcPath, file.name);
				compilePackage(filePath, pkgPath);
			}
		});
	}
});

// function handleFileChange(filePath) {
// 	const pkgPath = packages.find((p) => filePath.startsWith(p));
// 	if (pkgPath) {
// 		compilePackage(filePath, pkgPath);
// 	}
// }

// 监听文件变化并触发重新编译
// const watcher = chokidar.watch(
// 	packages.map((pkgPath) => path.join(pkgPath, 'src/**/*.{ts,js}'))
// );

// watcher.on('change', handleFileChange).on('add', handleFileChange);

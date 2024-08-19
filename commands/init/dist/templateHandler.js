// commands/init/src/templateHandler.ts
import path from 'path';
import userHome from 'user-home';
import { sleep, spawnPlus, spinnerStart } from '@yutu-software-cli/share-utils';
import PackageHandler from '@yutu-software-cli/package-handler';

// commands/init/src/types.ts
var TEMPLATE_TYPE_NORMAL = 'normal';
var TEMPLATE_TYPE_CUSTOM = 'custom';

// commands/init/src/fsUtils.ts
import pkg from 'fs-extra';
var { emptyDirSync, ensureDirSync, copySync, existsSync } = pkg;

// commands/init/src/templateHandler.ts
var templateNpmInfo;
var downloadTemplate = async (templateInfo, logger) => {
	const targetPath = path.resolve(userHome, '.amber-yutu-cli', 'template');
	const storeDir = path.resolve(
		userHome,
		'.amber-yutu-cli',
		'template',
		'node_modules'
	);
	const { npmName, version } = templateInfo;
	const templateNpm = new PackageHandler({
		targetPath,
		storeDir,
		packageName: npmName,
		packageVersion: version
	});
	const templateExists = await templateNpm.exists();
	const spinnerMessage = templateExists
		? '\u6B63\u5728\u66F4\u65B0\u6A21\u677F...'
		: '\u6B63\u5728\u4E0B\u8F7D\u6A21\u677F...';
	const spinner = spinnerStart(spinnerMessage);
	await sleep();
	try {
		if (templateExists) {
			await templateNpm.update();
		} else {
			await templateNpm.install();
		}
		if (await templateNpm.exists()) {
			logger.info(
				templateExists
					? '\u66F4\u65B0\u6A21\u677F\u6210\u529F\uFF01'
					: '\u4E0B\u8F7D\u6A21\u677F\u6210\u529F\uFF01'
			);
			templateNpmInfo = templateNpm;
		}
	} catch (error) {
		throw new Error(
			`\u6A21\u677F${templateExists ? '\u66F4\u65B0' : '\u4E0B\u8F7D'}\u5931\u8D25: ${error.message}`
		);
	} finally {
		spinner.stop(true);
	}
};
var installTemplate = async (templateInfo, projectInfo, logger) => {
	try {
		templateInfo.type = templateInfo.type || TEMPLATE_TYPE_NORMAL;
		switch (templateInfo.type) {
			case TEMPLATE_TYPE_NORMAL:
				await installNormalTemplate(templateInfo, logger);
				break;
			case TEMPLATE_TYPE_CUSTOM:
				await installCustomTemplate(templateInfo, projectInfo, logger);
				break;
			default:
				throw new Error(
					`\u65E0\u6CD5\u8BC6\u522B\u7684\u9879\u76EE\u6A21\u677F\u7C7B\u578B: ${templateInfo.type}`
				);
		}
	} catch (error) {
		logger.error(`\u6A21\u677F\u5B89\u88C5\u5931\u8D25: ${error.message}`);
		throw error;
	}
};
var installNormalTemplate = async (templateInfo, logger) => {
	if (!templateNpmInfo) {
		throw new Error(
			'\u6A21\u677F\u4FE1\u606F\u4E0D\u5B58\u5728\uFF0C\u8BF7\u5148\u4E0B\u8F7D\u6A21\u677F\uFF01'
		);
	}
	logger.info('\u6A21\u677F\u4FE1\u606F', templateNpmInfo);
	const spinner = spinnerStart('\u6B63\u5728\u5B89\u88C5\u6A21\u677F...');
	await sleep();
	const targetPath = process.cwd();
	try {
		const templatePath = path.resolve(
			templateNpmInfo?.cacheFilePath,
			`node_modules/${templateInfo.npmName}/template`
		);
		ensureDirSync(templatePath);
		ensureDirSync(targetPath);
		copySync(templatePath, targetPath);
	} catch (error) {
		logger.error('\u6A21\u677F\u5B89\u88C5\u5931\u8D25', error);
		throw error;
	} finally {
		spinner.stop(true);
		logger.info('\u6A21\u677F\u5B89\u88C5\u6210\u529F');
	}
};
var installCustomTemplate = async (templateInfo, projectInfo, logger) => {
	const { exists, getRootFilePath, cacheFilePath } = templateNpmInfo;
	if (!(await exists())) {
		logger.warn(
			'\u6A21\u677F\u4FE1\u606F\u4E0D\u5B58\u5728\uFF0C\u5B89\u88C5\u7EC8\u6B62'
		);
		return;
	}
	const rootFile = getRootFilePath() || '';
	if (!existsSync(rootFile)) {
		logger.warn(
			'\u6A21\u677F\u4E3B\u5165\u53E3\u6587\u4EF6\u4E0D\u5B58\u5728\uFF0C\u5B89\u88C5\u7EC8\u6B62'
		);
		return;
	}
	logger.info('\u5F00\u59CB\u6267\u884C\u81EA\u5B9A\u4E49\u6A21\u677F');
	const templatePath = path.resolve(cacheFilePath, 'template');
	const options = {
		templateInfo,
		projectInfo,
		sourcePath: templatePath,
		targetPath: process.cwd()
	};
	await spawnPlus('node', [rootFile, JSON.stringify(options)]);
	logger.success('\u81EA\u5B9A\u4E49\u6A21\u677F\u5B89\u88C5\u6210\u529F');
};
export {
	downloadTemplate,
	installCustomTemplate,
	installNormalTemplate,
	installTemplate
};

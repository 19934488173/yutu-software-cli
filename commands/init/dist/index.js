// commands/init/src/initCommand.ts
import CommandHandler from '@amber-yutu-cli/command-handler';
import createLogger from '@amber-yutu-cli/debug-log';

// commands/init/src/prepareStage.ts
import inquirer2 from 'inquirer';

// commands/init/src/fsUtils.ts
import fs from 'fs';
import pkg from 'fs-extra';
var { emptyDirSync, ensureDirSync, copySync, existsSync } = pkg;
function isDirEmpty(localPath) {
	let fileList = fs.readdirSync(localPath);
	fileList = fileList.filter(
		(file) => !file.startsWith('.') && !['node_modules'].includes(file)
	);
	return fileList.length === 0;
}

// commands/init/src/projectTemplate.ts
var getProjectTemplate = () => {
	return [
		{
			name: 'React \u9879\u76EE\u6A21\u677F',
			version: '1.0.2',
			npmName: 'imooc-cli-dev-template-vue2',
			type: 'normal'
		}
	];
};
var projectTemplate_default = getProjectTemplate;

// commands/init/src/projectInfoHandler.ts
import inquirer from 'inquirer';
import semver from 'semver';

// commands/init/src/types.ts
var TYPE_PROJECT = 'project';
var TYPE_COMPONENT = 'component';
var TEMPLATE_TYPE_NORMAL = 'normal';
var TEMPLATE_TYPE_CUSTOM = 'custom';

// commands/init/src/projectInfoHandler.ts
var isValidName = (v) =>
	/^(@[a-zA-Z0-9-_]+\/)?[a-zA-Z]+([-][a-zA-Z][a-zA-Z0-9]*|[_][a-zA-Z][a-zA-Z0-9]*|[a-zA-Z0-9])*$/.test(
		v
	);
var createTemplateChoice = () => {
	const projectTemplate = projectTemplate_default();
	return projectTemplate.map((item) => {
		return {
			name: item.name,
			value: item
		};
	});
};
var getProjectInfo = async (projectName) => {
	const { type } = await inquirer.prompt({
		type: 'list',
		name: 'type',
		message:
			'\u8BF7\u9009\u62E9\u521D\u59CB\u5316\u9879\u76EE\u7C7B\u578B\uFF1A',
		default: TYPE_PROJECT,
		choices: [
			{ name: '\u9879\u76EE', value: TYPE_PROJECT },
			{ name: '\u7EC4\u4EF6', value: TYPE_COMPONENT }
		]
	});
	let projectInfo = {};
	if (type === TYPE_PROJECT) {
		const project = await inquirer.prompt([
			{
				type: 'input',
				name: 'projectName',
				message: '\u8BF7\u8F93\u5165\u9879\u76EE\u540D\u79F0\uFF1A',
				default: projectName,
				validate: (name) => {
					return isValidName(name)
						? true
						: '\u8BF7\u8F93\u5165\u5408\u6CD5\u540D\u79F0';
				}
			},
			{
				type: 'input',
				name: 'projectVersion',
				message: '\u8BF7\u8F93\u5165\u9879\u76EE\u7248\u672C\u53F7\uFF1A',
				default: '1.0.0',
				validate: (version) => {
					return semver.valid(version)
						? true
						: '\u8BF7\u8F93\u5165\u5408\u6CD5\u7684\u7248\u672C\u53F7';
				},
				filter: (v) => semver.valid(v) || v
			},
			{
				type: 'list',
				name: 'projectTemplate',
				message: '\u8BF7\u9009\u62E9\u9879\u76EE\u6A21\u677F',
				choices: createTemplateChoice()
			}
		]);
		projectInfo = { type, ...project };
	}
	if (type === TYPE_COMPONENT) {
	}
	return projectInfo;
};
var projectInfoHandler_default = getProjectInfo;

// commands/init/src/prepareStage.ts
var prepareStage = async (options) => {
	const { projectName, force } = options;
	const template = projectTemplate_default();
	if (!template || template.length === 0)
		throw new Error('\u9879\u76EE\u6A21\u677F\u4E0D\u5B58\u5728');
	const localPath = process.cwd();
	if (!isDirEmpty(localPath)) {
		let ifContinue = false;
		if (!force) {
			const confirmQuestion = {
				type: 'confirm',
				name: 'ifContinue',
				default: false,
				message:
					'\u5F53\u524D\u6587\u4EF6\u5939\u4E0D\u4E3A\u7A7A\uFF0C\u662F\u5426\u7EE7\u7EED\u521B\u5EFA\u9879\u76EE\uFF1F'
			};
			const response = await inquirer2.prompt([confirmQuestion]);
			ifContinue = response.ifContinue;
			if (!ifContinue) return null;
		}
		if (!ifContinue || force) {
			const confirmDeleteQuestion = {
				type: 'confirm',
				name: 'confirmDelete',
				default: false,
				message:
					'\u662F\u5426\u786E\u8BA4\u6E05\u7A7A\u5F53\u524D\u76EE\u5F55\u4E0B\u7684\u6587\u4EF6\uFF1F'
			};
			const { confirmDelete } = await inquirer2.prompt([confirmDeleteQuestion]);
			if (confirmDelete) {
				emptyDirSync(localPath);
			}
		}
	}
	return await projectInfoHandler_default(projectName);
};
var prepareStage_default = prepareStage;

// commands/init/src/templateHandler.ts
import path from 'path';
import userHome from 'user-home';
import { sleep, spawnPlus, spinnerStart } from '@amber-yutu-cli/share-utils';
import PackageHandler from '@amber-yutu-cli/package-handler';
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

// commands/init/src/initCommand.ts
var InitCommand = class extends CommandHandler {
	projectName;
	force;
	//日志记录器
	logger;
	//初始化命令参数
	init() {
		this.logger = createLogger('@amber-yutu-cli:init');
		this.projectName = this._argv[0] || '';
		this.force = this._argv[1]?.force || false;
		this.logger.log('projectName', this.projectName);
		this.logger.log('force', this.force);
	}
	// 命令执行的主逻辑
	async exec() {
		try {
			const projectInfo = await prepareStage_default({
				projectName: this.projectName,
				force: this.force
			});
			if (projectInfo) {
				const templateList = projectTemplate_default();
				const templateInfo = templateList.find(
					(item) => item.npmName === projectInfo.projectTemplate.npmName
				);
				this.logger?.log('templateInfo', templateInfo);
				if (!templateInfo) {
					throw new Error(
						'\u9879\u76EE\u6A21\u677F\u4FE1\u606F\u4E0D\u5B58\u5728'
					);
				}
				await downloadTemplate(templateInfo, this.logger);
				await installTemplate(templateInfo, projectInfo, this.logger);
			}
		} catch (e) {
			this.logger?.error(e);
		}
	}
};
var initCommand_default = InitCommand;

// commands/init/src/index.ts
var init = () => {
	const args = process.argv.slice(2);
	const parsedArgs = JSON.parse(args[0]);
	return new initCommand_default(parsedArgs);
};
init();

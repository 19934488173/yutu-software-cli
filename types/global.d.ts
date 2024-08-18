/** 定义全局下载包入参 */
interface InstallOptions {
	targetPath: string;
	packageName: string;
	packageVersion: string;
	storeDir?: string;
}

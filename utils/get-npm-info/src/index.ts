'use strict';

import axios, { AxiosResponse } from 'axios';
import urlJoin from 'url-join';
import semver from 'semver';

interface NpmInfo {
	versions: Record<string, unknown>;
}

/** 获取默认的npm注册表URL */
export function getDefaultRegistry(isOriginal: boolean = false): string {
	return isOriginal
		? 'https://registry.npmjs.org'
		: 'https://registry.npmmirror.com';
}

/** 获取npm包的版本信息 */
async function getNpmInfo(
	npmName: string,
	registry: string = getDefaultRegistry()
): Promise<NpmInfo | null> {
	if (!npmName) return null;

	const npmInfoUrl = urlJoin(registry, npmName);

	try {
		const res: AxiosResponse<NpmInfo> = await axios.get(npmInfoUrl);
		return res.status === 200 ? res.data : null;
	} catch (err) {
		// 包装错误信息，方便调试
		throw new Error(`Failed to fetch NPM info for ${npmName}: ${err}`);
	}
}

/** 获取npm包的所有版本号 */
async function getNpmVersions(
	npmName: string,
	registry?: string
): Promise<string[]> {
	const data = await getNpmInfo(npmName, registry);
	return data ? Object.keys(data.versions) : [];
}

/** 获取npm包的最新版本号 */
export async function getNpmLatestVersion(
	npmName: string,
	registry?: string
): Promise<string | null> {
	const versions = await getNpmVersions(npmName, registry);
	return versions.length > 0 ? semver.maxSatisfying(versions, '*') : null;
}

/** 获取大于当前版本号的所有版本号，并按版本号降序排序 */
function getSemverVersions(baseVersion: string, versions: string[]): string[] {
	return versions
		.filter((version) => semver.satisfies(version, `^${baseVersion}`))
		.sort(semver.rcompare); // 使用 semver.rcompare 进行降序排序
}

/** 获取大于当前版本号的最新版本号 */
export default async function getNpmSemverVersion(
	baseVersion: string,
	npmName: string,
	registry?: string
): Promise<string | undefined> {
	const versions = await getNpmVersions(npmName, registry);
	const newVersions = getSemverVersions(baseVersion, versions);
	return newVersions[0];
}

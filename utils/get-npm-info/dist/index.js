// utils/get-npm-info/src/index.ts
import axios from "axios";
import urlJoin from "url-join";
import semver from "semver";
function getDefaultRegistry(isOriginal = false) {
  return isOriginal ? "https://registry.npmjs.org" : "https://registry.npmjs.org";
}
async function getNpmInfo(npmName, registry = getDefaultRegistry()) {
  if (!npmName) return null;
  const npmInfoUrl = urlJoin(registry, npmName);
  try {
    const res = await axios.get(npmInfoUrl);
    return res.status === 200 ? res.data : null;
  } catch (err) {
    throw new Error(`Failed to fetch NPM info for ${npmName}: ${err}`);
  }
}
async function getNpmVersions(npmName, registry) {
  const data = await getNpmInfo(npmName, registry);
  return data ? Object.keys(data.versions) : [];
}
async function getNpmLatestVersion(npmName, registry) {
  const versions = await getNpmVersions(npmName, registry);
  return versions.length > 0 ? semver.maxSatisfying(versions, "*") : null;
}
function getSemverVersions(baseVersion, versions) {
  return versions.filter((version) => semver.satisfies(version, `^${baseVersion}`)).sort(semver.rcompare);
}
async function getNpmSemverVersion(baseVersion, npmName, registry) {
  const versions = await getNpmVersions(npmName, registry);
  const newVersions = getSemverVersions(baseVersion, versions);
  return newVersions[0];
}
export {
  getNpmSemverVersion as default,
  getDefaultRegistry,
  getNpmLatestVersion
};

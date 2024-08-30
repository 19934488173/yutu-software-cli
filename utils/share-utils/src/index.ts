import isObject from './isObject';
import readPackageJson from './readPackageJson';
import formatPath from './format-path';
import spawnPlus from './spawn-plus';
import sleep from './sleep';
import spinnerStart from './spinner-start';
import catchError from './catch-error';
import { shouldUpdate, updateTimestamp } from './time-stamp';

/** 公共方法导出口 */
export {
	isObject,
	readPackageJson,
	formatPath,
	spawnPlus,
	sleep,
	spinnerStart,
	catchError,
	shouldUpdate,
	updateTimestamp
};

/**
 * 检查参数是否为object
 * @param value 检查值
 */
export default function isObject(value: any) {
	return Object.prototype.toString.call(value) === '[object Object]';
}

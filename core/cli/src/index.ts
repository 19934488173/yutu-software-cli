#!/usr/bin/env node

import { a } from './cli';
import shareUtils from '@yutu-cli/share-utils';

export default function demo() {
	shareUtils();
	console.log(a);
	console.log('发布脚手架测试版本');
	return 'Hello from cli!';
}
demo();

#!/usr/bin/env node

import { a } from './cli';
import shareUtils from '@yutu-cli/share-utils';

export default function demo() {
	shareUtils();
	console.log(a);
	console.log('Hello from cli 1112');
	return 'Hello from';
}
demo();

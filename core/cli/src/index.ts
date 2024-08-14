#!/usr/bin/env node

import { a } from './cli';
import shareUtils from '@yutu-cli/share-utils';

export default function demo() {
	shareUtils();
	console.log(a);
	return 'Hello from';
}
demo();

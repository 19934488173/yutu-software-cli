#!/usr/bin/env node

import importLocal from 'import-local';
import { fileURLToPath } from 'url';
import cli from './cli';

const __filename = fileURLToPath(import.meta.url);

if (importLocal(__filename)) {
	console.log('Using local version of core-cli');
} else {
	cli();
}

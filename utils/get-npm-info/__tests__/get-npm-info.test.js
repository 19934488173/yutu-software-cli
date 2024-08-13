import getNpmInfo from '../src/get-npm-info.js';
import { strict as assert } from 'assert';

assert.strictEqual(getNpmInfo(), 'Hello from getNpmInfo');
console.info('getNpmInfo tests passed');

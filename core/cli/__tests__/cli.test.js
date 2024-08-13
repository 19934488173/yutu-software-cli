import cli from '../src/cli.js';
import { strict as assert } from 'assert';

assert.strictEqual(cli(), 'Hello from cli');
console.info('cli tests passed');

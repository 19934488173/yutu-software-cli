import git from '../src/git.js';
import { strict as assert } from 'assert';

assert.strictEqual(git(), 'Hello from git');
console.info('git tests passed');

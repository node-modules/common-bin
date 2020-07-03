#!/usr/bin/env node

'use strict';

console.log('node version: %s', process.version);
console.log('process.argv: %j', process.argv.slice(2));
console.log('process.pid: %s, process.ppid: %s', process.pid, process.ppid);

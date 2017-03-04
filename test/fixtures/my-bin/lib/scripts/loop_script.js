#!/usr/bin/env node

'use strict';

let i = 0;
setInterval(() => {
  i++;
  console.log('[child] echo', process.pid, i);
}, 300);

function exitHandler(code) {
  console.log('[child] recieve singal', code);
  process.exit(0);
}

process.once('SIGQUIT', () => exitHandler('SIGQUIT'));
process.on('SIGTERM', () => exitHandler('SIGTERM'));
process.once('SIGINT', () => exitHandler('SIGINT'));
process.once('exit', code => {
  console.info('[child] exit with code', code);
});

'use strict';

const debug = require('debug')('common-bin');
const path = require('path');
const cp = require('child_process');
const fs = require('fs');
const assert = require('assert');

const childs = new Set();
process.once('SIGINT', () => process.exit());
process.once('SIGQUIT', () => process.exit());
process.once('SIGTERM', () => process.exit());
process.once('exit', () => {
  for (const child of childs) {
    child.kill();
  }
});

exports.forkNode = (modulePath, args, opt) => {
  opt = opt || {};
  opt.stdio = opt.stdio || 'inherit';
  args = args || [];
  debug('Run fork `%j %j %j`',
    process.execPath, modulePath, args.join(' '));
  const proc = cp.fork(modulePath, args, opt);
  childs.add(proc);
  return function(cb) {
    proc.once('exit', function(code) {
      childs.delete(proc);
      if (code !== 0) {
        const err = new Error(modulePath + ' ' + args + ' exit with code ' + code);
        err.code = code;
        cb(err);
      } else {
        cb();
      }
    });
  };
};

exports.npmInstall = (npmCli, name, cwd) => {
  const options = {
    stdio: 'inherit',
    env: process.env,
    cwd,
  };

  const args = [ 'i', name ];
  console.log('[common-bin] `%s %s` to %s ...', npmCli, args.join(' '), options.cwd);

  return callback => {
    const proc = cp.spawn(npmCli, args, options);
    proc.on('error', err => {
      const cb = callback;
      callback = null;
      cb(err);
    });
    proc.on('exit', code => {
      if (!callback) return;

      if (code !== 0) {
        return callback(new Error('npm ' + args.join(' ') + ' fail, exit code: ' + code));
      }
      callback();
    });
  };
};

exports.getIronNodeBin = function* (npmCli, cwd) {
  const nodeBin = path.join(cwd, 'node_modules/iron-node/bin/run.js');
  let exists;
  try {
    exists = !!fs.statSync(nodeBin);
  } catch (_) {
    // not exists
    exists = false;
  }
  if (exists) {
    return nodeBin;
  }
  const packageName = 'iron-node@3';
  try {
    yield exports.npmInstall(npmCli, packageName, cwd);
  } catch (err) {
    if (err.code !== 'ENOENT') {
      throw err;
    }
    console.warn('[common-bin] `%s` not exists, use npm and try again', npmCli);
    // use npm and try again
    yield exports.npmInstall('npm', packageName, cwd);
  }

  assert(!!fs.statSync(nodeBin), `${nodeBin} not exists, please run "npm i ${packageName}"`);
  return nodeBin;
};

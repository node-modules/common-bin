'use strict';

const debug = require('debug')('common-bin');
const cp = require('child_process');
const is = require('is-type-of');

// only hook once and only when ever start any child.
const childs = new Set();
let hadHook = false;
function gracefull(proc) {
  // save child ref
  childs.add(proc);

  // only hook once
  /* istanbul ignore else */
  if (!hadHook) {
    hadHook = true;
    let signal;
    [ 'SIGINT', 'SIGQUIT', 'SIGTERM' ].forEach(event => {
      process.once(event, () => {
        signal = event;
        process.exit(0);
      });
    });
    process.once('exit', () => {
      // had test at my-helper.test.js, but coffee can't collect coverage info.
      for (const child of childs) {
        debug('kill child %s with %s', child.pid, signal);
        child.kill(signal);
      }
    });
  }
}

exports.forkNode = (modulePath, args, opt) => {
  opt = opt || {};
  opt.stdio = opt.stdio || 'inherit';
  args = args || [];
  debug('Run fork `%j %j %j`', process.execPath, modulePath, args.join(' '));
  const proc = cp.fork(modulePath, args, opt);
  gracefull(proc);

  return new Promise((resolve, reject) => {
    proc.once('exit', code => {
      childs.delete(proc);
      if (code !== 0) {
        const err = new Error(modulePath + ' ' + args + ' exit with code ' + code);
        err.code = code;
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

exports.npmInstall = (npmCli, name, cwd) => {
  const options = {
    stdio: 'inherit',
    env: process.env,
    cwd,
  };

  const args = [ 'i', name ];
  console.log('[common-bin] `%s %s` to %s ...', npmCli, args.join(' '), options.cwd);

  return new Promise((resolve, reject) => {
    const proc = cp.spawn(npmCli, args, options);
    gracefull(proc);
    proc.once('error', err => {
      /* istanbul ignore next */
      reject(err);
    });
    proc.once('exit', code => {
      childs.delete(proc);

      if (code !== 0) {
        return reject(new Error(`npm ${args.join(' ')} fail, exit code: ${code}`));
      }
      resolve();
    });
  });
};

exports.callFn = function* (fn, args) {
  args = args || [];
  if (!is.function(fn)) return;
  if (is.generatorFunction(fn)) {
    return yield fn(...args);
  }
  const r = fn(...args);
  if (is.promise(r)) {
    return yield r;
  }
  return r;
};

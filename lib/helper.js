'use strict';

const debug = require('debug')('common-bin');
const cp = require('child_process');

const childs = new Set();

let signal;
function exit(s) {
  signal = s;
  process.exit(0);
}
process.once('SIGINT', () => exit('SIGINT'));
process.once('SIGQUIT', () => exit('SIGQUIT'));
process.once('SIGTERM', () => exit('SIGTERM'));
process.once('exit', () => {
  for (const child of childs) {
    debug('kill child %s with %s', child.pid, signal);
    child.kill(signal);
  }
});

exports.forkNode = (modulePath, args, opt) => {
  opt = opt || {};
  opt.stdio = opt.stdio || 'inherit';
  args = args || [];
  debug('Run fork `%j %j %j`', process.execPath, modulePath, args.join(' '));
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
    childs.add(proc);
    proc.on('error', err => {
      const cb = callback;
      callback = null;
      cb(err);
    });
    proc.on('exit', code => {
      childs.delete(proc);
      if (!callback) return;

      if (code !== 0) {
        return callback(new Error('npm ' + args.join(' ') + ' fail, exit code: ' + code));
      }
      callback();
    });
  };
};

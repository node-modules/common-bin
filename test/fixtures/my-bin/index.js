'use strict';

const Command = require('../../..');
const path = require('path');

class MainCommand extends Command {
  constructor(rawArgv) {
    super(rawArgv);
    this.yargs.usage('Usage: my-bin <command> [options]');

    // load directory
    this.load(path.join(__dirname, 'command'));

    // load special file
    this.add('test', path.join(__dirname, 'lib/test_command.js'));

    if (process.env.platform === 'win32') {
      this.add('cov', path.join(__dirname, 'lib/test_command.js'));
    } else {
      this.add('cov', path.join(__dirname, 'lib/cov_command.js'));
    }

    this.alias('begin', 'start');

    this.add('class', class ClassCommand extends Command {
      run() {
        console.log('add by class');
      }
    });
  }

  get version() {
    return '1.2.2';
  }
}

module.exports = exports = MainCommand;
exports.StartCommand = require('./command/start');

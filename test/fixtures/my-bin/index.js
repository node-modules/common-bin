'use strict';

const Command = require('../../..');
const path = require('path');
// const pkg = require('./package.json');

class MainCommand extends Command {
  constructor(argv) {
    super(argv);
    this.yargs.usage('Usage: my-bin <command> [options]');

    // load directory
    this.load(__dirname, 'command');

    // load special file
    this.add('test', path.join(__dirname, 'lib/test_command.js'));

    if (process.env.platform === 'win32') {
      this.add('cov', path.join(__dirname, 'lib/test_command.js'));
    } else {
      this.add('cov', path.join(__dirname, 'lib/cov_command.js'));
    }
  }
}

module.exports = exports = MainCommand;
exports.StartCommand = require('./command/start');

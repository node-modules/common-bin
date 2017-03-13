'use strict';

const Command = require('../../..');
const path = require('path');
// const pkg = require('./package.json');

class MainCommand extends Command {
  constructor() {
    super();
    this.yargs.usage('Usage: my-bin <command> [options]');

    // load directory
    this.loadCommand(__dirname, 'command');

    // load special file
    this.addCommand('test', path.join(__dirname, 'lib/test_command.js'));

    if (process.env.platform === 'win32') {
      this.addCommand('cov', path.join(__dirname, 'lib/test_command.js'));
    } else {
      this.addCommand('cov', path.join(__dirname, 'lib/cov_command.js'));
    }
  }
}

module.exports = exports = MainCommand;
exports.StartCommand = require('./command/start');

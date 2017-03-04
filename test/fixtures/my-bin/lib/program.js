'use strict';

const path = require('path');
const Command = require('../../../..');
const helper = require('./helper');
const pkg = require('../package.json');

class Program extends Command {
  constructor() {
    super();
    this.binName = pkg.name;
    this.version = pkg.version;

    // custom helper
    Object.assign(this.helper, helper);

    // load entire directory
    this.loadCommand(path.join(__dirname, 'command'));
    // load special command
    this.loadCommand(path.join(__dirname, 'start_command.js'));
    // load special command with options
    this.loadCommand(path.join(__dirname, 'test_command.js'), {
      parserFn(commandObj) {
        commandObj.aliases = [ 'cov' ];
        return commandObj;
      },
    });

    this.yargs
      .usage(`Usage: ${this.binName} <command>`)
      .alias('V', 'version')
      .example('my-bin start --baseDir=../dist', 'run app at dist dir');
  }
}

module.exports = Program;

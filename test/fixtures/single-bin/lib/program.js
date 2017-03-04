'use strict';

const path = require('path');
const Command = require('../../../..');
const pkg = require('../package.json');

class Program extends Command {
  constructor() {
    super();
    this.binName = pkg.name;
    this.version = pkg.version;

    // default command showcase
    this.loadCommand(path.join(__dirname, 'single_command.js'));

    this.yargs
      .usage(`Usage: ${this.binName} --baseDir=<target dir>`);
  }
}

module.exports = Program;

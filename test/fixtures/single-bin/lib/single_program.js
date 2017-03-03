'use strict';

const path = require('path');
const BaseProgram = require('../../../..').Program;
const pkg = require('../package.json');

class Program extends BaseProgram {
  constructor() {
    super();
    this.name = pkg.name;
    this.version = pkg.version;
    this.usage = `Usage: ${this.name} --baseDir=<target dir>`;

    // default command showcase
    this.command(path.join(__dirname, 'single_command.js'));
  }
}

module.exports = Program;
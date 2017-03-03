'use strict';

const path = require('path');
const Program = require('../../../..').Program;
const pkg = require('../package.json');

class MyProgram extends Program {
  constructor() {
    super();
    this.name = pkg.name;
    this.version = pkg.version;
    this.usage = `Usage: ${this.name} <command>`;

    // custom helper
    this.helper.echo = str => 'hi, ' + str;

    // custom props
    this.commandProps.utils = { from: 'china' };

    this.yargs
      .alias('V', 'version');

    this.command(path.join(__dirname, 'start_command.js'));
    this.command(path.join(__dirname, 'test_command.js'), commandObj => {
      commandObj.aliases = [ 'cov' ];
      return commandObj;
    });

    this.commandDir(path.join(__dirname, 'command'));

    this.yargs.example('my-bin start --baseDir=../dist', 'run app at dist dir');
  }
}

module.exports = MyProgram;

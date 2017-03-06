'use strict';

const debug = require('debug')('common-bin');
const co = require('co');
const Command = require('./command');

const pkg = require('../package.json');

class Program extends Command {
  constructor() {
    super();
    this.name = pkg.name;
    this.version = pkg.version;
  }

  /**
   * start point of bin process
   */
  start() {
    // register to yargs
    for (const command of this.commands) {
      // debug('> register command', command.name);
      this.yargs.command(command.toYargs());
    }

    const argv = this.yargs
      // .strict()
      // .demandCommand(1)
      // .recommendCommands()
      .wrap(120)
      .version(this.version)
      .usage(this.usage || '')
      .options(this.options || {})
      .help()
      .alias('h', 'help')
      .group([ 'help', 'version' ], 'Global Options:')
      .argv;

    const context = {
      // { _: [ 'init' ], help: false, baseDir: 1234, '$0': 'bin.js' }
      argv,
      cwd: process.cwd(),
      rawArgv: process.argv.slice(3),
    };

    co(function* () {
      yield this.exec(context);
    }.bind(this)).catch(this.errorHandler.bind(this));
  }

  errorHandler(err) {
    console.error('⚠️ [%s] run command %s with %j got error: %s', this.name, process.argv[2], process.argv.slice(3), err.message);
    console.log(err.stack);
    process.exit(1);
  }
}

module.exports = Program;

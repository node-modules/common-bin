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
    this.usage = '';
  }

  /**
   * start point of bin process
   */
  start() {
    this.yargs
      .wrap(120)
      .version(this.version)
      .help()
      .alias('h', 'help')
      .group([ 'help', 'version' ], 'Global Options:')
      // .strict()
      // .demandCommand(1)
      // .recommendCommands()
      // .epilogue(`for more information, find our manual at ${pkg.homepage}`)
      .usage(this.usage)
      .options(this.options);

    // register to yargs
    this.commandMapping.forEach(command => {
      debug('register command `%s`', command.name);
      this.yargs.command(command.toYargs());
    });

    const context = {
      // { _: [ 'init' ], help: false, baseDir: 1234, '$0': 'bin.js' }
      argv: this.yargs.argv,
      cwd: process.cwd(),
      rawArgv: process.argv.slice(3),
    };


    co(function* () {
      yield this.exec(context);
    }.bind(this)).catch(this.errorHandler.bind(this));
  }

  /**
   * default error hander
   * @param {Error} err - error object
   * @protected
   */
  errorHandler(err) {
    console.error('⚠️ [%s] run command %s with %j got error: %s', this.name, process.argv[2] || '', process.argv.slice(3), err.message);
    console.log(err.stack);
    process.exit(1);
  }
}

module.exports = Program;

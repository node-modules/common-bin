'use strict';

const fs = require('fs');
const path = require('path');
const assert = require('assert');
const co = require('co');
const Command = require('./command');

const pkg = require('../package.json');

class Program extends Command {
  constructor() {
    super();
    this.name = pkg.name;
    this.version = pkg.version;
    this.commands = new Map();
  }

  /**
   * load and register command
   * @param {String} dir - the command directory
   * @param {String} [fileName] - special file
   */
  loadCommand(dir, fileName) {
    // TODO: mv to command, lazy load for override
    if (fileName) {
      // load command
      const fullPath = path.join(dir, fileName);
      const Command = require(fullPath);
      const command = new Command();
      assert(command.name, `command(${fullPath}) should provide name property`);
      assert(typeof command.name === 'string', `command(${fullPath}) name should be a string`);
      assert(command.run, `command(${fullPath}) should implement run method`);

      // register to yargs
      this.yargs.command({
        command: command.name,
        aliases: command.aliases,
        description: command.description,
        builder: command.options,
      });

      // save ref to command mapping
      // name could be: `dev`, `add <type> [name]`
      this.commands.set(command.name.split(' ')[0], command);
      [].concat(command.aliases || []).forEach(name => this.commands.set(name, command));
    } else {
      // load entire directory
      const files = fs.readdirSync(dir);
      for (const file of files) {
        if (path.extname(file) === '.js') {
          this.loadCommand(dir, file);
        }
      }
    }
  }

  /**
   * start point of bin process
   */
  start() {
    const argv = this.yargs
      // .strict()
      // .demandCommand(1)
      .recommendCommands()
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
      const command = this.commands.get(argv._[0]);
      if (command) {
        // exec sub command
        context.argv._ = context.argv._.slice(1);
        yield command.run(context);
      } else {
        yield this.run(context);
      }
    }.bind(this)).catch(this.errorHandler.bind(this));
  }

  * run() {
    this.yargs.showHelp('log');
  }

  errorHandler(err) {
    console.error('⚠️ [%s] run command %s with %j got error: %s', this.name, process.argv[2], process.argv.slice(3), err.message);
    console.log(err.stack);
    process.exit(1);
  }
}

module.exports = Program;

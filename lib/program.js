'use strict';

const co = require('co');
const assert = require('assert');
const yargs = require('yargs');
const pkg = require('../package.json');
const helper = require('./helper');
const debug = require('debug')('common-bin');

class Program {
  constructor() {
    this.name = pkg.name;
    this.version = pkg.version;
    this.usage = undefined;

    this.yargs = yargs;
    this.helper = helper;
    // will extend to command
    this.commandProps = {
      helper: this.helper,
    };
  }

  /**
   * load entire command dir
   * @param {String} directory - path to command dir
   * @param {Object} [opts] - { recurse, include, exclude }, see http://yargs.js.org/docs/#methods-commanddirdirectory-opts
   */
  commandDir(directory, opts = {}) {
    debug('add command dir', directory);
    opts.visit = opts.visit || (Command => this.parseCommand(Command, opts.parserFn));
    this.yargs.commandDir(directory, opts);
  }

  /**
   * register command
   *
   * @param {String} filePath - command define file path
   * @param {Function} [parserFn] - adjust yargs command object
   */
  command(filePath, parserFn) {
    debug('add command', filePath);

    // load command
    const Command = require(filePath);
    const commandObj = this.parseCommand(Command, parserFn);

    // register command
    this.yargs.command(commandObj);
  }


  /**
   * exec command
   */
  exec() {
    // process.env.NODE_ENV = process.env.NODE_ENV || 'development';
    debug('program exec with', process.argv);
    this.yargs
      // .strict()
      // .demandCommand(1)
      .recommendCommands()
      .wrap(120)
      .version(this.version)
      .usage(this.usage)
      .help()
      // .alias('h', 'help')
      // .alias('v', 'version')
      .argv;
  }

  /**
   * parse command to yargs style
   *
   * @param {Class} Command - Command Class
   * @param {Function} [parserFn] - adjust yargs command object
   * @return {Object} yargs command object
   * @protected
   */
  parseCommand(Command, parserFn) {
    const programName = this.name;
    const command = new Command(this.commandProps);

    assert(command.name, 'command should provide `name` property');
    assert(command.run, 'command should implement `run` method');

    const handler = function(argv) {
      const rawArgv = process.argv.slice(3);
      const cwd = process.cwd();

      co(function* () {
        yield command.run({ cwd, argv, rawArgv });
      }).catch(err => {
        console.error('[%s] run command [%s] with %j got error:', programName, command.name, rawArgv);
        console.error(err.stack);
        process.exit(1);
      });
    };

    const commandObj = {
      command: command.name,
      aliases: command.aliases,
      description: command.description,
      builder: command.options,
      handler,
    };

    return (typeof parserFn === 'function' ? parserFn(commandObj) : commandObj);
  }
}

module.exports = Program;

'use strict';

const fs = require('fs');
const co = require('co');
const assert = require('assert');
const yargs = require('yargs');
const helper = require('./helper');
const pkg = require('../package.json');
const debug = require('debug')('common-bin');

class Command {
  constructor() {
    this.binName = pkg.name;
    this.version = pkg.version;

    /**
     * helper function
     * @type {Object}
     */
    this.helper = helper;

    /**
     * yargs
     * @type {Object}
     */
    this.yargs = yargs;

    /**
     * command name, just `start` or advance usage `get <source> [proxy]`
     * @type {String}
     * @see http://yargs.js.org/docs/#methods-commandmodule-providing-a-command-module
     */
    this.name = undefined;

    /**
     * command description in help text, set to empty for a hidden command
     * @type {String}
     */
    this.description = undefined;

    /**
     * object declaring the options the command accepts, will pass as `yargs builder`
     * @type {Object|Function}
     */
    this.options = undefined;

    /**
     * command aliases
     * @type {Array/String}
     */
    this.aliases = undefined;
  }

  /**
   * command handler
   * @method {Yiedable} run
   * @param {Object} context
   * @param {String} context.cwd - process.cwd()
   * @param {Object} context.argv - argv parse result by yargs, `{ _: [ 'start' ], '$0': '/usr/local/bin/common-bin', baseDir: 'simple'}`
   * @param {Array} context.rawArgv - the raw argv, `[ "--baseDir=simple" ]`
   * @protected
   */
  // * run( { cwd, argv, rawArgv } ) {
  //   throw new Error('Must impl this method');
  // }

  /**
   * load command and register them
   * @param {String} target - full path to command file or command directory
   * @param {Object} [opts] - load options
   * @param {Function} [opts.parserFn] - adjust yargs command object
   * @param {Boolean} [opts.recurse=false] - whether register command from all subdirectories as a flattened (non-hierarchical) list.
   * @param {Function|Regex} [opts.include] - whitelist when load a command directory
   * @param {Function|Regex} [opts.exclude] - blacklist when load a command directory
   * @see http://yargs.js.org/docs/#methods-commanddirdirectory-opts
   */
  loadCommand(target, opts = {}) {
    if (!fs.existsSync(target)) {
      throw new Error(`${target} is not exists`);
    }

    const binName = this.binName;
    function init(Command, opts) {
      const command = new Command();
      command.binName = binName;
      return command.toYargs(opts.parserFn);
    }

    // load file or directory
    if (fs.statSync(target).isDirectory()) {
      debug('load command dir', target);
      opts.visit = opts.visit || (Command => init(Command, opts));
      this.yargs.commandDir(target, opts);
    } else {
      debug('load command', target);
      const Command = require(target);
      const commandObj = init(Command, opts);
      this.yargs.command(commandObj);
    }
  }

  /**
   * exec command
   */
  exec() {
    debug('exec command with %j', process.argv);
    this.yargs
      // .strict()
      // .demandCommand(1)
      .recommendCommands()
      .wrap(120)
      .version(this.version)
      .help()
      .alias('h', 'help')
      .argv;
  }

  /**
   * parse command to yargs style
   *
   * @param {Function} [parserFn] - adjust yargs command object
   * @return {Object} yargs command object
   * @protected
   */
  toYargs(parserFn) {
    const command = this;
    assert(this.name, 'command should provide `name` property');

    const handler = function(argv) {
      const params = {
        argv,
        cwd: process.cwd(),
        rawArgv: process.argv.slice(3),
      };

      co(function* () {
        assert(command.run, 'command should implement `run` method');
        yield command.run(params);
      }).catch(err => {
        command.errorHandler(err, params);
      });
    };

    const commandObj = {
      command: command.name,
      aliases: command.aliases,
      description: command.description,
      builder: command.options,
      handler,
    };

    return (typeof parserFn === 'function' ? parserFn(commandObj, this) : commandObj);
  }

  errorHandler(err, params) {
    console.error('[%s] run command [%s] with %j got error:', this.binName, this.name, params.rawArgv);
    console.error(this.name, err.stack);
    process.exit(1);
  }
}

module.exports = Command;

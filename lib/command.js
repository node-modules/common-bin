'use strict';

const debug = require('debug')('common-bin');
const co = require('co');
const yargs = require('yargs');
const helper = require('./helper');
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const DISPATCH = Symbol('Command#dispatch');

class Command {
  constructor() {
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
    this.name = '';

    /**
     * command description in help text, set to empty for a hidden command
     * @type {String}
     */
    this.description = '';

    /**
     * command aliases
     * @type {String|Array}
     */
    this.aliases = [];

    /**
     * object declaring the options the command accepts
     * @type {Object|Function}
     * @see http://yargs.js.org/docs/#methods-optionskey-opt
     */
    this.options = {};

    // <commandName, command>
    this.commandMapping = new Map();

    // <alias, commandName>
    this.aliasMapping = new Map();
  }

  /**
   * command handler, could be generator / async function / normal function which return promise
   * @param {Object} context - context object
   * @param {String} context.cwd - process.cwd()
   * @param {Object} context.argv - argv parse result by yargs, `{ _: [ 'start' ], '$0': '/usr/local/bin/common-bin', baseDir: 'simple'}`
   * @param {Array} context.rawArgv - the raw argv, `[ "--baseDir=simple" ]`
   * @protected
   */
  // run() {
  //   this.yargs.showHelp('log');
  //   return Promise.resolve('');
  // }

  /**
   * load sub commands
   * @param {...String} args - the command directory, args will be join by `path.join`
   * @example `loadCommand(__dirname, 'command')`
   */
  loadCommand(...args) {
    const fullPath = path.join(...args);
    assert(fs.existsSync(fullPath), `command dir: ${fullPath} is not exist.`);
    assert(fs.statSync(fullPath).isDirectory(), `${fullPath} is not a directory, maybe you should use addCommand.`);

    debug('load command directory `%s` to `%s`', fullPath, this.name);

    // load entire directory
    const files = fs.readdirSync(fullPath);
    for (const file of files) {
      if (path.extname(file) === '.js') {
        this.addCommand(fullPath, file);
      }
    }
  }

  /**
   * add sub command
   * @param {...String} args - special file path (must contains ext), args will be join by `path.join`
   * @example `loadCommand(__dirname, 'test_command.js')`
   */
  addCommand(...args) {
    const filePath = path.join(...args);
    assert(fs.existsSync(filePath), `command file: ${filePath} is not exist.`);
    assert(fs.statSync(filePath).isFile(), `${filePath} is not a file.`);

    debug('load command `%s` to `%s`', filePath, this.name);

    // load command
    const Command = require(filePath);
    const command = new Command();
    assert(typeof command.name === 'string', `command(${filePath}) should provide name property as a string`);

    // save command ref, split due to name could be `dev` or `add <type> [name]`
    const shortName = command.name.split(' ')[0];
    this.commandMapping.set(shortName, command);
    // save command aliases mapping
    let aliases = command.aliases;
    if (aliases) {
      if (!Array.isArray(aliases)) aliases = [ aliases ];
      for (const alias of aliases) {
        assert(typeof alias === 'string', 'command alias can only be string, but got: ' + alias);
        this.aliasMapping.set(alias, shortName);
      }
    }
  }

  /**
   * start point of bin process
   */
  start() {
    assert(this.name, 'Command should provide `name` property.');

    this.yargs
      .wrap(120)
      .version()
      .help()
      .alias('h', 'help')
      .group([ 'help', 'version' ], 'Global Options:')
      // .strict()
      // .demandCommand(1)
      // .recommendCommands()
      // .epilogue(`for more information, find our manual at ${pkg.homepage}`)
      .usage(this.usage || '')
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
      yield this[DISPATCH](context);
    }.bind(this)).catch(this.errorHandler.bind(this));
  }

  /**
   * default error hander
   * @param {Error} err - error object
   * @protected
   */
  errorHandler(err) {
    console.error('⚠️ [%s] run command %s with %j got error: %s', this.name, process.argv[2], process.argv.slice(3), err.message);
    console.log(err.stack);
    process.exit(1);
  }

  /**
   * dispatch command, either `subCommand.exec` or `this.run`
   * @param {Object} context - context object
   * @param {String} context.cwd - process.cwd()
   * @param {Object} context.argv - argv parse result by yargs, `{ _: [ 'start' ], '$0': '/usr/local/bin/common-bin', baseDir: 'simple'}`
   * @param {Array} context.rawArgv - the raw argv, `[ "--baseDir=simple" ]`
   * @private
   */
  * [DISPATCH](context) {
    let commandName = context.argv._[0];
    if (this.aliasMapping.has(commandName)) {
      commandName = this.aliasMapping.get(commandName);
    }

    const command = this.commandMapping.get(commandName);
    if (command) {
      // exec sub command
      debug('dispatch to subcommand `%s` -> `%s`', this.name, command.name);
      context.argv._ = context.argv._.slice(1);
      yield this.helper.callFn(command[DISPATCH].bind(command), [ context ]);
    } else if (this.run) {
      debug('exec command `%s`', this.name);
      yield this.helper.callFn(this.run.bind(this), [ context ]);
    } else {
      this.showHelp();
    }
  }

  /**
   * print help message to console
   * @param {String} [level=log] - console level
   */
  showHelp(level = 'log') {
    this.yargs.showHelp(level);
  }

  /**
   * convert command to yargs style
   * @return {Object} yargs command object
   * @see http://yargs.js.org/docs/#methods-commandmodule-providing-a-command-module
   * @private
   */
  toYargs() {
    return {
      command: this.name,
      aliases: this.aliases,
      description: this.description,
      builder: yargs => {
        // register options
        yargs.options(this.options);
        if (this.usage) yargs.usage(this.usage);
        // load and register sub command
        this.commandMapping.forEach(subCommand => {
          debug('register command `%s` to `%s`', subCommand.name, this.name);
          yargs.command(subCommand.toYargs());
        });
        return yargs;
      },
    };
  }
}

module.exports = Command;

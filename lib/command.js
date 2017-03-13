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
  constructor(argv) {
    /**
     * yargs
     * @type {Object}
     */
    this.yargs = yargs(argv || process.argv);

    // /**
    //  * command name, just `start` or advance usage `get <source> [proxy]`
    //  * @type {String}
    //  * @see http://yargs.js.org/docs/#methods-commandmodule-providing-a-command-module
    //  */
    // this.name = '';

    // /**
    //  * command description in help text, set to empty for a hidden command
    //  * @type {String}
    //  */
    // this.description = '';

    /**
     * command aliases
     * @type {String|Array}
     */
    // this.aliases = new Map();

    // /**
    //  * object declaring the options the command accepts
    //  * @type {Object|Function}
    //  * @see http://yargs.js.org/docs/#methods-optionskey-opt
    //  */
    // this.options = {};

    // <commandName, command>
    this.commandMapping = new Map();

    // <alias, commandName>
    // this.aliasMapping = new Map();
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
        const name = path.basename(file).replace(/\.js$/, '');
        this.addCommand(name, path.join(fullPath, file));
      }
    }
  }

  /**
   * add sub command
   * @param {String} name -
   * @param {String} filePath - special file path (must contains ext)
   * @example `loadCommand(path.join(__dirname, 'test_command.js'))`
   */
  addCommand(name, filePath) {
    assert(name, `${name} is required`);
    assert(fs.existsSync(filePath) && fs.statSync(filePath).isFile(), `${filePath} is not a file.`);

    debug('load command `%s` to `%s`', filePath);

    // load command
    const Command = require(filePath);
    this.commandMapping.set(name, Command);

    // // save command ref, split due to name could be `dev` or `add <type> [name]`
    // const shortName = command.name.split(' ')[0];
    // this.commandMapping.set(shortName, command);
    // // save command aliases mapping
    // let aliases = command.aliases;
    // if (aliases) {
    //   if (!Array.isArray(aliases)) aliases = [ aliases ];
    //   for (const alias of aliases) {
    //     assert(typeof alias === 'string', 'command alias can only be string, but got: ' + alias);
    //     this.aliasMapping.set(alias, shortName);
    //   }
    // }
  }

  /**
   * start point of bin process
   */
  start() {
    co(function* () {
      yield this[DISPATCH]();
    }.bind(this)).catch(this.errorHandler.bind(this));
  }

  /**
   * default error hander
   * @param {Error} err - error object
   * @protected
   */
  errorHandler(err) {
    console.error('⚠️ run command %s got error: %s', process.argv.slice(3), err.message);
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
  * [DISPATCH]() {
    this.yargs
      .wrap(120)
      .version()
      // .completion()
      .help()
      .alias('h', 'help')
      .group([ 'help', 'version' ], 'Global Options:');
      // .strict()
      // .demandCommand(1)
      // .recommendCommands()
      // .epilogue(`for more information, find our manual at ${pkg.homepage}`)
      // .usage(this.usage || '')
      // .options(this.options);

    for (const [ name, Command ] of this.commandMapping.entries()) {
      this.yargs.command(name, Command.prototype.description || '');
    }

    // { _: [ 'init' ], help: false, baseDir: 1234, '$0': 'bin.js' }
    // console.log(222);
    // console.log(this.yargs);
    // console.log(this.yargs.argv);
    const argv = this.yargs.argv;
    const context = {
      argv,
      cwd: process.cwd(),
      rawArgv: process.argv.slice(3),
    };

    console.log(123, argv);
    const commandName = argv._[0];
    // if (this.aliasMapping.has(commandName)) {
    //   commandName = this.aliasMapping.get(commandName);
    // }

    if (this.commandMapping.has(commandName)) {
      const Command = this.commandMapping.get(commandName);
      const command = new Command();
      // exec sub command
      debug('dispatch to subcommand `%s` -> `%s`', this.name, command.name);
      context.argv._ = context.argv._.slice(1);
      yield this.helper.callFn(command[DISPATCH].bind(command));
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
   * helper function
   * @type {Object}
   */
  get helper() {
    return helper;
  }
}

module.exports = Command;

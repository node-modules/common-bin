'use strict';

const debug = require('debug')('common-bin');
const co = require('co');
const yargs = require('yargs');
const helper = require('./helper');
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const DISPATCH = Symbol('Command#dispatch');

class CommonBin {

  constructor(argv) {
    this.origin = argv || process.argv.slice(2);
    debug('[%s] origin argument `%s`', this.constructor.name, this.origin.join(' '));

    /**
     * yargs
     * @type {Object}
     */
    this.yargs = yargs(this.origin);

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
  run() {
    this.showHelp();
  }

  /**
   * load sub commands
   * @param {...String} args - the command directory, args will be join by `path.join`
   * @example `loadCommand(__dirname, 'command')`
   */
  loadCommand(...args) {
    const fullPath = path.join(...args);
    assert(fs.existsSync(fullPath), `command dir: ${fullPath} is not exist.`);
    assert(fs.statSync(fullPath).isDirectory(), `${fullPath} is not a directory, maybe you should use addCommand.`);


    // load entire directory
    const files = fs.readdirSync(fullPath);
    const names = [];
    for (const file of files) {
      if (path.extname(file) === '.js') {
        const name = path.basename(file).replace(/\.js$/, '');
        names.push(name);
        this.addCommand(name, path.join(fullPath, file));
      }
    }

    debug('[%s] loaded command `%s` from directory `%s`', this.constructor.name, names, fullPath);
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

    debug('[%s] add command `%s` from `%s`', this.constructor.name, name, filePath);

    // load command
    const Command = require(filePath);
    this.commandMapping.set(name, Command);
  }

  /**
   * start point of bin process
   * @return {Promise} result -
   */
  start() {
    return co(function* () {
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
      // .completion()
      .wrap(120)
      .version()
      .help()
      .alias('h', 'help')
      .group([ 'help', 'version' ], 'Global Options:');

    const parsed = yield this.parseArgv(this.origin);
    const commandName = parsed._[0];

    if (this.commandMapping.has(commandName)) {
      const Command = this.commandMapping.get(commandName);
      debug('[%s] dispatch to subcommand `%s` -> `%s`', this.constructor.name, commandName, Command.name);

      const rawArgv = this.origin.slice();
      rawArgv.splice(rawArgv.indexOf(commandName), 1);
      const command = new Command(rawArgv);
      yield this.helper.callFn(command[DISPATCH], [], command);
      return;
    }

    for (const [ name, Command ] of this.commandMapping.entries()) {
      this.yargs.command(name, Command.prototype.description || '');
    }

    debug('[%s] exec run command', this.constructor.name);
    const context = {
      argv: this.yargs.argv,
      cwd: process.cwd(),
      rawArgv: this.origin,
    };
    yield this.helper.callFn(this.run, [ context ], this);
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

  parseArgv(argv) {
    return new Promise((resolve, reject) => {
      this.yargs.parse(argv, (err, argv) => {
        if (err) return reject(err);
        resolve(argv);
      });
    });
  }
}

module.exports = CommonBin;

'use strict';

const debug = require('debug')('common-bin');
const co = require('co');
const yargs = require('yargs');
const helper = require('./helper');
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const DISPATCH = Symbol('Command#dispatch');
const PARSE = Symbol('Command#parse');
const COMMANDS = Symbol('Command#commands');

class CommonBin {

  constructor(argv) {
    /**
     * original argument
     * @type {Array}
     */
    this.rawArgv = argv || process.argv.slice(2);
    debug('[%s] origin argument `%s`', this.constructor.name, this.rawArgv.join(' '));

    /**
     * yargs
     * @type {Object}
     */
    this.yargs = yargs(this.rawArgv);

    // <commandName, Command>
    this[COMMANDS] = new Map();
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
   * @param {String} fullPath - the command directory
   * @example `load(path.join(__dirname, 'command'))`
   */
  load(fullPath) {
    assert(fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory(), `${fullPath} should exist and be a directory`);

    // load entire directory
    const files = fs.readdirSync(fullPath);
    const names = [];
    for (const file of files) {
      if (path.extname(file) === '.js') {
        const name = path.basename(file).replace(/\.js$/, '');
        names.push(name);
        this.add(name, path.join(fullPath, file));
      }
    }

    debug('[%s] loaded command `%s` from directory `%s`', this.constructor.name, names, fullPath);
  }

  /**
   * add sub command
   * @param {String} name - a command name
   * @param {String} filePath - special file path (must contains ext)
   * @example `add('test', path.join(__dirname, 'test_command.js'))`
   */
  add(name, filePath) {
    assert(name, `${name} is required`);
    assert(fs.existsSync(filePath) && fs.statSync(filePath).isFile(), `${filePath} is not a file.`);

    debug('[%s] add command `%s` from `%s`', this.constructor.name, name, filePath);

    // load command
    const Command = require(filePath);
    this[COMMANDS].set(name, Command);
  }

  /**
   * alias an existing command
   * @param {String} alias - alias command
   * @param {String} name - exist command
   */
  alias(alias, name) {
    assert(alias, 'alias command name is required');
    assert(this[COMMANDS].has(name), `${name} should be added first`);
    debug('[%s] set `%s` as alias of `%s`', this.constructor.name, alias, name);
    this[COMMANDS].set(alias, this[COMMANDS].get(name));
  }

  /**
   * start point of bin process
   */
  start() {
    co(function* () {
      // replace `--get-yargs-completions` to our KEY, so yargs will not block our DISPATCH
      const index = this.rawArgv.indexOf('--get-yargs-completions');
      if (index !== -1) {
        // bash will request as `--get-yargs-completions my-git remote add`, so need to remove 2
        this.rawArgv.splice(this.rawArgv.indexOf('--get-yargs-completions'), 2, `--AUTO_COMPLETIONS=${this.rawArgv.join(',')}`);
      }
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
   * print help message to console
   * @param {String} [level=log] - console level
   */
  showHelp(level = 'log') {
    this.yargs.showHelp(level);
  }

  /**
   * shortcut for yargs.options
   * @param  {Object} opt - an object set to `yargs.options`
   */
  set options(opt) {
    this.yargs.options(opt);
  }

  /**
   * shortcut for yargs.usage
   * @param  {String} usage - usage info
   */
  set usage(usage) {
    this.yargs.usage(usage);
  }

  /**
   * helper function
   * @type {Object}
   */
  get helper() {
    return helper;
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
    // define --help and --version by default
    this.yargs
      // .reset()
      .completion()
      .help()
      .wrap(120)
      .version()
      .alias('h', 'help')
      .group([ 'help', 'version' ], 'Global Options:');

    // get parsed argument without handling helper and version
    const parsed = yield this[PARSE](this.rawArgv);
    const commandName = parsed._[0];

    // if sub command exist
    if (this[COMMANDS].has(commandName)) {
      const Command = this[COMMANDS].get(commandName);
      const rawArgv = this.rawArgv.slice();
      rawArgv.splice(rawArgv.indexOf(commandName), 1);

      debug('[%s] dispatch to subcommand `%s` -> `%s` with %j', this.constructor.name, commandName, Command.name, rawArgv);
      const command = new Command(rawArgv);
      yield command[DISPATCH]();
      return;
    }

    // register command for printing
    for (const [ name, Command ] of this[COMMANDS].entries()) {
      this.yargs.command(name, Command.prototype.description || '');
    }

    debug('[%s] exec run command', this.constructor.name);
    const context = {
      argv: this.yargs.argv,
      cwd: process.cwd(),
      rawArgv: this.rawArgv,
    };

    // print completion for bash
    if (context.argv.AUTO_COMPLETIONS) {
      // slice to remove `--AUTO_COMPLETIONS=` which we append
      this.yargs.getCompletion(this.rawArgv.slice(1), completions => {
        // console.log('%s', completions)
        completions.forEach(x => console.log(x));
      });
    } else {
       // handle by self
      yield this.helper.callFn(this.run, [ context ], this);
    }
  }

  [PARSE](argv) {
    return new Promise((resolve, reject) => {
      this.yargs.parse(argv, (err, argv) => {
        if (err) return reject(err);
        resolve(argv);
      });
    });
  }
}

module.exports = CommonBin;

'use strict';

const debug = require('debug')('common-bin');
const yargs = require('yargs');
const helper = require('./helper');
const assert = require('assert');
const fs = require('fs');
const path = require('path');

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
    this.name = undefined;

    /**
     * command description in help text, set to empty for a hidden command
     * @type {String}
     */
    this.description = undefined;

    /**
     * command aliases
     * @type {String|Array}
     */
    this.aliases = undefined;

    /**
     * object declaring the options the command accepts
     * @type {Object|Function}
     * @see http://yargs.js.org/docs/#methods-optionskey-opt
     */
    this.options = undefined;

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
   * @param {...String} args - the command directory or special file(must contains ext)
   */
  loadCommand(...args) {
    const fullPath = path.join(...args);
    const statInfo = fs.statSync(fullPath);
    if (statInfo.isFile()) {
      debug('load command `%s` to `%s`', args[args.length - 1], this.name);
      // load command
      const Command = require(fullPath);
      const command = new Command();
      assert(command.name, `command(${fullPath}) should provide name property`);
      assert(typeof command.name === 'string', `command(${fullPath}) name should be a string`);

      // save command ref, split due to name could be `dev` or `add <type> [name]`
      const shortName = command.name.split(' ')[0];
      this.commandMapping.set(shortName, command);
       // save command aliases mapping
      this.aliasMapping.set(shortName, shortName);
      let aliases = command.aliases;
      if (aliases) {
        if (!Array.isArray(aliases)) aliases = [ aliases ];
        for (const alias of aliases) {
          assert(typeof alias === 'string', 'command alias can only be string, but got: ' + alias);
          this.aliasMapping.set(alias, shortName);
        }
      }
    } else {
      // load entire directory
      const files = fs.readdirSync(fullPath);
      for (const file of files) {
        if (path.extname(file) === '.js') {
          this.loadCommand(fullPath, file);
        }
      }
    }
  }

  /**
   * dispatch command, either `subCommand.exec` or `this.run`
   * @param {Object} context - context object
   * @param {String} context.cwd - process.cwd()
   * @param {Object} context.argv - argv parse result by yargs, `{ _: [ 'start' ], '$0': '/usr/local/bin/common-bin', baseDir: 'simple'}`
   * @param {Array} context.rawArgv - the raw argv, `[ "--baseDir=simple" ]`
   * @private
   */
  * exec(context) {
    const commandName = this.aliasMapping.get(context.argv._[0]);
    const command = this.commandMapping.get(commandName);
    if (command) {
      // exec sub command
      debug('dispatch to subcommand `%s` -> `%s`', this.name, command.name);
      context.argv._ = context.argv._.slice(1);
      yield this.helper.callFn(command.exec.bind(command), [ context ]);
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
        yargs.options(this.options || {});
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

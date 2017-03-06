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
     * object declaring the options the command accepts, will pass as `yargs builder`
     * @type {Object|Function}
     */
    this.options = undefined;

    this.commands = new Set();
    this.commandMapping = new Map();
  }

  // get builder() {
  //   return yargs => {
  //     yargs.options(this.options || {});
  //     for (const subCommand of this.commands) {
  //       yargs.command(subCommand.toYargs());
  //     }
  //     return yargs;
  //   };
  // }

  toYargs() {
    return {
      command: this.name,
      aliases: this.aliases,
      description: this.description,
      builder: yargs => {
        yargs.options(this.options || {});
        for (const subCommand of this.commands) {
          // console.log('register command `%s` to `%s`', subCommand.name, this.name);
          yargs.command(subCommand.toYargs());
        }
        return yargs;
      },
    };
  }

  /**
   * load sub commands
   * @param {...String} args - the command directory or special file
   */
  loadCommand(...args) {
    const fullPath = path.join(...args);
    const statInfo = fs.statSync(fullPath);
    if (statInfo.isFile()) {
      // load command
      const Command = require(fullPath);
      const command = new Command();
      assert(command.name, `command(${fullPath}) should provide name property`);
      assert(typeof command.name === 'string', `command(${fullPath}) name should be a string`);
      // assert(command.run, `command(${fullPath}) should implement run method`);
      // add to sub command set
      this.commands.add(command);
      // save ref to command mapping
      // name could be: `dev`, `add <type> [name]`
      this.commandMapping.set(command.name.split(' ')[0], command);
      [].concat(command.aliases || []).forEach(name => this.commandMapping.set(name, command));
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

  * exec(context) {
    const command = this.commandMapping.get(context.argv._[0]);
    if (command) {
      // exec sub command
      // console.log('exec command `%s` -> `%s`', this.name, command.name);
      context.argv._ = context.argv._.slice(1);
      yield command.exec(context);
    } else {
      // console.log('exec command `%s`', this.name);
      yield this.run(context);
    }
  }

  /**
   * command handler
   * @param {Object} context - context object
   * @param {String} context.cwd - process.cwd()
   * @param {Object} context.argv - argv parse result by yargs, `{ _: [ 'start' ], '$0': '/usr/local/bin/common-bin', baseDir: 'simple'}`
   * @param {Array} context.rawArgv - the raw argv, `[ "--baseDir=simple" ]`
   * @protected
   */
  * run() {
    this.yargs.showHelp('log');
  }
}

module.exports = Command;

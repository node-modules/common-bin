'use strict';

const yargs = require('yargs');
const helper = require('./helper');

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

    this.commands = new Map();
  }

  get builder() {
    const name = this.name;
    return yargs => {
      yargs.options(this.options || {});
      for (const [key, subCommand] of this.commands) {
        yargs.command({
          command: subCommand.name,
          description: subCommand.description,
          builder: subCommand.builder,
        });
      }
      return yargs;
    }
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
}

module.exports = Command;

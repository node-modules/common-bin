'use strict';

class Command {
  constructor(props) {
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
     * @type {Object/Function}
     */
    this.options = undefined;

    /**
     * command aliases
     * @type {Array/String}
     */
    this.aliases = undefined;

    /**
     * helper function
     * @type {Object}
     */

    // extend to prototype
    Object.assign(this, props);
  }

  /**
   * command handler
   * @method {Yiedable} run
   * @param {Object} context
   * @param {String} context.cwd - process.cwd()
   * @param {Object} context.argv - argv parse result by yargs, `{ _: [ 'start' ], '$0': '/usr/local/bin/common-bin', baseDir: 'simple'}`
   * @param {Array} context.rawArgv - the raw argv, `[ "--baseDir=simple" ]`
   */
  // * run( { cwd, argv, rawArgv } ) {
  //   throw new Error('Must impl this method');
  // }
}

module.exports = Command;

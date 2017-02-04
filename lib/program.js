'use strict';

const co = require('co');
const chalk = require('chalk');

class Program {
  constructor() {
    this._commands = {
      // dev: dev command path
    };
    // your bin version
    this.version = require('../package.json').version;
  }

  addCommand(cmd, filepath) {
    // each cmd module should contain two methods: run(args) and help()
    this._commands[cmd] = filepath;
  }

  onAction(cmd, cwd, args) {
    const filepath = this._commands[cmd];
    if (!filepath) {
      this.help();
      return;
    }
    co(function* () {
      const Command = require(filepath);
      yield new Command().run(cwd, args);
    }).catch(err => {
      console.error('[common-bin] run %s with %j at %s error:', cmd, args, cwd);
      console.error(chalk.red(err.stack));
      process.exit(1);
    });
  }

  help() {
    const keys = Object.keys(this._commands);
    if (!keys.length) return;

    console.log('  More commands');
    console.log('');
    for (const cmd of keys) {
      const Command = require(this._commands[cmd]);
      console.log('    %s - %s', cmd, new Command().help());
    }
    console.log('');
  }
}

module.exports = Program;

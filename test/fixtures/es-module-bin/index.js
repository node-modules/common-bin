'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const Command = require('../../..');
const path = require('path');

class MainCommand extends Command {
  constructor(rawArgv) {
    super(rawArgv);
    this.yargs.usage('Usage: es-module <command> [options]');
    // load directory
    this.load(path.join(__dirname, 'command'));
  }
}

exports.default = MainCommand;

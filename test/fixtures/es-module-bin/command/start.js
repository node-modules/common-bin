'use strict';
Object.defineProperty(exports, '__esModule', { value: true });

const Command = require('../../../..');

class StartCommand extends Command {

  * run() {
    console.log('override start command');
  }

  get description() {
    return 'start app override';
  }
}

exports.default = StartCommand;

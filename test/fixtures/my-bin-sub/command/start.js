'use strict';

const Command = require('../../my-bin').StartCommand;

class StartCommand extends Command {

  async run() {
    console.log('override start command');
  }

  get description() {
    return 'start app override';
  }
}

module.exports = StartCommand;

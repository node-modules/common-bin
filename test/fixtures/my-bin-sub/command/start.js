'use strict';

const Command = require('../../my-bin').StartCommand;

class StartCommand extends Command {
  constructor() {
    super();
    this.name = 'start';
    this.description = 'start app override';
  }

  * run() {
    console.log('override start command');
  }
}

module.exports = StartCommand;

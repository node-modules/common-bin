'use strict';

const Command = require('../../../..');

class SubCommand extends Command {
  constructor() {
    super();
    this.name = 'sub';
    this.description = 'sub app';
  }

  * run() {
    console.log('run sub command');
  }
}

module.exports = SubCommand;

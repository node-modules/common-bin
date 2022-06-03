'use strict';

const Command = require('../../../..');

class SubCommand extends Command {

  async run() {
    console.log('run sub command');
  }

  get description() {
    return 'sub app';
  }
}

module.exports = SubCommand;

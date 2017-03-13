'use strict';

const Command = require('../../../..');

class SleepCommand extends Command {

  async run() {
    await sleep('1s');
    console.log('sleep 1s');
  }

  get description() {
    return 'sleep showcase';
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = SleepCommand;

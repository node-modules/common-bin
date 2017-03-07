'use strict';

const Command = require('..');

class SleepCommand extends Command {
  constructor() {
    super();
    this.name = 'sleep';
    this.description = 'sleep showcase';
  }

  async run() {
    await sleep('1s');
    console.log('sleep 1s');
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = SleepCommand;

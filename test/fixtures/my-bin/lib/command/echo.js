'use strict';

const Command = require('../../../../..');

class EchoCommand extends Command {
  constructor() {
    super();
    this.name = 'echo';
    this.description = 'echo message';
    this.options = {
      name: {
        description: 'your name',
      },
    };
  }

  * run({ argv }) {
    console.log(argv);
    console.log(`[${this.binName}] ${this.helper.echo(argv.name)}`);
  }
}

module.exports = EchoCommand;

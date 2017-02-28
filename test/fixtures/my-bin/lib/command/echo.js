'use strict';

const Command = require('../../../../..').Command;

class EchoCommand extends Command {
  constructor(opts) {
    super(opts);
    this.name = 'echo';
    this.description = 'echo message';
    this.options = {
      name: {
        description: 'your name',
      },
    };
  }

  * run({ argv }) {
    console.log(this.helper.echo(argv.name), this.utils.from);
  }
}

module.exports = EchoCommand;

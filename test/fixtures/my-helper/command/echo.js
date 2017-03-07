'use strict';

const Command = require('..');

class EchoCommand extends Command {
  constructor() {
    super();
    this.name = 'echo [name]';
    this.description = 'say hi';
  }

  * run({ argv }) {
    console.log(this.helper.echo(argv.name));
  }
}

module.exports = EchoCommand;

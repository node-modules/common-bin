'use strict';

const Command = require('../../../../..').Command;

class AddCommand extends Command {
  constructor() {
    super();
    this.name = 'add <type> <name>';
    this.description = 'add a controller/service';
    this.aliases = [ 'create' ];
    this.options = {
      style: {
        description: 'code style',
        choices: [ 'class', 'exports' ],
        default: 'class',
      },
    };
  }

  * run({ argv }) {
    console.log('add %s %s with %s style', argv.type, argv.name, argv.style);
  }
}

module.exports = AddCommand;

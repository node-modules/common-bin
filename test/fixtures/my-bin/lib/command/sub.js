'use strict';

const path = require('path');
const Command = require('../../../../..');

class SubCommand extends Command {
  constructor() {
    super();
    this.name = 'sub';
    this.description = 'sub app';
    // load sub command
    this.options = () => this.loadCommand(path.join(__dirname, 'sub'));
  }
}

module.exports = SubCommand;

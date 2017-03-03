'use strict';

const Command = require('../../../../..').Command;

class InstallCommand extends Command {
  constructor(opts) {
    super(opts);
    this.name = 'install';
    this.description = 'run npm install';
  }

  * run({ cwd, argv }) {
    yield this.helper.npmInstall('npm', argv.target, cwd);
  }
}

module.exports = InstallCommand;

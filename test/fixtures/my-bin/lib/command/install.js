'use strict';

const path = require('path');
const Command = require('../../../../..').Command;

class InstallCommand extends Command {
  constructor() {
    super();
    this.name = 'install';
    this.description = 'run npm install';
    this.options = {
      name: {
        description: 'package name',
      },
    };
  }

  * run({ cwd, argv }) {
    const name = argv.target;
    yield this.helper.npmInstall(process.platform === 'win32' ? 'npm.cmd' : 'npm', name, cwd);
    const pkgInfo = require(path.join(cwd, 'node_modules', name, 'package.json'));
    console.log(`install ${pkgInfo.name} done`);
  }
}

module.exports = InstallCommand;

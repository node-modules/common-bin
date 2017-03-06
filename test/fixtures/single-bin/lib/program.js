'use strict';

const BaseProgram = require('../../../..').Program;
const pkg = require('../package.json');

class Program extends BaseProgram {
  constructor() {
    super();
    this.name = pkg.name;
    this.version = pkg.version;

    this.options = {
      baseDir: {
        description: 'target directory',
      },
    };
  }

  * run(context) {
    console.log('run default command at %s', context.argv.baseDir);
    yield super.run(context);
  }
}

module.exports = Program;

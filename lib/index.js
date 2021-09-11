const { error } = require("./util");

const registerCommands = arg => {
  const commandArr = ['init', 'deploy'];

  if (!commandArr.some(i => i === arg)) {
    error('只有两种脚本，init/deploy');
    process.exit(1);
  }

  const command = require(`./${arg}`);
  command();
}

module.exports = class Cli {
  run(args) {
    registerCommands(args._[0]);
  }
}
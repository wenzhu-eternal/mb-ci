const fs = require("fs");
const os = require("os");
const shelljs = require('shelljs')
const inquirer = require("inquirer");
const { mbciConfigPath, succeed, info, error } = require('./util');

const inquirerConfig = [
  {
    type: 'input',
    name: 'name',
    message: '请输入项目名称',
    default: fs.existsSync(`${process.cwd()}/package.json`)
      ? require(`${process.cwd()}/package.json`).name
      : ''
  },
  {
    type: 'input',
    name: 'privateKey',
    message: '请输入本地私钥地址',
    default: `${os.homedir()}/.ssh/id_rsa`
  },
  {
    type: 'password',
    name: 'passphrase',
    message: '请输入本地私钥密码',
  },
  {
    type: 'input',
    name: 'script',
    message: '打包命令',
    default: 'yarn run build',
  },
  {
    type: 'input',
    name: 'host',
    message: '服务器地址',
  },
  {
    type: 'input',
    name: 'username',
    message: '用户名',
    default: 'root',
  },
  {
    type: 'password',
    name: 'password',
    message: '密码',
  },
  {
    type: 'input',
    name: 'distPath',
    message: '本地打包目录',
    default: 'build',
  },
  {
    type: 'input',
    name: 'webDir',
    message: '部署路径',
  },
];

const creatConfigFile = async () => {
  const inquiereData = await inquirer.prompt(inquirerConfig);

  fs.writeFileSync(mbciConfigPath, `module.exports = ${JSON.stringify(inquiereData, null, 2)}`);

  shelljs.exec(`npx prettier --write ${mbciConfigPath}`);
}

module.exports = async () => {
  if (fs.existsSync(mbciConfigPath)) {
    error('mbci.config.js 配置文件已存在');
    process.exit(1);
  } else {
    info('创建配置文件 mbci.config.js 开始');
    await creatConfigFile();
    succeed(
      `配置文件生成成功，请查看项目目录下的 'mbci.config.js' 文件确认配置是否正确`
    )
    process.exit(0);
  }
}
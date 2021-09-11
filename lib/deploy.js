const fs = require("fs");
const shelljs = require('shelljs')
const inquirer = require('inquirer')
const { NodeSSH } = require("node-ssh");
const { mbciConfigPath, succeed, info, error } = require("./util");

const ssh = new NodeSSH();

const execBuild = async configData => {
  info(`${configData.name} 打包开始`);
  if (shelljs.exec(configData.script).code !== 0) {
    error(`${configData.name} 打包失败`);
    process.exit(1);
  }
  succeed(`${configData.name} 打包成功`)
}

const createSSH = async configData => {
  try {
    info('ssh 连接开始');
    await ssh.connect(configData);
    succeed('ssh 连接成功');
  } catch (error) {
    error(error);
    process.exit(1);
  }
}

const uploadFiles = async configData => {
  const localPath = `${process.cwd()}/${configData.distPath}/`;
  const remotePath = `${configData.webDir}/${configData.distPath}/`

  info('上传打包文件开始');
  const reponse = await ssh.putDirectory(localPath, remotePath);
  if (reponse) {
    succeed('上传打包文件成功');
  } else {
    error(reponse);
    process.exit(1);
  }
}

const deletePackageFiles = async configData => {
  const localPath = `${process.cwd()}/${configData.distPath}/`;
  info(`删除打包文件开始`);
  if (shelljs.rm('-rf', localPath).code !== 0) {
    error(`删除打包文件失败`);
    process.exit(1);
  }
  succeed(`删除打包文件成功`)
}

const closeSSH = () => {
  ssh.dispose();
}

const startDeploy = async (configData) => {
  if (Object.values(configData).some(i => !i)) {
    error('mbci.config.js 配置文件有些配置为空');
    process.exit(1);
  } else {
    await execBuild(configData);
    await createSSH(configData);
    await uploadFiles(configData);
    await deletePackageFiles(configData);
    await closeSSH();
  }
}

module.exports = async () => {
  if (!fs.existsSync(mbciConfigPath)) {
    error('mbci.config.js 配置文件不存在，请先使用 init 命令');
    process.exit(1);
  } else {
    const configData = require(mbciConfigPath);
    info(`部署项目 ${configData.name} 开始`);
    await startDeploy(configData);

    succeed(`✨ 部署项目 ${configData.name} 成功`);
    process.exit(0);
  }
}
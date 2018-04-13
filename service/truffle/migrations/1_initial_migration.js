const Web3 = require('web3')
const truffleConfigFile = require('../truffle')
var Migrations = artifacts.require("./Migrations.sol");

module.exports = function(deployer, network) {
  const truffleConfig = truffleConfigFile.networks[network]
  const web3 = new Web3(new Web3.providers.HttpProvider(`http://${truffleConfig.host}:${truffleConfig.port}`))
  web3.personal.unlockAccount(truffleConfig.from, truffleConfig.password, 180000)

  deployer.deploy(Migrations);
};

var InsiderManager = artifacts.require("./InsiderManager.sol");

module.exports = function(deployer) {
  deployer.deploy(InsiderManager);
};

var WriterManager = artifacts.require("./WriterManager.sol");

module.exports = function(deployer) {
  deployer.deploy(WriterManager);
};

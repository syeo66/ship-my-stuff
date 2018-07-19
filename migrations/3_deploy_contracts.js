var HashGen = artifacts.require("./HashGen.sol");
var SafeMath = artifacts.require("./SafeMath.sol");
var TransportMarket = artifacts.require("./TransportMarket.sol");
var Registry = artifacts.require("Registry.sol");

module.exports = function(deployer, network, accounts) {
  deployer.deploy(Registry);

  deployer.link(SafeMath, TransportMarket);
  deployer.link(HashGen, TransportMarket);
  deployer.deploy(TransportMarket);
};

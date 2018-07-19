var TransportMarket = artifacts.require("./TransportMarket.sol");
var Registry = artifacts.require("Registry.sol");

module.exports = function(deployer, network, accounts) {
  Registry.deployed().then(function(registry) {
    registry.register(TransportMarket.address);
  });
};

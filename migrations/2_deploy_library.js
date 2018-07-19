var HashGen = artifacts.require("./HashGen.sol");
var SafeMath = artifacts.require("./SafeMath.sol");

module.exports = function(deployer) {
  deployer.deploy(HashGen);
  deployer.deploy(SafeMath);
};

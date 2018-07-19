pragma solidity ^0.4.24;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Registry.sol";
import "../contracts/lib/Depreciable.sol";

contract ARandomContract is Depreciable {
    uint public val = 256;
}

// Testing the Registry contract
// 'Registry' is a very simple contract
contract TestRegistry {
    Registry registry = new Registry();

    // testing if a new contract gets added to the registry
    // and if the history of contracts gets stored
    function testRegister() public {
        ARandomContract contract1 = new ARandomContract();
        registry.register(contract1);

        Assert.equal(contract1, registry.latest(), "The latest entry in the registry should be contract1");
        Assert.equal(contract1, registry.contracts(0), "The first entry in the registrys history should be contract1");

        ARandomContract contract2 = new ARandomContract();
        registry.register(contract2);

        Assert.equal(contract2, registry.latest(), "The latest entry in the registry should be contract2");
        Assert.equal(contract1, registry.contracts(0), "The first entry in the registrys history should be contract1");
        Assert.equal(contract2, registry.contracts(1), "The second entry in the registrys history should be contract2");
    }
}

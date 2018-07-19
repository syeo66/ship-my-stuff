pragma solidity ^0.4.24;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/lib/Depreciable.sol";

contract DepreciableMock is Depreciable {
    uint private val = 128;
    uint private val2 = 256;

    function getVal() public view ifNotDeprecated returns(uint) {
        return val;
    }

    function getVal2() public view ifDeprecated returns(uint) {
        return val;
    }
}

// Testing the Depreciable contract
// 'Depreciable' is a very simple contract and does not really need 5 tests
contract TestDepreciable {
    DepreciableMock depreciable = new DepreciableMock();

    // Check the modifiers when not deprecated because this is the main functionality
    // the Depreciable contract delivers: a modifier based on the deprecated flag.
    function testNotDeprecated() public {
        bool expectedNotDeprecated = true; // false means it did throw an error
        bool resultNotDeprecated = address(depreciable).call(bytes4(bytes32(keccak256("getVal()"))));

        Assert.equal(expectedNotDeprecated, resultNotDeprecated, "ifNotDeprecated should be allowed to call.");

        bool expectedDeprecated = false; // false means it did throw an error
        bool resultDeprecated = address(depreciable).call(bytes4(bytes32(keccak256("getVal2()"))));

        Assert.equal(expectedDeprecated, resultDeprecated, "ifDeprecated should not be allowed to call.");
    }

    // Check the modifiers when not deprecated
    function testDeprecated() public {
        depreciable.setDeprecated(true);

        bool expectedNotDeprecated = false; // false means it did throw an error
        bool resultNotDeprecated = address(depreciable).call(bytes4(bytes32(keccak256("getVal()"))));

        Assert.equal(expectedNotDeprecated, resultNotDeprecated, "ifNotDeprecated should not be allowed to call.");

        bool expectedDeprecated = true; // false means it did throw an error
        bool resultDeprecated = address(depreciable).call(bytes4(bytes32(keccak256("getVal2()"))));

        Assert.equal(expectedDeprecated, resultDeprecated, "ifDeprecated should be allowed to call.");
    }
}
pragma solidity ^0.4.24;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/lib/Haltable.sol";

contract HaltableMock is Haltable {
    uint private val = 128;
    uint private val2 = 256;

    function getVal() public view ifNotHalted returns(uint) {
        return val;
    }

    function getVal2() public view ifHalted returns(uint) {
        return val;
    }
}

// Testing the Haltable contract
// 'Haltable' is a very simple contract and does not really need 5 tests
contract TestHaltable {
    HaltableMock depreciable = new HaltableMock();

    // Check the modifiers when not Halted because this is the main functionality
    // the Haltable contract delivers: a modifier based on the halted flag.
    function testNotHalted() public {
        bool expectedNotHalted = true; // false means it did throw an error
        bool resultNotHalted = address(depreciable).call(bytes4(bytes32(keccak256("getVal()"))));

        Assert.equal(expectedNotHalted, resultNotHalted, "ifNotHalted should be allowed to call.");

        bool expectedHalted = false; // false means it did throw an error
        bool resultHalted = address(depreciable).call(bytes4(bytes32(keccak256("getVal2()"))));

        Assert.equal(expectedHalted, resultHalted, "ifHalted should not be allowed to call.");
    }

    // check the modifiers when not Halted
    function testHalted() public {
        depreciable.setHalted(true);

        bool expectedNotHalted = false; // false means it did throw an error
        bool resultNotHalted = address(depreciable).call(bytes4(bytes32(keccak256("getVal()"))));

        Assert.equal(expectedNotHalted, resultNotHalted, "ifNotHalted should not be allowed to call.");

        bool expectedHalted = true; // false means it did throw an error
        bool resultHalted = address(depreciable).call(bytes4(bytes32(keccak256("getVal2()"))));

        Assert.equal(expectedHalted, resultHalted, "ifHalted should be allowed to call.");
    }
}
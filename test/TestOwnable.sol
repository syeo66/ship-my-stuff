pragma solidity ^0.4.24;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/lib/Ownable.sol";
import "../contracts/TransportMarket.sol";

contract OwnableMock is Ownable {
    uint private val;

    function getVal() public view onlyOwner returns(uint) {
        return val;
    }
}

// Testing the Ownable contract
// 'Ownable' is a very simple contract and does not really need 5 tests
contract TestOwnable {
    OwnableMock ownable = new OwnableMock();
    
    TransportMarket transportMarket = TransportMarket(DeployedAddresses.TransportMarket());

    // test to verify the creator of the contract is actually the owner
    function testCreatorIsOwner() public {
        address expected = this;

        address owner = ownable.owner();

        Assert.equal(expected, owner, "The owner should be the creator of the contract");
    }

    // test to verify only the owner can call a function with the 'onlyOwner' modifier
    function testOnlyCreatorCanUseFunction() public {
        bool expected = true; // true means it did not throw an error

        bool result = address(ownable).call(bytes4(bytes32(keccak256("getVal()"))));

        Assert.equal(expected, result, "OwnableMock.getVal() should allow call by owner");
    }

    // test to verify someone other than the owner can not call a function with the 'onlyOwner' modifier
    function testOtherThanOwnerCanNotUseFunction() public {
        bool expected = false; // false means it did throw an error

        bool result = address(transportMarket).call(bytes4(bytes32(keccak256("getVal()"))));

        Assert.equal(expected, result, "TransportMarket.getVal() should throw an error when we are not the owner");
    }

    // test to verify change of ownership
    function testChangeOwner() public {
        ownable.changeOwner(0x1);

        address expectedOwner = 0x1;
        address owner = ownable.owner();
        Assert.equal(expectedOwner, owner, "The owner should now be 0x1");

        bool expected = false; // false means it did throw an error
        bool result = address(ownable).call(bytes4(bytes32(keccak256("getVal()"))));
        Assert.equal(expected, result, "TransportMarket.getVal() should now throw an error when we are not the owner");
    }
}
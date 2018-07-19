pragma solidity ^0.4.24;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/lib/Mortal.sol";

contract MortalMock is Mortal {
    uint private val = 128;

    function getVal() public view onlyOwner returns(uint) {
        return val;
    }

    function() public payable {
    }
}

// Testing the Mortal contract
// 'Mortal' is a very simple contract and does not really need 5 tests
contract TestMortal {
    uint public initialBalance = 1 ether;

    MortalMock mortal = new MortalMock();

    function testKill() public {
        address(mortal).transfer(0.1 ether);

        uint startBalance = address(this).balance;        

        mortal.kill();

        Assert.equal(true, address(this).balance>startBalance, "The balance should be higher than before the kill.");
    }
}
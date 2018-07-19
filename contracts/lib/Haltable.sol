pragma solidity ^0.4.24;

import "./Ownable.sol";

contract Haltable is Ownable {
    bool public halted = false;

    modifier ifHalted {require(halted);_;}
    modifier ifNotHalted {require(!halted);_;}

    function setHalted(bool _halted) public onlyOwner {
        halted = _halted;
    }
}

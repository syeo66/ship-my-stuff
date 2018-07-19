pragma solidity ^0.4.24;

import "./Ownable.sol";

contract Mortal is Ownable {
    // destruct the contract when owner calls kill()
    function kill() public onlyOwner {
        selfdestruct(owner);
    }
}

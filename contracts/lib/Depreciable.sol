pragma solidity ^0.4.24;

import "./Ownable.sol";

contract Depreciable is Ownable {
    bool public deprecated = false;

    modifier ifDeprecated {require(deprecated);_;}
    modifier ifNotDeprecated {require(!deprecated);_;}

    function setDeprecated(bool _deprecated) public onlyOwner {
        deprecated = _deprecated;
    }
}

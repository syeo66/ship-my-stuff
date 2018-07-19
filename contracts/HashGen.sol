pragma solidity ^0.4.24;

library HashGen {
    function simpleHash(string _content) public pure returns(bytes32) {
        return keccak256(abi.encodePacked(_content));
    }
}

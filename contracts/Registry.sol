pragma solidity ^0.4.24;

import "./lib/Ownable.sol";
import "./lib/Mortal.sol";

contract Registry is Ownable, Mortal {
    address public latest;
    address[] public contracts;

    function getLatest() public view returns(address) {
        return latest;
    }

    function getContracts() public view returns(address[]) {
        return contracts;
    }

    /// @notice sets the new addres as the latest one and pushes it to the history. I also sets the older contract 'depracated'
    /// @param contractAddress the address of the most recent contract
    function register(address contractAddress) public onlyOwner {
        require(contractAddress != 0x0);
        latest = contractAddress;
        contracts.push(contractAddress);
    } 

    function() public {
        revert();
    }
}

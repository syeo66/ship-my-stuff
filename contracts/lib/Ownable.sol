pragma solidity ^0.4.24;

contract Ownable {
    address public owner = msg.sender;

    /// @notice check if the caller is the owner of the contract
    modifier onlyOwner {
        require (msg.sender == owner);
        _;
    }

    /// @notice change the owner of the contract
    /// @param _newOwner the address of the new owner of the contract.
    function changeOwner(address _newOwner)
        public
        onlyOwner
    {
        require(_newOwner != 0x0);
        owner = _newOwner;
    }
}
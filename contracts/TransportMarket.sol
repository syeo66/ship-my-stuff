pragma solidity ^0.4.24;

import "./lib/Ownable.sol";
import "./lib/Mortal.sol";
import "./lib/Depreciable.sol";
import "./lib/Haltable.sol";
import "./HashGen.sol"; // include library
import "./SafeMath.sol"; // include library

contract TransportMarket is Ownable, Mortal, Depreciable, Haltable {
    using SafeMath for uint;

    uint public maxValue = 0.3 ether;

    // the balances of the users
    mapping (address => uint) balances;

    // array containing all the parcels
    mapping (bytes32 => Parcel) parcels;
    // array containing the index to all parcels
    bytes32[] parcelIndex;
    // array containing the index to all parcels in created state
    bytes32[] createdIndex;
    // index for the owned parcels
    mapping (address => bytes32[]) senderIndex;
    // index for the owned parcels
    mapping (address => bytes32[]) haulerIndex;

    // Parcel data
    struct Parcel {
        address senderAddress; // The address of the creator/sender
        address haulerAddress; // The address of the hauler responsible for transport
        address recipientAddress; // The address of the recipient
        bytes32 confirmationHash; // The hashed received confirmation key
        uint price;
        State state;
        uint parcelIndex;
        uint createdIndex;
        uint senderIndex;
        uint haulerIndex;
        string description;
    }

    // The states of a parcel
    enum State {Created, Taken, PickedUp, Delivered, Cancelled}
    State state;

    // Every State emits an event
    event ParcelCreated(uint id, bytes32 confirmationHash, address senderAddress, uint price);
    event ParcelTaken(uint id, address haulerAddress, address senderAddress, uint price);
    event ParcelPickedUp(uint id, address haulerAddress, address senderAddress, uint price);
    event ParcelDelivered(uint id, address recipientAddress, address haulerAddress, address senderAddress, uint price);
    event ParcelCancelled(uint id, address senderAddress, uint price);

    // modifiers for the state
    modifier isCreated(uint _index) {require(parcels[parcelIndex[_index]].state == State.Created);_;}
    modifier isTaken(uint _index) {require(parcels[parcelIndex[_index]].state == State.Taken);_;}
    modifier isPickedUp(uint _index) {require(parcels[parcelIndex[_index]].state == State.PickedUp);_;}
    modifier isDelivered(uint _index) {require(parcels[parcelIndex[_index]].state == State.Delivered);_;}
    modifier isCancelled(uint _index)  {require(parcels[parcelIndex[_index]].state == State.Cancelled);_;}

    // special modifiers
    modifier isTakenOrPickedUp(uint _index) {
        bytes32 key = parcelIndex[_index];
        require(parcels[key].state == State.Taken || parcels[key].state == State.PickedUp);
        _;
    }

    /// @notice set the maximum value allowed per parcel
    /// @param _maxValue the maximum value
    function setMaxValue(uint _maxValue) public onlyOwner {
        maxValue = _maxValue;
    }

    /// @notice create a parcel
    /// @param _confirmationHash the hash of the confirmation key to be sent to the receiver (should be hashed before sending to the contract)
    /// @param _description some description of the parcel, might be replaced by a ipfs hash
    function createParcel(bytes32 _confirmationHash, string _description) 
        payable 
        public 
        ifNotHalted 
        ifNotDeprecated
        returns(uint)
    {
        // we only allow parcels up to a certain price
        require(msg.value > 0 && msg.value <= maxValue);
        // only allow creation if the confirmationHash is unique
        require(parcels[_confirmationHash].price == 0);
        // adding a parcel to the senders list
        parcels[_confirmationHash] = Parcel({
            senderAddress: msg.sender,
            haulerAddress: 0x0,
            recipientAddress: 0x0,
            confirmationHash: _confirmationHash,
            price: msg.value,
            state: State.Created,
            parcelIndex: parcelIndex.push(_confirmationHash)-1,
            createdIndex: createdIndex.push(_confirmationHash)-1,
            senderIndex: senderIndex[msg.sender].push(_confirmationHash)-1,
            haulerIndex: 0,
            description: _description
        });
        emit ParcelCreated(parcelIndex.length-1, _confirmationHash, msg.sender, msg.value);
    }

    /// @notice get the count of parcels
    function getParcelCount() public view returns(uint) {
        return parcelIndex.length;
    }

    /// @notice mark the parcel as taken by hauler (but not yet picked up)
    /// @param _index the index of the parcel 
    function takeParcel(uint _index) 
        public 
        ifNotHalted
        isCreated(_index)
    {
        require (_index < parcelIndex.length);
        bytes32 key = parcelIndex[_index];
        // the sender of the parcel can not be the hauler and take the parcel at the same time
        require (parcels[key].senderAddress != msg.sender);
        parcels[key].haulerAddress = msg.sender;
        parcels[key].state = State.Taken;
        parcels[key].haulerIndex = haulerIndex[msg.sender].push(key)-1;

        deleteParcelFromCreatedList(key);

        emit ParcelTaken(_index, msg.sender, parcels[parcelIndex[_index]].senderAddress, parcels[parcelIndex[_index]].price);
    }

    /// @notice mark the parcel as picked up
    /// @param _index the index of the parcel
    function pickUpParcel(uint _index) 
        public
        ifNotHalted
        isTaken(_index)
    {
        require(_index < parcelIndex.length);
        bytes32 key = parcelIndex[_index];
        // only the sender is allowed to mark the parcel as picked up
        require(parcels[key].senderAddress == msg.sender);
        parcels[key].state = State.PickedUp;
        emit ParcelPickedUp(
            _index, 
            parcels[key].haulerAddress, 
            parcels[key].senderAddress, 
            parcels[key].price
        );
    }

    /// @notice mark the parcel as delivered
    /// @param _confirmationKey the confirmation key the recipient got with the delivery
    function deliverParcel(uint _index, string _confirmationKey)
        public
        ifNotHalted
        isTakenOrPickedUp(_index)
    {
        require(_index < parcelIndex.length);
        bytes32 key = parcelIndex[_index];
        // the sender and the hauler are not allowed to confirm delivery
        require(parcels[key].senderAddress != msg.sender && parcels[key].haulerAddress != msg.sender);
        // check the confirmation key against the stored hash
        require(parcels[key].confirmationHash == HashGen.simpleHash(_confirmationKey));

        parcels[key].state = State.Delivered;
        parcels[key].recipientAddress = msg.sender;

        // add the delivery price to the haulers balance
        balances[parcels[key].haulerAddress] = balances[parcels[key].haulerAddress].add(parcels[key].price);
        emit ParcelDelivered(
            _index, msg.sender, 
            parcels[key].haulerAddress, 
            parcels[key].senderAddress, 
            parcels[key].price
        );
    }

    /// @notice Cancel the parcel
    /// @param _index the index of the parcel
    function cancelParcel(uint _index)
        public
        ifNotHalted
        isCreated(_index)
    {
        require(_index < parcelIndex.length);
        bytes32 key = parcelIndex[_index];
        // only the sender can cancel the parcel
        require(parcels[key].senderAddress == msg.sender);

        parcels[key].state = State.Cancelled;
        uint amount = parcels[key].price;
        // add the delivery price to the senders balance
        balances[parcels[key].senderAddress] = balances[parcels[key].senderAddress].add(amount);

        deleteParcelFromCreatedList(key);
        deleteParcelFromMyList(key);

        emit ParcelCancelled(_index, msg.sender, amount);
    }

    /// @notice removes parcel from list of parcels with state created
    /// @param key remove parcel from list of created parcels
    function deleteParcelFromCreatedList(bytes32 key) private {
        require(parcels[key].price != 0);
        // first get the index of the parcel to delete
        uint rowToDelete = parcels[key].createdIndex;
        // retrieve the key of the last parcel in the list
        bytes32 keyToMove = createdIndex[createdIndex.length-1];
        // overwrite the parcel to be deleted with the last entry of the index
        createdIndex[rowToDelete] = keyToMove;
        // rewrite the index of the moved element
        parcels[keyToMove].createdIndex = rowToDelete;
        // shorten the index
        createdIndex.length--;
    }

    /// @notice removes parcel from list of parcels with state created
    /// @param key remove parcel from list of created parcels
    function deleteParcelFromMyList(bytes32 key) private {
        require(parcels[key].price != 0);
        // first get the index of the parcel to delete
        uint rowToDelete = parcels[key].senderIndex;
        // retrieve the key of the last parcel in the list
        bytes32 keyToMove = senderIndex[msg.sender][senderIndex[msg.sender].length-1];
        // overwrite the parcel to be deleted with the last entry of the index
        senderIndex[msg.sender][rowToDelete] = keyToMove;
        // rewrite the index of the moved element
        parcels[keyToMove].senderIndex = rowToDelete;
        // shorten the index
        senderIndex[msg.sender].length--;
    }

    // accounting

    /// @notice returns the balance of one account
    /// @param _address address of the account to poll
    function getBalance(address _address) public view returns(uint) {
        return balances[_address];
    }

    /// @notice withdraw the balance
    function withdraw() public {
        uint amount = balances[msg.sender];
        // ste the pending balance to zero
        // and prevent re-entrancy attacks
        balances[msg.sender] = 0;
        msg.sender.transfer(amount);
    }

    // parcel data

    /// @notice retrieve the index of a parcel with a given hash
    /// @param _hash hash to look up
    function getParcelIndex(bytes32 _hash) public view returns(uint) {
        // make sure the hash exists
        require(parcels[_hash].confirmationHash == _hash);
        // retrieve the index
        uint index = parcels[_hash].parcelIndex;
        // make sure the index really contains the hash
        // this is important to catch deleted parcels
        require(parcelIndex[index] == _hash);
        return index;
    }

    /// @notice retrieve the index of created parcels
    function getCreatedParcels() public view returns(bytes32[]) {
        return createdIndex;
    }

    /// @notice retrieve the index of created parcels
    function getMyParcels() public view returns(bytes32[]) {
        return senderIndex[msg.sender];
    }

    /// @notice retrieve the index of taken parcels
    function getTakenParcels() public view returns(bytes32[]) {
        return haulerIndex[msg.sender];
    }

    // get some values from specific parcels (It's kind of a workaround because you can't return objects)

    /// @notice retrieve the sender address of a parcel
    /// @param _index the index of the parcel
    function getParcelSenderAddress(uint _index) public view returns(address) {
        require (_index < parcelIndex.length);
        return parcels[parcelIndex[_index]].senderAddress;
    }

    /// @notice retrieve the hauler address of a parcel
    /// @param _index the index of the parcel
    function getParcelHaulerAddress(uint _index) public view returns(address) {
        require (_index < parcelIndex.length);
        return parcels[parcelIndex[_index]].haulerAddress;
    }

    /// @notice retrieve the price of a parcel
    /// @param _index the index of the parcel
    function getParcelDescription(uint _index) public view returns(string) {
        require (_index < parcelIndex.length);
        return parcels[parcelIndex[_index]].description;
    }

    /// @notice retrieve the price of a parcel
    /// @param _index the index of the parcel
    function getParcelPrice(uint _index) public view returns(uint) {
        require (_index < parcelIndex.length);
        return parcels[parcelIndex[_index]].price;
    }

    /// @notice retrieve the hash of a parcel
    /// @param _index the index of the parcel
    function getParcelConfirmationHash(uint _index) public view returns(bytes32) {
        require (_index < parcelIndex.length);
        return parcels[parcelIndex[_index]].confirmationHash;
    }

    /// @notice retrieve the state of a parcel
    /// @param _index the index of the parcel
    function getParcelState(uint _index) public view returns(uint) {
        require (_index < parcelIndex.length);
        return uint(parcels[parcelIndex[_index]].state);
    }

    /// @notice retrieve the parcels data
    /// @param _index the index of the parcel
    /// @return senderAddress, haulerAddress, price, state
    function getParcel(uint _index) public view returns(address, address, uint, uint) {
        require (_index < parcelIndex.length);
        bytes32 key = parcelIndex[_index];
        return (
            parcels[key].senderAddress,
            parcels[key].haulerAddress,
            parcels[key].price,
            uint(parcels[key].state)
        );
    }

    function() public {
        revert();
    }
}

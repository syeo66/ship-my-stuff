var TransportMarket = artifacts.require("./TransportMarket.sol");

const timeTravel = function (time) {
    return new Promise((resolve, reject) => {
      web3.currentProvider.sendAsync({
        jsonrpc: "2.0",
        method: "evm_increaseTime",
        params: [time], // 86400 is num seconds in day
        id: new Date().getTime()
      }, (err, result) => {
        if(err){ return reject(err) }
        return resolve(result)
      });
    })
  };

const getBalance = function (account) {
    return new Promise((resolve, reject) => {
      web3.eth.getBalance(account, function(err, result) {
        if (err) { return reject(err) }
        return resolve(result);
      });
    })
  }

contract('TransportMarket', function(accounts) {
    const owner = accounts[0];
    const alice = accounts[1];
    const bob = accounts[2];
    const clemens = accounts [3];

    const receivedConfirmationKey = '920ad2a4';
    const receivedConfirmationHash = web3.sha3(receivedConfirmationKey);
    
    const parcelDescription = "from Zürich to Crypto Valley, 1 kg";
    const payment = web3.toBigNumber(web3.toWei(0.01, 'ether'));

    // testing parcel creation and checking all the data appears
    // where it should
    it ("should be able to create a parcel", async () => {
        const transportMarket = await TransportMarket.deployed();

        // check for parcel count before first parcel creation
        const parcelPreCount = await transportMarket.getParcelCount();
        assert.equal(0, parcelPreCount, "The parcel count should be 0, check getParcelCount method");

        // test for creation of parcel
        await transportMarket.createParcel(receivedConfirmationHash, parcelDescription, {from: alice, value: payment});
        
        const parcelCount = await transportMarket.getParcelCount();
        const parcelSenderAddress = await transportMarket.getParcelSenderAddress(0);
        const parcelPrice = await transportMarket.getParcelPrice(0);
        const confirmationHash = await transportMarket.getParcelConfirmationHash(0);
        const myParcels = await transportMarket.getMyParcels({from: alice});
        assert.equal(1, parcelCount, "The parcel count should be 1, check createParcel method");
        assert.equal(alice, parcelSenderAddress, "Sender address of Parcel should be alices, check createParcel method");
        assert.equal(payment.toNumber(), parcelPrice, "Price should reflect the Ether sent, check createParcel method");
        assert.equal(receivedConfirmationHash, confirmationHash, "Price should reflect the Ether sent, check createParcel method");
        assert.equal(confirmationHash, myParcels[0], "The parcel should be in 'my parcels'");

        // testing the emitted events
        const expectedEventResult = {id: 0, senderAddress: alice, price: payment, confirmationHash: receivedConfirmationHash};

        const LogParcelCreated = await transportMarket.allEvents();
        const log = await new Promise(function(resolve, reject) {
            LogParcelCreated.watch(function(error, log) {resolve(log);})
        });

        const logSenderIndex = log.args.id;
        const logSenderAddress = log.args.senderAddress;
        const logConfirmationHash = log.args.confirmationHash;
        const logPrice = log.args.price.toNumber();

        assert.equal(expectedEventResult.id, logSenderIndex, "LogParcelCreated event index property not emitted, check createParcel method");
        assert.equal(expectedEventResult.confirmationHash, logConfirmationHash, "LogParcelCreated event confirmationHash property not emitted, check createParcel method");
        assert.equal(expectedEventResult.senderAddress, logSenderAddress, "LogParcelCreated event senderAddress property not emitted, check createParcel method");
        assert.equal(expectedEventResult.price, logPrice, "LogParcelCreated event price property not emitted, check createParcel method");
    });

    it("should not be able to create a parcel if contract is haltet", async () => {
        const transportMarket = await TransportMarket.deployed();

        transportMarket.setHalted(true);

        let isFailed = false;
        try {
            await transportMarket.createParcel(receivedConfirmationHash, parcelDescription, {from: alice, value: payment});
        } catch (error) {
            isFailed = true;
        }

        assert.equal(true, isFailed, "createParcel should have failed but it didn't, check the modifiers");

        transportMarket.setHalted(false);
    });

    it("should not be able to create a parcel if contract is deprecated", async () => {
        const transportMarket = await TransportMarket.deployed();

        transportMarket.setDeprecated(true);

        let isFailed = false;
        try {
            await transportMarket.createParcel(receivedConfirmationHash, parcelDescription, {from: alice, value: payment});
        } catch (error) {
            isFailed = true;
        }

        assert.equal(true, isFailed, "createParcel should have failed but it didn't, check the modifiers");

        transportMarket.setDeprecated(false);
    });

    it ("should not allow the sender to take a parcel", async () => {
        const transportMarket = await TransportMarket.deployed();

        let isFailed = false;
        try {
            await transportMarket.takeParcel(0, {from: alice});
        } catch (error) {
            isFailed = true;
        }

        assert.equal(true, isFailed, "takeParcel should have failed but it didn't, check the modifiers");
    });

    it("should let the hauler mark the parcel as taken", async () => {
        const transportMarket = await TransportMarket.deployed();

        await transportMarket.takeParcel(0, {from: bob});
        const parcelState = await transportMarket.getParcelState(0);
        const myTakenParcels = await transportMarket.getTakenParcels({from: bob});
        const confirmationHash = await transportMarket.getParcelConfirmationHash(0);
        assert.equal(1, parcelState, "takeParcel should have set the state, check the method");
        assert.equal(confirmationHash, myTakenParcels[0], "The taken parcel should be in 'taken parcels'");

        // testing the emitted events
        const expectedEventResult = {haulerAddress: bob, senderAddress: alice, price: payment};

        const LogParcelTaken = await transportMarket.allEvents();
        const log = await new Promise(function(resolve, reject) {
            LogParcelTaken.watch(function(error, log) {resolve(log);})
        });

        const logHaulerAddress = log.args.haulerAddress;
        const logSenderAddress = log.args.senderAddress;
        const logPrice = log.args.price.toNumber();

        assert.equal(expectedEventResult.haulerAddress, logHaulerAddress, "LogParcelTaken event haulerAddress property not emitted, check takeParcel method");
        assert.equal(expectedEventResult.senderAddress, logSenderAddress, "LogParcelTaken event senderAddress property not emitted, check takeParcel method");
        assert.equal(expectedEventResult.price, logPrice, "LogParcelTaken event price property not emitted, check takeParcel method");
    });

    it ("should not allow another one to take a taken parcel", async () => {
        const transportMarket = await TransportMarket.deployed();

        try {
            await transportMarket.takeParcel(0, {from: clemens});
        } catch (error) {}
        const parcelHauler = await transportMarket.getParcelHaulerAddress(0);
        const parcelState = await transportMarket.getParcelState(0);
        assert.equal(bob, parcelHauler, "takeParcel should have failed but it didn't, check the modifiers");
        assert.equal(1, parcelState, "takeParcel should have state taken, check the method");
    });

    it("should let the sender mark the parcel as picked up", async () => {
        const transportMarket = await TransportMarket.deployed();

        // check that no one except for the sender can mark as picked up
        let isFailed = false;
        try {
            await transportMarket.pickUpParcel(0, {from: clemens});
        } catch (error) {
            isFailed = true;
        }

        assert.equal(true, isFailed, "pickUpParcel should have failed but it didn't, check the modifiers");

        // check for the correct pick up flag
        await transportMarket.pickUpParcel(0, {from: alice});
        const parcelState = await transportMarket.getParcelState(0);
        assert.equal(2, parcelState, "pickUpParcel should have set the state, check the method");

        // testing the emitted events
        const expectedEventResult = {id: 0, haulerAddress: bob, senderAddress: alice, price: payment};

        const LogParcelPickedUp = await transportMarket.allEvents();
        const log = await new Promise(function(resolve, reject) {
            LogParcelPickedUp.watch(function(error, log) {resolve(log);})
        });

        const logSenderIndex = log.args.id;
        const logHaulerAddress = log.args.haulerAddress;
        const logSenderAddress = log.args.senderAddress;
        const logPrice = log.args.price.toNumber();
        
        assert.equal(expectedEventResult.id, logSenderIndex, "LogParcelPickedUp event id property not emitted, check takeParcel method");
        assert.equal(expectedEventResult.haulerAddress, logHaulerAddress, "LogParcelPickedUp event haulerAddress property not emitted, check takeParcel method");
        assert.equal(expectedEventResult.senderAddress, logSenderAddress, "LogParcelPickedUp event senderAddress property not emitted, check takeParcel method");
        assert.equal(expectedEventResult.price, logPrice, "LogParcelPickedUp event price property not emitted, check takeParcel method");
    });

    it("should allow the recipient to confirm delivery", async () => {
        const transportMarket = await TransportMarket.deployed();

        // check for the wrong delivery flag
        try {
            await transportMarket.deliverParcel(0, receivedConfirmationHash, {from: clemens});
        } catch(error) {} 
        const parcelWrongState = await transportMarket.getParcelState(0);
        assert.equal(2, parcelWrongState, "deliverParcel should not have set the state, check the method");

        // check for sender is not allowed to set the delivered flag
        try {
            await transportMarket.deliverParcel(0, receivedConfirmationKey, {from: alice});
        } catch(error) {} 
        const parcelSenderState = await transportMarket.getParcelState(0);
        assert.equal(2, parcelSenderState, "deliverParcel should not have set the state by the sender, check the method");

        // check for hauler is not allowed to set the delivered flag
        try {
            await transportMarket.deliverParcel(0, receivedConfirmationKey, {from: bob});
        } catch(error) {} 
        const parcelHaulerState = await transportMarket.getParcelState(0);
        assert.equal(2, parcelHaulerState, "deliverParcel should not have set the state by the hauler, check the method");

        // check for the correct delivery flag
        await transportMarket.deliverParcel(0, receivedConfirmationKey, {from: clemens});
        const parcelState = await transportMarket.getParcelState(0);
        const haulerBalance = await transportMarket.getBalance(bob)
        assert.equal(3, parcelState, "deliverParcel should have set the state, check the method");
        assert.equal(payment.toNumber(), haulerBalance.toNumber(), "deliverParcel should have increased the haulers balance, check the method");

        // testing the emitted events
        const expectedEventResult = {id: 0, recipientAddress: clemens,haulerAddress: bob, senderAddress: alice, price: payment};

        const LogParcelDelivered = await transportMarket.allEvents();
        const log = await new Promise(function(resolve, reject) {
            LogParcelDelivered.watch(function(error, log) {resolve(log);})
        });

        const logSenderIndex = log.args.id;
        const logRecipientAddress = log.args.recipientAddress;
        const logHaulerAddress = log.args.haulerAddress;
        const logSenderAddress = log.args.senderAddress;
        const logPrice = log.args.price.toNumber();
        
        assert.equal(expectedEventResult.id, logSenderIndex, "LogParcelDelivered event id property not emitted, check takeParcel method");
        assert.equal(expectedEventResult.recipientAddress, logRecipientAddress, "LogParcelDelivered event recipientAddress property not emitted, check takeParcel method");
        assert.equal(expectedEventResult.haulerAddress, logHaulerAddress, "LogParcelDelivered event haulerAddress property not emitted, check takeParcel method");
        assert.equal(expectedEventResult.senderAddress, logSenderAddress, "LogParcelDelivered event senderAddress property not emitted, check takeParcel method");
        assert.equal(expectedEventResult.price, logPrice, "LogParcelDelivered event price property not emitted, check takeParcel method");
    });
    
    it("should allow the sender to cancel a created parcel", async() => {
        const transportMarket = await TransportMarket.deployed();

        const newConfirmationKey = 'fa7349ae';
        const newConfirmationHash = web3.sha3(newConfirmationKey);

        // create a new parcel to cancel
        await transportMarket.createParcel(newConfirmationHash, parcelDescription, {from: alice, value: payment});

        // check for the correct delivery flag
        await transportMarket.cancelParcel(1, {from: alice});
        const parcelState = await transportMarket.getParcelState(1);
        const senderBalance = await transportMarket.getBalance(alice);
        const myParcels = await transportMarket.getMyParcels({from: alice});
        assert.equal(4, parcelState, "deliverParcel should have set the state, check the method");
        assert.equal(payment.toNumber(), senderBalance.toNumber(), "deliverParcel should have increased the haulers balance, check the method");
        assert.equal(1, myParcels.length, "there should be only one parcel in my parcel list");
    });

    it("should not allow the sender to cancel a taken parcel", async () => {
        const newConfirmationKey = '7101b190';
        const newConfirmationHash = web3.sha3(newConfirmationKey);

        const transportMarket = await TransportMarket.deployed();

        // create a new parcel to cancel
        await transportMarket.createParcel(newConfirmationHash, parcelDescription, {from: alice, value: payment});

        // set the Taken flag
        await transportMarket.takeParcel(2, {from: bob});

        // check for the delivery flag for 'Created'
        try {
            await transportMarket.cancelParcel(2, {from: alice});
        } catch(error) {}
        
        const parcelState = await transportMarket.getParcelState(2);
        assert.equal(1, parcelState, "deliverParcel should have set the state, check the method");
    });

    it("should allow to withdraw balances", async() => {
        const transportMarket = await TransportMarket.deployed();

        // withdraw the haulers balance
        const startBalance = await getBalance(bob);
        await transportMarket.withdraw({from: bob});
        const endBalance = await getBalance(bob);
        assert.equal(true, startBalance.toNumber() < endBalance.toNumber(), "withdraw should have paid out to bob, check the method");
    });
});

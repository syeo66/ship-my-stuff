# Design Pattern Decisions
## Owned
The contract needs an owner to be able to kill, deprecate or halt (circuit breaker) the contract. Also the owner can assign a new owner if needed.

## Mortal
In case of an emergency (or another good reason) it is possible for the owner to destroy the contract. Should really be the last resort but it is better to have it in place than not.

## Depreciable
The owner can set a deprecated flag which causes the contract to no longer allow new parcels. This way we can make sure a smooth transition to a newer version of the contract is possible.

## Haltable (Circuit Breaker)
The owner can set a halted flag which causes the contract to reject all transactions except withdrawal (and non modifying transactions). This could be necessary in case of an emergency or when a new contract has been deployed and a grace period in deprecated state has passed.

## Balance/Withdrawal
Because it it is safer to require the user to request a withdrawal instead of sending it directly (might lead to a DoS) the contract is keeping book of the balances of every account and can be withdrawn using the ```withdraw()```method.

## State Machine
Every parcel has a typical lifecycle. This lifecycle is mirrored using the states Created, Taken, PickedUp, Deliverd and Cancelled. With every change of state an event is emitted and there are modifiers in place checking for the state of the parcel.

## Indexed mapping
Using a mapping and using an index allows me to mainain a list of parcels in 'Created' state for easier access. I would like to have used indexed-enumerable-set-lib from EthPM but ```truffle install ndexed-enumerable-set-lib``` refused to work with the message ```Error: Unknown server response 504 when downloading hash Q...```.

## Contract registry
I added a registry contract which retrieves and tracks the addresses of the deployed main contracts with truffles migration. This registry could be used as a ENS resolver to be able to lookup the current contract address.
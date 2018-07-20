# Avoiding Common Attacks
## What did I do to prevent common attacks to succeed?
* Following best practices in general.
* Automated tests also testing for expected reverts.
* Used [https://securify.ch/](https://securify.ch/) to test the contract

### Reentrancy
* Using the balance/withdrawal pattern to use pull over push payment.
* All modifications of contract variables happen before the ```withdraw()``` method sends the amount.

### Cross-function Race Conditions
* Using a state machine prevents race conditions. One parcel can not be in two states at a time.

### Transaction-Ordering Dependence / Front Running
* There is a possible known race condition between ```takeParcel``` and ```cancelParcel``` and this is to be expected to rarely happen. However in case two transactions are sent to take or cancel a parcel at the same time it seems to be appropriate to me to make it a matter of luck which one actually takes place earlier.

### Integer overflow
* I used (parts of) the SafeMath library to prevent overflows when adding integers.

### DoS with (Unexpected) revert / DoS with Block Gas Limit
* See "Reentrancy" - because of the measures taken a DoS should be very unlikely.

### Exposed secret
* Only the hashed version of the confirmation key is stored on the blockchain. This allows only the recipient with the correct key to confirm the receiption of the parcel.


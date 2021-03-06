# Ship my stuff

At the moment I do not intend to work on this project. I still think this would be a great idea however I have moved on (which does not mean I might not come back to it).

## What does it do?
### Basic functionality
**Ship my stuff** is a peer-to-peer delivery service. Think of it as some sort of a decentralized 'Uber for parcels'. The basic intended use would be something along those lines (User **A** - Sender, User **B** - Hauler/Transporter, User **C** - Recipient):

* **A** sends some Ether to the contract, adds some details (like pick-up address, delivery address, weight, etc.).
* The offer gets published. **A** writes down the confirmation code.
* **B** marks the offer he intends to deliver as 'taken'.
* As soon the Parcel has been picked up **A** marks it as 'picked up'.
* **B** delivers the parcel to **C**.
* **C** confirms the receiption using a confirmation code he got with the delivery (or by email from **A**).
* With this confirmation **B** retrieves the money from the contract.

### Some technical details
* The contract only stores the senders address, the haulers addres and the recipients addres, the price and a IPFS hash for each parcel. More information about the parcel can be stored on IPFS.
* There is a Registry contract which keeps track of every version of the main contract
* Old contracts can be marked as 'deprecated' which allows to create some grace period in which no ne parcels can be created but delivery and payout is still possible.

## Setup
Clone repository from github using git:
```bash
git clone https://github.com/syeo66/ship-my-stuff.git
```

First start Ganache on port 8545.

```bash
ganache-cli
```
and then build the dApp

```bash
cd ship-my-stuff # if you're not yet in this folder
npm install
truffle compile
truffle migrate
npm run build # Important! Needs to be after truffle migrate
```

**Just to make sure: `npm run build` is required after `truffle migrate` (also in development environment) to make sure the contract information is available for the Javascript-App.**

## Start the webserver
```bash
npm run dev
```
Then you should be able to see the interface on `http://localhost:3000/`

## Run the tests
First start Ganache using

```bash
ganache-cli
```

The used port should be 8545.
Then start the tests using:

```bash
truffle test
```

## Public availability
The interface is available in public at [https://gateway.ipfs.io/ipns/ship-my-stuff.com/](https://ipfs.io/ipns/ship-my-stuff.com/) or - because ipns is rather slow - also hosted at [https://ship-my-stuff.com/](https://ship-my-stuff.com/).

There is a contract available on the Rinkeby network at [0xacc26d36721192206f3aff0b82b549bf3ebb4e06](https://rinkeby.etherscan.io/address/0xacc26d36721192206f3aff0b82b549bf3ebb4e06) and on the Ropsten network at [sms.redochsenbein.eth](https://ropsten.etherscan.io/address/0xe4a65634c6a154cbcb18d70a06942e5cb152568f) (0xe4a65634c6a154cbcb18d70a06942e5cb152568f).

The Registry contract can be found at Rinkeby [0x06e5f834f4e6c34de2478d82e8d78755a2fb1498](https://rinkeby.etherscan.io/address/0x06e5f834f4e6c34de2478d82e8d78755a2fb1498) and Ropsten [sms-registry.redochsenbein.eth](https://ropsten.etherscan.io/address/0x9dbacbe623634998e04925a4496aba0b3fc5e77a) (0x9dbacbe623634998e04925a4496aba0b3fc5e77a).

## Configuration
By clicking on the connection indicator on the top right you can open a configuration screen which allows you to set the IPFS node to be used. If you are not using MetaMask you can also set the Ethereum node url and your unlocked account address.

## Known issues
* The interface does not yet work in the Mist browser.
* When using the interface without MetaMask the account you want to use needs to be [unlocked](https://github.com/ethereum/go-ethereum/wiki/Managing-your-accounts) on the node.
* IPFS needs to be [CORS-enabled](https://github.com/INFURA/tutorials/wiki/IPFS-and-CORS).

## The future / next steps
* Integrate uPort: I was thinking about using uPort and MetaMask simultaniously. But I realized the two web3 implementations are not compatible and thus I'd have to implement every singe feature twice. Might be something for the future.
* A Karma system: To create an incentive to actually use the service respectfully there should be a - probably Token based - Karma system to weed out the 'bad players'.
* ... there are more ideas where all this came from.

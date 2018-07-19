# Ship my stuff

## What does it do?
### Basic functionality
**Ship my stuff** is a peer-to-peer delivery service. Think of it as some sort of a decentralized 'Uber for parcels'. The basic intendet use would be something along those lines (User **A** - Sender, User **B** - Hauler/Transporter, User **C** - Recipient):

* **A** sends some Ether to the contract, adds some details (like pick-up address, delivery address, weight, etc.).
* The offer gets published.
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
```bash
npm install
truffle compile
truffle migrate
npm run build # Important! Needs to be after truffle migrate
```
Of course this requires `ganach-cli` or similar to run on port 8545.

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

## Start the webserver
```bash
npm run dev
```
Then you should be able to see the interface on `http://localhost:3000/`

## Public availability
The interface is available in public at [https://ipfs.io/ipns/ship-my-stuff.com/](https://ipfs.io/ipns/ship-my-stuff.com/) or - because ipns is rather slow - also hosted at [https://ship-my-stuff.com/](https://ship-my-stuff.com/).
There is a contract available on the Rinkeby network at [sms.redochsenbein.eth](https://etherscan.io/address/sms.redochsenbein.eth).

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

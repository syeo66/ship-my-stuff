import { Observable, timer, fromEvent } from 'rxjs';
import { map, mergeMap, distinctUntilChanged } from 'rxjs/operators';
import MessageDialog from './message_dialog';
import ipfsAPI from 'ipfs-api';
import Web3 from 'web3';
import TruffleContract from 'truffle-contract';
import TransportMarketArtifact from '../../build/contracts/TransportMarket.json';

let Web3Connector = {
    web3Provider: null,
    web3: null,

    contracts: {},

    account: {account:null, balance:0, unclaimed:0},

    timerStream: null,
    providerStream: null,
    networkStatusStream: null,
    accountUpdateStream: null,
    updateStream: null,

    gasPrice: 10,

    _contractAddress: false,

    connectionData: {
        ipfsAddress: 'https://ipfs.infura.io:5001/',
        //ipfsAddress: 'http://localhost:5001/',
        nodeAddress: 'http://localhost:8545/',
        account: ''
    },

    init: () => {
        return new Promise((resolve, reject) => {
            Web3Connector.reconnect();
            Web3Connector.initStreams();
            Web3Connector.accountUpdateStream.subscribe(account => {Web3Connector.account = account});
            Web3Connector.readyContracts().then(_ => resolve());
        });
    },

    getWeb3: _ => Web3Connector.web3,

    reconnect: async _ => {
        let ipfsUrl = new URL(Web3Connector.connectionData.ipfsAddress);
        Web3Connector.ipfs = ipfsAPI(ipfsUrl.hostname || 'localhost', ipfsUrl.port || '5001', {protocol: ipfsUrl.protocol.replace(':', '') || 'http'});

        if (typeof web3 !== 'undefined') {
            Web3Connector.web3Provider = web3.currentProvider;
            Web3Connector.web3 = web3;
            Web3Connector.initGasPrice();
            return;
        }

        if (!!Web3Connector.web3) {
            Web3Connector.web3.reset();
        }

        /*
        Web3Connector.web3Provider = new Web3.providers.HttpProvider(Web3Connector.connectionData.nodeAddress);
        Web3Connector.web3 = new Web3(Web3Connector.web3Provider);
        if (!!Web3Connector.connectionData.account) {
            Web3Connector.web3.eth.defaultAccount = Web3Connector.connectionData.account;
            Web3Connector.account.account = Web3Connector.connectionData.account;
        }
        Web3Connector.initGasPrice();
        Web3Connector.contracts = [];
        await Web3Connector.initContracts();
        */

        if (Web3Connector.providerStream === null) {
            Web3Connector.providerStream = fromEvent(window, 'message').pipe(
                mergeMap(({data}) => {
                    if (data && data.type && data.type === 'ETHEREUM_PROVIDER_SUCCESS') {
                        Web3Connector.web3Provider = window.ethereum;
                        Web3Connector.web3 = new Web3(Web3Connector.web3Provider);
                        if (!!Web3Connector.connectionData.account) {
                            Web3Connector.web3.eth.defaultAccount = Web3Connector.connectionData.account;
                            Web3Connector.account.account = Web3Connector.connectionData.account;
                        }
                    }
                })
            );
            Web3Connector.providerStream.subscribe(_ => {
                Web3Connector.initGasPrice();
                Web3Connector.contracts = [];
                Web3Connector.initContracts();
            });
        }

        window.postMessage({ type: 'ETHEREUM_PROVIDER_REQUEST' }, '*');
    },

    initGasPrice: () => {
        Web3Connector.web3.eth.getGasPrice((error, result) => {
            Web3Connector.gasPrice = result.toNumber();
        });
    },

    initStreams: () => {
        Web3Connector.timerStream = timer(100, 1000);
        Web3Connector.initNetworkStatusStream();
        Web3Connector.initAccountUpdateStream();
    },

    readyContracts: () => {
        return new Promise((resolve, reject) => {
            if (typeof Web3Connector.contracts.TransportMarket != 'undefined' || !Web3Connector.web3Provider) {
                resolve();
                return;
            }
            Web3Connector.initContracts().then(_ => {
                Web3Connector.initUpdateStream();
                resolve();
            });
        });
    },

    initAccountUpdateStream: () => {
        Web3Connector.accountUpdateStream = Web3Connector.timerStream.pipe(
            map(v => Math.round(v/5))
        ).pipe(distinctUntilChanged()).pipe(
            mergeMap(v => Observable.create(observable => {
                if (!Web3Connector.web3Provider) {
                    return;
                }
                const account = Web3Connector.getWeb3().eth.defaultAccount;
                if (typeof account === 'undefined') {
                    observable.next({
                        account: 0x0,
                        balance: 0,
                        unclaimed: 0
                    });
                    return;
                }
                Web3Connector.getWeb3().eth.getBalance(account, async (error, v) => {
                    observable.next({
                        account: account,
                        balance: v.toNumber(),
                        unclaimed: Web3Connector.account.unclaimed
                    });
                    await Web3Connector.initContracts();
                    const balance = await Web3Connector.getBalance(account);
                    observable.next({
                        account: account,
                        balance: v.toNumber(),
                        unclaimed: balance
                    });
                });
            }))
        );
    },

    initUpdateStream: () => {
        if (typeof Web3Connector.contracts.TransportMarket == 'undefined') {
            return;
        }
        Web3Connector.contracts.TransportMarket.deployed().then(contract => {
            const allEvents = contract.allEvents();
            Web3Connector.updateStream = Observable.create(observable => {
                allEvents.watch((err, res) => observable.next(res));
            });
        });
    },

    initNetworkStatusStream: () => {
        Web3Connector.networkStatusStream = Web3Connector.timerStream.pipe(
            mergeMap(v => Observable.create(async observable => {
                if (!Web3Connector.web3Provider) {
                    observable.next(false);
                    return;
                }
                observable.next({
                    network: Web3Connector.getWeb3().version.network,
                    isMetaMask: !!Web3Connector.getWeb3().currentProvider.isMetaMask,
                    account: Web3Connector.account.account
                });
            }))
        ).pipe(distinctUntilChanged(((a,b)=>{return JSON.stringify(a) == JSON.stringify(b)}))).pipe(
            mergeMap(v => Observable.create(observable => {
                let network = 'Private';
                switch (v.network) {
                    case "1":
                        network = 'Mainnet';
                        break;
                    case "2":
                        network = 'Morden';
                        break;
                    case "3":
                        network = 'Ropsten';
                        break;
                    case "4":
                        network = 'Rinkeby';
                        break;
                    case "42":
                        network = 'Kovan';
                        break;
                    case "loading":
                        network = false;
                        break;
                }
                observable.next({
                    ...v, name: network
                });
            }))
        );
    },

    initContracts: () => {
        return new Promise(async (resolve, reject) => {
            if (typeof Web3Connector.contracts.TransportMarket != 'undefined' || !Web3Connector.web3Provider) {
                resolve();
                return;
            }

            //const TransportMarketArtifact = await import('../../build/contracts/TransportMarket.json');
            Web3Connector.contracts.TransportMarket = TruffleContract(TransportMarketArtifact);
            Web3Connector.contracts.TransportMarket.setProvider(Web3Connector.web3Provider);
            resolve();
        });
    },

    createParcel: (confirmationHash, description, price) => {
        return new Promise((resolve, reject) => {
            if (typeof Web3Connector.contracts.TransportMarket == 'undefined') {
                resolve();
                return;
            }
            Web3Connector.contracts.TransportMarket.deployed().then(contract => {
                try {
                    contract.createParcel(confirmationHash, description, {
                        from: Web3Connector.account.account,
                        gas: 400000,
                        gasPrice: Web3Connector.gasPrice,
                        value: price
                    }).then((error, data) => {
                        resolve(data);
                    }).catch(_ => reject());
                } catch(err) {reject(err)}
            }).catch(err => {
                MessageDialog.alert('Contract does not exist on this network.');
            });
        });
    },

    takeParcel: hash => {
        return new Promise(async (resolve, reject) => {
            if (typeof Web3Connector.contracts.TransportMarket == 'undefined') {
                resolve();
                return;
            }
            const index = await Web3Connector.getParcelIndex(hash);
            Web3Connector.contracts.TransportMarket.deployed().then(contract => {
                try {
                    contract.takeParcel(index, {
                        from: Web3Connector.account.account,
                        gas: 200000,
                        gasPrice: Web3Connector.gasPrice
                    }).then(_ => resolve());
                } catch(err) {reject(err)}
            }).catch(err => {
                MessageDialog.alert('Contract does not exist on this network.')
            });
        });
    },

    pickUpParcel: hash => {
        return new Promise(async (resolve, reject) => {
            if (typeof Web3Connector.contracts.TransportMarket == 'undefined') {
                resolve();
                return;
            }
            const index = await Web3Connector.getParcelIndex(hash);
            Web3Connector.contracts.TransportMarket.deployed().then(contract => {
                try {
                    contract.pickUpParcel(index, {
                        from: Web3Connector.account.account,
                        gasPrice: Web3Connector.gasPrice,
                        gas: 45000
                    }).then(_ => resolve());
                } catch(err) {reject(err)}
            }).catch(err => {
                MessageDialog.alert('Contract does not exist on this network.')
            });
        });
    },

    cancelParcel: hash => {
        return new Promise(async (resolve, reject) => {
            if (typeof Web3Connector.contracts.TransportMarket == 'undefined') {
                resolve();
                return;
            }
            const index = await Web3Connector.getParcelIndex(hash);
            Web3Connector.contracts.TransportMarket.deployed().then(contract => {
                try {
                    contract.cancelParcel(index, {
                        from: Web3Connector.account.account,
                        gasPrice: Web3Connector.gasPrice,
                        gas: 150000
                    }).then(_ => resolve());
                } catch(err) {reject(err)}
            }).catch(err => {
                MessageDialog.alert('Contract does not exist on this network.')
            });
        });
    },

    deliverParcel: key => {
        return new Promise(async (resolve, reject) => {
            if (typeof Web3Connector.contracts.TransportMarket == 'undefined') {
                resolve();
                return;
            }
            const hash = Web3Connector.web3.sha3(key);
            const index = await Web3Connector.getParcelIndex(hash);
            Web3Connector.contracts.TransportMarket.deployed().then(contract => {
                try {
                    contract.deliverParcel(index, key, {
                        from: Web3Connector.account.account,
                        gasPrice: Web3Connector.gasPrice,
                        gas: 100000
                    }).then(_ => resolve()).catch(err => reject(err));
                } catch(err) {reject(err)}
            }).catch(err => {
                MessageDialog.alert('Contract does not exist on this network.')
            });
        });
    },

    withdraw: _ => {
        return new Promise(async (resolve, reject) => {
            if (typeof Web3Connector.contracts.TransportMarket == 'undefined') {
                resolve();
                return;
            }
            Web3Connector.contracts.TransportMarket.deployed().then(contract => {
                try {
                    contract.withdraw({
                        from: Web3Connector.account.account,
                        gasPrice: Web3Connector.gasPrice,
                        gas: 50000
                    }).then(_ => resolve());
                } catch(err) {reject(err)}
            }).catch(err => {
                MessageDialog.alert('Contract does not exist on this network.')
            });
        });
    },

    getParcelIndex: hash => {
        return new Promise((resolve, reject) => {
            if (typeof Web3Connector.contracts.TransportMarket == 'undefined') {
                resolve();
                return;
            }
            Web3Connector.contracts.TransportMarket.deployed().then(contract => {
                try {
                    contract.getParcelIndex.call(hash, {from: Web3Connector.account.account}).then(data => {
                        resolve(data);
                    }).catch(err => reject(err));
                } catch(err) {reject(err)}
            }).catch(err => {
                MessageDialog.alert('Contract does not exist on this network.')
            });
        });
    },

    getParcel: hash => {
        return new Promise(async (resolve, reject) => {
            if (typeof Web3Connector.contracts.TransportMarket == 'undefined') {
                resolve();
                return;
            }
            const index = await Web3Connector.getParcelIndex(hash);
            Web3Connector.contracts.TransportMarket.deployed().then(async contract => {
                try {
                    const data = await contract.getParcelDescription.call(index, {from: Web3Connector.account.account});
                    const description = JSON.parse(data);
                    
                    // [senderAddress, haulerAddress, price, state]
                    const parcel = await contract.getParcel.call(index,  {from: Web3Connector.account.account});
                    const senderAddress = parcel[0];
                    const haulerAddress = parcel[1];
                    const price = parcel[2];
                    const state = parcel[3];
                    let parcelContent = description;
                    Web3Connector.ipfs.files.get(description.hash).then(
                        files => {
                            files.forEach(file => {
                                parcelContent = {...parcelContent, ...JSON.parse(file.content.toString('utf8'))};
                            });
    
                            resolve({
                                confirmationHash: hash,
                                senderAddress: senderAddress,
                                haulerAddress: haulerAddress,
                                fromAddress: Web3Connector.safeString(parcelContent.fromAddress),
                                from3Words: Web3Connector.safeString(parcelContent.from3Words),
                                toAddress: Web3Connector.safeString(parcelContent.toAddress),
                                to3Words: Web3Connector.safeString(parcelContent.to3Words),
                                weight: parseFloat(parcelContent.weight),
                                price: price.toNumber(),
                                state: state.toNumber()
                            });
                        }).catch(_ => {
                            resolve({
                                confirmationHash: hash,
                                senderAddress: senderAddress,
                                haulerAddress: haulerAddress,
                                price: price.toNumber(),
                                state: state.toNumber()
                            });
                        });
                } catch(err) {reject(err)}
            }).catch(err => {
                MessageDialog.alert('Contract does not exist on this network.')
            });
        });
    },

    getMyParcels: () => {
        return Web3Connector.getParcels('mine');
    },

    getTakenParcels: () => {
        return Web3Connector.getParcels('taken');
    },

    getParcels: type => {
        return new Promise((resolve, reject) => {
            if (typeof Web3Connector.contracts.TransportMarket == 'undefined') {
                resolve();
                return;
            }
            Web3Connector.contracts.TransportMarket.deployed().then(contract => {
                try {
                    let method;
                    switch (type) {
                        case 'taken':
                            method = contract.getTakenParcels;
                            break;
                        case 'mine':
                            method = contract.getMyParcels;
                            break;
                        default:
                            method = contract.getCreatedParcels;
                            break;
                    }
                    method.call({from: Web3Connector.account.account}).then(data => {
                        let parcels = [];
                        for (let i = 0; i < data.length; i++) {
                            parcels.push({
                                confirmationHash: data[i],
                                fromAddress: null,
                                toAddress: null,
                                weight: null,
                                price: null
                            });
                        }
                        resolve(parcels);
                    }).catch(err => reject(err));
                } catch(err) {reject(err)}
            }).catch(err => {
                MessageDialog.alert('Contract does not exist on this network.')
            });
        });
    },

    getMaxValue: () => {
        return new Promise((resolve, reject) => {
            if (typeof Web3Connector.contracts.TransportMarket == 'undefined') {
                resolve();
                return;
            }
            Web3Connector.contracts.TransportMarket.deployed().then(contract => {
                try {
                    contract.maxValue.call({from: Web3Connector.account.account}).then(data => {
                        resolve(data.toNumber());
                    }).catch(err => reject(err));
                } catch(err) {reject(err)}
            }).catch(err => {
                MessageDialog.alert('Contract does not exist on this network.')
            });
        });
    },

    getBalance: account => {
        return new Promise((resolve, reject) => {
            Web3Connector.contracts.TransportMarket.deployed().then(contract => {
                try {
                    contract.getBalance.call(account, {from: account}).then(data => {
                        resolve(data.toNumber());
                    }).catch(err => reject(err));
                } catch(err) {reject(err)}
            }).catch(err => {
                MessageDialog.alert('Contract does not exist on this network.')
            });
        });
    },

    safeString: (text) => {
        const temp = document.createElement('div');
        temp.innerHTML = text;
        return temp.innerText;
    }
};

export default Web3Connector;

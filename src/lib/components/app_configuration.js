import React, {Component} from 'react';
import FormField from './form_field';
import Web3Connector from '../web3connector';

class AppConfiguration extends Component {
    subscription = null;

    constructor(props) {
        super(props);
        
        this.state = {
            disabled: false,
            ipfsAddress: props.ipfsAddress || Web3Connector.connectionData.ipfsAddress,
            nodeAddress: props.nodeAddress || Web3Connector.connectionData.nodeAddress,
            account: props.account || Web3Connector.connectionData.account,
            isMetaMask: false,
            isTrust: false,
            isToshi: false,
            isConnected: false
        };
    }

    componentDidMount() {
        $('#configurationModal').on('hidden.bs.modal', _ => {
            if (!this.isAddress(this.state.account)) {
                this.setState(prevState => ({...prevState, account: ''}));
            }

            Web3Connector.connectionData.account = this.state.account;
            Web3Connector.connectionData.ipfsAddress = this.state.ipfsAddress || 'https://ipfs.infura.io:5001/';
            Web3Connector.connectionData.nodeAddress = this.state.nodeAddress || 'https://localhost:8545/';
            Web3Connector.reconnect();
        });

        this.subscription = Web3Connector.networkStatusStream.subscribe(data => {
            let web3 = Web3Connector.web3;
            this.setState(prevState => ({
                ...prevState,
                isMetaMask: !!web3.currentProvider.isMetaMask,
                isTrust: !!web3.currentProvider.isTrust,
                isToshi: typeof window.SOFA !== 'undefined',
                isCypher: typeof window.__CIPHER__ !== 'undefined',
                isConnected: !!data.name,
                hasAccount: !!web3.eth.defaultAccount,
                network: data.name
            }));
        });
    }

    componentWillUnmount() {
        if (this.subscription !== null) {
            this.subscription.unsubscribe();
        }
    }

    handleIpfsAddress(e) {
        this.setState(prevState => ({...prevState, ipfsAddress: e}));
    }

    handleNodeAddress(e) {
        this.setState(prevState => ({...prevState, nodeAddress: e}));
    }

    handleAccount(e) {
        this.setState(prevState => ({...prevState, account: e.toLowerCase()}));
    }

    handleSubmit(e) {
        e.preventDefault();
    }

    isAddress(address) {
        if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
            // check if it has the basic requirements of an address
            return false;
        }
        if (/^(0x)?[0-9a-f]{40}$/.test(address) || /^(0x)?[0-9A-F]{40}$/.test(address)) {
            // If it's all small caps or all all caps, return true
            return true;
        }

        // Otherwise check each case
        return this.isChecksumAddress(address);
    }

    isChecksumAddress(address) {
        // Check each case
        address = address.replace('0x','');
        var addressHash = sha3(address.toLowerCase());
        for (var i = 0; i < 40; i++ ) {
            // the nth letter should be uppercase if the nth digit of casemap is 1
            if ((parseInt(addressHash[i], 16) > 7 && address[i].toUpperCase() !== address[i]) || (parseInt(addressHash[i], 16) <= 7 && address[i].toLowerCase() !== address[i])) {
                return false;
            }
        }
        return true;
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit.bind(this)}>
                <div className="modal-body">
                    {this.state.isMetaMask &&
                        <div className="row">
                            <div className="col">
                                <img src="images/metamask.svg" width="40" />&nbsp;<span style={{color:this.state.hasAccount!==false ? '#6f6' : '#f66'}}><i className="fas fa-signal"></i></span> {this.state.hasAccount && "Connected using Metamask"}{!this.state.hasAccount && "Please unlock Metamask."}
                                <hr/>
                            </div>
                        </div>}
                    {this.state.isToshi &&
                        <div className="row">
                            <div className="col">
                                <img src="images/toshi.png" width="40" />&nbsp;<span style={{color:this.state.hasAccount!==false ? '#6f6' : '#f66'}}><i className="fas fa-signal"></i></span> {this.state.hasAccount && "Connected using Toshi"}
                                <hr/>
                            </div>
                        </div>}
                    {!this.state.isMetaMask && !this.state.isToshi &&
                        <div className="row">
                            <div className="col">
                                <span style={{color:this.state.isConnected!==false ? '#6f6' : '#f66'}}><i className="fas fa-signal"></i></span> {this.state.isConnected && "Connected to " + this.state.network + " network"}{this.state.isConnected && !this.state.hasAccount && " but no account available."}{!this.state.isConnected && "Not connected."}
                                <hr/>
                                <FormField disabled={this.state.disabled} onChange={this.handleNodeAddress.bind(this)} name="nodeAddress" fieldLabel="Ethereum Node URL" placeholder="http://localhost:8545/" value={this.state.nodeAddress} />
                                <FormField disabled={this.state.disabled} helpText="Needs to be unlocked on your node." onChange={this.handleAccount.bind(this)} name="account" fieldLabel="Ethereum Address" placeholder="0x..." value={this.state.account} />
                            </div>
                        </div>
                    }
                    <FormField disabled={this.state.disabled} onChange={this.handleIpfsAddress.bind(this)} name="ipfsAddress" fieldLabel="IPFS Host API" placeholder="http://localhost:5001/" value={this.state.ipfsAddress} />
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                </div>
            </form>
        );
    }
}

module.exports = AppConfiguration;
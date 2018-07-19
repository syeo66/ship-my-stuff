import React, {Component} from 'react';
import Web3Connector from '../web3connector';

class NetworkIndicator extends Component {
    subscription = null;

    constructor(props) {
        super(props);
        this.state = {status:false, name:null};
    }

    handleConfig() {
        jQuery('#configurationModal').modal();
    }

    onUpdate(data) {
        this.setState(prevState => ({
            status: data,
            name: data.name
        }));
    }

    componentDidMount() {
        this.subscription = Web3Connector.networkStatusStream.subscribe(this.onUpdate.bind(this));
    }

    componentWillUnmount() {
        if (this.subscription !== null) {
            this.subscription.unsubscribe();
        }
    }

    render() {
        return (
            <button className="btn btn-dark btn-outline-light" onClick={this.handleConfig.bind(this)}>
                <span style={{color:this.state.status!==false ? (!Web3Connector.web3.eth.defaultAccount ? '#ffa500' : '#6f6') : '#f66'}}><i className="fas fa-signal"></i></span>
                &nbsp;<span>{this.state.name}</span>
            </button>
        );
    };
}

module.exports = NetworkIndicator;

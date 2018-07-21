import React, {Component} from 'react';
import Web3Connector from '../web3connector';
import MessageDialog from '../message_dialog';

class AccountData extends Component {
    subscription = null;

    constructor(props) {
        super(props);
        this.state = {
            account: '-',
            balance: 0,
            unclaimed: 0,
            disabled: false
        };
    }

    onUpdate(data) {
        this.setState(prevState => {
            let web3 = Web3Connector.web3;
            data.balance = web3.fromWei(data.balance, 'ether');
            data.unclaimed = web3.fromWei(data.unclaimed, 'ether');
            return data;
        });
    }

    componentDidMount() {
        this.subscription = Web3Connector.accountUpdateStream.subscribe(this.onUpdate.bind(this));
    }

    componentWillUnmount() {
        if (this.subscription !== null) {
            this.subscription.unsubscribe();
        }
    }

    handleWithdraw() {
        this.setState(prevState => ({...prevState, disabled: true}));
        Web3Connector.withdraw().then((err, res) => {
            MessageDialog.notice('Successfully withdrew your unclaimed funds.');
            this.setState(prevState => ({...prevState, disabled: false}));
        }).catch(_ => this.setState(prevState => ({...prevState, disabled: false})));
    }

    render() {
        return (
            <div>
                <div style={{overflow:"hidden",textOverflow:"ellipsis"}}><strong>Account:</strong><br/>{this.state.account || '-'}</div>
                <div className="mt-1">
                    <strong>Balance:</strong><br/><i className="fab fa-ethereum"></i>&nbsp;{Number.parseFloat(this.state.balance).toPrecision(5)}
                    &nbsp;<small className="text-muted">(<i className="fab fa-ethereum"></i> {Number.parseFloat(this.state.unclaimed).toPrecision(3)} unclaimed)</small>&nbsp;
                    {this.state.unclaimed > 0 &&
                        <button onClick={this.handleWithdraw.bind(this)} disabled={this.state.disabled} className="btn btn-primary btn-sm"><i className={this.state.disabled?"fas fa-sync fa-spin":"fas fa-hand-holding-usd"}></i>&nbsp;Withdraw</button>
                    }
                </div>
            </div>
        );
    }
}

module.exports = AccountData;

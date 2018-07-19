import React, {Component} from 'react';
import Web3Connector from '../web3connector';
import MessageDialog from '../message_dialog';

// {Created, Taken, PickedUp, Delivered, Cancelled}
const ParcelState = Object.freeze({
    CREATED: 0,
    TAKEN: 1,
    PICKED_UP: 2,
    DELIVERED: 3,
    CANCELLED: 4
});

class Parcel extends Component {
    constructor(props) {
        super(props);
        this.state = {disabled:false};
    }

    render() {
        let web3 = Web3Connector.web3;
        return (
            <div className="col-md-4 mb-3">
                <div className="border rounded shadow p-2">
                    <div className="row">
                        <div className="col">
                            <strong>From:</strong> {this.props.fromAddress || '-'}&nbsp;{this.props.from3Words &&
                                <a title={this.props.from3Words} href={"https://map.what3words.com/"+this.props.from3Words.replace(/\/*/,'')} target="_blank"><img src="images/what3words.png" style={{width:'16px'}} alt={this.props.from3Words} /></a>
                            }
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <strong>To:</strong> {this.props.toAddress || '-'}&nbsp;{this.props.to3Words &&
                                <a title={this.props.to3Words} href={"https://map.what3words.com/"+(this.props.to3Words.replace(/\/*/,''))} target="_blank"><img src="images/what3words.png" style={{width:'16px'}} alt={this.props.to3Words} /></a>
                            }
                        </div>
                    </div>
                    <div className="row">
                        <div className="col"><strong>Weight:</strong> {this.props.weight || '0'}kg</div>
                    </div>
                    <hr/>
                    <div className="row">
                        {this.props.fromAddress && 
                            (this.props.state == ParcelState.PICKED_UP) &&
                            <div className="col"><i className="fas fa-shipping-fast"></i></div>
                        }
                        {this.props.fromAddress && 
                            (this.props.state == ParcelState.DELIVERED) &&
                            <div className="col"><i className="fas fa-parachute-box"></i></div>
                        }
                        {this.props.fromAddress &&
                            !!Web3Connector.account.account &&
                            (this.props.senderAddress != Web3Connector.account.account) &&
                            (this.props.state == ParcelState.CREATED) &&
                            <div className="col"><button onClick={this.handleTake.bind(this)} disabled={this.state.disabled} className="btn btn-sm btn-secondary"><i className={this.state.disabled?"fas fa-sync fa-spin":"fas fa-shipping-fast"}></i> Take</button></div>
                        }
                        {this.props.fromAddress && 
                            !!Web3Connector.account.account &&
                            (this.props.senderAddress == Web3Connector.account.account) &&
                            (this.props.state == ParcelState.CREATED) &&
                            <div className="col"><button onClick={this.handleCancel.bind(this)} disabled={this.state.disabled} className="btn btn-sm btn-danger"><i className={this.state.disabled?"fas fa-sync fa-spin":"fas fa-ban"}></i> Cancel</button></div>
                        }
                        {this.props.fromAddress && 
                            !!Web3Connector.account.account &&
                            (this.props.senderAddress == Web3Connector.account.account) &&
                            (this.props.state == ParcelState.TAKEN) &&
                            <div className="col"><button onClick={this.handlePickUp.bind(this)} disabled={this.state.disabled} className="btn btn-sm btn-primary"><i className={this.state.disabled?"fas fa-sync fa-spin":"fas fa-truck"}></i> Picked up</button></div>
                        }
                        <div className="col text-right"><i className="fab fa-ethereum"></i><strong>&nbsp;{web3.fromWei(this.props.price, 'ether') || '0'}</strong></div>
                    </div>
                </div>
            </div>
        );
    }

    handleTake() {
        this.setState({disabled:true});
        Web3Connector.takeParcel(this.props.confirmationHash).then(_ => {
            MessageDialog.notice('You took this offer. Please contact the sender to clarify the details.');
            this.setState({disabled:false});
        }).catch(_ => this.setState({disabled:false}));
    }

    handlePickUp() {
        this.setState({disabled:true});
        Web3Connector.pickUpParcel(this.props.confirmationHash).then(_ => {
            MessageDialog.notice('The parcel has been picked up.');
            this.setState({disabled:false});
        }).catch(_ => this.setState({disabled:false}));
    }

    handleCancel() {
        this.setState({disabled:true});
        Web3Connector.cancelParcel(this.props.confirmationHash).then(_ => {
            MessageDialog.notice('The offer has been cancelled.');
            this.setState({disabled:false});
        }).catch(_ => this.setState({disabled:false}));
    }
}

module.exports = Parcel;
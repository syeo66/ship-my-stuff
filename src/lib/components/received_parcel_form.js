import React, {Component} from 'react';
import FormField from './form_field';
import Web3Connector from '../web3connector';
import MessageDialog from '../message_dialog';
import 'bootstrap';

class ReceivedParcelForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            receiptionCode: '',
            disabled: false,
            buttonDisabled: true
        };
    } 

    render() {
        return (
            <form onSubmit={this.handleSubmit.bind(this)}>
                <FormField disabled={this.state.disabled} onChange={this.handleReceiptionCode.bind(this)} name="parcelFromAddress" placeholder="Confirmation code" value={this.state.receiptionCode} />
                <button className="btn btn-primary" disabled={this.state.buttonDisabled}><i className={this.state.disabled?"fas fa-sync fa-spin":"fas fa-box"}></i>&nbsp;Confirm</button>
            </form>
        );
    }

    handleReceiptionCode(code) {
        code = code.substr(0, 8).replace(/[^a-f0-9]/i, '');
        this.setState(prevState => ({
            ...prevState, 
            receiptionCode: code,
            buttonDisabled: (code.length != 8)
        }));
    }

    handleSubmit(e) {
        e.preventDefault();
        this.setState({...this.state, disabled: true});
        Web3Connector.deliverParcel(this.state.receiptionCode).then(_ => {
            this.setState({receiptionCode:'', disabled: false});
            MessageDialog.notice('Thanks for confirming the parcel.')
        }).catch(_ => {
            MessageDialog.alert('Confirming the parcel failed. Maybe you have to verify your code or the receiption has been confirmed already.');
            this.setState({...this.state, disabled: false});
        });
    }
}

module.exports = ReceivedParcelForm;
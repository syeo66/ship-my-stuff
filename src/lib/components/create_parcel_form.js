import React, {Component} from 'react';
import FormField from './form_field';
import Web3Connector from '../web3connector';
import MessageDialog from '../message_dialog';
import 'bootstrap';

class CreateParcelForm extends Component {
    submitStream = null;

    cleanState = {
        fromAddress: '',
        from3Words: '',
        toAddress:'',
        to3Words:'',
        weight:'',
        price:'',
        maxPrice:'',
        disabled:false
    };

    constructor(props) {
        super(props);
        this.state = {...this.cleanState};

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleFromAddress = this.handleFromAddress.bind(this);
        this.handleFrom3Words = this.handleFrom3Words.bind(this);
        this.handleToAddress = this.handleToAddress.bind(this);
        this.handleTo3Words = this.handleTo3Words.bind(this);
        this.handleWeight = this.handleWeight.bind(this);
        this.handlePrice = this.handlePrice.bind(this);
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <FormField disabled={this.state.disabled} onChange={this.handleFromAddress} name="parcelFromAddress" fieldLabel="Pick up at address" placeholder="John Doe, Somestreet, 94743 Example" value={this.state.fromAddress} />
                <FormField disabled={this.state.disabled} onChange={this.handleFrom3Words} help3Words="Find the 3 words address" name="parcelFrom3Words" fieldLabel="Pick up 3 words address" placeholder="///..." value={this.state.from3Words} />
                <FormField disabled={this.state.disabled} onChange={this.handleToAddress} name="parcelToAddress" fieldLabel="Send to address" placeholder="Jane Doe, Otherstreet, 94743 Example" value={this.state.toAddress} />
                <FormField disabled={this.state.disabled} onChange={this.handleTo3Words} help3Words="Find the 3 words address" name="parcelTo3Words" fieldLabel="Receipients 3 words address" placeholder="///..." value={this.state.to3Words} />
                <FormField disabled={this.state.disabled} onChange={this.handleWeight} name="parcelWeight" fieldLabel="Weight in kg" value={this.state.weight} />
                <FormField maxValue={this.state.maxValue} disabled={this.state.disabled} onChange={this.handlePrice} name="parcelPrice" fieldLabel="Compensation in Ether" value={this.state.price} />
                <button className="btn btn-primary" disabled={this.state.disabled}><i className={this.state.disabled?"fas fa-sync fa-spin":"fas fa-box"}></i>&nbsp;Create offer</button>
                <hr/>
            </form>
        );
    }

    componentDidMount() {
        let web3 = Web3Connector.web3;
        Web3Connector.readyContracts().then(_ => {
            Web3Connector.getMaxValue().then(v => this.setState({...this.state, maxValue: web3.fromWei(v, 'ether')}));
        });
    }

    handleFromAddress(fromAddress) {
        this.setState({...this.state, fromAddress: fromAddress});
    }

    handleFrom3Words(from3Words) {
        this.setState({...this.state, from3Words: from3Words});
    }

    handleToAddress(toAddress) {
        this.setState({...this.state, toAddress: toAddress});
    }

    handleTo3Words(to3Words) {
        this.setState({...this.state, to3Words: to3Words});
    }

    handleWeight(weight) {
        weight = weight.replace(/[^0-9\.]*/, '');
        this.setState({...this.state, weight: weight});
    }

    handlePrice(price) {
        price = price.replace(/[^0-9\.]*/, '');
        if (parseFloat(price) > this.state.maxValue) {
            price = this.state.maxValue;
        }
        this.setState({...this.state, price: price});
    }

    handleSubmit(e) {
        e.preventDefault();
        if (!this.state.fromAddress
            || !this.state.toAddress
            || !this.state.weight
            || !this.state.price) {
            return;
        }

        let web3 = Web3Connector.web3;

        const description = JSON.stringify({
            fromAddress: this.state.fromAddress,
            from3Words: this.state.from3Words,
            toAddress: this.state.toAddress,
            to3Words: this.state.to3Words,
            weight: this.state.weight,
            nonce: Math.random()
        });

        this.setState({...this.state, disabled: true});

        const confirmationKey = web3.sha3(description).substring(2, 10);
        const confirmationHash = web3.sha3(confirmationKey);

        const ifpsBuffer = Buffer.from(description);
        Web3Connector.ipfs.add(ifpsBuffer, {pin:true})
            .then(response => {
                const parcelData = JSON.stringify({hash:response[0].hash});
                Web3Connector.createParcel(confirmationHash, parcelData, web3.toWei(this.state.price, 'ether')).then(() => {
                    let $modal = $('#confirmationCodeModal');
                    $('#confirmationCode', $modal).text(confirmationKey);
                    MessageDialog.notice('The offer has been published.');
                    $modal.modal();
                    this.setState({...this.cleanState});
                }).catch(_ => {
                    MessageDialog.alert('Could not create the offer.');
                    this.setState({...this.state, disabled: false});
                });
            }).catch((err) => {
                console.log(err);
            });
    }
}

export default CreateParcelForm;

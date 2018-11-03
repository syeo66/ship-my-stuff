import React from 'react';
import { render } from 'react-dom';
import Web3Connector from './web3connector';
import NetworkIndicator from './components/network_indicator';
import AccountData from './components/account_data';
import ReceivedParcelForm from './components/received_parcel_form';
import CreateParcelForm from './components/create_parcel_form';
import ParcelList from './components/parcel_list';
import Messages from './components/messages';
import AppConfiguration from './components/app_configuration';

let App = {
    init: () => {
        App.initWeb3();
    },

    initWeb3: () => {
        Web3Connector.init().then(_ => App.initFrontend());
    },

    initFrontend: () => {
        render(<NetworkIndicator />, document.querySelector('#networkIndicator'));
        render(<AccountData />, document.querySelector('#accountData'));
        render(<ReceivedParcelForm />, document.querySelector('#receivedParcelForm'));
        render(<CreateParcelForm />, document.querySelector('#createParcelForm'));
        render(<ParcelList />, document.querySelector('#parcelList'));
        render(<Messages />, document.querySelector('#messageContainer'));
        render(<AppConfiguration />, document.querySelector('#configuration'));
    }
}

export default App;

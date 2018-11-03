import React, {Component} from 'react';
import Parcel from './parcel';
import Web3Connector from '../web3connector';
import { merge } from 'rxjs';
import { distinctUntilChanged, map, throttleTime } from 'rxjs/operators';

const ListType = Object.freeze({
    CREATED: Symbol('list_created'),
    MINE: Symbol('list_mine'),
    TAKEN: Symbol('list_taken')
});

const BUTTON_CLASS_ACTIVE = 'btn btn-secondary';
const BUTTON_CLASS_INACTIVE = 'btn btn-outline-secondary';

class ParcelList extends Component {
    

    constructor(props) {
        super(props);
        let i = 0;
        this.state = {
            listType: ListType.CREATED,
            className: {
                created: BUTTON_CLASS_ACTIVE,
                mine: BUTTON_CLASS_INACTIVE,
                taken: BUTTON_CLASS_INACTIVE
            },
            parcels: []
        };
    }

    componentDidMount() {
        this.doUpdate().then(_ => {
            let web3 = Web3Connector.web3;
            merge(
                Web3Connector.updateStream,
                Web3Connector.accountUpdateStream
            ).pipe(
                map(v => web3.sha3(JSON.stringify(v)))
            ).pipe(distinctUntilChanged())
            .pipe(throttleTime(1000)).subscribe(this.doUpdate.bind(this));
        });
    }

    doUpdate() {
        return new Promise((resolve, reject) => {
            Web3Connector.readyContracts().then(async _ => {
                let parcels;
                switch (this.state.listType) {
                    case ListType.MINE:
                        parcels = await Web3Connector.getMyParcels();
                        break;
                    case ListType.TAKEN:
                        parcels = await Web3Connector.getTakenParcels();
                        break;
                    default:
                        parcels = await Web3Connector.getParcels();
                        break;
                }
                if (!parcels) {
                    parcels = [];
                }
                let count = 0;
                for (let i = 0; i < parcels.length; i++) {
                    parcels[i].loading = true;
                    let parcel = parcels[i];
                    Web3Connector.getParcel(parcel.confirmationHash).then(data => {
                        data.loading = false;
                        parcels[i] = data;
                        if (++count == parcels.length) {
                            this.setState({...this.state, parcels: parcels});
                        }
                    });
                }
                this.setState({...this.state, parcels: parcels});
                resolve();
            });
        });
    }

    onSelectCreated() {
        this.setState({
            ...this.state, 
            listType: ListType.CREATED,
            className: {created: BUTTON_CLASS_ACTIVE, mine: BUTTON_CLASS_INACTIVE, taken: BUTTON_CLASS_INACTIVE}
        });
        this.doUpdate();
    }

    onSelectMine() {
        this.setState({
            ...this.state, 
            listType: ListType.MINE,
            className: {created: BUTTON_CLASS_INACTIVE, mine: BUTTON_CLASS_ACTIVE, taken: BUTTON_CLASS_INACTIVE}
        });
        this.doUpdate();
    }

    onSelectTaken() {
        this.setState({
            ...this.state, 
            listType: ListType.TAKEN,
            className: {created: BUTTON_CLASS_INACTIVE, mine: BUTTON_CLASS_INACTIVE, taken: BUTTON_CLASS_ACTIVE}
        });
        this.doUpdate();
    }

    render() {
        return (
            <div>
                <div className="row mb-2">
                    <div className="col"><h3>Pick and deliver a parcel</h3></div>
                    <div className="col text-right">
                        <div className="btn-group btn-group-sm" role="group" aria-label="Select list type">
                            <button onClick={this.onSelectCreated.bind(this)} type="button" className={this.state.className.created}>All available</button>
                            <button onClick={this.onSelectMine.bind(this)} type="button" className={this.state.className.mine}>My parcels</button>
                            <button onClick={this.onSelectTaken.bind(this)} type="button" className={this.state.className.taken}>To deliver</button>
                        </div>
                    </div>
                </div>
                <div className="row">
                    {this.state.parcels.map(parcel => (
                        <Parcel 
                            key={parcel.confirmationHash} 
                            confirmationHash={parcel.confirmationHash}
                            state={parcel.state} 
                            senderAddress={parcel.senderAddress} 
                            fromAddress={parcel.fromAddress} 
                            from3Words={parcel.from3Words} 
                            toAddress={parcel.toAddress} 
                            to3Words={parcel.to3Words} 
                            weight={parcel.weight} 
                            loading={parcel.loading} 
                            price={parcel.price} />
                    ))}
                </div>
                <hr/>
            </div>
        );
    }
}

export default ParcelList;

import React, {Component} from 'react';
import MessageDialog from '../message_dialog';

class Messages extends Component {
    timeout = null;
    subscription = null;

    constructor(props) {
        super(props);
        this.state = {
            message: null,
            alert: false,
            visible: false
        };
    }

    componentDidMount() {
        this.subscription = MessageDialog.getMessageStream().subscribe(this.onUpdate.bind(this));
    }

    componentWillUnmount() {
        if (this.subscription !== null) {
            this.subscription.unsubscribe();
        }
    }

    handleClick() {
        this.setState({
            message: null,
            alert: false,
            visible: false
        });
    }

    onUpdate(state) {
        this.setState(state);
        if (this.timeout !== null) {
            clearTimeout(this.timeout);
        }
        this.timeout = setTimeout(this.handleClick.bind(this), 15000);
    }

    render() {
        return (
            <div>
            {this.state.visible && !!this.state.message &&
                <div 
                    onClick={this.handleClick.bind(this)} 
                    className={this.state.alert?"alert alert-danger mt-4":"alert alert-success mt-4"} 
                    role="alert"
                    style={{cursor:'pointer'}}>{this.state.message}</div>
            }
            </div>
        );
    }
}

export default Messages;

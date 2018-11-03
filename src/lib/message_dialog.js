import { Observable, fromEvent } from 'rxjs';
import EventEmitter from 'events';

class EventProxy extends EventEmitter {
}

let MessageDialog = {
    _eventEmitter: null,
    _messageStream: null,

    init: _ => {
        if (MessageDialog._eventEmitter !== null) {
            return;
        }
        MessageDialog._eventEmitter = new EventProxy();
        MessageDialog._messageStream = fromEvent(MessageDialog._eventEmitter, 'message');
    },

    getMessageStream: _ => {
        MessageDialog.init();
        return MessageDialog._messageStream;
    },

    alert: message => {
        MessageDialog._eventEmitter.emit('message', {
            message: message,
            alert: true,
            visible: true
        });
    },

    notice: message => {
        MessageDialog._eventEmitter.emit('message', {
            message: message,
            alert: false,
            visible: true
        });
    }
}

export default MessageDialog;

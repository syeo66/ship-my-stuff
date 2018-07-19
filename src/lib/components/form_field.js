import React, {Component} from 'react';

class FormField extends Component {
    constructor(props) {
        super(props);
        this.state = { text: '' };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        let value = e.target.value;
        this.props.onChange(value);
    }

    render() {
        return (
            <div className="form-group">
                {this.props.fieldLabel &&
                    <label htmlFor={this.props.name}>{this.props.fieldLabel}</label>
                }
                <input className="form-control" 
                    type="text" 
                    name={this.props.name} 
                    id={this.props.name}
                    onChange={this.handleChange}
                    value={this.props.value}
                    placeholder={this.props.placeholder}
                    disabled={this.props.disabled} />
                {this.props.maxValue &&
                    <small className="form-text text-muted">max. <i className="fab fa-ethereum"></i>&nbsp;{this.props.maxValue}</small>
                }
                {this.props.helpText &&
                    <small className="form-text text-muted">{this.props.helpText}</small>
                }
                {this.props.help3Words &&
                    <small className="form-text text-muted"><a href="https://map.what3words.com/" target="_blank">{this.props.help3Words}</a></small>
                }
            </div>
        );
    }
}

module.exports = FormField;

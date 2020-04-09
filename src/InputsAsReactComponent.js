import React from 'react';
import { Redirect } from 'react-router-dom';
import qs from 'qs';
import Menu from './Menu';

class InputsAsReactComponent extends React.Component {

    constructor(props) {
        super( props );
        this.state = Object.assign(
            { checkboxes: [], text: '' },
            qs.parse( props.location.search, { ignoreQueryPrefix: true } )
        )
    }

    onChangeText(e) {
        const text = e.target.value;
        this.setState({
            text
        });
    };

    onChangeCheckbox(e) {
        const value = e.target.value;
        const pos = this.state.checkboxes.indexOf( value );
        let checkboxes = [ ...this.state.checkboxes ];
        if ( e.target.checked && pos === -1 ) {
            checkboxes.push( value );
        } else if ( ! e.target.checked && pos !== -1 ) {
            checkboxes.splice( pos, 1 );
        }
        this.setState({
            checkboxes
        });
    };

    componentDidUpdate() {
        const stringifiedState = '?' + qs.stringify( this.state );
        if ( stringifiedState !== this.props.location.search ) {
            this.props.history.replace( this.props.location.pathname + stringifiedState );
        }
    }

    render() {
        // Just to get some checkboxes
        const checkboxes = [ 'One', 'Two', 'Three', 'Four' ];

        return <div>
            <Menu {...this.props}/>
            <h1>As React Component</h1>
            <label>Text: <input type="text" id="text" value={this.state.text} onChange={e => this.onChangeText(e)}/></label>
            {checkboxes.map( value => {
                return <label key={value}>
                    <input id={'checkbox-' + value}
                           type="checkbox"
                           value={value}
                           checked={this.state.checkboxes.indexOf(value) !== -1}
                           onChange={e => this.onChangeCheckbox(e)}/>
                    {value}
                </label>
            })}
        </div>;

    }
}

export default InputsAsReactComponent;
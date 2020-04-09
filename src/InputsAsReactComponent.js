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
            activeElement: {
                id: e.target.id,
                cursor: e.target.selectionStart,
            },
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
            activeElement: {
                id: e.target.id,
                cursor: null,
            },
            checkboxes
        });
    };

    onChangeApplyMechanism(e) {
        this.setState({
            activeElement: {
                id: e.target.id,
                cursor: null,
            },
            applyMechanism: ! this.state.applyMechanism
        });
    };

    componentDidUpdate() {
        if ( this.state.applyMechanism && this.state.activeElement ) {
            const el = document.getElementById( this.state.activeElement.id );
            if ( el ) {
                el.focus();
                // If it's a text input, we can put the cursor in the right position
                if ( typeof this.state.activeElement.cursor === 'number' ) {
                    el.selectionStart = el.selectionEnd = this.state.activeElement.cursor;
                }
            }
        }
    }

    render() {
        // Just to get some checkboxes
        const checkboxes = [ 'One', 'Two', 'Three', 'Four' ];

        // Here's where the problem arises.  If the state has changed, we want to update the query string on the URL.
        // The way we're taught is to be declarative and return a <Redirect> component. However, doing that causes this
        // functional component to fully re-render, so the input that had focus is gone.
        const { applyMechanism, activeElement, ...relevantBits } = this.state;
        const stringifiedState = '?' + qs.stringify( relevantBits );
        if ( this.props.location.search !== stringifiedState ) {
            return <Redirect push={false} to={this.props.location.pathname + stringifiedState} />
        }

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

            <blockquote>
                <label>Apply Mechanism: <input type="checkbox" value={1} checked={!!this.state.applyMechanism} onChange={e => this.onChangeApplyMechanism(e)}/></label>
                <p>There's a mechanism in place to remember the id of the activeElement whenever the state changes. You can toggle
                    whether or not this mechanism is applied.  If it is applied, then the text input retains focus and you can tab through
                    the checkboxes and change them as you go.  If it is NOT applied, you can't do either of these things.</p>
            </blockquote>
        </div>;

    }
}

export default InputsAsReactComponent;
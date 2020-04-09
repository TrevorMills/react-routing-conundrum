import React from 'react';
import { Redirect } from 'react-router-dom';
import qs from 'qs';
import Menu from './Menu';

/**
 * The purpose of this sample app is to demonstrate an issue of inputs retaining focus when we update query string
 * parms by doing a router <Redirect>.  I got myself here because I started writing a functional component with hooks
 * thinking that was the way to do things now.  When we do the <Redirect> we get a new instance of the component, so
 * therefore all of the inputs therein have changed, so the focus is lost.  This makes typing in the input field rather
 * difficult and tabbing through the checkboxes impossible.
 *
 * @param props
 * @returns {*}
 * @constructor
 */
const InputsAsFunctionalComponent = props => {
    // Set state with initial values, allowing props.location.search to set those values
    const state = Object.assign(
        { checkboxes: [], text: '' },
        qs.parse( props.location.search, { ignoreQueryPrefix: true } )
    );
    const updateState = next => {
        const stringifiedState = '?' + qs.stringify({ ...state, ...next });
        props.history.replace( props.location.pathname + stringifiedState );
    };

    // Just to get some checkboxes
    const checkboxes = [ 'One', 'Two', 'Three', 'Four' ];

    // When text box is changed, update state.text
    const onChangeText = e => {
        const text = e.target.value;
        updateState({text});
    };

    // When any checkbox is toggled, update state.checkboxes
    const onChangeCheckbox = e => {
        const value = e.target.value;
        const pos = state.checkboxes.indexOf( value );
        let checkboxes = [ ...state.checkboxes ];
        if ( e.target.checked && pos === -1 ) {
            checkboxes.push( value );
        } else if ( ! e.target.checked && pos !== -1 ) {
            checkboxes.splice( pos, 1 );
        }
        updateState({checkboxes});
    };

    return <div>
        <Menu {...props}/>
        <h1>As Functional Component</h1>
        <label>Text: <input type="text" id="text" value={state.text} onChange={onChangeText}/></label>
        {checkboxes.map( value => {
            return <label key={value}>
                <input id={'checkbox-' + value}
                       type="checkbox"
                       value={value}
                       checked={state.checkboxes.indexOf(value) !== -1}
                       onChange={onChangeCheckbox}/>
                {value}
            </label>
        })}
    </div>;
};

export default InputsAsFunctionalComponent;

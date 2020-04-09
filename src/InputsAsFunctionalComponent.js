import React, { useState, useEffect } from 'react';
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
    const [ state, updateState ] = useState(
        Object.assign(
            { checkboxes: [], text: '' },
            qs.parse( props.location.search, { ignoreQueryPrefix: true } )
        )
    );

    // The activeElement state is my mechanism for remembering what element had focus, but this feels wrong
    const [ activeElement, updateActiveElement ] = useState( null );
    const [ applyMechanism, updateApplyMechanism ] = useState( false ); // false means inputs will lose focus, true means we use the mechanism in a useEffect hook

    /**
     * After the component finishes rendering, we check to see if we have an activeElement, and if we do,
     * we'll set focus on that element once everything is done.  We put the focus action within a setTimeout so
     * we only do that once the main thread is done executing.
     */
    useEffect( () => {
        if ( applyMechanism && activeElement ) {
            const el = document.getElementById( activeElement.id );
            if ( el ) {
                el.focus();
                // If it's a text input, we can put the cursor in the right position
                if ( typeof activeElement.cursor === 'number' ) {
                    el.selectionStart = el.selectionEnd = activeElement.cursor;
                }
            }
        }
    });

    // Just to get some checkboxes
    const checkboxes = [ 'One', 'Two', 'Three', 'Four' ];

    // When text box is changed, update state.text
    const onChangeText = e => {
        const text = e.target.value;
        updateActiveElement({
            id: e.target.id,
            cursor: e.target.selectionStart,
        });
        updateState( previous => ({
            ...previous,
            text,
        }));
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
        updateActiveElement({
            id: e.target.id,
            cursor: null
        });
        updateState( previous => ({
            ...previous,
            checkboxes
        }));
    };

    // Toggle our "applyMechanism" state
    const onChangeApplyMechanism = e => {
        updateActiveElement({
            id: e.target.id,
            cursor: null,
        });
        updateApplyMechanism( ! applyMechanism );
    };

    // Here's where the problem arises.  If the state has changed, we want to update the query string on the URL.
    // The way we're taught is to be declarative and return a <Redirect> component. However, doing that causes this
    // functional component to fully re-render, so the input that had focus is gone.
    const stringifiedState = '?' + qs.stringify( state );
    if ( props.location.search !== stringifiedState ) {
        return <Redirect push={false} to={props.location.pathname + stringifiedState} />
    }

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

        <blockquote>
            <label>Apply Mechanism: <input type="checkbox" value={1} checked={applyMechanism} onChange={onChangeApplyMechanism}/></label>
            <p>There's a mechanism in place to remember the id of the activeElement whenever the state changes. You can toggle
                whether or not this mechanism is applied.  If it is applied, then the text input retains focus and you can tab through
                the checkboxes and change them as you go.  If it is NOT applied, you can't do either of these things.</p>
        </blockquote>
    </div>;
};

export default InputsAsFunctionalComponent;

import React from 'react';
import { Switch, Route } from 'react-router-dom';
import InputsAsFunctionalComponent from './InputsAsFunctionalComponent';
import InputsAsReactComponent from './InputsAsReactComponent';
import Menu from './Menu';

const App = props => {
    return <div>
        <Switch>
            <Route exact path="/" component={Menu} />
            <Route exact path="/as-functional-component" component={InputsAsFunctionalComponent} />
            <Route exact path="/as-react-component" component={InputsAsReactComponent} />
        </Switch>
    </div>;
};

export default App;

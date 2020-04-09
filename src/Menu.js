import React from 'react';
import { Link } from 'react-router-dom';

const Menu = props => {
    const routes = [
        {
            path: '/as-functional-component',
            label: 'As Functional Component',
        },
        {
            path: '/as-react-component',
            label: 'As React Component',
        }
    ];
    return <div>
        { routes.map( route => {
            return <span key={route.path} style={{padding:'1em'}}>
                    {( window.location.pathname === route.path ) ? route.label : <Link to={route.path + props.location.search}>{route.label}</Link>}
                </span>;
        })}
        <span style={{padding:'1em'}}>
            <a href="https://github.com/TrevorMills/react-routing-conundrum" target="_blank" rel="noopener noreferrer">Source</a>
        </span>
    </div>

};

export default Menu;
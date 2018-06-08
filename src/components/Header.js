import React from 'react';
import { NavLink } from 'react-router-dom';

const Header = () =>
    (
        <header className="masthead">
            <h2 className="appname">
                <NavLink to="/">Taskkeeper</NavLink>
            </h2>
        </header>
    );

export default Header;

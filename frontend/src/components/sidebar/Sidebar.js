import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Nav } from 'grommet';
import PropTypes from 'prop-types';

class Sidebar extends Component {

    render() {
        return <Nav pad="medium">
            <Link to="/new">Nouveau</Link>
            <Link to="/vote">Voter</Link>
        </Nav>
    }
}

export default Sidebar;
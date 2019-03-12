import React from 'react';
import PropTypes from 'prop-types';
import { LinkContainer } from 'react-router-bootstrap';
import { Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';

const userName = () => {
  const user = Meteor.user();
  const name = user && user.profile ? user.profile.name : '';
  return user ? `${name.first} ${name.last}` : '';
};




const AuthenticatedNavigation = ({ userId , name , unReadCount, history }) => (
<div>



  <Nav>
    <LinkContainer to="/app/dashboard">
        <NavItem href="/app/dashboard">Dashboard</NavItem>
    </LinkContainer>

    <LinkContainer to="#" exact onClick={() => history.push('/logout')}>
        <NavItem eventKey={2.1} href="#">Logout</NavItem>
    </LinkContainer>
    
  </Nav>
  

</div>
);

AuthenticatedNavigation.propTypes = {
name: PropTypes.string.isRequired,
};

export default withRouter(AuthenticatedNavigation);

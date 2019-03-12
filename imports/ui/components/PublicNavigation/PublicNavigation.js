
import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Nav, NavItem } from 'react-bootstrap';

const PublicNavigation = ( ) => (
<div>

      <Nav>
          <LinkContainer exact to="/">
              <NavItem href="/">Home</NavItem>
          </LinkContainer>

          <LinkContainer to="/new_cyclist_profile">
              <NavItem href="/new_cyclist_profile">Create Profile</NavItem>
          </LinkContainer>

          <LinkContainer to="/create_event">
              <NavItem href="/create_event">Create Events</NavItem>
          </LinkContainer>

          <LinkContainer to="/add_competition">
              <NavItem href="/add_competition">Competition</NavItem>
          </LinkContainer>

          <LinkContainer to="/competition_results">
              <NavItem href="/competition_results">Results</NavItem>
          </LinkContainer>
        </Nav>
    
        <Nav pullRight>
          <LinkContainer to="/login">
              <NavItem eventKey={2} href="/login">Log In</NavItem>
          </LinkContainer>
        </Nav>
</div>
);

export default PublicNavigation;

import React from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Nav, NavItem } from "react-bootstrap";

const PublicNavigation = () => (
  <div>
    <Nav>
      <LinkContainer exact to="/">
        <NavItem href="/">Home</NavItem>
      </LinkContainer>
    </Nav>

    <Nav pullRight>
      <LinkContainer to="/login">
        <NavItem eventKey={2} href="/login">
          Log In
        </NavItem>
      </LinkContainer>
    </Nav>
  </div>
);

export default PublicNavigation;

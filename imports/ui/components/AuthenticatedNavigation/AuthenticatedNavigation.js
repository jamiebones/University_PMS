import React from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Nav, NavItem, NavDropdown, MenuItem } from "react-bootstrap";
import { withRouter } from "react-router-dom";

const AuthenticatedNavigation = ({ history }) => (
  <div>
    <Nav>
      <LinkContainer to="#" exact onClick={() => history.push("/logout")}>
        <NavItem eventKey={1} href="#">
          Logout
        </NavItem>
      </LinkContainer>
    </Nav>
  </div>
);

export default withRouter(AuthenticatedNavigation);

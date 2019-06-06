import React from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Nav, NavItem, NavDropdown, MenuItem } from "react-bootstrap";
import { withRouter } from "react-router-dom";

const DirectorNavigation = ({ history }) => (
  <div>
    <Nav>
      <LinkContainer
        to="/auth/records/search"
        exact
        onClick={() => history.push("/auth/records/search")}
      >
        <NavItem eventKey={2} href="#">
          Search Records
        </NavItem>
      </LinkContainer>
    </Nav>

    <Nav>
      <LinkContainer
        to="/auth/nominal_roll"
        exact
        onClick={() => history.push("/auth/nominal_roll")}
      >
        <NavItem eventKey={11} href="#">
          Nominal Roll
        </NavItem>
      </LinkContainer>
    </Nav>

    <Nav>
      <LinkContainer
        to="/auth/dashboard/pensions/home"
        exact
        onClick={() => history.push("/auth/dashboard/pensions/home")}
      >
        <NavItem eventKey={18} href="#">
          Pensions
        </NavItem>
      </LinkContainer>
    </Nav>

    <Nav>
      <LinkContainer
        to="/auth/add_staff_documents"
        exact
        onClick={() => history.push("/auth/add_staff_documents")}
      >
        <NavItem eventKey={18} href="#">
          Add Staff Documents
        </NavItem>
      </LinkContainer>
    </Nav>
  </div>
);

export default withRouter(DirectorNavigation);

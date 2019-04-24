import React from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Nav, NavItem, NavDropdown, MenuItem } from "react-bootstrap";
import { withRouter } from "react-router-dom";

const RegistrarNavigation = ({ history }) => (
  <div>
    <Nav>
      <LinkContainer
        to="#"
        exact
        onClick={() => history.push("/auth/dashboard/home")}
      >
        <NavItem eventKey={2} href="#">
          Dashboard
        </NavItem>
      </LinkContainer>
    </Nav>

    <Nav>
      <LinkContainer
        to="#"
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
        to="#"
        exact
        onClick={() => history.push("/auth/staff_posting")}
      >
        <NavItem eventKey={3} href="#">
          Staff Posting
        </NavItem>
      </LinkContainer>
    </Nav>

    <Nav>
      <LinkContainer
        to="#"
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
        to="#"
        exact
        onClick={() => history.push("/auth/posting_list")}
      >
        <NavItem eventKey={4} href="#">
          Posting List
        </NavItem>
      </LinkContainer>
    </Nav>

    <Nav>
      <LinkContainer
        to="#"
        exact
        onClick={() => history.push("/auth/posting_stats")}
      >
        <NavItem eventKey={8} href="#">
          Posting Stats
        </NavItem>
      </LinkContainer>
    </Nav>
  </div>
);

export default withRouter(RegistrarNavigation);

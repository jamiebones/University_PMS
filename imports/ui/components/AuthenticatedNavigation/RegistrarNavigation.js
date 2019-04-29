import React from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Nav, NavItem, NavDropdown, MenuItem } from "react-bootstrap";
import { withRouter } from "react-router-dom";

const RegistrarNavigation = ({ history }) => (
  <div>
    <Nav>
      <LinkContainer
        to="/auth/dashboard/home"
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
        to="/auth/staff_posting"
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
        to="/auth/posting_list"
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
        to="/auth/posting_stats"
        exact
        onClick={() => history.push("/auth/posting_stats")}
      >
        <NavItem eventKey={8} href="#">
          Posting Stats
        </NavItem>
      </LinkContainer>
    </Nav>

    <Nav>
      <LinkContainer
        to="/auth/due_for_promotion"
        exact
        onClick={() => history.push("/auth/due_for_promotion")}
      >
        <NavItem eventKey={18} href="#">
          Promotion
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
  </div>
);

export default withRouter(RegistrarNavigation);

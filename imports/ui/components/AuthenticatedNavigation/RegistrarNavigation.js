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
        to="/auth/search_documents"
        exact
        onClick={() => history.push("/auth/search_documents")}
      >
        <NavItem eventKey={2} href="#">
          Search Documents
        </NavItem>
      </LinkContainer>
    </Nav>

    <Nav>
      <NavDropdown eventKey="4" title="Postings" id="nav-regposting">
        <React.Fragment>
          <LinkContainer
            to="/auth/staff_posting"
            exact
            onClick={() => history.push("/auth/staff_posting")}
          >
            <MenuItem eventKey="4.1">Staff Posting</MenuItem>
          </LinkContainer>

          <LinkContainer
            to="/auth/registrar/staff_posting"
            exact
            onClick={() => history.push("/auth/registrar/staff_posting")}
          >
            <MenuItem eventKey="4.4">Approve Posting</MenuItem>
          </LinkContainer>

          <LinkContainer
            to="/auth/relief_posting"
            exact
            onClick={() => history.push("/auth/relief_posting")}
          >
            <MenuItem eventKey="4.2">Relief Posting</MenuItem>
          </LinkContainer>
          <LinkContainer
            to="/auth/posting_list"
            exact
            onClick={() => history.push("/auth/posting_list")}
          >
            <MenuItem eventKey="4.3">Posting List</MenuItem>
          </LinkContainer>

          <LinkContainer
            to="/auth/posting_stats"
            exact
            onClick={() => history.push("/auth/posting_stats")}
          >
            <MenuItem eventKey="4.4">Posting Stats</MenuItem>
          </LinkContainer>
        </React.Fragment>
      </NavDropdown>
    </Nav>

    <Nav>
      <NavDropdown eventKey="4" title="Staff Promotion" id="nav-regpromotion">
        <React.Fragment>
          <LinkContainer
            to="/auth/due_for_promotion"
            exact
            onClick={() => history.push("/auth/due_for_promotion")}
          >
            <MenuItem eventKey="4.2">Staff Promotion</MenuItem>
          </LinkContainer>

          <LinkContainer
            to="/auth/promotion_list"
            exact
            onClick={() => history.push("/auth/promotion_list")}
          >
            <MenuItem eventKey="4.1">Staff Promotion List</MenuItem>
          </LinkContainer>
          <LinkContainer
            to="/auth/promotion_request_approval"
            exact
            onClick={() => history.push("/auth/promotion_request_approval")}
          >
            <MenuItem eventKey="4.2"> Promotion Withdrawal Request</MenuItem>
          </LinkContainer>
        </React.Fragment>
      </NavDropdown>
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

    <Nav />

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

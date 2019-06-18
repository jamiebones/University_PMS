import React from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Nav, NavItem, NavDropdown, MenuItem } from "react-bootstrap";
import { withRouter } from "react-router-dom";

const ASENavigation = ({ history }) => (
  <div>
    <Nav>
      <NavDropdown eventKey="8" title="Search" id="nav-search">
        <React.Fragment>
          <LinkContainer
            to="/auth/records/search"
            exact
            onClick={() => history.push("/auth/records/search")}
          >
            <MenuItem eventKey="8.1">Search Records</MenuItem>
          </LinkContainer>

          <LinkContainer
            to="/auth/view_staff_by_salary_scale"
            exact
            onClick={() => history.push("/auth/view_staff_by_salary_scale")}
          >
            <MenuItem eventKey="8.3">Search By Salary Scale</MenuItem>
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

    <Nav>
      <NavDropdown eventKey="4" title="Promotion" id="nav-promotion">
        <React.Fragment>
          <LinkContainer
            to="/auth/due_for_promotion"
            exact
            onClick={() => history.push("/auth/due_for_promotion")}
          >
            <MenuItem eventKey="4.1">Staff Promotion</MenuItem>
          </LinkContainer>

          <LinkContainer
            to="/auth/promotion_list"
            exact
            onClick={() => history.push("/auth/promotion_list")}
          >
            <MenuItem eventKey="4.1">Staff Promotion List</MenuItem>
          </LinkContainer>

          <LinkContainer
            to="/auth/withdraw_promotion"
            exact
            onClick={() => history.push("/auth/withdraw_promotion")}
          >
            <MenuItem eventKey="4.2">Withdraw Promotion</MenuItem>
          </LinkContainer>
        </React.Fragment>
      </NavDropdown>
    </Nav>
  </div>
);

export default withRouter(ASENavigation);

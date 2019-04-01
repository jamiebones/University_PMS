import React from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Nav, NavItem, NavDropdown, MenuItem } from "react-bootstrap";
import { withRouter } from "react-router-dom";
import { GetDetailsBasedOnRole } from "../../../modules/utilities";

const AuthenticatedNavigation = ({ history }) => (
  <div>
    {GetDetailsBasedOnRole(["SATS", "JSE", "Records"], "Personnel") ? (
      <React.Fragment>
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
      </React.Fragment>
    ) : null}

    {GetDetailsBasedOnRole(["SATS", "JSE"], "Personnel") ? (
      <React.Fragment>
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
      </React.Fragment>
    ) : null}

    <Nav>
      <LinkContainer to="#" exact onClick={() => history.push("/logout")}>
        <NavItem eventKey={5} href="#">
          Logout
        </NavItem>
      </LinkContainer>
    </Nav>
  </div>
);

export default withRouter(AuthenticatedNavigation);

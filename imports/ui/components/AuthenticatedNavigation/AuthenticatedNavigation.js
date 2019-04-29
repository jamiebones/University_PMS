import React from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Nav, NavItem, NavDropdown, MenuItem } from "react-bootstrap";
import { withRouter } from "react-router-dom";
import { GetDetailsBasedOnRole } from "../../../modules/utilities";
import RegistrarNavigation from "./RegistrarNavigation";

const AuthenticatedNavigation = ({ history }) => (
  <div>
    {GetDetailsBasedOnRole(["SATS", "JSE", "Records"], "Personnel") ? (
      <React.Fragment>
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
            to="/auth/due_for_promotion"
            exact
            onClick={() => history.push("/auth/due_for_promotion")}
          >
            <NavItem eventKey={15} href="#">
              Promotion
            </NavItem>
          </LinkContainer>
        </Nav>
      </React.Fragment>
    ) : null}

    {GetDetailsBasedOnRole(["SATS", "JSE"], "Personnel") ? (
      <React.Fragment>
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
      </React.Fragment>
    ) : null}

    {GetDetailsBasedOnRole(["super-admin"], "Personnel") ? (
      <React.Fragment>
        <Nav>
          <LinkContainer
            to="/auth/upload_data"
            exact
            onClick={() => history.push("/auth/upload_data")}
          >
            <NavItem eventKey={8} href="#">
              Upload Data
            </NavItem>
          </LinkContainer>
        </Nav>

        <Nav>
          <LinkContainer
            to="/auth/account_creation"
            exact
            onClick={() => history.push("/auth/account_creation")}
          >
            <NavItem eventKey={4} href="#">
              Create User Account
            </NavItem>
          </LinkContainer>
        </Nav>

        <Nav>
          <LinkContainer
            to="/auth/account_status"
            exact
            onClick={() => history.push("/auth/account_status")}
          >
            <NavItem eventKey={8} href="#">
              View Accounts
            </NavItem>
          </LinkContainer>
        </Nav>

        <Nav>
          <LinkContainer
            to="/auth/step_increment"
            exact
            onClick={() => history.push("/auth/step_increment")}
          >
            <NavItem eventKey={8} href="#">
              Step Increment
            </NavItem>
          </LinkContainer>
        </Nav>
      </React.Fragment>
    ) : null}

    {GetDetailsBasedOnRole(["Registrar"], "Personnel") ? (
      <RegistrarNavigation />
    ) : null}

    <Nav>
      <LinkContainer
        to="/auth/profile"
        exact
        onClick={() => history.push("/auth/profile")}
      >
        <NavItem eventKey={5} href="#">
          Profile
        </NavItem>
      </LinkContainer>
    </Nav>

    <Nav className="pull-right">
      <LinkContainer to="/logout" exact onClick={() => history.push("/logout")}>
        <NavItem eventKey={5} href="#">
          Logout
        </NavItem>
      </LinkContainer>
    </Nav>
  </div>
);

export default withRouter(AuthenticatedNavigation);

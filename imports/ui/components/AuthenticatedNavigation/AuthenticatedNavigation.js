import React from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Nav, NavItem, NavDropdown, MenuItem } from "react-bootstrap";
import { withRouter } from "react-router-dom";
import { GetDetailsBasedOnRole } from "../../../modules/utilities";
import RegistrarNavigation from "./RegistrarNavigation";
import DirectorNavigation from "./DirectorNavigation";

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
          <NavDropdown eventKey="4" title="Postings" id="nav-posting">
            {GetDetailsBasedOnRole(["SATS", "JSE"], "Personnel") ? (
              <React.Fragment>
                <LinkContainer
                  to="/auth/staff_posting"
                  exact
                  onClick={() => history.push("/auth/staff_posting")}
                >
                  <MenuItem eventKey="4.1">Staff Posting</MenuItem>
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
            ) : null}
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
            {GetDetailsBasedOnRole(["SATS", "JSE", "ASE"], "Personnel") ? (
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
            ) : null}
          </NavDropdown>
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

    {GetDetailsBasedOnRole(["Director"], "Personnel") ? (
      <DirectorNavigation />
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

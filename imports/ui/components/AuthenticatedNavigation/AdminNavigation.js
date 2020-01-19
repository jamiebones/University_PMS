import React from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Nav, NavItem, NavDropdown, MenuItem } from "react-bootstrap";
import { withRouter } from "react-router-dom";

const AdminNavigation = ({ history }) => (
  <div>
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

      <Nav>
        <LinkContainer
          to="/auth/data_viz"
          exact
          onClick={() => history.push("/auth/data_viz")}
        >
          <MenuItem eventKey="6">Data Viz</MenuItem>
        </LinkContainer>
      </Nav>

      <Nav>
        <LinkContainer
          to="/auth/logs"
          exact
          onClick={() => history.push("/auth/logs")}
        >
          <NavItem eventKey={8} href="#">
            Logs
          </NavItem>
        </LinkContainer>
      </Nav>
    </React.Fragment>
  </div>
);

export default withRouter(AdminNavigation);

import React from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Nav, NavItem, NavDropdown, MenuItem } from "react-bootstrap";
import { withRouter } from "react-router-dom";
import { GetDetailsBasedOnRole } from "../../../modules/utilities";
import RegistrarNavigation from "./RegistrarNavigation";
import DirectorNavigation from "./DirectorNavigation";
import RecordsNavigation from "./RecordsNavigation";
import SatsNavigation from "./SatsNavigation";
import JSENavigation from "./JSENavigation";
import ASENavigation from "./ASENavigation";
import AdminNavigation from "./AdminNavigation";
import { FaBell } from "react-icons/fa";

const AuthenticatedNavigation = ({ history, unReadCount }) => (
  <div>
    {GetDetailsBasedOnRole(["super-admin"], "Personnel") ? (
      <AdminNavigation />
    ) : null}

    {GetDetailsBasedOnRole(["Registrar"], "Personnel") ? (
      <RegistrarNavigation />
    ) : null}

    {GetDetailsBasedOnRole(["Director"], "Personnel") ? (
      <DirectorNavigation />
    ) : null}

    {GetDetailsBasedOnRole(["Records"], "Personnel") ? (
      <RecordsNavigation />
    ) : null}

    {GetDetailsBasedOnRole(["SATS"], "Personnel") ? <SatsNavigation /> : null}

    {GetDetailsBasedOnRole(["ASE"], "Personnel") ? <ASENavigation /> : null}

    {GetDetailsBasedOnRole(["JSE"], "Personnel") ? <JSENavigation /> : null}

    <Nav>
      <LinkContainer
        to="/auth/notifications"
        exact
        onClick={() => history.push("/auth/notifications")}
      >
        <NavItem eventKey={5} href="#">
          <FaBell /> <span className="text-danger">{unReadCount}</span>
        </NavItem>
      </LinkContainer>
    </Nav>

    <Nav>
      <LinkContainer
        to="/auth/profile"
        exact
        onClick={() => history.push("/auth/profile")}
      >
        <NavItem eventKey={5} href="#"></NavItem>
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

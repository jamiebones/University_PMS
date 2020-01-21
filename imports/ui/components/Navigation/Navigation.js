import React from "react";
import PropTypes from "prop-types";
import { Navbar, Nav, NavItem } from "react-bootstrap";
import { Link } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import Icon from "../../components/Icon/Icon";
import PublicNavigation from "../PublicNavigation/PublicNavigation";
import AuthenticatedNavigation from "../AuthenticatedNavigation/AuthenticatedNavigation";
import styled from "styled-components";

//if ( Meteor.isClient) import './Navigation.scss';

const NavigationStyles = styled.div`
  .navbar {
    border-radius: 0;
    border-left: none;
    border-right: none;
    border-top: none;
  }

  .navbar-default .navbar-brand {
    color: rgba(0, 0, 0, 1);
  }
  .navbar-default {
    font-size: 13px;
    background-color: #e22525;
  }
  .navbar-default .navbar-nav > li > a {
    color: #f2f1f0;
    background-color: #e22525;
  }
  .navbar-default .navbar-nav > li > a:hover,
  .navbar-default .navbar-nav > li > a:focus {
    color: rgba(51, 51, 51, 1);
    background-color: rgba(149, 201, 166, 1);
  }
  .navbar-default .navbar-nav > .active > a,
  .navbar-default .navbar-nav > .active > a:hover,
  .navbar-default .navbar-nav > .active > a:focus {
    color: rgba(85, 85, 85, 1);
    background-color: #f2fbfb;
  }
  .navbar-default .navbar-toggle {
    border-color: #ecd7d7;
  }
  .navbar-default .navbar-toggle:hover,
  .navbar-default .navbar-toggle:focus {
    background-color: #050213;
  }
  .navbar-default .navbar-toggle .icon-bar {
    background-color: #000;
  }
  .navbar-default .navbar-toggle:hover .icon-bar,
  .navbar-default .navbar-toggle:focus .icon-bar {
    background-color: #ecd7d7;
  }

  .navbar-nav > li > .dropdown-menu {
    margin-top: 0;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    // width: 100%;
  }

  /*
a.navbar-brand.navbar-link { height: 100%; }
a.navbar-brand {
  padding:5px;
}
*/

  /* EXAMPLE 3

line height is 20px by default so add 30px top and bottom to equal the new .navbar-brand 80px height  */

  .navbar-brand > img {
    height: 100%;
    /*padding: 15px;*/
    padding: 7px 14px;
    width: auto;
  }

  /*


.appNav .nav >li >a {
  padding-top: 30px;
  padding-bottom: 30px;
}
.navbar-toggle {
  padding: 10px;
  margin: 25px 15px 25px 0;
}
*/

  /* CSS Transform Align Navbar Brand Text ... This could also be achieved with table / table-cells */
  .navbar-alignit .navbar-header {
    -webkit-transform-style: preserve-3d;
    -moz-transform-style: preserve-3d;
    transform-style: preserve-3d;
    height: 50px;
  }
  .navbar-alignit .navbar-brand {
    top: 50%;
    display: block;
    position: relative;
    height: auto;
    transform: translate(0, -50%);
    margin-right: 15px;
    margin-left: 15px;
  }

  .navbar-nav > li > .dropdown-menu {
    z-index: 9999;
  }

  @media (max-width: 767px) {
    .navbar-default .navbar-nav .open .dropdown-menu > li > a {
      color: #b3f0ff;
    }
  }
`;

const Navigation = props => (
  <NavigationStyles>
    <div className="appNav">
      <Navbar fluid>
        <Navbar.Header>
          <Navbar.Brand>
            <Link to="/auth/dashboard" className="navbar-brand">
              Personnel Management System
            </Link>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>

        <Navbar.Collapse>
          {!props.authenticated ? (
            <PublicNavigation {...props} />
          ) : (
            <AuthenticatedNavigation {...props} />
          )}
        </Navbar.Collapse>
      </Navbar>
    </div>
  </NavigationStyles>
);

Navigation.defaultProps = {
  name: ""
};

Navigation.propTypes = {
  authenticated: PropTypes.bool.isRequired
};

export default Navigation;

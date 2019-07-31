/*eslint-disable */

import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Meteor } from "meteor/meteor";
import { Row, Col } from "react-bootstrap";

const StyledLogout = styled.div`
  padding: 20px;
  text-align: center;
  border-radius: 3px;
  color: #10909e;

  img {
    width: 100px;
    height: auto;
  }

  h1 {
    font-size: 24px;
  }

  ul {
    list-style: none;
    display: inline-block;
    padding: 0;
    margin: 10px 0 0;
  }

  ul li {
    float: left;
    font-size: 28px;
    line-height: 28px;

    a {
      color: #fff;
    }

    &:not(:last-child) {
      margin-right: 15px;
    }
  }

  @media screen and (min-width: 768px) {
    padding: 30px;

    h1 {
      font-size: 26px;
    }
  }

  @media screen and (min-width: 992px) {
    padding: 40px;

    h1 {
      font-size: 28px;
    }

    p {
      font-size: 18px;
      line-height: 24px;
    }
  }
`;

class Logout extends React.Component {
  componentDidMount() {
    Meteor.logout(() => this.props.setAfterLoginPath(null));
  }

  render() {
    return (
      <StyledLogout>
        <Row className="logoutDiv">
          <Col md={6} mdOffset={3}>
            <img src="/image/logo.png" className="img img-responsive" />
            <h1>You have been logged out.</h1>
            <p>
              Thanks for using this software. Please send software bugs report
              to the developer @<b>jamiebones2000@yahoo.co.uk</b>!
            </p>
          </Col>
        </Row>
      </StyledLogout>
    );
  }
}

Logout.propTypes = {
  setAfterLoginPath: PropTypes.func.isRequired
};

export default Logout;

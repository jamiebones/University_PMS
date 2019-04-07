import React from "react";
import styled from "styled-components";
import { Button, Col, Row, Table, Label, Alert } from "react-bootstrap";
import autoBind from "react-autobind";
import { Link } from "react-router-dom";
import { GetDetailsBasedOnRole } from "../../../modules/utilities";
import Sats from "../../components/Links/Sats";
import { _ } from "meteor/underscore";
import { Meteor } from "meteor/meteor";

const RenderDashboard = props => {
  if (GetDetailsBasedOnRole("SATS", "Personnel")) {
    return (
      <Col md={6}>
        <Sats />
      </Col>
    );
  }

  if (GetDetailsBasedOnRole("JSE", "Personnel")) {
    return <p>hello jses</p>;
  }

  if (GetDetailsBasedOnRole("Records", "Personnel")) {
    return <p>hello records</p>;
  }

  if (GetDetailsBasedOnRole("ASE", "Personnel")) {
    return <p>hello ase</p>;
  }

  if (GetDetailsBasedOnRole("Director", "Personnel")) {
    return <p>director</p>;
  }
  if (GetDetailsBasedOnRole("super-admin", "Personnel")) {
    return <p>super admin</p>;
  }
};

const HomePageDashboardStyles = styled.div`
  border: 5px solid #c7c2d0;
  padding: 10px;
  background-color: red;
  background-color: #0a7773;
  color: #fff;
  p {
    font-size: 18px;
    font-weight: bold;
    font-style: oblique;
  }
`;

class HomePageDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    autoBind(this);
  }

  render() {
    const { name, group } = this.props;
    return (
      <HomePageDashboardStyles>
        <Row>
          <Col md={12}>
            <Col md={6}>
              <p>
                <span>Welcome, {name}</span>
              </p>

              <p>
                <span>Login Type: {group}</span>
              </p>
            </Col>

            <Col md={6}>
              <p>University Logo</p>
            </Col>
          </Col>
        </Row>

        <Row>
          <Col md={6}>{RenderDashboard()}</Col>
        </Row>
      </HomePageDashboardStyles>
    );
  }
}

export default HomePageDashboard;

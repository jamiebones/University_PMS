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
    return <Sats />;
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
  background-color: #0a7773;

  .welcome p {
    font-size: 18px;
    font-weight: bold;
    font-style: oblique;
    color: #fff;
    margin-bottom: 20px;
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
      <Row>
        <Col md={6} mdOffset={3}>
          <HomePageDashboardStyles>
            <div className="welcome">
              <p>
                <span>Welcome, {name}</span>
              </p>

              <p>
                Login Type: <span>{group}</span>
              </p>
            </div>

            {RenderDashboard()}
          </HomePageDashboardStyles>
        </Col>
      </Row>
    );
  }
}

export default HomePageDashboard;

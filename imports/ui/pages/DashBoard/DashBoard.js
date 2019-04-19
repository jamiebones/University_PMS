import React from "react";
import styled from "styled-components";
import { Col, Row, Table, Label, Alert } from "react-bootstrap";
import autoBind from "react-autobind";
import OverStayedStaff from "../../components/OverStayedStaff/OverStayedStaff";

const DashBoardStyles = styled.div``;

class DashBoard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      staff: [],
      staffData: []
    };
    autoBind(this);
  }

  render() {
    return (
      <DashBoardStyles>
        <Row>
          <Col md={12}>
            <Col md={6}>
              <p>Put something here</p>
            </Col>

            <Col md={6}>
              <OverStayedStaff />
            </Col>
          </Col>
        </Row>
      </DashBoardStyles>
    );
  }
}

export default DashBoard;

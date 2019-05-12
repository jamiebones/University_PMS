import React from "react";
import styled from "styled-components";
import { Col, Row, Table, Label, Alert } from "react-bootstrap";
import autoBind from "react-autobind";
import OverStayedStaff from "../../components/OverStayedStaff/OverStayedStaff";
import ApprovedReliefPosting from "../../components/ApprovedReliefPosting/ApprovedReliefPosting";

const DashBoardStyles = styled.div``;

class DashBoard extends React.Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  render() {
    return (
      <DashBoardStyles>
        <Row>
          <Col md={6}>
            <OverStayedStaff />
          </Col>

          <Col md={6}>
            <ApprovedReliefPosting />
          </Col>
        </Row>
      </DashBoardStyles>
    );
  }
}

export default DashBoard;

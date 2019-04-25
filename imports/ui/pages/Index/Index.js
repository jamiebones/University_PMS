/* eslint-disable */
import React from "react";
import { Row, Col, Alert } from "react-bootstrap";
import styled from "styled-components";

const IndexStyles = styled.div`
  .divHome {
    margin-top: 80px;
    height: 200px;
    border: 2px solid #8c7373;
    padding: 80px;
    padding-left: 25%;
    p {
      font-size: 25px;
    }
  }
`;

export default (Index = () => (
  <IndexStyles>
    <Row>
      <Col md={8} mdOffset={2}>
        <div className="divHome">
          <p>Please Login into the software</p>
        </div>
      </Col>
    </Row>
  </IndexStyles>
));

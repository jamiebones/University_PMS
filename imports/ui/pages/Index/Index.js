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

    p {
      font-size: 25px;
    }
  }
`;

export default (Index = props => (
  <IndexStyles>
    <Row>
      <Col md={8} mdOffset={2}>
        <div className="divHome">
          {!props.authenticated ? (
            <p>Please Login into the software</p>
          ) : (
            <p className="lead text-center">Welcome, {props.name}</p>
          )}
        </div>
      </Col>
    </Row>
  </IndexStyles>
));

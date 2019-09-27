/*eslint-disable*/
import React from "react";
import { Meteor } from "meteor/meteor";
import { Alert, Button, Col, Row } from "react-bootstrap";
import AddDocument from "../../components/AddDocument/AddDocument";
import styled from "styled-components";
import { GetDetailsBasedOnRole } from "../../../modules/utilities";

const DocumentStyle = styled.div``;

const AddDocuments = () => {
  let meta = {
    type: "2",
    userId: Meteor.userId()
  };
  if (GetDetailsBasedOnRole("SATS", "Personnel")) {
    meta.reference = `UU/DHR/SATS`;
    meta.unit = `SATS`;
  }

  if (GetDetailsBasedOnRole("JSE", "Personnel")) {
    meta.reference = `UU/DHR/JSE`;
    meta.unit = `JSE`;
  }

  if (GetDetailsBasedOnRole("ASE", "Personnel")) {
    meta.reference = `UU/DHR/ASE`;
    meta.unit = `ASE`;
  }
  return (
    <DocumentStyle>
      <Row>
        <Col md={6} mdOffset={3}>
          <p className="lead">Upload documents in pdf format</p>
          <AddDocument meta={meta} userId={Meteor.userId()} />
        </Col>
      </Row>
    </DocumentStyle>
  );
};

export default AddDocuments;

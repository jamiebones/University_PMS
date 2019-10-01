/*eslint-disable*/
import React, { useState } from "react";
import { Meteor } from "meteor/meteor";
import { Alert, Button, Col, Row } from "react-bootstrap";
import AddDocument from "../../components/AddDocument/AddDocument";
import styled from "styled-components";
import {
  GetDetailsBasedOnRole,
  DocumentTypes
} from "../../../modules/utilities";

const DocumentStyle = styled.div`
  margin-top: 80px;
  span {
    font-size: 17px;
    color: green;
  }
`;

const AddDocuments = () => {
  let meta = {
    type: "2",
    userId: Meteor.userId(),
    documentType: ""
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
  const [documentMeta, setDocumentMeta] = useState(meta);
  const [selectedDocument, setSelectedDocument] = useState("");
  const SelectDocumentType = e => {
    if (e.target.value === "0") {
      return;
    }
    setDocumentMeta({ ...documentMeta, documentType: e.target.value });
    setSelectedDocument(e.target.options[e.target.selectedIndex].text);
  };
  return (
    <DocumentStyle>
      <Row>
        <Col md={6} mdOffset={3}>
          <p>
            <select className="form-control" onChange={SelectDocumentType}>
              <option value="0">select document type</option>
              {DocumentTypes().map(({ value, data }) => {
                return value !== "all" ? (
                  <option value={value} key={value}>
                    {data}
                  </option>
                ) : null;
              })}
            </select>
          </p>
          <p className="lead">Upload documents in pdf format</p>
          {documentMeta.documentType !== "" ? (
            <>
              <p>
                Selected Document Type : <span>{selectedDocument}</span>
              </p>
              <AddDocument meta={documentMeta} userId={Meteor.userId()} />
            </>
          ) : null}
        </Col>
      </Row>
    </DocumentStyle>
  );
};

export default AddDocuments;

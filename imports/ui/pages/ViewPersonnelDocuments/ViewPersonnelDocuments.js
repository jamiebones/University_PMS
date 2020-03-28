import Documents from "../../../api/Documents/Documents";
import React from "react";
import { Col, Row } from "react-bootstrap";
import Loading from "../../components/Loading/Loading";
import autoBind from "react-autobind";
import { pdfjs } from "react-pdf";
import { Meteor } from "meteor/meteor";
import styled from "styled-components";
import PdfViewerComponent from "../../components/PdfViewerComponent/PdfViewerComponent";
if (Meteor.isClient) {
  pdfjs.GlobalWorkerOptions.workerSrc =
    "/packages/geekho_pdfjs/build/pdf.worker.js";
  import "react-pdf/dist/Page/AnnotationLayer.css";
}
import {
  GetDetailsBasedOnRole,
  DocumentTypes
} from "../../../modules/utilities";

const MyPdfViewerStyles = styled.div`
  .noDoc {
    background: #c0c0c0;
    color: #fff;
    font-size: 18px;
    padding: 20px;
  }
  .selDoc {
    font-size: 18px;
    margin: 10px;
  }
`;

class MyPdfViewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      documents: [],
      documentNum: 0,
      numPages: null,
      pageNumber: 1,
      loading: false,
      selectedDocument: ""
    };
    autoBind(this);
  }

  SelectDocumentType(e) {
    let meta = {
      documentType: e.target.value
    };

    if (GetDetailsBasedOnRole("SATS", "Personnel")) {
      meta.unit = `SATS`;
    }

    if (GetDetailsBasedOnRole("JSE", "Personnel")) {
      meta.unit = `JSE`;
    }

    if (GetDetailsBasedOnRole("ASE", "Personnel")) {
      meta.unit = `ASE`;
    }
    this.setState({
      loading: true,
      selectedDocument: e.target.options[e.target.selectedIndex].text
    });
    Meteor.call("documents.getDocByUnitAndDocumentType", meta, (err, res) => {
      if (!err) {
        this.setState({ documents: res, loading: false });
      } else {
        this.setState({ loading: false });
      }
    });
  }

  render() {
    const { documents, loading } = this.state;
    return (
      <div>
        {!loading ? (
          <MyPdfViewerStyles>
            <Row>
              <Col md={6} mdOffset={3}>
                <p>
                  <select
                    className="form-control"
                    onChange={this.SelectDocumentType}
                  >
                    <option value="0">select document type</option>
                    {DocumentTypes().map(({ value, data }) => {
                      return (
                        <option value={value} key={value}>
                          {data}
                        </option>
                      );
                    })}
                  </select>
                </p>
              </Col>
            </Row>
            <Row className="divViewer">
              <Col md={12}>
                {documents.length > 0 ? (
                  <div>
                    <p className="selDoc text-center">
                      Viewing {this.state.selectedDocument} documents
                    </p>
                    <PdfViewerComponent documents={documents} />
                  </div>
                ) : (
                  this.state.selectedDocument && (
                    <Row>
                      <Col md={6} mdOffset={3}>
                        <div className="noDoc">
                          <p>
                            No documents saved for selected documents category:{" "}
                            {this.state.selectedDocument}
                          </p>
                        </div>
                      </Col>
                    </Row>
                  )
                )}
              </Col>
            </Row>
          </MyPdfViewerStyles>
        ) : (
          <Loading />
        )}
      </div>
    );
  }
}

export default MyPdfViewer;

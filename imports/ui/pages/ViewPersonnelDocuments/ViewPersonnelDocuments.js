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
import { GetDetailsBasedOnRole } from "../../../modules/utilities";

const MyPdfViewerStyles = styled.div``;

class MyPdfViewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      documents: [],
      documentNum: 0,
      numPages: null,
      pageNumber: 1,
      loading: false
    };
    autoBind(this);
  }

  componentDidMount() {
    "";
    let unit = "";
    if (GetDetailsBasedOnRole("SATS", "Personnel")) {
      unit = `SATS`;
    }

    if (GetDetailsBasedOnRole("JSE", "Personnel")) {
      unit = `JSE`;
    }

    if (GetDetailsBasedOnRole("ASE", "Personnel")) {
      unit = `ASE`;
    }
    this.setState({ loading: true });
    Meteor.call("documents.getDocByUnit", unit, (err, res) => {
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
            <Row className="divViewer">
              <Col md={12}>
                {documents.length > 0 ? (
                  <div>
                    <PdfViewerComponent documents={documents} />
                  </div>
                ) : null}
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

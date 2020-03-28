import React from "react";
import { Col, Row, Button, ButtonToolbar, Alert } from "react-bootstrap";
import { Document, Page } from "react-pdf";
import autoBind from "react-autobind";
import { pdfjs } from "react-pdf";
import styled from "styled-components";
import { _ } from "meteor/underscore";
if (Meteor.isClient) {
  console.log(pdfjs);
  pdfjs.GlobalWorkerOptions.workerSrc =
    "/packages/geekho_pdfjs/build/pdf.worker.js";
  import "react-pdf/dist/Page/AnnotationLayer.css";
}

const PdfViewerComponentStyles = styled.div`
  .react-pdf__Document {
    margin-bottom: 0px;
  }
  .prev {
    display: inline;
    position: absolute;
    top: 0px;
    left: 150px;
  }

  .scroll {
    display: inline;
    position: absolute;
    top: 0px;
    left: 0px;
  }

  .next {
    display: inline;
    position: absolute;
    top: 0px;
    left: 900px;
  }
  .divButton {
    position: relative;
    margin-top: 30px;
  }

  .divButton2 {
    position: relative;
    margin-top: 0px;
  }
  .prev2 {
    display: inline;
    position: absolute;
    top: 0px;
    left: 0px;
  }
  .next2 {
    display: inline;
    position: absolute;
    top: 0px;
    left: 928px;
  }
`;

class PdfViewerComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      documentNum: 0,
      numPages: null,
      pageNumber: 1,
      scale: 1,
      documents: this.props.documents,
      missingDocuments: []
    };
    autoBind(this);
  }

  ScrollToBottom() {
    if (Meteor.isClient) {
      window.scrollTo(0, document.querySelector(".divViewer").scrollHeight);
    }
  }

  onDocumentLoadSuccess = ({ numPages }) => {
    this.setState({ numPages });
  };

  increment() {
    const { documents } = this.props;
    const { documentNum } = this.state;
    if (documentNum == documents.length - 1) {
      this.setState({ documentNum: 0 });
      return;
    }
    this.setState({ documentNum: this.state.documentNum + 1 });
  }

  decrement() {
    const { documents } = this.props;
    const { documentNum } = this.state;
    if (documentNum == 0) {
      this.setState({ documentNum: documents.length - 1 });
      return;
    }
    this.setState({ documentNum: this.state.documentNum - 1 });
  }

  handlePrevious() {
    const { pageNumber, numPages } = this.state;
    if (pageNumber == 1) {
      this.setState({ pageNumber: numPages });
      return;
    }
    this.setState({ pageNumber: this.state.pageNumber - 1 });
  }

  handleNext() {
    const { pageNumber, numPages } = this.state;
    if (pageNumber === numPages) {
      this.setState({ pageNumber: 1 });
      return;
    }
    this.setState({ pageNumber: this.state.pageNumber + 1 });
  }

  handlePdfLoadError(e) {
    //we try and handle the error here
    //if the pdf error is of the type of not found.
    //we remove it from the array and load the ones that are available
    if (e.name === "MissingPDFException") {
      //we have a pdf that shows 404
      //lets remove it from the pdf documents and reload
      const { documentNum } = this.state;
      const { documents } = this.props;
      const missingDoc = documents[documentNum];
      const filterDocuments = documents.filter(document => {
        return document !== documents[documentNum];
      });
      //lets reset the state of documents
      //lets show the document is missing
      //set the missing documents state and make sure its unique
      this.setState({
        documents: filterDocuments,
        missingDocuments: _.uniq([...this.state.missingDocuments, missingDoc])
      });
    }
  }

  render() {
    //const { documents } = this.props;
    const {
      documents,
      documentNum,
      pageNumber,
      numPages,
      scale,
      missingDocuments
    } = this.state;
    return (
      <div>
        {missingDocuments.length > 0 && (
          <div>
            <p>Deleted Files:</p>
            {missingDocuments.map((doc, index) => {
              return (
                <p className="text-danger text-lead" key={index}>
                  {doc}
                </p>
              );
            })}
          </div>
        )}
        <PdfViewerComponentStyles>
          <Row className="divViewer">
            <Col md={10} mdOffset={1}>
              {documents.length > 0 ? (
                <div>
                  {numPages && (
                    <div className="divButton">
                      <Button
                        bsStyle="info"
                        className="scroll"
                        onClick={() => this.ScrollToBottom()}
                      >
                        Scroll down
                      </Button>

                      <Button
                        bsSize="small"
                        className="prev"
                        onClick={() => this.decrement()}
                        disabled={documents.length === 1}
                      >
                        prev document
                      </Button>
                      <p className="text-center">
                        Viewing document {documentNum + 1} of {documents.length}
                      </p>
                      <Button
                        bsSize="small"
                        className="next"
                        onClick={() => this.increment()}
                        disabled={documents.length === 1}
                      >
                        next document
                      </Button>
                    </div>
                  )}

                  <Document
                    file={documents[documentNum]}
                    onLoadSuccess={this.onDocumentLoadSuccess}
                    onLoadError={this.handlePdfLoadError}
                  >
                    <Page pageNumber={pageNumber} width={1000} scale={scale} />
                  </Document>

                  {numPages && (
                    <div className="divButton2">
                      <Button
                        bsSize="small"
                        className="prev2"
                        onClick={() => this.handlePrevious()}
                      >
                        prev page
                      </Button>
                      <p className="text-center">
                        Page {pageNumber} of {numPages}
                      </p>

                      <Button
                        bsSize="small"
                        className="next2"
                        onClick={() => this.handleNext()}
                      >
                        next page
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <Alert bsStyle="info">
                  <p className="lead">No files found</p>
                </Alert>
              )}
            </Col>
          </Row>
        </PdfViewerComponentStyles>
      </div>
    );
  }
}

export default PdfViewerComponent;

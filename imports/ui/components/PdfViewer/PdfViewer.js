import Documents from "../../../api/Documents/Documents";
import React from "react";
import { Col, Row, Button, ButtonToolbar, Alert } from "react-bootstrap";
import { StaffMembers } from "../../../api/StaffMember/StaffMemberClass";
//import PDF from "react-pdf-js";
import { withTracker } from "meteor/react-meteor-data";
import { ReplaceSlash } from "../../../modules/utilities";
import Loading from "../../components/Loading/Loading";
import { Document, Page } from "react-pdf";
import autoBind from "react-autobind";
import { pdfjs } from "react-pdf";
import styled from "styled-components";
if (Meteor.isClient) {
  pdfjs.GlobalWorkerOptions.workerSrc =
    "/packages/geekho_pdfjs/build/pdf.worker.js";
  import "react-pdf/dist/Page/AnnotationLayer.css";
}

const MyPdfViewerStyles = styled.div`
  .react-pdf__Document {
    margin-bottom: 10px;
  }
  .pager {
    width: 50%;
  }
  .pager li {
    display: inline-block;
  }
`;

class MyPdfViewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      documents: [],
      loaded: false,
      documentNum: 0,
      numPages: null,
      pageNumber: 1
    };
    autoBind(this);
  }

  static getDerivedStateFromProps(props, state) {
    if (state.loaded == false) {
      const staffDocuments = props.documents;
      let documentArray = [];
      staffDocuments.map(aFile => {
        let link = Documents.findOne({ _id: aFile._id }).link();
        documentArray.push(link);
      });
      return { documents: documentArray };
    }
    return { ...state };
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
    const { documentNum, documents } = this.state;
    if (documentNum == documents.length - 1) {
      this.setState({ documentNum: 0 });
      return;
    }
    this.setState({ documentNum: this.state.documentNum + 1 });
  }

  decrement() {
    const { documentNum, documents } = this.state;
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

  renderPagination = (page, pages) => {
    let previousButton = (
      <li className="previous" onClick={() => this.handlePrevious()}>
        <a href="#">
          <i className="fa fa-arrow-left" /> Previous
        </a>
      </li>
    );

    let nextButton = (
      <li className="next" onClick={() => this.handleNext()}>
        <a href="#">
          Next <i className="fa fa-arrow-right" />
        </a>
      </li>
    );

    return (
      <nav>
        <ul className="pager">
          {previousButton}
          {nextButton}
        </ul>
      </nav>
    );
  };

  render() {
    let pagination = null;
    const { loading, staff } = this.props;
    const { documents, documentNum, pageNumber, numPages } = this.state;
    if (numPages) {
      pagination = this.renderPagination(pageNumber, numPages);
    }
    return (
      <div>
        {!loading ? (
          <MyPdfViewerStyles>
            <Row className="divViewer">
              <Col md={10} mdOffset={1}>
                {documents.length > 0 ? (
                  <div>
                    <p className="lead">
                      {staff && staff.biodata.firstName}{" "}
                      {staff && staff.biodata.middleName}{" "}
                      {staff && staff.biodata.surname}
                    </p>

                    <div>{pagination}</div>

                    <p>
                      Page {pageNumber} of {numPages}
                    </p>

                    <Button
                      bsSize="xsmall"
                      bsStyle="info"
                      onClick={() => this.ScrollToBottom()}
                    >
                      Scroll down
                    </Button>

                    <Document
                      file={documents[documentNum]}
                      onLoadSuccess={this.onDocumentLoadSuccess}
                    >
                      <Page pageNumber={pageNumber} />
                    </Document>

                    <div>
                      <p>
                        Viewing document {documentNum + 1} of {documents.length}
                      </p>
                      <ButtonToolbar>
                        <Button
                          bsStyle="info"
                          bsSize="small"
                          onClick={this.decrement}
                          disabled={documents.length === 1}
                        >
                          prev document
                        </Button>
                        <Button
                          bsStyle="success"
                          bsSize="small"
                          onClick={this.increment}
                          disabled={documents.length === 1}
                        >
                          next document
                        </Button>
                      </ButtonToolbar>
                    </div>
                  </div>
                ) : (
                  <Alert bsStyle="info">
                    <p className="lead">No files found</p>
                  </Alert>
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

export default (MyPdfViewerContainer = withTracker(({ match }) => {
  let subscription;
  const { staffId } = match.params;
  const staffIdQuery = staffId && ReplaceSlash(staffId);
  if (Meteor.isClient) {
    subscription = Meteor.subscribe(
      "staffmembers.getStaffDocuments",
      staffIdQuery
    );
  }

  return {
    loading: subscription && !subscription.ready(),
    staff: StaffMembers.findOne({ staffId: staffIdQuery }),
    documents: Documents.find({ "meta.staffId": staffIdQuery }).fetch()
  };
})(MyPdfViewer));

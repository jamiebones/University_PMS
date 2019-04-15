import Documents from "../../../api/Documents/Documents";
import React from "react";
import { Col, Row, Button, ButtonToolbar } from "react-bootstrap";
import { StaffMembers } from "../../../api/StaffMember/StaffMemberClass";
import PDF from "react-pdf-js";
import { withTracker } from "meteor/react-meteor-data";
import { ReplaceSlash } from "../../../modules/utilities";
import Loading from "../../components/Loading/Loading";
import autoBind from "react-autobind";
import { Document, Page } from "react-pdf";
import "regenerator-runtime/runtime";
import { pdfjs } from "react-pdf";
//pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${
//  pdfjs.version
//}/pdf.worker.js`;


class MyPdfViewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      documents: [],
      loaded: false,
      documentNum: 4,
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

  increment() {
    this.setState({ documentNum: this.state.documentNum + 1 });
  }

  decrement() {
    this.setState({ documentNum: this.state.documentNum - 1 });
  }

  onDocumentLoadSuccess = ({ numPages }) => {
    this.setState({ numPages });
  };

  handlePrevious() {
    this.setState({ page: this.state.page - 1 });
  }

  handleNext() {
    this.setState({ page: this.state.page + 1 });
  }

  renderPagination = (page, pages) => {
    let previousButton = (
      <li className="previous" onClick={this.handlePrevious}>
        <a href="#">
          <i className="fa fa-arrow-left" /> Previous
        </a>
      </li>
    );
    if (page === 1) {
      previousButton = (
        <li className="previous disabled">
          <a href="#">
            <i className="fa fa-arrow-left" /> Previous
          </a>
        </li>
      );
    }
    let nextButton = (
      <li className="next" onClick={this.handleNext}>
        <a href="#">
          Next <i className="fa fa-arrow-right" />
        </a>
      </li>
    );
    if (page === pages) {
      nextButton = (
        <li className="next disabled">
          <a href="#">
            Next <i className="fa fa-arrow-right" />
          </a>
        </li>
      );
    }
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
    const { loading } = this.props;
    const { documents, documentNum } = this.state;
    const { pageNumber, numPages } = this.state;
    console.log(documents[documentNum]);
    console.log("i was rendered");
    if (this.state.pages) {
      pagination = this.renderPagination(this.state.page, this.state.pages);
    }
    return (
      <div>
        {!loading ? (
          <Row>
            <Col md={6} mdOffset={3}>
              {documents.length > 0 ? (
                <div>
                  {/*
                <p className="text-center">
                  {biodata.firstName} {biodata.middleName} {biodata.surname}
                </p>
               */}
                  <Document
                    file={documents[documentNum]}
                    onLoadSuccess={this.onDocumentLoadSuccess}
                  >
                    <Page pageNumber={pageNumber} />
                  </Document>
                  <p>
                    Page {pageNumber} of {numPages}
                  </p>
                  <div>
                    <ButtonToolbar>
                      <Button
                        bsStyle="info"
                        bsSize="small"
                        onClick={this.decrement}
                        disabled={documentNum == 0}
                      >
                        prev document
                      </Button>
                      <Button
                        bsStyle="success"
                        bsSize="small"
                        onClick={this.increment}
                        disabled={documentNum == documents.length - 1}
                      >
                        next document
                      </Button>
                    </ButtonToolbar>
                  </div>
                </div>
              ) : (
                <p>No files found</p>
              )}
            </Col>
          </Row>
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
    documents: Documents.find({ "meta.staffId": staffIdQuery }).fetch(),
    m: console.dir(Documents.find({ "meta.staffId": staffIdQuery }).fetch())
  };
})(MyPdfViewer));

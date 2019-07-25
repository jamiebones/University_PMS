import Documents from "../../../api/Documents/Documents";
import React from "react";
import { Col, Row, Button, ButtonToolbar, Alert } from "react-bootstrap";
import { StaffMembers } from "../../../api/StaffMember/StaffMemberClass";
//import PDF from "react-pdf-js";
import { withTracker } from "meteor/react-meteor-data";
import { ReplaceSlash } from "../../../modules/utilities";
import Loading from "../Loading/Loading";
import autoBind from "react-autobind";
import { pdfjs } from "react-pdf";
import styled from "styled-components";
import PdfViewerComponent from "../PdfViewerComponent/PdfViewerComponent";
if (Meteor.isClient) {
  pdfjs.GlobalWorkerOptions.workerSrc =
    "/packages/geekho_pdfjs/build/pdf.worker.js";
  import "react-pdf/dist/Page/AnnotationLayer.css";
}

const MyPdfViewerStyles = styled.div``;

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

  render() {
    const { loading, staff } = this.props;
    const { documents } = this.state;

    return (
      <div>
        {!loading ? (
          <MyPdfViewerStyles>
            <Row className="divViewer">
              <Col md={12}>
                {documents.length > 0 ? (
                  <div>
                    <p className="lead col-md-offset-2">
                      Documents for {staff && staff.biodata.firstName}{" "}
                      {staff && staff.biodata.middleName}{" "}
                      {staff && staff.biodata.surname}
                    </p>

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

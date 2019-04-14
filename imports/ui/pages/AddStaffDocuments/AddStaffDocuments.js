import React from "react";
import { Meteor } from "meteor/meteor";
import Loading from "../../components/Loading/Loading";
import { Alert, Button, Col, Row } from "react-bootstrap";
import { ReactiveVar } from "meteor/reactive-var";
import { withTracker } from "meteor/react-meteor-data";
import { StaffMembers } from "../../../api/StaffMember/StaffMemberClass";
import Documents from "../../../api/Documents/Documents";
import TextField from "../../components/Common/TextFieldGroup";
import { Bert } from "meteor/themeteorchef:bert";
import styled from "styled-components";
import { _ } from "meteor/underscore";
import { StaffType } from "../../../modules/utilities";
import autoBind from "react-autobind";

const StyledAddDocuments = styled.div`
  .alertDiv {
    margin-top: 20px;
    p {
      font-style: italic;
      color: #000;
    }
  }
`;

class AddStaffDocuments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      staffId: "",
      staff: {},
      documents: [],
      uploading: [],
      progress: 0,
      fileStatus: "",
      inProgress: false
    };
    autoBind(this);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  search(e) {
    const staffId = this.state.staffId;
    if (staffId !== "" && e.keyCode == 13) {
      this.props.staffIdReactive.set(staffId);
    }
  }

  getStaffDetails(e) {
    if (this.state.staffId === "") {
      return;
    }
    const staffId = this.state.staffId;
    this.props.staffIdReactive.set(staffId);
  }

  uploadIt(e) {
    e.preventDefault();
    if (e.target.files) {
      let files = e.target.files;
      let filesArr = Array.from(files);
      let count = null;
      for (let i = 0; i < filesArr.length; i++) {
        const file = filesArr[i];

        let self = this;

        if (file) {
          let uploadInstance = Documents.insert(
            {
              file: file,
              meta: {
                staffId: this.state.staffId.toUpperCase()
              },
              streams: "dynamic",
              chunkSize: "dynamic",
              allowWebWorkers: true // If you see issues with uploads, change this to false
            },
            false
          );

          self.setState({
            uploading: uploadInstance, // Keep track of this instance to use below
            inProgress: true // Show the progress bar now
          });

          // These are the event functions, don't need most of them, it shows where we are in the process
          uploadInstance.on("start", function() {
            console.log("Starting");
            self.setState({ fileStatus: `uploading ${file.name}` });
          });

          uploadInstance.on("end", function(error, fileObj) {
            self.setState({ fileStatus: `Finished uploading ${fileObj.name}` });
          });

          uploadInstance.on("uploaded", function(error, fileObj) {
            console.log("uploaded: ", fileObj);
            count += 1;
            if (count == filesArr.length) {
              self.refs["fileinput"].value = "";
              Bert.alert(`${count} file(s) uploaded successfully`, "success");
            }

            self.setState({
              uploading: [],
              progress: 0,
              inProgress: false,
              fileStatus: ""
            });
          });

          uploadInstance.on("error", function(error, fileObj) {
            console.log("Error during upload: " + error);
          });

          uploadInstance.on("progress", function(progress, fileObj) {
            console.log("Upload Percentage: " + progress);
            // Update our progress bar
            self.setState({
              progress: progress
            });
          });

          uploadInstance.start(); // Must manually start the upload
        }
      }
    }
  }

  showUploads() {
    if (!_.isEmpty(this.state.uploading)) {
      return (
        <div>
          {this.state.uploading.file.name}

          <div className="progress progress-bar-default">
            <div
              style={{ width: this.state.progress + "%" }}
              aria-valuemax="100"
              aria-valuemin="0"
              aria-valuenow={this.state.progress || 0}
              role="progressbar"
              className="progress-bar"
            >
              <span className="sr-only">
                {this.state.progress}% Complete (success)
              </span>
              <span>{this.state.progress}%</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  }

  render() {
    const { staff } = this.props;
    return (
      <StyledAddDocuments>
        <Row>
          <Col md={4} mdOffset={2}>
            <TextField
              placeholder="Staff personal number"
              name="staffId"
              value={this.state.staffId}
              onChange={this.onChange}
              onKeyDown={this.search}
            />

            <Button
              bsSize="small"
              bsStyle="success"
              onClick={this.getStaffDetails}
            >
              Get details
            </Button>
          </Col>
        </Row>

        <Row>
          <Col mdOffset={2} md={5}>
            {!_.isEmpty(staff) && this.state.staffId ? (
              <div className="alertDiv">
                <Alert bsStyle="info">
                  <p>
                    Name: {staff.biodata.firstName} {staff.biodata.middleName}{" "}
                    &nbsp;
                    {staff.biodata.surname}
                  </p>

                  <p>Designation: {staff && staff.designation}</p>
                  <p>Salary Scale: {staff && staff.salaryStructure}</p>
                  <p>Staff Type: {staff && StaffType(staff.staffType)}</p>
                </Alert>

                <input
                  type="file"
                  id="fileinput"
                  disabled={this.state.inProgress}
                  multiple
                  ref="fileinput"
                  onChange={this.uploadIt}
                />
                <br />
                <br />
              </div>
            ) : (
              <div>
                <p>No details</p>
              </div>
            )}
            {this.showUploads()}
          </Col>
        </Row>
      </StyledAddDocuments>
    );
  }
}

let staffIdReactive = new ReactiveVar("");

export default (AddStaffDocumentContainer = withTracker(({}) => {
  let subscription;
  if (Meteor.isClient) {
    subscription = Meteor.subscribe(
      "staffmembers.getStaffbyStaffId",
      staffIdReactive.get()
    );
  }

  let query = {
    staffId: staffIdReactive.get() && staffIdReactive.get().toUpperCase()
  };

  return {
    loading: subscription && !subscription.ready(),
    staff: StaffMembers.findOne(query),
    staffIdReactive
  };
})(AddStaffDocuments));

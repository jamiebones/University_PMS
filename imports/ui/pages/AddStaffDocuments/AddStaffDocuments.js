import React from "react";
import { Meteor } from "meteor/meteor";
import Loading from "../../components/Loading/Loading";
import { Alert, Button, Col, Row } from "react-bootstrap";
import { ReactiveVar } from "meteor/reactive-var";
import { withTracker } from "meteor/react-meteor-data";
import { StaffMembers } from "../../../api/StaffMember/StaffMemberClass";
import TextField from "../../components/Common/TextFieldGroup";
import { Bert } from "meteor/themeteorchef:bert";
import styled from "styled-components";
import { _ } from "meteor/underscore";
import { StaffType } from "../../../modules/utilities";
import autoBind from "react-autobind";
const Jimp = require("jimp");

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
      submitted: false,
      staff: {},
      documents: []
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

  removeImage(e, index) {
    let documents = this.state.documents;
    let remainDocuments = documents.filter((doc, ind) => {
      return ind !== index;
    });
    this.setState({ documents: remainDocuments });
  }

  getStaffDetails(e) {
    if (this.state.staffId === "") {
      return;
    }
    const staffId = this.state.staffId;
    this.props.staffIdReactive.set(staffId);
  }

  saveImageDisplay(image) {
    const documents = this.state.documents;
    this.setState({ documents: [...documents, image] });
  }

  saveDocuments() {
    const { documents, staffId } = this.state;
    const documentArray = {
      staffId,
      documents
    };
    this.setState({ submitted: !this.state.submitted });
    Meteor.call(
      "staffDocument.saveDocuments",
      documentArray,
      (error, response) => {
        if (error) {
          this.setState({ submitted: !this.state.submitted });
          Bert.alert(`There was an error: ${error}`, "danger");
          document.getElementById("input").value = "";
        } else {
          Bert.alert(response, "success");
          this.setState({ submitted: !this.state.submitted, documents: [] });
          document.getElementById("input").value = "";
        }
      }
    );
  }

  handleFileSelect(e, callback) {
    if (!e.target.files || !window.FileReader) return;
    let files = e.target.files;
    //loop through and confirm if we have a file
    //type png
    let filesArr = Array.prototype.slice.call(files);
    for (let i = 0; i < filesArr.length; i++) {
      const file = filesArr[i];
      const fileExtention = file.name.split(".").pop();
      if (["png", "jpeg"].includes(fileExtention)) {
        let reader = new FileReader();
        reader.onload = function(e) {
          //where the image is displayed
          callback(e.target.result);
        };
        reader.readAsDataURL(file);
      }else{
        alert('please select only PNG files');
        break;
      }
    }
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
                  id="input"
                  multiple
                  type="file"
                  onChange={e =>
                    this.handleFileSelect(e, this.saveImageDisplay)
                  }
                />
                <br />
                <br />
              </div>
            ) : (
              <div>
                <p>No details</p>
              </div>
            )}
          </Col>
        </Row>

        <Row>
          <Col md={12}>
            {this.state.documents &&
              this.state.documents.map((document, index) => (
                <Col md={3} key={index}>
                  <img
                    src={document}
                    className="img img-responsive"
                    onClick={e => this.removeImage(e, index)}
                  />
                </Col>
              ))}
          </Col>
        </Row>

        <Row>
          <Col md={12}>
            {this.state.documents && this.state.documents.length ? (
              <div>
                <p>
                  Document(s) selected: <b>{this.state.documents.length}</b>
                </p>
                <Button
                  bsSize="small"
                  bsStyle="success"
                  onClick={this.saveDocuments}
                  disabled={this.state.submitted}
                >
                  {this.state.submitted
                    ? "saving documents......"
                    : "Save Documents"}
                </Button>
              </div>
            ) : (
              ""
            )}
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
    staffId: new RegExp("^" + staffIdReactive.get() + "$", "i")
  };

  return {
    loading: subscription && !subscription.ready(),
    staff: StaffMembers.findOne(query),
    staffIdReactive
  };
})(AddStaffDocuments));

/*eslint-disable*/
import React from "react";
import { Meteor } from "meteor/meteor";
import { Alert, Button, Col, Row } from "react-bootstrap";
import { ReactiveVar } from "meteor/reactive-var";
import { withTracker } from "meteor/react-meteor-data";
import { StaffMembers } from "../../../api/StaffMember/StaffMemberClass";
import TextField from "../../components/Common/TextFieldGroup";
import styled from "styled-components";
import { _ } from "meteor/underscore";
import { StaffType, StaffDocumentsTypes } from "../../../modules/utilities";
import autoBind from "react-autobind";
import AddDocument from "../../components/AddDocument/AddDocument";

const StyledAddDocuments = styled.div`
  margin-top: 50px;
  .alertDiv {
    margin-top: 20px;
    p {
      font-style: italic;
      color: #000;
      span {
        letter-spacing: 2px;
        margin-left: 5px;
      }
    }
  }
  .documentDiv {
    margin-top: 40px;
  }
`;

class AddStaffDocuments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      staffId: "",
      staff: {},
      meta: {},
      documentType: ""
    };
    autoBind(this);
  }

  componentDidMount() {
    this.props.staffIdReactive.set("");
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

  handleChange(e) {
    const value = e.target.value;
    if (value == "select") return;
    this.setState({ documentType: value });
  }

  render() {
    const { staff } = this.props;
    const { staffId } = this.state;
    return (
      <StyledAddDocuments>
        <Row>
          <Col md={4} mdOffset={4}>
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
          <Col md={12}>
            <Col mdOffset={4} md={4}>
              {!_.isEmpty(staff) && staffId ? (
                <div className="alertDiv">
                  <Alert bsStyle="info">
                    <p>
                      Name:{" "}
                      <span>
                        {staff.biodata.firstName} {staff.biodata.middleName}{" "}
                        &nbsp;
                        {staff.biodata.surname}
                      </span>
                    </p>

                    <p>
                      Designation: <span>{staff && staff.designation}</span>
                    </p>
                    <p>
                      Salary Scale:{" "}
                      <span>{staff && staff.salaryStructure}</span>
                    </p>
                    <p>
                      Staff Type:{" "}
                      <span>{staff && StaffType(staff.staffType)}</span>
                    </p>
                  </Alert>

                  <select className="form-control" onChange={this.handleChange}>
                    <option value="select">select document type</option>
                    {StaffDocumentsTypes().map(({ text, value }, index) => {
                      return (
                        <option key={index} value={value}>
                          {text}
                        </option>
                      );
                    })}
                  </select>
                  {this.state.documentType && (
                    <div className="documentDiv">
                      <p className="text-lead">
                        selected document type:{" "}
                        {this.state.documentType.toUpperCase()}
                      </p>
                      <AddDocument
                        meta={{
                          staffId: staffId,
                          type: "1",
                          userId: Meteor.userId(),
                          documentType: this.state.documentType
                        }}
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <p>No details</p>
                </div>
              )}
            </Col>
          </Col>
        </Row>
      </StyledAddDocuments>
    );
  }
}

let staffIdReactive = new ReactiveVar("");

export default AddStaffDocumentContainer = withTracker(({}) => {
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
})(AddStaffDocuments);

import React from "react";
import { Meteor } from "meteor/meteor";
import { Alert, Button, Col, Row } from "react-bootstrap";
import { ReactiveVar } from "meteor/reactive-var";
import { withTracker } from "meteor/react-meteor-data";
import { StaffMembers } from "../../../api/StaffMember/StaffMemberClass";
import TextField from "../../components/Common/TextFieldGroup";
import styled from "styled-components";
import { _ } from "meteor/underscore";
import { StaffType } from "../../../modules/utilities";
import autoBind from "react-autobind";
import AddDocument from "../../components/AddDocument/AddDocument";

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
      meta: {}
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

  render() {
    const { staff } = this.props;
    const { staffId } = this.state;
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
            {!_.isEmpty(staff) && staffId ? (
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

                <AddDocument
                  meta={{
                    staffId: staffId,
                    type: "1",
                    userId: Meteor.userId()
                  }}
                />
              </div>
            ) : (
              <div>
                <p>No details</p>
              </div>
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
    staffId: staffIdReactive.get() && staffIdReactive.get().toUpperCase()
  };

  return {
    loading: subscription && !subscription.ready(),
    staff: StaffMembers.findOne(query),
    staffIdReactive
  };
})(AddStaffDocuments));

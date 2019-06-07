import React from "react";
import { Meteor } from "meteor/meteor";
import { Alert, Col, Row } from "react-bootstrap";
import { ReactiveVar } from "meteor/reactive-var";
import { withTracker } from "meteor/react-meteor-data";
import { StaffMembers } from "../../../api/StaffMember/StaffMemberClass";
import { Designations } from "../../../api/Designation/DesignationClass";
import TextField from "../../components/Common/TextFieldGroup";
import styled from "styled-components";
import { _ } from "meteor/underscore";
import autoBind from "react-autobind";
import StaffInDesignation from "../../components/StaffInDesignation/StaffInDesignation";

import { GetDetailsBasedOnRole } from "../../../modules/utilities";

const StaffReliefPostingStyle = styled.div`
  .alertDiv {
    margin-top: 20px;
    p {
      font-style: italic;
      color: #000;
    }
  }
  .StaffReliefPostingDiv {
    margin-top: 30px;
  }
  .destDiv {
    margin-top: 40px;
  }
`;

class StaffReliefPosting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      staffId: "",
      submitted: false,
      designation: "0"
    };
    autoBind(this);
  }

  componentDidMount() {
    this.props.staffIdReactive.set("");
    this.props.designationReactive.set("");
    this.props.staffReactive.set({});
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
    this.props.staffIdReactive.set(e.target.value);
    this.props.designationReactive.set("");
  }

  onSubmit(e) {
    if (this.state.staffId !== "" && e.keyCode == 13) {
      this.props.staffIdReactive.set(e.target.value);
      this.props.designationReactive.set("");
    }
  }

  onSelectChange(e) {
    this.setState({ designation: e.target.value });
    this.props.designationReactive.set(e.target.value);
  }

  render() {
    const { designations, staff, staffMembers } = this.props;
    return (
      <StaffReliefPostingStyle>
        <Row>
          <Col md={6}>
            <p>Get staff to relieve by P/F number</p>
            <TextField
              name="staffId"
              placeholder="search by staffId"
              value={this.state.staffId}
              onChange={this.onChange}
              onKeyDown={this.onSubmit}
            />
          </Col>
        </Row>

        {staff && !_.isEmpty(staff) ? (
          <Row className="StaffReliefPostingDiv">
            <Col md={12}>
              <Row>
                <Col md={6}>
                  <p>
                    Name: {staff.biodata.firstName} {staff.biodata.middleName}{" "}
                    {staff.biodata.surname}
                  </p>

                  <p>Designation : {staff.designation}</p>

                  <p>Salary Structure : {staff.salaryStructure}</p>

                  <select
                    className="form-control"
                    value={this.state.designation}
                    onChange={this.onSelectChange}
                  >
                    <option value="0">select designation</option>
                    {designations &&
                      designations.map(({ rank }) => {
                        return (
                          <option value={rank} key={rank}>
                            {rank}
                          </option>
                        );
                      })}
                  </select>
                </Col>
              </Row>
              {staffMembers && staffMembers.length ? (
                <div className="destDiv">
                  <StaffInDesignation
                    staffMember={staffMembers}
                    staff={staff}
                  />
                </div>
              ) : (
                <div className="destDiv">
                  <Alert bsStyle="info">
                    <p>No staff data for selected cadre</p>
                  </Alert>
                </div>
              )}
            </Col>
          </Row>
        ) : (
          <Row>
            <Col md={6}>
              <div className="destDiv">
                <Alert bsStyle="info">
                  <p>No data</p>
                </Alert>
              </div>
            </Col>
          </Row>
        )}
      </StaffReliefPostingStyle>
    );
  }
}

let staffIdReactive = new ReactiveVar("");
let designationReactive = new ReactiveVar("");
let staffReactive = new ReactiveVar({});
let query = {
  staffId: "",
  designation: ""
};

export default (StaffReliefPostingContainer = withTracker(props => {
  let subscription;
  let staff;
  let availableStaff;
  if (Meteor.isClient) {
    subscription = Meteor.subscribe(
      "staffmembers.getStaffbyDesignationAndStaffId",
      designationReactive.get(),
      staffIdReactive.get()
    );
  }

  //check if the person is in sats or jse
  if (subscription && subscription.ready()) {
    if (GetDetailsBasedOnRole("SATS", "Personnel")) {
      query.staffClass = "Senior Staff";
    }

    if (GetDetailsBasedOnRole("JSE", "Personnel")) {
      query.staffClass = "Junior Staff";
    }

    if (staffIdReactive.get() !== "") {
      query.staffId = staffIdReactive
        .get()
        .trim()
        .toUpperCase();
      delete query.designation;
    }

    if (designationReactive.get() !== "") {
      query.designation = designationReactive.get();

      delete query.staffId;
    }

    const staffMembers = StaffMembers.find(query).fetch();

    if (staffIdReactive.get() != "") {
      //we have an id we just subract
      const staffId = staffIdReactive.get();
      if (!_.isEmpty(staffMembers)) {
        staff = staffMembers.find(
          staff => staff.staffId.toUpperCase() == staffId.toUpperCase()
        );
        //check for staff here
        if (!_.isEmpty(staff)) {
          staffReactive.set(staff);
        }
      }

      //remove the staff seeking for relief
      availableStaff = staffMembers.filter(
        staff => staff.staffId.toUpperCase() != staffId.toUpperCase()
      );
    }
  }

  console.log(designationReactive.get());

  return {
    loading: subscription && !subscription.ready(),
    staff: staffReactive.get(),
    staffMembers: availableStaff,
    staffIdReactive,
    designationReactive,
    designations: Designations.find({}, { sort: { rank: 1 } }).fetch()
  };
})(StaffReliefPosting));
